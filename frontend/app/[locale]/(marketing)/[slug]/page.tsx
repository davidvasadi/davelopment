export const dynamic = 'force-dynamic'
//app/[locale]/(marketing)/[slug]/page.tsx
import { Metadata } from 'next';

import ClientSlugHandler from '../ClientSlugHandler';
import PageContent from '@/lib/shared/PageContent';
import JsonLd from '@/components/seo/JsonLd';
import { generateMetadataObject, buildAlternates } from '@/lib/shared/metadata';
import { renderPageJsonLd } from '@/lib/shared/structured-data';
import { getSiteLogoUrl } from '@/lib/shared/site-org';
import { getCachedGoogleRating } from '@/lib/shared/google-rating';
import fetchContentType from '@/lib/strapi/fetchContentType';
import  {notFound, permanentRedirect}  from 'next/navigation';
import { ServiceDetailHero } from '@/components/services/service-detail-hero';
import { ServiceIncluded } from '@/components/services/service-included';
import { ServiceTimeline } from '@/components/services/service-timeline';
import { ServiceEnd } from '@/components/services/service-end';
import { getServiceDetail } from '@/lib/services/service-details';
import { getLocalizedSegment } from '@/lib/i18n/segments';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://davelopment.hu').replace(/\/+$/, '');
const CITY_SLUGS = new Set(['weboldal-keszites-budapest', 'weboldal-keszites-debrecen', 'web-design-budapest', 'web-design-debrecen']);

// Slugs that were renamed after being live — redirect the old URL to the new one
// so any existing backlinks/bookmarks/search index entries aren't broken.
const LEGACY_SLUG_REDIRECTS: Record<string, string> = {
  'en/weboldal-keszites': 'en/start-your-business-online',
};

export async function generateMetadata(props: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  if (params.slug === 'homepage') permanentRedirect(`/${params.locale}`);
  const legacyTarget = LEGACY_SLUG_REDIRECTS[`${params.locale}/${params.slug}`];
  if (legacyTarget) permanentRedirect(`/${legacyTarget}`);
  const pageData = await fetchContentType(
    'pages',
    {
      filters: {
        slug: params.slug,
        locale: params.locale,
      },
    },
    true
  );
  if (!pageData) return {};
  return {
    ...generateMetadataObject(pageData?.seo),
    alternates: buildAlternates(
      params.locale,
      `/${params.locale}/${params.slug}`,
      pageData?.localizations,
      pageData?.seo?.canonicalURL,
    ),
  };
}

export default async function Page(props: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const params = await props.params;
  // 'homepage' is a reserved internal slug used to look up the locale root content
  // (see (marketing)/page.tsx) — it must never be reachable as its own URL, or it
  // creates a duplicate of the homepage at /[locale]/homepage.
  if (params.slug === 'homepage') permanentRedirect(`/${params.locale}`);
  const legacyTarget = LEGACY_SLUG_REDIRECTS[`${params.locale}/${params.slug}`];
  if (legacyTarget) permanentRedirect(`/${legacyTarget}`);
  const pageData = await fetchContentType(
    'pages',
    {
      filters: {
        slug: params.slug,
        locale: params.locale,
      },
    },
    true
  );
  if (!pageData) return notFound();
  const localizedSlugs = pageData.localizations?.reduce(
    (acc: Record<string, string>, localization: any) => {
      acc[localization.locale] = localization.slug;
      return acc;
    },
    { [params.locale]: params.slug }
  );

  // Városoldalak (weboldal-keszites-budapest stb., 2026-11): ugyanaz az új felépítés, mint a szolgáltatás-aloldalakon.
  // A szolgáltatás-aloldalak a gyökér alatt is elérhetők voltak (/hu/karbantartas) — duplikáció; ezek tartósan a
  // /szolgaltatasok/… címre visznek.
  const detail = getServiceDetail(params.slug);
  if (detail && !CITY_SLUGS.has(params.slug)) {
    permanentRedirect(`/${params.locale}/${getLocalizedSegment(params.locale, 'services')}/${params.slug}`);
  }
  const pageUrl = pageData?.seo?.canonicalURL || `${SITE_URL}/${params.locale}/${params.slug}`;
  const servicesUrl = `${SITE_URL}/${params.locale}/${getLocalizedSegment(params.locale, 'services')}`;

  const jsonLd = renderPageJsonLd({
    kind: detail ? 'service' : 'webpage',
    ...(detail
      ? { breadcrumbs: [
          { name: params.locale === 'en' ? 'Services' : 'Szolgáltatások', url: servicesUrl },
          { name: pageData?.label || detail.title, url: pageUrl },
        ] }
      : {}),
    logoUrl: await getSiteLogoUrl(),
    googleRating: await getCachedGoogleRating(),
    url: pageUrl,
    locale: params.locale,
    title: pageData?.label || pageData?.seo?.metaTitle || params.slug,
    description: pageData?.seo?.metaDescription,
    updatedAt: pageData?.updatedAt,
    dynamicZone: pageData?.dynamic_zone,
    override: pageData?.seo?.structuredData,
  });

  if (detail) {
    const zone: any[] = pageData?.dynamic_zone ?? [];
    const body = [
      ...zone.filter((b: any) => b?.blockType === 'products'),
      ...zone.filter((b: any) => b?.blockType === 'faq').map((b: any) => ({ ...b, card_image: detail.faqImage, ask_card: true })),
      ...zone.filter((b: any) => b?.blockType === 'google-review-story'),
    ];
    return (
      <>
        <JsonLd data={jsonLd} />
        <ClientSlugHandler localizedSlugs={localizedSlugs} />
        <ServiceDetailHero detail={detail} locale={params.locale} />
        <ServiceIncluded detail={detail} />
        <ServiceTimeline detail={detail} />
        <PageContent pageData={{ ...pageData, dynamic_zone: body }} locale={params.locale} fadeZoom />
        <ServiceEnd detail={detail} locale={params.locale} />
        <PageContent pageData={{ ...pageData, dynamic_zone: zone.filter((b: any) => b?.blockType === 'newsletter') }} locale={params.locale} />
      </>
    );
  }

  return (
    <>
      <JsonLd data={jsonLd} />
      <ClientSlugHandler localizedSlugs={localizedSlugs} />
      <PageContent pageData={withPricingPage(withFaqHero(withContactNext(pageData, params.slug), params.slug), params.slug)} locale={params.locale} />
    </>
  );
}

// Kapcsolat oldal (2026-11): új fejléc (ContactHero) és utána a „Mi történik ezután” blokk (ContactNext) — frontend-oldali típusok
function withContactNext(pageData: any, slug: string) {
  if (slug !== 'kapcsolat' && slug !== 'contact') return pageData;
  const zone: any[] = pageData?.dynamic_zone ?? [];
  const at = zone.findIndex((b) => b?.blockType === 'hero');
  const block = { blockType: 'contact-next', id: 'contact-next' };
  // a hero a Szolgáltatások oldal fejlécének stílusát kapja (ContactHero)
  const hero = at === -1 ? null : { ...zone[at], blockType: 'contact-hero' };
  const withHero = at === -1 ? zone : [...zone.slice(0, at), hero, ...zone.slice(at + 1)];
  // a „Mi történik ezután” az űrlap UTÁN jön (ha nincs űrlap, a fejléc után)
  const formAt = withHero.findIndex((b) => b?.blockType === 'form-section');
  const pos = formAt !== -1 ? formAt + 1 : at + 1;
  const next = [...withHero.slice(0, pos), block, ...withHero.slice(pos)];
  return { ...pageData, dynamic_zone: next };
}

// GYIK oldal (2026-11): ugyanaz a fejléc, mint a Kapcsolat oldalon (ContactHero), kisebb címmel, mert hosszabb a szöveg;
// az űrlap helyett CTA
function withFaqHero(pageData: any, slug: string) {
  if (slug !== 'gyik' && slug !== 'faq') return pageData;
  const zone: any[] = pageData?.dynamic_zone ?? [];
  // az űrlap helyett a sötét „30 perces beszélgetés” CTA (CallCta)
  return {
    ...pageData,
    dynamic_zone: zone.map((b) =>
      b?.blockType === 'hero'
        ? { ...b, blockType: 'contact-hero', compact: true }
        : b?.blockType === 'form-section'
          ? { blockType: 'call-cta', id: 'call-cta' }
          : b,
    ),
  };
}

// Árak oldal (2026-11): a fejléc a Kapcsolat/GYIK oldaléval egyező (ContactHero), a régi vélemény-blokk helyett
// a főoldali értékelés-szekció (google-reviews)
function withPricingPage(pageData: any, slug: string) {
  if (slug !== 'arak' && slug !== 'pricing') return pageData;
  const zone: any[] = pageData?.dynamic_zone ?? [];
  return {
    ...pageData,
    // az űrlap sem kell — a gombok a Kapcsolat oldalra visznek
    dynamic_zone: zone
      .filter((b) => b?.blockType !== 'form-section')
      .map((b) =>
        b?.blockType === 'hero'
          ? { ...b, blockType: 'contact-hero' }
          : b?.blockType === 'testimonials'
            ? { blockType: 'google-reviews', id: 'google-reviews' }
            : b,
      ),
  };
}
