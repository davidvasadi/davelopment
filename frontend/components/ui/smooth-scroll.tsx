'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,        // scroll animáció hossza másodpercben
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo easing — mint a Fabrica
      orientation: 'vertical',
      smoothWheel: true,
    });

    // Framer Motion / GSAP kompatibilitás — RAF loop
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
