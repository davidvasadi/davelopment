// frontend/app/[locale]/(marketing)/products/page.tsx

import { Metadata } from 'next';

import ClientSlugHandler from '../ClientSlugHandler';
import PageContent from '@/lib/shared/PageContent';
import JsonLd from '@/components/seo/JsonLd';
import { Container } from '@/components/container';
import { Heading } from '@/components/elements/heading';
import { Subheading } from '@/components/elements/subheading';
import { Featured } from '@/components/products/featured';
import { generateMetadataObject, buildAlternates } from '@/lib/shared/metadata';
import { webPageSchema, resolveSchema } from '@/lib/shared/structured-data';
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

  const segment = getLocalizedSegment(params.locale, 'products');
  const jsonLd = resolveSchema(
    webPageSchema({
      title: productPage?.seo?.metaTitle || productPage?.heading || 'Products',
      description: productPage?.seo?.metaDescription,
      url: `${SITE_URL}/${params.locale}/${segment}`,
    }),
    productPage?.seo?.structuredData
  );

  return (
    <div className="relative overflow-hidden mx-0 md:mx-auto">
      <JsonLd data={jsonLd} />
      <ClientSlugHandler localizedSlugs={localizedSlugs} />
      <Container className="pt-10 md:pt-40 pb-40">
        <div className="flex flex-col gap-12 md:flex-row md:items-end md:gap-32">
          <Heading as="h1" className="w-full pt-14 text-left font-semibold">
            {productPage.heading}
          </Heading>
          <div className="flex flex-col">
            <Subheading className="text-black m-0 p-0">
              (2025-26©)
              <br />
              {productPage.sub_heading}
            </Subheading>
          </div>
        </div>

        <Featured products={featured} locale={params.locale} />
        <PageContent pageData={productPage} locale={params.locale} />
      </Container>
    </div>
  );
}