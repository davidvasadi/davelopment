// frontend/app/[locale]/layout.tsx

import type { Metadata } from 'next';
import { ViewTransitions } from 'next-view-transitions';
import { Geist } from 'next/font/google';
import { draftMode } from 'next/headers';
import React from 'react';
import { DraftModeBanner } from '@/components/draft-mode-banner';
import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { generateMetadataObject } from '@/lib/shared/metadata';
import fetchContentType from '@/lib/strapi/fetchContentType';
import { cn } from '@/lib/utils';
import { SmoothScroll, ScrollToTop } from '@/components/ui/smooth-scroll';
import { AppWrapper, PageTransition } from '@/components/ui/preloader';
import { BlurFooter } from '@/components/ui/blur-footer';
import { locales } from '@/config';

const geist = Geist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist',
});

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const params = await props.params;

  if (!locales.includes(params.locale as any)) return {};

  const pageData = await fetchContentType(
    'global',
    { filters: { locale: params.locale }, populate: 'seo' },
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

  if (!locales.includes(locale as any)) return <>{children}</>;

  const pageData = await fetchContentType('global', { filters: { locale } }, true);

  return (
    <ViewTransitions>
      <SmoothScroll>
        <AppWrapper>
          <div className={cn(geist.className, 'bg-[#f5f5f5] antialiased h-full w-full pt-16')}>
            <Navbar data={pageData.navbar} locale={locale} />
            <PageTransition>
              <ScrollToTop />
              {children}
            </PageTransition>
            <Footer data={pageData.footer} locale={locale} />
            <BlurFooter />
            {isDraftMode && <DraftModeBanner />}
          </div>
        </AppWrapper>
      </SmoothScroll>
    </ViewTransitions>
  );
}