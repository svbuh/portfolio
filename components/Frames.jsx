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

// SectionFrame — stable wrapper, theme decides chrome via className.
//
// Why not switch React component types per theme? When SectionFrame
// returned <XPWindow> vs <N64Cartridge> vs <Fragment>, the children's
// immediate parent React-element type changed on theme switch → React
// unmounted the entire subtree → every Framer `initial={{opacity:0}}`
// + `useInView({once:true})` reset → visible flicker as the reveal
// animations replayed. Now the body div is always at the same JSX
// position (index 2) with the same component type (div), so React
// keeps the subtree mounted across theme changes.
function SectionFrame({ title, icon, statusbar, tab, children }) {
  const t = useCurrentTheme();
  const inDesktop = React.useContext(window.InDesktopContext || React.createContext(false));
  if (t === "xp" && inDesktop) return <>{children}</>;

  const outerCls =
    "section-frame section-frame--" + t +
    (t === "xp" ? " xp-window" : "") +
    (t === "n64" ? " n64-cartridge" : "");
  const bodyCls =
    "section-frame-body" +
    (t === "xp" ? " xp-body" : "") +
    (t === "n64" ? " n64-cart-label" : "");

  return (
    <div className={outerCls}>
      {t === "xp" ? (
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
      ) : null}
      {t === "n64" ? (
        <div className="n64-cart-tab">
          <span>{tab || title}</span>
          <span className="stripe">
            <span /><span /><span /><span />
          </span>
        </div>
      ) : null}
      <div className={bodyCls}>{children}</div>
      {t === "xp" && statusbar ? <div className="xp-statusbar">{statusbar}</div> : null}
    </div>
  );
}

window.XPWindow = XPWindow;
window.N64Cartridge = N64Cartridge;
window.SectionFrame = SectionFrame;
