// Reusable animated section head — eyebrow + title + lede, centered + revealed
function SectionHead({ eyebrow, dotColor, title, lede, titleEm }) {
  const m = window.motion;
  const ref = React.useRef(null);
  const inView = window.useInView(ref, { once: true, amount: 0.3 });

  // Split title around <em>...</em> if titleEm provided
  const renderTitle = () => {
    if (!titleEm) return title;
    const parts = title.split(titleEm);
    return (
      <>
        {parts[0]}
        <em>{titleEm}</em>
        {parts[1]}
      </>
    );
  };

  return (
    <m.div
      ref={ref}
      className="sect-head"
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
      }}
    >
      <m.div
        className="eyebrow"
        variants={{
          hidden: { opacity: 0, y: 10 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
        }}
      >
        <span className="dot" style={{ background: dotColor }} />
        <span>{eyebrow}</span>
      </m.div>
      <m.h2
        className="sect-title"
        variants={{
          hidden: { opacity: 0, y: 18 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
        }}
      >
        {renderTitle()}
      </m.h2>
      {lede && (
        <m.p
          className="sect-lede"
          variants={{
            hidden: { opacity: 0, y: 12 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
          }}
        >
          {lede}
        </m.p>
      )}
    </m.div>
  );
}

window.SectionHead = SectionHead;
