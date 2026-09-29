'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'next-view-transitions';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { Button } from '../elements/button';
import { strapiImage } from '@/lib/strapi/strapiImage';
import { GrainCanvas } from '../ui/grain-canvas';
import { usePreloaderDone } from '../ui/preloader';

type CTA = {
  id: string | number;
  text: string;
  URL: string;
  variant?: string;
  target?: '_self' | '_blank';
};

type Stat = {
  mark_text?: string | null;
  label?: string | null;
  description?: string | null;
  value?: string | null;
} | null;

type Media = { url?: string } | string | null;

export type ServiceHeroProps = {
  heading: string;
  sub_heading?: string | null;
  badge_label?: string | null;
  CTAs?: CTA[] | null;
  locale: string;
  video?: Media;
  video_poster?: Media;
  stat?: Stat;
};

const toAbs = (m?: Media) => {
  const raw = typeof m === 'string' ? m : m?.url || '';
  return raw ? strapiImage(raw) : undefined;
};

const resolveHref = (locale: string, url?: string) => {
  if (!url) return '#';
  if (url.startsWith('http') || url.startsWith('#')) return url;
  return `/${locale}${url}`;
};

// Számláló animáció: a "value" elején lévő számot 0-ból felszámolja, a
// mögötte lévő nem-szám résztet (%, +, /7 stb.) változatlanul hagyja.
function AnimatedStatValue({ value }: { value?: string | null }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  // A hero a lap tetején van, tehát "inView" gyakorlatilag azonnal igaz —
  // de a preloader / oldalváltás-függöny ilyenkor még takarja a tartalmat,
  // így a számolás láthatatlanul lefutna. Megvárjuk a preloadert, plusz egy
  // kis pufferidőt (az oldalváltás-függöny is kb. eddig tart), mielőtt
  // ténylegesen elindul a számlálás.
  const preloaderDone = usePreloaderDone();
  const [display, setDisplay] = useState(0);

  const match = (value || '').match(/^(\d+(?:[.,]\d+)?)(.*)$/);
  const target = match ? parseFloat(match[1].replace(',', '.')) : null;
  const suffix = match ? match[2] : (value || '');

  useEffect(() => {
    if (!inView || !preloaderDone || target === null) return;
    let timer: ReturnType<typeof setInterval>;
    const startTimeout = setTimeout(() => {
      let start = 0;
      const duration = 1200;
      const step = target / (duration / 16);
      timer = setInterval(() => {
        start += step;
        if (start >= target) {
          setDisplay(target);
          clearInterval(timer);
        } else {
          setDisplay(Math.floor(start));
        }
      }, 16);
    }, 250);
    return () => {
      clearTimeout(startTimeout);
      clearInterval(timer);
    };
  }, [inView, preloaderDone, target]);

  if (target === null) return <span ref={ref}>{value}</span>;
  return (
    <>
      <span ref={ref}>{display}</span>
      {suffix}
    </>
  );
}

// Hosszabb címeknél kisebb betűméret, hogy ne törjön csúnyán / ne lógjon ki
// (pl. "SEO Tartalommarketing" vagy "UX/UI Design — Fejlesztés").
function headingSizeClass(heading: string) {
  const len = (heading || '').length;
  if (len > 24) return 'text-[9vw] lg:text-[clamp(1.8rem,6.5vw,6.5rem)]';
  if (len > 18) return 'text-[10.5vw] lg:text-[clamp(2.1rem,8vw,8.5rem)]';
  return 'text-[12vw] lg:text-[clamp(2.4rem,9.5vw,10rem)]';
}

export const ServiceHero = ({
  heading, sub_heading, badge_label, CTAs, locale, video, video_poster, stat,
}: ServiceHeroProps) => {
  const videoUrl = toAbs(video);
  const posterUrl = toAbs(video_poster);
  const safeCTAs = CTAs ?? [];
  const primaryCTA = safeCTAs[0];

  return (
    <div className="w-screen ml-[calc(50%-50vw)] mr-[calc(50%-50vw)]">
      <motion.section
        data-hero-section
        className="relative w-full overflow-hidden bg-black text-white -mt-16"
        aria-label="Hero"
      >
        {posterUrl && (
          <Image
            src={posterUrl}
            alt=""
            fill
            priority
            fetchPriority="high"
            className="object-cover z-[1]"
            sizes="100vw"
            aria-hidden
          />
        )}

        {videoUrl && (
          <video
            className="absolute inset-0 h-full w-full object-cover z-[2]"
            src={videoUrl}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-hidden
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/35 to-black/75 z-[2]" />
        <GrainCanvas opacity={0.25} />

        <div className="relative z-[3] px-5 md:px-10 xl:px-16 pt-24 md:pt-28 pb-10 md:pb-14 min-h-[76vh] md:min-h-[84vh] lg:min-h-[92vh] flex flex-col justify-between">
          {/* Badge — jobbra igazított, sima szöveg */}
          {badge_label && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="self-end text-right text-xs md:text-sm font-medium uppercase tracking-[0.15em] text-white/60"
            >
              {badge_label}
            </motion.p>
          )}

          {/* Alsó blokk: nagy cím + lebegő stat-kártya */}
          <div className="mt-10 md:mt-0 grid grid-cols-12 gap-8 items-end">
            <div className="col-span-12 lg:col-span-8">
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className={`block font-bold tracking-tight leading-[0.9] ${headingSizeClass(heading)}`}>
                  {heading}
                </span>
              </motion.h1>
              {sub_heading && (
                <motion.h2
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.25 }}
                  className="mt-4 md:mt-6 leading-snug text-base md:text-xl text-white/90 font-normal max-w-xl"
                >
                  {sub_heading}
                </motion.h2>
              )}
            </div>

            {/* Lebegő stat-kártya — benne a CTA gombbal */}
            {stat && (stat.value || stat.label) && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="col-span-12 lg:col-span-4 lg:justify-self-end w-full max-w-[16rem] lg:max-w-[19rem] lg:ml-auto"
              >
                <div className="rounded-md bg-white text-gray-900 shadow-2xl p-3.5 md:p-6">
                  {stat.mark_text && (
                    <p className="text-[9px] md:text-[11px] font-semibold tracking-wide text-gray-400 mb-1.5 md:mb-4">{stat.mark_text}</p>
                  )}
                  {stat.label && (
                    <p className="text-sm md:text-xl font-semibold leading-snug mb-1 md:mb-2">{stat.label}</p>
                  )}
                  {stat.description && (
                    <p className="hidden md:block text-sm text-gray-500 leading-relaxed mb-4">{stat.description}</p>
                  )}
                  {stat.value && (
                    <p className="text-2xl md:text-5xl font-bold tracking-tight mb-2 md:mb-4">
                      <AnimatedStatValue value={stat.value} />
                    </p>
                  )}
                  {primaryCTA && (
                    <Button as={Link} href={resolveHref(locale, primaryCTA.URL)} className="w-full justify-center"
                      {...(primaryCTA.target && { target: primaryCTA.target, rel: primaryCTA.target === '_blank' ? 'noopener noreferrer' : undefined })}
                    >{primaryCTA.text}</Button>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default ServiceHero;
