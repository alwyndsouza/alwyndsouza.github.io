import { Link } from 'react-router';
import { useState, useEffect } from 'react';
import { ArrowRight, BookOpen, TrendingUp, Layers, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { articles } from '@/data/articles';
import { featuredProjects } from '@/data/projects';

<<<<<<< HEAD
const consoleLines = [
=======
const CARD_COLORS = ['#a855f7', '#3b82f6', '#06b6d4', '#8b5cf6'];
const BADGE_GRADIENT = 'linear-gradient(135deg, #a855f7, #3b82f6)';

const TOPIC_CARDS = [
  { icon: Layers,     label: 'Data Engineering', desc: 'dbt, Databricks, Spark',          color: '#a855f7' },
  { icon: BookOpen,   label: 'DataOps',           desc: 'CI/CD for data, observability',   color: '#3b82f6' },
  { icon: Bot,        label: 'AI in Data',         desc: 'Automation, LLM pipelines',       color: '#06b6d4' },
  { icon: TrendingUp, label: 'Data Governance',    desc: 'Data contracts, Quality',         color: '#8b5cf6' },
];

const CONSOLE_LINES = [
>>>>>>> 85288d1 (chore: fix card colors)
  '$ alwyn --role "DataOps Engineer"',
  '> Initialising data platform...',
  '> Loading dbt models         ✓',
  '> Connecting Databricks      ✓',
  '> Deploying AI pipelines     ✓',
  '> All systems operational    ✓',
];

function ConsolePrompt() {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
<<<<<<< HEAD
    if (currentLine >= consoleLines.length) return;
    if (currentChar < consoleLines[currentLine].length) {
=======
    if (currentLine >= CONSOLE_LINES.length) return;
    if (currentChar < CONSOLE_LINES[currentLine].length) {
>>>>>>> 85288d1 (chore: fix card colors)
      const t = setTimeout(() => setCurrentChar(c => c + 1), 35);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
<<<<<<< HEAD
        setVisibleLines(prev => [...prev, consoleLines[currentLine]]);
=======
        setVisibleLines(prev => [...prev, CONSOLE_LINES[currentLine]]);
>>>>>>> 85288d1 (chore: fix card colors)
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

<<<<<<< HEAD
  const typing = currentLine < consoleLines.length
    ? consoleLines[currentLine].slice(0, currentChar)
=======
  const typing = currentLine < CONSOLE_LINES.length
    ? CONSOLE_LINES[currentLine].slice(0, currentChar)
>>>>>>> 85288d1 (chore: fix card colors)
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
<<<<<<< HEAD
      {currentLine < consoleLines.length && (
        <div className={`leading-relaxed ${typing.startsWith('$') ? 'text-white' : 'text-green-400'}`}>
          {typing}<span className={`${showCursor ? 'opacity-100' : 'opacity-0'}`}>█</span>
=======
      {currentLine < CONSOLE_LINES.length && (
        <div className={`leading-relaxed ${typing.startsWith('$') ? 'text-white' : 'text-green-400'}`}>
          {typing}<span className={showCursor ? 'opacity-100' : 'opacity-0'}>█</span>
>>>>>>> 85288d1 (chore: fix card colors)
        </div>
      )}
    </div>
  );
}

<<<<<<< HEAD
/**
 * Renders the homepage with a hero, topics grid, latest articles, and featured projects.
 */
=======
>>>>>>> 85288d1 (chore: fix card colors)
export function Home() {
  const latestArticles = articles.slice(0, 2);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Hero */}
      <section className="py-16">
        <Badge variant="secondary" className="mb-4">Lead Data Engineer</Badge>
<<<<<<< HEAD
        <h1 className="text-5xl font-bold tracking-tight mb-4">
          Alwyn Dsouza
        </h1>
        <p className="text-xl text-muted-foreground mb-3">
          DataOps Engineer | DataOps | AI
        </p>
=======
        <h1 className="text-5xl font-bold tracking-tight mb-4">Alwyn Dsouza</h1>
        <p className="text-xl text-muted-foreground mb-3">DataOps Engineer | DataOps | AI</p>
>>>>>>> 85288d1 (chore: fix card colors)
        <p className="text-base text-muted-foreground mb-8">
          I build scalable data platforms and write about the tools, patterns, and ideas that make
          modern data engineering work — from dbt models and Databricks pipelines to DataOps and governance.
        </p>
        <div className="flex gap-3 flex-wrap">
          <Link to="/articles">
            <Button size="lg" className="gap-2">
              <BookOpen className="size-4" /> Read Articles
            </Button>
          </Link>
          <Link to="/projects">
            <Button size="lg" variant="outline" className="gap-2">
              View Projects <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>
        <ConsolePrompt />
      </section>

      {/* Topics */}
      <section className="py-10">
        <h2 className="text-2xl font-semibold mb-6">What I Write About</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
<<<<<<< HEAD
          {[
            { icon: Layers, label: 'Data Engineering', desc: 'dbt, Databricks, Spark', color: '#a855f7' },
            { icon: BookOpen, label: 'DataOps', desc: 'CI/CD for data, observability', color: '#3b82f6' },
            { icon: Bot, label: 'AI in Data', desc: 'Automation, LLM pipelines', color: '#06b6d4' },
            { icon: TrendingUp, label: 'Data Governance', desc: 'Data contracts, Quality', color: '#8b5cf6' },
          ].map(({ icon: Icon, label, desc, color }) => (
=======
          {TOPIC_CARDS.map(({ icon: Icon, label, desc, color }) => (
>>>>>>> 85288d1 (chore: fix card colors)
            <Card key={label} className="hover:shadow-md transition-shadow overflow-hidden">
              <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
              <CardContent className="pt-4">
                <Icon className="size-5 mb-3" style={{ color }} />
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
            {latestArticles.map((article, i) => (
              <Link key={article.slug} to={`/articles/${article.slug}`} className="block">
                <Card className="hover:shadow-md transition-shadow overflow-hidden">
                  <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${CARD_COLORS[i % 4]}, transparent)` }} />
                  <CardContent className="pt-4">
                    <div className="flex flex-wrap gap-2 mb-2">
<<<<<<< HEAD
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold text-white" style={{ background: 'linear-gradient(135deg, #a855f7, #3b82f6)' }}>
                        {article.category}
                      </span>
=======
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold text-white" style={{ background: BADGE_GRADIENT }}>{article.category}</span>
>>>>>>> 85288d1 (chore: fix card colors)
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
            {featuredProjects.map((project, i) => (
              <Link key={project.id} to={`/projects/${project.id}`}>
                <Card className="h-full hover:shadow-md transition-shadow overflow-hidden">
                  <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${CARD_COLORS[i % 4]}, transparent)` }} />
                  <CardContent className="pt-4">
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold text-white mb-3 inline-block" style={{ background: BADGE_GRADIENT }}>{project.category}</span>
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
