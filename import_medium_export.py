import os
import re
import html
from datetime import datetime
from pathlib import Path

def slugify(text):
    """
    Create a URL-friendly slug from the given text.
    
    Parameters:
        text (str): Input string to convert into a slug.
    
    Returns:
        slug (str): Lowercased string containing only ASCII letters, digits, and hyphens; sequences of non-alphanumeric characters are replaced by a single hyphen and leading/trailing hyphens are removed.
    """
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')

def categorize_article(title, content=""):
    """
    Determine an article category and associated tag slugs based on its title and optional content.
    
    Parameters:
        title (str): Article title; matching is attempted against the title first.
        content (str, optional): Article content used as a fallback when the title does not yield a category.
    
    Returns:
        tuple: (category, tags)
            category (str): Short hyphenated category slug (e.g., 'data-engineering', 'mlops').
            tags (list[str]): List of related tag slugs prioritized for the inferred category. Defaults to ('data-engineering',) when no matches are found.
    """
    title_lower = title.lower()
    content_lower = content.lower() if content else ""
    
    # Define category keywords with priority order (more specific first)
    category_keywords = {
        'mlops': {
            'keywords': ['mlops', 'mlsecops', 'machine learning lifecycle', 'ml security', 'ai lifecycle', 'model pipeline', 'securing ai', 'securing the ai', 'mlsecops dream team'],
            'tags': ['mlops', 'machine-learning', 'ai']
        },
        'security': {
            'keywords': ['pii', 'pii data', 'databricks pii', 'discoverx', 'identification, protection'],
            'tags': ['security', 'privacy', 'compliance']
        },
        'data-quality': {
            'keywords': ['data quality', 'data lineage', 'dbt-expectations', 'dbt-checkpoint', 'sqlfluff', 'data validation', 'sql standards', 'shift left governance'],
            'tags': ['data-quality', 'testing', 'validation']
        },
        'data-architecture': {
            'keywords': ['data mesh', 'data contract', 'data product', 'data architecture', 'ontology', 'data card', 'architecture evolution', 'ontology layer'],
            'tags': ['data-architecture', 'data-strategy']
        },
        'ai': {
            'keywords': ['context-aware ai', 'ai for your team', 'ai transformed', 'ai project', 'teach ai', 'ai understand', 'code review.*ai', 'ai.*code review', 'ai-powered'],
            'tags': ['ai', 'artificial-intelligence', 'automation']
        },
        'devops': {
            'keywords': ['docker', 'ci/cd', 'github actions', 'pre-commit', 'git branch', 'virtualenv', 'workflow', 'image build', 'yaml formatting'],
            'tags': ['devops', 'automation', 'ci-cd']
        },
    }
    
    # Check for specific category matches in title first (more reliable)
    for category, config in category_keywords.items():
        for keyword in config['keywords']:
            # Use regex for more flexible matching
            if re.search(keyword, title_lower):
                return category, config['tags']
    
    # If title contains 'dbt', it's data engineering
    if 'dbt' in title_lower:
        return 'data-engineering', ['data-engineering', 'dbt', 'analytics']
    
    # Check broader context in content for edge cases
    for category, config in category_keywords.items():
        for keyword in config['keywords']:
            if re.search(keyword, content_lower[:500]):  # Check first 500 chars of content
                return category, config['tags']
    
    # Default to data engineering
    return 'data-engineering', ['data-engineering']

def extract_article_from_html(html_file_path):
    """
    Parse a Medium-exported HTML file and extract article metadata and cleaned HTML content.
    
    Parameters:
        html_file_path (str): Path to the Medium-exported HTML file to parse.
    
    Returns:
        dict: A mapping with the extracted article data:
            - title (str): Article title (defaults to "Untitled" if not found).
            - slug (str): URL-friendly slug generated from the title.
            - date (str): Publication date in 'YYYY-MM-DD' format (defaults to current date on failure).
            - category (str): Category inferred from title/content.
            - excerpt (str): First paragraph text trimmed to ~160 characters.
            - tags (list[str]): List of tag slugs (limited to 6); falls back to categorized tags when none are found.
            - coverImage (str): URL of the first image found in the article HTML or empty string.
            - content (str): Cleaned HTML content with an appended canonical-link note when available.
        or None if the file cannot be parsed.
    """
    try:
        with open(html_file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extract title
        title_match = re.search(r'<h1[^>]*>(.*?)</h1>', content, re.DOTALL)
        title = html.unescape(re.sub(r'<[^>]+>', '', title_match.group(1))) if title_match else "Untitled"
        
        # Extract publication date
        date_match = re.search(r'<time[^>]*datetime="([^"]+)"', content)
        if date_match:
            try:
                pub_date = datetime.fromisoformat(date_match.group(1).replace('Z', '+00:00'))
                formatted_date = pub_date.strftime('%Y-%m-%d')
            except:
                formatted_date = datetime.now().strftime('%Y-%m-%d')
        else:
            formatted_date = datetime.now().strftime('%Y-%m-%d')
        
        # Extract article content (only the body section, skip header/subtitle)
        body_match = re.search(r'<section[^>]*data-field="body"[^>]*>(.*?)</section>', content, re.DOTALL)
        if not body_match:
            # Fallback to article tags
            body_match = re.search(r'<article[^>]*>(.*?)</article>', content, re.DOTALL)
        
        if not body_match:
            print(f"  Warning: Could not find article content in {html_file_path}")
            return None
        
        article_html = body_match.group(1)
        
        # Extract canonical link (Medium article URL) from footer
        # Try both attribute orders since they can vary
        canonical_match = re.search(r'<a[^>]*href="([^"]+)"[^>]*class="p-canonical"', content)
        if not canonical_match:
            canonical_match = re.search(r'<a[^>]*class="p-canonical"[^>]*href="([^"]+)"', content)
        canonical_url = canonical_match.group(1) if canonical_match else ""
        
        # Extract first image for cover BEFORE cleaning
        img_match = re.search(r'<img[^>]*src="([^"]+)"[^>]*>', article_html)
        cover_image = img_match.group(1) if img_match else ""
        
        # Clean up the HTML - remove Medium-specific wrapper elements
        article_html = clean_medium_export_html(article_html, cover_image)
        
        # Add canonical link note at the end
        if canonical_url:
            article_html += f'\n\n<hr>\n\n<p><em>This article was originally published at <a href="{canonical_url}" target="_blank" rel="nofollow">{canonical_url}</a></em></p>'
        
        # Extract subtitle/excerpt from first paragraph or meta description
        excerpt_match = re.search(r'<p[^>]*>(.*?)</p>', article_html, re.DOTALL)
        if excerpt_match:
            excerpt_text = html.unescape(re.sub(r'<[^>]+>', '', excerpt_match.group(1)))
            excerpt = excerpt_text[:160].strip().replace('\n', ' ')
            if len(excerpt_text) > 160:
                excerpt += "..."
        else:
            excerpt = ""
        
        # Try to extract tags/categories from meta or links
        tags = []
        tag_matches = re.findall(r'<a[^>]*rel="tag"[^>]*>(.*?)</a>', content)
        for tag_match in tag_matches:
            tag_text = html.unescape(re.sub(r'<[^>]+>', '', tag_match)).strip()
            if tag_text:
                tags.append(slugify(tag_text))
        
        # Determine category and tags based on title and content
        category, default_tags = categorize_article(title, article_html)
        
        # If no tags were extracted from Medium, use the categorized tags
        if not tags:
            tags = default_tags
        
        return {
            'title': title,
            'slug': slugify(title),
            'date': formatted_date,
            'category': category,
            'excerpt': excerpt,
            'tags': tags[:6],
            'coverImage': cover_image,
            'content': article_html
        }
        
    except Exception as e:
        print(f"  Error parsing {html_file_path}: {e}")
        return None

def clean_medium_export_html(html_content, cover_image=""):
    """
    Clean Medium export HTML to remove wrapper elements and keep only content.
    
    Parameters:
        html_content (str): Raw HTML from Medium export
        cover_image (str): URL of cover image to remove from content
        
    Returns:
        str: Cleaned HTML content
    """
    # Remove script and style tags
    html_content = re.sub(r'<script[^>]*>.*?</script>', '', html_content, flags=re.DOTALL)
    html_content = re.sub(r'<style[^>]*>.*?</style>', '', html_content, flags=re.DOTALL)
    
    # Remove header and footer sections (they contain duplicate/summary content)
    html_content = re.sub(r'<header>.*?</header>', '', html_content, flags=re.DOTALL)
    html_content = re.sub(r'<footer>.*?</footer>', '', html_content, flags=re.DOTALL)
    
    # Remove everything before and including the first <hr> tag (usually a duplicate excerpt/summary)
    hr_match = re.search(r'<hr[^>]*>', html_content)
    if hr_match:
        html_content = html_content[hr_match.end():]
    
    # Remove the first <h3> tag (duplicate title) from the body section
    html_content = re.sub(r'<h3[^>]*>.*?</h3>', '', html_content, count=1, flags=re.DOTALL)
    
    # Remove any remaining <hr> tags
    html_content = re.sub(r'<hr[^>]*>', '', html_content)
    
    # Remove cover image figure (BEFORE removing other figure tags)
    # This removes the entire <figure> tag containing the cover image
    if cover_image:
        # Escape special regex characters in the URL
        escaped_cover = re.escape(cover_image)
        # Remove entire figure tag that contains the cover image
        html_content = re.sub(
            rf'<figure[^>]*>.*?<img[^>]*src="{escaped_cover}"[^>]*>.*?</figure>',
            '',
            html_content,
            flags=re.DOTALL
        )
    
    # Remove other figure wrappers but keep img and figcaption
    html_content = re.sub(r'<figure[^>]*>', '', html_content)
    html_content = re.sub(r'</figure>', '', html_content)
    
    # Remove section wrappers
    html_content = re.sub(r'<section[^>]*>', '', html_content)
    html_content = re.sub(r'</section>', '', html_content)
    
    # Remove div wrappers but keep content
    html_content = re.sub(r'<div[^>]*>', '', html_content)
    html_content = re.sub(r'</div>', '', html_content)
    
    # Remove span wrappers but keep content
    html_content = re.sub(r'<span[^>]*>', '', html_content)
    html_content = re.sub(r'</span>', '', html_content)
    
    # Clean up class and id attributes from remaining tags
    html_content = re.sub(r'\s+class="[^"]*"', '', html_content)
    html_content = re.sub(r'\s+id="[^"]*"', '', html_content)
    html_content = re.sub(r'\s+data-[^=]*="[^"]*"', '', html_content)
    html_content = re.sub(r'\s+name="[^"]*"', '', html_content)
    
    # Clean up image attributes, keep only src and alt
    def clean_img(match):
        img_tag = match.group(0)
        src_match = re.search(r'src="([^"]+)"', img_tag)
        alt_match = re.search(r'alt="([^"]+)"', img_tag)
        src = src_match.group(1) if src_match else ''
        alt = alt_match.group(1) if alt_match else ''
        return f'<img src="{src}" alt="{alt}" />'
    
    html_content = re.sub(r'<img[^>]*>', clean_img, html_content)
    
    # Remove multiple consecutive line breaks
    html_content = re.sub(r'\n\s*\n\s*\n+', '\n\n', html_content)
    
    # Clean up whitespace
    html_content = re.sub(r'[ \t]+', ' ', html_content)
    
    return html_content.strip()

def process_medium_export(export_dir='medium-export/posts'):
    """
    Process all HTML files from Medium export and generate markdown articles.
    
    Parameters:
        export_dir (str): Directory containing Medium export HTML files
    """
    export_path = Path(export_dir)
    
    if not export_path.exists():
        print(f"Error: Export directory '{export_dir}' not found!")
        print("\nInstructions:")
        print("1. Go to https://medium.com/me/settings/security")
        print("2. Click 'Download your information'")
        print("3. Extract the ZIP file")
        print("4. Place the 'posts' folder in this directory as 'medium-export/posts'")
        print("   OR run: python3 import_medium_export.py <path-to-posts-folder>")
        return
    
    # Create output directories
    os.makedirs('frontend/src/articles', exist_ok=True)
    os.makedirs('frontend/public/images', exist_ok=True)
    
    # Find all HTML files
    html_files = list(export_path.glob('*.html'))
    
    if not html_files:
        print(f"No HTML files found in {export_dir}")
        return
    
    print(f"Found {len(html_files)} articles to import\n")
    
    for html_file in html_files:
        print(f"Processing: {html_file.name}")
        
        article_data = extract_article_from_html(str(html_file))
        
        if not article_data:
            print(f"  ✗ Failed to parse article\n")
            continue
        
        # Generate markdown content
        md_content = f"""---
title: "{article_data['title'].replace('"', '\\"')}"
slug: "{article_data['slug']}"
date: {article_data['date']}
category: "{article_data['category']}"
excerpt: "{article_data['excerpt'].replace('"', '\\"')}"
published: true
tags:
{chr(10).join([f"  - {tag}" for tag in article_data['tags']])}
coverImage: "{article_data['coverImage']}"
---

{article_data['content']}
"""
        
        # Write markdown file
        output_path = f"frontend/src/articles/{article_data['slug']}.md"
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(md_content)
        
        print(f"  ✓ Created: {article_data['slug']}.md")
        print(f"    Title: {article_data['title']}")
        print(f"    Date: {article_data['date']}")
        print(f"    Tags: {', '.join(article_data['tags'])}\n")
    
    print(f"\nSuccessfully imported {len(html_files)} articles!")
    print("Articles saved to: frontend/src/articles/")

if __name__ == "__main__":
    import sys
    
    # Allow custom export directory as command line argument
    export_dir = sys.argv[1] if len(sys.argv) > 1 else 'medium-export/posts'
    
    process_medium_export(export_dir)
