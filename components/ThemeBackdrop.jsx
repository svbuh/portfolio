// ThemeBackdrop — fixed-position background layer that paints theme-specific
// scenery (Bliss hills + clouds for XP, Mario 64 sky + clouds for N64, etc).
// Lives behind .page (z-index 0) — .page sits at z-index 1.

function ThemeBackdrop({ theme }) {
  if (theme === "xp") return <BlissBackdrop />;
  if (theme === "n64") return <MarioSkyBackdrop />;
  return null;
}

function BlissBackdrop() {
  return (
    <div className="bliss-backdrop" aria-hidden="true">
      <img className="bliss-photo" src="assets/bliss.jpg" alt="" />
    </div>
  );
}

function MarioSkyBackdrop() {
  return (
    <div className="mario-backdrop" aria-hidden="true">
      <div className="mario-sky" />
      <div className="mario-clouds mario-clouds--top" />
      <div className="mario-clouds mario-clouds--mid" />
      <div className="mario-clouds mario-clouds--bot" />
    </div>
  );
}

window.ThemeBackdrop = ThemeBackdrop;
