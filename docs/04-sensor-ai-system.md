# 4. SENSOR + AI SYSTEM

## 4.1 Sensors — What Data Is Collected

| Sensor | Location | What It Measures | Sample Rate |
|--------|----------|-----------------|-------------|
| **Load cells (x4)** | Inline on each cable | Cable tension in lbs | 100 Hz |
| **Rotary encoders (x4)** | On each motor shaft | Cable extension length (inches) | 100 Hz |
| **Depth camera (x1)** | Mounted on top cross bar, angled down | 3D body pose (skeleton tracking) | 30 fps |
| **Touchscreen input** | Front-mounted display | User feedback (pain, comfort, "too much") | On-demand |

**What is NOT included (and why):**
- No EMG sensors (too finicky, requires skin contact, adds cost and complexity)
- No wearable IMUs (adds friction to the user experience)
- No pressure mat (useful but not critical for MVP — cable data gives enough position info)

## 4.2 Depth Camera — Specifics

**Hardware:** Intel RealSense D435 or Azure Kinect DK equivalent (or their current-gen successors).

**What it does:**
- Runs a **skeleton/pose estimation model** (e.g., MediaPipe Pose, OpenPose, or Azure Body Tracking SDK) to extract joint positions in 3D space.
- Tracks: shoulders, elbows, wrists, hips, knees, ankles — 12 key joints.
- Calculates joint angles in real time (e.g., hip flexion angle during hamstring stretch).

**What it does NOT do:**
- No facial recognition or biometric ID (privacy-safe)
- No video recording or storage (processes frames, discards raw images)
- Does not work well if user wears very baggy clothing — noted in user onboarding

## 4.3 What the AI Actually Does

The "AI" is better described as an **adaptive control system with a recommendation engine**. It's not magic. Here's what it does, concretely:

**Real-time (during a stretch):**

| Function | Input | Output | How |
|----------|-------|--------|-----|
| **Tension control** | Load cell reading + target tension | Motor speed command | PID controller (runs on microcontroller, not cloud) |
| **Resistance detection** | Load cell spike pattern | Reduce tension command | Threshold + rate-of-change detection |
| **ROM tracking** | Encoder position + camera joint angle | Current stretch depth (degrees) | Sensor fusion: encoder gives primary signal, camera validates |
| **Form check** | Camera skeleton data | "Adjust your hips" prompt on screen | Rule-based: compare detected pose to target pose template |

**Between sessions (offline):**

| Function | Input | Output | How |
|----------|-------|--------|-----|
| **Progress tracking** | ROM history per stretch per user | Trend chart on app/screen | Simple time-series analysis |
| **Routine adjustment** | ROM trends + user feedback | Updated stretch targets + new stretches added | Rule engine: "If hamstring ROM plateaued for 3 sessions, add PNF variation" |
| **Session recommendation** | Last session date, muscle group history | "Today: focus on hip flexors and thoracic spine" | Scheduling algorithm (round-robin muscle groups + recovery time) |

## 4.4 What Is Manual vs. Automated

| Action | Manual or Automated? | Why |
|--------|----------------------|-----|
| Selecting a routine | **Manual** — user picks on screen (with AI suggestion) | User should control what they stretch |
| Attaching cuffs | **Manual** — user clips cuffs to cables | No robotic cuff attachment in MVP |
| Adjusting pulley height | **Manual** — user moves the pin | Same as a cable machine. Simple and reliable |
| Applying tension | **Automated** — motor controlled | Core value prop of the machine |
| Adjusting tension mid-stretch | **Automated** — based on sensors | Real-time compliance |
| Detecting bad form | **Automated** — camera + rules | Displays correction on screen |
| Stopping if user resists | **Automated** — load cell trigger | Safety-critical, must be automatic |
| Ending a stretch hold | **Automated** — timer + ROM target | Consistent stretch duration |
| Progressing ROM over weeks | **Semi-auto** — AI suggests, user confirms | User stays in control of their progression |

## 4.5 Compute Architecture

```
┌──────────────────────────────┐
│  MICROCONTROLLER (ESP32 or   │
│  STM32) — Real-time control  │
│  - PID motor control         │
│  - Load cell reading         │
│  - Encoder reading           │
│  - E-stop handling           │
│  - 100Hz control loop        │
└──────────┬───────────────────┘
           │ UART/SPI
┌──────────▼───────────────────┐
│  SINGLE-BOARD COMPUTER       │
│  (Raspberry Pi 5 or Jetson   │
│  Nano Orin) — High-level AI  │
│  - Depth camera processing   │
│  - Pose estimation model     │
│  - Routine logic             │
│  - Touchscreen UI            │
│  - User profiles (local DB)  │
│  - WiFi for OTA updates      │
└──────────────────────────────┘
```

Real-time safety (motor control, force limits) runs on the **microcontroller** — no operating system, no lag, no crashes. The "smart" features (camera, UI, routines) run on the **SBC**. If the SBC crashes, the microcontroller safely holds or releases all cables.
