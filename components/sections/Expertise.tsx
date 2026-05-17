"use client";

import { motion } from "framer-motion";
import {
  GitBranch,
  Database,
  Bot,
  Layers,
  Activity,
} from "lucide-react";

const AREAS = [
  {
    icon: Database,
    title: "DataOps",
    description:
      "End-to-end pipeline automation, CI/CD for data, observability, and operational excellence across the modern data stack.",
    tags: ["dbt", "Airflow", "GitHub Actions", "Docker"],
    gradient: "from-indigo-600/20 to-violet-600/10",
    border: "hover:border-indigo-700/50",
    iconColor: "text-indigo-400",
    iconBg: "bg-indigo-950/60",
  },
  {
    icon: GitBranch,
    title: "dbt & Transformation",
    description:
      "Production dbt architectures with data contracts, semantic layers, CI/CD pipelines, and advanced Jinja macros.",
    tags: ["dbt Core", "dbt Cloud", "MetricFlow", "SQLMesh"],
    gradient: "from-emerald-600/15 to-teal-600/10",
    border: "hover:border-emerald-700/50",
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-950/60",
  },
  {
    icon: Layers,
    title: "Databricks & Lakehouse",
    description:
      "Unity Catalog governance, medallion architecture, streaming pipelines, and PII protection on Databricks.",
    tags: ["Unity Catalog", "Delta Lake", "Spark", "DLT"],
    gradient: "from-orange-600/15 to-amber-600/10",
    border: "hover:border-orange-700/50",
    iconColor: "text-orange-400",
    iconBg: "bg-orange-950/60",
  },
  {
    icon: Bot,
    title: "AI Agents & MCP",
    description:
      "LLM-powered automation, context-aware AI code review, MCP servers for governed data access, and agentic workflows.",
    tags: ["MCP", "Ollama", "LangChain", "RAG"],
    gradient: "from-pink-600/15 to-rose-600/10",
    border: "hover:border-pink-700/50",
    iconColor: "text-pink-400",
    iconBg: "bg-pink-950/60",
  },
  {
    icon: Activity,
    title: "Semantic Layers",
    description:
      "Metrics-as-code with MetricFlow and dbt, DuckDB local-first stacks, and self-serve analytics for business teams.",
    tags: ["MetricFlow", "DuckDB", "Cube", "BI-as-Code"],
    gradient: "from-cyan-600/15 to-blue-600/10",
    border: "hover:border-cyan-700/50",
    iconColor: "text-cyan-400",
    iconBg: "bg-cyan-950/60",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const card = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export function Expertise() {
  return (
    <section className="section-padding border-t border-zinc-800/50">
      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-3">
            Expertise
          </p>
          <h2 className="text-3xl font-bold text-zinc-100 sm:text-4xl">
            What I Build
          </h2>
          <p className="mt-3 max-w-xl text-zinc-500 text-base">
            Deep specialization across the modern data & AI stack — from raw
            ingestion to production AI systems.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {AREAS.map((area) => (
            <motion.div
              key={area.title}
              variants={card}
              className={`group relative overflow-hidden rounded-xl border border-zinc-800 bg-gradient-to-br ${area.gradient} p-6 transition-all duration-200 ${area.border} hover:shadow-lg hover:shadow-black/20`}
            >
              {/* Icon */}
              <div
                className={`mb-4 inline-flex h-9 w-9 items-center justify-center rounded-lg ${area.iconBg}`}
              >
                <area.icon className={`h-4.5 w-4.5 ${area.iconColor}`} />
              </div>

              <h3 className="mb-2 text-base font-semibold text-zinc-100">
                {area.title}
              </h3>

              <p className="mb-4 text-sm leading-relaxed text-zinc-400">
                {area.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {area.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded px-1.5 py-0.5 text-xs font-mono text-zinc-500 bg-zinc-800/50 border border-zinc-700/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
