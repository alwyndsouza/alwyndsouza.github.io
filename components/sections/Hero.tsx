"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Github, Linkedin, FileText, ChevronDown } from "lucide-react";

const SPECIALIZATIONS = [
  { label: "DataOps", description: "Pipeline automation & operational excellence" },
  { label: "dbt", description: "Data transformation at enterprise scale" },
  { label: "Databricks", description: "Lakehouse architecture & Unity Catalog" },
  { label: "AI Agents", description: "LLM-powered data automation via MCP" },
  { label: "Modern Data Platforms", description: "Cloud-native analytics architectures" },
];

const TECH_BADGES = [
  { label: "Databricks", color: "text-orange-300 border-orange-800/60 bg-orange-950/30" },
  { label: "dbt", color: "text-amber-300 border-amber-800/60 bg-amber-950/30" },
  { label: "Apache Spark", color: "text-orange-400 border-orange-700/50 bg-orange-950/20" },
  { label: "AWS", color: "text-yellow-300 border-yellow-800/60 bg-yellow-950/30" },
  { label: "Python", color: "text-blue-300 border-blue-800/60 bg-blue-950/30" },
  { label: "SQL", color: "text-indigo-300 border-indigo-800/60 bg-indigo-950/30" },
  { label: "AI Agents", color: "text-violet-300 border-violet-800/60 bg-violet-950/30" },
  { label: "DataOps", color: "text-emerald-300 border-emerald-800/60 bg-emerald-950/30" },
];

const PLATFORM_SERVICES = [
  { name: "Databricks", status: "Active", pct: 100, color: "bg-orange-400" },
  { name: "dbt Cloud", status: "Running", pct: 88, color: "bg-amber-400" },
  { name: "Redpanda", status: "Streaming", pct: 96, color: "bg-emerald-400" },
  { name: "AI Agent", status: "Online", pct: 100, color: "bg-violet-400" },
];

const TERMINAL_LINES = [
  { text: "$ dbt run --select +orders+ --target prod", color: "text-zinc-500", delay: 0.8 },
  { text: "  Running with dbt-core==1.8.0", color: "text-zinc-600", delay: 1.0 },
  { text: "✓ 24 models completed (2.3s)", color: "text-emerald-400", delay: 1.3 },
  { text: "$ dbt test --select orders", color: "text-zinc-500", delay: 1.6 },
  { text: "✓ 47 of 47 tests passed", color: "text-emerald-400", delay: 1.9 },
  { text: "⚠  Schema drift: stg_orders (col missing)", color: "text-amber-400", delay: 2.3 },
  { text: "⟳ AI Agent [dbt-mcp]: Applying patch...", color: "text-violet-400", delay: 2.7 },
  { text: "✔ Healed + re-deployed  ·  Lead time: 1.8h", color: "text-indigo-300", delay: 3.2 },
];

const SOCIAL = [
  { href: "https://github.com/alwyndsouza", label: "GitHub", icon: Github },
  { href: "https://linkedin.com/in/alwynanildsouza", label: "LinkedIn", icon: Linkedin },
  { href: "https://medium.com/@aradsouza", label: "Medium", icon: FileText },
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as const } },
};

export function Hero({ articleCount, projectCount }: { articleCount?: number; projectCount?: number }) {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      <HeroBackground />

      <div className="section-container relative z-10 pt-28 pb-20 w-full">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-12 xl:gap-20 items-center">
          {/* ── Left: Content ── */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            {/* Availability badge */}
            <motion.div variants={fadeUp} className="mb-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-indigo-800/60 bg-indigo-950/40 px-3 py-1.5 text-xs font-medium text-indigo-300">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
                Available for consulting & advisory
              </span>
            </motion.div>

            {/* Name */}
            <motion.h1
              variants={fadeUp}
              className="text-5xl font-bold tracking-tight sm:text-6xl xl:text-7xl leading-none"
            >
              <span className="text-zinc-100">Alwyn</span>
              <br />
              <span className="text-gradient">D&apos;Souza</span>
            </motion.h1>

            {/* Role */}
            <motion.p
              variants={fadeUp}
              className="mt-4 text-xl font-semibold text-zinc-400 sm:text-2xl"
            >
              Data &amp; AI Engineering Leader
            </motion.p>

            {/* Tagline */}
            <motion.p
              variants={fadeUp}
              className="mt-4 text-sm text-zinc-500 max-w-sm"
            >
              Building production-grade data systems that scale for enterprise teams.
            </motion.p>

            {/* Specializations */}
            <motion.ul variants={fadeUp} className="mt-8 space-y-2">
              {SPECIALIZATIONS.map(({ label, description }) => (
                <li key={label} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 text-indigo-500 font-mono select-none">—</span>
                  <span>
                    <span className="font-medium text-zinc-200">{label}</span>
                    <span className="ml-2 text-zinc-600">{description}</span>
                  </span>
                </li>
              ))}
            </motion.ul>

            {/* CTAs */}
            <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-indigo-500 border border-indigo-500/50 shadow-lg shadow-indigo-900/30"
              >
                Explore Projects
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/articles"
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-all hover:bg-zinc-800 hover:border-zinc-600 hover:text-zinc-100"
              >
                Read Articles
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 px-5 py-2.5 text-sm font-medium text-zinc-500 transition-all hover:bg-zinc-900 hover:border-zinc-700 hover:text-zinc-300"
              >
                Contact
              </Link>
            </motion.div>

            {/* Social + stats */}
            <motion.div variants={fadeUp} className="mt-8 flex items-center gap-6">
              {SOCIAL.map(({ href, label, icon: Icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-300 transition-colors"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{label}</span>
                </a>
              ))}
              <div className="ml-2 h-px flex-1 bg-zinc-800" />
              <span className="text-xs text-zinc-700 font-mono">
                {articleCount ? `${articleCount} articles` : "articles"} · {projectCount ? `${projectCount} projects` : "projects"}
              </span>
            </motion.div>

            {/* Tech badges */}
            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-2">
              {TECH_BADGES.map(({ label, color }) => (
                <span
                  key={label}
                  className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-mono font-medium ${color}`}
                >
                  {label}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Right: System panels ── */}
          <div className="hidden lg:flex flex-col gap-4">
            <PlatformStatusCard />
            <PipelineCard />
          </div>
        </div>
      </div>

      <ScrollIndicator />
    </section>
  );
}

function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Grid */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />
      {/* Radial vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, #09090b 100%)",
        }}
      />
      {/* Orb 1 — indigo, top-left */}
      <div className="hero-orb-1 absolute left-1/4 top-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/12 blur-3xl" />
      {/* Orb 2 — violet, center-right */}
      <div className="hero-orb-2 absolute right-1/4 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-3xl" />
      {/* Orb 3 — cyan, bottom */}
      <div className="hero-orb-3 absolute bottom-1/4 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-600/8 blur-3xl" />
    </div>
  );
}

function PlatformStatusCard() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" as const }}
      className="rounded-xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-sm shadow-2xl shadow-black/40 overflow-hidden"
    >
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
        <span className="text-xs font-medium text-zinc-400 font-mono">Platform Status</span>
        <span className="flex items-center gap-1.5 text-xs text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          All systems operational
        </span>
      </div>
      <div className="px-4 py-3 space-y-3">
        {PLATFORM_SERVICES.map(({ name, status, pct, color }, i) => (
          <motion.div
            key={name}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 + i * 0.1, duration: 0.4, ease: "easeOut" as const }}
            className="flex items-center gap-3"
          >
            <span className="w-24 text-xs text-zinc-400 font-mono shrink-0">{name}</span>
            <div className="flex-1 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ delay: 0.9 + i * 0.1, duration: 0.6, ease: "easeOut" as const }}
                className={`h-full rounded-full ${color} opacity-80`}
              />
            </div>
            <span className="w-20 text-right text-xs text-zinc-600 font-mono shrink-0">{status}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function PipelineCard() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.65, duration: 0.6, ease: "easeOut" as const }}
      className="rounded-xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-sm shadow-2xl shadow-black/40 overflow-hidden"
    >
      <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
        <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
        <div className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
        <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
        <span className="ml-2 text-xs text-zinc-600 font-mono">pipeline.yml</span>
      </div>
      <div className="p-4 font-mono text-xs leading-6 space-y-0.5">
        {TERMINAL_LINES.map(({ text, color, delay }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay, duration: 0.3 }}
            className={color}
          >
            {text}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5, duration: 0.5 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1"
    >
      <span className="text-xs text-zinc-700 font-mono tracking-widest uppercase">scroll</span>
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" as const }}
      >
        <ChevronDown className="h-4 w-4 text-zinc-700" />
      </motion.div>
    </motion.div>
  );
}
