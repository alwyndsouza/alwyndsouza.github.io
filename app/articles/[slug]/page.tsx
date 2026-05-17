import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Clock, Calendar, Tag } from "lucide-react";
import { getArticleBySlug, getAllArticleSlugs, getAllArticles } from "@/lib/articles";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.date,
      authors: ["Alwyn D'Souza"],
      tags: article.tags,
    },
  };
}

export default async function ArticlePost({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  // Related articles: same category, exclude current
  const related = getAllArticles()
    .filter(
      (a) => a.slug !== article.slug && a.category === article.category
    )
    .slice(0, 3);

  return (
    <div className="min-h-screen pt-24 pb-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        {/* Back nav */}
        <Link
          href="/articles"
          className="mb-10 inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          All articles
        </Link>

        {/* Article header */}
        <header className="mb-12">
          <div className="mb-4 flex items-center gap-3 flex-wrap">
            <Badge variant="accent">{article.category}</Badge>
            <div className="flex items-center gap-1 text-xs text-zinc-600">
              <Calendar className="h-3 w-3" />
              <time dateTime={article.date}>{formatDate(article.date)}</time>
            </div>
            <div className="flex items-center gap-1 text-xs text-zinc-600">
              <Clock className="h-3 w-3" />
              {article.readTime}
            </div>
          </div>

          <h1 className="text-3xl font-bold text-zinc-100 sm:text-4xl leading-tight mb-4">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="text-base text-zinc-400 leading-relaxed border-l-2 border-indigo-700 pl-4">
              {article.excerpt}
            </p>
          )}

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <Tag className="h-3.5 w-3.5 text-zinc-600" />
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded px-2 py-0.5 text-xs font-mono bg-zinc-800/60 text-zinc-500 border border-zinc-700/30"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Cover image */}
          {article.coverImage && (
            <div className="mt-8 overflow-hidden rounded-xl border border-zinc-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full object-cover max-h-80"
              />
            </div>
          )}
        </header>

        {/* Divider */}
        <div className="mb-12 border-t border-zinc-800" />

        {/* Article body */}
        <article
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: article.htmlContent }}
        />

        {/* Related articles */}
        {related.length > 0 && (
          <div className="mt-20 border-t border-zinc-800 pt-12">
            <h2 className="text-lg font-semibold text-zinc-100 mb-6">
              More in {article.category}
            </h2>
            <div className="space-y-1">
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/articles/${rel.slug}`}
                  className="group flex items-center justify-between rounded-xl border border-transparent px-4 py-4 transition-all hover:border-zinc-800 hover:bg-zinc-900/50"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-300 group-hover:text-zinc-100 transition-colors line-clamp-1">
                      {rel.title}
                    </p>
                    <p className="mt-0.5 text-xs text-zinc-600">
                      {formatDate(rel.date)} · {rel.readTime}
                    </p>
                  </div>
                  <ChevronLeft className="ml-4 h-4 w-4 rotate-180 text-zinc-700 group-hover:text-indigo-400 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
