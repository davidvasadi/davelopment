export const dynamic = 'force-dynamic'
// app/[locale]/(marketing)/services/[slug]/page.tsx

import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import ClientSlugHandler from '../../ClientSlugHandler';
import PageContent from '@/lib/shared/PageContent';
import JsonLd from '@/components/seo/JsonLd';
import { generateMetadataObject, buildAlternates } from '@/lib/shared/metadata';
import { serviceSchema, resolveSchema } from '@/lib/shared/structured-data';
import fetchContentType from '@/lib/strapi/fetchContentType';
import { getLocalizedSegment } from '@/lib/i18n/segments';
import { Container } from '@/components/container';

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
  const jsonLd = resolveSchema(
    serviceSchema({
      name: pageData?.seo?.metaTitle || pageData?.label || params.slug,
      description: pageData?.seo?.metaDescription,
      url: `${SITE_URL}/${params.locale}/${segment}/${params.slug}`,
    }),
    pageData?.seo?.structuredData
  );

  return (
    <>
      <JsonLd data={jsonLd} />
      <ClientSlugHandler localizedSlugs={localizedSlugs} />
         {/* <Container> */}
      <PageContent pageData={pageData} locale={params.locale} />
        {/* </Container> */}
    </>
  );
}
