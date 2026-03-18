// frontend/app/[locale]/(marketing)/products/page.tsx

import { Metadata } from 'next';

import ClientSlugHandler from '../ClientSlugHandler';
import { Container } from '@/components/container';
import { Heading } from '@/components/elements/heading';
import { Subheading } from '@/components/elements/subheading';
import { Featured } from '@/components/products/featured';
import { generateMetadataObject } from '@/lib/shared/metadata';
import fetchContentType from '@/lib/strapi/fetchContentType';
import { localeSegments, getLocalizedSegment } from '@/lib/i18n/segments';
import type { Product } from '@/types/types';

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const params = await props.params;

  const pageData = await fetchContentType(
    'product-page',
    {
      filters: {
        locale: params.locale,
      },
    },
    true
  );

  const seo = pageData?.seo;
  const metadata = generateMetadataObject(seo);
  return metadata;
}

export default async function Products(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;

  const productPage = await fetchContentType(
    'product-page',
    {
      filters: {
        locale: params.locale,
      },
    },
    true
  );

  const productsRes = await fetchContentType(
    'products',
    {
      filters: {
        locale: params.locale,
      },
    },
    false
  );

  const products = (productsRes?.data ?? []) as Product[];

  const localizedSlugs = Object.keys(localeSegments).reduce(
    (acc, loc) => {
      acc[loc] = getLocalizedSegment(loc, 'products');
      return acc;
    },
    {} as Record<string, string>
  );

  const featured = products.filter((product) => product.featured);

  return (
    <div className="relative overflow-hidden mx-0 md:mx-auto">
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
      </Container>
    </div>
  );
}