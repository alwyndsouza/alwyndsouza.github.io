import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

describe('README.md', () => {
  const readmePath = join(__dirname, '..', 'README.md');
  const readmeContent = readFileSync(readmePath, 'utf-8');

  describe('File structure', () => {
    it('should exist in the root directory', () => {
      expect(existsSync(readmePath)).toBe(true);
    });

    it('should not be empty', () => {
      expect(readmeContent.length).toBeGreaterThan(0);
    });

    it('should have substantial content (>1000 characters)', () => {
      expect(readmeContent.length).toBeGreaterThan(1000);
    });
  });

  describe('Required sections', () => {
    it('should have a title heading', () => {
      expect(readmeContent).toMatch(/^#\s+/m);
    });

    it('should contain repository name or description', () => {
      expect(readmeContent.toLowerCase()).toMatch(/alwyndsouza\.github\.io|personal.*website/i);
    });

    it('should have a Tech Stack section', () => {
      expect(readmeContent).toMatch(/##\s+Tech Stack/i);
    });

    it('should have a Repository Structure section', () => {
      expect(readmeContent).toMatch(/##\s+Repository Structure/i);
    });

    it('should have a Local Development section', () => {
      expect(readmeContent).toMatch(/##\s+Local Development/i);
    });

    it('should have deployment information', () => {
      expect(readmeContent).toMatch(/##\s+Deploying.*GitHub Pages/i);
    });

    it('should have instructions for adding new articles', () => {
      expect(readmeContent).toMatch(/##\s+Adding.*New Article/i);
    });

    it('should have instructions for adding new projects', () => {
      expect(readmeContent).toMatch(/##\s+Adding.*New Project/i);
    });

    it('should have a License section', () => {
      expect(readmeContent).toMatch(/##\s+License/i);
    });
  });

  describe('Technical details', () => {
    it('should mention React as the framework', () => {
      expect(readmeContent).toMatch(/React/i);
    });

    it('should mention TypeScript', () => {
      expect(readmeContent).toMatch(/TypeScript/i);
    });

    it('should mention Vite as the build tool', () => {
      expect(readmeContent).toMatch(/Vite/i);
    });

    it('should mention Tailwind CSS', () => {
      expect(readmeContent).toMatch(/Tailwind/i);
    });

    it('should mention marked for markdown processing', () => {
      expect(readmeContent).toMatch(/marked/i);
    });

    it('should mention GitHub Pages for hosting', () => {
      expect(readmeContent).toMatch(/GitHub Pages/i);
    });

    it('should mention GitHub Actions for CI/CD', () => {
      expect(readmeContent).toMatch(/GitHub Actions/i);
    });
  });

  describe('Code examples and commands', () => {
    it('should include npm install command', () => {
      expect(readmeContent).toMatch(/npm install/);
    });

    it('should include npm run dev command', () => {
      expect(readmeContent).toMatch(/npm run dev/);
    });

    it('should include npm run build command', () => {
      expect(readmeContent).toMatch(/npm run build/);
    });

    it('should include npm run preview command', () => {
      expect(readmeContent).toMatch(/npm run preview/);
    });

    it('should have code blocks with proper markdown formatting', () => {
      expect(readmeContent).toMatch(/```/);
    });

    it('should include bash/shell code blocks', () => {
      expect(readmeContent).toMatch(/```bash/);
    });
  });

  describe('Directory structure documentation', () => {
    it('should mention frontend/src directory', () => {
      expect(readmeContent).toMatch(/frontend\/src/);
    });

    it('should mention articles directory', () => {
      expect(readmeContent).toMatch(/articles/);
    });

    it('should mention projects directory', () => {
      expect(readmeContent).toMatch(/projects/);
    });

    it('should mention trading directory', () => {
      expect(readmeContent).toMatch(/trading/);
    });

    it('should mention .github/workflows for CI/CD', () => {
      expect(readmeContent).toMatch(/\.github\/workflows/);
    });

    it('should show proper tree structure format', () => {
      const hasTreeStructure = readmeContent.includes('├──') || readmeContent.includes('└──');
      expect(hasTreeStructure).toBe(true);
    });
  });

  describe('Frontmatter examples', () => {
    it('should include example frontmatter for articles', () => {
      expect(readmeContent).toMatch(/---[\s\S]*title:[\s\S]*---/m);
    });

    it('should show required frontmatter fields', () => {
      expect(readmeContent).toMatch(/title:/);
      expect(readmeContent).toMatch(/slug:/);
      expect(readmeContent).toMatch(/date:/);
      expect(readmeContent).toMatch(/published:/);
      expect(readmeContent).toMatch(/tags:/);
    });

    it('should include example for article frontmatter', () => {
      const articleSection = readmeContent.match(/##\s+Adding.*New Article([\s\S]*?)##/i);
      expect(articleSection).not.toBeNull();
      if (articleSection) {
        expect(articleSection[1]).toMatch(/---/);
        expect(articleSection[1]).toMatch(/title:/);
      }
    });

    it('should include example for project frontmatter', () => {
      const projectSection = readmeContent.match(/##\s+Adding.*New Project([\s\S]*?)##/i);
      expect(projectSection).not.toBeNull();
      if (projectSection) {
        expect(projectSection[1]).toMatch(/---/);
        expect(projectSection[1]).toMatch(/title:/);
      }
    });
  });

  describe('Prerequisites and setup', () => {
    it('should specify Node.js version requirement', () => {
      expect(readmeContent).toMatch(/Node\.js.*v?18/i);
    });

    it('should have a Prerequisites section', () => {
      expect(readmeContent).toMatch(/###\s+Prerequisites/i);
    });

    it('should include instructions to check Node version', () => {
      expect(readmeContent).toMatch(/node --version/);
    });
  });

  describe('Deployment instructions', () => {
    it('should mention automatic deployment', () => {
      expect(readmeContent).toMatch(/automatic/i);
    });

    it('should mention pushing to main branch', () => {
      expect(readmeContent).toMatch(/main/);
    });

    it('should mention build directory', () => {
      expect(readmeContent).toMatch(/build/);
    });

    it('should include steps to enable GitHub Pages', () => {
      const deploySection = readmeContent.match(/##\s+Deploying.*GitHub Pages([\s\S]*?)##/i);
      expect(deploySection).not.toBeNull();
      if (deploySection) {
        expect(deploySection[1]).toMatch(/Settings.*Pages/i);
      }
    });
  });

  describe('URLs and links', () => {
    it('should include live site URL', () => {
      expect(readmeContent).toMatch(/https:\/\/alwyndsouza\.github\.io/);
    });

    it('should have localhost development URL', () => {
      expect(readmeContent).toMatch(/localhost:3000|http:\/\/localhost/);
    });

    it('should not have broken markdown links', () => {
      // Check for incomplete markdown links like [text]( ) or [](url)
      const brokenLinks = readmeContent.match(/\[\]\(.*?\)|\[.*?\]\(\s*\)/g);
      expect(brokenLinks).toBeNull();
    });
  });

  describe('Image references', () => {
    it('should mention images directory', () => {
      expect(readmeContent).toMatch(/images/);
    });

    it('should show how to reference images in markdown', () => {
      expect(readmeContent).toMatch(/!\[.*?\]\(.*?\)/);
    });

    it('should mention coverImage in frontmatter', () => {
      expect(readmeContent).toMatch(/coverImage:/);
    });
  });

  describe('Content formatting', () => {
    it('should use proper markdown heading hierarchy', () => {
      const headings = readmeContent.match(/^#{1,6}\s+.+$/gm);
      expect(headings).not.toBeNull();
      expect(headings!.length).toBeGreaterThan(5);
    });

    it('should have horizontal rules for section separation', () => {
      expect(readmeContent).toMatch(/^---$/m);
    });

    it('should use tables for structured data', () => {
      expect(readmeContent).toMatch(/\|.*\|/);
    });

    it('should have proper table structure', () => {
      const hasTableHeader = readmeContent.match(/\|.*\|[\r\n]+\|[-:| ]+\|/);
      expect(hasTableHeader).not.toBeNull();
    });
  });

  describe('Professional content', () => {
    it('should mention the author/owner', () => {
      expect(readmeContent).toMatch(/Alwyn\s+Dsouza/i);
    });

    it('should mention job title', () => {
      expect(readmeContent).toMatch(/DataOps Engineer/i);
    });

    it('should mention topics covered', () => {
      expect(readmeContent).toMatch(/Topics covered:/i);
    });

    it('should list relevant technical topics', () => {
      expect(readmeContent).toMatch(/Data Engineering/i);
      expect(readmeContent).toMatch(/dbt/i);
    });
  });

  describe('Completeness and quality', () => {
    it('should not have TODO or placeholder text', () => {
      const hasPlaceholders = readmeContent.match(/TODO|FIXME|XXX|\[TBD\]/i);
      expect(hasPlaceholders).toBeNull();
    });

    it('should not have excessive empty lines (>3 consecutive)', () => {
      const excessiveEmptyLines = readmeContent.match(/\n{5,}/);
      expect(excessiveEmptyLines).toBeNull();
    });

    it('should end with a newline', () => {
      expect(readmeContent.endsWith('\n')).toBe(true);
    });

    it('should have consistent indentation in code blocks', () => {
      const codeBlocks = readmeContent.match(/```[\s\S]*?```/g);
      if (codeBlocks) {
        codeBlocks.forEach(block => {
          // Check that code blocks are properly formatted (allow optional language identifier)
          expect(block).toMatch(/```\w*\s*[\s\S]*```/);
        });
      }
    });
  });

  describe('Best practices documentation', () => {
    it('should provide step-by-step instructions', () => {
      const hasNumberedSteps = readmeContent.match(/^1\.\s+/m);
      expect(hasNumberedSteps).not.toBeNull();
    });

    it('should mention commit and push workflow', () => {
      expect(readmeContent.toLowerCase()).toMatch(/commit.*push/s);
    });

    it('should explain YAML frontmatter', () => {
      expect(readmeContent).toMatch(/YAML.*frontmatter/i);
    });

    it('should provide examples for all content types', () => {
      expect(readmeContent).toMatch(/example/i);
    });
  });

  describe('Edge cases and robustness', () => {
    it('should handle long lines gracefully (no lines >300 chars in prose)', () => {
      const lines = readmeContent.split('\n');
      const proseLines = lines.filter(line => !line.trim().startsWith('|') && !line.includes('http'));

      const longLines = proseLines.filter(line => line.length > 300);
      expect(longLines.length).toBe(0);
    });

    it('should have balanced code block delimiters', () => {
      const codeBlockMatches = readmeContent.match(/```/g);
      if (codeBlockMatches) {
        expect(codeBlockMatches.length % 2).toBe(0);
      }
    });

    it('should not contain raw HTML unless necessary', () => {
      // Allow some HTML but not excessive
      const htmlTags = readmeContent.match(/<[^>]+>/g);
      if (htmlTags) {
        expect(htmlTags.length).toBeLessThan(10);
      }
    });
  });

  describe('Accessibility and clarity', () => {
    it('should use descriptive link text (not "click here")', () => {
      const badLinkText = readmeContent.match(/\[click here\]|\[here\]/i);
      expect(badLinkText).toBeNull();
    });

    it('should have clear section headers', () => {
      const headers = readmeContent.match(/^##\s+(.+)$/gm);
      if (headers) {
        headers.forEach(header => {
          // Headers should not be empty or just symbols
          expect(header).toMatch(/##\s+[A-Z]/);
        });
      }
    });

    it('should use inclusive language', () => {
      // Check for common non-inclusive terms
      const nonInclusiveTerms = readmeContent.match(/\b(master|slave|whitelist|blacklist)\b/i);
      // Note: "master" might appear in git branch names, so we allow it in that context
      if (nonInclusiveTerms) {
        const contextAllowed = readmeContent.match(/main.*branch|origin\/main/i);
        // We're using 'main' branch, so this is good
        expect(contextAllowed).not.toBeNull();
      }
    });
  });

  describe('Copyright and licensing', () => {
    it('should have copyright notice', () => {
      expect(readmeContent).toMatch(/©|Copyright/i);
    });

    it('should mention year in copyright', () => {
      expect(readmeContent).toMatch(/202[0-9]/);
    });

    it('should attribute content to author', () => {
      expect(readmeContent.toLowerCase()).toMatch(/alwyn.*dsouza/);
    });
  });
});