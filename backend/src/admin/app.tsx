// ./src/admin/app.tsx
import type { StrapiApp } from '@strapi/strapi/admin';
import './vercel-admin.css';

import logoDark from './extensions/logo-dark.png';
import logoLight from './extensions/logo-light.png';

const THEME = {
  light: {
    colors: {
      neutral0: '#ffffff',
      neutral100: '#fafafa',
      neutral200: '#ebebeb',
      neutral300: '#ededed',
      neutral400: '#ebebeb',
      neutral500: '#d9d9d9',
      neutral600: '#a3a3a3',
      neutral700: '#737373',
      neutral800: '#2f2f2f',
      neutral900: '#0a0a0a',
      primary0: 'rgba(10,10,10,0.03)',
      primary50: 'rgba(10,10,10,0.05)',
      primary100: 'rgba(10,10,10,0.07)',
      primary200: 'rgba(10,10,10,0.10)',
      primary500: '#0a0a0a',
      primary600: '#0a0a0a',
      primary700: '#0a0a0a',
      success100: '#ebebeb',
      success500: '#4fe3c2',
      warning100: '#ebebeb',
      warning500: '#f5a624',
      danger100: '#ebebeb',
      danger500: '#ff0000',
    },
  },
  dark: {
    colors: {
      neutral0: '#1f1f1f',
      neutral100: '#0a0a0a',
      neutral200: '#2f2f2f',
      neutral300: '#1f1f1f',
      neutral400: '#2f2f2f',
      neutral500: '#3a3a3a',
      neutral600: '#6b6b6b',
      neutral700: '#a3a3a3',
      neutral800: '#ebebeb',
      neutral900: '#ffffff',
      primary0: 'rgba(255,255,255,0.03)',
      primary50: 'rgba(255,255,255,0.05)',
      primary100: 'rgba(255,255,255,0.07)',
      primary200: 'rgba(255,255,255,0.10)',
      primary500: '#ffffff',
      primary600: '#ffffff',
      primary700: '#ffffff',
      success100: '#1f1f1f',
      success500: '#4fe3c2',
      warning100: '#1f1f1f',
      warning500: '#f5a624',
      danger100: '#1f1f1f',
      danger500: '#ff0000',
    },
  },
} as const;

const THEME_KEYS = ['STRAPI_THEME', 'strapi-theme', 'strapiTheme', 'theme', 'admin-theme', 'adminTheme'];

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

function getSystemMode(): 'light' | 'dark' {
  return window.matchMedia?.('(prefers-color-scheme: light)')?.matches ? 'light' : 'dark';
}

function resolveMode(hint?: string | null): 'light' | 'dark' {
  return normalizeMode(hint) ?? getStoredMode() ?? getSystemMode();
}

function installThemeBridge() {
  const html = document.documentElement;
  let currentMode: 'light' | 'dark' = resolveMode();
  let applying = false;

  function applyMode(hint?: string | null) {
    if (applying) return;
    applying = true;
    currentMode = resolveMode(hint);
    html.setAttribute('data-theme', currentMode);
    html.style.colorScheme = currentMode;
    if (document.body) {
      document.body.setAttribute('data-theme', currentMode);
      document.body.style.colorScheme = currentMode;
    }
    window.dispatchEvent(new CustomEvent('strapi-theme-change', { detail: { mode: currentMode } }));
    requestAnimationFrame(() => {
      html.setAttribute('data-theme', currentMode);
      if (document.body) document.body.setAttribute('data-theme', currentMode);
      applying = false;
    });
  }

  applyMode();

  window.matchMedia?.('(prefers-color-scheme: light)')
    ?.addEventListener?.('change', () => { if (!getStoredMode()) applyMode(); });

  window.addEventListener('storage', (e) => {
    if (e.key && THEME_KEYS.includes(e.key)) applyMode(e.newValue);
  });

  const _set = localStorage.setItem.bind(localStorage);
  localStorage.setItem = (k: string, v: string) => {
    _set(k, v);
    if (THEME_KEYS.includes(k)) applyMode(v);
  };

  const obs = new MutationObserver(() => {
    if (html.getAttribute('data-theme') !== currentMode) applyMode();
  });
  obs.observe(html, { attributes: true, attributeFilter: ['data-theme'] });

  const observeBody = () => {
    if (!document.body) return;
    if (document.body.getAttribute('data-theme') !== currentMode) applyMode();
    obs.observe(document.body, { attributes: true, attributeFilter: ['data-theme'] });
  };

  if (document.body) observeBody();
  else window.addEventListener('DOMContentLoaded', observeBody, { once: true });
}

const PRELOADER_ATTR = 'data-vercel-preloader';
const PRELOADING_ATTR = 'data-vercel-preloading';
const MIN_MS = 650;

function installVercelPreloader() {
  if (document.querySelector(`[${PRELOADER_ATTR}]`)) return;

  const html = document.documentElement;
  html.setAttribute(PRELOADING_ATTR, '1');
  const startedAt = Date.now();

  const overlay = document.createElement('div');
  overlay.setAttribute(PRELOADER_ATTR, '1');
  overlay.innerHTML = `
    <div class="vercel-loader" aria-label="Loading">
      <span></span><span></span><span></span>
    </div>
  `;

  function mount() {
    if (document.querySelector(`[${PRELOADER_ATTR}]`)) return;
    document.body?.appendChild(overlay);
  }

  function unmount() {
    const remaining = Math.max(0, MIN_MS - (Date.now() - startedAt));
    setTimeout(() => {
      html.removeAttribute(PRELOADING_ATTR);
      overlay.classList.add('is-hide');
      setTimeout(() => overlay.remove(), 200);
    }, remaining);
  }

  function isReady() {
    const hasRoot = !!(
      document.querySelector('[data-strapi-root]') ||
      document.querySelector('#strapi') ||
      document.querySelector('#root > div') ||
      document.querySelector('[class*="ApplicationLayout"]') ||
      document.querySelector('[class*="AppLayout"]')
    );
    const hasMain = !!(
      document.querySelector('[role="main"]') ||
      document.querySelector('main') ||
      document.querySelector('[data-strapi-main]') ||
      document.querySelector('[class*="MainNav"]') ||
      document.querySelector('[class*="Content"]')
    );
    return hasRoot && hasMain;
  }

  if (document.body) mount();
  else window.addEventListener('DOMContentLoaded', mount, { once: true });

  const obs = new MutationObserver(() => {
    if (isReady()) { obs.disconnect(); requestAnimationFrame(unmount); }
  });

  function startObserving() {
    if (!document.body) return;
    obs.observe(document.body, { childList: true, subtree: true });
    if (isReady()) { obs.disconnect(); unmount(); }
  }

  if (document.body) startObserving();
  else window.addEventListener('DOMContentLoaded', startObserving, { once: true });

  setTimeout(() => { obs.disconnect(); unmount(); }, 5000);
}

function installAutoLogoSwap(logos: { light: string; dark: string }) {
  const html = document.documentElement;

  function getDesiredSrc() {
    return html.getAttribute('data-theme') === 'light' ? logos.light : logos.dark;
  }

  function setImg(img: HTMLImageElement | null, src: string) {
    if (!img || img.src === src) return;
    img.setAttribute('src', src);
    img.setAttribute('srcset', src);
    img.style.objectFit = 'contain';
  }

  function findNavLogo(): HTMLImageElement | null {
    const nav = document.querySelector('[data-strapi-navigation]');
    if (!nav) return null;
    return [...nav.querySelectorAll<HTMLImageElement>('img')]
      .filter(img => {
        const r = img.getBoundingClientRect();
        return r.top < 220 && r.width > 40 && r.width < 320 && r.height > 12;
      })
      .sort((a, b) => b.getBoundingClientRect().width - a.getBoundingClientRect().width)[0] ?? null;
  }

  function findAuthLogo(): HTMLImageElement | null {
    if (document.querySelector('[data-strapi-navigation]')) return null;
    const main = document.querySelector<HTMLElement>('main,[role="main"]');
    if (!main) return null;
    return [...main.querySelectorAll<HTMLImageElement>('img')]
      .filter(img => {
        const r = img.getBoundingClientRect();
        return r.top < 260 && r.width > 60 && r.width < 420;
      })
      .sort((a, b) => b.getBoundingClientRect().width - a.getBoundingClientRect().width)[0] ?? null;
  }

  function apply() {
    const src = getDesiredSrc();
    setImg(findNavLogo(), src);
    setImg(findAuthLogo(), src);
  }

  apply();
  requestAnimationFrame(apply);
  window.addEventListener('strapi-theme-change', apply);

  const obs = new MutationObserver(apply);
  if (document.body) obs.observe(document.body, { childList: true, subtree: true });
}

export default {
  config: {
    locales: ['hu', 'en'],
    theme: THEME,
    tutorials: false,
    notifications: { releases: false },
    menu: { logo: logoLight },
    auth: { logo: logoLight },
  },

  bootstrap(_app: StrapiApp) {
    installThemeBridge();
    installVercelPreloader();
    installAutoLogoSwap({ light: logoLight, dark: logoDark });
  },
};
