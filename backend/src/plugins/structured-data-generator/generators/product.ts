import type { Core } from '@strapi/strapi';
import { getSiteUrl, buildOrganization, buildBreadcrumb } from './helpers';

export async function generateProduct(
  data: Record<string, any>,
  organization: any,
  strapi: Core.Strapi
): Promise<Record<string, any>> {
  const base = getSiteUrl(strapi);
  const url = data.slug ? `${base}/products/${data.slug}` : base;
  const org = buildOrganization(organization, strapi);
  const imageUrl = data.images?.[0]?.url || data.cover?.url || data.image?.url || null;
  const breadcrumb = buildBreadcrumb(base, [
    { name: 'Főoldal', url: base },
    { name: 'Szolgáltatások', url: `${base}/products` },
    { name: data.name || data.title || '', url },
  ]);
  const product: Record<string, any> = {
    '@type': 'Product',
    '@id': `${url}/#product`,
    name: data.name || data.title || data.metaTitle || '',
    description: data.metaDescription || data.description || '',
    url,
    brand: { '@id': `${base}/#organization` },
    ...(data.sku && { sku: String(data.sku) }),
    ...(imageUrl && { image: { '@type': 'ImageObject', url: imageUrl } }),
  };
  if (data.price !== undefined && data.price !== null) {
    product.offers = {
      '@type': 'Offer',
      '@id': `${url}/#offer`,
      price: String(data.price),
      priceCurrency: data.currency || 'HUF',
      availability: data.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OnlineOnly',
      url,
      seller: { '@id': `${base}/#organization` },
    };
  }
  return {
    '@context': 'https://schema.org',
    '@graph': [
      product,
      { ...org, '@id': `${base}/#organization` },
      { ...breadcrumb, '@id': `${url}/#breadcrumb` },
    ],
  };
}
