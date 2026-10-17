'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusIcon } from 'lucide-react';
import { Container } from '@/components/container';
import { Heading } from '@/components/elements/heading';

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
}: {
  heading: string;
  sub_heading: string;
  faqs: FAQItem[];
  locale?: string;
}) => {
  const [expandedId, setExpandedId] = useState<number>(0);

  const handleToggle = (id: number) => {
    setExpandedId(expandedId === id ? -1 : id);
  };

  return (
    <section className="w-full">
      <Container className="py-20 md:py-32">
        <div className="flex flex-col md:flex-row">

          {/* Bal oldal — fade up, minden görgetéskor */}
          <motion.div
            className="mb-12 md:mb-0 md:w-1/2"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
          >
            <Heading as="h2" className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold leading-none tracking-tight text-black">
              {heading}
            </Heading>
            {sub_heading ? (
              <p className="text-lg text-gray-500 mt-4 px-2 max-w-sm">
                {sub_heading}
              </p>
            ) : null}
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
      </Container>
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
