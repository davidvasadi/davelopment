'use client';

import React, { useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, type Variants } from 'framer-motion';
import { Button } from '../elements/button';
import { strapiImage } from '@/lib/strapi/strapiImage';

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
  CTAs?: CTA[] | null; // lehet null/undefined is, safeCTAs kezeli
  locale: string;
  video?: Media;
  video_poster?: Media;
  services?: ServiceItem[];
  person?: PersonCard | null;

  /** ÚJ — kétmezős leírás */
  description_lead?: string | null;
  description_body?: string | null;

  /** RÉGI — fallback egy mezőre */
  description_text?: string | null;

  copyright?: string | null;
  contact_anchor_id?: string | null; // most már nem használjuk
};

// ---- Scroll dinamika (TShiba fix: engedjük a null-t, és általános HTMLElementet várunk)
function useSlowScroll(ref: React.RefObject<HTMLElement | null>) {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // itt most nem mozgatjuk a sectiont, csak egy finom scale-t használunk
  const y = useTransform(scrollYProgress, [0, 1], [0, 0], { clamp: true });
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 0.9]);

  return { y, scale };
}

// ---- Framer variants (csak belső animációra)
const wheelVariants: Variants = {
  rest: { y: '-50%' },
  hover: { y: '0%', transition: { duration: 0.3, ease: 'easeInOut' } },
};

const dotVariants: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.4, transition: { duration: 0.3, ease: 'easeInOut' } },
};

// ---- Segédek
const toAbs = (m?: Media) => {
  const raw = typeof m === 'string' ? m : m?.url || '';
  return raw ? strapiImage(raw) : undefined;
};

const resolveHref = (locale: string, url?: string) => {
  if (!url) return '#';
  if (url.startsWith('http') || url.startsWith('#')) return url;
  return `/${locale}${url}`;
};

/** Ha csak a régi description_text érkezik, bontsuk két mondatra */
function splitLead(body: string, sentencesCount = 2): { lead: string; rest: string } {
  const parts = body.split(/(?<=[\.!\?])\s+/).filter(Boolean);
  const leadParts = parts.slice(0, sentencesCount);
  const restParts = parts.slice(sentencesCount);
  return { lead: leadParts.join(' '), rest: restParts.join(' ') };
}

export const Hero = ({
  heading,
  sub_heading,
  CTAs,
  locale,
  video,
  video_poster,
  services = [],
  person,
  description_lead,
  description_body,
  description_text, // fallback
  copyright,
}: HeroProps) => {
  // TShiba fix: általános HTMLElement + null
  const heroRef = useRef<HTMLElement | null>(null);
  const { y, scale } = useSlowScroll(heroRef);

  const videoUrl = toAbs(video);
  const posterUrl = toAbs(video_poster);
  const personImgUrl = toAbs(person?.image || null);

  // safeCTAs külön useMemo, hogy ne szóljon a react-hooks rule
  const safeCTAs = useMemo(() => CTAs ?? [], [CTAs]);

  // --- beszélgetős CTA kiválasztása + felső CTA-k
  const { talkCTA, topCTAs } = useMemo(() => {
    if (!safeCTAs || safeCTAs.length === 0) {
      return { talkCTA: undefined as CTA | undefined, topCTAs: [] as CTA[] };
    }

    let talkIndex = -1;

    if (safeCTAs.length >= 2) {
      // ha minimum 2 van, a 2. megy a kártyára
      talkIndex = 1;
    } else if (safeCTAs.length === 1) {
      // ha csak 1 CTA van, azt tesszük a kártyára
      talkIndex = 0;
    }

    const talkCTA = talkIndex >= 0 ? safeCTAs[talkIndex] : undefined;
    const topCTAs = talkIndex >= 0 ? safeCTAs.filter((_, i) => i !== talkIndex) : safeCTAs;

    return { talkCTA, topCTAs };
  }, [safeCTAs]);

  const serviceLabels = (services || [])
    .map((s: any) => (typeof s === 'string' ? s : s?.label))
    .filter(Boolean) as string[];

  // — leírás két mezővel vagy fallback bontással
  const computedDescription = useMemo(() => {
    if (description_lead || description_body) {
      return { lead: description_lead || '', rest: description_body || '' };
    }
    if (description_text) {
      const { lead, rest } = splitLead(description_text, 2);
      return { lead, rest };
    }
    return { lead: '', rest: '' };
  }, [description_lead, description_body, description_text]);

  return (
    <motion.section
      ref={heroRef as React.RefObject<HTMLElement>}
      style={{ y, scale }}
      className="relative rounded-2xl overflow-hidden bg-black text-white"
      aria-label="Hero"
    >
      {/* háttér videó */}
      {videoUrl && (
        <video
          className="absolute inset-0 h-full w-full object-cover z-0"
          src={videoUrl}
          {...(posterUrl ? { poster: posterUrl } : {})}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-hidden
        />
      )}

      {/* dísz „+” jelek */}
      <div className="absolute inset-0 pointer-events-none z-[2]">
        <motion.div
          className="absolute top-10 left-8 text-white/50 text-2xl md:drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
          animate={{ opacity: [0.4, 0.9, 0.4], scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          +
        </motion.div>
        <motion.div
          className="absolute bottom-28 left-[42%] text-white/50 text-2xl md:drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
          animate={{ opacity: [0.5, 0.85, 0.5], scale: [1, 1.15, 1] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        >
          +
        </motion.div>
        <motion.div
          className="absolute right-14 bottom-24 text-white/50 text-2xl md:drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
          animate={{ opacity: [0.5, 0.85, 0.5], scale: [1, 1.15, 1] }}
          transition={{ duration: 6, repeat: Infinity, delay: 0.5 }}
        >
          +
        </motion.div>
      </div>

      {/* tartalom */}
      <div className="relative z-[3] px-4 md:px-8 xl:px-16 py-10 md:py-14 lg:py-16 min-h-[78vh] md:min-h-[82vh] lg:min-h-[92vh] grid grid-rows-[1fr_auto]">
        {/* felső sor: bal (H1 + sub + CTA-k), jobb (services) */}
        <div className="grid grid-cols-12 gap-x-6 gap-y-8 items-start lg:items-center">
          <div className="col-span-12 lg:col-span-8">
            {/* H1 – mobilon nagyobb, fluid */}
            <h1 className="font-bold tracking-tight leading-[0.9] text-[12vw] lg:text-[clamp(2.4rem,9.5vw,12rem)]">
              {heading}
            </h1>

            {/* Subheading */}
            <div className="mt-1 text-[5vw] font-semibold text-white/90 lg:mt-3 lg:text-[clamp(1.05rem,3vw,3.5rem)]">
              {sub_heading}
            </div>

            {/* felső CTA-k (talkCTA nélkül) */}
            {topCTAs?.length > 0 && (
              <div className="mt-5 flex flex-wrap items-center gap-2">
                {topCTAs.map((cta) => (
                  <Button
                    key={cta.id}
                    as={Link}
                    href={resolveHref(locale, cta.URL)}
                    {...(cta.variant && { variant: cta.variant as any })}
                    {...(cta.target && {
                      target: cta.target,
                      rel: cta.target === '_blank' ? 'noopener noreferrer' : undefined,
                    })}
                  >
                    {cta.text}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* services */}
          {serviceLabels.length > 0 && (
            <motion.ul
              className="col-span-12 lg:col-span-4 lg:self-center lg:justify-self-end lg:pl-8 mt-6 lg:mt-0 space-y-2 text-right"
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {serviceLabels.map((label, i) => (
                <li key={`srv-${i}`} className="text-base md:text-lg font-medium">
                  {label}
                </li>
              ))}
            </motion.ul>
          )}
        </div>

        {/* alsó sor: kártya | leírás | copyright */}
        <div className="mt-10 grid grid-cols-12 gap-6 items-end">
          {/* kártya */}
          {person && (
            <div className="col-span-12 md:col-span-6 lg:col-span-3 md:justify-self-end order-1 lg:order-3">
              <div className="bg-white/95 backdrop-blur rounded-2xl p-2 md:p-3 max-w-[22rem] w-full mx-auto flex items-center gap-4 md:gap-6 shadow-2xl border border-white/30 text-gray-900">
                <div className="w-20 bg-gray-200 rounded-lg overflow-hidden">
                  {personImgUrl ? (
                    <Image
                      src={personImgUrl}
                      alt={person.name}
                      width={160}
                      height={160}
                      className="h-full w-full object-cover"
                      priority
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-gray-200 to-gray-300" />
                  )}
                </div>

                <div className="min-w-0">
                  {person.role && <div className="text-sm text-gray-600 mb-1">{person.role}</div>}
                  {person.org && <div className="text-xs text-gray-500 mb-2">{person.org}</div>}
                  <div className="text-lg font-bold mb-3 truncate">{person.name}</div>

                  {/* CTA a CTAs listából, STÍLUS A Button-ből jön */}
                  {talkCTA && (
                    <Button
                      as={Link}
                      href={resolveHref(locale, talkCTA.URL)}
                      {...(talkCTA.variant && { variant: talkCTA.variant as any })}
                      {...(talkCTA.target && {
                        target: talkCTA.target,
                        rel:
                          talkCTA.target === '_blank'
                            ? 'noopener noreferrer'
                            : undefined,
                      })}
                      aria-label={talkCTA.text || 'Let’s talk'}
                    >
                      {/* belső animáció, a Button saját class-e marad */}
                       <div className="overflow-hidden h-3 flex items-center leading-none">

                        <div className="overflow-hidden text-sm h-5 md:h-5">
                          <motion.div
                            className="flex flex-col"
                            variants={wheelVariants}
                            initial="rest"
                            animate="rest"
                            whileHover="hover"
                          >
                            <span>{talkCTA.text || 'Let’s talk'}</span>
                            <span>{talkCTA.text || 'Let’s talk'}</span>
                          </motion.div>
                        </div>
                        <motion.div
                          className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full"
                          variants={dotVariants}
                          initial="rest"
                          animate="rest"
                          whileHover="hover"
                        />
                      </div>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* leírás */}
          <div className="col-span-12 md:col-span-6 lg:col-span-5 lg:col-start-1 order-2 lg:order-1">
            {(computedDescription.lead || computedDescription.rest) && (
              <p className="leading-snug text-base md:text-xl indent-12 xl:indent-20 text-white/90">
                {computedDescription.lead && (
                  <span className="font-semibold">
                    {computedDescription.lead}
                    {computedDescription.lead.endsWith('.') ? ' ' : '. '}
                  </span>
                )}
                {computedDescription.rest && (
                  <span className="font-light text-gray-200">{computedDescription.rest}</span>
                )}
              </p>
            )}
          </div>

          {/* copyright */}
          <div className="hidden lg:flex col-span-4 justify-center order-2">
            {copyright && <p className="text-white/60 text-sm">{copyright}</p>}
          </div>
          <div className="lg:hidden col-span-12 mt-4 order-3">
            {copyright && <p className="text-white/60 text-sm">{copyright}</p>}
          </div>
        </div>
      </div>

      {/* alsó átmenet */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 md:h-36 w-full bg-gradient-to-t from-black/60 to-transparent z-[1]" />
    </motion.section>
  );
};

export default Hero;
