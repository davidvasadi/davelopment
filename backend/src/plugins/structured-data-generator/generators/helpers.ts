import type { Core } from '@strapi/strapi';

export function getSiteUrl(strapi: Core.Strapi): string {
  if (process.env.URL) return process.env.URL;
  if (process.env.NODE_ENV === 'development') {
    return process.env.FRONTEND_LOCAL_URL || 'http://localhost:3000';
  }
  return strapi.config.get<string>('server.url', 'https://example.com');
}

export function buildOrganization(organization: any, strapi: Core.Strapi) {
  if (!organization) return { '@type': 'Organization', name: 'Unknown' };
  return {
    '@type': 'Organization',
    name: organization.siteName || organization.name || 'Unknown',
    url: getSiteUrl(strapi),
    ...(organization.logo?.url && {
      logo: { '@type': 'ImageObject', url: organization.logo.url },
    }),
  };
}
