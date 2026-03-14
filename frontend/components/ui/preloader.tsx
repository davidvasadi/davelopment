'use client';

import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { Inter } from 'next/font/google';
import { GrainCanvas } from './grain-canvas';

const inter = Inter({
  subsets: ['latin'],
  weight: ['600'],
  display: 'swap',
});

const EASE_IN  = [0.76, 0, 0.24, 1] as const;
const EASE_OUT = [0.22, 1, 0.36, 1] as const;

// ============================================================
// PRELOADER CONTEXT
// ============================================================
export const PreloaderContext = createContext(false);
export const usePreloaderDone = () => useContext(PreloaderContext);

// ============================================================
// NAV CLOSE CONTEXT
// navigateAfterClose(href, closeMenu, delay?)
//   → bezárja a menüt → vár delay ms-t → navigál
//   → PageTransition csak ezután indul el → nincs ütközés
// ============================================================
type NavCloseCtx = {
  navigateAfterClose: (href: string, closeMenu: () => void, delay?: number) => void;
};
export const NavCloseContext = createContext<NavCloseCtx>({
  navigateAfterClose: () => {},
});
export const useNavClose = () => useContext(NavCloseContext);

// ============================================================
// PRELOADER
// ============================================================
const LOGO = '[davelopment]®';

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const [visible, setVisible] = useState(true);
  const holdAfterMs = (LOGO.length - 1) * 55 + 550 + 600;

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 700);
    }, holdAfterMs);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#0a0a0a]"
          initial={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.7, ease: EASE_IN }}
        >
          <GrainCanvas strength="light" opacity={0.5} zIndex={1} />
          <div className="relative z-20 flex" style={{ overflow: 'hidden', paddingBottom: '0.1em' }}>
            {LOGO.split('').map((char, i) => (
              <motion.span
                key={i}
                className={inter.className}
                style={{
                  color: '#fff',
                  fontSize: 'clamp(1.1rem, 2.5vw, 1.8rem)',
                  fontWeight: 600,
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                  display: 'inline-block',
                  minWidth: char === ' ' ? '0.3em' : undefined,
                }}
                initial={{ y: '115%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 0.55, delay: i * 0.055, ease: [0.33, 1, 0.68, 1] }}
              >
                {char}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================================
// PAGE TRANSITION
// ============================================================
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [current, setCurrent] = useState(children);
  const [curtain, setCurtain] = useState<'hidden' | 'in' | 'out'>('hidden');
  const [contentVisible, setContentVisible] = useState(true);
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    setContentVisible(false);
    setCurtain('in');
    const t1 = setTimeout(() => { setCurrent(children); }, 550);
    const t2 = setTimeout(() => { setCurtain('out'); }, 600);
    const t3 = setTimeout(() => { setContentVisible(true); }, 1200);
    const t4 = setTimeout(() => { setCurtain('hidden'); }, 1700);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [pathname]);

  useEffect(() => {
    if (curtain === 'hidden') setCurrent(children);
  }, [children, curtain]);

  return (
    <>
      {curtain !== 'hidden' && (
        <>
          <motion.div
            className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden"
            initial={{ opacity: curtain === 'in' ? 0 : 1 }}
            animate={{ opacity: curtain === 'in' ? 1 : 0 }}
            transition={{ duration: curtain === 'in' ? 0.55 : 1.0, ease: curtain === 'in' ? EASE_IN : EASE_OUT }}
          />
          <motion.div
            className="fixed inset-0 z-[9998] bg-[#0a0a0a] pointer-events-none"
            style={{ transformOrigin: curtain === 'in' ? 'bottom' : 'top' }}
            initial={{ scaleY: curtain === 'in' ? 0 : 1 }}
            animate={{ scaleY: curtain === 'in' ? 1 : 0 }}
            transition={{ duration: curtain === 'in' ? 0.55 : 1.0, ease: curtain === 'in' ? EASE_IN : EASE_OUT }}
          />
        </>
      )}
      <motion.div
        key={pathname}
        style={{ visibility: contentVisible ? 'visible' : 'hidden' }}
        initial={{ opacity: 0, y: 40 }}
        animate={contentVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
      >
        {current}
      </motion.div>
    </>
  );
}

// ============================================================
// APP WRAPPER
// ============================================================
export function AppWrapper({ children }: { children: React.ReactNode }) {
  const [done, setDone] = useState(false);
  const router = useRouter();

  // Desktop bezárás: 560ms + 50ms buffer = 610ms
  // Mobile bezárás:  380ms + 50ms buffer = 430ms
  // 620ms biztonságos mindkettőre
  const navigateAfterClose = useCallback(
    (href: string, closeMenu: () => void, delay = 620) => {
      closeMenu();
      setTimeout(() => router.push(href), delay);
    },
    [router]
  );

  return (
    <NavCloseContext.Provider value={{ navigateAfterClose }}>
      <PreloaderContext.Provider value={done}>
        {!done && <Preloader onComplete={() => setDone(true)} />}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={done ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
        >
          {children}
        </motion.div>
      </PreloaderContext.Provider>
    </NavCloseContext.Provider>
  );
}
