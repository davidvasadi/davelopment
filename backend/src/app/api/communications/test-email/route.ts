import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { to } = await req.json()
    if (!to) return NextResponse.json({ ok: false, error: 'to required' }, { status: 400 })

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) return NextResponse.json({ ok: false, error: 'RESEND_API_KEY nincs beállítva' }, { status: 500 })

    const from = process.env.RESEND_FROM_EMAIL || 'noreply@davelopment.hu'
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to,
        subject: '[davelopment]® – Email kapcsolat teszt',
        html: `<div style="font-family:-apple-system,sans-serif;padding:32px;max-width:480px;margin:0 auto;"><h2 style="font-family:'Courier New',monospace;font-size:14px;color:#111;">[davelopment]®</h2><p style="color:#333;font-size:15px;line-height:1.7;">Ez egy teszt email a Resend kapcsolat ellenőrzéséhez.</p><p style="color:#9ca3af;font-size:12px;font-family:'Courier New',monospace;">Elküldve: ${new Date().toLocaleString('hu-HU')}</p></div>`,
      }),
    })

    const data = await res.json()
    if (!res.ok) return NextResponse.json({ ok: false, error: data.message || 'Resend hiba' }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}
