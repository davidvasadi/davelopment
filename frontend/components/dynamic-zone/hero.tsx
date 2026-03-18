'use client';

import React, { useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, type Variants } from 'framer-motion';
import { PlusIcon } from 'lucide-react';
import { Button } from '../elements/button';
import { strapiImage } from '@/lib/strapi/strapiImage';
import { GrainCanvas } from '../ui/grain-canvas';

type CTA = {
  id: string | number;
  text: string;
  URL: string;
  variant?: string;
  target?: '_self' | '_blank';
};

type ServiceItem = string | { id?: string | number; label?: string };
type PersonCard = { name: string; role?: string; org?: string; image?: { url?: string } | null };
type Media = { url?: string } | string | null;

export type HeroProps = {
  heading: string;
  sub_heading: string;
  CTAs?: CTA[] | null;
  locale: string;
  video?: Media;
  video_poster?: Media;
  services?: ServiceItem[];
  person?: PersonCard | null;
  description_lead?: string | null;
  description_body?: string | null;
  description_text?: string | null;
  copyright?: string | null;
  contact_anchor_id?: string | null;
  badge_label?: string | null;
};

function useSlowScroll(ref: React.RefObject<HTMLElement | null>) {
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 0], { clamp: true });
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 0.9]);
  return { y, scale };
}

const wheelVariants: Variants = {
  rest: { y: '-50%' },
  hover: { y: '0%', transition: { duration: 0.3, ease: 'easeInOut' } },
};
const dotVariants: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.4, transition: { duration: 0.3, ease: 'easeInOut' } },
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

function splitLead(body: string, sentencesCount = 2): { lead: string; rest: string } {
  const parts = body.split(/(?<=[\.!\?])\s+/).filter(Boolean);
  return { lead: parts.slice(0, sentencesCount).join(' '), rest: parts.slice(sentencesCount).join(' ') };
}

export const Hero = ({
  heading, sub_heading, CTAs, locale, video, video_poster,
  services = [], person, description_lead, description_body,
  description_text, copyright, badge_label,
}: HeroProps) => {
  const heroRef = useRef<HTMLElement | null>(null);
  const { y, scale } = useSlowScroll(heroRef);

  const videoUrl = toAbs(video);
  const posterUrl = toAbs(video_poster);
  const personImgUrl = toAbs(person?.image || null);
  const hasVideo = !!videoUrl;

  const safeCTAs = useMemo(() => CTAs ?? [], [CTAs]);

  const { talkCTA, topCTAs } = useMemo(() => {
    if (!safeCTAs.length) return { talkCTA: undefined as CTA | undefined, topCTAs: [] as CTA[] };
    const talkIndex = safeCTAs.length >= 2 ? 1 : 0;
    return { talkCTA: safeCTAs[talkIndex], topCTAs: safeCTAs.filter((_, i) => i !== talkIndex) };
  }, [safeCTAs]);

  const serviceLabels = (services || [])
    .map((s: any) => (typeof s === 'string' ? s : s?.label))
    .filter(Boolean) as string[];

  const computedDescription = useMemo(() => {
    if (description_lead || description_body) return { lead: description_lead || '', rest: description_body || '' };
    if (description_text) return splitLead(description_text, 2);
    return { lead: '', rest: '' };
  }, [description_lead, description_body, description_text]);

  // ============================================================
  // VIDEÓ NÉLKÜLI MÓD
  // ============================================================
  if (!hasVideo) {
    return (
      <section ref={heroRef as React.RefObject<HTMLElement>} className="max-w-9xl mx-auto px-2 md:px-8">
        <div className="w-full pt-24 md:pt-32 pb-10">
          <motion.h1
            className="text-6xl md:text-8xl lg:text-9xl font-semibold text-black mb-16 md:mb-36"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {heading}
          </motion.h1>
          <motion.div
            className="mb-16 flex flex-col md:flex-row items-start justify-between gap-8"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center space-x-3 shrink-0">
              <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                <PlusIcon className="w-3 h-3 text-white" />
              </div>
              <p className="text-xs font-medium text-black">{badge_label}</p>
            </div>
            <div className="max-w-3xl flex flex-col md:flex-row gap-8 md:gap-20 items-start md:items-end">
              {sub_heading && (
                <p className="text-3xl text-black font-normal indent-20">
                  {sub_heading}
                  {(computedDescription.lead || computedDescription.rest) && (
                    <span className="text-black/50 font-medium"> {computedDescription.lead} {computedDescription.rest}</span>
                  )}
                </p>
              )}
              {safeCTAs.length > 0 && (
                <div className="flex flex-wrap gap-2 shrink-0">
                  {safeCTAs.map((cta) => (
                    <motion.a key={cta.id} href={resolveHref(locale, cta.URL)} target={cta.target || '_self'}
                      initial="rest" whileHover="hover" animate="rest"
                      className="inline-flex items-center justify-between gap-6 rounded-full bg-black px-3 py-1 text-xs sm:text-sm font-semibold text-white shadow-sm overflow-hidden"
                    >
                      <div className="overflow-hidden" style={{ height: '1.25rem' }}>
                        <motion.div className="flex flex-col" style={{ lineHeight: '1.25rem' }} variants={wheelVariants}>
                          <span className="block">{cta.text}</span>
                          <span className="block" aria-hidden="true">{cta.text}</span>
                        </motion.div>
                      </div>
                      <span className="h-1.5 w-1.5 rounded-full bg-white shrink-0" />
                    </motion.a>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  // ============================================================
  // VIDEÓS MÓD — LCP optimalizált
  // ============================================================
  return (
    <motion.section
      ref={heroRef as React.RefObject<HTMLElement>}
      style={{ y, scale }}
      className="relative rounded-2xl overflow-hidden bg-black text-white"
      aria-label="Hero"
    >
      {/*
        LCP STRATÉGIA:
        - A poster Image priority=true → fetchpriority="high" + <link rel="preload"> a <head>-be
        - A videó preload="none" → nem blokkolja az LCP-t
        - A poster az LCP elem — azonnal látható, gyors
      */}

      {/* Poster — LCP elem, z-[1] hogy a videó felett legyen */}
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

      <GrainCanvas opacity={0.25} />

      <div className="absolute inset-0 pointer-events-none z-[2]">
        <motion.div className="absolute top-10 left-8 text-white/50 text-2xl md:drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
          animate={{ opacity: [0.4, 0.9, 0.4], scale: [1, 1.1, 1] }} transition={{ duration: 4, repeat: Infinity }}>+</motion.div>
        <motion.div className="absolute bottom-28 left-[42%] text-white/50 text-2xl md:drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
          animate={{ opacity: [0.5, 0.85, 0.5], scale: [1, 1.15, 1] }} transition={{ duration: 5, repeat: Infinity, delay: 1 }}>+</motion.div>
        <motion.div className="absolute right-14 bottom-24 text-white/50 text-2xl md:drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
          animate={{ opacity: [0.5, 0.85, 0.5], scale: [1, 1.15, 1] }} transition={{ duration: 6, repeat: Infinity, delay: 0.5 }}>+</motion.div>
      </div>

      <div className="relative z-[3] px-4 md:px-8 xl:px-16 py-10 md:py-14 lg:py-16 min-h-[78vh] md:min-h-[82vh] lg:min-h-[92vh] grid grid-rows-[1fr_auto]">
        <div className="grid grid-cols-12 gap-x-6 gap-y-8 items-start lg:items-center">
          <div className="col-span-12 lg:col-span-8">
            <h1 className="font-bold tracking-tight leading-[0.9] text-[12vw] lg:text-[clamp(2.4rem,9.5vw,12rem)]">{heading}</h1>
            <div className="mt-1 text-[5vw] font-semibold text-white/90 lg:mt-3 lg:text-[clamp(1.05rem,3vw,3.5rem)]">{sub_heading}</div>
            {topCTAs?.length > 0 && (
              <div className="mt-5 flex flex-wrap items-center gap-2">
                {topCTAs.map((cta) => (
                  <Button key={cta.id} as={Link} href={resolveHref(locale, cta.URL)}
                    {...(cta.variant && { variant: cta.variant as any })}
                    {...(cta.target && { target: cta.target, rel: cta.target === '_blank' ? 'noopener noreferrer' : undefined })}
                  >{cta.text}</Button>
                ))}
              </div>
            )}
          </div>
          {serviceLabels.length > 0 && (
            <motion.ul className="col-span-12 lg:col-span-4 lg:self-center lg:justify-self-end lg:pl-8 mt-6 lg:mt-0 space-y-2 text-right"
              initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
              {serviceLabels.map((label, i) => <li key={`srv-${i}`} className="text-base md:text-lg font-medium">{label}</li>)}
            </motion.ul>
          )}
        </div>

        <div className="mt-10 grid grid-cols-12 gap-6 items-end">
          {person && (
            <div className="col-span-12 md:col-span-6 lg:col-span-3 md:justify-self-end order-1 lg:order-3">
              <div className="bg-white/95 backdrop-blur rounded-2xl p-2 md:p-3 max-w-[22rem] w-full mx-auto flex items-center gap-4 md:gap-6 shadow-2xl border border-white/30 text-gray-900">
                <div className="w-20 shrink-0 rounded-lg overflow-hidden bg-gray-200">
                  {personImgUrl
                    ? <Image src={personImgUrl} alt={person.name} width={160} height={160} className="h-full w-full object-cover" priority />
                    : <div className="h-full w-full bg-gradient-to-br from-gray-200 to-gray-300" />}
                </div>
                <div className="min-w-0 flex flex-col gap-1">
                  {person.role && <div className="text-sm text-gray-500 leading-tight">{person.role}</div>}
                  {person.org && <div className="text-xs text-gray-400 leading-tight">{person.org}</div>}
                  <div className="text-lg font-bold truncate">{person.name}</div>
                  {talkCTA && (
                    <motion.a href={resolveHref(locale, talkCTA.URL)} target={talkCTA.target || '_self'}
                      initial="rest" whileHover="hover" animate="rest"
                      className="mt-1 inline-flex items-center gap-3 self-start rounded-full bg-black px-4 py-2 text-sm font-semibold text-white whitespace-nowrap overflow-hidden"
                    >
                      <div className="overflow-hidden" style={{ height: '1.25rem' }}>
                        <motion.div className="flex flex-col" style={{ lineHeight: '1.25rem' }} variants={wheelVariants}>
                          <span className="block">{talkCTA.text}</span>
                          <span className="block" aria-hidden="true">{talkCTA.text}</span>
                        </motion.div>
                      </div>
                      <motion.span className="h-1.5 w-1.5 rounded-full bg-white shrink-0" variants={dotVariants} />
                    </motion.a>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="col-span-12 md:col-span-6 lg:col-span-5 lg:col-start-1 order-2 lg:order-1">
            {(computedDescription.lead || computedDescription.rest) && (
              <p className="leading-snug text-base md:text-xl indent-12 xl:indent-20 text-white/90">
                {computedDescription.lead && (
                  <span className="font-semibold">
                    {computedDescription.lead}{computedDescription.lead.endsWith('.') ? ' ' : '. '}
                  </span>
                )}
                {computedDescription.rest && <span className="font-light text-gray-200">{computedDescription.rest}</span>}
              </p>
            )}
          </div>

          <div className="hidden lg:flex col-span-4 justify-center order-2">
            {copyright && <p className="text-white/60 text-sm">{copyright}</p>}
          </div>
          <div className="lg:hidden col-span-12 mt-4 order-3">
            {copyright && <p className="text-white/60 text-sm">{copyright}</p>}
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 md:h-36 w-full bg-gradient-to-t from-black/60 to-transparent z-[1]" />
    </motion.section>
  );
};

export default Hero;
