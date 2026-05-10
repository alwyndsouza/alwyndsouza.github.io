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
