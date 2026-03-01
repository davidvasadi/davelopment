import type { Core } from '@strapi/strapi';
import { getSiteUrl, buildOrganization } from './helpers';

export async function generateWebPage(
  data: Record<string, any>,
  organization: any,
  strapi: Core.Strapi
): Promise<Record<string, any>> {
  const base = getSiteUrl(strapi);
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: data.metaTitle || data.title || data.name || '',
    description: data.metaDescription || data.description || '',
    url: data.slug ? `${base}/${data.slug}` : base,
    inLanguage: data.locale || 'hu',
    isPartOf: {
      '@type': 'WebSite',
      name: organization?.siteName || '',
      url: base,
    },
    publisher: buildOrganization(organization, strapi),
  };
}
