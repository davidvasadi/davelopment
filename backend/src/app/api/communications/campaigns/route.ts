import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'email-logs',
      where: { type: { equals: 'campaign' } },
      sort: '-createdAt',
      limit: 50,
      depth: 0,
    })
    const mapped = result.docs.map((d: any) => ({
      id: d.id,
      subject: d.subject,
      language: d.ref_collection || 'all',
      createdAt: d.createdAt,
      ref_id: d.ref_id,
      sentCount: parseInt(d.ref_id || '0', 10),
      isTest: d.to === 'test',
      fullHtml: d.fullHtml || null,
      recipients: d.recipients ? JSON.parse(d.recipients) : null,
    }))
    return NextResponse.json({ ok: true, data: mapped })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { subject, sentCount, isTest, language, fullHtml, recipients } = await req.json()
    const payload = await getPayload({ config: configPromise })
    await payload.create({
      collection: 'email-logs',
      overrideAccess: true,
      data: {
        type: 'campaign',
        to: isTest ? 'test' : 'campaign',
        subject,
        ref_collection: isTest ? 'test' : (language || 'all'),
        ref_id: String(sentCount ?? 0),
        fullHtml: fullHtml || null,
        recipients: recipients ? JSON.stringify(recipients) : null,
      },
    })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}
