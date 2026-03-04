// src/api/newsletter/content-types/newsletter/lifecycles.ts

const FRONTEND_URL = process.env.FRONTEND_URL || (
  process.env.NODE_ENV === 'production'
    ? (process.env.URL || 'https://davelopment.hu')
    : 'http://localhost:3000'
);

function buildWelcomeHtml(name: string, language: 'hu' | 'en', unsubscribeUrl: string, siteUrl: string): string {
  const isHu = language !== 'en';

  const t = {
    greeting:   isHu ? `Szia${name ? ` ${name}` : ''}!` : `Hi${name ? ` ${name}` : ''}!`,
    badge:      isHu ? 'feliratkozás sikeres' : 'subscription confirmed',
    title:      isHu ? 'Örülünk, hogy itt vagy.' : 'Great to have you here.',
    body:       isHu
      ? 'Csatlakoztál a Davelopment közösségéhez. Webfejlesztésről, dizájnról és az általunk épített termékekről fogunk írni – csak akkor, ha van mondanivalónk.'
      : "You've joined the Davelopment community. We'll write about web development, design, and the products we build — only when we have something worth saying.",
    cta:        isHu ? 'Megnézem a weboldalt →' : 'Visit our website →',
    unsubLabel: isHu ? 'Leiratkozás a hírlevélről' : 'Unsubscribe from newsletter',
  };

  // Inline SVG checkmark as data URI – renderable in most email clients
  const checkSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 24 24' fill='none' stroke='%2316a34a' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'/%3E%3C/svg%3E`;

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

              <!-- Checkmark icon centered -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:22px;">
                <tr><td align="center">
                  <table cellpadding="0" cellspacing="0" border="0">
                    <tr><td align="center" valign="middle" width="52" height="52" style="width:52px;height:52px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:14px;text-align:center;vertical-align:middle;">
                      <img src="${checkSvg}" width="22" height="22" alt="ok" style="display:block;margin:0 auto;"/>
                    </td></tr>
                  </table>
                </td></tr>
              </table>

              <!-- Greeting -->
              <p style="font-size:14px;color:#6b7280;margin:0 0 6px;">${t.greeting}</p>

              <!-- Title -->
              <h1 style="font-size:20px;font-weight:700;color:#111;margin:0 0 14px;letter-spacing:-0.3px;line-height:1.3;">${t.title}</h1>

              <!-- Body -->
              <p style="font-size:14px;color:#6b7280;line-height:1.75;margin:0 0 28px;">${t.body}</p>

              <!-- CTA -->
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
</html>`;
}

export default {
  async beforeCreate(event: any) {
    const { data } = event.params;
    if (!data.subscribed_at) data.subscribed_at = new Date();
    if (typeof data.gdpr_accepted === 'undefined') data.gdpr_accepted = true;
    if (typeof data.unsubscribed === 'undefined') data.unsubscribed = false;
    if (typeof data.confirmed === 'undefined') data.confirmed = false;
  },

  async afterCreate(event: any) {
    const { result } = event;

    // Strapi v5: draft+publish kétszer fut – csak publishedAt esetén küldjük
    if (!result.publishedAt) return;

    const email: string = result.email;
    const name: string = result.name || '';
    const language: 'hu' | 'en' = result.language || 'hu';
    if (!email) return;

    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'hello@davelopment.hu';
    const siteUrl = process.env.URL || 'https://davelopment.hu';

    if (!apiKey) {
      console.warn('[Communications] RESEND_API_KEY nincs beállítva.');
      return;
    }

    const isHu = language !== 'en';
    const subject = isHu ? 'Feliratkozás sikeres – Davelopment' : 'Subscription confirmed – Davelopment';

    const documentId = result.documentId || result.id;
    const locale = language === 'en' ? 'en' : 'hu';
    const unsubscribeUrl = `${FRONTEND_URL}/${locale}/unsubscribe?id=${documentId}`;

    const html = buildWelcomeHtml(name, language, unsubscribeUrl, siteUrl);

    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: `Davelopment <${fromEmail}>`, to: [email], subject, html }),
      });
      const data = await res.json() as any;
      if (res.ok) console.log(`[Communications] Welcome email → ${email} (${language})`);
      else console.error('[Communications] Welcome email hiba:', data);
    } catch (err) {
      console.error('[Communications] Welcome email fetch hiba:', err);
    }
  },
};
