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
import { PlusIcon } from 'lucide-react';
import { Container } from '@/components/container';

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

const DEEP_DIVE: Record<string, { hu: DeepDiveCopy; en: DeepDiveCopy }> = {
  Mikró: {
    hu: {
      intro: 'Teljesen egyedi, Framer-alapú weboldal azoknak, akik most szeretnének igényes, professzionális online jelenlétet — nem sablonból, hanem a vállalkozásodra szabott UX/UI tervezéssel.',
      points: [
        'Akár 30 aloldalig bővíthető — egy egyszerű bemutatkozó oldaltól egy részletesebb szolgáltatás-struktúráig minden elfér benne.',
        'A Framer-hosting villámgyors betöltést és SEO-barát alapokat ad már az induláskor.',
        'Az admin felületen keresztül magad is frissítheted a tartalmat — ha mégsem szeretnél vele foglalkozni, a karbantartást opcionálisan, havi 14 900 Ft-tól átvállaljuk.',
        'A domain/tárhely technikai beállítását elvégezzük, de a tényleges szolgáltatási díj külön, az ügyfelet terheli.',
        'Opcionális marketing-csomag (havi 39 900 Ft): Google Cégem (Google Business Profile) beállítás, Google Ads felügyelet és technikai SEO-alapok.',
      ],
    },
    en: {
      intro: 'A fully custom, Framer-based website for anyone who wants a polished, professional online presence now — not a template, but UX/UI designed around your business.',
      points: [
        'Scales up to 30 subpages — fits anything from a simple one-pager to a more detailed service structure.',
        'Framer hosting gives you fast loading and SEO-friendly foundations from day one.',
        "You can update content yourself via the admin panel — or we handle maintenance for you, optionally, starting at 14,900 HUF/month.",
        'We handle the technical setup of your domain/hosting, but the actual service fee is billed separately to you.',
        'Optional marketing add-on (39,900 HUF/month): Google Business Profile setup, Google Ads oversight and technical SEO basics.',
      ],
    },
  },
  Rajt: {
    hu: {
      intro: 'Azoknak, akik túlléptek az alap bemutatkozó oldalon, és komolyan szeretnék építeni az organikus (nem fizetett) láthatóságukat a keresőkben.',
      points: [
        'Minden benne van, ami a Mikróban, plusz teljesen egyedi admin felület és blog funkció — a rendszeres, friss tartalom az, amire a Google és az AI-keresők is épülnek a rangsoroláskor.',
        'Induláskor rögtön 4-5 cikket megírunk helyetted.',
        'Technikai és AI-alapú keresőoptimalizálás a hosszú távú helyezésedért, nem csak egy gyors, ideiglenes eredményért.',
        'A domain/tárhely szolgáltatási díja itt is külön, az ügyfelet terheli.',
        'Opcionális marketing-csomag (havi 59 900 Ft): havi 2 interjú alapú cikk, technikai SEO, heti felügyelettel kezelt Google Ads kampány.',
      ],
    },
    en: {
      intro: "For businesses that have outgrown a basic landing page and want to seriously build organic (non-paid) search visibility.",
      points: [
        'Includes everything in Mikró, plus a fully custom admin panel and a blog — regular, fresh content is exactly what Google and AI search engines rely on for ranking.',
        'We write 4-5 articles for you right at launch.',
        'Technical and AI-driven SEO work builds your long-term position, not just a quick, temporary bump.',
        'The domain/hosting service fee is billed separately here too.',
        'Optional marketing add-on (59,900 HUF/month): 2 interview-based articles per month, technical SEO, weekly-managed Google Ads campaign.',
      ],
    },
  },
  Növekedés: {
    hu: {
      intro: 'Azoknak a vállalkozásoknak, akiknek már nem elég egy statikus weboldal — egyedi, a saját folyamataikra szabott rendszerre van szükségük.',
      points: [
        'Legyen az foglalási rendszer, ügyfélportál, vagy bármilyen más funkció, ami a mindennapi működésüket könnyíti.',
        'Minden benne van, ami a Rajt csomagban — a marketing-kampányokat itt napi szinten felügyeljük, nem csak hetente.',
        'A fejlesztői csapat prioritásként kezeli a kéréseidet.',
        'A domain/tárhely szolgáltatási díja itt is külön, az ügyfelet terheli.',
        'Opcionális marketing-csomag (havi 89 900 Ft): havi 2 interjú alapú cikk, teljes Google Ads kampány-kezelés NAPI felügyelettel, havi stratégiai riport.',
      ],
    },
    en: {
      intro: 'For businesses that have outgrown a static website — they need a custom system shaped around their own processes.',
      points: [
        'Whether that\'s a booking system, a client portal, or any other feature that makes daily operations easier.',
        'Includes everything in Rajt — marketing campaigns are monitored daily here, not just weekly.',
        'The dev team treats your requests as a priority.',
        'The domain/hosting service fee is billed separately here too.',
        'Optional marketing add-on (89,900 HUF/month): 2 interview-based articles per month, full daily-managed Google Ads campaign, monthly strategy report.',
      ],
    },
  },
};

const WHY_ONE_TEAM = {
  hu: {
    heading: 'Miért jó, hogy egy csapat csinálja az egészet?',
    body: 'A legtöbb vállalkozó külön fejlesztőt, külön designert és külön marketingest fogad fel — ezek sosem beszélnek egymással, a weboldal máshogy néz ki, mint az arculat, a marketing pedig olyan oldalra hajt forgalmat, ami nincs is rá felkészítve. Nálunk egy csapat tervezi meg az egészet a csomag szintjén, a legelső naptól: a dizájn, a technikai SEO és a marketing együtt készül, nem utólag illesztjük össze. Ennek az az eredménye, hogy nincs egyeztetési káosz, nincs "ki a hibás" ping-pong két külső partner között — egy helyen van a felelősség, és minden döntés figyelembe veszi a többit.',
  },
  en: {
    heading: 'Why is it good that one team does everything?',
    body: "Most business owners hire a separate developer, a separate designer and a separate marketer — they never talk to each other, the website looks different from the brand, and marketing drives traffic to a page that isn't even ready for it. With us, one team designs the whole thing at the package level, from day one: design, technical SEO and marketing are built together, not stitched together afterward. The result: no coordination chaos, no finger-pointing between two outside vendors — the responsibility sits in one place, and every decision accounts for the others.",
  },
};

export const PlanDeepDive = ({ plans, locale }: { plans: Plan[]; locale?: string }) => {
  const isHu = locale?.toLowerCase().startsWith('hu');
  const clean = (plans || []).filter((p) => p?.name && DEEP_DIVE[p.name as string]);
  if (clean.length < 2) return null;
  const why = isHu ? WHY_ONE_TEAM.hu : WHY_ONE_TEAM.en;

  return (
    <section className="w-full">
      <Container className="py-12 md:py-20">
        {/* ── Miért egy csapat — önálló, nagy, meggyőző blokk ── */}
        <motion.div
          className="max-w-3xl mb-16 md:mb-28"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
        >
          <h2 className="text-3xl md:text-6xl font-bold tracking-tight text-black leading-[1.05]">
            {why.heading}
          </h2>
          <p className="text-black/60 text-base md:text-xl leading-relaxed mt-6">{why.body}</p>
        </motion.div>

        <motion.h3
          className="text-2xl md:text-4xl font-bold tracking-tight text-black mb-10 md:mb-16"
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
                      <motion.span
                        className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-black flex items-center justify-center"
                        whileHover={{ scale: 1.25 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      >
                        <PlusIcon className="w-3 h-3 text-white" />
                      </motion.span>
                      <span className="text-black/75 text-base md:text-lg leading-snug">{point}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
