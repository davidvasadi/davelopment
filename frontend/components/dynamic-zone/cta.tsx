'use client';

import { motion, type Variants } from 'framer-motion';
import Image from 'next/image';
import { Plus as PlusIcon } from 'lucide-react';
import { strapiImage } from '@/lib/strapi/strapiImage';

const toAbs = (m?: any): string | undefined => {
  if (!m) return undefined;
  if (typeof m === 'string') return strapiImage(m);
  if (m?.url) return strapiImage(m.url);
  return undefined;
};

// hover wheel animation for ghost buttons
const wheelVariants: Variants = {
  rest: { y: '-50%' },
  hover: { y: '0%', transition: { duration: 0.3, ease: 'easeInOut' } },
};

// shared fade-up child — used inside stagger containers
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.33, 1, 0.68, 1] },
  },
};

// stagger container — orchestrates children
const stagger: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.11, delayChildren: 0.05 },
  },
};

type LinkBtn = {
  text?: string | null;
  URL?: string | null;
  target?: string | null;
  variant?: string | null;
};

export const CTA = ({
  heading,
  heading_highlight,
  sub_heading,
  CTAs,
  locale,
  badge_label,
  image,
}: {
  heading: string;
  heading_highlight?: string | null;
  sub_heading?: string | null;
  CTAs?: LinkBtn[] | null;
  locale: string;
  badge_label?: string | null;
  image?: any[] | null;
}) => {
  const mediaList   = Array.isArray(image) ? image : image ? [image] : [];
  const firstMedia  = mediaList[0] ?? null;
  const firstImgUrl = toAbs(firstMedia);
  const firstImgAlt = firstMedia?.alternativeText ?? heading;

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 py-12 md:py-20">

      {/* ══════════════ DESKTOP ══════════════ */}
      <div className="hidden md:flex md:flex-row md:items-stretch gap-16 lg:gap-24">

        {/* Left — staggered children */}
        <motion.div
          className="flex-1 min-w-0 flex flex-col md:justify-between"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {badge_label && (
            <motion.div variants={fadeUp} className="flex items-center gap-3">
              <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center shrink-0">
                <PlusIcon className="w-3 h-3 text-white" />
              </div>
              <p className="text-sm font-medium text-gray-700">{badge_label}</p>
            </motion.div>
          )}

          <motion.div variants={fadeUp} className="max-w-sm md:max-w-lg lg:max-w-2xl lg:-mt-24">
            <h2 className="font-medium tracking-tight leading-tight">
              <span className="text-black text-3xl md:text-5xl lg:text-6xl">{heading}</span>
              {heading_highlight && (
                <> <span className="text-black/60 text-3xl md:text-5xl lg:text-6xl">{heading_highlight}</span></>
              )}
            </h2>
          </motion.div>

          {CTAs && CTAs.length > 0 && (
            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4">
              {CTAs.map((cta, index) => (
                <motion.a
                  key={index}
                  href={`/${locale}${cta.URL ?? ''}`}
                  target={cta.target ?? '_self'}
                  rel={cta.target === '_blank' ? 'noopener noreferrer' : undefined}
                  initial="rest"
                  whileHover="hover"
                  animate="rest"
                  className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-transparent text-gray-900 text-xl font-medium overflow-hidden px-8 py-6"
                >
                  <div style={{ overflow: 'hidden', height: 20 }}>
                    <motion.div className="flex flex-col" style={{ lineHeight: '20px' }} variants={wheelVariants}>
                      <span className="block">{cta.text}</span>
                      <span className="block" aria-hidden="true">{cta.text}</span>
                    </motion.div>
                  </div>
                </motion.a>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Right — image slides in from right */}
        {firstImgUrl && (
          <motion.div
            className="w-full md:w-[300px] lg:w-[360px] flex-shrink-0"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.15, ease: [0.33, 1, 0.68, 1] }}
          >
            <div className="overflow-hidden rounded-2xl w-full h-full min-h-[300px] aspect-[3/4]">
              <Image
                src={firstImgUrl}
                alt={firstImgAlt}
                width={firstMedia?.width ?? 480}
                height={firstMedia?.height ?? 640}
                className="object-cover w-full h-full"
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* ══════════════ MOBILE ══════════════ */}
      <div className="flex flex-col md:hidden">

        {/* Image — fades in + subtle scale */}
        {firstImgUrl && (
          <motion.div
            className="relative w-full overflow-hidden rounded-2xl"
            style={{ height: '52vw', minHeight: 200, maxHeight: 300 }}
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
          >
            <Image
              src={firstImgUrl}
              alt={firstImgAlt}
              fill
              className="object-cover object-center"
              sizes="100vw"
              priority
            />
          </motion.div>
        )}

        {/* Content — staggered children */}
        <motion.div
          className="flex flex-col gap-5 px-6 pt-5 pb-8"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {/* Badge */}
          {badge_label && (
            <motion.div variants={fadeUp} className="flex items-center gap-2.5">
              <div className="w-4 h-4 bg-black rounded-full flex items-center justify-center shrink-0">
                <PlusIcon className="w-2.5 h-2.5 text-white" />
              </div>
              <p className="text-xs font-medium text-gray-500">{badge_label}</p>
            </motion.div>
          )}

          {/* Heading */}
          <motion.h2 variants={fadeUp} className="font-medium tracking-tight leading-[1.08]">
            <span className="text-black text-[1.75rem]">{heading}</span>
            {heading_highlight && (
              <> <span className="text-black/45 text-[1.75rem]">{heading_highlight}</span></>
            )}
          </motion.h2>

          {/* Sub heading */}
          {sub_heading && (
            <motion.p variants={fadeUp} className="text-sm text-gray-400 leading-relaxed font-light -mt-1">
              {sub_heading}
            </motion.p>
          )}

          {/* CTAs — full width stacked, variant aware */}
          {CTAs && CTAs.length > 0 && (
            <motion.div variants={fadeUp} className="flex flex-col gap-2.5 pt-1">
              {CTAs.map((cta, index) => {
                const isPrimary = cta.variant === 'primary' || (cta.variant == null && index === 0);

                if (isPrimary) {
                  return (
                    <a
                      key={index}
                      href={`/${locale}${cta.URL ?? ''}`}
                      target={cta.target ?? '_self'}
                      rel={cta.target === '_blank' ? 'noopener noreferrer' : undefined}
                      className="w-full flex items-center justify-center rounded-full bg-black text-white border border-black text-sm font-medium py-3.5 px-6 transition-opacity active:opacity-70"
                    >
                      {cta.text}
                    </a>
                  );
                }

                // ghost — border only, with wheel animation
                return (
                  <motion.a
                    key={index}
                    href={`/${locale}${cta.URL ?? ''}`}
                    target={cta.target ?? '_self'}
                    rel={cta.target === '_blank' ? 'noopener noreferrer' : undefined}
                    initial="rest"
                    whileHover="hover"
                    animate="rest"
                    className="w-full inline-flex items-center justify-center rounded-full border border-gray-300 bg-transparent text-gray-900 text-sm font-medium overflow-hidden py-3.5 px-6"
                  >
                    <div style={{ overflow: 'hidden', height: 18 }}>
                      <motion.div className="flex flex-col" style={{ lineHeight: '18px' }} variants={wheelVariants}>
                        <span className="block">{cta.text}</span>
                        <span className="block" aria-hidden="true">{cta.text}</span>
                      </motion.div>
                    </div>
                  </motion.a>
                );
              })}
            </motion.div>
          )}
        </motion.div>

      </div>

    </div>
  );
};
