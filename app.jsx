// Sven Buhre — Composer
const { useState, useEffect } = React;

// Inner content used by all themes — sections one after another (long scroll).
function ScrollSections() {
  return (
    <>
      <Hero />
      <WhatIDo />
      <Stack />
      <Timeline />
      <Contact />
    </>
  );
}

// XP-only desktop layout — sections live inside draggable windows.
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

  const isXP = theme === "xp";

  return (
    <ThemeContext.Provider value={theme}>
    <WindowManagerProvider>
    <ThemeBackdrop theme={theme} />
    <div className="page">
      <Cursor />
      <Konami />

      {isXP ? <XPDesktopLayout /> : <ScrollSections />}

      <ThemePill theme={theme} onChange={setTheme} />

      {isXP ? (
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
    </WindowManagerProvider>
    </ThemeContext.Provider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
