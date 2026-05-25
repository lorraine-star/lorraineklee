import React from 'react';

export interface ColumnTestimonial {
  quote: string;
  name: string;
  initials?: string;
  role?: string;
  photo?: string | null;
  photo_alt?: string;
}

/**
 * A single vertically-scrolling marquee column of testimonial cards.
 *
 * Adapted from the shadcn "testimonials-columns-1" component for this Astro
 * editorial design codebase. The scroll is a pure CSS animation, disables
 * under prefers-reduced-motion, loops seamlessly, and renders the project's
 * global `.t-card` markup so it stays visually consistent with the rest of
 * the site.
 */
export const TestimonialsColumn = (props: {
  className?: string;
  trackClassName?: string;
  testimonials: ColumnTestimonial[];
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <div
        className={props.trackClassName || 'testimonials-column-track'}
        style={
          { '--marquee-duration': `${props.duration || 16}s` } as React.CSSProperties
        }
      >
        {[...new Array(2)].map((_, index) => (
          <React.Fragment key={index}>
            {props.testimonials.map((t, i) => (
              // The second pass is a visual duplicate for the seamless loop.
              // hide it from assistive tech so each quote is announced once.
              <figure
                className="t-card"
                key={`${index}-${i}`}
                aria-hidden={index === 1 ? true : undefined}
              >
                <span className="t-mark" aria-hidden="true">
                  &ldquo;
                </span>
                <blockquote className="t-quote">{t.quote}</blockquote>
                <div className="t-divider" />
                <figcaption className="t-attrib">
                  {t.photo ? (
                    <div className="t-avatar t-avatar--photo">
                      <img src={t.photo} alt={t.photo_alt || t.name} loading="lazy" />
                    </div>
                  ) : (
                    <div className="t-avatar">{t.initials}</div>
                  )}
                  <div>
                    <div className="t-name">{t.name}</div>
                    <div className="t-role">
                      {t.role || 'LinkedIn Learning student'}
                    </div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
