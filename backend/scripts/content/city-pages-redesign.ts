/**
 * City pages (2026-11 redesign): Budapest (#237) and Debrecen (#238) render the new service layout (frontend
 * [slug]/page.tsx + lib/services/service-details.ts). Here: append the projects, Google review and newsletter blocks
 * copied from the Website page (#234, same locale, own newsletter source tag), and fix the SEO title separator.
 * Idempotent: skips a block type the page already has. HU + EN.
 *
 *   npx payload run scripts/content/city-pages-redesign.ts              # dry run
 *   npx payload run scripts/content/city-pages-redesign.ts -- --apply   # write
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const apply = process.argv.includes('--apply')
const SOURCE = 234
const TARGETS = [237, 238]
const COPY = ['products', 'google-review-story', 'newsletter']
const TITLES: Record<string, string> = {
  '237:hu': 'Egyedi weboldal készítés Budapest | [davelopment]®',
  '238:hu': 'Egyedi weboldal készítés Debrecen | [davelopment]®',
  '237:en': 'Web Design Budapest — Custom, SEO-ready | [davelopment]®',
  '238:en': 'Web Design Debrecen — Custom, SEO-ready | [davelopment]®',
}
const stripIds = (v: any): any =>
  Array.isArray(v) ? v.map(stripIds) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).filter(([k]) => k !== 'id').map(([k, x]) => [k, stripIds(x)])) : v

const payload = await getPayload({ config })
for (const locale of ['hu', 'en'] as const) {
  const src: any = await payload.findByID({ collection: 'pages', id: SOURCE, locale, fallbackLocale: false as any, depth: 0 })
  for (const id of TARGETS) {
    const page: any = await payload.findByID({ collection: 'pages', id, locale, fallbackLocale: false as any, depth: 0 })
    const zone: any[] = page.dynamic_zone ?? []
    const add = COPY.filter((t) => !zone.some((b: any) => b.blockType === t))
      .map((t) => (src.dynamic_zone ?? []).find((b: any) => b.blockType === t))
      .filter(Boolean)
      .map((b: any) => (b.blockType === 'newsletter' ? { ...stripIds(b), source: page.slug } : stripIds(b)))
    const title = TITLES[`${id}:${locale}`]
    console.log(`#${id} ${locale} (${page.slug}): + ${add.map((b: any) => b.blockType).join(', ') || '–'} · title: ${page.seo?.metaTitle} → ${title}`)
    if (!apply) continue
    await payload.update({
      collection: 'pages', id, locale, depth: 0,
      data: { dynamic_zone: [...zone, ...add], seo: { ...(page.seo ?? {}), metaTitle: title }, _status: 'published' } as any,
    })
    console.log(`✓ #${id} ${locale}`)
  }
}
process.exit(0)
