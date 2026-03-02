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
  const base = getSiteUrl(strapi);
  const sameAs: string[] = [];
  const footer = organization.footer;
  if (footer?.social_media_links) {
    footer.social_media_links.forEach((link: any) => {
      if (link.url) sameAs.push(link.url);
    });
  }
  return {
    '@type': 'Organization',
    name: organization.seo?.metaTitle || organization.siteName || organization.name || 'Unknown',
    url: base,
    ...(organization.seo?.metaImage?.url && {
      logo: { '@type': 'ImageObject', url: organization.seo.metaImage.url },
    }),
    ...(sameAs.length > 0 && { sameAs }),
  };
}

export function buildBreadcrumb(base: string, items: Array<{ name: string; url: string }>) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function getWebPageType(slug: string): string {
  const typeMap: Record<string, string> = {
    kapcsolat: 'ContactPage',
    contact: 'ContactPage',
    rolunk: 'AboutPage',
    about: 'AboutPage',
    faq: 'FAQPage',
    gyik: 'FAQPage',
  };
  return typeMap[slug?.toLowerCase()] || 'WebPage';
}
