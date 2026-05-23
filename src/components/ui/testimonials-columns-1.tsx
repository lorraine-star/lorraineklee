import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

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
 * Adapted from the shadcn "testimonials-columns-1" component for this Astro +
 * editorial-design codebase: it imports from `framer-motion` (already a
 * dependency) instead of `motion/react`, and renders the project's global
 * `.t-card` markup (initials avatar) so it stays visually consistent with the
 * rest of the site rather than relying on shadcn Tailwind tokens.
 */
export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: ColumnTestimonial[];
  duration?: number;
}) => {
  const reduceMotion = useReducedMotion();
  return (
    <div className={props.className}>
      <motion.div
        animate={reduceMotion ? undefined : { translateY: '-50%' }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: 'linear',
          repeatType: 'loop',
        }}
        className="course-marquee-track"
      >
        {[...new Array(2)].map((_, index) => (
          <React.Fragment key={index}>
            {props.testimonials.map((t, i) => (
              <figure className="t-card" key={`${index}-${i}`}>
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
      </motion.div>
    </div>
  );
};
