/**
 * Payment FAQs (2026-11): the old monthly-subscription answers become the new terms — 40% deposit, the rest on handover;
 * support plans are billed monthly. The two FAQs that argued for subscriptions are rewritten too. HU + EN where it exists.
 *
 *   npx payload run scripts/content/update-payment-faqs-2026.ts              # dry run
 *   npx payload run scripts/content/update-payment-faqs-2026.ts -- --apply   # write
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const apply = process.argv.includes('--apply')
const PREPAY_HU = { question: 'Fizetek előre, mielőtt bármi elkészül?', answer: 'Csak egy részét: a projekt indulásakor 40% előleget kérünk, a fennmaradó 60%-ot az átadáskor. A havi támogatást havonta fizeted, 30 napos felmondással.' }
const PREPAY_EN = { question: 'Do I pay before anything is built?', answer: 'Only part of it: we ask for a 40% deposit when the project starts and the remaining 60% on handover. Care plans are billed monthly, with thirty days notice.' }
const FAQS: Record<number, { hu: { question: string; answer: string }; en?: { question: string; answer: string } }> = {
  390: {
    hu: { question: 'Kell előleg?', answer: 'Igen, 40% előleggel indul a projekt; a fennmaradó 60%-ot az átadáskor fizeted. Az árat még a munka előtt, írásban rögzítjük.' },
    en: { question: 'Is there a deposit?', answer: 'Yes, the project starts with a 40% deposit; you pay the remaining 60% on handover. The price is fixed in writing before any work starts.' },
  },
  372: {
    hu: { question: 'Hogyan működik a fizetés?', answer: 'A 30 perces beszélgetés után fix, írásos árajánlatot kapsz. A projekt 40% előleggel indul, a fennmaradó 60% az átadáskor esedékes. Ha az indulás után támogatást is kérsz, azt havonta fizeted, 30 napos felmondással.' },
    en: { question: 'How does payment work?', answer: 'After the 30-minute call you get a fixed, written quote. The project starts with a 40% deposit and the remaining 60% is due on handover. If you also want care after launch, it is billed monthly, with thirty days notice.' },
  },
  393: {
    hu: { question: 'Van szerződés?', answer: 'Igen, minden projekthez és támogatási csomaghoz írásos szerződés jár — biztonság mindkét félnek. A projekt 40% előleggel indul, a fennmaradó 60% az átadáskor esedékes.' },
    en: { question: 'Is there a contract?', answer: 'Yes, every project and care plan comes with a written contract — security for both parties. The project starts with a 40% deposit and the remaining 60% is due on handover.' },
  },
  455: { hu: PREPAY_HU, en: PREPAY_EN },
  457: { hu: PREPAY_HU, en: PREPAY_EN },
  426: {
    hu: { question: 'Miért fix áron dolgoztok, és nem óradíjban?', answer: 'Mert így már a munka előtt pontosan tudod, mennyibe kerül a weboldalad. A 30 perces beszélgetés után írásban rögzítjük a feladatokat, az ütemezést és az árat — menet közben nincs meglepetés.' },
    en: { question: 'Why do you work at a fixed price, not by the hour?', answer: 'So you know exactly what your website costs before any work starts. After the 30-minute call we put the scope, the timeline and the price in writing — no surprises along the way.' },
  },
  428: {
    hu: { question: 'Mennyi idő alatt térül meg egy weboldal?', answer: 'Attól függ, mennyi új megkeresést hoz. Egy jól megtervezett, gyors és kereshető oldal már néhány új ügyféllel visszahozza az árát — ezért a tervezésnél abból indulunk ki, mi hoz neked megkeresést.' },
    en: { question: 'How long does a website take to pay for itself?', answer: 'It depends on how many new enquiries it brings. A well-designed, fast and findable site often pays for itself with a handful of new customers — which is why we plan around what brings you enquiries.' },
  },
}

const payload = await getPayload({ config })
for (const [idStr, f] of Object.entries(FAQS)) {
  for (const locale of ['hu', 'en'] as const) {
    const data = f[locale]
    if (!data) continue
    console.log(`#${idStr} ${locale}: ${data.question}`)
    if (!apply) continue
    await payload.update({ collection: 'faqs', id: Number(idStr), locale, data: data as any })
    console.log(`✓ #${idStr} ${locale}`)
  }
}
process.exit(0)
