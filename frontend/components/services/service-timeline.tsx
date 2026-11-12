'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from 'framer-motion';
import type { ServiceDetail } from '@/lib/services/service-details';

/**
 * Szolgáltatás-aloldal: ütemterv-blokk (2026-11, referencia alapján, a mi arculatunkkal).
 * Fázisonként egy sor: balra név · időszak · egy mondat, jobbra sáv a hetek rácsán. Desktopon görgetésre egy narancs
 * „most” jelölő halad végig a heteken; a sávok fekete kitöltése ezzel együtt, folyamatosan nő (mobilon is). Csak transform/opacity animál (GPU). Tartalom: lib/services/service-details.ts.
 */
const ACCENT = '#F05A28';

// Egy fázis sávja: világos bézs alap, rajta fekete kitöltés, ami görgetésre folyamatosan NŐ balról jobbra,
// ahogy a jelölő végighalad a fázis heteinek szakaszán (scaleX — csak transform, GPU).
function Bar({ from, to, weeks, progress }: { from: number; to: number; weeks: number; progress: MotionValue<number> }) {
  const scaleX = useTransform(progress, [from / weeks, to / weeks], [0, 1], { clamp: true });
  // ha a jelölő túlhaladt a fázison, a kitöltés fokozatosan eltűnik → a sáv visszaáll az alap bézsre (az utolsó a végén kitöltve marad)
  const end = to / weeks;
  const opacity = useTransform(progress, [end, Math.min(1, end + 0.12)], [1, end >= 1 ? 1 : 0], { clamp: true });
  return (
    <div
      className="absolute inset-y-1 overflow-hidden rounded-full bg-[#F7F0E7] lg:inset-y-0 lg:rounded-2xl"
      style={{ left: `${(from / weeks) * 100}%`, width: `${((to - from) / weeks) * 100}%` }}
    >
      <motion.div className="absolute inset-0 origin-left bg-black" style={{ scaleX, opacity }} />
    </div>
  );
}

export function ServiceTimeline({ detail }: { detail: ServiceDetail }) {
  const t = detail.timeline;
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.75', 'end 0.6'] });
  const left = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const [pos, setPos] = useState(0); // a jelölő helye hétben (0…weeks)
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const w = Math.round(Math.min(1, Math.max(0, v)) * t.weeks * 4) / 4; // negyedhetes lépés elég a címkéhez
    setPos((p) => (p === w ? p : w));
  });
  const week = Math.min(t.weeks, Math.floor(pos) + 1);
  const ease = [0.33, 1, 0.68, 1] as const;


  return (
    <section className="w-full px-4 py-16 md:px-8 md:py-24">
      <motion.div
        className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-10"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease }}
      >
        <h2 className="min-w-0 flex-1 text-4xl font-semibold leading-[0.95] tracking-[-0.05em] text-black md:text-6xl xl:text-7xl">{t.title}</h2>
        <p className="max-w-md text-base leading-relaxed text-black/70 md:max-w-sm md:shrink-0 md:text-right md:text-lg">{t.sub}</p>
      </motion.div>

      <div ref={ref} className="relative mt-12 md:mt-16">
        {/* fejléc: hetek */}
        <div className="flex border-b border-black/15 pb-3">
          <div className="hidden lg:block lg:w-[30%]" />
          <div className="grid flex-1" style={{ gridTemplateColumns: `repeat(${t.weeks}, minmax(0, 1fr))` }}>
            {Array.from({ length: t.weeks }).map((_, k) => (
              <span key={k} className="pl-3 text-sm text-black/50">{t.weekShort}{k + 1}</span>
            ))}
          </div>
        </div>

        {/* sorok */}
        {t.phases.map((ph) => (
          <div key={ph.title} className="flex flex-col gap-4 border-b border-black/10 py-8 lg:flex-row lg:items-center lg:gap-0">
            <div className="lg:w-[30%] lg:pr-8">
              <h3 className="text-xl font-semibold tracking-tight text-black md:text-2xl">{ph.title}</h3>
              <p className="mt-1 text-sm text-black/50">{ph.when}</p>
              <p className="mt-3 max-w-sm text-base leading-relaxed text-black">{ph.text}</p>
            </div>
            {/* mobilon a sáv alatt szürke „pálya” (mint a referencián), desktopon csak a rács */}
            <div className="relative h-12 w-full shrink-0 bg-black/[0.06] lg:h-20 lg:w-auto lg:flex-1 lg:bg-transparent">
              {/* heti rácsvonalak */}
              <div aria-hidden className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${t.weeks}, minmax(0, 1fr))` }}>
                {Array.from({ length: t.weeks }).map((_, k) => <span key={k} className="border-l border-black/10 lg:border-black/[0.07]" />)}
              </div>
              <Bar from={ph.from} to={ph.to} weeks={t.weeks} progress={scrollYProgress} />
            </div>
          </div>
        ))}

        {/* „most” jelölő — desktopon, a hetek sávja fölött végighúzódva */}
        <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:flex">
          <div className="w-[30%]" />
          <div className="relative flex-1">
            <motion.div className="absolute -top-2 bottom-0" style={{ left }}>
              <span className="absolute left-0 top-0 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold text-white" style={{ backgroundColor: ACCENT }}>
                {t.weekLabel.replace('{n}', String(week))}
              </span>
              <span className="absolute bottom-0 left-0 top-6 w-px -translate-x-1/2" style={{ backgroundColor: ACCENT }} />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
