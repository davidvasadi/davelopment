export const dynamic = 'force-dynamic'
// app/[locale]/(marketing)/services/[slug]/page.tsx

import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import ClientSlugHandler from '../../ClientSlugHandler';
import PageContent from '@/lib/shared/PageContent';
import JsonLd from '@/components/seo/JsonLd';
import { generateMetadataObject, buildAlternates } from '@/lib/shared/metadata';
import { renderPageJsonLd } from '@/lib/shared/structured-data';
import { getSiteLogoUrl } from '@/lib/shared/site-org';
import fetchContentType from '@/lib/strapi/fetchContentType';
import { getLocalizedSegment } from '@/lib/i18n/segments';
import { Container } from '@/components/container';
import { OtherServices } from '@/components/services/other-services';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://davelopment.hu').replace(/\/+$/, '');

export async function generateMetadata(props: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;

  const pageData = await fetchContentType(
    'pages',
    { filters: { slug: params.slug, locale: params.locale } },
    true
  );

  const segment = getLocalizedSegment(params.locale, 'services');
  const localizationsWithPath = (pageData?.localizations ?? []).map((loc: any) => ({
    ...loc,
    altPath: `/${loc.locale}/${getLocalizedSegment(loc.locale, 'services')}/${loc.slug ?? params.slug}`,
  }));
  return {
    ...generateMetadataObject(pageData?.seo),
    alternates: buildAlternates(
      params.locale,
      `/${params.locale}/${segment}/${params.slug}`,
      localizationsWithPath,
      pageData?.seo?.canonicalURL,
    ),
  };
}

export default async function ServiceSlugPage(props: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const params = await props.params;

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

  if (!pageData) {
    redirect(`/${params.locale}/${getLocalizedSegment(params.locale, 'services')}`);
  }

  const localizedSlugs = pageData.localizations?.reduce(
    (acc: Record<string, string>, localization: any) => {
      acc[localization.locale] = localization.slug;
      return acc;
    },
    { [params.locale]: params.slug }
  ) ?? { [params.locale]: params.slug };

  const segment = getLocalizedSegment(params.locale, 'services');
  const ldUrl = pageData?.seo?.canonicalURL || `${SITE_URL}/${params.locale}/${segment}/${params.slug}`;
  const ldTitle = pageData?.label || pageData?.seo?.metaTitle || params.slug;
  const jsonLd = renderPageJsonLd({
    kind: 'service',
    logoUrl: await getSiteLogoUrl(),
    url: ldUrl,
    locale: params.locale,
    title: ldTitle,
    description: pageData?.seo?.metaDescription,
    dynamicZone: pageData?.dynamic_zone,
    breadcrumbs: [
      { name: params.locale === 'en' ? 'Services' : 'Szolgáltatások', url: `${SITE_URL}/${params.locale}/${segment}` },
      { name: ldTitle, url: ldUrl },
    ],
    override: pageData?.seo?.structuredData,
  });

  // „További szolgáltatások" — a Szolgáltatások global oldal-listájából, az
  // éppen nyitott oldalt kiszűrve. Minden oldalhoz a hero videó-poszter a thumbnail
  // (ugyanaz a forrás, mint a listaoldalon).
  const serviceGlobal = await fetchContentType(
    'service',
    { locale: params.locale, populate: { pages: true } },
    true
  ).catch(() => null);

  const otherServices = await Promise.all(
    (serviceGlobal?.pages ?? [])
      .filter((p: any) => p?.slug && p.slug !== params.slug)
      .map(async (page: any) => {
        const fullPage = await fetchContentType(
          'pages',
          {
            filters: { slug: page.slug, locale: params.locale },
            populate: { dynamic_zone: { populate: '*' } },
          },
          true
        ).catch(() => null);
        const hero = fullPage?.dynamic_zone?.find((c: any) => c.blockType === 'hero');
        return { ...page, video_poster: hero?.video_poster ?? null };
      })
  );

  // Ha a szerkesztő berakott egy „Kapcsolódó szolgáltatások" blokkot a tartalomba,
  // oda injektáljuk a listát (a blokk bárhová húzható — pl. CTA és árazás közé).
  // Ha nincs ilyen blokk, a lap aljára tesszük (alapértelmezett).
  const zone: any[] = pageData?.dynamic_zone ?? [];
  const hasRelatedBlock = zone.some((b: any) => b?.blockType === 'related-services');
  const contentData = hasRelatedBlock
    ? {
        ...pageData,
        dynamic_zone: zone.map((b: any) =>
          b?.blockType === 'related-services' ? { ...b, services: otherServices } : b
        ),
      }
    : pageData;

  return (
    <>
      <JsonLd data={jsonLd} />
      <ClientSlugHandler localizedSlugs={localizedSlugs} />
      <PageContent pageData={contentData} locale={params.locale} />
      {!hasRelatedBlock && <OtherServices pages={otherServices} locale={params.locale} />}
    </>
  );
}
