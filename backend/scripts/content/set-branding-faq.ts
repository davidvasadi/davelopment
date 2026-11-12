/**
 * Branding & Arculat page (#216): the 4 FAQs from the 2026-11 redesign reference (HU + EN) go to the top of the page's
 * FAQ block; the existing questions stay below them. The block heading is renamed. Idempotent (looks FAQs up by question).
 *
 *   npx payload run scripts/content/set-branding-faq.ts              # dry run
 *   npx payload run scripts/content/set-branding-faq.ts -- --apply   # write
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const apply = process.argv.includes('--apply')
const PAGE_ID = 216
const HEADING = { hu: 'Gyakori kérdések az arculatról', en: 'Brand questions' } as const
const FAQS = [
  {
    hu: { question: 'Terveztek logót?', answer: 'Néha, új cégeknek. Az arculati munkánk többsége egy meglévő logóból indul, és köré építjük a képernyőre szabott rendszert.' },
    en: { question: 'Do you design logos?', answer: 'Sometimes, for new companies. Most of our brand work starts from an existing logo and builds the system around it for screens.' },
  },
  {
    hu: { question: 'Megbízhatunk csak arculati munkával?', answer: 'Az arculat és a mozgás általában egy weboldal-projekt része. Nagyobb csapatoknak önálló rendszert egyedi fejlesztésként, közösen felmérve vállalunk.' },
    en: { question: 'Can we hire you for brand work only?', answer: 'Brand and motion is normally part of a website project. Standalone systems for larger teams are scoped together as a custom build.' },
  },
  {
    hu: { question: 'Lelassítja a mozgás az oldalt?', answer: 'Nem. A mozgást teljesítménykerettel tervezzük, figyelembe vesszük a csökkentett mozgás beállítást, és indulás előtt középkategóriás telefonokon is teszteljük.' },
    en: { question: 'Will the motion slow the site down?', answer: 'No. We design motion with performance budgets, respect reduced-motion settings and test on mid-range phones before launch.' },
  },
  {
    hu: { question: 'Mit kapnak a fejlesztőink?', answer: 'Design tokeneket a betűkhöz, színekhez és térközökhöz, egy Figma-könyvtárat minden elem minden állapotával, és mozgásleírást időzítési és gyorsulási értékekkel.' },
    en: { question: 'What do our developers receive?', answer: 'Design tokens for type, colour and spacing, a Figma library with every component state, and motion specs with timing and easing values.' },
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
