'use client';

import { useEffect } from 'react';
import { sendGAEvent } from '@next/third-parties/google';

/**
 * Global click tracker for GA4 conversion signals. Mounted once in the layout.
 * Fires (only when analytics consent is granted — Consent Mode handles that):
 *  - cta_click      → any link/element carrying a data-cta="<label>" attribute
 *  - contact_click  → tel: (phone) and mailto: (email) links, anywhere on the site
 * Purely additive: it never changes navigation or link behaviour.
 */
export function ConversionTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const el = target?.closest?.('a, [data-cta]') as HTMLElement | null;
      if (!el) return;
      try {
        const cta = el.getAttribute('data-cta');
        if (cta) {
          sendGAEvent('event', 'cta_click', { label: cta.slice(0, 80) });
          return;
        }
        const href = el.getAttribute('href') || '';
        if (href.startsWith('tel:')) sendGAEvent('event', 'contact_click', { method: 'phone' });
        else if (href.startsWith('mailto:')) sendGAEvent('event', 'contact_click', { method: 'email' });
      } catch {}
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  return null;
}
