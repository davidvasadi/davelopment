// frontend/app/[locale]/unsubscribe/page.tsx

import { Metadata } from 'next';

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  return {
    title: locale === 'en' ? 'Unsubscribe – Davelopment' : 'Leiratkozás – Davelopment',
    robots: { index: false },
  };
}

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

async function unsubscribe(id: string): Promise<'ok' | 'already' | 'error'> {
  try {
    const res = await fetch(`${STRAPI_URL}/api/communications/unsubscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
      cache: 'no-store',
    });
    const data = await res.json();
    if (!res.ok) return 'error';
    if (data.alreadyUnsubscribed) return 'already';
    return 'ok';
  } catch {
    return 'error';
  }
}

export default async function UnsubscribePage(props: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ id?: string }>;
}) {
  const { locale } = await props.params;
  const { id } = await props.searchParams;
  const isHu = locale !== 'en';

  let status: 'ok' | 'already' | 'error' | 'missing' = 'missing';
  if (id) {
    status = await unsubscribe(id);
  }

  type StatusKey = 'ok' | 'already' | 'error' | 'missing';

  const content: Record<StatusKey, { title: string; text: string; accent: string; iconPath: string }> = {
    ok: {
      title: isHu ? 'Sikeresen leiratkoztál' : 'Successfully unsubscribed',
      text: isHu
        ? 'Eltávolítottunk a hírlevelünk listájáról. Sajnáljuk, hogy itt hagysz!'
        : "You've been removed from our mailing list. Sorry to see you go!",
      accent: '#1a7f37',
      iconPath: 'M20 6 9 17 4 12',
    },
    already: {
      title: isHu ? 'Már leiratkoztál' : 'Already unsubscribed',
      text: isHu
        ? 'Ez az email cím korábban már le lett iratkozva a listánkról.'
        : 'This email address has already been unsubscribed from our list.',
      accent: '#9a6700',
      iconPath: 'M20 6 9 17 4 12',
    },
    error: {
      title: isHu ? 'Valami hiba történt' : 'Something went wrong',
      text: isHu
        ? 'Kérjük, próbáld újra később, vagy írj nekünk: hello@davelopment.hu'
        : 'Please try again later or contact us at hello@davelopment.hu',
      accent: '#cf222e',
      iconPath: 'M18 6 6 18M6 6l12 12',
    },
    missing: {
      title: isHu ? 'Érvénytelen link' : 'Invalid link',
      text: isHu
        ? 'Ez a leiratkozási link érvénytelen vagy lejárt. Ellenőrizd az emailben kapott linket.'
        : 'This unsubscribe link is invalid or has expired. Please check the link from your email.',
      accent: '#cf222e',
      iconPath: 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01',
    },
  };

  const c = content[status];
  const homeLabel = isHu ? 'Vissza a főoldalra' : 'Back to homepage';
  const homeHref = isHu ? '/hu' : '/en';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #fafafa; }
        @media (prefers-color-scheme: dark) {
          body { background: #030712; }
          .unsub-bg { background: #030712 !important; }
          .unsub-card { background: #0d1117 !important; border-color: #21262d !important; box-shadow: 0 0 0 1px rgba(240,246,252,0.04), 0 8px 32px rgba(0,0,0,0.6) !important; }
          .unsub-brand { color: #f0f6fc !important; }
          .unsub-divider { border-color: #21262d !important; }
          .unsub-title { color: #f0f6fc !important; }
          .unsub-text { color: #8b949e !important; }
          .unsub-btn { background: #f0f6fc !important; color: #030712 !important; }
          .unsub-btn:hover { background: #c9d1d9 !important; }
          .unsub-badge { background: rgba(255,255,255,0.04) !important; border-color: #21262d !important; color: #484f58 !important; }
          .unsub-icon-wrap { background: rgba(255,255,255,0.04) !important; border-color: #21262d !important; }
          .unsub-meta { color: #484f58 !important; }
        }
      `}</style>
      <div className="unsub-bg" style={{
        minHeight: '100vh',
        background: '#fafafa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}>
        <div style={{ width: '100%', maxWidth: '440px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Card */}
          <div className="unsub-card" style={{
            background: '#ffffff',
            border: '0.5px solid rgba(15,23,42,0.09)',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 0 0 1px rgba(15,23,42,0.06), 0 4px 20px rgba(15,23,42,0.08)',
          }}>
            {/* Header */}
            <div style={{
              padding: '20px 24px 18px',
              borderBottom: '1px solid rgba(15,23,42,0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div className="unsub-brand" style={{
                fontSize: '14px',
                fontWeight: 600,
                letterSpacing: '0.3px',
                color: '#0b1220',
                fontFamily: "'Geist Mono', monospace",
              }}>
                [davelopment]®
              </div>
              <div className="unsub-badge" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '3px 9px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: 500,
                background: 'rgba(15,23,42,0.04)',
                border: '0.5px solid rgba(15,23,42,0.09)',
                color: 'rgba(17,24,39,0.40)',
                fontFamily: "'Geist Mono', monospace",
              }}>
                newsletter
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: '32px 24px 28px' }}>
              {/* Icon */}
              <div className="unsub-icon-wrap" style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: `${c.accent}10`,
                border: `0.5px solid ${c.accent}28`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {status === 'missing' ? (
                    <>
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                      <line x1="12" y1="9" x2="12" y2="13"/>
                      <line x1="12" y1="17" x2="12.01" y2="17"/>
                    </>
                  ) : status === 'error' ? (
                    <>
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </>
                  ) : (
                    <polyline points="20 6 9 17 4 12"/>
                  )}
                </svg>
              </div>

              {/* Title */}
              <div className="unsub-title" style={{
                fontSize: '17px',
                fontWeight: 600,
                color: '#0b1220',
                marginBottom: '8px',
                letterSpacing: '-0.3px',
                lineHeight: 1.3,
              }}>
                {c.title}
              </div>

              {/* Text */}
              <div className="unsub-text" style={{
                fontSize: '13px',
                color: 'rgba(17,24,39,0.58)',
                lineHeight: 1.65,
                marginBottom: '28px',
              }}>
                {c.text}
              </div>

              {/* Status row */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 12px',
                background: `${c.accent}08`,
                border: `0.5px solid ${c.accent}22`,
                borderRadius: '9px',
                marginBottom: '20px',
              }}>
                <div style={{
                  width: '6px', height: '6px',
                  borderRadius: '50%',
                  background: c.accent,
                  flexShrink: 0,
                }} />
                <span style={{
                  fontSize: '12px',
                  color: c.accent,
                  fontWeight: 500,
                  fontFamily: "'Geist Mono', monospace",
                }}>
                  {status === 'ok' && (isHu ? 'leiratkozás sikeres' : 'unsubscribed successfully')}
                  {status === 'already' && (isHu ? 'már leiratkozott' : 'already unsubscribed')}
                  {status === 'error' && (isHu ? 'hiba történt' : 'an error occurred')}
                  {status === 'missing' && (isHu ? 'érvénytelen azonosító' : 'invalid token')}
                </span>
              </div>

              {/* CTA Button */}
              <a className="unsub-btn" href={homeHref} style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 18px',
                background: '#0b1220',
                color: '#ffffff',
                borderRadius: '9px',
                textDecoration: 'none',
                fontSize: '13px',
                fontWeight: 500,
                letterSpacing: '0.1px',
                transition: 'opacity 140ms',
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
                {homeLabel}
              </a>
            </div>
          </div>

          {/* Footer meta */}
          <div className="unsub-meta" style={{
            textAlign: 'center',
            fontSize: '11px',
            color: 'rgba(17,24,39,0.30)',
            fontFamily: "'Geist Mono', monospace",
            letterSpacing: '0.2px',
          }}>
            davelopment.hu · hello@davelopment.hu
          </div>
        </div>
      </div>
    </>
  );
}
