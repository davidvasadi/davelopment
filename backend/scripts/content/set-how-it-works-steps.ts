/**
 * "Hogyan dolgozunk" (how-it-works block, page #220): new step titles and texts for the bento redesign (HU + EN).
 * Also the block heading and the short text next to it. Images and order stay.
 *
 *   npx payload run scripts/content/set-how-it-works-steps.ts              # dry run
 *   npx payload run scripts/content/set-how-it-works-steps.ts -- --apply   # write
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const apply = process.argv.includes('--apply')
const PAGE_ID = 220

const STEPS = {
  hu: [
    { title: 'Felfedezés', description: 'Beszélgetés veled, egy pillantás a számokra és a versenytársakra, majd egy közérthető, írásos terv, amit mindketten jóváhagyunk.' },
    { title: 'Tervezés', description: 'Előbb a vizuális irány, aztán minden oldal és állapot: Figmában tervezzük, és a böngészőben, élő prototípusként nézzük át veled.' },
    { title: 'Fejlesztés', description: 'Arra a rendszerre építjük, ami hozzád illik: könnyen kezelhető tartalomkezelővel, optimalizált képekkel és alapos teszteléssel.' },
    { title: 'Indulás és növekedés', description: 'Átirányítások, mérés és egy nyugodt indulónap. Utána karbantartás, rendszeres beszámoló és folyamatos fejlesztés.' },
  ],
  en: [
    { title: 'Discover', description: 'A conversation with you, a look at the numbers and the competition, and a plain written brief we both sign off.' },
    { title: 'Design', description: 'Art direction first, then every page and state, designed in Figma and reviewed in the browser as a live prototype.' },
    { title: 'Build', description: 'Built on the platform that suits you, with an easy content manager, optimised images and thorough testing behind it.' },
    { title: 'Launch & grow', description: 'Redirects, tracking and a calm launch day. After that, care plans, reporting and steady improvements.' },
  ],
} as const

const HEAD = {
  hu: { heading: 'Négy hét, az ötlettől az indulásig', sub_heading: 'Bemutatkozó weboldal. A nagyobb projekteket az első héten mérjük fel.' },
  en: { heading: 'Four weeks, start to launch', sub_heading: 'A typical business site. Stores and custom builds are scoped in the first week.' },
} as const

const payload = await getPayload({ config })

for (const locale of ['hu', 'en'] as const) {
  const page: any = await payload.findByID({ collection: 'pages', id: PAGE_ID, locale, fallbackLocale: false as any, depth: 0 })
  const zone = page.dynamic_zone ?? []
  const block = zone.find((b: any) => b.blockType === 'how-it-works')
  if (!block) { console.log(`✗ ${locale}: nincs how-it-works blokk`); continue }
  const steps = (block.steps ?? []).map((s: any, i: number) => (STEPS[locale][i] ? { ...s, ...STEPS[locale][i] } : s))
  steps.forEach((s: any, i: number) => console.log(`${locale} ${i + 1}: ${block.steps[i]?.title} → ${s.title}`))
  if (!apply) continue
  console.log(`${locale} cím: ${block.heading} → ${HEAD[locale].heading}`)
  const next = zone.map((b: any) => (b === block ? { ...b, ...HEAD[locale], steps } : b))
  await payload.update({ collection: 'pages', id: PAGE_ID, locale, depth: 0, data: { dynamic_zone: next, _status: 'published' } as any })
  console.log(`✓ ${locale}: kész`)
}
process.exit(0)
