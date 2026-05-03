// Floating theme switcher.
//
// Desktop (>=640px): inline row of dot-buttons with hover-magnify and a
// caption tooltip — a Mac-dock-style switcher.
//
// Mobile (<640px): a single circular trigger showing the active theme's
// swatch. Tap opens a card-style menu listing every theme with name +
// description; tap outside, Escape, or the active row to close.
function ThemePill({ theme, onChange }) {
  const m = window.motion;
  const AnimatePresence = window.AnimatePresence;
  const themes = Object.values(window.THEMES);
  const activeIdx = Math.max(0, themes.findIndex((th) => th.id === theme));
  const activeTheme = themes[activeIdx];

  const [isMobile, setIsMobile] = React.useState(
    typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(max-width: 639px)").matches
      : false
  );
  const [isOpen, setIsOpen] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const [hoverIdx, setHoverIdx] = React.useState(null);
  const [pulseId, setPulseId] = React.useState(null);

  const dotsRef = React.useRef([]);
  const mouseXRef = React.useRef(null);
  const rafRef = React.useRef(null);
  const pulseTimerRef = React.useRef(null);
  const rootRef = React.useRef(null);

  // Track viewport size so we swap UI when crossing the breakpoint.
  React.useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(mq.matches);
    update();
    if (mq.addEventListener) mq.addEventListener("change", update);
    else mq.addListener(update);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", update);
      else mq.removeListener(update);
    };
  }, []);

  // Close mobile menu on outside click / Escape.
  React.useEffect(() => {
    if (!isOpen) return;
    const onClick = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("pointerdown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  // Close mobile menu on theme change (auto-collapse after pick).
  React.useEffect(() => { setIsOpen(false); }, [theme]);

  const applyMagnify = React.useCallback(() => {
    rafRef.current = null;
    const x = mouseXRef.current;
    for (let i = 0; i < dotsRef.current.length; i++) {
      const el = dotsRef.current[i];
      if (!el) continue;
      let scale = 1;
      if (x != null) {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const dist = Math.abs(x - cx);
        const radius = 56;
        if (dist <= radius) scale = 1 + (1 - dist / radius) * 0.5;
      }
      el.style.transform = scale === 1 ? "" : `scale(${scale.toFixed(3)})`;
    }
  }, []);

  const scheduleMagnify = React.useCallback(() => {
    if (rafRef.current == null) {
      rafRef.current = requestAnimationFrame(applyMagnify);
    }
  }, [applyMagnify]);

  const triggerPulse = (id) => {
    setPulseId(id);
    if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);
    pulseTimerRef.current = setTimeout(() => setPulseId(null), 280);
  };

  React.useEffect(
    () => () => {
      if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    },
    []
  );

  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "t" && e.key !== "T") return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = (e.target && e.target.tagName) || "";
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        (e.target && e.target.isContentEditable)
      )
        return;
      const dir = e.shiftKey ? -1 : 1;
      const next = window.cycleTheme(theme, dir);
      onChange(next);
      triggerPulse(next);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [theme, onChange]);

  const handleClick = (id) => {
    onChange(id);
    triggerPulse(id);
  };

  const swatchGradient = (th) =>
    `linear-gradient(135deg, ${th.swatches[0]} 0%, ${th.swatches[0]} 50%, ${th.swatches[1]} 50%, ${th.swatches[1]} 100%)`;

  if (isMobile) {
    return (
      <div className="theme-pill theme-pill--mobile" ref={rootRef}>
        <button
          type="button"
          className="theme-pill-trigger"
          aria-label={`Theme: ${activeTheme.name}. Tap to change.`}
          aria-expanded={isOpen}
          aria-haspopup="menu"
          onClick={() => setIsOpen((o) => !o)}
          style={{ background: swatchGradient(activeTheme) }}
        >
          <span className="theme-pill-trigger-ring" aria-hidden="true" />
        </button>

        <AnimatePresence>
          {isOpen ? (
            <m.div
              key="menu"
              className="theme-pill-menu"
              role="menu"
              aria-label="Choose theme"
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="theme-pill-menu-header">Theme</div>
              {themes.map((th) => (
                <button
                  key={th.id}
                  type="button"
                  role="menuitemradio"
                  aria-checked={th.id === theme}
                  className="theme-pill-menu-item"
                  data-active={th.id === theme ? "1" : "0"}
                  onClick={() => handleClick(th.id)}
                >
                  <span
                    className="theme-pill-menu-swatch"
                    style={{ background: swatchGradient(th) }}
                    aria-hidden="true"
                  />
                  <span className="theme-pill-menu-text">
                    <span className="theme-pill-menu-name">{th.name}</span>
                    <span className="theme-pill-menu-desc">{th.description}</span>
                  </span>
                  <span className="theme-pill-menu-check" aria-hidden="true">
                    {th.id === theme ? "✓" : ""}
                  </span>
                </button>
              ))}
            </m.div>
          ) : null}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div
      className={`theme-pill${hovered ? " is-hover" : ""}`}
      role="group"
      aria-label="Theme switcher"
      ref={rootRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setHoverIdx(null);
        mouseXRef.current = null;
        scheduleMagnify();
      }}
      onMouseMove={(e) => {
        mouseXRef.current = e.clientX;
        scheduleMagnify();
      }}
    >
      <div className="theme-pill-dots" style={{ "--active-idx": activeIdx }}>
        <span className="theme-pill-indicator" aria-hidden="true" />
        {themes.map((th, i) => (
          <button
            key={th.id}
            ref={(el) => (dotsRef.current[i] = el)}
            type="button"
            className={`theme-pill-dot${pulseId === th.id ? " pulse" : ""}`}
            data-active={th.id === theme ? "1" : "0"}
            aria-label={`Switch to ${th.name}`}
            aria-pressed={th.id === theme}
            onClick={() => handleClick(th.id)}
            onMouseEnter={() => setHoverIdx(i)}
            style={{ background: swatchGradient(th) }}
          />
        ))}
      </div>
      <span
        className="theme-pill-tip"
        data-show={hovered && hoverIdx != null ? "1" : "0"}
        aria-live="polite"
      >
        {hoverIdx != null ? themes[hoverIdx].name : ""}
      </span>
    </div>
  );
}

window.ThemePill = ThemePill;
