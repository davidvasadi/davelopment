/**
 * Plans (the Árak page's pricing block, #228): the old monthly packages become the new 2026-11 offer, same 4 plan docs
 * (so every relation keeps working): Mikró → Üzleti weboldal, Rajt → Weboldal + marketing, Növekedés → Egyedi fejlesztés,
 * Partner → Támogatás. One-time project prices ("-tól") + a monthly support plan ("/hó-tól"); no discount, no add-on.
 * Prices match the homepage pricing block (frontend components/dynamic-zone/pricing-simple.tsx). HU + EN.
 *
 *   npx payload run scripts/content/update-plans-2026.ts              # dry run
 *   npx payload run scripts/content/update-plans-2026.ts -- --apply   # write
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const apply = process.argv.includes('--apply')
const t = (arr: string[]) => arr.map((text) => ({ text }))

const PLANS: Record<number, { hu: any; en: any; common: any }> = {
  43: {
    common: { price: '190000', currency: 'HUF', featured: false },
    hu: {
      name: 'Üzleti weboldal',
      currency_project_label: '-tól',
      sub_text: 'Egyedi tervezésű weboldal, olyan tartalomkezelővel, amit te is könnyen kezelsz.',
      time_label: 'Átlagos átfutás',
      time_value: '1–4 hét',
      recommended_for: 'Most indulsz, vagy elavult a mostani oldalad — egy gyors, egyedi, megkeresést hozó weboldal kell, amit magad is tudsz frissíteni.',
      perks: t(['Egyedileg tervezett oldalak', 'Tartalomkezelő beállítása és betanítás', 'Animációk és interakciók', 'Technikai SEO és analitika', 'Mobilon, tableten és gépen is tökéletes', 'Domain, tárhely és indulás beállítása']),
    },
    en: {
      name: 'Business website',
      currency_project_label: 'from',
      sub_text: 'A custom-designed website, on a content manager you can run yourself.',
      time_label: 'Typical timeline',
      time_value: '1–4 weeks',
      recommended_for: 'You are just starting out, or your current site is outdated — you need a fast, custom website that brings enquiries and that you can update yourself.',
      perks: t(['Custom-designed pages', 'Content manager set-up and training', 'Motion and interaction', 'Technical SEO and analytics', 'Works perfectly on mobile, tablet and desktop', 'Domain, hosting and launch set-up']),
    },
  },
  41: {
    common: { price: '330000', currency: 'HUF', featured: true },
    hu: {
      name: 'Weboldal + marketing',
      currency_project_label: '-tól',
      sub_text: 'Weboldal, ami az indulástól ügyfeleket hoz, keresőoptimalizálással és hirdetésekkel.',
      time_label: 'Átlagos átfutás',
      time_value: '4–6 hét',
      recommended_for: 'Már az első hónapokban komolyabb forgalmat és megkeresést szeretnél — keresőoptimalizálással, tartalommal és Google-hirdetéssel a weboldalad mellé.',
      perks: t(['Minden, ami az Üzleti weboldalban', 'Kulcsszókutatás és tartalomstratégia', '4–5 induló blogcikk', 'Google Ads kampány beállítása', 'Konverziókövetés (GA4, Google Ads)', 'Helyi SEO és Google Cégprofil']),
    },
    en: {
      name: 'Website + marketing',
      currency_project_label: 'from',
      sub_text: 'A website that brings in customers from launch, with search optimisation and ads.',
      time_label: 'Typical timeline',
      time_value: '4–6 weeks',
      recommended_for: 'You want real traffic and enquiries in the first months — with SEO, content and Google Ads alongside your website.',
      perks: t(['Everything in Business website', 'Keyword research and content strategy', '4–5 launch blog articles', 'Google Ads campaign set-up', 'Conversion tracking (GA4, Google Ads)', 'Local SEO and Google Business Profile']),
    },
  },
  42: {
    common: { price: '550000', currency: 'HUF', featured: false },
    hu: {
      name: 'Egyedi fejlesztés',
      currency_project_label: '-tól',
      sub_text: 'Foglalórendszerek, ügyfélportálok és integrációk, a vállalkozásodra szabva.',
      time_label: 'Átfutás',
      time_value: 'Közösen felmérve',
      recommended_for: 'Túlnőttél az alapokon: olyan egyedi rendszer kell (pl. foglalás, ügyfélportál), ami a működésedhez igazodik.',
      perks: t(['Felmérés és technikai tervezés', 'Egyedi rendszer (pl. foglalás, ügyfélportál)', 'Integrációk és egyedi eszközök', 'Dedikált csapat az indulás után']),
    },
    en: {
      name: 'Custom build',
      currency_project_label: 'from',
      sub_text: 'Booking systems, client portals and integrations, built around your business.',
      time_label: 'Timeline',
      time_value: 'Scoped together',
      recommended_for: 'You have outgrown the basics: you need a custom system (e.g. booking, client portal) that fits how you work.',
      perks: t(['Discovery and technical scoping', 'A custom system (e.g. booking, client portal)', 'Integrations and custom tooling', 'A dedicated team after launch']),
    },
  },
  45: {
    common: { price: '29900', currency: 'HUF', featured: false },
    hu: {
      name: 'Támogatás',
      currency_project_label: '/hó-tól',
      sub_text: 'Frissítések, sebesség, tesztelés és közvetlen kapcsolat a fejlesztővel az indulás után is.',
      time_label: 'Szerződés',
      time_value: 'Havonta megújuló',
      recommended_for: 'Már van weboldalad — tőlünk vagy máshonnan —, és szeretnéd, hogy az indulás után is fejlődjön, fejlesztő felvétele nélkül.',
      perks: t(['Alap támogatás — 29 900 Ft/hó: frissítések, biztonság, elérhetőség-figyelés', 'Növekedés — 59 900 Ft/hó: nagyobb fejlesztések, havi riport, A/B tesztek', 'Beágyazott csapat — 149 900 Ft/hó: közvetlen kapcsolat a fejlesztővel, havi 4 SEO-cikk, elsőbbség', 'Folyamatos módosítások, órák számolgatása nélkül', 'Havonta megújuló, 30 napos felmondással']),
    },
    en: {
      name: 'Care plans',
      currency_project_label: '/month',
      sub_text: 'Updates, speed, testing and a direct line to your developer after launch.',
      time_label: 'Contract',
      time_value: 'Rolling monthly',
      recommended_for: 'You already have a website — from us or elsewhere — and want it to keep improving after launch without hiring a developer.',
      perks: t(['Essential care — 29,900 HUF/month: updates, security, uptime monitoring', 'Growth — 59,900 HUF/month: bigger changes, monthly report, A/B tests', 'Embedded — 149,900 HUF/month: a direct line to your developer, four SEO articles a month, priority', 'Ongoing changes, without counting hours', 'Rolling monthly, thirty days notice']),
    },
  },
}

const payload = await getPayload({ config })
for (const [idStr, p] of Object.entries(PLANS)) {
  const id = Number(idStr)
  for (const locale of ['hu', 'en'] as const) {
    const cur: any = await payload.findByID({ collection: 'plans', id, locale, fallbackLocale: false as any, depth: 0 })
    console.log(`#${id} ${locale}: ${cur.name} → ${p[locale].name} (${p.common.price} ${p[locale].currency_project_label})`)
    if (!apply) continue
    await payload.update({
      collection: 'plans',
      id,
      locale,
      depth: 0,
      data: { ...p.common, ...p[locale], additional_perks: [], addon_title: null, addon_description: null, addon_price: null } as any,
    })
    console.log(`✓ #${id} ${locale}`)
  }
}
process.exit(0)
