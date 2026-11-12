'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { Plus as PlusIcon } from 'lucide-react';
import { strapiImage } from '@/lib/strapi/strapiImage';
import { MotionLink } from '@/components/motion-link';
import { PillLink } from '@/components/pill-link';
import { localizeHref } from '@/lib/i18n/localize-href';
import { GrainCanvas } from '../ui/grain-canvas';

const toAbs = (m?: any): string | undefined => {
  if (!m) return undefined;
  if (typeof m === 'string') return strapiImage(m);
  if (m?.url) return strapiImage(m.url);
  return undefined;
};

const isVideo = (m?: any): boolean =>
  !!(m?.mimeType?.startsWith('video') || m?.mime?.startsWith('video'));

const isExternal = (u?: string | null) =>
  !!u && (u.startsWith('http') || u.startsWith('mailto:') || u.startsWith('tel:'));
const withLocale = (u: string | null | undefined, locale: string) => localizeHref(u, locale, `/${locale}`);

function MediaBlock({ media, url, alt, sizes }: { media: any; url: string; alt: string; sizes: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) videoRef.current?.play().catch(() => { });
        else videoRef.current?.pause();
      },
      { threshold: 0.3 }
    );
    observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  if (isVideo(media)) {
    // preload="none" — a MediaBlock mindig KÉTSZER renderelődik (desktop +
    // mobil kártya, csak a nem-aktív breakpointon van CSS-sel elrejtve, a
    // DOM-ból nem távolítva el), ezért preload nélkül a böngésző mindkét
    // példányhoz lehúzta a teljes videót — dupla hálózati terhelés
    // ugyanazért a tartalomért (PageSpeed Insights audit, 2026-10-10).
    // A lejátszást amúgy is az IntersectionObserver indítja, ha látszik.
    return (
      <video
        ref={videoRef}
        src={url}
        muted
        loop
        playsInline
        preload="none"
        // a jelenlegi videóban beégetett fehér keret és alsó felirat van — felnagyítva és kissé feljebb igazítva a minta
        // kitölti a kártyát (a redesign végén kerettelen anyagra cseréljük, akkor ez a nagyítás kivehető)
        className="absolute inset-0 w-full h-full object-cover scale-[1.22]"
        style={{ transformOrigin: '50% 44%' }}
      />
    );
  }

  return (
    <Image
      src={url}
      alt={alt}
      fill
      className="object-cover transition-transform duration-500 ease-out"
      sizes={sizes}
    />
  );
}

// hover wheel animation for ghost buttons
const wheelVariants = {
  rest: { y: '-50%' },
  hover: { y: '0%', transition: { duration: 0.3, ease: 'easeInOut' as const } },
};

const fadeUp = (delay = 0, distance = 24) => ({
  initial: { opacity: 0, y: distance },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: 'easeOut' as const, delay },
});

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
  const mediaList = Array.isArray(image) ? image : image ? [image] : [];
  const firstMedia = mediaList[0] ?? null;
  const firstImgUrl = toAbs(firstMedia);
  const firstImgAlt = firstMedia?.alt ?? heading;

  // a kis szöveg két sorban: az első „ · ” előtti rész felül, a többi (e-mail · telefon) alatta
  const [subFirst, ...subRest] = (sub_heading ?? '').split(' · ');

  return (
    // teljes szélesség (nincs max-width), kis oldalmargóval — mint a többi újított blokk.
    // Elrendezés a minta szerint: balra a sötét kártyánk (cím fent, gomb + elérhetőség lent), jobbra a kép.
    <section className="px-4 py-12 md:px-8 md:py-20">
      <div className="grid grid-cols-1 gap-2 md:gap-3 lg:grid-cols-12">
        <motion.div
          {...fadeUp(0)}
          className="relative flex min-h-[460px] flex-col justify-between overflow-hidden rounded-card bg-[#080809] p-6 md:min-h-[520px] md:p-10 lg:col-span-7 lg:h-[620px] lg:p-14"
        >
          <GrainCanvas strength="light" opacity={0.45} zIndex={0} />
          <div className="relative z-10">
            {/* címke nincs (a minta szerint csak a cím) */}
            <h2 className="text-4xl font-semibold leading-[0.95] tracking-[-0.04em] text-white md:text-6xl xl:text-7xl">
              {heading}
              {heading_highlight && <span className="text-white/50"> {heading_highlight}</span>}
            </h2>
          </div>

          <div className="relative z-10 mt-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            {CTAs && CTAs.length > 0 && (
              <div className="flex flex-wrap items-center gap-3">
                {CTAs.map((cta, index) => {
                  const isPrimary = cta.variant === 'primary' || (cta.variant == null && index === 0);
                  // az elsődleges gomb a közös fehér pill (felirat + pötty, nem tördelődik — eddig a hosszabb felirat
                  // második szava a gördülő maszk alá csúszott, pl. „Ingyenes regisztráció” → „Ingyenes”)
                  if (isPrimary) {
                    return (
                      <PillLink key={index} href={withLocale(cta.URL, locale) as string} light cta={cta.text ?? undefined}>
                        {cta.text ?? ''}
                      </PillLink>
                    );
                  }
                  return (
                    <MotionLink
                      key={index}
                      href={withLocale(cta.URL, locale)}
                      target={cta.target ?? '_self'}
                      rel={cta.target === '_blank' ? 'noopener noreferrer' : undefined}
                      initial="rest"
                      whileHover="hover"
                      animate="rest"
                      data-cta={cta.text}
                      className="inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white"
                    >
                      <div style={{ overflow: 'hidden', height: 18 }}>
                        <motion.div className="flex flex-col" style={{ lineHeight: '18px' }} variants={wheelVariants}>
                          <span className="block">{cta.text}</span>
                          <span className="block kb-label" aria-hidden="true" data-k={cta.text ?? ''} />
                        </motion.div>
                      </div>
                    </MotionLink>
                  );
                })}
              </div>
            )}
            {sub_heading && (
              <p className="text-balance text-sm leading-relaxed text-white/60 md:text-right">
                {/* a pötty a szöveg sorába kerül (nem flex-oszlop), így tördeléskor is az első szó előtt marad; text-balance: nem marad egy szó magában */}
                <span className="block text-white/90">
                  {/* narancs, pulzáló „elérhető” pötty felső indexben (a szöveg tetejéhez igazítva) — a minta szerint */}
                  <span aria-hidden className="relative mr-1 inline-flex h-1.5 w-1.5 align-top translate-y-[0.3em]">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF7A3D] opacity-70" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#FF7A3D]" />
                  </span>
                  {subFirst}
                </span>
                {subRest.length > 0 && <span className="block">{subRest.join(' · ')}</span>}
              </p>
            )}
          </div>
        </motion.div>

        {firstImgUrl && (
          <motion.div
            {...fadeUp(0.08)}
            className="relative min-h-[320px] overflow-hidden rounded-card md:min-h-[420px] lg:col-span-5 lg:h-[620px]"
          >
            <MediaBlock media={firstMedia} url={firstImgUrl} alt={firstImgAlt} sizes="(min-width: 1024px) 42vw, 100vw" />
            {/* davelopment logó a kép közepén, fehérre színezve (díszítés) — csak a videós háttéren; egy képernyőképen
                (pl. a booking projekt telefonképe) rálógna a tartalomra */}
            {isVideo(firstMedia) && (
            <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={strapiImage('/api/media/file/logo-9b7c7d18eb.svg')}
                alt=""
                aria-hidden
                width={720}
                height={155}
                className="w-1/2 max-w-[320px] brightness-0 invert drop-shadow-[0_2px_12px_rgba(0,0,0,0.25)]"
              />
            </div>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
};
