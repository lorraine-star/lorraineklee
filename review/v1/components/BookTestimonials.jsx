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
// Client proof — repeat engagements are staged as a weighted bento grid so
// the strongest relationship leads, secondary proof gets more surface area,
// and the rest slot into tighter editorial tiles with restrained reveal
// motion from the page edges.
// =====================================================================
const REPEAT_ENGAGEMENTS = [
  {
    id: "linkedin-learning",
    count: "19x",
    role: "Instructor",
    company: "LinkedIn Learning",
    note: "Her deepest repeat teaching relationship.",
    featured: true,
  },
  { id: "powertofly", count: "9x", role: "Speaker", company: "PowerToFly" },
  { id: "linkedin", count: "7x", role: "Speaker", company: "LinkedIn" },
  { id: "cisco", count: "7x", role: "Speaker", company: "Cisco" },
  { id: "google", count: "6x", role: "Speaker", company: "Google" },
  { id: "zoom", count: "5x", role: "Speaker", company: "Zoom" },
  { id: "northwestern", count: "5x", role: "Speaker", company: "Northwestern University" },
  { id: "servicenow", count: "3x", role: "Speaker", company: "ServiceNow" },
];

const PROOF_LOGOS = {
  linkedin: "assets/company-logos/linkedin.svg",
  cisco: "assets/company-logos/cisco.svg",
  google: "assets/company-logos/google.svg",
  zoom: "assets/company-logos/zoom.svg",
  servicenow: "assets/company-logos/servicenow.svg",
  powertofly: "assets/company-logos/powertofly.png",
  northwestern: "assets/company-logos/northwestern.png",
};

const PROOF_LAYOUTS = {
  "linkedin-learning": "proof-card--featured",
  "powertofly": "proof-card--top",
  "linkedin": "proof-card--linkedin-slot",
  "cisco": "proof-card--cisco-slot",
  "google": "proof-card--google-slot",
  "zoom": "proof-card--zoom-slot",
  "northwestern": "proof-card--northwestern-slot",
  "servicenow": "proof-card--servicenow-slot",
};

function ProofWordmark({ id, company }) {
  switch (id) {
    case "linkedin-learning":
      return (
        <span className="proof-logo-lockup proof-logo-lockup--linkedin-learning" aria-label={company}>
          <img
            className="proof-logo proof-logo--linkedin"
            src={PROOF_LOGOS.linkedin}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
          />
          <span className="proof-logo-descriptor">Learning</span>
        </span>
      );
    case "linkedin":
      return <img className="proof-logo proof-logo--linkedin" src={PROOF_LOGOS.linkedin} alt={company} loading="lazy" decoding="async"/>;
    case "powertofly":
      return <img className="proof-logo proof-logo--powertofly" src={PROOF_LOGOS.powertofly} alt={company} loading="lazy" decoding="async"/>;
    case "cisco":
      return <img className="proof-logo proof-logo--cisco" src={PROOF_LOGOS.cisco} alt={company} loading="lazy" decoding="async"/>;
    case "google":
      return <img className="proof-logo proof-logo--google" src={PROOF_LOGOS.google} alt={company} loading="lazy" decoding="async"/>;
    case "zoom":
      return <img className="proof-logo proof-logo--zoom" src={PROOF_LOGOS.zoom} alt={company} loading="lazy" decoding="async"/>;
    case "northwestern":
      return <img className="proof-logo proof-logo--northwestern" src={PROOF_LOGOS.northwestern} alt={company} loading="lazy" decoding="async"/>;
    case "servicenow":
      return <img className="proof-logo proof-logo--servicenow" src={PROOF_LOGOS.servicenow} alt={company} loading="lazy" decoding="async"/>;
    default:
      return <span className="proof-wordmark">{company}</span>;
  }
}

function Testimonials() {
  const sectionRef = React.useRef(null);

  React.useEffect(() => {
    const section = sectionRef.current;

    if (!section) return undefined;

    const cards = Array.from(section.querySelectorAll(".proof-card"));
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      cards.forEach((card) => card.classList.add("is-visible"));
      return undefined;
    }

    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.24,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    cards.forEach((card) => observer.observe(card));

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section className="testimonials client-proof" data-screen-label="06 Client proof">
      <div className="grid12">
        <div className="testimonials-head">
          <span className="eyebrow">Client proof</span>
          <h2 className="testimonials-title">Companies continue to bring Lorraine back for more</h2>
          <p className="lead">
            Repeat invitations across speaking, instruction, and leadership programs.
          </p>
        </div>
        <div className="client-proof-layout" ref={sectionRef} role="list" aria-label="Repeat client engagements">
          {REPEAT_ENGAGEMENTS.map((item, index) => {
            const placement = PROOF_LAYOUTS[item.id] ? ` ${PROOF_LAYOUTS[item.id]}` : "";

            return (
              <article
                key={item.id}
                className={"proof-card" + placement}
                role="listitem"
                style={{ "--proof-delay": `${Math.min(index * 70, 280)}ms` }}
              >
                <div className="proof-card-meta">
                  <span className="proof-card-index">{String(index + 1).padStart(2, "0")} / 08</span>
                  {item.featured && <span className="proof-card-tag">Most repeated</span>}
                </div>
                <div className="proof-card-top">
                  <div className={"proof-count" + (item.featured ? " proof-count--featured" : " proof-count--card")}>
                    {item.count}
                  </div>
                  <div className="proof-role">{item.role}</div>
                </div>
                <div className="proof-divider" aria-hidden="true"/>
                <div className="proof-card-brand">
                  <ProofWordmark id={item.id} company={item.company} />
                </div>
                {item.note && <p className="proof-note">{item.note}</p>}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

window.BookPromo = BookPromo;
window.FourWaysSlim = FourWaysSlim;
window.Testimonials = Testimonials;
