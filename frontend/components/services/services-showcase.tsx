'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { PillLink } from '@/components/pill-link';
import { strapiImage } from '@/lib/strapi/strapiImage';

/**
 * Szolgáltatások oldal: az öt szolgáltatás egymás alatt (2026-11, referencia alapján, a mi arculatunkkal).
 * Mobilon egymás alatt; desktopon (lg+) a bal oldali kép „megáll” (sticky) és vált, ahogy a jobb oldali szöveges
 * blokkok szalagként elgörögnek mellette (a kép jobb szélén a jelző mutatja, hol jársz).
 * Szolgáltatásonként: bal oldalt nagy kép (címke + 5 lépéses jelző), jobbra sorszám · terület, nagy cím (h2), leírás,
 * 3 adat-oszlop (ár · átfutás · eszközök), 6 pont narancs pöttyel és egy gomb a szolgáltatás saját oldalára.
 * Az árak a főoldali árazással egyeznek (pricing-simple.tsx) — ha ott változnak, itt is kell.
 */
type Service = {
  title: string;
  area: string;
  text: string;
  stats: { label: string; value: string; small?: string }[];
  points: string[];
  image: string;
  slug: string;
  more: string;
};

const DOT = '#F05A28';

function services(hu: boolean): Service[] {
  return hu
    ? [
        {
          title: 'Weboldalak', area: 'Fejlesztés', image: 'davelopment-weboldal-keszites.avif', slug: 'weboldal-keszites', more: 'Bővebben a weboldalakról',
          text: 'Üres lapról tervezett, ügyfélszerző weboldal, olyan tartalomkezelővel, amit a csapatod egyedül is visz.',
          stats: [
            { label: 'Üzleti weboldal', small: '-tól', value: '190 000 Ft' },
            { label: 'Átlagos átfutás', value: '1–4 hét' },
            { label: 'Erre építjük', value: 'Next.js, Payload, Framer' },
          ],
          points: ['Felfedező beszélgetés', 'Tartalomstruktúra', 'Vizuális irány', 'Egyedileg tervezett oldalak', 'Animációk és interakciók', 'Tartalomkezelő beállítása'],
        },
        {
          title: 'Újratervezés', area: 'Fejlesztés', image: 'davelopment-felfedezes.avif', slug: 'weboldal-ujratervezes', more: 'Bővebben az újratervezésről',
          text: 'Új alapokra helyezzük az oldalt, ami már nem illik a vállalkozásodhoz — úgy, hogy a Google-helyezéseid megmaradjanak.',
          stats: [
            { label: 'Újratervezés', small: '-tól', value: '190 000 Ft' },
            { label: 'Átlagos átfutás', value: '2–6 hét' },
            { label: 'Erre építjük', value: 'Next.js, Payload, Framer' },
          ],
          points: ['A mostani oldal és adatai átvilágítása', 'Átirányítási terv a helyezésekért', 'Új tartalomstruktúra', 'Új design minden oldalra', 'Tartalom átköltöztetése', 'Mérés az indulás után'],
        },
        {
          title: 'Marketing & SEO', area: 'Növekedés', image: 'davelopment-hirdeteskezeles.avif', slug: 'marketing-es-seo', more: 'Bővebben a marketingről',
          text: 'Keresőoptimalizálás, tartalom és Google-hirdetések, amelyek ügyfeleket hoznak — mérhető eredményekkel.',
          stats: [
            { label: 'Weboldal + marketing', small: '-tól', value: '330 000 Ft' },
            { label: 'Átlagos átfutás', value: '4–6 hét' },
            { label: 'Eszközök', value: 'Google Ads, Search Console, GA4' },
          ],
          points: ['Kulcsszókutatás', 'Technikai SEO', 'Tartalomstratégia', 'SEO-cikkek', 'Google Ads kampány', 'Havi riport'],
        },
        {
          title: 'Arculat és design', area: 'Arculat', image: 'davelopment-markaepites.avif', slug: 'branding-arculat', more: 'Bővebben az arculatról',
          text: 'Betűk, színek, elemek és mozgás, amelyek a márkádat egységesen viszik át az online térbe.',
          stats: [
            { label: 'Weboldal-projekt része', small: '-tól', value: '190 000 Ft' },
            { label: 'Átlagos átfutás', value: '3–5 hét' },
            { label: 'Eszközök', value: 'Figma' },
          ],
          points: ['Logó és változatai', 'Színpaletta és betűk', 'Arculati kézikönyv', 'Felületi elemkészlet', 'Közösségimédia-sablonok', 'Mozgás és animáció'],
        },
        {
          title: 'Támogatás és növekedés', area: 'Támogatás', image: 'davelopment-karbantartas.avif', slug: 'karbantartas', more: 'Bővebben a támogatásról',
          text: 'Frissítések, sebesség, tesztelés és közvetlen kapcsolat a fejlesztővel az indulás után is.',
          stats: [
            { label: 'Alap támogatás', small: '/hó-tól', value: '29 900 Ft' },
            { label: 'Szerződés', value: 'Havonta megújuló' },
            { label: 'Válaszidő', value: 'Egy munkanapon belül' },
          ],
          points: ['Frissítések és biztonsági javítások', 'Elérhetőség-figyelés', 'Folyamatos módosítások', 'Teljesítményriport', 'A/B tesztek', 'Közvetlen kapcsolat a fejlesztővel'],
        },
      ]
    : [
        {
          title: 'Websites', area: 'Build', image: 'davelopment-weboldal-keszites.avif', slug: 'start-your-business-online', more: 'More about websites',
          text: 'A marketing site designed from a blank page, on a CMS your team can run on its own.',
          stats: [
            { label: 'Business website', small: 'from', value: '190,000 HUF' },
            { label: 'Typical timeline', value: '1–4 weeks' },
            { label: 'Built on', value: 'Next.js, Payload, Framer' },
          ],
          points: ['Discovery call', 'Content structure', 'Art direction', 'Custom page designs', 'Motion and interaction', 'CMS set-up'],
        },
        {
          title: 'Redesigns', area: 'Build', image: 'davelopment-felfedezes.avif', slug: 'website-redesign', more: 'More about redesigns',
          text: 'A rebuild for the site that no longer matches the business, without losing your rankings.',
          stats: [
            { label: 'Redesign', small: 'from', value: '190,000 HUF' },
            { label: 'Typical timeline', value: '2–6 weeks' },
            { label: 'Built on', value: 'Next.js, Payload, Framer' },
          ],
          points: ['Audit of the current site and data', 'Redirect plan to keep rankings', 'New content structure', 'New design for every page', 'Content migration', 'Tracking after launch'],
        },
        {
          title: 'Marketing & SEO', area: 'Growth', image: 'davelopment-hirdeteskezeles.avif', slug: 'marketing-and-seo', more: 'More about marketing',
          text: 'Search optimisation, content and Google Ads that bring in customers — with measurable results.',
          stats: [
            { label: 'Website + marketing', small: 'from', value: '330,000 HUF' },
            { label: 'Typical timeline', value: '4–6 weeks' },
            { label: 'Tools', value: 'Google Ads, Search Console, GA4' },
          ],
          points: ['Keyword research', 'Technical SEO', 'Content strategy', 'SEO articles', 'Google Ads campaign', 'Monthly report'],
        },
        {
          title: 'Brand & design', area: 'Brand', image: 'davelopment-markaepites.avif', slug: 'branding-identity', more: 'More about brand',
          text: 'Type, colour, components and movement that carry the brand online.',
          stats: [
            { label: 'Part of website projects', small: 'from', value: '190,000 HUF' },
            { label: 'Typical timeline', value: '3–5 weeks' },
            { label: 'Tools', value: 'Figma' },
          ],
          points: ['Logo and variations', 'Colour and type', 'Brand guidelines', 'UI component kit', 'Social media templates', 'Motion'],
        },
        {
          title: 'Support & growth', area: 'Care', image: 'davelopment-karbantartas.avif', slug: 'maintenance', more: 'More about support',
          text: 'Updates, speed, testing and a direct line to your developer after launch.',
          stats: [
            { label: 'Essential care', small: 'from', value: '29,900 HUF/mo' },
            { label: 'Contract', value: 'Rolling monthly' },
            { label: 'Response time', value: 'Within one working day' },
          ],
          points: ['Updates and security patches', 'Uptime monitoring', 'Ongoing changes', 'Performance report', 'A/B tests', 'A direct line to your developer'],
        },
      ];
}

const ease = [0.33, 1, 0.68, 1] as const;

function Media({ s, i, list, total, imgStyle }: { s: Service; i: number; list: Service[]; total: string; imgStyle?: any }) {
  const n = String(i + 1).padStart(2, '0');
  return (
    <>
      {imgStyle ? (
        // desktop: a kép görgetésre zoomol (csak transform → GPU, nem szaggat)
        <motion.img src={strapiImage(`/api/media/file/${s.image}`)} alt="" aria-hidden loading="lazy" style={imgStyle} className="absolute inset-0 h-full w-full object-cover will-change-transform" />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={strapiImage(`/api/media/file/${s.image}`)} alt="" aria-hidden loading="lazy" className="h-full w-full object-cover" />
      )}
      <div aria-hidden className="absolute right-4 top-1/2 flex -translate-y-1/2 flex-col gap-2">
        {list.map((_, k) => (
          <span key={k} className={`h-9 w-1 rounded-full transition-colors duration-300 ${k === i ? 'bg-white' : 'bg-white/35'}`} />
        ))}
      </div>
      <span className="absolute bottom-4 left-4 rounded-full bg-white px-4 py-2 font-mono text-xs text-black md:text-sm">
        {n} / {total} · {s.title}
      </span>
    </>
  );
}

// headingTag: a mobil és a desktop változat is a DOM-ban van — csak a desktopé h2, hogy ne legyen kétszer ugyanaz a címsor (SEO)
function Body({ s, i, total, hu, headingTag = 'h2' }: { s: Service; i: number; total: string; hu: boolean; headingTag?: 'h2' | 'p' }) {
  const H = headingTag;
  const n = String(i + 1).padStart(2, '0');
  return (
    <>
      <p className="font-mono text-sm text-black/50">{n} / {total} · {s.area}</p>
      <H className="mt-4 text-5xl font-semibold leading-[0.95] tracking-[-0.04em] text-black md:text-6xl 2xl:text-7xl">{s.title}</H>
      <p className="mt-6 max-w-xl text-lg leading-snug text-black md:text-xl">{s.text}</p>

      <dl className="mt-8 grid grid-cols-1 border-y border-black/10 sm:grid-cols-3 2xl:mt-10">
        {s.stats.map((st, k) => (
          <div key={st.label} className={`flex flex-col justify-between gap-4 py-5 ${k > 0 ? 'border-t border-black/10 sm:border-l sm:border-t-0 sm:pl-6' : 'sm:pr-6'}`}>
            <dt className="font-mono text-xs text-black/50 md:text-sm">{st.label}</dt>
            <dd>
              {k === 0 && st.small && !hu && <span className="block font-mono text-xs text-black/50">{st.small}</span>}
              <span className={k === 0 ? 'text-3xl font-semibold tracking-[-0.04em] text-black md:text-4xl' : 'text-lg font-medium text-black'}>{st.value}</span>
              {k === 0 && st.small && hu && <span className="ml-1 text-base text-black/60">{st.small}</span>}
            </dd>
          </div>
        ))}
      </dl>

      <ul className="mt-6 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2 2xl:mt-8">
        {s.points.map((pt) => (
          <li key={pt} className="flex items-start gap-3 text-base text-black md:text-lg">
            <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: DOT }} />
            {pt}
          </li>
        ))}
      </ul>

      <PillLink href={`/${hu ? 'hu/szolgaltatasok' : 'en/services'}/${s.slug}`} className="mt-8 self-start 2xl:mt-10" cta={`services-showcase:${s.slug}`}>
        {s.more}
      </PillLink>
    </>
  );
}

// Desktop képréteg: a későbbi kép a korábbi FÖLÖTT van, és a szakaszhatáron egy pillanat alatt megjelenik
// (villanásszerű váltás, nincs áttetsző, fehéres átmenet). Közben a kép
// 1,1 → 1 közé kizoomol (parallax nincs — Dave kérése). Mind scroll-linkelt, csak transform/clip.
function ImageLayer({ s, i, list, total, progress }: { s: Service; i: number; list: Service[]; total: string; progress: MotionValue<number> }) {
  // a jobb oldali i. blokk akkor van középen, amikor progress = i/(n-1); a képváltás a két blokk közti félútnál történik
  const n = list.length;
  const seg = 1 / (n - 1);
  const start = i * seg - seg / 2;
  const end = i * seg + seg / 2;
  // „villanásszerű” váltás: a kép a határon egyszerre jelenik meg / tűnik el (nincs függöny, nincs áttűnés)
  const opacity = useTransform(progress, (v) => (i === 0 || v >= start ? 1 : 0));
  // zoom: megjelenéskor 110%-ról indul, és a saját szakaszában lassan 100%-ra zoomol KI
  const scale = useTransform(progress, [Math.max(0, start), Math.min(1, end)], [1.1, 1]);
  return (
    <motion.div style={{ opacity, zIndex: i }} className="absolute inset-0 overflow-hidden">
      <Media s={s} i={i} list={list} total={total} imgStyle={{ scale }} />
    </motion.div>
  );
}

export function ServicesShowcase({ locale = 'hu' }: { locale?: string }) {
  const hu = locale !== 'en';
  const list = services(hu);
  const total = String(list.length).padStart(2, '0');

  // desktop: a magas külső doboz görgetése (0→1) adja, melyik szolgáltatás látszik
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] });

  return (
    <section className="w-full px-4 pb-16 md:px-8 md:pb-24">
      {/* MOBIL / TABLET: egymás alatt */}
      <div className="flex flex-col gap-16 md:gap-24 lg:hidden">
        {list.map((s, i) => (
          <motion.article
            key={s.title}
            className="flex flex-col gap-8"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease }}
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-card">
              <Media s={s} i={i} list={list} total={total} />
            </div>
            <div><Body s={s} i={i} total={total} hu={hu} headingTag="p" /></div>
          </motion.article>
        ))}
      </div>

      {/* DESKTOP: balra a kép „megáll” (sticky) és vált, ahogy görgetsz; jobbra a szöveges blokkok szalagként görögnek */}
      <div ref={trackRef} className="relative hidden grid-cols-12 gap-12 lg:grid">
        <div className="col-span-6">
          <div className="sticky top-24 h-[calc(100svh-7rem)] overflow-hidden rounded-card">
            {list.map((s, i) => (
              <ImageLayer key={s.title} s={s} i={i} list={list} total={total} progress={scrollYProgress} />
            ))}
          </div>
        </div>
        <div className="col-span-6">
          {list.map((s, i) => (
            <div key={s.title} className={`flex min-h-[calc(100svh-7rem)] flex-col justify-center py-32 xl:py-40 ${i > 0 ? 'border-t border-black/10' : ''}`}>
              <Body s={s} i={i} total={total} hu={hu} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
