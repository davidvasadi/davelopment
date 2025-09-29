// src/components/ServicesSection.tsx

// ————————————————————————————————————————————————————————————————
// 1. Külső csomagok importja
// ————————————————————————————————————————————————————————————————
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon, MinusIcon } from 'lucide-react';
// ————————————————————————————————————————————————————————————————
// 2. Saját helper-ek, típusok és context-ek importja
// ————————————————————————————————————————————————————————————————
import { useLanguage } from './LanguageContext';
import type { Service } from '../types/index';

// ————————————————————————————————————————————————————————————————
// 3. ServicesSection komponens
//    - Accordion-szerű szolgáltatáslista
//    - Az első elem automatikusan nyitott induláskor
// ————————————————————————————————————————————————————————————————
export function ServicesSection() {
  // 3.1. Lokalizáció és adatok kinyerése
  const { t } = useLanguage();
  const services: Service[] = t('services.items') ?? [];

  // 3.2. Accordion állapota
  //    expandedService: az ID, amelyik elem jelenleg kinyitott
  //    Initialize az első szolgáltatás ID-jével, ha van legalább egy
  const [expandedService, setExpandedService] = useState<number | null>(
    services.length > 0 ? services[0].id : null
  );

  // 3.2.1. Klikk logika:
  //        - Ha már nyitva van (ugyanarra kattintunk), lezárjuk
  //        - Ha másik elemre kattintunk, azt nyitjuk ki
  const toggleService = (serviceId: number) => {
    setExpandedService(prev => (prev === serviceId ? null : serviceId));
  };


  // 3.3. CTA hover animációk
  const wheelVariants = {
    rest: { y: '-50%' },
    hover: { y: '0%', transition: { duration: 0.3, ease: 'easeInOut' } },
  };
  const dotVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.4, transition: { duration: 0.4, ease: 'easeInOut' } },
  };

  const { anchor } = t('services.cta') as { anchor: string };



  const scrollToServices = () => {
    const section = document.getElementById('kapcsolat')
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    }
  }
  // ————————————————————————————————————————————————————————————————
  // 3.4. JSX render
  // ————————————————————————————————————————————————————————————————
  return (
    <section className="w-full bg-black py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* 3.3.1. Látványos bevezető animáció */}
        <motion.div
          className="space-y-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* — Fejléc rész: jelvény, cím és darabszám — */}
          <div className="block  space-y-10">
            {/* 1) Jelvény (badge) – mindig bal szélen, mobile-on fent */}
            <motion.div
              className="flex items-center space-x-3 "
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                <PlusIcon className="w-3 h-3 text-black" />
              </div>
              <p className="text-sm font-medium text-white">{t('services.badge')}</p>
            </motion.div>

            {/* 2) Cím + darabszám – mobile-on alatta, inline; md+ nézetben középen */}
            <div className="flex items-start space-x-1 mt-4 md:mt-0 md:flex-1 md:justify-center">
              <motion.h2
                className="text-4xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-white leading-none tracking-tight"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
              >
                {t('services.title')}
              </motion.h2>
              <motion.p
                className="text-md lg:text-3xl font-semibold text-gray-400 tracking-tight"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
              >
                ({services.length})
              </motion.p>
            </div>
          </div>

          {/* ———————————————————————————————————————————————————————— */}
          {/* 3.3.2. Accordion lista */}
          {/*    Minden szolgáltatás egy külön blokk, amelyre kattintva  */}
          {/*    kinyílik a részletes leírás képekkel és kategóriákkal */}
          {/* ———————————————————————————————————————————————————————— */}
          <motion.div
            className="space-y-0"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                className="border-b border-gray-800"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                viewport={{ once: true }}
              >
                {/* — Accordion fejléc — */}
                {/*   Tartalmazza a sorszámot, címet és a forgó +/− ikont */}
                <div
                  className="flex items-center justify-between py-8 cursor-pointer group"
                  onClick={() => toggleService(service.id)}
                >
                  <div className="flex items-center space-x-8">
                    <span className="text-sm font-medium text-white opacity-60">
                      ({service.number})
                    </span>
                    <h3 className="text-2xl md:text-3xl font-semibold text-white group-hover:opacity-70 transition-opacity">
                      {service.title}
                    </h3>
                  </div>

                  {/* „+ / −” ikon animációval: keret forgása + ikon cseréje aktív állapotban */}
                  <motion.div
                    className="w-12 h-12 border border-gray-600 rounded-full flex items-center justify-center"
                    animate={{ rotate: expandedService === service.id ? 180 : 0 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                  >
                    <motion.div
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 0 }}
                      transition={{ duration: 0.5, ease: 'easeInOut' }}
                    >
                      {expandedService === service.id ? (
                        <MinusIcon className="w-5 h-5 text-white" />
                      ) : (
                        <PlusIcon className="w-5 h-5 text-white" />
                      )}
                    </motion.div>
                  </motion.div>
                </div>

                {/* — Accordion tartalom — */}
                {/*   Csak akkor rendereljük, ha ez az elem épp kinyitott */}
                <AnimatePresence>
                  {expandedService === service.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="pb-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Bal oszlop: képek egymáson átfedve + részletes leírás */}
                        <div className="flex flex-col md:flex-row md:space-x-12 ">
                          <div className="relative flex space-x-4">
                            {service.images.map((img, idx) => (
                              <div
                                key={idx}
                                className={`relative w-20 h-20 rounded-xl overflow-hidden ${idx > 0 ? 'shadow-lg' : ''
                                  }`}
                                style={{
                                  zIndex: service.images.length - idx,
                                  marginLeft: idx > 0 ? '-12px' : '0',
                                }}
                              >
                                <img
                                  src={img}
                                  alt={`${service.title} kép ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                          <div className="">
                            <h4 className="text-xl font-semibold text-white">
                              {service.title}
                            </h4>
                            <p className="text-white/60 leading-relaxed mt-2">
                              {service.description}
                            </p>
                          </div>
                        </div>

                        {/* Jobb oszlop: kategóriák egyedi címkéken, plusz összesítés */}

                        <div className="">
                          <h4 className="text-sm font-medium text-white/60 uppercase tracking-wider">
                            {t('services.categories')}
                          </h4>
                          <div className="flex flex-wrap gap-3 mt-6">
                            {service.categories.map((cat, ci) => (
                              <span
                                key={ci}
                                className="px-4 py-2 bg-white text-black text-xs font-semibold rounded-full"
                              >
                                {cat}
                              </span>
                            ))}
                            <span className="px-4 py-2 bg-gray-700 text-white text-xs font-semibold rounded-full">
                              {service.categoryCount}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* <motion.a
        initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          href={anchor}
          

          className="inline-block mt-6 px-8 py-4 bg-white text-black font-semibold rounded-full hover:opacity-80 transition"
        >
           <span>{t('services.cta.title')}</span>
        
        </motion.a> */}
        <motion.button
          onClick={scrollToServices}
          className="inline-block mt-6 px-8 py-5 bg-white text-black font-semibold rounded-full hover:opacity-80 transition"
          initial="rest"
          whileHover="hover"
          animate="rest"

        >
          <div className="overflow-hidden h-5">
            <motion.div className="flex flex-col" variants={wheelVariants}>
              <span>{t('services.cta.title')}</span>
              <span>{t('services.cta.title')}</span>
            </motion.div>
          </div>

        </motion.button>
      </div>
    </section>
  );
}
