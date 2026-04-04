import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise })
    const now = new Date()
    // Last 6 months
    const months: { label: string; start: Date; end: Date }[] = []
    for (let i = 5; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)
      months.push({
        label: `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}`,
        start,
        end,
      })
    }

    const counts = await Promise.all(
      months.map(m =>
        payload.find({
          collection: 'email-logs',
          where: {
            createdAt: {
              greater_than: m.start.toISOString(),
              less_than: m.end.toISOString(),
            },
          },
          limit: 0,
          depth: 0,
        })
      )
    )

    return NextResponse.json({
      ok: true,
      data: months.map((m, i) => ({ month: m.label, sent: counts[i].totalDocs })),
    })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}
