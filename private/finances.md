# Modulor, Inc. — Finances

Single source of truth for company spend, recurring costs, the $3M seed budget model, and burn projection. **Last updated: Apr 27, 2026.** Spreadsheets live at `build/drive-upload/01_Finances/` (regenerate via `python scripts/build_finance_models.py`).

---

## Snapshot

| Metric | Value | Notes |
|---|---|---|
| Cash on hand | **$0 in company account** | Mercury application submitted Apr 24, awaiting approval |
| Founder Amex outstanding | **$1,088.00** | Reimburse from Modulor account once Mercury opens |
| Monthly burn (pre-funding) | **~$50** | Workspace seat + domain only; everything else is founder-funded one-shots |
| Cash needed before close | **~$3,500** | Trademark filing + counsel retainer + D&O quote (see below) |
| Target raise | **$3,000,000** | YC post-money SAFE, target close Q3 2026 |
| Target runway | **30 months** | $3M / $100K avg monthly burn post-funding |
| Patent deadline | **Apr 15, 2027** | VITR-001 non-provisional conversion — 12-month hard window |

## One-Time Formation Costs (closed)

| Date | Item | Cost | Status | Notes |
|---|---|---|---|---|
| Apr 20, 2026 | Stripe Atlas formation | **$500.00** | ✅ Paid (founder Amex) | Incl. DE incorporation, state filing, EIN sponsorship, Stripe credits, partner discounts |
| Apr 20, 2026 | Stable virtual address (annual) | **$588.00** | ✅ Paid (founder Amex) | 1111B S Governors Ave STE 27384, Dover DE — covers Yr 1; renews Apr 2027 |

**Closed total: $1,088.00** — reimburse to Mitchell from Modulor Mercury once funded.

## One-Time Costs (open / pending)

| Item | Est. cost | Status | Target |
|---|---|---|---|
| USPTO trademark filing — "Modulor" (Classes 9, 10, 41) | $700–1,050 self-file (TEAS Plus) · or $1,500–2,500 w/ counsel | Not filed | Pre-seed close |
| VITR-001 provisional → non-provisional conversion | $5,000–15,000 | Not filed | Hard deadline **Apr 15, 2027** |
| D&O insurance, Year 1 | $1,500–3,000 | Not quoted | **Required before first investor check** |
| Outside counsel retainer (Atlas Plus partner firm — Cooley/Orrick/Gunderson) | $500/yr Atlas Plus + $2,000–5,000 RSPA + 83(b) package | Atlas Plus to upgrade Mon Apr 27 AM | This week |
| Patent assignment Mitchell → Modulor, Inc. | counsel-included or $500 standalone | Drafting | Same package as RSPA |
| Mutual NDA template + execution (Adam first, vendors next) | counsel-included | Drafted Apr 25 | DocuSign send this week |

**Pre-funding cash need: ~$3,500–4,500** to cover trademark + counsel retainer + D&O quote so the round closes clean. Founder Amex carries the rest.

## Annual Recurring Costs

| Item | Cost | Cadence | Notes |
|---|---|---|---|
| Stable virtual business address | $588/yr | Annual | Renews Apr 2027 |
| Delaware franchise tax | ~$400 (minimum filing) | Annual, Mar 1 | First filing **Mar 1, 2027** |
| DE registered agent (Legalinc) | $0 Yr 1, $100/yr Yr 2+ | Annual | Bundled w/ Atlas Yr 1 |
| Google Workspace (per seat) | $7–14/user/mo | Monthly | Mitchell + Luke active; Adam joins post-FAST execution |
| Domain (modulor.bio) | ~$80/yr | Annual | Vercel auto-renew |
| Slack (Pro tier, 2 seats) | ~$17/mo (~$200/yr) | Monthly | Spinning up Apr 27 — was Let Fly account, separate workspace for Modulor |
| Vercel (hosting, hobby tier) | $0 | Monthly | Free tier covers traffic; upgrade to Pro at scale |
| QuickBooks Online | ~$30/mo | Monthly | **Defer** until first invoice or fractional CFO onboards |
| NJ foreign qualification | $125 init + $75/yr | Annual | **Only if Modulor operates from NJ** — defer decision |

**Year-1 baseline (Mitchell + Luke active, no QuickBooks): ~$1,800**
**Year-2+ baseline (3 active seats, registered agent renewal, franchise tax): ~$2,500**

## Seed Raise — $3M Use of Funds (target close Q3 2026)

Allocation per CLAUDE.md priorities. Spreadsheet: `Modulor-Use-of-Funds-Model-v1.xlsx`.

| Category | Amount | % | Drivers |
|---|---|---|---|
| Hardware prototyping | $1,200,000 | 40% | Engineering firm fees (Mo 1–9), 3–5 prototype iterations, BOM, testing rigs, pilot-site hardware |
| Engineering | $900,000 | 30% | FT engineering hire #1 (Mo 6+), contracted firmware/ML work, sensor integration, app dev |
| Go-to-market | $450,000 | 15% | Pilot site outfitting, sales materials, conference presence, first BD hire (Mo 12+) |
| IP / entity / data rights | $300,000 | 10% | Patent non-provisional conversion, trademark, data licensing infrastructure, additional provisionals |
| Legal | $150,000 | 5% | Outside counsel retainer, term-sheet red-lines, board/governance, ongoing IP support |
| **Total** | **$3,000,000** | **100%** | |

Designed to buy **30 months of runway** at ~$100K avg monthly burn.

## Burn Rate Model

Spreadsheet: `Modulor-Burn-Forecast.xlsx`. Two phases:

### Phase 1 — Pre-funding (Apr 2026 → close, target Sep 2026)
- ~$50–100/mo recurring (Workspace + Slack + domain amortized)
- ~$3,500 one-shot expected before close (trademark, counsel, D&O quote)
- Founder-funded; reimburse on Mercury open

### Phase 2 — Post-funding (close → Mo 30, target close Sep 2026 → Mar 2029)
- **Months 1–6 (ramp):** $50–80K/mo as engineering firm engagements stand up + counsel work peaks
- **Months 7–18 (peak build):** $100–130K/mo — prototype iterations + first FT engineering hire + initial pilot site work
- **Months 19–30 (commercialization):** $90–110K/mo — production prep + GTM ramp + ongoing eng support
- **Average:** ~$100K/mo across 30 months

See spreadsheet for monthly detail by category and running cash balance.

## Bank — Mercury

- Application submitted **Apr 24, 2026**
- Brex was the alternative; Mercury chosen for cleaner UI and Atlas integration
- **Status: pending approval.** No tracking yet.
- **Founder reimbursement queued:** $1,088 to Mitchell on first transfer in
- **Access:** Mitchell admin; Luke promoted to admin post-RSPA execution. *(Andrew Bookkeeper invite never sent — he stepped out Apr 25, see `private/andrew-exit-2026-04-25.md`.)*

## QSBS — protect at all costs

- **5-year hold** on founder common starting Apr 20, 2026 = qualifying gain on sale after **Apr 20, 2031**
- Gain exclusion: up to **$10M per founder** (or 10× basis, whichever greater) excluded from federal cap gains
- **Things that can break QSBS:** total gross assets >$50M at issuance, redemptions within 2 years, conversion away from C-corp, certain reorganizations
- Luke's RSPA = fresh QSBS clock from his grant date
- 83(b) elections critical — Mitchell's Atlas-mailed by May 6, hard close May 20

## Tax Calendar

- **Federal Form 1120:** Annual, due Apr 15 (extendable to Oct 15) — first filing **Apr 15, 2027** for FY2026
- **Delaware franchise tax:** Annual, due Mar 1 — first filing **Mar 1, 2027**
- **State filings:** None additional unless we foreign-qualify in NJ

## Expense Policy (interim — formalize at first board meeting)

- All company expenses on Modulor business card once Mercury opens
- Founder reimbursements tracked in `private/ledger.csv`, processed monthly on the 1st
- Single expense >$5,000 requires written founder approval (currently Mitchell)
- Receipt retention: 7 years for IRS audit trail; receipts ingested via `scripts/ingest_receipts.py` (Gmail → ledger pipeline)

## Cadence

**Weekly (Mitchell, Mondays):** Mercury transaction review, code expense to category, update `ledger.csv`.

**Monthly (Mitchell, 1st of month):**
- Reconcile bank vs. ledger
- Update runway projection in burn-forecast spreadsheet
- Categorize in QuickBooks (once active)
- Founder reimbursement run
- DE franchise tax calendar check (starting Oct 2026 for Mar 2027 filing)

**Quarterly:** Budget vs. actuals review, runway recalc against fresh assumptions, brief to advisor (Adam) + investor update.

**Annual:** March 1 franchise tax, April 15 Form 1120, Q4 board to approve next-year budget.

---

## File map

| File | Purpose | Owner |
|---|---|---|
| `private/finances.md` | This narrative — single source of truth | Mitchell |
| `private/ledger.csv` | Transaction-level ledger (gitignored) | Mitchell + `scripts/ingest_receipts.py` |
| `build/drive-upload/01_Finances/Modulor-Finances.docx` | Drive-readable narrative | Auto-built from this file |
| `build/drive-upload/01_Finances/Modulor-Use-of-Funds-Model-v1.xlsx` | $3M allocation × month × category, w/ rollups | Auto-built; edit assumptions in script |
| `build/drive-upload/01_Finances/Modulor-Burn-Forecast.xlsx` | 30-month burn projection w/ running cash + runway | Auto-built; edit assumptions in script |
| `scripts/build_finance_models.py` | Spreadsheet builder | — |
