// Sven Buhre — Composer
const { useState, useEffect } = React;

// Tracks viewport width so we can swap layouts at the laptop breakpoint.
// Only re-renders when actually crossing the 1024px boundary — otherwise
// every iOS-Safari URL-bar collapse fires a `resize` event, which would
// re-render the whole app tree (including <ThemeBackdrop>) on every
// scroll-direction change and trigger an XP fixed-layer repaint. With
// this guard, ordinary scrolls don't re-render anything.
function useViewport() {
  const [w, setW] = React.useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1280
  );
  React.useEffect(() => {
    const onResize = () => {
      setW((prev) => {
        const next = window.innerWidth;
        const wasDesktop = prev >= 1024;
        const isDesktop = next >= 1024;
        return wasDesktop === isDesktop ? prev : next;
      });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return w;
}

// XP-only desktop layout — sections live inside draggable windows.
// Only used on laptop+ widths; below that XP falls back to ViewSwitcher
// because draggable windows aren't usable on touch.
function XPDesktopLayout() {
  return (
    <Desktop>
      <window.InDesktopContext.Provider value={true}>
        <DesktopWindow id="home"><Hero /></DesktopWindow>
        <DesktopWindow id="work"><WhatIDo /></DesktopWindow>
        <DesktopWindow id="stack"><Stack /></DesktopWindow>
        <DesktopWindow id="timeline"><Timeline /></DesktopWindow>
        <DesktopWindow id="contact"><Contact /></DesktopWindow>
      </window.InDesktopContext.Provider>
    </Desktop>
  );
}

function App() {
  const initialDefaults = React.useMemo(
    () => ({ ...window.TWEAK_DEFAULTS, theme: window.getInitialTheme() }),
    []
  );
  const [t, setTweak] = useTweaks(initialDefaults);
  const theme = t.theme || "ps1";
  const setTheme = React.useCallback((id) => setTweak("theme", id), [setTweak]);

  useEffect(() => {
    window.applyTheme(theme);
  }, [theme]);

  const viewportW = useViewport();
  const useXPDesktop = theme === "xp" && viewportW >= 1024;

  return (
    <ThemeContext.Provider value={theme}>
    <WindowManagerProvider>
    <ThemeBackdrop theme={theme} />
    <div className="page">
      <Cursor />
      <Konami />

      {useXPDesktop ? <XPDesktopLayout /> : <ViewSwitcher />}

      <ThemePill theme={theme} onChange={setTheme} />

      <TweaksPanel title="Theme">
        <TweakSection label="Pick a vibe" />
        <div className="theme-switch">
          {Object.values(window.THEMES).map((th) => (
            <button
              key={th.id}
              className="theme-btn"
              data-active={theme === th.id ? "1" : "0"}
              onClick={() => setTweak("theme", th.id)}
            >
              <span
                className="tb-thumb"
                style={{
                  background: `linear-gradient(135deg, ${th.swatches[0]} 0%, ${th.swatches[0]} 50%, ${th.swatches[1]} 50%, ${th.swatches[1]} 100%)`,
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    bottom: 4,
                    right: 4,
                    display: "flex",
                    gap: 2,
                  }}
                >
                  {th.swatches.slice(2).map((c, i) => (
                    <span
                      key={i}
                      style={{
                        width: 8,
                        height: 8,
                        background: c,
                        border: ".5px solid rgba(0,0,0,.3)",
                      }}
                    />
                  ))}
                </span>
              </span>
              <span className="tb-name">{th.name}</span>
              <span className="tb-desc">{th.description}</span>
            </button>
          ))}
        </div>
      </TweaksPanel>
    </div>

    {/* Footer / XP taskbar lives OUTSIDE .page so its width and bottom
        edge aren't constrained by .page's max-width + bottom-padding.
        XP always gets the real <XPTaskbar> (interactive Start button +
        menu), regardless of viewport — on desktop it's fixed at the
        bottom, on mobile it flows at the end of the document. */}
    {theme === "xp" ? (
      <XPTaskbar />
    ) : (
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
    )}
    </WindowManagerProvider>
    </ThemeContext.Provider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
