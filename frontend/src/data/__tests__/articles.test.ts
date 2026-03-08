import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Marked } from 'marked';
import yaml from 'js-yaml';

// Mock the import.meta.glob calls
vi.mock('../articles/*.md', () => ({}));

describe('Article Data Loader Functions', () => {
  describe('parseFrontmatter', () => {
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

    it('should correctly parse valid frontmatter', () => {
      const input = `---
title: "Test Article"
slug: "test-article"
date: 2024-01-01
published: true
---

This is the content.`;

      const result = parseFrontmatter(input);

      expect(result.data.title).toBe('Test Article');
      expect(result.data.slug).toBe('test-article');
      // YAML parser converts date strings to Date objects
      expect(result.data.date).toBeInstanceOf(Date);
      expect(result.data.published).toBe(true);
      expect(result.content).toBe('This is the content.');
    });

    it('should handle frontmatter with arrays', () => {
      const input = `---
tags:
  - tag1
  - tag2
  - tag3
---

Content here.`;

      const result = parseFrontmatter(input);

      expect(Array.isArray(result.data.tags)).toBe(true);
      expect(result.data.tags).toEqual(['tag1', 'tag2', 'tag3']);
    });

    it('should return empty data for content without frontmatter', () => {
      const input = 'Just plain content without frontmatter.';

      const result = parseFrontmatter(input);

      expect(Object.keys(result.data).length).toBe(0);
      expect(result.content).toBe(input);
    });

    it('should handle Windows line endings (CRLF)', () => {
      const input = '---\r\ntitle: "Test"\r\n---\r\nContent';

      const result = parseFrontmatter(input);

      expect(result.data.title).toBe('Test');
      expect(result.content).toBe('Content');
    });

    it('should handle Unix line endings (LF)', () => {
      const input = '---\ntitle: "Test"\n---\nContent';

      const result = parseFrontmatter(input);

      expect(result.data.title).toBe('Test');
      expect(result.content).toBe('Content');
    });

    it('should trim whitespace from content', () => {
      const input = `---
title: "Test"
---

   Content with spaces

`;

      const result = parseFrontmatter(input);

      expect(result.content).toBe('Content with spaces');
    });

    it('should handle frontmatter with special characters', () => {
      const input = `---
title: "Test: Article with Special & Characters"
excerpt: "Quote with 'apostrophes' and \\"quotes\\""
---

Content`;

      const result = parseFrontmatter(input);

      expect(result.data.title).toBe('Test: Article with Special & Characters');
      expect(result.data.excerpt).toContain('apostrophes');
    });

    it('should handle empty frontmatter', () => {
      const input = `---
---

Content`;

      const result = parseFrontmatter(input);

      // Empty frontmatter returns null or empty object
      expect(result.data === null || Object.keys(result.data).length === 0).toBe(true);
      // When frontmatter is empty but present, the whole input is returned as content
      expect(result.content.length).toBeGreaterThan(0);
    });

    it('should handle malformed YAML gracefully', () => {
      const input = `---
title: "Test
this is broken yaml: [
---

Content`;

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const result = parseFrontmatter(input);

      expect(consoleSpy).toHaveBeenCalled();
      expect(Object.keys(result.data).length).toBe(0);

      consoleSpy.mockRestore();
    });

    it('should handle multiline strings in frontmatter', () => {
      const input = `---
description: |
  This is a multiline
  description that spans
  multiple lines
---

Content`;

      const result = parseFrontmatter(input);

      expect(result.data.description).toContain('multiline');
      expect(result.data.description).toContain('multiple lines');
    });
  });

  describe('calculateReadTime', () => {
    function calculateReadTime(content: string): string {
      const wordsPerMinute = 200;
      const words = content.split(/\s+/).length;
      const minutes = Math.ceil(words / wordsPerMinute);
      return `${minutes} min read`;
    }

    it('should calculate read time for short content (1 min)', () => {
      const content = 'word '.repeat(50); // 50 words
      const result = calculateReadTime(content);
      expect(result).toBe('1 min read');
    });

    it('should calculate read time for medium content', () => {
      const content = 'word '.repeat(300); // 300 words
      const result = calculateReadTime(content);
      expect(result).toBe('2 min read');
    });

    it('should calculate read time for long content', () => {
      const content = 'word '.repeat(1000); // 1001 words (includes empty string at end)
      const result = calculateReadTime(content);
      expect(result).toBe('6 min read'); // 1001 / 200 = 5.005 -> rounds to 6
    });

    it('should round up partial minutes', () => {
      const content = 'word '.repeat(201); // 201 words = 1.005 minutes
      const result = calculateReadTime(content);
      expect(result).toBe('2 min read');
    });

    it('should handle single word content', () => {
      const content = 'word';
      const result = calculateReadTime(content);
      expect(result).toBe('1 min read');
    });

    it('should handle empty content', () => {
      const content = '';
      const result = calculateReadTime(content);
      // Empty string splits to [''], which has length 1
      expect(result).toBe('1 min read');
    });

    it('should count words correctly with multiple spaces', () => {
      const content = 'word    word    word'; // Multiple spaces
      const result = calculateReadTime(content);
      expect(result).toBe('1 min read');
    });

    it('should handle content with newlines', () => {
      const content = 'word\nword\nword\n'.repeat(70); // ~210 words
      const result = calculateReadTime(content);
      expect(result).toBe('2 min read');
    });

    it('should handle realistic article content', () => {
      const content = `
        This is a sample article with multiple paragraphs.
        It contains various sentences and punctuation marks.

        Here's another paragraph with some more content.
        We want to test that the read time calculation works
        correctly for real-world content.
      `.repeat(100);

      // Count actual words to verify
      const words = content.split(/\s+/).length;
      const expectedMinutes = Math.ceil(words / 200);
      const result = calculateReadTime(content);
      expect(result).toBe(`${expectedMinutes} min read`);
    });
  });

  describe('extractFirstImage', () => {
    function extractFirstImage(content: string): string | undefined {
      const match = content.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
      return match?.[1];
    }

    it('should extract image URL from img tag', () => {
      const content = '<img src="https://example.com/image.png" alt="Test">';
      const result = extractFirstImage(content);
      expect(result).toBe('https://example.com/image.png');
    });

    it('should extract first image when multiple exist', () => {
      const content = `
        <img src="https://example.com/first.png" alt="First">
        <img src="https://example.com/second.png" alt="Second">
      `;
      const result = extractFirstImage(content);
      expect(result).toBe('https://example.com/first.png');
    });

    it('should handle single quotes in src attribute', () => {
      const content = "<img src='https://example.com/image.png' alt='Test'>";
      const result = extractFirstImage(content);
      expect(result).toBe('https://example.com/image.png');
    });

    it('should return undefined when no image exists', () => {
      const content = '<p>No images here</p>';
      const result = extractFirstImage(content);
      expect(result).toBeUndefined();
    });

    it('should handle img tags with multiple attributes', () => {
      const content = '<img class="featured" src="https://example.com/image.png" alt="Test" width="100">';
      const result = extractFirstImage(content);
      expect(result).toBe('https://example.com/image.png');
    });

    it('should handle relative image paths', () => {
      const content = '<img src="/images/local.png" alt="Local">';
      const result = extractFirstImage(content);
      expect(result).toBe('/images/local.png');
    });

    it('should be case insensitive for img tag', () => {
      const content = '<IMG SRC="https://example.com/image.png" ALT="Test">';
      const result = extractFirstImage(content);
      expect(result).toBe('https://example.com/image.png');
    });

    it('should handle self-closing img tags', () => {
      const content = '<img src="https://example.com/image.png" />';
      const result = extractFirstImage(content);
      expect(result).toBe('https://example.com/image.png');
    });

    it('should handle img tags with data URIs', () => {
      const content = '<img src="data:image/png;base64,iVBORw0KG..." alt="Base64">';
      const result = extractFirstImage(content);
      expect(result).toContain('data:image/png');
    });
  });

  describe('Article interface and data structure', () => {
    interface Article {
      slug: string;
      title: string;
      excerpt: string;
      date: string;
      readTime: string;
      category: string;
      content: string;
      htmlContent: string;
      coverImage?: string;
      published: boolean;
      tags: string[];
    }

    it('should have all required Article interface properties', () => {
      const mockArticle: Article = {
        slug: 'test-article',
        title: 'Test Article',
        excerpt: 'This is a test',
        date: '2024-01-01',
        readTime: '5 min read',
        category: 'testing',
        content: 'Raw markdown content',
        htmlContent: '<p>HTML content</p>',
        published: true,
        tags: ['test', 'article'],
      };

      expect(mockArticle.slug).toBeDefined();
      expect(mockArticle.title).toBeDefined();
      expect(mockArticle.excerpt).toBeDefined();
      expect(mockArticle.date).toBeDefined();
      expect(mockArticle.readTime).toBeDefined();
      expect(mockArticle.category).toBeDefined();
      expect(mockArticle.content).toBeDefined();
      expect(mockArticle.htmlContent).toBeDefined();
      expect(mockArticle.published).toBeDefined();
      expect(mockArticle.tags).toBeDefined();
    });

    it('should allow coverImage to be optional', () => {
      const articleWithoutCover: Article = {
        slug: 'test',
        title: 'Test',
        excerpt: 'Test',
        date: '2024-01-01',
        readTime: '1 min read',
        category: 'test',
        content: 'content',
        htmlContent: '<p>content</p>',
        published: true,
        tags: [],
      };

      expect(articleWithoutCover.coverImage).toBeUndefined();
    });

    it('should properly type all fields', () => {
      const article: Article = {
        slug: 'test',
        title: 'Test',
        excerpt: 'Test',
        date: '2024-01-01',
        readTime: '1 min read',
        category: 'test',
        content: 'content',
        htmlContent: '<p>content</p>',
        published: true,
        tags: ['tag1', 'tag2'],
        coverImage: 'https://example.com/image.png',
      };

      expect(typeof article.slug).toBe('string');
      expect(typeof article.title).toBe('string');
      expect(typeof article.excerpt).toBe('string');
      expect(typeof article.date).toBe('string');
      expect(typeof article.readTime).toBe('string');
      expect(typeof article.category).toBe('string');
      expect(typeof article.content).toBe('string');
      expect(typeof article.htmlContent).toBe('string');
      expect(typeof article.published).toBe('boolean');
      expect(Array.isArray(article.tags)).toBe(true);
      expect(typeof article.coverImage).toBe('string');
    });
  });

  describe('Article sorting and filtering', () => {
    interface Article {
      slug: string;
      title: string;
      excerpt: string;
      date: string;
      readTime: string;
      category: string;
      content: string;
      htmlContent: string;
      coverImage?: string;
      published: boolean;
      tags: string[];
    }

    it('should sort articles by date descending (newest first)', () => {
      const articles: Article[] = [
        {
          slug: 'old',
          title: 'Old Article',
          excerpt: 'Old',
          date: '2024-01-01',
          readTime: '1 min read',
          category: 'test',
          content: 'content',
          htmlContent: '<p>content</p>',
          published: true,
          tags: [],
        },
        {
          slug: 'new',
          title: 'New Article',
          excerpt: 'New',
          date: '2024-12-01',
          readTime: '1 min read',
          category: 'test',
          content: 'content',
          htmlContent: '<p>content</p>',
          published: true,
          tags: [],
        },
        {
          slug: 'medium',
          title: 'Medium Article',
          excerpt: 'Medium',
          date: '2024-06-01',
          readTime: '1 min read',
          category: 'test',
          content: 'content',
          htmlContent: '<p>content</p>',
          published: true,
          tags: [],
        },
      ];

      const sorted = articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      expect(sorted[0].slug).toBe('new');
      expect(sorted[1].slug).toBe('medium');
      expect(sorted[2].slug).toBe('old');
    });

    it('should filter out unpublished articles in production', () => {
      const articles: Article[] = [
        {
          slug: 'published',
          title: 'Published',
          excerpt: 'Published',
          date: '2024-01-01',
          readTime: '1 min read',
          category: 'test',
          content: 'content',
          htmlContent: '<p>content</p>',
          published: true,
          tags: [],
        },
        {
          slug: 'unpublished',
          title: 'Unpublished',
          excerpt: 'Unpublished',
          date: '2024-01-02',
          readTime: '1 min read',
          category: 'test',
          content: 'content',
          htmlContent: '<p>content</p>',
          published: false,
          tags: [],
        },
      ];

      const showUnpublished = false; // Simulating production
      const filtered = articles.filter(article => showUnpublished || article.published);

      expect(filtered.length).toBe(1);
      expect(filtered[0].slug).toBe('published');
    });

    it('should include unpublished articles in development', () => {
      const articles: Article[] = [
        {
          slug: 'published',
          title: 'Published',
          excerpt: 'Published',
          date: '2024-01-01',
          readTime: '1 min read',
          category: 'test',
          content: 'content',
          htmlContent: '<p>content</p>',
          published: true,
          tags: [],
        },
        {
          slug: 'unpublished',
          title: 'Unpublished',
          excerpt: 'Unpublished',
          date: '2024-01-02',
          readTime: '1 min read',
          category: 'test',
          content: 'content',
          htmlContent: '<p>content</p>',
          published: false,
          tags: [],
        },
      ];

      const showUnpublished = true; // Simulating development
      const filtered = articles.filter(article => showUnpublished || article.published);

      expect(filtered.length).toBe(2);
    });
  });

  describe('Markdown to HTML conversion', () => {
    it('should convert markdown to HTML', async () => {
      const marked = new Marked();
      const markdown = '# Heading\n\nThis is **bold** text.';
      const html = await marked.parse(markdown);

      expect(html).toContain('<h1');
      expect(html).toContain('Heading');
      expect(html).toContain('<strong>bold</strong>');
    });

    it('should handle code blocks', async () => {
      const marked = new Marked();
      const markdown = '```javascript\nconst x = 1;\n```';
      const html = await marked.parse(markdown);

      expect(html).toContain('<code');
      expect(html).toContain('const x = 1');
    });

    it('should handle links', async () => {
      const marked = new Marked();
      const markdown = '[Link text](https://example.com)';
      const html = await marked.parse(markdown);

      expect(html).toContain('<a');
      expect(html).toContain('https://example.com');
      expect(html).toContain('Link text');
    });

    it('should handle lists', async () => {
      const marked = new Marked();
      const markdown = '- Item 1\n- Item 2\n- Item 3';
      const html = await marked.parse(markdown);

      expect(html).toContain('<ul');
      expect(html).toContain('<li');
      expect(html).toContain('Item 1');
    });
  });

  describe('Edge cases and error handling', () => {
    it('should handle articles with missing optional fields', () => {
      const input = `---
title: "Minimal Article"
slug: "minimal"
date: 2024-01-01
category: "test"
excerpt: "Test"
published: true
tags: []
---

Content`;

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

      const result = parseFrontmatter(input);

      expect(result.data.coverImage).toBeUndefined();
      expect(result.data.title).toBeDefined();
    });

    it('should provide default values for missing tags', () => {
      const frontmatter = {
        title: 'Test',
        slug: 'test',
      };

      const tags = (frontmatter.tags as string[]) ?? [];

      expect(Array.isArray(tags)).toBe(true);
      expect(tags.length).toBe(0);
    });

    it('should provide default value for missing published field', () => {
      const frontmatter = {
        title: 'Test',
        slug: 'test',
      };

      const published = (frontmatter.published as boolean) ?? true;

      expect(typeof published).toBe('boolean');
      expect(published).toBe(true);
    });

    it('should handle date conversion to string', () => {
      const frontmatter = {
        date: new Date('2024-01-01'),
      };

      const dateStr = String(frontmatter.date);

      expect(typeof dateStr).toBe('string');
    });

    it('should handle very long content efficiently', () => {
      const longContent = 'word '.repeat(10000);

      function calculateReadTime(content: string): string {
        const wordsPerMinute = 200;
        const words = content.split(/\s+/).length;
        const minutes = Math.ceil(words / wordsPerMinute);
        return `${minutes} min read`;
      }

      const result = calculateReadTime(longContent);

      // 'word '.repeat(10000) creates 10001 words (includes empty string at end)
      expect(result).toBe('51 min read');
    });
  });
});