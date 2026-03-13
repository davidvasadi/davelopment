'use client';

import React, { useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, type Variants } from 'framer-motion';
import { PlusIcon } from 'lucide-react';
import { Button } from '../elements/button';
import { strapiImage } from '@/lib/strapi/strapiImage';

// ============================================================
// TÍPUSOK
// ============================================================

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
  CTAs?: CTA[] | null;
  locale: string;
  video?: Media;                    // Ha van → dark videós hero. Ha nincs → világos blog-stílusú hero.
  video_poster?: Media;
  services?: ServiceItem[];         // Csak videós módban jelenik meg (jobb oldali lista)
  person?: PersonCard | null;       // Csak videós módban jelenik meg (fehér kártya)
  description_lead?: string | null; // Félkövér első rész a leírásból
  description_body?: string | null; // Normál második rész a leírásból
  description_text?: string | null; // Fallback — ha csak egy mező van, automatikusan kettéosztja
  copyright?: string | null;        // Csak videós módban, alul középen
  contact_anchor_id?: string | null;// TODO: nincs implementálva — jövőbeli anchor scroll célpont
  badge_label?: string | null;      // Videómentes módban bal oldali + ikon melletti szöveg (pl. "Árak")
};

// ============================================================
// GRAIN CANVAS — C erősség (base:8, range:55, alpha:255)
// Teljesen opák, nincs mixBlendMode — a canvas maga a réteg.
// Használható: preloader háttér, hero videó felett overlay-ként.
// ============================================================
function GrainCanvas({ opacity = 1 }: { opacity?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let raf: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const { width, height } = canvas;
      const img = ctx.createImageData(width, height);
      for (let i = 0; i < img.data.length; i += 4) {
        // Fehér pixel, alpha csatornával szabályozva
        // Így fekete háttéren IS látható — nem a brightness, hanem az alpha számít
        // opacity prop = extra finomhangolás felette
        const a = Math.random() * 35; // 0–25 alpha = finom, nem tolakodó
        img.data[i]     = 255;
        img.data[i + 1] = 255;
        img.data[i + 2] = 255;
        img.data[i + 3] = a;
      }
      ctx.putImageData(img, 0, 0);
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{
        zIndex: 1,
        // Nincs opacity — az alpha csatorna kezeli, így fekete háttéren is látható
      }}
    />
  );
}

// ============================================================
// SCROLL PARALLAX HOOK — csak videós módban használjuk
// A section scale-ezik scrollozáskor (1.05 → 0.9)
// ============================================================
function useSlowScroll(ref: React.RefObject<HTMLElement | null>) {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 0], { clamp: true });
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 0.9]);
  return { y, scale };
}

// ============================================================
// ANIMÁCIÓ VARIÁNSOK
// wheelVariants: CTA gomb szövege felülről csúszik be hover-re
// dotVariants: CTA gomb jobb oldali pötty nagyobb lesz hover-re
// ============================================================
const wheelVariants: Variants = {
  rest: { y: '-50%' },
  hover: { y: '0%', transition: { duration: 0.3, ease: 'easeInOut' } },
};

const dotVariants: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.4, transition: { duration: 0.3, ease: 'easeInOut' } },
};

// ============================================================
// SEGÉDFÜGGVÉNYEK
// ============================================================

// Strapi media objektumot vagy string URL-t abszolút URL-lé alakít
const toAbs = (m?: Media) => {
  const raw = typeof m === 'string' ? m : m?.url || '';
  return raw ? strapiImage(raw) : undefined;
};

// Relatív URL-t locale-alapú abszolút URL-lé alakít
// # és http kezdetű URL-ek érintetlenül maradnak (anchor és külső linkek)
const resolveHref = (locale: string, url?: string) => {
  if (!url) return '#';
  if (url.startsWith('http') || url.startsWith('#')) return url;
  return `/${locale}${url}`;
};

// Egy hosszú szöveget két részre oszt mondathatár alapján
// Fallback ha description_lead/description_body nincs külön kitöltve
function splitLead(body: string, sentencesCount = 2): { lead: string; rest: string } {
  const parts = body.split(/(?<=[\.!\?])\s+/).filter(Boolean);
  const leadParts = parts.slice(0, sentencesCount);
  const restParts = parts.slice(sentencesCount);
  return { lead: leadParts.join(' '), rest: restParts.join(' ') };
}

// ============================================================
// FŐ KOMPONENS
// ============================================================
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
  description_text,
  copyright,
  badge_label,
}: HeroProps) => {
  const heroRef = useRef<HTMLElement | null>(null);
  const { y, scale } = useSlowScroll(heroRef);

  const videoUrl = toAbs(video);
  const posterUrl = toAbs(video_poster);
  const personImgUrl = toAbs(person?.image || null);

  // Ha nincs video URL → videómentes (világos) módba váltunk
  const hasVideo = !!videoUrl;

  // null/undefined biztonságos CTA tömb
  const safeCTAs = useMemo(() => CTAs ?? [], [CTAs]);

  // Videós módban: az utolsó CTA a person kártyára kerül (talkCTA)
  // A többi CTA a heading alatt jelenik meg (topCTAs)
  const { talkCTA, topCTAs } = useMemo(() => {
    if (!safeCTAs || safeCTAs.length === 0) {
      return { talkCTA: undefined as CTA | undefined, topCTAs: [] as CTA[] };
    }
    let talkIndex = -1;
    if (safeCTAs.length >= 2) talkIndex = 1;
    else if (safeCTAs.length === 1) talkIndex = 0;
    const talkCTA = talkIndex >= 0 ? safeCTAs[talkIndex] : undefined;
    const topCTAs = talkIndex >= 0 ? safeCTAs.filter((_, i) => i !== talkIndex) : safeCTAs;
    return { talkCTA, topCTAs };
  }, [safeCTAs]);

  // Services string tömbbé alakítása (Strapi különböző formátumokat küldhet)
  const serviceLabels = (services || [])
    .map((s: any) => (typeof s === 'string' ? s : s?.label))
    .filter(Boolean) as string[];

  // Leírás két részre osztása — lead (félkövér) és rest (normál)
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

  // ============================================================
  // VIDEÓ NÉLKÜLI MÓD
  // BlogIndex-stílusú megjelenés: nagy heading, világos háttér
  // Struktúra: Nagy H1 → badge + sub_heading + CTA gombok → elválasztó vonal
  // ============================================================
  if (!hasVideo) {
    return (
      <section
        ref={heroRef as React.RefObject<HTMLElement>}
        className="max-w-9xl mx-auto px-2 md:px-8"
      >
        <div className="w-full pt-24 md:pt-32 pb-10">

          {/* Nagy heading — BlogIndex méretekkel */}
          <motion.h1
            className="text-6xl md:text-8xl lg:text-9xl font-semibold text-black mb-16 md:mb-36"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {heading}
          </motion.h1>

          {/* Alsó sor: bal = badge, jobb = sub_heading + CTAs */}
          <motion.div
            className="mb-16 flex flex-col md:flex-row items-start justify-between gap-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Bal oldal: + ikon + badge_label (Strapiban töltsd ki a hero badge_label mezőjét) */}
            <div className="flex items-center space-x-3 shrink-0">
              <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                <PlusIcon className="w-3 h-3 text-white" />
              </div>
              <p className="text-xs font-medium text-black">{badge_label ?? '[davelopment]®'}</p>
            </div>

            {/* Jobb oldal: sub_heading (nagy szöveg) + opcionális description + CTA gombok */}
            <div className="max-w-3xl flex flex-col md:flex-row gap-8 md:gap-20 items-start md:items-end">

              {/* Sub_heading — nagy, normál súlyú szöveg, indent-tel */}
              {sub_heading && (
                <p className="text-3xl text-black font-normal indent-20">
                  {sub_heading}
                  {/* Ha van description, halványabb szövegként hozzáfűzi */}
                  {(computedDescription.lead || computedDescription.rest) && (
                    <span className="text-black/50 font-medium">
                      {' '}{computedDescription.lead} {computedDescription.rest}
                    </span>
                  )}
                </p>
              )}

              {/* CTA gombok — wheelVariants hover animációval (szöveg felülről csúszik) */}
              {safeCTAs.length > 0 && (
                <div className="flex flex-wrap gap-2 shrink-0">
                  {safeCTAs.map((cta) => (
                    <motion.a
                      key={cta.id}
                      href={resolveHref(locale, cta.URL)}
                      target={cta.target || '_self'}
                      initial="rest"
                      whileHover="hover"
                      animate="rest"
                      className="inline-flex items-center justify-between gap-6 rounded-full bg-black px-3 py-1 text-xs sm:text-sm font-semibold text-white shadow-sm overflow-hidden"
                    >
                      {/* Szöveg wrapper — fix magasságú ablak, a szöveg felülről csúszik be */}
                      <div className="overflow-hidden" style={{ height: '1.25rem' }}>
                        <motion.div
                          className="flex flex-col"
                          style={{ lineHeight: '1.25rem' }}
                          variants={wheelVariants}
                        >
                          <span className="block">{cta.text}</span>
                          <span className="block" aria-hidden="true">{cta.text}</span>
                        </motion.div>
                      </div>
                      {/* Jobb oldali fehér pötty */}
                      <span className="h-1.5 w-1.5 rounded-full bg-white shrink-0" />
                    </motion.a>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Animált elválasztó vonal — fény balról jobbra fut át */}
          {/* <div className="relative w-full h-[1px] bg-neutral-200 overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral-400 to-transparent"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.4, ease: 'easeInOut', delay: 0.5 }}
            />
          </div> */}
        </div>
      </section>
    );
  }

  // ============================================================
  // VIDEÓS MÓD
  // Sötét hero fekete háttérrel, háttérvideóval, parallax scale-lel
  // + C erősségű grain overlay a videó felett (overlay blend mode)
  // Struktúra: Videó háttér → Grain overlay → H1 + sub_heading + topCTAs | services lista
  //            → leírás | person kártya (talkCTA-val) | copyright
  // ============================================================
  return (
    <motion.section
      ref={heroRef as React.RefObject<HTMLElement>}
      style={{ y, scale }}  // parallax scroll effekt
      className="relative rounded-2xl overflow-hidden bg-black text-white"
      aria-label="Hero"
    >
      {/* Háttér videó — autoplay, loop, muted, mobilra playsInline */}
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

      {/* Grain overlay — C erősség, overlay blend mode videó felett
          overlay blend: sötét területeken sötétít, világosokon világosít
          → szépen rátelepszik a videóra, nem tünteti el azt */}
      <GrainCanvas opacity={0.35} />

      {/* Dekoratív + jelek — pulse animációval, pointer-events nélkül */}
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

      {/* Fő tartalom — 2 sor grid: [1fr auto] */}
      <div className="relative z-[3] px-4 md:px-8 xl:px-16 py-10 md:py-14 lg:py-16 min-h-[78vh] md:min-h-[82vh] lg:min-h-[92vh] grid grid-rows-[1fr_auto]">

        {/* FELSŐ SOR: H1 + sub_heading + topCTAs (bal) | services lista (jobb) */}
        <div className="grid grid-cols-12 gap-x-6 gap-y-8 items-start lg:items-center">
          <div className="col-span-12 lg:col-span-8">
            {/* Fluid méretű H1 — mobilon 12vw, desktopon clamp */}
            <h1 className="font-bold tracking-tight leading-[0.9] text-[12vw] lg:text-[clamp(2.4rem,9.5vw,12rem)]">
              {heading}
            </h1>
            {/* Sub_heading — kisebb, fehér/90 */}
            <div className="mt-1 text-[5vw] font-semibold text-white/90 lg:mt-3 lg:text-[clamp(1.05rem,3vw,3.5rem)]">
              {sub_heading}
            </div>
            {/* Felső CTA gombok (talkCTA kivételével) */}
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

          {/* Services lista — csak ha van adat, jobb oldalt, text-right */}
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

        {/* ALSÓ SOR: leírás (bal) | person kártya (jobb) | copyright (közép) */}
        <div className="mt-10 grid grid-cols-12 gap-6 items-end">

          {/* ── PERSON KÁRTYA ──────────────────────────────────────────
              Fehér kártya profilképpel és talkCTA gombbal.
              FIX: a gomb szövege most inline-flex + whitespace-nowrap,
              nem h-3 ablakba szorítva — szabadon lélegzik. */}
          {person && (
            <div className="col-span-12 md:col-span-6 lg:col-span-3 md:justify-self-end order-1 lg:order-3">
              <div className="bg-white/95 backdrop-blur rounded-2xl p-2 md:p-3 max-w-[22rem] w-full mx-auto flex items-center gap-4 md:gap-6 shadow-2xl border border-white/30 text-gray-900">

                {/* Profilkép */}
                <div className="w-20 shrink-0 rounded-lg overflow-hidden bg-gray-200">
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

                {/* Szöveg + CTA gomb */}
                <div className="min-w-0 flex flex-col gap-1">
                  {person.role && (
                    <div className="text-sm text-gray-500 leading-tight">{person.role}</div>
                  )}
                  {person.org && (
                    <div className="text-xs text-gray-400 leading-tight">{person.org}</div>
                  )}
                  <div className="text-lg font-bold truncate">{person.name}</div>

                  {/* talkCTA gomb — FIX: whitespace-nowrap, nincs h-3 ablak
                      A wheelVariants hover animáció megtartva, de a szöveg
                      most egy normál inline-flex sorban van, nem clip-elve */}
                  {talkCTA && (
                    <motion.a
                      href={resolveHref(locale, talkCTA.URL)}
                      target={talkCTA.target || '_self'}
                      initial="rest"
                      whileHover="hover"
                      animate="rest"
                      className="mt-1 inline-flex items-center gap-3 self-start rounded-full bg-black px-4 py-2 text-sm font-semibold text-white whitespace-nowrap overflow-hidden"
                    >
                      {/* Szöveg ablak — fix magasság, szöveg felülről csúszik be hover-re */}
                      <div className="overflow-hidden" style={{ height: '1.25rem' }}>
                        <motion.div
                          className="flex flex-col"
                          style={{ lineHeight: '1.25rem' }}
                          variants={wheelVariants}
                        >
                          <span className="block">{talkCTA.text}</span>
                          <span className="block" aria-hidden="true">{talkCTA.text}</span>
                        </motion.div>
                      </div>
                      {/* Pötty — hover-re megnő */}
                      <motion.span
                        className="h-1.5 w-1.5 rounded-full bg-white shrink-0"
                        variants={dotVariants}
                      />
                    </motion.a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Leírás — indent-tel, lead félkövér, rest halvány */}
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

          {/* Copyright — desktop: középen, mobil: alul */}
          <div className="hidden lg:flex col-span-4 justify-center order-2">
            {copyright && <p className="text-white/60 text-sm">{copyright}</p>}
          </div>
          <div className="lg:hidden col-span-12 mt-4 order-3">
            {copyright && <p className="text-white/60 text-sm">{copyright}</p>}
          </div>
        </div>
      </div>

      {/* Alsó gradient átmenet — videó és tartalom közötti simítás */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 md:h-36 w-full bg-gradient-to-t from-black/60 to-transparent z-[1]" />
    </motion.section>
  );
};

export default Hero;
