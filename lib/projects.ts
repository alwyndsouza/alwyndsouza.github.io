import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";
import { z } from "zod";
import { STATUS_CONFIG } from "./types";
import type { Project } from "./types";

export type { Project };
export { STATUS_CONFIG };

const PROJECTS_DIR = path.join(process.cwd(), "content/projects");

const marked = new Marked(
  markedHighlight({
    langPrefix: "hljs language-",
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : "plaintext";
      return hljs.highlight(code, { language }).value;
    },
  })
);

const ProjectSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  status: z.enum(["production", "development", "beta", "archived"]),
  category: z.string(),
  tech: z.array(z.string()),
  featured: z.boolean().optional().default(false),
  draft: z.boolean().optional().default(false),
  order: z.number().optional(),
  completedDate: z.string().optional(),
  links: z
    .object({
      github: z.string().optional(),
      demo: z.string().optional(),
    })
    .optional(),
  coverImage: z.string().optional(),
});

export function getAllProjects(includeDrafts = false): Project[] {
  if (!fs.existsSync(PROJECTS_DIR)) return [];

  const files = fs.readdirSync(PROJECTS_DIR).filter((f) => f.endsWith(".md"));

  const projects = files
    .map((filename) => {
      const filePath = path.join(PROJECTS_DIR, filename);
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(raw);

      const parsed = ProjectSchema.safeParse(data);
      if (!parsed.success) {
        console.warn(
          `Invalid project frontmatter in ${filename}:`,
          parsed.error.issues
        );
        return null;
      }

      const project = parsed.data;
      if (!includeDrafts && project.draft) return null;

      const htmlContent = marked.parse(content) as string;

      return { ...project, htmlContent } satisfies Project;
    })
    .filter((p): p is NonNullable<typeof p> => p !== null) as Project[];

  return projects.sort((a, b) => {
    if (a.status === "archived" && b.status !== "archived") return 1;
    if (b.status === "archived" && a.status !== "archived") return -1;
    if (a.order !== undefined && b.order !== undefined)
      return a.order - b.order;
    if (a.order !== undefined) return -1;
    if (b.order !== undefined) return 1;
    if (a.completedDate && b.completedDate) {
      return (
        new Date(b.completedDate).getTime() -
        new Date(a.completedDate).getTime()
      );
    }
    return 0;
  });
}

export function getFeaturedProjects(): Project[] {
  return getAllProjects().filter(
    (p) => p.featured && p.status !== "archived"
  );
}

export function getProjectById(id: string): Project | null {
  return getAllProjects(true).find((p) => p.id === id) ?? null;
}

export function getAllProjectIds(): string[] {
  return getAllProjects(true).map((p) => p.id);
}
