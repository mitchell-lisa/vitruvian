/* global React, THREE */
const { useEffect, useRef, useState } = React;

/* MODULOR machine — Three.js model with human figure + live demo.
   Stylized figure stands on platform, ankle/wrist cuffs clipped to
   four cables. Demo state machine runs a hamstring-stretch protocol
   on loop: setup → calibrate → ramp → hold → release → reset.
   Cables, screen UI, status lights, and pose all driven by demo state. */

const PARTS = [
  {
    id: "frame", label: "Steel frame",
    short: "Welded 2\"×3\" tube · 7×5×4 ft",
    focus: { pos: [4.6, 2.4, 4.6], look: [0, 1.1, 0] },
    figs: ["FIG-02", "FIG-09"],
    specs: [
      ["Material", "Welded 2\"×3\" cold-rolled steel tubing, 0.120\" wall"],
      ["Footprint", "1525 × 1220 mm (5 × 4 ft)"],
      ["Height", "2130 mm (7 ft)"],
      ["Frame mass", "≈ 145 kg / 320 lb"],
      ["Finish", "Powder-coat matte graphite, low-sheen"],
      ["Anchoring", "M12 floor pins · 4 corners · optional"],
    ],
    desc: "The structural backbone. Two vertical pillars connected by top and bottom cross-bars with rear bracing. All cabling and electronics route internally — no exposed wires, no enclosure to fight, open-front for clinician access on three sides.",
  },
  {
    id: "spool", label: "Motorized cable spools",
    short: "200 W BLDC · 20:1 gearbox · 4 units",
    focus: { pos: [-3.2, 1.7, 2.0], look: [-0.76, 1.78, 0] },
    figs: ["FIG-04", "FIG-10", "FIG-02"],
    specs: [
      ["Motor", "200 W brushless DC, 24 V"],
      ["Gear", "Planetary 20:1, ≤ 0.6° backlash"],
      ["Drum", "ø152 mm anodized aluminum, knurled"],
      ["Brake", "Electromagnetic spring-engage, fail-safe"],
      ["Sensors", "Inline 100 lb load cell · 4096 ppr rotary encoder"],
      ["Sample rate", "100 Hz, ±0.2 lb tension"],
      ["Travel", "1.5 m / 5 ft per cable"],
      ["Force range", "0 – 30 lb, ramp 0.5 lb/sec"],
    ],
    desc: "Two spools per pillar — one high, one low — wind braided steel cable through internal pulley channels. The PID compliance loop reads load cell + encoder at 100 Hz; the moment the athlete resists, the motor backs off before the tension spikes.",
  },
  {
    id: "cable", label: "Cable, pulley & carabiner",
    short: "Nylon-coated braided steel · quick-release",
    focus: { pos: [-2.4, 1.5, 1.6], look: [-0.76, 1.4, 0] },
    figs: ["FIG-04", "FIG-02"],
    specs: [
      ["Cable", "5 mm braided steel, nylon-coated"],
      ["Tensile rating", "850 lb (28× working load)"],
      ["Pulley", "ø70 mm bronze-bushed sheave"],
      ["Routing", "Internal channel · low-friction guides"],
      ["Termination", "Aluminum swage + thimble"],
      ["Clip", "Black-oxide stainless carabiner, twist-lock"],
      ["Cuffs", "Ankle / thigh / wrist · neoprene-lined nylon"],
    ],
    desc: "Four cables exit the pillars through height-adjustable pulleys and terminate in quick-release carabiners. Cuffs clip in under five seconds; the athlete is loaded within a minute of stepping onto the platform.",
  },
  {
    id: "screen", label: "Touchscreen interface",
    short: "15.6\" capacitive · eye-level",
    focus: { pos: [-2.4, 2.0, 1.6], look: [-0.42, 1.55, 0.18] },
    figs: ["FIG-06", "FIG-01", "FIG-03"],
    specs: [
      ["Display", "15.6\" 1920×1080 capacitive multi-touch"],
      ["Brightness", "400 nits, anti-glare"],
      ["Compute", "Embedded Linux SBC · 8 GB RAM"],
      ["Mount", "Articulating arm, 200 mm reach"],
      ["UI", "Athlete check-in · protocol picker · live ROM/force gauges"],
      ["Network", "Wi-Fi 6 + Ethernet · TLS to Modulor cloud"],
    ],
    desc: "Athlete's only point of contact with the system. Tap to check in, pick a protocol, watch real-time force and joint-angle telemetry as the stretch progresses.",
  },
  {
    id: "camera", label: "Depth & pose camera",
    short: "Intel RealSense D455 · skeleton tracking",
    focus: { pos: [0, 2.6, 2.5], look: [0, 2.0, 0.3] },
    figs: ["FIG-11", "FIG-08", "FIG-05"],
    specs: [
      ["Sensor", "Intel RealSense D455 stereo + IR depth"],
      ["FOV", "87° × 58°"],
      ["Range", "0.4 – 6 m at 1280×720 / 30 fps"],
      ["Tracking", "33-point skeleton @ 30 Hz"],
      ["Latency", "≤ 60 ms detection-to-flag"],
      ["Compensation flags", "Pelvis rotation · trunk shift · knee bend · scapular hike"],
    ],
    desc: "Mounted on the top cross-bar, angled down. Reads the athlete's full skeleton in real time and detects compensation events the eye misses. Every event is timestamped and logged.",
  },
  {
    id: "platform", label: "Anti-fatigue platform",
    short: "Textured rubber · open-front",
    focus: { pos: [2.0, 0.6, 3.0], look: [0, 0.1, 0] },
    figs: ["FIG-09", "FIG-02"],
    specs: [
      ["Material", "20 mm closed-cell rubber"],
      ["Surface", "Diamond-knurl, ASTM dry/wet ≥ 0.6 µ"],
      ["Footprint", "1370 × 850 mm (4.5 × 2.8 ft)"],
      ["Drainage", "Channeled underside · sweat shed"],
      ["Replaceable", "Drop-in, no tools"],
    ],
    desc: "The athlete stands here, barefoot or in trainers. Open on three sides — the clinician can reach in for hands-on cueing without working around an enclosure.",
  },
  {
    id: "estop", label: "Emergency stop",
    short: "Latching mushroom · one per pillar",
    focus: { pos: [-2.4, 1.4, 1.4], look: [-0.78, 1.1, 0] },
    figs: ["FIG-07", "FIG-10"],
    specs: [
      ["Type", "ø40 mm latching mushroom, IEC 60947-5-5"],
      ["Action", "Cuts 24 V motor bus directly"],
      ["Brake", "Spring-engage in ≤ 80 ms"],
      ["Slack-out", "Cables fully unloaded < 1 sec"],
      ["Reset", "Quarter-turn release"],
    ],
    desc: "One on each pillar, palm-height, unmissable. Hit it and every cable goes slack in under a second.",
  },
  {
    id: "panel", label: "Control panel & status",
    short: "Power · network · indicator stack",
    focus: { pos: [3.2, 1.4, 1.4], look: [0.78, 1.0, 0] },
    figs: ["FIG-05", "FIG-06", "FIG-01"],
    specs: [
      ["Power", "120/240 V auto-sensing, 6 A draw nominal"],
      ["Inlet", "IEC C14 with locking clip"],
      ["Network", "Gigabit Ethernet + Wi-Fi 6"],
      ["Status stack", "Green (ready) · amber (calibrating) · red (fault)"],
      ["Service port", "USB-C · firmware + diagnostics"],
    ],
    desc: "The mundane stuff that makes a medical-grade device deployable. Single-cord power, lockable inlet, indicator stack the athletic trainer can read across the room.",
  },
];

/* Patent figures referenced from spec panels. */
const FIG_TITLES = {
  "FIG-01": "System Block Diagram",
  "FIG-02": "Apparatus Side-Elevation Schematic",
  "FIG-03": "Method of Bilateral Longitudinal Assessment",
  "FIG-04": "Cable Drive Assembly Detail",
  "FIG-05": "Sensor Array and Data Paths",
  "FIG-06": "Control and User Interface Architecture",
  "FIG-07": "Five-Layer Safety Cascade",
  "FIG-08": "Measurement Extraction Pipeline",
  "FIG-09": "Multi-Pattern Reconfigurable Platform Geometry",
  "FIG-10": "Closed-Loop Force-Compliance Controller",
  "FIG-11": "Vision-Based Compensation Detection and Force Reduction",
};
const ALL_FIGS = Object.keys(FIG_TITLES);

/* Demo phases: each runs a slice of the cycle. Total ≈ 24s loop. */
const PHASES = [
  { id: "idle",    label: "Idle / Ready",         dur: 2.5, force: 0,    rom: 0 },
  { id: "setup",   label: "Athlete check-in",      dur: 3.0, force: 0,    rom: 0 },
  { id: "calib",   label: "Calibrating ROM",       dur: 3.5, force: 1.5,  rom: 0.25 },
  { id: "ramp",    label: "Ramping force",         dur: 4.0, force: 14,   rom: 0.7 },
  { id: "hold",    label: "Stretch hold",          dur: 6.0, force: 22,   rom: 1.0 },
  { id: "release", label: "Releasing tension",     dur: 2.5, force: 4,    rom: 0.55 },
  { id: "reset",   label: "Reset · log session",   dur: 2.5, force: 0,    rom: 0 },
];

function MachineModel() {
  const mountRef = useRef(null);
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);
  const [figOpen, setFigOpen] = useState(null); // active fig id, e.g. "FIG-04"
  const [demoState, setDemoState] = useState({ phase: "idle", phaseLabel: "Idle / Ready", t: 0, force: 0, rom: 0 });
  const apiRef = useRef({});

  useEffect(() => {
    if (!window.THREE) return;
    const THREE = window.THREE;
    const mount = mountRef.current;
    const w = mount.clientWidth;
    const h = mount.clientHeight;

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(32, w / h, 0.1, 100);
    camera.position.set(4.4, 2.6, 5.4);
    camera.lookAt(0, 1.1, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    /* ─── lights ───────────────────────────────────────────────── */
    scene.add(new THREE.HemisphereLight(0xfff5e0, 0x4a4438, 0.6));
    const key = new THREE.DirectionalLight(0xfff5e8, 1.15);
    key.position.set(4, 6, 5);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.near = 0.5;
    key.shadow.camera.far = 20;
    key.shadow.camera.left = -5; key.shadow.camera.right = 5;
    key.shadow.camera.top = 5; key.shadow.camera.bottom = -5;
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xc9a880, 0.4);
    fill.position.set(-4, 2.5, -3);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0xddd2bf, 0.25);
    rim.position.set(0, 4, -6);
    scene.add(rim);

    /* ─── materials ────────────────────────────────────────────── */
    const matSteel = new THREE.MeshStandardMaterial({ color: 0x222018, metalness: 0.6, roughness: 0.42 });
    const matSteelDark = new THREE.MeshStandardMaterial({ color: 0x16140f, metalness: 0.7, roughness: 0.5 });
    const matRubber = new THREE.MeshStandardMaterial({ color: 0x14110d, metalness: 0.05, roughness: 0.92 });
    const matScreen = new THREE.MeshStandardMaterial({ color: 0x0a0a0c, metalness: 0.2, roughness: 0.3, emissive: 0x1a2030, emissiveIntensity: 0.5 });
    const matCable = new THREE.MeshStandardMaterial({ color: 0x18171a, metalness: 0.3, roughness: 0.55 });
    const matRed = new THREE.MeshStandardMaterial({ color: 0xb84030, metalness: 0.2, roughness: 0.4, emissive: 0x3a0e08, emissiveIntensity: 0.35 });
    const matAmber = new THREE.MeshStandardMaterial({ color: 0xc8902a, metalness: 0.2, roughness: 0.4, emissive: 0x3a2008, emissiveIntensity: 0.5 });
    const matGreen = new THREE.MeshStandardMaterial({ color: 0x4a8a3f, metalness: 0.2, roughness: 0.4, emissive: 0x0e2b08, emissiveIntensity: 0.5 });
    const matSpool = new THREE.MeshStandardMaterial({ color: 0x9a8e7a, metalness: 0.85, roughness: 0.32 });
    const matBronze = new THREE.MeshStandardMaterial({ color: 0x8a6a3a, metalness: 0.85, roughness: 0.35 });
    const matGround = new THREE.MeshStandardMaterial({ color: 0xd9d2c2, metalness: 0, roughness: 1 });

    // figure materials — earthy, low-sat to fit the brand palette
    const matSkin = new THREE.MeshStandardMaterial({ color: 0xc9a385, metalness: 0.05, roughness: 0.78 });
    const matAttire = new THREE.MeshStandardMaterial({ color: 0x2e2a24, metalness: 0.1, roughness: 0.78 });
    const matCuff = new THREE.MeshStandardMaterial({ color: 0x6a3a2a, metalness: 0.2, roughness: 0.6 });

    /* ─── ground ─────────────────────────────────────────────── */
    const ground = new THREE.Mesh(new THREE.CircleGeometry(8, 64), matGround);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    /* ─── root ─────────────────────────────────────────────────── */
    const root = new THREE.Group();
    scene.add(root);

    const HF = 2.13, WF = 1.52, DF = 1.22;
    const PILLAR = 0.075;
    const halfW = WF / 2;

    const groups = {};
    PARTS.forEach(p => { groups[p.id] = new THREE.Group(); root.add(groups[p.id]); });
    // figure group — separate, not a clickable part
    const figure = new THREE.Group();
    root.add(figure);

    function tubeBox(w, h, d, mat = matSteel) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      m.castShadow = true; m.receiveShadow = true;
      return m;
    }

    /* ─── FRAME ────────────────────────────────────────────────── */
    [-halfW, halfW].forEach((x) => {
      const p = tubeBox(PILLAR, HF, PILLAR);
      p.position.set(x, HF / 2, 0);
      groups.frame.add(p);
      const cover = tubeBox(0.005, HF * 0.92, PILLAR * 0.85, matSteelDark);
      cover.position.set(x + (x < 0 ? PILLAR / 2 + 0.003 : -PILLAR / 2 - 0.003), HF / 2, 0);
      groups.frame.add(cover);
    });
    const top = tubeBox(WF + PILLAR, PILLAR, PILLAR);
    top.position.set(0, HF, 0);
    groups.frame.add(top);
    const bot = tubeBox(WF + PILLAR, PILLAR, PILLAR);
    bot.position.set(0, PILLAR / 2, 0);
    groups.frame.add(bot);

    [-halfW, halfW].forEach((x) => {
      const v = tubeBox(PILLAR * 0.7, HF, PILLAR * 0.7);
      v.position.set(x, HF / 2, -DF / 2 + 0.15);
      groups.frame.add(v);
    });
    [
      { y: HF, h: PILLAR * 0.7 },
      { y: PILLAR / 2, h: PILLAR * 0.7 },
    ].forEach(({ y, h }) => {
      const r = tubeBox(WF + PILLAR, h, PILLAR * 0.7);
      r.position.set(0, y, -DF / 2 + 0.15);
      groups.frame.add(r);
    });

    [
      { y: HF, h: PILLAR * 0.7 },
      { y: PILLAR / 2, h: PILLAR * 0.7 },
      { y: HF / 2, h: PILLAR * 0.5 },
    ].forEach(({ y, h }) => {
      [-halfW, halfW].forEach((x) => {
        const span = (DF / 2) - 0.15;
        const strut = tubeBox(h, h, span);
        strut.position.set(x, y, -span / 2 - 0.04);
        groups.frame.add(strut);
      });
    });

    [-halfW, halfW].forEach((x) => {
      [0.05, -DF / 2 + 0.15].forEach((z) => {
        const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.025, 16), matRubber);
        foot.position.set(x, 0.012, z);
        groups.frame.add(foot);
      });
    });

    /* ─── PLATFORM ─────────────────────────────────────────────── */
    const plat = new THREE.Mesh(new THREE.BoxGeometry(WF * 0.92, 0.04, DF * 0.7), matRubber);
    plat.position.set(0, 0.03, 0);
    plat.castShadow = true; plat.receiveShadow = true;
    groups.platform.add(plat);
    for (let i = 0; i < 12; i++) {
      const ridge = new THREE.Mesh(new THREE.BoxGeometry(WF * 0.88, 0.0025, 0.008), matSteelDark);
      ridge.position.set(0, 0.052, -DF * 0.32 + i * (DF * 0.64) / 11);
      groups.platform.add(ridge);
    }
    const bumper = new THREE.Mesh(new THREE.BoxGeometry(WF * 0.94, 0.012, DF * 0.72), matSteelDark);
    bumper.position.set(0, 0.012, 0);
    groups.platform.add(bumper);

    /* ─── SPOOLS ─────────────────────────────────────────────── */
    function makeSpool(x, y, dir) {
      const g = new THREE.Group();
      const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.16, 24), matSteelDark);
      motor.rotation.z = Math.PI / 2;
      motor.position.set(dir * 0.10, 0, 0);
      motor.castShadow = true;
      g.add(motor);
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.058, 0.058, 0.012, 24), matSpool);
      cap.rotation.z = Math.PI / 2;
      cap.position.set(dir * 0.18, 0, 0);
      g.add(cap);
      const gear = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.07, 0.07), matSteelDark);
      gear.position.set(dir * 0.025, 0, 0);
      g.add(gear);
      const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.05, 32), matSpool);
      drum.rotation.z = Math.PI / 2;
      drum.position.set(dir * -0.05, 0, 0);
      drum.castShadow = true;
      g.add(drum);
      [-0.03, 0.03].forEach((dz) => {
        const fl = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.005, 32), matSteel);
        fl.rotation.z = Math.PI / 2;
        fl.position.set(dir * -0.05 + dz, 0, 0);
        g.add(fl);
      });
      const lc = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.025, 0.025), matSteelDark);
      lc.position.set(dir * -0.11, 0, 0);
      g.add(lc);
      g.position.set(x, y, 0);
      return g;
    }
    [{ x: -halfW, dir: 1 }, { x: halfW, dir: -1 }].forEach(({ x, dir }) => {
      groups.spool.add(makeSpool(x, HF - 0.35, dir));
      groups.spool.add(makeSpool(x, 0.35, dir));
    });

    /* ─── PULLEYS (static portion) + dynamic cables ─────────────
       Pulleys remain static. Cables routed dynamically each frame
       from pulley exit point → carabiner → cuff anchor on figure. */
    const pulleyAnchors = [
      { id: "RH", x: -halfW + 0.045, y: HF - 0.18, dir:  1, kind: "hand" },   // upper-left pulley → right hand of figure facing +Z
      { id: "LH", x:  halfW - 0.045, y: HF - 0.18, dir: -1, kind: "hand" },
      { id: "RA", x: -halfW + 0.045, y: 0.55,      dir:  1, kind: "ankle" },
      { id: "LA", x:  halfW - 0.045, y: 0.55,      dir: -1, kind: "ankle" },
    ];
    pulleyAnchors.forEach((p) => {
      const housing = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.08, 0.07), matSteelDark);
      housing.position.set(p.x, p.y, 0);
      groups.cable.add(housing);
      const pulley = new THREE.Mesh(new THREE.TorusGeometry(0.032, 0.008, 12, 32), matBronze);
      pulley.rotation.y = Math.PI / 2;
      pulley.position.set(p.x + p.dir * 0.025, p.y, 0);
      pulley.castShadow = true;
      groups.cable.add(pulley);
      const sheave = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.018, 16), matSteel);
      sheave.rotation.z = Math.PI / 2;
      sheave.position.set(p.x + p.dir * 0.025, p.y, 0);
      groups.cable.add(sheave);
    });

    // dynamic cable meshes (one per pulley) — replaced each frame
    const cableMeshes = pulleyAnchors.map((p) => {
      const g = new THREE.Group();
      // cable strand (rebuilt each frame as scaled cylinder)
      const strand = new THREE.Mesh(new THREE.CylinderGeometry(0.0035, 0.0035, 1, 8), matCable);
      strand.castShadow = true;
      g.add(strand);
      // carabiner near attachment
      const carabiner = new THREE.Mesh(new THREE.TorusGeometry(0.022, 0.004, 10, 24), matSteelDark);
      g.add(carabiner);
      // swage
      const swage = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.006, 0.025, 12), matSpool);
      g.add(swage);
      groups.cable.add(g);
      return { ...p, group: g, strand, carabiner, swage };
    });

    /* ─── HUMAN FIGURE ─────────────────────────────────────────
       Hierarchical rig: hips → spine → chest → (head, shoulders → arms),
       hips → (thighs → shins → feet). Each joint a Group; meshes hang
       off them. Drive in animate() by setting joint rotations + hips.y. */

    const rig = {};
    rig.hips = new THREE.Group();
    rig.hips.position.set(0, 1.0, 0);
    figure.add(rig.hips);

    // pelvis
    const pelvis = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.12, 0.16), matAttire);
    pelvis.castShadow = true;
    rig.hips.add(pelvis);

    // spine → chest
    rig.spine = new THREE.Group();
    rig.spine.position.set(0, 0.06, 0);
    rig.hips.add(rig.spine);
    rig.chest = new THREE.Group();
    rig.chest.position.set(0, 0.18, 0);
    rig.spine.add(rig.chest);
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.30, 0.36, 0.18), matAttire);
    torso.position.y = 0.10;
    torso.castShadow = true;
    rig.chest.add(torso);
    // shoulder yoke detail
    const yoke = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.04, 0.20), matAttire);
    yoke.position.y = 0.27;
    rig.chest.add(yoke);

    // neck → head
    rig.neck = new THREE.Group();
    rig.neck.position.set(0, 0.30, 0.005);
    rig.chest.add(rig.neck);
    const neckMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.045, 0.06, 12), matSkin);
    neckMesh.position.y = 0.03;
    rig.neck.add(neckMesh);
    rig.head = new THREE.Group();
    rig.head.position.set(0, 0.07, 0);
    rig.neck.add(rig.head);
    const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.085, 24, 18), matSkin);
    headMesh.position.y = 0.07;
    headMesh.castShadow = true;
    rig.head.add(headMesh);
    // hair cap
    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.088, 24, 18, 0, Math.PI * 2, 0, Math.PI * 0.55),
      new THREE.MeshStandardMaterial({ color: 0x14110d, roughness: 0.85 }));
    hair.position.y = 0.085;
    rig.head.add(hair);

    // helper to make a limb segment
    function limbSegment(parent, length, radTop, radBot, mat, ySign = -1) {
      const m = new THREE.Mesh(new THREE.CylinderGeometry(radTop, radBot, length, 14), mat);
      m.position.y = ySign * length / 2;
      m.castShadow = true;
      parent.add(m);
      return m;
    }

    // arms
    function buildArm(side) {
      const sx = side === "L" ? 0.16 : -0.16;
      const shoulder = new THREE.Group();
      shoulder.position.set(sx, 0.24, 0);
      rig.chest.add(shoulder);
      // shoulder pad
      const pad = new THREE.Mesh(new THREE.SphereGeometry(0.052, 16, 12), matAttire);
      shoulder.add(pad);

      const upperArm = new THREE.Group();
      shoulder.add(upperArm);
      limbSegment(upperArm, 0.30, 0.045, 0.038, matSkin);

      const elbow = new THREE.Group();
      elbow.position.y = -0.30;
      upperArm.add(elbow);

      const forearm = new THREE.Group();
      elbow.add(forearm);
      limbSegment(forearm, 0.27, 0.038, 0.030, matSkin);

      const wrist = new THREE.Group();
      wrist.position.y = -0.27;
      forearm.add(wrist);
      // hand
      const hand = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.10, 0.035), matSkin);
      hand.position.y = -0.05;
      wrist.add(hand);
      // wrist cuff (visual)
      const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.04, 16), matCuff);
      cuff.position.y = -0.005;
      wrist.add(cuff);

      rig[side === "L" ? "lShoulder" : "rShoulder"] = shoulder;
      rig[side === "L" ? "lUpperArm" : "rUpperArm"] = upperArm;
      rig[side === "L" ? "lElbow"    : "rElbow"]    = elbow;
      rig[side === "L" ? "lForearm"  : "rForearm"]  = forearm;
      rig[side === "L" ? "lWrist"    : "rWrist"]    = wrist;
      rig[side === "L" ? "lCuffWrist": "rCuffWrist"] = cuff;
    }
    buildArm("L");
    buildArm("R");

    // legs
    function buildLeg(side) {
      const sx = side === "L" ? 0.07 : -0.07;
      const hipJ = new THREE.Group();
      hipJ.position.set(sx, -0.06, 0);
      rig.hips.add(hipJ);

      const thigh = new THREE.Group();
      hipJ.add(thigh);
      limbSegment(thigh, 0.40, 0.062, 0.05, matAttire);

      const knee = new THREE.Group();
      knee.position.y = -0.40;
      thigh.add(knee);

      const shin = new THREE.Group();
      knee.add(shin);
      limbSegment(shin, 0.40, 0.05, 0.04, matSkin);

      const ankle = new THREE.Group();
      ankle.position.y = -0.40;
      shin.add(ankle);
      // foot
      const foot = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.045, 0.18), matSteelDark);
      foot.position.set(0, -0.025, 0.04);
      foot.castShadow = true;
      ankle.add(foot);
      // ankle cuff
      const acuff = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.05, 16), matCuff);
      acuff.position.y = 0.0;
      ankle.add(acuff);

      rig[side === "L" ? "lHip"   : "rHip"]   = hipJ;
      rig[side === "L" ? "lThigh" : "rThigh"] = thigh;
      rig[side === "L" ? "lKnee"  : "rKnee"]  = knee;
      rig[side === "L" ? "lShin"  : "rShin"]  = shin;
      rig[side === "L" ? "lAnkle" : "rAnkle"] = ankle;
      rig[side === "L" ? "lCuffAnkle" : "rCuffAnkle"] = acuff;
    }
    buildLeg("L");
    buildLeg("R");

    // attachment point helpers (world-space wrist + ankle)
    function getCuffWorldPos(cuff) {
      const v = new THREE.Vector3();
      cuff.getWorldPosition(v);
      return v;
    }

    /* ─── TOUCHSCREEN ─────────────────────────────────────────── */
    let screenStateTexture; // dynamic canvas-driven texture for screen UI
    let screenCtx, screenCanvas;
    {
      const sw = 0.36, sh = 0.22;
      const arm1 = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.04, 0.04), matSteelDark);
      arm1.position.set(-halfW + 0.04, 1.55, 0.04);
      groups.screen.add(arm1);
      const arm2 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.16), matSteel);
      arm2.position.set(-halfW + 0.13, 1.55, 0.12);
      groups.screen.add(arm2);
      const elbow = new THREE.Mesh(new THREE.SphereGeometry(0.025, 16, 12), matSteelDark);
      elbow.position.set(-halfW + 0.22, 1.55, 0.20);
      groups.screen.add(elbow);
      const bezel = new THREE.Mesh(new THREE.BoxGeometry(sw + 0.02, sh + 0.02, 0.022), matSteelDark);
      bezel.castShadow = true;

      // canvas-driven screen
      screenCanvas = document.createElement("canvas");
      screenCanvas.width = 512; screenCanvas.height = 320;
      screenCtx = screenCanvas.getContext("2d");
      screenStateTexture = new THREE.CanvasTexture(screenCanvas);
      screenStateTexture.colorSpace = THREE.SRGBColorSpace;
      const screenMat = new THREE.MeshBasicMaterial({ map: screenStateTexture });
      const screen = new THREE.Mesh(new THREE.PlaneGeometry(sw, sh), screenMat);
      screen.position.z = 0.012;
      bezel.add(screen);

      bezel.position.set(-halfW + 0.34, 1.55, 0.22);
      bezel.rotation.y = -Math.PI / 8;
      groups.screen.add(bezel);
    }

    function drawScreen(state) {
      const ctx = screenCtx;
      const W = screenCanvas.width, H = screenCanvas.height;
      ctx.fillStyle = "#0a0a0c";
      ctx.fillRect(0, 0, W, H);
      // header
      ctx.fillStyle = "#ECE7DC";
      ctx.font = "600 18px ui-monospace, Menlo, monospace";
      ctx.fillText("MODULOR", 24, 32);
      ctx.fillStyle = "#9a8e7a";
      ctx.font = "11px ui-monospace, Menlo, monospace";
      ctx.fillText("ATHLETE · K. NOVAK · #4471", 24, 50);
      // phase pill
      ctx.fillStyle = state.phase === "hold" ? "#b84030" : state.phase === "ramp" ? "#c8902a" : "#4a8a3f";
      ctx.fillRect(24, 64, 220, 28);
      ctx.fillStyle = "#ECE7DC";
      ctx.font = "600 13px ui-monospace, Menlo, monospace";
      ctx.fillText(state.phaseLabel.toUpperCase(), 36, 83);

      // force gauge (left)
      const gx = 24, gy = 110, gw = 200, gh = 70;
      ctx.strokeStyle = "#3a3530";
      ctx.strokeRect(gx, gy, gw, gh);
      ctx.fillStyle = "#5a5048";
      ctx.font = "10px ui-monospace, Menlo, monospace";
      ctx.fillText("FORCE  lb", gx + 6, gy + 14);
      ctx.fillStyle = "#ECE7DC";
      ctx.font = "600 36px ui-monospace, Menlo, monospace";
      ctx.fillText(state.force.toFixed(1).padStart(5, " "), gx + 6, gy + 54);
      // gauge bar
      const fr = Math.min(1, state.force / 30);
      ctx.fillStyle = "#1a1a1c";
      ctx.fillRect(gx, gy + gh + 6, gw, 8);
      ctx.fillStyle = state.force > 20 ? "#b84030" : state.force > 10 ? "#c8902a" : "#4a8a3f";
      ctx.fillRect(gx, gy + gh + 6, gw * fr, 8);

      // ROM gauge (right)
      const rx = 244, ry = 110, rw = 244, rh = 70;
      ctx.strokeStyle = "#3a3530";
      ctx.strokeRect(rx, ry, rw, rh);
      ctx.fillStyle = "#5a5048";
      ctx.font = "10px ui-monospace, Menlo, monospace";
      ctx.fillText("HIP FLEX  deg", rx + 6, ry + 14);
      const deg = Math.round(60 + state.rom * 35);
      ctx.fillStyle = "#ECE7DC";
      ctx.font = "600 36px ui-monospace, Menlo, monospace";
      ctx.fillText(`${deg}°`, rx + 6, ry + 54);
      // rom arc
      const cx = rx + rw - 50, cy = ry + rh / 2 + 8, radius = 28;
      ctx.strokeStyle = "#1a1a1c";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, Math.PI, Math.PI + Math.PI * 0.95);
      ctx.stroke();
      ctx.strokeStyle = "#C77B7B";
      ctx.beginPath();
      ctx.arc(cx, cy, radius, Math.PI, Math.PI + Math.PI * 0.95 * Math.min(1, state.rom));
      ctx.stroke();

      // EMG / compensation strip
      const sx2 = 24, sy2 = 200, sw2 = 464, sh2 = 50;
      ctx.fillStyle = "#1a1a1c";
      ctx.fillRect(sx2, sy2, sw2, sh2);
      ctx.strokeStyle = "#3a3530";
      ctx.strokeRect(sx2, sy2, sw2, sh2);
      ctx.fillStyle = "#5a5048";
      ctx.font = "10px ui-monospace, Menlo, monospace";
      ctx.fillText("HAMSTRING EMG", sx2 + 6, sy2 + 14);
      // wave
      ctx.strokeStyle = "#C77B7B";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      const amp = 6 + state.force * 0.8;
      for (let i = 0; i < sw2; i += 2) {
        const t = state.time * 4 + i * 0.06;
        const y = sy2 + sh2 - 12 + Math.sin(t) * amp * 0.4 + Math.sin(t * 2.7) * amp * 0.3;
        if (i === 0) ctx.moveTo(sx2 + i, y);
        else ctx.lineTo(sx2 + i, y);
      }
      ctx.stroke();

      // footer timer
      ctx.fillStyle = "#5a5048";
      ctx.font = "10px ui-monospace, Menlo, monospace";
      ctx.fillText(`PROTOCOL  HAMSTRING-A   T+${state.time.toFixed(1)}s`, 24, H - 14);
      ctx.fillStyle = "#ECE7DC";
      ctx.fillText("●", W - 32, H - 14);

      screenStateTexture.needsUpdate = true;
    }

    /* ─── DEPTH CAMERA ────────────────────────────────────────── */
    {
      const housing = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.05, 0.045), matSteelDark);
      housing.position.set(0, HF - 0.06, DF / 4);
      housing.castShadow = true;
      groups.camera.add(housing);
      [-0.05, 0.05].forEach((dx) => {
        const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.013, 0.013, 0.014, 16), matScreen);
        lens.rotation.x = Math.PI / 2;
        lens.position.set(dx, HF - 0.06, DF / 4 + 0.022);
        groups.camera.add(lens);
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.014, 0.002, 8, 24), matSpool);
        ring.position.set(dx, HF - 0.06, DF / 4 + 0.029);
        groups.camera.add(ring);
      });
      const ir = new THREE.Mesh(new THREE.CircleGeometry(0.005, 16), new THREE.MeshBasicMaterial({ color: 0x6a1a1a }));
      ir.position.set(0, HF - 0.06, DF / 4 + 0.025);
      groups.camera.add(ir);
      const mount2 = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.04, 0.10), matSteel);
      mount2.position.set(0, HF - 0.025, DF / 8);
      groups.camera.add(mount2);
    }

    /* ─── E-STOPS ─────────────────────────────────────────────── */
    [-halfW, halfW].forEach((x) => {
      const dir = x < 0 ? 1 : -1;
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.014, 24), matSteelDark);
      base.rotation.z = Math.PI / 2;
      base.position.set(x + dir * 0.045, 1.1, 0);
      groups.estop.add(base);
      const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.008, 24), matAmber);
      collar.rotation.z = Math.PI / 2;
      collar.position.set(x + dir * 0.052, 1.1, 0);
      groups.estop.add(collar);
      const button = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.034, 0.020, 24), matRed);
      button.rotation.z = Math.PI / 2;
      button.position.set(x + dir * 0.062, 1.1, 0);
      button.castShadow = true;
      groups.estop.add(button);
    });

    /* ─── CONTROL PANEL ───────────────────────────────────────── */
    const statusDomes = {};
    {
      const x = halfW, dir = -1;
      const plate = new THREE.Mesh(new THREE.BoxGeometry(0.005, 0.16, 0.18), matSteelDark);
      plate.position.set(x + dir * 0.04, 1.45, 0);
      groups.panel.add(plate);
      const stack = [
        { y: 1.52, key: "green", base: matGreen.clone() },
        { y: 1.45, key: "amber", base: matAmber.clone() },
        { y: 1.38, key: "red",   base: matRed.clone()   },
      ];
      stack.forEach(({ y, key, base }) => {
        const dome = new THREE.Mesh(new THREE.SphereGeometry(0.012, 16, 12), base);
        dome.position.set(x + dir * 0.045, y, 0.05);
        groups.panel.add(dome);
        statusDomes[key] = dome;
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.014, 0.003, 8, 16), matSteel);
        ring.position.set(x + dir * 0.045, y, 0.05);
        ring.rotation.y = Math.PI / 2;
        groups.panel.add(ring);
      });
      const inlet = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.034, 0.05), matSteel);
      inlet.position.set(x + dir * 0.043, 1.40, -0.04);
      groups.panel.add(inlet);
      const eth = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.022, 0.03), matSteel);
      eth.position.set(x + dir * 0.043, 1.36, -0.04);
      groups.panel.add(eth);
      const lbl = new THREE.Mesh(new THREE.BoxGeometry(0.005, 0.012, 0.04), new THREE.MeshBasicMaterial({ color: 0xb84030 }));
      lbl.position.set(x + dir * 0.045, 1.51, -0.05);
      groups.panel.add(lbl);
    }

    /* ─── interaction ─────────────────────────────────────────── */
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-10, -10);
    function onMove(e) {
      const r = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      mouse.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    }
    function onLeave() { mouse.x = -10; mouse.y = -10; }
    function onClick(e) {
      const r = renderer.domElement.getBoundingClientRect();
      const mx = ((e.clientX - r.left) / r.width) * 2 - 1;
      const my = -((e.clientY - r.top) / r.height) * 2 + 1;
      raycaster.setFromCamera({ x: mx, y: my }, camera);
      for (const p of PARTS) {
        const hit = raycaster.intersectObject(groups[p.id], true);
        if (hit.length) {
          if (apiRef.current.flyTo) apiRef.current.flyTo(p.id);
          return;
        }
      }
      if (apiRef.current.flyTo) apiRef.current.flyTo(null);
    }
    renderer.domElement.addEventListener("mousemove", onMove);
    renderer.domElement.addEventListener("mouseleave", onLeave);
    renderer.domElement.addEventListener("click", onClick);

    let dragging = false, sx = 0, sy = 0, ax = 0, ay = 0;
    let rotY = Math.atan2(camera.position.x, camera.position.z);
    let rotX = Math.atan2(camera.position.y - 1.1, Math.hypot(camera.position.x, camera.position.z));
    let radius = camera.position.distanceTo(new THREE.Vector3(0, 1.1, 0));
    function onDown(e) { if (apiRef.current.focused) return; dragging = true; sx = e.clientX; sy = e.clientY; ax = rotY; ay = rotX; }
    function onUp() { dragging = false; }
    function onDrag(e) {
      if (!dragging) return;
      rotY = ax - (e.clientX - sx) * 0.005;
      rotX = Math.max(-0.3, Math.min(0.9, ay + (e.clientY - sy) * 0.005));
      const r = radius;
      camera.position.x = Math.sin(rotY) * Math.cos(rotX) * r;
      camera.position.z = Math.cos(rotY) * Math.cos(rotX) * r;
      camera.position.y = 1.1 + Math.sin(rotX) * r;
      camera.lookAt(0, 1.1, 0);
    }
    renderer.domElement.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("mousemove", onDrag);

    const flyState = { active: false, t: 0, dur: 60, fromPos: new THREE.Vector3(), toPos: new THREE.Vector3(), fromLook: new THREE.Vector3(), toLook: new THREE.Vector3() };
    apiRef.current.flyTo = (partId) => {
      const home = { pos: [4.4, 2.6, 5.4], look: [0, 1.1, 0] };
      const target = partId ? PARTS.find(p => p.id === partId).focus : home;
      flyState.fromPos.copy(camera.position);
      flyState.toPos.set(...target.pos);
      flyState.fromLook.set(0, 1.1, 0);
      flyState.toLook.set(...target.look);
      flyState.t = 0; flyState.active = true;
      apiRef.current.focused = !!partId;
      setSelected(partId);
    };

    /* ─── DEMO STATE MACHINE ───────────────────────────────────
       Smoothly interpolates force + rom between phases. The pose
       is driven by `rom` (0 = neutral standing; 1 = full hamstring
       stretch — leg lifts forward, hip flexes, slight forward lean,
       arms abducted holding handles). */

    const totalDur = PHASES.reduce((s, p) => s + p.dur, 0);
    let demoT = 0;
    let lastPhaseId = "idle";

    // smoothed values for force / rom (so cables and pose blend)
    let smForce = 0, smRom = 0;

    /* ─── animate ─────────────────────────────────────────────── */
    let raf, lastTs = performance.now();
    const tmpV = new THREE.Vector3();

    function animate() {
      const now = performance.now();
      const dt = Math.min(0.05, (now - lastTs) / 1000);
      lastTs = now;

      /* fly camera */
      if (flyState.active) {
        flyState.t = Math.min(1, flyState.t + 1 / flyState.dur);
        const e = flyState.t < 0.5 ? 2 * flyState.t * flyState.t : 1 - Math.pow(-2 * flyState.t + 2, 2) / 2;
        camera.position.lerpVectors(flyState.fromPos, flyState.toPos, e);
        const look = new THREE.Vector3().lerpVectors(flyState.fromLook, flyState.toLook, e);
        camera.lookAt(look);
        if (flyState.t >= 1) {
          flyState.active = false;
          const dx = camera.position.x, dz = camera.position.z, dy = camera.position.y - flyState.toLook.y;
          rotY = Math.atan2(dx, dz);
          rotX = Math.atan2(dy, Math.hypot(dx, dz));
          radius = camera.position.distanceTo(flyState.toLook);
        }
      } else if (!dragging && !apiRef.current.focused) {
        rotY += 0.0009;
        const r = radius;
        camera.position.x = Math.sin(rotY) * Math.cos(rotX) * r;
        camera.position.z = Math.cos(rotY) * Math.cos(rotX) * r;
        camera.position.y = 1.1 + Math.sin(rotX) * r;
        camera.lookAt(0, 1.1, 0);
      }

      /* hover ray */
      raycaster.setFromCamera(mouse, camera);
      let foundId = null;
      for (const p of PARTS) {
        const hit = raycaster.intersectObject(groups[p.id], true);
        if (hit.length) { foundId = p.id; break; }
      }
      setHovered((cur) => (cur === foundId ? cur : foundId));

      Object.entries(groups).forEach(([id, g]) => {
        const isHi = id === foundId || id === selected;
        g.traverse((obj) => {
          if (obj.isMesh && obj.material && obj.material.emissive) {
            const base = id === "screen" ? 0.5 : id === "estop" ? 0.35 : id === "panel" ? 0.5 : 0;
            const target = isHi ? Math.max(base, 0.7) : base;
            obj.material.emissiveIntensity += (target - obj.material.emissiveIntensity) * 0.15;
          }
        });
      });

      /* DEMO update */
      demoT = (demoT + dt) % totalDur;
      // find current phase
      let acc = 0, currentPhase = PHASES[0], localT = 0;
      for (let i = 0; i < PHASES.length; i++) {
        if (demoT < acc + PHASES[i].dur) {
          currentPhase = PHASES[i];
          localT = (demoT - acc) / PHASES[i].dur;
          break;
        }
        acc += PHASES[i].dur;
      }
      // ease curve within phase
      const ease = localT < 0.5 ? 2 * localT * localT : 1 - Math.pow(-2 * localT + 2, 2) / 2;
      // target force / rom: blend from previous phase's end to current phase's value
      const idx = PHASES.indexOf(currentPhase);
      const prev = PHASES[(idx - 1 + PHASES.length) % PHASES.length];
      const targetForce = prev.force + (currentPhase.force - prev.force) * ease;
      const targetRom   = prev.rom   + (currentPhase.rom   - prev.rom)   * ease;
      // smooth (avoids any discontinuity)
      smForce += (targetForce - smForce) * Math.min(1, dt * 6);
      smRom   += (targetRom   - smRom)   * Math.min(1, dt * 6);

      // small idle jitter when nothing happening (breathing, micro-tremor on hold)
      const breathe = Math.sin(now * 0.002) * 0.005;
      const tremor  = currentPhase.id === "hold" ? Math.sin(now * 0.025) * 0.004 : 0;

      /* DRIVE POSE
         - hips raise slightly during stretch (weight shift)
         - chest leans back ~ rom*8°
         - right leg lifts forward: hip flex up to ~75°, knee almost straight
         - left leg stays planted, slight knee soft
         - arms raised, gripping high cables: shoulder abducted ~120°, elbow ~30° */
      const hipsBase = 1.0;
      rig.hips.position.y = hipsBase + breathe + smRom * 0.02;
      rig.hips.rotation.y = -0.08; // slight stagger
      rig.hips.rotation.x = -smRom * 0.05;

      // spine / chest
      rig.spine.rotation.x = -smRom * 0.10;
      rig.chest.rotation.x = -smRom * 0.08 + breathe * 0.5;
      rig.chest.rotation.y = Math.sin(now * 0.0015) * 0.02;
      rig.head.rotation.x = -smRom * 0.05;
      rig.head.rotation.y = Math.sin(now * 0.0011) * 0.05;

      // right leg — primary stretch leg (lifts forward)
      rig.rHip.rotation.x = smRom * 1.2 + tremor;        // hip flex
      rig.rKnee.rotation.x = -smRom * 0.15;              // mostly straight, slight
      rig.rAnkle.rotation.x = -smRom * 0.4;              // dorsiflex (toes up)

      // left leg — planted, stable, with tiny knee softness
      rig.lHip.rotation.x = 0.02;
      rig.lKnee.rotation.x = -0.08 - breathe * 2;
      rig.lAnkle.rotation.x = 0;

      // arms — both raised holding upper cables, slight outward
      // shoulders rotate so arms point upward-outward
      rig.lShoulder.rotation.z = -1.2 - smRom * 0.15;    // L shoulder abduct (left side, +x)
      rig.lShoulder.rotation.x = -0.25;
      rig.lElbow.rotation.x = -0.45;
      rig.rShoulder.rotation.z = 1.2 + smRom * 0.15;
      rig.rShoulder.rotation.x = -0.25;
      rig.rElbow.rotation.x = -0.45;

      // overall figure stagger so the lifted right leg is forward-facing for camera
      figure.rotation.y = 0;

      /* CABLES — route from each pulley to the matching cuff */
      figure.updateMatrixWorld(true);
      cableMeshes.forEach((cm) => {
        // pick the cuff target
        let cuffMesh;
        if (cm.id === "RH") cuffMesh = rig.rCuffWrist;
        else if (cm.id === "LH") cuffMesh = rig.lCuffWrist;
        else if (cm.id === "RA") cuffMesh = rig.rCuffAnkle;
        else if (cm.id === "LA") cuffMesh = rig.lCuffAnkle;

        const start = new THREE.Vector3(cm.x + cm.dir * 0.025, cm.y, 0);
        const end = new THREE.Vector3();
        cuffMesh.getWorldPosition(end);

        // place strand between start and end
        const mid = start.clone().add(end).multiplyScalar(0.5);
        const dir = end.clone().sub(start);
        const len = dir.length();
        cm.strand.position.copy(mid);
        // orient cylinder (default along +Y) to direction
        const up = new THREE.Vector3(0, 1, 0);
        const q = new THREE.Quaternion().setFromUnitVectors(up, dir.clone().normalize());
        cm.strand.quaternion.copy(q);
        cm.strand.scale.set(1, len, 1);

        // taut-ness color: redder as force rises
        const tauten = Math.min(1, smForce / 25);
        cm.strand.material.color.setRGB(0.094 + tauten * 0.25, 0.090 - tauten * 0.04, 0.102 - tauten * 0.04);

        // carabiner near end
        cm.carabiner.position.copy(end.clone().lerp(start, 0.04));
        cm.carabiner.quaternion.copy(q);
        cm.carabiner.rotation.x += Math.PI / 2;

        // swage just above carabiner
        cm.swage.position.copy(end.clone().lerp(start, 0.10));
        cm.swage.quaternion.copy(q);
      });

      /* STATUS DOMES driven by phase */
      const want = {
        idle:    { green: 1.0, amber: 0.0, red: 0.0 },
        setup:   { green: 1.0, amber: 0.0, red: 0.0 },
        calib:   { green: 0.0, amber: 1.0, red: 0.0 },
        ramp:    { green: 0.0, amber: 1.0, red: 0.0 },
        hold:    { green: 0.0, amber: 0.4, red: 1.0 },
        release: { green: 0.0, amber: 1.0, red: 0.2 },
        reset:   { green: 1.0, amber: 0.0, red: 0.0 },
      }[currentPhase.id];
      ["green", "amber", "red"].forEach((k) => {
        const m = statusDomes[k].material;
        const target = 0.2 + want[k] * 0.9;
        m.emissiveIntensity += (target - m.emissiveIntensity) * 0.12;
      });

      /* SCREEN */
      drawScreen({
        phase: currentPhase.id,
        phaseLabel: currentPhase.label,
        force: smForce,
        rom: smRom,
        time: demoT,
      });

      /* React state for overlays — only push when phase changes (cheap) or every ~10 frames for value updates */
      if (lastPhaseId !== currentPhase.id) {
        lastPhaseId = currentPhase.id;
      }
      // throttle setState ~5 hz
      if (Math.floor(demoT * 5) !== Math.floor((demoT - dt) * 5)) {
        setDemoState({
          phase: currentPhase.id,
          phaseLabel: currentPhase.label,
          t: demoT,
          force: smForce,
          rom: smRom,
        });
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    }
    animate();

    function onResize() {
      const w2 = mount.clientWidth, h2 = mount.clientHeight;
      camera.aspect = w2 / h2;
      camera.updateProjectionMatrix();
      renderer.setSize(w2, h2);
    }
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      renderer.domElement.removeEventListener("mousemove", onMove);
      renderer.domElement.removeEventListener("mouseleave", onLeave);
      renderer.domElement.removeEventListener("click", onClick);
      renderer.domElement.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("mousemove", onDrag);
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  // Lightbox keyboard nav: Esc to close, ←/→ to cycle.
  useEffect(() => {
    if (!figOpen) return;
    function onKey(e) {
      if (e.key === "Escape") { setFigOpen(null); return; }
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        const idx = ALL_FIGS.indexOf(figOpen);
        if (idx === -1) return;
        const next = (idx + (e.key === "ArrowRight" ? 1 : ALL_FIGS.length - 1)) % ALL_FIGS.length;
        setFigOpen(ALL_FIGS[next]);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [figOpen]);

  const active = selected ? PARTS.find((p) => p.id === selected) : null;
  const hov = !active && hovered ? PARTS.find((p) => p.id === hovered) : null;

  return (
    <div className="machine-3d-widget" style={{
      position: "relative", width: "100%", aspectRatio: "16 / 9",
      border: "1px solid var(--rule)",
      background: "linear-gradient(180deg, var(--paper-2), var(--paper))",
      overflow: "hidden",
    }}>
      <div ref={mountRef} style={{
        position: "absolute", inset: 0, cursor: active ? "default" : "grab",
      }} />

      {/* Part legend */}
      <div className="machine-3d-legend" style={{
        position: "absolute", top: 18, left: 18,
        background: "rgba(229,222,207,0.92)",
        backdropFilter: "blur(4px)",
        border: "1px solid var(--rule)",
        padding: "14px 16px",
        fontFamily: "var(--mono)", fontSize: 11,
        letterSpacing: "0.06em", lineHeight: 1.5,
        color: "var(--ink)", maxWidth: 240, zIndex: 2,
      }}>
        <div style={{
          fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase",
          color: "var(--graphite)", marginBottom: 10,
          borderBottom: "1px solid var(--rule)", paddingBottom: 8,
        }}>VITR · V1 prototype</div>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {PARTS.map((p, i) => {
            const isActive = selected === p.id || hovered === p.id;
            return (
              <li key={p.id}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "4px 0", cursor: "pointer",
                  color: isActive ? "var(--red)" : "inherit",
                  transition: "color 0.15s",
                }}
                onMouseEnter={() => setHovered(p.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => apiRef.current.flyTo && apiRef.current.flyTo(selected === p.id ? null : p.id)}>
                <span style={{
                  width: 18, color: "var(--graphite)", fontSize: 9,
                }}>{String(i + 1).padStart(2, "0")}</span>
                <span style={{
                  width: 6, height: 6, borderRadius: "50%",
                  border: "1px solid currentColor",
                  background: selected === p.id ? "var(--red)" : "transparent",
                }} />
                <span>{p.label}</span>
              </li>
            );
          })}
        </ul>
        <div style={{
          marginTop: 10, paddingTop: 8,
          borderTop: "1px solid var(--rule)",
          color: "var(--graphite)", fontSize: 10,
          letterSpacing: "0.14em", textTransform: "uppercase",
        }}>{selected ? "Click anywhere to return" : "Click a part to inspect"}</div>
      </div>

      {/* Live demo HUD — bottom-right when no part selected */}
      {!active && (
        <div className="machine-3d-hud" style={{
          position: "absolute", bottom: 18, right: 18,
          background: "rgba(20,17,13,0.92)", color: "var(--paper)",
          padding: "14px 18px",
          fontFamily: "var(--mono)", fontSize: 11,
          letterSpacing: "0.06em", lineHeight: 1.4,
          minWidth: 240, zIndex: 2,
          border: "1px solid rgba(236,231,220,0.18)",
        }}>
          <div style={{
            fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase",
            color: "#9a8e7a", marginBottom: 8,
            display: "flex", justifyContent: "space-between",
          }}>
            <span>Live Demo</span>
            <span>● {demoState.t.toFixed(1)}s</span>
          </div>
          <div style={{
            fontSize: 14, color: "var(--paper)", marginBottom: 10,
            letterSpacing: "0.04em",
          }}>
            <span style={{
              display: "inline-block",
              width: 8, height: 8, borderRadius: "50%",
              background: demoState.phase === "hold" ? "#b84030"
                : demoState.phase === "ramp" || demoState.phase === "calib" ? "#c8902a"
                : "#4a8a3f",
              marginRight: 8,
            }} />
            {demoState.phaseLabel}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <div style={{ color: "#9a8e7a", fontSize: 9, letterSpacing: "0.18em" }}>FORCE</div>
              <div style={{ fontSize: 18, color: "#C77B7B" }}>{demoState.force.toFixed(1)}<span style={{ fontSize: 10, color: "#9a8e7a" }}> lb</span></div>
            </div>
            <div>
              <div style={{ color: "#9a8e7a", fontSize: 9, letterSpacing: "0.18em" }}>HIP FLEX</div>
              <div style={{ fontSize: 18, color: "#C77B7B" }}>{Math.round(60 + demoState.rom * 35)}<span style={{ fontSize: 10, color: "#9a8e7a" }}>°</span></div>
            </div>
          </div>
        </div>
      )}

      {hov && !active && (
        <div style={{
          position: "absolute", bottom: 18, left: 18,
          background: "rgba(20,17,13,0.92)", color: "var(--paper)",
          padding: "8px 12px",
          fontFamily: "var(--mono)", fontSize: 10,
          letterSpacing: "0.14em", textTransform: "uppercase",
          zIndex: 2,
        }}>
          {hov.label} · click to inspect
        </div>
      )}

      {/* Detail panel */}
      <div className={"machine-3d-detail" + (active ? " is-open" : "")} style={{
        position: "absolute", top: 0, right: 0, bottom: 0,
        width: active ? "min(420px, 45%)" : 0,
        background: "var(--ink)", color: "var(--paper)",
        overflow: "hidden",
        transition: "width 0.5s cubic-bezier(.7,0,.2,1)",
        zIndex: 3,
      }}>
        {active && (
          <div style={{
            padding: "28px 28px 28px 32px",
            height: "100%", display: "flex", flexDirection: "column",
            overflowY: "auto",
            opacity: active ? 1 : 0,
            transition: "opacity 0.4s 0.2s ease",
          }}>
            <button onClick={() => apiRef.current.flyTo(null)}
              style={{
                position: "absolute", top: 16, right: 16,
                background: "transparent", border: "1px solid rgba(236,231,220,0.25)",
                color: "var(--paper-2)", padding: "6px 10px",
                fontFamily: "var(--mono)", fontSize: 10,
                letterSpacing: "0.18em", textTransform: "uppercase", cursor: "pointer",
              }}>← Back</button>
            <div style={{
              fontFamily: "var(--mono)", fontSize: 10,
              letterSpacing: "0.2em", textTransform: "uppercase",
              color: "var(--paper-3)", marginBottom: 8,
            }}>
              §01 / Component {String(PARTS.findIndex(p => p.id === active.id) + 1).padStart(2, "0")}
            </div>
            <h3 style={{
              fontFamily: "var(--display)", fontSize: 32, lineHeight: 1.05,
              letterSpacing: "-0.015em", color: "var(--paper)", margin: 0,
            }}>{active.label}</h3>
            <div style={{
              fontFamily: "var(--mono)", fontSize: 11,
              color: "#C77B7B", marginTop: 8, marginBottom: 20,
              letterSpacing: "0.06em",
            }}>{active.short}</div>

            <p style={{
              fontFamily: "var(--serif)", fontSize: 15, lineHeight: 1.55,
              color: "var(--paper-2)", marginBottom: 20,
            }}>{active.desc}</p>

            <div style={{
              borderTop: "1px solid rgba(236,231,220,0.18)",
              paddingTop: 16,
              fontFamily: "var(--mono)", fontSize: 11, lineHeight: 1.55,
            }}>
              <div style={{
                fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase",
                color: "var(--paper-3)", marginBottom: 12,
              }}>Specifications</div>
              {active.specs.map((s, i) => (
                <div key={i} style={{
                  display: "grid", gridTemplateColumns: "100px 1fr",
                  gap: 16, padding: "5px 0",
                  borderBottom: i < active.specs.length - 1 ? "1px dashed rgba(236,231,220,0.12)" : "none",
                }}>
                  <span style={{ color: "var(--paper-3)", letterSpacing: "0.04em" }}>{s[0]}</span>
                  <span style={{ color: "var(--paper)" }}>{s[1]}</span>
                </div>
              ))}
            </div>

            {active.figs && active.figs.length > 0 && (
              <div style={{
                marginTop: 22,
                borderTop: "1px solid rgba(236,231,220,0.18)",
                paddingTop: 16,
                fontFamily: "var(--mono)",
              }}>
                <div style={{
                  fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase",
                  color: "var(--paper-3)", marginBottom: 12,
                  display: "flex", justifyContent: "space-between", alignItems: "baseline",
                }}>
                  <span>Patent figures</span>
                  <span style={{ fontSize: 9, color: "rgba(236,231,220,0.4)" }}>click to open</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
                  {active.figs.map((figId) => (
                    <button key={figId}
                      onClick={() => setFigOpen(figId)}
                      style={{
                        textAlign: "left",
                        background: "rgba(236,231,220,0.04)",
                        border: "1px solid rgba(236,231,220,0.18)",
                        padding: "10px 12px",
                        cursor: "pointer",
                        color: "var(--paper)",
                        fontFamily: "var(--mono)",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(236,231,220,0.1)";
                        e.currentTarget.style.borderColor = "rgba(236,231,220,0.4)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(236,231,220,0.04)";
                        e.currentTarget.style.borderColor = "rgba(236,231,220,0.18)";
                      }}>
                      <div style={{
                        fontSize: 9, letterSpacing: "0.18em",
                        color: "#C77B7B", marginBottom: 4,
                      }}>{figId.replace("FIG-", "FIG. ")}</div>
                      <div style={{
                        fontSize: 11, lineHeight: 1.35,
                        color: "var(--paper-2)",
                      }}>{FIG_TITLES[figId]}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Global "Patent figures" button — top-right, always visible */}
      <button
        className="machine-3d-figbtn"
        onClick={() => setFigOpen(figOpen ? null : "FIG-01")}
        style={{
          position: "absolute", top: 18, right: active ? "calc(min(420px, 45%) + 18px)" : 18,
          background: "rgba(20,17,13,0.92)",
          color: "var(--paper)",
          border: "1px solid rgba(20,17,13,0.92)",
          padding: "10px 14px",
          fontFamily: "var(--mono)", fontSize: 10,
          letterSpacing: "0.18em", textTransform: "uppercase",
          cursor: "pointer", zIndex: 4,
          transition: "right 0.5s cubic-bezier(.7,0,.2,1)",
          display: "flex", alignItems: "center", gap: 8,
        }}>
        <span style={{
          display: "inline-block", width: 6, height: 6,
          background: "#C77B7B", borderRadius: "50%",
        }} />
        Patent figures · 11
      </button>

      {/* Patent figure lightbox */}
      {figOpen && <FigureLightbox figId={figOpen} onClose={() => setFigOpen(null)} onNav={setFigOpen} />}
    </div>
  );
}

/* Lightbox — fullscreen overlay rendering the SVG via fetch + dangerouslySetInnerHTML.
   Esc / arrows handled by parent. Click the dim backdrop to close. */
function FigureLightbox({ figId, onClose, onNav }) {
  const [svg, setSvg] = useState("");
  useEffect(() => {
    let cancelled = false;
    setSvg("");
    fetch(`figures/${figId}.svg`)
      .then((r) => r.text())
      .then((t) => { if (!cancelled) setSvg(t); })
      .catch(() => { if (!cancelled) setSvg(""); });
    return () => { cancelled = true; };
  }, [figId]);

  const idx = ALL_FIGS.indexOf(figId);
  const prev = ALL_FIGS[(idx + ALL_FIGS.length - 1) % ALL_FIGS.length];
  const next = ALL_FIGS[(idx + 1) % ALL_FIGS.length];

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(20,17,13,0.94)",
        zIndex: 1000,
        display: "flex", flexDirection: "column",
        animation: "modulor-fig-fade 0.25s ease-out",
      }}>
      <style>{`@keyframes modulor-fig-fade { from { opacity: 0 } to { opacity: 1 } }`}</style>

      {/* Big close X — top right, always reachable */}
      <button
        onClick={onClose}
        aria-label="Close figures"
        style={{
          position: "fixed", top: 20, right: 24,
          width: 48, height: 48,
          background: "rgba(20,17,13,0.6)",
          border: "1px solid rgba(236,231,220,0.35)",
          color: "var(--paper)",
          fontSize: 22, lineHeight: 1,
          cursor: "pointer", zIndex: 1010,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "var(--mono)",
        }}>×</button>

      {/* Top bar */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          padding: "20px 88px 20px 32px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderBottom: "1px solid rgba(236,231,220,0.12)",
          color: "var(--paper)",
          fontFamily: "var(--mono)",
        }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 16, flexWrap: "wrap" }}>
          <span style={{
            fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase",
            color: "#C77B7B",
          }}>Modulor · Patent</span>
          <span style={{
            fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase",
            color: "rgba(236,231,220,0.5)",
          }}>{figId.replace("FIG-", "FIG. ")} of 11</span>
          <span style={{
            fontSize: 14, color: "var(--paper)",
            fontFamily: "var(--display, serif)",
            letterSpacing: "0.01em",
          }}>{FIG_TITLES[figId]}</span>
        </div>
      </div>

      {/* Figure stage — backdrop click closes; SVG card stops propagation */}
      <div
        style={{
          flex: 1, position: "relative",
          padding: "32px 80px",
          display: "flex", alignItems: "center", justifyContent: "center",
          minHeight: 0,
        }}>
        {svg ? (
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "100%", maxHeight: "100%",
              background: "var(--paper, #ECE7DC)",
              padding: 24,
              boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
              border: "1px solid rgba(236,231,220,0.15)",
              overflow: "hidden",
            }}
            dangerouslySetInnerHTML={{ __html: svg.replace(
              /<svg([^>]*)>/,
              '<svg$1 style="display:block;width:100%;height:auto;max-height:75vh;">'
            ) }}
          />
        ) : (
          <div style={{
            color: "rgba(236,231,220,0.5)",
            fontFamily: "var(--mono)", fontSize: 12,
            letterSpacing: "0.2em", textTransform: "uppercase",
          }}>Loading…</div>
        )}

        {/* Prev */}
        <button
          onClick={(e) => { e.stopPropagation(); onNav(prev); }}
          aria-label="Previous figure"
          style={{
            position: "absolute", left: 24, top: "50%", transform: "translateY(-50%)",
            width: 44, height: 44,
            background: "rgba(236,231,220,0.08)",
            border: "1px solid rgba(236,231,220,0.25)",
            color: "var(--paper)", cursor: "pointer",
            fontSize: 16, fontFamily: "var(--mono)",
          }}>←</button>
        <button
          onClick={(e) => { e.stopPropagation(); onNav(next); }}
          aria-label="Next figure"
          style={{
            position: "absolute", right: 24, top: "50%", transform: "translateY(-50%)",
            width: 44, height: 44,
            background: "rgba(236,231,220,0.08)",
            border: "1px solid rgba(236,231,220,0.25)",
            color: "var(--paper)", cursor: "pointer",
            fontSize: 16, fontFamily: "var(--mono)",
          }}>→</button>
      </div>

      {/* Bottom strip — figure index */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          padding: "16px 32px 24px",
          borderTop: "1px solid rgba(236,231,220,0.12)",
          display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap",
        }}>
        {ALL_FIGS.map((f) => {
          const isActive = f === figId;
          return (
            <button
              key={f}
              onClick={() => onNav(f)}
              title={FIG_TITLES[f]}
              style={{
                background: isActive ? "var(--paper)" : "transparent",
                color: isActive ? "var(--ink)" : "rgba(236,231,220,0.6)",
                border: `1px solid ${isActive ? "var(--paper)" : "rgba(236,231,220,0.2)"}`,
                padding: "6px 10px",
                fontFamily: "var(--mono)", fontSize: 10,
                letterSpacing: "0.14em",
                cursor: "pointer",
                minWidth: 52,
              }}>
              {f.replace("FIG-", "")}
            </button>
          );
        })}
      </div>
    </div>
  );
}

window.MachineModel = MachineModel;
