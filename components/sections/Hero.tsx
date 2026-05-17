"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Github, Linkedin, FileText } from "lucide-react";

const STATS = [
  { value: "66+", label: "Published Articles" },
  { value: "9", label: "Open Source Projects" },
  { value: "10+", label: "Years Engineering" },
];

const SOCIAL = [
  {
    href: "https://github.com/alwyndsouza",
    label: "GitHub",
    icon: Github,
  },
  {
    href: "https://linkedin.com/in/alwyndsouza",
    label: "LinkedIn",
    icon: Linkedin,
  },
  {
    href: "https://medium.com/@aradsouza",
    label: "Medium",
    icon: FileText,
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 50%, rgba(99,102,241,0.06) 0%, transparent 65%), linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "100% 100%, 72px 72px, 72px 72px",
        }}
      />

      {/* Glow orb */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/10 blur-3xl" />

      <div className="section-container relative z-10 pt-32 pb-20">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-3xl"
        >
          {/* Available badge */}
          <motion.div variants={item} className="mb-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-800/60 bg-indigo-950/40 px-3 py-1 text-xs font-medium text-indigo-300">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
              Available for consulting & advisory engagements
            </span>
          </motion.div>

          {/* Name */}
          <motion.h1
            variants={item}
            className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
          >
            <span className="text-zinc-100">Alwyn </span>
            <span className="text-gradient">D&apos;Souza</span>
          </motion.h1>

          {/* Title */}
          <motion.p
            variants={item}
            className="mt-4 text-xl font-semibold text-zinc-400 sm:text-2xl"
          >
            Data & AI Engineering Leader
          </motion.p>

          {/* Description */}
          <motion.p
            variants={item}
            className="mt-6 max-w-2xl text-base leading-relaxed text-zinc-500 sm:text-lg"
          >
            Specializing in{" "}
            <span className="text-zinc-300 font-medium">DataOps</span>,{" "}
            <span className="text-zinc-300 font-medium">dbt</span>,{" "}
            <span className="text-zinc-300 font-medium">Databricks</span>,{" "}
            <span className="text-zinc-300 font-medium">AI Agents</span>, and{" "}
            <span className="text-zinc-300 font-medium">Modern Data Platforms</span>.
            Building production-grade systems that scale for enterprise teams.
          </motion.p>

          {/* Stats */}
          <motion.div
            variants={item}
            className="mt-10 flex flex-wrap gap-6"
          >
            {STATS.map(({ value, label }) => (
              <div key={label} className="flex flex-col">
                <span className="text-2xl font-bold text-zinc-100">{value}</span>
                <span className="text-xs text-zinc-500 mt-0.5">{label}</span>
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div variants={item} className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-indigo-500 border border-indigo-500/50 shadow-lg shadow-indigo-900/30"
            >
              View Projects
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-all hover:bg-zinc-800 hover:border-zinc-600 hover:text-zinc-100"
            >
              Read Articles
            </Link>
          </motion.div>

          {/* Social links */}
          <motion.div variants={item} className="mt-8 flex items-center gap-4">
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
          </motion.div>
        </motion.div>

        {/* Floating terminal card */}
        <motion.div
          initial={{ opacity: 0, x: 40, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7, ease: "easeOut" as const }}
          className="absolute right-8 top-1/2 hidden -translate-y-1/2 lg:block xl:right-0"
        >
          <div className="w-72 rounded-xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm shadow-2xl shadow-black/40">
            {/* Terminal header */}
            <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
              <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
              <div className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
              <span className="ml-2 text-xs text-zinc-600 font-mono">pipeline.yml</span>
            </div>
            {/* Terminal body */}
            <div className="p-4 font-mono text-xs leading-6">
              <TerminalLine delay={0.8} color="text-zinc-600">$ dbt run --select +orders+</TerminalLine>
              <TerminalLine delay={1.0} color="text-emerald-400">✓ 12 models completed (2.3s)</TerminalLine>
              <TerminalLine delay={1.2} color="text-zinc-600">$ dbt test --select orders</TerminalLine>
              <TerminalLine delay={1.4} color="text-emerald-400">✓ 8 tests passed</TerminalLine>
              <TerminalLine delay={1.6} color="text-zinc-600">$ dbt docs generate</TerminalLine>
              <TerminalLine delay={1.8} color="text-blue-400">→ Catalog updated: 847 nodes</TerminalLine>
              <TerminalLine delay={2.0} color="text-indigo-400">✓ Deploy complete</TerminalLine>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function TerminalLine({
  children,
  delay,
  color,
}: {
  children: React.ReactNode;
  delay: number;
  color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.3 }}
      className={color}
    >
      {children}
    </motion.div>
  );
}
