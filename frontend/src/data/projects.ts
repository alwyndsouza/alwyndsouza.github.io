import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import yaml from 'js-yaml';
import { z } from 'zod';

const marked = new Marked(
  markedHighlight({
    emptyLangClass: 'hljs',
    langPrefix: 'hljs language-',
    highlight(code: string, lang: string) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    }
  })
);

const projectSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  status: z.enum(['production', 'development', 'beta', 'archived']),
  category: z.string(),
  tech: z.array(z.string()),
  completedDate: z.string().optional(),
  order: z.number().optional(),
  featured: z.boolean().optional().default(false),
  draft: z.boolean().optional().default(false),
  links: z.object({
    demo: z.string().optional(),
    github: z.string().optional(),
  }).optional(),
  coverImage: z.string().optional(),
});

export type Project = z.infer<typeof projectSchema> & {
  content: string;
  htmlContent: string;
};

function parseFrontmatter(fileContent: string): { data: Record<string, unknown>; content: string } {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
  const match = fileContent.match(frontmatterRegex);

  if (!match) {
    return { data: {}, content: fileContent };
  }

  const [, frontmatterStr, content] = match;

  try {
    const data = yaml.load(frontmatterStr) as Record<string, unknown>;
    return { data, content: content.trim() };
  } catch (error) {
    console.error('Error parsing YAML frontmatter:', error);
    return { data: {}, content: fileContent };
  }
}

const projectFiles = import.meta.glob('../projects/*.md', {
  query: '?raw',
  eager: true,
});

const showUnpublished = import.meta.env.DEV;

export const projects: Project[] = Object.entries(projectFiles)
  .map(([filepath, file]) => {
    const rawContent = typeof file === 'string' ? file : (file as { default: string }).default;
    const { data: frontmatter, content } = parseFrontmatter(rawContent);

    const parseResult = projectSchema.safeParse(frontmatter);
    if (!parseResult.success) {
      console.error(`Invalid project frontmatter in ${filepath}:`, parseResult.error.issues);
      return null;
    }

    return {
      ...parseResult.data,
      content,
      htmlContent: marked.parse(content) as string,
    };
  })
  .filter((project): project is Project => project !== null)
  .filter(project => showUnpublished || !project.draft)
  .sort((a, b) => {
    if (a.status === 'archived' && b.status !== 'archived') return 1;
    if (a.status !== 'archived' && b.status === 'archived') return -1;
    if (a.order !== undefined && b.order !== undefined) return a.order - b.order;
    if (a.order !== undefined) return -1;
    if (b.order !== undefined) return 1;
    if (a.completedDate && b.completedDate) {
      return new Date(b.completedDate).getTime() - new Date(a.completedDate).getTime();
    }
    return 0;
  });

export const featuredProjects = projects.filter(p => p.featured && !p.draft);

export function getProjectById(id: string): Project | undefined {
  return projects.find(p => p.id === id);
}
