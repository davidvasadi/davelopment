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
};

export function generateMetadataObject(seo: AnySEO | undefined | null): Metadata {
  return {
    title: seo?.metaTitle || 'Default Title',
    description: seo?.metaDescription || 'Default Description',
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
