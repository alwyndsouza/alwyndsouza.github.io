import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Github, ExternalLink } from "lucide-react";
import { getProjectById, getAllProjectIds, STATUS_CONFIG } from "@/lib/projects";
import { TechTag } from "@/components/ui/TechTag";
import { formatDate } from "@/lib/utils";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return getAllProjectIds().map((id) => ({ id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const project = getProjectById(id);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description,
  };
}

export default async function ProjectDetail({ params }: Props) {
  const { id } = await params;
  const project = getProjectById(id);
  if (!project) notFound();

  const status = STATUS_CONFIG[project.status];

  return (
    <div className="min-h-screen pt-24 pb-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        {/* Back nav */}
        <Link
          href="/projects"
          className="mb-10 inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          All projects
        </Link>

        {/* Project header */}
        <header className="mb-12">
          {/* Status + category */}
          <div className="mb-4 flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
              <span className={`text-xs font-medium ${status.color}`}>
                {status.label}
              </span>
            </div>
            <span className="text-xs font-mono text-zinc-600 uppercase tracking-wider">
              {project.category.replace(/-/g, " ")}
            </span>
            {project.completedDate && (
              <span className="text-xs text-zinc-600">
                Completed {formatDate(project.completedDate)}
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold text-zinc-100 sm:text-4xl leading-tight mb-4">
            {project.title}
          </h1>

          <p className="text-base text-zinc-400 leading-relaxed border-l-2 border-indigo-700 pl-4">
            {project.description}
          </p>

          {/* Cover image */}
          {project.coverImage && (
            <div className="mt-8 overflow-hidden rounded-xl border border-zinc-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.coverImage}
                alt={project.title}
                className="w-full object-cover max-h-80"
              />
            </div>
          )}

          {/* Tech stack */}
          <div className="mt-8 space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-600 mb-2">
                Tech Stack
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <TechTag key={t} label={t} className="text-xs px-2 py-1" />
                ))}
              </div>
            </div>

            {/* Links */}
            {(project.links?.github || project.links?.demo) && (
              <div className="flex gap-3 pt-2">
                {project.links.github && (
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 transition-all hover:bg-zinc-800 hover:border-zinc-600 hover:text-zinc-100"
                  >
                    <Github className="h-4 w-4" />
                    View on GitHub
                  </a>
                )}
                {project.links.demo && (
                  <a
                    href={project.links.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-indigo-500 border border-indigo-500/50"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Live Demo
                  </a>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Divider */}
        <div className="mb-12 border-t border-zinc-800" />

        {/* Project content */}
        <article
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: project.htmlContent }}
        />
      </div>
    </div>
  );
}
