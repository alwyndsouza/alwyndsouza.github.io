import { useParams, Link, Navigate } from 'react-router';
import { ArrowLeft, Github, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getProjectById } from '@/data/projects';
import 'highlight.js/styles/github-dark.css';

/**
 * Render a project detail page for the route `id`, showing the project's metadata, technologies, external links, cover image, and HTML content.
 *
 * @returns The component's React element for the project detail page; if the project cannot be found, a navigation element that redirects to `/projects`.
 */
export function ProjectDetail() {
  const { id } = useParams();
  const project = getProjectById(id ?? '');

  if (!project) {
    return <Navigate to="/projects" replace />;
  }

  const statusColor: Record<string, string> = {
    production: 'bg-green-100 text-green-800',
    development: 'bg-blue-100 text-blue-800',
    beta: 'bg-yellow-100 text-yellow-800',
    archived: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
        <Link to="/projects" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors text-sm">
          <ArrowLeft className="size-4" />
          Back to Projects
        </Link>

        <article>
          <header className="mb-10">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary">{project.category}</Badge>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${statusColor[project.status] ?? ''}`}>{project.status}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{project.title}</h1>
            <p className="text-xl text-muted-foreground mb-6">{project.description}</p>
            <div className="flex flex-wrap gap-1 mb-6">
              {project.tech.map(tech => <span key={tech} className="px-2 py-0.5 bg-accent text-xs rounded">{tech}</span>)}
            </div>
            {/* Links */}
            {project.links && (
              <div className="flex gap-3">
                {project.links.github && (
                  <a href={project.links.github} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="gap-2"><Github className="size-4" />GitHub</Button>
                  </a>
                )}
                {project.links.demo && (
                  <a href={project.links.demo} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="gap-2"><ExternalLink className="size-4" />Demo</Button>
                  </a>
                )}
              </div>
            )}
          </header>

          {project.coverImage && (
            <div className="mb-8">
              <img src={project.coverImage} alt={project.title} className="w-full rounded-lg object-cover max-h-96" />
            </div>
          )}

          <div className="prose prose-lg max-w-none dark:prose-invert">
            <div className="text-foreground" dangerouslySetInnerHTML={{ __html: project.htmlContent }} />
          </div>
        </article>
    </div>
  );
}
