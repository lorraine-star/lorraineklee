/**
 * Pulls one phrase out of a testimonial so the strongest few words carry a
 * yellow marker swipe (see `mark` in src/styles/editorial/tokens.css).
 *
 * The phrase is matched against the quote instead of being stored as its own
 * piece of copy, so an editor cannot put emphasis on words the person never
 * said. A phrase that does not appear in the quote is ignored rather than
 * raising, because the quote matters more than the emphasis.
 */
const escapeHtml = (s: string): string =>
	s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Curly and straight quotes and apostrophes are mixed freely when testimonials
// are pasted in, so both sides are flattened before matching.
const normalise = (s: string): string =>
	s.replace(/[‘’]/g, "'").replace(/[“”]/g, '"');

export const markQuote = (
	quote: string,
	highlight?: string | null
): string => {
	const phrase = (highlight ?? '').trim();
	if (!phrase) return escapeHtml(quote);
	const at = normalise(quote)
		.toLowerCase()
		.indexOf(normalise(phrase).toLowerCase());
	if (at < 0) return escapeHtml(quote);
	return (
		escapeHtml(quote.slice(0, at)) +
		'<mark>' +
		escapeHtml(quote.slice(at, at + phrase.length)) +
		'</mark>' +
		escapeHtml(quote.slice(at + phrase.length))
	);
};

/** React flavour: the same split, returned as nodes instead of a string. */
export const splitQuote = (
	quote: string,
	highlight?: string | null
): { before: string; mark: string; after: string } => {
	const phrase = (highlight ?? '').trim();
	if (!phrase) return { before: quote, mark: '', after: '' };
	const at = normalise(quote)
		.toLowerCase()
		.indexOf(normalise(phrase).toLowerCase());
	if (at < 0) return { before: quote, mark: '', after: '' };
	return {
		before: quote.slice(0, at),
		mark: quote.slice(at, at + phrase.length),
		after: quote.slice(at + phrase.length),
	};
};
