// Részletes, csomagonkénti bontás az árak oldalra — nem oldalra tördelt
// kártyák, hanem egy nagyobb, egymás után legördülő, "folyamat"-jellegű
// elrendezés, csomagonként önálló, teljes szélességű szekcióval (zebra-
// elrendezés, nagy tipográfia, saját háttér-számozással a vizuális
// érdekességért kép nélkül — lásd [[images-deferred-to-end]]). A tetején
// egy önálló rész arról, miért jobb, hogy egy csapat csinálja az egész
// csomagot az elejétől — ez a davelopment valós, máshol is hirdetett
// pozicionálása (lásd pages_locales.card_short_description, weboldal-
// keszites oldal), nem kitalált érv. A csomag-adatok (ár, perkek,
// határidő) a CMS-ből jönnek, csak a magyarázó szöveg kódba épített.
'use client';

import { motion } from 'framer-motion';

type Plan = {
  name?: string | null;
  price?: string | number | null;
  currency?: string | null;
  currency_project_label?: string | null;
  time_label?: string | null;
  time_value?: string | null;
};

type DeepDiveCopy = {
  intro: string;
  points: string[];
};

// 2026-11: az új csomagok (egyszeri projektár + havonta megújuló támogatás). A kulcs a csomag neve —
// magyarul és angolul is (a CMS-ben a név lokalizált), ezért mindkét nyelv nevét felvesszük.
const UZLETI = {
  hu: {
    intro: 'Üres lapról tervezett, egyedi weboldal azoknak, akik most indulnak, vagy akiknek a mostani oldaluk már nem hoz megkeresést.',
    points: [
      'Egyedileg tervezett oldalak — nem sablon, hanem a vállalkozásodra szabott felépítés és design.',
      'Olyan tartalomkezelőt kapsz, amit betanítás után egyedül is tudsz frissíteni.',
      'Technikai SEO, mérés és gyors betöltés már az indulástól.',
      'Fix ár az első, 30 perces beszélgetés után — a domain és a tárhely díja külön, az ügyfelet terheli.',
    ],
  },
  en: {
    intro: 'A custom website designed from a blank page, for businesses that are just starting out or whose current site no longer brings enquiries.',
    points: [
      'Custom-designed pages — not a template, a structure and design built around your business.',
      'A content manager you can update yourself after a short training.',
      'Technical SEO, tracking and fast loading from launch day.',
      'A fixed price after the first 30-minute call — domain and hosting fees are billed separately.',
    ],
  },
};
const MARKETING = {
  hu: {
    intro: 'Minden, ami az Üzleti weboldalban, plusz a marketing, ami az indulástól forgalmat és megkeresést hoz.',
    points: [
      'Kulcsszókutatás és tartalomstratégia: mire keresnek az ügyfeleid, és mit írjunk róla.',
      '4–5 induló, kulcsszóra írt blogcikk, belső linkekkel.',
      'Beállított Google Ads kampány és konverziókövetés, hogy lásd, mi hozza a megkeresést.',
      'Helyi SEO és Google Cégprofil, hogy a környékeden is megtaláljanak.',
    ],
  },
  en: {
    intro: 'Everything in Business website, plus the marketing that brings traffic and enquiries from launch.',
    points: [
      'Keyword research and content strategy: what your customers search for and what to write about it.',
      '4–5 keyword-led launch articles, with internal links.',
      'A live Google Ads campaign and conversion tracking, so you see what brings the enquiry.',
      'Local SEO and Google Business Profile, so people nearby find you too.',
    ],
  },
};
const EGYEDI = {
  hu: {
    intro: 'Azoknak, akiknek már nem elég egy weboldal: egyedi rendszer kell, ami a saját működésükhöz igazodik.',
    points: [
      'Felméréssel és technikai tervezéssel indul — az árat és az ütemezést közösen rögzítjük.',
      'Foglalórendszer, ügyfélportál vagy bármilyen funkció, ami a mindennapi munkát könnyíti.',
      'Integrációk a meglévő eszközeiddel (számlázás, naptár, CRM).',
      'Az indulás után is ugyanaz a csapat marad veled.',
    ],
  },
  en: {
    intro: 'For businesses that need more than a website: a custom system that fits how they work.',
    points: [
      'It starts with discovery and technical scoping — price and timeline are agreed together.',
      'A booking system, client portal or any feature that makes daily work easier.',
      'Integrations with the tools you already use (invoicing, calendar, CRM).',
      'The same team stays with you after launch.',
    ],
  },
};
const TAMOGATAS = {
  hu: {
    intro: 'Havonta megújuló támogatás, hogy a weboldalad az indulás után is fejlődjön — fejlesztő felvétele nélkül.',
    points: [
      'Alap támogatás (29 900 Ft/hó): frissítések, biztonsági javítások és elérhetőség-figyelés.',
      'Növekedés (59 900 Ft/hó): nagyobb fejlesztések, havi teljesítményriport és A/B tesztek.',
      'Beágyazott csapat (149 900 Ft/hó): közvetlen, személyes kapcsolat a fejlesztővel, havi 4 SEO-cikk, elsőbbség.',
      'Nem órákban mérjük: a kisebb módosításokat folyamatosan intézzük. 30 napos felmondással.',
    ],
  },
  en: {
    intro: 'Rolling monthly care, so your website keeps improving after launch — without hiring a developer.',
    points: [
      'Essential care (29,900 HUF/month): updates, security patches and uptime monitoring.',
      'Growth (59,900 HUF/month): bigger changes, a monthly performance report and A/B tests.',
      'Embedded (149,900 HUF/month): a direct, personal line to your developer, four SEO articles a month, priority.',
      'We do not count hours: small changes are handled as they come. Thirty days notice.',
    ],
  },
};

const DEEP_DIVE: Record<string, { hu: DeepDiveCopy; en: DeepDiveCopy }> = {
  'Üzleti weboldal': UZLETI,
  'Business website': UZLETI,
  'Weboldal + marketing': MARKETING,
  'Website + marketing': MARKETING,
  'Egyedi fejlesztés': EGYEDI,
  'Custom build': EGYEDI,
  'Támogatás': TAMOGATAS,
  'Care plans': TAMOGATAS,
};

const WHY_ONE_TEAM = {
  hu: {
    heading: 'Miért jó, ha egy kézben van az egész?',
    body: 'A legtöbb vállalkozó külön fejlesztőt, külön designert és külön marketingest fogad fel — ők ritkán beszélnek egymással, a weboldal máshogy néz ki, mint az arculat, a marketing pedig olyan oldalra hajt forgalmat, ami nincs rá felkészítve. Nálunk a design, a technikai SEO és a marketing egy kézben, együtt készül az első naptól, nem utólag illesztjük össze. Nincs egyeztetési káosz és nincs „ki a hibás” ping-pong: a felelősség egy helyen van, és minden döntés figyelembe veszi a többit.',
  },
  en: {
    heading: 'Why it helps to have it all in one hand',
    body: "Most business owners hire a separate developer, designer and marketer — they rarely talk to each other, the website looks different from the brand, and marketing drives traffic to a page that isn't ready for it. With us, design, technical SEO and marketing are built together, in one hand, from day one — not stitched together afterwards. No coordination chaos, no finger-pointing: the responsibility sits in one place, and every decision accounts for the others.",
  },
};

export const PlanDeepDive = ({ plans, locale }: { plans: Plan[]; locale?: string }) => {
  const isHu = locale?.toLowerCase().startsWith('hu');
  const clean = (plans || []).filter((p) => p?.name && DEEP_DIVE[p.name as string]);
  if (clean.length < 2) return null;
  const why = isHu ? WHY_ONE_TEAM.hu : WHY_ONE_TEAM.en;

  return (
    <section className="w-full">
      <div className="w-full px-4 py-16 md:px-8 md:py-24">
        {/* ── Miért egy kézben — az új blokkok stílusában: nagy cím balra, szöveg jobbra ── */}
        <motion.div
          className="mb-20 grid grid-cols-1 gap-8 md:mb-28 lg:grid-cols-12 lg:gap-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
        >
          <h2 className="text-4xl font-semibold leading-[0.95] tracking-[-0.05em] text-black md:text-6xl lg:col-span-6 xl:text-7xl">
            {why.heading}
          </h2>
          <p className="text-lg leading-relaxed text-black/70 md:text-xl lg:col-span-6 lg:self-end">{why.body}</p>
        </motion.div>

        <motion.h3
          className="mb-10 border-t border-black/15 pt-8 text-3xl font-semibold tracking-[-0.04em] text-black md:mb-16 md:text-5xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
        >
          {isHu ? 'A csomagok részletesen' : 'The packages in detail'}
        </motion.h3>

        {/* ── Csomagonkénti, teljes szélességű, egymás után érkező szekciók ── */}
        <div className="flex flex-col">
          {clean.map((p, i) => {
            const numericPrice =
              p.price !== null && p.price !== undefined && p.price !== '' && !isNaN(Number(p.price));
            const priceLabel = numericPrice
              ? `${Math.round(Number(p.price)).toLocaleString(locale)} ${p.currency || ''} ${p.currency_project_label || ''}`.trim()
              : String(p.price ?? '');
            const copy = DEEP_DIVE[p.name as string][isHu ? 'hu' : 'en'];

            return (
              <motion.div
                key={p.name}
                className="relative py-12 md:py-20 border-t border-gray-100 first:border-t-0 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 overflow-hidden"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.7, ease: [0.33, 1, 0.68, 1] }}
              >
                {/* Óriás, halvány sorszám a háttérben — vizuális karakter kép nélkül */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none select-none absolute -top-4 right-0 lg:right-8 text-[8rem] md:text-[14rem] font-bold text-black/[0.03] leading-none"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>

                <div className="lg:col-span-4 relative">
                  <h4 className="text-4xl md:text-6xl font-bold tracking-tight text-black">{p.name}</h4>
                  {priceLabel && (
                    <p className="text-black/80 text-xl md:text-2xl font-semibold mt-3">{priceLabel}</p>
                  )}
                  {p.time_value && (
                    <p className="text-black/40 text-sm mt-1">
                      {(p.time_label || (isHu ? 'Határidő' : 'Timeline'))}: {p.time_value}
                    </p>
                  )}
                  <p className="text-black/70 text-base md:text-lg leading-relaxed mt-6">{copy.intro}</p>
                </div>

                <div className="lg:col-span-8 relative flex flex-col gap-4 md:gap-5">
                  {copy.points.map((point, idx) => (
                    <motion.div
                      key={idx}
                      className="flex items-start gap-3 md:gap-4"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.33, 1, 0.68, 1] }}
                    >
                      <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F05A28]" />
                      <span className="text-black/75 text-base md:text-lg leading-snug">{point}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
