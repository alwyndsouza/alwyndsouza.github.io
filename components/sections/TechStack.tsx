"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Database, Cloud, BrainCircuit, GitMerge, BarChart2, Code2,
} from "lucide-react";

/* ── Types ───────────────────────────────────────────────── */
interface Tech {
  name: string;
  note?: string;
  featured?: boolean;
}

interface Category {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
  accent: Accent;
  techs: Tech[];
}

interface Accent {
  text: string;
  dimText: string;
  iconBg: string;
  cardBorder: string;
  cardGlow: string;
  chipBorder: string;
  chipHoverBg: string;
  chipHoverBorder: string;
  chipHoverText: string;
  dot: string;
  topStripe: string;
  sectionBg: string;
}

/* ── Accent palette ──────────────────────────────────────── */
const orange: Accent = {
  text: "text-orange-400",
  dimText: "text-orange-600",
  iconBg: "bg-orange-950/70 border-orange-800/50",
  cardBorder: "border-zinc-800 hover:border-orange-700/60",
  cardGlow: "hover:shadow-orange-900/25",
  chipBorder: "border-zinc-700/50",
  chipHoverBg: "group-hover/chip:bg-orange-950/60",
  chipHoverBorder: "group-hover/chip:border-orange-700/60",
  chipHoverText: "group-hover/chip:text-orange-200",
  dot: "bg-orange-500",
  topStripe: "from-orange-600/40 to-transparent",
  sectionBg: "from-orange-600/5 to-transparent",
};

const indigo: Accent = {
  text: "text-indigo-400",
  dimText: "text-indigo-600",
  iconBg: "bg-indigo-950/70 border-indigo-800/50",
  cardBorder: "border-zinc-800 hover:border-indigo-700/60",
  cardGlow: "hover:shadow-indigo-900/25",
  chipBorder: "border-zinc-700/50",
  chipHoverBg: "group-hover/chip:bg-indigo-950/60",
  chipHoverBorder: "group-hover/chip:border-indigo-700/60",
  chipHoverText: "group-hover/chip:text-indigo-200",
  dot: "bg-indigo-500",
  topStripe: "from-indigo-600/40 to-transparent",
  sectionBg: "from-indigo-600/5 to-transparent",
};

const violet: Accent = {
  text: "text-violet-400",
  dimText: "text-violet-600",
  iconBg: "bg-violet-950/70 border-violet-800/50",
  cardBorder: "border-zinc-800 hover:border-violet-700/60",
  cardGlow: "hover:shadow-violet-900/25",
  chipBorder: "border-zinc-700/50",
  chipHoverBg: "group-hover/chip:bg-violet-950/60",
  chipHoverBorder: "group-hover/chip:border-violet-700/60",
  chipHoverText: "group-hover/chip:text-violet-200",
  dot: "bg-violet-500",
  topStripe: "from-violet-600/40 to-transparent",
  sectionBg: "from-violet-600/5 to-transparent",
};

const emerald: Accent = {
  text: "text-emerald-400",
  dimText: "text-emerald-600",
  iconBg: "bg-emerald-950/70 border-emerald-800/50",
  cardBorder: "border-zinc-800 hover:border-emerald-700/60",
  cardGlow: "hover:shadow-emerald-900/25",
  chipBorder: "border-zinc-700/50",
  chipHoverBg: "group-hover/chip:bg-emerald-950/60",
  chipHoverBorder: "group-hover/chip:border-emerald-700/60",
  chipHoverText: "group-hover/chip:text-emerald-200",
  dot: "bg-emerald-500",
  topStripe: "from-emerald-600/40 to-transparent",
  sectionBg: "from-emerald-600/5 to-transparent",
};

const cyan: Accent = {
  text: "text-cyan-400",
  dimText: "text-cyan-600",
  iconBg: "bg-cyan-950/70 border-cyan-800/50",
  cardBorder: "border-zinc-800 hover:border-cyan-700/60",
  cardGlow: "hover:shadow-cyan-900/25",
  chipBorder: "border-zinc-700/50",
  chipHoverBg: "group-hover/chip:bg-cyan-950/60",
  chipHoverBorder: "group-hover/chip:border-cyan-700/60",
  chipHoverText: "group-hover/chip:text-cyan-200",
  dot: "bg-cyan-500",
  topStripe: "from-cyan-600/40 to-transparent",
  sectionBg: "from-cyan-600/5 to-transparent",
};

const blue: Accent = {
  text: "text-blue-400",
  dimText: "text-blue-600",
  iconBg: "bg-blue-950/70 border-blue-800/50",
  cardBorder: "border-zinc-800 hover:border-blue-700/60",
  cardGlow: "hover:shadow-blue-900/25",
  chipBorder: "border-zinc-700/50",
  chipHoverBg: "group-hover/chip:bg-blue-950/60",
  chipHoverBorder: "group-hover/chip:border-blue-700/60",
  chipHoverText: "group-hover/chip:text-blue-200",
  dot: "bg-blue-500",
  topStripe: "from-blue-600/40 to-transparent",
  sectionBg: "from-blue-600/5 to-transparent",
};

/* ── Data ────────────────────────────────────────────────── */
const CATEGORIES: Category[] = [
  {
    id: "data-engineering",
    label: "Data Engineering",
    icon: Database,
    description: "Lakehouse, pipelines, streaming",
    accent: orange,
    techs: [
      { name: "Databricks", note: "Lakehouse", featured: true },
      { name: "dbt Core", note: "Transform", featured: true },
      { name: "dbt Cloud", note: "Orchestrate" },
      { name: "Apache Spark", note: "Compute", featured: true },
      { name: "Delta Lake", note: "Storage" },
      { name: "Redpanda", note: "Streaming" },
      { name: "Apache Airflow", note: "Orchestrate" },
      { name: "RisingWave", note: "Stream SQL" },
      { name: "Delta Live Tables", note: "DLT" },
      { name: "Unity Catalog", note: "Governance" },
      { name: "MetricFlow", note: "Metrics" },
      { name: "DuckDB", note: "Local OLAP" },
    ],
  },
  {
    id: "cloud",
    label: "Cloud Platforms",
    icon: Cloud,
    description: "Multi-cloud infrastructure",
    accent: blue,
    techs: [
      { name: "AWS", note: "Primary cloud", featured: true },
      { name: "GCP", note: "Analytics", featured: true },
      { name: "S3 / GCS", note: "Object store" },
      { name: "Terraform", note: "IaC", featured: true },
      { name: "AWS Glue", note: "Catalog" },
      { name: "CloudFormation", note: "AWS IaC" },
      { name: "BigQuery", note: "GCP DWH" },
    ],
  },
  {
    id: "ai-ml",
    label: "AI & ML",
    icon: BrainCircuit,
    description: "Agents, LLMs, ML pipelines",
    accent: violet,
    techs: [
      { name: "AI Agents", note: "MCP-based", featured: true },
      { name: "MCP", note: "Protocol", featured: true },
      { name: "LangChain", note: "Orchestration" },
      { name: "Ollama", note: "Local LLMs" },
      { name: "MLflow", note: "Tracking" },
      { name: "RAG Pipelines", note: "Retrieval" },
      { name: "Claude API", note: "LLM" },
      { name: "OpenAI API", note: "LLM" },
      { name: "Feature Stores", note: "Feast" },
      { name: "Vector DBs", note: "pgvector" },
    ],
  },
  {
    id: "devops",
    label: "DevOps & DataOps",
    icon: GitMerge,
    description: "CI/CD, quality, automation",
    accent: emerald,
    techs: [
      { name: "GitHub Actions", note: "CI/CD", featured: true },
      { name: "Docker", note: "Containers", featured: true },
      { name: "Kubernetes", note: "Orchestrate", featured: true },
      { name: "pre-commit", note: "Hooks" },
      { name: "SQLFluff", note: "SQL lint" },
      { name: "dbt-checkpoint", note: "dbt QA" },
      { name: "Slim CI", note: "dbt CI" },
      { name: "Makefile", note: "Automation" },
      { name: "ruff", note: "Python lint" },
    ],
  },
  {
    id: "analytics",
    label: "Analytics & BI",
    icon: BarChart2,
    description: "Dashboards, metrics, self-serve",
    accent: cyan,
    techs: [
      { name: "Power BI", note: "Enterprise BI", featured: true },
      { name: "Tableau", note: "Visual analytics" },
      { name: "Grafana", note: "Observability" },
      { name: "Superset", note: "Open-source" },
      { name: "Looker", note: "LookML" },
      { name: "Semantic Layers", note: "MetricFlow" },
      { name: "BI-as-Code", note: "Evidence" },
      { name: "Data Catalog", note: "Discovery" },
    ],
  },
  {
    id: "programming",
    label: "Programming",
    icon: Code2,
    description: "Languages, frameworks, tooling",
    accent: indigo,
    techs: [
      { name: "Python", note: "Primary", featured: true },
      { name: "SQL", note: "Core", featured: true },
      { name: "Jinja2", note: "Templating" },
      { name: "Bash / Shell", note: "Scripting" },
      { name: "TypeScript", note: "Frontend" },
      { name: "YAML", note: "Config" },
      { name: "Markdown", note: "Docs" },
      { name: "Spark SQL", note: "Distributed" },
    ],
  },
];

/* ── Animation variants ──────────────────────────────────── */
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const chipVariants = {
  hidden: { opacity: 0, scale: 0.92 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" as const } },
};

/* ── Section ─────────────────────────────────────────────── */
export function TechStack() {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  return (
    <section className="section-padding border-t border-zinc-800/50 relative overflow-hidden">
      {/* Background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(99,102,241,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="section-container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-3">
            Tech Stack
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-zinc-100 sm:text-4xl">
                Tools & Technologies
              </h2>
              <p className="mt-3 max-w-xl text-zinc-500 text-base">
                The modern data & AI stack I work with daily — from lakehouse
                platforms to agentic automation.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-zinc-700 font-mono shrink-0">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
                Core
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                Featured
              </span>
            </div>
          </div>
        </motion.div>

        {/* Category grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {CATEGORIES.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              isHighlighted={hoveredCategory === null || hoveredCategory === cat.id}
              onHover={(id) => setHoveredCategory(id)}
              onLeave={() => setHoveredCategory(null)}
            />
          ))}
        </motion.div>

        {/* Bottom count row */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-6"
        >
          {CATEGORIES.map((cat) => (
            <div key={cat.id} className="flex items-center gap-2 text-xs text-zinc-700 font-mono">
              <span className={`h-1.5 w-1.5 rounded-full ${cat.accent.dot}`} />
              <span className={cat.accent.dimText}>{cat.label}</span>
              <span className="text-zinc-800">·</span>
              <span>{cat.techs.length} tools</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ── Category card ───────────────────────────────────────── */
function CategoryCard({
  category, isHighlighted, onHover, onLeave,
}: {
  category: Category;
  isHighlighted: boolean;
  onHover: (id: string) => void;
  onLeave: () => void;
}) {
  const { accent, icon: Icon } = category;

  return (
    <motion.div
      variants={cardVariants}
      onMouseEnter={() => onHover(category.id)}
      onMouseLeave={onLeave}
      className={`group relative overflow-hidden rounded-xl border transition-all duration-300 ${accent.cardBorder} hover:shadow-xl ${accent.cardGlow} ${
        isHighlighted ? "opacity-100" : "opacity-40"
      }`}
    >
      {/* Card background gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${accent.sectionBg} pointer-events-none`}
      />

      {/* Top accent stripe */}
      <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${accent.topStripe}`} />

      <div className="relative z-10 p-5">
        {/* Header */}
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className={`flex h-7 w-7 items-center justify-center rounded-md border ${accent.iconBg}`}>
                <Icon className={`h-3.5 w-3.5 ${accent.text}`} />
              </div>
              <h3 className={`text-sm font-semibold ${accent.text}`}>
                {category.label}
              </h3>
            </div>
            <p className="text-xs text-zinc-600 font-mono pl-0.5">{category.description}</p>
          </div>
          <span className="shrink-0 text-xs text-zinc-700 font-mono mt-0.5">
            {category.techs.length}
          </span>
        </div>

        {/* Tech chips */}
        <motion.div
          variants={{ show: { transition: { staggerChildren: 0.04, delayChildren: 0.1 } } }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex flex-wrap gap-1.5"
        >
          {category.techs.map((tech) => (
            <TechChip key={tech.name} tech={tech} accent={accent} />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ── Tech chip ───────────────────────────────────────────── */
function TechChip({ tech, accent }: { tech: Tech; accent: Accent }) {
  return (
    <motion.div
      variants={chipVariants}
      className={`group/chip relative flex items-center gap-1.5 rounded-md border bg-zinc-900/80 px-2 py-1 transition-all duration-200 cursor-default ${accent.chipBorder} ${accent.chipHoverBg} ${accent.chipHoverBorder}`}
    >
      {/* Dot — pulsing for featured */}
      <span
        className={`h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-200 ${
          tech.featured
            ? `${accent.dot} animate-pulse`
            : "bg-zinc-600 group-hover/chip:bg-zinc-400"
        }`}
      />

      {/* Name */}
      <span
        className={`text-xs font-mono font-medium transition-colors duration-200 ${
          tech.featured ? "text-zinc-300" : "text-zinc-500"
        } ${accent.chipHoverText}`}
      >
        {tech.name}
      </span>

      {/* Note — visible on hover */}
      {tech.note && (
        <span
          className={`hidden text-xs font-mono text-zinc-700 transition-all duration-150 group-hover/chip:inline ${accent.dimText}`}
        >
          · {tech.note}
        </span>
      )}
    </motion.div>
  );
}
