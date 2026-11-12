/**
 * Home page projects block (products block on page #220): new header text in the shared redesign style
 * (badge "Projektek", heading "Válogatott projektek", short text). The "Összes projekt" link is in the component.
 *
 *   npx payload run scripts/content/set-home-projects-head.ts              # dry run
 *   npx payload run scripts/content/set-home-projects-head.ts -- --apply   # write
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const apply = process.argv.includes('--apply')
const PAGE_ID = 220
const HEAD = {
  hu: { badge_label: 'Projektek', heading: 'Válogatott projektek', sub_heading: 'Friss indulások. Minden kép egy élő oldal, amit mi terveztünk és építettünk.' },
  en: { badge_label: 'Projects', heading: 'Selected projects', sub_heading: 'Recent launches. Every screen is a live site we designed and built.' },
} as const

const payload = await getPayload({ config })
for (const locale of ['hu', 'en'] as const) {
  const page: any = await payload.findByID({ collection: 'pages', id: PAGE_ID, locale, fallbackLocale: false as any, depth: 0 })
  const zone = page.dynamic_zone ?? []
  const block = zone.find((b: any) => b.blockType === 'products')
  if (!block) { console.log(`✗ ${locale}: nincs products blokk`); continue }
  console.log(`${locale}: ${block.badge_label} / ${block.heading} → ${HEAD[locale].badge_label} / ${HEAD[locale].heading}`)
  if (!apply) continue
  const next = zone.map((b: any) => (b === block ? { ...b, ...HEAD[locale] } : b))
  await payload.update({ collection: 'pages', id: PAGE_ID, locale, depth: 0, data: { dynamic_zone: next, _status: 'published' } as any })
  console.log(`✓ ${locale}: kész`)
}
process.exit(0)
