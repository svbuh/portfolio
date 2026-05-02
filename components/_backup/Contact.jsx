// Contact
function Contact() {
  return (
    <section id="contact">
      <div className="contact">
        <div className="contact-inner">
          <div>
            <div className="eyebrow" style={{ background: "rgba(255,255,255,.08)", color: "var(--card)", borderColor: "rgba(255,255,255,.3)", boxShadow: "3px 3px 0 0 rgba(255,255,255,.3)" }}>
              <span className="dot" style={{ background: "var(--accent-c)", boxShadow: "0 0 0 2px rgba(255,255,255,.5)" }} />
              <span>Let's talk</span>
            </div>
            <h2>
              Got a project that needs <em>shipping?</em>
            </h2>
            <p>
              I'm available for freelance, contract, and selective full-time opportunities. Drop a line — I usually reply within a day.
            </p>
          </div>
          <div className="contact-links">
            <a className="c-link" href="mailto:hello@svenbuhre.de">
              <span className="label"><span className="k">Email</span><span className="v">hello@svenbuhre.de</span></span>
              <span className="arr">→</span>
            </a>
            <a className="c-link" href="https://github.com/svbuh" target="_blank" rel="noopener noreferrer">
              <span className="label"><span className="k">GitHub</span><span className="v">github.com/svbuh</span></span>
              <span className="arr">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

window.Contact = Contact;
