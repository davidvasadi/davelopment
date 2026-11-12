'use client';

import { motion } from 'framer-motion';
import React from 'react';

export type StepCardVariant = 'image' | 'dark' | 'light';

/**
 * Bento-kártya a „Hogyan dolgozunk” blokkhoz: bal felül sorszám, jobb felül időtartam, alul nagy cím és leírás.
 * Három változat: képes (teljes háttérkép, sötétítő átmenettel), sötét és világos. A saját betűnk és színeink.
 */
export const Card = ({
  title,
  description,
  index,
  time,
  variant,
  imageSrc,
  imageAlt,
  className = '',
}: {
  title: string;
  description?: string;
  index: number;
  time?: string;
  variant: StepCardVariant;
  imageSrc?: string;
  imageAlt?: string;
  className?: string;
}) => {
  const tone =
    variant === 'light'
      ? { box: 'bg-white text-black', meta: 'text-black/40', desc: 'text-black/60' }
      : variant === 'dark'
        ? { box: 'bg-black text-white', meta: 'text-white/45', desc: 'text-white/60' }
        : { box: 'bg-black text-white', meta: 'text-white/80', desc: 'text-white/85' };

  return (
    <motion.article
      className={`group relative flex min-h-[370px] flex-col justify-between overflow-hidden rounded-card p-6 md:min-h-[410px] md:p-10 lg:h-[440px] ${tone.box} ${className}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: ((index - 1) % 2) * 0.08, ease: [0.33, 1, 0.68, 1] }}
    >
      {variant === 'image' && imageSrc && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={imageAlt || title}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        </>
      )}

      <div className={`relative flex items-start justify-between gap-4 text-sm font-medium ${tone.meta}`}>
        <span>{String(index).padStart(2, '0')}</span>
        {time && <span className="text-right">{time}</span>}
      </div>

      <div className="relative">
        <h3 className="text-4xl font-semibold leading-[0.95] tracking-[-0.04em] md:text-5xl lg:text-6xl">{title}</h3>
        {description && (
          <p className={`mt-5 max-w-md text-base leading-relaxed md:text-lg ${tone.desc}`}>{description}</p>
        )}
      </div>
    </motion.article>
  );
};
