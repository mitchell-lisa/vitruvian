# scripts/

Personal ops tooling for Modulor, Inc. Runs locally on your laptop — nothing deployed.

## ingest_receipts.py

Pulls unread receipt emails from Gmail, asks Claude Haiku to extract `{date, vendor, amount, category, description}`, appends rows to `private/ledger.csv`, marks email as read.

### One-time setup

```bash
# 1. From repo root, create a virtualenv
python3 -m venv .venv
source .venv/bin/activate

# 2. Install dependencies
pip install -r scripts/requirements.txt

# 3. Create .env.local at repo root with your Anthropic API key
#    (get one from https://console.anthropic.com)
echo 'ANTHROPIC_API_KEY=sk-ant-...' > .env.local

# 4. First run — opens browser for Google OAuth, caches token to private/google-token.json
python scripts/ingest_receipts.py
```

### Run anytime

```bash
source .venv/bin/activate
python scripts/ingest_receipts.py
```

### What it does

- Searches Gmail for: unread + `(subject:receipt OR from:known-vendors)`
- For each hit: extracts structured JSON via Claude Haiku (~$0.01 per email)
- Dedupes against `private/ledger.csv` using Gmail `email_id`
- Appends new rows, marks email as read
- Non-transactions (promos, newsletters, auth codes) are skipped + marked read

### Cost

- ~$0.01 per email processed via Haiku
- Expect ~$1–3/month at normal receipt volume

### Schedule it (optional)

Mac cron to run every morning at 7:00:

```bash
crontab -e
# Add:
0 7 * * * cd /home/user/modulor && .venv/bin/python scripts/ingest_receipts.py >> private/ingest.log 2>&1
```

### Files touched

- `private/ledger.csv` — appended to (gitignored)
- `private/google-token.json` — OAuth refresh token, created on first run (gitignored)
- Gmail messages — marked read only, no deletion

### Security

- OAuth credentials in `private/google-credentials.json` (gitignored via `*credentials*.json`)
- Access token in `private/google-token.json` (gitignored via `*token*.json`)
- Anthropic API key in `.env.local` at repo root (gitignored via `.env*`)
- Revoke OAuth at https://myaccount.google.com/permissions anytime
