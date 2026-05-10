import { Link } from 'react-router';
import { useState, useEffect } from 'react';
import { ArrowRight, BookOpen, TrendingUp, Layers, Bot, FileText, Github, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { articles } from '@/data/articles';
import { featuredProjects } from '@/data/projects';
import { site } from '@/data/config';
import { useDocumentMeta } from '@/lib/useDocumentMeta';


const consoleLines = [
  '❯ alwyn.deploy --stack "DataOps-MLOps" --env "Prod"',
  '⠿ [Terraform] Provisioning AWS & Databricks clusters... [OK]',
  '⠿ [ECS/Docker] Orchestrating containers... [OK]',
  '⠿ [dlthub] Ingesting raw streams ➔ Delta Lake... [OK]',
  '-----------------------------------------------------------------',
  '✖ [dbt] CRITICAL: Schema drift in "stg_orders" (col missing)',
  '✦ [AI-Agent] Patching model via dbt-mcp-server... FIXED ✔',
  '-----------------------------------------------------------------',
  '⠿ [dbt] Building 400+ models... [█████████] 100%',
  '⠿ [LLM/AI] Vector indexing & context-warmup... [OK]',
  '✔ SUCCESS: All Pipelines ACTIVE & Self-Healed.',
  'Health: 100% | Lead Time: <2h | MTTR: 12min | CI/CD: Green',
];

function ConsolePrompt() {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (currentLine >= consoleLines.length) return;
    if (currentChar < consoleLines[currentLine].length) {
      const t = setTimeout(() => setCurrentChar(c => c + 1), 35);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setVisibleLines(prev => [...prev, consoleLines[currentLine]]);
        setCurrentLine(l => l + 1);
        setCurrentChar(0);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [currentLine, currentChar]);

  useEffect(() => {
    const t = setInterval(() => setShowCursor(c => !c), 500);
    return () => clearInterval(t);
  }, []);

  const typing = currentLine < consoleLines.length
    ? consoleLines[currentLine].slice(0, currentChar)
    : '';

  return (
    <div className="bg-[#0d1117] rounded-lg p-4 font-mono text-sm text-green-400 w-full mt-8 shadow-lg border border-[#30363d]">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-3 h-3 rounded-full bg-red-500" />
        <span className="w-3 h-3 rounded-full bg-yellow-400" />
        <span className="w-3 h-3 rounded-full bg-green-500" />
        <span className="text-xs text-gray-500 ml-2">alwyn@dev ~ zsh</span>
      </div>
      {visibleLines.map((line, i) => (
        <div key={i} className={`leading-relaxed ${line.startsWith('$') ? 'text-white' : 'text-green-400'}`}>
          {line}
        </div>
      ))}
      {currentLine < consoleLines.length && (
        <div className={`leading-relaxed ${typing.startsWith('$') ? 'text-white' : 'text-green-400'}`}>
          {typing}<span className={`${showCursor ? 'opacity-100' : 'opacity-0'}`}>█</span>
        </div>
      )}
    </div>
  );
}

export function Home() {
  const latestArticles = articles.slice(0, 3);

  useDocumentMeta({ title: site.title, full: true, path: '/' });

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Hero */}
      <section className="py-16">
        <h1 className="text-5xl font-bold tracking-tight mb-4">
          Alwyn Dsouza
        </h1>
        <p className="text-base text-muted-foreground mb-6">
          Builder at heart — I love to learn, collaborate, and share. By day I build data platforms with dbt, Databricks, and AWS. By night I'm usually tinkering with AI agents, reading about macro economics, or mapping out business cycles and market trends.
        </p>

        {/* Community callout */}
        <div className="border-l-4 border-primary pl-4 mb-6 bg-accent/30 py-3 pr-4 rounded-r-lg">
          <p className="text-base text-foreground font-medium mb-1">
            Everything I know came from the community.
          </p>
          <p className="text-sm text-muted-foreground">
            Open-source projects, blog posts, people who shared without asking for anything in return. Giving back isn't optional — it's a responsibility. Don't just consume, contribute. If you find my work useful, share it with someone who might benefit.
          </p>
        </div>

        <blockquote className="border-l-4 border-muted pl-4 mb-8 italic text-muted-foreground text-sm">
          "If you want to go fast, go alone. But if you want to go further, go together."
          <span className="block mt-1 not-italic font-medium text-xs">— African Proverb</span>
        </blockquote>

        <div className="flex gap-3 flex-wrap mb-8">
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
          <a href="https://medium.com/@aradsouza" target="_blank" rel="noopener noreferrer">
            <Button size="lg" variant="outline" className="gap-2">
              Follow on Medium
              <ArrowRight className="size-4" />
            </Button>
          </a>
        </div>

        {/* Community stats */}
        <div className="flex flex-wrap gap-6 py-4 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="size-4 text-primary" />
            <span><strong className="text-foreground">{articles.length}</strong> articles published</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BookOpen className="size-4 text-primary" />
            <span>Published in <strong className="text-foreground">Towards Data Engineering</strong></span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Github className="size-4 text-primary" />
            <a href="https://github.com/alwyndsouza" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              Open source on <strong className="text-foreground">GitHub</strong>
            </a>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Linkedin className="size-4 text-primary" />
            <a href="https://www.linkedin.com/in/alwynanildsouza/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              Connect on <strong className="text-foreground">LinkedIn</strong>
            </a>
          </div>
        </div>

        <ConsolePrompt />
      </section>

      {/* Topics */}
      <section className="py-10">
        <h2 className="text-2xl font-semibold mb-2">Topics I Write About</h2>
        <p className="text-sm text-muted-foreground mb-6">Practical writing for the data engineering community — no fluff, just things that work in production.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Layers, label: 'Data Engineering', desc: 'dbt, Databricks, Spark', color: '#a855f7', category: 'data-engineering' },
            { icon: BookOpen, label: 'DataOps', desc: 'CI/CD for data, observability', color: '#3b82f6', category: 'dataops' },
            { icon: Bot, label: 'AI in Data', desc: 'Automation, LLM pipelines', color: '#06b6d4', category: 'ai' },
            { icon: TrendingUp, label: 'Data Governance', desc: 'Data contracts, Quality', color: '#8b5cf6', category: 'data-governance' },
          ].map(({ icon: Icon, label, desc, color }) => (
            <Link key={label} to="/articles">
              <Card className="hover:shadow-md transition-shadow overflow-hidden cursor-pointer h-full">
                <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
                <CardContent className="pt-4">
                  <Icon className="size-5 mb-3" style={{ color }} />
                  <p className="font-medium text-sm mb-1">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </CardContent>
              </Card>
            </Link>
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
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold text-white" style={{ background: 'linear-gradient(135deg, #a855f7, #3b82f6)' }}>
                        {article.category}
                      </span>
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
