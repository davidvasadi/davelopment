export const dynamic = 'force-dynamic'
//app/[locale]/(marketing)/page.tsx
import { Metadata } from 'next';

import ClientSlugHandler from './ClientSlugHandler';
import PageContent from '@/lib/shared/PageContent';
import JsonLd from '@/components/seo/JsonLd';
import { generateMetadataObject, buildAlternates } from '@/lib/shared/metadata';
import { organizationSchema, websiteSchema, resolveSchema } from '@/lib/shared/structured-data';
import fetchContentType from '@/lib/strapi/fetchContentType';

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

  return (
    <>
      <JsonLd data={resolveSchema(
        { ...organizationSchema(), ...websiteSchema() },
        pageData?.seo?.structuredData
      )} />
      <ClientSlugHandler localizedSlugs={localizedSlugs} />
      <PageContent pageData={pageData} locale={params.locale} />
    </>
  );
}