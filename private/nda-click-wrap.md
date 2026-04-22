# Modulor NDA — Click-Wrap Version

**Deployed at:** `modulor.bio/pitch` (gate intercepts before deck renders)
**Backing store:** Supabase project `dndlfrlnpzmxcufzwoxx` · table `nda_signers`
**Entity:** Modulor, Inc. (Delaware C-corporation, formed Apr 20, 2026)
**Governing law:** Delaware
**Term:** 2 years from acceptance (trade secrets indefinite)

---

## Full text

**Non-Disclosure Agreement**

This Agreement is entered into between **Modulor, Inc.**, a Delaware corporation ("Modulor" or the "Disclosing Party"), and the individual or entity identified above ("Recipient"). By accessing this document, Recipient agrees to the following terms:

**1. Confidential Information.** "Confidential Information" means all non-public information disclosed by Modulor through this deck or related materials — including product designs, technical specifications, engineering details, patent claims and filings, market analysis, financial data, team information, pricing, and business strategy — whether marked confidential or not.

**2. Non-Disclosure.** Recipient shall not disclose, publish, or disseminate any Confidential Information to any third party without prior written consent from Modulor, except to Recipient's employees, advisors, or affiliates who have a need to know for evaluation purposes and are bound by confidentiality obligations at least as restrictive as these.

**3. Non-Use.** Recipient shall use Confidential Information solely to evaluate a potential business or investment relationship with Modulor, and for no other purpose.

**4. No Copies or Derivative Works.** Recipient shall not copy, reproduce, screenshot, re-host, or create derivative works from this document or any portion thereof without prior written consent from Modulor.

**5. Exclusions.** Confidential Information does not include information that (a) is or becomes publicly available through no breach by Recipient; (b) was lawfully known to Recipient prior to disclosure by Modulor; (c) is independently developed without reference to Confidential Information; or (d) is received from a third party without a duty of confidentiality.

**6. Return of Materials.** Upon Modulor's written request, Recipient shall return or destroy all copies of Confidential Information in Recipient's possession or control.

**7. Duration.** The obligations in this Agreement remain in effect for two (2) years from the date of acceptance, except that obligations with respect to trade secrets survive indefinitely for as long as the information remains a trade secret under applicable law.

**8. No License; No Obligation.** Nothing in this Agreement grants Recipient any license or rights to any Modulor intellectual property, nor obligates either party to enter into any further agreement, investment, or commercial relationship.

**9. Governing Law.** This Agreement is governed by the laws of the State of Delaware, without regard to conflict-of-law principles. Any dispute arising hereunder shall be resolved in the state or federal courts located in Delaware.

---

## Distribution playbook

**Single link:** `https://modulor.bio/pitch`

Every visitor hits the gate (name / organization / work email / checkbox) before the deck renders. Acceptance is logged to Supabase with timestamp, user agent, referrer, and timezone. Local cache auto-admits the same browser for 7 days.

## Who this is for

- **Angel investors, family offices, strategic partners, smaller VCs, DoD contacts** — will click through. No friction, ~30 seconds.
- **Adam, Luke, Andrew, counsel** — pre-loaded in their browser when they first visit; their signed record lives in Supabase as audit trail.

## Who this is NOT for

- **Tier-1 VCs (Sequoia, a16z, Benchmark, Founders Fund, Khosla, etc.)** have blanket no-NDA policies — even click-wraps. If Mitchell's target list includes any of those, send the public landing (`modulor.bio`) + a brief teaser email; do not send the gated link until a partner explicitly asks for it, and accept that they likely won't sign.

## Stronger version (future)

If/when we engage a lawyer for seed documents, upgrade to a true mutual NDA with both parties bound. The click-wrap above is one-way (Recipient bears obligations) — standard for a founder-side deck gate, but a formal diligence NDA for a later term-sheet stage should be mutual.
