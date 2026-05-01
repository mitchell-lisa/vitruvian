/* global React, ReactDOM, HeroWordmark, useNDA, NDAModal,
   TweaksPanel, useTweaks, TweakSection, TweakToggle, TweakSlider, TweakRadio */
const { useState, useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "showGuides": true,
  "motion": 1,
  "redAccent": true,
  "gridDensity": 12,
  "ndaSigned": false
}/*EDITMODE-END*/;

function ModulorMark() { return null; }

function Nav({ ndaSigned }) {
  return (
    <nav className="nav">
      <div className="container nav-inner">
        <a className="nav-mark" href="#top">
          <span>Modulor</span>
        </a>
        <div className="nav-links">
          <a href="#machine">Machine</a>
          <a href="#why">Modulor</a>
          <a href="#who">Customers</a>
          <a href="#status">Status</a>
        </div>
        <div className="nav-cta">
          {ndaSigned ? (
            <span className="nda-success" title="NDA on file"><span className="dot"/>Access</span>
          ) : null}
          <a href="deck.html" data-nda data-nda-target="deck.html" className="cta">Request Deck</a>
        </div>
      </div>
    </nav>
  );
}

function Hero({ showGuides, motion }) {
  return (
    <section className="hero" id="top">
      <div className="container">
        <div className="hero-meta">
          <div className="left">
            ▲ Modulor, Inc. · Delaware C-Corp · Est. 2026
          </div>
          <div className="center">— Patent Pending · USPTO 63/—— —</div>
          <div className="right">
            Sheet 01 / Wordmark · Construction
          </div>
        </div>

        <HeroWordmark showGuides={showGuides} motionLevel={motion} />

        <div className="hero-sub">
          <div className="col">
            <span className="stat">▼ Thesis</span>
            <p>An autonomous stretching machine that <em>measures</em> what performance medicine still estimates by eye.</p>
          </div>
          <div className="col">
            <span className="stat">▼ Built around</span>
            <p>Le Corbusier's <em>Le Modulor</em> — a proportional system rooted in the human body. We take the same first principle into modern movement science.</p>
          </div>
          <div className="col">
            <span className="stat">▼ Building for</span>
            <p>Pro athletes. Collegiate programs. Special operations. Step in, get stretched, get measured — every session, a structured record.</p>
          </div>
        </div>

        <div className="hero-cta-row">
          <a href="deck.html" data-nda className="btn">
            Request Deck <span className="arrow">→</span>
          </a>
          <a href="#machine" className="btn ghost">
            See the Machine <span className="arrow">↓</span>
          </a>
          <span className="mono" style={{ marginLeft: "auto", color: "var(--graphite)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase" }}>
            ⌘ Drag any letter
          </span>
        </div>
      </div>
    </section>
  );
}

function MachineIcon({ kind }) {
  // four simple geometric icons matching the construction-line aesthetic
  switch (kind) {
    case "anchor":
      return (
        <svg viewBox="0 0 64 64" width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <rect x="10" y="14" width="44" height="36" rx="2" />
          <line x1="10" y1="32" x2="54" y2="32" />
          <circle cx="22" cy="22" r="3" fill="currentColor"/>
          <circle cx="42" cy="22" r="3" fill="currentColor"/>
          <circle cx="22" cy="42" r="3" fill="currentColor"/>
          <circle cx="42" cy="42" r="3" fill="currentColor"/>
        </svg>
      );
    case "cable":
      return (
        <svg viewBox="0 0 64 64" width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <circle cx="14" cy="20" r="6"/>
          <circle cx="50" cy="44" r="6"/>
          <path d="M 14 26 Q 32 32 50 38" strokeDasharray="3 4"/>
          <line x1="14" y1="14" x2="14" y2="6"/>
          <line x1="50" y1="50" x2="50" y2="58"/>
        </svg>
      );
    case "sensor":
      return (
        <svg viewBox="0 0 64 64" width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <line x1="6" y1="36" x2="14" y2="36"/>
          <path d="M 14 36 L 22 36 L 26 24 L 32 48 L 38 28 L 42 36 L 50 36"/>
          <line x1="50" y1="36" x2="58" y2="36"/>
          <circle cx="32" cy="36" r="2" fill="currentColor"/>
        </svg>
      );
    case "vision":
      return (
        <svg viewBox="0 0 64 64" width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <circle cx="32" cy="32" r="20"/>
          <circle cx="32" cy="32" r="10"/>
          <circle cx="32" cy="32" r="3" fill="currentColor"/>
          <line x1="6" y1="32" x2="12" y2="32"/>
          <line x1="52" y1="32" x2="58" y2="32"/>
          <line x1="32" y1="6" x2="32" y2="12"/>
          <line x1="32" y1="52" x2="32" y2="58"/>
        </svg>
      );
  }
}

function MachineSection() {
  const steps = [
    { num: "01", icon: "anchor", title: "Strap In", body: "Athlete steps onto the platform; clinician selects protocol on the touchscreen. Quick-release cuffs in under a minute." },
    { num: "02", icon: "cable",  title: "Get Stretched", body: "Two cables, motor-controlled to within ±0.2 lb. Force ramps at 0.5 lb/sec, hard-capped at 30 lb. PID compliance backs off the moment the athlete resists." },
    { num: "03", icon: "sensor", title: "Measure", body: "Inline load cells sample tension at 100 Hz; rotary encoders track exact cable extension. Joint angle to within 2°, asymmetry to within 1.4%." },
    { num: "04", icon: "vision", title: "Detect Compensation", body: "Overhead depth camera reads skeleton pose. Pelvis rotation, trunk shift, knee bend — flagged in real time, logged to the AMS." },
  ];
  return (
    <section className="section" id="machine">
      <div className="container">
        <div className="section-head">
          <div className="num"><span className="dot"/>§01 / The Machine</div>
          <h2>VITR · The first mobility platform that measures what it does.</h2>
        </div>

        <div className="machine-3d-section">
          {window.MachineModel ? <window.MachineModel /> : <div className="machine-3d-stub">Loading model…</div>}
        </div>

        <div className="machine-grid" style={{ marginTop: 64 }}>
          {steps.map((s) => (
            <div className="machine-step" key={s.num}>
              <div className="num">Step {s.num}</div>
              <div className="icon"><MachineIcon kind={s.icon}/></div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhySection() {
  return (
    <section className="section dark" id="why">
      <div className="container">
        <div className="section-head">
          <div className="num"><span className="dot"/>§02 / The Name</div>
          <h2 style={{ color: "var(--paper)" }}>Why "Modulor."</h2>
        </div>
        <div className="why">
          <div className="why-text">
            <p>In 1945, Le Corbusier published <em>Le Modulor</em>: a system of proportions derived from the human body and tuned to the golden section. He used it to design buildings that fit people — at the scale of a hand on a banister and an arm raised overhead.</p>
            <div className="pull">A measure, taken from the body, given back to the body.</div>
            <p>We took the name because the same first principle runs through what we're building. Performance medicine has measurements for force, output, recovery, fatigue. It has none — at scale, in repeatable units — for the tissue that actually tears.</p>
            <p>Modulor is the measurement system for that tissue. Cable, sensor, vision. Every session, every rep, a structured record.</p>
          </div>
          <div className="why-figure">
            <img src="modulor-man-le-corbusier.webp" alt="Le Corbusier — Le Modulor, 1945"/>
            <div className="cap">Fig. 02 — Le Corbusier, Le Modulor (1945)</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhoSection() {
  const cards = [
    {
      tag: "Buyer 01", title: "Pro Sports", sub: "NFL · NBA · MLS · Premier League",
      body: "Performance and recovery staff who already buy force plates, GPS, HRV — and have nothing comparable for tissue.",
      list: ["First-pilot wedge", "Capex + SaaS sale", "$50–250k ACV"]
    },
    {
      tag: "Buyer 02", title: "Collegiate", sub: "D1 strength · sports medicine",
      body: "Programs running 800+ athletes through one S&C department. The volume site for pilot data and longitudinal corpus.",
      list: ["Highest data volume", "Conference-level rollout", "Athlete-month corpus"]
    },
    {
      tag: "Buyer 03", title: "Military SOF", sub: "USSOCOM · 711 HPW · Special Warfare",
      body: "Tactical training partners. Non-dilutive capital channel via SBIR/AFWERX, not the first-pilot source.",
      list: ["Strategic moat", "SBIR / AFWERX path", "Tactical readiness"]
    },
  ];
  return (
    <section className="section" id="who">
      <div className="container">
        <div className="section-head">
          <div className="num"><span className="dot"/>§03 / The Customers</div>
          <h2>Three markets. One platform.</h2>
        </div>
        <div className="who-grid">
          {cards.map((c) => (
            <div className="who-card" key={c.title}>
              <div className="who-num">{c.tag}</div>
              <div className="who-sub">{c.sub}</div>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
              <ul className="who-list">
                {c.list.map((li) => <li key={li}>— {li}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ThesisSection() {
  return (
    <section className="section" id="thesis">
      <div className="container">
        <div className="section-head">
          <div className="num"><span className="dot"/>§04 / The Thesis</div>
          <h2>Measure what's missing.</h2>
        </div>
        <p className="thesis-quote">
          Force plates measure power. GPS measures output. HRV measures recovery.
          Nothing measures the <em>tissue that actually tears</em> — not at matched load, not longitudinally, not at scale.
        </p>
        <div className="thesis-stats">
          <div className="thesis-stat">
            <div className="big">#1<sup>↑</sup></div>
            <div className="lab">Cause of lost time</div>
            <div className="desc">Soft-tissue injury remains the leading cause of lost time across elite sport and high-performance military units.</div>
          </div>
          <div className="thesis-stat">
            <div className="big">0%<sup>·</sup></div>
            <div className="lab">Home-PT compliance</div>
            <div className="desc">Compliance jumps to 100% when the clinician is present. The machine is the present clinician.</div>
          </div>
          <div className="thesis-stat">
            <div className="big">∅<sup>·</sup></div>
            <div className="lab">Existing dataset</div>
            <div className="desc">No structured, longitudinal corpus of soft-tissue range under matched load exists. We are building it.</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatusSection() {
  const rows = [
    { k: "IP", v: "USPTO provisional filed Apr 15, 2026.", pill: "Patent pending", live: true },
    { k: "Prototype", v: "Mechanical + electrical BOM finalized. Build underway.", pill: "In build", live: false },
    { k: "Pilots", v: "Design partner conversations active across pro sport and performance medicine.", pill: "In conversation", live: false },
    { k: "Stage", v: "Pre-revenue. Raising a seed round with strategic co-investors.", pill: "Seed", live: false },
    { k: "Team", v: "Founder/CEO, CTO, and a strategic advisor in performance science.", pill: "3", live: false },
  ];
  return (
    <section className="section dark" id="status">
      <div className="container">
        <div className="section-head">
          <div className="num"><span className="dot"/>§05 / Status</div>
          <h2 style={{ color: "var(--paper)" }}>Where we are.</h2>
        </div>
        <table className="status-table">
          <tbody>
            {rows.map((r) => (
              <tr key={r.k}>
                <th>{r.k}</th>
                <td>
                  {r.v}
                  <span className={"status-pill " + (r.live ? "live" : "in")}>{r.pill}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ContactSection({ ndaSigned }) {
  return (
    <section className="section" id="deck">
      <div className="container">
        <div className="contact-stage">
          <div className="num mono" style={{ color: "var(--graphite)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 14 }}>
            <span style={{ display: "inline-block", width: 6, height: 6, background: "var(--red)", borderRadius: "50%", verticalAlign: "middle", marginRight: 8, transform: "translateY(-2px)" }}/>§06 / Contact
          </div>
          <h2>Step in.</h2>
          <p>For potential partners, co-investors and pilot programs. Investor materials are available under NDA — sign once, access everything.</p>
          <div className="contact-row">
            {ndaSigned ? (
              <>
                <a href="deck.html" className="btn">Open Deck <span className="arrow">→</span></a>
                <a href="figures/index.html" className="btn ghost">Patent Figures <span className="arrow">→</span></a>
                <a href="mailto:hello@modulor.bio" className="btn ghost">hello@modulor.bio</a>
              </>
            ) : (
              <>
                <a href="deck.html" data-nda data-nda-target="deck.html" className="btn">Request Deck <span className="arrow">→</span></a>
                <a href="deck.html" data-nda data-nda-target="deck.html" className="btn ghost">Access Data Room</a>
                <a href="mailto:hello@modulor.bio" className="btn ghost">hello@modulor.bio</a>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer>
      <div className="container foot-inner">
        <div className="foot-mark">Modulor, Inc.</div>
        <div className="foot-mid">2026 · Actuarial infrastructure for musculoskeletal injury risk</div>
        <div className="foot-right">Dover, DE · modulor.bio</div>
      </div>
    </footer>
  );
}

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const nda = useNDA();
  const [flash, setFlash] = useState(null);

  useEffect(() => {
    function onComplete(e) {
      setFlash("NDA on file — full materials unlocked.");
      setTimeout(() => setFlash(null), 4000);
    }
    window.addEventListener("modulor-nda-complete", onComplete);
    return () => window.removeEventListener("modulor-nda-complete", onComplete);
  }, []);

  // Apply red accent toggle
  useEffect(() => {
    if (!tweaks.redAccent) {
      document.documentElement.style.setProperty("--red", "oklch(0.45 0 0)");
      document.documentElement.style.setProperty("--red-soft", "oklch(0.45 0 0 / 0.32)");
      document.documentElement.style.setProperty("--red-faint", "oklch(0.45 0 0 / 0.14)");
    } else {
      document.documentElement.style.removeProperty("--red");
      document.documentElement.style.removeProperty("--red-soft");
      document.documentElement.style.removeProperty("--red-faint");
    }
  }, [tweaks.redAccent]);

  return (
    <>
      <div className="grid-ruler" style={{
        backgroundSize: `calc(100% / ${tweaks.gridDensity}) 100%`,
        opacity: tweaks.gridDensity > 0 ? 0.35 : 0,
      }}/>
      <Nav ndaSigned={nda.signed}/>
      <Hero showGuides={tweaks.showGuides} motion={tweaks.motion}/>
      <MachineSection/>
      <WhySection/>
      <WhoSection/>
      <ThesisSection/>
      <StatusSection/>
      <ContactSection ndaSigned={nda.signed}/>
      <Footer/>

      {flash ? (
        <div style={{
          position: "fixed", bottom: 24, left: 24, zIndex: 100,
          background: "var(--ink)", color: "var(--paper)",
          padding: "14px 20px", borderRadius: 999,
          fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase",
          display: "flex", alignItems: "center", gap: 10,
          boxShadow: "0 12px 28px rgba(0,0,0,0.2)",
        }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--red)" }}/>
          {flash}
        </div>
      ) : null}

      {nda.open ? (
        <NDAModal
          target={nda.target}
          onClose={() => nda.setOpen(false)}
          onComplete={nda.complete}
        />
      ) : null}

      <TweaksPanel title="Tweaks">
        <TweakSection title="Construction">
          <TweakToggle label="Construction lines" value={tweaks.showGuides} onChange={(v) => setTweak("showGuides", v)} />
          <TweakToggle label="Red accent" value={tweaks.redAccent} onChange={(v) => setTweak("redAccent", v)} />
          <TweakSlider label="Grid columns" value={tweaks.gridDensity} onChange={(v) => setTweak("gridDensity", v)} min={0} max={24} step={2} />
        </TweakSection>
        <TweakSection title="Motion">
          <TweakSlider label="Parallax intensity" value={tweaks.motion} onChange={(v) => setTweak("motion", v)} min={0} max={3} step={0.5} />
        </TweakSection>
        <TweakSection title="Access">
          <TweakToggle
            label={nda.signed ? "NDA on file" : "NDA not signed"}
            value={nda.signed}
            onChange={(v) => {
              if (!v) {
                localStorage.removeItem("modulor_nda");
                window.location.reload();
              }
            }}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
