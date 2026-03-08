import { Github, Linkedin, BookOpen, Database, Layers, Cpu, BarChart3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const skills = [
  { category: 'Data Platforms', items: ['dbt', 'Databricks', 'Redshift', 'Snowflake', 'Delta Lake'] },
  { category: 'Cloud & Infra', items: ['AWS', 'CDK', 'Glue', 'S3', 'Lambda', 'ECS'] },
  { category: 'AI & Automation', items: ['LLM Agents', 'GitHub Copilot', 'MCP Servers', 'RAG', 'MetricFlow'] },
  { category: 'Frameworks', items: ['Data Mesh', 'DataOps', 'dlt', 'Airflow', 'Spark'] },
];

const timeline = [
  { year: '2024–now', role: 'DataOps Engineer', company: 'TPG Telecom', desc: 'Centre of Excellence — data mesh, dbt, Databricks, AI-augmented engineering.' },
  { year: '2022–24', role: 'Senior Data Engineer', company: 'TPG Telecom', desc: 'Built data platforms on AWS and Databricks. Led dbt migration and DataOps practices.' },
  { year: '2019–22', role: 'Data Engineer', company: 'Various', desc: 'Kimball modelling, ETL pipelines, Redshift, Snowflake.' },
];

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
          <a href="https://linkedin.com/in/alwyndsouza" target="_blank" rel="noreferrer">
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
            { icon: Database, title: 'Data Engineering', desc: 'Specialising in dbt, Databricks, and AWS data mesh architectures. Passionate about data contracts and shift-left governance.' },
            { icon: Cpu, title: 'AI-Augmented Work', desc: 'Building GitHub Copilot workflows, LLM agents, and MCP server integrations to accelerate engineering teams.' },
            { icon: Layers, title: 'Platform Thinking', desc: 'Centre of Excellence leadership, DataOps Manifesto-aligned change management, and team capability uplift.' },
            { icon: BarChart3, title: 'Content & Community', desc: 'Regular contributor on Medium and LinkedIn covering dbt, data mesh, MLSecOps, and modern data stack practices.' },
          ].map(({ icon: Icon, title, desc }) => (
            <Card key={title}>
              <CardContent className="pt-5">
                <Icon size={20} className="text-muted-foreground mb-3" />
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
          {skills.map(({ category, items }) => (
            <Card key={category}>
              <CardContent className="pt-5">
                <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">
                  {category}
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {items.map(item => (
                    <Badge key={item} variant="outline" className="text-[10px]">{item}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="py-10">
        <h2 className="text-2xl font-semibold mb-6">Career Timeline</h2>
        <div className="space-y-8">
          {timeline.map((item, i) => (
            <div key={i} className="relative pl-6 border-l border-border">
              <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary" />
              <span className="text-xs font-mono text-muted-foreground mb-1 block">{item.year}</span>
              <h4 className="font-semibold text-base">
                {item.role} <span className="text-muted-foreground font-normal">· {item.company}</span>
              </h4>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
