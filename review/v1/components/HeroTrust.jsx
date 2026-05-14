// =====================================================================
// Hero — grid-anchored: copy in cols 1-7, photo in cols 8-12.
// Headline left edge sits at the same vertical line as the nav logo.
// Photo gets generous breathing room with soft tinted backdrop, decisive
// stat card, and small "as seen on" badge to reinforce credibility.
// =====================================================================
function Hero({ headline, sub, ctaLabel, photoSrc, variant = 'editorial' }) {
  return (
    <section className="hero" data-screen-label="03 Hero">
      {variant === 'bold' && <div className="hero-watermark" aria-hidden="true">L</div>}
      <div className="grid12 hero-grid">
        {variant === 'bold' && (
          <div className="hero-issue-tag">
            <span>Lorraine K. Lee · <em>Vol. 01 · Presence</em></span>
            <span className="right"><span>EST. 2018</span><span>NEW YORK · SF</span></span>
          </div>
        )}
        <div className="hero-copy fade-up">
          <div className="hero-eyebrow">
            <span className="dot"/>
            <span className="eyebrow" style={{color:'var(--ink-500)'}}>Keynote speaker · Author · Instructor</span>
          </div>
          <h1 className="hero-headline" dangerouslySetInnerHTML={{ __html: headline }} />
          <p className="hero-sub">{sub}</p>
          <div className="hero-cta-row">
            <a className="btn primary large" href="#contact" onClick={(e)=>e.preventDefault()}>
              {ctaLabel} <span aria-hidden="true">→</span>
            </a>
            <a className="btn outline" href="#book" onClick={(e)=>e.preventDefault()}>
              Get the Book
            </a>
            <a className="btn ghost" href="#speaking" onClick={(e)=>e.preventDefault()}>
              Watch a keynote clip
            </a>
          </div>
          <div className="hero-meta">
            <div>
              <div className="num">250k+</div>
              <div className="lbl">students taught<br/>on LinkedIn Learning</div>
            </div>
            <div className="divider" aria-hidden="true"/>
            <div>
              <div className="num">#1</div>
              <div className="lbl">Amazon bestseller<br/><em>Unforgettable Presence</em></div>
            </div>
          </div>
        </div>

        <div className="hero-photo-wrap fade-up" style={{animationDelay:'120ms'}}>
          <div className="photo-bg-shape" aria-hidden="true"/>
          <div className="photo-card">
            <img src={photoSrc} alt="Lorraine K. Lee, keynote speaker"/>
          </div>
          <div className="photo-badge">As seen in Forbes · Fast Co.</div>
          <div className="photo-stat">
            <div className="num">4.9<span style={{fontSize:18, opacity:0.5, fontWeight:400}}>/5</span></div>
            <div className="lbl">Speaker rating across<br/>200+ keynotes</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// =====================================================================
// TrustStrip — image-based press marquee. Keep asset paths local to the
// /v1 directory so the Vercel static export can ship them with the page.
// =====================================================================
const PRESS_LOGOS = [
  { id: "inc",                name: "Inc.",               src: "assets/press/inc.svg",               width: 92,  height: 30 },
  { id: "bloomberg",          name: "Bloomberg",          src: "assets/press/bloomberg.svg",        width: 170, height: 24 },
  { id: "fast-company",       name: "Fast Company",       src: "assets/press/fast-company.png",     width: 206, height: 30 },
  // Use the darker fallback asset here, cropped tighter and a bit taller because the fan-mark reads smaller than the neighboring wordmarks.
  { id: "cnbc",               name: "CNBC",               src: "assets/press/cnbc-cropped.png",     width: 110, height: 54 },
  { id: "business-insider",   name: "Business Insider",   src: "assets/press/business-insider.svg", width: 228, height: 22 },
  { id: "fox5",               name: "Fox 5 Washington DC",src: "assets/press/fox5.png",             width: 134, height: 40 },
  { id: "cnn",                name: "CNN",                src: "assets/press/cnn.svg",              width: 102, height: 28 },
  // The NBC 4 source has a square canvas, so it needs a taller render to read at parity.
  { id: "nbc4",               name: "NBC 4",              src: "assets/press/nbc4.svg",             width: 88,  height: 58 },
];

function TrustStrip({ animated = true }) {
  const doubled = [...PRESS_LOGOS, ...PRESS_LOGOS];
  return (
    <section className="trust as-seen-in" data-screen-label="04 As seen in">
      <div className="trust-eyebrow">As Seen In</div>
      <div className="marquee-mask">
        <div className="marquee" style={{ animationPlayState: animated ? 'running' : 'paused' }}>
          {doubled.map((logo, i) => (
            <span
              key={`${logo.id}-${i}`}
              className={`press-mark-frame press-mark-frame--${logo.id}`}
              style={{ '--mark-height': `${logo.height}px`, '--mark-width': `${logo.width}px` }}
              aria-hidden={i >= PRESS_LOGOS.length ? 'true' : undefined}
            >
              <img
                className={`press-mark press-mark--${logo.id}`}
                src={logo.src}
                alt={i < PRESS_LOGOS.length ? logo.name : ""}
              />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

window.Hero = Hero;
window.TrustStrip = TrustStrip;
