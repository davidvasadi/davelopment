export const dynamic = 'force-dynamic'
//app/[locale]/(marketing)/page.tsx
import { Metadata } from 'next';

import ClientSlugHandler from './ClientSlugHandler';
import PageContent from '@/lib/shared/PageContent';
import JsonLd from '@/components/seo/JsonLd';
import { generateMetadataObject, buildAlternates } from '@/lib/shared/metadata';
import { renderPageJsonLd } from '@/lib/shared/structured-data';
import { getSiteLogoUrl } from '@/lib/shared/site-org';
import fetchContentType from '@/lib/strapi/fetchContentType';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://davelopment.hu').replace(/\/+$/, '');

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const params = await props.params;

  const pageData = await fetchContentType(
    'pages',
    { filters: { slug: 'homepage', locale: params.locale } },
    true
  );

  return {
    ...generateMetadataObject(pageData?.seo),
    alternates: buildAlternates(
      params.locale,
      `/${params.locale}`,
      pageData?.localizations,
      pageData?.seo?.canonicalURL,
    ),
  };
}

export default async function HomePage(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;

  const pageData = await fetchContentType(
    'pages',
    {
      filters: {
        slug: 'homepage',
        locale: params.locale,
      },
    },
    true
  );

  // Always include both locales for the homepage — the slug is always ''
  const localizedSlugs: Record<string, string> = { hu: '', en: '' };

  const jsonLd = renderPageJsonLd({
    kind: 'home',
    logoUrl: await getSiteLogoUrl(),
    url: pageData?.seo?.canonicalURL || `${SITE_URL}/${params.locale}`,
    locale: params.locale,
    title: pageData?.seo?.metaTitle || pageData?.label || '[davelopment]®',
    description: pageData?.seo?.metaDescription,
    dynamicZone: pageData?.dynamic_zone,
    override: pageData?.seo?.structuredData,
  });

  return (
    <>
      <JsonLd data={jsonLd} />
      <ClientSlugHandler localizedSlugs={localizedSlugs} />
      <PageContent pageData={pageData} locale={params.locale} />
    </>
  );
}