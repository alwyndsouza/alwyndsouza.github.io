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
│   │   ├── data/                # Content loaders (markdown → JS objects)
│   │   │   ├── articles.ts
│   │   │   └── projects.ts
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
├── import_medium.py             # Import from Medium RSS feed (medium_feed.xml)
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

## Importing Articles from Medium

Two scripts are provided to import articles from Medium into Markdown format. Both convert HTML content to clean Markdown automatically.

### Option 1 — Medium HTML Export (recommended)

Use this when you have downloaded your Medium data export (ZIP file).

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

### Option 2 — Medium RSS Feed

Use this when you have a `medium_feed.xml` RSS export.

```bash
pip install markdownify
python3 import_medium.py
```

Both scripts will:
- Parse the article title, date, tags, and cover image
- Convert all HTML body content to clean Markdown
- Write `.md` files into `frontend/src/articles/`
- Append a canonical link footer pointing back to Medium

> **Note:** `posts/` and `medium_feed.xml` are listed in `.gitignore` and are not committed to the repository.

---

## Adding a New Article Manually

1. Create a new Markdown file in `frontend/src/articles/`:

   ```bash
   cp frontend/src/articles/dbt-fusion-under-the-hood-the-technical-architecture.md \
      frontend/src/articles/my-new-article.md
   ```

2. Update the YAML frontmatter at the top of the file:

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

4. To include an image inline:

   ```markdown
   ![Alt text](https://cdn-images-1.medium.com/max/800/your-image.png)
   ```

5. Commit and push — GitHub Actions deploys automatically.

---

## Adding a New Project

1. Create a new Markdown file in `frontend/src/projects/`:

   ```bash
   cp frontend/src/projects/example.md frontend/src/projects/my-project.md
   ```

2. Update the frontmatter:

   ```yaml
   ---
   id: "my-project"
   title: "My Project"
   description: "Short description shown on the listing card."
   status: development        # production | development | beta | archived
   category: "data-engineering"
   featured: true
   draft: false
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

## License

Content © 2025 Alwyn Dsouza. All rights reserved.
