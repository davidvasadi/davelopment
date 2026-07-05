// frontend/app/[locale]/newsletter/page.tsx
import { Metadata } from 'next';

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  return {
    title: locale === 'en' ? 'Newsletter – [davelopment]®' : 'Hírlevél – [davelopment]®',
    robots: { index: false },
  };
}

const PAYLOAD_URL = (
  process.env.NEXT_PUBLIC_PAYLOAD_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:1337'
).replace(/\/+$/, '');

type Result = 'ok' | 'already' | 'error' | 'no-email';

async function subscribe(email: string, locale: string, source: string): Promise<Result> {
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'no-email';
  try {
    const res = await fetch(`${PAYLOAD_URL}/api/newsletters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, language: locale, source: source || 'newsletter-page' }),
      cache: 'no-store',
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) return 'ok';
    // Duplicate detection — Payload returns a localized unique-constraint error on `email`.
    const raw = JSON.stringify(data ?? {}).toLowerCase();
    if (raw.includes('unique') || raw.includes('already') || raw.includes('egyedi') || raw.includes('érvénytelen')) return 'already';
    return 'error';
  } catch {
    return 'error';
  }
}

export default async function NewsletterPage(props: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ email?: string; src?: string }>;
}) {
  const { locale } = await props.params;
  const { email = '', src = '' } = await props.searchParams;
  const isHu = locale !== 'en';
  const result = await subscribe(decodeURIComponent(email), locale, src);

  const t = {
    ok: {
      badge: isHu ? 'Feliratkozás sikeres' : 'Subscription confirmed',
      title: isHu ? 'Köszönjük a feliratkozást!' : 'Thanks for subscribing!',
      body: isHu
        ? 'A 10% kedvezményed aktiválva — az első közös projekted árából beszámítjuk. Hamarosan jelentkezünk, és küldünk hasznos digitális tippeket is.'
        : "Your 10% discount is active — we'll apply it to your first project with us. We'll be in touch, and send useful digital tips along the way.",
    },
    already: {
      badge: isHu ? 'Már feliratkoztál' : 'Already subscribed',
      title: isHu ? 'Erre az e-mailre már feliratkoztál' : "You're already subscribed",
      body: isHu
        ? 'A kedvezményed természetesen érvényes marad. Köszönjük, hogy velünk vagy!'
        : 'Your discount still applies, of course. Thanks for being with us!',
    },
    error: {
      badge: isHu ? 'Hiba' : 'Error',
      title: isHu ? 'Valami félrement' : 'Something went wrong',
      body: isHu
        ? 'A feliratkozás most nem sikerült. Kérlek próbáld újra később, vagy írj a hello@davelopment.hu címre.'
        : 'The subscription failed. Please try again later, or email hello@davelopment.hu.',
    },
    'no-email': {
      badge: isHu ? 'Hírlevél' : 'Newsletter',
      title: isHu ? 'Hiányzó e-mail cím' : 'Missing email address',
      body: isHu
        ? 'A feliratkozáshoz nyisd meg a linket az e-mailünkből, vagy írj a hello@davelopment.hu címre.'
        : 'Open the link from our email to subscribe, or email hello@davelopment.hu.',
    },
    // Email clients often PREFETCH the link (subscribing before the user clicks), so a real
    // click then hits the unique constraint. From the user's view they are subscribed either
    // way + get the discount — always show the success page, never a confusing "already" text.
  }[result === 'already' ? 'ok' : result];

  const F = "Geist,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

  return (
    <main
      style={{ minHeight: '100vh', background: '#ffffff', fontFamily: F }}
      className="flex items-center justify-center px-6 py-24"
    >
      <div style={{ maxWidth: 460 }} className="w-full text-center">
        <div className="inline-flex items-center gap-2 mb-8">
          <span style={{ fontSize: 15, fontWeight: 700, color: '#1d1d1f', letterSpacing: '-0.2px' }}>[davelopment]®</span>
        </div>
        <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.6px', textTransform: 'uppercase', color: '#86868b', margin: '0 0 12px' }}>
          {t.badge}
        </p>
        <h1 style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-0.6px', lineHeight: 1.15, color: '#1d1d1f', margin: '0 0 16px' }}>
          {t.title}
        </h1>
        <p style={{ fontSize: 15, lineHeight: 1.65, color: '#6e6e73', margin: '0 0 32px' }}>
          {t.body}
        </p>
        <a
          href={`/${locale}`}
          style={{ display: 'inline-block', background: '#1d1d1f', color: '#fff', fontWeight: 600, fontSize: 14, padding: '13px 30px', borderRadius: 999, textDecoration: 'none' }}
        >
          {isHu ? 'Vissza a főoldalra' : 'Back to homepage'}
        </a>
      </div>
    </main>
  );
}
