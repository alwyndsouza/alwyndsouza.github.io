"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Clock, Calendar, Tag, BookOpen, TrendingUp } from "lucide-react";
import type { Article } from "@/lib/types";
import { formatDateShort } from "@/lib/utils";

/* ── Category config ─────────────────────────────────────── */
const CATEGORY_MAP: Record<string, { label: string; accent: CategoryAccent }> = {
  "data-engineering": {
    label: "Data Engineering",
    accent: {
      badge: "bg-orange-950/60 border-orange-800/40 text-orange-400",
      dot: "bg-orange-500",
      gradient: "from-orange-600/15 via-orange-600/5 to-transparent",
      bar: "bg-orange-500/60",
    },
  },
  "devops": {
    label: "DataOps",
    accent: {
      badge: "bg-emerald-950/60 border-emerald-800/40 text-emerald-400",
      dot: "bg-emerald-500",
      gradient: "from-emerald-600/15 via-emerald-600/5 to-transparent",
      bar: "bg-emerald-500/60",
    },
  },
  "data-architecture": {
    label: "Architecture",
    accent: {
      badge: "bg-indigo-950/60 border-indigo-800/40 text-indigo-400",
      dot: "bg-indigo-500",
      gradient: "from-indigo-600/15 via-indigo-600/5 to-transparent",
      bar: "bg-indigo-500/60",
    },
  },
  "mlops": {
    label: "MLOps",
    accent: {
      badge: "bg-violet-950/60 border-violet-800/40 text-violet-400",
      dot: "bg-violet-500",
      gradient: "from-violet-600/15 via-violet-600/5 to-transparent",
      bar: "bg-violet-500/60",
    },
  },
  "data-quality": {
    label: "Data Quality",
    accent: {
      badge: "bg-cyan-950/60 border-cyan-800/40 text-cyan-400",
      dot: "bg-cyan-500",
      gradient: "from-cyan-600/15 via-cyan-600/5 to-transparent",
      bar: "bg-cyan-500/60",
    },
  },
  "ai": {
    label: "AI & ML",
    accent: {
      badge: "bg-pink-950/60 border-pink-800/40 text-pink-400",
      dot: "bg-pink-500",
      gradient: "from-pink-600/15 via-pink-600/5 to-transparent",
      bar: "bg-pink-500/60",
    },
  },
  "dbt": {
    label: "dbt",
    accent: {
      badge: "bg-amber-950/60 border-amber-800/40 text-amber-400",
      dot: "bg-amber-500",
      gradient: "from-amber-600/15 via-amber-600/5 to-transparent",
      bar: "bg-amber-500/60",
    },
  },
};

const DEFAULT_ACCENT: CategoryAccent = {
  badge: "bg-zinc-800/60 border-zinc-700/40 text-zinc-400",
  dot: "bg-zinc-500",
  gradient: "from-zinc-700/10 via-transparent to-transparent",
  bar: "bg-zinc-600/60",
};

interface CategoryAccent {
  badge: string;
  dot: string;
  gradient: string;
  bar: string;
}

function getAccent(category: string): CategoryAccent {
  return CATEGORY_MAP[category]?.accent ?? DEFAULT_ACCENT;
}

function getCategoryLabel(category: string): string {
  return CATEGORY_MAP[category]?.label ?? category.replace(/-/g, " ");
}

/* ── Placeholder articles (fill gaps in showcase) ───────── */
const PLACEHOLDERS: Article[] = [
  {
    slug: "placeholder-databricks-unity-catalog",
    title: "Databricks Unity Catalog: The Complete Governance Guide",
    excerpt:
      "A deep-dive into Unity Catalog's architecture — metastore setup, three-level namespace, column-level security, audit logs, and migration from the legacy Hive metastore.",
    date: "2026-04-15",
    readTime: "14 min read",
    category: "data-architecture",
    tags: ["databricks", "unity-catalog", "governance", "lakehouse"],
    published: true,
    htmlContent: "",
  },
  {
    slug: "placeholder-dbt-semantic-layer",
    title: "dbt Semantic Layer in Production: MetricFlow at Enterprise Scale",
    excerpt:
      "How to define certified metrics with MetricFlow, wire them into your BI tools, and enforce consistency across 12 teams without a metrics council.",
    date: "2026-03-28",
    readTime: "11 min read",
    category: "dbt",
    tags: ["dbt", "semantic-layer", "metricflow", "metrics"],
    published: true,
    htmlContent: "",
  },
  {
    slug: "placeholder-ai-agent-dataops",
    title: "AI Agents for DataOps: Self-Healing Pipelines with MCP",
    excerpt:
      "How MCP servers expose dbt and Databricks surfaces to LLM agents — enabling automated schema healing, lineage-aware test repair, and zero-touch pipeline recovery.",
    date: "2026-03-10",
    readTime: "16 min read",
    category: "ai",
    tags: ["ai-agents", "mcp", "dataops", "databricks"],
    published: true,
    htmlContent: "",
  },
];

/* ── Filter tabs ─────────────────────────────────────────── */
const FILTER_TABS = [
  { id: "all", label: "All Insights" },
  { id: "data-engineering", label: "Data Engineering" },
  { id: "devops", label: "DataOps" },
  { id: "data-architecture", label: "Architecture" },
  { id: "ai", label: "AI & ML" },
  { id: "mlops", label: "MLOps" },
  { id: "dbt", label: "dbt" },
];

/* ── Animation variants ──────────────────────────────────── */
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

/* ── Section ─────────────────────────────────────────────── */
export function LatestArticles({ articles }: { articles: Article[] }) {
  const [activeFilter, setActiveFilter] = useState("all");

  const allArticles = useMemo(() => {
    const slugs = new Set(articles.map((a) => a.slug));
    const extras = PLACEHOLDERS.filter((p) => !slugs.has(p.slug));
    return [...articles, ...extras].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [articles]);

  const filtered = useMemo(() => {
    if (activeFilter === "all") return allArticles;
    return allArticles.filter((a) => a.category === activeFilter);
  }, [allArticles, activeFilter]);

  const [featured, ...rest] = filtered;
  const gridArticles = rest.slice(0, 5);

  return (
    <section className="section-padding border-t border-zinc-800/50 relative overflow-hidden">
      {/* Background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 30% 80%, rgba(99,102,241,0.05) 0%, transparent 65%)",
        }}
      />

      <div className="section-container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-3">
            Insights
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-zinc-100 sm:text-4xl">
                Writing from the Stack
              </h2>
              <p className="mt-3 max-w-xl text-zinc-500 text-base">
                Practical deep-dives on data engineering, AI agents, and modern
                platform architecture — written from the trenches of production systems.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-1.5 text-xs text-zinc-600 font-mono">
                <BookOpen className="h-3.5 w-3.5" />
                {allArticles.length}+ articles
              </div>
              <Link
                href="/articles"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                Browse all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-10 flex flex-wrap gap-2"
        >
          {FILTER_TABS.map((tab) => {
            const count =
              tab.id === "all"
                ? allArticles.length
                : allArticles.filter((a) => a.category === tab.id).length;
            if (tab.id !== "all" && count === 0) return null;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-all duration-150 ${
                  activeFilter === tab.id
                    ? "border-indigo-600 bg-indigo-600/20 text-indigo-300"
                    : "border-zinc-700 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300"
                }`}
              >
                {tab.label}
                {count > 0 && (
                  <span className="ml-1.5 text-zinc-700">{count}</span>
                )}
              </button>
            );
          })}
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-16 text-center text-zinc-600 font-mono text-sm"
            >
              No articles in this category yet.
            </motion.div>
          ) : (
            <motion.div
              key={activeFilter}
              variants={stagger}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0 }}
            >
              {/* Featured + sidebar row */}
              {featured && (
                <motion.div
                  variants={fadeUp}
                  className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-3"
                >
                  {/* Hero article */}
                  <div className="lg:col-span-2">
                    <HeroCard article={featured} />
                  </div>

                  {/* Side stack */}
                  <div className="flex flex-col gap-3">
                    {rest.slice(0, 3).map((article) => (
                      <CompactCard key={article.slug} article={article} />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Grid row */}
              {gridArticles.length > 3 && (
                <motion.div
                  variants={stagger}
                  className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {gridArticles.slice(3).map((article) => (
                    <motion.div key={article.slug} variants={fadeUp}>
                      <GridCard article={article} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 flex flex-col items-center gap-4 border-t border-zinc-800/50 pt-10"
        >
          <div className="flex items-center gap-2 text-xs text-zinc-600 font-mono">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Published articles · Medium · Dev.to · Personal blog</span>
          </div>
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-6 py-3 text-sm font-medium text-zinc-300 transition-all hover:bg-zinc-800 hover:border-zinc-600 hover:text-zinc-100"
          >
            Browse all articles
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Hero card ───────────────────────────────────────────── */
function HeroCard({ article }: { article: Article }) {
  const accent = getAccent(article.category);
  const isPlaceholder = article.slug.startsWith("placeholder-");

  return (
    <Link
      href={isPlaceholder ? "/articles" : `/articles/${article.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 transition-all duration-300 hover:border-zinc-700 hover:shadow-2xl hover:shadow-black/30 hover:bg-zinc-900/80"
    >
      {/* Cover */}
      <div className="relative overflow-hidden bg-zinc-950">
        <div className={`aspect-[16/7] bg-gradient-to-br ${accent.gradient} flex items-center justify-center relative`}>
          {article.coverImage ? (
            <img
              src={article.coverImage}
              alt={article.title}
              className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-50 transition-opacity duration-300"
              loading="lazy"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          ) : null}
          {/* Abstract pattern overlay */}
          <div className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="relative z-10 text-center px-6">
            <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-2">
              {getCategoryLabel(article.category)}
            </p>
          </div>
          {/* Top accent bar */}
          <div className={`absolute top-0 left-0 right-0 h-0.5 ${accent.bar}`} />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        {/* Meta row */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-mono font-medium ${accent.badge}`}>
            {getCategoryLabel(article.category)}
          </span>
          <div className="flex items-center gap-1 text-xs text-zinc-600">
            <Clock className="h-3 w-3" />
            {article.readTime}
          </div>
          <div className="flex items-center gap-1 text-xs text-zinc-600">
            <Calendar className="h-3 w-3" />
            {formatDateShort(article.date)}
          </div>
        </div>

        {/* Title */}
        <h3 className="mb-3 text-xl font-bold text-zinc-100 group-hover:text-white transition-colors leading-snug sm:text-2xl line-clamp-2">
          {article.title}
        </h3>

        {/* Excerpt */}
        {article.excerpt && (
          <p className="mb-5 flex-1 text-sm leading-relaxed text-zinc-500 line-clamp-3">
            {article.excerpt}
          </p>
        )}

        {/* Tags + CTA row */}
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-zinc-800 pt-4">
          <div className="flex flex-wrap gap-1.5">
            {article.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded border border-zinc-800 bg-zinc-900 px-1.5 py-0.5 text-xs font-mono text-zinc-600"
              >
                <Tag className="h-2.5 w-2.5" />
                {tag}
              </span>
            ))}
          </div>
          <span className="flex shrink-0 items-center gap-1 text-xs text-indigo-400 group-hover:text-indigo-300 transition-colors">
            Read article <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ── Compact sidebar card ────────────────────────────────── */
function CompactCard({ article }: { article: Article }) {
  const accent = getAccent(article.category);
  const isPlaceholder = article.slug.startsWith("placeholder-");

  return (
    <Link
      href={isPlaceholder ? "/articles" : `/articles/${article.slug}`}
      className="group flex gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-900/80 hover:shadow-lg"
    >
      {/* Accent stripe */}
      <div className={`w-0.5 shrink-0 rounded-full ${accent.dot} opacity-60`} />

      <div className="flex flex-1 flex-col gap-1.5 min-w-0">
        {/* Category + time */}
        <div className="flex items-center gap-2">
          <span className={`text-xs font-mono font-medium ${accent.badge.split(" ").find(c => c.startsWith("text-")) ?? "text-zinc-500"}`}>
            {getCategoryLabel(article.category)}
          </span>
          <span className="text-xs text-zinc-700 font-mono">{article.readTime}</span>
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-zinc-300 group-hover:text-zinc-100 transition-colors leading-snug line-clamp-2">
          {article.title}
        </h3>

        {/* Date */}
        <p className="text-xs text-zinc-700 font-mono">{formatDateShort(article.date)}</p>
      </div>

      <ArrowRight className="mt-1 h-3.5 w-3.5 shrink-0 text-zinc-700 group-hover:text-indigo-400 transition-colors" />
    </Link>
  );
}

/* ── Grid card ───────────────────────────────────────────── */
function GridCard({ article }: { article: Article }) {
  const accent = getAccent(article.category);
  const isPlaceholder = article.slug.startsWith("placeholder-");

  return (
    <Link
      href={isPlaceholder ? "/articles" : `/articles/${article.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-900/80 hover:shadow-xl hover:shadow-black/20"
    >
      {/* Mini cover */}
      <div className={`relative h-28 bg-gradient-to-br ${accent.gradient} overflow-hidden`}>
        {article.coverImage && (
          <img
            src={article.coverImage}
            alt={article.title}
            className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity"
            loading="lazy"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        )}
        <div className={`absolute top-0 left-0 right-0 h-0.5 ${accent.bar}`} />
        <div className="absolute bottom-3 left-4">
          <span className={`inline-flex items-center rounded border px-1.5 py-0.5 text-xs font-mono font-medium ${accent.badge}`}>
            {getCategoryLabel(article.category)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-2 text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors leading-snug line-clamp-2">
          {article.title}
        </h3>

        {article.excerpt && (
          <p className="mb-4 flex-1 text-xs leading-relaxed text-zinc-600 line-clamp-2">
            {article.excerpt}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between border-t border-zinc-800 pt-3">
          <div className="flex items-center gap-2 text-xs text-zinc-700 font-mono">
            <Clock className="h-3 w-3" />
            {article.readTime}
          </div>
          <ArrowRight className="h-3.5 w-3.5 text-zinc-700 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </Link>
  );
}
