import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import React from 'react';

import ClientSlugHandler from '../../ClientSlugHandler';
import { BlogLayout } from '@/components/blog-layout';
import fetchContentType from '@/lib/strapi/fetchContentType';
import type { Article } from '@/types/types';

export default async function SingleArticlePage(props: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const params = await props.params;

  // 1) aktuális cikk
  const article = await fetchContentType(
    'articles',
    {
      filters: {
        slug: params.slug,
        locale: params.locale,
      },
      populate: [ 'image',
                  'categories',
                  'dynamic_zone',
                  'person_card',
                  'person_card.image',
                  'person_card.button', 
                ],
    },
    true
  );

  if (!article) {
    return <div>Blog not found</div>;
  }

  // 2) összes cikk az adott nyelven → prev/next
  const allArticlesRes = await fetchContentType(
    'articles',
    {
      filters: { locale: params.locale },
      sort: ['publishedAt:desc'],
      populate: ['image'],
    },
    false
  );

  const allArticles = (allArticlesRes?.data ?? []) as Article[];

  const currentIndex = allArticles.findIndex(
    (a) => a.slug === article.slug
  );

  const prevArticle =
    currentIndex > 0 ? allArticles[currentIndex - 1] : null;

  const nextArticle =
    currentIndex >= 0 && currentIndex < allArticles.length - 1
      ? allArticles[currentIndex + 1]
      : null;

  // 3) lokalizált slugok a language switchhez
  const localizedSlugs = article.localizations?.reduce(
    (acc: Record<string, string>, localization: any) => {
      acc[localization.locale] = localization.slug;
      return acc;
    },
    { [params.locale]: params.slug }
  );

  return (
    <BlogLayout
      article={article}
      locale={params.locale}
      prevArticle={prevArticle}
      nextArticle={nextArticle}
    >
      <ClientSlugHandler localizedSlugs={localizedSlugs} />
      <BlocksRenderer content={article.content} />
    </BlogLayout>
  );
}
