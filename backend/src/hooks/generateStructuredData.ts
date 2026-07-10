/**
 * Payload beforeChange hook — DISABLED.
 *
 * Structured data (JSON-LD) is now generated LIVE on the frontend from the CMS
 * content at request time — see frontend/lib/shared/structured-data.ts
 * (renderPageJsonLd), which builds a connected @graph and reads FAQ blocks
 * straight from the page's dynamic_zone. The admin shows that exact live output
 * read-only via the StructuredDataPreview component.
 *
 * The seo.structuredData field is therefore an OPTIONAL manual override only, so
 * this hook no longer auto-fills it (that old auto-fill wrote a weak single-node
 * WebPage object that clobbered the real schema). Kept as a no-op export so the
 * existing imports in the collections/globals keep working.
 */

type HookArgs = {
  data: Record<string, any>
  operation?: string
  req: { locale?: string | null }
  collection?: { slug?: string }
  global?: { slug?: string }
}

export function generateStructuredDataHook({ data }: HookArgs): Record<string, any> {
  return data
}
