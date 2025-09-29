import { PlusIcon } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// =====================================================================================
// 📣 PARTNERS SECTION COMPONENT: Partnereink szekció
// =====================================================================================

// Partnerlista: név és logó URL tömb
const partners = [
  { name: 'Partner 1', logo: '/src/assets/logos/davelopment_logo.png' },
  { name: 'Partner 2', logo: '/src/assets/logos/lazars_logo.png' },
  { name: 'Partner 4', logo: 'https://davelopment.hu/assets/csontkovacsbence_logo-DNcc0pBf.png' },
  { name: 'Partner 3', logo: '/src/assets/logos/lazars_logo.png' },
  { name: 'Partner 5', logo: 'https://davelopment.hu/assets/csontkovacsbence_logo-DNcc0pBf.png' },
  { name: 'Partner 6', logo: 'https://kokaizoltan.hu/wp-content/uploads/2024/04/logo_basic.svg' }
];

export function PartnersSection() {
  // 🔖 REF létrehozása a scroll-effektushoz
  const partnersRef = useRef<HTMLDivElement>(null);

  /**
   * 🌟 EGYEDI HOOK: LASSÚ SCROLL (parallax + zoom)
   * @param ref - A ref, amelyhez az animáció kapcsolódik
   * @returns { y, scale } - Y eltolás és nagyítás értékek
   */
  const useSlowScroll = (ref: React.RefObject<HTMLElement>) => {
    // 🧭 Scroll pozíció követése a target elemnél
    const { scrollYProgress } = useScroll({
      target: ref,
      offset: ['start end', 'end start'],
    });

    // 🔄 Elmozdítás Y irányban: [0% scroll → 0px], [100% scroll → -70px]
    const y = useTransform(scrollYProgress, [0, 1], [0, 1], { clamp: true });
    // 🔍 Nagyítás: [0% scroll → 0.8], [100% scroll → 1]
    const scale = useTransform(scrollYProgress, [0, 1], [0.8, 0.9]);

    return { y, scale };
  };

  // ⚙️ Animáció alkalmazása a partner szekcióra
  const partnersAnimation = useSlowScroll(partnersRef);

  // 🌐 Fordító függvény (LanguageContext)
  const { t } = useLanguage();

  return (
    // 🎬 Motion szekció: scroll animációk engedélyezése
    <motion.section
      ref={partnersRef}
      style={{ y: partnersAnimation.y, scale: partnersAnimation.scale }}
    >

      {/* ================================================================================ */}
      {/* 📦 KONTÉNER: Háttér + középre igazítás (light/dark mód) */}
      <section className="bg-gray-50 dark:bg-gray-50">
        <div className="max-w-8xl mx-auto px-4 text-left">

          {/* ============================================================================ */}
          {/* 📋 FEJLÉC: Plus ikon + szekció cím (badge) */}
          <div className="flex items-center space-x-2 mb-4">
            {/* 🔘 Ikon körben */}
            <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
              <PlusIcon className="w-3 h-3 text-white" />
            </div>
            {/* 🏷️ Cím (fordítva: partners.badge) */}
            <p className="text-sm font-medium text-black">{t('partners.badge')}</p>
          </div>

          {/* ============================================================================ */}
          {/* 🎨 LOGÓ RÁSZ - GRID: 2-6 oszlop, hover effektussal */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 items-center justify-center">
            {partners.map((partner, index) => (
              <div
                key={index}
                className="flex items-center justify-center bg-white py-12 rounded-xl transition-all duration-300 hover:shadow-lg  hover:grayscale-0 grayscale"
              >
                <img
                  src={partner.logo}              // 🔗 Logó URL
                  alt={partner.name}              // 📢 Alt szöveg az elérhetőségért
                  className="h-20 object-contain  transition-filter duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </motion.section>
  );
};
