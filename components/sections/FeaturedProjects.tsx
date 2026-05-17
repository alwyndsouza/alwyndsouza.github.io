"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Github,
  ExternalLink,
  Layers,
  GitBranch,
  BrainCircuit,
  BarChart3,
  PackageCheck,
  CheckCircle2,
  TrendingUp,
  Zap,
} from "lucide-react";

interface EnterpriseProject {
  id: string;
  title: string;
  category: string;
  problem: string;
  highlights: string[];
  impact: { metric: string; label: string }[];
  tech: string[];
  accent: {
    border: string;
    glow: string;
    badge: string;
    badgeText: string;
    icon: string;
    iconBg: string;
    gradient: string;
    impactBg: string;
    impactText: string;
    impactBorder: string;
  };
  icon: React.ElementType;
  featured?: boolean;
  links?: { github?: string; demo?: string };
}

const PROJECTS: EnterpriseProject[] = [
  {
    id: "databricks-migration",
    title: "Databricks Migration Platform",
    category: "Lakehouse Architecture",
    problem:
      "Modernized a legacy on-premises Oracle data warehouse to a Databricks Lakehouse — migrating 8 years of historical data, 200+ ETL jobs, and 40+ downstream reports with zero business disruption.",
    highlights: [
      "Medallion architecture with Unity Catalog governance and column-level lineage",
      "Incremental migration strategy with dual-write validation to eliminate cut-over risk",
      "Automated PII classification and row-level access policies via Unity Catalog tags",
    ],
    impact: [
      { metric: "70%", label: "Cost reduction" },
      { metric: "3×", label: "Query performance" },
      { metric: "8 yrs", label: "History migrated" },
    ],
    tech: ["Databricks", "Unity Catalog", "Delta Lake", "dbt", "AWS", "Python", "Spark"],
    accent: {
      border: "hover:border-orange-700/60",
      glow: "hover:shadow-orange-900/20",
      badge: "bg-orange-950/60 border-orange-800/40",
      badgeText: "text-orange-400",
      icon: "text-orange-400",
      iconBg: "bg-orange-950/60 border-orange-800/40",
      gradient: "from-orange-600/8 via-transparent to-transparent",
      impactBg: "bg-orange-950/40",
      impactText: "text-orange-300",
      impactBorder: "border-orange-800/40",
    },
    icon: Layers,
    featured: true,
  },
  {
    id: "dataops-automation",
    title: "DataOps Automation Framework",
    category: "CI/CD & Automation",
    problem:
      "Replaced manual SQL deployments and ad-hoc releases with a fully automated DataOps pipeline — eliminating production incidents caused by untested schema changes.",
    highlights: [
      "Slim CI dbt runs — only modified models and downstream dependencies per PR",
      "Pre-commit gates: SQLFluff, dbt-checkpoint, schema contract validation",
      "Automatic temp-schema teardown and PR-level data quality reporting",
    ],
    impact: [
      { metric: "85%", label: "Faster releases" },
      { metric: "0", label: "Prod incidents" },
      { metric: "100%", label: "Test coverage" },
    ],
    tech: ["dbt", "GitHub Actions", "Docker", "SQLFluff", "pre-commit", "Databricks"],
    accent: {
      border: "hover:border-indigo-700/60",
      glow: "hover:shadow-indigo-900/20",
      badge: "bg-indigo-950/60 border-indigo-800/40",
      badgeText: "text-indigo-400",
      icon: "text-indigo-400",
      iconBg: "bg-indigo-950/60 border-indigo-800/40",
      gradient: "from-indigo-600/8 via-transparent to-transparent",
      impactBg: "bg-indigo-950/40",
      impactText: "text-indigo-300",
      impactBorder: "border-indigo-800/40",
    },
    icon: GitBranch,
    links: { github: "https://github.com/alwyndsouza/dbt-ci-cd" },
  },
  {
    id: "ai-agent-platform",
    title: "AI Agent Orchestration Platform",
    category: "AI & Automation",
    problem:
      "Built an MCP-powered AI agent layer that automates data platform operations — schema healing, pipeline monitoring, and natural-language access to analytics surfaces.",
    highlights: [
      "MCP servers exposing governed Databricks and dbt surfaces to LLM agents",
      "Self-healing pipelines: AI detects schema drift, applies patches, re-validates",
      "Context-aware code review agent with dbt lineage and test-aware suggestions",
    ],
    impact: [
      { metric: "40%", label: "Toil reduced" },
      { metric: "1.8h", label: "Mean heal time" },
      { metric: "24/7", label: "Autonomous ops" },
    ],
    tech: ["MCP", "LangChain", "Ollama", "Python", "Databricks", "dbt", "RAG"],
    accent: {
      border: "hover:border-violet-700/60",
      glow: "hover:shadow-violet-900/20",
      badge: "bg-violet-950/60 border-violet-800/40",
      badgeText: "text-violet-400",
      icon: "text-violet-400",
      iconBg: "bg-violet-950/60 border-violet-800/40",
      gradient: "from-violet-600/8 via-transparent to-transparent",
      impactBg: "bg-violet-950/40",
      impactText: "text-violet-300",
      impactBorder: "border-violet-800/40",
    },
    icon: BrainCircuit,
    links: { github: "https://github.com/alwyndsouza/dbt-conversation-ai-local" },
  },
  {
    id: "marketing-finance-stores",
    title: "Marketing & Finance Data Stores",
    category: "Analytics Engineering",
    problem:
      "Consolidated siloed marketing and finance reporting into unified data marts — eliminating a 2-week analyst delivery cycle with a self-serve semantic layer.",
    highlights: [
      "MetricFlow semantic layer with certified metric definitions across both domains",
      "Automated reconciliation checks — finance vs. source-of-truth within ±0.01%",
      "Row-level security aligned to org hierarchy via Unity Catalog access policies",
    ],
    impact: [
      { metric: "<24h", label: "Time to insight" },
      { metric: "12", label: "Teams unblocked" },
      { metric: "99.9%", label: "Reconciliation acc." },
    ],
    tech: ["dbt", "Databricks", "MetricFlow", "Unity Catalog", "Python", "Tableau"],
    accent: {
      border: "hover:border-emerald-700/60",
      glow: "hover:shadow-emerald-900/20",
      badge: "bg-emerald-950/60 border-emerald-800/40",
      badgeText: "text-emerald-400",
      icon: "text-emerald-400",
      iconBg: "bg-emerald-950/60 border-emerald-800/40",
      gradient: "from-emerald-600/8 via-transparent to-transparent",
      impactBg: "bg-emerald-950/40",
      impactText: "text-emerald-300",
      impactBorder: "border-emerald-800/40",
    },
    icon: BarChart3,
  },
  {
    id: "dbt-transformation-framework",
    title: "dbt Transformation Framework",
    category: "Data Transformation",
    problem:
      "Standardized SQL across 12 engineering teams onto a single dbt framework — replacing inconsistent ELT patterns with enforced data contracts and guaranteed quality gates.",
    highlights: [
      "Data contracts at source, staging, and mart layers with breaking-change detection",
      "Centralized macro library: SCD2, incremental strategies, audit columns",
      "Automated documentation generation with column-level descriptions via LLM",
    ],
    impact: [
      { metric: "200+", label: "Models standardized" },
      { metric: "12", label: "Teams onboarded" },
      { metric: "4×", label: "Developer velocity" },
    ],
    tech: ["dbt Core", "dbt Cloud", "SQLMesh", "Jinja2", "data-contracts", "SQLFluff"],
    accent: {
      border: "hover:border-amber-700/60",
      glow: "hover:shadow-amber-900/20",
      badge: "bg-amber-950/60 border-amber-800/40",
      badgeText: "text-amber-400",
      icon: "text-amber-400",
      iconBg: "bg-amber-950/60 border-amber-800/40",
      gradient: "from-amber-600/8 via-transparent to-transparent",
      impactBg: "bg-amber-950/40",
      impactText: "text-amber-300",
      impactBorder: "border-amber-800/40",
    },
    icon: PackageCheck,
    links: { github: "https://github.com/alwyndsouza/mds-databricks-semantic-layer" },
  },
];

/* ── Animation variants ──────────────────────────────────── */
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as const } },
};

/* ── Section ─────────────────────────────────────────────── */
export function FeaturedProjects() {
  const [featured, ...rest] = PROJECTS;

  return (
    <section className="section-padding border-t border-zinc-800/50 relative overflow-hidden">
      {/* Background accent */}
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 100% 60%, rgba(139,92,246,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="section-container relative z-10">
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
              Selected Work
            </p>
            <h2 className="text-3xl font-bold text-zinc-100 sm:text-4xl">
              Enterprise Projects
            </h2>
            <p className="mt-3 max-w-xl text-zinc-500 text-base">
              Production systems delivered for enterprise engineering teams — from
              lakehouse migrations to AI-powered data operations.
            </p>
          </div>
          <Link
            href="/projects"
            className="hidden sm:inline-flex shrink-0 items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            OSS projects <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </motion.div>

        {/* Bento grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {/* Featured card — spans 2 cols */}
          <motion.div
            variants={cardVariants}
            className="lg:col-span-2"
          >
            <FeaturedCard project={featured} />
          </motion.div>

          {/* Card 2 */}
          <motion.div variants={cardVariants}>
            <StandardCard project={rest[0]} />
          </motion.div>

          {/* Cards 3-5 */}
          {rest.slice(1).map((project) => (
            <motion.div key={project.id} variants={cardVariants}>
              <StandardCard project={project} />
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-10 text-center sm:hidden"
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            View OSS projects <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Featured card (2-col hero) ──────────────────────────── */
function FeaturedCard({ project }: { project: EnterpriseProject }) {
  const Icon = project.icon;
  const { accent } = project;

  return (
    <div
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 p-7 transition-all duration-300 ${accent.border} hover:shadow-2xl ${accent.glow} hover:bg-zinc-900/80`}
    >
      {/* Gradient wash */}
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent.gradient}`}
      />

      <div className="relative z-10 flex h-full flex-col lg:flex-row lg:gap-10">
        {/* Left: content */}
        <div className="flex flex-1 flex-col">
          {/* Top row */}
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg border ${accent.iconBg}`}>
                <Icon className={`h-4.5 w-4.5 ${accent.icon}`} />
              </div>
              <div>
                <span className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-mono font-medium ${accent.badge} ${accent.badgeText}`}>
                  {project.category}
                </span>
              </div>
            </div>
            {project.featured && (
              <span className="inline-flex items-center gap-1 rounded-full border border-zinc-700 bg-zinc-800/60 px-2.5 py-1 text-xs font-medium text-zinc-400">
                <Zap className="h-3 w-3" />
                Featured
              </span>
            )}
          </div>

          <h3 className="mb-3 text-xl font-bold text-zinc-100 group-hover:text-white transition-colors sm:text-2xl">
            {project.title}
          </h3>

          <p className="mb-6 text-sm leading-relaxed text-zinc-400 max-w-lg">
            {project.problem}
          </p>

          {/* Architecture highlights */}
          <ul className="mb-6 space-y-2.5">
            {project.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2.5 text-sm text-zinc-500">
                <CheckCircle2 className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${accent.icon}`} />
                <span>{h}</span>
              </li>
            ))}
          </ul>

          {/* Tech tags */}
          <div className="mb-6 flex flex-wrap gap-1.5">
            {project.tech.map((t) => (
              <span
                key={t}
                className="inline-flex items-center rounded border border-zinc-700/50 bg-zinc-800/80 px-1.5 py-0.5 text-xs font-mono font-medium text-zinc-400"
              >
                {t}
              </span>
            ))}
          </div>

          {/* Footer links */}
          <div className="mt-auto flex items-center gap-3 border-t border-zinc-800 pt-4">
            {project.links?.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-200 transition-colors"
              >
                <Github className="h-3.5 w-3.5" /> GitHub
              </a>
            )}
            {project.links?.demo && (
              <a
                href={project.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-200 transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" /> Live demo
              </a>
            )}
          </div>
        </div>

        {/* Right: impact metrics panel */}
        <div className="mt-8 shrink-0 lg:mt-0 lg:w-52">
          <div className={`rounded-xl border p-5 ${accent.impactBg} ${accent.impactBorder}`}>
            <div className="mb-4 flex items-center gap-1.5">
              <TrendingUp className={`h-3.5 w-3.5 ${accent.impactText}`} />
              <span className={`text-xs font-semibold uppercase tracking-wider ${accent.impactText}`}>
                Business Impact
              </span>
            </div>
            <div className="space-y-4">
              {project.impact.map(({ metric, label }) => (
                <div key={label}>
                  <p className={`text-2xl font-bold ${accent.impactText}`}>{metric}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Standard card ───────────────────────────────────────── */
function StandardCard({ project }: { project: EnterpriseProject }) {
  const Icon = project.icon;
  const { accent } = project;
  const MAX_TECH = 4;

  return (
    <div
      className={`group relative flex h-full flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all duration-300 ${accent.border} hover:shadow-xl ${accent.glow} hover:bg-zinc-900/80`}
    >
      {/* Gradient wash */}
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent.gradient}`}
      />

      <div className="relative z-10 flex h-full flex-col">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${accent.iconBg}`}>
            <Icon className={`h-4 w-4 ${accent.icon}`} />
          </div>
          <span className={`inline-flex items-center rounded border px-1.5 py-0.5 text-xs font-mono font-medium ${accent.badge} ${accent.badgeText}`}>
            {project.category}
          </span>
        </div>

        <h3 className="mb-2 text-base font-semibold text-zinc-100 group-hover:text-white transition-colors leading-snug">
          {project.title}
        </h3>

        <p className="mb-5 flex-1 text-sm leading-relaxed text-zinc-500 line-clamp-3">
          {project.problem}
        </p>

        {/* Highlights — top 2 only */}
        <ul className="mb-5 space-y-2">
          {project.highlights.slice(0, 2).map((h) => (
            <li key={h} className="flex items-start gap-2 text-xs text-zinc-600">
              <CheckCircle2 className={`mt-0.5 h-3 w-3 shrink-0 ${accent.icon} opacity-70`} />
              <span className="line-clamp-2">{h}</span>
            </li>
          ))}
        </ul>

        {/* Impact pills */}
        <div className={`mb-5 flex gap-3 rounded-lg border p-3 ${accent.impactBg} ${accent.impactBorder}`}>
          {project.impact.slice(0, 3).map(({ metric, label }) => (
            <div key={label} className="flex-1 text-center">
              <p className={`text-base font-bold leading-none ${accent.impactText}`}>{metric}</p>
              <p className="mt-1 text-xs text-zinc-600 leading-tight">{label}</p>
            </div>
          ))}
        </div>

        {/* Tech tags */}
        <div className="mb-4 flex flex-wrap gap-1">
          {project.tech.slice(0, MAX_TECH).map((t) => (
            <span
              key={t}
              className="inline-flex items-center rounded border border-zinc-700/50 bg-zinc-800/80 px-1.5 py-0.5 text-xs font-mono text-zinc-500"
            >
              {t}
            </span>
          ))}
          {project.tech.length > MAX_TECH && (
            <span className="text-xs font-mono text-zinc-700 px-1 py-0.5">
              +{project.tech.length - MAX_TECH}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center gap-3 border-t border-zinc-800 pt-4">
          {project.links?.github ? (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-300 transition-colors"
            >
              <Github className="h-3.5 w-3.5" /> View repo
            </a>
          ) : (
            <span className="text-xs text-zinc-700 font-mono">Enterprise project</span>
          )}
          {project.links?.demo && (
            <a
              href={project.links.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto inline-flex items-center gap-1 text-xs text-zinc-600 hover:text-zinc-300 transition-colors"
            >
              <ExternalLink className="h-3 w-3" /> Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
