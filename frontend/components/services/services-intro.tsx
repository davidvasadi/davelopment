'use client';

import React from 'react';
import { Link } from 'next-view-transitions';
import { motion } from 'framer-motion';
import { PlusIcon, Star } from 'lucide-react';
import { PillLink } from '@/components/pill-link';
import { ReviewAvatarStack } from '@/components/google-reviews-section';
import { serviceSummary } from '@/components/services/services-showcase';

/**
 * Szolgáltatások oldal teteje (2026-11, referencia alapján, a mi színeinkkel): a badge a h1 („Szolgáltatások”),
 * alatta nagy cím, alatta rövid szöveg + gomb (egymás alatt, balra). A régi CMS-hero helyett jelenik meg (app/[locale]/(marketing)/services/page.tsx).
 */
function content(hu: boolean) {
  return hu
    ? {
        badge: 'Szolgáltatások',
        heading: 'Öt szolgáltatás,',
        heading2: 'egy csapat.',
        text: 'Stratégia, tervezés, fejlesztés és támogatás weboldalaknak. Akivel az első beszélgetésen találkozol, az viszi végig a projektet — a tervezéstől a fejlesztésig, az indulásig és utána is.',
        cta: 'Kezdjük el a projektet',
        href: '/hu/kapcsolat',
      }
    : {
        badge: 'Services',
        heading: 'Five services,',
        heading2: 'one team.',
        text: 'Strategy, design, build and care for websites. The person on your first call designs and builds the project, until launch and after.',
        cta: 'Start a project',
        href: '/en/contact',
      };
}

/** Értékelés-sor (2026-11): a valós Google-értékelők fotói egymásra csúsztatva, mellettük az értékelések száma,
 *  alatta csillagok és egy mondat. Az adat a napi cache-ből jön (lib/shared/google-rating.ts) — ha nincs, nem jelenik meg. */
type Rating = { rating: number; userRatingCount: number; googleMapsUrl?: string } | null;
function TrustRow({ rating, avatars, hu }: { rating: Rating; avatars: { url: string; name?: string }[]; hu: boolean }) {
  if (!rating) return null;
  return (
    // szándékosan NEM link: fontos helyen van (a hero alatt), ne vigye el a látogatót az oldalról
    <div
      className="inline-flex items-center gap-4 self-start"
      role="img"
      aria-label={hu ? `${rating.rating.toFixed(1).replace('.', ',')} csillag, ${rating.userRatingCount} Google-értékelés` : `${rating.rating.toFixed(1)} stars, ${rating.userRatingCount} Google reviews`}
    >
      <ReviewAvatarStack avatars={avatars} size="lg" tail={`${rating.userRatingCount}+`} />
      <span className="flex min-w-0 flex-col gap-1">
        <span className="flex gap-0.5" aria-hidden="true">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-4 w-4" fill={i < Math.round(rating.rating) ? '#f59e0b' : 'none'} stroke={i < Math.round(rating.rating) ? 'none' : '#f59e0b'} />
          ))}
        </span>
        <span className="whitespace-nowrap text-sm font-medium text-black md:text-base">
          {hu ? 'Országszerte' : 'Trusted by'}{' '}
          <span className="font-normal text-black/50">{hu ? 'bíznak bennünk' : 'clients nationwide'}</span>
        </span>
      </span>
    </div>
  );
}

export function ServicesIntro({ locale = 'hu', rating = null, avatars = [] }: { locale?: string; rating?: Rating; avatars?: { url: string; name?: string }[] }) {
  const c = content(locale !== 'en');
  // az árak nem itt vannak beírva, hanem a bemutató adataiból jönnek (ha ott változik, itt is)
  const items = serviceSummary(locale !== 'en');
  const ease = [0.33, 1, 0.68, 1] as const;
  return (
    <section className="w-full px-4 pb-16 pt-16 md:px-8 md:pb-24 md:pt-28">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }}>
        {/* cím → badge (h1) → szöveg → gomb, egymás alatt */}
        <div className="flex flex-col gap-8 md:gap-10">
          <p className="min-w-0 text-5xl font-semibold leading-[0.9] tracking-[-0.05em] text-black md:text-7xl xl:text-[7.5rem]">
            {c.heading}{' '}
            <br />
            {c.heading2}
          </p>
          {/* alatta 3 oszlop: badge (h1) · szöveg · gomb — mobilon egymás alatt */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:items-start md:gap-10">
            <div className="flex items-center gap-2 md:col-span-3 md:pt-1.5">
              <div className="flex h-4 w-4 items-center justify-center rounded-full bg-black">
                <PlusIcon className="h-2.5 w-2.5 text-white" />
              </div>
              <h1 className="text-sm font-medium text-gray-700">{c.badge}</h1>
            </div>
            {/* a főoldali hero leírásának stílusa: behúzás, első mondat félkövér, a többi vékonyabb és halványabb */}
            {/* a szöveg alatt, vele egy oszlopban: az értékelés-sor */}
            <div className="flex flex-col gap-8 md:col-span-6 md:gap-10">
              {/* a blog-oldal bevezetőjének stílusa: első mondat normál fekete, a folytatás medium szürke */}
              <p className="indent-12 text-2xl font-normal text-black md:indent-20 md:text-3xl">
                {c.text.split('. ')[0]}.
                <span className="font-medium text-black/50"> {c.text.split('. ').slice(1).join('. ')}</span>
              </p>
              <TrustRow rating={rating} avatars={avatars} hu={locale !== 'en'} />
            </div>
            <div className="md:col-span-3 md:justify-self-end">
              <PillLink href={c.href} cta="services-intro:start">{c.cta}</PillLink>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 5 szolgáltatás egy sorban (referencia szerint): felső vonal, oszlopok függőleges elválasztóval,
          sorszám · név · induló ár; mindegyik a saját szolgáltatás-oldalára linkel (belső link — SEO) */}
      {/* MOBIL: rövid áttekintő lista (sorszám · név · induló ár) — a részletes blokkok alatta jönnek, a sor oda ugrik */}
      <nav aria-label={locale === 'en' ? 'Services overview' : 'Szolgáltatások áttekintése'} className="mt-12 border-t border-black sm:hidden">
        <ul>
          {items.map((it, i) => (
            <li key={it.title} className="border-b border-black/10">
              <a href={`#szolgaltatas-${i + 1}`} className="flex items-center gap-4 py-4 active:opacity-60">
                <span className="w-6 shrink-0 text-sm text-black/40">{String(i + 1).padStart(2, '0')}</span>
                <span className="min-w-0 flex-1 truncate text-lg font-semibold tracking-tight text-black">{it.title}</span>
                <span className="shrink-0 text-sm text-black/50">{it.price}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <motion.ul
        className="mt-16 hidden grid-cols-1 border-t border-black/15 sm:grid sm:grid-cols-2 md:mt-24 lg:grid-cols-5"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, delay: 0.1, ease }}
      >
        {items.map((it, i) => (
          <li key={it.title} className={`border-black/10 ${i > 0 ? 'border-t sm:border-t-0 lg:border-l' : ''} ${i % 2 === 1 ? 'sm:border-l' : ''}`}>
            <Link
              href={`/${locale === 'en' ? 'en/services' : 'hu/szolgaltatasok'}/${it.slug}` as never}
              className="group block px-0 py-6 sm:px-6 lg:py-8"
            >
              <span className="text-sm text-black/50">{String(i + 1).padStart(2, '0')}</span>
              <span className="mt-2 block text-xl font-semibold tracking-tight text-black transition-opacity group-hover:opacity-60 md:text-2xl">{it.title}</span>
              <span className="mt-2 block text-sm text-black/50">{it.price}</span>
            </Link>
          </li>
        ))}
      </motion.ul>
    </section>
  );
}
