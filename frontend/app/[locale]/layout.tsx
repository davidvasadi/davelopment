import type { Metadata } from 'next';
import { ViewTransitions } from 'next-view-transitions';
import { Inter } from 'next/font/google';
import { draftMode } from 'next/headers';
import React from 'react';
import { DraftModeBanner } from '@/components/draft-mode-banner';
import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { AIToast } from '@/components/toast';
import { CartProvider } from '@/context/cart-context';
import { generateMetadataObject } from '@/lib/shared/metadata';
import fetchContentType from '@/lib/strapi/fetchContentType';
import { cn } from '@/lib/utils';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
});

// Globális (default) SEO – oldalak, ahol nincs külön SEO
export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const params = await props.params;

  const pageData = await fetchContentType(
    'global',
    { filters: { locale: params.locale }, populate: 'seo.metaImage' },
    true
  );

  const seo = pageData?.seo;
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return {
    ...generateMetadataObject(seo),
    metadataBase: new URL(base),
  };
}

export default async function LocaleLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;
  const { locale } = params;
  const { children } = props;

  const { isEnabled: isDraftMode } = await draftMode();

  const pageData = await fetchContentType('global', { filters: { locale } }, true);

  return (
    <ViewTransitions>
      {/* <CartProvider> */}
        <div className={cn(inter.className, 'bg-[#f5f5f5] antialiased h-full w-full pt-16')}>
          <Navbar data={pageData.navbar} locale={locale} />
          {children}
          <Footer data={pageData.footer} locale={locale} />
          {/* <AIToast /> */}
          {isDraftMode && <DraftModeBanner />}
        </div>
      {/* </CartProvider> */}
    </ViewTransitions>
  );
}
