// ViewSwitcher — scroll-snap layout for non-XP-desktop modes.
// All sections are in the DOM stacked vertically; each section is
// full-viewport (min-height: 100dvh) and scroll-snap aligns to start.
// Effect: only ONE section is visible at a time, but the user can
// scroll naturally between them OR click a Hero CTA / the floating
// Next-button to jump.

const NavContext = React.createContext({ navigate: () => {} });
window.NavContext = NavContext;

const VIEW_IDS = ["home", "work", "stack", "timeline", "contact"];

function ViewSwitcher() {
  const navigate = React.useCallback((id) => {
    if (!VIEW_IDS.includes(id)) return;
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    if (typeof history !== "undefined" && history.replaceState) {
      history.replaceState(null, "", id === "home" ? "#" : `#${id}`);
    }
  }, []);

  // On mount: if URL points to a section, jump there.
  React.useEffect(() => {
    const hash = (window.location.hash || "").replace("#", "");
    if (VIEW_IDS.includes(hash) && hash !== "home") {
      requestAnimationFrame(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: "instant", block: "start" });
      });
    }
  }, []);

  // Track which section is in view → update currentId + URL hash.
  React.useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const targets = VIEW_IDS
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (!targets.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio >= 0.55) {
            const id = e.target.id;
            const next = id === "home" ? "" : `#${id}`;
            if (window.location.hash !== next) {
              history.replaceState(null, "", next || window.location.pathname);
            }
          }
        });
      },
      { threshold: [0.55] }
    );
    targets.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <NavContext.Provider value={{ navigate }}>
      <div className="snap-stage">
        <Hero />
        <WhatIDo />
        <Stack />
        <Timeline />
        <Contact />
      </div>
    </NavContext.Provider>
  );
}

window.ViewSwitcher = ViewSwitcher;
