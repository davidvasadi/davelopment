/**
 * New service page "Weboldal újratervezés" / "Website redesign" (2026-11 redesign, Valden reference translated).
 * Creates: 4 FAQ docs (HU + EN), the page (HU slug weboldal-ujratervezes, EN slug website-redesign) with SEO meta and
 * the CMS blocks the new service-page layout uses (products · faq · google-review-story · newsletter — copied from the
 * Weboldal készítés page #234, FAQ replaced), and appends it to the "service" global's page list.
 * The hero / "Mit tartalmaz" / timeline / end blocks are in the frontend (lib/services/service-details.ts).
 * Idempotent: if a page with the HU slug exists, nothing is created.
 *
 *   npx payload run scripts/content/create-redesign-page.ts              # dry run
 *   npx payload run scripts/content/create-redesign-page.ts -- --apply   # write
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const apply = process.argv.includes('--apply')
const SOURCE_PAGE = 234
const SLUG = { hu: 'weboldal-ujratervezes', en: 'website-redesign' } as const

const FAQS = [
  {
    hu: { question: 'Elveszítjük a Google-helyezéseinket?', answer: 'Nem, ha az átirányításokat és a tartalmat rendesen kezeljük. Még a tervezés előtt minden URL-nek kijelöljük az új helyét, és az indulás után nyolc hétig figyeljük a helyezéseket. Az első két hétben egy kisebb visszaesés normális, és helyreáll.' },
    en: { question: 'Will we lose our Google rankings?', answer: 'Not if the redirects and content are handled properly. We map every URL before design starts and watch rankings for eight weeks after launch. Small dips in the first fortnight are normal and recover.' },
  },
  {
    hu: { question: 'Megtarthatjuk a mostani arculatunkat?', answer: 'Igen. Sok újratervezésnél marad a logó és a színek, és körülöttük változik minden más. Ha az arculat is frissítésre szorul, egy projektben mindkettőt megcsináljuk.' },
    en: { question: 'Can you keep our current brand?', answer: 'Yes. Many redesigns keep the logo and colours and change everything around them. If the brand needs work too, we can do both in the same project.' },
  },
  {
    hu: { question: 'Muszáj platformot váltanunk?', answer: 'Csak ha a mostani visszatart. Gyakran költöztetünk oldalakat régi WordPress-témákról modern alapokra (Next.js, Payload vagy Framer), de a meglévő platformodon is újraépíthetjük.' },
    en: { question: 'Do we have to move platform?', answer: 'Only if the current one is holding you back. We often move sites from older WordPress themes to modern foundations (Next.js, Payload or Framer), but we can rebuild on the platform you have.' },
  },
  {
    hu: { question: 'Mi lesz a blogbejegyzéseinkkel?', answer: 'Átkerülnek a képeikkel, szerzőikkel, dátumaikkal és URL-jeikkel együtt. Azokat a bejegyzéseket, amelyek már nem hoznak forgalmat, összevonhatjuk vagy kivezethetjük, átirányítással.' },
    en: { question: 'What happens to our blog posts?', answer: 'They come across with their images, authors, dates and URLs. Posts that no longer earn traffic can be merged or retired, with redirects.' },
  },
]

const PAGE = {
  hu: {
    label: 'Weboldal újratervezés',
    card_short_description: 'Új alapokra helyezzük az oldalt, ami már nem illik a vállalkozásodhoz — úgy, hogy a Google-helyezéseid megmaradjanak.',
    seo: {
      metaTitle: 'Weboldal újratervezés | [davelopment]®',
      metaDescription: 'Új weboldal a régi helyett úgy, hogy a Google-helyezéseid megmaradjanak: átvilágítás, URL-térkép, tesztelt átirányítások és helyezésfigyelés. Fix ár egy 30 perces beszélgetés után.',
    },
    faqHeading: 'Gyakori kérdések az újratervezésről',
    storyCaption: 'Weboldal újratervezés, a régi oldal értékeinek megtartásával',
  },
  en: {
    label: 'Website redesign',
    card_short_description: 'A rebuild for the site that no longer matches the business, without losing the rankings it has earned.',
    seo: {
      metaTitle: 'Website Redesign | [davelopment]®',
      metaDescription: 'A new website in place of the old one, keeping your Google rankings: audit, URL map, tested redirects and ranking watch. A fixed price after a 30-minute call.',
    },
    faqHeading: 'Redesign questions',
    storyCaption: 'Website redesign, keeping what the old site earned',
  },
} as const

// id-k nélküli mély másolat (az új dokumentum saját block-/sor-id-t kap)
const stripIds = (v: any): any =>
  Array.isArray(v) ? v.map(stripIds) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).filter(([k]) => k !== 'id').map(([k, x]) => [k, stripIds(x)])) : v

const payload = await getPayload({ config })

const existing = await payload.find({ collection: 'pages', where: { slug: { equals: SLUG.hu } }, locale: 'hu', limit: 1, depth: 0 })
if (existing.docs[0]) {
  console.log(`– már létezik: #${existing.docs[0].id} (${SLUG.hu})`)
  process.exit(0)
}

const zoneFor = async (locale: 'hu' | 'en', faqIds: (number | string)[]) => {
  const src: any = await payload.findByID({ collection: 'pages', id: SOURCE_PAGE, locale, fallbackLocale: false as any, depth: 0 })
  const pick = (t: string) => (src.dynamic_zone ?? []).find((b: any) => b.blockType === t)
  const zone: any[] = []
  const products = pick('products')
  if (products) zone.push(stripIds(products))
  const faq = pick('faq')
  zone.push({ ...(faq ? stripIds(faq) : { blockType: 'faq' }), heading: PAGE[locale].faqHeading, faqs: faqIds })
  const story = pick('google-review-story')
  if (story) zone.push({ ...stripIds(story), card2_caption: PAGE[locale].storyCaption })
  const news = pick('newsletter')
  if (news) zone.push({ ...stripIds(news), source: SLUG[locale] })
  return zone
}

console.log(`új oldal: ${PAGE.hu.label} → /hu/szolgaltatasok/${SLUG.hu} · /en/services/${SLUG.en}`)
FAQS.forEach((f) => console.log(`  GYIK: ${f.hu.question}`))
if (!apply) process.exit(0)

const faqIds: (number | string)[] = []
for (const f of FAQS) {
  // ha egy korábbi (félbeszakadt) futás már létrehozta, azt használjuk
  const prev = await payload.find({ collection: 'faqs', where: { question: { equals: f.hu.question } }, locale: 'hu', limit: 1, depth: 0 })
  if (prev.docs[0]) { faqIds.push(prev.docs[0].id); continue }
  const doc: any = await payload.create({ collection: 'faqs', locale: 'hu', data: f.hu as any })
  await payload.update({ collection: 'faqs', id: doc.id, locale: 'en', data: f.en as any })
  faqIds.push(doc.id)
}
console.log(`✓ GYIK: ${faqIds.join(', ')}`)

const page: any = await payload.create({
  collection: 'pages',
  locale: 'hu',
  depth: 0,
  data: {
    label: PAGE.hu.label,
    slug: SLUG.hu,
    card_short_description: PAGE.hu.card_short_description,
    seo: PAGE.hu.seo,
    dynamic_zone: await zoneFor('hu', faqIds),
    _status: 'published',
  } as any,
})
await payload.update({
  collection: 'pages',
  id: page.id,
  locale: 'en',
  depth: 0,
  data: {
    label: PAGE.en.label,
    slug: SLUG.en,
    card_short_description: PAGE.en.card_short_description,
    seo: PAGE.en.seo,
    dynamic_zone: await zoneFor('en', faqIds),
    _status: 'published',
  } as any,
})
console.log(`✓ oldal: #${page.id}`)

// a „service” global oldallistájába, a Weboldal készítés után
const svc: any = await payload.findGlobal({ slug: 'service', depth: 0 })
const ids: any[] = (svc.pages ?? []).map((p: any) => (typeof p === 'object' ? p.id : p))
if (!ids.includes(page.id)) {
  const at = ids.indexOf(SOURCE_PAGE)
  ids.splice(at === -1 ? ids.length : at + 1, 0, page.id)
  await payload.updateGlobal({ slug: 'service', depth: 0, data: { pages: ids } as any })
  console.log(`✓ szolgáltatáslista: ${ids.join(', ')}`)
}
process.exit(0)
