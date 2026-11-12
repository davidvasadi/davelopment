/**
 * Karbantartás page (#236): the care FAQs from the 2026-11 redesign reference (HU + EN, fitted to our support plans:
 * Alap támogatás / Növekedés / Beágyazott csapat) go to the top of the page's FAQ block; the existing questions stay below.
 * The block heading is renamed. Idempotent (looks FAQs up by question).
 *
 *   npx payload run scripts/content/set-care-faq.ts              # dry run
 *   npx payload run scripts/content/set-care-faq.ts -- --apply   # write
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const apply = process.argv.includes('--apply')
const PAGE_ID = 236
const HEADING = { hu: 'Gyakori kérdések a támogatásról', en: 'Care questions' } as const
const FAQS = [
  {
    hu: { question: 'Vállaljátok olyan oldal gondozását, amit nem ti építettetek?', answer: 'Igen, egy fizetős belépő átvilágítás után. Előbb megnézzük a kódot, a platformot és a tárhelyet, és őszintén megmondjuk, ha valamit újra kell építeni.' },
    en: { question: 'Can you look after a site you did not build?', answer: 'Yes, after a paid onboarding audit. We check the code, platform and hosting first, and tell you honestly if anything needs rebuilding.' },
  },
  {
    hu: { question: 'Mennyi módosítás fér bele egy hónapba?', answer: 'Nem órákban mérjük: a kisebb módosításokat és tartalomfrissítéseket folyamatosan intézzük. Ha egy kérés már nagyobb fejlesztés, előre szólunk, és közösen ütemezzük.' },
    en: { question: 'How many changes fit into a month?', answer: 'We do not count hours: small changes and content updates are handled as they come. If a request turns into bigger work, we tell you first and schedule it together.' },
  },
  {
    hu: { question: 'Milyen gyorsan reagáltok?', answer: 'Egy munkanapon belül válaszolunk. Ha az oldal leáll vagy hibát jelez a figyelés, azonnal nekiállunk — a Beágyazott csapat csomagban elsőbbséggel.' },
    en: { question: 'How fast do you respond?', answer: 'We reply within one working day. If the site goes down or monitoring flags an error, we start straight away — with priority on the Embedded plan.' },
  },
  {
    hu: { question: 'Benne van a SEO a támogatásban?', answer: 'A Növekedés csomagtól figyeljük a Search Console-t, az indexelést és a sebességet, és javítjuk, amit találunk. A Beágyazott csapat csomag havi 4 SEO-cikket is tartalmaz.' },
    en: { question: 'Is SEO part of the care plans?', answer: 'From the Growth plan we watch Search Console, indexing and speed, and fix what we find. The Embedded plan also includes four SEO articles a month.' },
  },
  {
    hu: { question: 'Válthatunk csomagot?', answer: 'Igen, hónapról hónapra. A csomagok havonta megújulók, 30 napos felmondási idővel.' },
    en: { question: 'Can we change plans?', answer: 'Yes, from one month to the next. Plans are rolling monthly with thirty days notice.' },
  },
]

const payload = await getPayload({ config })
FAQS.forEach((f) => console.log(`GYIK: ${f.hu.question}`))
if (!apply) process.exit(0)

const ids: (number | string)[] = []
for (const f of FAQS) {
  const prev = await payload.find({ collection: 'faqs', where: { question: { equals: f.hu.question } }, locale: 'hu', limit: 1, depth: 0 })
  if (prev.docs[0]) { ids.push(prev.docs[0].id); continue }
  const doc: any = await payload.create({ collection: 'faqs', locale: 'hu', data: f.hu as any })
  await payload.update({ collection: 'faqs', id: doc.id, locale: 'en', data: f.en as any })
  ids.push(doc.id)
}
console.log(`✓ GYIK: ${ids.join(', ')}`)

for (const locale of ['hu', 'en'] as const) {
  const page: any = await payload.findByID({ collection: 'pages', id: PAGE_ID, locale, fallbackLocale: false as any, depth: 0 })
  const zone = page.dynamic_zone ?? []
  const next = zone.map((b: any) => {
    if (b.blockType !== 'faq') return b
    const old = (b.faqs ?? []).map((x: any) => (typeof x === 'object' ? x.id : x)).filter((x: any) => !ids.includes(x))
    return { ...b, heading: HEADING[locale], faqs: [...ids, ...old] }
  })
  await payload.update({ collection: 'pages', id: PAGE_ID, locale, depth: 0, data: { dynamic_zone: next, _status: 'published' } as any })
  console.log(`✓ ${locale}`)
}
process.exit(0)
