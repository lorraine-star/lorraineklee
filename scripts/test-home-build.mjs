// Production-markup checks for the audience routes and homepage proof section.
// Run npm run build first, then npm run test:home.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync('dist/client/index.html', 'utf8');
const routes = [...html.matchAll(/<a class="fw-card" href="([^"]+)">([\s\S]*?)<\/a>/g)];
assert.deepEqual(routes.map((match) => match[1]), ['/speaking', '/contact', '/courses']);
assert.deepEqual(routes.map((match) => match[2].match(/class="fw-label">([^<]+)/)[1]), ['Speaking', 'Custom programs', 'Courses']);
assert.deepEqual(routes.map((match) => match[2].match(/class="fw-audience">([^<]+)/)[1]), ['For event organizers', 'For L&amp;D teams', 'For individuals']);
assert.match(html, /Three ways we can/);
assert.equal([...html.matchAll(/data-global-section="book-promo"/g)].length, 1, 'Keep the full book section');
const proof = html.match(/<ul class="testimonials-rebookings"[\s\S]*?<\/ul>/)[0];
assert.deepEqual([...proof.matchAll(/<strong[^>]*>([^<]+)<\/strong>/g)].map((match) => match[1]), ['LinkedIn', 'Cisco', 'Zoom']);
assert.deepEqual([...proof.matchAll(/<span[^>]*>([^<]+)<\/span>/g)].map((match) => match[1]), ['7× bookings', '7× bookings', '5× bookings']);
const names = [...new Set([...html.matchAll(/class="t-name">([^<]+)</g)].map((match) => match[1]))];
assert.deepEqual(names, ['Alexander Harlan', 'Jason R.', 'Lucie S.', 'Arun J.', 'Apurva B.', 'Ann Ann Low']);
for (const route of ['about', 'speaking', 'book', 'courses']) {
  const other = readFileSync(`dist/client/${route}/index.html`, 'utf8');
  assert.doesNotMatch(other, /class="testimonials-rebookings"/, `/${route}: proof strip is homepage-only`);
}
console.log('OK: Three audience routes, intact book section, rebooking strip, and six homepage testimonials in order.');
