/**
 * Angol változat hozzáadása meglévő (csak magyar) cikkekhez, a Payload Local
 * API-n keresztül — nem nyers SQL-lel, így a verziók, relációk és hookok
 * ugyanúgy jönnek létre, mintha az adminban mentenénk.
 *
 * A magyar lexical-tartalom szerkezetét (címsorok, formázás, linkek)
 * változatlanul átveszi, csak a szövegcsomópontokat cseréli a fordításra
 * (sorrend szerint), a belső linkeket pedig a `linkMap` alapján az angol
 * oldalakra írja át.
 *
 * Használat (backend mappából):
 *   npx payload run scripts/content/add-en-articles.ts              # dry run
 *   npx payload run scripts/content/add-en-articles.ts -- --apply   # írás
 */
import fs from 'node:fs'
import path from 'node:path'
import { getPayload } from 'payload'
import config from '@payload-config'

type Translation = {
  title: string
  slug: string
  description: string
  metaTitle: string
  keywords: string
  texts: string[]
  keyPoints: { heading: string; points: string[] }
  cta: { badge_label: string; heading: string; heading_highlight: string; sub_heading: string; text: string; URL: string }
}

// A dynamic_zone maga nem nyelvfüggő (a blokkok és pontok sorai közösek),
// csak a mezőik — ezért a magyar blokk- és pont-id-kat megtartjuk, és csak
// a szövegeket adjuk meg angolul. A CTAs tömb viszont nyelvenként külön sor.
function translateBlocks(blocks: any[], t: Translation, problems: string[]) {
  return (blocks ?? []).map((block) => {
    if (block.blockType === 'key_points') {
      if (block.points?.length !== t.keyPoints.points.length) {
        problems.push(`Dióhéjban pontszám eltér: hu=${block.points?.length}, en=${t.keyPoints.points.length}`)
      }
      return {
        ...block,
        heading: t.keyPoints.heading,
        points: (block.points ?? []).map((p: any, i: number) => ({ id: p.id, text: t.keyPoints.points[i] })),
      }
    }
    if (block.blockType === 'cta') {
      const { text, URL, ...fields } = t.cta
      const first = block.CTAs?.[0] ?? {}
      return {
        ...block,
        ...fields,
        CTAs: [{ text, URL, target: first.target ?? '_self', variant: first.variant ?? 'primary' }],
      }
    }
    problems.push(`ismeretlen blokk: ${block.blockType}`)
    return block
  })
}

const apply = process.argv.includes('--apply')
const source = JSON.parse(
  fs.readFileSync(path.resolve(process.cwd(), 'scripts/content/en-articles-61-66.json'), 'utf8'),
) as { linkMap: Record<string, string>; articles: Record<string, Translation> }

function translateContent(root: any, texts: string[], linkMap: Record<string, string>) {
  const clone = structuredClone(root)
  let i = 0
  const unmapped: string[] = []
  const walk = (node: any) => {
    if (node?.type === 'text' && typeof node.text === 'string') node.text = texts[i++]
    const url = node?.fields?.url
    if (typeof url === 'string' && url.startsWith('/hu')) {
      if (linkMap[url]) node.fields.url = linkMap[url]
      else unmapped.push(url)
    }
    for (const child of node?.children ?? []) walk(child)
  }
  walk(clone.root)
  return { content: clone, used: i, unmapped }
}

const payload = await getPayload({ config })
const idOf = (v: any) => (v && typeof v === 'object' ? v.id : v)
let failed = false

for (const [id, t] of Object.entries(source.articles)) {
  const hu: any = await payload.findByID({ collection: 'articles', id, locale: 'hu', fallbackLocale: false as any, depth: 0 })
  const { content, used, unmapped } = translateContent(hu.content, t.texts, source.linkMap)

  const problems: string[] = []
  if (used !== t.texts.length) problems.push(`szövegszám eltér: hu=${used}, en=${t.texts.length}`)
  if (unmapped.length) problems.push(`nincs angol link: ${unmapped.join(', ')}`)
  const dynamicZone = translateBlocks(hu.dynamic_zone, t, problems)
  if (t.metaTitle.length > 60) problems.push(`metaTitle túl hosszú (${t.metaTitle.length})`)
  if (t.description.length > 160) problems.push(`description túl hosszú (${t.description.length})`)
  if (problems.length) {
    failed = true
    console.error(`✗ ${id}: ${problems.join('; ')}`)
    continue
  }

  const data = {
    title: t.title,
    slug: t.slug,
    description: t.description,
    content,
    dynamic_zone: dynamicZone,
    image: idOf(hu.image),
    categories: (hu.categories ?? []).map(idOf),
    seo: {
      metaTitle: t.metaTitle,
      metaDescription: t.description,
      keywords: t.keywords,
      metaImage: idOf(hu.seo?.metaImage) ?? idOf(hu.image),
    },
    _status: 'published' as const,
  }

  if (!apply) {
    console.log(`○ ${id}: rendben (dry run) → /en/blog/${t.slug} | ${t.metaTitle} (${t.metaTitle.length}) | desc ${t.description.length}`)
    continue
  }
  try {
    await payload.update({ collection: 'articles', id, locale: 'en', data: data as any })
  } catch (err: any) {
    failed = true
    console.error(`✗ ${id}:`, JSON.stringify(err?.data?.errors ?? err?.cause?.errors ?? err?.message, null, 1))
    continue
  }
  console.log(`✓ ${id}: angol változat mentve → /en/blog/${t.slug}`)
}

process.exit(failed ? 1 : 0)
