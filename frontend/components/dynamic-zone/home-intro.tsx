'use client';

import React, { useRef } from 'react';
import { Link } from 'next-view-transitions';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useIsMobile } from '@/lib/hooks/use-is-mobile';
import { IconBrandNextjs, IconBrandFramer, IconBrandFigma, IconBrandReact, IconBrandTailwind, IconBrandGoogle } from '@tabler/icons-react';

/**
 * Főoldali bemutatkozó blokk a hero után (2026-11, Framer-referencia alapján, a mi színeinkkel):
 * nagy kétszínű cím · technológia-pillek · elválasztó · 3 oszlop (Mit csinálunk / Kinek szól / Mit kapsz) + link.
 * Csak frontend-oldali típus; a főoldal szúrja be (app/[locale]/(marketing)/page.tsx). Szövegek itt (HU/EN).
 */
const PILLS = [
  { label: 'Next.js', Icon: IconBrandNextjs },
  { label: 'React', Icon: IconBrandReact },
  { label: 'Framer', Icon: IconBrandFramer },
  { label: 'Figma', Icon: IconBrandFigma },
  { label: 'Tailwind', Icon: IconBrandTailwind },
  { label: 'Google Ads', Icon: IconBrandGoogle },
];

function content(hu: boolean) {
  return hu
    ? {
        lead: 'A weboldalad a legtöbb ügyfeleddel az első találkozás.',
        tail: 'Mi gondoskodunk róla, hogy jól sikerüljön.',
        cols: [
          { title: 'Mit csinálunk', text: 'Weboldalakat, üres lapról tervezve, Next.js-re vagy Framerre építve. Utána pedig gondjukat viseljük.' },
          { title: 'Kinek szól', text: 'Szalonoknak, rendelőknek, szolgáltatóknak és B2B cégeknek, akiknek a weboldala már nem illik ahhoz, ahol a vállalkozás ma tart.' },
          { title: 'Mit kapsz', text: 'Két másodperc alatt betöltő oldalt, tartalomkezelőt, amit a csapatod egyedül is kezel, és fix árat, mielőtt elkezdjük.' },
        ],
        link: 'Nézd meg a munkáinkat',
        href: '/hu/projektek',
      }
    : {
        lead: 'A website is the first meeting with most of your customers.',
        tail: 'We make sure it goes well.',
        cols: [
          { title: 'What we do', text: 'Websites, designed from a blank page and built on Next.js or Framer. Then we look after them.' },
          { title: "Who it's for", text: 'Salons, clinics, service businesses and B2B companies whose site no longer matches where the business is today.' },
          { title: 'What you get', text: 'A site that loads in under two seconds, a CMS your team can run alone, and a fixed price before we start.' },
        ],
        link: 'See our work',
        href: '/en/products',
      };
}

export function HomeIntro({ locale = 'hu' }: { locale?: string }) {
  const c = content(locale !== 'en');
  const ease = [0.33, 1, 0.68, 1] as const;

  // „A hero mögül jön elő”: a blokk a hero alá húzva indul (a hero z-10, lásd hero.tsx), és ahogy görgetsz,
  // lecsúszik a helyére, közben kivilágosodik és kicsit nagyobb lesz. Csak transform + opacity (GPU), mobilon kisebb úttal.
  const ref = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();
  // Az oldal görgetéséhez kötve (nem a blokk helyzetéhez): görgetés nélkül láthatatlan — a hero alól ne lógjon ki
  // a szöveg —, és csak ahogy elindul a görgetés, akkor csúszik elő.
  const { scrollY } = useScroll();
  const dist = isMobile ? 400 : 700;
  const y = useTransform(scrollY, [0, dist], [isMobile ? -80 : -220, 0]);
  const scale = useTransform(scrollY, [0, dist], [0.94, 1]);
  const opacity = useTransform(scrollY, [0, 40, dist * 0.7], [0, 0, 1]);

  return (
    <motion.section
      ref={ref}
      style={{ y, scale, opacity }}
      className="relative z-0 w-full origin-top py-20 will-change-transform md:py-28"
    >
      <div className="px-4 md:px-8">
        <motion.h2
          className="text-balance text-4xl font-semibold leading-[0.95] md:max-w-[32ch] tracking-[-0.04em] text-black md:text-6xl xl:text-7xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease }}
        >
          {c.lead} <span className="text-black/40">{c.tail}</span>
        </motion.h2>

        <ul className="mt-10 flex flex-wrap gap-2 md:mt-14">
          {PILLS.map(({ label, Icon }) => (
            <li key={label} className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white py-2 pl-3 pr-4 text-sm font-medium text-black">
              <Icon className="h-4 w-4" stroke={1.8} aria-hidden />
              {label}
            </li>
          ))}
        </ul>

        <div className="mt-12 grid grid-cols-1 border-t border-black/10 md:mt-16 md:grid-cols-3">
          {c.cols.map((col, i) => (
            <motion.div
              key={col.title}
              className={`py-8 md:px-8 md:py-10 ${i > 0 ? 'border-t border-black/10 md:border-l md:border-t-0' : 'md:pl-0'}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.08 * i, ease }}
            >
              <h3 className="text-base font-semibold text-black/80 md:text-lg">{col.title}</h3>
              <p className="mt-4 text-balance text-xl leading-snug tracking-tight text-black md:text-2xl">{col.text}</p>
              {i === c.cols.length - 1 && (
                <Link href={c.href as never} className="mt-6 inline-block border-b-2 border-black pb-0.5 text-base font-medium text-black transition-opacity hover:opacity-60">
                  {c.link}
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
