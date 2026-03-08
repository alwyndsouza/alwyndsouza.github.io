import { Github, Linkedin, BookOpen, Mail, Database, Layers, Cpu, BarChart3 } from 'lucide-react';

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

export default function About() {
  return (
    <>
      {/* Hero */}
      <section className="hero-section" style={{ padding: '3.5rem 0 3rem' }}>
        <div className="site-container">
          <div className="hero-eyebrow animate-in">
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
            About me
          </div>
          <h1 className="hero-title animate-in animate-in-delay-1" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            Alwyn <span className="accent">Dsouza</span>
          </h1>
          <p className="hero-subtitle animate-in animate-in-delay-2" style={{ fontSize: '1rem', marginBottom: '2rem' }}>
            DataOps Engineer building intelligent data platforms, AI-augmented workflows,
            and thought leadership in the modern data stack space.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }} className="animate-in animate-in-delay-3">
            <a href="https://medium.com/@aradsouza" target="_blank" rel="noreferrer" className="btn btn-primary">
              <BookOpen size={14} /> Medium
            </a>
            <a href="https://linkedin.com/in/alwyndsouza" target="_blank" rel="noreferrer" className="btn btn-ghost">
              <Linkedin size={14} /> LinkedIn
            </a>
            <a href="https://github.com/alwyndsouza" target="_blank" rel="noreferrer" className="btn btn-ghost">
              <Github size={14} /> GitHub
            </a>
          </div>
        </div>
      </section>

      <div className="content-section" style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Bio */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1rem',
          marginBottom: '3rem',
        }}>
          {[
            { icon: Database, title: 'Data Engineering', desc: 'Specialising in dbt, Databricks, and AWS data mesh architectures. Passionate about data contracts and shift-left governance.' },
            { icon: Cpu, title: 'AI-Augmented Work', desc: 'Building GitHub Copilot workflows, LLM agents, and MCP server integrations to accelerate engineering teams.' },
            { icon: Layers, title: 'Platform Thinking', desc: 'Centre of Excellence leadership, DataOps Manifesto-aligned change management, and team capability uplift.' },
            { icon: BarChart3, title: 'Content & Community', desc: 'Regular contributor on Medium and LinkedIn covering dbt, data mesh, MLSecOps, and modern data stack practices.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              padding: '1.25rem',
              boxShadow: 'var(--shadow-card)',
            }}>
              <Icon size={20} style={{ color: 'var(--accent-primary)', marginBottom: '0.75rem' }} />
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.4rem' }}>{title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>

        {/* Skills */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.02em', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
            Skills & <span style={{ color: 'var(--accent-primary)' }}>Tech Stack</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {skills.map(({ category, items }) => (
              <div key={category} style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '1rem',
              }}>
                <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-primary)', marginBottom: '0.75rem' }}>
                  {category}
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {items.map(item => (
                    <span key={item} className="badge">{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.02em', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
            Career <span style={{ color: 'var(--accent-primary)' }}>Timeline</span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {timeline.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '1.25rem', paddingBottom: '1.5rem', position: 'relative' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '20px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-primary)', flexShrink: 0, marginTop: '4px' }} />
                  {i < timeline.length - 1 && (
                    <div style={{ width: '1px', flex: 1, background: 'var(--border)', marginTop: '6px' }} />
                  )}
                </div>
                <div style={{ flex: 1, paddingBottom: '0.5rem' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--accent-primary)', display: 'block', marginBottom: '0.25rem' }}>{item.year}</span>
                  <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                    {item.role} · <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{item.company}</span>
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.3rem', lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}