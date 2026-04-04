import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise })
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yearMonth = now.toLocaleString('hu-HU', { year: 'numeric', month: '2-digit' }).replace('. ', '-').replace('.', '')

    const [monthLogs, todayLogs, campaignLogs, transLogs, testLogs] = await Promise.all([
      payload.find({ collection: 'email-logs', where: { createdAt: { greater_than: monthStart.toISOString() } }, limit: 0, depth: 0 }),
      payload.find({ collection: 'email-logs', where: { createdAt: { greater_than: todayStart.toISOString() } }, limit: 0, depth: 0 }),
      payload.find({ collection: 'email-logs', where: { and: [{ createdAt: { greater_than: monthStart.toISOString() } }, { type: { equals: 'campaign' } }] }, limit: 0, depth: 0 }),
      payload.find({ collection: 'email-logs', where: { and: [{ createdAt: { greater_than: monthStart.toISOString() } }, { type: { not_equals: 'campaign' } }] }, limit: 0, depth: 0 }),
      payload.find({ collection: 'email-logs', where: { and: [{ createdAt: { greater_than: monthStart.toISOString() } }, { ref_collection: { equals: 'test' } }] }, limit: 0, depth: 0 }),
    ])

    const MONTH_LIMIT = 3000
    const DAY_LIMIT = 100
    const monthSent = monthLogs.totalDocs
    const todaySent = todayLogs.totalDocs

    return NextResponse.json({
      ok: true,
      yearMonth,
      month: {
        sent: monthSent,
        limit: MONTH_LIMIT,
        remaining: Math.max(0, MONTH_LIMIT - monthSent),
        percentUsed: Math.round((monthSent / MONTH_LIMIT) * 100),
        breakdown: {
          campaigns: campaignLogs.totalDocs,
          transactional: transLogs.totalDocs - testLogs.totalDocs,
          tests: testLogs.totalDocs,
        },
      },
      today: {
        sent: todaySent,
        limit: DAY_LIMIT,
        remaining: Math.max(0, DAY_LIMIT - todaySent),
        percentUsed: Math.round((todaySent / DAY_LIMIT) * 100),
      },
    })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}
