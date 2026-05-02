// Cases — concrete project mini-cards (Problem → Approach → Outcome)
const CASES = [
  {
    n: "01",
    tag: "AI / LLM",
    accent: "var(--accent-a)",
    title: "Domain-aware RAG for legal docs",
    problem: "Legal team drowning in 10k+ contracts; keyword search returned noise.",
    approach: "Hybrid retrieval (BM25 + embeddings) with custom domain reranker, citation-grounded answers.",
    outcome: "Research time cut by ~70%. Lawyers verify, don't hunt.",
  },
  {
    n: "02",
    tag: "Architecture",
    accent: "var(--accent-d)",
    title: "Monolith → modular service split",
    problem: "8-year-old Spring monolith blocked every deploy; 45-min CI.",
    approach: "Strangler-fig pattern, bounded contexts, async events between modules — no big bang.",
    outcome: "Deploys daily instead of weekly. CI down to 9 min.",
  },
  {
    n: "03",
    tag: "Full-stack",
    accent: "var(--accent-c)",
    title: "AI agent for ops automation",
    problem: "Repetitive ops tickets eating 2 FTE per week.",
    approach: "Tool-using agent (Claude + custom MCP tools), human-in-the-loop for destructive actions.",
    outcome: "60% of tickets auto-resolved. Team focused on real engineering.",
  },
];

function CaseCard({ c, i }) {
  const m = window.motion;
  const ref = React.useRef(null);
  const inView = window.useInView(ref, { once: true, amount: 0.25 });
  return (
    <m.article
      ref={ref}
      className="case"
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <header className="case-head">
        <span className="case-num">{c.n}</span>
        <span className="case-tag" style={{ background: c.accent }}>
          {c.tag}
        </span>
      </header>
      <h3 className="case-title">{c.title}</h3>
      <dl className="case-body">
        <div>
          <dt>Problem</dt>
          <dd>{c.problem}</dd>
        </div>
        <div>
          <dt>Approach</dt>
          <dd>{c.approach}</dd>
        </div>
        <div>
          <dt>Outcome</dt>
          <dd className="case-outcome">{c.outcome}</dd>
        </div>
      </dl>
    </m.article>
  );
}

function Cases() {
  return (
    <section id="cases" className="cases-section">
      <SectionHead
        eyebrow="Selected cases"
        dotColor="var(--accent-a)"
        title="Real problems, shipped solutions."
        titleEm="shipped"
        lede="A few representative pieces of work — sanitized, but the shape is real."
      />
      <div className="cases-grid">
        {CASES.map((c, i) => <CaseCard key={c.n} c={c} i={i} />)}
      </div>
    </section>
  );
}

window.Cases = Cases;
