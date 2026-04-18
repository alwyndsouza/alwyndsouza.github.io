# alwyndsouza.github.io

Personal technical website for **Alwyn Dsouza** — Lead Data Engineer.
Live at: **https://alwyndsouza.github.io**

Topics covered: Data Engineering · DataOps · dbt · Databricks · AI Agents · MLOps

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

Articles and projects are written in **Markdown with YAML frontmatter** and rendered at build time via `import.meta.glob`.

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
│   │   │   └── About.tsx
│   │   │
│   │   ├── components/
│   │   │   ├── Layout.tsx       # Sticky nav + footer
│   │   │   └── ui/              # shadcn/ui components
│   │   │
│   │   ├── data/                # Content loaders + site config
│   │   │   ├── articles.ts      # Markdown → article objects
│   │   │   ├── projects.ts      # Markdown → project objects
│   │   │   └── config.ts        # Site-wide config (e.g. currentlyExploring)
│   │   │
│   │   ├── articles/            # Article markdown files
│   │   │   └── *.md
│   │   ├── projects/            # Project markdown files
│   │   │   └── *.md
│   │   │
│   │   └── styles/
│   │       └── globals.css      # Tailwind v4 + design tokens
│   │
│   └── public/
│       └── images/              # Static images referenced in markdown
│
├── import_medium_export.py      # Import from Medium HTML export (ZIP download)
├── import_medium.py             # Import from Medium RSS feed
│
└── .github/
    └── workflows/
        ├── deploy.yml           # Build → GitHub Pages on push to main
        └── sync-medium.yml      # Auto-import new Medium articles (every 6 hours)
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

## Importing Articles from Medium

### Automated sync (recommended)

A GitHub Actions workflow (`.github/workflows/sync-medium.yml`) runs every 6 hours and automatically imports any new articles published on Medium. No manual steps required — just publish on Medium and the portfolio updates within 6 hours.

The workflow can also be triggered manually from the **Actions** tab in GitHub using **Run workflow**.

### Option 1 — Medium HTML Export (full backfill)

Use this to import your entire Medium history from a ZIP export.

1. Go to [https://medium.com/me/settings/security](https://medium.com/me/settings/security)
2. Click **Download your information** and extract the ZIP
3. Place the `posts/` folder in the repo root as `medium-export/posts/`
4. Install the required Python dependency:

   ```bash
   pip install markdownify
   ```

5. Run the import script:

   ```bash
   python3 import_medium_export.py
   # or specify a custom path:
   python3 import_medium_export.py path/to/posts/
   ```

### Option 2 — Medium RSS Feed (latest 10 articles)

Use this to manually pull the most recent articles.

```bash
curl -s "https://medium.com/feed/@aradsouza" -o medium_feed.xml
pip install markdownify
python3 import_medium.py
```

Both scripts will:
- Parse the article title, date, tags, and cover image
- Convert all HTML body content to clean Markdown
- Write `.md` files into `frontend/src/articles/`
- Append a canonical link footer pointing back to Medium
- Skip articles that already exist (no overwrites)

> **Note:** `posts/` and `medium_feed.xml` are listed in `.gitignore` and are not committed to the repository.

---

## Adding a New Article Manually

1. Create a new Markdown file in `frontend/src/articles/`:

   ```bash
   touch frontend/src/articles/my-new-article.md
   ```

2. Add YAML frontmatter at the top:

   ```yaml
   ---
   title: "My Article Title"
   slug: "my-article-slug"
   date: 2025-06-01
   category: "data-engineering"
   excerpt: "A short description shown on listing pages."
   published: true
   tags:
     - data-engineering
     - dbt
   coverImage: "https://cdn-images-1.medium.com/max/800/your-image.png"
   ---
   ```

3. Write the article body in standard Markdown below the frontmatter.

4. Commit and push — GitHub Actions deploys automatically.

---

## Adding a New Project

1. Create a new Markdown file in `frontend/src/projects/`:

   ```bash
   touch frontend/src/projects/my-project.md
   ```

2. Add frontmatter:

   ```yaml
   ---
   id: "my-project"
   title: "My Project"
   description: "Short description shown on the listing card."
   status: development        # production | development | beta | archived
   category: "data-engineering"
   featured: true
   draft: false
   order: 5
   tech:
     - Python
     - dbt
   links:
     github: "https://github.com/alwyndsouza/my-project"
     demo: "https://my-project.example.com"
   coverImage: "/images/my-project.png"
   ---
   ```

3. Write the project description in Markdown below.

4. Commit and push.

---

## Site Configuration

Edit `frontend/src/data/config.ts` to update site-wide content that doesn't live in Markdown:

```ts
// Currently Exploring section on the About page
export const currentlyExploring = [
  'dbt Fusion Engine',
  'AI Agents + MCP',
  'Semantic Layers',
  'BI-as-Code',
];
```

---

## License

Content © 2026 Alwyn Dsouza. All rights reserved.
