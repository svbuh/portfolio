// Konami code easter egg: ↑ ↑ ↓ ↓ ← → ← → B A
function Konami() {
  const [trigger, setTrigger] = React.useState(0);

  React.useEffect(() => {
    const seq = [
      "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
      "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
      "b", "a",
    ];
    let i = 0;
    const onKey = (e) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (k === seq[i]) {
        i += 1;
        if (i === seq.length) {
          i = 0;
          setTrigger((t) => t + 1);
        }
      } else {
        i = k === seq[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  React.useEffect(() => {
    if (!trigger) return;
    document.body.classList.add("konami-shake");
    const t1 = setTimeout(() => document.body.classList.remove("konami-shake"), 500);
    const t2 = setTimeout(() => setTrigger(0), 2600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [trigger]);

  if (!trigger) return null;

  const colors = ["var(--accent-a)", "var(--accent-b)", "var(--accent-c)", "var(--accent-d)", "var(--card)"];
  const pieces = Array.from({ length: 80 }, (_, i) => {
    const left = Math.random() * 100;
    const delay = Math.random() * 0.6;
    const dur = 1.6 + Math.random() * 1.4;
    const bg = colors[i % colors.length];
    const w = 8 + Math.floor(Math.random() * 10);
    const h = 10 + Math.floor(Math.random() * 12);
    const skew = Math.random() > 0.5 ? "skew(-8deg)" : "skew(6deg)";
    return (
      <span
        key={i}
        className="konami-piece"
        style={{
          left: `${left}vw`,
          width: w,
          height: h,
          background: bg,
          animationDuration: `${dur}s`,
          animationDelay: `${delay}s`,
          transform: skew,
        }}
      />
    );
  });

  return (
    <>
      <div className="konami-confetti" aria-hidden="true">{pieces}</div>
      <div className="konami-toast">ship it! 🚀</div>
    </>
  );
}

window.Konami = Konami;
