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
import { SmoothScroll } from '@/components/ui/smooth-scroll';
import { AppWrapper, PageTransition } from '@/components/ui/preloader';

const geist = Geist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist',
});

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const params = await props.params;

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

  const pageData = await fetchContentType('global', { filters: { locale } }, true);

  return (
    <ViewTransitions>
      <SmoothScroll>
        <AppWrapper>
          <div className={cn(geist.className, 'bg-[#f5f5f5] antialiased h-full w-full pt-16')}>

            {/* Navbar — kívül marad, NEM animálódik oldalváltáskor */}
            <Navbar data={pageData.navbar} locale={locale} />

            {/* PageTransition — CSAK a children köré, Navbar/Footer érintetlen marad */}
            <PageTransition>
              {children}
            </PageTransition>

            {/* Footer — kívül marad, NEM animálódik oldalváltáskor */}
            <Footer data={pageData.footer} locale={locale} />

            {isDraftMode && <DraftModeBanner />}
          </div>
        </AppWrapper>
      </SmoothScroll>
    </ViewTransitions>
  );
}
