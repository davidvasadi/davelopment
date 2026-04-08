'use client';

import { motion, type Variants } from 'framer-motion';
import Image from 'next/image';
import { Plus as PlusIcon } from 'lucide-react';
import { strapiImage } from '@/lib/strapi/strapiImage';
import { Link } from 'next-view-transitions';
import { MotionLink } from '@/components/motion-link';

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
    <div className="max-w-7xl mx-auto px-2 md:px-4 py-12 md:py-20">

      {/* ══════════════ DESKTOP ══════════════ */}
      <motion.div
        className="hidden md:flex md:flex-row md:items-stretch group/cta"
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        {/* Left — szöveg + gomb kártya */}
        <motion.div
          variants={fadeUp}
          className="flex-1 min-w-0 flex flex-col justify-between bg-white rounded-2xl group-hover/cta:rounded-r-none mr-1 group-hover/cta:mr-0 transition-all duration-300 p-8 lg:p-10"
        >
          <div>
            {badge_label && (
              <div className="flex items-center gap-3 mb-6">
                <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center shrink-0 group-hover/cta:rotate-90 transition-transform duration-300">
                  <PlusIcon className="w-3 h-3 text-white" />
                </div>
                <p className="text-sm font-medium text-gray-700">{badge_label}</p>
              </div>
            )}
            <h2 className="font-medium tracking-tight leading-tight mb-6">
              <span className="text-black text-3xl md:text-4xl lg:text-5xl">{heading}</span>
              {heading_highlight && (
                <> <span className="text-black/50 text-3xl md:text-4xl lg:text-5xl">{heading_highlight}</span></>
              )}
            </h2>
            {sub_heading && (
              <p className="text-sm text-gray-400 leading-relaxed mb-6">{sub_heading}</p>
            )}
          </div>

          {CTAs && CTAs.length > 0 && (
            <div className="flex flex-wrap items-center gap-3">
              {CTAs.map((cta, index) => {
                const isPrimary = cta.variant === 'primary' || (cta.variant == null && index === 0);
                if (isPrimary) {
                  return (
                    <MotionLink
                      key={index}
                      href={`/${locale}${cta.URL ?? ''}`}
                      target={cta.target ?? '_self'}
                      rel={cta.target === '_blank' ? 'noopener noreferrer' : undefined}
                      initial="rest"
                      whileHover="hover"
                      animate="rest"
                      className="inline-flex items-center justify-center rounded-full bg-black text-white text-sm font-medium overflow-hidden px-6 py-3.5"
                    >
                      <div style={{ overflow: 'hidden', height: 18 }}>
                        <motion.div className="flex flex-col" style={{ lineHeight: '18px' }} variants={wheelVariants}>
                          <span className="block">{cta.text}</span>
                          <span className="block" aria-hidden="true">{cta.text}</span>
                        </motion.div>
                      </div>
                    </MotionLink>
                  );
                }
                return (
                  <MotionLink
                    key={index}
                    href={`/${locale}${cta.URL ?? ''}`}
                    target={cta.target ?? '_self'}
                    rel={cta.target === '_blank' ? 'noopener noreferrer' : undefined}
                    initial="rest"
                    whileHover="hover"
                    animate="rest"
                    className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-transparent text-gray-900 text-sm font-medium overflow-hidden px-6 py-3.5"
                  >
                    <div style={{ overflow: 'hidden', height: 18 }}>
                      <motion.div className="flex flex-col" style={{ lineHeight: '18px' }} variants={wheelVariants}>
                        <span className="block">{cta.text}</span>
                        <span className="block" aria-hidden="true">{cta.text}</span>
                      </motion.div>
                    </div>
                  </MotionLink>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Right — képkártya */}
        {firstImgUrl && (
          <motion.div
            variants={fadeUp}
            className="relative w-full md:w-[280px] lg:w-[340px] flex-shrink-0 bg-white rounded-2xl group-hover/cta:rounded-l-none transition-all duration-300 p-2 min-h-[360px]"
          >
            <div className="relative w-full h-full rounded-xl overflow-hidden min-h-[340px]">
              <Image
                src={firstImgUrl}
                alt={firstImgAlt}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 340px, 280px"
              />
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* ══════════════ MOBILE ══════════════ */}
      <motion.div
        className="flex flex-col md:hidden group/cta-m"
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        {/* Képkártya */}
        {firstImgUrl && (
  <motion.div
    variants={fadeUp}
    className="relative w-full bg-white rounded-2xl group-hover/cta-m:rounded-b-none mb-1 group-hover/cta-m:mb-0 transition-all duration-300 p-2"
    style={{ height: '52vw', minHeight: 210, maxHeight: 320 }}
  >
    <div className="relative w-full h-full rounded-xl overflow-hidden">
      <Image
        src={firstImgUrl}
        alt={firstImgAlt}
        fill
        className="object-cover object-center"
        sizes="100vw"
        priority
      />

      {/* Badge – a képen belül, absolute */}
      {badge_label && (
        <div className="absolute top-3 left-3 flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-sm">
          <div className="w-4 h-4 bg-black rounded-full flex items-center justify-center shrink-0 group-hover/cta-m:rotate-90 transition-transform duration-300">
            <PlusIcon className="w-2.5 h-2.5 text-white" />
          </div>
          <p className="text-xs font-medium text-gray-700">{badge_label}</p>
        </div>
      )}
    </div>
  </motion.div>
)}

        {/* Szöveg + gomb kártya */}
        <motion.div
          variants={fadeUp}
          className="flex flex-col gap-5 bg-white rounded-2xl group-hover/cta-m:rounded-t-none transition-all duration-300 px-6 pt-5 pb-8"
        >
          {/* Heading */}
          <h2 className="font-medium tracking-tight leading-[1.08]">
            <span className="text-black text-[1.75rem]">{heading}</span>
            {heading_highlight && (
              <> <span className="text-black/45 text-[1.75rem]">{heading_highlight}</span></>
            )}
          </h2>

          {/* Sub heading */}
          {sub_heading && (
            <p className="text-sm text-gray-400 leading-relaxed font-light -mt-1">
              {sub_heading}
            </p>
          )}

          {/* CTAs */}
          {CTAs && CTAs.length > 0 && (
            <div className="flex flex-col gap-2.5 pt-1">
              {CTAs.map((cta, index) => {
                const isPrimary = cta.variant === 'primary' || (cta.variant == null && index === 0);

                if (isPrimary) {
                  return (
                    <Link
                      key={index}
                      href={`/${locale}${cta.URL ?? ''}`}
                      target={cta.target ?? '_self'}
                      rel={cta.target === '_blank' ? 'noopener noreferrer' : undefined}
                      className="w-full flex items-center justify-center rounded-full bg-black text-white border border-black text-sm font-medium py-3.5 px-6 transition-opacity active:opacity-70"
                    >
                      {cta.text}
                    </Link>
                  );
                }

                // ghost — border only, with wheel animation
                return (
                  <MotionLink
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
                  </MotionLink>
                );
              })}
            </div>
          )}
        </motion.div>

      </motion.div>

    </div>
  );
};
