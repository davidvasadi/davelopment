'use client';

import React, { useState } from 'react';
import { Link } from 'next-view-transitions';
import { motion } from 'framer-motion';
import { PlusIcon } from 'lucide-react';
import { strapiImage } from '@/lib/strapi/strapiImage';

/**
 * Főoldali árazás (2026-11, a Framer-referencia alapján): nagy cím balra, „Projektek / Támogatás” kapcsoló jobbra;
 * alatta 3 kártya: kép · név + idő · nagy ár · (projektnél) egy mondat · elválasztó · pontok narancs pöttyel · link.
 * Projektek: egyszeri ár; Támogatás: havidíj. Kedvezmény nincs. Az árak és a szövegek itt vannak (HU/EN).
 * Csak a főoldalon váltja a CMS „pricing” blokkot (app/[locale]/(marketing)/page.tsx); az Árak oldal külön kezelendő.
 */
type Card = { title: string; meta: string; price: string; suffix: string; text?: string; points: string[]; image: string };

const DOT = '#F05A28';

function content(hu: boolean) {
  return {
    badge: hu ? 'Árak' : 'Pricing',
    heading: hu ? 'Árak, nyíltan' : 'Pricing, in the open',
    tabs: { projects: hu ? 'Projektek' : 'Projects', care: hu ? 'Támogatás' : 'Care plans' },
    projectLink: hu ? 'Foglalj egy 30 perces beszélgetést' : 'Book the 30-minute call',
    careLink: hu ? 'Beszéljünk a támogatásról' : 'Talk about care',
    note: hu
      ? 'Minden projekt fix árat kap egy 30 perces beszélgetés után.'
      : 'Every project gets a fixed price after a 30-minute call.',
    projects: (hu
      ? [
          { title: 'Üzleti weboldal', meta: '1–4 hét', price: '190 000 Ft', suffix: '-tól', image: 'davelopment-business-weboldal.avif',
            text: 'Egyedi tervezésű weboldal, olyan tartalomkezelővel, amit te is könnyen kezelsz.',
            points: ['Egyedileg tervezett oldalak', 'Tartalomkezelő beállítása és betanítás', 'Animációk és interakciók', 'Technikai SEO és analitika'] },
          { title: 'Weboldal + marketing', meta: '4–6 hét', price: '330 000 Ft', suffix: '-tól', image: 'davelopment-hirdeteskezeles.avif',
            text: 'Weboldal, ami az indulástól ügyfeleket hoz, keresőoptimalizálással és hirdetésekkel.',
            points: ['Minden, ami az Üzleti weboldalban', 'Kulcsszókutatás és tartalomstratégia', '4–5 induló blogcikk', 'Google Ads kampány beállítása'] },
          { title: 'Egyedi fejlesztés', meta: 'Közösen felmérve', price: '550 000 Ft', suffix: '-tól', image: 'davelopment-egyedi-weboldal.avif',
            text: 'Foglalórendszerek, ügyfélportálok és integrációk, a vállalkozásodra szabva.',
            points: ['Felmérés és technikai tervezés', 'Egyedi rendszer (pl. foglalás, ügyfélportál)', 'Integrációk és egyedi eszközök', 'Dedikált csapat az indulás után'] },
        ]
      : [
          { title: 'Business website', meta: '1–4 weeks', price: '190,000 HUF', suffix: 'from', image: 'davelopment-business-weboldal.avif',
            text: 'A custom-designed website, on a content manager you can run yourself.',
            points: ['Custom-designed pages', 'Content manager set-up and training', 'Motion and interaction', 'Technical SEO and analytics'] },
          { title: 'Website + marketing', meta: '4–6 weeks', price: '330,000 HUF', suffix: 'from', image: 'davelopment-hirdeteskezeles.avif',
            text: 'A website that brings in customers from launch, with search optimisation and ads.',
            points: ['Everything in Business website', 'Keyword research and content strategy', '4–5 launch blog articles', 'Google Ads campaign set-up'] },
          { title: 'Custom build', meta: 'Scoped together', price: '550,000 HUF', suffix: 'from', image: 'davelopment-egyedi-weboldal.avif',
            text: 'Booking systems, client portals and integrations, built around your business.',
            points: ['Discovery and technical scoping', 'A custom system (e.g. booking, client portal)', 'Integrations and custom tooling', 'A dedicated team after launch'] },
        ]) as Card[],
    care: (hu
      ? [
          { title: 'Alap támogatás', meta: 'Havonta megújuló', price: '29 900 Ft', suffix: '/hó-tól', image: 'davelopment-karbantartas.avif',
            points: ['Frissítések és biztonsági javítások', 'Folyamatos elérhetőség-figyelés', 'Havi 2 óra módosítás'] },
          { title: 'Növekedés', meta: 'Havonta megújuló', price: '59 900 Ft', suffix: '/hó-tól', image: 'davelopment-novekedes.avif',
            points: ['Havi 6 óra design és fejlesztés', 'Havi teljesítményriport', 'A/B tesztek a kulcsoldalakon'] },
          { title: 'Beágyazott csapat', meta: 'Havonta megújuló', price: '149 900 Ft', suffix: '/hó-tól', image: 'davelopment-beagyazott-csapat.avif',
            points: ['Közvetlen kapcsolat a fejlesztővel', 'Havi 4 SEO-cikk', 'Heti egyeztetés', 'Elsőbbségi átfutás'] },
        ]
      : [
          { title: 'Essential care', meta: 'Rolling monthly', price: '29,900 HUF', suffix: '/month', image: 'davelopment-karbantartas.avif',
            points: ['Updates and security patches', 'Uptime monitoring', 'Two hours of changes'] },
          { title: 'Growth', meta: 'Rolling monthly', price: '59,900 HUF', suffix: '/month', image: 'davelopment-novekedes.avif',
            points: ['Six hours of design and build', 'Monthly performance report', 'A/B tests on key pages'] },
          { title: 'Embedded', meta: 'Rolling monthly', price: '149,900 HUF', suffix: '/month', image: 'davelopment-beagyazott-csapat.avif',
            points: ['A direct line to your developer', 'Four SEO articles a month', 'Weekly planning call', 'Priority turnaround'] },
        ]) as Card[],
  };
}

export function PricingSimple({ locale = 'hu' }: { locale?: string }) {
  const hu = locale !== 'en';
  const c = content(hu);
  const [tab, setTab] = useState<'projects' | 'care'>('projects');
  const cards = tab === 'projects' ? c.projects : c.care;
  const contactHref = hu ? '/hu/kapcsolat' : '/en/contact';
  const ease = [0.33, 1, 0.68, 1] as const;

  return (
    <section className="w-full py-20 md:py-28">
      <div className="px-4 md:px-8">
        {/* Fejléc: cím balra, kapcsoló jobbra (a közös fejléc-szabály szerint) */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6, ease }}>
          <div className="mb-6 flex items-center gap-2">
            <div className="flex h-4 w-4 items-center justify-center rounded-full bg-black">
              <PlusIcon className="h-2.5 w-2.5 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">{c.badge}</span>
          </div>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-10">
            <h2 className="min-w-0 flex-1 text-4xl font-semibold leading-[0.95] tracking-[-0.04em] text-black md:text-6xl xl:text-7xl">{c.heading}</h2>
            <div role="tablist" aria-label={c.badge} className="inline-flex shrink-0 self-start rounded-full border border-black/10 bg-white p-1 md:self-auto">
              {(['projects', 'care'] as const).map((k) => (
                <button
                  key={k}
                  type="button"
                  role="tab"
                  aria-selected={tab === k}
                  onClick={() => setTab(k)}
                  className={`relative rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${tab === k ? 'text-white' : 'text-black/70 hover:text-black'}`}
                >
                  {tab === k && <motion.span layoutId="pricing-tab-pill" className="absolute inset-0 rounded-full bg-black" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
                  <span className="relative">{c.tabs[k]}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Kártyák */}
        {/* mobilon vízszintesen lapozható sor (a következő kártya széle belóg, bekattanó görgetés), tablettől 3 oszlop */}
        <div
          data-lenis-prevent-touch
          className="-mx-4 mt-12 flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-px-4 px-4 pb-2 [scrollbar-width:none] md:mx-0 md:mt-16 md:grid md:grid-cols-3 md:gap-3 md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden"
        >
          {cards.map((card, i) => (
            <motion.article
              key={tab + card.title}
              className="flex w-[85%] shrink-0 snap-start flex-col rounded-card border border-black/10 bg-white p-2 md:w-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 * i, ease }}
            >
              <div className="aspect-[16/10] overflow-hidden rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={strapiImage(`/api/media/file/${card.image}`)} alt="" aria-hidden loading="lazy" className="h-full w-full object-cover" />
              </div>
              <div className="flex flex-1 flex-col px-4 pb-5 pt-5 md:px-5">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-xl font-semibold tracking-tight text-black md:text-2xl">{card.title}</h3>
                  <span className="shrink-0 text-sm text-black/50">{card.meta}</span>
                </div>
                <p className="mt-4 flex flex-wrap items-baseline gap-x-2">
                  {!hu && <span className="text-sm text-black/50">{card.suffix === 'from' ? 'from' : ''}</span>}
                  <span className="text-4xl font-semibold tracking-[-0.04em] text-black md:text-5xl">{card.price}</span>
                  {(hu || card.suffix !== 'from') && <span className="text-lg text-black/60">{card.suffix}</span>}
                </p>
                {card.text && <p className="mt-4 text-base leading-relaxed text-black/70">{card.text}</p>}
                <ul className="mt-5 space-y-3 border-t border-black/10 pt-5">
                  {card.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-3 text-base text-black">
                      <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: DOT }} />
                      {pt}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-6">
                  <Link href={contactHref as never} className="inline-block border-b-2 border-black pb-0.5 text-base font-medium text-black transition-opacity hover:opacity-60">
                    {tab === 'projects' ? c.projectLink : c.careLink}
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <p className="mt-10 text-base text-black/60">{c.note}</p>
      </div>
    </section>
  );
}
