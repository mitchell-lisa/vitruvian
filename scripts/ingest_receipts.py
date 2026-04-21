#!/usr/bin/env python3
"""
ingest_receipts.py

Pulls unread receipt/invoice emails from mitchell.lisa@modulor.bio, extracts
vendor/amount/date via Claude Haiku, appends rows to private/ledger.csv, and
marks the email as read.

Run: python scripts/ingest_receipts.py
"""

import os
import sys
import csv
import json
import base64
import pathlib
from datetime import datetime, timezone

from anthropic import Anthropic
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from dotenv import load_dotenv

REPO_ROOT = pathlib.Path(__file__).parent.parent
load_dotenv(REPO_ROOT / ".env.local")

CREDS_PATH = REPO_ROOT / "private" / "google-credentials.json"
TOKEN_PATH = REPO_ROOT / "private" / "google-token.json"
LEDGER_PATH = REPO_ROOT / "private" / "ledger.csv"

SCOPES = [
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/gmail.modify",
]

SEARCH_QUERY = (
    'is:unread ('
    'subject:(receipt OR invoice OR "payment confirmation" OR "order confirmation" OR "your receipt") '
    'OR from:(stripe.com OR vercel.com OR anthropic.com OR stable.ai OR '
    'apple.com OR google.com OR ramp.com OR mercury.com OR amazon.com OR '
    'godaddy.com OR namecheap.com OR openai.com)'
    ')'
)

EXTRACTION_PROMPT = """You are a bookkeeper for Modulor, Inc. (Delaware C-corp, seed-stage hardware+AI startup).

Extract financial transaction data from the email below.

Return ONLY valid JSON (no markdown, no preamble) matching this schema:
{
  "is_transaction": true | false,
  "date": "YYYY-MM-DD",
  "vendor": "company name (short, e.g. 'Stripe Atlas', 'Vercel', 'Anthropic')",
  "amount": 0.00,
  "category": "Formation | Software | Domain | Legal | Banking | API | Travel | Office | Marketing | Other",
  "description": "short human description",
  "confidence": "high | medium | low"
}

Rules:
- If NOT a real charge (promo, auth code, newsletter, failed payment), return {"is_transaction": false}.
- Use the transaction date, not email date.
- Amount is positive USD. Strip currency symbols.
- "Formation" = incorporation/legal-entity costs (Atlas, registered agent, franchise tax, Stable virtual address).
- "API" = Anthropic, OpenAI, other LLM APIs.
- "Software" = SaaS (Vercel, Google Workspace, QuickBooks, etc.).

EMAIL:
"""


def get_gmail_service():
    creds = None
    if TOKEN_PATH.exists():
        creds = Credentials.from_authorized_user_file(str(TOKEN_PATH), SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(str(CREDS_PATH), SCOPES)
            creds = flow.run_local_server(port=0)
        TOKEN_PATH.write_text(creds.to_json())
    return build("gmail", "v1", credentials=creds)


def get_email_body(msg):
    def walk(part):
        if part.get("mimeType") == "text/plain":
            data = part.get("body", {}).get("data")
            if data:
                return base64.urlsafe_b64decode(data).decode("utf-8", errors="ignore")
        for sub in part.get("parts", []):
            found = walk(sub)
            if found:
                return found
        return ""

    body = walk(msg["payload"])
    if not body:
        body = msg.get("snippet", "")
    return body[:8000]


def extract_transaction(client, body, subject, sender):
    ctx = f"Subject: {subject}\nFrom: {sender}\n\n{body}"
    resp = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=512,
        messages=[{"role": "user", "content": EXTRACTION_PROMPT + ctx}],
    )
    text = resp.content[0].text.strip()
    if text.startswith("```"):
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]
        text = text.strip()
    return json.loads(text)


def ensure_ledger():
    if not LEDGER_PATH.exists():
        with LEDGER_PATH.open("w", newline="") as f:
            csv.writer(f).writerow(
                ["date", "vendor", "amount", "category", "description", "source", "email_id", "ingested_at"]
            )


def already_ingested(email_id):
    if not LEDGER_PATH.exists():
        return False
    with LEDGER_PATH.open() as f:
        return any(email_id in line for line in f)


def append_row(row):
    with LEDGER_PATH.open("a", newline="") as f:
        csv.writer(f).writerow(row)


def mark_read(service, msg_id):
    service.users().messages().modify(
        userId="me", id=msg_id, body={"removeLabelIds": ["UNREAD"]}
    ).execute()


def main():
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        sys.exit("ERROR: ANTHROPIC_API_KEY not set. Add to .env.local in repo root.")

    ensure_ledger()
    anthropic = Anthropic(api_key=api_key)
    gmail = get_gmail_service()

    results = gmail.users().messages().list(userId="me", q=SEARCH_QUERY, maxResults=50).execute()
    messages = results.get("messages", [])

    if not messages:
        print("No new receipts.")
        return

    print(f"Found {len(messages)} candidate emails.")
    added = skipped_dup = skipped_nontx = errors = 0

    for m in messages:
        if already_ingested(m["id"]):
            skipped_dup += 1
            continue

        msg = gmail.users().messages().get(userId="me", id=m["id"], format="full").execute()
        headers = {h["name"]: h["value"] for h in msg["payload"]["headers"]}
        subject = headers.get("Subject", "(no subject)")
        sender = headers.get("From", "")

        try:
            tx = extract_transaction(anthropic, get_email_body(msg), subject, sender)
        except Exception as e:
            errors += 1
            print(f"  ✗ {subject[:60]} — {e}")
            continue

        if not tx.get("is_transaction"):
            skipped_nontx += 1
            mark_read(gmail, m["id"])
            continue

        append_row([
            tx.get("date", ""),
            tx.get("vendor", ""),
            f'{float(tx.get("amount", 0)):.2f}',
            tx.get("category", "Other"),
            tx.get("description", ""),
            "gmail",
            m["id"],
            datetime.now(timezone.utc).isoformat(timespec="seconds"),
        ])
        mark_read(gmail, m["id"])
        added += 1
        print(f"  + {tx['vendor']:<20} ${float(tx['amount']):>9.2f}  {tx.get('description', '')[:50]}")

    print(f"\n{added} added · {skipped_dup} dup · {skipped_nontx} non-tx · {errors} errors")


if __name__ == "__main__":
    main()
