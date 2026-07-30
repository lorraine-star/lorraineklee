// Unit tests for the legacy case-alias logic in src/lib/shortlinks.ts (CLI-199).
//
// Why this is worth a test: the eight aliases exist because WordPress served
// those slugs with capitals and the links are printed on workshop slides. If a
// slug is renamed or deactivated in Keystatic, the alias stops resolving and the
// only signal is a warning in a Vercel build log nobody reads — the same silent
// failure mode that made CLI-199 necessary in the first place. The rule that
// keeps that safe is "an alias only exists if its lowercase twin is live", and
// that is what these cases lock in.
//
// Run: node --experimental-strip-types scripts/test-shortlinks.mjs
// (Node >=22.18 / 24 strip TS types by default; the flag is a no-op there and
// required on 22.7-22.17. It lets us import ../src/lib/shortlinks.ts directly.)

import { applyLegacyCaseAliases } from '../src/lib/shortlinks.ts';

let passed = 0;
const failures = [];

function check(label, got, want) {
	const g = JSON.stringify(got);
	const w = JSON.stringify(want);
	if (g === w) passed++;
	else failures.push(`${label}\n    expected: ${w}\n    got:      ${g}`);
}

const DEST = { status: 301, destination: 'https://example.com/form' };

// --- an alias is published when its lowercase twin is live ---
{
	const redirects = { '/ws-feedback': { ...DEST } };
	const warnings = applyLegacyCaseAliases(redirects, ['WS-feedback']);
	check('alias added', redirects['/WS-feedback'], DEST);
	check('lowercase twin untouched', redirects['/ws-feedback'], DEST);
	check('no warning when mirrored', warnings, []);
}

// --- the alias points at the SAME destination, not a redirect to the twin ---
// A chain would cost an extra hop on a link handed out in person.
{
	const redirects = { '/cc-feedback': { ...DEST } };
	applyLegacyCaseAliases(redirects, ['CC-feedback']);
	check('alias destination matches twin', redirects['/CC-feedback'].destination, DEST.destination);
	check('alias is a 301', redirects['/CC-feedback'].status, 301);
}

// --- editing the alias must not mutate the twin (and vice versa) ---
{
	const redirects = { '/sase-workbook': { ...DEST } };
	applyLegacyCaseAliases(redirects, ['SASE-workbook']);
	redirects['/SASE-workbook'].destination = 'https://example.com/changed';
	check('entries are separate objects', redirects['/sase-workbook'].destination, DEST.destination);
}

// --- THE IMPORTANT ONE: no twin means no alias ---
// This is what stops a deactivated or renamed shortlink from leaving a
// capitalised route pointing at nothing.
{
	const redirects = {};
	const warnings = applyLegacyCaseAliases(redirects, ['NUL-feedback']);
	check('no alias invented', Object.keys(redirects), []);
	check('warns about the orphan', warnings.length, 1);
	check('warning names the alias', warnings[0].includes('/NUL-feedback'), true);
}

// --- a skipped (inactive/colliding) twin is indistinguishable from absent ---
{
	const redirects = { '/some-other-link': { ...DEST } };
	const warnings = applyLegacyCaseAliases(redirects, ['NISM-discount']);
	check('unrelated entries untouched', Object.keys(redirects), ['/some-other-link']);
	check('still warns', warnings.length, 1);
}

// --- mixed batch: only the mirrored ones land ---
{
	const redirects = { '/cc-feedback': { ...DEST }, '/ws-feedback': { ...DEST } };
	const warnings = applyLegacyCaseAliases(redirects, ['CC-feedback', 'WS-feedback', 'NISM-discount']);
	check(
		'two aliases added, one skipped',
		Object.keys(redirects).sort(),
		['/CC-feedback', '/WS-feedback', '/cc-feedback', '/ws-feedback']
	);
	check('one warning for the unmirrored alias', warnings.length, 1);
}

// --- an already-lowercase entry in the list is a no-op, not a self-overwrite ---
{
	const redirects = { '/amazon': { ...DEST } };
	applyLegacyCaseAliases(redirects, ['amazon']);
	check('no duplicate key created', Object.keys(redirects), ['/amazon']);
	check('value unchanged', redirects['/amazon'], DEST);
}

if (failures.length > 0) {
	console.error(`FAIL: ${failures.length} of ${passed + failures.length} shortlink tests failed:\n`);
	for (const f of failures) console.error(`  - ${f}\n`);
	process.exit(1);
}

console.log(`OK: ${passed} shortlink tests passed (legacy case aliases).`);
