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
// Client proof — repeat engagements are the main signal here, but the
// section needs to feel lighter than a dense grid. A staggered horizontal
// rail keeps the proof card language while reducing visual bulk.
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

function ProofWordmark({ id, company }) {
  switch (id) {
    case "linkedin-learning":
      return (
        <span className="proof-wordmark proof-wordmark--linkedin-learning" aria-label={company}>
          <span className="brand">LinkedIn</span>
          <span className="descriptor">Learning</span>
        </span>
      );
    case "linkedin":
      return <span className="proof-wordmark proof-wordmark--linkedin">{company}</span>;
    case "powertofly":
      return (
        <span className="proof-wordmark proof-wordmark--powertofly" aria-label={company}>
          <span className="strong">POWER</span>
          <span className="minor">to</span>
          <span className="strong">FLY</span>
        </span>
      );
    case "cisco":
      return <span className="proof-wordmark proof-wordmark--cisco">{company}</span>;
    case "google":
      return <span className="proof-wordmark proof-wordmark--google">{company}</span>;
    case "zoom":
      return <span className="proof-wordmark proof-wordmark--zoom">{company}</span>;
    case "northwestern":
      return <span className="proof-wordmark proof-wordmark--northwestern">{company}</span>;
    case "servicenow":
      return (
        <span className="proof-wordmark proof-wordmark--servicenow" aria-label={company}>
          <span className="strong">service</span>
          <span className="minor">now</span>
        </span>
      );
    default:
      return <span className="proof-wordmark">{company}</span>;
  }
}

function Testimonials() {
  const sectionRef = React.useRef(null);

  React.useEffect(() => {
    const section = sectionRef.current;

    if (!section) return undefined;

    const panels = Array.from(section.querySelectorAll(".proof-panel"));
    let frame = 0;

    function updateParallax() {
      frame = 0;

      const viewportHeight = window.innerHeight || 1;

      panels.forEach((panel, index) => {
        const card = panel.querySelector(".proof-card");

        if (!card) return;

        const rect = panel.getBoundingClientRect();
        const distance = rect.top + rect.height * 0.5 - viewportHeight * 0.56;
        const normalized = Math.max(-1, Math.min(1, distance / (viewportHeight * 0.72)));
        const depth = Number(card.dataset.depth || 1);
        const direction = index % 2 === 0 ? -1 : 1;
        const shift = -normalized * depth * 30;
        const drift = normalized * depth * direction * 10;
        const scale = 1 - Math.abs(normalized) * 0.032;
        const opacity = 0.78 + (1 - Math.min(1, Math.abs(normalized) * 1.1)) * 0.22;

        card.style.setProperty("--proof-shift", `${shift.toFixed(2)}px`);
        card.style.setProperty("--proof-drift", `${drift.toFixed(2)}px`);
        card.style.setProperty("--proof-scale", `${scale.toFixed(3)}`);
        card.style.setProperty("--proof-opacity", `${opacity.toFixed(3)}`);
      });
    }

    function queueParallax() {
      if (!frame) frame = window.requestAnimationFrame(updateParallax);
    }

    window.addEventListener("scroll", queueParallax, { passive: true });
    window.addEventListener("resize", queueParallax);
    queueParallax();

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", queueParallax);
      window.removeEventListener("resize", queueParallax);
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
          <p className="proof-sequence-note">
            Eight repeat client relationships, ordered by recurrence.
          </p>
          {REPEAT_ENGAGEMENTS.map((item, index) => {
            const depth = [1.4, 0.9, 1.1, 0.76, 1.2, 0.96, 1.06, 0.82][index] || 1;
            const alignment = item.featured ? " proof-panel--featured" : (index % 2 === 0 ? " proof-panel--left" : " proof-panel--right");

            return (
              <div
                key={item.id}
                className={"proof-panel" + alignment}
                role="listitem"
              >
                <div className="proof-panel-track">
                  <article
                    className={"proof-card" + (item.featured ? " proof-card--featured" : "")}
                    data-depth={depth}
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
                </div>
              </div>
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
