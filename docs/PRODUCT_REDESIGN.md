# Vitruvian Product Redesign — Elite Sports Performance Platform

---

## A. What Vitruvian Should Be

### Critique of the Current Concept

The current positioning has three core weaknesses:

**1. "Autonomous stretching machine" sounds like a gimmick, not a clinical tool.**
No head of sports performance would buy an "autonomous stretching machine." They'd buy a *controlled assisted-stretch and ROM assessment platform*. The difference is credibility. The current language sounds consumer-tech ("the machine that stretches you") rather than performance-staff ("quantified mobility assessment with progressive assisted-stretch protocols").

**2. The demo implies the machine does everything — that's a red flag.**
Four cables stretching all four limbs simultaneously is not how any credible stretch protocol works. An elite PT or ATC stretches *one joint, one plane, one direction at a time*, with the athlete in a specific stabilized position. Showing a standing figure being pulled in four directions simultaneously reads as a gym gimmick, not a clinical-grade tool.

**3. Missing the language of the buyer.**
The buyer is a Director of Performance, Head AT, or Sports Medicine Director. They think in terms of:
- Bilateral ROM asymmetry thresholds
- Return-to-play screening criteria
- Tissue tolerance and load progression
- Compensation patterns
- Data that feeds their athlete management system (AMS)

The current copy doesn't speak this language at all.

### What Vitruvian Actually Is

**Vitruvian is a clinician-supervised, cable-assisted mobility platform that standardizes stretch delivery, quantifies ROM, and tracks tissue tolerance over time.**

It does NOT replace a physical therapist. It *extends* what a therapist can do by:
- Delivering repeatable stretch loads that a human cannot standardize
- Measuring what a human estimates (joint angles, force tolerance, compensation)
- Running the same protocol on 20 athletes in a morning with zero fatigue or variability
- Giving coaches and medical staff data they currently don't have

**The positioning should be: "The first mobility platform that measures what it does."**

---

## B. What the MVP Should Include

### The Machine — V1 Hardware

**Form Factor:** A standing open-frame station with:
- Adjustable-height cable anchor points (2 cables, NOT 4 for V1)
- Each cable runs through a motorized spool with inline load cell
- Padded limb cuffs (ankle and thigh variants)
- Stabilization pads (pelvis brace, shoulder brace) to isolate the target joint
- 15" touchscreen at eye level
- Depth camera (Intel RealSense or similar) mounted at hip height
- Emergency release: mechanical quick-disconnect on every cuff

**Why 2 cables, not 4:**
- V1 should do one limb at a time, bilateral comparison
- Simplifies safety, control, and protocol design
- Reduces cost and mechanical complexity
- Matches how actual assisted stretching is performed clinically

**Compute:**
- Real-time microcontroller (STM32 or ESP32) for motor control and safety
- SBC (Raspberry Pi 5 or Jetson Nano) for vision, UI, and protocol logic
- Cloud sync for athlete profiles and coach dashboard

### V1 Stretch Patterns (Lower Body Focus)

The MVP should focus exclusively on **lower-extremity assisted stretching** because:
- 80%+ of athletic mobility work targets the lower body
- Hamstrings, hip flexors, and adductors are the most commonly restricted
- These are the stretches most often performed by ATs and PTs on athletes
- Lower body positions are easier to standardize and stabilize

**V1 Stretch Library:**

| Stretch | Position | Cable Action | Stabilization |
|---------|----------|-------------|---------------|
| Hamstring (SLR) | Supine on bench attachment | Cable lifts leg via ankle cuff | Pelvis stabilized, opposite leg anchored |
| Hip Flexor / Quad | Side-lying or prone | Cable extends hip via thigh cuff | Pelvis braced |
| Adductor | Supine | Cable abducts leg via ankle cuff | Pelvis stabilized |
| Piriformis / Ext Rotation | Supine, knee flexed | Cable rotates via ankle cuff | Knee and pelvis stabilized |
| Calf / Soleus | Standing | Cable dorsiflexes via foot plate | Knee position controlled |

**What to AVOID in V1:**
- Upper body (shoulder complexity, injury risk, fewer standardizable positions)
- Spinal rotation or flexion (liability, requires clinical supervision)
- Multi-joint simultaneous stretching (uncontrollable compensation)
- Any position where the athlete's bodyweight is suspended by cables

---

## C. Best Stretch Protocols to Automate First

### Protocol Types and When to Use Each

| Method | Mechanism | Best Use Case | Vitruvian V1 Support |
|--------|-----------|---------------|---------------------|
| **Static Stretching** | Hold at end-range, 15-60s | Post-training cool-down, flexibility development | YES — primary mode |
| **Progressive Static** | Incrementally increase ROM across holds | Dedicated flexibility sessions | YES — core differentiator |
| **Contract-Relax (PNF)** | Isometric contraction against cable, then passive stretch | ROM development, clinical rehab | YES — machine cues contraction, detects via force spike, then advances |
| **Eccentric-Assisted** | Slow eccentric loading through range | Tendon rehab, Nordic-style protocols | FUTURE — V2 |
| **Dynamic Warm-Up** | Active movement through range, no hold | Pre-performance | NO — not cable-assisted, athlete does this independently |
| **Ballistic** | Bouncing at end-range | Almost never recommended | NO — excluded for safety |

### When Each Protocol Applies

**Pre-Performance (Game Day / Practice):**
- Dynamic warm-up (athlete does independently, not on machine)
- Optional: 2x15s light static stretch on identified restrictions only
- Vitruvian role: Quick ROM screen (30 seconds per side) to flag asymmetries for staff

**Post-Training:**
- Static holds: 3x30s per muscle group, moderate tension
- Focus on muscles loaded during session
- Vitruvian role: Standardized cool-down protocol with progressive tension

**Recovery Day:**
- Low-load static stretching: 3x45s, minimal tension
- Focus on tissue blood flow and relaxation, not ROM gain
- Vitruvian role: Recovery protocol with 40-60% of normal tension

**Dedicated Flexibility Session:**
- Progressive static: 4x30s with 5-10% tension increase per set
- PNF contract-relax: 5s isometric contraction, 30s passive stretch, 3 cycles
- Vitruvian role: This is where the machine is most valuable — repeatable, progressive, tracked

**Return-to-Play:**
- Bilateral ROM comparison (involved vs. uninvolved limb)
- Threshold: within 90% of contralateral limb or pre-injury baseline
- Vitruvian role: Objective assessment tool — quantifies readiness, documents for medical clearance

---

## D. Best UX Demo Flow

### Current Demo Problems:
- Shows a stick figure being pulled 4 directions — looks like a torture device
- "Start Demo" → generic animation with made-up numbers
- No clinical context, no athlete identity, no protocol logic
- The gauges are impressive but measuring nothing meaningful

### Redesigned Demo Flow (7 Steps)

**Step 0: Athlete Check-In**
- Athlete taps NFC badge or enters ID on touchscreen
- System loads: name, sport, position, injury history flags, last session data
- Display: "Welcome back, Marcus. Last session: 3 days ago."

**Step 1: Readiness Input**
- Athlete rates: Soreness (1-10), Sleep quality (1-10), Training load today (Rest / Light / Moderate / Heavy)
- System adjusts protocol intensity based on readiness score
- Display: "Readiness Score: 7/10 — Standard protocol selected."

**Step 2: Baseline ROM Assessment**
- Machine performs quick bilateral SLR (straight-leg raise) screen
- Cable applies standardized 8 lb passive pull, measures peak angle
- Display: "L Hamstring: 74° | R Hamstring: 68° | Asymmetry: 8.1%"
- Flag: "Right hamstring below threshold. Prioritized in today's protocol."

**Step 3: Protocol Selection**
- System selects protocol based on: schedule context + readiness + assessment
- Display: "Protocol: Post-Training Recovery — Lower Body"
- Shows stretch queue: Hamstrings (R priority) → Hip Flexors → Adductors → Piriformis
- Estimated time: 14 minutes

**Step 4: Active Stretch Execution**
- Machine guides athlete into position (visual + audio cue)
- Cable applies progressive tension: ramp from 0 to target over 8 seconds
- Holds at end-range for prescribed duration
- Real-time display: joint angle, cable force, hold timer, compensation alert
- PNF mode: "Push against the cable for 5 seconds... Now relax. Advancing."
- If compensation detected (camera sees pelvis rotate): "Stabilize your hips. Reducing tension."

**Step 5: Mid-Session Re-Test**
- After hamstring protocol, repeat bilateral SLR screen
- Display: "R Hamstring: 68° → 73° (+5°) | Acute ROM gain within expected range"
- Compare to historical: "Session-over-session trend: +1.2° per week (4-week avg)"

**Step 6: Session Complete — Coach Summary**
- Full session data pushed to coach dashboard
- Summary card: stretches performed, ROM pre/post, asymmetry change, compensation events, subjective input
- Flags for staff: "Right hamstring asymmetry now 1.4% (resolved). Zero compensation events."

---

## E. Best Metrics and Coach Dashboard

### What the Machine Should Measure

| Metric | How | Why |
|--------|-----|-----|
| **Joint angle (ROM)** | Depth camera pose estimation + cable length/angle | Primary outcome — is mobility improving? |
| **Peak passive ROM** | Maximum angle at standardized force threshold | Comparable across sessions |
| **Force at end-range** | Load cell reading at peak ROM | Tissue stiffness indicator |
| **Asymmetry index** | (L - R) / max × 100 | Flag bilateral imbalance, injury risk |
| **Hold tolerance** | Duration athlete maintains end-range without retreat | Stretch tolerance / neuromuscular relaxation |
| **Compensation events** | Camera detects pelvis rotation, trunk lateral flexion, knee bend | Quality of stretch — was it isolated? |
| **Acute ROM gain** | Post-stretch ROM minus pre-stretch ROM | Immediate session effectiveness |
| **Chronic ROM trend** | Rolling 4-week average of peak ROM | Is the athlete actually getting more flexible? |
| **Subjective discomfort** | Athlete rates 0-10 after each stretch | Correlate with objective data, flag pain |
| **Readiness score** | Pre-session self-report (soreness, sleep, load) | Context for protocol intensity |
| **Contract force (PNF)** | Peak isometric force during contract-relax | Neuromuscular engagement quality |

### Coach Dashboard — What Staff Sees

**Team View:**
- All athletes, sorted by highest asymmetry or lowest ROM percentile
- Color-coded: Green (within norms), Yellow (approaching threshold), Red (flagged)
- Filter by: sport, position group, injury status, days since last session

**Athlete Detail View:**
- ROM trend charts per muscle group (4-week, 8-week, season)
- Bilateral comparison overlay
- Session log with pre/post data
- Compensation frequency trend
- Readiness correlation (does low readiness predict poor ROM?)
- Return-to-play progress: current ROM as % of pre-injury baseline

**Alerts:**
- "Marcus Williams — R hamstring ROM declined 4° over 2 weeks. Review recommended."
- "Aisha Johnson — L hip flexor asymmetry exceeded 15% threshold."
- "Team average hamstring ROM down 3° post-heavy training block. Consider recovery protocol adjustment."

---

## F. What to Remove

### From the current site and concept:

1. **"The machine that stretches you"** — Replace with credible clinical language
2. **"Replaces 6 machines"** — Unsubstantiated, sounds like an infomercial
3. **"Intelligence of a therapist"** — Overclaim. It assists, it doesn't diagnose
4. **"8 Safety Layers"** — Marketing fluff. Describe the actual safety mechanism simply
5. **"StretchLab therapist replaced by a machine"** — Antagonizes potential partners and overreaches
6. **"12min Full Session"** — Sessions vary by protocol. Don't lock into a number
7. **4-cable simultaneous stretch visual** — Replace with single-limb clinical stretch visual
8. **The comparison table claiming "Free*"** — Misleading for a $6K+ machine
9. **Generic stats (100Hz, 8 layers)** — Replace with metrics that matter to staff (ROM accuracy, asymmetry detection, protocol library size)
10. **The stick-figure-in-a-box demo** — Replace with clinical stretch execution demo

---

## G. Final Elite Product Recommendation

### The Strongest Product Direction

**Vitruvian should be positioned as:**

> "The first mobility platform that measures what it does."

**Not** a consumer stretch machine. **Not** a replacement for a therapist. It is an **instrument** — like a force plate or an isokinetic dynamometer — that happens to also deliver the intervention.

**The MVP pitch to a Director of Performance:**

"Your staff spends 45 minutes a day doing manual assisted stretching on athletes. The quality varies by who's doing it, there's no standardization, and you have zero objective data on who's actually getting more flexible. Vitruvian gives your staff a tool that delivers repeatable stretch protocols at controlled loads, measures ROM to within 2 degrees, flags bilateral asymmetries automatically, and pushes a summary to your AMS after every session. Your therapists still supervise. They just stop being the bottleneck."

**What makes it better than everything else:**

| Competitor | What They Do | What They Don't Do |
|-----------|-------------|-------------------|
| StretchLab | Human-delivered assisted stretching | No measurement. No data. No consistency. Varies by practitioner. |
| Stretch cages | Passive self-stretch frames | Zero assistance, zero measurement, zero progression logic |
| Isokinetic dynamometers (Biodex) | Measure force and ROM | Don't deliver stretch protocols. $40K+. Require trained operator. |
| Manual goniometry | Measure joint angles | 5-10° measurement error. Time-consuming. No longitudinal tracking. |
| **Vitruvian** | **Delivers AND measures in one system** | **That's the entire point.** |

**The single most important thing that makes Vitruvian real:**

It's not a robot that replaces people. It's an instrument that makes people better at their jobs and gives them data they've never had.

**Final recommendation:** Build V1 as a lower-body, 2-cable, clinician-supervised assisted-stretch and ROM assessment platform. Target NFL, NBA, and MLS performance staffs as beta partners. Price at $12-18K (comparable to a NordBord or force plate system). Focus the demo on a single hamstring SLR protocol with real assessment data. That's all you need to close the first 10 customers.
