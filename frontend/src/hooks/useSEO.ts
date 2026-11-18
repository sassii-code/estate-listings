import { useEffect } from 'react';

const SITE_URL = 'https://buildestate.vercel.app';
const BRAND_NAME = 'MAA DURGA PROPERTIES';
const DEFAULT_TITLE = `${BRAND_NAME} | Property in Haridwar`;
const DEFAULT_DESCRIPTION = 'Buy, sell, or rent residential, commercial, and industrial property in Haridwar with MAA DURGA PROPERTIES.';

interface SEOProps {
  title?: string;
  description?: string;
  /** Absolute URL to the OG/Twitter card image, if available */
  image?: string;
  /** Canonical URL. Defaults to current window.location.href */
  url?: string;
  type?: 'website' | 'article';
}

function setMeta(selector: string, attr: string, value: string, content: string) {
  let el = document.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, value);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setOG(property: string, content: string) {
  setMeta(`meta[property="${property}"]`, 'property', property, content);
}

function setTwitter(name: string, content: string) {
  setMeta(`meta[name="${name}"]`, 'name', name, content);
}

function setCanonical(url: string) {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  link.href = url;
}

export function useSEO({ title, description, image, url, type = 'website' }: SEOProps) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${BRAND_NAME}` : DEFAULT_TITLE;
    const desc = description || DEFAULT_DESCRIPTION;
    const canonical = url || window.location.href;

    // <title>
    document.title = fullTitle;

    // <meta name="description">
    setMeta('meta[name="description"]', 'name', 'description', desc);

    // Open Graph
    setOG('og:title', fullTitle);
    setOG('og:description', desc);
    if (image) {
      setOG('og:image', image);
    } else {
      document.querySelector('meta[property="og:image"]')?.remove();
    }
    setOG('og:url', canonical);
    setOG('og:type', type);

    // Twitter Card
    setTwitter('twitter:title', fullTitle);
    setTwitter('twitter:description', desc);
    if (image) {
      setTwitter('twitter:image', image);
    } else {
      document.querySelector('meta[name="twitter:image"]')?.remove();
    }

    // Canonical URL
    setCanonical(canonical);

    return () => {
      document.title = DEFAULT_TITLE;
      setMeta('meta[name="description"]', 'name', 'description', DEFAULT_DESCRIPTION);
      setOG('og:title', DEFAULT_TITLE);
      setOG('og:description', DEFAULT_DESCRIPTION);
      document.querySelector('meta[property="og:image"]')?.remove();
      setOG('og:url', SITE_URL);
      setOG('og:type', 'website');
      setTwitter('twitter:title', DEFAULT_TITLE);
      setTwitter('twitter:description', DEFAULT_DESCRIPTION);
      document.querySelector('meta[name="twitter:image"]')?.remove();
      setCanonical(SITE_URL);
    };
  }, [title, description, image, url, type]);
}
