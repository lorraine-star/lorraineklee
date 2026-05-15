// =====================================================================
// BookPromo — V3-style: clean cover with WSJ ribbon, large italic title,
// subtitle, body, pull-quote, single primary CTA. Uses V1 tokens.
// =====================================================================
function BookPromo() {
  return (
    <section className="book-promo v3" data-screen-label="05 Book promo">
      <div className="grid12">
        <div className="book-cover-col">
          <div className="book-cover-stack">
            <img className="book-cover" src="uploads/book-with-seals.png"
                 alt="Unforgettable Presence by Lorraine K. Lee, book cover"/>
          </div>
        </div>
        <div className="book-copy-col">
          <span className="eyebrow book-eyebrow">The Book</span>
          <h2 className="book-bigtitle">
            <em>Unforgettable Presence&reg;</em>
          </h2>
          <p className="book-tagline">
            Get seen. Gain influence. Catapult your career.
          </p>
          <p className="book-body">
            The operator's manual for getting credit for your work. Used in leadership programs at Zoom, LinkedIn, and Salesforce. Five parts, fifty-two short chapters, no fluff.
          </p>
          <blockquote className="book-blockquote">
            <p>"The clearest, most actionable book on executive presence I've read in a decade."</p>
            <footer>VP, People · Fortune 100 Tech</footer>
          </blockquote>
          <div className="book-cta-row">
            <a className="btn primary large" href="#book" onClick={(e)=>e.preventDefault()}>
              Get your copy <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// =====================================================================
// FourWaysSlim — slim version of the V3 "Four ways into the work"
// section. Single horizontal row of 4 compact cards.
// =====================================================================
const FOUR_WAYS = [
  { n: "01", label: "Speaking",                desc: "Keynotes built around what your team actually needs to hear.", href: "#speaking" },
  { n: "02", label: "Unforgettable Presence®", desc: "The book leadership programs already assign.",                  href: "#book" },
  { n: "03", label: "Courses",                 desc: "On-demand training. 250,000+ students on LinkedIn Learning.",  href: "#learn" },
  { n: "04", label: "Custom programs",         desc: "Cohort intensives for managers and high-potentials.",          href: "#contact" },
];

function FourWaysSlim() {
  return (
    <section className="four-ways" data-screen-label="04c Four ways">
      <div className="grid12">
        <div className="four-ways-head">
          <span className="eyebrow">How I can help</span>
          <h2 className="four-ways-title">
            Four ways into the <em>work.</em>
          </h2>
        </div>
        <div className="four-ways-grid">
          {FOUR_WAYS.map((it) => (
            <a key={it.n} className="fw-card" href={it.href} onClick={(e)=>e.preventDefault()}>
              <div className="fw-row">
                <span className="fw-num">{it.n}</span>
                <span className="fw-arrow" aria-hidden="true">↗</span>
              </div>
              <div className="fw-label">{it.label}</div>
              <div className="fw-desc">{it.desc}</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// =====================================================================
// Testimonials — horizontal scroll carousel with snap. Headshot slot
// per quote (data-driven via `photo` path; falls back to initials).
// =====================================================================
const HOME_TESTIMONIALS = [
  {
    quote: "She was confident, engaging, and personable, all while delivering insights that truly resonated with our managers.",
    name: "Alex Harlan",
    role: "Director of L&D, Google",
    initials: "AH",
    photo: "",
  },
  {
    quote: "Lorraine doesn't just teach presence. She models it. Our high-potentials are still quoting her frameworks six months later.",
    name: "Sophie Choi",
    role: "VP People, Affirm",
    initials: "SC",
    photo: "",
    featured: true,
  },
  {
    quote: "Her expertise in personal branding and confident communication is unmatched. She's our most-requested return speaker.",
    name: "Clint Carrens",
    role: "Talent Brand Lead, Indeed",
    initials: "CC",
    photo: "",
  },
];

function Testimonials() {
  return (
    <section className="testimonials" data-screen-label="06 Testimonials">
      <div className="grid12">
        <div className="testimonials-head">
          <span className="eyebrow">What clients say</span>
          <h2 className="testimonials-title">
            Companies bring her back <em>for more.</em>
          </h2>
          <p className="lead">
            From Fortune 500 leadership programs to high-potential cohorts at fast-growth tech companies, Lorraine's frameworks travel.
          </p>
        </div>
        <div className="testimonials-scroller" role="region" aria-label="Client testimonials">
          <div className="testimonials-track">
            {HOME_TESTIMONIALS.map((t, i) => (
              <figure key={i} className={"t-card" + (t.featured ? " featured" : "")}>
                <span className="t-mark" aria-hidden="true">"</span>
                <blockquote className="t-quote">{t.quote}</blockquote>
                <div className="t-divider"/>
                <figcaption className="t-attrib">
                  {t.photo ? (
                    <img className="t-headshot" src={t.photo} alt={t.name}/>
                  ) : (
                    <div className="t-avatar" aria-hidden="true">{t.initials}</div>
                  )}
                  <div>
                    <div className="t-name">{t.name}</div>
                    <div className="t-role">{t.role}</div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

window.BookPromo = BookPromo;
window.FourWaysSlim = FourWaysSlim;
window.Testimonials = Testimonials;
