// Header — centered identity bar (no nav).
// Nav lives in the Hero CTA row. The logo doubles as a "back to home"
// affordance whenever the ViewSwitcher is active and we're not on the
// home view.
function Header() {
  const nav = React.useContext(window.NavContext || React.createContext(null));
  const onLogoClick = (e) => {
    if (nav && nav.navigate) {
      e.preventDefault();
      nav.navigate("home");
    }
    // else: native anchor behavior (#home) — fine for legacy/non-VS contexts
  };
  return (
    <header className="site-header site-header--centered">
      <a href="#home" className="logo" onClick={onLogoClick}>
        <span className="logo-mark">SB</span>
        <span className="logo-word">Sven Buhre<em>/ Software Architect · iSAQB · since 2023 · Celle, DE</em></span>
      </a>
    </header>);
}

window.Header = Header;
