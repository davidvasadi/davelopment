import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon } from 'lucide-react';
import { Container } from '@/components/container';
import { Heading } from '@/components/elements/heading';

type FAQItem = { question: string; answer: string };

export const FAQ = ({
  heading,
  sub_heading,
  faqs,
}: {
  heading: string;
  sub_heading: string;
  faqs: FAQItem[];
}) => {
  const [expandedId, setExpandedId] = useState<number>(0);

  const handleToggle = (id: number) => {
    setExpandedId(expandedId === id ? -1 : id);
  };

  return (
    <section className="w-full">
      <Container className="py-20 md:py-32">
        <div className="flex flex-col md:flex-row ">
          {/* Bal oldal (cím + leírás Strapi-ból) */}
          <motion.div
            className="mb-12 md:mb-0 md:w-1/2"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Heading as="h1" className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold leading-none tracking-tight text-black">
              {heading}
            </Heading>
            {sub_heading ? (
              <p className="text-lg text-gray-500 mt-4 px-2 max-w-sm">
                {sub_heading}
              </p>
            ) : null}
          </motion.div>

          {/* Jobb oldal (FAQ accordion Strapi-ból) */}
          <div className="md:w-1/2 space-y-1 text-black">
            {Array.isArray(faqs) && faqs.length > 0 ? (
              faqs.map((item, i) => (
                <FAQItemComponent 
                  key={`${item.question}-${i}`}
                  item={item}
                  isExpanded={expandedId === i}
                  onToggle={() => handleToggle(i)}
                />
              ))
            ) : (
              <div className="text-gray-500">Nincs megjeleníthető kérdés.</div>
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
}) => (
  <motion.div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-6 text-left"
      aria-expanded={isExpanded}
      aria-controls={`faq-panel-${item.question}`}
    >
      <h3 className="text-lg font-medium">{item.question}</h3>
      <motion.div
        className="flex-shrink-0 ml-4 w-5 h-5 border bg-black border-gray-200 rounded-full flex items-center justify-center"
        animate={{ rotate: isExpanded ? 180 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <PlusIcon className="w-3 h-3 text-white" />
      </motion.div>
    </button>
    <AnimatePresence initial={false}>
      {isExpanded && (
        <motion.div
          id={`faq-panel-${item.question}`}
          initial={{ height: 0 }}
          animate={{ height: 'auto' }}
          exit={{ height: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="px-6 pb-6">
            <p className="text-black/60">{item.answer}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);
