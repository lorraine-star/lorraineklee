/**
 * Render funnel copy that contains inline bold markers.
 *
 * The "From Invisible to Influential" funnel copy is reproduced verbatim from
 * the original WordPress page, which emphasises phrases mid-sentence. Keystatic
 * stores these as plain text with `**bold**` markers so Lorraine can edit the
 * words without touching markup; this helper converts those markers to
 * `<strong>` for `set:html` rendering. Everything else is HTML-escaped first so
 * stray `<`/`>`/`&` in the copy can never inject markup.
 */
export function emphasize(value: string | null | undefined): string {
  if (!value) return '';
  const escaped = value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}
