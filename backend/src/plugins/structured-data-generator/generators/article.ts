import type { Core } from '@strapi/strapi';
import { getSiteUrl, buildOrganization } from './helpers';

export async function generateArticle(
  data: Record<string, any>,
  organization: any,
  strapi: Core.Strapi
): Promise<Record<string, any>> {
  const base = getSiteUrl(strapi);
  const org = buildOrganization(organization, strapi);
  const imageUrl = data.cover?.url || data.image?.url || data.metaImage?.url || null;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.title || data.metaTitle || '',
    description: data.metaDescription || data.description || '',
    url: data.slug ? `${base}/blog/${data.slug}` : base,
    inLanguage: data.locale || 'hu',
    datePublished: data.publishedAt || data.createdAt || new Date().toISOString(),
    dateModified: data.updatedAt || new Date().toISOString(),
    publisher: org,
    author: org,
    ...(imageUrl && { image: { '@type': 'ImageObject', url: imageUrl } }),
  };
}
