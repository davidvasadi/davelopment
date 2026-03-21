// app/[locale]/(marketing)/services/[slug]/page.tsx

import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import ClientSlugHandler from '../../ClientSlugHandler';
import PageContent from '@/lib/shared/PageContent';
import { generateMetadataObject } from '@/lib/shared/metadata';
import fetchContentType from '@/lib/strapi/fetchContentType';
import { getLocalizedSegment } from '@/lib/i18n/segments';
import { Container } from '@/components/container';
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
      populate: 'seo.metaImage',
    },
    true
  );

  const seo = pageData?.seo;
  const metadata = generateMetadataObject(seo);
  return metadata;
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

  return (
    <>
      <ClientSlugHandler localizedSlugs={localizedSlugs} />
         {/* <Container> */}
      <PageContent pageData={pageData} />
        {/* </Container> */}
    </>
  );
}
