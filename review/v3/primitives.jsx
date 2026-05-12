/* global React */
const { useState, useEffect, useRef } = React;

// ── Tiny icons (Lucide-flavored, square caps, 1.6 stroke) ──────────────
function Arrow({ size = 16, dir = "right" }) {
  const paths = {
    right:  <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    upRight:<><path d="M7 17 17 7"/><path d="M8 7h9v9"/></>,
    down:   <><path d="M12 5v14"/><path d="m6 13 6 6 6-6"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.6"
         strokeLinecap="square" strokeLinejoin="miter">
      {paths[dir]}
    </svg>
  );
}

function Logo({ size = 22, color = "var(--blue-500)" }) {
  // L-bracket logomark — matches the brand favicon
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke={color} strokeWidth="2.4" strokeLinecap="square">
      <path d="M5 3v18h13"/>
      <path d="M9 3v14h9"/>
    </svg>
  );
}

function Wordmark({ size = 22, color = "var(--blue-500)" }) {
  return (
    <a href="#hero" data-magnetic
       style={{ display: "inline-flex", alignItems: "center", gap: 10,
                color: "var(--fg-1)", fontWeight: 700, fontSize: 16,
                letterSpacing: "-0.02em" }}>
      <Logo size={size} color={color} />
      <span>Lorraine&nbsp;Lee</span>
    </a>
  );
}

function Kicker({ children, color, style }) {
  return (
    <span className="t-kicker"
          style={{ color: color || "var(--fg-2)", display: "inline-block", ...style }}>
      {children}
    </span>
  );
}

function Btn({ children, variant = "primary", as = "a", href = "#", onClick, ...rest }) {
  const Tag = as;
  return (
    <Tag href={href} onClick={onClick}
         className={`btn btn-${variant}`} data-magnetic {...rest}>
      <span className="btn-label">{children}</span>
    </Tag>
  );
}

// ── Reveal-on-scroll wrapper ──────────────────────────────────────────
function Reveal({ children, delay = 0, as = "div", style, ...rest }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const Tag = as;
  return (
    <Tag ref={ref}
         className={`reveal${shown ? " in" : ""}`}
         data-delay={delay}
         style={style} {...rest}>
      {children}
    </Tag>
  );
}

// ── Section index left rail (scroll-synced) ───────────────────────────
function SectionIndex({ sections, active }) {
  return (
    <aside className="sec-index">
      {sections.map((s) => (
        <a key={s.id} href={`#${s.id}`}
           className={active === s.id ? "active" : ""}>
          <span style={{ width: 22, display: "inline-block" }}>{s.n}</span>
          <span className="bar"/>
          <span className="lab">{s.label}</span>
        </a>
      ))}
    </aside>
  );
}

// Hook: scroll-spy by section id
function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids.join(",")]);
  return active;
}

Object.assign(window, { Arrow, Logo, Wordmark, Kicker, Btn, Reveal, SectionIndex, useActiveSection });
