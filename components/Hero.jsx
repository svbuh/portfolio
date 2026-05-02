// Hero — sharp single message, staggered reveal, asymmetric tilt
function Hero() {
  const m = window.motion;
  const wm = React.useContext(window.WMContext);
  const nav = React.useContext(window.NavContext || React.createContext(null));
  const theme = React.useContext(window.ThemeContext);
  const inDesktop = React.useContext(window.InDesktopContext || React.createContext(false));
  const isXPWindowed = theme === "xp" && inDesktop;

  // Three navigation modes, in priority:
  //   1) XP windowed desktop → open the matching window via WM
  //   2) ViewSwitcher mode → swap the active view via NavContext
  //   3) Fallback → smooth-scroll to the anchor (legacy long-scroll)
  const goTo = (anchor, id) => (e) => {
    e.preventDefault();
    if (isXPWindowed && wm) {
      wm.open(id);
      return;
    }
    if (nav && nav.navigate) {
      nav.navigate(id);
      return;
    }
    const el = document.querySelector(anchor);
    if (el) {
      const rect = el.getBoundingClientRect();
      const top = rect.top + window.scrollY - 20;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  // Staggered word-by-word reveal for headline
  const lineA = ["Hi,", "I'm"];
  const lineB = ["I", "architect"];
  const lineC = ["software"];
  const lineD = ["that", "ships."];

  const wordVariants = {
    hidden: { opacity: 0, y: 24, rotate: -2 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      rotate: 0,
      transition: {
        delay: 0.15 + i * 0.06,
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1]
      }
    })
  };

  let wi = 0;
  const Word = ({ children, accent }) => {
    const idx = wi++;
    return (
      <m.span
        className={`hw ${accent ? "hw-accent" : ""}`}
        initial={{ opacity: 0, y: 24, rotate: -2 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{
          delay: 0.15 + idx * 0.06,
          duration: 0.55,
          ease: [0.22, 1, 0.36, 1]
        }}>
        
        {children}
      </m.span>);

  };

  return (
    <section className="hero hero-centered" id="home">
      <div className="hero-bg-grid" aria-hidden="true" />
      <SectionFrame title="Sven Buhre — index.html" icon="🌐" tab="HOME.N64">
      <div className="hero-center">
        <h1 className="hero-title">
          <span className="hero-line">
            <Word>Hi,</Word>
            <Word><em>I'm&nbsp;Sven.</em></Word>
          </span>
          <span className="hero-line">
            <Word>I</Word>
            <Word>architect</Word>
            <Word accent>software</Word>
          </span>
          <span className="hero-line">
            <Word>that</Word>
            <Word>ships.</Word>
          </span>
        </h1>

        <m.div
            className="cta-row hero-nav"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6, ease: "easeOut" }}
            style={{ marginTop: "28px" }}>
            
          <a href="#work" className="btn btn-ghost" onClick={goTo("#work", "work")}>
            <span>Work</span>
          </a>
          <a href="#stack" className="btn btn-ghost" onClick={goTo("#stack", "stack")}>
            <span>Stack</span>
          </a>
          <a href="#timeline" className="btn btn-ghost" onClick={goTo("#timeline", "timeline")}>
            <span>Timeline</span>
          </a>
          <a href="#contact" className="btn btn-primary" style={{ padding: "13px 22px" }} onClick={goTo("#contact", "contact")}>
            <span>Get in touch</span>
            <span className="btn-arrow">→</span>
          </a>
        </m.div>
      </div>
      </SectionFrame>
    </section>);

}

window.Hero = Hero;