export interface Heading {
  id: string;
  text: string;
  level: number;
}

const WORDS_PER_MINUTE = 200;

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function extractHeadings(html: string): Heading[] {
  if (!html) return [];
  const doc = new DOMParser().parseFromString(html, "text/html");
  const headings: Heading[] = [];
  doc.querySelectorAll("h1, h2, h3").forEach((node) => {
    const text = (node.textContent ?? "").trim();
    if (!text) return;
    headings.push({
      id: slugify(text),
      text,
      level: parseInt(node.tagName.slice(1), 10),
    });
  });
  return headings;
}

export function estimateReadingTime(html: string): number {
  if (!html) return 0;
  const div = document.createElement("div");
  div.innerHTML = html;
  const text = (div.textContent ?? "").trim();
  if (!text) return 0;
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}
