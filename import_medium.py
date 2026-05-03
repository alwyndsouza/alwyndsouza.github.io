import xml.etree.ElementTree as ET
import os
import re
from datetime import datetime
import html
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

        content_cleaned = re.sub(r'<div class="medium-feed-item">.*?</div>', '', content_encoded, flags=re.DOTALL)

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
