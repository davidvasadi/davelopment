/**
 * Swaps the MacBook/iPhone mockup images on the services hub (`service` global, macbook-scroll block) to the salon
 * overview screenshots of davelopment booking. Uploads both images (hu + en alt) once, then points the block at them
 * in both locales. Idempotent: an already uploaded file (same filename) is reused.
 *
 *   npx payload run scripts/content/set-services-mockups.ts -- <dir>              # dry run
 *   npx payload run scripts/content/set-services-mockups.ts -- <dir> --apply      # write
 */
import path from 'path'
import { getPayload } from 'payload'
import config from '@payload-config'

const apply = process.argv.includes('--apply')
const dir = process.argv.find((a, i) => i > 1 && !a.startsWith('--') && a.includes('/'))
if (!dir) throw new Error('usage: … -- <dir with the two webp files> [--apply]')

const FILES = {
  desktop: {
    file: 'foglalasi-rendszer-attekintes-szalon-desktop-davelopment-booking.webp',
    hu: 'A davelopment booking foglalási rendszer Áttekintés oldala egy fodrászatnál: mai foglalások, várható bevétel, teendők és közelgő időpontok egy képernyőn',
    en: 'The Overview page of the davelopment booking system at a hair salon: today’s bookings, expected revenue, tasks and upcoming appointments on one screen',
  },
  mobile: {
    file: 'foglalasi-rendszer-attekintes-szalon-mobil-davelopment-booking.webp',
    hu: 'A davelopment booking foglalási rendszer Áttekintés oldala telefonon: a nap foglalásai és a közelgő időpontok',
    en: 'The davelopment booking Overview page on a phone: the day’s bookings and upcoming appointments',
  },
} as const

const payload = await getPayload({ config })

const ids: Record<string, number | string> = {}
for (const [key, f] of Object.entries(FILES)) {
  const existing = await payload.find({ collection: 'media', where: { filename: { equals: f.file } }, limit: 1, depth: 0 })
  if (existing.docs[0]) {
    ids[key] = existing.docs[0].id
    console.log(`– megvan: ${f.file} (#${ids[key]})`)
    continue
  }
  if (!apply) { console.log(`○ feltöltené: ${f.file}`); continue }
  const doc: any = await payload.create({ collection: 'media', locale: 'hu', data: { alt: f.hu } as any, filePath: path.join(dir, f.file) })
  await payload.update({ collection: 'media', id: doc.id, locale: 'en', data: { alt: f.en } as any })
  ids[key] = doc.id
  console.log(`✓ feltöltve: ${f.file} (#${doc.id})`)
}

for (const locale of ['hu', 'en'] as const) {
  const svc: any = await payload.findGlobal({ slug: 'service' as any, locale, fallbackLocale: false as any, depth: 0 })
  const zone = svc.dynamic_zone ?? []
  const block = zone.find((b: any) => b.blockType === 'macbook-scroll')
  if (!block) { console.log(`✗ ${locale}: nincs macbook-scroll blokk`); continue }
  console.log(`${locale}: most desktop #${block.desktop_media} / mobil #${block.mobile_media} → #${ids.desktop} / #${ids.mobile}`)
  if (!apply) continue
  const next = zone.map((b: any) => (b === block ? { ...b, desktop_media: ids.desktop, mobile_media: ids.mobile } : b))
  await payload.updateGlobal({ slug: 'service' as any, locale, depth: 0, data: { dynamic_zone: next, _status: 'published' } as any })
  console.log(`✓ ${locale}: kész`)
}

process.exit(0)
