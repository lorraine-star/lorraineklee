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
  faqs?: readonly { question?: string | null; answer?: string | null }[] | null;
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

/**
 * The FAQ shown on a talk page.
 *
 * Authored FAQs win. Otherwise a standard set is built from what the CMS
 * already states about this talk -- its formats, its takeaways and the booking
 * promise on /speaking -- so every page carries a Q&A block without anyone
 * writing nine of them, and without the page asserting anything the CMS does
 * not already say. Questions are phrased the way someone actually asks an
 * assistant, since that is what this block is for.
 */
export function talkFaqs(
  talk: Talk,
  opts: { heading: string; formats: string[] },
): { question: string; answer: string }[] {
  const authored = (talk.faqs ?? [])
    .map((f) => ({ question: String(f?.question ?? '').trim(), answer: String(f?.answer ?? '').trim() }))
    .filter((f) => f.question && f.answer);
  if (authored.length) return authored;

  const title = String(talk.title ?? '').trim();
  const out: { question: string; answer: string }[] = [];

  out.push({
    question: `Is ${title} available as a virtual keynote?`,
    answer: `Yes. Lorraine K. Lee delivers ${title} both in person and virtually.`,
  });

  out.push({
    question: `What formats does ${title} come in?`,
    answer:
      `${opts.formats.join(' and ')}. Lorraine also builds multi-session programs for teams.`,
  });

  if (talk.note && talk.note.trim()) {
    out.push({ question: `Who is ${title} for?`, answer: talk.note.trim() });
  }

  const takeaways = (talk.takeaways ?? []).filter((t) => t && t.trim()).map((t) => t!.trim());
  if (takeaways.length) {
    out.push({
      question: `What will the audience take away from ${title}?`,
      answer: takeaways
        .map((t) => (/[.!?]$/.test(t) ? t : `${t}.`))
        .join(' '),
    });
  }

  out.push({
    question: `How do you book Lorraine K. Lee for ${title}?`,
    answer:
      'Send your audience and event details through the contact form, and her team replies within 2 business days.',
  });

  return out;
}
