// Stack
const STACK = [
  {
    h: "AI / LLM",
    sw: "var(--accent-a)",
    items: ["OpenAI", "Claude", "Gemini", "Ollama", "RAG", "Agents"],
  },
  {
    h: "Languages & frameworks",
    sw: "var(--accent-d)",
    items: ["TypeScript", "Next.js", "React", "Python", "Java", "Spring"],
  },
  {
    h: "Cloud & tooling",
    sw: "var(--accent-c)",
    items: ["Docker", "Kubernetes", "OpenShift", "CI/CD", "Git", "GitLab"],
  },
];

function StackGroup({ g, i }) {
  const m = window.motion;
  const ref = React.useRef(null);
  const inView = window.useInView(ref, { once: true, amount: 0.3 });
  return (
    <m.div
      ref={ref}
      className="stack-group"
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
    >
      <h4>{g.h}</h4>
      <ul className="stack-chips">
        {g.items.map((it, k) => (
          <m.li
            key={it}
            className="stack-chip"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{
              duration: 0.35,
              delay: i * 0.12 + 0.2 + k * 0.04,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <span className="sw" style={{ background: g.sw }} />
            {it}
          </m.li>
        ))}
      </ul>
    </m.div>
  );
}

function Stack() {
  return (
    <section id="stack">
      <SectionHead
        eyebrow="Tech stack"
        dotColor="var(--accent-d)"
        title="The tools in regular rotation."
        titleEm="tools"
      />
      <SectionFrame title="Tech stack — Properties" icon="⚙️" tab="STACK.N64">
        <div className="stack-wrap centered-grid">
          <div className="stack-groups">
            {STACK.map((g, i) => <StackGroup g={g} i={i} key={g.h} />)}
          </div>
        </div>
      </SectionFrame>
    </section>
  );
}

window.Stack = Stack;
