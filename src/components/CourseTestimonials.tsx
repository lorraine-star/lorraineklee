import {
  TestimonialsColumn,
  type ColumnTestimonial,
} from './ui/testimonials-columns-1';
import './course-testimonials.css';

/**
 * Animated testimonials marquee for /courses.
 *
 * Renders three responsive layouts — 1 column on mobile, 2 on tablet, 3 on
 * desktop — and CSS shows exactly one at each breakpoint. Each layout
 * distributes ALL testimonials round-robin across its columns, so no
 * testimonial is ever hidden (unlike hiding columns, which dropped 2/3 of them
 * on small screens). Pure SSR + CSS animation: no client JS, pauses on
 * hover/focus, and stacks statically under prefers-reduced-motion.
 */
const split = (items: ColumnTestimonial[], n: number) =>
  Array.from({ length: n }, (_, k) => items.filter((_, i) => i % n === k));

export default function CourseTestimonials({
  testimonials,
}: {
  testimonials: ColumnTestimonial[];
}) {
  const variants: { name: string; cols: ColumnTestimonial[][]; durations: number[] }[] = [
    { name: 'mobile', cols: split(testimonials, 1), durations: [26] },
    { name: 'tablet', cols: split(testimonials, 2), durations: [18, 22] },
    { name: 'desktop', cols: split(testimonials, 3), durations: [16, 20, 18] },
  ];

  return (
    <div className="course-marquee-wrap" aria-label="What students are saying">
      {variants.map((v) => (
        <div key={v.name} className={`course-marquee course-marquee--${v.name}`}>
          {v.cols.map((col, i) => (
            <TestimonialsColumn
              key={i}
              testimonials={col}
              duration={v.durations[i]}
              className="course-marquee-col"
            />
          ))}
        </div>
      ))}
    </div>
  );
}
