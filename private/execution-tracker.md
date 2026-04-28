# Modulor — Execution Tracker

Single source of truth for who's on paper vs. who's not. Cross-reference with `company-formation.md` (terms) and `CLAUDE.md` state snapshot (narrative).

**Last updated:** Apr 28, 2026 *(Mitchell 83(b) filed by Atlas — postmark Apr 28, USPS tracking confirmed)*

## Cap table platform decision

| Platform | Pricing early-stage | Accepts Atlas entity | VC familiarity | Status |
|---|---|---|---|---|
| **Pulley** | Free <25 stakeholders | ✅ Yes | Medium (rising) | **Lean here Apr 24** — investigate RSPA flow capability |
| **Carta** | Free tier then $$$ | ✅ Yes (Atlas auto-onboards) | ✅ Standard | Fallback if Pulley lacks RSPA flow |
| **AngelList Stack** | Free | ✅ Yes | Low (newer) | Skip unless strong reason |
| **Clerky** | N/A | ❌ No | Medium | **Dead path** — won't onboard Atlas entities |

---

## Cap table execution status

| Holder | Role | Equity | Memo | Legal instrument | Grant date | 83(b) deadline | 83(b) filed | Stamped copy |
|---|---|---|---|---|---|---|---|---|
| Mitchell Lisa | CEO · Director | 88% common (→83% post-Luke RSPA) | n/a | ✅ RSPA (Atlas) | Apr 20, 2026 | **May 20, 2026** | ✅ Filed Apr 28, 2026 — USPS tracking `9207190235890900003893​8966` | ⏳ Download from Atlas Documents tab → `private/formation-docs/` |
| Matthew Lucas Lisa ("Luke") | Co-Founder · CTO | 5% common (RSPA from Mitchell) | ✅ Verbal accept Apr 21 | ❌ Pending — outside counsel + Colonel signature | TBD (Wed Apr 29 earliest) | Grant + 30 days | — | — |
| Adam H. Evans | Strategic Advisor — DoD + Mil-Tech | 1% common options (FAST Platinum) | ✅ Verbal accept Apr 22 | ❌ Pending — FAST Platinum template + mutual NDA first | TBD (target week of May 4) | n/a (options) | n/a | n/a |
| ~~Andrew Lisa~~ | ~~Co-Founder · CFO~~ | ~~5% common (RSPA from Mitchell)~~ | ✅ Verbal accept Apr 21 → ❌ Verbal withdraw Apr 25 | **TERMINATED — no paper executed** (`private/andrew-exit-2026-04-25.md`) | — | — | — | — |

### Mechanism notes

- **Luke RSPA = founder-to-founder transfer.** Company repurchases 500K shares from Mitchell at par ($5 — half of the original two-grant plan), reissues as one 500K RSPA to Luke with vesting. Preserves Mitchell's QSBS on remaining 8.3M (clock from Apr 20, 2026). Luke gets a fresh QSBS clock from grant date. *(Original mechanism contemplated a 1M-share repurchase reissued as two 500K RSPAs to Luke + Andrew; revised Apr 25 after Andrew stepped out — see `private/andrew-exit-2026-04-25.md`. Mitchell's post-grant ownership: 83% instead of the previously planned 78%.)*
- **No self-serve path exists at Atlas or Clerky.** Atlas self-serve is single-founder-at-formation only. **Clerky won't onboard Atlas-formed entities** (they only manage equity for companies they incorporated). **Pulley DOES accept Atlas-formed entities** — worth investigating whether their RSPA flow handles post-formation founder-to-founder transfers with QSBS preservation. Outside counsel is the safe default. Ranked options (Apr 24):
  1. ~~Richard Xie / KAS portfolio counsel~~ — **dead path**. Apr 24: KAS is hands-off, no portfolio counsel referrals.
  2. ~~Dad's lawyer (Kirk Pavoni, D'Elia Law Firm LLC)~~ — **email sent Apr 24 asking for referral to corporate counsel in his network.** Awaiting reply.
  3. **Pulley — investigate Apr 25–27.** Question to Pulley sales: *"Does your RSPA flow handle post-formation founder-to-founder transfer with QSBS preservation on remaining founder shares?"* If yes, Pulley may replace outside counsel for this transaction.
  4. **Atlas Plus ($500/yr) → partner firm** (Cooley / Orrick / Gunderson), $2–5K, 1–2 week turnaround. **Execute Monday Apr 27 AM** regardless — either primary counsel path or second-opinion review on Pulley templates.
  5. **Direct outside startup counsel** — Lowenstein Sandler (NJ-local) or Founders Legal (remote, fixed-fee) — $1.5–3K. Fallback if Atlas Plus partners decline or quote above budget.
  6. **NOT recommended: DIY from Cooley GO / Orrick Total Access forms** — cheap to get right with counsel, expensive to fix later (QSBS + 83(b) + securities compliance).
- **Adam = options from the 12% pool.** No 83(b). Strike = FMV at grant; pre-409A the board documents a good-faith determination at par or de minimis. Re-up with 409A before first priced round.

### Luke's legal name (for all paper)

**Matthew Lucas Lisa** (per Luke's text, Apr 24 2026). Use on RSPA, 83(b), stock cert, board consents. "Luke" is first-name-as-known for day-to-day.

---

## NDA counterparties

| Party | Purpose | NDA type | Status |
|---|---|---|---|
| Anyone hitting `/pitch` | Deck preview | Click-wrap (one-way) | ✅ Live, Supabase-logged |
| Adam Evans | Advisor — pre-hardware/IP disclosure | Mutual | 🟡 Drafted Apr 28 (`build/drive-upload/07_Legal/Adam-Evans-Mutual-NDA.{md,docx,pdf}` — source: `scripts/legal_sources/adam_evans_mutual_nda.py`); upload PDF to DocuSign and send to Adam |
| Design/CNC/prototyping vendors (TBD) | Contractor engagements | Mutual | ❌ Template needed |
| Investor diligence 1:1 (Richard Xie + beyond) | Term-sheet-stage diligence | Mutual | ❌ Send when requested |

---

## Investor agreements

| Counterparty | Instrument | Valuation cap | Discount | Status |
|---|---|---|---|---|
| KAS — Richard Xie | YC post-money SAFE (planned) | TBD | TBD | ❌ No terms yet; meeting in May |

---

## Deadlines (T-minus from today Apr 28, 2026)

| Event | Date | T-minus | Reminder cadence |
|---|---|---|---|
| ~~Atlas postmark Mitchell 83(b)~~ | ~~May 4, 2026~~ | ✅ Done | Filed Apr 28, postmarked same day |
| ~~Mitchell 83(b) window hard close~~ | ~~May 20, 2026~~ | ✅ Done | Mitchell 83(b) filed inside window |
| Luke mil-side Colonel signature (target) | Apr 29, 2026 | T-1 | Daily |
| Luke RSPA executed (target) | Apr 29–30, 2026 | T-1–2 | Daily |
| Luke 83(b) window | Grant + 30 days | Set once grant issues | T-14, T-7, T-1 |
| Adam mutual NDA sent (DocuSign) | Apr 28, 2026 | T-0 | Send today |
| Adam FAST Platinum (counsel-reviewed) | Week of May 4 | T-6 | Weekly |
| Delaware franchise tax (first filing) | Mar 1, 2027 | T-307 | Monthly starting Oct 2026 |
| VITR-001 non-provisional conversion | Apr 15, 2027 | T-352 | Monthly starting Jan 2027 |

---

## Update discipline

Every time a box flips from ❌ to ✅ — update this table, commit with a one-line message, and update the matching entry in `CLAUDE.md` state snapshot. Don't let drift accumulate.
