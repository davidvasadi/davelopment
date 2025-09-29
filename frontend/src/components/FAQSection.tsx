import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PlusIcon } from 'lucide-react'
import { useLanguage } from './LanguageContext'
import type { FAQItem as FAQItemType } from '../types'

export function FAQSection() {
  const { t } = useLanguage()
  const [expandedId, setExpandedId] = useState<number>(0)

  // Lekérjük a fordított tömböt típusosan
  const faqItems = t<FAQItemType[]>('faq.items')

  const handleToggle = (id: number) => {
    setExpandedId(expandedId === id ? -1 : id)
  }

  return (
    <section className="max-w-full bg-gray-50 py-20 md:py-32">
      <div className="mx-auto px-6 md:px-8">
        <div className="flex flex-col md:flex-row md:space-x-16">
          {/* Bal oldal */}
          <motion.div
            className="mb-12 md:mb-0 md:w-1/2"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-black leading-none tracking-tight">
              {t('faq.title')}
            </h2>
            <p className="text-lg text-gray-500 mt-4 px-2 max-w-sm">
              {t('faq.description')}
            </p>
          </motion.div>

          {/* Jobb oldal */}
          <div className="md:w-1/2 space-y-1">
            {faqItems.map((item, i) => (
              <FAQItemComponent
                key={i}
                item={{ ...item, id: i }}
                isExpanded={expandedId === i}
                onToggle={() => handleToggle(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

const FAQItemComponent = ({
  item,
  isExpanded,
  onToggle,
}: {
  item: FAQItemType
  isExpanded: boolean
  onToggle: () => void
}) => (
  <motion.div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-6 text-left"
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
)
