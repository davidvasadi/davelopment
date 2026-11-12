/**
 * EN service pages without a newsletter block (#224 Marketing & SEO, #216 Brand): append a copy of the EN newsletter
 * block of the Website page (#234), with the page's own source tag. Idempotent (skips pages that already have one).
 *
 *   npx payload run scripts/content/add-en-newsletter.ts              # dry run
 *   npx payload run scripts/content/add-en-newsletter.ts -- --apply   # write
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const apply = process.argv.includes('--apply')
const SOURCE = 234
const TARGETS = [224, 216]
const stripIds = (v: any): any =>
  Array.isArray(v) ? v.map(stripIds) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).filter(([k]) => k !== 'id').map(([k, x]) => [k, stripIds(x)])) : v

const payload = await getPayload({ config })
const src: any = await payload.findByID({ collection: 'pages', id: SOURCE, locale: 'en', fallbackLocale: false as any, depth: 0 })
const block = (src.dynamic_zone ?? []).find((b: any) => b.blockType === 'newsletter')
if (!block) throw new Error('nincs angol hírlevél-blokk a forrásoldalon')
for (const id of TARGETS) {
  const page: any = await payload.findByID({ collection: 'pages', id, locale: 'en', fallbackLocale: false as any, depth: 0 })
  const zone = page.dynamic_zone ?? []
  if (zone.some((b: any) => b.blockType === 'newsletter')) { console.log(`– #${id}: már van`); continue }
  console.log(`#${id} (${page.slug}): hírlevél hozzáadva`)
  if (!apply) continue
  await payload.update({ collection: 'pages', id, locale: 'en', depth: 0, data: { dynamic_zone: [...zone, { ...stripIds(block), source: page.slug }], _status: 'published' } as any })
  console.log(`✓ #${id}`)
}
process.exit(0)
