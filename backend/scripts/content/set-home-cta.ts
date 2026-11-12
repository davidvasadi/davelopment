/**
 * Home page bottom CTA block (cta block on page #220): new text in the redesign ("A következő weboldalad egy 30 perces
 * beszélgetéssel indul."), button "Időpontot kérek", and a short reply/contact line. Design and badge stay.
 *
 *   npx payload run scripts/content/set-home-cta.ts              # dry run
 *   npx payload run scripts/content/set-home-cta.ts -- --apply   # write
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const apply = process.argv.includes('--apply')
const PAGE_ID = 220
const TEXT = {
  hu: {
    heading: 'A következő weboldalad',
    heading_highlight: 'egy 30 perces beszélgetéssel indul.',
    sub_heading: 'Egy munkanapon belül válaszolunk · hello@davelopment.hu · +36 30 362 8377',
    button: 'Időpontot kérek',
  },
  en: {
    heading: 'Your next website starts with a',
    heading_highlight: '30-minute call.',
    sub_heading: 'Replies within one working day · hello@davelopment.hu · +36 30 362 8377',
    button: 'Book the call',
  },
} as const

const payload = await getPayload({ config })
for (const locale of ['hu', 'en'] as const) {
  const page: any = await payload.findByID({ collection: 'pages', id: PAGE_ID, locale, fallbackLocale: false as any, depth: 0 })
  const zone = page.dynamic_zone ?? []
  const block = zone.find((b: any) => b.blockType === 'cta')
  if (!block) { console.log(`✗ ${locale}: nincs cta blokk`); continue }
  const t = TEXT[locale]
  const CTAs = (block.CTAs ?? []).map((c: any, i: number) => (i === 0 ? { ...c, text: t.button } : c))
  console.log(`${locale}: ${block.heading} ${block.heading_highlight} → ${t.heading} ${t.heading_highlight} | gomb: ${block.CTAs?.[0]?.text} → ${t.button}`)
  if (!apply) continue
  const next = zone.map((b: any) => (b === block ? { ...b, heading: t.heading, heading_highlight: t.heading_highlight, sub_heading: t.sub_heading, CTAs } : b))
  await payload.update({ collection: 'pages', id: PAGE_ID, locale, depth: 0, data: { dynamic_zone: next, _status: 'published' } as any })
  console.log(`✓ ${locale}: kész`)
}
process.exit(0)
