// =====================================================================
// Banner — yellow announcement strip, dismissible. Sits above nav.
// =====================================================================
function Banner({ visible, onDismiss }) {
  if (!visible) return null;
  return (
    <div className="banner" data-screen-label="01 Banner">
      <div className="banner-inner">
        <a className="banner-link" href="#course" onClick={(e)=>{ e.preventDefault(); document.getElementById('course')?.scrollIntoView({behavior:'smooth', block:'start'}); }}>
          <span className="pre-mobile-hide">From</span>
          <strong>Invisible to Influential</strong>
          <span>Free 5-Day Email Course</span>
          <span className="arrow" aria-hidden="true">→</span>
        </a>
        <button className="banner-dismiss" aria-label="Dismiss announcement" onClick={onDismiss}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

// =====================================================================
// Nav — clean three-column split: logo / page links / single CTA.
// Anchored to the same 12-col grid as the hero so the logo + headline
// share a left edge.
// =====================================================================
function Nav({ ctaLabel = 'Work With Me', activeId = 'home' }) {
  const pages = [
    { id: 'home',     label: 'Home',     href: 'Home.html' },
    { id: 'about',    label: 'About',    href: 'About.html' },
    { id: 'speaking', label: 'Speaking', href: '#speaking' },
    { id: 'learn',    label: 'Learn',    href: '#learn' },
    { id: 'book',     label: 'Book',     href: '#book' },
    { id: 'contact',  label: 'Contact',  href: '#contact' },
  ];
  return (
    <nav className="nav" data-screen-label="02 Nav">
      <div className="nav-inner">
        <a className="nav-logo" href="Home.html" aria-label="Lorraine Lee home">
          <img src="assets/logo-primary.png" alt="Lorraine Lee" />
        </a>
        <div className="nav-links">
          {pages.map(p => (
            <a key={p.id}
               className={'nav-link' + (p.id === activeId ? ' active' : '')}
               href={p.href}
               onClick={p.href.startsWith('#') ? (e)=>e.preventDefault() : undefined}>
              {p.label}
            </a>
          ))}
        </div>
        <a className="btn primary" href="#contact" onClick={(e)=>e.preventDefault()}>
          {ctaLabel}
        </a>
      </div>
    </nav>
  );
}

window.Banner = Banner;
window.Nav = Nav;
