// XPTaskbar — Windows XP taskbar. Reads from WindowManager to render
// a task button per open window. Clicking toggles minimize/restore.
// Start menu opens windows by id.

function XPTaskbar() {
  const [open, setOpen] = React.useState(false);
  const [time, setTime] = React.useState(() => fmtTime());
  const menuRef = React.useRef(null);
  const wm = useWM();

  React.useEffect(() => {
    const t = setInterval(() => setTime(fmtTime()), 30 * 1000);
    return () => clearInterval(t);
  }, []);

  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const links = [
    { id: "home",     label: "Home" },
    { id: "work",     label: "What I do" },
    { id: "stack",    label: "Stack" },
    { id: "timeline", label: "Timeline" },
    { id: "contact",  label: "Get in touch" },
  ];

  const goWin = (id) => {
    setOpen(false);
    wm.open(id);
  };

  // Sort windows by id for stable taskbar order
  const order = ["home", "work", "stack", "timeline", "contact"];
  const tasks = order
    .map((id) => wm.wins[id])
    .filter((w) => w && w.open);

  const onTaskClick = (id) => {
    const w = wm.wins[id];
    if (w.minimized) {
      wm.open(id);
    } else if (wm.activeId === id) {
      wm.minimize(id);
    } else {
      wm.focus(id);
    }
  };

  return (
    <div className="xp-taskbar" role="navigation" aria-label="Site navigation">
      {open && (
        <div className="xp-startmenu" ref={menuRef}>
          <div className="xp-startmenu-header">
            <div className="xp-sm-avatar">SB</div>
            <div className="xp-sm-username">Sven Buhre</div>
          </div>
          <div className="xp-startmenu-body">
            <ul className="xp-sm-list">
              {links.map((l) => (
                <li key={l.id}>
                  <a
                    href={"#" + l.id}
                    onClick={(e) => {
                      e.preventDefault();
                      goWin(l.id);
                    }}
                  >
                    <span className="xp-sm-icon" aria-hidden="true"><XPIcon id={l.id} size={20} /></span>
                    <span className="xp-sm-label">{l.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="xp-startmenu-footer">
            <a
              href="https://www.google.com/maps/place/Celle,+Germany"
              target="_blank"
              rel="noopener noreferrer"
              className="xp-sm-loc"
            >
              <span className="xp-sm-loc-icon" aria-hidden="true"><XPIcon id="location" size={16} /></span>
              <span>Celle, DE</span>
            </a>
          </div>
        </div>
      )}

      <button
        className={"xp-start-btn" + (open ? " is-open" : "")}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="xp-start-flag" aria-hidden="true">
          <span className="xp-flag-r" />
          <span className="xp-flag-g" />
          <span className="xp-flag-b" />
          <span className="xp-flag-y" />
        </span>
        <span className="xp-start-label">start</span>
      </button>

      <div className="xp-tasks">
        {tasks.map((w) => (
          <button
            key={w.id}
            className={
              "xp-task" +
              (wm.activeId === w.id && !w.minimized ? " xp-task-active" : "") +
              (w.minimized ? " xp-task-min" : "")
            }
            onClick={() => onTaskClick(w.id)}
            title={w.title}
          >
            <span className="xp-task-icon"><XPIcon id={w.id} size={14} /></span>
            <span className="xp-task-label">{w.title}</span>
          </button>
        ))}
      </div>

      <div className="xp-tray">
        <span className="xp-tray-text">© 2026 Sven Buhre</span>
        <span className="xp-tray-divider" />
        <span className="xp-tray-clock">{time}</span>
      </div>
    </div>
  );
}

function fmtTime() {
  const d = new Date();
  let h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

window.XPTaskbar = XPTaskbar;
