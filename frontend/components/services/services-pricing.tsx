'use client';

import React from 'react';
import { Link } from 'next-view-transitions';
import { motion } from 'framer-motion';
import { PillLink } from '@/components/pill-link';
import { GrainCanvas } from '@/components/ui/grain-canvas';

/**
 * Szolgáltatások oldal: sötét árkártya (2026-11, referencia alapján, a mi színeinkkel — a sötét kártya és a
 * kiemelés ugyanaz, mint a CTA blokkban). Balra cím + gombok, jobbra a csomagok listája induló árral.
 * Az árak a főoldali árazással egyeznek (components/dynamic-zone/pricing-simple.tsx) — ha ott változnak, itt is kell.
 */
function content(hu: boolean) {
  return hu
    ? {
        heading: 'Fix ár,',
        highlight: 'még a munka előtt.',
        cta: 'Foglalj egy 30 perces beszélgetést',
        ctaHref: '/hu/kapcsolat',
        more: 'Részletes árak',
        moreHref: '/hu/arak',
        rows: [
          { title: 'Üzleti weboldal', meta: '1–4 hét', price: '190 000 Ft', suffix: '-tól' },
          { title: 'Weboldal + marketing', meta: '4–6 hét', price: '330 000 Ft', suffix: '-tól' },
          { title: 'Egyedi fejlesztés', meta: 'Közösen felmérve', price: '550 000 Ft', suffix: '-tól' },
          { title: 'Támogatás', meta: 'Havonta megújuló', price: '29 900 Ft', suffix: '/hó-tól' },
        ],
        note: 'Minden projekt írásos, fix árajánlatot kap a 30 perces beszélgetés után.',
        reply: 'Egy munkanapon belül válaszolunk.',
      }
    : {
        heading: 'A fixed price,',
        highlight: 'agreed up front.',
        cta: 'Book the 30-minute call',
        ctaHref: '/en/contact',
        more: 'Pricing in full',
        moreHref: '/en/pricing',
        rows: [
          { title: 'Business website', meta: '1–4 weeks', price: '190,000 HUF', suffix: 'from' },
          { title: 'Website + marketing', meta: '4–6 weeks', price: '330,000 HUF', suffix: 'from' },
          { title: 'Custom build', meta: 'Scoped together', price: '550,000 HUF', suffix: 'from' },
          { title: 'Care plans', meta: 'Rolling monthly', price: '29,900 HUF', suffix: 'from', per: '/month' },
        ],
        note: 'Every project gets a written, fixed quote after the 30-minute call.',
        reply: 'Replies within one working day.',
      };
}

export function ServicesPricing({ locale = 'hu' }: { locale?: string }) {
  const hu = locale !== 'en';
  const c = content(hu);
  const ease = [0.33, 1, 0.68, 1] as const;
  return (
    <section className="w-full px-4 py-12 md:px-8 md:py-20">
      <motion.div
        className="relative grid grid-cols-1 gap-12 overflow-hidden rounded-card bg-[#080809] p-6 text-white md:p-12 lg:grid-cols-12 lg:gap-16"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease }}
      >
        {/* háttér: ugyanaz a kép + szemcse, mint a régi (Árak oldali) árazás blokké */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/fallback/section-background.jpg"
          alt=""
          aria-hidden
          loading="lazy"
          className="absolute inset-0 z-0 h-full w-full object-cover"
          style={{ filter: 'brightness(1.15)' }}
        />
        <GrainCanvas strength="light" opacity={0.5} zIndex={1} />

        {/* Bal: cím fent, gombok lent */}
        <div className="relative z-10 flex flex-col justify-between gap-10 lg:col-span-6">
          <h2 className="text-5xl font-semibold leading-[0.95] tracking-[-0.04em] md:text-7xl">
            {c.heading}{' '}
            <br />
            <span className="text-white/50">{c.highlight}</span>
          </h2>
          <div className="flex flex-wrap items-center gap-6">
            <PillLink href={c.ctaHref} accent cta="services-pricing:call">{c.cta}</PillLink>
            <Link href={c.moreHref as never} className="border-b-2 border-white pb-0.5 text-sm font-semibold text-white transition-opacity hover:opacity-60 md:text-base">
              {c.more}
            </Link>
          </div>
        </div>

        {/* Jobb: csomagok listája */}
        <div className="relative z-10 lg:col-span-6">
          <ul className="border-t border-white/10">
            {c.rows.map((r) => (
              <li key={r.title} className="flex items-end justify-between gap-6 border-b border-white/10 py-6 md:py-8">
                <div>
                  <h3 className="text-lg font-medium md:text-xl">{r.title}</h3>
                  <p className="mt-2 font-mono text-sm text-white/50">{r.meta}</p>
                </div>
                <p className="flex shrink-0 items-baseline gap-2 text-right">
                  {!hu && <span className="font-mono text-sm text-white/50">{r.suffix}</span>}
                  <span className="text-3xl font-semibold tracking-[-0.04em] md:text-5xl">{r.price}</span>
                  {hu && <span className="text-base text-white/60">{r.suffix}</span>}
                  {!hu && 'per' in r && <span className="text-base text-white/60">{(r as { per?: string }).per}</span>}
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-col gap-3 text-sm text-white/70 md:flex-row md:items-end md:justify-between md:gap-8 md:text-base">
            <p className="max-w-md">{c.note}</p>
            <p className="flex shrink-0 items-center gap-2">
              <span aria-hidden className="relative inline-flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF7A3D] opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#FF7A3D]" />
              </span>
              {c.reply}
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
