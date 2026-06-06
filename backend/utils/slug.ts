// Slug helpers for human-readable blog URLs.
// slugify must stay in sync with the frontend (src/utils/blogHeadings.ts) so
// that links built on the client resolve to the same slug on the server.

export function slugify(text: string): string {
    return (text || '')
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// Resolve the slug for a stored blog item: prefer the persisted slug, otherwise
// derive one from the title. Keeps older rows (created before slugs existed)
// linkable without a migration.
export function blogSlug(item: { slug?: string; title?: string }): string {
    return item.slug || slugify(item.title || '');
}

// Given the set of slugs already in use, return a unique slug derived from base.
// Appends -2, -3, ... on collision so titles that repeat still get clean URLs.
export function uniqueSlug(base: string, taken: Set<string>): string {
    const root = base || 'post';
    if (!taken.has(root)) return root;
    let n = 2;
    while (taken.has(`${root}-${n}`)) n++;
    return `${root}-${n}`;
}
