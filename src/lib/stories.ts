// Turns the Markdown files in src/content/stories/ into stories.
//
// To add a story, copy one of those files, give it a new name (like
// `my-story.md`), and change the text. It appears on the site at /stories/my-story.
//
//   ---
//   title: The story's English title
//   title_km: ចំណងជើងជាភាសាខ្មែរ
//   summary: One sentence about the story.
//   summary_km: ប្រយោគមួយអំពីរឿង។
//   moral: The lesson of the story (optional).
//   moral_km: មេរៀននៃរឿង (optional).
//   emoji: 🐘
//   order: 4
//   ---
//   The story, one paragraph after another.
//   km: A line starting with "km:" shows Khmer under the paragraph above it.

import { parseFrontmatter, renderMarkdown } from './decks';

export interface Story {
  slug: string;
  title: string;
  titleKm: string;
  summary: string;
  summaryKm: string;
  moral: string;
  moralKm: string;
  emoji: string;
  order: number;
  html: string;
}

const files = import.meta.glob('../content/stories/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

export function getStories(): Story[] {
  return Object.entries(files)
    .map(([path, raw]) => {
      const slug = path.split('/').pop()!.replace(/\.md$/, '');
      const { data, body } = parseFrontmatter(raw);
      return {
        slug,
        title: data.title ?? slug,
        titleKm: data.title_km ?? '',
        summary: data.summary ?? '',
        summaryKm: data.summary_km ?? '',
        moral: data.moral ?? '',
        moralKm: data.moral_km ?? '',
        emoji: data.emoji ?? '📖',
        order: Number(data.order ?? 99),
        html: renderMarkdown(body),
      };
    })
    .sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug));
}
