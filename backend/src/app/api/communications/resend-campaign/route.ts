import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function POST(req: NextRequest) {
  try {
    const { campaignId } = await req.json()
    if (!campaignId) return NextResponse.json({ ok: false, error: 'campaignId kötelező' }, { status: 400 })

    const payload = await getPayload({ config: configPromise })

    const original = await payload.findByID({
      collection: 'email-logs',
      id: campaignId,
      depth: 0,
      overrideAccess: true,
    })

    if (!original || original.type !== 'campaign') {
      return NextResponse.json({ ok: false, error: 'Kampány nem található' }, { status: 404 })
    }
    if (!original.fullHtml) {
      return NextResponse.json({ ok: false, error: 'Nincs elmentett HTML — nem lehet újraküldeni' }, { status: 400 })
    }

    const originalRecipients: string[] = original.recipients
      ? JSON.parse(original.recipients as string)
      : []

    const language = (original.ref_collection as string) || 'all'
    const where: any = { unsubscribed: { not_equals: true } }
    if (language !== 'all') where.language = { equals: language }

    const subs = await payload.find({
      collection: 'newsletters',
      where,
      limit: 1000,
      depth: 0,
    })

    const newEmails = subs.docs
      .map((s: any) => s.email as string)
      .filter(Boolean)
      .filter((email: string) => !originalRecipients.includes(email))

    if (newEmails.length === 0) {
      return NextResponse.json({ ok: false, error: 'Nincs új feliratkozó, akinek még nem ment ki ez a kampány.' }, { status: 400 })
    }

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) return NextResponse.json({ ok: false, error: 'RESEND_API_KEY nincs beállítva' }, { status: 500 })

    const fromEmail = process.env.RESEND_FROM_EMAIL || 'hello@davelopment.hu'
    const from = `[davelopment]® <${fromEmail}>`

    let sent = 0
    const errors: string[] = []

    for (const email of newEmails) {
      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from,
            to: email,
            subject: original.subject as string,
            html: (original.fullHtml as string).replace(
              /\{\{UNSUBSCRIBE_URL\}\}/g,
              `https://davelopment.hu/unsubscribe?email=${encodeURIComponent(email)}`
            ),
          }),
        })
        if (res.ok) sent++
        else {
          const d = await res.json()
          errors.push(`${email}: ${d.message}`)
        }
      } catch (e) {
        errors.push(`${email}: ${String(e)}`)
      }
    }

    return NextResponse.json({ ok: true, sent, total: newEmails.length, errors: errors.slice(0, 5), recipients: newEmails })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}
