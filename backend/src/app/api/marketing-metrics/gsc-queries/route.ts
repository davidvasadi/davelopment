import { NextRequest, NextResponse } from 'next/server'
import { getValidToken, gscFetch, GSC_SITE, daysAgo } from '@/lib/gsc'

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug') || ''
  const token = await getValidToken()
  if (!token) return NextResponse.json({ ok: false, error: 'Not connected' }, { status: 401 })

  try {
    const siteBase = GSC_SITE.replace('sc-domain:', 'https://')
    const filters = slug
      ? { dimensionFilterGroups: [{ filters: [{ dimension: 'page', expression: `${siteBase}${slug}` }] }] }
      : {}

    const result = await gscFetch(`/sites/${encodeURIComponent(GSC_SITE)}/searchAnalytics/query`, {
      startDate: daysAgo(31),
      endDate: daysAgo(3),
      dimensions: ['query'],
      rowLimit: 25,
      orderBy: [{ fieldName: 'clicks', sortOrder: 'DESCENDING' }],
      dataState: 'final',
      ...filters,
    })

    const queries = (result?.rows || []).map((r: any) => ({
      query: r.keys[0],
      clicks: r.clicks,
      impressions: r.impressions,
      position: Math.round(r.position * 10) / 10,
    }))

    return NextResponse.json({ ok: true, queries })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}
