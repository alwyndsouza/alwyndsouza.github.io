import { Github, Linkedin, BookOpen, Database, Layers, Cpu, BarChart3, GitFork, PenLine, Users } from 'lucide-react';
import { Link } from 'react-router';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { articles } from '@/data/articles';
import { currentlyExploring } from '@/data/config';
import { useDocumentMeta } from '@/lib/useDocumentMeta';

const skills = [
  { category: 'Data Platforms', items: ['dbt', 'dbt Cloud', 'Databricks', 'Redshift', 'Google BigQuery', 'Delta Lake', 'Apache Iceberg'] },
  { category: 'Cloud & Infra', items: ['AWS', 'GCP', 'CDK', 'Glue', 'S3', 'Lambda', 'ECS', 'Docker', 'Terraform'] },
  { category: 'AI & Automation', items: ['LLM Agents', 'GitHub Copilot', 'Claude Code', 'Ollama', 'MCP Servers', 'RAG', 'MetricFlow'] },
  { category: 'Frameworks', items: ['Data Mesh', 'DataOps', 'dlt', 'Airflow', 'Spark', 'Great Expectations'] },
  { category: 'Languages', items: ['Python', 'SQL', 'Bash', 'YAML', 'Jinja', 'C', 'Groovy'] },
  { category: 'DevOps & CI/CD', items: ['GitHub Actions', 'Jenkins', 'BuildKite', 'Docker', 'Terraform'] },
];

export function About() {
  useDocumentMeta({
    title: 'About',
    description:
      'Alwyn Dsouza — Data Engineering & AI builder. Writing, open-source projects, community contributions.',
    path: '/about',
  });

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Hero */}
      <section className="py-16">
        <Badge variant="secondary" className="mb-4">About me</Badge>
        <h1 className="text-5xl font-bold tracking-tight mb-4">
          Alwyn <span className="text-primary">Dsouza</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-4">
          I write, build in the open, and share everything I learn about data engineering and AI.
        </p>
        <p className="text-base text-muted-foreground mb-8">
          Community contributor by choice. I believe the best way to learn is to teach — so everything I build, I document. Everything I figure out, I share. The data engineering community gave me a head start; this is how I pay it forward.
        </p>
        <div className="flex gap-3 flex-wrap">
          <a href="https://medium.com/@aradsouza" target="_blank" rel="noreferrer">
            <Button className="gap-2">
              <BookOpen size={14} /> Follow on Medium
            </Button>
          </a>
          <a href="https://www.linkedin.com/in/alwynanildsouza/" target="_blank" rel="noreferrer">
            <Button variant="outline" className="gap-2">
              <Linkedin size={14} /> Connect on LinkedIn
            </Button>
          </a>
          <a href="https://github.com/alwyndsouza" target="_blank" rel="noreferrer">
            <Button variant="outline" className="gap-2">
              <Github size={14} /> GitHub
            </Button>
          </a>
        </div>
      </section>

      {/* Bio Grid */}
      <section className="py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              icon: Database,
              title: 'Data Engineering',
              desc: 'Specialising in dbt, Databricks, and AWS data mesh architectures. Passionate about data contracts, shift-left governance, and building platforms that scale.',
              color: '#a855f7',
            },
            {
              icon: Cpu,
              title: 'AI-Augmented Work',
              desc: 'Building GitHub Copilot workflows, LLM agents, and MCP server integrations that actually ship — not demos, but tools teams use every day.',
              color: '#3b82f6',
            },
            {
              icon: Layers,
              title: 'Platform Thinking',
              desc: 'Centre of Excellence leadership, DataOps Manifesto-aligned change management, and team capability uplift across organisations.',
              color: '#06b6d4',
            },
            {
              icon: BarChart3,
              title: 'Community Contributor',
              desc: `${articles.length}+ articles published in Towards Data Engineering covering dbt, data mesh, AI agents, and modern data stack practices. Writing things I wish existed when I was learning.`,
              color: '#8b5cf6',
            },
          ].map(({ icon: Icon, title, desc, color }) => (
            <Card key={title} className="overflow-hidden">
              <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
              <CardContent className="pt-4">
                <Icon size={20} className="mb-3" style={{ color }} />
                <h3 className="font-semibold text-base mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Where to Find Me */}
      <section className="py-10">
        <h2 className="text-2xl font-semibold mb-2">Where to Find Me</h2>
        <p className="text-sm text-muted-foreground mb-6">Different channels for different depths of content.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: BookOpen,
              platform: 'Medium',
              handle: '@aradsouza',
              desc: 'Long-form deep dives on data engineering, dbt internals, AI agents, and modern data stack. Published in Towards Data Engineering.',
              href: 'https://medium.com/@aradsouza',
              cta: 'Read & Follow',
              color: '#a855f7',
            },
            {
              icon: Linkedin,
              platform: 'LinkedIn',
              handle: 'alwynanildsouza',
              desc: 'Quick takes, lessons learned, and community discussions on data engineering and AI. Best place to start a conversation.',
              href: 'https://www.linkedin.com/in/alwynanildsouza/',
              cta: 'Connect',
              color: '#3b82f6',
            },
            {
              icon: Github,
              platform: 'GitHub',
              handle: 'alwyndsouza',
              desc: 'All projects are open source. Code for every article I write lives here — fork it, break it, improve it.',
              href: 'https://github.com/alwyndsouza',
              cta: 'Explore repos',
              color: '#06b6d4',
            },
          ].map(({ icon: Icon, platform, handle, desc, href, cta, color }) => (
            <Card key={platform} className="overflow-hidden">
              <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
              <CardContent className="pt-4 flex flex-col h-full">
                <div className="flex items-center gap-2 mb-3">
                  <Icon size={18} style={{ color }} />
                  <span className="font-semibold text-sm">{platform}</span>
                  <span className="text-xs text-muted-foreground ml-auto">{handle}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{desc}</p>
                <a href={href} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="w-full gap-1">
                    {cta} <Github className="size-3 hidden" />
                  </Button>
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Give Back / Open Source */}
      <section className="py-10">
        <h2 className="text-2xl font-semibold mb-2">How I Give Back</h2>
        <p className="text-sm text-muted-foreground mb-6">
          The community taught me everything. Here's how I try to return the favour.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: PenLine,
              title: 'Writing',
              desc: `${articles.length} articles published — covering real production problems, not toy examples. Every piece is something I had to figure out the hard way.`,
              color: '#a855f7',
              action: { label: 'Read articles', to: '/articles', internal: true },
            },
            {
              icon: GitFork,
              title: 'Open Source',
              desc: 'All side projects are public and forkable. The goal is to give you a working starting point, not just inspiration.',
              color: '#3b82f6',
              action: { label: 'Browse projects', to: '/projects', internal: true },
            },
            {
              icon: Users,
              title: 'Community',
              desc: 'Active in the dbt Slack, LinkedIn data engineering circles, and Towards Data Engineering. Always happy to discuss, review, or collaborate.',
              color: '#06b6d4',
              action: { label: 'Connect on LinkedIn', to: 'https://www.linkedin.com/in/alwynanildsouza/', internal: false },
            },
          ].map(({ icon: Icon, title, desc, color, action }) => (
            <Card key={title} className="overflow-hidden">
              <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
              <CardContent className="pt-4 flex flex-col">
                <Icon size={20} className="mb-3" style={{ color }} />
                <h3 className="font-semibold text-base mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{desc}</p>
                {action.internal ? (
                  <Link to={action.to}>
                    <Button variant="outline" size="sm" className="w-full">{action.label}</Button>
                  </Link>
                ) : (
                  <a href={action.to} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="w-full">{action.label}</Button>
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="py-10">
        <h2 className="text-2xl font-semibold mb-6">Skills & Tech Stack</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {skills.map(({ category, items }, i) => {
            const cardColors = ['#a855f7', '#3b82f6', '#06b6d4', '#8b5cf6'];
            const color = cardColors[i % 4];
            return (
              <Card key={category} className="overflow-hidden">
                <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
                <CardContent className="pt-4">
                  <h4 className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color }}>
                    {category}
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {items.map(item => (
                      <Badge key={item} variant="outline" className="text-[10px]">{item}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Currently Exploring */}
        <Card className="overflow-hidden">
          <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #f59e0b, transparent)' }} />
          <CardContent className="pt-4">
            <h4 className="text-xs font-mono uppercase tracking-wider mb-3 text-amber-500">
              Currently Exploring
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {currentlyExploring.map(item => (
                <Badge key={item} className="text-[10px] bg-amber-500/10 text-amber-600 border-amber-300 hover:bg-amber-500/20">{item}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

    </div>
  );
}
