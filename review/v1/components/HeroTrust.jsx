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
// TrustStrip — "As Seen In" marquee. Trimmed media outlets per round 1
// feedback. Real logos in /assets/press; sized + grayscaled via CSS.
// =====================================================================
const PRESS_OUTLETS = [
  { name: "Bloomberg",           src: "assets/press/bloomberg.svg" },
  { name: "Fast Company",        src: "assets/press/fast-company.svg" },
  { name: "CNBC",                src: "assets/press/cnbc.svg" },
  { name: "Business Insider",    src: "assets/press/business-insider.svg" },
  { name: "Fox 5 Washington DC", src: "assets/press/fox-5-dc.svg" },
  { name: "CNN",                 src: "assets/press/cnn.svg" },
  { name: "NBC 4",               src: "assets/press/nbc-4.svg" },
  { name: "Inc.",                src: "assets/press/inc.svg" },
  { name: "Entrepreneur",        src: "assets/press/entrepreneur.jpeg" },
];

function TrustStrip({ animated = true }) {
  const doubled = [...PRESS_OUTLETS, ...PRESS_OUTLETS];
  return (
    <section className="trust as-seen-in" data-screen-label="04 As seen in">
      <div className="trust-eyebrow">As Seen In</div>
      <div className="marquee-mask">
        <div className="marquee" style={{ animationPlayState: animated ? 'running' : 'paused' }}>
          {doubled.map((o, i) => (
            <img key={i} className="press-mark" src={o.src} alt={o.name} loading="lazy"/>
          ))}
        </div>
      </div>
    </section>
  );
}

window.Hero = Hero;
window.TrustStrip = TrustStrip;
