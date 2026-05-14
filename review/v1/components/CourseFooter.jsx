// =====================================================================
// FreeCourseCTA — full-bleed dark section. Email opt-in.
// =====================================================================
function FreeCourseCTA() {
  const offer = window.FREE_COURSE_OFFER || {};
  const footerDays = offer.footerDays || [];
  const [email, setEmail] = React.useState('');
  const [sent, setSent]   = React.useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSent(true);
  }

  return (
    <section id="course" className="course" data-screen-label="07 Free course CTA">
      <div className="grid12 course-grid">
        <div className="course-copy">
          <div className="course-eyebrow">
            <span className="pill">{offer.eyebrowPill || 'Free'}</span>
            <span>{offer.eyebrowLabel || '5-Day Email Course'}</span>
          </div>
          <h2 className="course-headline">
            {offer.footerHeadlinePrefix || "Great at your job but can't "}
            <em>{offer.footerHeadlineEmphasis || 'talk about it?'}</em>
          </h2>
          <p className="course-sub">
            {offer.footerSubhead ||
              "You're not alone. Get my free 5-day course. The same frameworks I teach leaders at Amazon, Cisco, and Fortune 500 companies. Articulate your value. Make promotions inevitable."}
          </p>
          <ul className="course-bullets">
            {footerDays.map((day) => (
              <li key={day}>{day}</li>
            ))}
          </ul>
        </div>

        <div className="course-form">
          <div className="course-form-card">
            {sent ? (
              <div className="success">
                <div className="check">
                  <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <div className="success-title">{offer.successTitle || "You're in."}</div>
                <div className="success-sub">
                  {(offer.successTemplate || 'Day 1 is on its way to {email}.').replace('{email}', email)}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <span className="course-form-eyebrow">{offer.formEyebrow || 'Start tomorrow'}</span>
                <h3 className="course-form-title">
                  {offer.formTitleLead || 'Join'} <em>{offer.formTitleEmphasis || '12,000+'}</em> {offer.formTitleTail || 'leaders.'}
                </h3>
                <label className="field-label" htmlFor="course-email">Email address</label>
                <input
                  id="course-email"
                  className="field"
                  type="email"
                  required
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                />
                <button type="submit" className="btn yellow large btn-block">
                  {offer.primaryButtonLabel || 'Send me Day 1'} <span aria-hidden="true">→</span>
                </button>
                <div className="fineprint">{offer.fineprint || 'No spam. Unsubscribe in one click.'}</div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// =====================================================================
// Footer — minimal: brand block, social icons (LinkedIn primary), email,
// nav link cluster. Wave transition above.
// =====================================================================
function FooterWave() {
  return (
    <div className="footer-wave-wrap">
      <svg className="footer-wave" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
        <path fill="var(--paper-deep)" d="M0,60 C240,120 480,10 720,50 C960,90 1200,120 1440,60 L1440,120 L0,120 Z"/>
      </svg>
    </div>
  );
}

function Footer() {
  return (
    <>
      <FooterWave/>
      <footer className="footer" data-screen-label="08 Footer">
        <div className="grid12 footer-grid">
          <div className="footer-brand">
            <img src="assets/logo-primary.png" alt="Lorraine Lee"/>
            <p className="footer-tag">
              Helping leaders build an <em>unforgettable</em> presence.
            </p>
            <div className="footer-socials">
              <a className="social-btn" href="https://linkedin.com/in/lorraineklee" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a className="social-btn" href="#" aria-label="Instagram" onClick={(e)=>e.preventDefault()}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a className="social-btn" href="#" aria-label="YouTube" onClick={(e)=>e.preventDefault()}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0 -3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a className="social-btn" href="#" aria-label="X (Twitter)" onClick={(e)=>e.preventDefault()}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>
          <div className="footer-touch">
            <h4>Get in touch</h4>
            <p>Speaking, coaching, press:</p>
            <a className="footer-email" href="mailto:contact@lorraineklee.com">contact@lorraineklee.com</a>
          </div>
          <div className="footer-explore">
            <h4>Explore</h4>
            <ul>
              <li><a href="#about">About</a></li>
              <li><a href="#speaking">Speaking</a></li>
              <li><a href="#learn">Learn</a></li>
              <li><a href="#book">The Book</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="grid12">
          <div className="footer-base" style={{gridColumn:'1 / -1'}}>
            <div>© 2026 Lorraine Lee · RISE Learning Solutions Corp.</div>
            <div className="footer-base-links">
              <a href="#privacy">Privacy</a>
              <a href="#terms">Terms</a>
              <a href="#contact">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

window.FreeCourseCTA = FreeCourseCTA;
window.Footer = Footer;
