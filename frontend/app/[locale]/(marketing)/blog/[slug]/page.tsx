export const dynamic = 'force-dynamic'
import React from 'react';
import { LexicalContent } from '@/components/lexical-content';
import JsonLd from '@/components/seo/JsonLd';
import { WordpressVsCustomTable } from '@/components/blog/wordpress-vs-custom-table';

import ClientSlugHandler from '../../ClientSlugHandler';
import { BlogLayout } from '@/components/blog-layout';
import fetchContentType from '@/lib/strapi/fetchContentType';
import { strapiImage } from '@/lib/strapi/strapiImage';
import { generateMetadataObject, buildAlternates } from '@/lib/shared/metadata';
import { renderPageJsonLd, extractNumberedSteps } from '@/lib/shared/structured-data';
import { getSiteLogoUrl } from '@/lib/shared/site-org';
import type { Metadata } from 'next';
import type { Article } from '@/types/types';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://davelopment.hu').replace(/\/+$/, '');

// Valódi szószám a lexical JSON-ból — sosem becsült/kitalált szám, mindig a
// tényleges cikkszövegből számolva, a schema wordCount mezőjéhez.
function countWords(node: any): number {
  if (!node) return 0;
  let total = 0;
  if (node.type === 'text' && typeof node.text === 'string') {
    total += node.text.trim().split(/\s+/).filter(Boolean).length;
  }
  if (Array.isArray(node.children)) {
    for (const child of node.children) total += countWords(child);
  }
  return total;
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const article = await fetchContentType(
    'articles',
    { filters: { slug: params.slug, locale: params.locale } },
    true
  );
  // Üresen hagyott SEO-mezőnél a cikk saját címe/leírása legyen a fallback,
  // ne a generikus "Default Title" (2026-10-17-es cikkek így mentek ki).
  const seo = {
    ...article?.seo,
    metaTitle: article?.seo?.metaTitle || article?.title,
    metaDescription: article?.seo?.metaDescription || article?.description,
  };
  return {
    ...generateMetadataObject(seo),
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
      filters: { locale: params.locale, _status: 'published' },
      sort: ['createdAt:desc'],
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

  const ldUrl = article.seo?.canonicalURL || `${SITE_URL}/${params.locale}/blog/${params.slug}`;
  const ldTitle = article.title || article.seo?.metaTitle;
  const jsonLd = renderPageJsonLd({
    kind: 'article',
    logoUrl: await getSiteLogoUrl(),
    url: ldUrl,
    locale: params.locale,
    title: ldTitle,
    description: article.seo?.metaDescription,
    imageUrl: article.image?.url ? strapiImage(article.image.url) : null,
    imageWidth: (article.image as any)?.width ?? null,
    imageHeight: (article.image as any)?.height ?? null,
    publishedAt: article.publishedAt || article.createdAt,
    updatedAt: article.updatedAt,
    authorName: (article as any).person_card?.name || 'Dávid Vasadi',
    authorRole: (article as any).person_card?.role || null,
    articleSection: (article as any).categories?.[0]?.name || null,
    keywords: article.seo?.keywords || null,
    wordCount: countWords((article as any).content?.root) || null,
    howToSteps: extractNumberedSteps((article as any).content?.root),
    dynamicZone: (article as any).dynamic_zone,
    breadcrumbs: [
      { name: 'Blog', url: `${SITE_URL}/${params.locale}/blog` },
      { name: ldTitle, url: ldUrl },
    ],
    override: article.seo?.structuredData,
  });

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
        {params.slug === 'wordpress-vagy-egyedi-weboldal-2026-ban' && (
          <WordpressVsCustomTable locale={params.locale} />
        )}
      </BlogLayout>
    </>
  );
}
