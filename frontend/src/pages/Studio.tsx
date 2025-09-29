// ————————————————————————————————————————————————————————————————
// 1. Külső csomagok importálása
// ————————————————————————————————————————————————————————————————
import { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  // MotionValue,
  useInView
} from 'framer-motion';
import CountUp from 'react-countup';
import { Link } from 'react-router-dom';
import { PlusIcon } from 'lucide-react';
// ————————————————————————————————————————————————————————————————
// 2. Lokális komponensek és kontextus importálása
// ————————————————————————————————————————————————————————————————
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { BlurFooterEffect } from '../components/BlurFooterEffect';
import { ContactSection } from '../components/ContactSection';
import { useLanguage } from '../components/LanguageContext';

// A React Router Link komponensének framer-motion-nal való wrap-elése az animált linkekhez
const MotionLink = motion.create(Link);

// ————————————————————————————————————————————————————————————————
// 3. StudioPage komponens
// ————————————————————————————————————————————————————————————————
export function StudioPage() {
  // 3.1. Lokalizációs hook a fordított szövegek lekéréséhez
  const { t } = useLanguage();

  // 3.2. Ref-ek a görgetés alapú animációkhoz
  const introRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const whatElseRef = useRef<HTMLDivElement>(null);

  // 3.3. Egyedi hook: visszaad transzform értékeket a parallax és zoom effektushoz
  const useSlowScroll = (ref: React.RefObject<HTMLElement>) => {
    const { scrollYProgress } = useScroll({
      target: ref,
      offset: ['start end', 'end start'],
    });
    const y = useTransform(scrollYProgress, [0, 1], [0, -175], { clamp: false });
    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
    return { y, scale };
  };
  // const introAnimation = useSlowScroll(introRef);
  const heroAnimation = useSlowScroll(heroRef);
  const imageAnimation = useSlowScroll(imageRef);
  const whatElseAnimation = useSlowScroll(whatElseRef);
  // 3.4. CTA hover animációk
  const wheelVariants = {
    rest: { y: '-50%' },
    hover: { y: '0%', transition: { duration: 0.3, ease: 'easeInOut' } },
  };
  const dotVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.4, transition: { duration: 0.4, ease: 'easeInOut' } },
  };

  // 3.5. CountUp indítás csak, ha a statsRef a viewportba kerül
  const statsInView = useInView(statsRef);


  // ————————————————————————————————————————————————————————————————
  // Statisztikák adatai CountUp-hez
  // ————————————————————————————————————————————————————————————————
  const statsData = [
    { end: 3, suffix: 'm+', label: t('studio.stats.adImpressions') },
    { end: 27, suffix: '+', label: t('studio.stats.projects') },
    { end: 98, suffix: '%', label: t('studio.stats.satisfaction') },
    { end: 50, suffix: 'k+', label: t('studio.stats.visitors') },
  ];

  // ————————————————————————————————————————————————————————————————
  // JSX renderelés
  // ————————————————————————————————————————————————————————————————
  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Globális fejléc */}
      <Header />

      <main className="w-full">

        {/* — Intro szekció: animált cím és leíró rács — */}
        <section
          ref={introRef}
          className="w-full pt-16 md:pt-24 bg-gray-50 overflow-hidden relative mt-28"
        >
          <div className="max-w-9xl mx-auto px-6 md:px-8">
            <h1
              // style={{ y: introAnimation.y as MotionValue<number> }}
              className="text-7xl md:text-8xl lg:text-9xl font-bold text-black mb-16 md:mb-36"
            >
              {t('studio.title')}
            </h1>
            <section
              ref={introRef}
            // style={{ y: introAnimation.y }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] gap-6">
                {/* 1. oszlop */}
                <div className="flex items-start">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                      <PlusIcon className="w-3 h-3 text-white" />
                    </div>
                    <p className="text-xs font-medium text-black">{t('studio.aboutUs')}</p>
                  </div>
                </div>
                {/* 2. oszlop */}
                <div className="space-y-6">
                  <p className="text-3xl indent-14">
                    {t('studio.description.part1')}
                    <span className="text-gray-500">{t('studio.description.part2')}</span>
                  </p>
                  <div className="flex space-x-4 mt-8">
                    <div className="flex -space-x-3">
                      {[
                        "https://framerusercontent.com/images/BneGKeqNYOGeaTyo7186uoQik.jpg",
                        "https://framerusercontent.com/images/cFRo7pt3uj7P7xJL42FonlfI4Ck.jpg",
                        "https://framerusercontent.com/images/IcO65dJKxeCET0MMqA7dbjqZ7U.jpg",
                        "https://framerusercontent.com/images/siCFBzqpvx6sgWLXVPxMR5CbFc.jpg"
                      ].map((src, i) => (
                        <div key={i} className="w-10 h-10 rounded-xl border border-gray-100 overflow-hidden">
                          <img src={src} alt={`Ügyfél ${i + 1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                      <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center text-xs font-semibold">
                        56+
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M12 .587l3.668 7.568L24 9.75 17.334 15.1l1.666 8.65L12 19.845 4.999 23.75 6.666 15.1 0 9.75l8.332-1.595L12 .587z"
                              fill="#FB9826"
                            />
                          </svg>
                        ))}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-black">{t('studio.trustedBy')}</span>
                        <span className="text-xs text-black/60">{t('studio.clientsWorldwide')}</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* 3. oszlop */}
                <div className="flex items-start md:justify-end">
                  <p className="text-sm text-gray-500">{t('studio.noOvercomplicated')}</p>
                </div>
              </div>
            </section>


          </div>

        </section>

        {/* — Hero szekció: animált kép — */}
        <motion.section
          ref={heroRef}
          style={{ y: heroAnimation.y }}
          className='mt-24'
        >
          <section>
            <div className="max-w-9xl mx-auto px-6 md:px-8">
              <motion.section
                ref={heroRef}
                style={{ y: imageAnimation.y, scale: heroAnimation.scale }}
              >
                <motion.div

                  className="w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden relative"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <motion.img
                    src="https://framerusercontent.com/images/BvhgaZCeNF3QqrLv6UbtoFydlGU.jpg"
                    alt="Stúdió csapat"
                    className="w-full h-full object-cover"
                    style={{ scale: heroAnimation.scale }}
                  />
                  <div className="absolute bottom-6 left-6 text-white text-xl font-semibold">
                    [davelopment]®
                  </div>
                </motion.div>
              </motion.section>
            </div>
          </section>
        </motion.section>
        
        {/* — Statikus adatok szekció: animált számlálók rácsban — */}
        <section
          ref={statsRef}
          className="w-full pt-20 md:pt-32 bg-gray-50 overflow-hidden"
        >
          <div className="max-w-9xl mx-auto px-6 md:px-8">
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-20 md:gap-8 ">
              {statsData.map(({ end, suffix, label }, idx) => (
                <motion.div
                  key={idx}
                  className="space-y-2"
                  // style={{ y: statsAnimation.y as MotionValue<number> }}
                  transition={{ duration: 0.6, delay: 0.1 * (idx + 1) }}
                >
                  <div className="text-6xl font-semibold tracking-tight text-center">
                    {statsInView
                      ? <CountUp
                        key={`cu-${idx}-${statsInView}`}
                        start={0}
                        end={end}
                        duration={2}
                        suffix={suffix} />
                      : `0${suffix}`}
                  </div>
                  <p className="text-black/60 text-sm pt-3 text-center">{label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* — Megközelítés szekció: márka filozófia és CTA gomb — */}
        <section className="w-full bg-gray-50 pt-20">
          <div className="max-w-9xl mx-auto px-6 md:px-8 mt-32 ">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-28 space-x-1 md:space-x-8">
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <p className="text-xl font-semibold">[davelopment]®</p>
                <p className="text-md md:text-lg font-normal text-gray-400">{t('studio.approach.title')}</p>
              </motion.div>
              <motion.div
                className="md:col-span-3 space-y-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <p className="text-3xl">
                  <span className="text-black/60">{t('studio.approach.description.part1')}</span>{' '}
                  {t('studio.approach.description.part2')}
                </p>
                <p className="text-lg text-black/60">{t('studio.approach.noOverpromise')}</p>
                <MotionLink
                  to="/projects"
                  className="mt-6 bg-black text-white px-4 py-1 rounded-full inline-flex items-center space-x-2 overflow-hidden"
                  initial="rest"
                  whileHover="hover"
                  animate="rest"
                >
                  <div className="overflow-hidden h-6">
                    <motion.div className="flex flex-col mr-4" variants={wheelVariants}>
                      <span>{t('studio.approach.portfolio')}</span>
                      <span>{t('studio.approach.portfolio')}</span>
                    </motion.div>
                  </div>
                  <motion.div className="w-2 h-2 bg-white rounded-full" variants={dotVariants} />
                </MotionLink>
              </motion.div>
            </div>
            <motion.section
              ref={imageRef}
              style={{ y: imageAnimation.y, scale: imageAnimation.scale }}
            >
              <motion.div
                className="w-full h-[400px] mt-28 rounded-2xl overflow-hidden relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <motion.img
                  src="https://framerusercontent.com/images/ZQiB1dmuDs9HltyP0MucRfbqCs.jpg"
                  alt="Csapat együttműködés"
                  className="w-full h-full object-cover"
                  style={{ scale: imageAnimation.scale }}
                />
                <div className="absolute bottom-6 left-6 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg">
                  {t('studio.approach.ourTeam')} / 2024
                </div>
              </motion.div>
            </motion.section>
          </div>
        </section>

        {/* — Mi egyéb? szekció: kiegészítő információk blokk — */}
        <motion.section
          ref={whatElseRef}
          style={{ y: whatElseAnimation.y }}
        >
          <section className="w-full  bg-gray-50">
            <div className="max-w-9xl mx-auto px-6 md:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Első oszlop */}
                <div>
                  <div className="flex items-center md:items-center space-x-2 mb-4">
                    <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                      <PlusIcon className="w-3 h-3 text-white" />
                    </div>
                    <p className="text-sm font-medium text-black">{t('studio.whatElseSection.badge')}</p>
                  </div>
                </div>
                {/* Második oszlop */}
                <div>
                  <h2 className="text-3xl md:text-4xl font-normal text-gray-500 mb-8">
                    {t('studio.whatElseSection.title')}<br />
                    <span className="text-gray-900">{t('studio.whatElseSection.title2')}</span>
                  </h2>
                  <p className="text-xl font-normal text-black/60">{t('studio.whatElseSection.description')}</p>
                </div>
              </div>
            </div>
          </section>
        </motion.section>
      </main>

      {/* Kapcsolat, lábléc és blur effekt */}
      <ContactSection />
      <Footer />
      <BlurFooterEffect />
    </div>
  );
}
