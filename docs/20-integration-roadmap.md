# 20. INTEGRATION ROADMAP

The data is worthless if it stays on our device. Every integration is a distribution lever.

## The principle

We do not build our own AMS. We do not build our own programming app. We do not build our own wearable platform. **We are the measurement layer.** Every existing platform in the performance stack is a pipe we can feed.

| If we own | We become |
|-----------|-----------|
| The hardware + the measurement | A sensor vendor (low multiple) |
| The hardware + the measurement + the distribution API | Infrastructure (high multiple) |

The integration layer is what turns the hardware into infrastructure.

## Tier 1 — ship at V1 (pilot must-haves)

These exist on day-1 of the first pilot. A team saying "we use Smartabase" cannot be a reason we lose the deal.

| Target | Why | Integration type | Eng lift |
|--------|-----|-------------------|----------|
| **Smartabase** (Fusion Sport) | #1 AMS in pro + elite college | REST webhook — session JSON → athlete profile | 1 wk |
| **Kitman Labs** | #2 AMS — EPL, NFL, MLS footprint | REST API — writes to performance module | 1 wk |
| **TeamBuildr** | #1 strength programming tool — college S&C standard | CSV + API — workout completion + ROM flag | 3–5 days |
| **Train Heroic** | #1 coach-programmed delivery app — tactical + CrossFit | REST API — mobility check as pre-workout gate | 1 wk |
| **CSV export** | Universal fallback | Download every session record | Day 1 |

Deliverable: A team using any of the above can import Modulor data within 15 minutes of a session ending. No copy-paste. No manual export.

## Tier 2 — ship within 6 months (expand the wedge)

These unlock specific buyer categories. Each is a conditional go-to-market unlock.

| Target | Unlocks | Integration type | Trigger |
|--------|---------|-------------------|---------|
| **Catapult** (GPS / IMU) | Workload-to-MSK risk correlation | Bi-directional API — pair training load with next-day ROM | 1st pro team pilot |
| **Polar Team Pro** | Collegiate-tier workload | OAuth + REST | 1st college pilot |
| **Hudl / Teamworks** | Roster + schedule sync | REST | 1st Power 5 program |
| **Epic / Cerner EHR** | Medical / RTD documentation | HL7 FHIR | 1st medical buyer (D1 / pro) |
| **CoachMePlus** | Scheduling + profiling | REST | Requested by any 2+ pilots |

## Tier 3 — ship at scale (infrastructure plays)

These require data volume to matter. Target: year 2 onward.

| Target | Why | Gate |
|--------|-----|------|
| **Apple HealthKit** | Athlete-owned longitudinal data, consumer arm of sport | 10K athletes in corpus |
| **Garmin / Whoop / Oura** | Daily readiness baselines — fuse with our session ROM | 5K athletes |
| **MHS GENESIS** (DoD EHR) | Military-wide deployment | AFWERX Phase II award |
| **Insurance carrier APIs** (WC primary) | Risk signal licensing | 25K athlete-months of data |
| **Vendor marketplaces** (Hyperice HyperSmart, Therabody+) | Distribution embed | Strategic LOI in hand |

## How integrations should be scoped

One rule: **never do bespoke work for a single customer.** If a team asks for a custom ETL pipe to their in-house data warehouse, the answer is "use our REST API" and we write the template once.

| Pattern | Build as | Reusable? |
|---------|----------|-----------|
| Team's AMS (any of 5 below top) | Named connector, full support | Yes, every customer |
| Team's in-house data warehouse | Documented REST API + webhook | Yes, any customer |
| Team's custom Slack alert | Zapier / Make template | Yes, any customer |
| Team's proprietary clinical EHR | HL7 FHIR standard endpoint | Yes, any DoD / hospital |
| "We want this specific dashboard" | Template, not custom code | Push back — link to UI studio |

## The API itself

A minimum-lovable API. Document it by month 3.

| Endpoint | Purpose |
|----------|---------|
| `POST /athletes` | Create / sync athlete profile |
| `GET /athletes/{id}/sessions` | Session history |
| `POST /sessions` | Externally-initiated session (optional) |
| `GET /sessions/{id}` | Full session record (ROM, force, asymmetry, compensation, flags) |
| `GET /sessions/{id}/report.pdf` | Human-readable summary |
| `POST /webhooks/session-complete` | Real-time push to subscribed URLs |
| `GET /risk/{athlete_id}` | Latest risk score + drivers |

Every AMS / strength-app partner subscribes to the same webhook. We build the connectors, but the underlying API is the product.

## The insurance integration — the prize

Insurance carriers do not integrate with point solutions. They license aggregated, anonymized risk signals via data-licensing APIs.

| Signal | What we license |
|--------|-----------------|
| Per-athlete risk score | Monthly, per-insured |
| Population-level MSK prevalence | Quarterly, by sport / unit / role |
| Return-to-duty ROM benchmarks | Peer-reviewed references |
| Longitudinal asymmetry trends | Actuarial inputs |

This does not require integration with their claims systems. It is a data feed with signed BAAs and a flat licensing fee. Target: $250K–$1M per carrier per year after year 2.

## Ownership + precedent

| What we own | What partners own |
|--------------|-------------------|
| The session record (raw + derived) | The athlete identity mapping on their side |
| The aggregate corpus (for licensing) | The team's treatment / programming decisions |
| The API contract | Their UI, their workflow |

Every pilot contract includes a data-rights clause that gives us perpetual, de-identified use of session records. Teams get the full stream back into their AMS — we retain the underlying corpus. This is the insurance-licensing precondition. No exceptions.

## The one-sentence strategy

**Ship the 4 integrations a pilot will ask for at install. Document the API publicly. Treat insurance as a data-licensing relationship, not a software integration. Never write bespoke code for one customer.**

## The 90-day integration plan

| Day | Milestone |
|------|-----------|
| 0–15 | Scope v1 connectors: Smartabase, Kitman, TeamBuildr, Train Heroic |
| 15–45 | Ship CSV export + public REST API. Document at /api |
| 45–75 | Ship Smartabase + TeamBuildr connectors (the top 2 by pilot request frequency) |
| 75–90 | Ship Kitman + Train Heroic. Announce API + partners in seed-round materials |

Outcome at day 90: any first pilot can say "yes we use [Smartabase / Kitman / TeamBuildr / Train Heroic]" and the response is "we integrate — already shipped."
