/**
 * "Hogyan dolgozunk" (how-it-works block on the home page, page #220): the bento redesign shows full-bleed photos
 * on step 1 and step 4. Uploads the two photos once (hu + en alt) and sets them on those steps in both locales.
 * NOTE: placeholder photos from the web — to be replaced with our own images at the end of the redesign.
 *
 *   npx payload run scripts/content/set-how-it-works-images.ts -- <dir>            # dry run
 *   npx payload run scripts/content/set-how-it-works-images.ts -- <dir> --apply    # write
 */
import path from 'path'
import { getPayload } from 'payload'
import config from '@payload-config'

const apply = process.argv.includes('--apply')
const dir = process.argv.find((a, i) => i > 1 && !a.startsWith('--') && a.includes('/'))
if (!dir) throw new Error('usage: … -- <dir with the photos> [--apply]')

const PAGE_ID = 220
const PHOTOS: Record<number, { file: string; hu: string; en: string }> = {
  0: {
    file: 'davelopment-felfedezes.avif',
    hu: 'Két kéz egy tervvázlattal és két kávéval kék asztalon — az első, irány-meghatározó beszélgetés',
    en: 'Hands holding a sketched plan next to two coffees on a blue table — the first, direction-setting conversation',
  },
  3: {
    file: 'davelopment-launch.avif',
    hu: 'Telefont tartó kéz egy városi utcán — az elkészült weboldal indítása',
    en: 'A hand holding a phone on a city street — launching the finished website',
  },
}

const payload = await getPayload({ config })

const ids: Record<number, number | string> = {}
for (const [i, p] of Object.entries(PHOTOS)) {
  const found = await payload.find({ collection: 'media', where: { filename: { equals: p.file } }, limit: 1, depth: 0 })
  if (found.docs[0]) { ids[+i] = found.docs[0].id; console.log(`– megvan: ${p.file} (#${ids[+i]})`); continue }
  if (!apply) { console.log(`○ feltöltené: ${p.file}`); continue }
  const doc: any = await payload.create({ collection: 'media', locale: 'hu', data: { alt: p.hu } as any, filePath: path.join(dir, p.file) })
  await payload.update({ collection: 'media', id: doc.id, locale: 'en', data: { alt: p.en } as any })
  ids[+i] = doc.id
  console.log(`✓ feltöltve: ${p.file} (#${doc.id})`)
}

for (const locale of ['hu', 'en'] as const) {
  const page: any = await payload.findByID({ collection: 'pages', id: PAGE_ID, locale, fallbackLocale: false as any, depth: 0 })
  const zone = page.dynamic_zone ?? []
  const block = zone.find((b: any) => b.blockType === 'how-it-works')
  if (!block) { console.log(`✗ ${locale}: nincs how-it-works blokk`); continue }
  const steps = (block.steps ?? []).map((s: any, i: number) => (ids[i] ? { ...s, image: ids[i] } : s))
  console.log(`${locale}: lépésképek → ${steps.map((s: any) => s.image).join(', ')}`)
  if (!apply) continue
  const next = zone.map((b: any) => (b === block ? { ...b, steps } : b))
  await payload.update({ collection: 'pages', id: PAGE_ID, locale, depth: 0, data: { dynamic_zone: next, _status: 'published' } as any })
  console.log(`✓ ${locale}: kész`)
}
process.exit(0)
