'use client';

import React from 'react';
import { Link } from 'next-view-transitions';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { PillLink } from '@/components/pill-link';
import { GrainCanvas } from '@/components/ui/grain-canvas';
import type { ServiceDetail } from '@/lib/services/service-details';

/**
 * Szolgáltatás-aloldal vége (2026-11, referencia alapján, a mi stílusunkkal): sötét CTA-kártya (mint a főoldali CTA:
 * #080809 + szemcse, a cím második sora halványabb), alatta fehér „Következő szolgáltatás” kártya nyíllal.
 */
// A sötét „Kezdjük egy 30 perces beszélgetéssel” kártya — a szolgáltatás-aloldalak végén és önálló blokkként is (CallCta)
function CallCtaCard({ hu }: { hu: boolean }) {
  const ease = [0.33, 1, 0.68, 1] as const;
  return (
      <motion.div
        className="relative grid min-h-[480px] grid-cols-1 items-end gap-10 overflow-hidden rounded-card bg-[#080809] p-6 text-white md:min-h-[560px] md:p-12 lg:grid-cols-2"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease }}
      >
        <GrainCanvas strength="light" opacity={0.45} zIndex={0} />
        <h2 className="relative z-10 text-5xl font-semibold leading-[0.95] tracking-[-0.05em] md:text-7xl">
          {hu ? 'Kezdjük egy' : 'Start with a'}{' '}
          <br />
          <span className="text-white/50">{hu ? '30 perces beszélgetéssel.' : '30-minute call.'}</span>
        </h2>
        <div className="relative z-10 lg:pb-2">
          <p className="max-w-lg text-base leading-relaxed text-white/70 md:text-lg">
            {hu
              ? 'Mesélj a mostani oldaladról és arról, amire szükséged van. Egy héten belül írásos ajánlatot kapsz, fix árral és dátumokkal.'
              : 'Tell us about the site you have and the one you need. You get a written proposal with a fixed price and dates within a week.'}
          </p>
          <PillLink href={hu ? '/hu/kapcsolat' : '/en/contact'} accent className="mt-8" cta="service-end:call">
            {hu ? 'Foglalj időpontot' : 'Book the call'}
          </PillLink>
          <p className="mt-8 flex items-center gap-2 text-sm text-white/80">
            <span aria-hidden className="relative inline-flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF7A3D] opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#FF7A3D]" />
            </span>
            {hu ? 'Egy munkanapon belül válaszolunk' : 'Replies within one working day'}
          </p>
        </div>
      </motion.div>
  );
}

/** Önálló CTA-blokk (pl. a GYIK oldalon az űrlap helyett) — csak frontend-oldali blokktípus: 'call-cta'. */
export function CallCta({ locale = 'hu' }: { locale?: string }) {
  return (
    <section className="w-full px-4 py-12 md:px-8 md:py-20">
      <CallCtaCard hu={locale !== 'en'} />
    </section>
  );
}

export function ServiceEnd({ detail, locale = 'hu' }: { detail: ServiceDetail; locale?: string }) {
  const hu = locale !== 'en';
  const ease = [0.33, 1, 0.68, 1] as const;
  const nextHref = `/${hu ? 'hu/szolgaltatasok' : 'en/services'}/${detail.next.slug}`;
  return (
    <section className="w-full px-4 pb-12 pt-6 md:px-8 md:pb-20">
      <CallCtaCard hu={hu} />

      <Link
        href={nextHref as never}
        className="group mt-2 flex items-center justify-between gap-6 rounded-card border border-black/10 bg-white p-6 md:mt-3 md:p-10"
      >
        <span className="flex flex-col gap-2 md:flex-row md:items-center md:gap-10">
          <span className="text-sm text-black/50">{hu ? 'Következő szolgáltatás' : 'Next service'}</span>
          <span className="text-4xl font-semibold tracking-[-0.05em] text-black transition-opacity group-hover:opacity-60 md:text-6xl">{detail.next.title}</span>
        </span>
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-black text-white transition-transform duration-300 group-hover:translate-x-1 md:h-16 md:w-16">
          <ArrowRight className="h-5 w-5" />
        </span>
      </Link>
    </section>
  );
}
