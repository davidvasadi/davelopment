import type { Core } from '@strapi/strapi';
import { getSiteUrl, buildOrganization } from './helpers';

export async function generateProduct(
  data: Record<string, any>,
  organization: any,
  strapi: Core.Strapi
): Promise<Record<string, any>> {
  const base = getSiteUrl(strapi);
  const imageUrl = data.cover?.url || data.image?.url || data.metaImage?.url || null;

  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: data.title || data.name || data.metaTitle || '',
    description: data.metaDescription || data.description || '',
    url: data.slug ? `${base}/products/${data.slug}` : base,
    brand: buildOrganization(organization, strapi),
    ...(data.sku && { sku: String(data.sku) }),
    ...(imageUrl && { image: imageUrl }),
  };

  if (data.price !== undefined && data.price !== null) {
    schema.offers = {
      '@type': 'Offer',
      price: String(data.price),
      priceCurrency: data.currency || 'HUF',
      availability:
        data.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      url: data.slug ? `${base}/products/${data.slug}` : base,
    };
  }

  return schema;
}
