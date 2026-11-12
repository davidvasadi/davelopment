/**
 * FAQs that still described the old monthly packages (Mikró/Rajt/Növekedés, 19 900 Ft/hó) — rewritten for the
 * 2026-11 offer (one-time project prices + monthly support). HU + EN. Payment-term FAQs are NOT touched here.
 *
 *   npx payload run scripts/content/update-price-faqs-2026.ts              # dry run
 *   npx payload run scripts/content/update-price-faqs-2026.ts -- --apply   # write
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const apply = process.argv.includes('--apply')
const FAQS: Record<number, { hu: { question: string; answer: string }; en: { question: string; answer: string } }> = {
  410: {
    hu: { question: 'Lehet bővíteni később a csomagot?', answer: 'Igen. Ha Üzleti weboldallal indulsz, és később marketing, blog vagy egyedi funkció kell, ugyanarra az oldalra építünk tovább — nem kell elölről újraépíteni. A bővítést külön, fix áron ajánljuk.' },
    en: { question: 'Can I extend the package later?', answer: 'Yes. If you start with a Business website and later need marketing, a blog or a custom feature, we build on the same site — no need to start over. Extensions are quoted separately, at a fixed price.' },
  },
  427: {
    hu: { question: 'Melyik csomagot válasszam?', answer: 'Ha most indulsz vagy elavult az oldalad, az Üzleti weboldal (190 000 Ft-tól) elég. Ha már az első hónapokban forgalom és megkeresés kell, a Weboldal + marketing (330 000 Ft-tól). Ha egyedi rendszer kell — foglalás, ügyfélportál, integrációk —, az Egyedi fejlesztés (550 000 Ft-tól). Az első, 30 perces beszélgetésen segítünk dönteni.' },
    en: { question: 'Which package should I choose?', answer: 'If you are just starting out or your site is outdated, the Business website (from 190,000 HUF) is enough. If you need traffic and enquiries in the first months, Website + marketing (from 330,000 HUF). If you need a custom system — booking, client portal, integrations — Custom build (from 550,000 HUF). We help you decide on the first 30-minute call.' },
  },
  444: {
    hu: { question: 'Mennyibe kerül egy weboldal Budapesten?', answer: 'Az áraink helyszíntől függetlenek: egy egyedi tervezésű üzleti weboldal 190 000 Ft-tól készül, és a 30 perces beszélgetés után fix árajánlatot kapsz. Részletek az Árak oldalon.' },
    en: { question: 'How much does a website cost in Budapest?', answer: 'Our pricing is the same wherever you are: a custom-designed business website starts from 190,000 HUF, and you get a fixed quote after the 30-minute call. Details on the Pricing page.' },
  },
  447: {
    hu: { question: 'Mennyibe kerül egy weboldal Debrecenben?', answer: 'Az áraink helyszíntől függetlenek: egy egyedi tervezésű üzleti weboldal 190 000 Ft-tól készül, és a 30 perces beszélgetés után fix árajánlatot kapsz. Részletek az Árak oldalon.' },
    en: { question: 'How much does a website cost in Debrecen?', answer: 'Our pricing is the same wherever you are: a custom-designed business website starts from 190,000 HUF, and you get a fixed quote after the 30-minute call. Details on the Pricing page.' },
  },
}

const payload = await getPayload({ config })
for (const [idStr, f] of Object.entries(FAQS)) {
  for (const locale of ['hu', 'en'] as const) {
    console.log(`#${idStr} ${locale}: ${f[locale].question}`)
    if (!apply) continue
    await payload.update({ collection: 'faqs', id: Number(idStr), locale, data: f[locale] as any })
    console.log(`✓ #${idStr} ${locale}`)
  }
}
process.exit(0)
