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

/** Parse a YouTube `t`/`start` value (`90`, `1m30s`, `1h2m3s`) into seconds. */
function youtubeStartSeconds(url: URL): number {
	const raw = url.searchParams.get('t') || url.searchParams.get('start') || '';
	if (!raw) return 0;
	if (/^\d+$/.test(raw)) return Number(raw);
	const parts = raw.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/i);
	if (!parts) return 0;
	return (
		Number(parts[1] || 0) * 3600 +
		Number(parts[2] || 0) * 60 +
		Number(parts[3] || 0)
	);
}

const YOUTUBE_HOSTS = ['youtube.com', 'm.youtube.com', 'music.youtube.com'];

/**
 * Normalize an editor-supplied video URL into one that can actually be framed.
 *
 * Editors paste whatever the "Share" button gives them, but YouTube refuses to
 * render `watch?v=` and `youtu.be` links inside an iframe, so those silently
 * produce an empty player with no visible error. This converts the share forms
 * (`watch?v=`, `youtu.be/`, `shorts/`, `live/`, and Vimeo's `vimeo.com/<id>`)
 * into their embeddable equivalents, preserving a start time when one is set.
 *
 * URLs that are already embeddable are returned untouched so any player
 * parameters the author added survive. Anything unrecognized falls through to
 * `safeUrl`, so this never widens what is considered a safe URL.
 */
export function toEmbedUrl(
	value: string | null | undefined,
	fallback = '',
): string {
	const safe = safeUrl(value, fallback);
	// Only absolute http(s) URLs can be normalized. Empty values, relative
	// paths, and the '#' sentinel pass straight through.
	if (!/^https?:\/\//i.test(safe)) return safe;

	let url: URL;
	try {
		url = new URL(safe);
	} catch {
		return safe;
	}

	const host = url.hostname.replace(/^www\./i, '').toLowerCase();
	const segments = url.pathname.split('/').filter(Boolean);
	const isYouTube = YOUTUBE_HOSTS.includes(host);

	// Already embeddable: leave exactly as authored.
	if ((isYouTube && segments[0] === 'embed') || host === 'player.vimeo.com') {
		return safe;
	}

	let videoId = '';
	if (host === 'youtu.be') {
		videoId = segments[0] ?? '';
	} else if (isYouTube) {
		if (url.pathname === '/watch') {
			videoId = url.searchParams.get('v') ?? '';
		} else if (segments[0] === 'shorts' || segments[0] === 'live') {
			videoId = segments[1] ?? '';
		}
	}
	if (videoId && /^[\w-]{6,}$/.test(videoId)) {
		const embed = new URL(`https://www.youtube.com/embed/${videoId}`);
		const start = youtubeStartSeconds(url);
		if (start > 0) embed.searchParams.set('start', String(start));
		return embed.toString();
	}

	if (host === 'vimeo.com' && /^\d+$/.test(segments[0] ?? '')) {
		return `https://player.vimeo.com/video/${segments[0]}`;
	}

	return safe;
}
