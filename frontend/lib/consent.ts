// Google Consent Mode v2 — a cookie banner (components/toast.tsx) állapotát fordítja le
// a gtag consent jelzésekre. A localStorage kulcs egyezik a bannerével.

export const COOKIE_KEY = 'davelopment_cookie_consent';

export type CookiePreferences = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
};

type ConsentValue = 'granted' | 'denied';

const g = (allowed: boolean): ConsentValue => (allowed ? 'granted' : 'denied');

/**
 * Frissíti a Google Consent Mode állapotát a felhasználó választása alapján.
 * Akkor hívjuk, amikor a látogató ment a cookie bannerben.
 */
export const applyConsent = (prefs: CookiePreferences) => {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;

  window.gtag('consent', 'update', {
    analytics_storage: g(prefs.analytics),
    ad_storage: g(prefs.marketing),
    ad_user_data: g(prefs.marketing),
    ad_personalization: g(prefs.marketing),
  });
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}
