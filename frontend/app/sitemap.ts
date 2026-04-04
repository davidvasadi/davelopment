import type { MetadataRoute } from 'next';
import { getLocalizedSegment } from '@/lib/i18n/segments';

const BASE = (process.env.NEXT_PUBLIC_SITE_URL || 'https://davelopment.hu').replace(/\/+$/, '');
const LOCALES = ['hu', 'en'] as const;
const PAYLOAD = (process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:1337').replace(/\/+$/, '');

async function fetchAll(collection: string, locale: string): Promise<any[]> {
  try {
    const res = await fetch(
      `${PAYLOAD}/api/${collection}?locale=${locale}&limit=200&depth=0`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.docs ?? [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  // ── Static top-level pages ────────────────────────────────────────────────
  const staticPages: Array<{ huPath: string; enPath: string; priority: number; freq: MetadataRoute.Sitemap[number]['changeFrequency'] }> = [
    { huPath: '/hu',                  enPath: '/en',                  priority: 1.0, freq: 'daily' },
    { huPath: '/hu/blog',             enPath: '/en/blog',             priority: 0.9, freq: 'daily' },
    { huPath: '/hu/projektek',        enPath: '/en/products',         priority: 0.8, freq: 'weekly' },
    { huPath: '/hu/szolgaltatasok',   enPath: '/en/services',         priority: 0.8, freq: 'weekly' },
    { huPath: '/hu/arak',             enPath: '/en/pricing',          priority: 0.7, freq: 'weekly' },
    { huPath: '/hu/kapcsolat',        enPath: '/en/contact',          priority: 0.7, freq: 'monthly' },
    { huPath: '/hu/adatkezeles',      enPath: '/en/privacy',          priority: 0.3, freq: 'yearly' },
  ];

  for (const page of staticPages) {
    entries.push({
      url: `${BASE}${page.huPath}`,
      lastModified: now,
      changeFrequency: page.freq,
      priority: page.priority,
      alternates: { languages: { hu: `${BASE}${page.huPath}`, en: `${BASE}${page.enPath}`, 'x-default': `${BASE}${page.huPath}` } },
    });
    entries.push({
      url: `${BASE}${page.enPath}`,
      lastModified: now,
      changeFrequency: page.freq,
      priority: page.priority * 0.9,
      alternates: { languages: { hu: `${BASE}${page.huPath}`, en: `${BASE}${page.enPath}`, 'x-default': `${BASE}${page.huPath}` } },
    });
  }

  // ── Blog articles ─────────────────────────────────────────────────────────
  const [huArticles, enArticles] = await Promise.all([
    fetchAll('articles', 'hu'),
    fetchAll('articles', 'en'),
  ]);

  const huArticleMap = Object.fromEntries(huArticles.map((a: any) => [a.slug, a]));
  const enArticleMap = Object.fromEntries(enArticles.map((a: any) => [a.slug, a]));

  // Process hu articles (canonical)
  for (const article of huArticles) {
    if (!article.slug) continue;
    const enAlt = enArticles.find((e: any) => e.id === article.id || e.slug === article.slug);
    const enSlug = enAlt?.slug ?? article.slug;
    entries.push({
      url: `${BASE}/hu/blog/${article.slug}`,
      lastModified: new Date(article.updatedAt ?? now),
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: {
        languages: {
          hu: `${BASE}/hu/blog/${article.slug}`,
          en: `${BASE}/en/blog/${enSlug}`,
          'x-default': `${BASE}/hu/blog/${article.slug}`,
        },
      },
    });
  }

  // En-only articles (no hu equivalent)
  for (const article of enArticles) {
    if (!article.slug) continue;
    const huEquiv = huArticles.find((h: any) => h.id === article.id || h.slug === article.slug);
    if (huEquiv) continue; // already added above
    entries.push({
      url: `${BASE}/en/blog/${article.slug}`,
      lastModified: new Date(article.updatedAt ?? now),
      changeFrequency: 'monthly',
      priority: 0.65,
      alternates: { languages: { en: `${BASE}/en/blog/${article.slug}` } },
    });
  }

  // ── Products ──────────────────────────────────────────────────────────────
  const [huProducts, enProducts] = await Promise.all([
    fetchAll('products', 'hu'),
    fetchAll('products', 'en'),
  ]);

  for (const product of huProducts) {
    if (!product.slug) continue;
    const enAlt = enProducts.find((e: any) => e.id === product.id || e.slug === product.slug);
    const enSlug = enAlt?.slug ?? product.slug;
    entries.push({
      url: `${BASE}/hu/projektek/${product.slug}`,
      lastModified: new Date(product.updatedAt ?? now),
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: {
        languages: {
          hu: `${BASE}/hu/projektek/${product.slug}`,
          en: `${BASE}/en/products/${enSlug}`,
          'x-default': `${BASE}/hu/projektek/${product.slug}`,
        },
      },
    });
    entries.push({
      url: `${BASE}/en/products/${enSlug}`,
      lastModified: new Date(product.updatedAt ?? now),
      changeFrequency: 'monthly',
      priority: 0.75,
      alternates: {
        languages: {
          hu: `${BASE}/hu/projektek/${product.slug}`,
          en: `${BASE}/en/products/${enSlug}`,
          'x-default': `${BASE}/hu/projektek/${product.slug}`,
        },
      },
    });
  }

  // ── Service sub-pages (pages collection filtered by slug pattern) ─────────
  const [huPages, enPages] = await Promise.all([
    fetchAll('pages', 'hu'),
    fetchAll('pages', 'en'),
  ]);

  const servicePageSlugs = new Set([
    'branding-arculat', 'ux-ui-design-fejlesztes',
    'digitalis-rendszerek', 'seo-tartalommarketing',
  ]);

  for (const page of huPages) {
    if (!page.slug || !servicePageSlugs.has(page.slug)) continue;
    const enAlt = enPages.find((e: any) => e.id === page.id || e.slug === page.slug);
    const enSlug = enAlt?.slug ?? page.slug;
    entries.push({
      url: `${BASE}/hu/szolgaltatasok/${page.slug}`,
      lastModified: new Date(page.updatedAt ?? now),
      changeFrequency: 'monthly',
      priority: 0.75,
      alternates: {
        languages: {
          hu: `${BASE}/hu/szolgaltatasok/${page.slug}`,
          en: `${BASE}/en/services/${enSlug}`,
          'x-default': `${BASE}/hu/szolgaltatasok/${page.slug}`,
        },
      },
    });
  }

  return entries;
}
