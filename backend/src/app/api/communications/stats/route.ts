import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise })
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)

    const [totalLeads, newLeads, totalSubs, activeSubs, huSubs, enSubs, newSubs, monthSent, prevMonthSent] = await Promise.all([
      payload.find({ collection: 'contacts', limit: 0, depth: 0 }),
      payload.find({ collection: 'contacts', where: { createdAt: { greater_than: weekAgo.toISOString() } }, limit: 0, depth: 0 }),
      payload.find({ collection: 'newsletters', limit: 0, depth: 0 }),
      payload.find({ collection: 'newsletters', where: { unsubscribed: { not_equals: true } }, limit: 0, depth: 0 }),
      payload.find({ collection: 'newsletters', where: { and: [{ unsubscribed: { not_equals: true } }, { language: { equals: 'hu' } }] }, limit: 0, depth: 0 }),
      payload.find({ collection: 'newsletters', where: { and: [{ unsubscribed: { not_equals: true } }, { language: { equals: 'en' } }] }, limit: 0, depth: 0 }),
      payload.find({ collection: 'newsletters', where: { createdAt: { greater_than: monthStart.toISOString() } }, limit: 0, depth: 0 }),
      payload.find({ collection: 'email-logs', where: { createdAt: { greater_than: monthStart.toISOString() } }, limit: 0, depth: 0 }),
      payload.find({ collection: 'email-logs', where: { createdAt: { greater_than: prevMonthStart.toISOString(), less_than: monthStart.toISOString() } }, limit: 0, depth: 0 }),
    ])

    return NextResponse.json({
      ok: true,
      newLeads: newLeads.totalDocs,
      totalLeads: totalLeads.totalDocs,
      totalSubs: totalSubs.totalDocs,
      activeSubs: activeSubs.totalDocs,
      huSubs: huSubs.totalDocs,
      enSubs: enSubs.totalDocs,
      newSubs: newSubs.totalDocs,
      monthSent: monthSent.totalDocs,
      prevMonthSent: prevMonthSent.totalDocs,
    })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}
