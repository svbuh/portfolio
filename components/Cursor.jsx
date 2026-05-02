// Custom cursor — base behavior. The visual look (shape, color, shadow,
// size) is theme-owned and lives in each theme's stylesheet via the
// `body[data-theme="..."] .brut-cursor` selector.
//
// Two-element structure on purpose:
//  • Outer (.brut-cursor-pos) holds Motion's spring-driven translation
//    so the cursor follows the pointer smoothly.
//  • Inner (.brut-cursor) holds visual styles (and the `scale()` press
//    transform). Splitting these lets CSS scale the inner element
//    without fighting Motion's inline `transform: translate(...)`.
function Cursor() {
  const m = window.motion;
  const x = window.useMotionValue(-100);
  const y = window.useMotionValue(-100);
  const sx = window.useSpring(x, { stiffness: 700, damping: 50, mass: 0.4 });
  const sy = window.useSpring(y, { stiffness: 700, damping: 50, mass: 0.4 });
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const [enabled, setEnabled] = React.useState(true);

  React.useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      setEnabled(false);
      return;
    }
    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e) => {
      const t = e.target;
      if (!t || !t.closest) return;
      setHover(!!t.closest("a, button, .preset-btn, .c-link, [role='button']"));
    };
    const down = () => setPress(true);
    const up = () => setPress(false);

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    document.body.classList.add("has-custom-cursor");
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      document.body.classList.remove("has-custom-cursor");
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <m.div className="brut-cursor-pos" style={{ x: sx, y: sy }}>
      <div
        className="brut-cursor"
        data-hover={hover ? "1" : "0"}
        data-press={press ? "1" : "0"}
      />
    </m.div>
  );
}

window.Cursor = Cursor;
