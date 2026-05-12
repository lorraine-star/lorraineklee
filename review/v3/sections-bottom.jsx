/* global React */
const { useState: _useStateBot, useEffect: _useEffBot } = React;

// ── 11 · Book showcase ────────────────────────────────────────────────
function BookShowcase() {
  return (
    <section id="book" data-screen-label="11 Book"
             style={{ background: "var(--bg-1)" }}>
      <div className="container book-grid"
           style={{ display: "grid",
                    gridTemplateColumns: "minmax(0, 5fr) minmax(0, 7fr)",
                    gap: "clamp(32px, 6vw, 96px)", alignItems: "center" }}>
        <Reveal>
          <div style={{ position: "relative" }}>
            <img src="assets/book-cover.webp"
                 alt="Unforgettable Presence® — Lorraine K. Lee"
                 data-cursor-grow
                 style={{ width: "100%", height: "auto",
                          filter: "drop-shadow(0 50px 80px rgb(7 21 74 / 0.30)) drop-shadow(0 8px 16px rgb(0 0 0 / 0.10))" }}/>
            <div style={{ position: "absolute", top: 24, right: -16,
                          background: "var(--neutral-1000)", color: "#fff",
                          padding: "10px 14px", fontFamily: "var(--font-mono)",
                          fontSize: 11, letterSpacing: "0.06em" }}>
              WSJ BESTSELLER · WILEY 2024
            </div>
          </div>
        </Reveal>

        <Reveal delay={1}>
          <Kicker>S11 · THE BOOK</Kicker>
          <h2 style={{ fontFamily: "var(--font-sans)", fontWeight: 700,
                       fontSize: "clamp(2.5rem, 5.5vw, 5.5rem)",
                       lineHeight: 0.92, letterSpacing: "-0.045em",
                       margin: "20px 0 12px" }}>
            <em style={{ fontStyle: "normal" }}>Unforgettable Presence®</em>
          </h2>
          <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic",
                      fontSize: 26, lineHeight: 1.25, color: "var(--fg-2)",
                      margin: "0 0 32px", maxWidth: "26ch" }}>
            Get seen. Gain influence. Catapult your career.
          </p>
          <p style={{ fontSize: 18, lineHeight: 1.55, color: "var(--fg-2)",
                      maxWidth: "52ch", margin: "0 0 32px" }}>
            The operator's manual for getting credit for your work — used in leadership programs at Zoom, LinkedIn, and Salesforce. Five parts, fifty-two short chapters, no fluff.
          </p>

          <blockquote style={{
            position: "relative",
            borderLeft: "2px solid var(--blue-500)",
            padding: "8px 0 8px 24px",
            margin: "0 0 36px",
            fontFamily: "var(--font-serif)", fontStyle: "italic",
            fontSize: 22, lineHeight: 1.35, color: "var(--fg-1)", maxWidth: "44ch",
          }}>
            "The clearest, most actionable book on executive presence I've read in a decade."
            <footer style={{ marginTop: 12, fontFamily: "var(--font-mono)",
                             fontStyle: "normal", fontSize: 11,
                             letterSpacing: "0.06em", color: "var(--fg-3)" }}>
              — VP, PEOPLE · FORTUNE 100 TECH
            </footer>
          </blockquote>

          <Btn variant="primary" href="#buy">Get your copy <Arrow dir="upRight" /></Btn>
        </Reveal>
      </div>
    </section>
  );
}

// ── 12 · Ready to learn — LinkedIn Learning courses ──────────────────
function LearnFromLorraine() {
  const courses = [
    { code: "C01", title: "How to Speak So Others Listen", min: 48, level: "All levels" },
    { code: "C02", title: "Nano Tips for New Managers",     min: 22, level: "Manager" },
    { code: "C03", title: "Nano Tips to Stand Out As An Introvert", min: 28, level: "All levels" },
  ];
  return (
    <section id="learn" data-screen-label="12 Learn"
             style={{ background: "var(--bg-2)", borderTop: "1px solid var(--line-1)" }}>
      <div className="container">
        <Reveal>
          <Kicker>S12 · ON-DEMAND</Kicker>
        </Reveal>
        <Reveal delay={1}
                style={{ display: "grid",
                         gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)",
                         gap: 48, alignItems: "end",
                         margin: "16px 0 56px" }}>
          <h2 style={{ fontFamily: "var(--font-sans)", fontWeight: 700,
                       fontSize: "clamp(2.25rem, 5vw, 4.5rem)",
                       lineHeight: 0.95, letterSpacing: "-0.04em",
                       maxWidth: "18ch" }}>
            Ready to learn from <span className="brand-emphasis">Lorraine</span>?
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.55, color: "var(--fg-2)", maxWidth: "44ch" }}>
            15+ courses on LinkedIn Learning. 250,000+ students. Start with one, finish in a lunch break.
          </p>
        </Reveal>

        <div className="help-grid"
             style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
                      borderTop: "1px solid var(--line-strong)",
                      borderBottom: "1px solid var(--line-strong)" }}>
          {courses.map((c, i) => (
            <Reveal key={c.code} delay={i} as="a" href="#course-detail"
                    data-magnetic
                    style={{
                      padding: "32px 28px",
                      borderRight: i < 2 ? "1px solid var(--line-1)" : "0",
                      display: "flex", flexDirection: "column", gap: 24,
                      background: "var(--bg-1)",
                      transition: "background 320ms var(--ease-out-expo)",
                      minHeight: 280,
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "var(--neutral-1000)"}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "var(--bg-1)"; e.currentTarget.style.color = ""; }}
                    onMouseOver={(e) => e.currentTarget.style.color = "#fff"}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.06em" }}>
                  {c.code} · LINKEDIN LEARNING
                </span>
                <Arrow size={18} dir="upRight" />
              </div>
              <h3 style={{ fontFamily: "var(--font-sans)", fontWeight: 600,
                           fontSize: 26, lineHeight: 1.1,
                           letterSpacing: "-0.025em",
                           marginTop: "auto" }}>
                {c.title}
              </h3>
              <div style={{ display: "flex", justifyContent: "space-between",
                            fontFamily: "var(--font-mono)", fontSize: 11,
                            letterSpacing: "0.04em", opacity: 0.8 }}>
                <span>{c.min} min · {c.level}</span>
                <span>WATCH →</span>
              </div>
            </Reveal>
          ))}
        </div>

        <div style={{ marginTop: 32, display: "flex", justifyContent: "flex-end" }}>
          <Btn variant="ghost" href="#all-courses">See all 15+ courses <Arrow /></Btn>
        </div>
      </div>
    </section>
  );
}

// ── 13 · Testimonials ─────────────────────────────────────────────────
function Testimonials() {
  const hero = {
    quote: "Lorraine didn't give a talk. She gave our managers a vocabulary. Six months later we're still hearing her phrases used in the room.",
    name: "Priya Anand", role: "Head of L&D", company: "Salesforce",
  };
  const more = [
    { quote: "The single highest-rated keynote in our 11-year program history.",
      name: "Marcus Lee", role: "Director, Talent", company: "Cisco" },
    { quote: "Lorraine made my introverts believe they had a path. That alone was worth the budget.",
      name: "Sarah Goldfarb", role: "VP People", company: "Zynga" },
    { quote: "I've booked her three times. I'd book her three more.",
      name: "Daniel Park", role: "Chief of Staff", company: "Zoom" },
    { quote: "Specific, tactical, and warm. The combination is rarer than you'd think.",
      name: "Maya Ortega", role: "Partner", company: "McKinsey" },
    { quote: "The book is the gift our entire L5 cohort got at year-end.",
      name: "Tom Hwang", role: "Engineering Lead", company: "Google" },
    { quote: "Walked out, opened my laptop, rewrote my next 1:1 agenda. That's the test.",
      name: "Anya Volkov", role: "PM", company: "Figma" },
  ];

  return (
    <section id="testimonials" data-screen-label="13 Testimonials">
      <div className="container">
        <Reveal>
          <Kicker>S13 · WHAT THEY SAY</Kicker>
        </Reveal>

        {/* Hero testimonial */}
        <Reveal delay={1}
                style={{ margin: "24px 0 48px", maxWidth: "26ch" }}>
          <blockquote style={{
            fontFamily: "var(--font-sans)", fontWeight: 600,
            fontSize: "clamp(2rem, 4.5vw, 4rem)",
            lineHeight: 1.05, letterSpacing: "-0.035em",
            color: "var(--fg-1)",
            margin: 0,
          }}>
            <span style={{ color: "var(--blue-500)" }}>"</span>
            {hero.quote}
            <span style={{ color: "var(--blue-500)" }}>"</span>
          </blockquote>
          <div style={{ marginTop: 24, display: "flex", alignItems: "baseline", gap: 16,
                        fontFamily: "var(--font-mono)", fontSize: 11,
                        letterSpacing: "0.06em", color: "var(--fg-3)" }}>
            <span style={{ color: "var(--fg-1)", fontWeight: 600 }}>{hero.name.toUpperCase()}</span>
            <span>·</span>
            <span>{hero.role.toUpperCase()}</span>
            <span>·</span>
            <span>{hero.company.toUpperCase()}</span>
          </div>
        </Reveal>

        {/* Supporting grid */}
        <div className="testimonial-grid"
             style={{ display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: 16 }}>
          {more.map((t, i) => (
            <Reveal key={i} delay={(i % 3)} className="testimonial-card">
              <div style={{ display: "flex", flexDirection: "column", gap: 20, height: "100%" }}>
                <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic",
                              fontSize: 20, lineHeight: 1.35, color: "var(--fg-1)" }}>
                  "{t.quote}"
                </div>
                <div style={{ marginTop: "auto",
                              fontFamily: "var(--font-mono)", fontSize: 10.5,
                              letterSpacing: "0.06em", color: "var(--fg-3)" }}>
                  <div style={{ color: "var(--fg-1)", fontWeight: 600 }}>{t.name.toUpperCase()}</div>
                  <div style={{ marginTop: 4 }}>{t.role.toUpperCase()} · {t.company.toUpperCase()}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div style={{ marginTop: 32, display: "flex", justifyContent: "flex-end" }}>
          <Btn variant="ghost" href="#all-testimonials">All testimonials <Arrow /></Btn>
        </div>
      </div>
    </section>
  );
}

// ── 14 · Final CTA ────────────────────────────────────────────────────
function FinalCTA() {
  return (
    <section id="course" data-screen-label="14 Final CTA"
             className="bg-mesh-dark"
             style={{ color: "#fff", padding: "var(--sec-pad-y) var(--sec-pad-x)" }}>
      <div className="container"
           style={{ display: "grid",
                    gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)",
                    gap: 48, alignItems: "center" }}>
        <Reveal>
          <Kicker color="rgba(255,255,255,0.65)">S14 · FREE 5-DAY COURSE</Kicker>
          <h2 style={{ fontFamily: "var(--font-sans)", fontWeight: 700,
                       fontSize: "clamp(2.5rem, 6vw, 6rem)",
                       lineHeight: 0.92, letterSpacing: "-0.045em",
                       margin: "20px 0 24px" }}>
            From invisible to <br/><span style={{ color: "var(--blue-400)" }}>influential</span>.
          </h2>
          <p style={{ fontSize: 19, lineHeight: 1.55, color: "rgba(255,255,255,0.7)",
                      maxWidth: "52ch" }}>
            Five days. Five short emails. The exact moves Lorraine teaches Fortune 500 leaders — delivered to your inbox, free.
          </p>
        </Reveal>
        <Reveal delay={1}
                style={{ borderTop: "1px solid rgba(255,255,255,0.18)",
                         paddingTop: 32 }}>
          <form onSubmit={(e) => e.preventDefault()}
                style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <label style={{ display: "block" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10,
                             letterSpacing: "0.08em", textTransform: "uppercase",
                             color: "rgba(255,255,255,0.55)" }}>Work email</span>
              <input type="email" placeholder="you@company.com"
                     style={{ marginTop: 8, width: "100%",
                              padding: "14px 0", background: "transparent",
                              border: 0, borderBottom: "1px solid rgba(255,255,255,0.5)",
                              fontFamily: "var(--font-sans)", fontSize: 18,
                              color: "#fff", outline: 0 }}/>
            </label>
            <Btn as="button" variant="on-dark">Start the course <Arrow /></Btn>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5,
                           letterSpacing: "0.04em", color: "rgba(255,255,255,0.5)" }}>
              No spam. Unsubscribe in one click.
            </span>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

// ── 15 · Footer ───────────────────────────────────────────────────────
function Footer() {
  const links = ["About", "Speaking", "Learn", "Book", "Contact"];
  const socials = [
    { l: "LinkedIn",  href: "#" },
    { l: "X",         href: "#" },
    { l: "Instagram", href: "#" },
    { l: "YouTube",   href: "#" },
  ];
  return (
    <footer id="contact" data-screen-label="15 Footer"
            style={{ background: "var(--neutral-1000)", color: "#fff",
                     padding: "80px var(--sec-pad-x) 32px",
                     borderTop: "1px solid var(--line-strong)" }}>
      <div className="container">
        <div className="footer-grid"
             style={{ display: "grid",
                      gridTemplateColumns: "minmax(0, 1.4fr) repeat(3, minmax(0, 1fr))",
                      gap: 48, paddingBottom: 64,
                      borderBottom: "1px solid rgba(255,255,255,0.18)" }}>
          <div>
            <Logo size={36} color="#fff" />
            <div style={{ marginTop: 20, fontFamily: "var(--font-sans)", fontSize: 22,
                          fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.2 }}>
              Lorraine K. Lee
            </div>
            <a href="mailto:contact@lorraineklee.com"
               style={{ display: "inline-block", marginTop: 16,
                        color: "rgba(255,255,255,0.7)", fontSize: 14 }}>
              contact@lorraineklee.com
            </a>
          </div>

          <FooterCol title="Site">
            {links.map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`}
                 style={footerLinkStyle}>{l}</a>
            ))}
          </FooterCol>

          <FooterCol title="Follow">
            {socials.map((s) => (
              <a key={s.l} href={s.href}
                 style={{ ...footerLinkStyle, display: "inline-flex", alignItems: "center", gap: 6 }}>
                {s.l} <Arrow size={12} dir="upRight" />
              </a>
            ))}
          </FooterCol>

          <FooterCol title="Newsletter">
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)",
                        lineHeight: 1.55, margin: "0 0 16px" }}>
              Three notes a week on presence, communication, and getting credit for your work.
            </p>
            <Btn variant="on-dark" href="#course">Subscribe <Arrow /></Btn>
          </FooterCol>
        </div>

        <div style={{ paddingTop: 28,
                      display: "flex", flexWrap: "wrap", justifyContent: "space-between",
                      gap: 16,
                      fontFamily: "var(--font-mono)", fontSize: 10.5,
                      letterSpacing: "0.06em", color: "rgba(255,255,255,0.5)" }}>
          <span>© 2026 LORRAINE K. LEE · UNFORGETTABLE PRESENCE® · RISE LEARNING SOLUTIONS</span>
          <span style={{ display: "flex", gap: 24 }}>
            <a href="#terms" style={{ color: "inherit" }}>TERMS</a>
            <a href="#privacy" style={{ color: "inherit" }}>PRIVACY</a>
          </span>
        </div>
      </div>
    </footer>
  );
}

const footerLinkStyle = {
  display: "block", padding: "6px 0",
  fontSize: 14, color: "rgba(255,255,255,0.85)",
};

function FooterCol({ title, children }) {
  return (
    <div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10,
                    letterSpacing: "0.08em", textTransform: "uppercase",
                    color: "rgba(255,255,255,0.5)", marginBottom: 14 }}>
        {title}
      </div>
      {children}
    </div>
  );
}

Object.assign(window, { BookShowcase, LearnFromLorraine, Testimonials, FinalCTA, Footer });
