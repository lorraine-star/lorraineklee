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

// Route map (CLI-106): nav points at the canonical interior pages shipped under
// CLI-80; every destination here is live on `dev`. `contact` stays in this
// shared list for SiteNav (legacy `/articles`); EditorialNav drops the inline
// link and surfaces Contact as its primary CTA button instead. The
// `work-with-me` group is a services menu with no overview page, so its parent
// href points at its lead service (`/coaching`), not `/contact`, so it does not
// duplicate the `contact` item in SiteNav (where active state is href-based).
// Pre-existing fragments left as-is (no standalone page yet, out of CLI-106
// scope): `/speaking#bio` (bio destination pending CLI-88/CLI-105),
// `/articles#newsletter`, `/learn#linkedin-guide`.
export const mainNavItems: NavItem[] = [
  { id: 'home', label: 'Home', href: '/' },
  {
    id: 'speaking',
    label: 'Speaking',
    href: '/speaking',
    children: [
      { label: 'Speaking Overview', href: '/speaking' },
      { label: 'Keynotes and Trainings', href: '/speaking#past-talks' },
      { label: 'Keynote Catalog', href: '/keynotes' },
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
      { label: 'Newsletter', href: '/articles#newsletter' },
      { label: 'Ultimate LinkedIn Guide', href: '/learn#linkedin-guide' },
    ],
  },
  {
    id: 'learn',
    label: 'Learn',
    href: '/learn',
    children: [
      { label: 'Learn Overview', href: '/learn' },
      { label: 'Free Course', href: '/from-invisible-to-influential' },
      { label: 'Free Resources', href: '/learn#resources' },
      { label: 'Learning Courses', href: '/courses' },
    ],
  },
  {
    id: 'work-with-me',
    label: 'Work With Me',
    href: '/coaching',
    children: [
      { label: 'Coaching', href: '/coaching', activeId: 'coaching' },
      { label: 'Consulting', href: '/consulting', activeId: 'consulting' },
      { label: 'Speaking', href: '/speaking' },
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
