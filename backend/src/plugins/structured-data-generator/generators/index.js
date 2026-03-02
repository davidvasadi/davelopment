'use strict';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function siteUrl(strapi) {
  return (
    process.env.FRONTEND_URL ||
    strapi.config.get('server.url', 'https://example.com')
  );
}

function orgFromGlobal(organization, strapi) {
  if (!organization) return { '@type': 'Organization', name: 'Unknown' };
  return {
    '@type': 'Organization',
    name: organization.siteName || organization.name || 'Unknown',
    url: siteUrl(strapi),
    logo: organization.logo?.url
      ? {
          '@type': 'ImageObject',
          url: organization.logo.url,
        }
      : undefined,
  };
}

// ---------------------------------------------------------------------------
// WebPage  (Pages collection)
// ---------------------------------------------------------------------------

async function webPage(data, organization, strapi) {
  const base = siteUrl(strapi);
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
    publisher: orgFromGlobal(organization, strapi),
  };
}

// ---------------------------------------------------------------------------
// Article  (Articles / Blog posts collection)
// ---------------------------------------------------------------------------

async function article(data, organization, strapi) {
  const base = siteUrl(strapi);
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.title || data.metaTitle || '',
    description: data.metaDescription || data.description || '',
    url: data.slug ? `${base}/blog/${data.slug}` : base,
    inLanguage: data.locale || 'hu',
    datePublished: data.publishedAt || data.createdAt || new Date().toISOString(),
    dateModified: data.updatedAt || new Date().toISOString(),
    publisher: orgFromGlobal(organization, strapi),
    author: orgFromGlobal(organization, strapi),
  };

  if (data.cover?.url || data.image?.url || data.metaImage?.url) {
    schema.image = {
      '@type': 'ImageObject',
      url: data.cover?.url || data.image?.url || data.metaImage?.url,
    };
  }

  return schema;
}

// ---------------------------------------------------------------------------
// Product  (Products collection)
// ---------------------------------------------------------------------------

async function product(data, organization, strapi) {
  const base = siteUrl(strapi);
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: data.title || data.name || data.metaTitle || '',
    description: data.metaDescription || data.description || '',
    url: data.slug ? `${base}/products/${data.slug}` : base,
    brand: orgFromGlobal(organization, strapi),
  };

  // Price / offer
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

  if (data.cover?.url || data.image?.url || data.metaImage?.url) {
    schema.image = data.cover?.url || data.image?.url || data.metaImage?.url;
  }

  if (data.sku) schema.sku = String(data.sku);

  return schema;
}

// ---------------------------------------------------------------------------

module.exports = { webPage, article, product };
