// DesktopWindow — draggable XP window with min/max/close.
// Reads/writes from WindowManager.

function DesktopWindow({ id, children }) {
  const wm = useWM();
  const w = wm.wins[id];
  const [drag, setDrag] = React.useState(null);
  const ref = React.useRef(null);

  // ALL hooks must be called BEFORE any early return.
  React.useEffect(() => {
    if (!drag) return;
    const onMove = (e) => {
      const dx = e.clientX - drag.startX;
      const dy = e.clientY - drag.startY;
      const nx = drag.baseX + dx;
      const ny = Math.max(0, drag.baseY + dy);
      wm.move(id, nx, ny);
    };
    const onUp = () => setDrag(null);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [drag, id, wm]);

  if (!w || !w.open || w.minimized) return null;

  const isActive = wm.activeId === id;
  const isMax = w.maximized;

  const onPointerDownTitle = (e) => {
    if (isMax) return;
    if (e.target.closest(".xp-ctrl")) return;
    e.preventDefault();
    wm.focus(id);
    const startX = e.clientX,startY = e.clientY;
    const baseX = w.x,baseY = w.y;
    setDrag({ startX, startY, baseX, baseY });
  };

  const style = isMax ?
  { left: 0, top: 0, width: "100%", height: "100%", zIndex: w.z } :
  { left: w.x, top: w.y, width: w.w, height: w.h, zIndex: w.z };

  return (
    <div
      ref={ref}
      className={"xp-window xp-desk-window" + (isActive ? " is-active" : " is-inactive") + (isMax ? " is-max" : "")}
      style={{ ...style, height: "425px" }}
      onMouseDown={() => wm.focus(id)}>
      
      <div className="xp-titlebar" onPointerDown={onPointerDownTitle} onDoubleClick={() => wm.toggleMaximize(id)}>
        <div className="xp-title">
          <span className="xp-icon"><XPIcon id={id} size={16} /></span>
          <span>{w.title}</span>
        </div>
        <div className="xp-controls">
          <button className="xp-ctrl" aria-label="Minimize" onClick={(e) => {e.stopPropagation();wm.minimize(id);}}>_</button>
          <button className="xp-ctrl" aria-label="Maximize" onClick={(e) => {e.stopPropagation();wm.toggleMaximize(id);}}>{isMax ? "❐" : "▢"}</button>
          <button className="xp-ctrl close" aria-label="Close" onClick={(e) => {e.stopPropagation();wm.close(id);}}>✕</button>
        </div>
      </div>
      <div className="xp-body xp-desk-body" style={{ height: "500px" }}>{children}</div>
    </div>);

}

window.DesktopWindow = DesktopWindow;