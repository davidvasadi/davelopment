/**
 * SEO meta fixes found by the 2026-11-11 live audit: the projects page titles (HU/EN) and the English blog title were
 * too short (<30 characters), and the Hungarian privacy page description was 19 characters.
 *
 *   npx payload run scripts/content/set-seo-meta.ts              # dry run
 *   npx payload run scripts/content/set-seo-meta.ts -- --apply   # write
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const apply = process.argv.includes('--apply')

type Target = { kind: 'global' | 'page'; slug?: string; id?: number; locale: 'hu' | 'en'; field: 'metaTitle' | 'metaDescription'; value: string }
const TARGETS: Target[] = [
  // product-page: NOT here yet — prod has two rows for this global (pp id 1 and 2; the site reads 2, the admin wrote 1),
  // so an update fails with "id invalid". Fix the duplicate row first (needs a decision which row stays).
  { kind: 'global', slug: 'blog-page', locale: 'en', field: 'metaTitle', value: 'Blog: Web Design, SEO & Digital Growth — [davelopment]®' },
  {
    kind: 'page', id: 230, locale: 'hu', field: 'metaDescription',
    value: 'Milyen adatokat kezel a davelopment.hu, milyen sütiket használunk (Google Analytics, Microsoft Clarity, Google Ads), és milyen jogaid vannak.',
  },
]

const payload = await getPayload({ config })

for (const t of TARGETS) {
  const doc: any = t.kind === 'global'
    ? await payload.findGlobal({ slug: t.slug as any, locale: t.locale, fallbackLocale: false as any, depth: 0 })
    : await payload.findByID({ collection: 'pages', id: t.id!, locale: t.locale, fallbackLocale: false as any, depth: 0 })
  const before = doc.seo?.[t.field] ?? ''
  console.log(`${t.kind === 'global' ? t.slug : 'page #' + t.id} ${t.locale} ${t.field}: ${before.length} → ${t.value.length} karakter\n   «${before}»\n → «${t.value}»`)
  if (t.field === 'metaTitle' && t.value.length > 60) throw new Error('title > 60')
  if (t.field === 'metaDescription' && t.value.length > 160) throw new Error('description > 160')
  if (!apply || before === t.value) continue
  const data = { seo: { ...(doc.seo ?? {}), [t.field]: t.value }, _status: 'published' } as any
  if (t.kind === 'global') await payload.updateGlobal({ slug: t.slug as any, locale: t.locale, depth: 0, data })
  else await payload.update({ collection: 'pages', id: t.id!, locale: t.locale, depth: 0, data })
  console.log('   ✓ mentve')
}
process.exit(0)
