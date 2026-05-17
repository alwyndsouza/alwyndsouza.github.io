# alwyndsouza.github.io

Personal technical portfolio for **Alwyn D'Souza** — Data & AI Engineering Leader.  
Live at: **https://alwyndsouza.github.io**

Topics: DataOps · dbt · Databricks · AI Agents · Apache Spark · AWS · GCP · MLOps

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) + TypeScript |
| Styling | Tailwind CSS v3 |
| Animations | Framer Motion |
| Fonts | Inter + JetBrains Mono (Google Fonts) |
| Markdown | gray-matter + remark |
| Hosting | GitHub Pages (static export via GitHub Actions) |

Articles and projects are **Markdown files with YAML frontmatter** loaded at build time from the `content/` directory using Node's `fs` module via server components.

---

## Repository Structure

```
/
├── app/                         # Next.js App Router
│   ├── layout.tsx               # Root layout (header, footer, theme provider)
│   ├── page.tsx                 # Homepage
│   ├── globals.css              # Tailwind base + design tokens + light/dark mode
│   ├── about/page.tsx           # About page
│   ├── articles/                # Articles listing + individual article pages
│   └── projects/                # Projects listing + individual project pages
│
├── components/
│   ├── layout/                  # Header, Footer
│   ├── providers/               # ThemeProvider (system/light/dark)
│   ├── sections/                # Homepage sections (Hero, About, Projects, etc.)
│   └── ui/                      # Shared UI primitives
│
├── content/
│   ├── articles/                # Article Markdown files (*.md)
│   └── projects/                # Project Markdown files (*.md)
│
├── lib/
│   ├── articles.ts              # Server-side article loader (uses fs)
│   ├── projects.ts              # Server-side project loader (uses fs)
│   ├── types.ts                 # Shared TypeScript types
│   └── utils.ts                 # Utility helpers
│
├── public/
│   ├── favicon.svg
│   ├── og-default.svg           # Open Graph image
│   └── images/                  # Static images referenced in Markdown
│
├── next.config.ts               # output: "export", distDir: "build"
├── tailwind.config.ts
│
├── import_medium.py             # Import latest articles from Medium RSS
├── import_medium_export.py      # Full backfill from Medium ZIP export
│
└── .github/workflows/
    ├── deploy.yml               # Build → GitHub Pages on push to main
    └── sync-medium.yml          # Auto-import new Medium articles (every 6 hours)
```

---

## Local Development

### Prerequisites

- Node.js v18 or higher

```bash
node --version   # should be v18+
```

### Quick Start

```bash
# Install dependencies
npm install

# Start dev server with hot reload
npm run dev
# → http://localhost:3000

# Production build (outputs to build/)
npm run build

# Preview the production build locally
npm run preview
```

---

## Deployment

Deployment is automated via **GitHub Actions** (`.github/workflows/deploy.yml`).

On every push to `main`:
1. Installs dependencies with `npm ci`
2. Runs `npm run build` (Next.js static export → `build/`)
3. Uploads the `build/` directory to GitHub Pages

**First-time setup:**
1. Go to **Settings → Pages** in your repository
2. Under **Source**, select **GitHub Actions**
3. Push to `main` — the workflow handles everything else

---

## Importing Articles from Medium

### Automated sync (recommended)

`.github/workflows/sync-medium.yml` runs every 6 hours, fetches the Medium RSS feed, and commits any new articles to `content/articles/`. Trigger it manually anytime from the **Actions** tab.

### Option 1 — Full backfill from Medium export

1. Download your data from [medium.com/me/settings/security](https://medium.com/me/settings/security)
2. Extract the ZIP and place the `posts/` folder at `medium-export/posts/`
3. Run:

```bash
pip install markdownify
python3 import_medium_export.py
```

### Option 2 — Latest articles from RSS

```bash
curl -s "https://medium.com/feed/@aradsouza" -o medium_feed.xml
pip install markdownify
python3 import_medium.py
```

Both scripts convert HTML to Markdown, write files to `content/articles/`, and skip existing articles.

---

## Adding an Article

1. Create a Markdown file in `content/articles/`:

```bash
touch content/articles/my-article.md
```

2. Add YAML frontmatter:

```yaml
---
title: "Article Title"
slug: "article-slug"
date: 2026-01-01
category: "data-engineering"
excerpt: "Short description shown on listing pages."
published: true
tags:
  - dbt
  - databricks
coverImage: "https://cdn-images-1.medium.com/max/800/your-image.png"
---
```

3. Write Markdown content below the frontmatter, then commit and push.

---

## Adding a Project

1. Create a Markdown file in `content/projects/`:

```bash
touch content/projects/my-project.md
```

2. Add YAML frontmatter:

```yaml
---
id: "my-project"
title: "Project Name"
description: "Short description for the project card."
status: production          # production | development | beta | archived
category: "data-engineering"
featured: true
draft: false
order: 5
tech:
  - Python
  - dbt
  - Databricks
links:
  github: "https://github.com/alwyndsouza/my-project"
  demo: "https://my-project.example.com"
coverImage: "/images/my-project.png"
---
```

3. Write the project description in Markdown below, commit and push.

---

## Theme

The site supports **system / light / dark** themes. The preference is stored in `localStorage` under `alwyn-dev-theme`. A blocking inline script prevents flash of the wrong theme on load. The toggle button is in the header.

---

## License

Content © 2026 Alwyn D'Souza. All rights reserved.
