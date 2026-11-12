/**
 * Uploads the redesign photos (Desktop/davelopment services) that are not in the media library yet, with hu + en alt.
 * NOTE: placeholder photos from the web — to be replaced with our own images at the end of the redesign.
 *
 *   npx payload run scripts/content/upload-redesign-media.ts -- <dir>            # dry run
 *   npx payload run scripts/content/upload-redesign-media.ts -- <dir> --apply    # write
 */
import path from 'path'
import { getPayload } from 'payload'
import config from '@payload-config'

const apply = process.argv.includes('--apply')
const dir = process.argv.find((a, i) => i > 1 && !a.startsWith('--') && a.includes('/'))
if (!dir) throw new Error('usage: … -- <dir with the photos> [--apply]')

const FILES = [
  { file: 'davelopment-business-weboldal.avif', hu: 'Üzleti weboldal tervezése', en: 'Designing a business website' },
  { file: 'davelopment-egyedi-weboldal.avif', hu: 'Egyedi weboldal és rendszer fejlesztése', en: 'Building a custom website and system' },
  { file: 'davelopment-novekedes.avif', hu: 'Folyamatos fejlesztés és növekedés', en: 'Ongoing improvement and growth' },
  { file: 'davelopment-beagyazott-csapat.avif', hu: 'Beágyazott design- és fejlesztőcsapat', en: 'An embedded design and development team' },
]

const payload = await getPayload({ config })
for (const f of FILES) {
  const found = await payload.find({ collection: 'media', where: { filename: { equals: f.file } }, limit: 1, depth: 0 })
  if (found.docs[0]) { console.log(`– megvan: ${f.file} (#${found.docs[0].id})`); continue }
  if (!apply) { console.log(`○ feltöltené: ${f.file}`); continue }
  const doc: any = await payload.create({ collection: 'media', locale: 'hu', data: { alt: f.hu } as any, filePath: path.join(dir, f.file) })
  await payload.update({ collection: 'media', id: doc.id, locale: 'en', data: { alt: f.en } as any })
  console.log(`✓ feltöltve: ${f.file} (#${doc.id})`)
}
process.exit(0)
