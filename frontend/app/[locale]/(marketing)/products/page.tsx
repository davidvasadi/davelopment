// frontend/app/[locale]/(marketing)/products/page.tsx

import { IconShoppingCartUp } from '@tabler/icons-react';
import { Metadata } from 'next';

import ClientSlugHandler from '../ClientSlugHandler';
import { Container } from '@/components/container';
import { AmbientColor } from '@/components/decorations/ambient-color';
import { FeatureIconContainer } from '@/components/dynamic-zone/features/feature-icon-container';
import { Heading } from '@/components/elements/heading';
import { Subheading } from '@/components/elements/subheading';
import { Featured } from '@/components/products/featured';
import { ProductItems } from '@/components/products/product-items';
import { generateMetadataObject } from '@/lib/shared/metadata';
import fetchContentType from '@/lib/strapi/fetchContentType';
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

  // product-page (single type) – locale szerint
  const productPage = await fetchContentType(
    'product-page',
    {
      filters: {
        locale: params.locale,
      },
    },
    true
  );

  // products – *locale szerint* szűrve
  const productsRes = await fetchContentType(
    'products',
    {
      filters: {
        locale: params.locale,
      },
      // ha kell még: populate: ['images', 'categories'],
    },
    false
  );

  const products = (productsRes?.data ?? []) as Product[];

  const localizedSlugs = productPage.localizations?.reduce(
    (acc: Record<string, string>, localization: any) => {
      acc[localization.locale] = 'products';
      return acc;
    },
    { [params.locale]: 'products' }
  );

  const featured = products.filter((product) => product.featured);

  return (
    <div className="relative overflow-hidden mx-0 md:mx-auto">
      <ClientSlugHandler localizedSlugs={localizedSlugs} />
      {/* <AmbientColor /> */}
      <Container className="pt-10 md:pt-40 pb-40">
        {/* <FeatureIconContainer className="flex justify-center items-center overflow-hidden">
          <IconShoppingCartUp className="h-6 w-6 text-white" />
        </FeatureIconContainer> */}
        <div className="flex flex-col gap-12 md:flex-row md:items-end md:gap-32">
          <Heading as="h1" className="w-full pt-14 text-left font-semibold">
            {productPage.heading}
          </Heading>
          <div className="flex flex-col">
            <Subheading className="text-black m-0 p-0">
              (2024-25©)
              <br />
              {productPage.sub_heading}
            </Subheading>
          </div>
        </div>

        <Featured products={featured} locale={params.locale} />

        {/* ha kell majd a sima lista is:
        <ProductItems products={products} locale={params.locale} />
        */}
      </Container>
    </div>
  );
}
