import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { name, language, confirmed } = await req.json()
    const payload = await getPayload({ config: configPromise })
    const data: any = {}
    if (name !== undefined) data.name = name
    if (language !== undefined) data.language = language
    if (confirmed !== undefined) data.confirmed = confirmed
    const updated = await payload.update({ collection: 'newsletters', id, data })
    return NextResponse.json({ ok: true, data: updated })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}
