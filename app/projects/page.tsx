import type { Metadata } from "next";
import { getAllProjects } from "@/lib/projects";
import { ProjectsClient } from "./ProjectsClient";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Open-source data engineering projects: real-time fraud detection, dbt CI/CD pipelines, AI agents, semantic layers, and more.",
};

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="section-container">
        {/* Page header */}
        <div className="mb-12 border-b border-zinc-800 pb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-3">
            Work
          </p>
          <h1 className="text-4xl font-bold text-zinc-100 sm:text-5xl mb-4">
            Projects
          </h1>
          <p className="max-w-2xl text-zinc-500 text-base leading-relaxed">
            Production-grade reference architectures and open-source tools
            for the modern data & AI stack. {projects.length} projects.
          </p>
        </div>

        <ProjectsClient projects={projects} />
      </div>
    </div>
  );
}
