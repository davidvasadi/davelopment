// frontend/app/[locale]/(marketing)/blog/page.tsx
import { type Metadata } from 'next';

import ClientSlugHandler from '../ClientSlugHandler';
import { generateMetadataObject } from '@/lib/shared/metadata';
import fetchContentType from '@/lib/strapi/fetchContentType';
import type { Article } from '@/types/types';
import { BlogIndex } from '@/components/blog-index';

// --- SEO a /blog single type SEO mezőiből ---
export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const pageData = await fetchContentType(
    'blog-page',
    {
      filters: { locale: params.locale },
      populate: 'seo.metaImage',
    },
    true
  );

  const seo = pageData?.seo;
  const metadata = generateMetadataObject(seo);
  return metadata;
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

  return (
    <div className="relative overflow-hidden pt-14">
      <ClientSlugHandler localizedSlugs={localizedSlugs} />
      <BlogIndex locale={params.locale} blogPage={blogPage} articles={articles} />
    </div>
  );
}
