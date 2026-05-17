export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  htmlContent: string;
  coverImage?: string;
  published: boolean;
  tags: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: "production" | "development" | "beta" | "archived";
  category: string;
  tech: string[];
  featured?: boolean;
  draft?: boolean;
  order?: number;
  completedDate?: string;
  links?: {
    github?: string;
    demo?: string;
  };
  coverImage?: string;
  htmlContent: string;
}

export const ARTICLE_CATEGORIES = [
  {
    label: "Data Engineering",
    value: "data-engineering",
    match: ["Data Engineering", "dbt", "dbt-labs", "Data", "Code Quality"],
  },
  {
    label: "Architecture & Governance",
    value: "architecture",
    match: ["Data Architecture", "Data Quality", "RisingWave"],
  },
  {
    label: "AI & MLOps",
    value: "ai-mlops",
    match: ["AI", "MLOps", "Artificial Intelligence", "Python"],
  },
  {
    label: "DevOps & Security",
    value: "devops",
    match: ["DevOps", "Security", "Software Engineering"],
  },
] as const;

export function getCategoryForArticle(category: string): string {
  for (const cat of ARTICLE_CATEGORIES) {
    if (
      cat.match.some((m) =>
        category.toLowerCase().includes(m.toLowerCase())
      )
    ) {
      return cat.value;
    }
  }
  return "data-engineering";
}

export const STATUS_CONFIG = {
  production: {
    label: "Production",
    color: "text-emerald-400",
    dot: "bg-emerald-400",
  },
  development: {
    label: "Development",
    color: "text-amber-400",
    dot: "bg-amber-400",
  },
  beta: { label: "Beta", color: "text-blue-400", dot: "bg-blue-400" },
  archived: {
    label: "Archived",
    color: "text-zinc-500",
    dot: "bg-zinc-500",
  },
} as const;
