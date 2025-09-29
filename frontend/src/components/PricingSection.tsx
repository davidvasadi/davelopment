// ==========================
// ====== IMPORTOK ======
// ==========================

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from './LanguageContext';

// ===============================
// ====== ÁRAZÁS KOMPONENS ======
// ===============================

export function PricingSection() {
  const { t, language } = useLanguage();

  // =============================
  // ====== ÁLLAPOTOK ======
  // =============================
  const [pricingType, setPricingType] = useState<'project' | 'monthly'>('project');
  const [marketingAddon, setMarketingAddon] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // =============================
  // ====== ÁRAK ÉS FORMÁZÁS ======
  // =============================
  const basePrice = pricingType === 'project'
    ? t<string>('pricing.features.pricing')
    : t<string>('pricing.features.monthlyPricing');

  const addonPrice = t<string>('pricing.addon.pricing');
  const currency = t<string>('pricing.features.currency');

  const parsedBasePrice = parseFloat((basePrice || '0').replace(/[^\d,\.]/g, '').replace(',', '.')) || 0;
  const parsedAddonPrice = parseFloat((addonPrice || '0').replace(/[^\d,\.]/g, '').replace(',', '.')) || 0;

  const totalPriceNumber = marketingAddon ? parsedBasePrice + parsedAddonPrice : parsedBasePrice;
  const formattedPrice = Math.round(totalPriceNumber).toLocaleString(language === 'hu' ? 'hu-HU' : 'en-US');

  const buttonVariants = {
    rest: { y: '-50%' },
    hover: {
      y: '0%',
      transition: { duration: 0.3, ease: 'easeInOut' },
    },
  };

  const featureList = t<string[]>('pricing.features.list') || [];

  // =============================
  // ====== JSX RENDERELÉS ======
  // =============================

  return (
    <section className="w-full bg-black py-20 md:py-32 relative overflow-hidden font-sans">
      {/* 🎥 Háttérkép */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://framerusercontent.com/images/vrhxHFTuxnCduP4nljUulqZcuQ.jpg"
          alt="Background"
          className="w-full h-full object-cover opacity-100"
          style={{ filter: 'brightness(1.15)' }}
        />
        <div className="absolute inset-0 opacity-5" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-12"
        >
          {/* 🏷️ Fejléc Badge */}
          <div className="flex items-center justify-start space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                <PlusIcon className="w-2.5 h-2.5 text-black" />
              </div>
              <p className="text-xs text-white">{t('pricing.badge')}</p>
            </div>
          </div>

          {/* 🔄 Ár típus váltó */}
          <div className="flex flex-col items-start md:items-center justify-center text-left md:text-center">
            <h2 className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-white leading-none tracking-tight">
              {t('pricing.title')}
            </h2>

            <div className="bg-white/10 rounded-full p-1 flex gap-2 mt-10">
              <button
                onClick={() => setPricingType('project')}
                className={`px-6 py-4 rounded-full text-sm font-medium transition-all ${pricingType === 'project'
                  ? 'bg-white text-black'
                  : 'text-white hover:text-white/80'
                  }`}
              >
                {t('pricing.toggle.project')}
              </button>
              <button
                onClick={() => setPricingType('monthly')}
                className={`px-6 py-4 rounded-full text-sm font-medium transition-all ${pricingType === 'monthly'
                  ? 'bg-white text-black'
                  : 'text-white hover:text-white/80'
                  }`}
              >
                {t('pricing.toggle.monthly')}
              </button>
            </div>
          </div>

          {/* 💰 Fő ár blokk */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {/* ➕ Kiegészítő blokk */}
            <div className="bg-white/5 rounded-xl p-6 flex flex-col justify-between min-h-[360px]">
              <div>
                <h4 className="text-white text-lg font-medium mb-1">
                  {t('pricing.addon.title')}
                </h4>
                <p className="text-white/50 text-md mb-6">
                  {t('pricing.addon.description')}
                </p>
              </div>
              <div className="flex items-center justify-between mt-auto">
                <p className="text-white/70 text-lg font-semibold">+{addonPrice}</p>
                <motion.button
                  onClick={() => setMarketingAddon(!marketingAddon)}
                  className={`relative w-16 h-10 rounded-full transition-colors ${marketingAddon ? 'bg-white' : 'bg-white/20'}`}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="w-8 h-8 bg-black rounded-full absolute top-1"
                    animate={{ x: marketingAddon ? 26 : 4 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </motion.button>
              </div>
            </div>

            {/* 📋 Funkciólista blokk */}
            <div className="lg:col-span-2 bg-white/5 rounded-xl p-6 md:p-8 flex flex-col lg:flex-row lg:gap-x-10  min-h-[360px]">
              <div className="flex-1 flex flex-col justify-between">
                <div className="text-white text-4xl md:text-5xl font-bold">
                  {formattedPrice}
                  <span className="text-white/60 text-sm font-normal ml-2">
                    <span className="mx-1">{currency}</span>
                    {pricingType === 'project'
                      ? language === 'hu' ? '/projekt' : '/project'
                      : language === 'hu' ? '/hónap' : '/monthly'}
                  </span>
                </div>
                <div className='flex flex-col'>
                  <div className="flex flex-row justify-between items-center m-5">
                    <p className="text-white/60 text-sm font-semibold mb-1">
                      {t('pricing.features.timeLabel')}
                    </p>
                    <p className="text-white text-sm font-semibold">
                      {t('pricing.features.timeValue')}
                    </p>
                  </div>
                  <div className="relative w-full h-[1px] bg-white/10 overflow-hidden group mt-4">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-50 to-transparent"
                      initial={{ x: '-100%' }}
                      whileInView={{ x: '100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 1.4, ease: 'easeInOut' }}
                    />
                  </div>
                </div>

              </div>
              {/* 🌟 Funkciólista modern UX megjelenítéssel */}
              <div className="flex-1 flex flex-col mt-8 lg:mt-0 relative">
                <div className={`space-y-3 md:space-y-4 overflow-hidden transition-all duration-500 ${!expanded ? 'max-h-[300px] mask-fade-bottom' : 'max-h-[1500px]'}`}>
                  {featureList.map((text, i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center">
                        <PlusIcon className="w-3 h-3 text-white" />
                      </div>
                      <p className="text-white text-md">{text}</p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center mt-4">
                  <button onClick={() => setExpanded(!expanded)} className="text-white/80 hover:text-white transition-all flex items-center gap-2">
                    {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5 animate-bounce" />}
                    <span className="text-sm font-medium">
                      {expanded ? t('pricing.features.hideDetails') : t('pricing.features.showMore')}
                    </span>
                  </button>
                </div>
                {/* 📩 CTA gomb a szekció alján */}
                <div className="flex justify-center">
                  <motion.button
                    initial="rest"
                    whileHover="hover"
                    animate="rest"
                    className="w-full relative inline-flex items-center justify-center bg-white text-black px-6 py-4 rounded-full font-semibold text-lg overflow-hidden group transition-all mt-10"
                  >
                    <div className="overflow-hidden h-6">
                      <motion.div className="flex flex-col" variants={buttonVariants}>
                        <span>{t('pricing.cta')}</span>
                        <span>{t('pricing.cta')}</span>
                      </motion.div>
                    </div>
                  </motion.button>
                </div>
              </div>
            </div>
          </div>


        </motion.div>
      </div>
    </section>
  );
}