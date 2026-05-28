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

// Route map (CLI-130): nav reflects Lorraine's May 28 IA feedback.
// - "Work With Me" removed; Speaking already has its own top-level link and
//   Coaching/Consulting are no longer surfaced in the nav.
// - Thought Leadership parent links directly to the overview; dropdown is
//   trimmed to Guest Interviews / Featured In / Authored Articles.
// - Newsletter (/subscribe/) moved into the Learn dropdown.
// - Ultimate LinkedIn Guide is hidden from nav for now (deprioritized).
// - Keynote Catalog removed from Speaking; the standalone /keynotes index
//   is gone (redirected to /speaking in astro.config.mjs). Individual
//   /keynotes/:slug detail pages remain as link targets from the Speaking
//   page "other talks" list.
// Pre-existing fragments left as-is: `/speaking#bio` (bio destination pending
// CLI-88/CLI-105).
export const mainNavItems: NavItem[] = [
  { id: 'home', label: 'Home', href: '/' },
  {
    id: 'speaking',
    label: 'Speaking',
    href: '/speaking',
    children: [
      { label: 'Speaking Overview', href: '/speaking' },
      { label: 'Keynotes and Trainings', href: '/speaking#past-talks' },
      { label: 'Testimonials', href: '/testimonials' },
      { label: 'Bio and Headshot', href: '/speaking#bio' },
    ],
  },
  {
    id: 'thought-leadership',
    label: 'Thought Leadership',
    href: '/thought-leadership',
    children: [
      { label: 'Thought Leadership Overview', href: '/thought-leadership' },
      { label: 'Guest Interviews', href: '/interviews' },
      { label: 'Featured In', href: '/featured-in' },
      { label: 'Authored Articles', href: '/articles' },
    ],
  },
  {
    id: 'learn',
    label: 'Learn',
    href: '/learn',
    children: [
      { label: 'Learn Overview', href: '/learn' },
      { label: 'Free Course', href: '/from-invisible-to-influential' },
      { label: 'Learning Courses', href: '/courses' },
      { label: 'Newsletter', href: '/subscribe/' },
    ],
  },
  {
    id: 'about',
    label: 'About',
    href: '/about',
    children: [
      { label: 'About Lorraine', href: '/about' },
      { label: 'Awards and Accolades', href: '/about#awards' },
      { label: 'Media Kit', href: '/media-kit' },
    ],
  },
  { id: 'book', label: 'Book', href: '/book' },
  { id: 'contact', label: 'Contact', href: '/contact' },
];

export const isNavItemActive = (item: NavItem, activeId: string) =>
  item.id === activeId || item.children?.some((child) => child.activeId === activeId);
