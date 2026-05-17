import { getAllArticles } from "@/lib/articles";
import { getAllProjects } from "@/lib/projects";

const SITE_URL = "https://alwyndsouza.github.io";

function isoDate(s: string): string {
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

export async function GET() {
  const articles = getAllArticles();
  const projects = getAllProjects();

  const staticPages = [
    { loc: SITE_URL, priority: "1.0" },
    { loc: `${SITE_URL}/articles`, priority: "0.9" },
    { loc: `${SITE_URL}/projects`, priority: "0.8" },
    { loc: `${SITE_URL}/about`, priority: "0.6" },
  ];

  const articlePages = articles.map((a) => ({
    loc: `${SITE_URL}/articles/${a.slug}`,
    lastmod: isoDate(a.date),
    priority: "0.7",
  }));

  const projectPages = projects.map((p) => ({
    loc: `${SITE_URL}/projects/${p.id}`,
    priority: "0.6",
  }));

  const allPages = [...staticPages, ...articlePages, ...projectPages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map((p) => {
    const lastmod = "lastmod" in p && p.lastmod ? `\n    <lastmod>${p.lastmod}</lastmod>` : "";
    return `  <url>\n    <loc>${p.loc}</loc>${lastmod}\n    <priority>${p.priority}</priority>\n  </url>`;
  })
  .join("\n")}
</urlset>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
