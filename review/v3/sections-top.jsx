/* global React */
const { useState, useEffect } = React;

// ── 01 · Free course strip + 02 · Nav ─────────────────────────────────
function TopBar({ tweaks }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onS = () => setScrolled(window.scrollY > 40);
    onS();
    window.addEventListener("scroll", onS, { passive: true });
    return () => window.removeEventListener("scroll", onS);
  }, []);

  return (
    <header style={{ position: "fixed", inset: "0 0 auto 0", zIndex: 100 }}>
      {/* Free course strip */}
      <a href="#course" data-magnetic
         style={{
           display: "flex", alignItems: "center", justifyContent: "center",
           gap: 16, padding: "10px 20px",
           background: "var(--blue-500)", color: "#fff",
           fontFamily: "var(--font-mono)", fontSize: 11.5,
           letterSpacing: "0.04em",
           transition: "background 240ms",
         }}>
        <span style={{ width: 6, height: 6, borderRadius: 999, background: "#fff",
                       boxShadow: "0 0 0 3px rgba(255,255,255,0.25)",
                       animation: "pulse 1800ms infinite" }}/>
        <span>FREE 5-DAY COURSE · INVISIBLE TO INFLUENTIAL</span>
        <Arrow size={14} />
        <style>{`@keyframes pulse {
          0%,100% { box-shadow: 0 0 0 3px rgba(255,255,255,0.25); }
          50%     { box-shadow: 0 0 0 6px rgba(255,255,255,0); }
        }`}</style>
      </a>

      {/* Nav */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px clamp(20px,3vw,32px)",
        background: scrolled ? "rgba(255,255,255,0.78)" : "rgba(255,255,255,0.55)",
        backdropFilter: "blur(20px) saturate(150%)",
        WebkitBackdropFilter: "blur(20px) saturate(150%)",
        borderBottom: scrolled ? "1px solid var(--line-1)" : "1px solid transparent",
        transition: "background 240ms, border-color 240ms",
      }}>
        <Wordmark size={22} />
        <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {[
            ["home", "#hero"], ["about", "#about"], ["speaking", "#speaking"],
            ["learn", "#learn"], ["book", "#book"], ["contact", "#contact"],
          ].map(([l, h]) => (
            <a key={l} href={h} className="nav-link">{l}</a>
          ))}
        </div>
        <Btn variant="primary" href="#book">Buy my book <Arrow /></Btn>
      </nav>
    </header>
  );
}

// ── 03 · Hero ─────────────────────────────────────────────────────────
function Hero({ tweaks }) {
  const [scrolled, setScrolled] = useState(0);
  useEffect(() => {
    const onS = () => setScrolled(Math.min(1, window.scrollY / 700));
    window.addEventListener("scroll", onS, { passive: true });
    return () => window.removeEventListener("scroll", onS);
  }, []);

  const usePortrait = tweaks.portrait === "asset";

  return (
    <section id="hero" data-screen-label="03 Hero" className="bg-mesh"
             style={{ minHeight: "100vh", paddingTop: "180px", overflow: "hidden" }}>
      <div className="container hero-grid"
           style={{
             display: "grid",
             gridTemplateColumns: "minmax(0, 1.35fr) minmax(0, 1fr)",
             gap: "clamp(32px, 5vw, 72px)",
             alignItems: "end",
             minHeight: "calc(100vh - 320px)",
           }}>
        {/* LEFT */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between",
                      gap: 48, paddingBottom: 24,
                      transform: `translateY(${scrolled * -30}px)`,
                      opacity: 1 - scrolled * 0.2 }}>
          <div>
            <Reveal delay={0}>
              <Kicker>WALL STREET JOURNAL BESTSELLING AUTHOR</Kicker>
            </Reveal>
            <Reveal delay={1} as="h1"
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "clamp(3rem, 8.5vw, 9rem)",
                      fontWeight: 800,
                      lineHeight: 0.88,
                      letterSpacing: "-0.045em",
                      margin: "20px 0 0",
                    }}>
              Show up.<br/>
              Speak up.<br/>
              <span className="brand-emphasis">Stand out.</span>
            </Reveal>
          </div>
          <div>
            <Reveal delay={2}
                    style={{
                      fontSize: 19, lineHeight: 1.5,
                      color: "var(--fg-2)", maxWidth: "44ch",
                      margin: "0 0 28px",
                    }}>
              <p>Lorraine has spent a decade teaching corporate leaders, managers, and high-potentials how to be the person their room remembers.</p>
            </Reveal>
            <Reveal delay={3}
                    style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
              <Btn variant="primary" href="#contact">Work with Lorraine <Arrow /></Btn>
              <Btn variant="ghost" href="#book">Read the book <Arrow /></Btn>
            </Reveal>
          </div>
        </div>

        {/* RIGHT — portrait */}
        <Reveal delay={2}
                style={{ position: "relative", alignSelf: "stretch", minHeight: 520,
                         transform: `translateY(${scrolled * 40}px)` }}>
          <div style={{ position: "absolute", left: 0, top: 0, zIndex: 4,
                        color: "var(--fg-3)", fontFamily: "var(--font-mono)",
                        fontSize: 10, letterSpacing: "0.08em" }}>
            PORTRAIT · 2026
          </div>

          {usePortrait ? (
            <img src="assets/portrait.webp" alt="Lorraine K. Lee"
                 data-cursor-grow
                 style={{
                   position: "absolute", inset: 0, width: "100%", height: "100%",
                   objectFit: "contain", objectPosition: "bottom right",
                   filter: "saturate(1.05)",
                 }}/>
          ) : (
            <image-slot id="hero-portrait"
                        placeholder="Drop editorial portrait of Lorraine"
                        shape="rect"
                        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}/>
          )}

          {/* Hairline-bracket overlay — visual "L" framing */}
          <svg style={{ position: "absolute", right: -8, top: 24, width: 80, height: 80,
                        color: "var(--blue-500)", opacity: 0.7, zIndex: 5 }}
               viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 2 H78 M78 2 V78"/>
          </svg>
          <svg style={{ position: "absolute", left: -8, bottom: 24, width: 80, height: 80,
                        color: "var(--neutral-1000)", opacity: 0.85, zIndex: 5 }}
               viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 2 V78 H78"/>
          </svg>
        </Reveal>
      </div>

      {/* Scroll cue */}
      <div style={{ position: "absolute", left: "50%", bottom: 24, transform: "translateX(-50%)",
                    display: "flex", alignItems: "center", gap: 8,
                    fontFamily: "var(--font-mono)", fontSize: 10,
                    letterSpacing: "0.08em", color: "var(--fg-3)" }}>
        SCROLL <Arrow size={12} dir="down" />
      </div>
    </section>
  );
}

// ── 04 · Trusted by employees at ──────────────────────────────────────
function TrustedBy() {
  // PLACEHOLDER LOGOS — user is uploading real client logos. Until then,
  // we render typeset wordmarks in grayscale at the right rhythm.
  const logos = [
    "Zoom", "Cisco", "amazon", "GitLab", "McKinsey & Company",
    "Salesforce", "LinkedIn", "Figma", "LinkedIn Learning",
    "Zynga", "Indeed", "Canva", "Google",
  ];
  return (
    <section id="trusted" data-screen-label="04 Trusted"
             style={{ padding: "80px var(--sec-pad-x)", borderTop: "1px solid var(--line-1)" }}>
      <div className="container">
        <Reveal>
          <Kicker>S04 · TRUSTED BY EMPLOYEES AT</Kicker>
        </Reveal>
        <Reveal delay={1}
                style={{ marginTop: 32,
                         display: "grid",
                         gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                         columnGap: 24, rowGap: 20,
                         alignItems: "center", justifyItems: "center",
                         borderTop: "1px solid var(--line-1)",
                         borderBottom: "1px solid var(--line-1)",
                         padding: "32px 0" }}>
          {logos.map((l) => (
            <span key={l} className="logo-cell">{l}</span>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

// ── 05 · How I can help you ───────────────────────────────────────────
function HowICanHelp() {
  const items = [
    { n: "01", label: "Speaking", desc: "Keynotes that make rooms remember the message — and the speaker.", href: "#speaking" },
    { n: "02", label: "Unforgettable Presence®", desc: "The book the corporate L&D world actually reads.", href: "#book" },
    { n: "03", label: "Courses", desc: "On-demand training on LinkedIn Learning — 250,000+ students.", href: "#learn" },
    { n: "04", label: "Custom programs", desc: "Cohort-based intensives for managers and high-potentials.", href: "#contact" },
  ];
  return (
    <section id="help" data-screen-label="05 How I can help">
      <div className="container">
        <Reveal>
          <Kicker>S05 · HOW I CAN HELP YOU</Kicker>
        </Reveal>
        <Reveal delay={1} as="h2"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "clamp(2.25rem, 5vw, 4.5rem)",
                  fontWeight: 700, lineHeight: 0.95,
                  letterSpacing: "-0.04em",
                  margin: "16px 0 56px", maxWidth: "18ch",
                }}>
          Four ways into the <span className="brand-emphasis">work</span>.
        </Reveal>
        <div className="help-grid"
             style={{ display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)",
                      borderBottom: "1px solid var(--line-strong)" }}>
          {items.map((it, i) => (
            <Reveal key={it.n} delay={i % 4} as="a" href={it.href}
                    className="help-card" data-magnetic>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 28 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.06em" }}>{it.n}</span>
                <span className="help-arrow" style={{ display: "inline-flex" }}>
                  <Arrow size={20} dir="upRight" />
                </span>
              </div>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: 22, fontWeight: 600,
                            letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: 14 }}>
                {it.label}
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.5, opacity: 0.85, maxWidth: "32ch" }}>
                {it.desc}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── 06 · Follow on LinkedIn ───────────────────────────────────────────
function FollowLinkedIn() {
  return (
    <section id="follow" data-screen-label="06 Follow"
             style={{ background: "var(--neutral-1000)", color: "#fff",
                      padding: "var(--sec-pad-y) var(--sec-pad-x)" }}>
      <div className="container"
           style={{ display: "grid",
                    gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)",
                    gap: 48, alignItems: "center" }}>
        <Reveal>
          <Kicker color="rgba(255,255,255,0.6)">S06 · COMMUNITY</Kicker>
          <h2 style={{ fontFamily: "var(--font-sans)", fontWeight: 700,
                       fontSize: "clamp(2rem, 4.5vw, 3.75rem)",
                       lineHeight: 1.0, letterSpacing: "-0.04em",
                       margin: "16px 0 8px" }}>
            120,000+ leaders read her LinkedIn weekly.
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.55, color: "rgba(255,255,255,0.65)", maxWidth: "52ch" }}>
            Practical posts on executive presence, communication, and getting credit for your work — three times a week.
          </p>
        </Reveal>
        <Reveal delay={1} style={{ justifySelf: "end" }}>
          <Btn variant="on-dark" href="https://linkedin.com/in/lorraineklee">
            Follow on LinkedIn <Arrow dir="upRight" />
          </Btn>
        </Reveal>
      </div>
    </section>
  );
}

Object.assign(window, { TopBar, Hero, TrustedBy, HowICanHelp, FollowLinkedIn });
