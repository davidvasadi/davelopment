import type { Core } from '@strapi/strapi';
import { getSiteUrl, buildOrganization, buildBreadcrumb, getWebPageType } from './helpers';

export async function generateWebPage(
  data: Record<string, any>,
  organization: any,
  strapi: Core.Strapi
): Promise<Record<string, any>> {
  const base = getSiteUrl(strapi);
  const slug = data.slug || '';
  const pageType = getWebPageType(slug);
  const url = slug ? `${base}/${slug}` : base;
  const org = buildOrganization(organization, strapi);
  const breadcrumb = buildBreadcrumb(base, [
    { name: 'Főoldal', url: base },
    { name: data.metaTitle || data.title || slug, url },
  ]);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': pageType,
        '@id': `${url}/#webpage`,
        name: data.metaTitle || data.title || '',
        description: data.metaDescription || data.description || '',
        url,
        inLanguage: data.locale || 'hu',
        isPartOf: {
          '@type': 'WebSite',
          '@id': `${base}/#website`,
          name: org.name,
          url: base,
          publisher: { '@id': `${base}/#organization` },
        },
        ...(data.metaImage?.url && {
          primaryImageOfPage: { '@type': 'ImageObject', url: data.metaImage.url },
        }),
        dateModified: data.updatedAt || new Date().toISOString(),
        breadcrumb: { '@id': `${url}/#breadcrumb` },
      },
      { ...org, '@id': `${base}/#organization` },
      { ...breadcrumb, '@id': `${url}/#breadcrumb` },
    ],
  };
}
