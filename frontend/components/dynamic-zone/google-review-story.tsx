'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowUpRight, Star } from 'lucide-react';
import { strapiImage } from '@/lib/strapi/strapiImage';
import { Container } from '@/components/container';
import { MotionLink } from '@/components/motion-link';

const isExternal = (u?: string | null) =>
  !!u && (u.startsWith('http') || u.startsWith('mailto:') || u.startsWith('tel:'));
const withLocale = (u: string | null | undefined, locale: string) =>
  isExternal(u) ? (u as string) : `/${locale}${u ?? ''}`;

const isVideo = (m?: any): boolean =>
  !!(m?.mimeType?.startsWith('video') || m?.mime?.startsWith('video'));

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.6, ease: 'easeOut' as const, delay },
});

type GoogleRating = { rating: number; userRatingCount: number; googleMapsUrl?: string } | null | undefined;

export const GoogleReviewStory = ({
  card1_heading,
  card1_cta_text,
  card1_cta_url,
  card2_media,
  card2_caption,
  locale,
  googleRating,
}: {
  card1_heading?: string | null;
  card1_cta_text?: string | null;
  card1_cta_url?: string | null;
  card2_media?: any;
  card2_caption?: string | null;
  locale: string;
  googleRating?: GoogleRating;
}) => {
  const mediaUrl = card2_media?.url ? strapiImage(card2_media.url) : null;
  const mediaIsVideo = isVideo(card2_media);
  const mediaAlt = (typeof card2_media === 'object' && card2_media?.alternativeText) || card2_caption || '';

  const rating = googleRating?.rating ?? null;
  const count = googleRating?.userRatingCount ?? null;
  const mapsUrl = googleRating?.googleMapsUrl;

  return (
    <Container>
      <div className="py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

          {/* 1. kártya — szöveg + CTA */}
          <motion.div
            {...fadeUp(0)}
            className="relative bg-white border border-gray-100 rounded-2xl p-8 min-h-[280px] flex flex-col justify-between overflow-hidden"
          >
            {card1_heading && (
              <h3 className="text-2xl md:text-3xl font-semibold text-black leading-tight tracking-tight">
                {card1_heading}
              </h3>
            )}
            {card1_cta_text && (
              <MotionLink
                href={withLocale(card1_cta_url, locale)}
                initial="rest"
                whileHover="hover"
                animate="rest"
                className="mt-6 inline-flex items-center gap-2 w-fit rounded-full border border-gray-200 pl-4 pr-1.5 py-1.5 text-sm font-medium text-black"
              >
                {card1_cta_text}
                <motion.span
                  variants={{ rest: { rotate: 0 }, hover: { rotate: 45 } }}
                  className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </motion.span>
              </MotionLink>
            )}
          </motion.div>

          {/* 2. kártya — kép/videó */}
          <motion.div
            {...fadeUp(0.08)}
            className="relative bg-white border border-gray-100 rounded-2xl min-h-[280px] overflow-hidden"
          >
            {mediaUrl && (
              mediaIsVideo ? (
                <video
                  src={mediaUrl}
                  muted
                  loop
                  autoPlay
                  playsInline
                  preload="none"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <Image
                  src={mediaUrl}
                  alt={mediaAlt}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                />
              )
            )}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
            {rating !== null && (
              <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 text-xs font-medium text-black">
                <Star className="w-3 h-3" fill="#f59e0b" stroke="#f59e0b" />
                {rating.toFixed(1)}
              </div>
            )}
            {card2_caption && (
              <p className="absolute bottom-4 left-4 right-4 text-white text-sm font-medium">
                {card2_caption}
              </p>
            )}
          </motion.div>

          {/* 3. kártya — automatikus Google-értékelés stat */}
          <motion.div
            {...fadeUp(0.16)}
            className="relative bg-black text-white rounded-2xl p-8 min-h-[280px] flex flex-col justify-between overflow-hidden"
          >
            <p className="text-xs font-medium tracking-wide text-white/50 uppercase">
              {locale === 'hu' ? 'Google-értékelések' : 'Google reviews'}
            </p>

            {rating !== null ? (
              <div>
                <div className="flex items-end gap-1 mb-1">
                  {[...Array(5)].map((_, i) =>
                    i < Math.round(rating) ? (
                      <Star key={i} className="w-4 h-4" fill="#f59e0b" stroke="#f59e0b" />
                    ) : (
                      <Star key={i} className="w-4 h-4 fill-transparent text-white/30" />
                    )
                  )}
                </div>
                <p className="text-5xl font-semibold tracking-tight">{rating.toFixed(1)}<span className="text-white/40 text-2xl">/5</span></p>
                <p className="text-sm text-white/60 mt-2">
                  {count !== null
                    ? (locale === 'hu' ? `${count} Google-értékelés alapján` : `based on ${count} Google reviews`)
                    : null}
                </p>
              </div>
            ) : (
              <div className="h-5" />
            )}

            {mapsUrl && (
              <motion.a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                initial="rest"
                whileHover="hover"
                animate="rest"
                variants={{ hover: { scale: [1, 1.06, 1], transition: { duration: 0.4, ease: 'easeInOut' } } }}
                className="mt-6 inline-flex items-center gap-2 w-fit rounded-full bg-white text-black pl-4 pr-1.5 py-1.5 text-sm font-medium"
              >
                <div style={{ overflow: 'hidden', height: 18 }}>
                  <motion.div
                    className="flex flex-col"
                    style={{ lineHeight: '18px' }}
                    variants={{ rest: { y: '-50%' }, hover: { y: '0%', transition: { duration: 0.3, ease: 'easeInOut' } } }}
                  >
                    <span className="block">{locale === 'hu' ? 'Vélemények megtekintése' : 'See reviews'}</span>
                    <span className="block" aria-hidden="true">{locale === 'hu' ? 'Vélemények megtekintése' : 'See reviews'}</span>
                  </motion.div>
                </div>
                <span className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center shrink-0">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </motion.a>
            )}
          </motion.div>

        </div>
      </div>
    </Container>
  );
};
