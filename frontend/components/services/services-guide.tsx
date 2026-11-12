'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { PlusIcon, Check, ArrowUpRight } from 'lucide-react';
import { Container } from '@/components/container';
import { PillLink } from '@/components/pill-link';

/**
 * Services hub (/hu/szolgaltatasok, /en/services): plain-language "which service do I need?"
 * guide — situation (in the customer's words) → what helps → link. Complements the service
 * cards (which say WHAT we do) instead of repeating them. Copy lives here, not in the CMS,
 * because no CMS block supports inline links.
 */
const M = (f: string) => `/api/media/file/${f}`;

type Situation = { quote: string; answer: string; href: string; cta: string };
type Copy = {
  badge: string; heading: string; lead: string; situations: Situation[];
  getTitle: string; get: string[]; outro: string; outroCta: string;
  stepsBadge: string; stepsHeading: string; stepsLead: string; steps: { title: string; time: string; text: string; pills: string[]; images: string[] }[];
};

const HU = (L: (h: string, t: string) => React.ReactNode): Copy => ({
  badge: 'Segítünk választani',
  heading: 'Melyik kell neked?|Válaszd ki, mi a helyzeted.',
  lead: 'Nem kell értened a szakkifejezésekhez. Elég, ha tudod, mi a gond — a megoldást mi hozzuk.',
  situations: [
    { quote: '„Még nincs weboldalam, vagy a mostani elavult, nem tetszik.”', answer: 'Üres lapról tervezett, mobilon is jól működő weboldalt készítünk, ami bemutat és megkeresést hoz. Az első beszélgetés után fix árat kapsz, 190 000 Ft-tól.', href: '/hu/szolgaltatasok/weboldal-keszites', cta: 'Weboldal készítés' },
    { quote: '„Van weboldalam, de már nem illik a cégünkhöz.”', answer: 'Új alapokra helyezzük úgy, hogy a Google-helyezéseid megmaradjanak: minden régi címet átirányítunk, és az indulás után is figyeljük a helyezéseket.', href: '/hu/szolgaltatasok/weboldal-ujratervezes', cta: 'Weboldal újratervezés' },
    { quote: '„Van weboldalam, de senki nem talál meg a Google-ben.”', answer: 'Keresőoptimalizálás és Google-hirdetés a weboldalad mellé: a hirdetés már az első hetekben hoz érdeklődőt, a SEO pedig hónapról hónapra több ingyenes látogatót.', href: '/hu/szolgaltatasok/marketing-es-seo', cta: 'Marketing & SEO' },
    { quote: '„Most indulok, nincs még logóm, és nem tudom, hogyan nézzek ki.”', answer: 'Megtervezzük a logót, a színeket és a betűket, hogy mindenhol — weboldalon, Instagramon, névjegyen — ugyanolyan, felismerhető legyél.', href: '/hu/szolgaltatasok/branding-arculat', cta: 'Arculat és design' },
    { quote: '„A régi WordPress-oldalam lassú, akadozik, és félek hozzányúlni.”', answer: 'Átvesszük: frissítjük, figyeljük és gyorsítjuk, havonta megújuló támogatással, 29 900 Ft/hó-tól. Ha már nem éri meg foltozgatni, megmutatjuk az utat egy új oldalhoz.', href: '/hu/szolgaltatasok/karbantartas', cta: 'Weboldal karbantartás' },
    { quote: '„Rengeteg időm megy el telefonos foglalásra és papírmunkára.”', answer: 'Olyan rendszert építünk, ami helyetted dolgozik: online időpontfoglalás, automatikus emlékeztető, számlázás — a vállalkozásod működéséhez igazítva.', href: '/hu/arak', cta: 'Egyedi fejlesztés' },
  ],
  stepsBadge: 'Így zajlik',
  stepsHeading: 'Öt lépés az ötlettől|az élő weboldalig.',
  stepsLead: 'Végig tudod, hol tartunk és mi jön. Neked csak a döntésekben kell részt venned — a technikai részt mi visszük.',
  steps: [
    { title: 'Ingyenes egyeztetés', time: '30 perc', text: 'Elmondod, mivel foglalkozol és mit szeretnél elérni. Megmondjuk, mi kell hozzá és mennyibe kerül — kötelezettség nélkül.', pills: ['Díjmentes', 'Kötelezettség nélkül'], images: [M('davelopment-egyuttmukodes-kezek.webp'), M('davelopment-markaepites-otlet.webp')] },
    { title: 'Terv és felépítés', time: 'pár nap', text: 'Összerakjuk, milyen oldalak legyenek, mi kerüljön rájuk, és hogyan találnak meg a Google-ben.', pills: ['Oldaltérkép', 'Kulcsszavak'], images: [M('davelopment-igenyfelmeres-folyamatabra.webp'), M('davelopment-weboldal-folyamat-ceruza.png')] },
    { title: 'Design és fejlesztés', time: '1–4 hét', text: 'Megtervezzük és elkészítjük az oldalt. Menet közben megnézheted, és elmondhatod, mit alakítsunk rajta.', pills: ['Egyedi design', 'Mobilbarát'], images: [M('davelopment-fejlesztes-laptop.webp'), M('davelopment-design.png')] },
    { title: 'Tesztelés és indulás', time: 'pár nap', text: 'Telefonon, tableten és gépen is átnézzük, beállítjuk a domaint, a Google-t és a mérést, majd élesítjük.', pills: ['Domain', 'Google és mérés'], images: [M('davelopment-google-kereses-robot.webp'), M('launch-optimalizacio-davelopment.png')] },
    { title: 'Utána is veled vagyunk', time: 'folyamatosan', text: 'Frissítünk, javítunk, és ha a csomagod tartalmazza, tartalommal és hirdetéssel hozzuk a látogatókat.', pills: ['Frissítés', 'Hibajavítás'], images: [M('davelopment-weboldal-analitika-statisztika.webp'), M('davelopment-karbantartas-zsanér.png')] },
  ],
  getTitle: 'Ezt kapod, bármelyiket választod',
  get: [
    'Ingyenes, 30 perces egyeztetés — kötelezettség nélkül',
    'Egy kapcsolattartó, aki végig ugyanaz marad',
    'Fix ár, még a munka előtt — weboldal 190 000 Ft-tól',
    'Egy bemutatkozó weboldal 1–4 hét alatt elkészül',
    'Mobilon, tableten és gépen is kifogástalanul működik',
    'Az indulás után sem hagyunk magadra',
  ],
  outro: 'Nem tudod eldönteni? Írj pár sort, és megmondjuk, mivel érdemes kezdeni.',
  outroCta: 'Beszéljünk',
});

const EN = (L: (h: string, t: string) => React.ReactNode): Copy => ({
  badge: 'We help you choose',
  heading: 'Which one do you need?|Pick your situation.',
  lead: "You don't need to know the jargon. Tell us what the problem is — we bring the solution.",
  situations: [
    { quote: '"I don\'t have a website yet, or mine is outdated."', answer: 'We design a website from a blank page that works well on mobile, presents your business and brings enquiries. You get a fixed price after the first call, from 190,000 HUF.', href: '/en/services/start-your-business-online', cta: 'Websites' },
    { quote: '"We have a website, but it no longer fits the company."', answer: 'We rebuild it without losing your Google rankings: every old URL is redirected, and we keep watching rankings after launch.', href: '/en/services/website-redesign', cta: 'Website redesign' },
    { quote: '"I have a website, but nobody finds me on Google."', answer: 'SEO and Google Ads alongside your website: ads bring enquiries in the first weeks, SEO brings more free visitors month after month.', href: '/en/services/marketing-and-seo', cta: 'Marketing & SEO' },
    { quote: '"I\'m just starting out and don\'t have a logo yet."', answer: 'We design your logo, colours and fonts so you look the same and recognisable everywhere — website, Instagram, business card.', href: '/en/services/branding-identity', cta: 'Brand & design' },
    { quote: '"My old WordPress site is slow and I\'m afraid to touch it."', answer: 'We take it over: updates, monitoring and speed, on a rolling monthly plan from 29,900 HUF/month. If patching it no longer pays off, we show you the way to a new site.', href: '/en/services/maintenance', cta: 'Website care' },
    { quote: '"Phone bookings and paperwork eat up my time."', answer: 'We build a system that works for you: online booking, automatic reminders, invoicing — tailored to how your business runs.', href: '/en/pricing', cta: 'Custom build' },
  ],
  stepsBadge: 'How it works',
  stepsHeading: 'Five steps from idea|to a live website.',
  stepsLead: 'You always know where we are and what comes next. You only take part in the decisions — we handle the technical side.',
  steps: [
    { title: 'Free consultation', time: '30 minutes', text: 'Tell us what you do and what you want to achieve. We tell you what it takes and what it costs — no obligation.', pills: ['Free', 'No obligation'], images: [M('davelopment-egyuttmukodes-kezek.webp'), M('davelopment-markaepites-otlet.webp')] },
    { title: 'Plan and structure', time: 'a few days', text: 'We work out which pages you need, what goes on them, and how people will find you on Google.', pills: ['Sitemap', 'Keywords'], images: [M('davelopment-igenyfelmeres-folyamatabra.webp'), M('davelopment-weboldal-folyamat-ceruza.png')] },
    { title: 'Design and development', time: '1–4 weeks', text: 'We design and build the site. You can check it along the way and tell us what to change.', pills: ['Custom design', 'Mobile-friendly'], images: [M('davelopment-fejlesztes-laptop.webp'), M('davelopment-design.png')] },
    { title: 'Testing and launch', time: 'a few days', text: 'We check it on phone, tablet and desktop, set up the domain, Google and analytics, then go live.', pills: ['Domain', 'Google & analytics'], images: [M('davelopment-google-kereses-robot.webp'), M('launch-optimalizacio-davelopment.png')] },
    { title: "We're with you after launch", time: 'ongoing', text: 'Updates and fixes, and — if your package includes it — content and ads that bring visitors.', pills: ['Updates', 'Fixes'], images: [M('davelopment-weboldal-analitika-statisztika.webp'), M('davelopment-karbantartas-zsanér.png')] },
  ],
  getTitle: 'What you get, whichever you choose',
  get: [
    'A free, 30-minute consultation — no obligation',
    'One contact person from start to finish',
    'A fixed price before we start — websites from 190,000 HUF',
    'A business website is ready in 1–4 weeks',
    'Works perfectly on mobile, tablet and desktop',
    "We don't leave you alone after launch",
  ],
  outro: "Can't decide? Drop us a few lines and we'll tell you where to start.",
  outroCta: "Let's talk",
});

// beforeGet: ami a „Melyik kell neked?” kártyák és az „Ezt kapod” rész közé kerül (a Szolgáltatások oldalon a mockup-blokk)
export function ServicesGuide({ locale, beforeGet }: { locale: string; beforeGet?: React.ReactNode }) {
  const L = (href: string, text: string) => (
    <Link href={href} className="text-black underline underline-offset-4 decoration-black/30 hover:decoration-black transition-colors">
      {text}
    </Link>
  );
  const c = locale === 'hu' ? HU(L) : EN(L);
  const [headLeft, headRight] = c.heading.split('|');
  const ease = [0.33, 1, 0.68, 1] as const;

  return (
    <>
    <Container>
      <section className="pt-12 pb-16 md:pb-24">
        {/* Fejléc — ugyanaz a minta, mint a szolgáltatás-csúszka fölött */}
        <motion.div
          className="px-0 md:px-4 mb-12 md:mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center">
              <PlusIcon className="w-3 h-3 text-white" />
            </div>
            <p className="text-sm font-medium text-gray-700">{c.badge}</p>
          </div>
          <h2 className="font-semibold tracking-tight leading-[1.05] mb-4">
            <span className="text-black text-3xl md:text-5xl lg:text-6xl">{headLeft}</span>
            {headRight && <span className="text-black/60 text-3xl md:text-5xl lg:text-6xl"> {headRight}</span>}
          </h2>
          <p className="text-black/50 text-base md:text-lg max-w-xl">{c.lead}</p>
        </motion.div>

        {/* Helyzet-kártyák — a szolgáltatás-kártyák stílusában; hoverre feketére vált, mint az aktív kártya */}
        <div className="px-0 md:px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {c.situations.map((s, idx) => (
            <motion.div
              key={s.quote}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: idx * 0.07, ease }}
            >
              <Link
                href={s.href}
                className="group flex h-full flex-col rounded-2xl bg-white p-4 text-black transition-colors duration-300 hover:bg-black hover:text-white"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="rounded-full px-2.5 py-1 text-[11px] font-medium bg-black/5 text-black/60 transition-colors duration-300 group-hover:bg-white/15 group-hover:text-white">
                    {s.cta}
                  </span>
                  <span className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-black text-white transition-colors duration-300 group-hover:bg-white group-hover:text-black">
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-45" />
                  </span>
                </div>
                <h3 className="font-bold tracking-tight leading-[1.1] text-2xl mb-3">{s.quote}</h3>
                <p className="text-sm leading-relaxed text-black/50 transition-colors duration-300 group-hover:text-white/60">{s.answer}</p>
              </Link>
            </motion.div>
          ))}
        </div>

      </section>
    </Container>

    {/* 2026-11: az „Így zajlik” (öt lépés) blokk kikerült — a folyamatot a szolgáltatás-aloldalak ütemterve mutatja */}

    {beforeGet}

    {/* Mit kapsz — az új stílusban: nagy cím balra, a lista két oszlopban narancs pipákkal, alatta rövid mondat + gomb */}
    <section className="w-full px-4 py-16 md:px-8 md:py-24">
      <motion.div
        className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease }}
      >
        <h2 className="text-4xl font-semibold leading-[0.95] tracking-[-0.05em] text-black md:text-6xl lg:col-span-5 xl:text-7xl">{c.getTitle}</h2>
        <div className="lg:col-span-7">
          <ul className="grid grid-cols-1 gap-x-10 gap-y-5 border-t border-black/15 pt-8 sm:grid-cols-2">
            {c.get.map((g) => (
              <li key={g} className="flex items-start gap-3 text-base text-black md:text-lg">
                <span aria-hidden className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F05A28]">
                  <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
                </span>
                {g}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-col gap-5 border-t border-black/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-md text-base leading-relaxed text-black/60 md:text-lg">{c.outro}</p>
            <PillLink href={locale === 'en' ? '/en/contact' : '/hu/kapcsolat'} cta="services-guide:talk" className="self-start sm:self-auto">{c.outroCta}</PillLink>
          </div>
        </div>
      </motion.div>
    </section>
    </>
  );
}
