// What I do
const WHAT = [
  {
    n: "01",
    icon: Icon.arch,
    title: "Software architecture",
    body: "Certified Software Architect (iSAQB). Designing production systems end-to-end — with AI as a native part of the stack: LLM orchestration, RAG pipelines, agent workflows.",
    tags: ["iSAQB", "OpenAI", "Claude", "Gemini", "Ollama"],
  },
  {
    n: "02",
    icon: Icon.frontend,
    title: "Frontend engineering",
    body: "Modern React and Next.js apps with clean state, accessible components, and performance that doesn't regress three sprints in.",
    tags: ["TypeScript", "React", "Next.js"],
  },
  {
    n: "03",
    icon: Icon.backend,
    title: "Backend & APIs",
    body: "Robust services with Python, Java and Spring Boot — type-safe contracts, sensible domain models, test coverage that holds up under pressure.",
    tags: ["Python", "Java", "Spring", "REST"],
  },
  {
    n: "04",
    icon: Icon.cloud,
    title: "Cloud & DevOps",
    body: "Container-first delivery on Kubernetes and OpenShift. CI/CD pipelines in GitLab/GitHub Actions, infra that's reproducible.",
    tags: ["Docker", "Kubernetes", "CI/CD"],
  },
];

function WhatCard({ item, i }) {
  const m = window.motion;
  const ref = React.useRef(null);
  const inView = window.useInView(ref, { once: true, amount: 0.2 });
  return (
    <m.article
      ref={ref}
      className="what-card"
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="wc-head">
        <span className="wc-num">{item.n}</span>
        <span
          className="wc-icon"
          style={{
            background:
              ["var(--accent-a)", "var(--accent-b)", "var(--accent-c)", "var(--accent-d)"][i % 4],
          }}
        >
          {item.icon}
        </span>
      </div>
      <h3 className="wc-title">{item.title}</h3>
      <p className="wc-body">{item.body}</p>
      <ul className="wc-tags">
        {item.tags.map((t, k) => <li key={`${item.n}-${k}-${t}`}>{t}</li>)}
      </ul>
    </m.article>
  );
}

function WhatIDo() {
  return (
    <section id="work">
      <div className="sect-head">
        <div className="eyebrow">
          <span className="dot" style={{ background: "var(--accent-a)" }} />
          <span>What I do</span>
        </div>
        <h2 className="sect-title">
          Four things I'm <em>genuinely</em> good at.
        </h2>
        <p className="sect-lede">
          I work across the full stack, but my sharpest tools are below. If your project touches any of these, we'll get along.
        </p>
      </div>
      <div className="what-grid">
        {WHAT.map((it, i) => <WhatCard key={it.n} item={it} i={i} />)}
      </div>
    </section>
  );
}

window.WhatIDo = WhatIDo;
