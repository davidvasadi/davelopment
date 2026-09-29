'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { PlusIcon } from 'lucide-react';
import { strapiImage } from '@/lib/strapi/strapiImage';

type Media = { url?: string; alternativeText?: string } | string | null;

type Tag = { id?: string | number; label?: string | null };

type Stat = { value?: string | null; label?: string | null } | null;

export type ServiceHighlightProps = {
  badge_label?: string | null;
  heading?: string | null;
  description?: string | null;
  tags?: Tag[] | null;
  image?: Media;
  avatar_image?: Media;
  avatar_caption?: string | null;
  stat?: Stat;
  locale: string;
};

const toAbs = (m?: Media) => {
  const raw = typeof m === 'string' ? m : m?.url || '';
  return raw ? strapiImage(raw) : undefined;
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1] as const, delay },
});

export const ServiceHighlight = ({
  badge_label, heading, description, tags, image, avatar_image, avatar_caption, stat,
}: ServiceHighlightProps) => {
  const imageUrl = toAbs(image);
  const imageAlt = (typeof image === 'object' && image?.alternativeText) || heading || '';
  const avatarUrl = toAbs(avatar_image);
  const safeTags = (tags ?? []).filter((t) => t?.label);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-4 py-12 md:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Bal oldal — szöveg */}
        <div>
          {badge_label && (
            <motion.div {...fadeUp(0)} className="flex items-center gap-3 mb-6">
              <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center shrink-0">
                <PlusIcon className="w-3 h-3 text-white" />
              </div>
              <p className="text-sm font-medium text-gray-700">{badge_label}</p>
            </motion.div>
          )}

          {heading && (
            <motion.h2
              {...fadeUp(0.05)}
              className="font-semibold tracking-tight leading-[1.05] text-3xl md:text-4xl lg:text-5xl text-black mb-5"
            >
              {heading}
            </motion.h2>
          )}

          {description && (
            <motion.p {...fadeUp(0.1)} className="text-black/60 text-base md:text-lg leading-relaxed max-w-xl mb-7">
              {description}
            </motion.p>
          )}

          {safeTags.length > 0 && (
            <motion.div {...fadeUp(0.15)} className="flex flex-wrap gap-2 mb-8">
              {safeTags.map((t, i) => (
                <span
                  key={t.id ?? i}
                  className="rounded-full bg-black/5 text-black/70 text-xs md:text-sm font-medium px-3.5 py-2"
                >
                  {t.label}
                </span>
              ))}
            </motion.div>
          )}

          {(avatarUrl || avatar_caption) && (
            <motion.div {...fadeUp(0.2)} className="flex items-center gap-3">
              {avatarUrl && (
                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-gray-100 relative">
                  <Image src={avatarUrl} alt="" fill className="object-cover" />
                </div>
              )}
              {avatar_caption && <p className="text-sm text-black/50">{avatar_caption}</p>}
            </motion.div>
          )}
        </div>

        {/* Jobb oldal — kép + lebegő stat-kártya */}
        {imageUrl && (
          <motion.div {...fadeUp(0.1)} className="relative rounded-2xl overflow-hidden bg-black/5 aspect-[4/5] md:aspect-[5/4] lg:aspect-[4/5]">
            <Image src={imageUrl} alt={imageAlt} fill className="object-cover" sizes="(min-width: 1024px) 50vw, 100vw" />
            {stat && (stat.value || stat.label) && (
              <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 rounded-2xl bg-white/95 backdrop-blur px-5 py-4 shadow-xl max-w-[10rem]">
                {stat.value && <p className="text-3xl md:text-4xl font-bold text-black tracking-tight">{stat.value}</p>}
                {stat.label && <p className="text-xs text-black/50 mt-1 leading-snug">{stat.label}</p>}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ServiceHighlight;
