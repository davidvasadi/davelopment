import type { Viewport } from 'next';
import { Geist } from 'next/font/google';

import { Locale, i18n } from '@/i18n.config';

import './globals.css';

import { SlugProvider } from './context/SlugContext';
import { Preview } from '@/components/preview';
import { CookieConsent } from '@/components/toast';

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hu" suppressHydrationWarning>
      <body className={geist.className} suppressHydrationWarning>
        <Preview />
        <CookieConsent /> 
        <SlugProvider>{children}</SlugProvider>
      </body>
    </html>
  );
}
