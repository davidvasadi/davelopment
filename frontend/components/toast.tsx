'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { cn } from '@/lib/utils';

type CookiePreferences = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
};

const COOKIE_KEY = 'davelopment_cookie_consent';

const CATEGORIES = [
  { key: 'necessary' as const,  label: 'Szükséges',  desc: 'Mindig aktív',               locked: true  },
  { key: 'analytics' as const,  label: 'Analitika',  desc: 'Látogatói statisztikák',      locked: false },
  { key: 'marketing' as const,  label: 'Marketing',  desc: 'Személyre szabott tartalom',  locked: false },
];

const wheelVariants: Variants = {
  rest:  { y: '-50%' },
  hover: { y: '0%', transition: { duration: 0.28, ease: 'easeInOut' } },
};
const dotVariants: Variants = {
  rest:  { scale: 1 },
  hover: { scale: 1.4, transition: { duration: 0.28, ease: 'easeInOut' } },
};

export const CookieConsent = () => {
  const [isOpen, setIsOpen]           = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [prefs, setPrefs]             = useState<CookiePreferences>({
    necessary: true, analytics: true, marketing: false,
  });

  const params = useParams();
  const locale = (params?.locale as string | undefined) ?? 'hu';
  const privacyHref = `/${locale}/adatkezeles`;

  useEffect(() => {
    if (!localStorage.getItem(COOKIE_KEY)) setTimeout(() => setIsOpen(true), 1200);
  }, []);

  const save = (p: CookiePreferences) => {
    localStorage.setItem(COOKIE_KEY, JSON.stringify({ ...p, timestamp: Date.now() }));
    setIsOpen(false);
  };

  const acceptAll  = () => save({ necessary: true, analytics: true,  marketing: true  });
  const rejectAll  = () => save({ necessary: true, analytics: false, marketing: false });
  const saveCustom = () => save(prefs);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0,  opacity: 1 }}
          exit={{    y: 20, opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[999] w-[calc(100vw-2rem)] md:w-[360px]"
        >
          <div className="bg-black/90 backdrop-blur-md text-white rounded-2xl overflow-hidden">

            {/* Top accent */}
            <div className="h-px w-full bg-gradient-to-r from-white/30 via-white/10 to-transparent" />

            <div className="px-5 pt-4 pb-5">

              {/* Badge + close */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-black font-bold leading-none" style={{ fontSize: 8 }}>+</span>
                  </div>
                  <span className="text-[10px] font-medium tracking-widest uppercase text-white/40">
                    Adatvédelem
                  </span>
                </div>
                <button
                  onClick={rejectAll}
                  className="text-white/20 hover:text-white/50 transition-colors text-xs"
                >
                  ✕
                </button>
              </div>

              {/* Heading */}
              <p className="text-xl font-semibold tracking-tight leading-tight mb-1">
                Sütiket használunk.
              </p>
              <p className="text-xs text-white/40 leading-relaxed mb-4">
                A szükséges sütik mindig aktívak.{' '}
                <Link
                  href={privacyHref}
                  onClick={() => setIsOpen(false)}
                  className="text-white/50 hover:text-white underline underline-offset-2 transition-colors"
                >
                  Adatkezelési tájékoztató
                </Link>
              </p>

              {/* Expandable settings */}
              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{    height: 0,      opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-2.5 mb-4 pt-1">
                      {CATEGORIES.map(({ key, label, desc, locked }) => (
                        <div key={key} className="flex items-center justify-between gap-4">
                          <div>
                            <p className="text-xs font-medium leading-none mb-0.5">{label}</p>
                            <p className="text-[10px] text-white/30">{desc}</p>
                          </div>
                          <button
                            disabled={locked}
                            onClick={() => !locked && setPrefs(p => ({ ...p, [key]: !p[key] }))}
                            className={cn(
                              'relative w-8 h-4 rounded-full transition-colors duration-200 flex-shrink-0',
                              locked ? 'cursor-not-allowed opacity-40' : 'cursor-pointer',
                              (locked || prefs[key]) ? 'bg-white' : 'bg-white/20'
                            )}
                          >
                            <span className={cn(
                              'absolute top-0.5 w-3 h-3 rounded-full bg-black transition-transform duration-200',
                              (locked || prefs[key]) ? 'translate-x-4' : 'translate-x-0.5'
                            )} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowDetails(v => !v)}
                  className="text-[10px] tracking-widest uppercase text-white/25 hover:text-white/50 transition-colors mr-auto"
                >
                  {showDetails ? 'Kevesebb' : 'Beállítások'}
                </button>

                {showDetails ? (
                  <motion.button
                    onClick={saveCustom}
                    initial="rest" whileHover="hover" animate="rest"
                    className="inline-flex items-center gap-2.5 rounded-full bg-white text-black px-3.5 py-1.5 text-xs font-semibold overflow-hidden"
                  >
                    <div className="overflow-hidden" style={{ height: '1rem' }}>
                      <motion.div className="flex flex-col" style={{ lineHeight: '1rem' }} variants={wheelVariants}>
                        <span className="block">Mentés</span>
                        <span className="block" aria-hidden>Mentés</span>
                      </motion.div>
                    </div>
                    <motion.span className="h-1.5 w-1.5 rounded-full bg-black flex-shrink-0" variants={dotVariants} />
                  </motion.button>
                ) : (
                  <>
                    <motion.button
                      onClick={acceptAll}
                      initial="rest" whileHover="hover" animate="rest"
                      className="inline-flex items-center gap-2.5 rounded-full bg-white text-black px-3.5 py-1.5 text-xs font-semibold overflow-hidden"
                    >
                      <div className="overflow-hidden" style={{ height: '1rem' }}>
                        <motion.div className="flex flex-col" style={{ lineHeight: '1rem' }} variants={wheelVariants}>
                          <span className="block">Elfogad mindet</span>
                          <span className="block" aria-hidden>Elfogad mindet</span>
                        </motion.div>
                      </div>
                      <motion.span className="h-1.5 w-1.5 rounded-full bg-black flex-shrink-0" variants={dotVariants} />
                    </motion.button>
                  </>
                )}
              </div>

            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
