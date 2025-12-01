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
  // Strapi media → abszolút URL
  const toAbs = (m?: any): string | undefined => {
    if (!m) return undefined;
    if (typeof m === 'string') return strapiImage(m);
    if (Array.isArray(m)) return toAbs(m[0]);
    const direct = m?.url || m?.attributes?.url || m?.data?.attributes?.url;
    if (direct) return strapiImage(direct);
    const formats = m?.formats || m?.attributes?.formats || m?.data?.attributes?.formats;
    const pick = formats?.small?.url ?? formats?.thumbnail?.url ?? formats?.medium?.url ?? formats?.large?.url;
    return pick ? strapiImage(pick) : undefined;
  };

  // egy mezőből: "bal | szürke", különben utolsó 2 szó szürke
  const splitHeading = (h: string) => {
    const i = h.indexOf('|');
    if (i !== -1) return { left: h.slice(0, i).trim(), right: h.slice(i + 1).trim() || undefined };
    const words = h.trim().split(/\s+/);
    if (words.length < 3) return { left: h, right: undefined };
    const cut = Math.max(1, words.length - 2);
    return { left: words.slice(0, cut).join(' '), right: words.slice(cut).join(' ') };
  };

  const { left, right } = splitHeading(heading);
  const videoSrc = toAbs(video);
  const showVideo = !!videoSrc;

  // ===== Scroll-parallax =====
  const sectionRef = useRef<HTMLDivElement>(null);
  // kicsit később indul és előbb ér véget, hogy finom legyen
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 70%', 'end 30%'],
  });

  // header mozgás: fel + enyhe skálázás
  const headerY = useTransform(scrollYProgress, [0, 1], [0, -60]);     // px
  const headerScale = useTransform(scrollYProgress, [0, 1], [1, 0.98]);
  const headerOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.92]);

  return (
    <div ref={sectionRef}>
      <Container className="relative z-40 mx-auto max-w-7xl py-20">
        {/* HEADER GRID: balon badge, jobbra tolt tartalomoszlop */}
        <div className="grid grid-cols-12 gap-x-6">
          {/* BAL: badge */}
          <div className="col-span-12 lg:col-span-3">
            {badge_label ? (
              <div className="mb-6 mt-2 flex items-center gap-2">
                <div className="flex h-4 w-4 items-center justify-center rounded-full bg-black">
                  <PlusIcon className="h-2.5 w-2.5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">{badge_label}</span>
              </div>
            ) : (
              <div className="h-8" />
            )}
          </div>

          {/* JOBB: tartalomoszlop (logo + heading + leírás) PARALLAX-szal */}
          <motion.div
            className="col-span-12 lg:col-start-5 lg:col-span-7"
            style={{ y: headerY, scale: headerScale, opacity: headerOpacity }}
            transition={{ type: 'tween', duration: 0.2 }}
          >
            <p className="mb-4 text-xl font-semibold text-black/80">[davelopment]®</p>

            <h2 className="font-bold leading-tight tracking-tight">
              <span className="text-4xl text-black md:text-5xl">{left}</span>
              {right ? (
                <span className="text-4xl md:text-5xl text-black/60"> {right}</span>
              ) : null}
            </h2>

            {sub_heading ? (
              <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-gray-700">
                {sub_heading}
              </p>
            ) : null}
          </motion.div>
        </div>

        {/* STEPS – gap-2 + finom scroll-parallax kártyánként */}
        {steps?.length ? (
          <div className="mt-10 grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
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
        {showVideo ? (
          <div className="mt-12 h-80 overflow-hidden rounded-3xl bg-black md:h-[480px] lg:h-[560px]">
            <video className="h-full w-full object-cover" controls playsInline src={videoSrc} />
          </div>
        ) : null}
      </Container>
    </div>
  );
};

/** Kis wrapper a kártyák parallax-eltolásához.
 *  Szándékosan külön komponens, hogy a hooks sorrendje stabil legyen.
 */
function ParallaxItem({
  index,
  progress,
  children,
}: PropsWithChildren<{ index: number; progress: MotionValue<number> }>) {
  // finom, váltakozó irány: [-14, -6, 6, 14] px
  const offsets = [-14, -6, 6, 14];
  const delta = offsets[index % offsets.length];
  const y = useTransform(progress, [0, 1], [0, delta]);
  const opacity = useTransform(progress, [0, 1], [1, 0.98]);

  return (
    <motion.div style={{ y, opacity }} transition={{ duration: 0.2 }}>
      {children}
    </motion.div>
  );
}
