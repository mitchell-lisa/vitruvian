# 7. WHAT TO CUT (MVP Scope Control)

These features are tempting but will kill your timeline and budget. Cut them NOW and add them in V2/V3.

## CUT — Do Not Build for V1

| Feature | Why It's Tempting | Why You Cut It |
|---------|-------------------|----------------|
| **Automatic pulley height adjustment** (motorized) | Feels premium | Adds 4 more motors, wiring, and failure modes. A manual pin is fine. Users adjust cable machines manually every day. |
| **Mobile companion app** | Looks professional | Build a simple web dashboard instead. Accessible from any phone browser. No App Store approval needed. |
| **Voice guidance / speaker system** | "Step forward" audio cues feel polished | The touchscreen handles all guidance. A Bluetooth speaker can be added later for $20. Don't integrate audio hardware into V1. |
| **Machine learning model for stretch recommendation** | "AI-powered" sounds good for marketing | A rule-based engine (if/then logic) handles 90% of stretch programming. ML needs data you don't have yet. Collect data with V1, train models for V2. |
| **Multiplayer / partner stretching** | Expands the market | Focus on single-user. The machine is complex enough with one person. |
| **Automatic user identification (face recognition, etc.)** | Seamless login | Privacy concerns + engineering complexity. PIN or NFC phone tap is fine. |
| **Full-body simultaneous stretching** | "Step in and everything stretches at once" | Would need 8+ cables engaged simultaneously with complex coordination. Start with 1-2 cables active per stretch. |
| **Fold-down bench** | Seated stretches | Adds mechanical complexity to the frame. V1 is standing stretches only. Bring a separate bench if needed. |
| **Cloud sync / remote monitoring** | Trainers can watch athlete data remotely | Local storage on the Pi is fine for V1. Add cloud sync later once you validate the core product. |
| **Premium materials / industrial design** | Looks like a real product | 80/20 extrusion with powder coat looks clean enough. Don't spend $10K on sheet metal enclosures until you've proven the concept works. |
| **Warm-up / vibration features** | Recovery products have vibration | Different hardware, different value prop. Stay focused on stretching. |

## KEEP — Non-Negotiable for V1

| Feature | Why It Stays |
|---------|-------------|
| Motorized cable tension | This IS the product. Without it, you're just a stretch cage. |
| Load cell force sensing | Safety-critical. Non-negotiable. |
| Depth camera + pose estimation | Differentiator. Makes it "smart" vs. dumb cables. |
| Touchscreen with guided routines | The user experience. Without it, nobody knows what to do. |
| E-stop and slip clutch safety | Liability and safety. Must have from day one. |
| User profiles with ROM tracking | Core value: personalized, progressive stretching. |
| At least 4 complete stretch routines | Need enough content to run a real 12-minute session. |

## The V1 Mantra

**"Motorized cables, smart guidance, one user, standing stretches, local data."**

Everything else is V2.

---

## Addendum — PNF promoted from V2 cut to V1.5

Date: 2026-04. Revisiting the original "PNF in V2" call.

### Why it was cut

Original reasoning: detecting voluntary contraction vs. reflex requires a hard sensor problem (EMG). Defer to V2.

### Why the reasoning was wrong

The load cell we already ship **is** the contraction sensor. When an athlete performs the contract phase of PNF (pushes into the cable), cable tension spikes sharply above the held setpoint. That signature is unambiguous — it doesn't require EMG. The signal is the same load cell data we're logging anyway, interpreted differently.

| Signal | During stretch | During voluntary contract |
|--------|----------------|---------------------------|
| Cable tension | Held at setpoint ±0.2 lb | Spikes +3–15 lb above setpoint |
| Duration | Continuous | 3–6 second pulse |
| Pattern | Flat | Sharp rise, plateau, release |

A simple rule-based detector (derivative of tension > threshold for >500ms) catches the contract phase. No new hardware. No new sensor. No ML.

### What V1.5 PNF actually requires

| Component | Status |
|-----------|--------|
| Load-cell-based contraction detection | **New — 2 wk firmware work** |
| Contract-relax cue on touchscreen | **New — 3 day UI work** |
| Timed relax-phase tension modulation (hold → +5% → hold) | **New — 1 wk firmware** |
| Protocol library with CR, CRAC, CRS variants | **New — 1 wk content** |
| Safety envelope (contract force cap, guard against spasm) | Use existing safety system |

Total engineering lift: ~5 weeks for one engineer. No BOM change. No hardware change.

### Why this matters now

PNF is the clinically-validated gold standard for ROM gain — ~20% larger per-session ROM delta vs static stretching in most peer-reviewed studies. Shipping V1 without it concedes the clinical conversation to every manual therapist and hands every clinician an easy reason to say "not yet." PNF at V1.5 closes that objection and flips the clinical narrative.

### The new cut line

| Feature | Prior call | New call | Reason for move |
|---------|------------|----------|-----------------|
| PNF automation | V2 | **V1.5** | Load cell already provides the signal; no new hardware; clinical differentiator |
| Automatic pulley height | V1 cut | V2 still | Still a BOM problem |
| ML stretch recommendation | V2 | V2 still | Needs data we don't have yet |
| Cloud sync | V2 | V2 still | Correct call — local-first at V1 |
| Mobile app | V2 | V2 still | Web dashboard still covers it |

### The V1.5 mantra update

**"Motorized cables, smart guidance, PNF automation, one user, standing stretches, local data."**

One word change. Five weeks of engineering. Moves us from "fancy passive stretcher" to "clinical tool." Worth it.
