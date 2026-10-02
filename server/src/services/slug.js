/** "Why Speed-to-Lead Wins" -> "why-speed-to-lead-wins" */
export function slugify(text, maxLength = 80) {
  return String(text ?? '')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, maxLength)
    .replace(/-+$/g, '');
}

export const isValidSlug = (slug) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length <= 120;

/**
 * A slug not used by any other document: "my-post", then "my-post-2", ...
 * `exists(slug)` resolves true when the slug is taken by someone else.
 */
export async function uniqueSlug(base, exists) {
  const root = base || 'post';
  if (!(await exists(root))) return root;
  for (let n = 2; n < 1000; n++) {
    const candidate = `${root}-${n}`;
    if (!(await exists(candidate))) return candidate;
  }
  throw new Error('Could not find a free slug.');
}
