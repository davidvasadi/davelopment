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
══════════════════════════════════════════════════════════ */
function installPreloader() {
  const ATTR = 'data-dave-preloader';
  if (document.querySelector(`[${ATTR}]`)) return;

  const t0 = Date.now();
  const overlay = document.createElement('div');
  overlay.setAttribute(ATTR, '1');
  overlay.innerHTML = `
    <div class="dave-pre-inner">
      <div class="dave-pre-logo">[davelopment]<span>®</span></div>
      <div class="dave-pre-bar"><div class="dave-pre-fill"></div></div>
    </div>
  `;

  const mount   = () => { if (!document.querySelector(`[${ATTR}]`)) document.body?.appendChild(overlay); };
  const unmount = () => {
    const wait = Math.max(0, 600 - (Date.now() - t0));
    setTimeout(() => {
      overlay.classList.add('dave-pre-hide');
      setTimeout(() => overlay.remove(), 300);
    }, wait);
  };

  const isReady = () =>
    !!(document.querySelector('[data-strapi-root],[class*="AppLayout"],[class*="Layout"]')) &&
    !!(document.querySelector('[role="main"],main,[class*="Content"]'));

  if (document.body) mount();
  else window.addEventListener('DOMContentLoaded', mount, { once: true });

  const obs = new MutationObserver(() => { if (isReady()) { obs.disconnect(); requestAnimationFrame(unmount); } });
  const start = () => {
    if (!document.body) return;
    obs.observe(document.body, { childList: true, subtree: true });
    if (isReady()) { obs.disconnect(); unmount(); }
  };
  if (document.body) start();
  else window.addEventListener('DOMContentLoaded', start, { once: true });
  setTimeout(() => { obs.disconnect(); unmount(); }, 6000);
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
   A Strapi 5 styled-components generált class neveket használ,
   ezért CSS szelektorok helyett JS-sel keressük meg a
   widget scroll konténereket és inline style-al javítjuk.
══════════════════════════════════════════════════════════ */
function installWidgetHeightFix() {
  // Megkeresi azokat az elemeket, amelyek:
  // 1. Egy widget konténer gyermekei (class tartalmaz "widget" vagy "Widget")
  // 2. Overflow: hidden/auto/scroll ÉS van max-height korlátozásuk
  // Ezeken eltávolítja a magasság korlátot.
  const fixEl = (el: HTMLElement) => {
    el.style.setProperty('max-height', 'none', 'important');
    el.style.setProperty('height', 'auto', 'important');
    el.style.setProperty('overflow', 'visible', 'important');
  };

  const isWidgetContainer = (el: HTMLElement): boolean => {
    // Végigmegy a szülőkön és keresi a widget wrappert
    let node: HTMLElement | null = el;
    for (let i = 0; i < 8; i++) {
      if (!node) break;
      const cls = node.className || '';
      const tag = node.tagName;
      if (
        typeof cls === 'string' && (
          cls.toLowerCase().includes('widget') ||
          node.hasAttribute('data-widget-id') ||
          node.hasAttribute('data-testid') && String(node.getAttribute('data-testid')).toLowerCase().includes('widget')
        )
      ) return true;
      // Strapi 5: a főoldalon a widgetek egy grid layoutban vannak
      // Ha article tagben vagyunk, valószínűleg widget
      if (tag === 'ARTICLE') return true;
      node = node.parentElement;
    }
    return false;
  };

  const scanAndFix = () => {
    // Minden div-et megvizsgálunk az oldalon
    document.querySelectorAll<HTMLElement>('div, section, article').forEach(el => {
      // Ha inline style-ban van max-height vagy overflow korlátozás
      const inlineMaxH = el.style.maxHeight;
      const inlineOverflow = el.style.overflow || el.style.overflowY;

      if (
        (inlineMaxH && inlineMaxH !== 'none' && inlineMaxH !== '') ||
        (inlineOverflow && (inlineOverflow === 'hidden' || inlineOverflow === 'auto' || inlineOverflow === 'scroll'))
      ) {
        if (isWidgetContainer(el)) {
          fixEl(el);
          return;
        }
      }

      // Computed style alapján is ellenőrizzük
      const computed = window.getComputedStyle(el);
      const maxH = computed.maxHeight;
      const overflow = computed.overflow;
      const overflowY = computed.overflowY;

      if (
        maxH && maxH !== 'none' && maxH !== '' && parseInt(maxH) < 2000 &&
        (overflow === 'hidden' || overflow === 'auto' || overflow === 'scroll' ||
         overflowY === 'hidden' || overflowY === 'auto' || overflowY === 'scroll')
      ) {
        if (isWidgetContainer(el)) {
          fixEl(el);
        }
      }
    });
  };

  // Betöltés után 8 másodpercig 400ms-enként fut (Strapi lassan renderel)
  const run = () => {
    scanAndFix();
    let count = 0;
    const iv = setInterval(() => {
      scanAndFix();
      count++;
      if (count >= 20) clearInterval(iv);
    }, 400);
  };

  if (document.body) {
    run();
  } else {
    window.addEventListener('DOMContentLoaded', run, { once: true });
  }

  // Route változásra is lefut (SPA navigáció)
  window.addEventListener('popstate', () => setTimeout(scanAndFix, 300));
  // Strapi saját router eseménye
  window.addEventListener('strapi-theme-change', () => setTimeout(scanAndFix, 300));
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
    installPreloader();
    installAutoLogoSwap({ light: logoLight, dark: logoDark });
    installWidgetHeightFix();
  },
};
