/* global React */
const { useEffect, useRef, useState: _useStateCursor } = React;

// Custom cursor — ring + dot, hover/grow/text states; magnetic pull on [data-magnetic]
function Cursor() {
  const ringRef = useRef(null);
  const dotRef = useRef(null);
  const target = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const raf = useRef(0);
  const [variant, setVariant] = _useStateCursor("");

  useEffect(() => {
    // Disable on coarse pointers
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (e) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      // Magnetic pull
      const t = e.target.closest("[data-magnetic]");
      if (t) {
        const r = t.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const d = Math.hypot(dx, dy);
        if (d < 80) {
          target.current.x = cx + dx * 0.55;
          target.current.y = cy + dy * 0.55;
        }
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX - 2}px, ${e.clientY - 2}px)`;
      }
    };

    const onOver = (e) => {
      const t = e.target;
      if (t.closest("[data-cursor-grow]")) setVariant("c-grow");
      else if (t.closest("[data-cursor-text]")) setVariant("c-text");
      else if (t.closest("a, button, [data-magnetic], input, label, .help-card, .testimonial-card")) setVariant("c-hover");
      else setVariant("");
    };

    const onLeave = () => setVariant("c-hide");
    const onEnter = () => setVariant("");

    const tick = () => {
      ring.current.x += (target.current.x - ring.current.x) * 0.18;
      ring.current.y += (target.current.y - ring.current.y) * 0.18;
      if (ringRef.current) {
        const w = ringRef.current.offsetWidth;
        ringRef.current.style.transform = `translate(${ring.current.x - w / 2}px, ${ring.current.y - w / 2}px)`;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    document.body.addEventListener("mouseleave", onLeave);
    document.body.addEventListener("mouseenter", onEnter);
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.body.removeEventListener("mouseleave", onLeave);
      document.body.removeEventListener("mouseenter", onEnter);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className={`cursor-ring ${variant}`} />
      <div ref={dotRef} className="cursor-dot" />
    </>
  );
}

window.Cursor = Cursor;
