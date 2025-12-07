import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n } from '@/i18n.config';

// PUBLIC FILE REGEX (pl. .js, .css, .png, .jpg, .svg, .woff2, stb.)
const PUBLIC_FILE = /\.(.*)$/;

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

  // --------- 💥 FIX 1: statikus, belső, public fájlok átengedése ---------
  if (
    pathname.startsWith('/_next') ||       // Next.js static / image / chunks / RSC / stb.
    pathname.startsWith('/api') ||         // API
    PUBLIC_FILE.test(pathname) ||          // .js .css .png stb.
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/manifest.webmanifest'
  ) {
    return NextResponse.next();
  }

  // --------- FIX 2: ha már van locale, ne irányítsuk át újra ---------
  const isAlreadyLocalized = i18n.locales.some(
    (locale) =>
      pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (isAlreadyLocalized) {
    return NextResponse.next();
  }

  // --------- FIX 3: hiányzó locale → default locale prepend ---------
  const locale = getLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`;
  return NextResponse.redirect(url);
}

// --------- FIX 4: matcher → csak "valódi oldalakra" fusson ---------
export const config = {
  matcher: ['/((?!_next/|api/|.*\\..*).*)'],
};
