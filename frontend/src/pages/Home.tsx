import { Link } from 'react-router';
import { ArrowRight, BookOpen, TrendingUp, Layers, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { articles } from '@/data/articles';
import { featuredProjects } from '@/data/projects';
import { tradingPosts } from '@/data/trading';

export function Home() {
  const latestArticles = articles.slice(0, 2);
  const latestTrading = tradingPosts.slice(0, 1);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Hero */}
      <section className="py-16">
        <Badge variant="secondary" className="mb-4">Lead Data Engineer</Badge>
        <h1 className="text-5xl font-bold tracking-tight mb-4">
          Alwyn Dsouza
        </h1>
        <p className="text-xl text-muted-foreground mb-3">
          Lead Data Engineer | DataOps | AI | Markets
        </p>
        <p className="text-base text-muted-foreground mb-8">
          I build scalable data platforms and write about the tools, patterns, and ideas that make
          modern data engineering work — from dbt models and Databricks pipelines to DataOps
          and governance.
        </p>
        <div className="flex gap-3 flex-wrap">
          <Link to="/articles">
            <Button size="lg" className="gap-2">
              <BookOpen className="size-4" />
              Read Articles
            </Button>
          </Link>
          <Link to="/projects">
            <Button size="lg" variant="outline" className="gap-2">
              View Projects
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Topics */}
      <section className="py-10">
        <h2 className="text-2xl font-semibold mb-6">What I Write About</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Layers, label: 'Data Engineering', desc: 'dbt, Databricks, Spark' },
            { icon: BookOpen, label: 'DataOps', desc: 'CI/CD for data, observability' },
            { icon: Bot, label: 'AI in Data', desc: 'Automation, LLM pipelines' },
            { icon: TrendingUp, label: 'Data Governance', desc: 'Data contracts, Quality' },
          ].map(({ icon: Icon, label, desc }) => (
            <Card key={label} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-5">
                <Icon className="size-5 mb-3 text-muted-foreground" />
                <p className="font-medium text-sm mb-1">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Latest Articles */}
      {latestArticles.length > 0 && (
        <section className="py-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Latest Articles</h2>
            <Link to="/articles">
              <Button variant="ghost" className="gap-1 text-sm">View all <ArrowRight className="size-3" /></Button>
            </Link>
          </div>
          <div className="space-y-4">
            {latestArticles.map(article => (
              <Link key={article.slug} to={`/articles/${article.slug}`} className="block">
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-5">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge variant="secondary">{article.category}</Badge>
                    </div>
                    <h3 className="font-semibold mb-1">{article.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{article.excerpt}</p>
                    <p className="text-xs text-muted-foreground mt-2">{new Date(article.date).toLocaleDateString('en-AU', { year: 'numeric', month: 'long' })} · {article.readTime}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="py-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Featured Projects</h2>
            <Link to="/projects">
              <Button variant="ghost" className="gap-1 text-sm">View all <ArrowRight className="size-3" /></Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuredProjects.map(project => (
              <Link key={project.id} to={`/projects/${project.id}`}>
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="pt-5">
                    <Badge variant="secondary" className="mb-3">{project.category}</Badge>
                    <h3 className="font-semibold mb-2">{project.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{project.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {project.tech.slice(0, 4).map(tech => (
                        <span key={tech} className="px-2 py-0.5 bg-accent text-xs rounded">{tech}</span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
