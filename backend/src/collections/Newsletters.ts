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
                  <td style="font-size:13px;font-weight:700;color:#111;font-family:Geist,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;letter-spacing:0.2px;">[davelopment]®</td>
                  <td align="right">
                    <span style="display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;background:#f0fdf4;border:1px solid #bbf7d0;color:#16a34a;font-family:Geist,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">${t.badge}</span>
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
          <p style="font-size:11px;color:#9ca3af;margin:0 0 5px;font-family:Geist,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">davelopment.hu · hello@davelopment.hu</p>
          <a href="${unsubscribeUrl}" style="font-size:11px;color:#9ca3af;text-decoration:none;font-family:Geist,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">${t.unsubLabel}</a>
        </td></tr>

      </table>
    </td></tr>
  </table>

</body>
</html>`
}

function buildContactAdminHtml(o: {
  name: string; email: string; message: string; page: string; adminUrl: string;
  projectType?: string; budget?: string; timeline?: string; source?: string;
}): string {
  const { name, email, message, page, adminUrl, projectType = '', budget = '', timeline = '', source = '' } = o
  const metaRow = (label: string, value: string) => value ? `<tr>
    <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;font-size:12px;color:#9ca3af;font-family:Geist,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">${label}</td>
    <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;font-size:13px;"><span style="display:inline-block;padding:2px 9px;border-radius:20px;font-size:12px;font-weight:600;background:#f3f4f6;border:1px solid #e5e7eb;color:#111;">${value}</span></td>
  </tr>` : ''
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
                  <td style="font-size:13px;font-weight:700;color:#111;font-family:Geist,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">[davelopment]®</td>
                  <td align="right">
                    <span style="display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;background:#fef3c7;border:1px solid #fde68a;color:#92400e;font-family:Geist,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">új üzenet</span>
                  </td>
                </tr>
              </table>
            </td></tr>

            <!-- Body -->
            <tr><td style="padding:28px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;">
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;font-size:12px;color:#9ca3af;width:80px;font-family:Geist,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">Név</td>
                  <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;font-size:13px;color:#111;font-weight:600;">${name || '—'}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;font-size:12px;color:#9ca3af;font-family:Geist,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">Email</td>
                  <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;font-size:13px;"><a href="mailto:${email}" style="color:#111;text-decoration:none;">${email}</a></td>
                </tr>
                ${metaRow('Irány', projectType)}
                ${metaRow('Költségkeret', budget)}
                ${metaRow('Határidő', timeline)}
                ${metaRow('Honnan', source)}
                ${page ? `<tr>
                  <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;font-size:12px;color:#9ca3af;font-family:Geist,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">Oldal</td>
                  <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;font-size:13px;color:#6b7280;">${page}</td>
                </tr>` : ''}
              </table>

              ${message ? `<div style="background:#f9fafb;border:1px solid #f3f4f6;border-radius:10px;padding:16px;font-size:13px;color:#374151;line-height:1.7;white-space:pre-wrap;">${message}</div>` : ''}

              <div style="margin-top:24px;">
                <a href="mailto:${email}" style="display:inline-block;padding:10px 20px;background:#111;color:#ffffff;border-radius:9px;text-decoration:none;font-size:12px;font-weight:600;font-family:Geist,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;margin:0 8px 8px 0;">Válasz ${name ? name.split(' ')[0] : ''} ›</a>
                <a href="${adminUrl}" style="display:inline-block;padding:10px 20px;background:#ffffff;border:1px solid #e5e7eb;color:#111;border-radius:9px;text-decoration:none;font-size:12px;font-weight:600;font-family:Geist,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;margin:0 0 8px;">Admin ›</a>
              </div>
            </td></tr>
          </table>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:16px 4px 0;text-align:center;">
          <p style="font-size:11px;color:#9ca3af;margin:0;font-family:Geist,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">davelopment.hu · hello@davelopment.hu</p>
        </td></tr>

      </table>
    </td></tr>
  </table>

</body>
</html>`
}

type EmailCard = { title: string; url: string; image: string; image2?: string; category?: string; category2?: string; desc?: string }
function buildAutoReplyHtml(o: {
  name: string; isHu: boolean;
  projects?: EmailCard[]; services?: EmailCard[]; newsletterUrl?: string;
}): string {
  const { name, isHu, projects = [], services = [], newsletterUrl = 'https://davelopment.hu' } = o
  const base = 'https://davelopment.hu'
  const F = "Geist,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif"
  const ACCENT = '#111111'

  const t = {
    greeting: isHu ? `Szia${name ? ` ${name.split(' ')[0]}` : ''}!` : `Hi${name ? ` ${name.split(' ')[0]}` : ''}!`,
    badge:    isHu ? 'üzenet megérkezett' : 'message received',
    title:    isHu ? 'Köszönjük az üzeneted!' : 'Thanks for reaching out!',
    body:     isHu
      ? 'Megkaptuk, és hamarosan jelentkezünk — általában 1–2 munkanapon belül személyesen válaszolunk. Addig is jó kezekben vagy.'
      : "We've got it, and we'll be in touch soon — usually within 1–2 business days with a personal reply. You're in good hands.",
    stepsTitle: isHu ? 'Mi történik most?' : 'What happens next?',
    steps: isHu
      ? ['Átnézzük az üzeneted és a projekted.', '1–2 munkanapon belül személyes válasszal jelentkezünk.', 'Ha passzol, egyeztetünk egy rövid, kötetlen konzultációt.']
      : ['We review your message and your project.', 'We reply personally within 1–2 business days.', "If it's a fit, we set up a short, no-pressure call."],
    brand:    isHu
      ? 'Nincsenek sablon weboldalak, nincsenek üres ígéretek — működő digitális megoldásokat építünk, amelyek a növekedésedet szolgálják.'
      : "No template websites, no empty promises — we build digital solutions that actually work and drive your growth.",
    projectsTitle: isHu ? 'Válogatott munkáink' : 'Selected work',
    servicesTitle: isHu ? 'Amiben segítünk' : 'How we help',
    nlTitle:  isHu ? '10% kedvezmény az első projektedre' : '10% off your first project',
    nlBody:   isHu ? 'Iratkozz fel a hírlevelünkre, és 10% kedvezményt adunk az első közös projektedre — plusz hasznos tippek, spam nélkül.' : 'Subscribe and get 10% off your first project with us — plus useful tips, no spam.',
    nlBtn:    isHu ? 'Kérem a kedvezményt' : 'Get the discount',
    sign:     isHu ? 'A [davelopment]® csapata' : 'The [davelopment]® team',
  }

  const stepRow = (n: number, txt: string) => `
    <tr><td style="padding:0 0 12px;">
      <table cellpadding="0" cellspacing="0" border="0"><tr>
        <td valign="top" style="width:26px;">
          <span style="display:inline-block;width:22px;height:22px;line-height:22px;text-align:center;border-radius:50%;background:${ACCENT};color:#fff;font-size:11px;font-weight:700;font-family:${F};">${n}</span>
        </td>
        <td style="font-size:13px;color:#374151;line-height:1.6;padding-left:10px;">${txt}</td>
      </tr></table>
    </td></tr>`

  // Services: 2-column, natural-ratio images (no object-fit / fixed height) → uniform + smaller, mobile-friendly
  const serviceCell = (c: EmailCard) => `
    <td width="50%" valign="top" style="padding:0 5px;">
      <a href="${c.url}" style="display:block;text-decoration:none;">
        <img src="${c.image}" alt="${c.title}" width="248" height="210" style="display:block;width:100%;height:210px;object-fit:cover;object-position:center;border:0;border-radius:14px;background:#efeff0;"/>
        <span class="dm-strong" style="display:block;padding:9px 2px 0;font-size:13px;font-weight:600;color:#1d1d1f;font-family:${F};line-height:1.35;">${c.title}</span>
      </a>
    </td>`

  const cardSection = (title: string, items: EmailCard[]) => {
    if (!items.length) return ''
    const rows: string[] = []
    for (let i = 0; i < items.length; i += 2) {
      const pair = items.slice(i, i + 2)
      const cells = pair.map(serviceCell).join('')
      const filler = pair.length < 2 ? '<td width="50%"></td>' : ''
      rows.push(`<tr>${cells}${filler}</tr>`)
    }
    const spacer = '<tr><td colspan="2" style="height:16px;line-height:16px;">&nbsp;</td></tr>'
    return `
      <p style="font-size:11px;font-weight:700;color:#86868b;margin:0 0 14px;text-transform:uppercase;letter-spacing:0.6px;font-family:${F};">${title}</p>
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 -5px 26px;">${rows.join(spacer)}</table>`
  }

  // 1:1 mobile layout from projects.tsx — a "triplet" per project:
  //  (1) large image-background tile: category top-left, arrow top-right, name bottom
  //  (2) row of two: white text tile (category + desc + name) | pure image tile with arrow
  const arrowW = '<span style="font-size:16px;line-height:1;">↗</span>'
  const projectCardFull = (c: EmailCard) => {
    const large = `
      <a href="${c.url}" style="display:block;text-decoration:none;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
          <tr><td background="${c.image}" valign="top" height="260" style="height:260px;background-color:#1d1d1f;background-image:url('${c.image}');background-repeat:no-repeat;background-position:center;background-size:cover;border-radius:16px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="height:260px;" role="presentation">
              <tr>
                <td valign="top" style="padding:22px 24px;"><span style="font-size:19px;font-weight:600;color:#fff;font-family:${F};text-shadow:0 1px 12px rgba(0,0,0,0.5);">${c.category || ''}</span></td>
                <td valign="top" align="right" style="padding:22px 24px;color:#fff;text-shadow:0 1px 12px rgba(0,0,0,0.5);">${arrowW}</td>
              </tr>
              <tr><td colspan="2" style="font-size:1px;line-height:1px;">&nbsp;</td></tr>
              <tr><td colspan="2" valign="bottom" style="padding:0 24px 22px;"><span style="font-size:38px;font-weight:700;color:#fff;letter-spacing:-1.2px;line-height:1;font-family:${F};text-shadow:0 2px 16px rgba(0,0,0,0.45);">${c.title}</span></td></tr>
            </table>
          </td></tr>
        </table>
      </a>`
    const textTile = `
      <a href="${c.url}" style="display:block;text-decoration:none;">
        <table class="dm-card" width="100%" cellpadding="0" cellspacing="0" border="0" style="height:180px;background:#f5f5f7;border-radius:16px;" role="presentation">
          <tr><td valign="top" style="padding:16px 18px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
              <td valign="top">
                <p class="dm-strong" style="font-size:17px;font-weight:600;color:#1d1d1f;margin:0;line-height:1.2;font-family:${F};">${c.category2 || c.category || ''}</p>
                ${c.desc ? `<p style="font-size:12px;color:#a1a1a6;line-height:1.5;margin:5px 0 0;font-family:${F};">${c.desc}</p>` : ''}
              </td>
              <td valign="top" align="right" style="color:#c7c7cc;">${arrowW}</td>
            </tr></table>
          </td></tr>
          <tr><td valign="bottom" style="padding:0 18px 16px;"><span class="dm-strong" style="font-size:22px;font-weight:600;color:#1d1d1f;letter-spacing:-0.4px;font-family:${F};">${c.title}</span></td></tr>
        </table>
      </a>`
    const imageTile = `
      <a href="${c.url}" style="display:block;text-decoration:none;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
          <tr><td background="${c.image2 || c.image}" valign="bottom" height="180" align="right" style="height:180px;background-color:#e5e5ea;background-image:url('${c.image2 || c.image}');background-repeat:no-repeat;background-position:center;background-size:cover;border-radius:16px;">
            <div style="padding:14px 16px;color:#fff;text-shadow:0 1px 10px rgba(0,0,0,0.5);">${arrowW}</div>
          </td></tr>
        </table>
      </a>`
    return `
      ${large}
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 30px;" role="presentation"><tr>
        <td width="50%" valign="top" style="padding-right:4px;">${textTile}</td>
        <td width="50%" valign="top" style="padding-left:4px;">${imageTile}</td>
      </tr></table>`
  }

  const projectSection = (title: string, items: EmailCard[]) => !items.length ? '' : `
    <p style="font-size:11px;font-weight:700;color:#86868b;margin:0 0 16px;text-transform:uppercase;letter-spacing:0.6px;font-family:${F};">${title}</p>
    ${items.map(projectCardFull).join('')}`

  const nav: [string, string][] = isHu
    ? [['Projektek', '/hu/projektek'], ['Szolgáltatások', '/hu/szolgaltatasok'], ['Árak', '/hu/arak'], ['Blog', '/hu/blog'], ['Kapcsolat', '/hu/kapcsolat']]
    : [['Projects', '/en/products'], ['Services', '/en/services'], ['Pricing', '/en/pricing'], ['Blog', '/en/blog'], ['Contact', '/en/contact']]
  const fl = isHu
    ? { contact: 'Kapcsolat', navH: 'Navigáció', social: 'Közösségi média', privacy: 'Adatkezelési tájékoztató', terms: 'Felhasználási feltételek',
        desc: 'A [davelopment]® egy kis stúdió, amely webet, márkát és stratégiát épít olyan vállalkozásoknak, akik nem csak egy szép weboldalt akarnak, hanem mérhető eredményeket is.' }
    : { contact: 'Contact', navH: 'Navigation', social: 'Social', privacy: 'Privacy Policy', terms: 'Terms of Use',
        desc: '[davelopment]® is a small studio building web, brand and strategy for businesses that want more than a pretty site — measurable results.' }
  const eyebrow = (txt: string) => `<p style="font-size:10.5px;font-weight:700;color:#86868b;text-transform:uppercase;letter-spacing:0.6px;margin:0 0 12px;font-family:${F};">${txt}</p>`
  const fLink = (href: string, label: string) => `<a class="dm-link" href="${href}" style="display:block;color:#1d1d1f;text-decoration:none;font-size:13px;padding:4px 0;font-family:${F};">${label}</a>`
  const navLinks = nav.map(([l, u]) => fLink(`${base}${u}`, l)).join('')

  const siteFooter = `
    <!-- Newsletter -->
    <tr><td class="dm-divider-top" style="padding:36px 0 30px;border-top:1px solid #ececec;text-align:left;">
      <p class="dm-strong" style="color:#1d1d1f;font-size:16px;font-weight:700;margin:0 0 5px;letter-spacing:-0.3px;font-family:${F};">${t.nlTitle}</p>
      <p class="dm-muted" style="color:#6e6e73;font-size:13px;line-height:1.55;margin:0 0 16px;max-width:360px;">${t.nlBody}</p>
      <a class="dm-btn" href="${newsletterUrl}" style="display:inline-block;background:#1d1d1f;color:#fff;font-weight:600;font-size:13px;padding:11px 28px;border-radius:999px;text-decoration:none;font-family:${F};">${t.nlBtn}</a>
    </td></tr>

    <!-- Columns -->
    <tr><td class="dm-divider-top" style="padding:26px 0 8px;border-top:1px solid #ececec;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
        <td valign="top" width="40%" style="padding-right:10px;">
          ${eyebrow(fl.contact)}
          ${fLink('tel:+36303628377', '+36 30 362 8377')}
          ${fLink('mailto:hello@davelopment.hu', 'hello@davelopment.hu')}
        </td>
        <td valign="top" width="30%" style="padding-right:10px;">
          ${eyebrow(fl.navH)}
          ${navLinks}
        </td>
        <td valign="top" width="30%">
          ${eyebrow(fl.social)}
          ${fLink('https://instagram.com/davelopment_official', 'Instagram ↗')}
        </td>
      </tr></table>
    </td></tr>

    <!-- Wordmark -->
    <tr><td align="right" style="padding:28px 0 34px;text-align:right;">
      <span class="dm-strong" style="font-size:50px;font-weight:600;color:#1d1d1f;letter-spacing:-2.5px;line-height:0.9;font-family:${F};">[davelopment]®</span>
    </td></tr>`

  // Full-width black bar (breaks out of the centered column)
  const blackBar = `
    <tr><td style="background:#0e0e0e;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" align="center" style="max-width:520px;">
        <tr><td style="padding:28px 20px 32px;">
          <p style="color:#9a9a9a;font-size:12px;line-height:1.65;margin:0 0 14px;font-family:${F};">${fl.desc}</p>
          <p style="color:#8a8a8a;font-size:11px;line-height:1.6;margin:0;font-family:${F};">© ${new Date().getFullYear()} [davelopment]®&nbsp;&nbsp;·&nbsp;&nbsp;<a href="${base}/${isHu ? 'hu/adatkezeles' : 'en/privacy-policy'}" style="color:#8a8a8a;text-decoration:none;">${fl.privacy}</a>&nbsp;&nbsp;·&nbsp;&nbsp;<a href="${base}/${isHu ? 'hu/felhasznalasi-feltetelek' : 'en/terms'}" style="color:#8a8a8a;text-decoration:none;">${fl.terms}</a></p>
        </td></tr>
      </table>
    </td></tr>`


  return `<!DOCTYPE html>
<html lang="${isHu ? 'hu' : 'en'}">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <meta name="color-scheme" content="light dark"/>
  <meta name="supported-color-schemes" content="light dark"/>
  <title>${t.title}</title>
  <style>
    :root{color-scheme:light dark;supported-color-schemes:light dark;}
    @media (prefers-color-scheme: dark){
      .dm-bg{background:#000000!important;}
      .dm-strong{color:#f5f5f7!important;}
      .dm-muted{color:#98989d!important;}
      .dm-card{background:#1c1c1e!important;}
      .dm-divider{background:#2c2c2e!important;}
      .dm-btn{background:#ffffff!important;color:#000000!important;}
      .dm-link{color:#f5f5f7!important;}
      .dm-divider-top{border-top-color:#2c2c2e!important;}
    }
  </style>
</head>
<body class="dm-bg" style="margin:0;padding:0;background:#ffffff;font-family:${F};-webkit-font-smoothing:antialiased;">

  <table class="dm-bg" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;">
    <tr><td align="center" style="padding:0 20px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;">

        <!-- Logo -->
        <tr><td align="center" style="padding:44px 0 20px;">
          <span class="dm-strong" style="font-size:15px;font-weight:700;color:#1d1d1f;letter-spacing:-0.2px;">[davelopment]®</span>
        </td></tr>
        <tr><td style="padding:0 0 34px;"><div class="dm-divider" style="height:1px;line-height:1px;background:#ececec;">&nbsp;</div></td></tr>

        <!-- Intro -->
        <tr><td>
          <p class="dm-muted" style="font-size:15px;color:#86868b;margin:0 0 8px;">${t.greeting}</p>
          <h1 class="dm-strong" style="font-size:28px;font-weight:700;color:#1d1d1f;margin:0 0 16px;letter-spacing:-0.5px;line-height:1.2;">${t.title}</h1>
          <p class="dm-muted" style="font-size:15px;color:#6e6e73;line-height:1.7;margin:0 0 36px;">${t.body}</p>
        </td></tr>

        <!-- Steps -->
        <tr><td>
          <p style="font-size:11px;font-weight:700;color:#86868b;margin:0 0 16px;text-transform:uppercase;letter-spacing:0.6px;">${t.stepsTitle}</p>
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 30px;">
            ${t.steps.map((s, i) => stepRow(i + 1, s)).join('')}
          </table>
        </td></tr>

        <tr><td style="padding:4px 0 34px;"><div style="height:1px;line-height:1px;background:#ececec;">&nbsp;</div></td></tr>

        <!-- Projects + Services -->
        <tr><td>${projectSection(t.projectsTitle, projects)}</td></tr>
        <tr><td>${cardSection(t.servicesTitle, services)}</td></tr>

        ${siteFooter}

      </table>
    </td></tr>
    ${blackBar}
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
