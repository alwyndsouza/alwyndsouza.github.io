import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";
import { estimateReadTime } from "./utils";
import type { Article } from "./types";
import { ARTICLE_CATEGORIES, getCategoryForArticle } from "./types";

export type { Article };
export { ARTICLE_CATEGORIES, getCategoryForArticle };

const ARTICLES_DIR = path.join(process.cwd(), "content/articles");

const marked = new Marked(
  markedHighlight({
    langPrefix: "hljs language-",
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : "plaintext";
      return hljs.highlight(code, { language }).value;
    },
  })
);

function extractFirstImage(content: string): string | undefined {
  const match = content.match(/!\[.*?\]\((.*?)\)/);
  return match?.[1];
}

export function getAllArticles(includeUnpublished = false): Article[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];

  const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".md"));

  const articles = files
    .map((filename) => {
      const filePath = path.join(ARTICLES_DIR, filename);
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(raw);

      if (!data.title || !data.slug) return null;

      const slug: string = data.slug || filename.replace(/\.md$/, "");
      const published: boolean = data.published !== false;

      if (!includeUnpublished && !published) return null;

      const htmlContent = marked.parse(content) as string;
      const coverImage: string | undefined =
        data.coverImage || extractFirstImage(content);

      return {
        slug,
        title: data.title as string,
        excerpt: (data.excerpt as string) || "",
        date: (data.date as string) || "",
        readTime: estimateReadTime(content),
        category: (data.category as string) || "Data Engineering",
        htmlContent,
        coverImage,
        published,
        tags: (data.tags as string[]) || [],
      } satisfies Article;
    })
    .filter((a): a is NonNullable<typeof a> => a !== null) as Article[];

  return articles.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getArticleBySlug(slug: string): Article | null {
  const all = getAllArticles(true);
  return all.find((a) => a.slug === slug) ?? null;
}

export function getAllArticleSlugs(): string[] {
  return getAllArticles(true).map((a) => a.slug);
}
