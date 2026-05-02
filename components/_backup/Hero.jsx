// Hero
function Hero() {
  return (
    <section className="hero hero-centered" id="home">
      <div className="hero-center">
        <div className="eyebrow">
          <span className="dot" style={{ background: "var(--accent-c)" }} />
          <span>Certified Software Architect (iSAQB, since 2023)</span>
        </div>
        <h1 className="hero-title">
          Hi, I'm <em>Sven.</em><br />
          I architect <span className="u">software</span><br />
          that ships.
        </h1>
        <p className="hero-lede">
          Software Architect (iSAQB-certified) building production systems on TypeScript, Next.js and Python — with AI as a native part of the stack: OpenAI, Claude, Gemini, Ollama.
        </p>
        <div className="cta-row">
          <a href="#projects" className="btn btn-primary">
            <span>See timeline</span>
            <span className="btn-arrow">→</span>
          </a>
          <a href="#contact" className="btn btn-ghost">
            <span>Say hello</span>
          </a>
        </div>
      </div>
    </section>
  );
}

window.Hero = Hero;
