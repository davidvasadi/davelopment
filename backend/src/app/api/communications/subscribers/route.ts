import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function GET(req: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { searchParams } = new URL(req.url)
    const language = searchParams.get('language') || 'all'
    const page = parseInt(searchParams.get('page') || '1', 10)
    const pageSize = parseInt(searchParams.get('pageSize') || '20', 10)

    const where: any = {}
    if (language !== 'all') where.language = { equals: language }

    const result = await payload.find({
      collection: 'newsletters',
      where,
      sort: '-createdAt',
      page,
      limit: pageSize,
      depth: 0,
    })

    return NextResponse.json({ ok: true, data: result.docs, total: result.totalDocs, page, pageSize })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    const payload = await getPayload({ config: configPromise })
    const all = await payload.find({ collection: 'newsletters', limit: 1000, depth: 0 })
    await Promise.all(all.docs.map((d: any) => payload.delete({ collection: 'newsletters', id: d.id })))
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}
