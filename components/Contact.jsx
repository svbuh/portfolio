// Contact — centered, animated
function Contact() {
  const m = window.motion;
  const ref = React.useRef(null);
  const inView = window.useInView(ref, { once: true, amount: 0.25 });

  return (
    <section id="contact">
      <m.div
        ref={ref}
        className="contact"
        initial={{ opacity: 0, y: 32 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
        
        <div className="contact-inner">
          <m.div
            className="contact-text"
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } }
            }}>
            
            <m.div
              className="eyebrow"
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
              style={{
                background: "rgb(255, 255, 255)",
                color: "var(--card)",
                borderColor: "rgba(255,255,255,.3)",
                boxShadow: "3px 3px 0 0 rgba(255,255,255,.3)"
              }}>
              
              <span className="dot" style={{ background: "var(--accent-c)", boxShadow: "0 0 0 2px rgba(255,255,255,.5)" }} />
              <span style={{ color: "rgb(0, 0, 0)" }}>Let's talk</span>
            </m.div>
            <m.h2
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
              }}>
              
              Got a project that needs <em>shipping?</em>
            </m.h2>
            <m.p
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.55 } }
              }}>
              
              I usually reply within a day. Drop a line — happy to talk
              architecture, scope, or just nerd out about LLMs.
            </m.p>
          </m.div>

          <m.div
            className="contact-links"
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08, delayChildren: 0.4 } }
            }}>
            
            {[
            { k: "Email", v: "hello@svenbuhre.de", href: "mailto:hello@svenbuhre.de" },
            { k: "GitHub", v: "github.com/svbuh", href: "https://github.com/svbuh" }].
            map((l) =>
            <m.a
              key={l.k}
              className="c-link"
              href={l.href}
              target={l.href.startsWith("http") ? "_blank" : undefined}
              rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
              variants={{
                hidden: { opacity: 0, x: 24 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
              }}>
              
                <span className="label">
                  <span className="k">{l.k}</span>
                  <span className="v">{l.v}</span>
                </span>
                <span className="arr">→</span>
              </m.a>
            )}
          </m.div>
        </div>
      </m.div>
    </section>);

}

window.Contact = Contact;