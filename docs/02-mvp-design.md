# 2. MVP DESIGN

## 2.1 Physical Structure — What It Looks Like

**Form factor:** A freestanding steel frame, roughly 7 ft tall x 5 ft wide x 4 ft deep. Think halfway between a cable crossover machine and a squat rack with a vertical post on each side.

```
        ┌─────────────────────────┐
        │      TOP CROSS BAR      │  ← Structural + upper cable routing
        │                         │
   ┌────┤                         ├────┐
   │    │     TOUCHSCREEN (15")   │    │
   │    │         ┌───┐           │    │
   │ L  │         │   │ ← User   │ R  │  ← Left/Right vertical pillars
   │ E  │         │   │  stands  │ I  │     (house motors + cable spools)
   │ F  │         │   │  here    │ G  │
   │ T  │         └───┘          │ H  │
   │    │                         │ T  │
   │ P  │   ┌─────────────────┐   │    │
   │ I  │   │  PLATFORM BASE  │   │ P  │
   │ L  │   │  (anti-fatigue)  │   │ I  │
   │ L  │   └─────────────────┘   │ L  │
   │ A  │                         │ L  │
   │ R  │                         │ A  │
   └────┤                         ├──R─┘
        │      BOTTOM CROSS BAR   │  ← Structural + lower cable routing
        └─────────────────────────┘
```

**Key structural elements:**
- **Two vertical pillars (left + right):** Welded steel tube (2"x2" or 2"x3"). These house the cable spools, motors, and pulley routing internally.
- **Top cross bar:** Connects pillars. Routes upper cables. Mounts the depth camera looking down at the user.
- **Bottom cross bar / base:** Structural foundation. Routes lower cables for leg stretches.
- **Standing platform:** Textured rubber anti-fatigue mat, slightly raised. User stands here.
- **Touchscreen:** 15" display mounted at eye level on one pillar. Shows routine, form guidance, and real-time feedback.

**Footprint:** ~5 ft x 4 ft (roughly the size of a cable machine). Fits in any gym or training room.

## 2.2 How the User Enters and Uses It

1. User walks up to the open front of the frame (it's open — no door, no enclosure).
2. Steps onto the platform.
3. Taps the touchscreen to start a session (or scans a QR code / NFC tag from their phone).
4. The screen prompts them to attach the appropriate cuffs for the selected routine:
   - **Ankle cuffs** → clip onto lower cable carabiners
   - **Wrist/forearm cuffs** → clip onto upper or mid-height cable carabiners
   - **Padded belt** → clips to rear cables for hip/trunk stretches
5. The system runs a 10-second baseline scan (depth camera captures posture, cables apply light diagnostic tension).
6. The guided stretching routine begins.

## 2.3 How Stretching Is Actually Assisted

The machine uses **motorized cable tension** to create controlled, progressive pulling force on the user's limbs.

**Example — Hamstring Stretch:**
1. User stands on the platform, left ankle cuff attached to the lower-left cable.
2. The screen says: "Lift your left leg forward. The machine will support and gently pull."
3. User lifts their leg. The motor takes up slack and applies ~5 lbs of tension, gently pulling the leg upward/forward.
4. As the user relaxes into the stretch, the motor slowly increases tension (maybe to 10-15 lbs) and extends the range by 2-3 degrees over 20 seconds.
5. The force sensor detects if the user resists or tenses — the motor immediately backs off.
6. After the hold, the motor slowly releases tension and the user lowers their leg.

**Example — Chest/Shoulder Stretch:**
1. User stands centered, both wrist cuffs attached to cables routed behind the pillars.
2. Cables gently pull both arms back and outward, opening the chest.
3. Tension increases gradually from 3 lbs to 8-12 lbs per arm.
4. The depth camera tracks shoulder position to ensure symmetric stretch.

**Example — Hip Flexor Stretch:**
1. User stands in a lunge position on the platform.
2. Padded belt around hips is connected to a rear cable.
3. Cable applies gentle posterior pull, deepening the hip flexor stretch.
4. User controls depth; machine provides consistent, smooth tension.

## 2.4 What Moves vs. What Stays Fixed

**FIXED (does not move):**
- The frame (pillars, cross bars, base)
- The touchscreen mount
- The depth camera mount
- Pulley positions (fixed at set heights on the pillars)

**MOVES:**
- Cables (extend and retract via motorized spools inside the pillars)
- The user's limbs (guided by cable tension)
- Adjustable pulley height selector — a simple pin-lock slider on each pillar so cables can route from low, mid, or high anchor points (same concept as a standard cable machine)

**DOES NOT MOVE (but adjustable between sessions):**
- Fold-down bench (manually folded out for seated stretches, folded flat against a pillar when not in use)
- Cuff sizes (S/M/L available on hooks, user selects the right fit)
