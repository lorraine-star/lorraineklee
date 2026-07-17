// Validates that every Keystatic image/file (asset) field points at a real file
// inside the folder that field manages. Guards against the failure mode where a
// stored value drifts outside its field's managed directory (or the file is
// missing), which makes Keystatic emit a delete for a nonexistent path on save
// and GitHub reject the whole commit -- blocking all edits to that page.
// See CLI-165 and the incident on the Speaking singleton.
//
// Two violation classes, both caught here:
//   - outside-folder: value does not sit under the field's managed folder
//     (e.g. Speaking hero was /images/v1/... while the field manages
//     /images/speaking/). A plain file-existence check misses this.
//   - missing-file: value is in the right folder but the file is absent
//     (e.g. the Featured Appearances outlet logos before they were restored).
//
// Run: node --experimental-strip-types scripts/validate-keystatic-images.mjs
// (Node >=22.18 / 24 strip TS types by default; the flag is a no-op there and
// required on 22.7-22.17. It lets us import keystatic.config.ts directly.)

import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createReader } from '@keystatic/core/reader';
import config from '../keystatic.config.ts';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const reader = createReader(ROOT, config);

/** An asset field is a form field that manages a directory (fields.image / fields.file). */
const isAssetField = (field) =>
  field?.kind === 'form' && typeof field.directory === 'string';

/**
 * Keystatic mirrors `directory` and `publicPath` by convention, e.g.
 * directory "public/images/speaking" <-> publicPath "/images/speaking/".
 * publicPath is closure-captured and not introspectable, so we derive it.
 * If a field ever sets a publicPath that diverges from its directory, this
 * would flag conforming content -- a loud, easily-diagnosed failure, which is
 * the right side to err on for a guardrail.
 */
const publicPathFor = (directory) =>
  '/' + directory.replace(/^public\//, '').replace(/\/$/, '') + '/';

const violations = [];

/** Recursively walk a field + its value in parallel, checking any asset fields. */
function walkField(field, value, location) {
  if (!field || value == null) return;
  switch (field.kind) {
    case 'object':
      for (const [key, sub] of Object.entries(field.fields)) {
        walkField(sub, value[key], `${location}.${key}`);
      }
      return;
    case 'array':
      if (Array.isArray(value)) {
        value.forEach((item, i) => walkField(field.element, item, `${location}[${i}]`));
      }
      return;
    case 'conditional':
      // { discriminant, value } -> descend into the active branch's field.
      if (typeof value === 'object' && 'discriminant' in value) {
        const branch = field.values?.[value.discriminant];
        if (branch) walkField(branch, value.value, location);
      }
      return;
    case 'form':
      if (isAssetField(field) && value !== '') checkAsset(field, value, location);
      return;
    default:
      // markdoc/document and other content fields: no managed directory, skip.
      return;
  }
}

function checkAsset(field, value, location) {
  if (typeof value !== 'string') return;
  const publicPath = publicPathFor(field.directory);
  if (!value.startsWith(publicPath)) {
    violations.push({
      location,
      kind: 'outside-folder',
      value,
      detail: `field manages ${publicPath} (dir ${field.directory}); value is outside it`,
    });
    return;
  }
  const relative = value.slice(publicPath.length);
  const filePath = join(ROOT, field.directory, relative);
  if (!existsSync(filePath)) {
    violations.push({
      location,
      kind: 'missing-file',
      value,
      detail: `expected file at ${field.directory}/${relative}`,
    });
  }
}

async function run() {
  let checked = 0;

  for (const [key, singleton] of Object.entries(config.singletons ?? {})) {
    let data;
    try {
      data = await reader.singletons[key].read();
    } catch (err) {
      violations.push({ location: `singleton:${key}`, kind: 'read-error', value: '', detail: String(err) });
      continue;
    }
    if (!data) continue; // never-saved singleton
    checked++;
    for (const [field, def] of Object.entries(singleton.schema)) {
      walkField(def, data[field], `${key}.${field}`);
    }
  }

  for (const [key, collection] of Object.entries(config.collections ?? {})) {
    let slugs;
    try {
      slugs = await reader.collections[key].list();
    } catch (err) {
      violations.push({ location: `collection:${key}`, kind: 'read-error', value: '', detail: String(err) });
      continue;
    }
    for (const slug of slugs) {
      let data;
      try {
        data = await reader.collections[key].read(slug);
      } catch (err) {
        violations.push({ location: `${key}/${slug}`, kind: 'read-error', value: '', detail: String(err) });
        continue;
      }
      if (!data) continue;
      checked++;
      for (const [field, def] of Object.entries(collection.schema)) {
        walkField(def, data[field], `${key}/${slug}.${field}`);
      }
    }
  }

  if (violations.length === 0) {
    console.log(`OK: Keystatic image/file paths valid across ${checked} content entries.`);
    return;
  }

  console.error(`\nKeystatic image/file path validation FAILED (${violations.length} issue(s)):\n`);
  for (const v of violations) {
    console.error(`  [${v.kind}] ${v.location}`);
    if (v.value) console.error(`      value:  ${v.value}`);
    console.error(`      ${v.detail}`);
  }
  console.error(
    `\nEach asset field must reference a real file inside the folder it manages.` +
      ` Fix the stored value or restore/move the file, then re-run. See CLI-165.\n`,
  );
  process.exitCode = 1;
}

run().catch((err) => {
  console.error('Validator crashed:', err);
  process.exitCode = 1;
});
