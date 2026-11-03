/*
 * Shared between /speaking and /speaking/<slug>.
 *
 * The slug is both the card's anchor on /speaking and the URL of its detail
 * page, so the two must agree exactly. They used to be derived in speaking.astro
 * alone; moving it here is what stops a detail page existing at a URL no card
 * links to, or a card linking at a 404.
 */

export interface Talk {
  title?: string | null;
  slug?: string | null;
  subtitle?: string | null;
  /** Short selling line for the detail page and the search result. */
  intro?: string | null;
  format?: string | null;
  description?: string | null;
  takeaways?: readonly string[] | null;
  tag?: string | null;
  note?: string | null;
  gif?: string | null;
  gif_alt?: string | null;
  talk_track_url?: string | null;
}

/**
 * An explicit slug from the CMS wins; otherwise one is derived from the title.
 * The 60-character cap is what the anchors already shipped with, so changing it
 * would break every /speaking#... link in the wild.
 */
export const talkSlug = (t: Pick<Talk, 'slug' | 'title'>): string =>
  (t.slug && t.slug.trim()) ||
  String(t.title ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);

/**
 * "Supercharge Your Executive Presence" -> "... Keynote", but a title that
 * already says Keynote is left alone rather than ending up doubled.
 */
export const keynoteHeading = (title: string): string =>
  /\bkeynotes?\b/i.test(title) ? title : `${title} Keynote`;

/**
 * First sentence of the description, for the meta description. Trimmed to fit
 * what search engines show, on a word boundary so it does not end mid-word.
 */
export function firstSentence(text: string | null | undefined, max = 155): string {
  const clean = String(text ?? '').replace(/\s+/g, ' ').trim();
  if (!clean) return '';
  const sentence = clean.split(/(?<=[.!?])\s/)[0] ?? clean;
  if (sentence.length <= max) return sentence;
  const cut = sentence.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`;
}

/**
 * The intro line as a meta description: whole thing when it fits, otherwise
 * clipped on a word boundary.
 *
 * Distinct from firstSentence because an intro is written as a unit -- a short
 * opening sentence followed by the hook is normal, and taking only the first
 * would hand Google a six-word result. Google renders about 155-160 characters
 * on desktop.
 */
export function clampText(text: string | null | undefined, max = 158): string {
  const clean = String(text ?? '').replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:\-–—]$/, '')}…`;
}
