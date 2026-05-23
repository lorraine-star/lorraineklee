import {
  TestimonialsColumn,
  type ColumnTestimonial,
} from './ui/testimonials-columns-1';
import './course-testimonials.css';

/**
 * Three-column animated testimonials marquee island for /courses.
 * Splits the testimonials across three columns (each scrolling at a slightly
 * different speed); the 2nd and 3rd columns reveal at md/lg breakpoints.
 */
export default function CourseTestimonials({
  testimonials,
}: {
  testimonials: ColumnTestimonial[];
}) {
  const col1 = testimonials.filter((_, i) => i % 3 === 0);
  const col2 = testimonials.filter((_, i) => i % 3 === 1);
  const col3 = testimonials.filter((_, i) => i % 3 === 2);

  return (
    <div className="course-marquee" aria-label="What students are saying">
      <TestimonialsColumn
        testimonials={col1}
        duration={16}
        className="course-marquee-col"
      />
      <TestimonialsColumn
        testimonials={col2}
        duration={20}
        className="course-marquee-col course-marquee-col--md"
      />
      <TestimonialsColumn
        testimonials={col3}
        duration={18}
        className="course-marquee-col course-marquee-col--lg"
      />
    </div>
  );
}
