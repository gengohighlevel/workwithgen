import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  jsonLd?: Record<string, unknown>;
}

const BASE_URL = 'https://workwithgen.space';
const SITE_NAME = 'Work with Gen';
const DEFAULT_IMAGE = 'https://storage.googleapis.com/msgsndr/P7WTdwLMsDsnEHkSqqXD/media/694032eb97c0234edc30e72c.png';

function setMetaTag(property: string, content: string, isName = false) {
  const attr = isName ? 'name' : 'property';
  let el = document.querySelector(`meta[${attr}="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLinkTag(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export default function useSEO({ title, description, canonical, ogImage, ogType = 'website', jsonLd }: SEOProps) {
  useEffect(() => {
    const fullTitle = `${title} | ${SITE_NAME}`;
    document.title = fullTitle;

    setMetaTag('description', description, true);

    // Open Graph
    setMetaTag('og:title', fullTitle);
    setMetaTag('og:description', description);
    setMetaTag('og:type', ogType);
    setMetaTag('og:site_name', SITE_NAME);
    setMetaTag('og:image', ogImage || DEFAULT_IMAGE);
    setMetaTag('og:url', canonical || `${BASE_URL}${window.location.pathname}`);

    // Twitter Card
    setMetaTag('twitter:card', 'summary_large_image', true);
    setMetaTag('twitter:title', fullTitle, true);
    setMetaTag('twitter:description', description, true);
    setMetaTag('twitter:image', ogImage || DEFAULT_IMAGE, true);

    // Canonical
    setLinkTag('canonical', canonical || `${BASE_URL}${window.location.pathname}`);

    // JSON-LD
    const existingLd = document.querySelector('script[data-seo-ld]');
    if (existingLd) existingLd.remove();

    if (jsonLd) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo-ld', 'true');
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      const ld = document.querySelector('script[data-seo-ld]');
      if (ld) ld.remove();
    };
  }, [title, description, canonical, ogImage, ogType, jsonLd]);
}
