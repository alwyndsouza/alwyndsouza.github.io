"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Github, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "@/lib/types";
import { STATUS_CONFIG } from "@/lib/types";
import { TechTag } from "@/components/ui/TechTag";

interface ProjectsClientProps {
  projects: Project[];
}

const STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "production", label: "Production" },
  { value: "development", label: "Development" },
  { value: "beta", label: "Beta" },
  { value: "archived", label: "Archived" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const card = {
  hidden: { opacity: 0, scale: 0.97, y: 12 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

export function ProjectsClient({ projects }: ProjectsClientProps) {
  const [activeStatus, setActiveStatus] = useState("all");

  const filtered = useMemo(
    () =>
      projects.filter(
        (p) => activeStatus === "all" || p.status === activeStatus
      ),
    [projects, activeStatus]
  );

  const counts = useMemo(() => {
    const all = { all: projects.length } as Record<string, number>;
    STATUS_FILTERS.slice(1).forEach(({ value }) => {
      all[value] = projects.filter((p) => p.status === value).length;
    });
    return all;
  }, [projects]);

  return (
    <div>
      {/* Status filters */}
      <div className="mb-10 flex flex-wrap gap-2">
        {STATUS_FILTERS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setActiveStatus(value)}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150 ${
              activeStatus === value
                ? "bg-indigo-600 text-white border border-indigo-500/50"
                : "border border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200 hover:bg-zinc-800/50"
            }`}
          >
            {label}
            {(counts[value] ?? 0) > 0 && (
              <span
                className={`rounded px-1 py-0.5 text-xs font-mono ${
                  activeStatus === value
                    ? "bg-indigo-700 text-indigo-200"
                    : "bg-zinc-800 text-zinc-600"
                }`}
              >
                {counts[value]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Projects grid */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={activeStatus}
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((project) => (
            <motion.div key={project.id} variants={card}>
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {filtered.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-zinc-500">No projects match this filter.</p>
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const status = STATUS_CONFIG[project.status];
  const maxTech = 4;
  const visible = project.tech.slice(0, maxTech);
  const extra = project.tech.length - maxTech;

  return (
    <Link
      href={`/projects/${project.id}`}
      className="group flex h-full flex-col rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-900/80 hover:shadow-xl hover:shadow-black/20"
    >
      {/* Status */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
          <span className={`text-xs font-medium ${status.color}`}>
            {status.label}
          </span>
        </div>
        <span className="text-xs font-mono text-zinc-600 uppercase tracking-wider">
          {project.category.replace(/-/g, " ")}
        </span>
      </div>

      {/* Content */}
      <h3 className="mb-2 text-sm font-semibold text-zinc-100 group-hover:text-white transition-colors leading-snug">
        {project.title}
      </h3>
      <p className="mb-6 flex-1 text-xs leading-relaxed text-zinc-400">
        {project.description}
      </p>

      {/* Tech */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {visible.map((t) => (
          <TechTag key={t} label={t} />
        ))}
        {extra > 0 && (
          <span className="rounded px-1.5 py-0.5 text-xs font-mono text-zinc-600">
            +{extra}
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-zinc-800 pt-4">
        <span className="flex items-center gap-1 text-xs text-indigo-400 group-hover:text-indigo-300 transition-colors">
          View details <ArrowRight className="h-3 w-3" />
        </span>
        <div className="flex items-center gap-1">
          {project.links?.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-600 hover:bg-zinc-800 hover:text-zinc-300 transition-all"
            >
              <Github className="h-3.5 w-3.5" />
            </a>
          )}
          {project.links?.demo && (
            <a
              href={project.links.demo}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-600 hover:bg-zinc-800 hover:text-zinc-300 transition-all"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>
    </Link>
  );
}
