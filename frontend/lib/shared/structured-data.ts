// lib/shared/structured-data.ts
// Auto-generates JSON-LD structured data schemas per page type.
// Data comes from Payload CMS — updates automatically when content changes.

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://davelopment.hu').replace(/\/+$/, '')
const ORG_NAME = 'Davelopment'
const ORG_URL = SITE_URL

/** Organization schema — use on every page as base */
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: ORG_NAME,
    url: ORG_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${ORG_URL}/logo.png`,
    },
  }
}

/** WebSite schema — use on homepage */
export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: ORG_NAME,
    url: ORG_URL,
  }
}

/** WebPage schema — generic pages */
export function webPageSchema({
  title,
  description,
  url,
}: {
  title: string
  description?: string | null
  url: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    ...(description && { description }),
    url,
    isPartOf: { '@type': 'WebSite', url: ORG_URL },
  }
}

/** BlogPosting schema — blog article pages */
export function articleSchema({
  title,
  description,
  imageUrl,
  publishedAt,
  updatedAt,
  url,
}: {
  title: string
  description?: string | null
  imageUrl?: string | null
  publishedAt?: string | null
  updatedAt?: string | null
  url: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    ...(description && { description }),
    ...(imageUrl && { image: imageUrl }),
    ...(publishedAt && { datePublished: publishedAt }),
    ...(updatedAt && { dateModified: updatedAt }),
    author: { '@type': 'Organization', name: ORG_NAME, url: ORG_URL },
    publisher: {
      '@type': 'Organization',
      name: ORG_NAME,
      logo: { '@type': 'ImageObject', url: `${ORG_URL}/logo.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  }
}

/** Service schema — service detail pages */
export function serviceSchema({
  name,
  description,
  url,
}: {
  name: string
  description?: string | null
  url: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    ...(description && { description }),
    url,
    provider: { '@type': 'Organization', name: ORG_NAME, url: ORG_URL },
  }
}

/** ItemList schema — listing pages (services, products, blog index) */
export function itemListSchema({
  name,
  url,
  items,
}: {
  name: string
  url: string
  items: { name: string; url: string; position: number }[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    url,
    itemListElement: items.map((item) => ({
      '@type': 'ListItem',
      position: item.position,
      name: item.name,
      url: item.url,
    })),
  }
}

/** BreadcrumbList schema */
export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/**
 * Merge auto-generated schema with manual override from CMS.
 * If the admin filled in structuredData in the SEO field, that wins.
 */
export function resolveSchema(
  autoSchema: Record<string, any>,
  manualOverride?: string | Record<string, any> | null,
): string {
  if (!manualOverride) return JSON.stringify(autoSchema)

  const parsed =
    typeof manualOverride === 'string'
      ? (() => { try { return JSON.parse(manualOverride) } catch { return null } })()
      : manualOverride

  if (!parsed) return JSON.stringify(autoSchema)
  return JSON.stringify({ ...autoSchema, ...parsed })
}
