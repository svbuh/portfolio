// Floating theme switcher.
// Design notes:
//  • Mouse tracking uses requestAnimationFrame + refs so the React tree
//    doesn't re-render on every pixel of motion. This eliminates flicker
//    on themes whose backgrounds/typography are expensive to repaint.
//  • The hover caption is absolutely-positioned (not a flex child), so it
//    doesn't change the pill's width on hover. Right-anchored placements
//    (like XP's top-right) used to oscillate as the pill grew/shrank.
//  • Each theme paints its own pill via CSS variables (see theme-pill.css).
function ThemePill({ theme, onChange }) {
  const themes = Object.values(window.THEMES);
  const activeIdx = Math.max(0, themes.findIndex((th) => th.id === theme));

  const [hovered, setHovered] = React.useState(false);
  const [hoverIdx, setHoverIdx] = React.useState(null);
  const [pulseId, setPulseId] = React.useState(null);

  const dotsRef = React.useRef([]);
  const mouseXRef = React.useRef(null);
  const rafRef = React.useRef(null);
  const pulseTimerRef = React.useRef(null);

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

  return (
    <div
      className={`theme-pill${hovered ? " is-hover" : ""}`}
      role="group"
      aria-label="Theme switcher"
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
            style={{
              background: `linear-gradient(135deg, ${th.swatches[0]} 0%, ${th.swatches[0]} 50%, ${th.swatches[1]} 50%, ${th.swatches[1]} 100%)`,
            }}
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
