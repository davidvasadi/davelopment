/**
 * Homepage (#220): the hero card button ("Vágjunk bele" / "Let's talk") pointed to #form-section, but the contact form
 * is no longer on the homepage (2026-11 redesign) — it now goes to the contact page. HU + EN.
 *
 *   npx payload run scripts/content/fix-home-hero-cta.ts              # dry run
 *   npx payload run scripts/content/fix-home-hero-cta.ts -- --apply   # write
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const apply = process.argv.includes('--apply')
const PAGE_ID = 220
const payload = await getPayload({ config })
for (const locale of ['hu', 'en'] as const) {
  const page: any = await payload.findByID({ collection: 'pages', id: PAGE_ID, locale, fallbackLocale: false as any, depth: 0 })
  const target = locale === 'hu' ? '/kapcsolat' : '/contact'
  const zone = (page.dynamic_zone ?? []).map((b: any) =>
    b.blockType === 'hero' ? { ...b, CTAs: (b.CTAs ?? []).map((c: any) => (c?.URL === '#form-section' ? { ...c, URL: target } : c)) } : b,
  )
  console.log(`${locale}: #form-section → ${target}`)
  if (!apply) continue
  await payload.update({ collection: 'pages', id: PAGE_ID, locale, depth: 0, data: { dynamic_zone: zone, _status: 'published' } as any })
  console.log(`✓ ${locale}`)
}
process.exit(0)
