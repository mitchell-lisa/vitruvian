# 6. PROTOTYPE BUILD PLAN

## 6.1 Target: Build V1 in 90 Days for $10K-$25K

This is a **functional prototype**, not a production unit. It needs to:
- Demonstrate the core concept (motorized cable-assisted stretching)
- Be safe enough for supervised testing with real users
- Collect data to validate the product thesis
- Look credible enough to show investors and NFL/NBA training staff

## 6.2 Bill of Materials — Estimated

| Category | Item | Source | Est. Cost |
|----------|------|--------|-----------|
| **Frame** | 2"x2" steel square tube, welded | Local metal fab shop or 80/20 aluminum extrusion | $800-$1,500 |
| **Motors (x4)** | Brushless DC motor, 200W, 24V (e.g., ODrive-compatible BLDC motors) | Amazon / AliExpress / ODrive shop | $150 x 4 = $600 |
| **Motor controllers (x4)** | ODrive v3.6 or similar BLDC controller | ODrive Robotics | $120 x 4 = $480 |
| **Gearboxes (x4)** | Planetary gearbox, 20:1, NEMA 34 mount | Amazon / RobotShop | $80 x 4 = $320 |
| **Cable spools (x4)** | Custom machined aluminum drums, 6" dia | Local machine shop or 3D printed (metal fill) | $200 |
| **Cables** | 3/16" coated steel cable, 50 ft total | McMaster-Carr | $60 |
| **Pulleys (x8)** | Nylon/steel cable pulleys, bearing-mounted | McMaster-Carr / Amazon | $15 x 8 = $120 |
| **Load cells (x4)** | S-type load cell, 50 lb capacity | Amazon (e.g., DYLY-103) | $25 x 4 = $100 |
| **Load cell amplifiers (x4)** | HX711 or NAU7802 ADC boards | Amazon / SparkFun | $10 x 4 = $40 |
| **Rotary encoders (x4)** | Built into ODrive motor feedback | Included with motors | $0 |
| **Depth camera** | Intel RealSense D435i | Intel store / Amazon | $350 |
| **Microcontroller** | STM32F4 or ESP32-S3 board | Amazon / DigiKey | $30 |
| **Single-board computer** | Raspberry Pi 5 (8GB) or Jetson Orin Nano | Amazon / NVIDIA | $150-$250 |
| **Touchscreen** | 15.6" capacitive touch display, HDMI | Amazon | $200 |
| **Power supply** | 24V 30A switching PSU | Amazon / Mean Well | $80 |
| **Cuffs + straps** | Padded ankle/wrist cuffs with D-rings | Amazon (gym accessory cuffs) | $60 |
| **Carabiners** | Locking carabiners, climbing-rated | Amazon | $30 |
| **Hip belt** | Padded dip belt, modified | Amazon | $40 |
| **E-stop buttons (x2)** | Industrial mushroom head, NC | Amazon / DigiKey | $20 |
| **Wiring, connectors, misc** | JST connectors, 14AWG wire, cable ties, etc. | DigiKey / Amazon | $200 |
| **Platform** | Rubber anti-fatigue mat, cut to size | Amazon / Home Depot | $50 |
| **Slip clutches (x4)** | Torque-limiting coupling, set to 35 lb | McMaster-Carr | $40 x 4 = $160 |
| **Software development** | Your time + open-source libraries | — | $0 (sweat equity) |
| **Fabrication labor** | Welding, assembly (if outsourced) | Local fab shop | $1,000-$2,000 |
| **Contingency** | 15% buffer for surprises | — | $700-$1,200 |
| | | **TOTAL** | **$5,800-$8,500** |

**Note:** This leaves $1,500-$16,500 of the budget for iteration, a second prototype, or professional industrial design consultation.

## 6.3 What Can Be Hacked Together (Off-the-Shelf)

- **Frame:** Use **80/20 aluminum T-slot extrusion** instead of welded steel. Bolts together like an Erector Set. Faster to prototype, easy to modify, no welding required. Slightly more expensive but saves weeks of fab time.
- **Motor + controller:** The **ODrive ecosystem** is built for exactly this. BLDC motor + ODrive controller + encoder = position and torque control out of the box. Python API. Huge community.
- **Cable spools:** Start with **3D-printed PLA drums** for early testing. Switch to machined aluminum once the diameter and geometry are validated.
- **Cuffs:** Buy **standard gym ankle/wrist cuffs** ($15-30/pair on Amazon, already padded with D-ring attachments). No need to custom-make these.
- **Touchscreen UI:** Run a **web app on the Raspberry Pi**. Use a browser in kiosk mode. Build the UI in React or even just Python + Flask with a simple HTML frontend. No native app needed.
- **Pose estimation:** **MediaPipe Pose** runs on a Raspberry Pi 5 at ~15 fps with the depth camera. Good enough for form checking — you don't need 60 fps for stretching.

## 6.4 What Needs Custom Work

| Item | Why It's Custom | Difficulty |
|------|----------------|------------|
| **Cable spool drums** | Need specific diameter + cable anchor point + mounting to gearbox shaft | Medium — CNC or good 3D printer |
| **Pillar cable routing channels** | Internal channels for cable to run through pillar tubes | Medium — may need tube cutting/drilling |
| **Motor mounting brackets** | Mount motor+gearbox+spool assembly inside the pillar | Low — simple bent sheet metal |
| **Firmware (STM32/ESP32)** | PID control loop, load cell reading, encoder reading, E-stop logic, serial communication to SBC | Medium — ~2 weeks of embedded dev |
| **Stretch routine software** | Sequencing engine, tension profiles per stretch, camera integration, UI | Medium-High — ~4-6 weeks of software dev |
| **User profile + progress DB** | SQLite on Pi, stores ROM history, user preferences | Low — standard web dev |

## 6.5 Prototype Timeline (90 Days)

| Week | Milestone |
|------|-----------|
| **1-2** | Order all parts. Design frame in CAD (Fusion 360). Design cable routing. |
| **3-4** | Build frame (80/20 extrusion). Mount pulleys. Bench-test one motor+spool+cable unit. |
| **5-6** | Integrate all 4 motor units into frame. Wire load cells and encoders. Basic firmware: manual motor control + force reading. |
| **7-8** | PID tension control working. User can clip in and feel controlled cable pull. E-stop functional. |
| **9-10** | Mount depth camera. Integrate MediaPipe pose estimation. Basic UI on touchscreen: start session, run stretch, end session. |
| **11-12** | Build 3-4 complete stretch routines. Tune tension profiles. Add form correction prompts. User testing with 5-10 athletes. |
| **13 (buffer)** | Fix everything that broke during testing. Polish UI. Prepare for demo. |

## 6.6 Tools Needed

- 3D printer (for spool drums, brackets, cable guides — any FDM printer works)
- Basic hand tools (wrenches, Allen keys, drill)
- Soldering iron + multimeter
- Laptop for firmware development (Arduino IDE or PlatformIO for STM32/ESP32)
- Fusion 360 (free for startups) for CAD
- Access to a machine shop OR a good relationship with a local maker space
