/**
 * Home page hero (page #220): the bottom text becomes the page H1 (2026-11 redesign) — new first sentence with the main keyword (weboldal készítés),
 * the second stays. Updates description_lead / description_body / description_text (HU + EN).
 *
 *   npx payload run scripts/content/set-home-hero-text.ts              # dry run
 *   npx payload run scripts/content/set-home-hero-text.ts -- --apply   # write
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const apply = process.argv.includes('--apply')
const PAGE_ID = 220

const TEXT = {
  hu: {
    description_lead: 'Weboldal készítés induló vállalkozásoknak és olyan márkáknak, amelyek kinőtték az első oldalukat.',
    description_body: 'Csak eszközök és stratégiák, amelyek segítik a vállalkozásod növekedését, és valóban láthatóvá teszik a márkádat.',
  },
  en: {
    description_lead: 'Website design and development for new businesses and for brands that have outgrown their first site.',
    description_body: 'Just tools and strategies that help your business grow and make your brand truly visible.',
  },
} as const

const payload = await getPayload({ config })

for (const locale of ['hu', 'en'] as const) {
  const page: any = await payload.findByID({ collection: 'pages', id: PAGE_ID, locale, fallbackLocale: false as any, depth: 0 })
  const zone = page.dynamic_zone ?? []
  const block = zone.find((b: any) => b.blockType === 'hero')
  if (!block) { console.log(`✗ ${locale}: nincs hero blokk`); continue }
  const t = TEXT[locale]
  console.log(`${locale}: ${block.description_lead}\n  → ${t.description_lead}`)
  if (!apply) continue
  const next = zone.map((b: any) => (b === block ? { ...b, ...t, description_text: `${t.description_lead}\n${t.description_body}` } : b))
  await payload.update({ collection: 'pages', id: PAGE_ID, locale, depth: 0, data: { dynamic_zone: next, _status: 'published' } as any })
  console.log(`✓ ${locale}: kész`)
}
process.exit(0)
