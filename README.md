# alwyndsouza.github.io

Personal technical website for **Alwyn Dsouza** — Lead Data Engineer.  
Live at: **https://alwyndsouza.github.io**

Topics covered: Data Engineering · DataOps · dbt · Databricks · AI Agents · Trading & Macro Economics.

---

## Site Structure

```
/
├── index.html          # Homepage
├── about.html          # About page
├── articles.html       # Articles listing
├── projects.html       # Projects listing
├── trading.html        # Trading & Macro listing
│
├── css/
│   └── style.css       # All styles (responsive, minimal)
│
├── js/
│   └── main.js         # Lightweight JavaScript (active nav highlight)
│
├── articles/
│   ├── dbt-databricks.html   # Article: Using dbt with Databricks
│   └── ai-agents.html        # Article: Building AI Agents for DataOps
│
├── projects/
│   └── asx-stock-agent.html  # Project: ASX Stock Analysis Agent
│
└── trading/
    └── wyckoff-sp500.html    # Research: Wyckoff Model on S&P 500
```

---

## Deploying on GitHub Pages

1. Push this repository to GitHub under the name `<username>.github.io`  
   (e.g. `alwyndsouza/alwyndsouza.github.io`).

2. Go to **Settings → Pages** in the repository.

3. Under **Source**, select **Deploy from a branch** and choose `main` / `(root)`.

4. Click **Save**. GitHub Pages will build and serve the site at  
   `https://<username>.github.io` within a minute or two.

No build step is required — the site is plain HTML, CSS, and JavaScript.

---

## Adding a New Article

1. Copy an existing article file as a template, e.g.:
   ```
   cp articles/dbt-databricks.html articles/my-new-article.html
   ```

2. Update the `<title>`, `<meta name="description">`, `<h1>`, publish date, tags, and body content.

3. Add an entry to **`articles.html`** (copy an existing `<li>` block and update the href, title, date, and excerpt).

4. Optionally add a teaser card to the **homepage** (`index.html`) in the "Latest Articles" section.

5. Commit and push — GitHub Pages deploys automatically.

---

## Adding a New Project

1. Copy the existing project page as a template:
   ```
   cp projects/asx-stock-agent.html projects/my-new-project.html
   ```

2. Update the title, description, tech stack, and status sections.

3. Add a `<div class="project-card">` entry to **`projects.html`**.

4. Commit and push.

---

## Adding a New Trading / Macro Post

1. Copy the existing trading page:
   ```
   cp trading/wyckoff-sp500.html trading/my-new-analysis.html
   ```

2. Update the content.

3. Add a new `<li>` entry to **`trading.html`**.

4. Commit and push.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Static site generator | None required — plain HTML |
| Styles | Vanilla CSS (`css/style.css`) |
| JavaScript | Vanilla JS (`js/main.js`) |
| Hosting | GitHub Pages |
| Build step | None |

The site intentionally avoids frameworks and build tools to keep it fast, dependency-free, and easy to maintain long-term.

---

## License

Content © 2025 Alwyn Dsouza. All rights reserved.
