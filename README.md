# alwyndsouza.github.io

Personal technical website for **Alwyn Dsouza** — DataOps Engineer.
Live at: **https://alwyndsouza.github.io**

Topics covered: Data Engineering · DataOps · dbt · Databricks · AI Agents.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build tool | Vite + SWC |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui (Badge, Button, Card) |
| Routing | React Router v7 |
| Markdown | marked + marked-highlight + highlight.js |
| Hosting | GitHub Pages (via GitHub Actions) |

Articles, projects, and trading posts are written in **Markdown with YAML frontmatter** and rendered at build time via `import.meta.glob`.

---

## Repository Structure

```
/
├── index.html                   # Vite entry point (React SPA root)
├── package.json
├── vite.config.ts
├── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── main.tsx             # React entry point
│   │   ├── App.tsx
│   │   ├── routes.tsx           # React Router routes
│   │   │
│   │   ├── pages/               # Page components
│   │   │   ├── Home.tsx
│   │   │   ├── Articles.tsx
│   │   │   ├── ArticlePost.tsx
│   │   │   ├── Projects.tsx
│   │   │   ├── ProjectDetail.tsx
│   │   │   ├── Trading.tsx
│   │   │   ├── TradingPost.tsx
│   │   │   └── About.tsx
│   │   │
│   │   ├── components/
│   │   │   ├── Layout.tsx       # Sticky nav + footer
│   │   │   └── ui/              # shadcn/ui components
│   │   │
│   │   ├── data/                # Content loaders (markdown → JS objects)
│   │   │   ├── articles.ts
│   │   │   ├── projects.ts
│   │   │   └── trading.ts
│   │   │
│   │   ├── articles/            # Article markdown files
│   │   │   └── *.md
│   │   ├── projects/            # Project markdown files
│   │   │   └── *.md
│   │   ├── trading/             # Trading post markdown files
│   │   │   └── *.md
│   │   │
│   │   └── styles/
│   │       └── globals.css      # Tailwind v4 + design tokens
│   │
│   └── public/
│       └── images/              # Static images referenced in markdown
│
└── .github/
    └── workflows/
        └── deploy.yml           # Build → GitHub Pages
```

---

## Local Development

### Prerequisites

- Node.js v18 or higher

```bash
node --version   # should be v18+
npm --version
```

### Quick Start

```bash
# Install dependencies
npm install

# Start dev server (hot reload)
npm run dev
# → http://localhost:3000

# Production build
npm run build

# Preview production build
npm run preview
```

---

## Deploying on GitHub Pages

Deployment is fully automated via **GitHub Actions** (`.github/workflows/deploy.yml`).

Every push to `main`:
1. Installs dependencies with `npm ci`
2. Runs `npm run build` (output in `build/`)
3. Uploads the `build/` directory to GitHub Pages

To enable GitHub Pages for the first time:
1. Go to **Settings → Pages** in the repository
2. Under **Source**, select **GitHub Actions**
3. Push to `main` — the workflow handles the rest

---

## Adding a New Article

1. Create a new Markdown file in `frontend/src/articles/`:

   ```
   cp frontend/src/articles/dbt-databricks.md frontend/src/articles/my-new-article.md
   ```

2. Update the YAML frontmatter at the top of the file:

   ```yaml
   ---
   title: "My Article Title"
   slug: "my-article-slug"
   date: 2025-06-01
   category: Data Engineering
   excerpt: "A short description shown on listing pages."
   published: true
   tags:
     - tag-one
     - tag-two
   ---
   ```

3. Write the article body in standard Markdown below the frontmatter.

4. To include an image, add it to `frontend/public/images/` and reference it in frontmatter:

   ```yaml
   coverImage: "/images/my-diagram.png"
   ```

   Or inline in the Markdown body:

   ```markdown
   ![Alt text](/images/my-diagram.png)
   ```

5. Commit and push — GitHub Actions deploys automatically.

---

## Adding a New Project

1. Create a new Markdown file in `frontend/src/projects/`:

   ```
   cp frontend/src/projects/asx-stock-agent.md frontend/src/projects/my-project.md
   ```

2. Update the frontmatter:

   ```yaml
   ---
   id: "my-project"
   title: "My Project"
   description: "Short description shown on the listing card."
   status: development        # production | development | beta | archived
   category: Finance
   featured: true
   draft: false
   tech:
     - Python
     - PostgreSQL
   links:
     github: "https://github.com/alwyndsouza/my-project"
     demo: "https://my-project.example.com"
   coverImage: "/images/my-project.png"   # optional
   ---
   ```

3. Write the project description in Markdown below.

4. Commit and push.

---

## Adding a New Trading / Macro Post

1. Create a new Markdown file in `frontend/src/trading/`:

   ```
   cp frontend/src/trading/wyckoff-sp500.md frontend/src/trading/my-analysis.md
   ```

2. Update the frontmatter:

   ```yaml
   ---
   title: "My Market Analysis"
   slug: "my-analysis"
   date: 2025-06-15
   category: Macro Economics
   excerpt: "Brief description."
   published: true
   tags:
     - macro
     - equities
   coverImage: "/images/chart.png"   # optional
   ---
   ```

3. Write the analysis in Markdown below.

4. Commit and push.

---

## License

Content © 2025 Alwyn Dsouza. All rights reserved.
