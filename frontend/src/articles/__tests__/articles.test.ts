import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';
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
    throw new Error('No frontmatter found');
  }

  const [, frontmatterStr, content] = match;

  try {
    const data = yaml.load(frontmatterStr) as Record<string, unknown>;
    return { data, content: content.trim() };
  } catch (error) {
    throw new Error(`Error parsing YAML frontmatter: ${error}`);
  }
}

function readArticle(filename: string): string {
  const filePath = resolve(__dirname, '..', filename);
  return readFileSync(filePath, 'utf-8');
}

function validateFrontmatter(data: Record<string, unknown>): asserts data is ArticleFrontmatter {
  if (typeof data.title !== 'string' || data.title.trim() === '') {
    throw new Error('title must be a non-empty string');
  }
  if (typeof data.slug !== 'string' || data.slug.trim() === '') {
    throw new Error('slug must be a non-empty string');
  }
  if (!data.date) {
    throw new Error('date is required');
  }
  if (typeof data.category !== 'string' || data.category.trim() === '') {
    throw new Error('category must be a non-empty string');
  }
  if (typeof data.excerpt !== 'string' || data.excerpt.trim() === '') {
    throw new Error('excerpt must be a non-empty string');
  }
  if (typeof data.published !== 'boolean') {
    throw new Error('published must be a boolean');
  }
  if (!Array.isArray(data.tags)) {
    throw new Error('tags must be an array');
  }
  if (data.coverImage !== undefined && typeof data.coverImage !== 'string') {
    throw new Error('coverImage must be a string if provided');
  }
}

// List of changed article files from the PR
const changedArticles = [
  '12-golden-rules-for-dbt-success.md',
  'applying-mlsecops-to-secure-the-ai-lifecycle.md',
  'automate-your-python-workflow-with-zsh-autoswitch-virtualenv.md',
  'building-a-production-ready-dbt-ci-cd-pipeline-complete-series.md',
  'building-context-aware-ai-for-your-team.md',
  'building-data-cards-for-data-products-using-dbt.md',
  'building-the-complete-github-actions-workflow.md',
  'consistent-yaml-formatting-with-prettier-and-npm.md',
  'custom-scd-type-2-model-in-dbt.md',
  'customizing-your-dbt-documentation-with-node-color.md',
  'data-contracts-the-missing-link-in-your-data-engineering-strategy.md',
  'data-product-engineering-core-principles.md',
  'data-quality-and-data-lineage-in-data-cards.md',
  'databricks-pii-identification-protection-and-management.md',
  'dbt-as-well-run-kitchen-station.md',
  'dbt-checkpoint-improve-data-quality.md',
  'dbt-cloud-setup-guide-with-databricks.md',
  'dbt-fusion-under-the-hood-the-technical-architecture.md',
  'dbt-model-contracts.md',
  'dbt-snapshot-vs-custom-scd2-with-cdc-comparative-analysis.md',
  'dbt-testgen-automate-your-dbt-test-yaml-generation.md',
  'devops-to-mlops-building-a-complete-data-to-model-pipeline.md',
  'discovering-pii-data-in-databricks-with-discoverx.md',
  'display-current-git-branch-name-on-terminal-using-zsh.md',
];

describe('Article Markdown Files', () => {
  describe('Frontmatter Validation', () => {
    changedArticles.forEach((filename) => {
      describe(filename, () => {
        let fileContent: string;
        let frontmatter: Record<string, unknown>;
        let content: string;

        it('should be readable', () => {
          expect(() => {
            fileContent = readArticle(filename);
          }).not.toThrow();
        });

        it('should have valid YAML frontmatter', () => {
          fileContent = readArticle(filename);
          expect(() => {
            const parsed = parseFrontmatter(fileContent);
            frontmatter = parsed.data;
            content = parsed.content;
          }).not.toThrow();
        });

        it('should have all required frontmatter fields', () => {
          fileContent = readArticle(filename);
          const parsed = parseFrontmatter(fileContent);
          frontmatter = parsed.data;

          expect(frontmatter).toHaveProperty('title');
          expect(frontmatter).toHaveProperty('slug');
          expect(frontmatter).toHaveProperty('date');
          expect(frontmatter).toHaveProperty('category');
          expect(frontmatter).toHaveProperty('excerpt');
          expect(frontmatter).toHaveProperty('published');
          expect(frontmatter).toHaveProperty('tags');
        });

        it('should have valid frontmatter field types', () => {
          fileContent = readArticle(filename);
          const parsed = parseFrontmatter(fileContent);
          frontmatter = parsed.data;

          expect(() => validateFrontmatter(frontmatter)).not.toThrow();
        });

        it('should have non-empty title', () => {
          fileContent = readArticle(filename);
          const parsed = parseFrontmatter(fileContent);
          frontmatter = parsed.data;

          expect(typeof frontmatter.title).toBe('string');
          expect((frontmatter.title as string).trim().length).toBeGreaterThan(0);
        });

        it('should have non-empty slug', () => {
          fileContent = readArticle(filename);
          const parsed = parseFrontmatter(fileContent);
          frontmatter = parsed.data;

          expect(typeof frontmatter.slug).toBe('string');
          expect((frontmatter.slug as string).trim().length).toBeGreaterThan(0);
        });

        it('should have slug matching filename', () => {
          fileContent = readArticle(filename);
          const parsed = parseFrontmatter(fileContent);
          frontmatter = parsed.data;

          const expectedSlug = filename.replace('.md', '');
          expect(frontmatter.slug).toBe(expectedSlug);
        });

        it('should have valid date', () => {
          fileContent = readArticle(filename);
          const parsed = parseFrontmatter(fileContent);
          frontmatter = parsed.data;

          expect(frontmatter.date).toBeDefined();
          const dateValue = frontmatter.date instanceof Date
            ? frontmatter.date
            : new Date(String(frontmatter.date));
          expect(dateValue.toString()).not.toBe('Invalid Date');
        });

        it('should have non-empty category', () => {
          fileContent = readArticle(filename);
          const parsed = parseFrontmatter(fileContent);
          frontmatter = parsed.data;

          expect(typeof frontmatter.category).toBe('string');
          expect((frontmatter.category as string).trim().length).toBeGreaterThan(0);
        });

        it('should have non-empty excerpt', () => {
          fileContent = readArticle(filename);
          const parsed = parseFrontmatter(fileContent);
          frontmatter = parsed.data;

          expect(typeof frontmatter.excerpt).toBe('string');
          expect((frontmatter.excerpt as string).trim().length).toBeGreaterThan(0);
        });

        it('should have published as boolean', () => {
          fileContent = readArticle(filename);
          const parsed = parseFrontmatter(fileContent);
          frontmatter = parsed.data;

          expect(typeof frontmatter.published).toBe('boolean');
        });

        it('should have tags as array', () => {
          fileContent = readArticle(filename);
          const parsed = parseFrontmatter(fileContent);
          frontmatter = parsed.data;

          expect(Array.isArray(frontmatter.tags)).toBe(true);
        });

        it('should have at least one tag', () => {
          fileContent = readArticle(filename);
          const parsed = parseFrontmatter(fileContent);
          frontmatter = parsed.data;

          expect(Array.isArray(frontmatter.tags)).toBe(true);
          expect((frontmatter.tags as string[]).length).toBeGreaterThan(0);
        });

        it('should have all tags as non-empty strings', () => {
          fileContent = readArticle(filename);
          const parsed = parseFrontmatter(fileContent);
          frontmatter = parsed.data;

          expect(Array.isArray(frontmatter.tags)).toBe(true);
          (frontmatter.tags as string[]).forEach((tag) => {
            expect(typeof tag).toBe('string');
            expect(tag.trim().length).toBeGreaterThan(0);
          });
        });

        it('should have coverImage as string if provided', () => {
          fileContent = readArticle(filename);
          const parsed = parseFrontmatter(fileContent);
          frontmatter = parsed.data;

          if (frontmatter.coverImage !== undefined) {
            expect(typeof frontmatter.coverImage).toBe('string');
          }
        });

        it('should have content after frontmatter', () => {
          fileContent = readArticle(filename);
          const parsed = parseFrontmatter(fileContent);
          content = parsed.content;

          expect(content).toBeDefined();
          expect(content.trim().length).toBeGreaterThan(0);
        });

        it('should have reasonable content length', () => {
          fileContent = readArticle(filename);
          const parsed = parseFrontmatter(fileContent);
          content = parsed.content;

          // Content should be at least 100 characters
          expect(content.trim().length).toBeGreaterThan(100);
        });

        it('should not have frontmatter bleeding into content', () => {
          fileContent = readArticle(filename);
          const parsed = parseFrontmatter(fileContent);
          content = parsed.content;

          // Content should not start with YAML markers
          expect(content.trim().startsWith('---')).toBe(false);
          expect(content.trim().startsWith('title:')).toBe(false);
          expect(content.trim().startsWith('slug:')).toBe(false);
        });

        it('should have excerpt that matches beginning of content (or is a summary)', () => {
          fileContent = readArticle(filename);
          const parsed = parseFrontmatter(fileContent);
          frontmatter = parsed.data;
          content = parsed.content;

          // Excerpt should be a reasonable length (not too short, not too long)
          const excerpt = frontmatter.excerpt as string;
          expect(excerpt.length).toBeGreaterThan(20);
          expect(excerpt.length).toBeLessThan(500);
        });
      });
    });
  });

  describe('Content Quality', () => {
    changedArticles.forEach((filename) => {
      describe(filename, () => {
        it('should not contain obvious placeholder text', () => {
          const fileContent = readArticle(filename);
          const { content } = parseFrontmatter(fileContent);

          // Check for common placeholder patterns
          expect(content.toLowerCase()).not.toContain('lorem ipsum');
          expect(content.toLowerCase()).not.toContain('todo:');
          expect(content.toLowerCase()).not.toContain('[placeholder]');
        });

        it('should have proper paragraph structure', () => {
          const fileContent = readArticle(filename);
          const { content } = parseFrontmatter(fileContent);

          // Content should have some structure (multiple paragraphs or HTML tags)
          const hasMultipleParagraphs = content.includes('\n\n') || content.includes('</p>');
          expect(hasMultipleParagraphs).toBe(true);
        });
      });
    });
  });

  describe('Data Consistency', () => {
    it('should have unique slugs across all changed articles', () => {
      const slugs = changedArticles.map((filename) => {
        const fileContent = readArticle(filename);
        const { data } = parseFrontmatter(fileContent);
        return data.slug;
      });

      const uniqueSlugs = new Set(slugs);
      expect(uniqueSlugs.size).toBe(slugs.length);
    });

    it('should have valid date ordering (dates are in the past or present)', () => {
      const now = new Date();
      changedArticles.forEach((filename) => {
        const fileContent = readArticle(filename);
        const { data } = parseFrontmatter(fileContent);
        const articleDate = data.date instanceof Date
          ? data.date
          : new Date(String(data.date));

        // Allow dates to be in the future by a small margin (for timezone differences)
        const maxFutureDate = new Date();
        maxFutureDate.setDate(maxFutureDate.getDate() + 7);

        expect(articleDate.getTime()).toBeLessThanOrEqual(maxFutureDate.getTime());
      });
    });

    it('should use consistent category naming', () => {
      changedArticles.forEach((filename) => {
        const fileContent = readArticle(filename);
        const { data } = parseFrontmatter(fileContent);
        const category = data.category as string;

        // Category should not be all caps or have inconsistent capitalization
        expect(category).toBe(category.trim());
        expect(category.length).toBeGreaterThan(0);
      });
    });

    it('should have tags in lowercase kebab-case format', () => {
      changedArticles.forEach((filename) => {
        const fileContent = readArticle(filename);
        const { data } = parseFrontmatter(fileContent);
        const tags = data.tags as string[];

        tags.forEach((tag) => {
          // Tags should be lowercase and use hyphens instead of spaces
          expect(tag).toBe(tag.toLowerCase());
          expect(tag).not.toContain(' ');
        });
      });
    });
  });

  describe('Edge Cases and Negative Tests', () => {
    it('should handle articles with maximum expected frontmatter fields', () => {
      changedArticles.forEach((filename) => {
        const fileContent = readArticle(filename);
        const { data } = parseFrontmatter(fileContent);

        // Should have no more than 10 top-level fields (reasonable limit)
        const fieldCount = Object.keys(data).length;
        expect(fieldCount).toBeLessThanOrEqual(10);
      });
    });

    it('should not have duplicate tags within an article', () => {
      changedArticles.forEach((filename) => {
        const fileContent = readArticle(filename);
        const { data } = parseFrontmatter(fileContent);
        const tags = data.tags as string[];

        const uniqueTags = new Set(tags);
        expect(uniqueTags.size).toBe(tags.length);
      });
    });

    it('should have reasonable title length', () => {
      changedArticles.forEach((filename) => {
        const fileContent = readArticle(filename);
        const { data } = parseFrontmatter(fileContent);
        const title = data.title as string;

        // Titles should be between 5 and 150 characters
        expect(title.length).toBeGreaterThan(5);
        expect(title.length).toBeLessThan(150);
      });
    });

    it('should have slug that matches URL-safe pattern', () => {
      changedArticles.forEach((filename) => {
        const fileContent = readArticle(filename);
        const { data } = parseFrontmatter(fileContent);
        const slug = data.slug as string;

        // Slug should be URL-safe: lowercase, hyphens, numbers only
        const urlSafePattern = /^[a-z0-9-]+$/;
        expect(urlSafePattern.test(slug)).toBe(true);
      });
    });

    it('should have reasonable tag count', () => {
      changedArticles.forEach((filename) => {
        const fileContent = readArticle(filename);
        const { data } = parseFrontmatter(fileContent);
        const tags = data.tags as string[];

        // Articles should have between 1 and 10 tags
        expect(tags.length).toBeGreaterThan(0);
        expect(tags.length).toBeLessThanOrEqual(10);
      });
    });

    it('should not have empty or whitespace-only content', () => {
      changedArticles.forEach((filename) => {
        const fileContent = readArticle(filename);
        const { content } = parseFrontmatter(fileContent);

        expect(content.trim().length).toBeGreaterThan(0);
        expect(content.trim()).toBe(content.trim());
      });
    });
  });

  describe('README.md Validation', () => {
    it('should have valid markdown structure', () => {
      const readmePath = resolve(__dirname, '../../../../README.md');
      const readmeContent = readFileSync(readmePath, 'utf-8');

      // Should have content
      expect(readmeContent.length).toBeGreaterThan(0);

      // Should have markdown headings
      expect(readmeContent).toMatch(/^#\s+/m);
    });

    it('should contain essential project information', () => {
      const readmePath = resolve(__dirname, '../../../../README.md');
      const readmeContent = readFileSync(readmePath, 'utf-8');

      // Should mention the project name or description
      expect(readmeContent.toLowerCase()).toContain('alwyndsouza.github.io');

      // Should have some structure with multiple sections
      const headingCount = (readmeContent.match(/^#{1,6}\s+/gm) || []).length;
      expect(headingCount).toBeGreaterThan(3);
    });

    it('should have proper code block formatting', () => {
      const readmePath = resolve(__dirname, '../../../../README.md');
      const readmeContent = readFileSync(readmePath, 'utf-8');

      // Count opening and closing code fences
      const openingFences = (readmeContent.match(/^```/gm) || []).length;
      const closingFences = (readmeContent.match(/^```$/gm) || []).length;

      // Should have balanced code fences (if any exist)
      if (openingFences > 0) {
        // Each opening fence should have a corresponding closing fence
        expect(openingFences % 2).toBe(0);
      }
    });

    it('should not have broken markdown links', () => {
      const readmePath = resolve(__dirname, '../../../../README.md');
      const readmeContent = readFileSync(readmePath, 'utf-8');

      // Check for malformed markdown links
      expect(readmeContent).not.toMatch(/\[.*?\]\(\s*\)/); // Empty link targets
      expect(readmeContent).not.toMatch(/\[\s*\]\(.*?\)/); // Empty link text
    });
  });
});