// frontend/app/[locale]/(marketing)/products/[slug]/page.tsx

import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import ClientSlugHandler from '../../ClientSlugHandler';
import DynamicZoneManager from '@/components/dynamic-zone/manager';
import { SingleProduct } from '@/components/products/single-product';
import JsonLd from '@/components/seo/JsonLd';
import { generateMetadataObject, buildAlternates } from '@/lib/shared/metadata';
import { serviceSchema, resolveSchema } from '@/lib/shared/structured-data';
import fetchContentType from '@/lib/strapi/fetchContentType';
import { getLocalizedSegment } from '@/lib/i18n/segments';
import type { Product } from '@/types/types';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://davelopment.hu').replace(/\/+$/, '');

export async function generateMetadata(props: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;

  const pageData = await fetchContentType(
    'products',
    { filters: { slug: params.slug, locale: params.locale } },
    true
  );

  const segment = getLocalizedSegment(params.locale, 'products');
  // Build locale-aware alternate paths (segment differs per locale: projektek/products)
  const localizationsWithPath = (pageData?.localizations ?? []).map((loc: any) => ({
    ...loc,
    altPath: `/${loc.locale}/${getLocalizedSegment(loc.locale, 'products')}/${loc.slug ?? params.slug}`,
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

export default async function SingleProductPage(props: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const params = await props.params;

  const product = (await fetchContentType(
    'products',
    {
      filters: {
        slug: params.slug,
        locale: params.locale,
      },
    },
    true
  )) as Product | null;

  if (!product) {
    redirect(`/${params.locale}/${getLocalizedSegment(params.locale, 'products')}`);
  }

  const localizedSlugs =
    (product as any).localizations?.reduce(
      (acc: Record<string, string>, localization: any) => {
        acc[localization.locale] = localization.slug;
        return acc;
      },
      { [params.locale]: params.slug }
    ) ?? { [params.locale]: params.slug };

  const segment = getLocalizedSegment(params.locale, 'products');
  const jsonLd = resolveSchema(
    serviceSchema({
      name: (product as any)?.seo?.metaTitle || (product as any)?.title || params.slug,
      description: (product as any)?.seo?.metaDescription,
      url: `${SITE_URL}/${params.locale}/${segment}/${params.slug}`,
    }),
    (product as any)?.seo?.structuredData
  );

  return (
    <div className="relative overflow-hidden w-full px-2 md:px-10">
      <JsonLd data={jsonLd} />
      <ClientSlugHandler localizedSlugs={localizedSlugs} />

      <SingleProduct product={product} locale={params.locale} />

      {product?.dynamic_zone && (
        <DynamicZoneManager
          dynamicZone={product.dynamic_zone}
          locale={params.locale}
        />
      )}
    </div>
  );
}