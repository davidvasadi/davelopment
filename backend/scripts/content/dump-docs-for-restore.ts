/**
 * Dumps every page, article and product (HU + EN, depth 0) and the service / product-page / global globals to a JSON
 * file — run BEFORE a content run, so restore-rehydrated-2026-11.ts can put back what Payload re-hydration reverts.
 *
 *   npx payload run scripts/content/dump-docs-for-restore.ts -- <out.json>
 */
import fs from 'fs'
import { getPayload } from 'payload'
import config from '@payload-config'
const out = process.argv.find((a, i) => i > 1 && a.endsWith('.json'))!
const payload = await getPayload({ config })
const res: any = {}
const pages = await payload.find({ collection: 'pages', limit: 500, pagination: false, depth: 0, locale: 'hu' })
const arts = await payload.find({ collection: 'articles', limit: 500, pagination: false, depth: 0, locale: 'hu' })
const prods = await payload.find({ collection: 'products', limit: 500, pagination: false, depth: 0, locale: 'hu' })
for (const [col, docs] of [['pages', pages.docs], ['articles', arts.docs], ['products', prods.docs]] as const) {
  for (const d of docs as any[]) for (const locale of ['hu', 'en'] as const) {
    const x: any = await payload.findByID({ collection: col as any, id: d.id, locale, fallbackLocale: false as any, depth: 0 }).catch(() => null)
    if (x) { delete x.updatedAt; delete x.createdAt; res[`${col}:${d.id}:${locale}`] = x }
  }
}
for (const g of ['service', 'product-page', 'global']) for (const locale of ['hu', 'en'] as const) {
  const x: any = await payload.findGlobal({ slug: g as any, locale, fallbackLocale: false as any, depth: 0 }); delete x.updatedAt; res[`global:${g}:${locale}`] = x
}
fs.writeFileSync(out, JSON.stringify(res))
console.log('✓ dumped', Object.keys(res).length)
process.exit(0)
