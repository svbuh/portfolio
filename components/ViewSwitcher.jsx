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

  // Track which section is in view → update URL hash.
  // Debounced so a fast flick on mobile doesn't fire replaceState
  // dozens of times mid-scroll (which can trigger reflow / jank).
  React.useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const targets = VIEW_IDS
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (!targets.length) return;
    let pendingId = null;
    let timer = null;
    const flush = () => {
      if (!pendingId) return;
      const next = pendingId === "home" ? "" : `#${pendingId}`;
      if (window.location.hash !== next) {
        history.replaceState(null, "", next || window.location.pathname);
      }
      pendingId = null;
    };
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio >= 0.6) {
            pendingId = e.target.id;
          }
        });
        if (timer) clearTimeout(timer);
        timer = setTimeout(flush, 180);
      },
      { threshold: [0.6] }
    );
    targets.forEach((el) => obs.observe(el));
    return () => {
      obs.disconnect();
      if (timer) clearTimeout(timer);
    };
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
