'use client';

import { useEffect, useState } from 'react';

// A folyamatos, scroll-linkelt parallax-transform (useScroll + useTransform)
// minden scroll-eseménynél újraszámol és újrafest — mobilon (gyengébb GPU,
// gyakran alacsonyabb frissítési ráta) ez érezhetően akadozást okoz, ha
// sok szekció fut egyszerre. Ezzel a hookkal mobilon kikapcsolható / egyszerű
// statikus értékre cserélhető a parallax, a sima fade/scale-in animáció
// (whileInView, IntersectionObserver-alapú, nem scroll-linkelt) megmarad.
export function useIsMobile(breakpointPx = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpointPx - 1}px)`);
    setIsMobile(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [breakpointPx]);

  return isMobile;
}
