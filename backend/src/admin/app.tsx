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
  if (typeof window === 'undefined') return;

  const ATTR = 'data-dave-preloader';
  if (document.querySelector(`[${ATTR}]`)) return;

  const overlay = document.createElement('div');
  overlay.setAttribute(ATTR, '1');
  overlay.style.cssText = `
    position:fixed;inset:0;z-index:2147483647;
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    background:#0a0a0a;color:#fff;font-family:-apple-system,BlinkMacSystemFont,sans-serif;
  `;

  overlay.innerHTML = `
    <div style="margin-bottom:20px;font-size:26px;font-weight:700;letter-spacing:-1px;color:#fff;user-select:none;">
      [davelopment]<span style="font-size:13px;font-weight:700;vertical-align:super;color:#fff;">®</span>
    </div>
    <div id="dave-bars" style="display:flex;gap:8px;align-items:flex-end;height:40px;position:relative;">
      ${Array.from({ length: 10 }).map(() => `<div style="width:40px;height:40px;background:#333;border-radius:4px;position:relative;box-shadow:0 0 6px rgba(255,255,255,0.1);"></div>`).join('')}
      <div id="dave-percent" style="position:absolute;bottom:-48px;right:0;font-size:18px;font-weight:700;color:#fff;">0%</div>
    </div>
  `;

  document.body.appendChild(overlay);

  const bars = Array.from(overlay.querySelectorAll<HTMLDivElement>('#dave-bars > div:not(#dave-percent)'));
  const percentEl = overlay.querySelector<HTMLDivElement>('#dave-percent');

  let progress = 0;

  const animate = () => {
    progress = Math.min(100, progress + 1.5);
    if (percentEl) percentEl.textContent = `${Math.floor(progress)}%`;

    const filledCount = Math.floor(progress / (100 / bars.length));
    bars.forEach((bar, i) => {
      if (i < filledCount) {
        bar.style.background = '#fff';
        bar.style.boxShadow = '0 0 12px rgba(255,255,255,0.6)';
      } else {
        bar.style.background = '#333';
        bar.style.boxShadow = '0 0 6px rgba(255,255,255,0.1)';
      }
    });

    if (progress < 100) requestAnimationFrame(animate);
    else {
      overlay.style.transition = 'opacity 0.3s';
      overlay.style.opacity = '0';
      setTimeout(() => overlay.remove(), 300);
    }
  };

  requestAnimationFrame(animate);
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
   A Strapi WidgetRoot.js a Box tag="main" elemre inline
   style-ként rakja: height:261px + overflow:auto.
   CSS-sel nem lehet felülírni — csak inline style override.
══════════════════════════════════════════════════════════ */
function installWidgetHeightFix() {
  const fix = () => {
    document.querySelectorAll<HTMLElement>('section main').forEach(el => {
      if (el.style.height !== 'auto' || el.style.overflow !== 'visible') {
        el.style.setProperty('height', 'auto', 'important');
        el.style.setProperty('overflow', 'visible', 'important');
      }
    });
  };

  const run = () => {
    fix();
    const obs = new MutationObserver(fix);
    obs.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] });
  };

  if (document.body) run();
  else window.addEventListener('DOMContentLoaded', run, { once: true });
}
/* ══════════════════════════════════════════════════════════
   PRELOADER AZONNALI INDÍTÁSA
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

    app.widgets.register({
      icon: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth={2}
          strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      ),
      title: { id: 'widget.communications.title', defaultMessage: 'Communications' },
      component: async () => {
        const { default: Comp } = await import('./widgets/communications');
        return Comp;
      },
      id: 'communications-stats',
    });

    app.widgets.register({
      icon: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth={2}
          strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      ),
      title: { id: 'widget.marketing.title', defaultMessage: 'Marketing' },
      component: async () => {
        const { default: Comp } = await import('./widgets/marketing');
        return Comp;
      },
      id: 'marketing-stats',
    });

  },

  bootstrap(_app: any) {
    installThemeBridge();
    installAutoLogoSwap({ light: logoLight, dark: logoDark });
    installWidgetHeightFix();
  },
};
