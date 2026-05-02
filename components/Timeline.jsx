// Timeline — animated with Framer Motion
const TIMELINE = [
{
  period: "01/2025 — today",
  role: "Software Architect",
  org: "iSAQB-certified · since 2023",
  body: "Designing production systems end-to-end with AI as a native part of the stack — LLM orchestration across OpenAI, Claude, Gemini and Ollama, deployed on TypeScript / Next.js / Python via CI/CD.",
  tags: ["TypeScript", "Next.js", "Python", "OpenAI", "Claude", "Gemini", "Ollama", "CI/CD"],
  current: true
},
{
  period: "2022 — 2024",
  role: "Software Architect & Senior Full Stack Engineer",
  org: "iSAQB-certified · from 2023",
  body: "Architecting and building maintainable full-stack systems with Java, Spring, TypeScript and React — services, APIs and UIs that teams have to live with long after launch.",
  tags: ["iSAQB", "Java", "Spring", "TypeScript", "React", "Next.js"]
},
{
  period: "2020 — 2022",
  role: "Senior Software Engineer",
  org: "Cloud & DevOps",
  body: "Container-first delivery on Kubernetes and OpenShift, CI/CD pipelines in GitLab and GitHub Actions, infra that's reproducible across environments.",
  tags: ["Docker", "Kubernetes", "OpenShift", "GitLab"]
},
{
  period: "2016 — 2020",
  role: "Software Engineer",
  org: "Foundations",
  body: "Years of hands-on engineering across the JVM and JavaScript ecosystems — the foundation for everything since.",
  tags: ["Java", "JavaScript", "Git"]
}];


function TimelineItem({ t, i, total }) {
  const m = window.motion;
  const ref = React.useRef(null);
  const inView = window.useInView(ref, { once: true, amount: 0.35 });

  // Stagger: dot first, then meta, then card
  const base = 0.08; // delay between siblings
  const itemDelay = i * 0.18;

  return (
    <li ref={ref} className="tl-item" data-current={t.current ? "1" : "0"} data-last={i === total - 1 ? "1" : "0"}>
      {/* Dot — pops in with overshoot */}
      <m.span
        className="tl-dot"
        initial={{ scale: 0, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{
          delay: itemDelay,
          duration: 0.5,
          type: "spring",
          stiffness: 380,
          damping: 18
        }} />
      
      {/* Pulse ring on current */}
      {t.current &&
      <m.span
        className="tl-pulse"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={inView ? { scale: [0.8, 1.6, 0.8], opacity: [0.6, 0, 0.6] } : {}}
        transition={{
          delay: itemDelay + 0.3,
          duration: 2.4,
          repeat: Infinity,
          ease: "easeInOut"
        }} />

      }
      {/* Meta — slides in from left */}
      <m.div
        className="tl-meta"
        initial={{ opacity: 0, x: -16 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{
          delay: itemDelay + base,
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1]
        }}>
        
        <div className="tl-period">{t.period}</div>
        <div className="tl-org" style={{ width: "136px", color: "rgb(0, 0, 0)" }}>{t.org}</div>
      </m.div>
      {/* Card — slides in from right */}
      <m.div
        className="tl-main"
        initial={{ opacity: 0, x: 32 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{
          delay: itemDelay + base * 2,
          duration: 0.55,
          ease: [0.22, 1, 0.36, 1]
        }}>
        
        <h3 className="tl-role" style={{ color: "rgb(0, 0, 0)" }}>
          {t.role}
          {t.current && <span className="tl-badge" style={{ color: "rgb(255, 255, 255)" }}>Now</span>}
        </h3>
        <p className="tl-body">{t.body}</p>
        <ul className="tl-tags">
          {t.tags.map((tag, k) =>
          <m.li
            key={tag}
            initial={{ opacity: 0, y: 6 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: itemDelay + 0.4 + k * 0.04, duration: 0.3 }}>
            
              {tag}
            </m.li>
          )}
        </ul>
      </m.div>
    </li>);

}

function Timeline() {
  const m = window.motion;
  const wrapRef = React.useRef(null);
  const { scrollYProgress } = window.useScroll({
    target: wrapRef,
    offset: ["start 80%", "end 20%"]
  });
  // Smooth out the progress
  const lineProgress = window.useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 22,
    restDelta: 0.001
  });

  return (
    <section id="projects">
      <SectionHead
        eyebrow="Timeline"
        dotColor="var(--accent-b)"
        title="What I've been building."
        titleEm="building"
      />
      
      <SectionFrame title="Timeline — career.log" icon="📅" tab="TIMELINE.N64">
        <div className="timeline-wrap" ref={wrapRef}>
          <div className="timeline-track" />
          <m.div
            className="timeline-track-fill"
            style={{ scaleY: lineProgress, originY: 0 }} />
          
          <ol className="timeline">
            {TIMELINE.map((t, i) =>
            <TimelineItem key={i} t={t} i={i} total={TIMELINE.length} />
            )}
          </ol>
        </div>
      </SectionFrame>
    </section>);

}

window.Timeline = Timeline;