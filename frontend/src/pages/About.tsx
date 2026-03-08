export function About() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto prose prose-lg dark:prose-invert">
        <h1 className="text-4xl font-bold mb-2">About</h1>
        <p className="text-muted-foreground text-lg mb-8">Who I am and what I work on.</p>

        <p>
          I'm Alwyn Dsouza, a Lead Data Engineer based in Australia. I design and build
          data platforms that help organisations move from raw data to reliable, actionable
          insights at scale.
        </p>

        <p>
          My work sits at the intersection of data engineering, DataOps, and applied AI —
          building systems that are reproducible, observable, and easy to operate.
        </p>

        <h2>What I Work With</h2>
        <ul>
          <li><strong>Lakehouse platforms</strong> — Databricks, Delta Lake, Apache Spark</li>
          <li><strong>Transformation</strong> — dbt Core and dbt Cloud, SQL modelling patterns</li>
          <li><strong>Orchestration</strong> — Apache Airflow, Databricks Workflows</li>
          <li><strong>DataOps</strong> — CI/CD for data, data quality frameworks, observability</li>
          <li><strong>AI & LLMs</strong> — building agentic workflows, RAG pipelines, LLM tooling</li>
          <li><strong>Cloud</strong> — AWS, Azure</li>
          <li><strong>Languages</strong> — Python, SQL, Bash</li>
        </ul>

        <h2>Writing</h2>
        <p>
          I write to document patterns I use in production and ideas worth exploring. Topics
          include dbt best practices, AI agent design, trading models, and technical experiments.
        </p>

        <h2>Outside Work</h2>
        <p>
          I follow macro economics and markets closely, applying systematic frameworks like
          the Wyckoff Method to equity and crypto markets. I also build small side projects
          at the intersection of finance and engineering.
        </p>

        <h2>Get in Touch</h2>
        <p>
          Find me on{' '}
          <a href="https://github.com/alwyndsouza" target="_blank" rel="noopener noreferrer">GitHub</a>
          {' '}or{' '}
          <a href="https://linkedin.com/in/alwyndsouza" target="_blank" rel="noopener noreferrer">LinkedIn</a>.
        </p>
      </div>
    </div>
  );
}
