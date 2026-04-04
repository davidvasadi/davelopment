import { NextResponse } from 'next/server'
import { getValidToken, gscFetch, GSC_SITE, daysAgo } from '@/lib/gsc'

export async function GET() {
  const token = await getValidToken()
  if (!token) return NextResponse.json({ ok: false, error: 'Not connected' }, { status: 401 })

  try {
    const siteBase = GSC_SITE.replace('sc-domain:', 'https://')
    const result = await gscFetch(`/sites/${encodeURIComponent(GSC_SITE)}/searchAnalytics/query`, {
      startDate: daysAgo(31),
      endDate: daysAgo(3),
      dimensions: ['page'],
      rowLimit: 500,
      dataState: 'final',
    })

    const data: Record<string, { clicks: number; impressions: number; ctr: number; position: number }> = {}
    for (const r of result?.rows || []) {
      try {
        let slug = r.keys[0].replace(siteBase, '') || '/'
        if (slug.length > 1 && slug.endsWith('/')) slug = slug.slice(0, -1)
        data[slug] = {
          clicks: r.clicks,
          impressions: r.impressions,
          ctr: Math.round(r.ctr * 1000) / 10,
          position: Math.round(r.position * 10) / 10,
        }
      } catch {}
    }

    return NextResponse.json({ ok: true, data })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}
