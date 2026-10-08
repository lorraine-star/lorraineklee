export interface NavChild {
  label: string;
  href: string;
  activeId?: string;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  children?: NavChild[];
}

// Wishly nav redesign (Oct 2026): six flat destinations plus the "Book
// Lorraine" button (the Contact item renders as that CTA in EditorialNav), and
// no dropdowns. Following the Wishly review: Courses is promoted to the top
// level, the three Thought Leadership pages sit behind one "Media" link (the
// /thought-leadership hub already indexes interviews, press and articles),
// Awards links to the awards section on About, and Home is the logo. Links
// that left the top bar (Bio and Headshot, Testimonials, Free Course,
// Newsletter, Learn, Guest Interviews, Featured In, Authored Articles) live in
// the grouped footer (siteSettings.footer.explore_groups) and inside the
// relevant pages, so no page lost its link. The live nav is read from
// src/content/site-settings/index.yaml; this array is the fallback.
//
// Earlier history, route map (CLI-130): nav reflected Lorraine's May 28 IA feedback.
// - "Work With Me" removed; Speaking already has its own top-level link and
//   Coaching/Consulting are no longer surfaced in the nav.
// - Most children-having parent labels are real links to their `href`. Learn
//   now uses a disclosure-only button; /learn remains available in the footer.
//   For the other parents, the separate chevron in EditorialNav.astro opens the
//   submenu on mobile; on desktop the submenu still opens on hover/focus.
//   Don't re-add an "Overview" row to the dropdowns: the parent label
//   already navigates to the same page, and the duplicate row is what
//   Lorraine asked us to drop.
// - Thought Leadership dropdown: Guest Interviews / Featured In /
//   Authored Articles.
// - Newsletter (/subscribe/) moved into the Learn dropdown.
// - Ultimate LinkedIn Guide is hidden from nav for now (deprioritized).
// - Keynote Catalog removed from Speaking; the standalone /keynotes index
//   is gone (redirected to /speaking in astro.config.mjs). Individual
//   /keynotes/:slug detail pages remain as link targets from the Speaking
//   page "other talks" list.
// Bio and Headshot points at the dedicated `/speaker-bio` page (CLI-137);
// the old `/speaking#bio` fragment had no matching anchor on the Speaking
// page, so it just dumped users at the top of /speaking.
export const mainNavItems: NavItem[] = [
  { id: 'speaking', label: 'Speaking', href: '/speaking' },
  { id: 'courses', label: 'Courses', href: '/courses' },
  { id: 'book', label: 'The Book', href: '/book' },
  { id: 'about', label: 'About', href: '/about' },
  { id: 'thought-leadership', label: 'Media', href: '/thought-leadership' },
  { id: 'awards', label: 'Awards', href: '/about#awards' },
  { id: 'contact', label: 'Contact', href: '/contact' },
];

export const isNavItemActive = (item: NavItem, activeId: string) =>
  item.id === activeId || item.children?.some((child) => child.activeId === activeId);

// Drop the hash/query and any trailing slash so href and pathname comparisons
// line up (e.g. `/subscribe/` and `/about#awards` both normalize cleanly).
export const normalizeNavPath = (path: string): string => {
  const base = path.split(/[?#]/)[0];
  return base.length > 1 && base.endsWith('/') ? base.slice(0, -1) : base;
};

export const isNavChildActive = (child: NavChild, currentPath: string): boolean =>
  normalizeNavPath(child.href) === normalizeNavPath(currentPath);
