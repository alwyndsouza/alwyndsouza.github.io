/**
 * Canonical site metadata. Used both at runtime (for `document.title`,
 * og: tags managed in React) and at build time by the SEO/RSS plugin
 * which generates per-route static HTML, sitemap.xml and rss.xml.
 *
 * If the site moves to a custom domain, only `siteUrl` needs to change.
 */
export const site = {
  url: 'https://alwyndsouza.github.io',
  name: 'Alwyn Dsouza',
  title: 'Alwyn Dsouza — Data Engineering, DataOps & AI',
  description:
    'Practical writing on Data Engineering, DataOps, dbt, Databricks, and AI Agents. Articles, open-source projects, and lessons from production data platforms.',
  author: {
    name: 'Alwyn Dsouza',
    email: 'alwyn.anil@gmail.com',
    twitter: '', // e.g. '@alwyndsouza' if the user has a handle
  },
  defaultOgImage: '/og-default.svg',
  language: 'en',
} as const;

export const currentlyExploring = [
  'dbt Fusion Engine',
  'AI Agents + MCP',
  'Semantic Layers',
  'BI-as-Code',
];

/**
 * Curated, top-level categories shown on the Articles page. The raw
 * `category` value in each article's frontmatter is mapped onto one of
 * these labels via `match`. Order here is the order shown in the UI.
 */
export const articleCategories: ReadonlyArray<{
  label: string;
  match: readonly string[];
}> = [
  {
    label: 'Data Engineering',
    match: [
      'data-engineering',
      'data',
      'dbt',
      'dbt-labs',
      'risingwave',
      'code-quality',
      'software-engineering',
      'python',
    ],
  },
  {
    label: 'Architecture & Governance',
    match: ['data-architecture', 'data-quality'],
  },
  {
    label: 'AI & MLOps',
    match: ['ai', 'artificial-intelligence', 'mlops'],
  },
  {
    label: 'DevOps & Security',
    match: ['devops', 'security'],
  },
] as const;

/** Resolve a raw frontmatter category to its curated bucket label. */
export function getArticleCategoryBucket(rawCategory: string): string | null {
  const lower = rawCategory.toLowerCase();
  for (const bucket of articleCategories) {
    if (bucket.match.includes(lower)) return bucket.label;
  }
  return null;
}
