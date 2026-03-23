import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n } from '@/i18n.config';
import { localeSegments } from '@/lib/i18n/segments';

function getLocale(request: NextRequest): string {
  const headers = Object.fromEntries(request.headers);
  const accept = headers['accept-language'] ?? '';

  let languages: string[] = [];
  if (accept) {
    try {
      languages = new Negotiator({ headers }).languages();
    } catch {
      languages = [];
    }
  }

  if (!Array.isArray(languages) || languages.length === 0) {
    return i18n.defaultLocale;
  }

  try {
    // @ts-ignore
    return matchLocale(languages, i18n.locales, i18n.defaultLocale);
  } catch {
    return i18n.defaultLocale;
  }
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  /**
   * STEP 0 — API és belső route-ok teljes kizárása
   * Production SSR fetch néha átmegy a middleware-en,
   * ezért explicit kizárjuk ezeket.
   */
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/uploads') ||
    pathname.startsWith('/admin')
  ) {
    return NextResponse.next();
  }

  /**
   * STEP 1 — Locale hiányzik → redirect /{locale}/...
   */
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);

    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`,
        request.url
      )
    );
  }

  /**
   * STEP 2 — Segment lokalizáció
   * /{locale}/{segment}(/{slug})?
   */
  const match = pathname.match(/^\/([a-z]{2})\/([^/]+)(\/.*)?$/);

  if (match) {
    const [, locale, segment, rest = ''] = match;

    const segmentMap = localeSegments[locale] ?? {};

    /**
     * /hu/projektek → rewrite → /hu/products
     */
    const internal = Object.entries(segmentMap).find(
      ([, v]) => v === segment
    )?.[0];

    if (internal) {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/${internal}${rest}`;
      return NextResponse.rewrite(url);
    }

    /**
     * /hu/products → redirect → /hu/projektek
     */
    const localized = segmentMap[segment];

    if (localized) {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/${localized}${rest}`;
      return NextResponse.redirect(url, 301);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest|opengraph-image|twitter-image|icon|apple-icon).*)',
  ],
};