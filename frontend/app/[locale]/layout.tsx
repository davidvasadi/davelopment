// frontend/app/[locale]/layout.tsx
export const dynamic = 'force-dynamic'

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

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

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
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://davelopment.hu').replace(/\/+$/, '');

  // Fallback hreflang — page-level generateMetadata overrides with exact URLs
  const altLocale = params.locale === 'hu' ? 'en' : 'hu';
  const languages: Record<string, string> = {
    [params.locale]: `${base}/${params.locale}`,
    [altLocale]: `${base}/${altLocale}`,
    'x-default': `${base}/hu`,
  };

  return {
    ...generateMetadataObject(seo),
    metadataBase: new URL(base),
    alternates: {
      canonical: `${base}/${params.locale}`,
      languages,
    },
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
  // a gépes menü személyes kártyája ugyanazt a CMS-adatot mutatja, mint a főoldali hero (egy helyen szerkeszthető)
  const homepage = await fetchContentType('pages', { filters: { slug: 'homepage', locale } }, true).catch(() => null);
  const heroBlock = (homepage?.dynamic_zone ?? []).find((b: any) => b?.person?.name);
  const heroCtas: any[] = heroBlock?.CTAs ?? [];
  const talk = heroCtas.length ? heroCtas[heroCtas.length >= 2 ? 1 : 0] : null;
  const menuPerson = heroBlock?.person?.name
    ? {
        name: heroBlock.person.name as string,
        role: heroBlock.person.role as string | undefined,
        org: heroBlock.person.org as string | undefined,
        image: (heroBlock.person.image?.url ?? null) as string | null,
        cta: talk?.text && talk?.URL ? { text: talk.text as string, URL: talk.URL as string, target: talk.target as string | undefined } : null,
      }
    : null;

  return (
    <ViewTransitions>
      <SmoothScroll>
        <AppWrapper>
          <div className={cn(geist.className, 'bg-[#f5f5f5] antialiased h-full w-full pt-16')}>
            <Navbar data={pageData.navbar} locale={locale} person={menuPerson} />
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