//app/[locale]/(marketing)/[slug]/page.tsx
import { Metadata } from 'next';

import ClientSlugHandler from '../ClientSlugHandler';
import PageContent from '@/lib/shared/PageContent';
import JsonLd from '@/components/seo/JsonLd';
import { generateMetadataObject, buildAlternates } from '@/lib/shared/metadata';
import { webPageSchema, resolveSchema } from '@/lib/shared/structured-data';
import fetchContentType from '@/lib/strapi/fetchContentType';
import  {notFound}  from 'next/navigation';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://davelopment.hu').replace(/\/+$/, '');

export async function generateMetadata(props: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
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

  const jsonLd = resolveSchema(
    webPageSchema({
      title: pageData?.seo?.metaTitle || pageData?.label || params.slug,
      description: pageData?.seo?.metaDescription,
      url: `${SITE_URL}/${params.locale}/${params.slug}`,
    }),
    pageData?.seo?.structuredData
  );

  return (
    <>
      <JsonLd data={jsonLd} />
      <ClientSlugHandler localizedSlugs={localizedSlugs} />
      <PageContent pageData={pageData} locale={params.locale} />
    </>
  );
}