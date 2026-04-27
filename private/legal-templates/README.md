# Legal template sources

Index of where each standard document comes from. **Downloaded templates themselves go in this folder but are gitignored** (see pattern at bottom). Signed instruments move to `private/formation-docs/` (also gitignored).

---

## RSPA (Luke)

> **Apr 25 2026 update:** Andrew Lisa stepped out of the founding team before any paper executed. The two-grant Luke + Andrew RSPA plan is now a **single-grant Luke RSPA** (500K shares from Mitchell at par). Mitchell's post-grant ownership goes to 83% (was 78% under the two-grant plan). Andrew's row removed below. See `private/andrew-exit-2026-04-25.md`.

**No self-serve platform works here.** Both Atlas and Clerky gate equity management to companies they incorporated. Atlas was the formation vehicle — so Clerky won't onboard us, and Atlas's own RSPA flow is single-founder-at-formation only. The only path is outside counsel.

### Ranked options (Apr 24)

1. ~~Richard Xie / KAS portfolio counsel rec~~ — **dead path.** Confirmed Apr 24: KAS is hands-off, no portfolio counsel referrals.
2. ~~Dad's lawyer (Kirk Pavoni, D'Elia Law Firm LLC)~~ — **dead path.** Confirmed Apr 24: D'Elia is general civil / real estate / commercial litigation / land use / municipal court — South Jersey practice. Not corporate/securities.
3. **Stripe Atlas Plus — active path.** $500/yr unlocks 30–50% partner-firm discount at Cooley, Orrick, Gunderson. Post-formation founder-add runs $2–5K. 1–2 week turnaround. **Execute Monday Apr 27 AM.**
4. **Lowenstein Sandler (Roseland NJ)** — NJ-local startup practice. Only if Atlas Plus partners decline or quote above budget.
5. **Founders Legal (Atlanta, fully remote)** — transparent fixed-fee packages, seed-stage focused. Same condition.
6. **NOT recommended: DIY from Cooley GO (`cooleygo.com/documents`) or Orrick Total Access (`orrick.com/totalaccess`).** Free form libraries exist but equity issuances + vesting + 83(b) + board consents touching founder stock are too consequential for DIY. Cheap to get right with counsel; expensive to fix later.

### Terms to plug into the template

Pulled from `private/luke-role-memo.md`:

- Shares: 500,000 common (Luke only)
- Purchase price: $0.00001 par × 500,000 = **$5.00**
- Vesting: 4-year monthly, 1-year cliff (25% at month 12)
- Acceleration: double-trigger (change of control + involuntary termination w/in 12 months)
- Source: company repurchase from Mitchell (500K shares at $5 par), contemporaneous reissuance to Luke
- 83(b): Luke files own within 30 days of grant date

### Parties

- Luke: **Matthew Lucas Lisa** (legal name per ID)

---

## 83(b) Election

**Source:** IRS fillable PDF (search "83(b) election form" — the 1-pager). Counsel will provide + mailing instructions as part of the RSPA package.

Each recipient mails their own via **USPS Certified Mail** within 30 days of grant. Keep the green card + stamped copy. Save to `private/formation-docs/` when stamped copy returns.

---

## FAST Platinum (Adam advisor agreement)

**Source: Founder Institute — `fi.co/fast` (free).** Pick the Platinum variant (1% equity tier, 2-year monthly vest, no cliff).

### Terms to plug in

Pulled from `private/adam-role-memo.md`:

- 1.0% common-stock options from the 12% pool (100,000 shares)
- 2-year monthly vest, no cliff
- Strike: FMV at grant (pre-409A: board good-faith determination at par / de minimis)
- Acceleration: double-trigger
- Termination: either party 30 days' notice; unvested options cease vesting on termination
- Commitment: ~6–8 hrs/mo

### Sequence

1. Mutual NDA signed first (before hardware/IP specifics)
2. FAST Platinum signed second
3. Board consent granting the options
4. Strike documented in board minutes

---

## Mutual NDA

**Source options (pick one):**

1. **Stripe Atlas — included templates library** (if Atlas Plus) — Delaware-governed, mutual, 2-year term
2. **YC — `ycombinator.com/documents`** (free) — "NDA" template, lawyer-vetted, industry standard

Use for: Adam (pre-FAST), vendor/contractor engagements, any 1:1 investor diligence that graduates past the `/pitch` click-wrap.

---

## SAFE (investor agreement)

**Source: YC — `ycombinator.com/documents` (free).** Use the **post-money SAFE** (2018+ standard). Three variants:

- Valuation cap only
- Discount only
- Valuation cap + discount (most common)

### Decision knobs

- **Cap:** TBD based on market comps + Richard Xie response
- **Discount:** typical 15–25%; skip if cap is priced right
- **MFN clause:** optional; protects early investors if later SAFEs get better terms

**Process:** Outside counsel red-lines every SAFE before Mitchell signs (was Andrew's lane pre-Apr 25 exit; reverted to counsel — Atlas Plus partner firm or Lowenstein/Founders Legal). No SAFE goes out without counsel review first.

---

## Ignored from git

This folder is for downloaded template files (`.docx`, `.pdf`) and filled-in drafts. **Do not commit any template file content to git.** This README is the only tracked file here.

Pattern to add to `.gitignore` (done):
```
private/legal-templates/*.docx
private/legal-templates/*.pdf
private/legal-templates/*.doc
```
