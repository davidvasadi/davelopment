'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { Inter } from 'next/font/google';

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
// GRAIN CANVAS — C erősség: base:8, range:55, alpha:255
// Nincs mixBlendMode! A canvas maga a háttér, teljesen opák.
// mixBlendMode:'screen' fekete háttéren = láthatatlan (bug volt)
// ============================================================
function GrainCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let raf: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const { width, height } = canvas;
      const img = ctx.createImageData(width, height);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = 8 + Math.random() * 55; // C erősség
        img.data[i]     = v;
        img.data[i + 1] = v;
        img.data[i + 2] = v;
        img.data[i + 3] = 255; // teljesen opák — a canvas IS a háttér
      }
      ctx.putImageData(img, 0, 0);
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

// ============================================================
// PRELOADER — csak első betöltéskor
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
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
          initial={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.7, ease: EASE_IN }}
        >
          {/* Grain IS a háttér — z-0, opaque, nincs blend mode */}
          <GrainCanvas />

          {/* Betűk — z-20, grain felett */}
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
// BE: alulról nő fel (0.55s gyors) → KI: felülről húzódik el (1.0s lassú)
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
          {/* Grain overlay a függönyre — itt overlay blend rendben van */}
          <motion.div
            className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden"
            initial={{ opacity: curtain === 'in' ? 0 : 1 }}
            animate={{ opacity: curtain === 'in' ? 1 : 0 }}
            transition={{ duration: curtain === 'in' ? 0.55 : 1.0, ease: curtain === 'in' ? EASE_IN : EASE_OUT }}
          >
            <GrainCanvas />
          </motion.div>
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

  return (
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
  );
}
