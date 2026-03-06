// ./src/admin/app.tsx
import React from 'react';
import './davelopment-admin.css';

import logoDark from './extensions/logo-dark.png';
import logoLight from './extensions/logo-light.png';

/* ══════════════════════════════════════════════════════════
   THEME — monokróm, semmi szín
══════════════════════════════════════════════════════════ */
const THEME = {
  dark: {
    colors: {
      neutral0:    '#0a0a0a',
      neutral100:  '#0a0a0a',
      neutral150:  '#111111',
      neutral200:  '#171717',
      neutral300:  '#222222',
      neutral400:  '#333333',
      neutral500:  '#4d4d4d',
      neutral600:  '#666666',
      neutral700:  '#999999',
      neutral800:  '#c9c9c9',
      neutral900:  '#ededed',
      neutral1000: '#ffffff',

      primary0:   'rgba(255,255,255,0.03)',
      primary50:  'rgba(255,255,255,0.05)',
      primary100: 'rgba(255,255,255,0.07)',
      primary200: 'rgba(255,255,255,0.10)',
      primary500: '#ffffff',
      primary600: '#ededed',
      primary700: '#d4d4d4',

      danger100: 'rgba(255,80,80,0.08)',
      danger200: 'rgba(255,80,80,0.15)',
      danger500: '#ff5050',
      danger600: '#e03d3d',
      danger700: '#c42e2e',

      warning100: 'rgba(245,166,35,0.08)',
      warning200: 'rgba(245,166,35,0.15)',
      warning500: '#f5a623',
      warning600: '#d9911a',
      warning700: '#b87a12',

      success100: 'rgba(80,200,120,0.08)',
      success200: 'rgba(80,200,120,0.15)',
      success500: '#50c878',
      success600: '#3db062',
      success700: '#2e9450',

      secondary100: 'rgba(255,255,255,0.06)',
      secondary200: 'rgba(255,255,255,0.10)',
      secondary500: '#ededed',
      secondary600: '#c9c9c9',
      secondary700: '#999999',

      buttonNeutral0:   '#111111',
      buttonPrimary500: '#ffffff',
      buttonPrimary600: '#ededed',
    },
  },

  light: {
    colors: {
      neutral0:    '#fafafa',
      neutral100:  '#fafafa',
      neutral150:  '#f5f5f5',
      neutral200:  '#efefef',
      neutral300:  '#e0e0e0',
      neutral400:  '#c0c0c0',
      neutral500:  '#888888',
      neutral600:  '#666666',
      neutral700:  '#444444',
      neutral800:  '#222222',
      neutral900:  '#111111',
      neutral1000: '#000000',

      primary0:   'rgba(0,0,0,0.03)',
      primary50:  'rgba(0,0,0,0.05)',
      primary100: 'rgba(0,0,0,0.07)',
      primary200: 'rgba(0,0,0,0.10)',
      primary500: '#000000',
      primary600: '#111111',
      primary700: '#222222',

      danger100: 'rgba(220,38,38,0.07)',
      danger200: 'rgba(220,38,38,0.13)',
      danger500: '#dc2626',
      danger600: '#b91c1c',
      danger700: '#991b1b',

      warning100: 'rgba(234,88,12,0.07)',
      warning200: 'rgba(234,88,12,0.13)',
      warning500: '#ea580c',
      warning600: '#c2410c',
      warning700: '#9a3412',

      success100: 'rgba(22,163,74,0.07)',
      success200: 'rgba(22,163,74,0.13)',
      success500: '#16a34a',
      success600: '#15803d',
      success700: '#166534',

      secondary100: 'rgba(0,0,0,0.05)',
      secondary200: 'rgba(0,0,0,0.09)',
      secondary500: '#444444',
      secondary600: '#666666',
      secondary700: '#888888',

      buttonNeutral0:   '#ffffff',
      buttonPrimary500: '#000000',
      buttonPrimary600: '#111111',
    },
  },
} as const;

/* ══════════════════════════════════════════════════════════
   THEME BRIDGE
══════════════════════════════════════════════════════════ */
const THEME_KEYS = ['STRAPI_THEME', 'strapi-theme', 'strapiTheme', 'theme', 'admin-theme'];

function normalizeMode(v: string | null | undefined): 'light' | 'dark' | null {
  const raw = (v ?? '').toLowerCase().trim();
  if (raw === 'light') return 'light';
  if (raw === 'dark') return 'dark';
  return null;
}

function getStoredMode(): 'light' | 'dark' | null {
  for (const k of THEME_KEYS) {
    const v = normalizeMode(localStorage.getItem(k));
    if (v) return v;
  }
  return null;
}

function resolveMode(hint?: string | null): 'light' | 'dark' {
  const sys = window.matchMedia?.('(prefers-color-scheme: light)')?.matches ? 'light' : 'dark';
  return normalizeMode(hint) ?? getStoredMode() ?? sys;
}

function installThemeBridge() {
  const html = document.documentElement;
  let cur: 'light' | 'dark' = resolveMode();
  let busy = false;

  function apply(hint?: string | null) {
    if (busy) return;
    busy = true;
    cur = resolveMode(hint);
    html.setAttribute('data-theme', cur);
    html.style.colorScheme = cur;
    if (document.body) {
      document.body.setAttribute('data-theme', cur);
      document.body.style.colorScheme = cur;
    }
    window.dispatchEvent(new CustomEvent('strapi-theme-change', { detail: { mode: cur } }));
    requestAnimationFrame(() => {
      html.setAttribute('data-theme', cur);
      if (document.body) document.body.setAttribute('data-theme', cur);
      busy = false;
    });
  }

  apply();
  window.matchMedia?.('(prefers-color-scheme: light)')?.addEventListener?.('change', () => { if (!getStoredMode()) apply(); });
  window.addEventListener('storage', (e) => { if (e.key && THEME_KEYS.includes(e.key)) apply(e.newValue); });
  const _set = localStorage.setItem.bind(localStorage);
  localStorage.setItem = (k: string, v: string) => { _set(k, v); if (THEME_KEYS.includes(k)) apply(v); };
  const obs = new MutationObserver(() => { if (html.getAttribute('data-theme') !== cur) apply(); });
  obs.observe(html, { attributes: true, attributeFilter: ['data-theme'] });
  const watchBody = () => {
    if (!document.body) return;
    if (document.body.getAttribute('data-theme') !== cur) apply();
    obs.observe(document.body, { attributes: true, attributeFilter: ['data-theme'] });
  };
  if (document.body) watchBody();
  else window.addEventListener('DOMContentLoaded', watchBody, { once: true });
}

/* ══════════════════════════════════════════════════════════
   PRELOADER
   Azonnal fut a modul betöltésekor (nem vár bootstrap-ra),
   így a Strapi saját preloadere előtt jelenik meg.
══════════════════════════════════════════════════════════ */
function installPreloader() {
  if (typeof window === 'undefined') return;

  const ATTR = 'data-dave-preloader';
  if (document.querySelector(`[${ATTR}]`)) return;

  const t0 = Date.now();

  // Strapi saját preloaderét azonnal elrejtjük
  const killStrapiPreloader = () => {
    document.querySelectorAll<HTMLElement>(
      '[class*="LoadingIndicatorOverlay"], [class*="LoadingIndicator"]'
    ).forEach(el => {
      el.style.setProperty('display', 'none', 'important');
      el.style.setProperty('opacity', '0', 'important');
      el.style.setProperty('pointer-events', 'none', 'important');
    });
  };

  const overlay = document.createElement('div');
  overlay.setAttribute(ATTR, '1');
  overlay.innerHTML = `
    <div style="
      display:flex; flex-direction:column; align-items:center; gap:28px;
    ">
      <div style="
        font-family:-apple-system,BlinkMacSystemFont,sans-serif;
        font-size:26px; font-weight:700; letter-spacing:-1px;
        color:#ededed; line-height:1; user-select:none;
      ">[davelopment]<span style="
        font-size:13px; font-weight:400; vertical-align:super;
        color:#ededed; opacity:0.4; letter-spacing:0;
      ">®</span></div>
      <div style="
        width:100px; height:1px; background:rgba(255,255,255,0.08);
        border-radius:1px; overflow:hidden;
      ">
        <div data-dave-fill style="
          height:100%; width:0%; background:rgba(255,255,255,0.6);
        "></div>
      </div>
    </div>
  `;

  // Inline style — nem függ a CSS betöltésétől
  overlay.style.cssText = `
    position:fixed; inset:0; z-index:2147483647;
    display:flex; align-items:center; justify-content:center;
    background:#0a0a0a;
    transition:opacity 250ms cubic-bezier(.25,.46,.45,.94),
               transform 250ms cubic-bezier(.25,.46,.45,.94);
  `;

  // Progress bar animáció JS-sel (CSS keyframes nem biztos hogy betöltött)
  const animateFill = () => {
    const fill = overlay.querySelector<HTMLElement>('[data-dave-fill]');
    if (!fill) return;
    const steps = [
      [0,    '0%'],
      [300,  '45%'],
      [600,  '72%'],
      [1000, '88%'],
      [1800, '96%'],
    ] as [number, string][];
    steps.forEach(([ms, w]) => {
      setTimeout(() => { fill.style.width = w; fill.style.transition = `width ${ms === 0 ? 0 : 400}ms ease`; }, ms);
    });
  };

  const mount = () => {
    if (document.querySelector(`[${ATTR}]`)) return;
    document.body.appendChild(overlay);
    animateFill();
    killStrapiPreloader();
  };

  const unmount = () => {
    const wait = Math.max(0, 700 - (Date.now() - t0));
    setTimeout(() => {
      overlay.style.opacity = '0';
      overlay.style.transform = 'scale(1.01)';
      overlay.style.pointerEvents = 'none';
      setTimeout(() => overlay.remove(), 300);
    }, wait);
  };

  // Az app akkor ready, ha a Strapi navigáció megjelent
  const isReady = () =>
    !!(document.querySelector('[data-strapi-root]')) &&
    !!(document.querySelector('[data-strapi-navigation]'));

  // Mount amint van body
  if (document.body) {
    mount();
  } else {
    window.addEventListener('DOMContentLoaded', mount, { once: true });
  }

  // Strapi preloader folyamatos ölése amíg mi vagyunk bent
  const strapiKillObs = new MutationObserver(killStrapiPreloader);
  const startKillObs = () => {
    if (!document.body) return;
    strapiKillObs.observe(document.body, { childList: true, subtree: true });
    killStrapiPreloader();
  };
  if (document.body) startKillObs();
  else window.addEventListener('DOMContentLoaded', startKillObs, { once: true });

  // Unmount ha az app betöltött
  const readyObs = new MutationObserver(() => {
    if (isReady()) {
      readyObs.disconnect();
      strapiKillObs.disconnect();
      requestAnimationFrame(unmount);
    }
  });
  const startReadyObs = () => {
    if (!document.body) return;
    readyObs.observe(document.body, { childList: true, subtree: true });
    if (isReady()) { readyObs.disconnect(); strapiKillObs.disconnect(); unmount(); }
  };
  if (document.body) startReadyObs();
  else window.addEventListener('DOMContentLoaded', startReadyObs, { once: true });

  // Fallback: max 8 másodperc
  setTimeout(() => {
    readyObs.disconnect();
    strapiKillObs.disconnect();
    unmount();
  }, 8000);
}

/* ══════════════════════════════════════════════════════════
   AUTO LOGO SWAP
══════════════════════════════════════════════════════════ */
function installAutoLogoSwap(logos: { light: string; dark: string }) {
  const html = document.documentElement;
  const src  = () => html.getAttribute('data-theme') === 'light' ? logos.light : logos.dark;
  const set  = (img: HTMLImageElement | null, s: string) => {
    if (!img || img.getAttribute('src') === s) return;
    img.setAttribute('src', s); img.setAttribute('srcset', s); img.style.objectFit = 'contain';
  };
  const navLogo = (): HTMLImageElement | null => {
    const nav = document.querySelector('[data-strapi-navigation]'); if (!nav) return null;
    return [...nav.querySelectorAll<HTMLImageElement>('img')]
      .filter(i => { const r = i.getBoundingClientRect(); return r.top < 220 && r.width > 40 && r.width < 320 && r.height > 12; })
      .sort((a, b) => b.getBoundingClientRect().width - a.getBoundingClientRect().width)[0] ?? null;
  };
  const authLogo = (): HTMLImageElement | null => {
    if (document.querySelector('[data-strapi-navigation]')) return null;
    const m = document.querySelector<HTMLElement>('main,[role="main"]'); if (!m) return null;
    return [...m.querySelectorAll<HTMLImageElement>('img')]
      .filter(i => { const r = i.getBoundingClientRect(); return r.top < 260 && r.width > 60 && r.width < 420; })
      .sort((a, b) => b.getBoundingClientRect().width - a.getBoundingClientRect().width)[0] ?? null;
  };
  const apply = () => { const s = src(); set(navLogo(), s); set(authLogo(), s); };
  apply(); requestAnimationFrame(apply);
  window.addEventListener('strapi-theme-change', apply);
  const obs = new MutationObserver(apply);
  if (document.body) obs.observe(document.body, { childList: true, subtree: true });
}

/* ══════════════════════════════════════════════════════════
   WIDGET HEIGHT FIX
   A Strapi 5 widget wrapper <main> elemre inline style-lal
   tesz fix magasságot (pl. height: 261px; overflow: auto).
   Ezt JS-sel nullázzuk, mert az inline style erősebb
   mint bármilyen CSS rule.
══════════════════════════════════════════════════════════ */
function installWidgetHeightFix() {
  const fix = () => {
    document.querySelectorAll<HTMLElement>('section main, article main').forEach(el => {
      if (el.style.height && el.style.height !== 'auto') {
        el.style.setProperty('height', 'auto', 'important');
        el.style.setProperty('max-height', 'none', 'important');
        el.style.setProperty('overflow', 'visible', 'important');
      }
    });

    document.querySelectorAll<HTMLElement>('[data-radix-scroll-area-viewport]').forEach(el => {
      el.style.setProperty('overflow', 'visible', 'important');
      el.style.setProperty('height', 'auto', 'important');
    });
  };

  const run = () => {
    fix();
    let n = 0;
    const iv = setInterval(() => {
      fix();
      if (++n >= 30) clearInterval(iv);
    }, 300);
  };

  if (document.body) run();
  else window.addEventListener('DOMContentLoaded', run, { once: true });

  window.addEventListener('popstate', () => setTimeout(fix, 300));
  window.addEventListener('strapi-theme-change', () => setTimeout(fix, 300));

  const obs = new MutationObserver(fix);
  if (document.body) {
    obs.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] });
  }
}

/* ══════════════════════════════════════════════════════════
   PRELOADER AZONNALI INDÍTÁSA
   Ez azonnal fut a modul betöltésekor.
══════════════════════════════════════════════════════════ */
if (typeof window !== 'undefined') {
  installPreloader();
}

/* ══════════════════════════════════════════════════════════
   EXPORT
══════════════════════════════════════════════════════════ */
export default {
  config: {
    locales: ['hu', 'en'],
    theme: THEME,
    tutorials: false,
    notifications: { releases: false },
    menu: { logo: logoLight },
    auth:  { logo: logoLight },
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register(app: any) {

    // ── Communications widget ──────────────────────────────────────────────
    app.widgets.register({
      icon: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth={2}
          strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      ),
      title: {
        id: 'widget.communications.title',
        defaultMessage: 'Communications',
      },
      component: async () => {
        const { default: Comp } = await import('./widgets/communications');
        return Comp;
      },
      id: 'communications-stats',
    });

    // ── Marketing widget ───────────────────────────────────────────────────
    app.widgets.register({
      icon: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth={2}
          strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      ),
      title: {
        id: 'widget.marketing.title',
        defaultMessage: 'Marketing',
      },
      component: async () => {
        const { default: Comp } = await import('./widgets/marketing');
        return Comp;
      },
      id: 'marketing-stats',
    });

  },

  bootstrap(_app: any) {
    installThemeBridge();
    // installPreloader() már lefutott a modul tetején
    installAutoLogoSwap({ light: logoLight, dark: logoDark });
    installWidgetHeightFix();
  },
};
