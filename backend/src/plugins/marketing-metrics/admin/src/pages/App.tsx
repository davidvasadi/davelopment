import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

declare global {
  interface ImportMeta {
    env: Record<string, string | undefined>;
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface PageAudit {
  id: number;
  documentId: string;
  type: string;
  label: string;
  slug: string;
  issues: string[];
  score: number;
  editUrl: string;
}

interface GscPageData {
  url: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface TrendPoint {
  date: string;
  clicks: number;
  impressions: number;
  position: number;
}

interface TopPage {
  url: string;
  slug: string;
  clicks: number;
  impressions: number;
  position: number;
}

interface QueryRow {
  query: string;
  clicks: number;
  impressions: number;
  position: number | string;
}

interface PageSpeedData {
  slug: string;
  score: number;           // 0–100 performance score
  lcp: string;             // e.g. "2.4 s"
  lcpMs: number;           // raw ms
  cls: string;             // e.g. "0.08"
  clsVal: number;          // raw float
  inp: string;             // e.g. "180 ms"
  inpMs: number;           // raw ms
  fcp: string;             // e.g. "1.2 s"
  strategy: 'mobile' | 'desktop';
  fetchedAt: number;
}

// ─── Config ───────────────────────────────────────────────────────────────────
const SOURCES = [
  { key: 'pages', label: 'Pages', endpoint: '/api/pages?pagination%5BpageSize%5D=100&populate=seo', titleField: 'slug', single: false, uid: 'api::page.page' },
  { key: 'articles', label: 'Articles', endpoint: '/api/articles?pagination%5BpageSize%5D=100&populate=seo', titleField: 'title', single: false, uid: 'api::article.article' },
  { key: 'products', label: 'Products', endpoint: '/api/products?pagination%5BpageSize%5D=100&populate=seo', titleField: 'title', single: false, uid: 'api::product.product' },
  { key: 'blog-page', label: 'Blog page', endpoint: '/api/blog-page?populate=seo', titleField: 'heading', single: true, uid: 'api::blog-page.blog-page' },
  { key: 'global', label: 'Global', endpoint: '/api/global?populate=seo', titleField: '_fixed_Global settings', single: true, uid: 'api::global.global' },
];

// ─── Dev / prod ───────────────────────────────────────────────────────────────
const IS_DEV =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.startsWith('192.168.'));
const FORCE_PROD_MODE: boolean =
  typeof window !== 'undefined' ? localStorage.getItem('seo_force_prod') === 'true' : false;
const USE_MOCK = IS_DEV && !FORCE_PROD_MODE;

// ─── URL normalizer ───────────────────────────────────────────────────────────
const normalizeGscData = (raw: Record<string, GscPageData>): Record<string, GscPageData> => {
  const out: Record<string, GscPageData> = {};
  Object.entries(raw).forEach(([key, val]) => {
    try {
      let path: string;
      if (key.startsWith('http://') || key.startsWith('https://')) {
        path = new URL(key).pathname;
      } else if (key.includes('/')) {
        // "davelopment.hu/kapcsolat" — nincs protokoll
        path = '/' + key.split('/').slice(1).join('/');
      } else {
        path = '/' + key;
      }
      // trailing slash normalizálás: "/kapcsolat/" → "/kapcsolat" (kivéve root "/")
      if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
      out[path] = val;
    } catch { out[key] = val; }
  });
  return out;
};

// ─── Mock data ────────────────────────────────────────────────────────────────
const generateMockTrend = (days: number): TrendPoint[] => {
  const pts: TrendPoint[] = [];
  let clicks = 12, imps = 180;
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    clicks = Math.max(1, Math.round(clicks * (0.85 + Math.random() * 0.35)));
    imps = Math.max(10, Math.round(imps * (0.88 + Math.random() * 0.28)));
    pts.push({ date: d.toISOString().slice(0, 10), clicks, impressions: imps, position: parseFloat((1.5 + Math.random() * 4).toFixed(1)) });
  }
  return pts;
};

const MOCK_GSC_DATA: Record<string, GscPageData> = {
  '/': { url: '/', clicks: 42, impressions: 920, ctr: 0.046, position: 1.1 },
  '/kapcsolat': { url: '/kapcsolat', clicks: 5, impressions: 180, ctr: 0.028, position: 11.2 },
  '/adatkezeles': { url: '/adatkezeles', clicks: 2, impressions: 95, ctr: 0.021, position: 18.4 },
  '/arak': { url: '/arak', clicks: 9, impressions: 260, ctr: 0.035, position: 6.8 },
  '/szolgaltatasok': { url: '/szolgaltatasok', clicks: 14, impressions: 380, ctr: 0.037, position: 4.5 },
  '/projektek': { url: '/projektek', clicks: 8, impressions: 220, ctr: 0.036, position: 7.1 },
  '/homepage': { url: '/homepage', clicks: 38, impressions: 870, ctr: 0.044, position: 1.4 },
  '/csontkovacs-budapest': { url: '/csontkovacs-budapest', clicks: 21, impressions: 510, ctr: 0.041, position: 2.9 },
  '/en/faq': { url: '/en/faq', clicks: 18, impressions: 440, ctr: 0.041, position: 3.3 },
  '/services': { url: '/services', clicks: 11, impressions: 280, ctr: 0.039, position: 5.7 },
  '/blog': { url: '/blog', clicks: 7, impressions: 210, ctr: 0.033, position: 8.2 },
  '/contact': { url: '/contact', clicks: 4, impressions: 150, ctr: 0.027, position: 12.4 },
};

const MOCK_TOP_PAGES: TopPage[] = [
  { url: 'https://davelopment.hu/', slug: '/', clicks: 42, impressions: 920, position: 1.1 },
  { url: 'https://davelopment.hu/homepage', slug: '/homepage', clicks: 38, impressions: 870, position: 1.4 },
  { url: 'https://davelopment.hu/csontkovacs-budapest', slug: '/csontkovacs-budapest', clicks: 21, impressions: 510, position: 2.9 },
  { url: 'https://davelopment.hu/szolgaltatasok', slug: '/szolgaltatasok', clicks: 14, impressions: 380, position: 4.5 },
  { url: 'https://davelopment.hu/arak', slug: '/arak', clicks: 9, impressions: 260, position: 6.8 },
  { url: 'https://davelopment.hu/projektek', slug: '/projektek', clicks: 8, impressions: 220, position: 7.1 },
];

const MOCK_QUERIES: QueryRow[] = [
  { query: 'web fejlesztés budapest', clicks: 14, impressions: 310, position: 1.2 },
  { query: 'davelopment', clicks: 11, impressions: 88, position: 1.0 },
  { query: 'react fejlesztő', clicks: 8, impressions: 220, position: 2.4 },
  { query: 'strapi cms magyarország', clicks: 5, impressions: 140, position: 3.8 },
  { query: 'next.js ügynökség', clicks: 3, impressions: 95, position: 6.1 },
];

// ─── PSI Mock ─────────────────────────────────────────────────────────────────
// Realistic-looking CWV values per slug for dev mode
const makePsiMock = (slug: string, score: number, lcpMs: number, clsVal: number, inpMs: number, fcpMs: number): PageSpeedData => ({
  slug,
  score,
  lcp: lcpMs >= 1000 ? `${(lcpMs / 1000).toFixed(1)} s` : `${lcpMs} ms`,
  lcpMs,
  cls: clsVal.toFixed(2),
  clsVal,
  inp: inpMs >= 1000 ? `${(inpMs / 1000).toFixed(1)} s` : `${inpMs} ms`,
  inpMs,
  fcp: fcpMs >= 1000 ? `${(fcpMs / 1000).toFixed(1)} s` : `${fcpMs} ms`,
  strategy: 'mobile',
  fetchedAt: Date.now(),
});

const MOCK_PSI: Record<string, PageSpeedData> = {
  '/': makePsiMock('/', 92, 1800, 0.04, 120, 900),
  '/homepage': makePsiMock('/homepage', 88, 2200, 0.06, 180, 1100),
  '/kapcsolat': makePsiMock('/kapcsolat', 95, 1400, 0.02, 90, 700),
  '/adatkezeles': makePsiMock('/adatkezeles', 97, 1200, 0.01, 80, 600),
  '/arak': makePsiMock('/arak', 74, 3400, 0.14, 320, 1800),
  '/szolgaltatasok': makePsiMock('/szolgaltatasok', 81, 2800, 0.09, 240, 1400),
  '/projektek': makePsiMock('/projektek', 67, 4100, 0.22, 420, 2200),
  '/csontkovacs-budapest': makePsiMock('/csontkovacs-budapest', 55, 5200, 0.31, 580, 3100),
  '/en/faq': makePsiMock('/en/faq', 90, 1900, 0.05, 150, 950),
  '/services': makePsiMock('/services', 83, 2600, 0.08, 200, 1300),
  '/blog': makePsiMock('/blog', 78, 3000, 0.11, 280, 1600),
  '/contact': makePsiMock('/contact', 94, 1500, 0.03, 100, 750),
};

// ─── PSI API fetch (real) ─────────────────────────────────────────────────────
const PSI_CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
const PSI_CACHE_KEY = 'psi_cache_v1';
const PSI_DELAY_MS = 350; // sequential delay to avoid rate limits

function loadPsiCache(): Record<string, PageSpeedData> {
  try { return JSON.parse(localStorage.getItem(PSI_CACHE_KEY) || '{}'); } catch { return {}; }
}
function savePsiCache(cache: Record<string, PageSpeedData>) {
  try { localStorage.setItem(PSI_CACHE_KEY, JSON.stringify(cache)); } catch { }
}

async function fetchPsiForSlug(
  baseUrl: string,
  slug: string,
  apiKey: string,
  strategy: 'mobile' | 'desktop' = 'mobile',
): Promise<PageSpeedData | null> {
  const url = `${baseUrl.replace(/\/$/, '')}${slug || '/'}`;
  const endpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}${apiKey ? `&key=${apiKey}` : ''}`;
  try {
    const res = await fetch(endpoint);
    if (!res.ok) return null;
    const data = await res.json();
    const cats = data?.lighthouseResult?.categories;
    const aud = data?.lighthouseResult?.audits;
    if (!cats || !aud) return null;

    const score = Math.round((cats.performance?.score ?? 0) * 100);
    const lcpMs = Math.round((aud['largest-contentful-paint']?.numericValue ?? 0));
    const clsVal = parseFloat((aud['cumulative-layout-shift']?.numericValue ?? 0).toFixed(3));
    const inpMs = Math.round((aud['interaction-to-next-paint']?.numericValue ?? aud['total-blocking-time']?.numericValue ?? 0));
    const fcpMs = Math.round((aud['first-contentful-paint']?.numericValue ?? 0));

    return makePsiMock(slug, score, lcpMs, clsVal, inpMs, fcpMs);
  } catch { return null; }
}

const gscFetch = {
  status: async () => ({ connected: true, mock: true }),
  data: async () => ({ ok: true, data: MOCK_GSC_DATA }),
  trend: async (days: number) => ({ ok: true, trend: generateMockTrend(days) }),
  topPages: async () => ({ ok: true, pages: MOCK_TOP_PAGES }),
  queries: async (_slug: string) => ({ queries: MOCK_QUERIES }),
  disconnect: async () => { },
};

// ─── Theme tokens ─────────────────────────────────────────────────────────────
const DARK_TOKENS: Record<string, string> = {
  '--bg-page': '#030712', '--bg-card': '#0d1117', '--bg-card-sm': '#0d1117',
  '--bg-inner': '#161b22', '--bg-inner2': '#21262d',
  '--border': '#21262d', '--border-hover': '#30363d',
  '--text-primary': '#f0f6fc', '--text-secondary': '#c9d1d9',
  '--text-muted': '#8b949e', '--text-faint': '#484f58',
  '--text-faintest': '#30363d',
  '--accent-green': '#3dffa0', '--accent-red': '#f85149',
  '--accent-amber': '#f0c742', '--accent-indigo': '#7c6af7',
  '--accent-indigo-light': '#a78bfa',
  '--shadow': '0 0 0 1px rgba(240,246,252,0.04), 0 2px 8px rgba(0,0,0,0.5)',
  '--shadow-hover': '0 0 0 1px rgba(240,246,252,0.06), 0 8px 28px rgba(0,0,0,0.55)',
  '--chart-green': '#3dffa0', '--chart-indigo': '#7c6af7',
  '--chart-green-raw': '#3dffa0', '--chart-indigo-raw': '#7c6af7',
};

const LIGHT_TOKENS: Record<string, string> = {
  '--bg-page': '#fafafa', '--bg-card': '#ffffff', '--bg-card-sm': '#ffffff',
  '--bg-inner': '#eeeeee', '--bg-inner2': '#e6e6e6',
  '--border': 'rgba(15,23,42,0.09)', '--border-hover': 'rgba(15,23,42,0.17)',
  '--text-primary': '#0b1220', '--text-secondary': '#1a2235',
  '--text-muted': 'rgba(17,24,39,0.58)', '--text-faint': 'rgba(17,24,39,0.40)',
  '--text-faintest': 'rgba(17,24,39,0.24)',
  '--accent-green': '#1a7f37', '--accent-red': '#cf222e',
  '--accent-amber': '#9a6700', '--accent-indigo': '#6639ba',
  '--accent-indigo-light': '#7c3aed',
  '--shadow': '0 0 0 1px rgba(15,23,42,0.06), 0 1px 4px rgba(15,23,42,0.06)',
  '--shadow-hover': '0 0 0 1px rgba(15,23,42,0.08), 0 6px 20px rgba(15,23,42,0.10)',
  '--chart-green': '#1a7f37', '--chart-indigo': '#6639ba',
  '--chart-green-raw': '#1a7f37', '--chart-indigo-raw': '#6639ba',
};

function getStrapiTheme(): 'light' | 'dark' {
  const html = document.documentElement;
  const attr = html.getAttribute('data-theme');
  if (attr === 'light') return 'light';
  if (attr === 'dark') return 'dark';
  if (html.classList.contains('light-theme') || html.classList.contains('strapi-theme-light')) return 'light';
  if (html.classList.contains('dark-theme') || html.classList.contains('strapi-theme-dark')) return 'dark';
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function applyTokens(theme: 'light' | 'dark') {
  const tokens = theme === 'dark' ? DARK_TOKENS : LIGHT_TOKENS;
  Object.entries(tokens).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
}

// ─── Static CSS ───────────────────────────────────────────────────────────────
const staticStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500&display=swap');

  .seo-app * { box-sizing: border-box; }
  .seo-app { font-feature-settings: "cv02","cv03","cv04","cv11"; }
  .seo-app button:focus-visible { outline: 2px solid var(--accent-green); outline-offset: 2px; }

  /* ── Typography reset: semibold as default weight ── */
  .seo-app h1,
  .seo-app h2,
  .seo-app h3 { font-weight: 600; }

  /* ── Tooltip ── */
  .info-tip { position: relative; display: inline-flex; align-items: center; cursor: help; margin-left: 3px; }
  .info-tip .tip-box {
    display: none; position: absolute; bottom: calc(100% + 8px); left: 50%;
    transform: translateX(-50%);
    background: var(--bg-card); color: var(--text-secondary);
    font-size: 11px; line-height: 1.5; padding: 8px 11px;
    border-radius: 10px; border: 1px solid var(--border-hover);
    box-shadow: var(--shadow-hover); z-index: 200; pointer-events: none;
    width: 220px; text-align: center; white-space: normal;
    backdrop-filter: blur(10px);
  }
  .info-tip:hover .tip-box { display: block; }

  /* ── Mock badge ── */
  @keyframes pulse-mock { 0%, 100% { opacity: 1; } 50% { opacity: 0.55; } }
  .mock-badge { animation: pulse-mock 2.6s ease-in-out infinite; }

  /* ── Chart animations ── */
  @keyframes chart-draw {
    from { stroke-dashoffset: var(--dash-total); }
    to   { stroke-dashoffset: 0; }
  }
  .chart-line-animated {
    stroke-dasharray: var(--dash-total);
    stroke-dashoffset: var(--dash-total);
    animation: chart-draw 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  }
  @keyframes fade-area { from { opacity: 0; } to { opacity: 1; } }
  .chart-area-animated { opacity: 0; animation: fade-area 0.6s ease 0.4s forwards; }

  /* ── Stat cards ── */
  .stat-card {
    background: var(--bg-card);
    border: 0.5px solid var(--border);
    border-radius: 12px;
    padding: 16px 18px;
    box-shadow: var(--shadow);
    transition: transform 140ms ease, box-shadow 140ms ease,
                border-color 140ms ease, background 140ms ease;
    cursor: default;
  }
  .stat-card:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-hover);
    border-color: var(--border-hover);
  }

  /* ── Tab buttons ── */
  .tab-btn {
    padding: 7px 16px; border-radius: 10px; font-size: 13px;
    font-weight: 500; cursor: pointer; border: none;
    background: transparent; color: var(--text-muted);
    transition: color 160ms ease; position: relative; z-index: 1;
  }
  .tab-btn.active { color: var(--text-primary); font-weight: 600; }

  /* ── Layout toggle ── */
  .layout-btn {
    display: flex; align-items: center; justify-content: center;
    width: 32px; height: 32px; border-radius: 9px; cursor: pointer;
    border: 0.5px solid var(--border); background: transparent;
    color: var(--text-muted);
    transition: background 140ms ease, border-color 140ms ease,
                color 140ms ease, transform 140ms ease;
    flex-shrink: 0;
  }
  .layout-btn:hover {
    border-color: var(--border-hover);
    background: var(--bg-inner);
    color: var(--text-primary);
    transform: translateY(-0.5px);
  }
  .layout-btn.active {
    border-color: var(--border-hover);
    background: var(--bg-inner2);
    color: var(--text-primary);
  }

  /* ── Score bar ── */
  .score-bar-track {
    flex: 1; height: 3px; background: var(--bg-inner2);
    border-radius: 999px; overflow: hidden;
  }
  .score-bar-fill {
    height: 100%; border-radius: 999px;
    transition: width 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  /* ── Rich list rows ── */
  .audit-row {
    background: var(--bg-card);
    border: 0.5px solid var(--border);
    border-radius: 12px;
    padding: 14px 18px;
    display: flex; align-items: center; gap: 14px; flex-wrap: wrap;
    transition: border-color 140ms ease, box-shadow 140ms ease, background 140ms ease;
    cursor: default;
    box-shadow: var(--shadow);
  }
  .audit-row:hover {
    border-color: var(--border-hover);
    background: var(--bg-card);
    box-shadow: var(--shadow-hover);
  }

  /* ── Filter chips — redesigned for light mode visibility ── */
  .filter-chip {
    padding: 5px 12px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    border: 0.5px solid var(--border);
    background: var(--bg-card);
    color: var(--text-muted);
    transition: all 120ms ease;
    box-shadow: var(--shadow);
  }
  .filter-chip:hover {
    border-color: var(--border-hover);
    color: var(--text-primary);
    background: var(--bg-card);
    box-shadow: var(--shadow-hover);
  }
  .filter-chip.active {
    background: var(--text-primary);
    border-color: var(--text-primary);
    color: var(--bg-page);
    box-shadow: none;
  }

  /* ── Audit grid ── */
  .audit-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 12px;
  }

  /* ── Audit grid card ── */
  .audit-grid-card {
    background: var(--bg-card);
    border: 0.5px solid var(--border);
    border-radius: 14px;
    padding: 18px 20px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    box-shadow: var(--shadow);
    cursor: default;
    position: relative;
    overflow: hidden;
  }

  /* ── Card metric bar (animated) ── */
  .metric-bar-track {
    flex: 1; height: 4px; border-radius: 999px;
    background: var(--bg-inner2); overflow: hidden;
  }
  .metric-bar-fill {
    height: 100%; border-radius: 999px;
  }

  /* Score bar in table rows */
  .table-score-bar-track {
    width: 72px; height: 3px; border-radius: 999px;
    background: var(--bg-inner2); overflow: hidden; display: inline-block;
  }
  .table-score-bar-fill {
    height: 100%; border-radius: 999px;
    transition: width 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes cwv-pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const scoreColor = (s: number) =>
  s >= 80 ? 'var(--accent-green)' : s >= 50 ? 'var(--accent-amber)' : 'var(--accent-red)';
const posColor = (p: number) =>
  p <= 3 ? 'var(--accent-green)' : p <= 10 ? 'var(--accent-amber)' : 'var(--text-muted)';

// ─── CWV thresholds ───────────────────────────────────────────────────────────
// Good / Needs improvement / Poor per Google spec
const cwvColor = {
  lcp: (ms: number) => ms <= 2500 ? 'var(--accent-green)' : ms <= 4000 ? 'var(--accent-amber)' : 'var(--accent-red)',
  cls: (val: number) => val <= 0.1 ? 'var(--accent-green)' : val <= 0.25 ? 'var(--accent-amber)' : 'var(--accent-red)',
  inp: (ms: number) => ms <= 200 ? 'var(--accent-green)' : ms <= 500 ? 'var(--accent-amber)' : 'var(--accent-red)',
  score: (n: number) => n >= 90 ? 'var(--accent-green)' : n >= 50 ? 'var(--accent-amber)' : 'var(--accent-red)',
};
const cwvBg = (color: string) =>
  color === 'var(--accent-green)' ? 'rgba(61,255,160,0.08)'
    : color === 'var(--accent-amber)' ? 'rgba(240,199,66,0.08)'
      : 'rgba(248,81,73,0.08)';
const cwvBorder = (color: string) =>
  color === 'var(--accent-green)' ? 'rgba(61,255,160,0.18)'
    : color === 'var(--accent-amber)' ? 'rgba(240,199,66,0.18)'
      : 'rgba(248,81,73,0.18)';
const fmt = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
const pct = (a: number, b: number) => b === 0 ? null : Math.round(((a - b) / b) * 100);
const getEditUrl = (uid: string, single: boolean, documentId: string) =>
  single ? `/admin/content-manager/single-types/${uid}`
    : `/admin/content-manager/collection-types/${uid}/${documentId}`;
const toSlugKey = (slug: string): string => {
  if (!slug || slug === '-') return '';
  return slug.startsWith('/') ? slug : `/${slug}`;
};

const auditItem = (item: any, titleField: string, typeLabel: string, uid: string, single: boolean) => {
  const issues: string[] = [];
  if (!item.seo?.metaTitle) issues.push('Meta title');
  if (!item.seo?.metaDescription) issues.push('Meta description');
  if (!item.seo?.keywords) issues.push('Keywords');
  const isSingle = titleField.startsWith('_fixed_');
  if (!isSingle && !item.slug) issues.push('Slug');
  const total = isSingle ? 3 : 4;
  const score = Math.max(0, Math.round(((total - issues.length) / total) * 100));
  const label = isSingle ? titleField.replace('_fixed_', '') : (item[titleField] || item.slug || `#${item.id}`);
  return { id: item.id, documentId: item.documentId, type: typeLabel, label, slug: item.slug || (single ? '' : '/'), issues, score, editUrl: getEditUrl(uid, single, item.documentId) };
};

// ─── CWV Badges ──────────────────────────────────────────────────────────────
const CwvBadge = ({ label, value, color }: { label: string; value: string; color: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', minWidth: '54px' }}>
    <span style={{
      fontSize: '11.5px', fontWeight: 600, color,
      background: cwvBg(color), border: `1px solid ${cwvBorder(color)}`,
      padding: '2px 7px', borderRadius: '6px',
      fontVariantNumeric: 'tabular-nums', fontFamily: "'Geist Mono', monospace",
      letterSpacing: '-0.2px', whiteSpace: 'nowrap',
    }}>{value}</span>
    <span style={{ fontSize: '9.5px', color: 'var(--text-faint)', letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 500 }}>{label}</span>
  </div>
);

const CwvRow = ({ psi, loading }: { psi: PageSpeedData | null; loading: boolean }) => {
  if (loading)
    return (
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {['LCP', 'CLS', 'INP'].map(l => (
          <div key={l} style={{ minWidth: '54px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
            <div style={{ width: '44px', height: '20px', borderRadius: '6px', background: 'var(--bg-inner2)', animation: 'cwv-pulse 1.4s ease infinite' }} />
            <span style={{ fontSize: '9.5px', color: 'var(--text-faintest)', textTransform: 'uppercase' }}>{l}</span>
          </div>
        ))}
      </div>
    );
  if (!psi)
    return <span style={{ fontSize: '11px', color: 'var(--text-faintest)' }}>— PSI adat nincs</span>;

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <CwvBadge label="LCP" value={psi.lcp} color={cwvColor.lcp(psi.lcpMs)} />
      <CwvBadge label="CLS" value={psi.cls} color={cwvColor.cls(psi.clsVal)} />
      <CwvBadge label="INP" value={psi.inp} color={cwvColor.inp(psi.inpMs)} />
    </div>
  );
};

// ─── Small components ─────────────────────────────────────────────────────────
const InfoTip = ({ text }: { text: string }) => (
  <span className="info-tip">
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--text-faint)" strokeWidth="2.5">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
    <span className="tip-box">{text}</span>
  </span>
);

const ScoreRing = ({ score, size = 44 }: { score: number; size?: number }) => {
  const r = (size - 5) / 2, circ = 2 * Math.PI * r, dash = (score / 100) * circ, color = scoreColor(score);
  return (
    <svg width={size} height={size} style={{ flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--bg-inner2)" strokeWidth="3.5" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="3.5"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dasharray 0.5s ease' }} />
      <text x={size / 2} y={size / 2 + 4} textAnchor="middle" fontSize="10" fontWeight="600" fill={color}>{score}</text>
    </svg>
  );
};

const ChangeBadge = ({ value, invert = false }: { value: number | null; invert?: boolean }) => {
  if (value === null) return null;
  const positive = invert ? value < 0 : value > 0;
  const color = positive ? 'var(--accent-green)' : value === 0 ? 'var(--text-muted)' : 'var(--accent-red)';
  const bg = positive ? 'rgba(61,255,160,0.08)' : value === 0 ? 'transparent' : 'rgba(248,81,73,0.08)';
  return (
    <span style={{ fontSize: '11px', fontWeight: 500, color, background: bg, padding: '2px 7px', borderRadius: '20px', letterSpacing: '-0.2px' }}>
      {value > 0 ? '+' : ''}{value}%
    </span>
  );
};

const ScoreBar = ({ score }: { score: number }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <div className="score-bar-track">
      <div className="score-bar-fill" style={{ width: `${score}%`, background: scoreColor(score) }} />
    </div>
    <span style={{ fontSize: '11px', fontWeight: 500, color: scoreColor(score), minWidth: '30px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
      {score}%
    </span>
  </div>
);

const IssuePills = ({ issues }: { issues: string[] }) => {
  if (issues.length === 0)
    return (
      <span style={{ fontSize: '11px', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '4px' }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
        Rendben
      </span>
    );
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
      {issues.map((issue, i) => (
        <span key={i} style={{ fontSize: '10px', color: 'var(--accent-red)', background: 'rgba(248,81,73,0.08)', border: '1px solid rgba(248,81,73,0.16)', padding: '2px 6px', borderRadius: '4px' }}>
          {issue}
        </span>
      ))}
    </div>
  );
};

// ─── Tab nav ─────────────────────────────────────────────────────────────────
const TabNav = ({ activeTab, setActiveTab }: { activeTab: 'audit' | 'analytics'; setActiveTab: (k: 'audit' | 'analytics') => void }) => (
  <div style={{ display: 'flex', gap: '2px', marginBottom: '20px', background: 'var(--bg-inner)', padding: '3px', borderRadius: '12px', width: 'fit-content', border: '0px solid var(--border)', position: 'relative', boxShadow: 'var(--shadow)' }}>
    {([{ k: 'audit' as const, l: 'SEO Audit' }, { k: 'analytics' as const, l: 'Analytics' }]).map(t => {
      const isActive = activeTab === t.k;
      return (
        <button key={t.k} onClick={() => setActiveTab(t.k)} className={`tab-btn${isActive ? ' active' : ''}`} style={{ position: 'relative' }}>
          {isActive && (
            <motion.div layoutId="seo-tab-pill"
              transition={{ type: 'spring', stiffness: 520, damping: 40 }}
              style={{ position: 'absolute', inset: 0, borderRadius: '10px', background: 'var(--bg-card)', border: '0.5px solid var(--border-hover)', boxShadow: 'var(--shadow)', zIndex: 0 }}
            />
          )}
          <span style={{ position: 'relative', zIndex: 1 }}>{t.l}</span>
        </button>
      );
    })}
  </div>
);

// ─── LAYOUT A: Rich list ─────────────────────────────────────────────────────
// NOTE: left accent bars removed per design feedback
const AuditRich = ({ items, gscData, gscConnected, onQueryClick, psiData, psiLoading, psiEnabled }: {
  items: PageAudit[];
  gscData: Record<string, GscPageData>;
  gscConnected: boolean;
  onQueryClick: (slug: string) => void;
  psiData: Record<string, PageSpeedData>;
  psiLoading: Set<string>;
  psiEnabled: boolean;
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
    {items.map((item, idx) => {
      const slugKey = toSlugKey(item.slug);
      const gsc = gscData[slugKey] || null;

      return (
        <motion.div key={item.id}
          className="audit-row"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, delay: idx * 0.03, ease: [0.25, 0.46, 0.45, 0.94] }}
          whileHover={{ y: -1, boxShadow: 'var(--shadow-hover)' }}
          whileTap={{ scale: 0.998 }}
          style={{ borderRadius: '12px' }}
        >
          <ScoreRing score={item.score} size={46} />

          {/* Title + slug */}
          <div style={{ flex: '2 1 160px', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '10px', color: 'var(--text-secondary)', background: 'var(--bg-inner2)', border: '1px solid var(--border)', padding: '1px 6px', borderRadius: '5px', fontFamily: "'Geist Mono', monospace", flexShrink: 0 }}>
                {item.type}
              </span>
              {item.score === 100 && (
                <span style={{ fontSize: '10px', color: 'var(--accent-green)', background: 'rgba(61,255,160,0.06)', border: '1px solid rgba(61,255,160,0.15)', padding: '1px 7px', borderRadius: '20px', flexShrink: 0 }}>
                  ✓ Teljes
                </span>
              )}
            </div>
            <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {item.label}
            </div>
            <div style={{ fontSize: '10.5px', color: 'var(--text-faint)', fontFamily: "'Geist Mono', monospace", marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {slugKey}
            </div>
          </div>

          {/* Score bar */}
          <div style={{ flex: '2 1 130px', minWidth: '120px' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-faint)', marginBottom: '6px', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              SEO Score
            </div>
            <ScoreBar score={item.score} />
          </div>

          {/* Issues */}
          <div style={{ flex: '2 1 130px', minWidth: '120px' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-faint)', marginBottom: '6px', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              {item.issues.length === 0 ? 'Státusz' : `${item.issues.length} Hiányzik`}
            </div>
            <IssuePills issues={item.issues} />
          </div>

          {/* CWV */}
          {psiEnabled && (
            <div style={{ flex: '0 0 auto' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-faint)', marginBottom: '6px', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Core Web Vitals
              </div>
              <CwvRow psi={psiData[slugKey] || null} loading={psiLoading.has(slugKey)} />
            </div>
          )}

          {/* GSC stats */}
          {gscConnected && (
            <div style={{ marginLeft: 'auto' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-faint)', marginBottom: '6px', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Search Console
              </div>
              {!gsc ? (
                <div style={{ display: 'flex', gap: '16px' }}>
                  {['klikk', 'megj.', 'pozíció'].map(l => (
                    <div key={l} style={{ textAlign: 'right', minWidth: '36px' }}>
                      <div style={{ fontSize: '13px', color: 'var(--text-faintest)', fontFamily: "'Geist Mono', monospace" }}>—</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-faintest)' }}>{l}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--chart-green)', fontVariantNumeric: 'tabular-nums' }}>{fmt(gsc.clicks)}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-faint)' }}>klikk</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>{fmt(gsc.impressions)}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-faint)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                      megj.<InfoTip text="Hányszor jelent meg ez az oldal a Google találatokban." />
                    </div>
                  </div>
                  <button onClick={() => onQueryClick(slugKey)} style={{ textAlign: 'right', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: posColor(gsc.position), fontVariantNumeric: 'tabular-nums', textDecoration: 'underline dotted', textUnderlineOffset: '2px' }}>#{gsc.position}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-faint)' }}>pozíció</div>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Edit */}
          <button onClick={() => (window.location.href = item.editUrl)}
            style={{ padding: '5px 12px', borderRadius: '8px', fontSize: '11.5px', fontWeight: 500, background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border)', cursor: 'pointer', flexShrink: 0, transition: 'all 120ms', whiteSpace: 'nowrap' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'var(--bg-inner2)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}>
            Szerkesztés →
          </button>
        </motion.div>
      );
    })}
  </div>
);

// ─── LAYOUT B: Card Grid ─────────────────────────────────────────────────────
// Replaces the old compact table — Framer Motion: staggered entry + bar grow

// Animated metric bar inside a card
const AnimatedBar = ({ value, max, color, delay = 0 }: { value: number; max: number; color: string; delay?: number }) => {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(max > 0 ? (value / max) * 100 : 0), delay + 80);
    return () => clearTimeout(t);
  }, [value, max, delay]);
  return (
    <div className="metric-bar-track">
      <div className="metric-bar-fill" style={{ width: `${width}%`, background: color, transition: `width 0.7s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}ms` }} />
    </div>
  );
};

const AuditGrid = ({ items, gscData, gscConnected, onQueryClick, psiData, psiLoading, psiEnabled }: {
  items: PageAudit[];
  gscData: Record<string, GscPageData>;
  gscConnected: boolean;
  onQueryClick: (slug: string) => void;
  psiData: Record<string, PageSpeedData>;
  psiLoading: Set<string>;
  psiEnabled: boolean;
}) => {
  // Max values for bar scaling
  const maxClicks = Math.max(...Object.values(gscData).map(g => g.clicks), 1);
  const maxImps = Math.max(...Object.values(gscData).map(g => g.impressions), 1);

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.045 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 14, scale: 0.98 },
    show: {
      opacity: 1, y: 0, scale: 1,
      transition: { type: 'spring' as const, stiffness: 400, damping: 32 }
    },
  };

  return (
    <motion.div
      className="audit-grid"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {items.map((item, idx) => {
        const slugKey = toSlugKey(item.slug);
        const gsc = gscData[slugKey] || null;
        const sColor = scoreColor(item.score);
        const barDelay = idx * 45 + 200;

        return (
          <motion.div
            key={item.id}
            className="audit-grid-card"
            variants={cardVariants}
            whileHover={{ y: -2, boxShadow: 'var(--shadow-hover)', borderColor: 'var(--border-hover)', transition: { duration: 0.14 } }}
            whileTap={{ scale: 0.995 }}
          >
            {/* Card header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '5px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-faint)', background: 'var(--bg-inner2)', border: '1px solid var(--border)', padding: '1px 6px', borderRadius: '4px', fontFamily: "'Geist Mono', monospace", flexShrink: 0 }}>
                    {item.type}
                  </span>
                  {item.score === 100 && (
                    <span style={{ fontSize: '10px', color: 'var(--accent-green)', background: 'rgba(61,255,160,0.06)', border: '1px solid rgba(61,255,160,0.15)', padding: '1px 7px', borderRadius: '20px', flexShrink: 0 }}>
                      ✓
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.label}
                </div>
                <div style={{ fontSize: '10.5px', color: 'var(--text-faint)', fontFamily: "'Geist Mono', monospace", marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {slugKey || '/'}
                </div>
              </div>
              <ScoreRing score={item.score} size={44} />
            </div>

            {/* SEO score bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-faint)', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>SEO Score</span>
                <span style={{ fontSize: '11px', fontWeight: 600, color: sColor, fontVariantNumeric: 'tabular-nums' }}>{item.score}%</span>
              </div>
              <div className="metric-bar-track">
                <motion.div
                  className="metric-bar-fill"
                  style={{ background: sColor }}
                  initial={{ width: '0%' }}
                  animate={{ width: `${item.score}%` }}
                  transition={{ duration: 0.7, delay: barDelay / 1000, ease: [0.25, 0.46, 0.45, 0.94] }}
                />
              </div>
            </div>

            {/* Issues */}
            <div>
              <div style={{ fontSize: '10px', color: 'var(--text-faint)', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '5px' }}>
                {item.issues.length === 0 ? 'Státusz' : `${item.issues.length} hiányzó mező`}
              </div>
              <IssuePills issues={item.issues} />
            </div>

            {/* GSC metrics with animated bars */}
            {gscConnected && (
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '9px' }}>
                {!gsc ? (
                  <div style={{ fontSize: '11px', color: 'var(--text-faintest)', fontFamily: "'Geist Mono', monospace" }}>
                    — nincs GSC adat
                  </div>
                ) : (
                  <>
                    {/* Clicks */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '10px', color: 'var(--text-faint)' }}>Klikk</span>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--chart-green)', fontVariantNumeric: 'tabular-nums' }}>{fmt(gsc.clicks)}</span>
                      </div>
                      <AnimatedBar value={gsc.clicks} max={maxClicks} color="var(--chart-green)" delay={barDelay} />
                    </div>

                    {/* Impressions */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '10px', color: 'var(--text-faint)', display: 'flex', alignItems: 'center' }}>
                          Megjelenés<InfoTip text="Hányszor jelent meg az oldal a Google találatokban." />
                        </span>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>{fmt(gsc.impressions)}</span>
                      </div>
                      <AnimatedBar value={gsc.impressions} max={maxImps} color="var(--chart-indigo)" delay={barDelay + 80} />
                    </div>

                    {/* Position */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '10px', color: 'var(--text-faint)' }}>Pozíció</span>
                      <button onClick={() => onQueryClick(slugKey)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '12px', fontWeight: 600, color: posColor(gsc.position), fontVariantNumeric: 'tabular-nums', textDecoration: 'underline dotted', textUnderlineOffset: '2px' }}>
                        #{gsc.position}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* CWV section */}
            {psiEnabled && (
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-faint)', marginBottom: '8px', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>Core Web Vitals</span>
                  {psiData[slugKey] && (
                    <span style={{ fontSize: '10px', color: cwvColor.score(psiData[slugKey].score), fontFamily: "'Geist Mono', monospace", fontWeight: 600 }}>
                      {psiData[slugKey].score}/100
                    </span>
                  )}
                </div>
                <CwvRow psi={psiData[slugKey] || null} loading={psiLoading.has(slugKey)} />
              </div>
            )}

            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-2px' }}>
              <button onClick={() => (window.location.href = item.editUrl)}
                style={{ padding: '5px 12px', borderRadius: '8px', fontSize: '11.5px', fontWeight: 500, background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border)', cursor: 'pointer', transition: 'all 120ms', whiteSpace: 'nowrap' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'var(--bg-inner2)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}>
                Szerkesztés →
              </button>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

// ─── Vercel-grade Dual Chart ──────────────────────────────────────────────────
const VercelChart = ({ trend, metric, isDark, height = 160 }: { trend: TrendPoint[]; metric: 'clicks' | 'impressions' | 'dual'; isDark: boolean; height?: number }) => {
  const [tooltip, setTooltip] = useState<{ idx: number; x: number } | null>(null);
  const [mounted, setMounted] = useState(false);
  const animKey = useRef(0);

  useEffect(() => {
    animKey.current++;
    setMounted(false);
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, [trend, metric]);

  if (!trend.length) return <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-faint)', fontSize: '12px' }}>Nincs adat</div>;

  const W = 700, H = height, PAD = { top: 16, right: 16, bottom: 32, left: 48 };
  const iW = W - PAD.left - PAD.right, iH = H - PAD.top - PAD.bottom;
  const clickVals = trend.map(t => t.clicks), impVals = trend.map(t => t.impressions);

  const scale = (vals: number[]) => { const mx = Math.max(...vals, 1), mn = 0; return { mx, mn, r: mx - mn || 1 }; };
  const cScale = scale(clickVals), iScale = scale(impVals);
  const px = (i: number) => PAD.left + (i / Math.max(trend.length - 1, 1)) * iW;
  const pyFor = (v: number, s: ReturnType<typeof scale>) => PAD.top + iH - ((v - s.mn) / s.r) * iH;
  const buildPath = (vals: number[], s: ReturnType<typeof scale>) => vals.map((v, i) => `${i === 0 ? 'M' : 'L'}${px(i).toFixed(2)},${pyFor(v, s).toFixed(2)}`).join(' ');
  const buildArea = (vals: number[], s: ReturnType<typeof scale>) => { const l = buildPath(vals, s); return `${l} L${px(vals.length - 1).toFixed(2)},${(PAD.top + iH).toFixed(2)} L${PAD.left.toFixed(2)},${(PAD.top + iH).toFixed(2)} Z`; };
  const approxLen = (vals: number[], s: ReturnType<typeof scale>) => { let len = 0; for (let i = 1; i < vals.length; i++) { const dx = px(i) - px(i - 1), dy = pyFor(vals[i], s) - pyFor(vals[i - 1], s); len += Math.sqrt(dx * dx + dy * dy); } return Math.round(len); };

  const showClicks = metric === 'clicks' || metric === 'dual';
  const showImps = metric === 'impressions' || metric === 'dual';
  const greenRaw = isDark ? '#3dffa0' : '#1a7f37';
  const indigoRaw = isDark ? '#7c6af7' : '#6639ba';
  const cLen = approxLen(clickVals, cScale), iLen = approxLen(impVals, iScale);
  const primaryScale = showClicks ? cScale : iScale;
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(f => primaryScale.mn + f * primaryScale.r);
  const xIdxs = trend.length <= 6 ? trend.map((_, i) => i) : [0, Math.floor(trend.length * 0.25), Math.floor(trend.length * 0.5), Math.floor(trend.length * 0.75), trend.length - 1];

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) * (W / rect.width);
    let nearest = 0, nearestDist = Infinity;
    trend.forEach((_, i) => { const d = Math.abs(px(i) - mouseX); if (d < nearestDist) { nearestDist = d; nearest = i; } });
    setTooltip({ idx: nearest, x: px(nearest) });
  };

  const tt = tooltip !== null ? trend[tooltip.idx] : null;
  const ttPct = (tooltip?.idx ?? 0) / Math.max(trend.length - 1, 1);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <svg key={animKey.current} width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', overflow: 'visible' }} onMouseMove={handleMouseMove} onMouseLeave={() => setTooltip(null)}>
        <defs>
          {showClicks && <linearGradient id="grad-c" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={greenRaw} stopOpacity={isDark ? 0.18 : 0.12} /><stop offset="100%" stopColor={greenRaw} stopOpacity={0} /></linearGradient>}
          {showImps && <linearGradient id="grad-i" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={indigoRaw} stopOpacity={isDark ? 0.15 : 0.1} /><stop offset="100%" stopColor={indigoRaw} stopOpacity={0} /></linearGradient>}
          <clipPath id="chart-clip"><rect x={PAD.left} y={PAD.top} width={iW} height={iH + 4} /></clipPath>
        </defs>
        {yTicks.map((tick, i) => (
          <g key={i}>
            <line x1={PAD.left} y1={pyFor(tick, primaryScale)} x2={PAD.left + iW} y2={pyFor(tick, primaryScale)} stroke="var(--border)" strokeWidth="1" strokeDasharray={i === 0 ? 'none' : '3 4'} opacity={i === 0 ? 1 : 0.7} />
            <text x={PAD.left - 8} y={pyFor(tick, primaryScale) + 4} textAnchor="end" fontSize="9" fill="var(--text-faint)" fontFamily="'Geist Mono', monospace">
              {tick >= 1000 ? `${(tick / 1000).toFixed(0)}k` : Math.round(tick)}
            </text>
          </g>
        ))}
        {xIdxs.map(i => (
          <text key={i} x={px(i)} y={H - 8} textAnchor="middle" fontSize="9" fill="var(--text-faint)" fontFamily="'Geist Mono', monospace">
            {trend[i].date.slice(5)}
          </text>
        ))}
        {showImps && mounted && (<><path d={buildArea(impVals, iScale)} fill="url(#grad-i)" clipPath="url(#chart-clip)" className="chart-area-animated" /><path d={buildPath(impVals, iScale)} fill="none" stroke="var(--chart-indigo)" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" clipPath="url(#chart-clip)" className="chart-line-animated" style={{ '--dash-total': iLen } as React.CSSProperties} /></>)}
        {showClicks && mounted && (<><path d={buildArea(clickVals, cScale)} fill="url(#grad-c)" clipPath="url(#chart-clip)" className="chart-area-animated" /><path d={buildPath(clickVals, cScale)} fill="none" stroke="var(--chart-green)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" clipPath="url(#chart-clip)" className="chart-line-animated" style={{ '--dash-total': cLen } as React.CSSProperties} /></>)}
        {tooltip && (<><line x1={tooltip.x} y1={PAD.top} x2={tooltip.x} y2={PAD.top + iH} stroke="var(--border-hover)" strokeWidth="1" />{showClicks && <circle cx={tooltip.x} cy={pyFor(trend[tooltip.idx].clicks, cScale)} r="4" fill="var(--chart-green)" stroke="var(--bg-card)" strokeWidth="2.5" />}{showImps && <circle cx={tooltip.x} cy={pyFor(trend[tooltip.idx].impressions, iScale)} r="4" fill="var(--chart-indigo)" stroke="var(--bg-card)" strokeWidth="2.5" />}</>)}
      </svg>
      {tt && (
        <div style={{ position: 'absolute', top: '10px', left: `${Math.min(Math.max(ttPct * 100, 10), 78)}%`, transform: 'translateX(-50%)', background: 'var(--bg-inner2)', border: '1px solid var(--border-hover)', borderRadius: '12px', padding: '8px 12px', fontSize: '12px', color: 'var(--text-secondary)', pointerEvents: 'none', whiteSpace: 'nowrap', boxShadow: 'var(--shadow-hover)', zIndex: 10, backdropFilter: 'blur(8px)' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '5px', fontFamily: "'Geist Mono', monospace" }}>{tt.date}</div>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            {showClicks && <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><div style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--chart-green)' }} /><span style={{ color: 'var(--chart-green)', fontWeight: 600, fontSize: '13px' }}>{fmt(tt.clicks)}</span><span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>klikk</span></div>}
            {showImps && <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><div style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--chart-indigo)' }} /><span style={{ color: 'var(--chart-indigo)', fontWeight: 600, fontSize: '13px' }}>{fmt(tt.impressions)}</span><span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>megj.</span></div>}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Query Drawer ─────────────────────────────────────────────────────────────
const QueryDrawer = ({ slug, onClose, isMock }: { slug: string; onClose: () => void; isMock: boolean }) => {
  const [queries, setQueries] = useState<QueryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKeyDown);
    const t = setTimeout(() => closeBtnRef.current?.focus(), 40);
    return () => { window.removeEventListener('keydown', onKeyDown); clearTimeout(t); };
  }, [onClose]);

  useEffect(() => {
    let alive = true;
    const run = async () => {
      setLoading(true);
      if (isMock) {
        await new Promise(r => setTimeout(r, 220));
        if (!alive) return;
        setQueries(MOCK_QUERIES); setLoading(false); return;
      }
      try {
        const res = await fetch('/api/marketing-metrics/gsc-queries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug }) });
        const d = await res.json();
        if (!alive) return;
        setQueries(Array.isArray(d?.queries) ? d.queries : []);
      } catch { if (!alive) return; setQueries([]); }
      finally { if (!alive) return; setLoading(false); }
    };
    run();
    return () => { alive = false; };
  }, [slug, isMock]);

  return (
    <AnimatePresence>
      <motion.div key="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
        style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)' }}
        onClick={onClose}>
        <motion.div key="panel" initial={{ x: 28, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 28, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 520, damping: 44 }}
          style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '360px', background: 'var(--bg-card)', borderLeft: '1px solid var(--border)', padding: '24px', overflowY: 'auto', boxShadow: '-18px 0 55px rgba(0,0,0,0.16)' }}
          onClick={e => e.stopPropagation()}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>Keresési kifejezések</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '3px', fontFamily: "'Geist Mono', monospace" }}>{slug}</div>
            </div>
            <button ref={closeBtnRef} onClick={onClose} style={{ background: 'var(--bg-inner)', border: '1px solid var(--border)', color: 'var(--text-muted)', cursor: 'pointer', borderRadius: '10px', width: '34px', height: '34px', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 120ms' }}>×</button>
          </div>

          {loading ? (
            <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Betöltés...</div>
          ) : queries.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', padding: '32px 0' }}>Nincs adat.</div>
          ) : queries.map((q, i) => {
            const pos = typeof q.position === 'number' ? q.position : Number(q.position);
            return (
              <div key={i} style={{ padding: '12px 14px', borderRadius: '12px', background: 'var(--bg-inner)', marginBottom: '7px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '10px', lineHeight: 1.4 }}>{q.query}</div>
                <div style={{ display: 'flex', gap: '20px' }}>
                  {[
                    { l: 'Klikk', v: q.clicks, c: 'var(--chart-green)' },
                    { l: 'Megjelenés', v: q.impressions, c: 'var(--text-secondary)' },
                    { l: 'Pozíció', v: Number.isFinite(pos) ? `#${pos}` : '—', c: Number.isFinite(pos) ? posColor(pos) : 'var(--text-faint)' },
                  ].map(x => (
                    <div key={x.l}>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: x.c, letterSpacing: '-0.3px' }}>{x.v}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-faint)', marginTop: '1px' }}>{x.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ─── Main App ─────────────────────────────────────────────────────────────────
export const App = () => {
  const [items, setItems] = useState<PageAudit[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [activeTab, setActiveTab] = useState<'audit' | 'analytics'>('audit');
  const [gscData, setGscData] = useState<Record<string, GscPageData>>({});
  const [trend, setTrend] = useState<TrendPoint[]>([]);
  const [topPages, setTopPages] = useState<TopPage[]>([]);
  const [trendMetric, setTrendMetric] = useState<'clicks' | 'impressions' | 'dual'>('dual');
  const [gscConnected, setGscConnected] = useState(false);
  const [gscLoading, setGscLoading] = useState(false);
  const [drawerSlug, setDrawerSlug] = useState<string | null>(null);
  const [trendDays, setTrendDays] = useState(28);
  const [isDark, setIsDark] = useState(true);
  const [isMock, setIsMock] = useState(USE_MOCK);
  const [auditLayout, setAuditLayout] = useState<'rich' | 'grid'>('rich');

  // ── PSI state ─────────────────────────────────────────────────────────────
  const [psiData, setPsiData] = useState<Record<string, PageSpeedData>>({});
  const [psiLoading, setPsiLoading] = useState<Set<string>>(new Set());
  const [psiEnabled, setPsiEnabled] = useState(false);
  const [psiApiKey, setPsiApiKey] = useState<string>(import.meta.env.STRAPI_ADMIN_PSI_API_KEY || '');
  const [psiBaseUrl, setPsiBaseUrl] = useState<string>(import.meta.env.STRAPI_ADMIN_PSI_BASE_URL || 'https://davelopment.hu');
  const [psiStrategy, setPsiStrategy] = useState<'mobile' | 'desktop'>('mobile');
  const [psiKeyInput, setPsiKeyInput] = useState(false); // settings panel open

  // ── Theme observer ────────────────────────────────────────────────────────
  useEffect(() => {
    const apply = () => { const theme = getStrapiTheme(); applyTokens(theme); setIsDark(theme === 'dark'); };
    apply();
    const obs = new MutationObserver(apply);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] });
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    mq.addEventListener('change', apply);
    return () => { obs.disconnect(); mq.removeEventListener('change', apply); };
  }, []);

  // ── SEO audit ─────────────────────────────────────────────────────────────
  useEffect(() => {
    Promise.all(SOURCES.map(src =>
      fetch(src.endpoint).then(r => r.json()).then(data => {
        if (src.single) { const item = data.data; if (!item) return []; return [auditItem(item, src.titleField, src.label, src.uid, true)]; }
        return (data.data || []).map((it: any) => auditItem(it, src.titleField, src.label, src.uid, false));
      }).catch(() => [])
    )).then(results => { setItems(results.flat()); setLoading(false); });
  }, []);

  // ── GSC init ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (USE_MOCK) { setGscConnected(true); loadAllGscData(true); return; }
    fetch('/api/marketing-metrics/gsc-status').then(r => r.json())
      .then(d => { setGscConnected(d.connected); if (d.connected) loadAllGscData(false); }).catch(() => { });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAllGscData = useCallback(async (mock: boolean = isMock) => {
    setGscLoading(true);
    try {
      if (mock) {
        await new Promise(r => setTimeout(r, 400));
        const [pd, td, tp] = await Promise.all([gscFetch.data(), gscFetch.trend(trendDays), gscFetch.topPages()]);
        if (pd.ok) setGscData(normalizeGscData(pd.data));
        if (td.ok) setTrend(td.trend);
        if (tp.ok) setTopPages(tp.pages);
      } else {
        const [pageRes, trendRes, topRes] = await Promise.all([
          fetch('/api/marketing-metrics/gsc-data', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) }),
          fetch(`/api/marketing-metrics/gsc-trend?days=${trendDays}`),
          fetch('/api/marketing-metrics/gsc-top-pages'),
        ]);
        const [pd, td, tp] = await Promise.all([pageRes.json(), trendRes.json(), topRes.json()]);
        console.log('[GSC prod response]', JSON.stringify(pd).slice(0, 400));
        if (pd.ok) {
          console.log('[GSC keys sample]', Object.keys(pd.data).slice(0, 5));
          setGscData(normalizeGscData(pd.data));
        }
        if (td.ok) setTrend(td.trend);
        if (tp.ok) setTopPages(tp.pages);
      }
    } catch { }
    setGscLoading(false);
  }, [trendDays, isMock]);

  useEffect(() => { if (gscConnected) loadAllGscData(); }, [trendDays, gscConnected, loadAllGscData]);

  // ── PSI fetch ─────────────────────────────────────────────────────────────
  const runPsiFetch = useCallback(async (slugs: string[]) => {
    if (USE_MOCK) {
      // simulate sequential loading
      for (const slug of slugs) {
        setPsiLoading(prev => new Set(prev).add(slug));
        await new Promise(r => setTimeout(r, 180 + Math.random() * 120));
        const mock = MOCK_PSI[slug] || MOCK_PSI['/'];
        if (mock) setPsiData(prev => ({ ...prev, [slug]: { ...mock, slug } }));
        setPsiLoading(prev => { const s = new Set(prev); s.delete(slug); return s; });
      }
      return;
    }

    // real fetch — check cache first, then sequential API calls
    const cache = loadPsiCache();
    const now = Date.now();
    const fresh: string[] = [], stale: string[] = [];
    slugs.forEach(s => {
      const hit = cache[s];
      if (hit && (now - hit.fetchedAt) < PSI_CACHE_TTL_MS) fresh.push(s);
      else stale.push(s);
    });

    // inject fresh from cache immediately
    if (fresh.length) {
      const fromCache: Record<string, PageSpeedData> = {};
      fresh.forEach(s => { fromCache[s] = cache[s]; });
      setPsiData(prev => ({ ...prev, ...fromCache }));
    }

    // fetch stale sequentially
    for (const slug of stale) {
      setPsiLoading(prev => new Set(prev).add(slug));
      const result = await fetchPsiForSlug(psiBaseUrl, slug, psiApiKey, psiStrategy);
      if (result) {
        cache[slug] = result;
        setPsiData(prev => ({ ...prev, [slug]: result }));
      }
      setPsiLoading(prev => { const s = new Set(prev); s.delete(slug); return s; });
      if (stale.indexOf(slug) < stale.length - 1)
        await new Promise(r => setTimeout(r, PSI_DELAY_MS));
    }
    savePsiCache(cache);
  }, [psiBaseUrl, psiApiKey, psiStrategy]);

  useEffect(() => {
    if (!psiEnabled || items.length === 0) return;
    const slugs = [...new Set(items.map(i => toSlugKey(i.slug)).filter(Boolean))];
    runPsiFetch(slugs);
  }, [psiEnabled, items, runPsiFetch]);

  // ── Derived ───────────────────────────────────────────────────────────────
  const filtered = filter === 'all' ? items : items.filter(i => i.type === filter);
  const ok = items.filter(p => p.score === 100).length;
  const bad = items.filter(p => p.issues.length > 0).length;
  const avgScore = items.length ? Math.round(items.reduce((a, b) => a + b.score, 0) / items.length) : 0;
  const totalClicks = Object.values(gscData).reduce((a, b) => a + b.clicks, 0);
  const totalImpressions = Object.values(gscData).reduce((a, b) => a + b.impressions, 0);
  const avgPos = Object.values(gscData).length ? Object.values(gscData).reduce((a, b) => a + b.position, 0) / Object.values(gscData).length : 0;
  const half = Math.floor(trend.length / 2);
  const prev = trend.slice(0, half), curr = trend.slice(half);
  const clicksChange = pct(curr.reduce((a, b) => a + b.clicks, 0), prev.reduce((a, b) => a + b.clicks, 0));
  const impsChange = pct(curr.reduce((a, b) => a + b.impressions, 0), prev.reduce((a, b) => a + b.impressions, 0));

  const avgPsiScore = Object.values(psiData).length
    ? Math.round(Object.values(psiData).reduce((a, b) => a + b.score, 0) / Object.values(psiData).length)
    : null;

  const card: React.CSSProperties = { background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: '14px', padding: '20px 24px', boxShadow: 'var(--shadow)' };

  return (
    <>
      <style>{staticStyles}</style>
      <div className="seo-app" style={{ padding: '24px 28px', color: 'var(--text-secondary)', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', minHeight: '100vh', background: 'var(--bg-page)', transition: 'background 200ms' }}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 600, margin: 0, letterSpacing: '-0.4px', color: 'var(--text-primary)' }}>SEO & Analytics</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '12px', margin: '3px 0 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              davelopment.hu — {items.length} tartalom
              {IS_DEV && <span className="mock-badge" style={{ fontSize: '10px', color: 'var(--accent-amber)', background: 'rgba(240,199,66,0.1)', border: '1px solid rgba(240,199,66,0.22)', padding: '1px 7px', borderRadius: '20px', fontWeight: 500 }}>DEV · MOCK</span>}
              {IS_DEV && (
                <button onClick={() => { localStorage.setItem('seo_force_prod', isMock ? 'true' : 'false'); window.location.reload(); }}
                  style={{ fontSize: '10px', fontWeight: 500, cursor: 'pointer', padding: '1px 8px', borderRadius: '20px', border: '1px solid', borderColor: isMock ? 'rgba(124,106,247,0.3)' : 'rgba(61,255,160,0.3)', color: isMock ? 'var(--accent-indigo)' : 'var(--accent-green)', background: isMock ? 'rgba(124,106,247,0.07)' : 'rgba(61,255,160,0.07)', transition: 'all 150ms' }}>
                  {isMock ? '⇄ prod' : '⇄ mock'}
                </button>
              )}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {gscConnected ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 12px', background: 'rgba(61,255,160,0.06)', border: '1px solid rgba(61,255,160,0.18)', borderRadius: '20px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-green)', boxShadow: '0 0 5px var(--accent-green)' }} />
                <span style={{ fontSize: '12px', color: 'var(--accent-green)', fontWeight: 500 }}>{isMock ? 'Search Console (mock)' : 'Search Console'}</span>
                {!IS_DEV && <button onClick={async () => { await fetch('/api/marketing-metrics/gsc-disconnect', { method: 'POST' }); setGscConnected(false); setGscData({}); setTrend([]); setTopPages([]); }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '14px', padding: 0, lineHeight: 1 }}>×</button>}
              </div>
            ) : (
              <button onClick={() => (window.location.href = '/api/marketing-metrics/gsc-auth')}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 13px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 500, cursor: 'pointer', transition: 'all 120ms', boxShadow: 'var(--shadow)' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                Search Console csatlakoztatás
              </button>
            )}
          </div>
        </div>

        {/* ── Tab nav ── */}
        <TabNav activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* ── Stat cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(138px, 1fr))', gap: '10px', marginBottom: '20px' }}>
          {[
            { l: 'Összes', v: items.length, sub: 'tartalom', c: 'var(--text-primary)', tip: '' },
            { l: 'Rendben', v: ok, sub: `${Math.round(ok / Math.max(items.length, 1) * 100)}%`, c: 'var(--accent-green)', tip: '' },
            { l: 'Hiányos', v: bad, sub: 'figyelmeztet', c: 'var(--accent-red)', tip: '' },
            { l: 'Átlag SEO', v: `${avgScore}%`, sub: 'score', c: scoreColor(avgScore), tip: '' },
            ...(psiEnabled && avgPsiScore !== null ? [{
              l: 'Avg. Speed', v: `${avgPsiScore}`, sub: `${psiStrategy} score`, c: cwvColor.score(avgPsiScore), tip: 'Google PageSpeed Insights átlag performance score az összes oldalra.',
            }] : []),
            ...(gscConnected ? [
              { l: 'Klikk', v: gscLoading ? '…' : fmt(totalClicks), sub: `${trendDays} nap`, c: 'var(--chart-green)', tip: 'Hányszor kattintottak az oldalaidra a Google keresésből.', change: clicksChange, invert: false },
              { l: 'Megjelenés', v: gscLoading ? '…' : fmt(totalImpressions), sub: `${trendDays} nap`, c: 'var(--chart-indigo)', tip: 'Hányszor jelent meg oldalad a Google találati listáján — kattintástól függetlenül.', change: impsChange, invert: false },
              { l: 'Átl. pozíció', v: gscLoading || !avgPos ? '…' : `#${avgPos.toFixed(1)}`, sub: 'ranking', c: posColor(avgPos || 99), tip: 'Az oldalaid átlagos Google-helyezése. Minél kisebb, annál jobb.', change: null, invert: true },
            ] : []),
          ].map((c: any, i) => (
            <div key={i} className="stat-card">
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap' }}>
                <div style={{ fontSize: '20px', fontWeight: 600, color: c.c, letterSpacing: '-0.5px', fontVariantNumeric: 'tabular-nums' }}>{c.v}</div>
                {'change' in c && <ChangeBadge value={c.change} invert={c.invert} />}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '3px', display: 'flex', alignItems: 'center' }}>
                {c.l}{c.tip && <InfoTip text={c.tip} />}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-faint)', marginTop: '1px', fontFamily: "'Geist Mono', monospace" }}>{c.sub}</div>
            </div>
          ))}
        </div>

        {/* ── ANALYTICS TAB ── */}
        {activeTab === 'analytics' && (
          <div>
            {!gscConnected ? (
              <div style={{ ...card, textAlign: 'center', padding: '56px 48px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--bg-inner)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5"><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" /></svg>
                </div>
                <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>Search Console nincs csatlakoztatva</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '320px', margin: '0 auto 24px', lineHeight: 1.6 }}>
                  Csatlakoztasd a GSC-t a klikk, megjelenés és pozíció adatok megtekintéséhez.
                </div>
                <button onClick={() => (window.location.href = '/api/marketing-metrics/gsc-auth')} style={{ padding: '9px 18px', background: 'var(--accent-green)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
                  Csatlakoztatás →
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Trend chart */}
                <div style={card}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Forgalom trend</div>
                      {!gscLoading && trend.length > 0 && (
                        <div style={{ display: 'flex', gap: '16px' }}>
                          {(trendMetric === 'clicks' || trendMetric === 'dual') && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--chart-green)' }} />
                              <span style={{ fontSize: '12px', color: 'var(--chart-green)', fontWeight: 600 }}>{fmt(trend.reduce((a, b) => a + b.clicks, 0))}</span>
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>klikk</span>
                              <ChangeBadge value={clicksChange} />
                            </div>
                          )}
                          {(trendMetric === 'impressions' || trendMetric === 'dual') && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--chart-indigo)' }} />
                              <span style={{ fontSize: '12px', color: 'var(--chart-indigo)', fontWeight: 600 }}>{fmt(trend.reduce((a, b) => a + b.impressions, 0))}</span>
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>megjelenés</span>
                              <ChangeBadge value={impsChange} />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                      {(['dual', 'clicks', 'impressions'] as const).map(m => (
                        <button key={m} onClick={() => setTrendMetric(m)} style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 500, cursor: 'pointer', border: '1px solid', borderColor: trendMetric === m ? 'var(--border-hover)' : 'var(--border)', background: trendMetric === m ? 'var(--bg-inner2)' : 'transparent', color: trendMetric === m ? 'var(--text-primary)' : 'var(--text-muted)', transition: 'all 120ms' }}>
                          {m === 'dual' ? 'Mindkettő' : m === 'clicks' ? 'Klikk' : 'Megjelenés'}
                        </button>
                      ))}
                      <div style={{ width: '1px', height: '16px', background: 'var(--border)', margin: '0 2px' }} />
                      {[7, 28, 90].map(d => (
                        <button key={d} onClick={() => setTrendDays(d)} style={{ padding: '4px 9px', borderRadius: '8px', fontSize: '11px', fontWeight: 500, cursor: 'pointer', border: '1px solid', borderColor: trendDays === d ? 'var(--border-hover)' : 'transparent', background: trendDays === d ? 'var(--bg-inner2)' : 'transparent', color: trendDays === d ? 'var(--text-secondary)' : 'var(--text-muted)', transition: 'all 120ms' }}>
                          {d}n
                        </button>
                      ))}
                    </div>
                  </div>
                  {gscLoading ? (
                    <div style={{ height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-faint)', fontSize: '12px' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px', animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                      Betöltés...
                    </div>
                  ) : (
                    <VercelChart trend={trend} metric={trendMetric} isDark={isDark} height={160} />
                  )}
                </div>

                {/* Top pages */}
                <div style={card}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '18px' }}>Top oldalak</div>
                  {gscLoading ? (
                    <div style={{ color: 'var(--text-faint)', fontSize: '12px' }}>Betöltés...</div>
                  ) : topPages.length === 0 ? (
                    <div style={{ color: 'var(--text-faint)', fontSize: '12px', textAlign: 'center', padding: '24px' }}>Nincs adat</div>
                  ) : (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', padding: '0 2px' }}>
                        <span style={{ fontSize: '10px', color: 'var(--text-faint)', minWidth: '16px' }}>#</span>
                        <span style={{ flex: 1, fontSize: '10px', color: 'var(--text-faint)', fontFamily: "'Geist Mono', monospace", letterSpacing: '0.05em' }}>OLDAL</span>
                        <span style={{ fontSize: '10px', color: 'var(--text-faint)', minWidth: '44px', textAlign: 'right' }}>KLIKK</span>
                        <span style={{ fontSize: '10px', color: 'var(--text-faint)', minWidth: '44px', textAlign: 'right' }}>POZÍCIÓ</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        {topPages.map((p, i) => {
                          const maxC = topPages[0]?.clicks || 1;
                          return (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 2px', borderRadius: '8px', transition: 'background 100ms' }}
                              onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-inner)')}
                              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                              <span style={{ fontSize: '11px', color: 'var(--text-faintest)', minWidth: '16px', textAlign: 'right', fontFamily: "'Geist Mono', monospace" }}>{i + 1}</span>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: "'Geist Mono', monospace", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.slug}</div>
                                <div style={{ marginTop: '4px', height: '2px', background: 'var(--bg-inner2)', borderRadius: '2px', overflow: 'hidden' }}>
                                  <div style={{ height: '100%', width: `${(p.clicks / maxC) * 100}%`, background: 'var(--chart-green)', borderRadius: '2px', transition: 'width 0.5s ease' }} />
                                </div>
                              </div>
                              <div style={{ minWidth: '44px', textAlign: 'right' }}>
                                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--chart-green)', fontVariantNumeric: 'tabular-nums' }}>{fmt(p.clicks)}</div>
                              </div>
                              <div style={{ minWidth: '44px', textAlign: 'right' }}>
                                <div style={{ fontSize: '13px', fontWeight: 600, color: posColor(p.position), fontVariantNumeric: 'tabular-nums' }}>#{p.position.toFixed(1)}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── AUDIT TAB ── */}
        {activeTab === 'audit' && (
          <div>
            {/* Filter bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', flex: 1 }}>
                {['all', ...SOURCES.map(s => s.label)].map(tab => (
                  <button key={tab} onClick={() => setFilter(tab)} className={`filter-chip${filter === tab ? ' active' : ''}`}>
                    {tab === 'all' ? 'Összes' : tab}
                    {tab !== 'all' && (
                      <span style={{ marginLeft: '5px', fontSize: '10px', opacity: filter === tab ? 0.65 : 0.55, fontFamily: "'Geist Mono', monospace" }}>
                        {items.filter(i => i.type === tab).length}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Layout toggle */}
              {/* layout toggle container with border hidden*/}
              {/* <div style={{ display: 'flex', gap: '4px', flexShrink: 0, background: 'var(--bg-inner)', padding: '3px', borderRadius: '10px', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}> */}
              <button className={`layout-btn${auditLayout === 'rich' ? ' active' : ''}`} onClick={() => setAuditLayout('rich')} title="Lista nézet">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="4" rx="1" /><rect x="3" y="10" width="18" height="4" rx="1" /><rect x="3" y="16" width="18" height="4" rx="1" />
                </svg>
              </button>
              <button className={`layout-btn${auditLayout === 'grid' ? ' active' : ''}`} onClick={() => setAuditLayout('grid')} title="Kártya-grid nézet">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="8" height="8" rx="1.5" /><rect x="13" y="3" width="8" height="8" rx="1.5" />
                  <rect x="3" y="13" width="8" height="8" rx="1.5" /><rect x="13" y="13" width="8" height="8" rx="1.5" />
                </svg>
              </button>
              {/* </div> */}

              {/* PSI toggle + settings */}
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                  <button
                    onClick={() => { setPsiEnabled(v => !v); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '5px',
                      padding: '5px 10px', borderRadius: '8px', fontSize: '11.5px', fontWeight: 500,
                      cursor: 'pointer', border: '1px solid',
                      borderColor: psiEnabled ? 'rgba(61,255,160,0.35)' : 'var(--border)',
                      background: psiEnabled ? 'rgba(61,255,160,0.07)' : 'var(--bg-card)',
                      color: psiEnabled ? 'var(--accent-green)' : 'var(--text-muted)',
                      transition: 'all 140ms',
                      boxShadow: isDark ? 'var(--shadow)' : '0 1px 4px rgba(15,23,42,0.06)',
                    }}
                    title={psiEnabled ? 'PageSpeed mérés bekapcsolva' : 'PageSpeed mérés kikapcsolva'}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                    PageSpeed
                    {psiEnabled && psiLoading.size > 0 && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 1s linear infinite', flexShrink: 0 }}>
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={() => setPsiKeyInput(v => !v)}
                    className={`layout-btn${psiKeyInput ? ' active' : ''}`}
                    title="PageSpeed beállítások"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
                    </svg>
                  </button>
                </div>

                {/* Settings popover */}
                {psiKeyInput && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 36 }}
                    style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 200, width: '300px', background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: '14px', padding: '16px', boxShadow: 'var(--shadow-hover)' }}
                  >
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>PageSpeed beállítások</div>

                    {[
                      { label: 'Site base URL', placeholder: 'https://davelopment.hu', value: psiBaseUrl, onChange: (v: string) => setPsiBaseUrl(v) },
                      { label: 'API kulcs (opcionális)', placeholder: 'AIza…', value: psiApiKey, onChange: (v: string) => setPsiApiKey(v) },
                    ].map(f => (
                      <div key={f.label} style={{ marginBottom: '10px' }}>
                        <div style={{ fontSize: '10.5px', color: 'var(--text-faint)', marginBottom: '4px', fontWeight: 500 }}>{f.label}</div>
                        <input
                          value={f.value}
                          onChange={e => f.onChange(e.target.value)}
                          placeholder={f.placeholder}
                          style={{ width: '100%', padding: '6px 9px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-inner)', color: 'var(--text-primary)', fontSize: '12px', outline: 'none', fontFamily: "'Geist Mono', monospace' " }}
                          onFocus={e => (e.currentTarget.style.borderColor = 'var(--border-hover)')}
                          onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                        />
                      </div>
                    ))}

                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ fontSize: '10.5px', color: 'var(--text-faint)', marginBottom: '5px', fontWeight: 500 }}>Stratégia</div>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        {(['mobile', 'desktop'] as const).map(s => (
                          <button key={s} onClick={() => setPsiStrategy(s)}
                            style={{ padding: '4px 11px', borderRadius: '7px', fontSize: '11px', fontWeight: 500, cursor: 'pointer', border: '1px solid', borderColor: psiStrategy === s ? 'var(--border-hover)' : 'var(--border)', background: psiStrategy === s ? 'var(--bg-inner2)' : 'transparent', color: psiStrategy === s ? 'var(--text-primary)' : 'var(--text-muted)', transition: 'all 100ms' }}>
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setPsiData({});
                        if (psiEnabled) {
                          const slugs = [...new Set(items.map(i => toSlugKey(i.slug)).filter(Boolean))];
                          runPsiFetch(slugs);
                        }
                        setPsiKeyInput(false);
                      }}
                      style={{ width: '100%', padding: '7px', borderRadius: '8px', fontSize: '12px', fontWeight: 500, cursor: 'pointer', border: '1px solid var(--border)', background: 'var(--bg-inner)', color: 'var(--text-secondary)', transition: 'all 120ms' }}
                    >
                      Cache törlése + újrafuttatás
                    </button>
                  </motion.div>
                )}
              </div>
            </div>

            {loading ? (
              <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-faint)', fontSize: '13px' }}>Betöltés...</div>
            ) : auditLayout === 'rich' ? (
              <AuditRich items={filtered} gscData={gscData} gscConnected={gscConnected} onQueryClick={slug => setDrawerSlug(slug)} psiData={psiData} psiLoading={psiLoading} psiEnabled={psiEnabled} />
            ) : (
              <AuditGrid items={filtered} gscData={gscData} gscConnected={gscConnected} onQueryClick={slug => setDrawerSlug(slug)} psiData={psiData} psiLoading={psiLoading} psiEnabled={psiEnabled} />
            )}
          </div>
        )}

        {drawerSlug && <QueryDrawer slug={drawerSlug} onClose={() => setDrawerSlug(null)} isMock={isMock} />}
      </div>
    </>
  );
};
