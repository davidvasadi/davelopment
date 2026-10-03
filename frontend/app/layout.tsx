import type { Viewport } from 'next';
import { Geist } from 'next/font/google';
import Script from 'next/script';
import { headers } from 'next/headers';
import { GoogleAnalytics } from '@next/third-parties/google';

import { Locale, i18n } from '@/i18n.config';

import './globals.css';

import { SlugProvider } from './context/SlugContext';
import { Preview } from '@/components/preview';
import { CookieConsent } from '@/components/toast';
import { ConversionTracker } from '@/components/ga/ConversionTracker';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

const geist = Geist({ subsets: ['latin'], display: 'swap' });

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f5f5' },
    { media: '(prefers-color-scheme: dark)', color: '#f5f5f5' },
  ],
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // a tényleges locale a proxy.ts middleware által beállított headeren jön át
  // (ez a layout a [locale] route-szegmens FÖLÖTT van, nincs params.locale-ja)
  const headerLocale = (await headers()).get('x-locale');
  const lang: Locale = i18n.locales.includes(headerLocale as Locale)
    ? (headerLocale as Locale)
    : i18n.defaultLocale;

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        {/* Google Consent Mode v2 — alapból minden tiltva, amíg a látogató nem dönt.
            Betöltéskor beolvassuk a korábban mentett cookie preferenciát. */}
        <Script id="consent-default" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            var s = null;
            try { s = JSON.parse(localStorage.getItem('davelopment_cookie_consent') || 'null'); } catch (e) {}
            gtag('consent', 'default', {
              analytics_storage:     s && s.analytics ? 'granted' : 'denied',
              ad_storage:            s && s.marketing ? 'granted' : 'denied',
              ad_user_data:          s && s.marketing ? 'granted' : 'denied',
              ad_personalization:    s && s.marketing ? 'granted' : 'denied',
              functionality_storage: 'granted',
              security_storage:      'granted',
              wait_for_update:       500
            });
          `}
        </Script>
      </head>
      <body className={geist.className} suppressHydrationWarning>
        <Preview />
        <CookieConsent />
        <SlugProvider>{children}</SlugProvider>
        {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
        {GA_ID && <ConversionTracker />}
      </body>
    </html>
  );
}
