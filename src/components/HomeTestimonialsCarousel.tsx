import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { KeyboardEvent } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  photo?: string;
  photoAlt?: string;
  initials: string;
};

type HomeTestimonialsCarouselProps = {
  testimonials: Testimonial[];
};

export default function HomeTestimonialsCarousel({
  testimonials,
}: HomeTestimonialsCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateScrollState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const maxScrollLeft = track.scrollWidth - track.clientWidth;
    setCanScrollPrev(track.scrollLeft > 2);
    setCanScrollNext(track.scrollLeft < maxScrollLeft - 2);
  }, []);

  const scrollBySlide = useCallback((direction: 1 | -1) => {
    const track = trackRef.current;
    const firstSlide = track?.querySelector<HTMLElement>('.testimonials-carousel-slide');
    if (!track || !firstSlide) return;

    const styles = window.getComputedStyle(track);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || '0') || 0;
    track.scrollBy({
      left: direction * (firstSlide.offsetWidth + gap),
      behavior: 'smooth',
    });
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        scrollBySlide(-1);
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        scrollBySlide(1);
      }
    },
    [scrollBySlide]
  );

  useEffect(() => {
    updateScrollState();
    const track = trackRef.current;
    if (!track) return;

    track.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);

    return () => {
      track.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [updateScrollState]);

  if (testimonials.length === 0) return null;

  return (
    <div
      className="testimonials-carousel"
      aria-label="Client testimonials"
      role="region"
      aria-roledescription="carousel"
    >
      <div className="testimonials-controls">
        <button
          className="testimonial-control"
          type="button"
          aria-label="Previous testimonial"
          disabled={!canScrollPrev}
          onClick={() => scrollBySlide(-1)}
        >
          <ChevronLeft aria-hidden="true" />
        </button>
        <button
          className="testimonial-control"
          type="button"
          aria-label="Next testimonial"
          disabled={!canScrollNext}
          onClick={() => scrollBySlide(1)}
        >
          <ChevronRight aria-hidden="true" />
        </button>
      </div>
      <div
        className="testimonials-track"
        ref={trackRef}
        tabIndex={0}
        role="list"
        aria-label={`${testimonials.length} client testimonials`}
        onKeyDown={handleKeyDown}
      >
        {testimonials.map((testimonial, index) => (
          <div
            className="testimonials-carousel-slide"
            key={`${testimonial.name}-${testimonial.role}`}
            role="listitem"
            aria-label={`${index + 1} of ${testimonials.length}: ${testimonial.name}`}
          >
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
                  {testimonial.role ? (
                    <div className="t-role">{testimonial.role}</div>
                  ) : null}
                </div>
              </figcaption>
            </figure>
          </div>
        ))}
      </div>
    </div>
  );
}
