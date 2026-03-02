import type { Core } from '@strapi/strapi';
import { getSiteUrl, buildOrganization, buildBreadcrumb } from './helpers';

export async function generateArticle(
  data: Record<string, any>,
  organization: any,
  strapi: Core.Strapi
): Promise<Record<string, any>> {
  const base = getSiteUrl(strapi);
  const url = data.slug ? `${base}/blog/${data.slug}` : base;
  const org = buildOrganization(organization, strapi);
  const imageUrl = data.cover?.url || data.image?.url || data.metaImage?.url || null;
  const breadcrumb = buildBreadcrumb(base, [
    { name: 'Főoldal', url: base },
    { name: 'Blog', url: `${base}/blog` },
    { name: data.title || data.metaTitle || '', url },
  ]);
  let wordCount: number | undefined;
  if (data.description) {
    wordCount = data.description.split(/\s+/).filter(Boolean).length;
  }
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${url}/#article`,
        headline: data.title || data.metaTitle || '',
        description: data.metaDescription || data.description || '',
        url,
        inLanguage: data.locale || 'hu',
        datePublished: data.publishedAt || data.createdAt || new Date().toISOString(),
        dateModified: data.updatedAt || new Date().toISOString(),
        author: { '@id': `${base}/#organization` },
        publisher: { '@id': `${base}/#organization` },
        isPartOf: { '@type': 'WebSite', '@id': `${base}/#website` },
        ...(imageUrl && { image: { '@type': 'ImageObject', url: imageUrl }, thumbnailUrl: imageUrl }),
        ...(wordCount && { wordCount }),
        ...(data.categories?.length > 0 && {
          articleSection: data.categories.map((c: any) => c.name || c).filter(Boolean),
        }),
        breadcrumb: { '@id': `${url}/#breadcrumb` },
      },
      { ...org, '@id': `${base}/#organization` },
      { ...breadcrumb, '@id': `${url}/#breadcrumb` },
    ],
  };
}
