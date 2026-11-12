/**
 * Marketing & SEO page (#224): new slugs — HU seo-tartalommarketing → marketing-es-seo, EN seo-content-marketing →
 * marketing-and-seo (2026-11), and the SEO canonical URL follows. The old URLs 301-redirect to the new ones
 * (frontend next.config.mjs).
 *
 *   npx payload run scripts/content/rename-marketing-slug.ts              # dry run
 *   npx payload run scripts/content/rename-marketing-slug.ts -- --apply   # write
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const apply = process.argv.includes('--apply')
const PAGE_ID = 224
const SLUG = { hu: 'marketing-es-seo', en: 'marketing-and-seo' } as const
const CANONICAL = {
  hu: 'https://davelopment.hu/hu/szolgaltatasok/marketing-es-seo',
  en: 'https://davelopment.hu/en/services/marketing-and-seo',
} as const
const payload = await getPayload({ config })
for (const locale of ['hu', 'en'] as const) {
  const page: any = await payload.findByID({ collection: 'pages', id: PAGE_ID, locale, fallbackLocale: false as any, depth: 0 })
  console.log(`${locale}: ${page.slug} → ${SLUG[locale]} · canonical: ${page.seo?.canonicalURL} → ${CANONICAL[locale]}`)
  if (!apply || (page.slug === SLUG[locale] && page.seo?.canonicalURL === CANONICAL[locale])) continue
  await payload.update({ collection: 'pages', id: PAGE_ID, locale, depth: 0, data: { slug: SLUG[locale], seo: { ...(page.seo ?? {}), canonicalURL: CANONICAL[locale] }, _status: 'published' } as any })
  console.log(`✓ ${locale}`)
}
process.exit(0)
