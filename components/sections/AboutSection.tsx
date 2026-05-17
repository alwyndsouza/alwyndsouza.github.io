"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Users,
  Building2,
  Calendar,
  Cloud,
  GitMerge,
  BrainCircuit,
  Database,
  TrendingUp,
} from "lucide-react";

const METRICS = [
  {
    value: "10+",
    label: "Years Engineering",
    sub: "Enterprise data platforms",
    icon: Calendar,
    accent: "text-indigo-400",
    iconBg: "bg-indigo-950/60 border-indigo-800/40",
  },
  {
    value: "50+",
    label: "Enterprise Projects",
    sub: "Shipped to production",
    icon: Building2,
    accent: "text-violet-400",
    iconBg: "bg-violet-950/60 border-violet-800/40",
  },
  {
    value: "15+",
    label: "Engineers Led",
    sub: "Cross-functional teams",
    icon: Users,
    accent: "text-emerald-400",
    iconBg: "bg-emerald-950/60 border-emerald-800/40",
  },
  {
    value: "3+",
    label: "Cloud Platforms",
    sub: "AWS · GCP · Databricks",
    icon: Cloud,
    accent: "text-cyan-400",
    iconBg: "bg-cyan-950/60 border-cyan-800/40",
  },
];

const PILLARS = [
  {
    icon: Database,
    label: "Lakehouse Architecture",
    color: "text-orange-400",
    bg: "bg-orange-950/40 border-orange-800/30",
  },
  {
    icon: GitMerge,
    label: "DataOps & CI/CD",
    color: "text-indigo-400",
    bg: "bg-indigo-950/40 border-indigo-800/30",
  },
  {
    icon: BrainCircuit,
    label: "AI Agent Systems",
    color: "text-violet-400",
    bg: "bg-violet-950/40 border-violet-800/30",
  },
  {
    icon: TrendingUp,
    label: "Semantic Layers",
    color: "text-emerald-400",
    bg: "bg-emerald-950/40 border-emerald-800/30",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" as const },
  }),
};

export function AboutSection() {
  return (
    <section className="section-padding border-t border-zinc-800/50 relative overflow-hidden">
      {/* Subtle background accent */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 0% 50%, rgba(99,102,241,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="section-container relative z-10">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-14"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-3">
            About
          </p>
          <h2 className="text-3xl font-bold text-zinc-100 sm:text-4xl">
            The person behind the stack
          </h2>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20 items-start">
          {/* ── Left: Portrait + pillars ── */}
          <div className="flex flex-col gap-8">
            {/* Avatar placeholder */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 aspect-[4/3] max-w-sm">
                {/* Placeholder pattern */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 30% 40%, rgba(99,102,241,0.15) 0%, transparent 55%), radial-gradient(circle at 70% 70%, rgba(139,92,246,0.1) 0%, transparent 50%)",
                  }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <div className="h-20 w-20 rounded-full border-2 border-zinc-700 bg-zinc-800 flex items-center justify-center">
                    <span className="text-3xl font-bold text-zinc-400 select-none">A</span>
                  </div>
                  <p className="text-xs text-zinc-600 font-mono tracking-wider">alwyndsouza.github.io</p>
                </div>
                {/* Corner accent */}
                <div className="absolute bottom-4 right-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-800/60 bg-indigo-950/60 px-2.5 py-1 text-xs font-medium text-indigo-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
                    Open to consulting
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Expertise pillars */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-600">
                Core focus areas
              </p>
              <div className="grid grid-cols-2 gap-2">
                {PILLARS.map(({ icon: Icon, label, color, bg }) => (
                  <div
                    key={label}
                    className={`flex items-center gap-2.5 rounded-lg border px-3 py-2.5 ${bg}`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${color}`} />
                    <span className="text-xs font-medium text-zinc-300">{label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── Right: Bio + metrics ── */}
          <div className="flex flex-col gap-10">
            {/* Bio */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-5 text-base leading-relaxed"
            >
              <p className="text-zinc-300">
                I&apos;m a data engineering leader who has spent a decade building{" "}
                <span className="text-zinc-100 font-medium">
                  production-grade data platforms
                </span>{" "}
                for enterprise teams — from modernizing legacy Oracle warehouses
                to standing up Databricks lakehouses with Unity Catalog governance.
              </p>
              <p className="text-zinc-500">
                My current focus is the intersection of data engineering and AI —
                specifically how{" "}
                <span className="text-zinc-300 font-medium">AI agents</span>{" "}
                and MCP can automate the operational toil of running data platforms:
                schema healing, lineage-aware testing, self-healing pipelines, and
                governed LLM access to analytics surfaces.
              </p>
              <p className="text-zinc-500">
                I write about these patterns extensively — across published articles —
                and build open-source reference architectures that teams can deploy
                into their own cloud environments.
              </p>

              {/* Inline quote */}
              <blockquote className="border-l-2 border-indigo-600 pl-4 py-1">
                <p className="text-sm text-zinc-400 italic leading-relaxed">
                  &ldquo;Great data platforms don&apos;t just move data — they enforce
                  trust, enable autonomy, and get out of the way of the business.&rdquo;
                </p>
              </blockquote>
            </motion.div>

            {/* Metrics grid */}
            <div className="grid grid-cols-2 gap-3">
              {METRICS.map(({ value, label, sub, icon: Icon, accent, iconBg }, i) => (
                <motion.div
                  key={label}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  className="group rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-900/80"
                >
                  <div className={`mb-3 inline-flex h-8 w-8 items-center justify-center rounded-lg border ${iconBg}`}>
                    <Icon className={`h-4 w-4 ${accent}`} />
                  </div>
                  <p className={`text-2xl font-bold ${accent}`}>{value}</p>
                  <p className="mt-0.5 text-sm font-medium text-zinc-300">{label}</p>
                  <p className="mt-0.5 text-xs text-zinc-600">{sub}</p>
                </motion.div>
              ))}
            </div>

            {/* CTA row */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex flex-wrap items-center gap-3 pt-2"
            >
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-lg bg-zinc-800 border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-200 transition-all hover:bg-zinc-700 hover:border-zinc-600 hover:text-zinc-100"
              >
                Full profile
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/articles"
                className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                Read articles
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
