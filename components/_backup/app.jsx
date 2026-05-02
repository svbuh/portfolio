// Sven Buhre — Composer
const { useState, useEffect } = React;

function App() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);

  // Apply palette tokens to :root and dark flag to body
  useEffect(() => {
    const r = document.documentElement;
    r.style.setProperty("--bg", t.bg);
    r.style.setProperty("--ink", t.ink);
    r.style.setProperty("--card", t.card);
    r.style.setProperty("--line", t.ink);
    r.style.setProperty("--accent-a", t.accentA);
    r.style.setProperty("--accent-b", t.accentB);
    r.style.setProperty("--accent-c", t.accentC);
    r.style.setProperty("--accent-d", t.accentD);
    const isDark = window.PRESETS[t.preset]?.dark;
    document.body.setAttribute("data-dark", isDark ? "1" : "0");
  }, [t]);

  const applyPreset = (name) => {
    const p = window.PRESETS[name];
    if (!p) return;
    setTweak("preset", name);
    Object.entries(p).forEach(([k, v]) => {
      if (k === "dark") return;
      setTweak(k, v);
    });
  };

  return (
    <div className="page">
      <Header />
      <Hero />
      <WhatIDo />
      <Stack />
      <Timeline />
      <Contact />

      <footer className="site-footer">
        <div className="sig">
          <span className="d" /> © 2026 Sven Buhre ·{" "}
          <a
            href="https://www.google.com/maps/place/Celle,+Germany"
            target="_blank"
            rel="noopener noreferrer"
            className="loc-link"
          >
            Celle, DE ↗
          </a>
        </div>
      </footer>

      <TweaksPanel title="Palette">
        <TweakSection label="Presets" />
        <div className="preset-grid">
          {Object.keys(window.PRESETS).map((name) => (
            <button
              key={name}
              className="preset-btn"
              data-active={t.preset === name ? "1" : "0"}
              onClick={() => applyPreset(name)}
            >
              <span className="preset-swatches">
                {["accentA", "accentB", "accentC", "accentD"].map((k) => (
                  <span key={k} className="preset-sw" style={{ background: window.PRESETS[name][k] }} />
                ))}
              </span>
              <span>{name}</span>
            </button>
          ))}
        </div>

        <TweakSection label="Fine tune" />
        <TweakColor label="Background" value={t.bg} onChange={(v) => setTweak("bg", v)} />
        <TweakColor label="Ink / text" value={t.ink} onChange={(v) => setTweak("ink", v)} />
        <TweakColor label="Card" value={t.card} onChange={(v) => setTweak("card", v)} />
        <TweakColor label="Accent A" value={t.accentA} onChange={(v) => setTweak("accentA", v)} />
        <TweakColor label="Accent B" value={t.accentB} onChange={(v) => setTweak("accentB", v)} />
        <TweakColor label="Accent C" value={t.accentC} onChange={(v) => setTweak("accentC", v)} />
        <TweakColor label="Accent D" value={t.accentD} onChange={(v) => setTweak("accentD", v)} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
