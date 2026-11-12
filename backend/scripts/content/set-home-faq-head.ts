/**
 * Home page FAQ block (page #220): heading in the redesign style ("Kérdések, válaszok" / "Questions, answered").
 * The "Még döntesz?" card under it is in the component (frontend/components/dynamic-zone/faq.tsx).
 *
 *   npx payload run scripts/content/set-home-faq-head.ts              # dry run
 *   npx payload run scripts/content/set-home-faq-head.ts -- --apply   # write
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const apply = process.argv.includes('--apply')
const PAGE_ID = 220
const HEAD = { hu: { heading: 'Kérdések, válaszok' }, en: { heading: 'Questions, answered' } } as const

const payload = await getPayload({ config })
for (const locale of ['hu', 'en'] as const) {
  const page: any = await payload.findByID({ collection: 'pages', id: PAGE_ID, locale, fallbackLocale: false as any, depth: 0 })
  const zone = page.dynamic_zone ?? []
  const block = zone.find((b: any) => b.blockType === 'faq')
  if (!block) { console.log(`✗ ${locale}: nincs faq blokk`); continue }
  console.log(`${locale}: ${block.heading} → ${HEAD[locale].heading}`)
  if (!apply) continue
  const next = zone.map((b: any) => (b === block ? { ...b, ...HEAD[locale] } : b))
  await payload.update({ collection: 'pages', id: PAGE_ID, locale, depth: 0, data: { dynamic_zone: next, _status: 'published' } as any })
  console.log(`✓ ${locale}: kész`)
}
process.exit(0)
