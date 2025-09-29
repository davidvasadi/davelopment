import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { PlusIcon } from 'lucide-react';
import { useInView } from 'framer-motion';
import { useLanguage } from './LanguageContext';
export function WhyChooseUsSection() {
  const {
    t
  } = useLanguage();


  return <section className="w-full bg-gray-50 py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <motion.div className="space-y-16" initial={{
        opacity: 0,
        y: 50
      }} whileInView={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8
      }} viewport={{
        once: true
      }}>
          {/* Fejléc szekció */}
          <div className="space-y-8">
            {/* "Miért válassz minket" jelvény */}
            <motion.div className="flex items-center space-x-3" initial={{
            opacity: 0,
            x: -30
          }} whileInView={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.6,
            delay: 0.2
          }} viewport={{
            once: true
          }}>
              <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center">
                <PlusIcon className="w-3 h-3 text-white" />
              </div>
              <p className="text-sm font-medium text-gray-700">
                {t('whyChooseUs.badge')}
              </p>
            </motion.div>
            {/* Fő címsor */}
            <motion.div initial={{
            opacity: 0,
            y: 30
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.8,
            delay: 0.3
          }} viewport={{
            once: true
          }}>
              <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-black leading-tight tracking-tight">
                <span className="text-black">
                  {t('whyChooseUs.title.part1')}
                </span>{' '}
                <span className="text-black/60">
                  {t('whyChooseUs.title.part2')}
                </span>
              </h2>
            </motion.div>
          </div>
          {/* Tartalom rács */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Bal oldal - Hero kép CTA-val és hover animációval */}
            <motion.div className="relative bg-gray-950 rounded-2xl overflow-hidden h-96 sm:h-[500px] w-[320px] group" initial={{
            opacity: 0,
            x: -50
          }} whileInView={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.8,
            delay: 0.4
          }} viewport={{
            once: true
          }}>
              {/* Háttérkép - hover-re elhomályosodik */}
              <div className="absolute inset-0">
                <img src="https://davelopment.hu/assets/profile-DMhlnSSY.jpg" alt="Person in hooded jacket" className="w-full h-full object-contain transition-all duration-500 group-hover:blur-sm group-hover:scale-105" />
                {/* Sötét overlay - hover-re erősödik */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 transition-all duration-500"></div>
              </div>
              {/* Plusz ikon a bal felső sarokban */}
              <div className="absolute top-6 left-6 w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center ">
                <PlusIcon className="w-4 h-4 text-white " />
              </div>
              {/* Tartalom overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <div className="space-y-4">
                  {/* Főcím - csak hover-nél jelenik meg */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 mb-4">
                    <h3 className="text-xl font-bold text-white">
                      {t('whyChooseUs.cta.title')}
                    </h3>
                  </div>
                  {/* Leírás */}
                  <p className="text-gray-300 text-md ">
                    {t('whyChooseUs.cta.description')}
                  </p>
                  {/* CTA gomb */}
                  <motion.a href="./contact" className="inline-flex items-center space-x-3  text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-gray-800 transition-colors" whileHover={{
                  scale: 1.05
                }} whileTap={{
                  scale: 0.95
                }}>
                    <span>{t('whyChooseUs.cta.button')}</span>
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    </div>
                  </motion.a>
                </div>
              </div>
            </motion.div>
            {/* Jobb oldal - Statisztikák és leírás */}
            <motion.div className="space-y-8" initial={{
            opacity: 0,
            x: 50
          }} whileInView={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.8,
            delay: 0.5
          }} viewport={{
            once: true
          }}>
              {/* Leíró szöveg */}
              <div className="space-y-4">
                <p className="text-lg text-gray-700 leading-relaxed indent-10">
                  <span className="text-black font-semibold">
                    {t('whyChooseUs.description.part1')}
                  </span>{' '}
                  {t('whyChooseUs.description.part2')}
                </p>
              </div>
              {/* Statisztika kártyák */}
              <div className="space-y-6">
                {/* Első statisztika - Sikeres projektek */}
                <motion.div className="bg-white rounded-2xl p-6" initial={{
                opacity: 0,
                y: 20
              }} whileInView={{
                opacity: 1,
                y: 0
              }} transition={{
                duration: 0.6,
                delay: 0.6
              }} viewport={{
                once: true
              }}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-6xl font-semibold tracking-tight">
                      <AnimatedNumber value={50} />+
                    </div>
                    <div className="text-xs font-semibold text-gray-500 opacity-50">
                      {t('whyChooseUs.stats.projects.id')}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-black text-right">
                      {t('whyChooseUs.stats.projects.title')}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {t('whyChooseUs.stats.projects.description')}
                    </p>
                  </div>
                </motion.div>
                {/* Második statisztika - Ügyfél elégedettség */}
                <motion.div className="bg-white rounded-2xl p-6" initial={{
                opacity: 0,
                y: 20
              }} whileInView={{
                opacity: 1,
                y: 0
              }} transition={{
                duration: 0.6,
                delay: 0.7
              }} viewport={{
                once: true
              }}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-6xl font-semibold tracking-tight">
                      <AnimatedNumber value={95} />%
                    </div>
                    <div className="text-xs font-semibold text-gray-500 opacity-50">
                      {t('whyChooseUs.stats.satisfaction.id')}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-black text-right">
                      {t('whyChooseUs.stats.satisfaction.title')}
                    </h3>
                    {/* Ügyfél logók */}
                    <div className="flex items-center justify-between opacity-50 grayscale">
                      <img src="https://framerusercontent.com/images/wk98ext8C9l414fS0PK6BvjTA.svg" alt="Client logo" className="h-6 object-contain" />
                      <img src="https://framerusercontent.com/images/m9cv2Bx2sImOjy4Q3x1Fk5d5WGM.svg" alt="Client logo" className="h-6 object-contain" />
                      <img src="https://framerusercontent.com/images/CtaV2dn3ujpK8zv0Py3i9IJArPQ.svg" alt="Client logo" className="h-6 object-contain" />
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>;
}
const AnimatedNumber = ({
  value
}: {
  value: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref);
  const [displayValue, setDisplayValue] = useState(0);
  useEffect(() => {
    if (isInView) {
      let startValue = 0;
      const duration = 2000; // 2 seconds
      const increment = value / (duration / 16); // 60fps
      const timer = setInterval(() => {
        startValue += increment;
        if (startValue >= value) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(startValue));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);
  return <span ref={ref}>{displayValue}</span>;
};