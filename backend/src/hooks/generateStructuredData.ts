/**
 * Payload beforeChange hook — auto-generates seo.structuredData JSON-LD
 * if the field is empty. Runs on create and update for collections,
 * and on update for globals.
 *
 * Usage: import in Articles.ts, Products.ts, BlogPage.ts, ProductPage.ts, Service.ts
 */

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://davelopment.hu').replace(/\/+$/, '')
const SITE_NAME = '[davelopment]®'
const DEFAULT_AUTHOR = {
  '@type': 'Person',
  name: 'Vasadi Dávid',
  url: SITE_URL,
}
const PUBLISHER = {
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,}

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

/** Build WebPage JSON-LD for Pages collection (homepage, dynamic pages) */
function buildPagesSchema(data: Record<string, any>, locale: string): Record<string, any> {
  const isHu = locale === 'hu'
  const slug = data.slug || ''
  const isHomepage = slug === 'homepage' || slug === ''
  const url = isHomepage
    ? `${SITE_URL}/${isHu ? 'hu' : 'en'}`
    : `${SITE_URL}/${isHu ? 'hu' : 'en'}/${slug}`

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: data.seo?.metaTitle || data.label || '',
    description: data.seo?.metaDescription || '',
    url,
    inLanguage: isHu ? 'hu-HU' : 'en-US',
    isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
    publisher: PUBLISHER,
  }
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

/** Build WebPage JSON-LD for global index/overview pages */
function buildWebPageSchema(data: Record<string, any>, globalSlug: string, locale: string): Record<string, any> {
  const isHu = locale === 'hu'
  const localePrefix = isHu ? '/hu' : '/en'

  const urlMap: Record<string, string> = {
    'blog-page':    `${SITE_URL}${localePrefix}/blog`,
    'product-page': `${SITE_URL}${localePrefix}/${isHu ? 'projektek' : 'projects'}`,
    'service':      `${SITE_URL}${localePrefix}/${isHu ? 'szolgaltatasok' : 'services'}`,
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: data.seo?.metaTitle || data.heading || '',
    description: data.seo?.metaDescription || '',
    url: urlMap[globalSlug] ?? SITE_URL,
    inLanguage: isHu ? 'hu-HU' : 'en-US',
    isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
    publisher: PUBLISHER,
  }
}

type HookArgs = {
  data: Record<string, any>
  operation?: string
  req: { locale?: string | null }
  collection?: { slug?: string }
  global?: { slug?: string }
}

/**
 * beforeChange hook — mutates data.seo.structuredData if empty.
 * Supports: articles, products (collections) + blog-page, product-page, service (globals)
 */
export function generateStructuredDataHook({ data, operation, req, collection, global }: HookArgs): Record<string, any> {
  if (operation && operation !== 'create' && operation !== 'update') return data

  // Only auto-generate if structuredData is not already a proper object
  const existing = data?.seo?.structuredData
  if (existing && typeof existing === 'object' && Object.keys(existing).length > 0) return data

  const locale = (req.locale as string) || 'hu'
  const collectionSlug = collection?.slug
  const globalSlug = global?.slug

  let schema: Record<string, any> | null = null

  if (collectionSlug === 'articles') {
    schema = buildArticleSchema(data, locale)
  } else if (collectionSlug === 'products') {
    schema = buildProductSchema(data, locale)
  } else if (collectionSlug === 'pages') {
    schema = buildPagesSchema(data, locale)
  } else if (globalSlug && ['blog-page', 'product-page', 'service'].includes(globalSlug)) {
    schema = buildWebPageSchema(data, globalSlug, locale)
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
