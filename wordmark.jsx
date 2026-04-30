/* global React */
const { useState, useEffect, useRef } = React;

/* MODULOR — interactive wordmark.
   Each part of the wordmark is its own transparent PNG sharing a
   1491×1055 canvas, so the slots are pre-aligned. Phases:
     1. fall — each letter slides down from above its final slot,
        with a per-letter delay (M first, r last).
     2. lock — everything sits still in its true position for a beat.
     3. live — gentle parallax + idle bob + hover/drag engage.
   Idle and parallax magnitudes are normalized so no letter is
   noticeably more "energetic" than the others.
*/

const W = 1491;
const H = 1055;

// All letters share gentle, similar idle/parallax values.
// idle.amp = pixels of bob; idle.period = seconds per cycle.
// depth = parallax multiplier (kept tight: 0.9–1.2 across letters).
const LAYERS = [
  { id: "grid", src: "letters/grid.png", depth: 0.4,  idle: { ax: 4,  ay: 2,  pxs: 18, pys: 14 } },
  { id: "M",    src: "letters/m.png",    depth: 1.0,  idle: { ax: 3,  ay: 3,  pxs: 9,  pys: 11 } },
  { id: "o",    src: "letters/o.png",    depth: 1.05, idle: { ax: 3,  ay: 3,  pxs: 8,  pys: 10 } },
  { id: "d",    src: "letters/d.png",    depth: 1.1,  idle: { ax: 3,  ay: 3,  pxs: 10, pys: 9 } },
  { id: "u",    src: "letters/u.png",    depth: 1.0,  idle: { ax: 3,  ay: 3,  pxs: 9,  pys: 12 } },
  { id: "l",    src: "letters/l.png",    depth: 1.1,  idle: { ax: 3,  ay: 3,  pxs: 11, pys: 10 } },
  { id: "o2",   src: "letters/o2.png",   depth: 1.05, idle: { ax: 3,  ay: 3,  pxs: 8,  pys: 11 } },
  { id: "r",    src: "letters/r.png",    depth: 1.05, idle: { ax: 3,  ay: 3,  pxs: 9,  pys: 11 } },
];

// per-letter fall delay (s) — order: M, o, d, u, l, o2, r
const FALL_DELAY = {
  grid: 0,
  M:    0.05,
  o:    0.18,
  d:    0.32,
  u:    0.46,
  l:    0.60,
  o2:   0.74,
  r:    0.86,
};
const FALL_DUR  = 0.85;       // seconds
const LOCK_BUFFER = 0.4;      // pause once last letter lands
const TOTAL_FALL_MS = (FALL_DELAY.r + FALL_DUR) * 1000;
const LIVE_AT_MS    = TOTAL_FALL_MS + LOCK_BUFFER * 1000;

function HeroWordmark({ motionLevel = 1, showGrid = true }) {
  const [phase, setPhase]   = useState("fall");
  const [mounted, setMounted] = useState(false);
  const [hovered, setHover] = useState(null);
  const [drags, setDrags]   = useState({});
  const [parallax, setPx]   = useState({ x: 0, y: 0 });
  const [t, setT]           = useState(0);
  const wrapRef             = useRef(null);
  const dragState           = useRef(null);

  // Trigger entrance on next paint so the transition has a "from" → "to" delta
  useEffect(() => {
    const r = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(r);
  }, []);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("lock"), TOTAL_FALL_MS);
    const t2 = setTimeout(() => setPhase("live"), LIVE_AT_MS);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    let raf;
    const start = performance.now();
    function tick(now) {
      setT(now - start);
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (!motionLevel) return;
    function onMove(e) {
      const r = wrapRef.current?.getBoundingClientRect();
      if (!r) return;
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      setPx({
        x: ((e.clientX - cx) / r.width) * 22 * motionLevel,
        y: ((e.clientY - cy) / r.height) * 12 * motionLevel,
      });
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [motionLevel]);

  function onDown(e, id) {
    e.preventDefault();
    e.stopPropagation();
    const sx = e.clientX, sy = e.clientY;
    const orig = drags[id] || { x: 0, y: 0 };
    dragState.current = id;
    function move(ev) {
      setDrags((d) => ({ ...d, [id]: { x: orig.x + (ev.clientX - sx), y: orig.y + (ev.clientY - sy) } }));
    }
    function up() {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      dragState.current = null;
      setDrags((d) => ({ ...d, [id]: { x: 0, y: 0, snapping: true } }));
      setTimeout(() => setDrags((d) => {
        const n = { ...d }; delete n[id]; return n;
      }), 700);
    }
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  }

  return (
    <div ref={wrapRef} className="hero-wordmark-stage"
      style={{ position: "relative", aspectRatio: `${W} / ${H}`, userSelect: "none" }}>
      {LAYERS.map((L, i) => {
        if (L.id === "grid" && !showGrid) return null;
        const drag = drags[L.id] || { x: 0, y: 0, snapping: false };
        const isHover = hovered === L.id;
        const isDragging = dragState.current === L.id;
        const live = phase === "live";
        const falling = phase === "fall";
        const delay = FALL_DELAY[L.id] ?? 0;

        // idle bob — only in live phase. uniform amplitude across letters.
        const idleX = live ? Math.sin(t / 1000 * (2 * Math.PI / L.idle.pxs) + i) * L.idle.ax : 0;
        const idleY = live ? Math.cos(t / 1000 * (2 * Math.PI / L.idle.pys) + i * 1.3) * L.idle.ay : 0;

        // parallax — only in live phase
        const pxX = live ? parallax.x * L.depth : 0;
        const pxY = live ? parallax.y * L.depth : 0;

        // entrance: each letter starts above its slot with opacity 0,
        // then slides down + fades in at its scheduled delay.
        // We drive the transition off `mounted` flipping false→true on
        // first paint, so the from→to delta is real.
        const entryY = mounted ? 0 : -50;
        const entryO = mounted ? 1 : 0;

        const tx = drag.x + idleX + pxX;
        const ty = drag.y + idleY + pxY + entryY;
        const rot = live && isHover && !isDragging ? Math.sin(t / 220) * 1.0 : 0;
        const scale = live && isHover ? 1.02 : 1;

        const transition = drag.snapping
          ? "transform 0.7s cubic-bezier(.34,1.56,.64,1)"
          : isDragging
            ? "none"
            : !mounted || falling
              ? `transform ${FALL_DUR}s ${delay}s cubic-bezier(.2,.85,.3,1.05), opacity ${FALL_DUR * 0.6}s ${delay}s ease-out`
              : "transform 0.2s ease-out, opacity 0.4s ease";

        return (
          <img
            key={L.id}
            src={L.src}
            alt=""
            draggable="false"
            onMouseEnter={() => L.id !== "grid" && setHover(L.id)}
            onMouseLeave={() => L.id !== "grid" && setHover(null)}
            onMouseDown={(e) => L.id !== "grid" && onDown(e, L.id)}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              opacity: L.id === "grid" ? (!mounted ? 0 : (isHover ? 0.55 : 0.8)) : entryO,
              transform: `translate(${tx}px, ${ty}px) rotate(${rot}deg) scale(${scale})`,
              transition,
              cursor: L.id === "grid" ? "default" : (isDragging ? "grabbing" : "grab"),
              pointerEvents: L.id === "grid" ? "none" : "auto",
              filter: isHover ? "drop-shadow(0 8px 18px rgba(20, 17, 13, 0.18))" : "none",
              willChange: "transform",
              zIndex: i,
              mixBlendMode: "multiply",
            }}
          />
        );
      })}
    </div>
  );
}

window.HeroWordmark = HeroWordmark;
