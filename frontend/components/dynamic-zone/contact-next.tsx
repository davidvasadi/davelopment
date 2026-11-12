'use client';

import React, { useLayoutEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { strapiImage } from '@/lib/strapi/strapiImage';

/**
 * Kapcsolat oldal: „Mi történik ezután” blokk (2026-11, referencia alapján, a mi stílusunkkal).
 * Balra nagy kép, jobbra cím + 3 lépéses idővonal (narancs pötty és vonal). Csak frontend-oldali blokktípus — a
 * Kapcsolat oldal szúrja be a hero után (app/[locale]/(marketing)/[slug]/page.tsx).
 */
const ACCENT = '#F05A28';

function content(hu: boolean) {
  return hu
    ? {
        heading: 'Mi történik ezután',
        steps: [
          { when: 'Egy munkanapon belül', title: 'Személyes válasz', text: 'Nem automatikus levél. Vasadi Dávid maga olvassa el az üzeneted, és néhány kérdéssel meg időpont-javaslatokkal válaszol egy beszélgetéshez.' },
          { when: 'Még azon a héten', title: 'Egy 30 perces beszélgetés', text: 'Átbeszéljük a vállalkozásodat, a mostani oldaladat és azt, amire szükséged van. Hozd, akinek döntenie kell — prezentáció nem kell.' },
          { when: 'A beszélgetés után egy héten belül', title: 'Írásos ajánlat', text: 'Feladatok, technológia, ütemezés és fix ár, közérthetően. Ha nem mi vagyunk a jó választás, megmondjuk, és javaslunk valakit, aki igen.' },
        ],
        imageAlt: 'Két kéz egy tervvázlattal és két kávéval — az első beszélgetés',
      }
    : {
        heading: 'What happens next',
        steps: [
          { when: 'Within one working day', title: 'A personal reply', text: 'Not an autoresponder. Dávid Vasadi reads your enquiry himself and replies with a few questions and times for a call.' },
          { when: 'The same week', title: 'A 30-minute call', text: 'We talk through the business, the site you have and the one you need. Bring whoever signs off; no slides required.' },
          { when: 'Within a week of the call', title: 'A written proposal', text: 'Scope, platform, timeline and a fixed price, in plain language. If we are not the right studio, we will say so and suggest who is.' },
        ],
        imageAlt: 'Hands holding a sketched plan next to two coffees — the first conversation',
      };
}

// A pötty szürke, amíg a görgetésre növő vonal el nem éri; utána narancs (at = a pötty helye a lista magasságához képest, 0…1)
function Dot({ progress, at }: { progress: MotionValue<number>; at: number }) {
  const backgroundColor = useTransform(progress, [Math.max(0, at - 0.02), at], ['rgba(0,0,0,0.18)', ACCENT]);
  return (
    <motion.span
      aria-hidden
      className="absolute -left-[calc(2rem+5px)] top-1 h-3 w-3 rounded-full md:-left-[calc(3rem+5px)]"
      style={{ backgroundColor }}
    />
  );
}

export function ContactNext({ locale = 'hu' }: { locale?: string }) {
  const c = content(locale !== 'en');
  const ease = [0.33, 1, 0.68, 1] as const;
  // a narancs idővonal görgetésre „rajzolódik” lefelé (scaleY — csak transform, GPU)
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 0.8', 'end 0.55'] });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  // a pöttyök helye (a lista tetejétől mért arány) — ennél a görgetésnél éri el őket a vonal
  const [dotAt, setDotAt] = useState<number[]>([]);
  useLayoutEffect(() => {
    const measure = () => {
      const ol = listRef.current;
      if (!ol) return;
      const h = ol.offsetHeight || 1;
      setDotAt(Array.from(ol.querySelectorAll('li')).map((li) => ((li as HTMLElement).offsetTop + 10) / h));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);
  return (
    <section className="w-full px-4 py-16 md:px-8 md:py-24">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
        <motion.div
          className="relative aspect-[4/3] overflow-hidden rounded-card lg:col-span-6 lg:aspect-auto lg:min-h-[640px]"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={strapiImage('/api/media/file/davelopment-felfedezes.avif')} alt={c.imageAlt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        </motion.div>

        <div className="lg:col-span-6 lg:self-center">
          <h2 className="text-4xl font-semibold leading-[0.95] tracking-[-0.05em] text-black md:text-6xl xl:text-7xl">{c.heading}</h2>
          {/* idővonal: bal oldalt narancs vonal, lépésenként narancs pötty */}
          <ol ref={listRef} className="relative mt-12 space-y-12 pl-8 md:pl-12">
            {/* halvány sín + rajta a görgetésre növekvő narancs vonal */}
            <span aria-hidden className="absolute bottom-0 left-0 top-0 w-0.5 bg-black/10" />
            <motion.span aria-hidden className="absolute bottom-0 left-0 top-0 w-0.5 origin-top" style={{ backgroundColor: ACCENT, scaleY: lineScale }} />
            {c.steps.map((st, i) => (
              <motion.li
                key={st.title}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: 0.08 * i, ease }}
              >
                <Dot progress={scrollYProgress} at={dotAt[i] ?? i / c.steps.length} />
                <p className="text-sm text-black/50">{st.when}</p>
                <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-black md:text-3xl">{st.title}</h3>
                <p className="mt-3 max-w-lg text-base leading-relaxed text-black/70 md:text-lg">{st.text}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
