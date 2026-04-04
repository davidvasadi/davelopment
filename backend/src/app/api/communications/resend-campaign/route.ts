import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { campaignId } = await req.json()
    if (!campaignId) return NextResponse.json({ ok: false, error: 'campaignId required' }, { status: 400 })
    // Resend is not supported for campaigns without stored fullHtml
    return NextResponse.json({ ok: false, error: 'Az újraküldés nem elérhető – a HTML tartalom nem lett elmentve.' }, { status: 400 })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}
