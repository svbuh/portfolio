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
      {/* width/height attributes reserve the intrinsic aspect ratio so a
          late JPEG decode doesn't trigger a fixed-layer relayout — that
          relayout is the canonical iOS-Safari "URL-bar pops back mid-
          scroll" trigger. Mobile gets a 1200x800 / ~120 KB variant
          instead of the desktop 4500x3000 / 1.6 MB original. */}
      <picture>
        <source media="(max-width: 900px)" srcSet="assets/bliss-mobile.jpg" />
        <img
          className="bliss-photo"
          src="assets/bliss.jpg"
          alt=""
          width="4500"
          height="3000"
          decoding="async"
          fetchpriority="high"
        />
      </picture>
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
