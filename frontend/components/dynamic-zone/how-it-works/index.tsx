'use client';

import React from 'react';
import { PlusIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, type StepCardVariant } from './card';
import { strapiImage } from '@/lib/strapi/strapiImage';

/**
 * „Hogyan dolgozunk” — bento-elrendezés (2026-11): felül nagy cím balra, rövid leírás jobbra; alatta 2×2 kártya
 * váltakozó szélességgel (7+5 / 5+7 oszlop). Kártyák sorrendje: képes · sötét · világos · képes (ismétlődik).
 * A képes kártya a lépés CMS-képét teljes háttérként mutatja; kép nélkül sötét kártya lesz belőle.
 */
const LAYOUT: { span: string; variant: StepCardVariant }[] = [
  { span: 'lg:col-span-7', variant: 'image' },
  { span: 'lg:col-span-5', variant: 'dark' },
  { span: 'lg:col-span-5', variant: 'light' },
  { span: 'lg:col-span-7', variant: 'image' },
];

// Időtartam lépésenként — a blokknak (még) nincs erre CMS-mezője; ha bevált, áttehető a CMS-be.
const TIMES: Record<string, string[]> = {
  hu: ['1. hét', '1–2. hét', '2–4. hét', '4. héttől'],
  en: ['Week 1', 'Weeks 1–2', 'Weeks 2–4', 'From week 4'],
};

export const HowItWorks = ({
  badge_label,
  heading,
  sub_heading,
  steps,
  video,
  locale = 'hu',
}: {
  badge_label?: string;
  heading: string;
  sub_heading?: string;
  steps: Array<{ title: string; description?: string; image?: any; image_alt?: string }>;
  video?: any;
  locale?: string;
}) => {
  const toAbs = (m?: any): string | undefined => {
    if (!m) return undefined;
    if (typeof m === 'string') return strapiImage(m);
    if (Array.isArray(m)) return toAbs(m[0]);
    if (m?.url) return strapiImage(m.url);
    const f = m?.formats;
    const pick = f?.large?.url ?? f?.medium?.url ?? f?.small?.url ?? f?.thumbnail?.url;
    return pick ? strapiImage(pick) : undefined;
  };

  // „bal | jobb” — csak akkor halványabb a második fele, ha a CMS-ben `|` jelöli (különben az egész cím fekete, mint a mintán)
  const splitHeading = (h: string) => {
    const i = h.indexOf('|');
    if (i === -1) return { left: h.trim(), right: undefined };
    return { left: h.slice(0, i).trim(), right: h.slice(i + 1).trim() || undefined };
  };
  const { left, right } = splitHeading(heading ?? '');
  const videoSrc = toAbs(video);
  const times = TIMES[locale] ?? TIMES.hu;

  return (
    // teljes szélesség (nincs max-width), kis oldalmargóval — a szülő már teljes szélességű, így nem kell w-screen
    // (az a görgetősáv szélességével túllógott a képernyőn)
    <section className="w-full py-20 md:py-28">
      <div className="relative z-40 px-4 md:px-8">
        {/* Fejléc — mint a mintán */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
        >
          {badge_label && (
            <div className="mb-6 flex items-center gap-2">
              <div className="flex h-4 w-4 items-center justify-center rounded-full bg-black">
                <PlusIcon className="h-2.5 w-2.5 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">{badge_label}</span>
            </div>
          )}
          {/* tablettől a cím balra, a szöveg jobbra (a két szélen, alul igazítva); szűkülő képernyőn a cím tördel;
              mobilon egymás alatt */}
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-10">
            <h2 className="min-w-0 flex-1 text-4xl font-semibold leading-[0.95] tracking-[-0.04em] text-black md:text-6xl xl:text-7xl">
              {left}
              {right && <span className="text-black/60"> {right}</span>}
            </h2>
            {sub_heading && (
              <p className="max-w-md text-base leading-relaxed text-black/60 md:max-w-xs md:shrink-0 md:pb-1 md:text-right md:text-lg">
                {sub_heading}
              </p>
            )}
          </div>
        </motion.div>

        {/* Bento-kártyák */}
        {steps?.length ? (
          <div className="mt-12 grid grid-cols-1 gap-2 md:mt-16 md:gap-3 lg:grid-cols-12">
            {steps.map((item, i) => {
              const slot = LAYOUT[i % LAYOUT.length];
              const imageSrc = slot.variant === 'image' ? toAbs(item.image) : undefined;
              return (
                <Card
                  key={'step' + i}
                  className={slot.span}
                  index={i + 1}
                  title={item.title}
                  description={item.description}
                  time={times[i]}
                  variant={slot.variant === 'image' && !imageSrc ? 'dark' : slot.variant}
                  imageSrc={imageSrc}
                  imageAlt={item.image_alt}
                />
              );
            })}
          </div>
        ) : null}

        {/* Opcionális videó */}
        {videoSrc && (
          <motion.div
            className="mt-3 h-80 overflow-hidden rounded-card bg-black md:h-[480px] lg:h-[560px]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
          >
            <video className="h-full w-full object-cover" controls playsInline src={videoSrc} />
          </motion.div>
        )}
      </div>
    </section>
  );
};
