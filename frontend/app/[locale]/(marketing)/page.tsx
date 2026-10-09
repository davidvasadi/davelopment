export const dynamic = 'force-dynamic'
//app/[locale]/(marketing)/page.tsx
import { Metadata } from 'next';

import ClientSlugHandler from './ClientSlugHandler';
import PageContent from '@/lib/shared/PageContent';
import JsonLd from '@/components/seo/JsonLd';
import { generateMetadataObject, buildAlternates } from '@/lib/shared/metadata';
import { renderPageJsonLd } from '@/lib/shared/structured-data';
import { getSiteLogoUrl } from '@/lib/shared/site-org';
import { getCachedGoogleRating, getCachedGoogleReviews } from '@/lib/shared/google-rating';
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
    getCachedGoogleReviews(),
  ]);

  // A CMS-es "testimonials" blokk helyett immár a saját, élő Google-adatot
  // húzó GoogleReviewsSection jelenik meg — pontosan ott, ahol a CMS-blokk
  // korábban volt (Árak/pricing szekció előtt), hogy a kinézet és a
  // pozíció is megmaradjon.
  const rawZone: any[] = pageData?.dynamic_zone ?? [];
  const zoneWithoutTestimonials = rawZone.filter((b) => b?.blockType !== 'testimonials');
  const pricingIndex = zoneWithoutTestimonials.findIndex((b) => b?.blockType === 'pricing');
  const zoneBeforeReviews = pricingIndex === -1 ? zoneWithoutTestimonials : zoneWithoutTestimonials.slice(0, pricingIndex);
  const zoneAfterReviews = pricingIndex === -1 ? [] : zoneWithoutTestimonials.slice(pricingIndex);

  const jsonLd = renderPageJsonLd({
    kind: 'home',
    logoUrl: await getSiteLogoUrl(),
    googleRating,
    url: pageData?.seo?.canonicalURL || `${SITE_URL}/${params.locale}`,
    locale: params.locale,
    title: pageData?.seo?.metaTitle || pageData?.label || '[davelopment]©',
    description: pageData?.seo?.metaDescription,
    dynamicZone: pageData?.dynamic_zone,
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