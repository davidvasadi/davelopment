// frontend/app/[locale]/(marketing)/blog/page.tsx
import { type Metadata } from 'next';

import ClientSlugHandler from '../ClientSlugHandler';
import JsonLd from '@/components/seo/JsonLd';
import { generateMetadataObject, buildAlternates } from '@/lib/shared/metadata';
import { webPageSchema, resolveSchema } from '@/lib/shared/structured-data';
import fetchContentType from '@/lib/strapi/fetchContentType';
import type { Article } from '@/types/types';
import { BlogIndex } from '@/components/blog-index';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://davelopment.hu').replace(/\/+$/, '');

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const pageData = await fetchContentType(
    'blog-page',
    { filters: { locale: params.locale } },
    true
  );

  const altLocale = params.locale === 'hu' ? 'en' : 'hu';
  return {
    ...generateMetadataObject(pageData?.seo),
    alternates: buildAlternates(
      params.locale,
      `/${params.locale}/blog`,
      [{ locale: altLocale, slug: 'blog' }],
      pageData?.seo?.canonicalURL,
    ),
  };
}

export default async function Blog(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;

  // /blog single type
  const blogPage = await fetchContentType(
    'blog-page',
    {
      filters: { locale: params.locale },
    },
    true
  );

  // cikkek
  const articlesRes = await fetchContentType(
    'articles',
    {
      filters: { locale: params.locale },
    },
    false
  );

  const articles = (articlesRes?.data ?? []) as Article[];

  const localizedSlugs = blogPage.localizations?.reduce(
    (acc: Record<string, string>, localization: any) => {
      acc[localization.locale] = 'blog';
      return acc;
    },
    { [params.locale]: 'blog' }
  );

  const jsonLd = resolveSchema(
    webPageSchema({
      title: blogPage?.seo?.metaTitle || blogPage?.title || 'Blog',
      description: blogPage?.seo?.metaDescription,
      url: `${SITE_URL}/${params.locale}/blog`,
    }),
    blogPage?.seo?.structuredData
  );

  return (
    <div className="relative overflow-hidden pt-14">
      <JsonLd data={jsonLd} />
      <ClientSlugHandler localizedSlugs={localizedSlugs} />
      <BlogIndex locale={params.locale} blogPage={blogPage} articles={articles} />
    </div>
  );
}
