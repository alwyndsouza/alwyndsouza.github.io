import { useState } from 'react';
import { Link } from 'react-router';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { projects } from '@/data/projects';

/**
 * Render a responsive projects overview with a category filter, status badges, and tech stack indicators.
 *
 * Displays a row of selectable category Badges (including "all"); selecting a category filters the shown projects.
 * Each project is rendered as a card linking to `/projects/{id}`, showing its category, a colored status badge (with a default gray style for unknown statuses), title, truncated description, and up to five technology pills with an overflow count.
 *
 * @returns The component's rendered JSX element.
 */
export function Projects() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const categories = ['all', ...Array.from(new Set(projects.map(p => p.category)))];
  const filtered = selectedCategory === 'all' ? projects : projects.filter(p => p.category === selectedCategory);

  const statusColor: Record<string, string> = {
    production: 'bg-green-100 text-green-800',
    development: 'bg-blue-100 text-blue-800',
    beta: 'bg-yellow-100 text-yellow-800',
    archived: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-3">Projects</h1>
          <p className="text-muted-foreground text-lg">Side projects and engineering experiments.</p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(cat => (
            <Badge key={cat} variant={selectedCategory === cat ? 'default' : 'outline'} className="cursor-pointer hover:bg-accent capitalize" onClick={() => setSelectedCategory(cat)}>{cat}</Badge>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map(project => (
            <Link key={project.id} to={`/projects/${project.id}`}>
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardContent className="pt-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary">{project.category}</Badge>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[project.status] ?? 'bg-gray-100 text-gray-800'}`}>{project.status}</span>
                  </div>
                  <h2 className="text-lg font-semibold mb-2">{project.title}</h2>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{project.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {project.tech.slice(0, 5).map(tech => (
                      <span key={tech} className="px-2 py-0.5 bg-accent text-xs rounded">{tech}</span>
                    ))}
                    {project.tech.length > 5 && <span className="text-xs text-muted-foreground px-1">+{project.tech.length - 5}</span>}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
    </div>
  );
}
