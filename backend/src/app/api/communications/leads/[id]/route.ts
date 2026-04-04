import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { state } = await req.json()
    if (!state) return NextResponse.json({ ok: false, error: 'state is required' }, { status: 400 })

    const payload = await getPayload({ config: configPromise })
    const updated = await payload.update({ collection: 'contacts', id, data: { state } })
    return NextResponse.json({ ok: true, data: updated })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const payload = await getPayload({ config: configPromise })
    await payload.delete({ collection: 'contacts', id })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}
