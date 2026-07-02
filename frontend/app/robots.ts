import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://davelopment.hu').replace(/\/+$/, '');

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/'],
        disallow: ['/api', '/admin', '/draft', '/_next'],
      },
    ],
    sitemap: [`${base}/sitemap.xml`],
    host: base,
  };
}
