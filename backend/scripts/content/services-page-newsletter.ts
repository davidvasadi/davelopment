/**
 * Services page (the "service" global): append a newsletter block to the lower zone ("cta" field), copied from the
 * Website page's (#234) newsletter block, HU + EN (2026-11 redesign). The old pricing block in that zone is hidden in
 * the frontend (the new ServicesPricing replaces it). Idempotent.
 *
 *   npx payload run scripts/content/services-page-newsletter.ts              # dry run
 *   npx payload run scripts/content/services-page-newsletter.ts -- --apply   # write
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const apply = process.argv.includes('--apply')
const SOURCE = 234
const stripIds = (v: any): any =>
  Array.isArray(v) ? v.map(stripIds) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).filter(([k]) => k !== 'id').map(([k, x]) => [k, stripIds(x)])) : v

const payload = await getPayload({ config })
for (const locale of ['hu', 'en'] as const) {
  const src: any = await payload.findByID({ collection: 'pages', id: SOURCE, locale, fallbackLocale: false as any, depth: 0 })
  const block = (src.dynamic_zone ?? []).find((b: any) => b.blockType === 'newsletter')
  if (!block) { console.log(`– ${locale}: nincs forrás hírlevél`); continue }
  const g: any = await payload.findGlobal({ slug: 'service', locale, fallbackLocale: false as any, depth: 0 })
  const zone = g.cta ?? []
  if (zone.some((b: any) => b.blockType === 'newsletter')) { console.log(`– ${locale}: már van`); continue }
  console.log(`${locale}: hírlevél a Szolgáltatások oldal aljára`)
  if (!apply) continue
  await payload.updateGlobal({ slug: 'service', locale, depth: 0, data: { cta: [...zone, { ...stripIds(block), source: locale === 'hu' ? 'szolgaltatasok' : 'services' }] } as any })
  console.log(`✓ ${locale}`)
}
process.exit(0)
