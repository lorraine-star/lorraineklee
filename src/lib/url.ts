/**
 * Sanitize an editor-supplied URL before rendering it into an `href`.
 *
 * Keystatic CTA URL fields are free text so they can hold internal paths
 * (e.g. `/speaking`) as well as external links. `fields.url()` would reject
 * relative paths, so validation happens here at render time instead: relative
 * paths and anchors pass through, absolute URLs are allowed only for safe
 * schemes, and anything else (notably `javascript:`/`data:`) collapses to `#`.
 */
const SAFE_SCHEMES = ['http:', 'https:', 'mailto:', 'tel:'];

export function safeUrl(value: string | null | undefined): string {
	if (!value) return '';
	const trimmed = value.trim();
	// Relative paths (not protocol-relative `//`), parent paths, and anchors.
	if (/^(?:\/(?!\/)|\.{1,2}\/|#)/.test(trimmed)) return trimmed;
	try {
		const url = new URL(trimmed);
		return SAFE_SCHEMES.includes(url.protocol) ? trimmed : '#';
	} catch {
		return '#';
	}
}
