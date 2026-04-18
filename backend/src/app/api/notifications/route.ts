import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'

const SEVEN_DAYS_AGO = () => new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

export async function GET(req: NextRequest) {
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: req.headers })
  const since = SEVEN_DAYS_AGO()

  const [newsletters, contacts, emailLogs] = await Promise.all([
    payload.find({
      collection: 'newsletters',
      limit: 10,
      sort: '-createdAt',
      depth: 0,
      where: { createdAt: { greater_than: since } },
    }),
    payload.find({
      collection: 'contacts',
      limit: 10,
      sort: '-createdAt',
      depth: 0,
      where: { createdAt: { greater_than: since } },
    }),
    payload.find({
      collection: 'email-logs',
      limit: 5,
      sort: '-createdAt',
      depth: 0,
      where: { and: [
        { type: { equals: 'campaign' } },
        { to: { not_equals: 'test' } },
        { createdAt: { greater_than: since } },
      ]},
    }),
  ])

  const campaigns = emailLogs.docs.map((d: any) => ({
    id: d.id,
    subject: d.subject ?? '',
    sentCount: parseInt(d.ref_id || '0', 10),
    createdAt: d.createdAt,
  }))

  return NextResponse.json({
    newsletters: newsletters.docs.map(d => ({
      id: d.id,
      email: (d as any).email,
      name: (d as any).name,
      createdAt: d.createdAt,
    })),
    contacts: contacts.docs.map(d => ({
      id: d.id,
      email: (d as any).email,
      name: (d as any).name,
      message: (d as any).message,
      page: (d as any).page,
      state: (d as any).state,
      createdAt: d.createdAt,
    })),
    campaigns,
    lastSeenAt: (user as any)?.notificationsLastSeenAt ?? null,
  })
}

export async function POST(req: NextRequest) {
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: req.headers })

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await payload.update({
    collection: 'users',
    id: user.id,
    data: { notificationsLastSeenAt: new Date().toISOString() },
  })

  return NextResponse.json({ ok: true })
}
