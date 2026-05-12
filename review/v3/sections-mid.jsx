/* global React */
const { useState: _useStateMid, useEffect: _useEffMid, useRef: _useRefMid } = React;

// ── 07 · Speaking long-form ───────────────────────────────────────────
function SpeakingLongForm() {
  const clients = ["Zoom", "Google", "Cisco", "McKinsey", "LinkedIn"];
  return (
    <section id="speaking" data-screen-label="07 Speaking">
      <div className="container"
           style={{ display: "grid",
                    gridTemplateColumns: "minmax(0, 5fr) minmax(0, 7fr)",
                    gap: "clamp(32px, 5vw, 80px)", alignItems: "start" }}>
        <Reveal>
          <Kicker>S07 · ON STAGE</Kicker>
          <div style={{ marginTop: 32 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11,
                          letterSpacing: "0.06em", color: "var(--fg-3)", marginBottom: 12 }}>
              PAST CLIENTS
            </div>
            {clients.map((c, i) => (
              <div key={c}
                   style={{ display: "flex", justifyContent: "space-between",
                            padding: "14px 0",
                            borderTop: i === 0 ? "1px solid var(--line-strong)" : "1px solid var(--line-1)",
                            fontSize: 18, fontWeight: 500, letterSpacing: "-0.01em" }}>
                <span>{c}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 12,
                               color: "var(--fg-3)", letterSpacing: "0.04em" }}>
                  KEYNOTE
                </span>
              </div>
            ))}
            <div style={{ borderTop: "1px solid var(--line-1)" }}/>
          </div>
        </Reveal>

        <Reveal delay={1}>
          <h2 style={{ fontFamily: "var(--font-sans)", fontWeight: 700,
                       fontSize: "clamp(2.5rem, 5vw, 5rem)",
                       lineHeight: 0.95, letterSpacing: "-0.045em",
                       margin: "0 0 28px", maxWidth: "16ch" }}>
            A keynote that doesn't <span className="brand-emphasis">end</span> when she leaves the stage.
          </h2>
          <p style={{ fontSize: 19, lineHeight: 1.55, color: "var(--fg-2)",
                      maxWidth: "56ch", margin: "0 0 20px" }}>
            Lorraine designs every talk for one outcome: your team leaves with a tactic they can use in their next meeting. Not theory. Not motivation. The specific moves that turn quiet competence into recognized leadership.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.55, color: "var(--fg-2)",
                      maxWidth: "56ch", margin: "0 0 36px" }}>
            She has delivered keynotes for Zoom, Google, Cisco, McKinsey, LinkedIn, and dozens of Fortune 500 leadership programs. Off-sites, all-hands, women's networks, manager kick-offs — the format flexes; the substance doesn't.
          </p>
          <Btn variant="secondary" href="#speaking-page">See speaking topics <Arrow /></Btn>
        </Reveal>
      </div>
    </section>
  );
}

// ── 08 · As seen in ───────────────────────────────────────────────────
function AsSeenIn() {
  // PLACEHOLDER — replace with real media SVGs when uploaded.
  const media = ["Forbes", "The Wall Street Journal", "Fast Company", "Inc.",
                 "Fortune", "Entrepreneur", "CNBC", "Business Insider"];
  return (
    <section id="press" data-screen-label="08 Press"
             style={{ padding: "80px var(--sec-pad-x)", borderTop: "1px solid var(--line-1)" }}>
      <div className="container">
        <Reveal>
          <Kicker>S08 · AS SEEN IN</Kicker>
        </Reveal>
        <Reveal delay={1}
                style={{ marginTop: 32,
                         display: "grid",
                         gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                         columnGap: 24, rowGap: 20,
                         alignItems: "center", justifyItems: "center",
                         borderTop: "1px solid var(--line-1)",
                         borderBottom: "1px solid var(--line-1)",
                         padding: "32px 0" }}>
          {media.map((m) => (
            <span key={m} className="logo-cell media">{m}</span>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

// ── 09 · Repeat-booking proof ─────────────────────────────────────────
function RepeatBooking() {
  // PLACEHOLDER MULTIPLIERS — current site has "0X" placeholders.
  // Final numbers need client confirmation.
  const rows = [
    { co: "Zoom",       mult: "6×", note: "rebooked across 4 BUs" },
    { co: "LinkedIn",   mult: "5×", note: "manager program · 2022–24" },
    { co: "McKinsey",   mult: "4×", note: "partner off-sites" },
    { co: "Cisco",      mult: "4×", note: "WIN summit, 3 years" },
    { co: "Google",     mult: "3×", note: "L5 leadership cohort" },
    { co: "Salesforce", mult: "3×", note: "Trailblazer DX" },
  ];
  return (
    <section id="rebook" data-screen-label="09 Rebooking"
             style={{ borderTop: "1px solid var(--line-strong)" }}>
      <div className="container"
           style={{ display: "grid",
                    gridTemplateColumns: "minmax(0, 5fr) minmax(0, 7fr)",
                    gap: "clamp(32px, 5vw, 80px)", alignItems: "start" }}>
        <Reveal>
          <Kicker>S09 · THEY KEEP COMING BACK</Kicker>
          <h2 style={{ fontFamily: "var(--font-sans)", fontWeight: 700,
                       fontSize: "clamp(2.25rem, 4.5vw, 4rem)",
                       lineHeight: 0.95, letterSpacing: "-0.04em",
                       margin: "16px 0 24px", maxWidth: "12ch" }}>
            Companies that book her, <span className="brand-emphasis">re-book</span> her.
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.55, color: "var(--fg-2)", maxWidth: "38ch" }}>
            The fastest signal in speaking is the second invoice. Here are companies that paid it more than once.
          </p>
        </Reveal>

        <Reveal delay={1}>
          <div style={{ borderTop: "1px solid var(--line-strong)" }}>
            {rows.map((r) => (
              <div key={r.co} className="rebook-row">
                <span style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em" }}>
                  {r.co}
                </span>
                <span className="rebook-mult num-tab"
                      style={{ fontFamily: "var(--font-sans)", fontSize: 40,
                               fontWeight: 700, letterSpacing: "-0.03em",
                               color: "var(--fg-1)",
                               transition: "color 240ms" }}>
                  {r.mult}
                </span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11,
                               letterSpacing: "0.04em", color: "var(--fg-3)",
                               textAlign: "right" }}>
                  {r.note}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── 10 · Speaker stats row ────────────────────────────────────────────
function SpeakerStats() {
  // PLACEHOLDER STATS — current site uses "0/5" and "0%". Confirm with client.
  const stats = [
    { n: "4.9",  unit: "/5",  label: "Average speaker rating · 2023" },
    { n: "98",   unit: "%",   label: "Found the session valuable" },
    { n: "96",   unit: "%",   label: "Learned something new" },
  ];
  return (
    <section id="stats" data-screen-label="10 Stats"
             className="bg-mesh-brand"
             style={{ color: "#fff", padding: "var(--sec-pad-y) var(--sec-pad-x)" }}>
      <div className="container">
        <Reveal>
          <Kicker color="rgba(255,255,255,0.7)">S10 · POST-EVENT SCORES</Kicker>
        </Reveal>
        <div className="stats-grid"
             style={{ marginTop: 40,
                      display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
                      gap: 0,
                      borderTop: "1px solid rgba(255,255,255,0.25)" }}>
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i}
                    style={{ padding: "40px 32px 32px 0",
                             borderRight: i < 2 ? "1px solid rgba(255,255,255,0.18)" : "0",
                             paddingLeft: i > 0 ? 32 : 0 }}>
              <div className="num-tab"
                   style={{ display: "flex", alignItems: "baseline", gap: 4,
                            fontFamily: "var(--font-sans)", fontWeight: 700,
                            fontSize: "clamp(4rem, 9vw, 8rem)",
                            lineHeight: 0.9, letterSpacing: "-0.05em" }}>
                <span>{s.n}</span>
                <span style={{ fontSize: "0.4em", opacity: 0.6 }}>{s.unit}</span>
              </div>
              <div style={{ marginTop: 16,
                            fontFamily: "var(--font-mono)", fontSize: 11.5,
                            letterSpacing: "0.06em", textTransform: "uppercase",
                            color: "rgba(255,255,255,0.85)", maxWidth: "24ch" }}>
                {s.label}
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Ghost L-bracket */}
      <svg style={{ position: "absolute", right: -40, bottom: -40, width: 460, height: 460,
                    opacity: 0.12, color: "white", pointerEvents: "none" }}
           viewBox="0 0 24 24" fill="none" stroke="currentColor"
           strokeWidth="1.4" strokeLinecap="square">
        <path d="M5 3v18h13"/>
        <path d="M9 3v14h9"/>
      </svg>
    </section>
  );
}

Object.assign(window, { SpeakingLongForm, AsSeenIn, RepeatBooking, SpeakerStats });
