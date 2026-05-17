"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Clock, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Article } from "@/lib/types";
import { ARTICLE_CATEGORIES, getCategoryForArticle } from "@/lib/types";
import { formatDateShort } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

interface ArticlesClientProps {
  articles: Article[];
}

export function ArticlesClient({ articles }: ArticlesClientProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return articles.filter((a) => {
      const matchesCategory =
        activeCategory === "all" ||
        getCategoryForArticle(a.category) === activeCategory;

      const matchesSearch =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q)) ||
        a.category.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [articles, activeCategory, query]);

  const counts = useMemo(() => {
    const all = { all: articles.length } as Record<string, number>;
    ARTICLE_CATEGORIES.forEach((cat) => {
      all[cat.value] = articles.filter(
        (a) => getCategoryForArticle(a.category) === cat.value
      ).length;
    });
    return all;
  }, [articles]);

  return (
    <div>
      {/* Filters */}
      <div className="mb-8 space-y-4">
        {/* Category tabs */}
        <div className="flex flex-wrap gap-2">
          <FilterTab
            label="All"
            count={counts.all}
            active={activeCategory === "all"}
            onClick={() => setActiveCategory("all")}
          />
          {ARTICLE_CATEGORIES.map((cat) => (
            <FilterTab
              key={cat.value}
              label={cat.label}
              count={counts[cat.value] ?? 0}
              active={activeCategory === cat.value}
              onClick={() => setActiveCategory(cat.value)}
            />
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
          <input
            type="text"
            placeholder="Search articles…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-10 w-full rounded-lg border border-zinc-800 bg-zinc-900/50 pl-10 pr-4 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-indigo-700 focus:outline-none focus:ring-1 focus:ring-indigo-700 transition-colors"
          />
        </div>
      </div>

      {/* Results count */}
      <p className="mb-6 text-sm text-zinc-600">
        {filtered.length} article{filtered.length !== 1 ? "s" : ""}{" "}
        {query && `matching "${query}"`}
      </p>

      {/* Article list */}
      <AnimatePresence mode="popLayout">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-16 text-center"
          >
            <p className="text-zinc-500">No articles found.</p>
            <button
              onClick={() => {
                setActiveCategory("all");
                setQuery("");
              }}
              className="mt-3 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Clear filters
            </button>
          </motion.div>
        ) : (
          <motion.div key="list" className="space-y-px">
            {filtered.map((article, idx) => (
              <motion.div
                key={article.slug}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ delay: idx * 0.04, duration: 0.35 }}
              >
                <ArticleListItem article={article} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterTab({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150 ${
        active
          ? "bg-indigo-600 text-white border border-indigo-500/50"
          : "border border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200 hover:bg-zinc-800/50"
      }`}
    >
      {label}
      <span
        className={`rounded px-1 py-0.5 text-xs font-mono ${
          active
            ? "bg-indigo-700 text-indigo-200"
            : "bg-zinc-800 text-zinc-600"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function ArticleListItem({ article }: { article: Article }) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group block rounded-xl border border-transparent px-4 py-5 transition-all duration-150 hover:border-zinc-800 hover:bg-zinc-900/50"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-6">
        {/* Date */}
        <span className="shrink-0 text-xs text-zinc-600 font-mono pt-0.5 sm:w-24">
          {formatDateShort(article.date)}
        </span>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="mb-2 flex items-center gap-2">
            <Badge variant="default">{article.category}</Badge>
            <div className="flex items-center gap-1 text-xs text-zinc-600">
              <Clock className="h-3 w-3" />
              {article.readTime}
            </div>
          </div>

          <h3 className="mb-1.5 text-sm font-semibold text-zinc-200 group-hover:text-zinc-100 transition-colors leading-snug">
            {article.title}
          </h3>

          <p className="text-xs leading-relaxed text-zinc-500 line-clamp-2">
            {article.excerpt}
          </p>

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {article.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="rounded px-1.5 py-0.5 text-xs font-mono bg-zinc-800/60 text-zinc-500 border border-zinc-700/30"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <ArrowRight className="hidden sm:block h-4 w-4 shrink-0 mt-1 text-zinc-700 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
      </div>
    </Link>
  );
}
