export const dynamic = 'force-dynamic'
import React from 'react';
import { LexicalContent } from '@/components/lexical-content';
import JsonLd from '@/components/seo/JsonLd';

import ClientSlugHandler from '../../ClientSlugHandler';
import { BlogLayout } from '@/components/blog-layout';
import fetchContentType from '@/lib/strapi/fetchContentType';
import { strapiImage } from '@/lib/strapi/strapiImage';
import { generateMetadataObject, buildAlternates } from '@/lib/shared/metadata';
import { articleSchema, resolveSchema } from '@/lib/shared/structured-data';
import type { Metadata } from 'next';
import type { Article } from '@/types/types';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://davelopment.hu').replace(/\/+$/, '');

export async function generateMetadata(props: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const article = await fetchContentType(
    'articles',
    { filters: { slug: params.slug, locale: params.locale } },
    true
  );
  return {
    ...generateMetadataObject(article?.seo),
    alternates: buildAlternates(
      params.locale,
      `/${params.locale}/blog/${params.slug}`,
      article?.localizations,
      article?.seo?.canonicalURL,
    ),
  };
}

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

  const jsonLd = resolveSchema(
    articleSchema({
      title: article.seo?.metaTitle || article.title,
      description: article.seo?.metaDescription,
      imageUrl: article.image?.url ? strapiImage(article.image.url) : null,
      publishedAt: article.publishedAt || article.createdAt,
      updatedAt: article.updatedAt,
      url: `${SITE_URL}/${params.locale}/blog/${params.slug}`,
    }),
    article.seo?.structuredData
  );

  return (
    <>
      <JsonLd data={jsonLd} />
      <BlogLayout
        article={article}
        locale={params.locale}
        prevArticle={prevArticle}
        nextArticle={nextArticle}
      >
        <ClientSlugHandler localizedSlugs={localizedSlugs} />
        <LexicalContent content={article.content} />
      </BlogLayout>
    </>
  );
}
