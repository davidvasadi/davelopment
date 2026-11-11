/**
 * Adds 3 new FAQs (hu + en) to the services hub (`service` global, `cta` zone → faq block),
 * after the existing ones. Idempotent: a question that already exists (hu text) is skipped.
 *
 *   npx payload run scripts/content/add-services-faqs.ts              # dry run
 *   npx payload run scripts/content/add-services-faqs.ts -- --apply   # write
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const apply = process.argv.includes('--apply')

const FAQS = [
  {
    hu: {
      question: 'Ki írja a szövegeket és ki készíti a képeket?',
      answer:
        'Mi. A weboldal szövegeit mi írjuk meg, és a képeket is mi készítjük el — neked nem kell szövegírót vagy fotóst keresned. Az első beszélgetésen elmondod, mivel foglalkozol, a többit mi állítjuk össze, te pedig csak átnézed.',
    },
    en: {
      question: 'Who writes the texts and creates the images?',
      answer:
        "We do. We write the copy for your website and create the images too — you don't need to find a copywriter or a photographer. In the first conversation you tell us what you do; we put everything together and you just review it.",
    },
  },
  {
    hu: {
      question: 'Kié lesz a weboldal és a domain?',
      answer:
        'A domain a te neveden van, és a tiéd. Hogy az előfizetés lemondása után mi történik a weboldallal, azt az együttműködés elején közösen megbeszéljük és rögzítjük, így később nincs meglepetés.',
    },
    en: {
      question: 'Who owns the website and the domain?',
      answer:
        'The domain is registered in your name and it is yours. What happens to the website if you cancel the subscription is something we agree on together at the start of our work, so there are no surprises later.',
    },
  },
  {
    hu: {
      question: 'Mennyi munkám lesz vele?',
      answer:
        'Nagyon kevés. Egy beszélgetés során felmérjük, mire van szükséged — utána mindent mi intézünk: szöveget, képeket, tervezést, fejlesztést, domaint és beállításokat. Neked csak át kell nézned és jóvá kell hagynod az elkészült anyagokat.',
    },
    en: {
      question: 'How much work will it be for me?',
      answer:
        'Very little. In one conversation we find out what you need — after that we handle everything: copy, images, design, development, domain and setup. You only need to review and approve what we have prepared.',
    },
  },
]

const payload = await getPayload({ config })

const readSvc = (locale: 'hu' | 'en') =>
  payload.findGlobal({ slug: 'service' as any, locale, fallbackLocale: false as any, depth: 0 }) as Promise<any>

// 1) create (or find) the FAQ docs
const ids: (number | string)[] = []
for (const f of FAQS) {
  const existing = await payload.find({
    collection: 'faqs' as any, locale: 'hu', depth: 0, limit: 1,
    where: { question: { equals: f.hu.question } },
  })
  if (existing.docs[0]) {
    console.log(`– megvan: ${f.hu.question} (#${existing.docs[0].id})`)
    ids.push(existing.docs[0].id)
    continue
  }
  if (!apply) {
    console.log(`○ új kérdés lenne: ${f.hu.question}`)
    continue
  }
  const doc: any = await payload.create({ collection: 'faqs' as any, locale: 'hu', data: f.hu as any })
  await payload.update({ collection: 'faqs' as any, id: doc.id, locale: 'en', data: f.en as any })
  console.log(`✓ létrehozva: ${f.hu.question} (#${doc.id})`)
  ids.push(doc.id)
}

// 2) append them to the faq block of the services hub, per locale (the cta zone is localized)
for (const locale of ['hu', 'en'] as const) {
  const svc = await readSvc(locale)
  const cta = svc.cta ?? []
  const faqBlock = cta.find((b: any) => b.blockType === 'faq')
  if (!faqBlock) {
    console.log(`✗ ${locale}: nincs GYIK blokk a cta zónában`)
    continue
  }
  const current: (number | string)[] = (faqBlock.faqs ?? []).map((x: any) => (typeof x === 'object' ? x.id : x))
  const toAdd = ids.filter((id) => !current.includes(id))
  console.log(`${locale}: jelenleg ${current.length} kérdés, +${toAdd.length}`)
  if (!apply || toAdd.length === 0) continue
  const nextCta = cta.map((b: any) => (b === faqBlock ? { ...b, faqs: [...current, ...toAdd] } : b))
  await payload.updateGlobal({
    slug: 'service' as any, locale, depth: 0,
    data: { cta: nextCta, _status: 'published' } as any,
  })
  const after = await readSvc(locale)
  const n = (after.cta ?? []).find((b: any) => b.blockType === 'faq')?.faqs?.length
  console.log(`✓ ${locale}: most ${n} kérdés`)
}

process.exit(0)
