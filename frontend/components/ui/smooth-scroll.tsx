'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';

let lenisInstance: Lenis | null = null;

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    lenisInstance = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  // Global anchor smooth-scroll: any <a href="…#id"> whose target exists on the
  // CURRENT page scrolls smoothly (with navbar offset) and keeps the URL clean.
  // Cross-page anchors (target not on this page) navigate normally.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as HTMLElement | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!anchor) return;
      const raw = anchor.getAttribute('href') || '';
      const hashIdx = raw.indexOf('#');
      if (hashIdx === -1) return;
      let id = raw.slice(hashIdx + 1);
      try { id = decodeURIComponent(id); } catch {}
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return; // target not on this page → let the link navigate normally
      e.preventDefault();
      e.stopPropagation();
      scrollToElement(el);
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  return <>{children}</>;
}

/** Smooth-scroll to an element (or element id), offset for the fixed navbar. */
export function scrollToElement(target: Element | string): void {
  const el = typeof target === 'string' ? document.getElementById(target) : target;
  if (!el) return;
  const OFFSET = -96; // keep the section below the fixed navbar
  if (lenisInstance) {
    lenisInstance.scrollTo(el as HTMLElement, { offset: OFFSET });
  } else {
    const y = (el as HTMLElement).getBoundingClientRect().top + window.scrollY + OFFSET;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
}

// Ezt hívd meg útvonalváltáskor
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    if (lenisInstance) {
      lenisInstance.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}