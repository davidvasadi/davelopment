'use client';

import React, { useRef, PropsWithChildren } from 'react';
import { PlusIcon } from 'lucide-react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { Container } from '../../container';
import { Card } from './card';
import { strapiImage } from '@/lib/strapi/strapiImage';

export const HowItWorks = ({
  badge_label,
  heading,
  sub_heading,
  steps,
  video,
}: {
  badge_label?: string;
  heading: string;
  sub_heading?: string;
  steps: Array<{ title: string; description?: string; image?: any }>;
  video?: any;
}) => {
  const toAbs = (m?: any): string | undefined => {
    if (!m) return undefined;
    if (typeof m === 'string') return strapiImage(m);
    if (Array.isArray(m)) return toAbs(m[0]);
    const direct = m?.url;
    if (direct) return strapiImage(direct);
    const formats = m?.formats;
    const pick = formats?.small?.url ?? formats?.thumbnail?.url ?? formats?.medium?.url ?? formats?.large?.url;
    return pick ? strapiImage(pick) : undefined;
  };

  const splitHeading = (h: string) => {
    const i = h.indexOf('|');
    if (i !== -1) return { left: h.slice(0, i).trim(), right: h.slice(i + 1).trim() || undefined };
    const words = h.trim().split(/\s+/);
    if (words.length < 3) return { left: h, right: undefined };
    const cut = Math.max(1, words.length - 2);
    return { left: words.slice(0, cut).join(' '), right: words.slice(cut).join(' ') };
  };

  const { left, right } = splitHeading(heading ?? '');
  const videoSrc = toAbs(video);
  const showVideo = !!videoSrc;

  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 70%', 'end 30%'],
  });

  const headerY       = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const headerScale   = useTransform(scrollYProgress, [0, 1], [1, 0.98]);
  const headerOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.92]);

  return (
    <div ref={sectionRef}>
      <Container className="relative z-40 mx-auto max-w-7xl py-20">

        {/* SOR 1: badge — fade up, minden görgetéskor */}
        <motion.div
          className="grid grid-cols-12 gap-x-6 gap-y-4 md:gap-y-0 items-center mb-8 md:mb-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
        >
          <div className="col-span-12 mb-2 lg:col-span-3 lg:mb-0">
            {badge_label && (
              <div className="flex items-center gap-2">
                <div className="flex h-4 w-4 items-center justify-center rounded-full bg-black">
                  <PlusIcon className="h-2.5 w-2.5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">{badge_label}</span>
              </div>
            )}
          </div>
          <div className="col-span-12 lg:col-start-5 lg:col-span-7">
            <p className="text-md md:text-lg font-semibold text-black/80">[davelopment]®</p>
          </div>
        </motion.div>

        {/* SOR 2: heading — külső div: fade up belépő, belső div: scroll parallax */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.08, ease: [0.33, 1, 0.68, 1] }}
        >
          <motion.div
            className="grid grid-cols-12 gap-x-6"
            style={{ y: headerY, scale: headerScale, opacity: headerOpacity }}
          >
          <div className="col-span-12 lg:col-start-5 lg:col-span-7">
            <h2 className="font-semibold leading-tight tracking-tight">
              <span className="text-3xl text-black md:text-5xl">{left}</span>
              {right && (
                <span className="text-3xl md:text-5xl text-black/60"> {right}</span>
              )}
            </h2>
            {sub_heading && (
              <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-gray-700">
                {sub_heading}
              </p>
            )}
          </div>
          </motion.div>
        </motion.div>

        {/* STEPS GRID — kártyák a Card-on belül animálódnak (once: true, stagger) */}
        {steps?.length ? (
          <div className="mt-10 grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4 items-stretch">
            {steps.map((item, index) => (
              <ParallaxItem key={'card' + index} index={index} progress={scrollYProgress}>
                <Card
                  title={item.title}
                  description={item.description}
                  index={index + 1}
                  imageSrc={toAbs(item.image)}
                />
              </ParallaxItem>
            ))}
          </div>
        ) : null}

        {/* Opcionális videó */}
        {showVideo && (
          <motion.div
            className="mt-12 h-80 overflow-hidden rounded-3xl bg-black md:h-[480px] lg:h-[560px]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
          >
            <video className="h-full w-full object-cover" controls playsInline src={videoSrc} />
          </motion.div>
        )}

      </Container>
    </div>
  );
};

function ParallaxItem({
  index,
  progress,
  children,
}: PropsWithChildren<{ index: number; progress: MotionValue<number> }>) {
  const offsets = [-14, -6, 6, 14];
  const delta = offsets[index % offsets.length];
  const y = useTransform(progress, [0, 1], [0, delta]);
  const opacity = useTransform(progress, [0, 1], [1, 0.98]);

  return (
    <motion.div style={{ y, opacity }} transition={{ duration: 0.2 }} className="h-full">
      {children}
    </motion.div>
  );
}
