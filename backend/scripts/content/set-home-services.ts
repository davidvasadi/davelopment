/**
 * Home page "Szolgáltatások." block (services block on page #220): five items instead of four — Websites, Redesigns,
 * Marketing & SEO (ads + SEO/content), Brand & motion, Care & growth. Same block design; only the text of the
 * reference stays: badge "Szolgáltatások", heading + short text + "Összes szolgáltatás" button, and per item only the
 * title, description and one photo (no categories). Photos: placeholders from the web (Desktop/davelopment services),
 * uploaded once with hu + en alt — to be replaced with our own images at the end of the redesign.
 *
 *   npx payload run scripts/content/set-home-services.ts -- <dir>             # dry run
 *   npx payload run scripts/content/set-home-services.ts -- <dir> --apply     # write
 */
import path from 'path'
import { getPayload } from 'payload'
import config from '@payload-config'

const apply = process.argv.includes('--apply')
const dir = process.argv.find((a, i) => i > 1 && !a.startsWith('--') && a.includes('/'))
if (!dir) throw new Error('usage: … -- <dir with the photos> [--apply]')

// tételenként egy kép (a sorrend = a tételek sorrendje)
const PHOTOS = [
  { file: 'davelopment-weboldal-keszites.avif', hu: 'Weboldal készítése laptopon', en: 'Building a website on a laptop' },
  { file: 'davelopment-felfedezes.avif', hu: 'Két kéz egy tervvázlattal és két kávéval kék asztalon — az első, irány-meghatározó beszélgetés', en: 'Hands holding a sketched plan next to two coffees on a blue table — the first, direction-setting conversation' },
  { file: 'davelopment-hirdeteskezeles.avif', hu: 'Online hirdetések és marketing', en: 'Online advertising and marketing' },
  { file: 'davelopment-markaepites.avif', hu: 'Márkaépítés és arculattervezés', en: 'Brand building and identity design' },
  { file: 'davelopment-karbantartas.avif', hu: 'Weboldal-karbantartás és támogatás', en: 'Website maintenance and support' },
]
const PAGE_ID = 220

type Item = { title: string; description: string }
const ITEMS: Record<'hu' | 'en', Item[]> = {
  hu: [
    { title: 'Weboldalak', description: 'Üres lapról tervezett, ügyfélszerző weboldalak, olyan tartalomkezelővel, amit te is könnyen kezelsz.' },
    { title: 'Újratervezés', description: 'Új alapokra helyezzük az oldalt, ami már nem illik a vállalkozásodhoz — úgy, hogy a Google-helyezéseid megmaradjanak.' },
    { title: 'Marketing & SEO', description: 'Keresőoptimalizálás, tartalom és Google-hirdetések, amelyek ügyfeleket hoznak — mérhető eredményekkel.' },
    { title: 'Arculat és design', description: 'Betűk, színek, elemek és mozgás, amelyek a márkádat egységesen viszik át az online térbe.' },
    { title: 'Támogatás és növekedés', description: 'Frissítések, sebesség, tesztelés és közvetlen kapcsolat a fejlesztővel az indulás után is.' },
  ],
  en: [
    { title: 'Websites', description: 'Marketing sites designed from a blank page, on a CMS you can run yourself.' },
    { title: 'Redesigns', description: 'A rebuild for the site that no longer matches the business, without losing your rankings.' },
    { title: 'Marketing & SEO', description: 'Search optimisation, content and Google Ads that bring in customers — with measurable results.' },
    { title: 'Brand & design', description: 'Type, colour, components and movement that carry the brand online.' },
    { title: 'Support & growth', description: 'Updates, speed, testing and a direct line to your developer after launch.' },
  ],
}

const payload = await getPayload({ config })

const photoIds: (number | string)[] = []
for (const p of PHOTOS) {
  const found = await payload.find({ collection: 'media', where: { filename: { equals: p.file } }, limit: 1, depth: 0 })
  if (found.docs[0]) { photoIds.push(found.docs[0].id); console.log(`– megvan: ${p.file} (#${found.docs[0].id})`); continue }
  if (!apply) { photoIds.push('?'); console.log(`○ feltöltené: ${p.file}`); continue }
  const doc: any = await payload.create({ collection: 'media', locale: 'hu', data: { alt: p.hu } as any, filePath: path.join(dir, p.file) })
  await payload.update({ collection: 'media', id: doc.id, locale: 'en', data: { alt: p.en } as any })
  photoIds.push(doc.id)
  console.log(`✓ feltöltve: ${p.file} (#${doc.id})`)
}

for (const locale of ['hu', 'en'] as const) {
  const page: any = await payload.findByID({ collection: 'pages', id: PAGE_ID, locale, fallbackLocale: false as any, depth: 0 })
  const zone = page.dynamic_zone ?? []
  const block = zone.find((b: any) => b.blockType === 'services')
  if (!block) { console.log(`✗ ${locale}: nincs services blokk`); continue }
  const items: any[] = []
  for (const [i, it] of ITEMS[locale].entries()) {
    items.push({
      number: String(i + 1).padStart(3, '0'),
      title: it.title,
      description: it.description,
      image: photoIds[i] && photoIds[i] !== '?' ? [photoIds[i]] : [],
      categories_title: '',
      categories: [],
      category_count: '',
      stats: [],
    })
  }
  console.log(`${locale}: ${block.elements_service_item.map((x: any) => x.title).join(' · ')}\n  → ${items.map((x) => x.title).join(' · ')}`)
  if (!apply) continue
  const head = locale === 'hu'
    ? { badge_label: 'Szolgáltatások', heading: 'Öt dolog, amit jól csinálunk', sub_heading: 'Minden projektet egy csapat visz végig, az első beszélgetéstől az indulásig — és utána is.', cta_title: 'Összes szolgáltatás', cta_anchor: '/hu/szolgaltatasok' }
    : { badge_label: 'Services', heading: 'Five things we do well', sub_heading: 'Every project is one team, from the first conversation to launch day — and after.', cta_title: 'All services', cta_anchor: '/en/services' }
  console.log(`  fejléc: ${block.badge_label} / ${block.heading} → ${head.badge_label} / ${head.heading}`)
  const next = zone.map((b: any) => (b === block ? { ...b, ...head, elements_service_item: items } : b))
  await payload.update({ collection: 'pages', id: PAGE_ID, locale, depth: 0, data: { dynamic_zone: next, _status: 'published' } as any })
  console.log(`✓ ${locale}: kész`)
}
process.exit(0)
