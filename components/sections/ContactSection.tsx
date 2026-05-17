"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, ArrowUpRight } from "lucide-react";

const CHANNELS = [
  {
    id: "github",
    label: "GitHub",
    handle: "@alwyndsouza",
    description: "Open-source reference architectures",
    href: "https://github.com/alwyndsouza",
    icon: Github,
    accent: {
      border: "hover:border-zinc-600",
      bg: "hover:bg-zinc-800/60",
      iconBg: "bg-zinc-800 border-zinc-700",
      iconColor: "text-zinc-300",
      handleColor: "text-zinc-400 group-hover:text-zinc-200",
      arrow: "group-hover:text-zinc-400",
    },
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    handle: "alwyndsouza",
    description: "Professional network & announcements",
    href: "https://linkedin.com/in/alwynanildsouza",
    icon: Linkedin,
    accent: {
      border: "hover:border-blue-700/60",
      bg: "hover:bg-blue-950/30",
      iconBg: "bg-blue-950/60 border-blue-800/50",
      iconColor: "text-blue-400",
      handleColor: "text-blue-500 group-hover:text-blue-300",
      arrow: "group-hover:text-blue-500",
    },
  },
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export function ContactSection() {
  return (
    <section className="relative overflow-hidden border-t border-zinc-800/50">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(99,102,241,0.08) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
      </div>

      <div className="section-container relative z-10 py-24 sm:py-32">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="flex flex-col items-center text-center"
        >
          {/* Eyebrow */}
          <motion.p
            variants={fadeUp}
            className="mb-6 text-xs font-semibold uppercase tracking-widest text-indigo-400"
          >
            Get in Touch
          </motion.p>

          {/* Headline */}
          <motion.h2
            variants={fadeUp}
            className="max-w-2xl text-4xl font-bold tracking-tight text-zinc-100 sm:text-5xl lg:text-6xl leading-[1.1]"
          >
            Interested in{" "}
            <span className="text-gradient">Data Platforms</span>
            {", "}
            <span className="text-gradient">AI Engineering</span>
            {", or "}
            <span className="text-gradient">Enterprise Architecture</span>
            {"?"}
          </motion.h2>

          {/* Sub-headline */}
          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-lg text-lg text-zinc-500 leading-relaxed"
          >
            Let&apos;s connect. I&apos;m open to consulting engagements,
            advisory roles, and technical collaboration.
          </motion.p>

          {/* Availability badge */}
          <motion.div variants={fadeUp} className="mt-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-800/60 bg-indigo-950/40 px-4 py-1.5 text-sm font-medium text-indigo-300">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
              Available for consulting &amp; advisory engagements
            </span>
          </motion.div>

          {/* Channel cards */}
          <motion.div
            variants={stagger}
            className="mt-14 grid w-full max-w-xl grid-cols-1 gap-3 sm:grid-cols-2"
          >
            {CHANNELS.map(({ id, label, handle, description, href, icon: Icon, accent }) => (
              <motion.a
                key={id}
                variants={fadeUp}
                href={href}
                target={href.startsWith("mailto") ? undefined : "_blank"}
                rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                className={`group relative flex flex-col items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 px-5 py-6 text-center transition-all duration-200 ${accent.border} ${accent.bg} hover:shadow-lg hover:-translate-y-0.5`}
              >
                {/* Icon */}
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-colors ${accent.iconBg}`}>
                  <Icon className={`h-5 w-5 ${accent.iconColor}`} />
                </div>

                {/* Label */}
                <div>
                  <p className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors">
                    {label}
                  </p>
                  <p className={`mt-0.5 text-xs font-mono transition-colors ${accent.handleColor}`}>
                    {handle}
                  </p>
                </div>

                {/* Description */}
                <p className="text-xs text-zinc-600 leading-relaxed">{description}</p>

                {/* Arrow */}
                <ArrowUpRight
                  className={`absolute right-3 top-3 h-3.5 w-3.5 text-zinc-800 transition-colors ${accent.arrow}`}
                />
              </motion.a>
            ))}
          </motion.div>

          {/* Divider + closing note */}
          <motion.div
            variants={fadeUp}
            className="mt-14 flex flex-col items-center gap-3"
          >
            <div className="flex items-center gap-4 text-xs text-zinc-700">
              <span className="h-px w-16 bg-zinc-800" />
              <span className="font-mono">or find me writing on</span>
              <span className="h-px w-16 bg-zinc-800" />
            </div>
            <a
              href="https://medium.com/@aradsouza"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-300 transition-colors"
            >
              Medium <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
