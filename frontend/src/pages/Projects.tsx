import { useState } from 'react';
import { Link } from 'react-router';
import { Github } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { projects } from '@/data/projects';

export function Projects() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const categories = Array.from(new Set(projects.map(p => p.category)));
  const filtered = selectedCategory === null ? projects : projects.filter(p => p.category === selectedCategory);

  const statusColor: Record<string, string> = {
    production: 'bg-green-100 text-green-800',
    development: 'bg-blue-100 text-blue-800',
    beta: 'bg-yellow-100 text-yellow-800',
    archived: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-3">Projects</h1>
        <p className="text-muted-foreground text-lg">Side projects and engineering experiments.</p>
      </div>

      {/* Category filter */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground mb-2">Categories</p>
        <div className="flex flex-wrap gap-2">
          <Badge variant={selectedCategory === null ? 'default' : 'outline'} className="cursor-pointer hover:bg-accent" onClick={() => setSelectedCategory(null)}>All</Badge>
          {categories.map(cat => (
            <Badge key={cat} variant={selectedCategory === cat ? 'default' : 'outline'} className="cursor-pointer hover:bg-accent capitalize" onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}>{cat}</Badge>
          ))}
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-6">Showing {filtered.length} of {projects.length} projects</p>

      {(() => {
        const cardColors = ['#a855f7', '#3b82f6', '#06b6d4', '#8b5cf6'];
        return (
          <div className="space-y-4">
            {filtered.map((project, i) => (
              <Link key={project.id} to={`/projects/${project.id}`}>
                <Card className="hover:shadow-md transition-shadow overflow-hidden">
                  <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${cardColors[i % 4]}, transparent)` }} />
                  <CardContent className="pt-4">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold text-white" style={{ background: 'linear-gradient(135deg, #a855f7, #3b82f6)' }}>{project.category}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[project.status] ?? 'bg-gray-100 text-gray-800'}`}>{project.status}</span>
                    </div>
                    <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{project.description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {project.tech.slice(0, 5).map(tech => (
                        <span key={tech} className="px-2 py-0.5 bg-accent text-xs rounded">{tech}</span>
                      ))}
                      {project.tech.length > 5 && <span className="text-xs text-muted-foreground px-1">+{project.tech.length - 5}</span>}
                    </div>
                    {project.links?.github && (
                      <a
                        href={project.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                        onClick={e => e.stopPropagation()}
                      >
                        <Github className="size-3.5" />
                        {project.links.github.replace('https://github.com/', '')}
                      </a>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        );
      })()}
    </div>
  );
}
