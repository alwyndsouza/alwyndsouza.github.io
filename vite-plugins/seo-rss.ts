/**
 * Build + dev SEO + RSS plugin.
 *
 * On `vite build` (closeBundle hook):
 *   - reads every `frontend/src/articles/*.md` and `frontend/src/projects/*.md`
 *     file, parses YAML frontmatter, filters to published / non-draft items;
 *   - copies `build/index.html` to `build/articles/<slug>/index.html` and
 *     `build/projects/<id>/index.html`, rewriting the `<!-- META:START -->`
 *     ... `<!-- META:END -->` block with per-page title / description /
 *     canonical / og: / twitter: tags so social scrapers and search engines
 *     see real metadata even though the runtime app is a SPA;
 *   - writes `build/sitemap.xml`, `build/rss.xml`, and `build/robots.txt`.
 *
 * On `vite dev` (configureServer hook):
 *   - synthesizes /rss.xml, /sitemap.xml and /robots.txt at request time so
 *     the footer link works locally without running a build first.
 *
 * The runtime React app is unchanged: every generated HTML still loads the
 * same JS bundle and renders the same SPA. Pre-rendering only affects the
 * static `<head>` block that crawlers and OG scrapers read.
 */
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

interface SiteMeta {
  url: string;
  name: string;
  title: string;
  description: string;
  defaultOgImage: string;
  language: string;
  twitter?: string;
}

interface Article {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  tags: string[];
  published: boolean;
  coverImage?: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  tech: string[];
  draft: boolean;
  coverImage?: string;
  completedDate?: string;
}

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;

function parseFrontmatter(raw: string): { data: Record<string, unknown>; content: string } {
  const m = raw.match(FRONTMATTER_RE);
  if (!m) return { data: {}, content: raw };
  try {
    return { data: yaml.load(m[1]) as Record<string, unknown>, content: m[2].trim() };
  } catch {
    return { data: {}, content: raw };
  }
}

function readMarkdownDir<T>(dir: string, project: (data: Record<string, unknown>, content: string) => T | null): T[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .map(f => {
      const raw = fs.readFileSync(path.join(dir, f), 'utf8');
      const { data, content } = parseFrontmatter(raw);
      return project(data, content);
    })
    .filter((x): x is T => x !== null);
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function escapeHtmlAttr(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function absoluteUrl(siteUrl: string, p: string): string {
  if (/^https?:\/\//i.test(p)) return p;
  const trimmed = siteUrl.replace(/\/$/, '');
  const rel = p.startsWith('/') ? p : `/${p}`;
  return trimmed + rel;
}

function metaBlock(opts: {
  site: SiteMeta;
  title: string;
  description: string;
  url: string;
  type: 'website' | 'article';
  image: string;
  publishedTime?: string;
  tags?: string[];
}): string {
  const { site, title, description, url, type, image, publishedTime, tags } = opts;
  const lines: string[] = [
    '<!-- META:START -->',
    `    <title>${escapeXml(title)}</title>`,
    `    <meta name="description" content="${escapeHtmlAttr(description)}" />`,
    `    <link rel="canonical" href="${escapeHtmlAttr(url)}" />`,
    '',
    `    <meta property="og:type" content="${type}" />`,
    `    <meta property="og:site_name" content="${escapeHtmlAttr(site.name)}" />`,
    `    <meta property="og:title" content="${escapeHtmlAttr(title)}" />`,
    `    <meta property="og:description" content="${escapeHtmlAttr(description)}" />`,
    `    <meta property="og:url" content="${escapeHtmlAttr(url)}" />`,
    `    <meta property="og:image" content="${escapeHtmlAttr(image)}" />`,
  ];
  if (type === 'article' && publishedTime) {
    lines.push(`    <meta property="article:published_time" content="${escapeHtmlAttr(publishedTime)}" />`);
  }
  if (type === 'article' && tags) {
    for (const tag of tags) {
      lines.push(`    <meta property="article:tag" content="${escapeHtmlAttr(tag)}" />`);
    }
  }
  lines.push('');
  lines.push(`    <meta name="twitter:card" content="summary_large_image" />`);
  if (site.twitter) {
    lines.push(`    <meta name="twitter:site" content="${escapeHtmlAttr(site.twitter)}" />`);
  }
  lines.push(`    <meta name="twitter:title" content="${escapeHtmlAttr(title)}" />`);
  lines.push(`    <meta name="twitter:description" content="${escapeHtmlAttr(description)}" />`);
  lines.push(`    <meta name="twitter:image" content="${escapeHtmlAttr(image)}" />`);
  lines.push('    <!-- META:END -->');
  return lines.join('\n');
}

function buildHtml(template: string, block: string): string {
  return template.replace(
    /<!-- META:START -->[\s\S]*?<!-- META:END -->/,
    block.replace(/^\s*<!-- META:START -->\n/, '<!-- META:START -->\n').replace(/^\s+/, ''),
  );
}

function rfc822(d: Date): string {
  return d.toUTCString();
}

function isoDate(s: string): string {
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return new Date().toISOString();
  return d.toISOString();
}

function safeDate(s: string): Date {
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

// ---------- Shared content loaders + generators ----------

function loadArticles(root: string): Article[] {
  return readMarkdownDir<Article>(path.join(root, 'frontend/src/articles'), data => {
    if (data.published === false) return null;
    return {
      slug: String(data.slug ?? ''),
      title: String(data.title ?? 'Untitled'),
      excerpt: String(data.excerpt ?? ''),
      date: String(data.date ?? new Date().toISOString()),
      category: String(data.category ?? ''),
      tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
      published: data.published !== false,
      coverImage: data.coverImage ? String(data.coverImage) : undefined,
    };
  })
    .filter(a => a.slug)
    .sort((a, b) => safeDate(b.date).getTime() - safeDate(a.date).getTime());
}

function loadProjects(root: string): Project[] {
  return readMarkdownDir<Project>(path.join(root, 'frontend/src/projects'), data => {
    if (data.draft === true) return null;
    return {
      id: String(data.id ?? ''),
      title: String(data.title ?? 'Untitled'),
      description: String(data.description ?? ''),
      category: String(data.category ?? ''),
      status: String(data.status ?? ''),
      tech: Array.isArray(data.tech) ? (data.tech as string[]) : [],
      draft: data.draft === true,
      coverImage: data.coverImage ? String(data.coverImage) : undefined,
      completedDate: data.completedDate ? String(data.completedDate) : undefined,
    };
  }).filter(p => p.id);
}

function buildSitemap(site: SiteMeta, articles: Article[], projects: Project[]): string {
  const entries: Array<{ loc: string; lastmod?: string; priority: string }> = [
    { loc: absoluteUrl(site.url, '/'), priority: '1.0' },
    { loc: absoluteUrl(site.url, '/articles'), priority: '0.9' },
    { loc: absoluteUrl(site.url, '/projects'), priority: '0.8' },
    { loc: absoluteUrl(site.url, '/about'), priority: '0.6' },
    ...articles.map(a => ({
      loc: absoluteUrl(site.url, `/articles/${a.slug}`),
      lastmod: isoDate(a.date),
      priority: '0.7',
    })),
    ...projects.map(p => ({
      loc: absoluteUrl(site.url, `/projects/${p.id}`),
      lastmod: p.completedDate ? isoDate(p.completedDate) : undefined,
      priority: '0.6',
    })),
  ];
  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    entries
      .map(e => {
        const lastmod = e.lastmod ? `\n    <lastmod>${e.lastmod}</lastmod>` : '';
        return `  <url>\n    <loc>${escapeXml(e.loc)}</loc>${lastmod}\n    <priority>${e.priority}</priority>\n  </url>`;
      })
      .join('\n') +
    '\n</urlset>\n'
  );
}

function buildRss(site: SiteMeta, articles: Article[]): string {
  const rssItems = articles
    .slice(0, 30)
    .map(a => {
      const link = absoluteUrl(site.url, `/articles/${a.slug}`);
      const cats = (a.tags ?? []).map(t => `      <category>${escapeXml(t)}</category>`).join('\n');
      return [
        '    <item>',
        `      <title>${escapeXml(a.title)}</title>`,
        `      <link>${escapeXml(link)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(link)}</guid>`,
        `      <pubDate>${rfc822(safeDate(a.date))}</pubDate>`,
        `      <description>${escapeXml(a.excerpt || '')}</description>`,
        cats,
        '    </item>',
      ]
        .filter(Boolean)
        .join('\n');
    })
    .join('\n');
  const lastBuild = rfc822(new Date());
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(site.name)} — Articles</title>
    <link>${escapeXml(site.url)}</link>
    <description>${escapeXml(site.description)}</description>
    <language>${site.language}</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${escapeXml(absoluteUrl(site.url, '/rss.xml'))}" rel="self" type="application/rss+xml" />
${rssItems}
  </channel>
</rss>
`;
}

function buildRobots(site: SiteMeta): string {
  return `User-agent: *
Allow: /

Sitemap: ${absoluteUrl(site.url, '/sitemap.xml')}
`;
}

// ---------- Plugin ----------

export interface SeoRssOptions {
  site: SiteMeta;
  /** Absolute path to the project root (where frontend/src lives). */
  root: string;
}

interface PluginConfigLike {
  root: string;
  build: { outDir: string };
}

interface DevResponseLike {
  setHeader(name: string, value: string): void;
  end(body?: string): void;
}

interface DevServerLike {
  middlewares: {
    use(handler: (req: { url?: string }, res: DevResponseLike, next: () => void) => void): void;
  };
  config: { logger: { error(message: string): void } };
}

export function seoRssPlugin(options: SeoRssOptions) {
  const { site, root } = options;
  let resolvedOutDir = path.join(root, 'build');
  return {
    name: 'alwyn-seo-rss',
    configResolved(config: PluginConfigLike) {
      resolvedOutDir = path.isAbsolute(config.build.outDir)
        ? config.build.outDir
        : path.join(config.root, config.build.outDir);
    },
    /**
     * Dev server: synthesize /rss.xml, /sitemap.xml, /robots.txt at request
     * time. The articles/projects readers re-run on each request so newly
     * added markdown files show up without a server restart.
     */
    configureServer(server: DevServerLike) {
      server.middlewares.use((req, res, next) => {
        if (!req.url) return next();
        const url = req.url.split('?')[0];
        try {
          if (url === '/rss.xml') {
            const articles = loadArticles(root);
            res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
            res.end(buildRss(site, articles));
            return;
          }
          if (url === '/sitemap.xml') {
            const articles = loadArticles(root);
            const projects = loadProjects(root);
            res.setHeader('Content-Type', 'application/xml; charset=utf-8');
            res.end(buildSitemap(site, articles, projects));
            return;
          }
          if (url === '/robots.txt') {
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.end(buildRobots(site));
            return;
          }
        } catch (err) {
          server.config.logger.error(`[seo-rss] dev handler error for ${url}: ${String(err)}`);
        }
        next();
      });
    },
    /**
     * Build: pre-render per-route HTML with baked meta tags and write
     * sitemap.xml / rss.xml / robots.txt into the build output.
     */
    closeBundle(this: { warn(message: string): void; info(message: string): void }) {
      const buildDir = resolvedOutDir;
      const indexPath = path.join(buildDir, 'index.html');
      if (!fs.existsSync(indexPath)) {
        this.warn(`[seo-rss] ${indexPath} not found — skipping`);
        return;
      }
      const indexHtml = fs.readFileSync(indexPath, 'utf8');
      const articles = loadArticles(root);
      const projects = loadProjects(root);

      // Per-article HTML
      let articlePages = 0;
      for (const a of articles) {
        const url = absoluteUrl(site.url, `/articles/${a.slug}`);
        const image = a.coverImage
          ? absoluteUrl(site.url, a.coverImage)
          : absoluteUrl(site.url, site.defaultOgImage);
        const title = `${a.title} — ${site.name}`;
        const description = a.excerpt || site.description;
        const html = buildHtml(
          indexHtml,
          metaBlock({
            site,
            title,
            description,
            url,
            type: 'article',
            image,
            publishedTime: isoDate(a.date),
            tags: a.tags,
          }),
        );
        const dir = path.join(buildDir, 'articles', a.slug);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, 'index.html'), html);
        articlePages++;
      }

      // Per-project HTML
      let projectPages = 0;
      for (const p of projects) {
        const url = absoluteUrl(site.url, `/projects/${p.id}`);
        const image = p.coverImage
          ? absoluteUrl(site.url, p.coverImage)
          : absoluteUrl(site.url, site.defaultOgImage);
        const title = `${p.title} — ${site.name}`;
        const description = p.description || site.description;
        const html = buildHtml(
          indexHtml,
          metaBlock({
            site,
            title,
            description,
            url,
            type: 'website',
            image,
          }),
        );
        const dir = path.join(buildDir, 'projects', p.id);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, 'index.html'), html);
        projectPages++;
      }

      // Top-level pages
      const topPages: Array<{ path: string; title: string; description: string }> = [
        {
          path: '/articles',
          title: `Articles — ${site.name}`,
          description:
            'Practical writing on Data Engineering, DataOps, AI, dbt, Databricks, and the modern data stack.',
        },
        {
          path: '/projects',
          title: `Projects — ${site.name}`,
          description:
            'Open-source side projects and engineering experiments — dbt, data contracts, semantic layers, and more.',
        },
        {
          path: '/about',
          title: `About — ${site.name}`,
          description: `${site.name} — Data Engineering & AI builder. Writing, open-source projects, community contributions.`,
        },
      ];
      for (const p of topPages) {
        const url = absoluteUrl(site.url, p.path);
        const html = buildHtml(
          indexHtml,
          metaBlock({
            site,
            title: p.title,
            description: p.description,
            url,
            type: 'website',
            image: absoluteUrl(site.url, site.defaultOgImage),
          }),
        );
        const dir = path.join(buildDir, p.path.replace(/^\//, ''));
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, 'index.html'), html);
      }

      fs.writeFileSync(path.join(buildDir, 'sitemap.xml'), buildSitemap(site, articles, projects));
      fs.writeFileSync(path.join(buildDir, 'rss.xml'), buildRss(site, articles));
      fs.writeFileSync(path.join(buildDir, 'robots.txt'), buildRobots(site));

      this.info(
        `[seo-rss] wrote ${articlePages} article pages, ${projectPages} project pages, sitemap, rss (${Math.min(articles.length, 30)} items), robots.txt`,
      );
    },
  };
}
