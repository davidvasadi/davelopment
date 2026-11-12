export const dynamic = 'force-dynamic'
// frontend/app/[locale]/(marketing)/products/page.tsx

import { Metadata } from 'next';

import ClientSlugHandler from '../ClientSlugHandler';
import PageContent from '@/lib/shared/PageContent';
import JsonLd from '@/components/seo/JsonLd';
import { Heading } from '@/components/elements/heading';
import { Subheading } from '@/components/elements/subheading';
import { PillLink } from '@/components/pill-link';
import { Featured } from '@/components/products/featured';
import { generateMetadataObject, buildAlternates } from '@/lib/shared/metadata';
import { renderPageJsonLd } from '@/lib/shared/structured-data';
import { getSiteLogoUrl } from '@/lib/shared/site-org';
import fetchContentType from '@/lib/strapi/fetchContentType';
import { localeSegments, getLocalizedSegment } from '@/lib/i18n/segments';
import type { Product } from '@/types/types';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://davelopment.hu').replace(/\/+$/, '');

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const params = await props.params;

  const pageData = await fetchContentType(
    'product-page',
    { filters: { locale: params.locale } },
    true
  );

  const segment = getLocalizedSegment(params.locale, 'products');
  const altLocale = params.locale === 'hu' ? 'en' : 'hu';
  const altSegment = getLocalizedSegment(altLocale, 'products');
  return {
    ...generateMetadataObject(pageData?.seo),
    alternates: buildAlternates(
      params.locale,
      `/${params.locale}/${segment}`,
      [{ locale: altLocale, slug: altSegment }],
      pageData?.seo?.canonicalURL,
    ),
  };
}

export default async function Products(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;

  const productPage = await fetchContentType(
    'product-page',
    {
      locale: params.locale,
      populate: {
        dynamic_zone: {
          populate:'*'
        },
        seo:{
          populate: {
            metaImage: true
          }
        }
      }
    },true
  );

  const productsRes = await fetchContentType(
    'products',
    { filters: { locale: params.locale } },
    false
  );

  const allProducts = (productsRes?.data ?? []) as Product[];

  const localizedSlugs = Object.keys(localeSegments).reduce(
    (acc, loc) => {
      acc[loc] = getLocalizedSegment(loc, 'products');
      return acc;
    },
    {} as Record<string, string>
  );

  // If featured_products is set in the CMS, use that selection; otherwise fall back to product.featured flag
  const featuredIds: string[] = (productPage?.featured_products ?? [])
    .map((fp: any) => fp?.id ?? fp)
    .filter(Boolean);

  const featured: Product[] = featuredIds.length > 0
    ? featuredIds
        .map((id) => allProducts.find((p) => String(p.id) === String(id)))
        .filter((p): p is Product => !!p)
    : allProducts.filter((p) => p.featured);

  // 2026-11: a Projektek oldalon a régi vélemény-blokk (testimonials) helyett a másik értékelős blokkunk
  // (GoogleReviewStory: élő Google-értékelés kártya + videós kártya), ugyanaz, mint a szolgáltatás-oldalakon.
  const hu = params.locale !== 'en';
  const zone = (productPage?.dynamic_zone ?? []).map((b: any) =>
    b?.blockType === 'testimonials'
      ? {
          blockType: 'google-review-story',
          id: 'projects-review-story',
          card1_heading: hu ? 'Nézd meg, hogyan dolgozunk valódi projekteken' : 'See how we work on real projects',
          card1_cta_text: hu ? 'Kérj ajánlatot' : 'Get a quote',
          card1_cta_url: hu ? '/kapcsolat' : '/contact',
          card2_media: { url: '/api/media/file/hero-f2d7203ba3.mp4', mimeType: 'video/mp4' },
          card2_caption: hu ? 'Weboldal készítés, a tervezéstől az élesítésig' : 'Website design, from first sketch to launch',
        }
      : b,
  );

  const segment = getLocalizedSegment(params.locale, 'products');
  const jsonLd = renderPageJsonLd({
    kind: 'collection',
    logoUrl: await getSiteLogoUrl(),
    url: productPage?.seo?.canonicalURL || `${SITE_URL}/${params.locale}/${segment}`,
    locale: params.locale,
    title: productPage?.seo?.metaTitle || productPage?.heading || (params.locale === 'en' ? 'Projects' : 'Projektek'),
    description: productPage?.seo?.metaDescription,
    dynamicZone: productPage?.dynamic_zone,
    items: allProducts
      .filter((p) => (p as any)?.slug)
      .map((p) => ({ name: (p as any).name || (p as any).slug, url: `${SITE_URL}/${params.locale}/${segment}/${(p as any).slug}` })),
    breadcrumbs: [{ name: params.locale === 'en' ? 'Projects' : 'Projektek', url: `${SITE_URL}/${params.locale}/${segment}` }],
    override: productPage?.seo?.structuredData,
  });

  return (
    <div className="relative overflow-hidden mx-0 md:mx-auto">
      <JsonLd data={jsonLd} />
      <ClientSlugHandler localizedSlugs={localizedSlugs} />
      <div className="w-full px-4 pt-10 pb-12 md:px-8 md:pt-40 md:pb-16">
        <div className="flex flex-col gap-12 md:flex-row md:items-end md:gap-32">
          <Heading as="h1" className="w-full pt-14 text-left font-semibold">
            {productPage.heading}
          </Heading>
          <div className="flex flex-col">
            <Subheading className="text-black m-0 p-0">
              (2025-{String(new Date().getFullYear()).slice(-2)}©)
              <br />
              {productPage.sub_heading}
            </Subheading>
            <PillLink href={params.locale === 'en' ? '/en/contact' : '/hu/kapcsolat'} className="mt-6 self-start" cta="projects-page:talk">
              {params.locale === 'en' ? 'Talk about your project' : 'Beszéljünk a projektedről'}
            </PillLink>
          </div>
        </div>

        <Featured products={featured} locale={params.locale} />
      </div>
      {/* a CMS-blokkok (pl. CTA) a saját szélükkel jönnek — nem a fenti, paddingolt sávban, hogy ne duplázódjon a margó */}
      <PageContent pageData={{ ...productPage, dynamic_zone: zone }} locale={params.locale} />
    </div>
  );
}