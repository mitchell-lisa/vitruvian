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
| **PNF (contract-relax) stretching automation** | Clinically effective technique | Requires the machine to detect voluntary muscle contraction vs. reflex — hard sensor problem. Do static and dynamic stretching first. Add PNF in V2 when you have better force-pattern data. |
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
