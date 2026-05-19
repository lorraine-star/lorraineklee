import { createReader } from '@keystatic/core/reader';
import Markdoc from '@markdoc/markdoc';
import keystaticConfig from '../../keystatic.config';

export const reader = createReader(process.cwd(), keystaticConfig);

// Keystatic exposes markdoc content fields as an async function that resolves
// to the parsed AST. Resolve it and render to an HTML string for `set:html`.
export async function renderMarkdoc(field: unknown): Promise<string> {
  let value: unknown = field;
  if (typeof value === 'function') {
    value = await (value as () => Promise<unknown>)();
  }
  if (value && typeof value === 'object' && 'node' in value) {
    value = (value as { node: unknown }).node;
  }
  if (!value) return '';
  const input = value as Parameters<typeof Markdoc.transform>[0];
  return Markdoc.renderers.html(Markdoc.transform(input));
}
