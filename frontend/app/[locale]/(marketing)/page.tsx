export const dynamic = 'force-dynamic'
//app/[locale]/(marketing)/page.tsx
import { Metadata } from 'next';

import ClientSlugHandler from './ClientSlugHandler';
import PageContent from '@/lib/shared/PageContent';
import JsonLd from '@/components/seo/JsonLd';
import { generateMetadataObject, buildAlternates } from '@/lib/shared/metadata';
import { renderPageJsonLd } from '@/lib/shared/structured-data';
import { getSiteLogoUrl } from '@/lib/shared/site-org';
import { getCachedGoogleRating, getGoogleReviewsWithRealPhoto } from '@/lib/shared/google-rating';
import { GoogleReviewsSection } from '@/components/google-reviews-section';
import fetchContentType from '@/lib/strapi/fetchContentType';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://davelopment.hu').replace(/\/+$/, '');

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const params = await props.params;

  const pageData = await fetchContentType(
    'pages',
    { filters: { slug: 'homepage', locale: params.locale } },
    true
  );

  return {
    ...generateMetadataObject(pageData?.seo),
    alternates: buildAlternates(
      params.locale,
      `/${params.locale}`,
      // A főoldal CMS-slugja ("homepage") a valóságban üres útvonalra
      // (/en, /hu) mutat, nem /en/homepage-re — ezért itt a sima
      // locale-gyökeret adjuk át, nem a nyers lokalizációs slugot.
      (pageData?.localizations ?? []).map((l: any) => ({ locale: l.locale, altPath: `/${l.locale}` })),
      pageData?.seo?.canonicalURL,
    ),
  };
}

export default async function HomePage(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;

  const pageData = await fetchContentType(
    'pages',
    {
      filters: {
        slug: 'homepage',
        locale: params.locale,
      },
    },
    true
  );

  // Always include both locales for the homepage — the slug is always ''
  const localizedSlugs: Record<string, string> = { hu: '', en: '' };

  const [googleRating, googleReviews] = await Promise.all([
    getCachedGoogleRating(),
    getGoogleReviewsWithRealPhoto(),
  ]);

  // Főoldali sorrend (2026-11, a redesign szerint) — itt, a frontenden rendezzük, a CMS-sorrendtől függetlenül:
  // hero · bemutatkozó blokk (HomeIntro) · projektek · szolgáltatások · árak (PricingSimple) · hogyan dolgozunk ·
  // bizalom (why-choose-us) · Google-értékelések (GoogleReviewsSection, a CMS "testimonials" helyett) · GYIK · blog · CTA · hírlevél.
  // A kapcsolat-űrlap (form-section) nincs a főoldalon. Ami a listában nem szerepel, a végére kerül.
  const rawZone: any[] = pageData?.dynamic_zone ?? [];
  const byType = (t: string) => rawZone.filter((b) => b?.blockType === t);
  const ORDER_BEFORE = ['hero', 'home-intro', 'products', 'services', 'pricing', 'how-it-works', 'why-choose-us'];
  const ORDER_AFTER = ['faq', 'blog', 'cta', 'newsletter'];
  const SKIP = new Set(['testimonials', 'form-section']);
  // Főoldali blog-blokk: 2 cikk — elöl a kiemeltek (Dave választása, 2026-11), ha nincs meg valamelyik, a legfrissebb publikált.
  // A nagy mezőket (törzsszöveg, dinamikus zóna) levágjuk, a kártyához nem kellenek.
  const PINNED_ARTICLES = [
    ['arculat-vagy-weboldal-mivel-kezdjem', 'brand-identity-or-website-first'],
    ['landing-oldal-konverzios-dizajn-elemek', 'landing-page-conversion-design-elements'],
  ];
  const latestRes = await fetchContentType('articles', { filters: { locale: params.locale, _status: 'published' } }, false);
  const latestArticles = ((latestRes?.data ?? []) as any[])
    .filter((x) => x?.slug)
    .sort((x, y) => new Date(y.publishedAt || y.createdAt || 0).getTime() - new Date(x.publishedAt || x.createdAt || 0).getTime())
    .sort((x, y) => {
      const rank = (a: any) => { const i = PINNED_ARTICLES.findIndex((slugs) => slugs.includes(a.slug)); return i === -1 ? PINNED_ARTICLES.length : i; };
      return rank(x) - rank(y);
    })
    .slice(0, 2)
    .map(({ content, dynamic_zone, ...rest }: any) => rest);
  const pick = (types: string[]) =>
    types.flatMap((t) => (t === 'home-intro' ? [{ blockType: 'home-intro', id: 'home-intro' }] : byType(t)))
      .map((b) => (b?.blockType === 'pricing' ? { ...b, blockType: 'pricing-simple' } : b))
      .map((b) => (b?.blockType === 'blog' && latestArticles.length ? { ...b, articles: latestArticles } : b));
  const listed = new Set([...ORDER_BEFORE, ...ORDER_AFTER]);
  const zoneBeforeReviews = pick(ORDER_BEFORE);
  const zoneAfterReviews = [...pick(ORDER_AFTER), ...rawZone.filter((b) => !listed.has(b?.blockType) && !SKIP.has(b?.blockType))];

  const jsonLd = renderPageJsonLd({
    kind: 'home',
    logoUrl: await getSiteLogoUrl(),
    googleRating,
    url: pageData?.seo?.canonicalURL || `${SITE_URL}/${params.locale}`,
    locale: params.locale,
    title: pageData?.seo?.metaTitle || pageData?.label || '[davelopment]©',
    description: pageData?.seo?.metaDescription,
    dynamicZone: pageData?.dynamic_zone,
    updatedAt: pageData?.updatedAt,
    override: pageData?.seo?.structuredData,
  });

  return (
    <>
      <JsonLd data={jsonLd} />
      <ClientSlugHandler localizedSlugs={localizedSlugs} />
      <PageContent pageData={{ ...pageData, dynamic_zone: zoneBeforeReviews }} locale={params.locale} />
      <GoogleReviewsSection locale={params.locale} rating={googleRating} reviews={googleReviews} />
      <PageContent pageData={{ ...pageData, dynamic_zone: zoneAfterReviews }} locale={params.locale} />
    </>
  );
}