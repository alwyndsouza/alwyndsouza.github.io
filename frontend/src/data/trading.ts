import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import yaml from 'js-yaml';

const marked = new Marked(
  markedHighlight({
    emptyLangClass: 'hljs',
    langPrefix: 'hljs language-',
    highlight(code: string, lang: string) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    }
  })
);

export interface TradingPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  content: string;
  htmlContent: string;
  coverImage?: string;
  published: boolean;
  tags: string[];
}

function parseFrontmatter(fileContent: string): { data: Record<string, unknown>; content: string } {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
  const match = fileContent.match(frontmatterRegex);

  if (!match) {
    return { data: {}, content: fileContent };
  }

  const [, frontmatterStr, content] = match;

  try {
    const data = yaml.load(frontmatterStr) as Record<string, unknown>;
    return { data, content: content.trim() };
  } catch (error) {
    console.error('Error parsing YAML frontmatter:', error);
    return { data: {}, content: fileContent };
  }
}

const tradingFiles = import.meta.glob('../trading/*.md', {
  query: '?raw',
  eager: true,
});

function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

const showUnpublished = import.meta.env.DEV;

export const tradingPosts: TradingPost[] = Object.entries(tradingFiles)
  .map(([, file]) => {
    const rawContent = typeof file === 'string' ? file : (file as { default: string }).default;
    const { data: frontmatter, content } = parseFrontmatter(rawContent);

    return {
      slug: frontmatter.slug as string,
      title: frontmatter.title as string,
      excerpt: frontmatter.excerpt as string,
      date: String(frontmatter.date),
      readTime: calculateReadTime(content),
      category: frontmatter.category as string,
      content,
      htmlContent: marked.parse(content) as string,
      coverImage: frontmatter.coverImage as string | undefined,
      published: (frontmatter.published as boolean) ?? true,
      tags: (frontmatter.tags as string[]) ?? [],
    };
  })
  .filter(post => showUnpublished || post.published)
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
