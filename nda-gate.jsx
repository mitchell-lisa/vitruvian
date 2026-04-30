/* global React */
const { useState, useEffect, useRef } = React;

/* NDA gate — modal with signature pad. Stores agreement to
   localStorage so user only signs once per browser. Triggered
   when user clicks any [data-nda] link/button. */

function useNDA() {
  const [signed, setSigned] = useState(() => {
    try { return !!JSON.parse(localStorage.getItem("modulor_nda") || "null"); }
    catch { return false; }
  });
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState(null);

  useEffect(() => {
    function onClick(e) {
      const el = e.target.closest("[data-nda]");
      if (!el) return;
      e.preventDefault();
      if (signed) {
        const raw = el.getAttribute("href") || el.getAttribute("data-nda-target");
        const dest = raw && /^[\w./-]+\.html?$/i.test(raw) ? raw : "deck.html";
        window.location.href = dest;
        return;
      }
      setTarget(el.getAttribute("href") || el.getAttribute("data-nda-target"));
      setOpen(true);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [signed]);

  function complete(record) {
    localStorage.setItem("modulor_nda", JSON.stringify(record));
    setSigned(true);
    setOpen(false);
    const evt = new CustomEvent("modulor-nda-complete", { detail: { target, record } });
    window.dispatchEvent(evt);
    // Route the user to the gated destination (defaults to deck.html).
    const dest = target && /^[\w./-]+\.html?$/i.test(target) ? target : "deck.html";
    setTimeout(() => { window.location.href = dest; }, 350);
  }

  return { signed, open, setOpen, target, complete };
}

function SignaturePad({ onChange }) {
  const ref = useRef(null);
  const drawing = useRef(false);
  const last = useRef(null);
  const [empty, setEmpty] = useState(true);

  useEffect(() => {
    const canvas = ref.current;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#14110D";
    ctx.lineWidth = 1.6;
  }, []);

  function getPos(e) {
    const r = ref.current.getBoundingClientRect();
    const t = e.touches ? e.touches[0] : e;
    return { x: t.clientX - r.left, y: t.clientY - r.top };
  }
  function start(e) {
    e.preventDefault();
    drawing.current = true;
    last.current = getPos(e);
  }
  function move(e) {
    if (!drawing.current) return;
    e.preventDefault();
    const p = getPos(e);
    const ctx = ref.current.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
    if (empty) {
      setEmpty(false);
      onChange?.(true);
    }
  }
  function end() { drawing.current = false; }

  function clear() {
    const c = ref.current;
    const ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    setEmpty(true);
    onChange?.(false);
  }

  return (
    <div>
      <canvas
        ref={ref}
        className="signature-pad"
        onMouseDown={start} onMouseMove={move}
        onMouseUp={end} onMouseLeave={end}
        onTouchStart={start} onTouchMove={move} onTouchEnd={end}
      />
      <div className="sig-actions">
        <span>{empty ? "Sign with mouse or finger" : "Signed"}</span>
        <button onClick={clear} type="button">Clear</button>
      </div>
    </div>
  );
}

function NDAModal({ onClose, onComplete, target }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [org, setOrg] = useState("");
  const [agree, setAgree] = useState(false);

  const ready = name.trim() && /\S+@\S+\.\S+/.test(email) && agree;

  function submit(e) {
    e.preventDefault();
    if (!ready) return;
    onComplete({
      name, email, org,
      target,
      signatureMethod: "checkbox-affirmation",
      signedAt: new Date().toISOString(),
    });
  }

  return (
    <div className="nda-overlay" onClick={onClose}>
      <form className="nda-modal" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <button type="button" className="nda-close" onClick={onClose} aria-label="Close">×</button>
        <div className="nda-mark">▲ Restricted · Confidentiality required</div>
        <h3>One-way NDA</h3>
        <p>Modulor's investor materials, technical specs and patent filings are private. Affirm the terms below to access.</p>

        <div className="terms">
          <strong>MODULOR, INC. — ONE-WAY NON-DISCLOSURE AGREEMENT</strong><br/><br/>
          By checking the box below, you agree that any non-public information disclosed by Modulor, Inc. ("Disclosing Party")
          including but not limited to product specifications, prototype designs, sensor architecture, machine
          learning models, financial models, cap table, customer pipeline, and patent filings constitutes
          Confidential Information. You agree to (a) hold all such information in strict confidence for a period
          of two (2) years from the date below, (b) use such information solely to evaluate a potential business
          relationship, and (c) not disclose, reproduce, or reverse-engineer any such information without
          Modulor's prior written consent. Your name, email, IP address, and timestamp constitute your electronic
          signature under the E-SIGN Act and UETA. Governed by Delaware law.
        </div>

        <label htmlFor="nda-name">Full legal name</label>
        <input id="nda-name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />

        <label htmlFor="nda-email">Email</label>
        <input id="nda-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@firm.com" />

        <label htmlFor="nda-org">Organization (optional)</label>
        <input id="nda-org" type="text" value={org} onChange={(e) => setOrg(e.target.value)} placeholder="Firm or team" />

        <label className="agree" style={{ display: "flex", marginTop: 18 }}>
          <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
          <span>
            I, <strong>{name.trim() || "the undersigned"}</strong>, have read and agree to the terms of the Modulor, Inc. one-way NDA above.
            This checkbox constitutes my legal electronic signature.
          </span>
        </label>

        <div className="nda-actions">
          <button type="button" className="btn ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn" disabled={!ready} style={{ opacity: ready ? 1 : 0.4 }}>
            Sign &amp; Continue <span className="arrow">→</span>
          </button>
        </div>
      </form>
    </div>
  );
}

window.useNDA = useNDA;
window.NDAModal = NDAModal;
