/**
 * Payload beforeChange hook — auto-generates seo.structuredData JSON-LD
 * if the field is empty. Runs on create and update.
 *
 * Usage: import in Articles.ts (and Products.ts if needed)
 */

const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://davelopment.hu'
const SITE_NAME = '[davelopment]®'
const DEFAULT_AUTHOR = {
  '@type': 'Person',
  name: 'Vasadi Dávid',
  url: SITE_URL,
}
const PUBLISHER = {
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
}

/** Build Article JSON-LD from Payload doc data */
function buildArticleSchema(data: Record<string, any>, locale: string): Record<string, any> {
  const siteSlug = locale === 'hu'
    ? `${SITE_URL}/hu/blog/${data.slug}`
    : `${SITE_URL}/en/blog/${data.slug}`

  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.title || '',
    description: data.description || '',
    url: siteSlug,
    datePublished: data.publishedAt || new Date().toISOString(),
    dateModified: data.updatedAt || new Date().toISOString(),
    author: DEFAULT_AUTHOR,
    publisher: PUBLISHER,
    inLanguage: locale === 'hu' ? 'hu-HU' : 'en-US',
  }

  // Add image if available (populated object with url)
  const img = data.image
  if (img && typeof img === 'object' && img.url) {
    schema.image = img.url.startsWith('http') ? img.url : `${SITE_URL}${img.url}`
  }

  // Add keywords from seo.keywords if present
  const keywords = data.seo?.keywords
  if (keywords) schema.keywords = keywords

  return schema
}

/** Build Product JSON-LD (SoftwareApplication / CreativeWork) */
function buildProductSchema(data: Record<string, any>, locale: string): Record<string, any> {
  const siteSlug = locale === 'hu'
    ? `${SITE_URL}/hu/termekek/${data.slug}`
    : `${SITE_URL}/en/products/${data.slug}`

  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: data.name || '',
    description: data.description || '',
    url: siteSlug,
    creator: DEFAULT_AUTHOR,
    publisher: PUBLISHER,
    inLanguage: locale === 'hu' ? 'hu-HU' : 'en-US',
  }

  const img = data.image
  if (img && typeof img === 'object' && img.url) {
    schema.image = img.url.startsWith('http') ? img.url : `${SITE_URL}${img.url}`
  }

  return schema
}

type HookArgs = {
  data: Record<string, any>
  operation: string
  req: { locale?: string }
  collection?: { slug?: string }
}

/**
 * beforeChange hook — mutates data.seo.structuredData if empty.
 * Supports: articles, products
 */
export function generateStructuredDataHook({ data, operation, req, collection }: HookArgs): Record<string, any> {
  if (operation !== 'create' && operation !== 'update') return data

  // Only auto-generate if structuredData is not already set
  const existing = data?.seo?.structuredData
  if (existing && Object.keys(existing).length > 0) return data

  const locale = (req.locale as string) || 'hu'
  const slug = collection?.slug

  let schema: Record<string, any> | null = null

  if (slug === 'articles') {
    schema = buildArticleSchema(data, locale)
  } else if (slug === 'products') {
    schema = buildProductSchema(data, locale)
  }

  if (!schema) return data

  return {
    ...data,
    seo: {
      ...(data.seo ?? {}),
      structuredData: schema,
    },
  }
}
