/**
 * Marketing & SEO page (#224): the review-story block's video becomes the white smoke clip
 * (weboldal-keszites-davelopment-fustok.mp4) instead of the rocket clip (2026-11 redesign). HU + EN.
 *
 *   npx payload run scripts/content/set-marketing-story-video.ts              # dry run
 *   npx payload run scripts/content/set-marketing-story-video.ts -- --apply   # write
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const apply = process.argv.includes('--apply')
const PAGE_ID = 224
const FILE = 'weboldal-keszites-davelopment-fustok.mp4'
const payload = await getPayload({ config })
const media = await payload.find({ collection: 'media', where: { filename: { equals: FILE } }, limit: 1, depth: 0 })
const id = media.docs[0]?.id
if (!id) throw new Error(`nincs ilyen média: ${FILE}`)
for (const locale of ['hu', 'en'] as const) {
  const page: any = await payload.findByID({ collection: 'pages', id: PAGE_ID, locale, fallbackLocale: false as any, depth: 0 })
  const zone = page.dynamic_zone ?? []
  const block = zone.find((b: any) => b.blockType === 'google-review-story')
  if (!block) { console.log(`– ${locale}: nincs értékelős blokk`); continue }
  console.log(`${locale}: ${block.card2_media} → ${id}`)
  if (!apply) continue
  const next = zone.map((b: any) => (b === block ? { ...b, card2_media: id } : b))
  await payload.update({ collection: 'pages', id: PAGE_ID, locale, depth: 0, data: { dynamic_zone: next, _status: 'published' } as any })
  console.log(`✓ ${locale}`)
}
process.exit(0)
