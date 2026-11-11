// Google Consent Mode v2 — a cookie banner (components/toast.tsx) állapotát fordítja le
// a gtag consent jelzésekre. A localStorage kulcs egyezik a bannerével.

export const COOKIE_KEY = 'davelopment_cookie_consent';

// Bump when the cookie categories / tools change (v2: Microsoft Clarity added) — older saved
// choices are then ignored and the banner asks again.
export const CONSENT_VERSION = 2;

/** The visitor's saved choice, or null if none / saved under an older consent version. */
export const readConsent = (): CookiePreferences | null => {
  try {
    const s = JSON.parse(localStorage.getItem(COOKIE_KEY) || 'null');
    return s && s.v === CONSENT_VERSION ? s : null;
  } catch {
    return null;
  }
};

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
export const CONSENT_EVENT = 'davelopment:consent';

export const applyConsent = (prefs: CookiePreferences) => {
  if (typeof window === 'undefined') return;
  // non-Google trackers (Clarity) listen to this
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: prefs }));
  if (typeof window.gtag !== 'function') return;

  window.gtag('consent', 'update', {
    analytics_storage: g(prefs.analytics),
    ad_storage: g(prefs.marketing),
    ad_user_data: g(prefs.marketing),
    ad_personalization: g(prefs.marketing),
  });
};

declare global {
  interface Window {
    // Match @next/third-parties' global augmentation to avoid a type conflict
    dataLayer?: Object[];
    gtag?: (...args: unknown[]) => void;
  }
}
