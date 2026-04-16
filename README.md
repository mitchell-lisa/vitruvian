# Modulor

Cable-driven, instrumented stretching platform for pro and college athletes.
Controlled tension, measured range of motion, bilateral asymmetry on every rep.

> Step in. Get stretched. Get better. Every session, every time.

## Site map

Open `hub.html` for the annotated map. Direct links:

### Public site
- [`index.html`](./index.html) &mdash; marketing landing
- [`pitch.html`](./pitch.html) &mdash; partner / investor deck
- [`hub.html`](./hub.html) &mdash; library hub (everything, annotated)

### For athletes & coaches &mdash; [`briefs/`](./briefs/)
- [`briefs/athlete-brief.html`](./briefs/athlete-brief.html) &mdash; 1-page athlete brief
- [`briefs/coach-brief.html`](./briefs/coach-brief.html) &mdash; 1-page performance-staff brief
- [`feedback.html`](./feedback.html) &mdash; pilot conversation form

### Technology & IP
- [`patent.html`](./patent.html) &mdash; full USPTO provisional (cover sheet, spec, 21 claims, declaration)
- [`drawings.html`](./drawings.html) &mdash; USPTO-compliant drawings sheet (one figure per page)
- [`figures/`](./figures/) &mdash; 11 standalone SVG patent figures

### Product design &mdash; [`docs/`](./docs/)
Nine markdown specs: product definition, MVP, mechanical, sensor/AI, UX flow,
build plan, what-to-cut, what-makes-this-special, redesign notes.

### Founder (private) &mdash; [`private/`](./private/)
- `private/outreach.md` &mdash; personalized outreach messages.
- **Do not deploy `private/` to the public site.** See `private/README.md` for
  ignore patterns per host.

## Before launch
1. File the provisional patent (see `patent.html`).
2. Set the real domain in the briefs and in `feedback.html`.
3. Wire `feedback.html` to a real form handler (Formspree / Basin / own endpoint).
4. Confirm `private/` is excluded from your deploy (`.vercelignore` / `.netlifyignore` / host-specific).
