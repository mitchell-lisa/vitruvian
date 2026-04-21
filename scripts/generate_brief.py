#!/usr/bin/env python3
"""
generate_brief.py — daily CEO brief

Reads CLAUDE.md + private state docs, asks Claude for a morning brief,
posts it as a GitHub Issue labeled "brief". GitHub's notification email
delivers it to mitchell.lisa@modulor.bio.

Runs from .github/workflows/daily-brief.yml at 11:00 UTC (7 AM EDT / 6 AM EST).
Also triggerable manually via workflow_dispatch.

Env:
  ANTHROPIC_API_KEY  — Claude API key (GitHub secret)
  GH_TOKEN           — GITHUB_TOKEN (provided by Actions)
  REPO               — owner/repo (provided by Actions)
"""

import json
import os
import pathlib
import sys
import urllib.request
from datetime import datetime
from zoneinfo import ZoneInfo

from anthropic import Anthropic

REPO_ROOT = pathlib.Path(__file__).parent.parent

DOCS = [
    "CLAUDE.md",
    "private/company-formation.md",
    "private/finances.md",
    "private/luke-role-memo.md",
    "private/outreach.md",
]

PROMPT = """You are Modulor Command, Chief of Staff to Mitchell Lisa (CEO, Modulor, Inc.).

Generate today's morning brief. Today's date: {today}.

Use the docs below (CLAUDE.md has your full operating brief). Produce a GitHub Issue body with this structure — no preamble, no closing remarks, just the content:

## Top 3 actions today
Ranked by leverage against priorities 1-5 in CLAUDE.md. For each: **bold the action**, then one sentence on why it's today's move. Pick actions Mitchell can actually complete today.

## Deadlines this week
Anything due in the next 7 days: formation deadlines (83(b), franchise tax, provisional patent conversion clock), scheduled meetings (e.g. Adam Evans call), commitments Mitchell made to others.

## Who's waiting on Mitchell
Based on the Current state snapshot in CLAUDE.md — anyone stalled on his action (Luke countersign, Adam FAST Gold send, Andrew role memo, investor follow-ups). Name the person, name the ask, name how long they've been waiting.

## What's slipping
Items in the state snapshot that have been pending/not-yet for >7 days. Name it, name the consequence of continued delay.

## Burn check
One line: spend-to-date, bank status, next material expense coming up.

Rules:
- Be direct, confident, decisive. No hedging.
- If a section has nothing to report today, write "Nothing." — don't invent work.
- Keep the whole brief under 400 words.
- No fluff at the top or bottom.

DOCS:

{docs}
"""


def load_docs() -> str:
    blocks = []
    for rel in DOCS:
        path = REPO_ROOT / rel
        if path.exists():
            blocks.append(f"=== {rel} ===\n{path.read_text()}")
    return "\n\n".join(blocks)


def generate(client: Anthropic) -> tuple[str, str]:
    today = datetime.now(ZoneInfo("America/New_York")).strftime("%a · %b %d %Y")
    resp = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2048,
        messages=[{"role": "user", "content": PROMPT.format(today=today, docs=load_docs())}],
    )
    return today, resp.content[0].text.strip()


def post_issue(title: str, body: str) -> None:
    repo = os.environ["REPO"]
    token = os.environ["GH_TOKEN"]
    req = urllib.request.Request(
        f"https://api.github.com/repos/{repo}/issues",
        method="POST",
        headers={
            "Authorization": f"Bearer {token}",
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
        },
        data=json.dumps({"title": title, "body": body, "labels": ["brief"]}).encode(),
    )
    with urllib.request.urlopen(req) as r:
        data = json.load(r)
        print(f"Posted issue #{data['number']}: {data['html_url']}")


def main() -> None:
    key = os.environ.get("ANTHROPIC_API_KEY")
    if not key:
        sys.exit("ERROR: ANTHROPIC_API_KEY not set")
    client = Anthropic(api_key=key)
    today, body = generate(client)
    post_issue(f"Brief · {today}", body)


if __name__ == "__main__":
    main()
