import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  type?: string;
  image?: string;
  jsonLd?: Record<string, unknown>;
}

const SITE_NAME = 'ESPECTRO FEDERAL';
const DEFAULT_DESCRIPTION = 'Premium cybersecurity tools for penetration testing, OSINT, blue team defense, and security automation by ESPECTRO FEDERAL.';
const BASE_URL = 'https://espectrofederal.lovable.app';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;

export function SEOHead({
  title,
  description = DEFAULT_DESCRIPTION,
  canonical,
  type = 'website',
  image = DEFAULT_IMAGE,
  jsonLd,
}: SEOHeadProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Ethical Hacking & Cybersecurity Tools`;

  useEffect(() => {
    // Title
    document.title = fullTitle;

    // Meta tags
    const metaTags: Record<string, string> = {
      description,
      'og:title': fullTitle,
      'og:description': description,
      'og:type': type,
      'og:image': image,
      'og:site_name': SITE_NAME,
      'og:url': canonical || BASE_URL,
      'twitter:card': 'summary_large_image',
      'twitter:title': fullTitle,
      'twitter:description': description,
      'twitter:image': image,
    };

    Object.entries(metaTags).forEach(([name, content]) => {
      const isOg = name.startsWith('og:') || name.startsWith('twitter:');
      const attr = isOg ? 'property' : 'name';
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    });

    // Canonical
    let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute('href', canonical || BASE_URL);

    // JSON-LD
    if (jsonLd) {
      const existingScript = document.querySelector('script[data-seo-jsonld]');
      if (existingScript) existingScript.remove();
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo-jsonld', 'true');
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      const existingScript = document.querySelector('script[data-seo-jsonld]');
      if (existingScript) existingScript.remove();
    };
  }, [fullTitle, description, canonical, type, image, jsonLd]);

  return null;
}
