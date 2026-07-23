// Unit tests for src/lib/url.ts: safeUrl() and toEmbedUrl().
//
// The repo has no unit-test runner (test:e2e is Momentic), so this is a
// self-contained assertion script in the same style as validate:content.
// toEmbedUrl() is the risky one: it rewrites editor-supplied video URLs into
// framable /embed/ form, and a regression there silently breaks every keynote
// clip and the speaker reel. These cases lock in the share-link conversions and,
// just as importantly, prove the normalizer never turns an unsafe value
// (javascript:, data:) into something embeddable.
//
// Run: node --experimental-strip-types scripts/test-url.mjs
// (Node >=22.18 / 24 strip TS types by default; the flag is a no-op there and
// required on 22.7-22.17. It lets us import ../src/lib/url.ts directly.)

import { safeUrl, toEmbedUrl } from '../src/lib/url.ts';

let passed = 0;
const failures = [];

function check(label, got, want) {
	if (got === want) {
		passed++;
	} else {
		failures.push(`${label}\n    input/expected: ${want}\n    got:           ${got}`);
	}
}

// --- toEmbedUrl: YouTube share forms -> embeddable ---
const YT_EMBED = 'https://www.youtube.com/embed/592bSyMteLE';
check('yt watch', toEmbedUrl('https://www.youtube.com/watch?v=592bSyMteLE'), YT_EMBED);
check('yt watch (www-less)', toEmbedUrl('https://youtube.com/watch?v=592bSyMteLE'), YT_EMBED);
check('youtu.be short', toEmbedUrl('https://youtu.be/592bSyMteLE'), YT_EMBED);
check('m.youtube', toEmbedUrl('https://m.youtube.com/watch?v=592bSyMteLE'), YT_EMBED);
check('yt shorts', toEmbedUrl('https://www.youtube.com/shorts/592bSyMteLE'), YT_EMBED);
check('yt live', toEmbedUrl('https://www.youtube.com/live/592bSyMteLE'), YT_EMBED);

// --- toEmbedUrl: start time preserved and normalized to seconds ---
check(
	'youtu.be ?t=90 (seconds)',
	toEmbedUrl('https://youtu.be/592bSyMteLE?t=90'),
	`${YT_EMBED}?start=90`,
);
check(
	'yt watch &t=1m30s (h/m/s)',
	toEmbedUrl('https://www.youtube.com/watch?v=592bSyMteLE&t=1m30s'),
	`${YT_EMBED}?start=90`,
);
check(
	'yt watch &start=45',
	toEmbedUrl('https://www.youtube.com/watch?v=592bSyMteLE&start=45'),
	`${YT_EMBED}?start=45`,
);

// --- toEmbedUrl: already embeddable is left untouched (author params survive) ---
check('yt embed untouched', toEmbedUrl(YT_EMBED), YT_EMBED);
check(
	'yt embed keeps params',
	toEmbedUrl('https://www.youtube.com/embed/592bSyMteLE?rel=0'),
	'https://www.youtube.com/embed/592bSyMteLE?rel=0',
);
check(
	'vimeo player untouched',
	toEmbedUrl('https://player.vimeo.com/video/12345'),
	'https://player.vimeo.com/video/12345',
);

// --- toEmbedUrl: Vimeo share form -> player ---
check('vimeo share', toEmbedUrl('https://vimeo.com/12345'), 'https://player.vimeo.com/video/12345');

// --- toEmbedUrl: security / junk must NOT become embeddable ---
check('javascript: -> #', toEmbedUrl('javascript:alert(1)'), '#');
check('data: -> #', toEmbedUrl('data:text/html,<script>alert(1)</script>'), '#');
check('empty stays empty', toEmbedUrl(''), '');
check('whitespace -> #', toEmbedUrl('   '), '#');
check('garbage -> #', toEmbedUrl('not a url'), '#');
check('null stays empty', toEmbedUrl(null), '');

// --- toEmbedUrl: unrecognized-but-safe passes through unchanged ---
check(
	'non-video https untouched',
	toEmbedUrl('https://evil.com/watch?v=abc'),
	'https://evil.com/watch?v=abc',
);
check('relative path untouched', toEmbedUrl('/relative/path'), '/relative/path');
check('fallback honored', toEmbedUrl('', '/contact'), '/contact');

// --- safeUrl: core contract the normalizer builds on ---
check('safeUrl relative', safeUrl('/speaking'), '/speaking');
check('safeUrl https', safeUrl('https://example.com'), 'https://example.com');
check('safeUrl javascript -> #', safeUrl('javascript:alert(1)'), '#');
check('safeUrl empty -> fallback', safeUrl('', '/contact'), '/contact');

if (failures.length > 0) {
	console.error(`FAIL: ${failures.length} of ${passed + failures.length} url tests failed:\n`);
	for (const f of failures) console.error(`  - ${f}\n`);
	process.exit(1);
}

console.log(`OK: ${passed} url tests passed (safeUrl + toEmbedUrl).`);
