// frontend/app/[locale]/(marketing)/products/[slug]/page.tsx

import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import ClientSlugHandler from '../../ClientSlugHandler';
import DynamicZoneManager from '@/components/dynamic-zone/manager';
import { SingleProduct } from '@/components/products/single-product';
import { generateMetadataObject } from '@/lib/shared/metadata';
import fetchContentType from '@/lib/strapi/fetchContentType';
import type { Product } from '@/types/types';

export async function generateMetadata(props: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;

  const pageData = await fetchContentType(
    'products',
    {
      filters: {
        slug: params.slug,
        locale: params.locale,
      },
      populate: 'seo.metaImage',
    },
    true
  );

  const seo = pageData?.seo;
  const metadata = generateMetadataObject(seo);
  return metadata;
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
    redirect(`/${params.locale}/products`);
  }

  const localizedSlugs =
    (product as any).localizations?.reduce(
      (acc: Record<string, string>, localization: any) => {
        acc[localization.locale] = localization.slug;
        return acc;
      },
      { [params.locale]: params.slug }
    ) ?? { [params.locale]: params.slug };

  return (
    <div className="relative overflow-hidden w-full px-2 md:px-10">
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
