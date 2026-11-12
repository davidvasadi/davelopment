/**
 * Articles: internal links to the merged service pages point straight to the new Marketing & SEO URL (2026-11), instead
 * of going through a 301 (Google prefers direct links). Replaces in every article's content and blocks (CTA URLs too,
 * also the locale-less /szolgaltatasok/… form), HU + EN:
 *   /hu/szolgaltatasok/hirdeteskezeles, /hu/szolgaltatasok/seo-tartalommarketing → /hu/szolgaltatasok/marketing-es-seo
 *   /en/services/ad-management, /en/services/seo-content-marketing → /en/services/marketing-and-seo
 * Also the retired UX/UI (→ Arculat & design) and Digitális rendszerek (→ Árak) pages.
 * Articles #46 and #57 have stale versions (rehydration risk) — skipped here, done with direct SQL (see the run notes).
 *
 *   npx payload run scripts/content/fix-article-service-links.ts              # dry run
 *   npx payload run scripts/content/fix-article-service-links.ts -- --apply   # write
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const apply = process.argv.includes('--apply')
const SKIP_IDS = new Set([46, 57])
const MAP: [RegExp, string][] = [
  [/(\/hu)?\/szolgaltatasok\/(hirdeteskezeles|seo-tartalommarketing)(?=["/#?])/g, '$1/szolgaltatasok/marketing-es-seo'],
  [/(\/en)?\/services\/(ad-management|seo-content-marketing)(?=["/#?])/g, '$1/services/marketing-and-seo'],
  // a megszűnt UX/UI és Digitális rendszerek oldal (2026-11) — 301-gyel ugyanide visz
  [/(\/hu)?\/szolgaltatasok\/ux-ui-design-fejlesztes(?=["/#?])/g, '$1/szolgaltatasok/branding-arculat'],
  [/(\/hu)?\/szolgaltatasok\/digitalis-rendszerek(?=["/#?])/g, '$1/arak'],
  [/(\/en)?\/services\/ux-ui-design-development(?=["/#?])/g, '$1/services/branding-identity'],
  [/(\/en)?\/services\/digital-systems(?=["/#?])/g, '$1/pricing'],
]
const fix = (v: any) => {
  let s = JSON.stringify(v ?? null)
  const before = s
  for (const [re, to] of MAP) s = s.replace(re, to)
  return s === before ? null : JSON.parse(s)
}

const payload = await getPayload({ config })
const all = await payload.find({ collection: 'articles', locale: 'hu', depth: 0, limit: 500, pagination: false })
for (const a of all.docs as any[]) {
  for (const locale of ['hu', 'en'] as const) {
    const doc: any = await payload.findByID({ collection: 'articles', id: a.id, locale, fallbackLocale: false as any, depth: 0 }).catch(() => null)
    if (!doc) continue
    const data: any = {}
    for (const field of ['content', 'dynamic_zone']) {
      const next = fix(doc[field])
      if (next) data[field] = next
    }
    if (!Object.keys(data).length) continue
    if (SKIP_IDS.has(a.id)) { console.log(`! #${a.id} ${locale}: kihagyva (SQL)`); continue }
    console.log(`#${a.id} ${locale}: ${doc.slug} — ${Object.keys(data).join(', ')}`)
    if (!apply) continue
    await payload.update({ collection: 'articles', id: a.id, locale, depth: 0, data: { ...data, _status: 'published' } as any })
    console.log(`✓ #${a.id} ${locale}`)
  }
}
process.exit(0)
