/* ============================================================
   Lorraine K. Lee — Editorial Home
   ============================================================ */
const { useState, useEffect, useRef } = React;

/* ---------- SplitText character reveal ---------- */
function SplitHeadline({ children, delay = 0 }) {
  // Render children string with per-character spans for entry animation.
  // Preserves italic/highlight wrappers by accepting an array of {text, italic, hl} parts.
  return null;
}

/* A small renderer that takes plain text + emphasis ranges and produces split chars */
function buildSplitNodes(parts, baseDelay = 0) {
  let i = 0;
  const out = [];
  parts.forEach((p, pi) => {
    const text = p.text;
    const words = text.split(/(\s+)/); // keep spaces
    words.forEach((w, wi) => {
      if (/^\s+$/.test(w)) {
        out.push(<span key={`s-${pi}-${wi}`}>{w}</span>);
        return;
      }
      const chars = [...w].map((ch, ci) => {
        const d = baseDelay + i * 18;
        i++;
        return (
          <span key={`c-${pi}-${wi}-${ci}`} className="split-char" style={{ animationDelay: `${d}ms` }}>
            {ch}
          </span>
        );
      });
      const wrapped = (
        <span key={`w-${pi}-${wi}`} className="split-word">
          {p.italic ? <em>{chars}</em> : chars}
        </span>
      );
      if (p.hl) {
        out.push(<span key={`h-${pi}-${wi}`} className="hl">{wrapped}</span>);
      } else {
        out.push(wrapped);
      }
    });
  });
  return out;
}

/* ---------- Announcement banner ---------- */
function Announcement({ visible, onClose }) {
  return (
    <div className={`announce ${visible ? "" : "hidden"}`}>
      <span>From <em style={{fontFamily:'var(--font-serif)', fontWeight:500}}>Invisible</em> to <em style={{fontFamily:'var(--font-serif)', fontWeight:500}}>Influential</em> — </span>
      <a href="#course">Free 5-Day Email Course</a>
      <span style={{marginLeft:4}}>→</span>
      <button className="announce-close" onClick={onClose} aria-label="Dismiss">×</button>
    </div>
  );
}

/* ---------- Nav with magnetic CTA ---------- */
function Nav({ scrolled }) {
  const ctaRef = useRef(null);
  const onMouseMove = (e) => {
    const el = ctaRef.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${x * 0.18}px, ${y * 0.22}px)`;
  };
  const onLeave = () => { if (ctaRef.current) ctaRef.current.style.transform = "translate(0,0)"; };

  return (
    <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
      <a href="#" className="wordmark" aria-label="Lorraine K. Lee — Home">
        Lorraine K<span className="dot">.</span> Lee
      </a>
      <div className="nav-links">
        <a href="#about">About</a>
        <a href="#speaking">Speaking</a>
        <a href="#learn">Learn</a>
        <a href="#book">Book</a>
        <a href="#contact">Contact</a>
      </div>
      <div className="magnetic" onMouseMove={onMouseMove} onMouseLeave={onLeave} style={{display:'inline-block'}}>
        <a href="#contact" ref={ctaRef} className="btn btn-pill-outline">
          Bring Lorraine to Your Team <span className="arrow">→</span>
        </a>
      </div>
    </nav>
  );
}

/* ---------- Hero ---------- */
function Hero() {
  // headline: "Helping leaders build an unforgettable presence"
  // We split into parts with optional italic + yellow highlight on "unforgettable"
  const parts = [
    { text: "Helping leaders" },
    { text: " build an " },
    { text: "unforgettable", italic: true, hl: true },
    { text: " presence." },
  ];
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-grid">
          <div>
            <div className="eyebrow fade-up in" style={{display:'flex', alignItems:'center', gap:14}}>
              <span style={{display:'inline-block', width:28, height:1, background:'var(--indigo)'}}></span>
              <span>Bestselling Author <span style={{color:'var(--ink-300)', margin:'0 8px'}}>·</span> Keynote Speaker <span style={{color:'var(--ink-300)', margin:'0 8px'}}>·</span> Stanford Instructor</span>
            </div>

            <h1 className="hero-headline" aria-label="Helping leaders build an unforgettable presence.">
              {buildSplitNodes(parts, 200)}
              <span className="motion-dot" data-note="SplitText character reveal on load — staggered 18ms per char, 900ms ease-out, ~110% upward translate." style={{top:'4%', right:'-22px'}}></span>
            </h1>

            <p className="hero-sub fade-up in" style={{transitionDelay:'600ms'}}>
              Keynotes, workshops, and writing for the people who do the work but haven't yet learned to be seen. Featured in Wiley's bestseller list, Stanford Continuing Studies, and on stages from Zoom to McKinsey.
            </p>

            <div className="hero-cta-row fade-up in" style={{transitionDelay:'720ms'}}>
              <a href="#contact" className="btn btn-primary">
                Book Lorraine to Speak <span className="arrow">→</span>
              </a>
              <a href="#book" className="btn btn-ghost">
                Get the Book
              </a>
            </div>

            <div className="hero-credentials fade-up in" style={{transitionDelay:'860ms'}}>
              <div className="cred-item">
                <span className="cred-label">Published by</span>
                <span style={{fontFamily:'var(--font-serif)', fontStyle:'italic', fontSize:18, color:'var(--indigo)', letterSpacing:'-0.01em'}}>WILEY</span>
              </div>
              <span className="cred-divider"></span>
              <div className="cred-item">
                <span style={{
                  fontSize:11, fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase',
                  color:'var(--indigo)', padding:'6px 10px',
                  border:'1px solid var(--indigo)', borderRadius:2,
                  background:'transparent'
                }}>WSJ Bestseller</span>
              </div>
              <span className="cred-divider"></span>
              <div className="cred-item">
                <span className="cred-label">Taught</span>
                <span style={{fontFamily:'var(--font-serif)', fontSize:18, color:'var(--indigo)'}}>250,000+ <span style={{color:'var(--ink-500)', fontSize:13, fontFamily:'var(--font-sans)'}}>students</span></span>
              </div>
            </div>
          </div>

          <div className="hero-portrait fade-up in" style={{transitionDelay:'400ms'}}>
            <div className="hero-portrait-meta">Photo · Pixel Studio</div>
            <img src="assets/lorraine-headshot-blazer.png" alt="Portrait of Lorraine K. Lee" />
            <span className="motion-dot" data-note="Section entrances: fade up 24px → 0, 700ms ease-out, triggered on scroll. All motion calm, never decorative." style={{bottom:24, left:-20}}></span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Press strip ---------- */
function Press() {
  const logos = [
    { name: "CNBC", cls: "condensed" },
    { name: "Forbes", cls: "" },
    { name: "Bloomberg", cls: "sans" },
    { name: "Fast Company", cls: "" },
    { name: "Business Insider", cls: "sans" },
    { name: "Fortune", cls: "" },
  ];
  return (
    <section className="press">
      <div className="container">
        <div className="press-row">
          <div className="eyebrow muted" style={{display:'flex', alignItems:'center', gap:14}}>
            <span style={{display:'inline-block', width:28, height:1, background:'var(--ink-300)'}}></span>
            <span>As Seen In</span>
          </div>
          <div className="press-logos">
            {logos.map((l, i) => (
              <span key={i} className={`press-logo ${l.cls}`}>{l.name}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Book promo ---------- */
function BookPromo() {
  return (
    <section className="book-promo" id="book">
      <div className="container">
        <div className="book-grid">
          <div className="book-cover-wrap">
            <span className="book-cover-caption">No. 01 — The Book</span>
            <img src="assets/book-unforgettable-presence.png" alt="Unforgettable Presence by Lorraine K. Lee" />
          </div>
          <div className="book-content">
            <div className="eyebrow">Unforgettable Presence · Wiley, 2024</div>
            <p className="book-quote">
              <span className="quote-mark">"</span>
              A <span className="hl">field guide</span> for the quietly excellent — the people who do the work but haven't yet learned to be seen.
            </p>
            <div className="book-attribution">
              <strong>Adam Grant</strong> &nbsp;·&nbsp; #1 NYT Bestselling Author of <em style={{fontFamily:'var(--font-serif)'}}>Think Again</em>
            </div>
            <div className="retailers">
              <span className="retailers-label">Order at</span>
              <button className="retailer-chip">Amazon</button>
              <button className="retailer-chip">Bookshop</button>
              <button className="retailer-chip">Barnes &amp; Noble</button>
              <button className="retailer-chip">Audible</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Speaking ---------- */
function Speaking() {
  const keynotes = [
    { num: "01", title: "Unforgettable Presence: How Quiet Performers Become Visible Leaders", meta: "Keynote · 45–60 min" },
    { num: "02", title: "The Three Cs of Executive Presence in a Hybrid World", meta: "Keynote · Workshop" },
    { num: "03", title: "From Best-Kept Secret to Promoted: A Communication Playbook", meta: "Workshop · 90 min" },
  ];
  return (
    <section className="speaking" id="speaking">
      <div className="container">
        <div className="speaking-grid">
          <div className="speaking-photo">
            <span style={{
              position:'absolute', top:-24, left:0,
              fontSize:10, letterSpacing:'0.32em', textTransform:'uppercase', color:'var(--ink-500)'
            }}>On Stage</span>
            <div className="photo-mask">
              <img src="assets/lorraine-speaking-cream.png" alt="Lorraine K. Lee speaking on stage" />
            </div>
            <div className="speaking-photo-caption">From a recent keynote · 2025</div>
          </div>
          <div>
            <div className="eyebrow">Keynotes &amp; Workshops</div>
            <h2 className="speaking-headline">
              Talks that change <em style={{fontStyle:'italic'}}>how</em> your people show up — not just <em style={{fontStyle:'italic'}}>what</em> they know.
            </h2>
            <p className="speaking-outcome">
              Lorraine has taught the frameworks in this session to leaders at Zoom, Cisco, Google, McKinsey and Salesforce. Audiences leave with concrete language and habits they can use the next morning.
            </p>
            <ul className="keynote-list">
              {keynotes.map((k, i) => (
                <li className="keynote-item" key={i}>
                  <span className="keynote-num">{k.num}</span>
                  <span className="keynote-title">{k.title}</span>
                  <span className="keynote-meta">{k.meta}</span>
                </li>
              ))}
            </ul>
            <a href="#topics" className="link-underline" style={{fontSize:15, fontWeight:500}}>
              View all topics &nbsp;→
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Testimonials ---------- */
function Testimonials() {
  return (
    <section className="testimonials">
      <div className="container">
        <div className="testimonials-header">
          <div>
            <div className="section-label-meta" style={{marginBottom:14}}>What People Say</div>
            <div className="section-label">In their words.</div>
          </div>
          <div className="section-label-meta">No. 04</div>
        </div>

        <div className="testimonials-stage">
          <figure className="t-card t-card-1">
            <blockquote className="t-quote">
              "She was confident, engaging, and personable, all while delivering insights that <span className="hl-thin">truly resonated</span> with our team."
            </blockquote>
            <figcaption className="t-attribution">
              <span className="name">Alex Harlan</span>
              <span className="pipe">/</span>
              <span>Head of L&amp;D, Google</span>
            </figcaption>
          </figure>

          <figure className="t-card t-card-2">
            <span className="t-card-2-mark">"</span>
            <blockquote className="t-quote">
              I'd recommend her to any leader looking to show up with <span className="hl-thin" style={{color:'var(--indigo)'}}>more power</span> — without losing their voice.
            </blockquote>
            <figcaption className="t-attribution">
              <span className="name">Sophie Choi</span>
              <span className="pipe">/</span>
              <span>VP People, Affirm</span>
            </figcaption>
            <span className="motion-dot" data-note="Deep indigo column functions as a typographic anchor — pulls the staggered grid into rhythm." style={{top:-10, right:-10}}></span>
          </figure>

          <figure className="t-card t-card-3">
            <blockquote className="t-quote">
              "Her expertise in virtual interviewing, personal branding, and communication strategies is unmatched in the industry."
            </blockquote>
            <figcaption className="t-attribution">
              <span className="name">Clint Carrens</span>
              <span className="pipe">/</span>
              <span>Talent Lead, Indeed</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

/* ---------- Free course CTA ---------- */
function FreeCourse() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <section className="free-course" id="course">
      <div className="container">
        <div className="fc-grid">
          <div>
            <div className="fc-eyebrow">The Free 5-Day Email Course</div>
            <h2 className="fc-headline">
              Great at your job<br/>
              but can't <em>talk</em> about it?
            </h2>
            <p className="fc-sub">
              You're not alone. Get the same frameworks Lorraine teaches leaders at Amazon, Cisco, and Fortune 500 companies — delivered to your inbox over five mornings. Articulate your value. Make promotions inevitable.
            </p>
          </div>
          <div className="fc-form">
            <div className="fc-form-eyebrow">Invisible → Influential</div>
            <h3 className="fc-form-title">Start Day 1 tomorrow.</h3>
            {sent ? (
              <div className="fc-success">
                Check your inbox.<br/>
                <span style={{fontSize:14, color:'rgba(251,247,241,0.7)', fontStyle:'normal', fontFamily:'var(--font-sans)'}}>Day 1 is on its way to {email}.</span>
              </div>
            ) : (
              <form onSubmit={(e)=>{e.preventDefault(); if(email) setSent(true);}}>
                <input
                  className="fc-input"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="fc-submit">
                  Send me Day 1 <span className="arrow">→</span>
                </button>
                <div className="fc-fineprint">No spam. Unsubscribe anytime.</div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */
function Footer() {
  return (
    <footer className="footer" id="contact">
      <hr className="footer-rule"/>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-wordmark">Lorraine K<span style={{color:'var(--ink-500)'}}>.</span> Lee</div>
          <nav className="footer-nav">
            <a href="#about">About</a>
            <a href="#speaking">Speaking</a>
            <a href="#learn">Learn</a>
            <a href="#book">Book</a>
            <a href="#contact">Contact</a>
          </nav>
          <div className="footer-social">
            <a href="https://linkedin.com/in/lorraineklee" className="social-icon" aria-label="LinkedIn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5V8h3v11zM6.5 6.7A1.7 1.7 0 116.5 3.3a1.7 1.7 0 010 3.4zM19 19h-3v-5.5c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V19h-3V8h2.9v1.5h.05A3.18 3.18 0 0114.9 7.7c3.05 0 3.6 2 3.6 4.6V19z"/></svg>
            </a>
          </div>
        </div>
        <div className="footer-fineprint">
          <div>© 2026 Lorraine K. Lee · RISE Learning Solutions Corp.</div>
          <div style={{display:'flex', gap:24}}>
            <a href="#privacy" style={{color:'var(--ink-500)'}}>Privacy</a>
            <a href="#terms" style={{color:'var(--ink-500)'}}>Terms</a>
            <a href="#contact" style={{color:'var(--ink-500)'}}>contact@lorraineklee.com</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ---------- App ---------- */
function App() {
  const [bannerVisible, setBannerVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Reveal-on-scroll for fade-up children added after first paint (Press, Book, Speaking, Testimonials, FreeCourse)
  useEffect(() => {
    const els = document.querySelectorAll(".fade-up:not(.in)");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <Announcement visible={bannerVisible} onClose={() => setBannerVisible(false)} />
      <Nav scrolled={scrolled} />
      <main>
        <Hero />
        <Press />
        <BookPromo />
        <Speaking />
        <Testimonials />
        <FreeCourse />
      </main>
      <Footer />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
