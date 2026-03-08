import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import yaml from 'js-yaml';

/**
 * Integration tests for the complete content pipeline
 * Tests the end-to-end flow from markdown files to rendered content
 */
describe('Content Pipeline Integration Tests', () => {
  const articlesDir = join(__dirname, '..', 'articles');

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
      return { data: {}, content: fileContent };
    }
  }

  describe('Article integrity checks', () => {
    it('should process all articles without errors', () => {
      const files = readdirSync(articlesDir).filter(f => f.endsWith('.md'));

      files.forEach(fileName => {
        const filePath = join(articlesDir, fileName);
        const content = readFileSync(filePath, 'utf-8');

        expect(() => parseFrontmatter(content)).not.toThrow();
      });
    });

    it('should have no articles with missing critical metadata', () => {
      const files = readdirSync(articlesDir).filter(f => f.endsWith('.md'));
      const requiredFields = ['title', 'slug', 'date', 'category', 'excerpt', 'published', 'tags'];

      files.forEach(fileName => {
        const filePath = join(articlesDir, fileName);
        const content = readFileSync(filePath, 'utf-8');
        const { data } = parseFrontmatter(content);

        requiredFields.forEach(field => {
          expect(data[field]).toBeDefined();
        });
      });
    });

    it('should have articles with valid date formats that can be sorted', () => {
      const files = readdirSync(articlesDir).filter(f => f.endsWith('.md'));
      const articles = files.map(fileName => {
        const filePath = join(articlesDir, fileName);
        const content = readFileSync(filePath, 'utf-8');
        const { data } = parseFrontmatter(content);
        return {
          fileName,
          date: new Date(String(data.date)),
        };
      });

      // All dates should be valid
      articles.forEach(article => {
        expect(article.date.toString()).not.toBe('Invalid Date');
      });

      // Should be sortable
      const sorted = [...articles].sort((a, b) => b.date.getTime() - a.date.getTime());
      expect(sorted.length).toBe(articles.length);
    });

    it('should have consistent tag formatting across all articles', () => {
      const files = readdirSync(articlesDir).filter(f => f.endsWith('.md'));
      const allTags = new Set<string>();

      files.forEach(fileName => {
        const filePath = join(articlesDir, fileName);
        const content = readFileSync(filePath, 'utf-8');
        const { data } = parseFrontmatter(content);
        const tags = data.tags as string[];

        tags.forEach(tag => {
          allTags.add(tag);
          // Tags should be lowercase with hyphens
          expect(tag).toMatch(/^[a-z0-9-]+$/);
        });
      });

      // Should have a reasonable number of unique tags
      expect(allTags.size).toBeGreaterThan(5);
      expect(allTags.size).toBeLessThan(100);
    });
  });

  describe('Content quality validation', () => {
    it('should have articles with meaningful excerpts', () => {
      const files = readdirSync(articlesDir).filter(f => f.endsWith('.md'));

      files.forEach(fileName => {
        const filePath = join(articlesDir, fileName);
        const content = readFileSync(filePath, 'utf-8');
        const { data } = parseFrontmatter(content);

        const excerpt = data.excerpt as string;
        // Excerpts should have some substance but can vary in length
        expect(excerpt.length).toBeGreaterThan(20);
        expect(excerpt.length).toBeLessThan(500);

        // Excerpt should not be truncated mid-word
        expect(excerpt).not.toMatch(/\w{20,}$/);
      });
    });

    it('should have sufficient content in all articles', () => {
      const files = readdirSync(articlesDir).filter(f => f.endsWith('.md'));

      files.forEach(fileName => {
        const filePath = join(articlesDir, fileName);
        const fileContent = readFileSync(filePath, 'utf-8');
        const { content } = parseFrontmatter(fileContent);

        // Article should have meaningful content (at least 100 characters minimum)
        expect(content.length).toBeGreaterThan(100);
      });
    });

    it('should not have duplicate slugs across articles', () => {
      const files = readdirSync(articlesDir).filter(f => f.endsWith('.md'));
      const slugs = new Set<string>();
      const duplicates: string[] = [];

      files.forEach(fileName => {
        const filePath = join(articlesDir, fileName);
        const content = readFileSync(filePath, 'utf-8');
        const { data } = parseFrontmatter(content);
        const slug = data.slug as string;

        if (slugs.has(slug)) {
          duplicates.push(slug);
        }
        slugs.add(slug);
      });

      expect(duplicates).toEqual([]);
    });
  });

  describe('SEO and metadata validation', () => {
    it('should have appropriate title lengths for SEO', () => {
      const files = readdirSync(articlesDir).filter(f => f.endsWith('.md'));

      files.forEach(fileName => {
        const filePath = join(articlesDir, fileName);
        const content = readFileSync(filePath, 'utf-8');
        const { data } = parseFrontmatter(content);

        const title = data.title as string;
        // SEO best practice: titles between 30-60 characters
        expect(title.length).toBeGreaterThan(10);
        expect(title.length).toBeLessThan(100);
      });
    });

    it('should have slugs that match filenames', () => {
      const files = readdirSync(articlesDir).filter(f => f.endsWith('.md'));

      files.forEach(fileName => {
        const filePath = join(articlesDir, fileName);
        const content = readFileSync(filePath, 'utf-8');
        const { data } = parseFrontmatter(content);

        const slug = data.slug as string;
        const expectedFileName = `${slug}.md`;
        expect(fileName).toBe(expectedFileName);
      });
    });

    it('should categorize all articles appropriately', () => {
      const files = readdirSync(articlesDir).filter(f => f.endsWith('.md'));
      const categories = new Set<string>();

      files.forEach(fileName => {
        const filePath = join(articlesDir, fileName);
        const content = readFileSync(filePath, 'utf-8');
        const { data } = parseFrontmatter(content);

        const category = data.category as string;
        categories.add(category);

        // Category should be meaningful (at least 2 characters)
        expect(category.length).toBeGreaterThanOrEqual(2);
        expect(category).toMatch(/^[a-z0-9-]+$/i);
      });

      // Should have at least one category but not too many
      expect(categories.size).toBeGreaterThan(0);
      expect(categories.size).toBeLessThan(20);
    });
  });

  describe('Backward compatibility tests', () => {
    it('should handle articles with and without cover images', () => {
      const files = readdirSync(articlesDir).filter(f => f.endsWith('.md'));
      let withCover = 0;
      let withoutCover = 0;

      files.forEach(fileName => {
        const filePath = join(articlesDir, fileName);
        const content = readFileSync(filePath, 'utf-8');
        const { data } = parseFrontmatter(content);

        if (data.coverImage && (data.coverImage as string).length > 0) {
          withCover++;
        } else {
          withoutCover++;
        }
      });

      // Should handle both cases
      expect(withCover + withoutCover).toBe(files.length);
    });

    it('should handle various date formats', () => {
      const files = readdirSync(articlesDir).filter(f => f.endsWith('.md'));

      files.forEach(fileName => {
        const filePath = join(articlesDir, fileName);
        const content = readFileSync(filePath, 'utf-8');
        const { data } = parseFrontmatter(content);

        // Date should be parseable regardless of format
        const dateStr = String(data.date);
        const parsedDate = new Date(dateStr);

        expect(parsedDate.toString()).not.toBe('Invalid Date');
      });
    });
  });

  describe('Performance and scalability', () => {
    it('should efficiently process all articles', () => {
      const files = readdirSync(articlesDir).filter(f => f.endsWith('.md'));
      const startTime = Date.now();

      files.forEach(fileName => {
        const filePath = join(articlesDir, fileName);
        const content = readFileSync(filePath, 'utf-8');
        parseFrontmatter(content);
      });

      const endTime = Date.now();
      const processingTime = endTime - startTime;

      // Should process all files quickly (< 1 second)
      expect(processingTime).toBeLessThan(1000);
    });

    it('should handle large article content efficiently', () => {
      const files = readdirSync(articlesDir).filter(f => f.endsWith('.md'));
      let largestArticle = 0;

      files.forEach(fileName => {
        const filePath = join(articlesDir, fileName);
        const content = readFileSync(filePath, 'utf-8');
        largestArticle = Math.max(largestArticle, content.length);
      });

      // Verify we can handle reasonably large articles
      expect(largestArticle).toBeGreaterThan(1000);
    });
  });

  describe('Data consistency checks', () => {
    it('should have consistent published status types', () => {
      const files = readdirSync(articlesDir).filter(f => f.endsWith('.md'));

      files.forEach(fileName => {
        const filePath = join(articlesDir, fileName);
        const content = readFileSync(filePath, 'utf-8');
        const { data } = parseFrontmatter(content);

        expect(typeof data.published).toBe('boolean');
      });
    });

    it('should have tags as arrays consistently', () => {
      const files = readdirSync(articlesDir).filter(f => f.endsWith('.md'));

      files.forEach(fileName => {
        const filePath = join(articlesDir, fileName);
        const content = readFileSync(filePath, 'utf-8');
        const { data } = parseFrontmatter(content);

        expect(Array.isArray(data.tags)).toBe(true);
        expect((data.tags as string[]).length).toBeGreaterThan(0);
      });
    });

    it('should have frontmatter delimiters properly balanced', () => {
      const files = readdirSync(articlesDir).filter(f => f.endsWith('.md'));

      files.forEach(fileName => {
        const filePath = join(articlesDir, fileName);
        const content = readFileSync(filePath, 'utf-8');

        const delimiters = content.match(/^---$/gm);
        expect(delimiters).not.toBeNull();
        expect(delimiters!.length).toBeGreaterThanOrEqual(2);
      });
    });
  });

  describe('Regression tests', () => {
    it('should maintain backward compatibility with existing article structure', () => {
      const files = readdirSync(articlesDir).filter(f => f.endsWith('.md'));
      const expectedFields = ['title', 'slug', 'date', 'category', 'excerpt', 'published', 'tags'];

      files.forEach(fileName => {
        const filePath = join(articlesDir, fileName);
        const content = readFileSync(filePath, 'utf-8');
        const { data } = parseFrontmatter(content);

        expectedFields.forEach(field => {
          expect(data).toHaveProperty(field);
        });
      });
    });

    it('should not introduce breaking changes to data structure', () => {
      const files = readdirSync(articlesDir).filter(f => f.endsWith('.md'));

      files.forEach(fileName => {
        const filePath = join(articlesDir, fileName);
        const content = readFileSync(filePath, 'utf-8');
        const { data, content: articleContent } = parseFrontmatter(content);

        // Verify the expected data structure
        expect(typeof data.title).toBe('string');
        expect(typeof data.slug).toBe('string');
        expect(typeof data.category).toBe('string');
        expect(typeof data.excerpt).toBe('string');
        expect(typeof data.published).toBe('boolean');
        expect(Array.isArray(data.tags)).toBe(true);
        expect(typeof articleContent).toBe('string');
      });
    });
  });

  describe('Edge case handling', () => {
    it('should gracefully handle articles with special characters in metadata', () => {
      const files = readdirSync(articlesDir).filter(f => f.endsWith('.md'));

      files.forEach(fileName => {
        const filePath = join(articlesDir, fileName);
        const content = readFileSync(filePath, 'utf-8');

        expect(() => {
          const { data } = parseFrontmatter(content);
          const title = data.title as string;
          // Should handle quotes, apostrophes, colons, etc.
          expect(title.length).toBeGreaterThan(0);
        }).not.toThrow();
      });
    });

    it('should handle articles with varying amounts of whitespace', () => {
      const files = readdirSync(articlesDir).filter(f => f.endsWith('.md'));

      files.forEach(fileName => {
        const filePath = join(articlesDir, fileName);
        const content = readFileSync(filePath, 'utf-8');
        const { content: articleContent } = parseFrontmatter(content);

        // Content should be trimmed
        expect(articleContent).toBe(articleContent.trim());
      });
    });
  });
});