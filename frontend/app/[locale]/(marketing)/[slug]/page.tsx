export const dynamic = 'force-dynamic'
//app/[locale]/(marketing)/[slug]/page.tsx
import { Metadata } from 'next';

import ClientSlugHandler from '../ClientSlugHandler';
import PageContent from '@/lib/shared/PageContent';
import JsonLd from '@/components/seo/JsonLd';
import { generateMetadataObject, buildAlternates } from '@/lib/shared/metadata';
import { renderPageJsonLd } from '@/lib/shared/structured-data';
import { getSiteLogoUrl } from '@/lib/shared/site-org';
import fetchContentType from '@/lib/strapi/fetchContentType';
import  {notFound, permanentRedirect}  from 'next/navigation';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://davelopment.hu').replace(/\/+$/, '');

// Slugs that were renamed after being live — redirect the old URL to the new one
// so any existing backlinks/bookmarks/search index entries aren't broken.
const LEGACY_SLUG_REDIRECTS: Record<string, string> = {
  'en/weboldal-keszites': 'en/start-your-business-online',
};

export async function generateMetadata(props: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  if (params.slug === 'homepage') permanentRedirect(`/${params.locale}`);
  const legacyTarget = LEGACY_SLUG_REDIRECTS[`${params.locale}/${params.slug}`];
  if (legacyTarget) permanentRedirect(`/${legacyTarget}`);
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
  // 'homepage' is a reserved internal slug used to look up the locale root content
  // (see (marketing)/page.tsx) — it must never be reachable as its own URL, or it
  // creates a duplicate of the homepage at /[locale]/homepage.
  if (params.slug === 'homepage') permanentRedirect(`/${params.locale}`);
  const legacyTarget = LEGACY_SLUG_REDIRECTS[`${params.locale}/${params.slug}`];
  if (legacyTarget) permanentRedirect(`/${legacyTarget}`);
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

  const jsonLd = renderPageJsonLd({
    kind: 'webpage',
    logoUrl: await getSiteLogoUrl(),
    url: pageData?.seo?.canonicalURL || `${SITE_URL}/${params.locale}/${params.slug}`,
    locale: params.locale,
    title: pageData?.label || pageData?.seo?.metaTitle || params.slug,
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