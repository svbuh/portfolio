// WindowManager — global state for desktop windows in XP theme.
// Each window has: id, title, icon, x, y, w, h, z, minimized, maximized, open.

const WMContext = React.createContext(null);
window.WMContext = WMContext;

function useWM() {
  return React.useContext(WMContext);
}
window.useWM = useWM;

// Default layout for windows when first opened. Coords are absolute on the
// .xp-desktop surface (which is the viewport minus the taskbar height).
// Sizes are kept modest so they fit in narrow viewports.
const WIN_DEFAULTS = {
  home:     { title: "Sven Buhre — index.html",         icon: "🌐", x: 110, y:  30, w: 720, h: 480 },
  work:     { title: "What I do — capabilities.txt",    icon: "💼", x: 140, y:  60, w: 720, h: 480 },
  stack:    { title: "Stack.exe",                        icon: "🧩", x: 170, y:  90, w: 680, h: 460 },
  timeline: { title: "Timeline — career.log",            icon: "📅", x: 130, y:  50, w: 760, h: 500 },
  contact:  { title: "Get in touch — outlook.exe",       icon: "✉️", x: 200, y: 110, w: 640, h: 440 },
};
window.WIN_DEFAULTS = WIN_DEFAULTS;

function WindowManagerProvider({ children }) {
  // Compute default position/size based on current viewport so windows
  // always fit nicely. Each window gets a slight cascade offset.
  // Different sections have different ideal sizes.
  const computeDefaults = React.useCallback(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight - 32; // minus taskbar
    const sizes = {
      home:     { w: Math.min(560, vw - 140), h: Math.min(360, vh - 40) },
      work:     { w: Math.min(880, vw - 140), h: Math.min(620, vh - 40) },
      stack:    { w: Math.min(780, vw - 140), h: Math.min(560, vh - 40) },
      timeline: { w: Math.min(880, vw - 140), h: Math.min(640, vh - 40) },
      contact:  { w: Math.min(640, vw - 140), h: Math.min(480, vh - 40) },
    };
    const offsets = { home: 0, work: 1, stack: 2, timeline: 3, contact: 4 };
    const result = {};
    Object.keys(WIN_DEFAULTS).forEach((id) => {
      const o = offsets[id] || 0;
      const sz = sizes[id];
      // Center horizontally with small cascade offset
      const cx = Math.round((vw - sz.w) / 2);
      const cy = Math.round((vh - sz.h) / 2 - 16);
      const x = Math.max(20, cx + o * 28);
      const y = Math.max(8, cy + o * 28);
      result[id] = { ...WIN_DEFAULTS[id], x, y, w: sz.w, h: sz.h };
    });
    return result;
  }, []);

  // wins: { [id]: { ...defaults, open, minimized, maximized, x, y, w, h, z } }
  const [wins, setWins] = React.useState(() => {
    const init = {};
    const defaults = computeDefaults();
    Object.keys(WIN_DEFAULTS).forEach((id) => {
      init[id] = {
        id,
        ...defaults[id],
        open: id === "home",
        minimized: false,
        maximized: false,
        z: id === "home" ? 10 : 0,
      };
    });
    return init;
  });
  const zCounter = React.useRef(10);

  const focus = React.useCallback((id) => {
    zCounter.current += 1;
    const z = zCounter.current;
    setWins((w) => ({ ...w, [id]: { ...w[id], z, minimized: false } }));
  }, []);

  const open = React.useCallback((id) => {
    if (!WIN_DEFAULTS[id]) return;
    zCounter.current += 1;
    const z = zCounter.current;
    const defaults = computeDefaults();
    setWins((w) => {
      const cur = w[id];
      // If already open and not minimized → just focus
      if (cur.open && !cur.minimized) {
        return { ...w, [id]: { ...cur, z } };
      }
      // If was closed: reset to default position based on current viewport
      const base = cur.open ? cur : { ...cur, x: defaults[id].x, y: defaults[id].y, w: defaults[id].w, h: defaults[id].h };
      return { ...w, [id]: { ...base, open: true, minimized: false, z } };
    });
  }, [computeDefaults]);

  const close = React.useCallback((id) => {
    setWins((w) => ({ ...w, [id]: { ...w[id], open: false, minimized: false, maximized: false } }));
  }, []);

  const minimize = React.useCallback((id) => {
    setWins((w) => ({ ...w, [id]: { ...w[id], minimized: true } }));
  }, []);

  const toggleMaximize = React.useCallback((id) => {
    zCounter.current += 1;
    const z = zCounter.current;
    setWins((w) => ({ ...w, [id]: { ...w[id], maximized: !w[id].maximized, minimized: false, z } }));
  }, []);

  const move = React.useCallback((id, x, y) => {
    setWins((w) => ({ ...w, [id]: { ...w[id], x, y } }));
  }, []);

  const resize = React.useCallback((id, w_, h_) => {
    setWins((w) => ({ ...w, [id]: { ...w[id], w: w_, h: h_ } }));
  }, []);

  // Active window = highest z that is open and not minimized
  const activeId = React.useMemo(() => {
    let best = null, bestZ = -1;
    Object.values(wins).forEach((w) => {
      if (w.open && !w.minimized && w.z > bestZ) { best = w.id; bestZ = w.z; }
    });
    return best;
  }, [wins]);

  const value = React.useMemo(() => ({
    wins, activeId, focus, open, close, minimize, toggleMaximize, move, resize,
  }), [wins, activeId, focus, open, close, minimize, toggleMaximize, move, resize]);

  return <WMContext.Provider value={value}>{children}</WMContext.Provider>;
}

window.WindowManagerProvider = WindowManagerProvider;
