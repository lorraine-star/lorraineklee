import { useCallback, useEffect, useMemo, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import './home-testimonials-carousel.css';

type TestimonialLogo = {
  image: string;
  alt: string;
};

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  photo?: string;
  photoAlt?: string;
  initials: string;
  /** Optional company / book-cover logos shown in a row at the foot of the card. */
  logos?: TestimonialLogo[];
};

type HomeTestimonialsCarouselProps = {
  testimonials: Testimonial[];
};

type RenderedTestimonial = {
  testimonial: Testimonial;
  key: string;
  isClone: boolean;
};

const renderCard = (testimonial: Testimonial) => (
  <figure className="t-card">
    <span className="t-mark" aria-hidden="true">
      &ldquo;
    </span>
    <blockquote className="t-quote">{testimonial.quote}</blockquote>
    <div className="t-divider" />
    <figcaption className="t-attrib">
      {testimonial.photo ? (
        <img
          className="t-headshot"
          src={testimonial.photo}
          alt={testimonial.photoAlt || `Headshot of ${testimonial.name}`}
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div className="t-avatar" aria-hidden="true">
          {testimonial.initials}
        </div>
      )}
      <div>
        <div className="t-name">{testimonial.name}</div>
        <div className="t-role">{testimonial.role}</div>
      </div>
    </figcaption>
    {testimonial.logos && testimonial.logos.length > 0 && (
      <div className="t-logos">
        {testimonial.logos.map((logo) => (
          <img
            key={logo.image}
            className="t-logo"
            src={logo.image}
            alt={logo.alt}
            loading="lazy"
            decoding="async"
          />
        ))}
      </div>
    )}
  </figure>
);

export default function HomeTestimonialsCarousel({
  testimonials,
}: HomeTestimonialsCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const canLoop = testimonials.length > 1;
  const renderedTestimonials = useMemo<RenderedTestimonial[]>(() => {
    const originals = testimonials.map((testimonial, index) => ({
      testimonial,
      key: `testimonial-${testimonial.name}-${testimonial.role}-${index}`,
      isClone: false,
    }));

    if (!canLoop) return originals;

    const before = testimonials.map((testimonial, index) => ({
      testimonial,
      key: `clone-before-${testimonial.name}-${testimonial.role}-${index}`,
      isClone: true,
    }));
    const after = testimonials.map((testimonial, index) => ({
      testimonial,
      key: `clone-after-${testimonial.name}-${testimonial.role}-${index}`,
      isClone: true,
    }));

    return [...before, ...originals, ...after];
  }, [canLoop, testimonials]);

  const getKids = useCallback(() => {
    const track = trackRef.current;
    if (!track) return null;
    return track.children as HTMLCollectionOf<HTMLElement>;
  }, []);

  const setLeft = useCallback((x: number) => {
    const track = trackRef.current;
    if (!track) return;
    const previous = track.style.scrollBehavior;
    track.style.scrollBehavior = 'auto';
    track.scrollLeft = x;
    track.style.scrollBehavior = previous;
  }, []);

  const getMetrics = useCallback(() => {
    const track = trackRef.current;
    const kids = getKids();
    const n = testimonials.length;
    if (!track || !kids || n < 2 || kids.length < n * 2 + 1) return null;

    const center = (el: HTMLElement) =>
      el.offsetLeft - (track.clientWidth - el.offsetWidth) / 2;

    return {
      period: kids[n].offsetLeft - kids[0].offsetLeft,
      home: center(kids[n]),
    };
  }, [getKids, testimonials.length]);

  const recenter = useCallback(() => {
    const track = trackRef.current;
    const metrics = getMetrics();
    if (!track || !metrics || !(metrics.period > 1)) return;

    const scrollLeft = track.scrollLeft;
    const low = metrics.home - metrics.period / 2;
    const target =
      low + ((((scrollLeft - low) % metrics.period) + metrics.period) % metrics.period);

    if (Math.abs(target - scrollLeft) > 1) setLeft(target);
  }, [getMetrics, setLeft]);

  const park = useCallback(() => {
    const metrics = getMetrics();
    if (metrics?.period) setLeft(metrics.home);
  }, [getMetrics, setLeft]);

  const getStep = useCallback(() => {
    const kids = getKids();
    const n = testimonials.length;
    if (!kids || n < 2) return 320;

    const current = kids[n];
    const next = kids[n + 1];
    if (current && next) return next.offsetLeft - current.offsetLeft;

    return current?.getBoundingClientRect().width ?? 320;
  }, [getKids, testimonials.length]);

  const scrollByStep = useCallback(
    (direction: 1 | -1) => {
      const track = trackRef.current;
      if (!track) return;
      track.scrollBy({ left: getStep() * direction, behavior: 'smooth' });
    },
    [getStep]
  );

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !canLoop) return;

    let settleTimer = 0;
    let resizeTimer = 0;
    let frame = 0;
    let innerFrame = 0;

    const onScroll = () => {
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(recenter, 120);
    };

    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(recenter, 150);
    };

    track.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('load', park);

    frame = window.requestAnimationFrame(() => {
      innerFrame = window.requestAnimationFrame(park);
    });

    return () => {
      track.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('load', park);
      window.clearTimeout(settleTimer);
      window.clearTimeout(resizeTimer);
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(innerFrame);
    };
  }, [canLoop, park, recenter]);

  return (
    <section
      className="testimonials-carousel"
      aria-label="Client testimonials"
    >
      <div
        className="testimonials-track"
        ref={trackRef}
        tabIndex={0}
        onKeyDown={(event) => {
          if (!canLoop) return;
          if (event.key === 'ArrowLeft') {
            event.preventDefault();
            scrollByStep(-1);
          } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            scrollByStep(1);
          }
        }}
      >
        {renderedTestimonials.map(({ testimonial, key, isClone }) => (
          <div
            className="testimonials-carousel-slide"
            key={key}
            data-clone={isClone ? 'true' : undefined}
            aria-hidden={isClone ? 'true' : undefined}
            role={isClone ? undefined : 'group'}
            aria-roledescription={isClone ? undefined : 'slide'}
          >
            {renderCard(testimonial)}
          </div>
        ))}
      </div>
      {canLoop && (
        <div className="testimonials-controls">
          <button
            className="testimonial-control prev"
            type="button"
            aria-label="Previous testimonial"
            onClick={() => scrollByStep(-1)}
          >
            <ChevronLeft aria-hidden="true" />
            <span className="sr-only">Previous testimonial</span>
          </button>
          <button
            className="testimonial-control next"
            type="button"
            aria-label="Next testimonial"
            onClick={() => scrollByStep(1)}
          >
            <ChevronRight aria-hidden="true" />
            <span className="sr-only">Next testimonial</span>
          </button>
        </div>
      )}
    </section>
  );
}
