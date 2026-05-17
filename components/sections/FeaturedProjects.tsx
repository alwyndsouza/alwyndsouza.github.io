"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Github, ExternalLink } from "lucide-react";
import type { Project } from "@/lib/types";
import { STATUS_CONFIG } from "@/lib/types";
import { TechTag } from "@/components/ui/TechTag";

interface FeaturedProjectsProps {
  projects: Project[];
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const card = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  return (
    <section className="section-padding border-t border-zinc-800/50">
      <div className="section-container">
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
              Featured Projects
            </h2>
            <p className="mt-3 max-w-xl text-zinc-500 text-base">
              Production-grade reference architectures and open-source tools
              for the modern data stack.
            </p>
          </div>
          <Link
            href="/projects"
            className="hidden sm:inline-flex shrink-0 items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            All projects <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </motion.div>

        {/* Project grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {projects.slice(0, 3).map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center sm:hidden"
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            View all projects <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const status = STATUS_CONFIG[project.status];
  const maxTech = 4;
  const visibleTech = project.tech.slice(0, maxTech);
  const remaining = project.tech.length - maxTech;

  return (
    <motion.div variants={card} className="h-full">
      <Link
        href={`/projects/${project.id}`}
        className="group flex h-full flex-col rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-900/80 hover:shadow-xl hover:shadow-black/20"
      >
        {/* Status + category */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
            <span className={`text-xs font-medium ${status.color}`}>
              {status.label}
            </span>
          </div>
          <span className="text-xs text-zinc-600 font-mono uppercase tracking-wider">
            {project.category.replace("-", " ")}
          </span>
        </div>

        {/* Title & desc */}
        <h3 className="mb-2 text-base font-semibold text-zinc-100 group-hover:text-white transition-colors leading-snug">
          {project.title}
        </h3>
        <p className="mb-6 flex-1 text-sm leading-relaxed text-zinc-400">
          {project.description}
        </p>

        {/* Tech stack */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {visibleTech.map((tech) => (
            <TechTag key={tech} label={tech} />
          ))}
          {remaining > 0 && (
            <span className="inline-flex items-center rounded px-1.5 py-0.5 text-xs font-mono text-zinc-600">
              +{remaining}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-zinc-800 pt-4">
          <span className="text-xs text-indigo-400 group-hover:text-indigo-300 transition-colors flex items-center gap-1">
            View details <ArrowRight className="h-3 w-3" />
          </span>
          <div className="flex items-center gap-2">
            {project.links?.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center justify-center h-7 w-7 rounded-md text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800 transition-all"
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
                className="flex items-center justify-center h-7 w-7 rounded-md text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800 transition-all"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
