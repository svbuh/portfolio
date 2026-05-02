// Frame wrappers — chrome that wraps section content per theme.
// Reads current theme via React Context so it re-renders on theme change.

const ThemeContext = React.createContext("ps1");
window.ThemeContext = ThemeContext;

const InDesktopContext = React.createContext(false);
window.InDesktopContext = InDesktopContext;

function useCurrentTheme() {
  return React.useContext(ThemeContext);
}
window.useCurrentTheme = useCurrentTheme;

// Marlett-like glyphs via plain unicode (Marlett may not be installed)
function XPWindow({ title, icon, children, statusbar }) {
  return (
    <div className="xp-window">
      <div className="xp-titlebar">
        <div className="xp-title">
          {icon ? <span className="xp-icon">{icon}</span> : null}
          <span>{title}</span>
        </div>
        <div className="xp-controls">
          <button className="xp-ctrl" aria-label="Minimize" tabIndex={-1}>_</button>
          <button className="xp-ctrl" aria-label="Maximize" tabIndex={-1}>▢</button>
          <button className="xp-ctrl close" aria-label="Close" tabIndex={-1}>✕</button>
        </div>
      </div>
      <div className="xp-body">{children}</div>
      {statusbar ? <div className="xp-statusbar">{statusbar}</div> : null}
    </div>
  );
}

function N64Cartridge({ tab, children }) {
  return (
    <div className="n64-cartridge">
      <div className="n64-cart-tab">
        <span>{tab}</span>
        <span className="stripe">
          <span /><span /><span /><span />
        </span>
      </div>
      <div className="n64-cart-label">{children}</div>
    </div>
  );
}

// SectionFrame — picks frame based on current theme via Context.
// Skips wrapping when inside a DesktopWindow (XP desktop mode).
function SectionFrame({ title, icon, statusbar, tab, children }) {
  const t = useCurrentTheme();
  const inDesktop = React.useContext(window.InDesktopContext || React.createContext(false));
  if (t === "xp") {
    if (inDesktop) return <>{children}</>;
    return <XPWindow title={title} icon={icon} statusbar={statusbar}>{children}</XPWindow>;
  }
  if (t === "n64") {
    return <N64Cartridge tab={tab || title}>{children}</N64Cartridge>;
  }
  return <>{children}</>;
}

window.XPWindow = XPWindow;
window.N64Cartridge = N64Cartridge;
window.SectionFrame = SectionFrame;
