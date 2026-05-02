// Desktop — XP-only surface. Renders desktop icons (left column) and
// a windowed version of every section. Sections live inside DesktopWindow.

// Maps a section id to its XP-style icon SVG. Used by Desktop, XPTaskbar,
// and DesktopWindow. Keeping the mapping in one place so adding/renaming
// a section is a single-file change.
window.XP_ICONS = {
  home:     "assets/icons/xp/home.svg",
  work:     "assets/icons/xp/work.svg",
  stack:    "assets/icons/xp/stack.svg",
  timeline: "assets/icons/xp/timeline.svg",
  contact:  "assets/icons/xp/contact.svg",
  location: "assets/icons/xp/location.svg",
};

function XPIcon({ id, size = 32, alt = "" }) {
  const src = window.XP_ICONS[id];
  if (!src) return null;
  return <img className="xp-glyph-img" src={src} width={size} height={size} alt={alt} draggable="false" />;
}
window.XPIcon = XPIcon;

function DesktopIcon({ id, label }) {
  const wm = useWM();
  const [sel, setSel] = React.useState(false);
  const lastClick = React.useRef(0);

  const onClick = (e) => {
    e.stopPropagation();
    setSel(true);
    const now = Date.now();
    if (now - lastClick.current < 350) {
      wm.open(id);
      setSel(false);
    }
    lastClick.current = now;
  };

  return (
    <button
      className={"desk-icon" + (sel ? " is-selected" : "")}
      onClick={onClick}
      onDoubleClick={(e) => { e.stopPropagation(); wm.open(id); }}
    >
      <span className="desk-icon-glyph"><XPIcon id={id} size={32} alt={label} /></span>
      <span className="desk-icon-label">{label}</span>
    </button>
  );
}

function Desktop({ children }) {
  const wm = useWM();
  const onSurfaceClick = () => {
    // deselect icons by re-rendering — we trigger via state lifted in icons,
    // but keeping it simple: each icon clears its own state via the next click.
    // Real deselect is done via direct DOM:
    document.querySelectorAll(".desk-icon.is-selected").forEach((el) => el.classList.remove("is-selected"));
  };

  return (
    <div className="xp-desktop" onMouseDown={onSurfaceClick}>
      <div className="desk-icons">
        <DesktopIcon id="home"     label="Index" />
        <DesktopIcon id="work"     label="What I do" />
        <DesktopIcon id="stack"    label="Stack" />
        <DesktopIcon id="timeline" label="Timeline" />
        <DesktopIcon id="contact"  label="Get in touch" />
      </div>

      {children}
    </div>
  );
}

window.Desktop = Desktop;
window.DesktopIcon = DesktopIcon;
