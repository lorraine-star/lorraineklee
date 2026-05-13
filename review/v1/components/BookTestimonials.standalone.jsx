// =====================================================================
// BookPromo — editorial-feeling book block. Tilted cover, badges, large
// pull quote-like description, multiple CTAs.
// =====================================================================
function BookPromo() {
  return (
    <section className="book-promo" data-screen-label="05 Book promo">
      <div className="grid12">
        <div className="promo-eyebrow-row">
          <span className="eyebrow">The Book</span>
        </div>
        <div className="book-cover-col">
          <div className="book-cover-stack">
            <img className="book-cover" src={window.__resources.bookCover} alt="Unforgettable Presence by Lorraine K. Lee — book cover"/>
            <div className="book-badges left">
              <div className="book-badge amzn">
                <span className="dot"/> #1 Amazon Bestseller
              </div>
              <div className="book-badge">
                <span className="star">★</span> Next Big Idea Club Pick
              </div>
            </div>
          </div>
        </div>
        <div className="book-copy-col">
          <h2 className="book-bigtitle">
            Unforgettable <em>Presence</em>
          </h2>
          <p className="book-pull">
            The blueprint for becoming impossible to overlook — even if you're an introvert, even if you've been overlooked before. Built around the two halves of presence experts miss: <em>how</em> you're perceived and <em>where</em> you're seen.
          </p>
          <div className="book-meta-row">
            <div className="book-meta-cell">
              <div className="k accent">★★★★★</div>
              <div className="v">Goodreads · 4.7 avg</div>
            </div>
            <div className="book-meta-cell">
              <div className="k">800+</div>
              <div className="v">Amazon reviews</div>
            </div>
            <div className="book-meta-cell">
              <div className="k">Wiley</div>
              <div className="v">Hardcover · 256 pp</div>
            </div>
          </div>
          <div className="book-cta-row">
            <a className="btn primary large" href="#book" onClick={(e)=>e.preventDefault()}>Read the book</a>
            <a className="btn ghost" href="#book" onClick={(e)=>e.preventDefault()}>See endorsements →</a>
          </div>
        </div>
      </div>
    </section>
  );
}

// =====================================================================
// Testimonials — three featured, middle one is the "hero" quote with
// dark surface to add visual rhythm.
// =====================================================================
const HOME_TESTIMONIALS = [
  {
    quote: "She was confident, engaging, and personable, all while delivering insights that truly resonated with our managers.",
    name: "Alex Harlan",
    role: "Director of L&D, Google",
    initials: "AH",
  },
  {
    quote: "Lorraine doesn't just teach presence — she models it. Our high-potentials are still quoting her frameworks six months later.",
    name: "Sophie Choi",
    role: "VP People, Affirm",
    initials: "SC",
    featured: true,
  },
  {
    quote: "Her expertise in personal branding and confident communication is unmatched. She's our most-requested return speaker.",
    name: "Clint Carrens",
    role: "Talent Brand Lead, Indeed",
    initials: "CC",
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
        <div className="testimonials-grid">
          {HOME_TESTIMONIALS.map((t, i) => (
            <figure key={i} className={'t-card' + (t.featured ? ' featured' : '')}>
              <span className="t-mark" aria-hidden="true">"</span>
              <blockquote className="t-quote">{t.quote}</blockquote>
              <div className="t-divider"/>
              <figcaption className="t-attrib">
                <div className="t-avatar">{t.initials}</div>
                <div>
                  <div className="t-name">{t.name}</div>
                  <div className="t-role">{t.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

window.BookPromo = BookPromo;
window.Testimonials = Testimonials;
