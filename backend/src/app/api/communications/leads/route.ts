import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function GET(req: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { searchParams } = new URL(req.url)
    const state = searchParams.get('state') || 'all'
    const page = parseInt(searchParams.get('page') || '1', 10)
    const pageSize = parseInt(searchParams.get('pageSize') || '20', 10)

    const where: any = {}
    if (state !== 'all') where.state = { equals: state }

    const result = await payload.find({
      collection: 'contacts',
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

export async function DELETE(req: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({ collection: 'contacts', limit: 10000, depth: 0 })
    await Promise.all(result.docs.map((d: any) => payload.delete({ collection: 'contacts', id: d.id })))
    return NextResponse.json({ ok: true, deleted: result.docs.length })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}
