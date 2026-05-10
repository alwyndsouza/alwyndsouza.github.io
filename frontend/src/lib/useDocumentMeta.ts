import { useEffect } from 'react';
import { site } from '@/data/config';

interface DocumentMetaOptions {
  /** Page-specific title fragment. Will be appended " — {site.name}" unless full=true. */
  title: string;
  /** If true, the title is used as-is and not suffixed. */
  full?: boolean;
  description?: string;
  /** Path beneath the site root, e.g. `/articles/foo`. Used for canonical / og:url. */
  path?: string;
  /** Absolute or root-relative image path for og:image. */
  image?: string;
  type?: 'website' | 'article';
}

function setMeta(selector: string, attr: 'name' | 'property', key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function absoluteUrl(p: string): string {
  if (/^https?:\/\//i.test(p)) return p;
  const trimmed = site.url.replace(/\/$/, '');
  return trimmed + (p.startsWith('/') ? p : `/${p}`);
}

/**
 * Keeps `document.title` and the head meta tags in sync as the user
 * navigates the SPA. The build-time SEO plugin already pre-renders
 * static meta for crawlers; this hook handles the in-app experience.
 */
export function useDocumentMeta(opts: DocumentMetaOptions) {
  const { title, full, description, path, image, type = 'website' } = opts;
  useEffect(() => {
    const fullTitle = full ? title : `${title} — ${site.name}`;
    document.title = fullTitle;

    const desc = description ?? site.description;
    setMeta('meta[name="description"]', 'name', 'description', desc);

    const url = absoluteUrl(path ?? '/');
    setLink('canonical', url);

    setMeta('meta[property="og:type"]', 'property', 'og:type', type);
    setMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle);
    setMeta('meta[property="og:description"]', 'property', 'og:description', desc);
    setMeta('meta[property="og:url"]', 'property', 'og:url', url);
    setMeta(
      'meta[property="og:image"]',
      'property',
      'og:image',
      absoluteUrl(image ?? site.defaultOgImage),
    );

    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', desc);
    setMeta(
      'meta[name="twitter:image"]',
      'name',
      'twitter:image',
      absoluteUrl(image ?? site.defaultOgImage),
    );
  }, [title, full, description, path, image, type]);
}
