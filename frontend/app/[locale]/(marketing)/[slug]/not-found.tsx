import { headers } from 'next/headers';
import Link from 'next/link';
import { Container } from '@/components/container';

// Nem 'use client': a usePathname() hook megbízhatatlan egy not-found.tsx
// boundary-ban (ahogy a params sem jut el ide megbízhatóan) — ehelyett a
// proxy.ts middleware által beállított x-locale headerből olvassuk ki a
// nyelvet, ugyanazzal a mintával mint a gyökér layout.tsx.
export default async function NotFound() {
  const headerLocale = (await headers()).get('x-locale');
  const isHu = headerLocale !== 'en';
  const locale = isHu ? 'hu' : 'en';

  const t = isHu
    ? {
        eyebrow: '404 — Az oldal nem található',
        heading: 'Ez az oldal nem (vagy már nem) létezik.',
        body: 'Lehet, hogy elgépelted a címet, vagy a tartalom időközben átköltözött. Innen biztosan továbbjutsz:',
        home: 'Vissza a főoldalra',
        blog: 'Blog cikkek',
        contact: 'Kapcsolat',
      }
    : {
        eyebrow: '404 — Page not found',
        heading: "This page doesn't exist (anymore).",
        body: 'The link may be broken, or the content has moved. Here are some good places to go instead:',
        home: 'Back to homepage',
        blog: 'Blog articles',
        contact: 'Contact us',
      };

  return (
    <Container className="px-6 py-32 md:py-40 text-center max-w-2xl mx-auto">
      <p className="text-sm font-medium tracking-wide uppercase text-neutral-400 mb-4">
        {t.eyebrow}
      </p>
      <h1 className="text-3xl md:text-4xl font-semibold text-black mb-4">
        {t.heading}
      </h1>
      <p className="text-neutral-500 mb-10">{t.body}</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center rounded-full bg-black text-white px-5 py-2.5 text-sm font-medium hover:opacity-80 transition-opacity"
        >
          {t.home}
        </Link>
        <Link
          href={`/${locale}/blog`}
          className="inline-flex items-center rounded-full border border-black/15 px-5 py-2.5 text-sm font-medium text-black hover:bg-black/5 transition-colors"
        >
          {t.blog}
        </Link>
        <Link
          href={isHu ? '/hu/kapcsolat' : '/en/contact'}
          className="inline-flex items-center rounded-full border border-black/15 px-5 py-2.5 text-sm font-medium text-black hover:bg-black/5 transition-colors"
        >
          {t.contact}
        </Link>
      </div>
    </Container>
  );
}
