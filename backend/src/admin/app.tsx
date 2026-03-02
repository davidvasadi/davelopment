// ./src/admin/app.tsx
import type { StrapiApp } from '@strapi/strapi/admin';
import './davelopment-admin.css';

import logoDark from './extensions/logo-dark.png';
import logoLight from './extensions/logo-light.png';

/* ══════════════════════════════════════════════════════════
   THEME — monokróm, semmi szín
   neutral0  = oldal háttér  (#0a0a0a dark / #fafafa light)
   neutral150 = kártya szint (#111111 dark / #ffffff light)
   primary500 = fehér/fekete — gombok, fókusz, aktív elemek
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
   THEME BRIDGE — érintetlen
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
   PRELOADER — érintetlen
══════════════════════════════════════════════════════════ */
function installPreloader() {
  const ATTR = 'data-dave-preloader';
  if (document.querySelector(`[${ATTR}]`)) return;

  const t0 = Date.now();
  const overlay = document.createElement('div');
  overlay.setAttribute(ATTR, '1');
  overlay.innerHTML = `
    <div class="dave-pre-inner">
      <div class="dave-pre-logo">d<span>®</span></div>
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
   AUTO LOGO SWAP — érintetlen
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
  bootstrap(_app: StrapiApp) {
    installThemeBridge();
    installPreloader();
    installAutoLogoSwap({ light: logoLight, dark: logoDark });
  },
};
