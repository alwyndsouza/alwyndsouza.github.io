import { Github, Linkedin, BookOpen, Database, Layers, Cpu, BarChart3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const skills = [
  { category: 'Data Platforms', items: ['dbt', 'Databricks', 'Redshift', 'Google BigQuery', 'Delta Lake'] },
  { category: 'Cloud & Infra', items: ['AWS', 'GCP', 'CDK', 'Glue', 'S3', 'Lambda', 'ECS', 'Docker', 'Terraform'] },
  { category: 'AI & Automation', items: ['LLM Agents', 'GitHub Copilot', 'Claude Code', 'Ollama', 'MCP Servers', 'RAG', 'MetricFlow'] },
  { category: 'Frameworks', items: ['Data Mesh', 'DataOps', 'dlt', 'Airflow', 'Spark'] },
  { category: 'Languages', items: ['Python', 'SQL', 'C', 'Groovy'] },
  { category: 'DevOps & CI/CD', items: ['Jenkins', 'BuildKite', 'Docker', 'Terraform'] },
  { category: 'Legacy & Enterprise', items: ['Oracle Apex', 'Oracle Database', 'PL/SQL', 'Proc*C'] },
];


/**
 * Render the "About" page with a hero section, feature bio cards, skills grid, and career timeline.
 *
 * @returns A JSX element representing the complete About page layout containing the hero, bio grid, skills & tech stack cards, and career timeline.
 */
export function About() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Hero */}
      <section className="py-16">
        <Badge variant="secondary" className="mb-4">About me</Badge>
        <h1 className="text-5xl font-bold tracking-tight mb-4">
          Alwyn <span className="text-primary">Dsouza</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          DataOps Engineer building intelligent data platforms, AI-augmented workflows,
          and thought leadership in the modern data stack space.
        </p>
        <div className="flex gap-3 flex-wrap">
          <a href="https://medium.com/@aradsouza" target="_blank" rel="noreferrer">
            <Button className="gap-2">
              <BookOpen size={14} /> Medium
            </Button>
          </a>
          <a href="https://www.linkedin.com/in/alwynanildsouza/" target="_blank" rel="noreferrer">
            <Button variant="outline" className="gap-2">
              <Linkedin size={14} /> LinkedIn
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
            { icon: Database, title: 'Data Engineering', desc: 'Specialising in dbt, Databricks, and AWS data mesh architectures. Passionate about data contracts and shift-left governance.', color: '#a855f7' },
            { icon: Cpu, title: 'AI-Augmented Work', desc: 'Building GitHub Copilot workflows, LLM agents, and MCP server integrations to accelerate engineering teams.', color: '#3b82f6' },
            { icon: Layers, title: 'Platform Thinking', desc: 'Centre of Excellence leadership, DataOps Manifesto-aligned change management, and team capability uplift.', color: '#06b6d4' },
            { icon: BarChart3, title: 'Content & Community', desc: 'Regular contributor on Medium and LinkedIn covering dbt, data mesh, MLSecOps, and modern data stack practices.', color: '#8b5cf6' },
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

      {/* Skills */}
      <section className="py-10">
        <h2 className="text-2xl font-semibold mb-6">Skills & Tech Stack</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </section>

    </div>
  );
}