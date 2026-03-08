export function About() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="prose prose-lg dark:prose-invert">
        <h1 className="text-4xl font-bold mb-2">About</h1>
        <p className="text-muted-foreground text-lg mb-8">
          Data Engineer • DataOps Practitioner • Builder
        </p>

        <p>
          I'm <strong>Alwyn Dsouza</strong>, a DataOps Engineer based in Australia. I design and
          build modern data platforms that help organisations turn raw data into reliable,
          well-governed, and actionable insights.
        </p>

        <p>
          My work focuses on building scalable <strong>lakehouse architectures</strong> and
          establishing strong <strong>DataOps practices</strong> that make data platforms
          reproducible, observable, and easy to operate. I enjoy solving problems at the
          intersection of <strong>data engineering, platform engineering, and applied AI</strong>.
        </p>

        <p>
          Over the years I’ve worked on designing data platforms, building data mesh architectures, migrating legacy SQL pipelines
          into modern transformation frameworks, implementing CI/CD for data, and enabling 
          analytics teams to work faster with trusted data.
        </p>

        <h2>Writing & Projects</h2>
        <p>
          This site is where I document patterns, experiments, and ideas from my work. I also share technical projects,
          reference architectures, and lessons learned from building production systems.
        </p>


        <h2>Connect</h2>
        <p>
          Find my work on{" "}
          <a href="https://github.com/alwyndsouza" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>{" "}
          or connect with me on{" "}
          <a
            href="https://www.linkedin.com/in/alwynanildsouza/"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>.
        </p>
      </div>
    </div>
  );
}
