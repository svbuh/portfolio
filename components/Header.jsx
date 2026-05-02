// Header — centered identity bar (no nav).
// Nav lives in the Hero CTA row instead.
function Header() {
  return (
    <header className="site-header site-header--centered">
      <a href="#home" className="logo">
        <span className="logo-mark">SB</span>
        <span className="logo-word">Sven Buhre<em>/ Software Architect · iSAQB · since 2023 · Celle, DE</em></span>
      </a>
    </header>);
}

window.Header = Header;
