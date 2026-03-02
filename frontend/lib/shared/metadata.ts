import type { Metadata } from 'next';
import { strapiImage } from '../strapi/strapiImage';

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
  structuredData?: string | Record<string, any> | null;
};

export function generateMetadataObject(seo: AnySEO | undefined | null): Metadata {
  return {
    title: seo?.metaTitle || 'Default Title',
    description: seo?.metaDescription || 'Default Description',
    ...(seo?.metaRobots && {
      robots: seo.metaRobots,
    }),
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
