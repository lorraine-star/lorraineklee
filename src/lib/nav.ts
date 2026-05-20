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

export const mainNavItems: NavItem[] = [
  { id: 'home', label: 'Home', href: '/' },
  {
    id: 'speaking',
    label: 'Speaking',
    href: '/speaking',
    children: [
      { label: 'Speaking Overview', href: '/speaking' },
      { label: 'Keynotes and Trainings', href: '/speaking#past-talks' },
      { label: 'Testimonials', href: '/speaking#testimonials' },
      { label: 'Bio and Headshot', href: '/about#bio' },
    ],
  },
  {
    id: 'thought-leadership',
    label: 'Thought Leadership',
    href: '/articles',
    children: [
      { label: 'Thought Leadership Overview', href: '/articles' },
      { label: 'Newsletter', href: '/articles' },
      { label: 'LinkedIn Resources', href: '/learn' },
    ],
  },
  {
    id: 'learn',
    label: 'Learn',
    href: '/learn',
    children: [
      { label: 'Learn Overview', href: '/learn' },
      { label: 'Free Course', href: '/#course' },
      { label: 'Learning Courses', href: '/learn#courses' },
    ],
  },
  {
    id: 'about',
    label: 'About',
    href: '/about',
    children: [
      { label: 'About Lorraine', href: '/about' },
      { label: 'Awards and Accolades', href: '/about#awards' },
    ],
  },
  { id: 'book', label: 'Book', href: '/book' },
  { id: 'contact', label: 'Contact', href: '/contact' },
];

export const isNavItemActive = (item: NavItem, activeId: string) =>
  item.id === activeId || item.children?.some((child) => child.activeId === activeId);
