import { useId, useMemo, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import {
  TestimonialsColumn,
  type ColumnTestimonial,
} from './ui/testimonials-columns-1';
import './secondary-testimonials-carousel.css';

export type { ColumnTestimonial } from './ui/testimonials-columns-1';

type LayoutName = 'mobile' | 'tablet' | 'desktop';

interface CarouselLayout {
  name: LayoutName;
  cols: ColumnTestimonial[][];
  durations: number[];
}

export interface SecondaryTestimonialsCarouselProps {
  testimonials: ColumnTestimonial[];
  ariaLabel?: string;
  className?: string;
}

const split = (items: ColumnTestimonial[], n: number) =>
  Array.from({ length: n }, (_, k) => items.filter((_, i) => i % n === k));

export default function SecondaryTestimonialsCarousel({
  testimonials,
  ariaLabel = 'What students are saying',
  className,
}: SecondaryTestimonialsCarouselProps) {
  const [isPaused, setIsPaused] = useState(false);
  const carouselId = useId();

  const variants = useMemo<CarouselLayout[]>(
    () => [
      { name: 'mobile', cols: split(testimonials, 1), durations: [26] },
      { name: 'tablet', cols: split(testimonials, 2), durations: [18, 22] },
      { name: 'desktop', cols: split(testimonials, 3), durations: [16, 20, 18] },
    ],
    [testimonials]
  );

  if (testimonials.length === 0) return null;

  const rootClassName = [
    'secondary-testimonials-wrap',
    isPaused ? 'is-paused' : '',
    className || '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClassName} aria-label={ariaLabel}>
      <div className="secondary-testimonials-control-row">
        <button
          type="button"
          className="secondary-testimonials-toggle"
          aria-controls={carouselId}
          aria-label={isPaused ? 'Play testimonials' : 'Pause testimonials'}
          aria-pressed={isPaused}
          onClick={() => setIsPaused((paused) => !paused)}
        >
          {isPaused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
          <span className="secondary-testimonials-toggle-text">
            {isPaused ? 'Play' : 'Pause'}
          </span>
        </button>
      </div>

      <div id={carouselId}>
        {variants.map((v) => (
          <div
            key={v.name}
            className={`secondary-testimonials secondary-testimonials--${v.name}`}
          >
            {v.cols.map((col, i) => (
              <TestimonialsColumn
                key={`${v.name}-${i}`}
                testimonials={col}
                duration={v.durations[i]}
                className="secondary-testimonials-col"
                trackClassName="secondary-testimonials-track"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
