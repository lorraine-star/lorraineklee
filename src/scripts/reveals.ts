/*
 * Shared scroll-reveal "waterfall" for the editorial layouts (SpeakingLayout,
 * FunnelLayout). Children of any `.reveal-stagger` get a `.reveal` class plus an
 * incremental transition-delay so they cascade; each `.reveal` element fades up
 * (see `.reveal` / `.reveal.is-in` in styles/editorial/templates.css) once it
 * enters the viewport.
 *
 * IntersectionObserver alone has a gap: during a fast or programmatic scroll
 * (trackpad flick, mousewheel slam, End key, in-page anchor jump) an element can
 * pass from fully below to fully above the viewport between observer samples.
 * No threshold is crossed, the callback never fires, and that section stays
 * stuck at opacity:0 for the rest of the visit (CLI-132). A rAF-throttled
 * scroll/resize sweep is the safety net: it reveals any element whose top has
 * crossed the trigger line, so the waterfall always completes.
 *
 * Both editorial layouts import this so the behaviour can't drift between them.
 */

interface RevealOptions {
  /** Per-child stagger step inside a `.reveal-stagger` group, in ms. */
  staggerStep?: number;
  /**
   * If set, force-reveal every remaining element this many ms after init,
   * regardless of scroll position. Belt-and-suspenders for embedded/in-app
   * renderers that may not drive IntersectionObserver or fire scroll events
   * (used by the funnel pages, whose content must never stay hidden).
   */
  forceRevealAfter?: number;
}

export function initReveals(options: RevealOptions = {}): void {
  const { staggerStep = 80, forceRevealAfter } = options;

  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  document
    .querySelectorAll<HTMLElement>('.reveal-stagger')
    .forEach((parent) => {
      Array.from(parent.children).forEach((child, i) => {
        const el = child as HTMLElement;
        el.classList.add('reveal');
        if (!el.style.transitionDelay) {
          el.style.transitionDelay = i * staggerStep + 'ms';
        }
      });
    });

  const revealEls = Array.from(
    document.querySelectorAll<HTMLElement>('.reveal')
  );
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('is-in'));
    return;
  }

  const remaining = new Set(revealEls);
  const reveal = (el: HTMLElement) => {
    el.classList.add('is-in');
    remaining.delete(el);
    observer.unobserve(el);
    if (!remaining.size) {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) reveal(entry.target as HTMLElement);
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  );
  revealEls.forEach((el) => observer.observe(el));

  // Safety net for observer skips: reveal anything whose top has already
  // crossed the bottom trigger line (mirrors the -8% rootMargin above). Also
  // covers elements already past the line on load, e.g. deep-link/anchor
  // landings.
  const sweep = () => {
    if (!remaining.size) return;
    const line = window.innerHeight * 0.92;
    for (const el of Array.from(remaining)) {
      if (el.getBoundingClientRect().top < line) reveal(el);
    }
  };
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      sweep();
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  sweep();

  // Optional hard guarantee for non-interactive embedded contexts.
  if (typeof forceRevealAfter === 'number') {
    window.setTimeout(() => {
      for (const el of Array.from(remaining)) reveal(el);
    }, forceRevealAfter);
  }
}
