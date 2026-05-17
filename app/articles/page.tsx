import type { Metadata } from "next";
import { getAllArticles } from "@/lib/articles";
import { ArticlesClient } from "./ArticlesClient";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Articles on data engineering, dbt, Databricks, AI agents, DataOps, and modern data platform architecture.",
  openGraph: {
    title: "Writing — Alwyn D'Souza",
    description:
      "Practical guides and deep dives on data engineering, DataOps, dbt, Databricks, AI agents, and modern platform architecture.",
    images: [{ url: "/og-default.svg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", images: ["/og-default.svg"] },
};

export default function ArticlesPage() {
  const articles = getAllArticles();

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="section-container">
        {/* Page header */}
        <div className="mb-12 border-b border-zinc-800 pb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-3">
            Writing
          </p>
          <h1 className="text-4xl font-bold text-zinc-100 sm:text-5xl mb-4">
            Articles & Guides
          </h1>
          <p className="max-w-2xl text-zinc-500 text-base leading-relaxed">
            Practical deep dives on data engineering, dbt, Databricks, AI
            agents, MLOps, and modern platform architecture. {articles.length}{" "}
            published articles.
          </p>
        </div>

        <ArticlesClient articles={articles} />
      </div>
    </div>
  );
}
