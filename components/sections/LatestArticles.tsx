"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import type { Article } from "@/lib/types";
import { formatDateShort } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

interface LatestArticlesProps {
  articles: Article[];
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const row = {
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

export function LatestArticles({ articles }: LatestArticlesProps) {
  return (
    <section className="section-padding border-t border-zinc-800/50">
      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14 flex items-end justify-between gap-4"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-3">
              Recent Writing
            </p>
            <h2 className="text-3xl font-bold text-zinc-100 sm:text-4xl">
              Latest Articles
            </h2>
            <p className="mt-3 max-w-xl text-zinc-500 text-base">
              Practical guides and deep dives on data engineering, AI, and
              modern platform architecture.
            </p>
          </div>
          <Link
            href="/articles"
            className="hidden sm:inline-flex shrink-0 items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            All articles <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </motion.div>

        {/* Article list */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="space-y-2"
        >
          {articles.slice(0, 5).map((article) => (
            <ArticleRow key={article.slug} article={article} />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex justify-center sm:hidden"
        >
          <Link
            href="/articles"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            View all articles <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function ArticleRow({ article }: { article: Article }) {
  return (
    <motion.div variants={row}>
      <Link
        href={`/articles/${article.slug}`}
        className="group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 rounded-xl border border-transparent px-4 py-4 transition-all duration-150 hover:border-zinc-800 hover:bg-zinc-900/50"
      >
        {/* Date */}
        <span className="shrink-0 text-xs text-zinc-600 font-mono w-24">
          {formatDateShort(article.date)}
        </span>

        {/* Category */}
        <div className="shrink-0 hidden sm:block w-36">
          <Badge variant="default">{article.category}</Badge>
        </div>

        {/* Title */}
        <h3 className="flex-1 text-sm font-medium text-zinc-300 group-hover:text-zinc-100 transition-colors leading-snug line-clamp-1">
          {article.title}
        </h3>

        {/* Read time */}
        <div className="shrink-0 hidden sm:flex items-center gap-1 text-xs text-zinc-600">
          <Clock className="h-3 w-3" />
          {article.readTime}
        </div>

        {/* Arrow */}
        <ArrowRight className="hidden sm:block h-4 w-4 shrink-0 text-zinc-700 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
      </Link>
    </motion.div>
  );
}
