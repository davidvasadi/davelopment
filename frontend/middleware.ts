import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n } from '@/i18n.config';

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
    // @ts-ignore i18n.locales readonly – csak olvassuk
    return matchLocale(languages, i18n.locales, i18n.defaultLocale);
  } catch {
    return i18n.defaultLocale;
  }
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Ha már lokálos, ne irányítsunk át
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    return NextResponse.redirect(
      new URL(`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url)
    );
  }
}

// Hagyjuk békén a statikus és SEO útvonalakat
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest|opengraph-image|twitter-image|icon|apple-icon).*)',
  ],
};
