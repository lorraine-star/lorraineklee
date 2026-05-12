// =====================================================================
// interactions.jsx
// Shared interaction primitives used across all 5 templates.
//
// Exports (globals):
//   useInView(opts)         - hook returning [ref, inView] for one-shot reveals
//   CountUp                 - animated number ticker, fires when scrolled in
//   TiltCard                - subtle pointer-driven 3D tilt wrapper
//   FilterTabs              - segmented tabs with a sliding pill indicator
//   useSmoothAnchors()      - call once to upgrade in-page anchor scrolling
//
// Plus: on load it installs a global IntersectionObserver that toggles
// the `is-in` class on any element with `.reveal` / `.reveal-stagger`
// when it enters the viewport. No need to wire anything up per-element.
// =====================================================================

(function installRevealObserver() {
  if (typeof window === 'undefined') return;
  if (window.__revealObserverInstalled) return;
  window.__revealObserverInstalled = true;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    // Just reveal everything immediately.
    document.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('.reveal, .reveal-stagger > *').forEach(el => el.classList.add('is-in'));
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.classList.add('is-in');
      observer.unobserve(e.target);
    }
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  function scan() {
    document.querySelectorAll('.reveal:not(.is-in)').forEach(el => observer.observe(el));
    document.querySelectorAll('.reveal-stagger').forEach(parent => {
      // give each child an incremental delay, then observe each child
      [...parent.children].forEach((child, i) => {
        if (!child.classList.contains('reveal')) child.classList.add('reveal');
        if (!child.style.transitionDelay) child.style.transitionDelay = (i * 80) + 'ms';
        if (!child.classList.contains('is-in')) observer.observe(child);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', scan);
  // Also rescan after React mounts content. Simple MutationObserver.
  const mo = new MutationObserver(() => scan());
  document.addEventListener('DOMContentLoaded', () => {
    mo.observe(document.body, { childList: true, subtree: true });
  });
})();

// ---------------------------------------------------------------------
// useInView — hook variant for opt-in element-level reveals
// ---------------------------------------------------------------------
function useInView({ threshold = 0.2, once = true } = {}) {
  const ref = React.useRef(null);
  const [inView, setInView] = React.useState(false);
  React.useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const obs = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          setInView(true);
          if (once) obs.unobserve(e.target);
        } else if (!once) {
          setInView(false);
        }
      }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, once]);
  return [ref, inView];
}
window.useInView = useInView;

// ---------------------------------------------------------------------
// CountUp — animates a number from 0 to `to` when scrolled into view.
// Supports decimals (5/5 -> to=5, suffix="/5") and percentages.
// Respects prefers-reduced-motion (renders the final value directly).
// ---------------------------------------------------------------------
function CountUp({ to, duration = 1400, suffix = '', prefix = '', decimals = 0 }) {
  const [ref, inView] = useInView({ threshold: 0.4 });
  const [val, setVal] = React.useState(0);
  const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  React.useEffect(() => {
    if (!inView) return;
    if (reduceMotion) { setVal(to); return; }
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(eased * to);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setVal(to);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration, reduceMotion]);

  const display = decimals > 0 ? val.toFixed(decimals) : Math.round(val).toLocaleString();
  return <span ref={ref}>{prefix}{display}{suffix}</span>;
}
window.CountUp = CountUp;

// ---------------------------------------------------------------------
// TiltCard — subtle 3D pointer-tilt for hero objects (book cover, etc.)
// max=8 keeps it tasteful, never feels gimmicky.
// ---------------------------------------------------------------------
function TiltCard({ children, max = 7, scale = 1.015, glare = false, className = '', style }) {
  const ref = React.useRef(null);
  const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const onMove = React.useCallback((e) => {
    if (reduceMotion || !ref.current) return;
    const el = ref.current;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rx = (0.5 - py) * max * 2;
    const ry = (px - 0.5) * max * 2;
    el.style.setProperty('--tilt-rx', rx + 'deg');
    el.style.setProperty('--tilt-ry', ry + 'deg');
    el.style.setProperty('--tilt-scale', scale);
    if (glare) {
      el.style.setProperty('--glare-x', (px * 100) + '%');
      el.style.setProperty('--glare-y', (py * 100) + '%');
    }
  }, [max, scale, glare, reduceMotion]);

  const onLeave = React.useCallback(() => {
    if (!ref.current) return;
    const el = ref.current;
    el.style.setProperty('--tilt-rx', '0deg');
    el.style.setProperty('--tilt-ry', '0deg');
    el.style.setProperty('--tilt-scale', 1);
  }, []);

  return (
    <div
      ref={ref}
      className={'tilt-card ' + className}
      style={style}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div className="tilt-card-inner">
        {children}
        {glare && <span className="tilt-glare" aria-hidden="true" />}
      </div>
    </div>
  );
}
window.TiltCard = TiltCard;

// ---------------------------------------------------------------------
// FilterTabs — segmented tabs with a sliding pill indicator
// Used on Learn content hub.
// ---------------------------------------------------------------------
function FilterTabs({ tabs, value, onChange }) {
  const wrapRef = React.useRef(null);
  const [pill, setPill] = React.useState({ left: 0, width: 0, ready: false });

  const measure = React.useCallback(() => {
    if (!wrapRef.current) return;
    const active = wrapRef.current.querySelector('.filter-tab.active');
    if (!active) return;
    const wrapRect = wrapRef.current.getBoundingClientRect();
    const rect = active.getBoundingClientRect();
    setPill({ left: rect.left - wrapRect.left, width: rect.width, ready: true });
  }, []);

  React.useLayoutEffect(() => { measure(); }, [value, measure]);
  React.useEffect(() => {
    const onR = () => measure();
    window.addEventListener('resize', onR);
    return () => window.removeEventListener('resize', onR);
  }, [measure]);

  return (
    <div className="filter-bar filter-bar--animated" ref={wrapRef}>
      <span
        className="filter-pill"
        style={{
          transform: `translateX(${pill.left}px)`,
          width: pill.width + 'px',
          opacity: pill.ready ? 1 : 0,
        }}
        aria-hidden="true"
      />
      {tabs.map(t => (
        <button
          key={t.id}
          className={'filter-tab' + (value === t.id ? ' active' : '')}
          onClick={() => onChange(t.id)}
          type="button"
        >
          {t.label}
          {t.count != null && <span className="count">{t.count}</span>}
        </button>
      ))}
    </div>
  );
}
window.FilterTabs = FilterTabs;

// ---------------------------------------------------------------------
// useSmoothAnchors — upgrade in-page anchor links with eased scroll
// + a brief highlight pulse on the destination.
// ---------------------------------------------------------------------
(function installSmoothAnchors() {
  if (typeof window === 'undefined') return;
  if (window.__smoothAnchorsInstalled) return;
  window.__smoothAnchorsInstalled = true;
  document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    target.classList.remove('anchor-pulse');
    // re-trigger
    void target.offsetWidth;
    target.classList.add('anchor-pulse');
    setTimeout(() => target.classList.remove('anchor-pulse'), 1400);
  });
})();
