import xml.etree.ElementTree as ET
import os
import re
import urllib.request
import time
from datetime import datetime
import html
import json
from markdownify import markdownify as md_convert


def html_to_markdown(html_content):
    """
    Convert HTML content to clean markdown.

    Parameters:
        html_content (str): HTML string to convert.

    Returns:
        str: Converted markdown string.
    """
    result = md_convert(
        html_content,
        heading_style="ATX",
        bullets="*",
        newline_style="backslash",
        strip=["span"],
    )
    # Collapse 3+ blank lines to 2
    result = re.sub(r"\n{3,}", "\n\n", result)
    # Fix escaped hyphens/dots that markdownify over-escapes
    result = result.replace(r"\-", "-")
    result = result.replace(r"\.", ".")
    # Remove backslash line-continuations inside fenced code blocks
    def fix_codeblock(m):
        return m.group(0).replace("\\\n", "\n")
    result = re.sub(r"```[\s\S]*?```", fix_codeblock, result)
    return result.strip()

def slugify(text):
    """
    Create a URL-friendly slug from the given text.
    
    Parameters:
        text (str): Input string to convert.
    
    Returns:
        str: Lowercase string where consecutive non-alphanumeric characters are replaced by single hyphens and any leading or trailing hyphens are removed.
    """
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')

def download_image(url, dest_path):
    """
    Download an image from a URL to a local filesystem path, with retries and simple backoff.
    
    Parameters:
        url (str): HTTP(S) URL of the image to download.
        dest_path (str): Local filesystem path where the image will be saved. If the file already exists, no download is attempted.
    
    Returns:
        bool: `True` if the image file exists at `dest_path` after the call (either preexisting or successfully downloaded), `False` if all download attempts failed.
    """
    if os.path.exists(dest_path):
        return True

    backoff = 1
    for i in range(3):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req) as response:
                with open(dest_path, 'wb') as out_file:
                    out_file.write(response.read())
            return True
        except Exception as e:
            print(f"Attempt {i+1} failed to download {url}: {e}")
            if "429" in str(e):
                time.sleep(backoff)
                backoff *= 2
            else:
                break
    return False

def fetch_medium_article_content(url):
    """
    Fetch the full article content from a Medium article URL.
    
    Parameters:
        url (str): The Medium article URL
        
    Returns:
        str: The article content as HTML, or empty string if fetch fails
    """
    try:
        req = urllib.request.Request(url, headers={
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        })
        with urllib.request.urlopen(req, timeout=10) as response:
            html_content = response.read().decode('utf-8')
        
        # Extract article content - look for main article sections
        # Medium wraps article paragraphs in elements with specific class patterns
        content_parts = []
        
        # Extract paragraphs with pw-post-body-paragraph class
        paragraph_pattern = r'<p[^>]*class="[^"]*pw-post-body-paragraph[^"]*"[^>]*>(.*?)</p>'
        paragraphs = re.findall(paragraph_pattern, html_content, re.DOTALL)
        
        # Extract headings (h2, h3, h4)
        heading_pattern = r'<(h[234])[^>]*id="[^"]*"[^>]*>(.*?)</\1>'
        headings = re.findall(heading_pattern, html_content, re.DOTALL)
        
        # Extract blockquotes
        blockquote_pattern = r'<blockquote[^>]*class="[^"]*"[^>]*>(.*?)</blockquote>'
        blockquotes = re.findall(blockquote_pattern, html_content, re.DOTALL)
        
        # Extract figures/images
        figure_pattern = r'<figure[^>]*class="[^"]*paragraph-image[^"]*"[^>]*>.*?<img[^>]*src="([^"]+)"[^>]*>.*?(?:<figcaption[^>]*>(.*?)</figcaption>)?.*?</figure>'
        figures = re.findall(figure_pattern, html_content, re.DOTALL)
        
        # Extract list items
        li_pattern = r'<li[^>]*class="[^"]*"[^>]*>(.*?)</li>'
        list_items = re.findall(li_pattern, html_content, re.DOTALL)
        
        # Build structured content by finding ordinal positions
        # This is simplified - we'll extract content in order it appears
        content_html = []
        
        # Find all content blocks with id attributes (Medium uses these for ordering)
        content_block_pattern = r'<(p|h2|h3|h4|blockquote|figure)[^>]*id="([^"]*)"[^>]*class="[^"]*(?:pw-post-body-paragraph|qa qb|oj ok)[^"]*"[^>]*>(.*?)</\1>'
        blocks = re.findall(content_block_pattern, html_content, re.DOTALL)
        
        for tag, block_id, content in blocks:
            # Clean up the content - remove nested spans and preserve only text and basic formatting
            clean_content = clean_medium_html(content)
            
            if tag == 'h2':
                content_html.append(f'<h2>{clean_content}</h2>')
            elif tag == 'h3':
                content_html.append(f'<h3>{clean_content}</h3>')
            elif tag == 'h4':
                content_html.append(f'<h4>{clean_content}</h4>')
            elif tag == 'blockquote':
                content_html.append(f'<blockquote>{clean_content}</blockquote>')
            elif tag == 'p':
                content_html.append(f'<p>{clean_content}</p>')
        
        # Add images
        for img_src, caption in figures:
            if caption:
                clean_caption = clean_medium_html(caption)
                content_html.append(f'<figure><img src="{img_src}" alt="" /><figcaption>{clean_caption}</figcaption></figure>')
            else:
                content_html.append(f'<img src="{img_src}" alt="" />')
        
        # Join with line breaks
        result = '\n\n'.join(content_html)
        
        return result if result else ""
            
    except Exception as e:
        print(f"Error fetching Medium article from {url}: {e}")
    
    return ""

def clean_medium_html(html_text):
    """
    Clean Medium-specific HTML markup, keeping only content and basic formatting.
    
    Parameters:
        html_text (str): Raw HTML with Medium classes
        
    Returns:
        str: Cleaned HTML with basic formatting preserved
    """
    # Remove all span tags but keep their content
    text = re.sub(r'<span[^>]*>', '', html_text)
    text = re.sub(r'</span>', '', text)
    
    # Remove div tags but keep content
    text = re.sub(r'<div[^>]*>', '', text)
    text = re.sub(r'</div>', '', text)
    
    # Keep strong, em, code, a tags
    # Remove other tags except the ones we want to keep
    text = re.sub(r'<(?!/?(?:strong|em|code|a|br)\b)[^>]*>', '', text)
    
    # Clean up multiple spaces and newlines
    text = re.sub(r'\s+', ' ', text)
    text = text.strip()
    
    return text

def extract_metadata():
    """
    Parse 'medium_feed.xml' and generate Markdown article files and image assets for the frontend.
    
    Reads the RSS feed from 'medium_feed.xml', extracts each item’s title, link, publication date, categories, description/content, and first embedded image (if any); creates directories 'frontend/src/articles' and 'frontend/public/images' as needed; downloads cover images into the images directory when available; generates a slug for each item, a plain-text excerpt (first 160 characters), and a Markdown file with YAML front matter written to 'frontend/src/articles/{slug}.md'. If an item's publication date cannot be parsed, the current date is used; if no category is present, the category defaults to "Data Engineering". This function does not return a value.
    """
    tree = ET.parse('medium_feed.xml')
    root = tree.getroot()
    channel = root.find('channel')

    os.makedirs('frontend/src/articles', exist_ok=True)
    os.makedirs('frontend/public/images', exist_ok=True)

    # Namespace for content:encoded
    ns = {'content': 'http://purl.org/rss/1.0/modules/content/'}

    for item in channel.findall('item'):
        title_elem = item.find('title')
        title = html.unescape(title_elem.text) if title_elem is not None else "Untitled"

        link_elem = item.find('link')
        link = link_elem.text if link_elem is not None else ""

        pub_date_str_elem = item.find('pubDate')
        pub_date_str = pub_date_str_elem.text if pub_date_str_elem is not None else "Sat, 01 Jan 2000 00:00:00 GMT"

        try:
            pub_date = datetime.strptime(pub_date_str, '%a, %d %b %Y %H:%M:%S %Z')
        except ValueError:
             pub_date = datetime.now()

        formatted_date = pub_date.strftime('%Y-%m-%d')

        categories = [cat.text for cat in item.findall('category')]
        category = categories[0] if categories else 'Data Engineering'

        description_elem = item.find('description')
        description = description_elem.text if description_elem is not None else ""

        content_encoded_elem = item.find('content:encoded', ns)
        content_encoded = content_encoded_elem.text if content_encoded_elem is not None else description

        # Get cover image from RSS feed
        img_match = re.search(r'<img[^>]+src="([^">]+)"', content_encoded)
        cover_image_url = img_match.group(1) if img_match else ""

        slug = slugify(title)
        
        # Fetch full article content from Medium
        print(f"Fetching full content for: {title}")
        full_content = fetch_medium_article_content(link)
        
        # Fallback to RSS content if fetch fails
        if not full_content or len(full_content) < 100:
            print(f"  - Using RSS feed content (full fetch failed or too short)")
            content_cleaned = re.sub(r'<div class="medium-feed-item">.*?</div>', '', content_encoded, flags=re.DOTALL)
        else:
            print(f"  - Successfully fetched full article content")
            content_cleaned = full_content
        
        # Create excerpt from cleaned content
        text_content = re.sub(r'<[^>]+>', '', content_cleaned)
        text_content = html.unescape(text_content)
        excerpt = text_content[:160].strip().replace('\n', ' ')
        if len(text_content) > 160:
            excerpt += "..."

        # Convert HTML body to markdown
        content_markdown = html_to_markdown(content_cleaned)

        # Append canonical link footer in markdown format
        if link:
            content_markdown += f'\n\n---\n\n*This article was originally published at <{link}>*'

        # Small delay to avoid rate limiting
        time.sleep(1)

        safe_title = title.replace('"', '\\"')
        safe_excerpt = excerpt.replace('"', '\\"')
        tags_yaml = "\n".join([f"  - {tag}" for tag in categories])
        md_content = (
            f'---\n'
            f'title: "{safe_title}"\n'
            f'slug: "{slug}"\n'
            f'date: {formatted_date}\n'
            f'category: "{category}"\n'
            f'excerpt: "{safe_excerpt}"\n'
            f'published: true\n'
            f'tags:\n'
            f'{tags_yaml}\n'
            f'coverImage: "{cover_image_url}"\n'
            f'---\n\n'
            f'{content_markdown}\n'
        )
        with open(f"frontend/src/articles/{slug}.md", 'w', encoding='utf-8') as f:
            f.write(md_content)
        print(f"Created article: {title}")

if __name__ == "__main__":
    extract_metadata()
