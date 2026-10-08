// Verify the production-rendered Learn disclosure on both navigation layouts.
// Run npm run build first, then npm run test:nav. Browser interaction checks
// complement these markup and destination regression checks.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const routes = ['', 'about', 'speaking', 'learn', 'courses', 'subscribe', 'from-invisible-to-influential'];
const destinations = ['/from-invisible-to-influential', '/courses', '/subscribe/'];
for (const route of routes) {
  const html = readFileSync(join('dist/client', route, 'index.html'), 'utf8');
  const nav = html.match(/<nav class="nav">[\s\S]*?<\/nav>/)?.[0];
  assert.ok(nav, `/${route}: shared navigation exists`);
  assert.match(nav, /href="\/thought-leadership"[^>]*>\s*Media\s*</, 'Navigation uses the Media label');
  assert.doesNotMatch(nav, /<a\b[^>]*href="\/learn\/?"/, `/${route}: Learn is not a navigation link`);
  const learn = nav.match(/<button\b[^>]*aria-controls="nav-submenu-learn"[^>]*>[\s\S]*?<\/button>/)?.[0];
  assert.ok(learn, `/${route}: Learn is a button controlling its submenu`);
  assert.match(learn, /type="button"/);
  assert.match(learn, /aria-expanded="false"/);
  assert.match(learn, />\s*Learn\s*</);
  assert.doesNotMatch(learn, /aria-haspopup|aria-current|href=/);
  const submenu = nav.match(/<div\b[^>]*id="nav-submenu-learn"[^>]*>([\s\S]*?)<\/div>/)?.[1];
  assert.ok(submenu, `/${route}: controlled submenu exists`);
  assert.deepEqual([...submenu.matchAll(/href="([^"]+)"/g)].map((match) => match[1]), destinations);
  assert.doesNotMatch(submenu, /role="menuitem"/);
  assert.match(nav, /<a\b[^>]*href="\/speaking"/, 'Speaking stays a link');
  // The funnel intentionally uses its smaller legal footer.
  if (route !== 'from-invisible-to-influential') {
    const footer = html.match(/<footer\b[^>]*data-global-section="site-footer"[^>]*>[\s\S]*?<\/footer>/)?.[0];
    assert.match(footer, /href="\/learn"/, `/${route}: footer keeps /learn reachable`);
  }
}
console.log(`OK: Learn disclosure markup, destinations, and preserved links on ${routes.length} built pages.`);
