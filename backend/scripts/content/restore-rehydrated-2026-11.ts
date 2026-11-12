/**
 * After the 2026-11 redesign content run: put back what Payload's version re-hydration reverted or dropped
 * (see memory "payload-update-rehydrates-from-version"). Reads the pre-run state from a JSON dump of the same database
 * made BEFORE the content scripts (scripts/content/dump-docs-for-restore.ts → ref.json) and restores only these parts:
 *   - pages 216/218/224 EN: google-review-story, google-review-hero and newsletter blocks, service-hero
 *   - pages 235/236 EN: service-hero; page 228 EN: testimonials block
 *   - article 55 HU: categories; articles 59 HU/EN and 60 EN: the CTA block (with the new Marketing & SEO links)
 *
 *   npx payload run scripts/content/restore-rehydrated-2026-11.ts -- <ref.json>              # dry run
 *   npx payload run scripts/content/restore-rehydrated-2026-11.ts -- <ref.json> --apply      # write
 */
import fs from 'fs'
import { getPayload } from 'payload'
import config from '@payload-config'

const apply = process.argv.includes('--apply')
const refPath = process.argv.find((a, i) => i > 1 && a.endsWith('.json'))
if (!refPath) throw new Error('usage: … -- <ref.json> [--apply]')
const REF: Record<string, any> = JSON.parse(fs.readFileSync(refPath, 'utf8'))

const stripIds = (v: any): any =>
  Array.isArray(v) ? v.map(stripIds) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).filter(([k]) => k !== 'id').map(([k, x]) => [k, stripIds(x)])) : v
const relIds = (v: any): any =>
  Array.isArray(v) ? v.map(relIds) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, relIds(x)])) : v
const fixLinks = (v: any) =>
  JSON.parse(
    JSON.stringify(v)
      .replace(/(\/hu)?\/szolgaltatasok\/(hirdeteskezeles|seo-tartalommarketing)(?=["/#?])/g, '$1/szolgaltatasok/marketing-es-seo')
      .replace(/(\/en)?\/services\/(ad-management|seo-content-marketing)(?=["/#?])/g, '$1/services/marketing-and-seo')
      .replace(/(\/hu)?\/szolgaltatasok\/ux-ui-design-fejlesztes(?=["/#?])/g, '$1/szolgaltatasok/branding-arculat')
      .replace(/(\/hu)?\/szolgaltatasok\/digitalis-rendszerek(?=["/#?])/g, '$1/arak')
      .replace(/(\/en)?\/services\/ux-ui-design-development(?=["/#?])/g, '$1/services/branding-identity')
      .replace(/(\/en)?\/services\/digital-systems(?=["/#?])/g, '$1/pricing'),
  )

// zóna újraépítése a ref sorrendjében: a felsorolt típusok a ref-ből, a többi a mostaniból; a mostaniban lévő új blokkok a végére
function rebuildZone(current: any[], ref: any[], restoreTypes: string[]) {
  const used = new Set<number>()
  const out: any[] = []
  const seen: Record<string, number> = {}
  for (const rb of ref) {
    const t = rb.blockType
    const n = (seen[t] = (seen[t] ?? 0) + 1)
    if (restoreTypes.includes(t)) { out.push(stripIds(rb)); const ci = nthIndex(current, t, n); if (ci !== -1) used.add(ci); continue }
    const ci = nthIndex(current, t, n)
    if (ci !== -1) { out.push(current[ci]); used.add(ci) }
  }
  current.forEach((b, i) => { if (!used.has(i)) out.push(b) })
  return out
}
function nthIndex(arr: any[], type: string, n: number) {
  let c = 0
  for (let i = 0; i < arr.length; i++) if (arr[i].blockType === type && ++c === n) return i
  return -1
}

const PAGES: Record<string, string[]> = {
  '216:en': ['service-hero', 'google-review-story', 'google-review-hero', 'newsletter'],
  '218:en': ['service-hero', 'google-review-story', 'google-review-hero', 'newsletter'],
  '224:en': ['service-hero', 'google-review-story', 'google-review-hero', 'newsletter'],
  '235:en': ['service-hero'],
  '236:en': ['service-hero'],
  '228:en': ['testimonials'],
}

const payload = await getPayload({ config })

for (const [key, types] of Object.entries(PAGES)) {
  const [id, locale] = key.split(':') as [string, 'hu' | 'en']
  const ref = REF[`pages:${id}:${locale}`]
  if (!ref) { console.log(`– pages ${key}: nincs a ref-ben`); continue }
  const cur: any = await payload.findByID({ collection: 'pages', id: Number(id), locale, fallbackLocale: false as any, depth: 0 })
  const zone = rebuildZone(cur.dynamic_zone ?? [], relIds(ref.dynamic_zone ?? []), types)
  console.log(`pages ${key}: ${(cur.dynamic_zone ?? []).map((b: any) => b.blockType).join(',')} → ${zone.map((b: any) => b.blockType).join(',')}`)
  if (!apply) continue
  await payload.update({ collection: 'pages', id: Number(id), locale, depth: 0, data: { dynamic_zone: zone, _status: 'published' } as any })
  console.log(`✓ pages ${key}`)
}

const ARTICLES: { id: number; locale: 'hu' | 'en'; field: 'categories' | 'dynamic_zone' }[] = [
  { id: 55, locale: 'hu', field: 'categories' },
  { id: 59, locale: 'hu', field: 'dynamic_zone' },
  { id: 59, locale: 'en', field: 'dynamic_zone' },
  { id: 60, locale: 'en', field: 'dynamic_zone' },
]
for (const a of ARTICLES) {
  const ref = REF[`articles:${a.id}:${a.locale}`]
  if (!ref) { console.log(`– article ${a.id} ${a.locale}: nincs a ref-ben`); continue }
  // a cikk-blokkok nem nyelvenként külön sorok, csak a mezőik — az eredeti blokk-id kell, különben a másik nyelv mezői elvesznek
  const value = a.field === 'categories' ? (ref.categories ?? []).map((c: any) => (typeof c === 'object' ? c.id : c)) : fixLinks(relIds(ref.dynamic_zone ?? []))
  console.log(`article ${a.id} ${a.locale}: ${a.field} visszaállítva (${Array.isArray(value) ? value.length : 0} elem)`)
  if (!apply) continue
  await payload.update({ collection: 'articles', id: a.id, locale: a.locale, depth: 0, data: { [a.field]: value, _status: 'published' } as any })
  console.log(`✓ article ${a.id} ${a.locale}`)
}
process.exit(0)
