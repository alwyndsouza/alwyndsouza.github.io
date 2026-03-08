import xml.etree.ElementTree as ET
import os
import re
import urllib.request
import time
from datetime import datetime

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')

def download_image(url, dest_path):
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

def extract_metadata():
    tree = ET.parse('medium_feed.xml')
    root = tree.getroot()
    channel = root.find('channel')

    os.makedirs('frontend/src/articles', exist_ok=True)
    os.makedirs('frontend/public/images', exist_ok=True)

    # Namespace for content:encoded
    ns = {'content': 'http://purl.org/rss/1.0/modules/content/'}

    for item in channel.findall('item'):
        title_elem = item.find('title')
        title = title_elem.text if title_elem is not None else "Untitled"

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

        img_match = re.search(r'<img[^>]+src="([^">]+)"', content_encoded)
        cover_image_url = img_match.group(1) if img_match else None

        slug = slugify(title)

        cover_image_path = ""
        if cover_image_url:
            img_ext = 'png'
            if '.jpg' in cover_image_url or '.jpeg' in cover_image_url:
                img_ext = 'jpg'
            elif '.webp' in cover_image_url:
                img_ext = 'webp'

            img_filename = f"{slug}.{img_ext}"
            local_img_path = f"frontend/public/images/{img_filename}"
            if download_image(cover_image_url, local_img_path):
                cover_image_path = f"/images/{img_filename}"

        text_content = re.sub(r'<[^>]+>', '', content_encoded)
        excerpt = text_content[:160].strip().replace('\n', ' ') + "..."

        md_content = f"""---
title: "{title.replace('"', '\\"')}"
slug: "{slug}"
date: {formatted_date}
category: "{category}"
excerpt: "{excerpt.replace('"', '\\"')}"
published: true
tags:
{chr(10).join([f"  - {tag}" for tag in categories])}
coverImage: "{cover_image_path}"
---

{content_encoded}
"""
        with open(f"frontend/src/articles/{slug}.md", 'w', encoding='utf-8') as f:
            f.write(md_content)
        print(f"Created article: {title}")

if __name__ == "__main__":
    extract_metadata()
