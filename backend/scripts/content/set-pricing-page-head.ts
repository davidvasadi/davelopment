/**
 * Árak page (#228), 2026-11 redesign: hero title "Árak, nyíltan" (like the homepage pricing block), a sub-line for the
 * new fixed-price offer, and the pricing block heading becomes "Csomagok" (so the page has no two "Árak" titles).
 * The hero's "Írj most" button points to the contact page (the page has no form any more). The EN pricing block gets
 * the same plans as the HU one (its plan relations were missing, so the EN page showed an empty card). HU + EN.
 *
 *   npx payload run scripts/content/set-pricing-page-head.ts              # dry run
 *   npx payload run scripts/content/set-pricing-page-head.ts -- --apply   # write
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const apply = process.argv.includes('--apply')
const PAGE_ID = 228
const TEXT = {
  hu: {
    hero: { heading: 'Árak, nyíltan', sub_heading: 'Fix ár, még a munka előtt. Minden projekt egy 30 perces beszélgetés után írásos árajánlatot kap.', badge_label: 'Árak' },
    pricing: { heading: 'Csomagok', badge_label: 'Csomagok' },
  },
  en: {
    hero: { heading: 'Pricing, in the open', sub_heading: 'A fixed price before we start. Every project gets a written quote after a 30-minute call.', badge_label: 'Pricing' },
    pricing: { heading: 'Packages', badge_label: 'Packages' },
  },
} as const

const payload = await getPayload({ config })
const huPage: any = await payload.findByID({ collection: 'pages', id: PAGE_ID, locale: 'hu', fallbackLocale: false as any, depth: 0 })
const huPlans: any[] = ((huPage.dynamic_zone ?? []).find((b: any) => b.blockType === 'pricing')?.plans ?? []).map((p: any) => (typeof p === 'object' ? p.id : p))
for (const locale of ['hu', 'en'] as const) {
  const page: any = await payload.findByID({ collection: 'pages', id: PAGE_ID, locale, fallbackLocale: false as any, depth: 0 })
  const contact = locale === 'hu' ? '/kapcsolat' : '/contact'
  const zone = (page.dynamic_zone ?? []).map((b: any) =>
    b.blockType === 'hero'
      ? {
          ...b,
          ...TEXT[locale].hero,
          CTAs: (b.CTAs ?? []).map((c: any) => (c?.URL === '#form-section' ? { ...c, URL: contact } : c)),
        }
      : b.blockType === 'pricing'
        ? { ...b, ...TEXT[locale].pricing, plans: (b.plans?.length ? b.plans : huPlans).map((p: any) => (typeof p === 'object' ? p.id : p)) }
        : b,
  )
  console.log(`${locale}: hero → ${TEXT[locale].hero.heading} · árblokk → ${TEXT[locale].pricing.heading}`)
  if (!apply) continue
  await payload.update({ collection: 'pages', id: PAGE_ID, locale, depth: 0, data: { dynamic_zone: zone, _status: 'published' } as any })
  console.log(`✓ ${locale}`)
}
process.exit(0)
