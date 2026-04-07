# 3. MECHANICAL SYSTEM

## 3.1 Core Mechanism: Motorized Cable Spools

Each pillar contains **2 independent motorized cable spool units** (4 total across the machine). Each unit consists of:

| Component | Spec | Purpose |
|-----------|------|---------|
| **Brushless DC motor** | 200W, 24V | Smooth, quiet torque. No jerky motion. |
| **Planetary gearbox** | 20:1 reduction | Converts motor speed to slow, high-torque pull. Max ~30 lbs per cable. |
| **Cable spool/drum** | 6" diameter aluminum | Winds/unwinds braided steel cable (coated in nylon). |
| **Inline load cell** | 0-50 lb range | Measures real-time tension on each cable. |
| **Rotary encoder** | On motor shaft | Tracks exactly how much cable has been extended (= limb position). |
| **Spring-loaded brake** | Electromagnetic | Locks cable if motor loses power. Fail-safe: cable goes slack, never pulls. |

**Cable routing:** Each spool's cable runs through a nylon-lined channel inside the pillar, exits through a pulley at the selected height (low/mid/high), and terminates in a carabiner clip.

## 3.2 How Force Is Applied Safely

**Progressive tension model:**
- The motor NEVER yanks. All tension changes follow a **ramp curve**: 0.5 lb/second maximum rate of increase.
- Maximum force per cable is **hard-capped at 30 lbs** in software AND a mechanical slip clutch set at 35 lbs. Even if software fails, the clutch slips before dangerous force is reached.
- For context: a human stretching therapist typically applies 5-20 lbs of force. The machine operates in this same range.

**Active compliance:**
- The system continuously reads the load cell 100 times per second.
- If the user resists (force spikes upward because the user is fighting the stretch), the motor immediately reduces tension. This is a **simple PID control loop** — the same control logic used in industrial cobots (collaborative robots).
- The user is ALWAYS stronger than the machine in the stretch direction. They can overpower any cable at any time.

**Emergency stop:**
- Big red E-stop button on each pillar.
- Pressing it kills power to all motors instantly. The spring-loaded brakes engage, then release after 1 second, allowing all cables to go fully slack.
- The user can also simply unclip any cuff at any time — standard carabiner release.

## 3.3 How Range Is Controlled

**Range of motion (ROM) tracking** uses two inputs:
1. **Rotary encoder on each motor** — knows exactly how many inches of cable have been extended. This directly maps to limb position.
2. **Depth camera overhead** — provides a visual check of joint angles (shoulder, hip, knee, ankle).

**Soft limits:**
- During the first session, the system maps the user's natural ROM for each stretch. Example: "Left hamstring — comfortable range is 0-75 degrees of hip flexion."
- On subsequent sessions, the system starts at 90% of the known comfortable range and nudges outward by 1-2 degrees per session.
- The user can tap "TOO MUCH" on the touchscreen or simply resist — the system logs the new limit and backs off.

**Hard limits:**
- Anatomical hard stops are programmed per joint per stretch. Example: the system will never attempt to pull a knee into hyperextension. These are fixed in code and cannot be overridden.
- Cable extension is physically limited by spool capacity — cables max out at ~5 ft of travel.

## 3.4 Injury Prevention — Defense in Depth

| Layer | Mechanism | What it prevents |
|-------|-----------|-----------------|
| 1 | Software ramp limit (0.5 lb/sec) | Sudden force application |
| 2 | PID compliance (backs off on resistance) | Stretching against user's will |
| 3 | Software force cap (30 lbs) | Excessive force |
| 4 | Mechanical slip clutch (35 lbs) | Software failure leading to excess force |
| 5 | Anatomical hard limits in code | Dangerous joint positions |
| 6 | E-stop button | User-initiated immediate shutdown |
| 7 | Quick-release carabiner cuffs | User can disconnect instantly |
| 8 | Spring brake on power loss | Motor failure defaults to slack, not pull |

This is **8 layers of safety**. Even if layers 1-5 all fail simultaneously, the user can still E-stop or unclip.
