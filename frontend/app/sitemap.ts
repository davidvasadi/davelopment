import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const locales = ['en', 'fr','hu'] as const;

  // Statikusan felsorolva a fő marketing oldalak – később kiválthatjuk Strapi-lekérdezéssel
  const routes = ['homepage', 'pricing', 'products', 'blog', 'contact', 'faq', 'sign-up'];
  const now = new Date();

  return locales.flatMap((locale) =>
    routes.map((slug) => ({
      url: `${base}/${locale}/${slug}`,
      lastModified: now,
      changeFrequency: slug === 'homepage' ? 'daily' : 'weekly',
      priority: slug === 'homepage' ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${base}/${l}/${slug}`])),
      },
    }))
  );
}
