import type { CollectionConfig } from 'payload'

const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://davelopment.hu'
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000'

function buildWelcomeHtml(name: string, language: 'hu' | 'en', unsubscribeUrl: string, siteUrl: string): string {
  const isHu = language !== 'en'

  const t = {
    greeting:   isHu ? `Szia${name ? ` ${name}` : ''}!` : `Hi${name ? ` ${name}` : ''}!`,
    badge:      isHu ? 'feliratkozás sikeres' : 'subscription confirmed',
    title:      isHu ? 'Örülünk, hogy itt vagy.' : 'Great to have you here.',
    body:       isHu
      ? 'Csatlakoztál a [davelopment]® közösségéhez. Webfejlesztésről, dizájnról és az általunk épített termékekről fogunk írni – csak akkor, ha van mondanivalónk.'
      : "You've joined the [davelopment]® community. We'll write about web development, design, and the products we build — only when we have something worth saying.",
    cta:        isHu ? 'Megnézem a weboldalt ›' : 'Visit our website ›',
    unsubLabel: isHu ? 'Leiratkozás a hírlevélről' : 'Unsubscribe from newsletter',
  }

  const checkSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 24 24' fill='none' stroke='%2316a34a' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'/%3E%3C/svg%3E`

  return `<!DOCTYPE html>
<html lang="${isHu ? 'hu' : 'en'}">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${t.title}</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;-webkit-font-smoothing:antialiased;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f5f5f5;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:440px;">

        <tr><td style="background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">

            <!-- Header -->
            <tr><td style="padding:18px 24px 16px;border-bottom:1px solid #f3f4f6;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-size:13px;font-weight:700;color:#111;font-family:'Courier New',Courier,monospace;letter-spacing:0.2px;">[davelopment]®</td>
                  <td align="right">
                    <span style="display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;background:#f0fdf4;border:1px solid #bbf7d0;color:#16a34a;font-family:'Courier New',Courier,monospace;">${t.badge}</span>
                  </td>
                </tr>
              </table>
            </td></tr>

            <!-- Body -->
            <tr><td style="padding:32px 24px 28px;">

              <!-- Checkmark icon -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:22px;">
                <tr><td align="center">
                  <table cellpadding="0" cellspacing="0" border="0">
                    <tr><td align="center" valign="middle" width="52" height="52" style="width:52px;height:52px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:50%;text-align:center;vertical-align:middle;">
                      <img src="${checkSvg}" width="22" height="22" alt="ok" style="display:block;margin:0 auto;"/>
                    </td></tr>
                  </table>
                </td></tr>
              </table>

              <p style="font-size:14px;color:#6b7280;margin:0 0 6px;">${t.greeting}</p>
              <h1 style="font-size:20px;font-weight:700;color:#111;margin:0 0 14px;letter-spacing:-0.3px;line-height:1.3;">${t.title}</h1>
              <p style="font-size:14px;color:#6b7280;line-height:1.75;margin:0 0 28px;">${t.body}</p>
              <a href="${siteUrl}" style="display:inline-block;padding:11px 22px;background:#111;color:#ffffff;border-radius:10px;text-decoration:none;font-size:13px;font-weight:600;letter-spacing:0.2px;">${t.cta}</a>

            </td></tr>
          </table>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:18px 4px 0;text-align:center;">
          <p style="font-size:11px;color:#9ca3af;margin:0 0 5px;font-family:'Courier New',Courier,monospace;">davelopment.hu · hello@davelopment.hu</p>
          <a href="${unsubscribeUrl}" style="font-size:11px;color:#9ca3af;text-decoration:none;font-family:'Courier New',Courier,monospace;">${t.unsubLabel}</a>
        </td></tr>

      </table>
    </td></tr>
  </table>

</body>
</html>`
}

function buildContactAdminHtml(name: string, email: string, message: string, page: string, adminUrl: string): string {
  return `<!DOCTYPE html>
<html lang="hu">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Új üzenet</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;-webkit-font-smoothing:antialiased;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f5f5f5;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:440px;">

        <tr><td style="background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">

            <!-- Header -->
            <tr><td style="padding:18px 24px 16px;border-bottom:1px solid #f3f4f6;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-size:13px;font-weight:700;color:#111;font-family:'Courier New',Courier,monospace;">[davelopment]®</td>
                  <td align="right">
                    <span style="display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;background:#fef3c7;border:1px solid #fde68a;color:#92400e;font-family:'Courier New',Courier,monospace;">új üzenet</span>
                  </td>
                </tr>
              </table>
            </td></tr>

            <!-- Body -->
            <tr><td style="padding:28px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;">
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;font-size:12px;color:#9ca3af;width:80px;font-family:'Courier New',Courier,monospace;">Név</td>
                  <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;font-size:13px;color:#111;font-weight:600;">${name || '—'}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;font-size:12px;color:#9ca3af;font-family:'Courier New',Courier,monospace;">Email</td>
                  <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;font-size:13px;"><a href="mailto:${email}" style="color:#111;text-decoration:none;">${email}</a></td>
                </tr>
                ${page ? `<tr>
                  <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;font-size:12px;color:#9ca3af;font-family:'Courier New',Courier,monospace;">Oldal</td>
                  <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;font-size:13px;color:#6b7280;">${page}</td>
                </tr>` : ''}
              </table>

              ${message ? `<div style="background:#f9fafb;border:1px solid #f3f4f6;border-radius:10px;padding:16px;font-size:13px;color:#374151;line-height:1.7;white-space:pre-wrap;">${message}</div>` : ''}

              <div style="margin-top:24px;">
                <a href="${adminUrl}" style="display:inline-block;padding:10px 20px;background:#111;color:#ffffff;border-radius:9px;text-decoration:none;font-size:12px;font-weight:600;font-family:'Courier New',Courier,monospace;">Megnyitás adminban →</a>
              </div>
            </td></tr>
          </table>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:16px 4px 0;text-align:center;">
          <p style="font-size:11px;color:#9ca3af;margin:0;font-family:'Courier New',Courier,monospace;">davelopment.hu · hello@davelopment.hu</p>
        </td></tr>

      </table>
    </td></tr>
  </table>

</body>
</html>`
}

function buildAutoReplyHtml(name: string, isHu: boolean): string {
  const t = {
    greeting: isHu ? `Szia${name ? ` ${name.split(' ')[0]}` : ''}!` : `Hi${name ? ` ${name.split(' ')[0]}` : ''}!`,
    badge:    isHu ? 'üzenet megérkezett' : 'message received',
    title:    isHu ? 'Köszönöm az üzeneted.' : 'Thanks for reaching out.',
    body:     isHu
      ? 'Megkaptam az üzeneted, és hamarosan felveszem veled a kapcsolatot — általában 1–2 munkanapon belül válaszolok.'
      : "I've received your message and will get back to you soon — usually within 1–2 business days.",
    sign:     isHu ? 'Vasadi Dávid' : 'Dávid Vasadi',
  }

  return `<!DOCTYPE html>
<html lang="${isHu ? 'hu' : 'en'}">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${t.title}</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;-webkit-font-smoothing:antialiased;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f5f5f5;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:440px;">

        <tr><td style="background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">

            <!-- Header -->
            <tr><td style="padding:18px 24px 16px;border-bottom:1px solid #f3f4f6;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-size:13px;font-weight:700;color:#111;font-family:'Courier New',Courier,monospace;">[davelopment]®</td>
                  <td align="right">
                    <span style="display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;background:#eff6ff;border:1px solid #bfdbfe;color:#1d4ed8;font-family:'Courier New',Courier,monospace;">${t.badge}</span>
                  </td>
                </tr>
              </table>
            </td></tr>

            <!-- Body -->
            <tr><td style="padding:32px 24px 28px;">
              <p style="font-size:14px;color:#6b7280;margin:0 0 6px;">${t.greeting}</p>
              <h1 style="font-size:20px;font-weight:700;color:#111;margin:0 0 14px;letter-spacing:-0.3px;line-height:1.3;">${t.title}</h1>
              <p style="font-size:14px;color:#6b7280;line-height:1.75;margin:0 0 28px;">${t.body}</p>
              <p style="font-size:13px;color:#374151;margin:0;">— ${t.sign}<br>
                <a href="https://davelopment.hu" style="color:#9ca3af;text-decoration:none;font-family:'Courier New',Courier,monospace;font-size:12px;">davelopment.hu</a>
              </p>
            </td></tr>
          </table>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:18px 4px 0;text-align:center;">
          <p style="font-size:11px;color:#9ca3af;margin:0;font-family:'Courier New',Courier,monospace;">davelopment.hu · hello@davelopment.hu</p>
        </td></tr>

      </table>
    </td></tr>
  </table>

</body>
</html>`
}

export { buildContactAdminHtml, buildAutoReplyHtml }

export const Newsletters: CollectionConfig = {
  slug: 'newsletters',
  admin: {
    group: 'Kommunikáció',
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'language', 'confirmed', 'unsubscribed', 'createdAt'],
  },
  access: {
    create: () => true,  // public newsletter signup
    // read, update, delete: Payload default (requires auth)
  },
  endpoints: [
    {
      path: '/unsubscribe',
      method: 'post',
      handler: async (req) => {
        try {
          const body = await req.json?.() ?? {}
          const { id, email } = body as { id?: string | number; email?: string }

          let doc: any = null

          if (id) {
            try {
              doc = await req.payload.findByID({ collection: 'newsletters', id: Number(id), depth: 0 })
            } catch {}
          }

          if (!doc && email) {
            const res = await req.payload.find({
              collection: 'newsletters',
              where: { email: { equals: email } },
              depth: 0,
              limit: 1,
            })
            doc = res.docs?.[0] ?? null
          }

          if (!doc) {
            return Response.json({ error: 'NOT_FOUND' }, { status: 404 })
          }

          if (doc.unsubscribed) {
            return Response.json({ alreadyUnsubscribed: true }, { status: 200 })
          }

          await req.payload.update({
            collection: 'newsletters',
            id: doc.id,
            data: { unsubscribed: true },
            overrideAccess: true,
          })

          return Response.json({ ok: true }, { status: 200 })
        } catch (err) {
          req.payload.logger.error({ err }, 'Newsletters: unsubscribe endpoint error')
          return Response.json({ error: 'INTERNAL_ERROR' }, { status: 500 })
        }
      },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== 'create') return
        const { payload } = req

        // E2E teszt cleanup — azonnal töröljük, nem küldünk emailt
        if (doc.email?.includes('e2e-test@')) {
          try {
            await payload.delete({ collection: 'newsletters', id: doc.id, overrideAccess: true })
          } catch (_) {}
          return
        }

        const language = (doc.language || 'hu') as 'hu' | 'en'
        const isHu = language !== 'en'
        const name = doc.name || ''
        const locale = isHu ? 'hu' : 'en'
        const unsubscribeUrl = `${FRONTEND_URL}/${locale}/unsubscribe?id=${doc.id}`
        const siteUrl = SITE_URL

        // ── Welcome email ──────────────────────────────────────────────────────
        try {
          await payload.sendEmail({
            to: doc.email,
            subject: isHu
              ? 'Feliratkozás sikeres – [davelopment]®'
              : 'Subscription confirmed – [davelopment]®',
            html: buildWelcomeHtml(name, language, unsubscribeUrl, siteUrl),
          })
        } catch (err) {
          payload.logger.error({ err }, 'Newsletters: welcome email failed')
        }

        // ── Email log ──────────────────────────────────────────────────────────
        try {
          await payload.create({
            collection: 'email-logs',
            overrideAccess: true,
            data: {
              type: 'newsletter-welcome',
              to: doc.email,
              subject: isHu ? 'Feliratkozás sikeres – [davelopment]®' : 'Subscription confirmed – [davelopment]®',
              ref_collection: 'newsletters',
              ref_id: String(doc.id),
            },
          })
        } catch (_) {}
      },
    ],
  },
  fields: [
    { name: 'email', type: 'email', label: 'Email', required: true, unique: true },
    { name: 'name', type: 'text', label: 'Név' },
    {
      name: 'language',
      type: 'select',
      label: 'Nyelv',
      options: [
        { label: 'Magyar', value: 'hu' },
        { label: 'English', value: 'en' },
      ],
    },
    { name: 'source', type: 'text', label: 'Forrás (honnan iratkozott fel)' },
    { name: 'gdpr_accepted', type: 'checkbox', label: 'GDPR elfogadva', defaultValue: true },
    { name: 'confirmed', type: 'checkbox', label: 'Megerősítve', defaultValue: true },
    { name: 'unsubscribed', type: 'checkbox', label: 'Leiratkozott', defaultValue: false },
    { name: 'subscribed_at', type: 'date', label: 'Feliratkozás dátuma' },
  ],
}
