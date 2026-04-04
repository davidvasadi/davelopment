import { NextResponse } from 'next/server'
import { getValidToken, gscFetch, GSC_SITE, daysAgo, delta } from '@/lib/gsc'

export async function GET() {
  const token = await getValidToken()
  if (!token) return NextResponse.json({ ok: false, error: 'Not connected' }, { status: 401 })

  try {
    const [curr, prev, trend, topPages] = await Promise.all([
      gscFetch(`/sites/${encodeURIComponent(GSC_SITE)}/searchAnalytics/query`, {
        startDate: daysAgo(31), endDate: daysAgo(3),
        dimensions: ['page'], rowLimit: 500, dataState: 'final',
      }),
      gscFetch(`/sites/${encodeURIComponent(GSC_SITE)}/searchAnalytics/query`, {
        startDate: daysAgo(59), endDate: daysAgo(32),
        dimensions: ['page'], rowLimit: 500, dataState: 'final',
      }),
      gscFetch(`/sites/${encodeURIComponent(GSC_SITE)}/searchAnalytics/query`, {
        startDate: daysAgo(31), endDate: daysAgo(3),
        dimensions: ['date'], rowLimit: 35, dataState: 'final',
      }),
      gscFetch(`/sites/${encodeURIComponent(GSC_SITE)}/searchAnalytics/query`, {
        startDate: daysAgo(31), endDate: daysAgo(3),
        dimensions: ['page'], rowLimit: 10,
        orderBy: [{ fieldName: 'clicks', sortOrder: 'DESCENDING' }],
        dataState: 'final',
      }),
    ])

    const rows: any[] = curr?.rows || []
    const prevRows: any[] = prev?.rows || []
    const totalClicks = rows.reduce((s: number, r: any) => s + r.clicks, 0)
    const totalImpressions = rows.reduce((s: number, r: any) => s + r.impressions, 0)
    const avgCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0
    const avgPosition = rows.length > 0 ? rows.reduce((s: number, r: any) => s + r.position, 0) / rows.length : 0
    const prevClicks = prevRows.reduce((s: number, r: any) => s + r.clicks, 0)
    const prevImpressions = prevRows.reduce((s: number, r: any) => s + r.impressions, 0)
    const siteBase = GSC_SITE.replace('sc-domain:', 'https://')

    return NextResponse.json({
      ok: true,
      totalClicks,
      totalImpressions,
      avgCtr: Math.round(avgCtr * 10) / 10,
      avgPosition: Math.round(avgPosition * 10) / 10,
      clicksDelta: delta(totalClicks, prevClicks),
      impsDelta: delta(totalImpressions, prevImpressions),
      trend: (trend?.rows || []).map((r: any) => ({
        date: r.keys[0],
        clicks: r.clicks,
        impressions: r.impressions,
        position: Math.round(r.position * 10) / 10,
      })),
      topPages: (topPages?.rows || []).map((r: any) => ({
        url: r.keys[0],
        slug: r.keys[0].replace(siteBase, '') || '/',
        clicks: r.clicks,
        impressions: r.impressions,
        position: Math.round(r.position * 10) / 10,
      })),
    })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}
