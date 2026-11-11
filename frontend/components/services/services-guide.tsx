'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { PlusIcon, Check, ArrowUpRight } from 'lucide-react';
import { Container } from '@/components/container';
import { Services } from '@/components/dynamic-zone/services';

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
  getTitle: string; get: string[]; outro: React.ReactNode;
  stepsBadge: string; stepsHeading: string; stepsLead: string; steps: { title: string; time: string; text: string; pills: string[]; images: string[] }[];
};

const HU = (L: (h: string, t: string) => React.ReactNode): Copy => ({
  badge: 'Segítünk választani',
  heading: 'Melyik kell neked?|Válaszd ki, mi a helyzeted.',
  lead: 'Nem kell értened a szakkifejezésekhez. Elég, ha tudod, mi a gond — a megoldást mi hozzuk.',
  situations: [
    { quote: '„Még nincs weboldalam, vagy a mostani elavult, nem tetszik.”', answer: 'Készítünk egy modern, mobilon is jól működő weboldalt, ami bemutat és megkeresést hoz. Nincs nagy kezdő költség: havi díjat fizetsz, és a frissítés is benne van.', href: '/hu/szolgaltatasok/weboldal-keszites', cta: 'Weboldal készítés' },
    { quote: '„Van weboldalam, de senki nem talál meg a Google-ben.”', answer: 'Rendbe tesszük az oldal technikai alapjait, és rendszeresen írunk olyan tartalmat, amire a vevőid keresnek. Így hónapról hónapra több látogató érkezik ingyen.', href: '/hu/szolgaltatasok/seo-tartalommarketing', cta: 'Keresőoptimalizálás (SEO)' },
    { quote: '„Most kellenének az ügyfelek, nem fél év múlva.”', answer: 'Google-hirdetéssel már az indulás hetében megjelensz azoknál, akik épp a szolgáltatásodat keresik. Minden hónapban érthetően megmutatjuk, mire ment el a pénz és mit hozott.', href: '/hu/szolgaltatasok/hirdeteskezeles', cta: 'Hirdetéskezelés' },
    { quote: '„Most indulok, nincs még logóm, és nem tudom, hogyan nézzek ki.”', answer: 'Megtervezzük a logót, a színeket és a betűket, hogy mindenhol — weboldalon, Instagramon, névjegyen — ugyanolyan, felismerhető legyél.', href: '/hu/szolgaltatasok/branding-arculat', cta: 'Arculattervezés' },
    { quote: '„A régi WordPress-oldalam lassú, akadozik, és félek hozzányúlni.”', answer: 'Átvesszük: frissítjük, mentést készítünk és gyorsan javítjuk, ha valami elromlik. Ha már nem éri meg foltozgatni, megmutatjuk az utat egy új oldalhoz.', href: '/hu/szolgaltatasok/karbantartas', cta: 'Weboldal karbantartás' },
    { quote: '„Rengeteg időm megy el telefonos foglalásra és papírmunkára.”', answer: 'Olyan rendszert építünk, ami helyetted dolgozik: online időpontfoglalás, automatikus emlékeztető, számlázás — a vállalkozásod működéséhez igazítva.', href: '/hu/szolgaltatasok/digitalis-rendszerek', cta: 'Egyedi rendszerek' },
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
    'Havi díj, nagy egyszeri beruházás nélkül — már 19 900 Ft/hótól',
    'Egy egyszerű weboldal kb. 2–4 hét alatt elkészül',
    'Mobilon, tableten és gépen is kifogástalanul működik',
    'Az indulás után sem hagyunk magadra',
  ],
  outro: (
    <>
      Nem tudod eldönteni? Nézd meg a {L('/hu/arak', 'weboldal készítés árait')}, vagy írj pár sort — megmondjuk, mivel érdemes kezdeni.
      Budapesten és Debrecenben személyesen is találkozunk: {L('/hu/weboldal-keszites-budapest', 'weboldal készítés Budapest')}, {L('/hu/weboldal-keszites-debrecen', 'weboldal készítés Debrecen')}.
    </>
  ),
});

const EN = (L: (h: string, t: string) => React.ReactNode): Copy => ({
  badge: 'We help you choose',
  heading: 'Which one do you need?|Pick your situation.',
  lead: "You don't need to know the jargon. Tell us what the problem is — we bring the solution.",
  situations: [
    { quote: '"I don\'t have a website yet, or mine is outdated."', answer: 'We build a modern website that works well on mobile, presents your business and brings enquiries. No big upfront cost: you pay monthly, and updates are included.', href: '/en/services/start-your-business-online', cta: 'Website development' },
    { quote: '"I have a website, but nobody finds me on Google."', answer: 'We fix the technical foundations and regularly publish content your customers are searching for — so more visitors arrive for free, month after month.', href: '/en/services/seo-content-marketing', cta: 'SEO' },
    { quote: '"I need customers now, not in six months."', answer: "With Google Ads you show up in front of people searching for your service from launch week. Every month we show you clearly where the money went and what it brought.", href: '/en/services/ad-management', cta: 'Ad management' },
    { quote: '"I\'m just starting out and don\'t have a logo yet."', answer: 'We design your logo, colours and fonts so you look the same and recognisable everywhere — website, Instagram, business card.', href: '/en/services/branding-identity', cta: 'Brand identity' },
    { quote: '"My old WordPress site is slow and I\'m afraid to touch it."', answer: "We take it over: updates, backups and fast fixes when something breaks. If patching it no longer pays off, we show you the way to a new site.", href: '/en/services/maintenance', cta: 'Website maintenance' },
    { quote: '"Phone bookings and paperwork eat up my time."', answer: 'We build a system that works for you: online booking, automatic reminders, invoicing — tailored to how your business runs.', href: '/en/services/digital-systems', cta: 'Custom systems' },
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
    'A monthly fee instead of a big upfront investment',
    'A simple website is ready in about 2–4 weeks',
    'Works perfectly on mobile, tablet and desktop',
    "We don't leave you alone after launch",
  ],
  outro: <>Can&apos;t decide? Check our {L('/en/pricing', 'website pricing')} or drop us a few lines — we&apos;ll tell you where to start.</>,
});

export function ServicesGuide({ locale }: { locale: string }) {
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
              key={s.href}
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

    {/* Így zajlik — a meglévő sötét, lenyíló "Services" blokk (mint a szolgáltatásoldalakon) */}
    <Services
      __component="services"
      id={0}
      locale={locale}
      badge_label={c.stepsBadge}
      heading={c.stepsHeading.replace('|', ' ')}
      sub_heading={c.stepsLead}
      elements_service_item={c.steps.map((st, idx) => ({
        id: idx + 1,
        number: String(idx + 1).padStart(3, '0'),
        title: st.title,
        description: `${st.time} — ${st.text}`,
        image: st.images.map((url) => ({ url })),
        categories: st.pills.map((label) => ({ label })),
        categories_title: locale === 'hu' ? 'Részletek' : 'Details',
      }))}
    />

    <Container>
      <section className="pt-16 md:pt-24 pb-12">
        {/* Mit kapsz — közérthető összefoglaló */}
        <motion.div
          className="px-0 md:px-4 mt-16 grid grid-cols-1 lg:grid-cols-2 gap-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease }}
        >
          <div>
            <h3 className="font-bold tracking-tight leading-[1.1] text-2xl mb-5">{c.getTitle}</h3>
            <ul className="space-y-3">
              {c.get.map((g) => (
                <li key={g} className="flex items-start gap-3 text-black/60">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-black">
                    <Check className="h-3 w-3 text-white" strokeWidth={3} />
                  </span>
                  {g}
                </li>
              ))}
            </ul>
          </div>
          <p className="self-end text-black/50 text-base md:text-lg leading-relaxed">{c.outro}</p>
        </motion.div>
      </section>
    </Container>
    </>
  );
}
