import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://davelopment.hu').replace(/\/+$/, '');

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/api/media'],
        // A /_next NINCS tiltva (2026-11-20): ott vannak a CSS / JS fájlok és a képek (/_next/image) — tiltva a Google
        // stílus nélkül látta az oldalt, és a képeket (főoldalon 30 db) nem indexelhette. Az eredeti sablonból maradt.
        disallow: ['/api', '/admin', '/draft'],
      },
    ],
    sitemap: [`${base}/sitemap.xml`],
    host: base,
  };
}
