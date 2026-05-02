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

function Stack() {
  return (
    <section id="stack">
      <div className="sect-head">
        <div className="eyebrow">
          <span className="dot" style={{ background: "var(--accent-d)" }} />
          <span>Tech stack</span>
        </div>
        <h2 className="sect-title">
          The <em>tools</em> in regular rotation.
        </h2>
        <p className="sect-lede">
          I'm pragmatic about tools — these are the ones I reach for on most working days. I'm happy to pick up whatever your team already uses.
        </p>
      </div>
      <div className="stack-wrap">
        <div className="stack-groups">
          {STACK.map((g) => (
            <div className="stack-group" key={g.h}>
              <h4>{g.h}</h4>
              <ul className="stack-chips">
                {g.items.map((it) => (
                  <li key={it} className="stack-chip">
                    <span className="sw" style={{ background: g.sw }} />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

window.Stack = Stack;
