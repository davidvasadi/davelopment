// =======================================================
// === IMPORTOK =========================================
// =======================================================

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from './LanguageContext';
import heroVideo from '../assets/videos/hero.mp4';
// =======================================================
// === HEROSECTION KOMPONENS =============================
// =======================================================

export function HeroSection() {
  const { t } = useLanguage(); // Nyelvi fordító hook használata

  // === SCROLL ALAPÚ CÍMSOR SKÁLÁZÁS ====================

  const heroRef = useRef<HTMLDivElement>(null);
  
  // 3.3. Egyedi hook: visszaad transzform értékeket a parallax és zoom effektushoz
  const useSlowScroll = (ref: React.RefObject<HTMLElement>) => {
    const { scrollYProgress } = useScroll({
      target: ref,
      offset: ['start end', 'end start'],
    });
    const y = useTransform(scrollYProgress, [0, 1], [1, 1], { clamp: true });
    const scale = useTransform(scrollYProgress, [0, 1], [1.05, 0.9]);
    return { y, scale };
  };
  // const introAnimation = useSlowScroll(introRef);
  const heroAnimation = useSlowScroll(heroRef);



  // === ANIMÁCIÓK A "LET'S TALK" GOMBHOZ =================
  const wheelVariants = {
    rest: { y: '-50%' },
    hover: { y: '0%', transition: { duration: 0.3, ease: 'easeInOut' } },
  };

  const dotVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.4, transition: { duration: 0.3, ease: 'easeInOut' } },
  };

    const scrollToServices = () => {
    const section = document.getElementById('kapcsolat')
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    }
  }
  // ===================================================
  // === RETURN JSX ====================================
  // ===================================================


  return (
    // Külső konténer, világos háttérrel és belső paddinggel
    <motion.section
      ref={heroRef}
      style={{ y: heroAnimation.y, scale:heroAnimation.scale }}
    >
      <div className="p-1 md:p-4 bg-gray-50 mt-16 lg:mt-12">
        <section
          ref={heroRef}
          className="relative bg-gray-50 overflow-hidden border-black rounded-2xl"
        >
          {/* === VIDEÓ HÁTTÉR A TELJES SZEKCIÓ ALÁ === */}
          <video
            className="absolute inset-0 w-full h-full object-cover"
            src={heroVideo}
            autoPlay
            loop
            muted
            playsInline
          />

          {/* === KAOTIKUS MOZGÓ + IKONOK A HÁTTÉRBEN === */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              className="absolute top-8 left-8 md:top-32 md:left-16 text-gray-500 text-xl md:text-2xl"
              animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.1, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              +
            </motion.div>
            <motion.div
              className="absolute top-16 right-8 md:top-64 md:right-32 text-gray-500 text-xl md:text-2xl"
              animate={{ opacity: [0.5, 0.8, 0.5], scale: [1, 1.2, 1] }}
              transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            >
              +
            </motion.div>
          </div>

          {/* === FŐ TARTALMI BLOKK === */}
          <div
            className="
            relative z-10 flex flex-col 
            px-4 py-4
            md:px-8 
            xl:px-16 xl:py-6 xl:justify-between
            text-white 
            space-y-8 xl:space-y-52 2xl:space-y-96
          "
          >

            {/* === CÍMSOR, ALCÍM ÉS SZOLGÁLTATÁSOK LISTÁJA === */}
            <motion.div
              className="flex flex-col xl:flex-row xl:justify-around "
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              {/* --- BAL OLDAL: CÍMSOR + ALCÍM --- */}
              <div>
                {/* Főcím logó (scrollra skálázódik) */}
                <motion.h1
                  className="font-bold tracking-tight text-[clamp(3rem,12vw,10rem)] xl:text-[clamp(3rem,9vw,9rem)] leading-tight max-w-full"
                  // style={{ scale }}
                >
                  {t('hero.title')}
                </motion.h1>

                {/* Alcím */}
                <motion.div
                  className="ml-3 text-lg sm:text-2xl md:text-3xl font-semibold"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                                    // style={{ scale }}

                >
                  {t('hero.subtitle')}
                </motion.div>
              </div>

              {/* --- JOBB OLDAL: SZOLGÁLTATÁSOK LISTÁJA --- */}
              <motion.div
                className="flex flex-col space-y-1 md:space-y-2 text-right xl:text-left mt-4 xl:mt-20"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <div className="text-base font-medium">{t('hero.services.branding')}</div>
                <div className="text-base font-medium">{t('hero.services.socialMedia')}</div>
                <div className="text-base font-medium">{t('hero.services.webDesign')}</div>
                <div className="text-base font-medium">{t('hero.services.seo')}</div>
              </motion.div>
            </motion.div>

            {/* === ALSÓ BLOKK: LEÍRÁS ÉS PROFILKÁRTYA === */}
            <motion.div
              className="flex flex-col-reverse xl:flex-row xl:items-end justify-between gap-8"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
            >
              {/* --- BAL OLDAL: SZÖVEGES LEÍRÁS --- */}
              <div className="max-w-xl">
                <p className="leading-snug text-base md:text-xl indent-8 xl:indent-20 mb-4">
                  <span className="font-semibold">{t('hero.description.part1')}</span>{' '}
                  <span className="font-light text-gray-200">{t('hero.description.part2')}</span>
                </p>
                <p className="text-white/70 text-sm">{t('hero.copyright')}</p>
              </div>

              {/* --- JOBB OLDAL: PROFILKÁRTYA ÉS GOMB --- */}
              <div className="bg-white rounded-2xl p-2 md:p-3 max-w-xs flex items-center space-x-4 md:space-x-6 shadow-2xl">
                {/* Profilkép */}
                <div className="w-20 h-36 md:w-24 md:h-32 bg-gray-200 rounded-2xl overflow-hidden">
                  <img
                    src="https://davelopment.hu/assets/profile2-CtcR8s0t.jpeg"
                    alt={t('hero.personName')}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Név, cím és gomb */}
                <div className="text-gray-700">
                  <div className="text-sm text-gray-600 mb-1">{t('hero.teamLead')}</div>
                  <div className="text-xs text-gray-500 mb-2">
                    {t('hero.at')} {t('hero.title')}
                  </div>
                  <div className="text-lg font-bold mb-3">{t('hero.personName')}</div>

                  {/* LET'S TALK gomb animációval */}
                  <motion.button
                  onClick={scrollToServices}
                    className="flex items-center space-x-6 bg-black px-3 py-1 rounded-full text-sm font-medium text-white"
                    initial="rest"
                    whileHover="hover"
                    animate="rest"
                    
                  >
                    <div className="overflow-hidden h-5">
                      <motion.div 
                      className="flex flex-col"
                       variants={wheelVariants}>
                        <span>{t('hero.letsTalk')}</span>
                        <span>{t('hero.letsTalk')}</span>
                      </motion.div>
                    </div>
                    <motion.div
                      className="w-2 h-2 bg-white rounded-full"
                      variants={dotVariants}
                    />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
   
    </motion.section>
    
  );
}
