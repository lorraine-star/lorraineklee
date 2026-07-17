/**
 * Sanitize an editor-supplied URL before rendering it into an `href`.
 *
 * Keystatic CTA URL fields are free text so they can hold internal paths
 * (e.g. `/speaking`) as well as external links. `fields.url()` would reject
 * relative paths, so validation happens here at render time instead: relative
 * paths and anchors pass through, absolute URLs are allowed only for safe
 * schemes, and anything empty, invalid, or unsafe (notably `javascript:`/`data:`)
 * collapses to `fallback`. Pass a real default (e.g. `'/contact'`) so a
 * scheme-less typo renders the intended link instead of a dead `#`. With no
 * fallback the behaviour is unchanged: `''` for empty input, `'#'` for invalid.
 */
const SAFE_SCHEMES = ['http:', 'https:', 'mailto:', 'tel:'];

export function safeUrl(
	value: string | null | undefined,
	fallback = '',
): string {
	if (!value) return fallback;
	const trimmed = value.trim();
	// Relative paths (not protocol-relative `//`), parent paths, and anchors.
	if (/^(?:\/(?!\/)|\.{1,2}\/|#)/.test(trimmed)) return trimmed;
	try {
		const url = new URL(trimmed);
		if (SAFE_SCHEMES.includes(url.protocol)) return trimmed;
	} catch {
		// not a parseable absolute URL — fall through to the fallback
	}
	// Invalid or unsafe. Prefer the caller's fallback; keep '#' as the historical
	// sentinel when none is given so `|| '#'` sites and `=== '#'` checks still work.
	return fallback || '#';
}
