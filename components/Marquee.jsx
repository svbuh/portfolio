// Marquee — endlessly scrolling brutalist band
function Marquee({ items, dir = "left", speed = 40, accent = "var(--accent-b)" }) {
  const content = [...items, ...items, ...items, ...items];
  return (
    <div className="marquee" data-dir={dir}>
      <div
        className="marquee-track"
        style={{
          animationDuration: `${speed}s`,
          animationDirection: dir === "right" ? "reverse" : "normal",
        }}
      >
        {content.map((it, i) => (
          <span className="marquee-item" key={i}>
            <span className="marquee-dot" style={{ background: accent }} />
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}

window.Marquee = Marquee;
