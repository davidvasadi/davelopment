import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'

function auditSeo(item: any, type: string, labelField: string, collection: string) {
  const seo = item.seo || {}
  const issues: string[] = []
  if (!seo.metaTitle) issues.push('Meta title')
  if (!seo.metaDescription) issues.push('Meta description')
  if (!seo.keywords) issues.push('Keywords')
  if (!seo.metaImage) issues.push('OG kép')
  const total = 4
  const score = Math.max(0, Math.round(((total - issues.length) / total) * 100))
  const label = item[labelField] || item.slug || String(item.id)
  return {
    id: String(item.id),
    type,
    label,
    slug: item.slug || '',
    issues,
    score,
    editUrl: `/admin/collections/${collection}/${item.id}`,
  }
}

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise })
    const [articles, products, pages] = await Promise.all([
      payload.find({ collection: 'articles', limit: 100, depth: 1 }),
      payload.find({ collection: 'products', limit: 100, depth: 1 }),
      payload.find({ collection: 'pages', limit: 100, depth: 1 }),
    ])
    const items = [
      ...articles.docs.map(d => auditSeo(d, 'Cikk', 'title', 'articles')),
      ...products.docs.map(d => auditSeo(d, 'Termék', 'title', 'products')),
      ...pages.docs.map(d => auditSeo(d, 'Oldal', 'label', 'pages')),
    ]
    return NextResponse.json({ ok: true, items })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}
