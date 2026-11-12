'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PlusIcon } from 'lucide-react';
import { PillLink } from '@/components/pill-link';
import { localizeHref } from '@/lib/i18n/localize-href';

/**
 * Kapcsolat oldal fejléce (2026-11) — ugyanaz az elrendezés, mint a Szolgáltatások oldal tetején (ServicesIntro):
 * nagy cím (itt ez a h1), alatta 3 oszlop: badge · leírás (a főoldali hero leírásának stílusában) · gombok.
 * A szövegek és a gombok a CMS-es hero blokkból jönnek; a Kapcsolat és a GYIK oldal erre cseréli a hero-t ([slug]/page.tsx).
 */
type CTA = { id?: string; text?: string; URL?: string; target?: string | null };

export function ContactHero({
  heading,
  sub_heading,
  badge_label,
  CTAs,
  locale = 'hu',
  compact = false,
}: {
  heading?: string;
  sub_heading?: string;
  badge_label?: string;
  CTAs?: CTA[];
  locale?: string;
  // hosszabb címhez (pl. GYIK oldal): kisebb betűméret
  compact?: boolean;
}) {
  const ease = [0.33, 1, 0.68, 1] as const;
  const [first, ...rest] = (sub_heading ?? '').split(/(?<=[.!?])\s+/);
  return (
    <section className="w-full px-4 pb-20 pt-20 md:px-8 md:pb-32 md:pt-36">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }}>
        <div className="flex flex-col gap-14 md:gap-24">
          <h1 className={`min-w-0 text-balance font-semibold leading-[0.9] tracking-[-0.05em] text-black ${compact ? 'text-4xl md:text-6xl xl:text-7xl' : 'text-5xl md:text-7xl xl:text-[7.5rem]'}`}>{heading}</h1>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:items-start md:gap-10">
            <div className="flex items-center gap-2 md:pt-1.5">
              <div className="flex h-4 w-4 items-center justify-center rounded-full bg-black">
                <PlusIcon className="h-2.5 w-2.5 text-white" />
              </div>
              <p className="text-sm font-medium text-gray-700">{badge_label || (locale === 'en' ? 'Contact' : 'Kapcsolat')}</p>
            </div>
            {sub_heading ? (
              <p className="indent-12 text-base font-normal leading-relaxed text-black md:text-xl xl:indent-20 xl:text-2xl">
                <span className="font-semibold">{first}</span>
                {rest.length > 0 && <> <span className="font-light text-black/60">{rest.join(' ')}</span></>}
              </p>
            ) : <span />}
            <div className="flex flex-wrap gap-3 md:justify-self-end md:justify-end">
              {(CTAs ?? []).filter((c) => c?.text).map((c) => (
                <PillLink key={c.id ?? c.text} href={c.URL?.startsWith('#') ? c.URL : localizeHref(c.URL, locale)} cta={`contact-hero:${c.text}`}>
                  {c.text as string}
                </PillLink>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
