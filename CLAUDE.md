# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # install dependencies
npm run dev          # dev server at http://localhost:3000 (hot reload)
npm run build        # production build → build/
npm run preview      # preview production build locally
```

No test runner or linter is configured.

## Architecture

React 18 + TypeScript SPA built with Vite + SWC, styled with Tailwind CSS v4, routed with React Router v7. Deployed to GitHub Pages via GitHub Actions on every push to `main`.

**Content pipeline** — articles and projects are plain Markdown files with YAML frontmatter. They are loaded at build time via `import.meta.glob` (see `frontend/src/data/articles.ts` and `frontend/src/data/projects.ts`), parsed with `js-yaml`, and rendered to HTML with `marked` + `highlight.js`. No CMS, no API — adding content means adding a `.md` file and pushing.

**Key data flow:**
- `frontend/src/articles/*.md` → `data/articles.ts` → `pages/Articles.tsx` + `pages/ArticlePost.tsx`
- `frontend/src/projects/*.md` → `data/projects.ts` → `pages/Projects.tsx` + `pages/ProjectDetail.tsx`
- In DEV mode (`import.meta.env.DEV`), unpublished articles and draft projects are shown; in production they are filtered out.

**Routing** — all routes are defined in `frontend/src/routes.tsx` and wrapped by `Layout` (sticky nav + footer). Theme (dark/light) is managed by `ThemeProvider` and persisted in `localStorage` under the key `alwyn-dev-theme`.

**Path alias** — `@/` maps to `frontend/src/`.

**Build output** — `build/` (not `dist/`).

## Adding Content

**Article frontmatter required fields:** `title`, `slug`, `date`, `category`, `excerpt`, `published`, `tags`.

**Project frontmatter required fields (validated by Zod):** `id`, `title`, `description`, `status` (`production | development | beta | archived`), `category`, `tech`. Optional: `featured`, `draft`, `order`, `completedDate`, `links.github`, `links.demo`, `coverImage`.

Static images referenced in Markdown go in `frontend/public/images/` and are referenced as `/images/filename.png`.

## Site Config

Non-Markdown site content lives in `frontend/src/data/config.ts` — e.g. the "Currently Exploring" list shown on the About page. Edit this file to update those values without touching components.

## Importing from Medium

**Automated:** `.github/workflows/sync-medium.yml` runs every 6 hours, fetches the Medium RSS feed, and commits any new articles automatically. Can be triggered manually from the Actions tab.

**Manual (full backfill):**
```bash
pip install markdownify
python3 import_medium_export.py   # from ZIP export (place posts/ as medium-export/posts/)
```

**Manual (latest 10 from RSS):**
```bash
curl -s "https://medium.com/feed/@aradsouza" -o medium_feed.xml
pip install markdownify
python3 import_medium.py
```

Both scripts write `.md` files into `frontend/src/articles/` and skip files that already exist.
