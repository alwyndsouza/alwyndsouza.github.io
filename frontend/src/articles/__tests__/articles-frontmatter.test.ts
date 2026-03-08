import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import yaml from 'js-yaml';

interface ArticleFrontmatter {
  title: string;
  slug: string;
  date: string | Date;
  category: string;
  excerpt: string;
  published: boolean;
  tags: string[];
  coverImage?: string;
}

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

function getArticleFiles(): string[] {
  const articlesDir = join(__dirname, '..');
  const files = readdirSync(articlesDir);
  return files
    .filter(file => file.endsWith('.md') && !file.startsWith('_'))
    .map(file => join(articlesDir, file));
}

function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

function isKebabCase(str: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(str);
}

describe('Article Frontmatter Validation', () => {
  const articleFiles = getArticleFiles();

  describe('All article files', () => {
    it('should find all 24 article files', () => {
      expect(articleFiles.length).toBeGreaterThanOrEqual(24);
    });
  });

  articleFiles.forEach((filePath) => {
    const fileName = filePath.split('/').pop() || '';

    describe(`${fileName}`, () => {
      const fileContent = readFileSync(filePath, 'utf-8');
      const { data: frontmatter, content } = parseFrontmatter(fileContent);

      it('should have valid YAML frontmatter', () => {
        expect(Object.keys(frontmatter).length).toBeGreaterThan(0);
      });

      it('should have a title field', () => {
        expect(frontmatter.title).toBeDefined();
        expect(typeof frontmatter.title).toBe('string');
        expect((frontmatter.title as string).length).toBeGreaterThan(0);
      });

      it('should have a slug field', () => {
        expect(frontmatter.slug).toBeDefined();
        expect(typeof frontmatter.slug).toBe('string');
      });

      it('should have a slug in kebab-case format', () => {
        const slug = frontmatter.slug as string;
        expect(isKebabCase(slug)).toBe(true);
      });

      it('should have a valid date field', () => {
        expect(frontmatter.date).toBeDefined();
        const dateStr = String(frontmatter.date);
        expect(isValidDate(dateStr)).toBe(true);
      });

      it('should have a category field', () => {
        expect(frontmatter.category).toBeDefined();
        expect(typeof frontmatter.category).toBe('string');
        expect((frontmatter.category as string).length).toBeGreaterThan(0);
      });

      it('should have an excerpt field', () => {
        expect(frontmatter.excerpt).toBeDefined();
        expect(typeof frontmatter.excerpt).toBe('string');
        expect((frontmatter.excerpt as string).length).toBeGreaterThan(0);
      });

      it('should have a published field with boolean value', () => {
        expect(frontmatter.published).toBeDefined();
        expect(typeof frontmatter.published).toBe('boolean');
      });

      it('should have a tags field as an array', () => {
        expect(frontmatter.tags).toBeDefined();
        expect(Array.isArray(frontmatter.tags)).toBe(true);
      });

      it('should have at least one tag', () => {
        const tags = frontmatter.tags as string[];
        expect(tags.length).toBeGreaterThan(0);
      });

      it('should have all tags as strings', () => {
        const tags = frontmatter.tags as unknown[];
        tags.forEach(tag => {
          expect(typeof tag).toBe('string');
        });
      });

      it('should have coverImage field (can be empty or URL)', () => {
        if (frontmatter.coverImage !== undefined) {
          expect(typeof frontmatter.coverImage).toBe('string');
        }
      });

      it('should have non-empty content after frontmatter', () => {
        expect(content.length).toBeGreaterThan(0);
      });

      it('should have content with meaningful text (>100 characters)', () => {
        expect(content.length).toBeGreaterThan(100);
      });

      it('should have filename matching slug with .md extension', () => {
        const slug = frontmatter.slug as string;
        const expectedFileName = `${slug}.md`;
        expect(fileName).toBe(expectedFileName);
      });
    });
  });

  describe('Cross-article validation', () => {
    it('should have unique slugs across all articles', () => {
      const slugs = articleFiles.map(filePath => {
        const fileContent = readFileSync(filePath, 'utf-8');
        const { data } = parseFrontmatter(fileContent);
        return data.slug as string;
      });

      const uniqueSlugs = new Set(slugs);
      expect(uniqueSlugs.size).toBe(slugs.length);
    });

    it('should have unique titles across all articles', () => {
      const titles = articleFiles.map(filePath => {
        const fileContent = readFileSync(filePath, 'utf-8');
        const { data } = parseFrontmatter(fileContent);
        return data.title as string;
      });

      const uniqueTitles = new Set(titles);
      expect(uniqueTitles.size).toBe(titles.length);
    });

    it('should have consistent category naming (no typos)', () => {
      const categories = articleFiles.map(filePath => {
        const fileContent = readFileSync(filePath, 'utf-8');
        const { data } = parseFrontmatter(fileContent);
        return data.category as string;
      });

      const categorySet = new Set(categories);
      // All categories should follow a pattern (lowercase with hyphens or single words)
      categorySet.forEach(category => {
        expect(category).toMatch(/^[a-z-]+$/i);
      });
    });

    it('should have valid published dates (not in far future)', () => {
      const currentDate = new Date();
      const maxFutureDate = new Date();
      maxFutureDate.setFullYear(currentDate.getFullYear() + 2);

      articleFiles.forEach(filePath => {
        const fileContent = readFileSync(filePath, 'utf-8');
        const { data } = parseFrontmatter(fileContent);
        const articleDate = new Date(String(data.date));

        expect(articleDate.getTime()).toBeLessThanOrEqual(maxFutureDate.getTime());
      });
    });
  });

  describe('Content quality checks', () => {
    it('should have properly closed frontmatter delimiters in all files', () => {
      articleFiles.forEach(filePath => {
        const fileContent = readFileSync(filePath, 'utf-8');
        const frontmatterMatches = fileContent.match(/^---/gm);

        // Should have at least 2 occurrences (opening and closing)
        expect(frontmatterMatches).not.toBeNull();
        expect(frontmatterMatches!.length).toBeGreaterThanOrEqual(2);
      });
    });

    it('should not have duplicate content across articles', () => {
      const contentMap = new Map<string, string>();

      articleFiles.forEach(filePath => {
        const fileContent = readFileSync(filePath, 'utf-8');
        const { content } = parseFrontmatter(fileContent);
        const fileName = filePath.split('/').pop() || '';

        // Check first 500 characters as a fingerprint
        const fingerprint = content.substring(0, 500);

        if (contentMap.has(fingerprint)) {
          throw new Error(
            `Duplicate content detected between ${fileName} and ${contentMap.get(fingerprint)}`
          );
        }

        contentMap.set(fingerprint, fileName);
      });

      expect(contentMap.size).toBe(articleFiles.length);
    });
  });

  describe('Edge cases and robustness', () => {
    it('should handle articles with special characters in titles', () => {
      articleFiles.forEach(filePath => {
        const fileContent = readFileSync(filePath, 'utf-8');
        const { data } = parseFrontmatter(fileContent);
        const title = data.title as string;

        // Title should not contain newlines or tabs
        expect(title).not.toMatch(/[\n\t]/);
      });
    });

    it('should have reasonable excerpt lengths (not too short or too long)', () => {
      articleFiles.forEach(filePath => {
        const fileContent = readFileSync(filePath, 'utf-8');
        const { data } = parseFrontmatter(fileContent);
        const excerpt = data.excerpt as string;

        expect(excerpt.length).toBeGreaterThan(20);
        expect(excerpt.length).toBeLessThan(500);
      });
    });

    it('should have tags in lowercase or consistent format', () => {
      articleFiles.forEach(filePath => {
        const fileContent = readFileSync(filePath, 'utf-8');
        const { data } = parseFrontmatter(fileContent);
        const tags = data.tags as string[];

        tags.forEach(tag => {
          // Tags should be lowercase or follow kebab-case
          expect(tag).toMatch(/^[a-z0-9-]+$/);
        });
      });
    });
  });
});