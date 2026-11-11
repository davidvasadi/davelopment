'use client';

import { useEffect } from 'react';
import Clarity from '@microsoft/clarity';

import { CONSENT_EVENT, readConsent, type CookiePreferences } from '@/lib/consent';

const CLARITY_ID = 'zc1do8x1ks';

const g = (allowed: boolean) => (allowed ? 'granted' : 'denied') as 'granted' | 'denied';

/**
 * Microsoft Clarity (session recordings, heatmaps). Only loads in production and only after
 * the visitor accepted analytics cookies in the banner; follows later consent changes too.
 */
export function ClarityTracker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    let started = false;

    const apply = (p: CookiePreferences | null) => {
      if (!p) return;
      if (p.analytics && !started) {
        Clarity.init(CLARITY_ID);
        started = true;
      }
      if (started) {
        Clarity.consentV2({ analytics_Storage: g(p.analytics), ad_Storage: g(p.marketing) });
      }
    };

    apply(readConsent());

    const onChange = (e: Event) => apply((e as CustomEvent<CookiePreferences>).detail);
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  return null;
}
