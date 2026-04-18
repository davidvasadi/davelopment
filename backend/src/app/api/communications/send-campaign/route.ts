import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { subject, testEmail, language } = body
    const html: string = body.html || body.htmlContent || ''

    if (!subject?.trim() || !html?.trim()) {
      return NextResponse.json({ ok: false, error: 'Hiányzó subject vagy tartalom' }, { status: 400 })
    }

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      return NextResponse.json({ ok: false, error: 'RESEND_API_KEY nincs beállítva' }, { status: 500 })
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL || 'hello@davelopment.hu'
    const from = `[davelopment]® <${fromEmail}>`

    // Test mode: send only to one address
    if (testEmail) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from, to: testEmail, subject: `[TEST] ${subject}`, html }),
      })
      const data = await res.json()
      if (!res.ok) return NextResponse.json({ ok: false, error: data.message || 'Resend hiba' }, { status: 500 })
      return NextResponse.json({ ok: true, sent: 1, test: true })
    }

    // Full send: get active subscribers filtered by language
    const payload = await getPayload({ config: configPromise })
    const where: any = { unsubscribed: { not_equals: true } }
    if (language && language !== 'all') where.language = { equals: language }
    const subs = await payload.find({
      collection: 'newsletters',
      where,
      limit: 1000,
      depth: 0,
    })

    const emails = subs.docs
      .map((s: any) => s.email as string)
      .filter(Boolean)

    if (emails.length === 0) {
      return NextResponse.json({ ok: false, error: 'Nincs aktív feliratkozó' }, { status: 400 })
    }

    // Send batch via Resend (individual emails to avoid exposing all addresses)
    let sent = 0
    const errors: string[] = []

    for (const email of emails) {
      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ from, to: email, subject, html: html.replace(/\{\{UNSUBSCRIBE_URL\}\}/g, `https://davelopment.hu/unsubscribe?email=${encodeURIComponent(email)}`) }),
        })
        if (res.ok) sent++
        else { const d = await res.json(); errors.push(`${email}: ${d.message}`) }
      } catch (e) { errors.push(`${email}: ${String(e)}`) }
    }

    // Log to email-logs
    try {
      await payload.create({
        collection: 'email-logs',
        data: { subject, recipientCount: sent, type: 'campaign' } as any,
      })
    } catch { /* log failure is non-critical */ }

    return NextResponse.json({ ok: true, sent, total: emails.length, errors: errors.slice(0, 5), recipients: emails })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}
