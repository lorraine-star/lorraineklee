import { reader } from './keystatic';

/**
 * Shared testimonials data layer (CLI-118).
 *
 * Reads the `testimonials` Keystatic collection and exposes a single helper,
 * `getTestimonials({ placement, type })`, so every testimonial surface
 * (the /testimonials page today; homepage, speaking, and courses as they
 * migrate) can filter the same source of truth by placement flag and type
 * instead of maintaining separate hardcoded arrays.
 */

export type TestimonialType =
  | 'client-organizer-speaking'
  | 'event-attendee'
  | 'course-student-review';

export type Placement = 'homepage' | 'testimonials' | 'speaking' | 'courses';

export interface Testimonial {
  slug: string;
  author: string;
  quote: string;
  roleOrCompany: string;
  type: TestimonialType;
  order: number;
  image: string;
  imageAlt: string;
  priority: 'High' | 'Medium' | 'Low';
  topicTags: readonly string[];
  sourceUrl: string;
  matchedCptUrl: string;
  showOnHomepage: boolean;
  showOnTestimonials: boolean;
  showOnSpeaking: boolean;
  showOnCourses: boolean;
}

const PLACEMENT_FLAG: Record<Placement, keyof Testimonial> = {
  homepage: 'showOnHomepage',
  testimonials: 'showOnTestimonials',
  speaking: 'showOnSpeaking',
  courses: 'showOnCourses',
};

/** Section metadata for grouping testimonials by type, in display order. */
export const TESTIMONIAL_SECTIONS: {
  type: TestimonialType;
  eyebrow: string;
  heading: string;
}[] = [
  {
    type: 'client-organizer-speaking',
    eyebrow: 'Clients & organizers',
    heading: 'What event hosts say',
  },
  {
    type: 'event-attendee',
    eyebrow: 'Attendees',
    heading: 'What audiences say',
  },
  {
    type: 'course-student-review',
    eyebrow: 'LinkedIn Learning',
    heading: 'What students say',
  },
];

export async function getTestimonials(
  opts: { placement?: Placement; type?: TestimonialType } = {}
): Promise<Testimonial[]> {
  const entries = await reader.collections.testimonials.all();
  let list = entries.map((e) => ({
    slug: e.slug,
    ...e.entry,
    topicTags: [...(e.entry.topicTags ?? [])],
  })) as Testimonial[];

  if (opts.placement) {
    const flag = PLACEMENT_FLAG[opts.placement];
    list = list.filter((t) => Boolean(t[flag]));
  }
  if (opts.type) {
    list = list.filter((t) => t.type === opts.type);
  }

  return list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

/** Two-letter initials fallback for testimonials without a headshot. */
export const initialsFor = (name: string): string =>
  name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || '?';

/**
 * Card shape consumed by `HomeTestimonialsCarousel` (homepage + speaking
 * organizer carousel). Mirrors that component's `Testimonial` props.
 */
export interface CarouselCard {
  quote: string;
  name: string;
  role: string;
  photo?: string;
  photoAlt?: string;
  initials: string;
}

/** Map a shared testimonial to the home/organizer carousel card shape. */
export const toCarouselCard = (t: Testimonial): CarouselCard => ({
  quote: t.quote,
  name: t.author,
  role: t.roleOrCompany,
  photo: t.image || undefined,
  photoAlt: t.imageAlt || undefined,
  initials: initialsFor(t.author),
});

/**
 * Card shape consumed by `SecondaryTestimonialsCarousel` (attendee + student
 * marquee columns). Mirrors `ColumnTestimonial`.
 */
export interface ColumnCard {
  quote: string;
  name: string;
  initials: string;
  role?: string;
  photo?: string;
  photo_alt?: string;
}

/** Map a shared testimonial to the marquee-column card shape. */
export const toColumnCard = (t: Testimonial): ColumnCard => ({
  quote: t.quote,
  name: t.author,
  role: t.roleOrCompany || undefined,
  photo: t.image || undefined,
  photo_alt: t.imageAlt || undefined,
  initials: initialsFor(t.author),
});
