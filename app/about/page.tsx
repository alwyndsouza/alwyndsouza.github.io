import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Github, Linkedin, FileText, Mail } from "lucide-react";
import { getAllArticles } from "@/lib/articles";
import { formatDateShort } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About",
  description:
    "Alwyn D'Souza — Data & AI Engineering Leader specializing in DataOps, dbt, Databricks, AI Agents, and Modern Data Platforms.",
};

const SKILLS = [
  {
    category: "Data Platforms",
    items: ["Databricks", "Snowflake", "BigQuery", "Redshift", "DuckDB", "Oracle"],
  },
  {
    category: "Transformation",
    items: ["dbt Core", "dbt Cloud", "SQL", "Spark SQL", "Jinja2", "SQLMesh"],
  },
  {
    category: "AI & Automation",
    items: ["AI Agents", "MCP Servers", "LangChain", "Ollama", "RAG", "LLM APIs"],
  },
  {
    category: "Orchestration",
    items: ["Airflow", "dbt Cloud Jobs", "GitHub Actions", "Databricks Workflows"],
  },
  {
    category: "Streaming",
    items: ["Redpanda", "Kafka", "RisingWave", "Delta Live Tables"],
  },
  {
    category: "Languages",
    items: ["Python", "SQL", "Bash", "TypeScript", "Jinja2", "YAML"],
  },
  {
    category: "DevOps",
    items: ["Docker", "GitHub Actions", "pre-commit", "sqlfluff", "Terraform"],
  },
];

const CURRENTLY_EXPLORING = [
  "dbt Fusion Engine",
  "AI Agents + MCP",
  "BI-as-Code",
  "Semantic Layers",
];

const SOCIAL = [
  {
    href: "https://github.com/alwyndsouza",
    label: "GitHub",
    sub: "alwyndsouza",
    icon: Github,
  },
  {
    href: "https://linkedin.com/in/alwyndsouza",
    label: "LinkedIn",
    sub: "alwyndsouza",
    icon: Linkedin,
  },
  {
    href: "https://medium.com/@aradsouza",
    label: "Medium",
    sub: "@aradsouza",
    icon: FileText,
  },
  {
    href: "mailto:alwyn.anil@gmail.com",
    label: "Email",
    sub: "alwyn.anil@gmail.com",
    icon: Mail,
  },
];

export default function AboutPage() {
  const recentArticles = getAllArticles().slice(0, 5);

  return (
    <div className="min-h-screen pt-24 pb-24">
      <div className="section-container">
        {/* Hero */}
        <div className="mb-16 border-b border-zinc-800 pb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-4">
            About
          </p>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-16">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-zinc-100 sm:text-5xl mb-2">
                Alwyn D&apos;Souza
              </h1>
              <p className="text-lg text-indigo-400 font-medium mb-6">
                Data & AI Engineering Leader
              </p>
              <div className="space-y-4 text-zinc-400 text-base leading-relaxed max-w-2xl">
                <p>
                  I&apos;m a data engineering leader with 10+ years building
                  production-grade data platforms for enterprise teams. I
                  specialize in the modern data stack —{" "}
                  <span className="text-zinc-300">dbt</span>,{" "}
                  <span className="text-zinc-300">Databricks</span>,{" "}
                  <span className="text-zinc-300">DataOps</span>, and
                  increasingly,{" "}
                  <span className="text-zinc-300">AI-powered systems</span>.
                </p>
                <p>
                  My work sits at the intersection of data engineering and AI —
                  from building MCP servers that give AI agents governed access
                  to data platforms, to implementing semantic layers that make
                  metrics first-class citizens.
                </p>
                <p>
                  I write extensively on these topics (66+ published articles)
                  and build open-source reference architectures that teams can
                  actually use in production.
                </p>
              </div>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-indigo-500 border border-indigo-500/50"
                >
                  View Projects <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/articles"
                  className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-all hover:bg-zinc-800"
                >
                  Read Articles
                </Link>
              </div>
            </div>

            {/* Social / contact card */}
            <div className="lg:w-64 shrink-0">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-600 mb-4">
                  Connect
                </h3>
                {SOCIAL.map(({ href, label, sub, icon: Icon }) => (
                  <a
                    key={href}
                    href={href}
                    target={href.startsWith("mailto") ? undefined : "_blank"}
                    rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                    className="flex items-center gap-3 text-sm text-zinc-400 hover:text-zinc-200 transition-colors group"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-zinc-800 group-hover:bg-zinc-700 transition-colors">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-zinc-300 text-xs">{label}</p>
                      <p className="text-xs text-zinc-600 truncate">{sub}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-zinc-100 mb-8">
            Technical Expertise
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {SKILLS.map((group) => (
              <div
                key={group.category}
                className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5"
              >
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  {group.category}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {group.items.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center rounded px-2 py-0.5 text-xs font-mono bg-zinc-800/80 text-zinc-300 border border-zinc-700/50"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Currently exploring */}
        <div className="mb-16 rounded-xl border border-indigo-900/40 bg-indigo-950/20 p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-indigo-700/50 bg-indigo-900/50">
              <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-indigo-300 mb-3">
                Currently Exploring
              </h2>
              <div className="flex flex-wrap gap-2">
                {CURRENTLY_EXPLORING.map((topic) => (
                  <span
                    key={topic}
                    className="rounded-full border border-indigo-700/40 bg-indigo-900/30 px-3 py-1 text-xs font-medium text-indigo-300"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent articles */}
        <div>
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-zinc-100">
              Recent Writing
            </h2>
            <Link
              href="/articles"
              className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              All articles <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="space-y-px">
            {recentArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/articles/${article.slug}`}
                className="group flex items-center justify-between rounded-xl border border-transparent px-4 py-4 transition-all hover:border-zinc-800 hover:bg-zinc-900/50"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-300 group-hover:text-zinc-100 transition-colors line-clamp-1">
                    {article.title}
                  </p>
                  <p className="mt-0.5 text-xs text-zinc-600">
                    {formatDateShort(article.date)} · {article.readTime}
                  </p>
                </div>
                <ArrowRight className="ml-4 h-4 w-4 shrink-0 text-zinc-700 group-hover:text-indigo-400 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
