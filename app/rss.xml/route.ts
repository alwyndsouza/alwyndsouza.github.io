import { getAllArticles } from "@/lib/articles";

const SITE_URL = "https://alwyndsouza.github.io";
const SITE_NAME = "Alwyn Dsouza";
const SITE_DESCRIPTION =
  "Practical writing on Data Engineering, DataOps, dbt, Databricks, and AI Agents. Articles, open-source projects, and lessons from production data platforms.";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function rfc822(d: Date): string {
  return d.toUTCString();
}

function safeDate(s: string): Date {
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

export async function GET() {
  const articles = getAllArticles().slice(0, 30);

  const items = articles
    .map((a) => {
      const link = `${SITE_URL}/articles/${a.slug}`;
      const cats = (a.tags ?? [])
        .map((t) => `      <category>${escapeXml(t)}</category>`)
        .join("\n");
      return [
        "    <item>",
        `      <title>${escapeXml(a.title)}</title>`,
        `      <link>${escapeXml(link)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(link)}</guid>`,
        `      <pubDate>${rfc822(safeDate(a.date))}</pubDate>`,
        `      <description>${escapeXml(a.excerpt || "")}</description>`,
        cats,
        "    </item>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)} — Articles</title>
    <link>${escapeXml(SITE_URL)}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en</language>
    <lastBuildDate>${rfc822(new Date())}</lastBuildDate>
    <atom:link href="${escapeXml(SITE_URL)}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
