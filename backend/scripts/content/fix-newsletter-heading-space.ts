/**
 * Newsletter block on every page: fix the missing space in the HU heading ("itt vagyunk,hogy" → "itt vagyunk, hogy").
 *
 *   npx payload run scripts/content/fix-newsletter-heading-space.ts              # dry run
 *   npx payload run scripts/content/fix-newsletter-heading-space.ts -- --apply   # write
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const apply = process.argv.includes('--apply')
const payload = await getPayload({ config })

const pages = await payload.find({ collection: 'pages', locale: 'hu', fallbackLocale: false as any, depth: 0, limit: 500, pagination: false })
for (const page of pages.docs as any[]) {
  const zone = page.dynamic_zone ?? []
  let changed = false
  const next = zone.map((b: any) => {
    if (b.blockType !== 'newsletter' || typeof b.heading_right !== 'string' || !/,(?=\S)/.test(b.heading_right)) return b
    changed = true
    return { ...b, heading_right: b.heading_right.replace(/,(?=\S)/g, ', ') }
  })
  if (!changed) continue
  console.log(`#${page.id} ${page.slug}: javítandó`)
  if (!apply) continue
  await payload.update({ collection: 'pages', id: page.id, locale: 'hu', depth: 0, data: { dynamic_zone: next, _status: 'published' } as any })
  console.log(`✓ #${page.id}`)
}
process.exit(0)
