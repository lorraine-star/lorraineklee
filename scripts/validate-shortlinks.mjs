// Fails when a Keystatic shortlink is silently doing nothing (CLI-202).
//
// getShortlinkRedirects() skips any shortlink whose slug matches a real page,
// the Keystatic admin, or an existing single-segment vercel.json redirect. The
// skip is correct -- a real page must always win -- but the only signal is a
// console.warn in the Vercel build log. From the Keystatic admin the entry looks
// saved and active, so an editor has no way to tell "live" from "ignored", and
// the shortlink they just handed out 404s.
//
// This turns that into a failed check with a named reason, the same shape as the
// keystatic-images guard (CLI-165).
//
// Exit codes: 1 for a collision or a missing destination (broken shortlinks a
// human needs to rename or fill in); 0 when the only skips are deliberate
// `active: false` entries, which are reported but are not faults.
//
// Run: node --experimental-strip-types scripts/validate-shortlinks.mjs
// (Node >=22.18 / 24 strip TS types by default; the flag is a no-op there and
// required on 22.7-22.17. It lets us import ../src/lib/shortlinks.ts directly.)

import { getShortlinkRedirects } from '../src/lib/shortlinks.ts';

const { redirects, skipped } = await getShortlinkRedirects();

const collisions = skipped.filter((s) => s.reason === 'reserved-collision');
const missingDestination = skipped.filter((s) => s.reason === 'no-destination');
const inactive = skipped.filter((s) => s.reason === 'inactive');

const live = Object.keys(redirects).length;

if (inactive.length) {
	console.log(
		`Note: ${inactive.length} shortlink(s) turned off deliberately (Active unchecked): ` +
			inactive.map((s) => `/${s.slug}`).join(', ')
	);
}

if (collisions.length === 0 && missingDestination.length === 0) {
	console.log(`OK: ${live} shortlink redirect(s) generated, none silently dropped.`);
	process.exit(0);
}

console.error(`\nFAIL: ${collisions.length + missingDestination.length} shortlink(s) will not work.\n`);

for (const s of collisions) {
	console.error(
		`  /${s.slug}\n` +
			`      A page or redirect already owns this path, so the shortlink is ignored at\n` +
			`      build time and the real route wins. Rename the shortlink in Keystatic\n` +
			`      (Shortlinks -> the entry -> URL slug) to something not already in use.\n`
	);
}

for (const s of missingDestination) {
	console.error(
		`  /${s.slug}\n` +
			`      No destination URL, so there is nothing to redirect to. Fill in the\n` +
			`      Destination field in Keystatic, or uncheck Active to turn it off.\n`
	);
}

process.exit(1);
