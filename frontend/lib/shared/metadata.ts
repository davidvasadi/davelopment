import type { Metadata } from 'next';
import { strapiImage } from '../strapi/strapiImage';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://davelopment.hu').replace(/\/+$/, '');

type AnySEO = {
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  metaImage?: { url: string } | null;
  twitterCard?: string | null;
  twitterTitle?: string | null;
  twitterDescription?: string | null;
  twitterImage?: string | null;
  canonicalURL?: string | null;
  metaRobots?: string | null;
  noindex?: boolean | null;
  structuredData?: string | Record<string, any> | null;
};

/**
 * Builds hreflang + canonical alternates for a page.
 *
 * currentLocale  — active locale, e.g. 'hu'
 * currentPath    — full path WITHOUT trailing slash, e.g. '/hu/blog/my-slug'
 * localizations  — Payload localizations array: [{ locale: 'en', slug?: 'alt-slug', altPath?: '/en/blog/alt-slug' }]
 *   - altPath: use this exact path for the alternate locale (overrides slug logic)
 *   - slug: if provided, the last segment of the path is replaced with this slug
 *   - neither: only the locale prefix is swapped
 * canonicalURL   — explicit canonical override
 */
export function buildAlternates(
  currentLocale: string,
  currentPath: string,
  localizations?: Array<{ locale: string; slug?: string; altPath?: string }> | null,
  canonicalURL?: string | null,
): Metadata['alternates'] {
  const canonical = canonicalURL || `${SITE_URL}${currentPath}`

  const languages: Record<string, string> = {
    [currentLocale]: `${SITE_URL}${currentPath}`,
    'x-default': `${SITE_URL}${currentPath}`,
  }

  for (const loc of localizations ?? []) {
    if (!loc.locale) continue

    let altPath: string
    if (loc.altPath) {
      // Explicit full path provided
      altPath = loc.altPath
    } else {
      // Swap locale prefix
      altPath = currentPath.replace(`/${currentLocale}`, `/${loc.locale}`)
      // If a localized slug is provided, replace the last segment
      if (loc.slug) {
        const lastSlash = altPath.lastIndexOf('/')
        altPath = altPath.substring(0, lastSlash + 1) + loc.slug
      }
    }

    languages[loc.locale] = `${SITE_URL}${altPath}`
    // x-default points to the Hungarian version
    if (loc.locale === 'hu') {
      languages['x-default'] = `${SITE_URL}${altPath}`
    }
  }

  // If current locale is hu, x-default already set above; if not, set it now
  if (!languages['x-default'] || languages['x-default'] === `${SITE_URL}${currentPath}`) {
    languages['x-default'] = currentLocale === 'hu'
      ? `${SITE_URL}${currentPath}`
      : languages['hu'] ?? `${SITE_URL}${currentPath}`
  }

  return { canonical, languages }
}

export function generateMetadataObject(seo: AnySEO | undefined | null): Metadata {
  return {
    title: seo?.metaTitle || 'Default Title',
    description: seo?.metaDescription || 'Default Description',
    robots: seo?.noindex
      ? 'noindex, nofollow'
      : seo?.metaRobots || undefined,
    ...(seo?.canonicalURL && {
      alternates: { canonical: seo.canonicalURL },
    }),
    openGraph: {
      title: seo?.ogTitle || seo?.metaTitle || 'Default OG Title',
      description: seo?.ogDescription || seo?.metaDescription || 'Default OG Description',
      images: seo?.metaImage?.url ? [{ url: strapiImage(seo.metaImage.url) }] : [],
    },
    twitter: {
      card: (seo?.twitterCard as any) || 'summary_large_image',
      title: seo?.twitterTitle || seo?.metaTitle || 'Default Twitter Title',
      description: seo?.twitterDescription || seo?.metaDescription || 'Default Twitter Description',
      images: seo?.twitterImage ? [seo.twitterImage] : [],
    },
  };
}

/**
 * A Strapi seo.structuredData mezőből kinyeri a JSON-LD stringet.
 * Használd: <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: getStructuredData(seo) }} />
 */
export function getStructuredData(seo: AnySEO | undefined | null): string | null {
  const data = seo?.structuredData;
  if (!data) return null;

  const json = typeof data === 'string' ? data : JSON.stringify(data);
  if (!json || json === 'null' || json === '""') return null;

  return json;
}
