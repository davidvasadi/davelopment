/**
 * Projects page (product-page global): new short text next to the "Projektek." heading (2026-11 redesign, HU + EN).
 * The "Beszéljünk a projektedről" button under it is in the frontend page.
 *
 *   npx payload run scripts/content/set-projects-page-sub.ts              # dry run
 *   npx payload run scripts/content/set-projects-page-sub.ts -- --apply   # write
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const apply = process.argv.includes('--apply')
const SUB = {
  hu: 'Friss indulások szalonoknak, szolgáltatóknak, kereskedőknek és B2B cégeknek. Minden számot az indulás után maga az ügyfél mért.',
  en: 'Recent launches for salons, service businesses, retailers and B2B companies. Every figure was measured after launch, by the client.',
} as const

const payload = await getPayload({ config })
for (const locale of ['hu', 'en'] as const) {
  const g: any = await payload.findGlobal({ slug: 'product-page', locale, fallbackLocale: false as any, depth: 0 })
  console.log(`${locale}: ${g.sub_heading}\n  → ${SUB[locale]}`)
  if (!apply) continue
  await payload.updateGlobal({ slug: 'product-page', locale, depth: 0, data: { sub_heading: SUB[locale] } as any })
  console.log(`✓ ${locale}`)
}
process.exit(0)
