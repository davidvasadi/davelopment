/**
 * Marketing & SEO merge (2026-11 redesign): the SEO & tartalommarketing page (#224) becomes the one "Marketing & SEO"
 * page (Google Ads + SEO + content). Its FAQ block gets the Hirdetéskezelés page's (#235) questions too (no duplicates),
 * label + SEO meta are updated (HU + EN), and #235 is removed from the "service" global's page list.
 * #235 itself stays in the CMS; its URLs 301-redirect to #224 (frontend next.config.js).
 *
 *   npx payload run scripts/content/merge-marketing-pages.ts              # dry run
 *   npx payload run scripts/content/merge-marketing-pages.ts -- --apply   # write
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const apply = process.argv.includes('--apply')
const TARGET = 224
const ADS = 235
const META = {
  hu: {
    label: 'Marketing & SEO',
    heading: 'Gyakori kérdések a marketingről és a SEO-ról',
    seo: {
      metaTitle: 'Marketing & SEO: Google Ads és SEO | [davelopment]®',
      metaDescription: 'Keresőoptimalizálás, tartalommarketing és Google Ads egy kézből: kulcsszókutatás, SEO-cikkek, konverziókövetés és havi riport.',
    },
  },
  en: {
    label: 'Marketing & SEO',
    heading: 'Marketing and SEO questions',
    seo: {
      metaTitle: 'Marketing & SEO: Google Ads and SEO | [davelopment]®',
      metaDescription: 'SEO, content marketing and Google Ads in one place: keyword research, SEO articles, conversion tracking and a monthly report.',
    },
  },
} as const

const idOf = (x: any) => (x && typeof x === 'object' ? x.id : x)
const payload = await getPayload({ config })

for (const locale of ['hu', 'en'] as const) {
  const page: any = await payload.findByID({ collection: 'pages', id: TARGET, locale, fallbackLocale: false as any, depth: 0 })
  const ads: any = await payload.findByID({ collection: 'pages', id: ADS, locale, fallbackLocale: false as any, depth: 0 }).catch(() => null)
  const adsFaq = (ads?.dynamic_zone ?? []).find((b: any) => b.blockType === 'faq')
  const adsIds: any[] = (adsFaq?.faqs ?? []).map(idOf)
  const zone = (page.dynamic_zone ?? []).map((b: any) => {
    if (b.blockType !== 'faq') return b
    const own: any[] = (b.faqs ?? []).map(idOf)
    const merged = [...own, ...adsIds.filter((x) => !own.includes(x))]
    console.log(`${locale}: GYIK ${own.length} + ${merged.length - own.length} a hirdetéskezelésből`)
    return { ...b, heading: META[locale].heading, faqs: merged }
  })
  console.log(`${locale}: ${page.label} → ${META[locale].label} · ${META[locale].seo.metaTitle}`)
  if (!apply) continue
  await payload.update({
    collection: 'pages',
    id: TARGET,
    locale,
    depth: 0,
    data: { label: META[locale].label, seo: { ...(page.seo ?? {}), ...META[locale].seo }, dynamic_zone: zone, _status: 'published' } as any,
  })
  console.log(`✓ ${locale}`)
}

const svc: any = await payload.findGlobal({ slug: 'service', depth: 0 })
const ids: any[] = (svc.pages ?? []).map(idOf)
if (ids.includes(ADS)) {
  console.log(`szolgáltatáslista: ${ids.join(', ')} → ${ids.filter((x) => x !== ADS).join(', ')}`)
  if (apply) {
    await payload.updateGlobal({ slug: 'service', depth: 0, data: { pages: ids.filter((x) => x !== ADS) } as any })
    console.log('✓ szolgáltatáslista')
  }
}
process.exit(0)
