// Unit tests for the legacy case-alias logic in src/lib/shortlinks.ts
// (CLI-199, reworked under CLI-208).
//
// The eight aliases exist because WordPress served those slugs with capitals and
// the links are printed on workshop slides. They live in vercel.json rather than
// the Astro redirects config, because Astro's router matches case-insensitively
// and treats "/CC-feedback" and "/cc-feedback" as one route declared twice.
//
// That split puts the destination in vercel.json by hand instead of deriving it
// from Keystatic, so expectedLegacyAliasRedirects() is what makes drift
// detectable: validate:shortlinks compares vercel.json against what this returns.
// The invariant these cases lock in is "an alias is expected only while its
// lowercase twin is live" -- if the twin is deactivated or renamed, the alias
// must stop being expected, so the validator tells someone to remove it rather
// than leaving a capitalised route pointing at something unpublished.
//
// Run: node --experimental-strip-types scripts/test-shortlinks.mjs
// (Node >=22.18 / 24 strip TS types by default; the flag is a no-op there and
// required on 22.7-22.17. It lets us import ../src/lib/shortlinks.ts directly.)

import { expectedLegacyAliasRedirects } from '../src/lib/shortlinks.ts';

let passed = 0;
const failures = [];

function check(label, got, want) {
	const g = JSON.stringify(got);
	const w = JSON.stringify(want);
	if (g === w) passed++;
	else failures.push(`${label}\n    expected: ${w}\n    got:      ${g}`);
}

const DEST = 'https://example.com/form';
const entry = (destination = DEST) => ({ status: 301, destination });

// --- an alias is expected when its lowercase twin is live ---
{
	const redirects = { '/ws-feedback': entry() };
	const expected = expectedLegacyAliasRedirects(redirects, ['WS-feedback']);
	check('alias expected', expected, { '/WS-feedback': DEST });
}

// --- it mirrors the destination, so vercel.json points at the same place ---
// Redirecting to the twin instead would cost an extra hop on a link handed out
// in person.
{
	const redirects = { '/cc-feedback': entry('https://docs.google.com/forms/abc') };
	const expected = expectedLegacyAliasRedirects(redirects, ['CC-feedback']);
	check('destination mirrored', expected['/CC-feedback'], 'https://docs.google.com/forms/abc');
}

// --- THE IMPORTANT ONE: no twin means the alias is not expected ---
// This is what makes the validator flag a stale alias for removal, rather than
// leaving a capitalised route pointing at something no longer published.
{
	const expected = expectedLegacyAliasRedirects({}, ['NUL-feedback']);
	check('no alias invented', expected, {});
}

// --- a skipped (inactive / colliding) twin is indistinguishable from absent ---
{
	const redirects = { '/some-other-link': entry() };
	const expected = expectedLegacyAliasRedirects(redirects, ['NISM-discount']);
	check('unrelated entries ignored', expected, {});
}

// --- it does not mutate the map it is given ---
// getShortlinkRedirects() hands over the live Astro redirects; adding to that
// would put the aliases back into Astro's router and reintroduce the route
// collision this rework exists to remove.
{
	const redirects = { '/sase-workbook': entry() };
	expectedLegacyAliasRedirects(redirects, ['SASE-workbook']);
	check('input untouched', Object.keys(redirects), ['/sase-workbook']);
}

// --- mixed batch: only the mirrored ones are expected ---
{
	const redirects = { '/cc-feedback': entry(), '/ws-feedback': entry('https://example.com/two') };
	const expected = expectedLegacyAliasRedirects(redirects, ['CC-feedback', 'WS-feedback', 'NISM-discount']);
	check('two expected, one omitted', Object.keys(expected).sort(), ['/CC-feedback', '/WS-feedback']);
	check('each keeps its own destination', expected['/WS-feedback'], 'https://example.com/two');
}

// --- an already-lowercase name in the list yields no distinct alias ---
{
	const redirects = { '/amazon': entry() };
	const expected = expectedLegacyAliasRedirects(redirects, ['amazon']);
	check('lowercase name maps to itself', expected, { '/amazon': DEST });
}

// --- the real list is used when no override is passed ---
{
	const expected = expectedLegacyAliasRedirects({ '/cc-feedback': entry() });
	check('default list includes CC-feedback', expected['/CC-feedback'], DEST);
	check('default list omits unmirrored aliases', expected['/WS-feedback'], undefined);
}

if (failures.length > 0) {
	console.error(`FAIL: ${failures.length} of ${passed + failures.length} shortlink tests failed:\n`);
	for (const f of failures) console.error(`  - ${f}\n`);
	process.exit(1);
}

console.log(`OK: ${passed} shortlink tests passed (legacy case aliases).`);
