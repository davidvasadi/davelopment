'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusIcon } from 'lucide-react';
import { Heading } from '@/components/elements/heading';
import { Link } from 'next-view-transitions';
import { strapiImage } from '@/lib/strapi/strapiImage';

type FAQItem = { question: string; answer: string };

// Stabil, horgonyozható (deep-linkelhető) id minden kérdéshez — se AI
// válaszmotorok, se a sitemap/TOC ne csak egy mondvacsinált aria-id-t
// kapjanak, hanem egy valódi #slug-ot, amire rá lehet mutatni.
const slugify = (text: string): string =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export const FAQ = ({
  heading,
  sub_heading,
  faqs,
  locale,
  card_image,
  ask_card,
}: {
  heading: string;
  sub_heading: string;
  faqs: FAQItem[];
  locale?: string;
  // a „Még döntesz?” kártya képe (fájlnév) — a szolgáltatás-aloldalak saját képet adnak, alapból a felfedezés kép
  card_image?: string;
  ask_card?: boolean;
}) => {
  const [expandedId, setExpandedId] = useState<number>(0);

  const handleToggle = (id: number) => {
    setExpandedId(expandedId === id ? -1 : id);
  };

  return (
    <section className="w-full">
      {/* teljes szélesség (nincs max-width), kis oldalmargóval — mint a többi újított blokk */}
      <div className="px-4 py-20 md:px-8 md:py-32">
        <div className="flex flex-col md:flex-row">

          {/* Bal oldal — fade up, minden görgetéskor */}
          {/* desktopon a bal oldal (cím + kártya) „megáll”, amíg a jobb oldali kérdések görögnek */}
          <motion.div
            className="mb-12 md:sticky md:top-28 md:mb-0 md:w-1/2 md:self-start"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
          >
            {/* cím a közös szabály szerint (mint a többi újított blokk fejléce) */}
            <Heading as="h2" className="text-4xl font-semibold leading-[0.95] tracking-[-0.04em] text-black md:text-6xl xl:text-7xl">
              {heading}
            </Heading>

            {/* „Még döntesz?” kártya — ingyenes beszélgetés, link a kapcsolat oldalra */}
            <div className="mt-10 flex max-w-xl items-center gap-5 rounded-card border border-black/10 bg-white p-4 md:mt-12 md:p-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={strapiImage(`/api/media/file/${card_image || 'davelopment-felfedezes.avif'}`)}
                alt=""
                aria-hidden
                loading="lazy"
                width={152}
                height={152}
                className="h-24 w-24 shrink-0 rounded-2xl object-cover md:h-36 md:w-36"
              />
              <div>
                {/* a szolgáltatás-aloldalakon (ask_card) „kérdezd azokat, akik megépítenék” + e-mail; máshol „Még döntesz?” + időpont */}
                <p className="text-base leading-snug text-black md:text-xl">
                  {ask_card
                    ? locale === 'en'
                      ? 'Something else on your mind? Ask the people who would build it.'
                      : 'Valami más jár a fejedben? Kérdezd azokat, akik megépítenék.'
                    : locale === 'en'
                      ? 'Still deciding? A 30-minute call costs nothing and comes with a written recommendation.'
                      : 'Még döntesz? Egy 30 perces beszélgetés nem kerül semmibe, és írásos javaslatot is kapsz.'}
                </p>
                {ask_card ? (
                  <a
                    href="mailto:hello@davelopment.hu"
                    className="mt-4 inline-block border-b-2 border-black pb-0.5 text-base font-medium text-black transition-opacity hover:opacity-60 md:text-xl"
                  >
                    hello@davelopment.hu
                  </a>
                ) : (
                  <Link
                    href={(locale === 'en' ? '/en/contact' : '/hu/kapcsolat') as never}
                    className="mt-4 inline-block border-b-2 border-black pb-0.5 text-base font-medium text-black transition-opacity hover:opacity-60 md:text-xl"
                  >
                    {locale === 'en' ? 'Book a call' : 'Időpontot kérek'}
                  </Link>
                )}
              </div>
            </div>
          </motion.div>

          {/* Jobb oldal — FAQ itemek staggerelve */}
          <div className="md:w-1/2 space-y-1 text-black">
            {Array.isArray(faqs) && faqs.length > 0 ? (
              faqs.map((item, i) => (
                <motion.div
                  key={`${item.question}-${i}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.07,
                    ease: [0.33, 1, 0.68, 1],
                  }}
                >
                  <FAQItemComponent
                    item={item}
                    isExpanded={expandedId === i}
                    onToggle={() => handleToggle(i)}
                  />
                </motion.div>
              ))
            ) : (
              <div className="text-gray-500">{locale === 'en' ? 'No questions available.' : 'Nincs megjeleníthető kérdés.'}</div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

const FAQItemComponent = ({
  item,
  isExpanded,
  onToggle,
}: {
  item: FAQItem;
  isExpanded: boolean;
  onToggle: () => void;
}) => {
  const anchorId = slugify(item.question);
  return (
  <div id={anchorId} className="bg-white border border-gray-100 rounded-2xl overflow-hidden scroll-mt-28">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-6 text-left"
      aria-expanded={isExpanded}
      aria-controls={`faq-panel-${anchorId}`}
    >
      <h3 className="text-lg font-medium">{item.question}</h3>
      <motion.div
        className="flex-shrink-0 ml-4 w-5 h-5 border bg-black border-gray-200 rounded-full flex items-center justify-center"
        animate={{ rotate: isExpanded ? 180 : 0 }}
        transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
      >
        <PlusIcon className="w-3 h-3 text-white" />
      </motion.div>
    </button>
    {/* A válasz MINDIG a DOM-ban marad (csak height/opacity animál csukva/nyitva) —
        ha feltételesen (un)mountolnánk, a crawlerek (Google, AI) csak az épp
        nyitott válasz szövegét látnák, a többi FAQ-választ "nem létezőnek"
        érzékelnék. Lásd GEO audit, 2026-10-14 ("Align FAQ schema with content"). */}
    <motion.div
      id={`faq-panel-${anchorId}`}
      initial={false}
      animate={{ height: isExpanded ? 'auto' : 0 }}
      transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
      className="overflow-hidden"
    >
      <motion.div
        className="px-6 pb-6 pt-1"
        animate={{ opacity: isExpanded ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      >
        <p className="text-sm md:text-base text-black/60">{item.answer}</p>
      </motion.div>
    </motion.div>
  </div>
  );
};
