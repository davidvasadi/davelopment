import { useState, useEffect, useCallback, useRef } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface PageAudit {
  id: number; documentId: string; type: string; label: string;
  slug: string; issues: string[]; score: number; editUrl: string;
}
interface GscPageData { url: string; clicks: number; impressions: number; ctr: number; position: number; }
interface TrendPoint { date: string; clicks: number; impressions: number; position: number; }
interface TopPage { url: string; slug: string; clicks: number; impressions: number; position: number; }
interface QueryRow { query: string; clicks: number; impressions: number; position: number; }

// ─── Config ───────────────────────────────────────────────────────────────────
const SOURCES = [
  { key: 'pages',     label: 'Pages',     endpoint: '/api/pages?pagination%5BpageSize%5D=100&populate=seo',    titleField: 'slug',                    single: false, uid: 'api::page.page' },
  { key: 'articles',  label: 'Articles',  endpoint: '/api/articles?pagination%5BpageSize%5D=100&populate=seo', titleField: 'title',                   single: false, uid: 'api::article.article' },
  { key: 'products',  label: 'Products',  endpoint: '/api/products?pagination%5BpageSize%5D=100&populate=seo', titleField: 'title',                   single: false, uid: 'api::product.product' },
  { key: 'blog-page', label: 'Blog page', endpoint: '/api/blog-page?populate=seo',                            titleField: 'heading',                 single: true,  uid: 'api::blog-page.blog-page' },
  { key: 'global',    label: 'Global',    endpoint: '/api/global?populate=seo',                               titleField: '_fixed_Global settings',  single: true,  uid: 'api::global.global' },
];

// ─── Dev/prod detection ───────────────────────────────────────────────────────
const IS_DEV = process.env.NODE_ENV === 'development';

// ── Dev-only prod szimuláció ──────────────────────────────────────────────────
// Ha true: dev módban is a valódi API-kat hívja (mock helyett).
// Átkapcsoláshoz elég ezt true/false-ra állítani, nem kell újraépíteni.
// localStorage-ban is tárolható, ezért van a runtime override is.
const FORCE_PROD_MODE: boolean =
  typeof window !== 'undefined'
    ? localStorage.getItem('seo_force_prod') === 'true'
    : false;

// A mock logika ezentúl ezt nézi:
const USE_MOCK = IS_DEV && !FORCE_PROD_MODE;

// ─── URL normalizer ───────────────────────────────────────────────────────────
// GSC teljes URL-eket ad vissza (https://davelopment.hu/kapcsolat),
// normalizáljuk őket pathname-re (/kapcsolat) hogy a slug egyeztetés működjön.
const normalizeGscData = (raw: Record<string, GscPageData>): Record<string, GscPageData> => {
  const out: Record<string, GscPageData> = {};
  Object.entries(raw).forEach(([key, val]) => {
    try {
      const path = key.startsWith('http') ? new URL(key).pathname : key;
      // Biztosítsuk hogy / -el kezdődik
      const normalized = path.startsWith('/') ? path : `/${path}`;
      out[normalized] = val;
    } catch {
      out[key] = val;
    }
  });
  return out;
};

// ─── Mock GSC data (dev only) ─────────────────────────────────────────────────
const generateMockTrend = (days: number): TrendPoint[] => {
  const pts: TrendPoint[] = [];
  let clicks = 12; let imps = 180;
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    clicks      = Math.max(1,  Math.round(clicks      * (0.85 + Math.random() * 0.35)));
    imps        = Math.max(10, Math.round(imps        * (0.88 + Math.random() * 0.28)));
    const pos   = parseFloat((1.5 + Math.random() * 4).toFixed(1));
    pts.push({ date: d.toISOString().slice(0, 10), clicks, impressions: imps, position: pos });
  }
  return pts;
};

// Mock adatok — path formátumban, lefedik az összes tipikus Strapi slug-ot
const MOCK_GSC_DATA: Record<string, GscPageData> = {
  '/':                     { url: '/',                     clicks: 42,  impressions: 920,  ctr: 0.046, position: 1.1 },
  '/kapcsolat':            { url: '/kapcsolat',            clicks: 5,   impressions: 180,  ctr: 0.028, position: 11.2 },
  '/adatkezeles':          { url: '/adatkezeles',          clicks: 2,   impressions: 95,   ctr: 0.021, position: 18.4 },
  '/arak':                 { url: '/arak',                 clicks: 9,   impressions: 260,  ctr: 0.035, position: 6.8 },
  '/szolgaltatasok':       { url: '/szolgaltatasok',       clicks: 14,  impressions: 380,  ctr: 0.037, position: 4.5 },
  '/projektek':            { url: '/projektek',            clicks: 8,   impressions: 220,  ctr: 0.036, position: 7.1 },
  '/homepage':             { url: '/homepage',             clicks: 38,  impressions: 870,  ctr: 0.044, position: 1.4 },
  '/csontkovacs-budapest': { url: '/csontkovacs-budapest', clicks: 21,  impressions: 510,  ctr: 0.041, position: 2.9 },
  '/en/faq':               { url: '/en/faq',               clicks: 18,  impressions: 440,  ctr: 0.041, position: 3.3 },
  '/services':             { url: '/services',             clicks: 11,  impressions: 280,  ctr: 0.039, position: 5.7 },
  '/blog':                 { url: '/blog',                 clicks: 7,   impressions: 210,  ctr: 0.033, position: 8.2 },
  '/contact':              { url: '/contact',              clicks: 4,   impressions: 150,  ctr: 0.027, position: 12.4 },
};

const MOCK_TOP_PAGES: TopPage[] = [
  { url: 'https://davelopment.hu/',                     slug: '/',                     clicks: 42, impressions: 920, position: 1.1 },
  { url: 'https://davelopment.hu/homepage',             slug: '/homepage',             clicks: 38, impressions: 870, position: 1.4 },
  { url: 'https://davelopment.hu/csontkovacs-budapest', slug: '/csontkovacs-budapest', clicks: 21, impressions: 510, position: 2.9 },
  { url: 'https://davelopment.hu/szolgaltatasok',       slug: '/szolgaltatasok',       clicks: 14, impressions: 380, position: 4.5 },
  { url: 'https://davelopment.hu/arak',                 slug: '/arak',                 clicks: 9,  impressions: 260, position: 6.8 },
  { url: 'https://davelopment.hu/projektek',            slug: '/projektek',            clicks: 8,  impressions: 220, position: 7.1 },
];

const MOCK_QUERIES: QueryRow[] = [
  { query: 'web fejlesztés budapest',  clicks: 14, impressions: 310, position: 1.2 },
  { query: 'davelopment',              clicks: 11, impressions: 88,  position: 1.0 },
  { query: 'react fejlesztő',          clicks: 8,  impressions: 220, position: 2.4 },
  { query: 'strapi cms magyarország',  clicks: 5,  impressions: 140, position: 3.8 },
  { query: 'next.js ügynökség',        clicks: 3,  impressions: 95,  position: 6.1 },
];

// Mock fetch wrapper — replaces real API calls in dev
const gscFetch = {
  status:     async () => ({ connected: true, mock: true }),
  data:       async () => ({ ok: true, data: MOCK_GSC_DATA }),
  trend:      async (days: number) => ({ ok: true, trend: generateMockTrend(days) }),
  topPages:   async () => ({ ok: true, pages: MOCK_TOP_PAGES }),
  queries:    async (_slug: string) => ({ queries: MOCK_QUERIES }),
  disconnect: async () => {},
};

// ─── Theme tokens ─────────────────────────────────────────────────────────────
const DARK_TOKENS: Record<string, string> = {
  '--bg-page':    '#030712', '--bg-card':     '#0d1117', '--bg-card-sm':  '#0d1117',
  '--bg-inner':   '#161b22', '--bg-inner2':   '#21262d', '--border':      '#21262d',
  '--border-hover': '#30363d', '--text-primary': '#f0f6fc', '--text-secondary': '#c9d1d9',
  '--text-muted': '#8b949e', '--text-faint':  '#484f58', '--text-faintest': '#30363d',
  '--accent-green': '#3dffa0', '--accent-red': '#f85149', '--accent-amber': '#f0c742',
  '--accent-indigo': '#7c6af7', '--accent-indigo-light': '#a78bfa',
  '--shadow': '0 0 0 1px rgba(240,246,252,0.04), 0 2px 8px rgba(0,0,0,0.5)',
  '--chart-green': '#3dffa0', '--chart-indigo': '#7c6af7',
  '--chart-green-raw': '#3dffa0', '--chart-indigo-raw': '#7c6af7',
};

const LIGHT_TOKENS: Record<string, string> = {
  '--bg-page':    '#f6f8fa', '--bg-card':     '#ffffff', '--bg-card-sm':  '#ffffff',
  '--bg-inner':   '#f6f8fa', '--bg-inner2':   '#eaeef2', '--border':      '#d0d7de',
  '--border-hover': '#b0bac4', '--text-primary': '#1f2328', '--text-secondary': '#36393d',
  '--text-muted': '#636c76', '--text-faint':  '#9198a1', '--text-faintest': '#d0d7de',
  '--accent-green': '#1a7f37', '--accent-red': '#cf222e', '--accent-amber': '#9a6700',
  '--accent-indigo': '#6639ba', '--accent-indigo-light': '#7c3aed',
  '--shadow': '0 1px 3px rgba(31,35,40,0.08), 0 1px 2px rgba(31,35,40,0.06)',
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

  .audit-row {
    background: var(--bg-card-sm);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 14px 18px;
    display: flex;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
    transition: border-color 120ms ease, box-shadow 120ms ease, background 120ms ease;
    cursor: default;
  }
  .audit-row:hover {
    border-color: var(--border-hover);
    background: var(--bg-inner);
    box-shadow: var(--shadow);
  }

  /* Tooltip */
  .info-tip { position: relative; display: inline-flex; align-items: center; cursor: help; margin-left: 3px; }
  .info-tip .tip-box {
    display: none; position: absolute; bottom: calc(100% + 8px); left: 50%;
    transform: translateX(-50%);
    background: var(--bg-inner2); color: var(--text-secondary);
    font-size: 11px; line-height: 1.5; padding: 7px 10px;
    border-radius: 8px; border: 1px solid var(--border-hover);
    box-shadow: var(--shadow); z-index: 200; pointer-events: none;
    width: 200px; text-align: center; white-space: normal;
  }
  .info-tip:hover .tip-box { display: block; }

  /* Mock badge */
  @keyframes pulse-mock {
    0%, 100% { opacity: 1; } 50% { opacity: 0.5; }
  }
  .mock-badge {
    animation: pulse-mock 2.5s ease-in-out infinite;
  }

  /* Chart draw animation */
  @keyframes chart-draw {
    from { stroke-dashoffset: var(--dash-total); }
    to   { stroke-dashoffset: 0; }
  }
  .chart-line-animated {
    stroke-dasharray: var(--dash-total);
    stroke-dashoffset: var(--dash-total);
    animation: chart-draw 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  }
  @keyframes fade-area {
    from { opacity: 0; } to { opacity: 1; }
  }
  .chart-area-animated {
    opacity: 0;
    animation: fade-area 0.6s ease 0.4s forwards;
  }

  /* Stat card hover */
  .stat-card {
    background: var(--bg-card-sm);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 16px 18px;
    box-shadow: var(--shadow);
    transition: border-color 120ms, transform 120ms, box-shadow 120ms;
    cursor: default;
  }
  .stat-card:hover {
    border-color: var(--border-hover);
    transform: translateY(-1px);
    box-shadow: var(--shadow), 0 4px 16px rgba(0,0,0,0.12);
  }

  /* Tab pill active indicator */
  .tab-btn {
    padding: 7px 16px; border-radius: 8px; font-size: 13px;
    font-weight: 500; cursor: pointer; border: none;
    background: transparent; color: var(--text-muted);
    transition: all 150ms; position: relative;
  }
  .tab-btn.active {
    background: var(--bg-inner2);
    color: var(--text-primary);
    box-shadow: 0 1px 3px rgba(0,0,0,0.15);
  }

  /* Layout toggle button */
  .layout-btn {
    display: flex; align-items: center; justify-content: center;
    width: 32px; height: 32px; border-radius: 7px; cursor: pointer;
    border: 1px solid var(--border); background: transparent;
    color: var(--text-muted); transition: all 120ms; flex-shrink: 0;
  }
  .layout-btn:hover, .layout-btn.active {
    border-color: var(--border-hover);
    background: var(--bg-inner2);
    color: var(--text-primary);
  }

  /* Score bar */
  .score-bar-track {
    flex: 1; height: 4px; background: var(--bg-inner2);
    border-radius: 2px; overflow: hidden;
  }
  .score-bar-fill {
    height: 100%; border-radius: 2px;
    transition: width 0.6s cubic-bezier(0.25,0.46,0.45,0.94);
  }

  /* Table layout */
  .audit-table {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
  }
  .audit-table-header {
    display: grid;
    grid-template-columns: 40px 1fr 90px 150px 70px 70px 70px 80px;
    gap: 0; padding: 8px 16px;
    border-bottom: 1px solid var(--border);
    background: var(--bg-inner);
  }
  .audit-table-row {
    display: grid;
    grid-template-columns: 40px 1fr 90px 150px 70px 70px 70px 80px;
    gap: 0; padding: 10px 16px;
    align-items: center;
    transition: background 100ms;
    cursor: default;
  }
  .audit-table-row:not(:last-child) { border-bottom: 1px solid var(--bg-inner); }
  .audit-table-row:hover { background: var(--bg-inner); }

  @media (max-width: 900px) {
    .audit-table-header { display: none; }
    .audit-table-row {
      grid-template-columns: 40px 1fr;
      grid-template-rows: auto auto auto;
      gap: 6px; padding: 12px 14px;
    }
  }
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const scoreColor = (s: number) => s >= 80 ? 'var(--accent-green)' : s >= 50 ? 'var(--accent-amber)' : 'var(--accent-red)';
const posColor   = (p: number) => p <= 3  ? 'var(--accent-green)' : p <= 10 ? 'var(--accent-amber)' : 'var(--text-muted)';
const fmt = (n: number) => n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
const pct = (a: number, b: number) => b === 0 ? null : Math.round(((a - b) / b) * 100);

const getEditUrl = (uid: string, single: boolean, documentId: string) =>
  single ? `/admin/content-manager/single-types/${uid}` : `/admin/content-manager/collection-types/${uid}/${documentId}`;

const auditItem = (item: any, titleField: string, typeLabel: string, uid: string, single: boolean): PageAudit => {
  const issues: string[] = [];
  if (!item.seo?.metaTitle)       issues.push('Meta title');
  if (!item.seo?.metaDescription) issues.push('Meta description');
  if (!item.seo?.keywords)        issues.push('Keywords');
  const isSingle = titleField.startsWith('_fixed_');
  if (!isSingle && !item.slug)    issues.push('Slug');
  const total = isSingle ? 3 : 4;
  const score = Math.max(0, Math.round(((total - issues.length) / total) * 100));
  const label = isSingle ? titleField.replace('_fixed_', '') : (item[titleField] || item.slug || `#${item.id}`);
  return { id: item.id, documentId: item.documentId, type: typeLabel, label, slug: item.slug || (single ? '' : '/'), issues, score, editUrl: getEditUrl(uid, single, item.documentId) };
};

// ─── slugKey helper ────────────────────────────────────────────────────────────
// Egységes slug → path konverzió, amit mind a lookup, mind a megjelenítés használ
const toSlugKey = (slug: string): string => {
  if (!slug || slug === '-') return '';
  return slug.startsWith('/') ? slug : `/${slug}`;
};

// ─── Info tooltip ─────────────────────────────────────────────────────────────
const InfoTip = ({ text }: { text: string }) => (
  <span className="info-tip">
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--text-faint)" strokeWidth="2.5">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
    <span className="tip-box">{text}</span>
  </span>
);

// ─── Score ring ───────────────────────────────────────────────────────────────
const ScoreRing = ({ score, size = 44 }: { score: number; size?: number }) => {
  const r = (size - 5) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = scoreColor(score);
  return (
    <svg width={size} height={size} style={{ flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--bg-inner2)" strokeWidth="4" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="4"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ transition: 'stroke-dasharray 0.5s ease' }} />
      <text x={size/2} y={size/2+4} textAnchor="middle" fontSize="10" fontWeight="600" fill={color}>{score}</text>
    </svg>
  );
};

// ─── Change badge ─────────────────────────────────────────────────────────────
const ChangeBadge = ({ value, invert = false }: { value: number | null; invert?: boolean }) => {
  if (value === null) return null;
  const positive = invert ? value < 0 : value > 0;
  const color = positive ? 'var(--accent-green)' : value === 0 ? 'var(--text-muted)' : 'var(--accent-red)';
  const bg    = positive ? 'rgba(61,255,160,0.08)' : value === 0 ? 'transparent' : 'rgba(248,81,73,0.08)';
  return (
    <span style={{ fontSize: '11px', fontWeight: 600, color, background: bg, padding: '2px 7px', borderRadius: '20px', letterSpacing: '-0.2px' }}>
      {value > 0 ? '+' : ''}{value}%
    </span>
  );
};

// ─── Score Bar ────────────────────────────────────────────────────────────────
const ScoreBar = ({ score }: { score: number }) => {
  const color = scoreColor(score);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div className="score-bar-track">
        <div className="score-bar-fill" style={{ width: `${score}%`, background: color }} />
      </div>
      <span style={{ fontSize: '11px', fontWeight: 700, color, minWidth: '30px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{score}%</span>
    </div>
  );
};

// ─── Issue Pills ──────────────────────────────────────────────────────────────
const IssuePills = ({ issues }: { issues: string[] }) => {
  if (issues.length === 0) return (
    <span style={{ fontSize: '11px', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '4px' }}>
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      Rendben
    </span>
  );
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
      {issues.map((issue, i) => (
        <span key={i} style={{ fontSize: '10px', color: 'var(--accent-red)', background: 'rgba(248,81,73,0.08)', border: '1px solid rgba(248,81,73,0.18)', padding: '2px 6px', borderRadius: '4px' }}>
          {issue}
        </span>
      ))}
    </div>
  );
};

// ─── GSC Stat Cell ────────────────────────────────────────────────────────────
// Egységes GSC adat megjelenítő — minden nézethez ugyanez
const GscStatCell = ({ gsc, onQueryClick }: { gsc: GscPageData | null; onQueryClick: () => void }) => {
  if (!gsc) return (
    <div style={{ display: 'flex', gap: '16px', flexShrink: 0 }}>
      {['klikk', 'megj.', 'pozíció'].map(l => (
        <div key={l} style={{ textAlign: 'right', minWidth: '40px' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-faintest)', fontFamily: "'Geist Mono', monospace" }}>—</div>
          <div style={{ fontSize: '10px', color: 'var(--text-faintest)' }}>{l}</div>
        </div>
      ))}
    </div>
  );
  return (
    <div style={{ display: 'flex', gap: '16px', flexShrink: 0 }}>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--chart-green)', fontVariantNumeric: 'tabular-nums' }}>{fmt(gsc.clicks)}</div>
        <div style={{ fontSize: '10px', color: 'var(--text-faint)' }}>klikk</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>{fmt(gsc.impressions)}</div>
        <div style={{ fontSize: '10px', color: 'var(--text-faint)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          megj.<InfoTip text="Hányszor jelent meg ez az oldal a Google találatokban." />
        </div>
      </div>
      <button onClick={onQueryClick} style={{ textAlign: 'right', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: posColor(gsc.position), fontVariantNumeric: 'tabular-nums', textDecoration: 'underline dotted', textUnderlineOffset: '2px' }}>#{gsc.position}</div>
        <div style={{ fontSize: '10px', color: 'var(--text-faint)' }}>pozíció</div>
      </button>
    </div>
  );
};

// ─── LAYOUT A: Compact Table ──────────────────────────────────────────────────
const AuditTable = ({ items, gscData, gscConnected, onQueryClick }: {
  items: PageAudit[];
  gscData: Record<string, GscPageData>;
  gscConnected: boolean;
  onQueryClick: (slug: string) => void;
}) => (
  <div className="audit-table">
    <div className="audit-table-header">
      {['', 'Oldal', 'Típus', 'Hiányzik', 'Klikk', 'Megj.', 'Poz.', ''].map((h, i) => (
        <div key={i} style={{ fontSize: '10px', color: 'var(--text-faint)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: "'Geist Mono', monospace", padding: '0 4px' }}>{h}</div>
      ))}
    </div>
    {items.map((item) => {
      const slugKey = toSlugKey(item.slug);
      const gsc = gscData[slugKey] || null;
      return (
        <div key={item.id} className="audit-table-row">
          <div><ScoreRing score={item.score} size={34} /></div>
          <div style={{ padding: '0 8px', minWidth: 0 }}>
            <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</div>
            <div style={{ fontSize: '10px', color: 'var(--text-faint)', fontFamily: "'Geist Mono', monospace", marginTop: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{slugKey}</div>
          </div>
          <div style={{ padding: '0 4px' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-faint)', background: 'var(--bg-inner2)', border: '1px solid var(--border)', padding: '2px 7px', borderRadius: '4px', fontFamily: "'Geist Mono', monospace" }}>{item.type}</span>
          </div>
          <div style={{ padding: '0 4px' }}><IssuePills issues={item.issues} /></div>
          {gscConnected ? (
            <>
              <div style={{ padding: '0 4px', textAlign: 'right' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: gsc ? 'var(--chart-green)' : 'var(--text-faintest)', fontVariantNumeric: 'tabular-nums' }}>{gsc ? fmt(gsc.clicks) : '—'}</span>
              </div>
              <div style={{ padding: '0 4px', textAlign: 'right' }}>
                <span style={{ fontSize: '12px', color: gsc ? 'var(--text-muted)' : 'var(--text-faintest)', fontVariantNumeric: 'tabular-nums' }}>{gsc ? fmt(gsc.impressions) : '—'}</span>
              </div>
              <div style={{ padding: '0 4px', textAlign: 'right' }}>
                {gsc ? (
                  <button onClick={() => onQueryClick(slugKey)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: posColor(gsc.position), fontVariantNumeric: 'tabular-nums', textDecoration: 'underline dotted', textUnderlineOffset: '2px' }}>#{gsc.position}</span>
                  </button>
                ) : <span style={{ color: 'var(--text-faintest)' }}>—</span>}
              </div>
            </>
          ) : <><div /><div /><div /></>}
          <div style={{ padding: '0 0 0 4px' }}>
            <button onClick={() => window.location.href = item.editUrl}
              style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 500, background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border)', cursor: 'pointer', transition: 'all 120ms', whiteSpace: 'nowrap' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'var(--bg-inner)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}>
              Szerk. →
            </button>
          </div>
        </div>
      );
    })}
  </div>
);

// ─── LAYOUT B: Rich List ──────────────────────────────────────────────────────
const AuditRich = ({ items, gscData, gscConnected, onQueryClick }: {
  items: PageAudit[];
  gscData: Record<string, GscPageData>;
  gscConnected: boolean;
  onQueryClick: (slug: string) => void;
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
    {items.map(item => {
      const slugKey     = toSlugKey(item.slug);
      const gsc         = gscData[slugKey] || null;
      const accentColor = scoreColor(item.score);
      return (
        <div key={item.id}
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px 18px 14px 22px', display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap', transition: 'border-color 120ms, background 120ms', cursor: 'default', position: 'relative', overflow: 'hidden' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.background = 'var(--bg-inner)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-card)'; }}>
          {/* Left color accent bar */}
          <div style={{ position: 'absolute', left: 0, top: '10px', bottom: '10px', width: '3px', background: accentColor, borderRadius: '0 3px 3px 0', opacity: 0.75 }} />
          {/* Score ring */}
          <ScoreRing score={item.score} size={48} />
          {/* Title + slug */}
          <div style={{ flex: '2 1 160px', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '10px', color: 'var(--text-faint)', background: 'var(--bg-inner2)', border: '1px solid var(--border)', padding: '1px 6px', borderRadius: '4px', fontFamily: "'Geist Mono', monospace", flexShrink: 0 }}>{item.type}</span>
              {item.score === 100 && (
                <span style={{ fontSize: '10px', color: 'var(--accent-green)', background: 'rgba(61,255,160,0.06)', border: '1px solid rgba(61,255,160,0.15)', padding: '1px 7px', borderRadius: '20px', flexShrink: 0 }}>✓ Teljes</span>
              )}
            </div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-faint)', fontFamily: "'Geist Mono', monospace", marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{slugKey}</div>
          </div>
          {/* Score bar */}
          <div style={{ flex: '2 1 140px', minWidth: '130px' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-faint)', marginBottom: '6px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>SEO Score</div>
            <ScoreBar score={item.score} />
          </div>
          {/* Issues */}
          <div style={{ flex: '2 1 140px', minWidth: '130px' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-faint)', marginBottom: '6px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              {item.issues.length === 0 ? 'Státusz' : `${item.issues.length} Hiányzik`}
            </div>
            <IssuePills issues={item.issues} />
          </div>
          {/* GSC stats — mindig egységes, akár van adat, akár nincs */}
          {gscConnected && (
            <div style={{ marginLeft: 'auto' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-faint)', marginBottom: '6px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Search Console</div>
              <GscStatCell gsc={gsc} onQueryClick={() => onQueryClick(slugKey)} />
            </div>
          )}
          {/* Edit button */}
          <button onClick={() => window.location.href = item.editUrl}
            style={{ padding: '6px 13px', borderRadius: '8px', fontSize: '12px', fontWeight: 500, background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border)', cursor: 'pointer', flexShrink: 0, transition: 'all 120ms' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'var(--bg-inner2)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}>
            Szerkesztés →
          </button>
        </div>
      );
    })}
  </div>
);

// ─── Vercel-grade Dual Chart ──────────────────────────────────────────────────
interface ChartProps {
  trend: TrendPoint[];
  metric: 'clicks' | 'impressions' | 'dual';
  isDark: boolean;
  height?: number;
}

const VercelChart = ({ trend, metric, isDark, height = 160 }: ChartProps) => {
  const [tooltip, setTooltip] = useState<{ idx: number; x: number } | null>(null);
  const [mounted, setMounted] = useState(false);
  const animKey = useRef(0);

  useEffect(() => {
    animKey.current++;
    setMounted(false);
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, [trend, metric]);

  if (!trend.length) return (
    <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-faint)', fontSize: '12px' }}>
      Nincs adat
    </div>
  );

  const W = 700; const H = height;
  const PAD = { top: 16, right: 16, bottom: 32, left: 48 };
  const iW = W - PAD.left - PAD.right;
  const iH = H - PAD.top  - PAD.bottom;

  const clickVals = trend.map(t => t.clicks);
  const impVals   = trend.map(t => t.impressions);

  const scale = (vals: number[]) => {
    const mx = Math.max(...vals, 1);
    const mn = Math.min(...vals, 0);
    const r  = mx - mn || 1;
    return { mx, mn, r };
  };

  const cScale = scale(clickVals);
  const iScale = scale(impVals);

  const px = (i: number) => PAD.left + (i / Math.max(trend.length - 1, 1)) * iW;
  const pyFor = (v: number, s: ReturnType<typeof scale>) =>
    PAD.top + iH - ((v - s.mn) / s.r) * iH;

  const buildPath = (vals: number[], s: ReturnType<typeof scale>) =>
    vals.map((v, i) => `${i === 0 ? 'M' : 'L'}${px(i).toFixed(2)},${pyFor(v, s).toFixed(2)}`).join(' ');

  const buildArea = (vals: number[], s: ReturnType<typeof scale>) => {
    const line = buildPath(vals, s);
    return `${line} L${px(vals.length - 1).toFixed(2)},${(PAD.top + iH).toFixed(2)} L${PAD.left.toFixed(2)},${(PAD.top + iH).toFixed(2)} Z`;
  };

  const approxLen = (vals: number[], s: ReturnType<typeof scale>) => {
    let len = 0;
    for (let i = 1; i < vals.length; i++) {
      const dx = px(i) - px(i - 1);
      const dy = pyFor(vals[i], s) - pyFor(vals[i - 1], s);
      len += Math.sqrt(dx * dx + dy * dy);
    }
    return Math.round(len);
  };

  const showClicks = metric === 'clicks' || metric === 'dual';
  const showImps   = metric === 'impressions' || metric === 'dual';

  const greenRaw  = isDark ? '#3dffa0' : '#1a7f37';
  const indigoRaw = isDark ? '#7c6af7' : '#6639ba';

  const cLen = approxLen(clickVals, cScale);
  const iLen = approxLen(impVals,   iScale);

  const primaryScale = showClicks ? cScale : iScale;
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(f => primaryScale.mn + f * primaryScale.r);

  const xIdxs = trend.length <= 6
    ? trend.map((_, i) => i)
    : [0, Math.floor(trend.length * 0.25), Math.floor(trend.length * 0.5), Math.floor(trend.length * 0.75), trend.length - 1];

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect   = e.currentTarget.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) * (W / rect.width);
    let nearest = 0; let nearestDist = Infinity;
    trend.forEach((_, i) => { const d = Math.abs(px(i) - mouseX); if (d < nearestDist) { nearestDist = d; nearest = i; } });
    setTooltip({ idx: nearest, x: px(nearest) });
  };

  const tt = tooltip !== null ? trend[tooltip.idx] : null;
  const ttPct = (tooltip?.idx ?? 0) / Math.max(trend.length - 1, 1);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <svg key={animKey.current} width="100%" viewBox={`0 0 ${W} ${H}`}
        style={{ display: 'block', overflow: 'visible' }}
        onMouseMove={handleMouseMove} onMouseLeave={() => setTooltip(null)}>
        <defs>
          {showClicks && (
            <linearGradient id="grad-c" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={greenRaw}  stopOpacity={isDark ? 0.18 : 0.12} />
              <stop offset="100%" stopColor={greenRaw}  stopOpacity={0} />
            </linearGradient>
          )}
          {showImps && (
            <linearGradient id="grad-i" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={indigoRaw} stopOpacity={isDark ? 0.15 : 0.1} />
              <stop offset="100%" stopColor={indigoRaw} stopOpacity={0} />
            </linearGradient>
          )}
          <clipPath id="chart-clip">
            <rect x={PAD.left} y={PAD.top} width={iW} height={iH + 4} />
          </clipPath>
        </defs>

        {yTicks.map((tick, i) => (
          <g key={i}>
            <line x1={PAD.left} y1={pyFor(tick, primaryScale)} x2={PAD.left + iW} y2={pyFor(tick, primaryScale)}
              stroke="var(--border)" strokeWidth="1" strokeDasharray={i === 0 ? 'none' : '3 4'} opacity={i === 0 ? 1 : 0.7} />
            <text x={PAD.left - 8} y={pyFor(tick, primaryScale) + 4} textAnchor="end" fontSize="9"
              fill="var(--text-faint)" fontFamily="'Geist Mono', monospace">
              {tick >= 1000 ? `${(tick / 1000).toFixed(0)}k` : Math.round(tick)}
            </text>
          </g>
        ))}

        {xIdxs.map(i => (
          <text key={i} x={px(i)} y={H - 8} textAnchor="middle" fontSize="9"
            fill="var(--text-faint)" fontFamily="'Geist Mono', monospace">
            {trend[i].date.slice(5)}
          </text>
        ))}

        {showImps && mounted && (
          <>
            <path d={buildArea(impVals, iScale)} fill="url(#grad-i)" clipPath="url(#chart-clip)" className="chart-area-animated" />
            <path d={buildPath(impVals, iScale)} fill="none" stroke="var(--chart-indigo)" strokeWidth="1.5"
              strokeLinejoin="round" strokeLinecap="round" clipPath="url(#chart-clip)"
              className="chart-line-animated" style={{ '--dash-total': iLen } as React.CSSProperties} />
          </>
        )}

        {showClicks && mounted && (
          <>
            <path d={buildArea(clickVals, cScale)} fill="url(#grad-c)" clipPath="url(#chart-clip)" className="chart-area-animated" />
            <path d={buildPath(clickVals, cScale)} fill="none" stroke="var(--chart-green)" strokeWidth="2"
              strokeLinejoin="round" strokeLinecap="round" clipPath="url(#chart-clip)"
              className="chart-line-animated" style={{ '--dash-total': cLen } as React.CSSProperties} />
          </>
        )}

        {tooltip && (
          <>
            <line x1={tooltip.x} y1={PAD.top} x2={tooltip.x} y2={PAD.top + iH}
              stroke="var(--border-hover)" strokeWidth="1" />
            {showClicks && (
              <circle cx={tooltip.x} cy={pyFor(trend[tooltip.idx].clicks, cScale)} r="4"
                fill="var(--chart-green)" stroke="var(--bg-card)" strokeWidth="2.5" />
            )}
            {showImps && (
              <circle cx={tooltip.x} cy={pyFor(trend[tooltip.idx].impressions, iScale)} r="4"
                fill="var(--chart-indigo)" stroke="var(--bg-card)" strokeWidth="2.5" />
            )}
          </>
        )}
      </svg>

      {tt && (
        <div style={{
          position: 'absolute', top: '10px',
          left: `${Math.min(Math.max(ttPct * 100, 10), 78)}%`,
          transform: 'translateX(-50%)',
          background: 'var(--bg-inner2)', border: '1px solid var(--border-hover)',
          borderRadius: '10px', padding: '8px 12px',
          fontSize: '12px', color: 'var(--text-secondary)',
          pointerEvents: 'none', whiteSpace: 'nowrap',
          boxShadow: 'var(--shadow)', zIndex: 10,
          backdropFilter: 'blur(8px)',
        }}>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '5px', letterSpacing: '0.02em', fontFamily: "'Geist Mono', monospace" }}>{tt.date}</div>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            {showClicks && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--chart-green)', flexShrink: 0 }} />
                <span style={{ color: 'var(--chart-green)', fontWeight: 700, fontSize: '13px' }}>{fmt(tt.clicks)}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>klikk</span>
              </div>
            )}
            {showImps && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--chart-indigo)', flexShrink: 0 }} />
                <span style={{ color: 'var(--chart-indigo)', fontWeight: 700, fontSize: '13px' }}>{fmt(tt.impressions)}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>megj.</span>
              </div>
            )}
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

  useEffect(() => {
    if (isMock) {
      setTimeout(() => { setQueries(MOCK_QUERIES); setLoading(false); }, 300);
      return;
    }
    fetch('/api/marketing-metrics/gsc-queries', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug }),
    }).then(r => r.json()).then(d => { setQueries(d.queries || []); setLoading(false); }).catch(() => setLoading(false));
  }, [slug, isMock]);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)' }} onClick={onClose}>
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0, width: '360px',
        background: 'var(--bg-card)', borderLeft: '1px solid var(--border)',
        padding: '24px', overflowY: 'auto', boxShadow: '-16px 0 48px rgba(0,0,0,0.2)',
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>Keresési kifejezések</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '3px', fontFamily: "'Geist Mono', monospace" }}>{slug}</div>
          </div>
          <button onClick={onClose} style={{ background: 'var(--bg-inner)', border: '1px solid var(--border)', color: 'var(--text-muted)', cursor: 'pointer', borderRadius: '8px', width: '32px', height: '32px', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
        </div>

        {loading ? (
          <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Betöltés...</div>
        ) : queries.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', padding: '32px 0' }}>Nincs adat.</div>
        ) : queries.map((q, i) => (
          <div key={i} style={{ padding: '12px 14px', borderRadius: '10px', background: 'var(--bg-inner)', marginBottom: '7px', border: '1px solid var(--border)', transition: 'border-color 120ms' }}>
            <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '10px', lineHeight: 1.4 }}>{q.query}</div>
            <div style={{ display: 'flex', gap: '20px' }}>
              {[
                { l: 'Klikk',      v: q.clicks,         c: 'var(--chart-green)' },
                { l: 'Megjelenés', v: q.impressions,     c: 'var(--text-muted)' },
                { l: 'Pozíció',    v: `#${q.position}`,  c: posColor(q.position) },
              ].map(x => (
                <div key={x.l}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: x.c, letterSpacing: '-0.3px' }}>{x.v}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-faint)', marginTop: '1px' }}>{x.l}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Main App ─────────────────────────────────────────────────────────────────
export const App = () => {
  const [items,        setItems]        = useState<PageAudit[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [filter,       setFilter]       = useState('all');
  const [activeTab,    setActiveTab]    = useState<'audit' | 'analytics'>('audit');
  const [gscData,      setGscData]      = useState<Record<string, GscPageData>>({});
  const [trend,        setTrend]        = useState<TrendPoint[]>([]);
  const [topPages,     setTopPages]     = useState<TopPage[]>([]);
  const [trendMetric,  setTrendMetric]  = useState<'clicks' | 'impressions' | 'dual'>('dual');
  const [gscConnected, setGscConnected] = useState(false);
  const [gscLoading,   setGscLoading]   = useState(false);
  const [drawerSlug,   setDrawerSlug]   = useState<string | null>(null);
  const [trendDays,    setTrendDays]    = useState(28);
  const [isDark,       setIsDark]       = useState(true);
  const [isMock,       setIsMock]       = useState(USE_MOCK);
  const [auditLayout,  setAuditLayout]  = useState<'table' | 'rich'>('rich');

  // ── Theme observer ────────────────────────────────────────────────────────
  useEffect(() => {
    const apply = () => {
      const theme = getStrapiTheme();
      applyTokens(theme);
      setIsDark(theme === 'dark');
    };
    apply();
    const obs = new MutationObserver(apply);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] });
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    mq.addEventListener('change', apply);
    return () => { obs.disconnect(); mq.removeEventListener('change', apply); };
  }, []);

  // ── SEO audit ─────────────────────────────────────────────────────────────
  useEffect(() => {
    Promise.all(
      SOURCES.map(src =>
        fetch(src.endpoint).then(r => r.json()).then(data => {
          if (src.single) {
            const item = data.data; if (!item) return [];
            return [auditItem(item, src.titleField, src.label, src.uid, true)];
          }
          return (data.data || []).map((item: any) => auditItem(item, src.titleField, src.label, src.uid, false));
        }).catch(() => [])
      )
    ).then(results => { setItems(results.flat()); setLoading(false); });
  }, []);

  // ── GSC init ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (USE_MOCK) {
      setGscConnected(true);
      loadAllGscData(true);
      return;
    }
    fetch('/api/marketing-metrics/gsc-status')
      .then(r => r.json())
      .then(d => { setGscConnected(d.connected); if (d.connected) loadAllGscData(false); })
      .catch(() => {});
  }, []);

  const loadAllGscData = useCallback(async (mock: boolean = isMock) => {
    setGscLoading(true);
    try {
      if (mock) {
        await new Promise(r => setTimeout(r, 400));
        const [pd, td, tp] = await Promise.all([
          gscFetch.data(),
          gscFetch.trend(trendDays),
          gscFetch.topPages(),
        ]);
        // normalizeGscData: mock adatok már path formátumban vannak, de egységesség kedvéért
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
        // ── KULCS JAVÍTÁS: GSC teljes URL-eket ad vissza, normalizáljuk path-ra ──
        // Pl. "https://davelopment.hu/kapcsolat" → "/kapcsolat"
        if (pd.ok) setGscData(normalizeGscData(pd.data));
        if (td.ok) setTrend(td.trend);
        if (tp.ok) setTopPages(tp.pages);
      }
    } catch {}
    setGscLoading(false);
  }, [trendDays, isMock]);

  useEffect(() => { if (gscConnected) loadAllGscData(); }, [trendDays]);

  // ── Derived ───────────────────────────────────────────────────────────────
  const filtered         = filter === 'all' ? items : items.filter(i => i.type === filter);
  const ok               = items.filter(p => p.score === 100).length;
  const bad              = items.filter(p => p.issues.length > 0).length;
  const avgScore         = items.length ? Math.round(items.reduce((a, b) => a + b.score, 0) / items.length) : 0;
  const totalClicks      = Object.values(gscData).reduce((a, b) => a + b.clicks, 0);
  const totalImpressions = Object.values(gscData).reduce((a, b) => a + b.impressions, 0);
  const avgPos           = Object.values(gscData).length ? Object.values(gscData).reduce((a, b) => a + b.position, 0) / Object.values(gscData).length : 0;

  const half = Math.floor(trend.length / 2);
  const prev = trend.slice(0, half);
  const curr = trend.slice(half);
  const prevClicks = prev.reduce((a, b) => a + b.clicks, 0);
  const currClicks = curr.reduce((a, b) => a + b.clicks, 0);
  const prevImps   = prev.reduce((a, b) => a + b.impressions, 0);
  const currImps   = curr.reduce((a, b) => a + b.impressions, 0);
  const clicksChange = pct(currClicks, prevClicks);
  const impsChange   = pct(currImps,   prevImps);

  const card: React.CSSProperties   = { background: 'var(--bg-card)',    border: '1px solid var(--border)', borderRadius: '12px', padding: '20px 24px', boxShadow: 'var(--shadow)' };

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
              {IS_DEV && (
                <span className="mock-badge" style={{ fontSize: '10px', color: 'var(--accent-amber)', background: 'rgba(240,199,66,0.1)', border: '1px solid rgba(240,199,66,0.25)', padding: '1px 7px', borderRadius: '20px', fontWeight: 600 }}>
                  DEV · MOCK
                </span>
              )}
              {IS_DEV && (
                <button
                  onClick={() => {
                    const next = !isMock;
                    localStorage.setItem('seo_force_prod', next ? 'false' : 'true');
                    window.location.reload();
                  }}
                  title={isMock ? 'Átváltás prod módra (valódi API)' : 'Átváltás mock módra'}
                  style={{
                    fontSize: '10px', fontWeight: 600, cursor: 'pointer',
                    padding: '1px 8px', borderRadius: '20px', border: '1px solid',
                    borderColor: isMock ? 'rgba(124,106,247,0.35)' : 'rgba(61,255,160,0.35)',
                    color:       isMock ? 'var(--accent-indigo)' : 'var(--accent-green)',
                    background:  isMock ? 'rgba(124,106,247,0.08)' : 'rgba(61,255,160,0.08)',
                    transition: 'all 150ms',
                  }}>
                  {isMock ? '⇄ prod nézet' : '⇄ mock nézet'}
                </button>
              )}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {gscConnected ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 12px', background: 'rgba(61,255,160,0.06)', border: '1px solid rgba(61,255,160,0.18)', borderRadius: '20px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-green)', boxShadow: '0 0 5px var(--accent-green)' }} />
                <span style={{ fontSize: '12px', color: 'var(--accent-green)', fontWeight: 500 }}>
                  {isMock ? 'Search Console (mock)' : 'Search Console'}
                </span>
                {!IS_DEV && (
                  <button onClick={async () => {
                    await fetch('/api/marketing-metrics/gsc-disconnect', { method: 'POST' });
                    setGscConnected(false); setGscData({}); setTrend([]); setTopPages([]);
                  }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '14px', padding: 0, lineHeight: 1 }}>×</button>
                )}
              </div>
            ) : (
              <button onClick={() => window.location.href = '/api/marketing-metrics/gsc-auth'}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 13px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 500, cursor: 'pointer', transition: 'all 120ms' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                Search Console csatlakoztatás
              </button>
            )}
          </div>
        </div>

        {/* ── Tab nav ── */}
        <div style={{ display: 'flex', gap: '2px', marginBottom: '20px', background: 'var(--bg-inner)', padding: '3px', borderRadius: '10px', width: 'fit-content', border: '1px solid var(--border)' }}>
          {[{ k: 'audit', l: 'SEO Audit' }, { k: 'analytics', l: 'Analytics' }].map(t => (
            <button key={t.k} onClick={() => setActiveTab(t.k as any)}
              className={`tab-btn${activeTab === t.k ? ' active' : ''}`}>{t.l}</button>
          ))}
        </div>

        {/* ── Summary cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(138px, 1fr))', gap: '10px', marginBottom: '20px' }}>
          {[
            { l: 'Összes',    v: items.length,   sub: 'tartalom',     c: 'var(--text-primary)',   tip: '' },
            { l: 'Rendben',   v: ok,             sub: `${Math.round(ok / Math.max(items.length,1)*100)}%`, c: 'var(--accent-green)', tip: '' },
            { l: 'Hiányos',   v: bad,            sub: 'figyelmeztet', c: 'var(--accent-red)',     tip: '' },
            { l: 'Átlag SEO', v: `${avgScore}%`, sub: 'score',        c: scoreColor(avgScore),    tip: '' },
            ...(gscConnected ? [
              { l: 'Klikk',         v: gscLoading ? '…' : fmt(totalClicks),      sub: `${trendDays} nap`, c: 'var(--chart-green)',  tip: 'Hányszor kattintottak az oldalaidra a Google keresésből.',                                               change: clicksChange, invert: false },
              { l: 'Megjelenés',    v: gscLoading ? '…' : fmt(totalImpressions), sub: `${trendDays} nap`, c: 'var(--chart-indigo)', tip: 'Hányszor jelent meg oldalad a Google találati listáján — kattintástól függetlenül.', change: impsChange,   invert: false },
              { l: 'Átlag pozíció', v: gscLoading || !avgPos ? '…' : `#${avgPos.toFixed(1)}`, sub: 'ranking', c: posColor(avgPos), tip: 'Az oldalaid átlagos Google-helyezése. Minél kisebb, annál jobb.', change: null, invert: true },
            ] : []),
          ].map((c: any, i) => (
            <div key={i} className="stat-card">
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap' }}>
                <div style={{ fontSize: '20px', fontWeight: 700, color: c.c, letterSpacing: '-0.5px', fontVariantNumeric: 'tabular-nums' }}>{c.v}</div>
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
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                </div>
                <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>Search Console nincs csatlakoztatva</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px', maxWidth: '320px', margin: '0 auto 24px', lineHeight: 1.6 }}>
                  Csatlakoztasd a GSC-t a klikk, megjelenés és pozíció adatok megtekintéséhez.
                </div>
                <button onClick={() => window.location.href = '/api/marketing-metrics/gsc-auth'}
                  style={{ padding: '9px 18px', background: 'var(--accent-green)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
                  Csatlakoztatás →
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

                {/* ── Trend chart ── */}
                <div style={card}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Forgalom trend</div>
                      {!gscLoading && trend.length > 0 && (
                        <div style={{ display: 'flex', gap: '16px' }}>
                          {(trendMetric === 'clicks' || trendMetric === 'dual') && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--chart-green)' }} />
                              <span style={{ fontSize: '12px', color: 'var(--chart-green)', fontWeight: 700 }}>{fmt(trend.reduce((a,b)=>a+b.clicks,0))}</span>
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>klikk</span>
                              <ChangeBadge value={clicksChange} />
                            </div>
                          )}
                          {(trendMetric === 'impressions' || trendMetric === 'dual') && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--chart-indigo)' }} />
                              <span style={{ fontSize: '12px', color: 'var(--chart-indigo)', fontWeight: 700 }}>{fmt(trend.reduce((a,b)=>a+b.impressions,0))}</span>
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>megjelenés</span>
                              <ChangeBadge value={impsChange} />
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                      {(['dual', 'clicks', 'impressions'] as const).map(m => (
                        <button key={m} onClick={() => setTrendMetric(m)} style={{
                          padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 500, cursor: 'pointer',
                          border: '1px solid',
                          borderColor: trendMetric === m ? 'var(--border-hover)' : 'var(--border)',
                          background:  trendMetric === m ? 'var(--bg-inner2)' : 'transparent',
                          color: trendMetric === m ? 'var(--text-primary)' : 'var(--text-muted)',
                          transition: 'all 120ms',
                        }}>
                          {m === 'dual' ? 'Mindkettő' : m === 'clicks' ? 'Klikk' : 'Megjelenés'}
                        </button>
                      ))}
                      <div style={{ width: '1px', height: '16px', background: 'var(--border)', margin: '0 2px' }} />
                      {[7, 28, 90].map(d => (
                        <button key={d} onClick={() => setTrendDays(d)} style={{
                          padding: '4px 9px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer',
                          border: '1px solid',
                          borderColor: trendDays === d ? 'var(--border-hover)' : 'transparent',
                          background:  trendDays === d ? 'var(--bg-inner2)' : 'transparent',
                          color: trendDays === d ? 'var(--text-secondary)' : 'var(--text-muted)',
                          transition: 'all 120ms',
                        }}>{d}n</button>
                      ))}
                    </div>
                  </div>

                  {gscLoading ? (
                    <div style={{ height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-faint)', fontSize: '12px' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px', animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                      Betöltés...
                    </div>
                  ) : (
                    <VercelChart trend={trend} metric={trendMetric} isDark={isDark} height={160} />
                  )}
                </div>

                {/* ── Top pages ── */}
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
                        <span style={{ flex: 1, fontSize: '10px', color: 'var(--text-faint)', fontFamily: "'Geist Mono', monospace" }}>OLDAL</span>
                        <span style={{ fontSize: '10px', color: 'var(--text-faint)', minWidth: '44px', textAlign: 'right' }}>KLIKK</span>
                        <span style={{ fontSize: '10px', color: 'var(--text-faint)', minWidth: '44px', textAlign: 'right' }}>POZÍCIÓ</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        {topPages.map((p, i) => {
                          const maxClicks = topPages[0]?.clicks || 1;
                          return (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 2px', borderRadius: '6px', transition: 'background 100ms' }}
                              onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-inner)')}
                              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                              <span style={{ fontSize: '11px', color: 'var(--text-faintest)', minWidth: '16px', textAlign: 'right', fontFamily: "'Geist Mono', monospace" }}>{i + 1}</span>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: "'Geist Mono', monospace", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.slug}</div>
                                <div style={{ marginTop: '4px', height: '3px', background: 'var(--bg-inner2)', borderRadius: '2px', overflow: 'hidden' }}>
                                  <div style={{ height: '100%', width: `${(p.clicks / maxClicks) * 100}%`, background: 'var(--chart-green)', borderRadius: '2px', transition: 'width 0.5s cubic-bezier(0.25,0.46,0.45,0.94)' }} />
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', flex: 1 }}>
                {['all', ...SOURCES.map(s => s.label)].map(tab => (
                  <button key={tab} onClick={() => setFilter(tab)} style={{
                    padding: '4px 11px', borderRadius: '6px', fontSize: '12px', fontWeight: 500, cursor: 'pointer',
                    border: '1px solid',
                    background:  filter === tab ? 'var(--bg-inner2)' : 'transparent',
                    borderColor: filter === tab ? 'var(--border-hover)' : 'var(--border)',
                    color:       filter === tab ? 'var(--text-primary)' : 'var(--text-muted)',
                    transition: 'all 100ms',
                  }}>
                    {tab === 'all' ? 'Összes' : tab}
                    {tab !== 'all' && (
                      <span style={{ marginLeft: '4px', fontSize: '10px', color: 'var(--text-faint)', fontFamily: "'Geist Mono', monospace" }}>
                        {items.filter(i => i.type === tab).length}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '4px', flexShrink: 0, background: 'var(--bg-inner)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <button className={`layout-btn${auditLayout === 'rich' ? ' active' : ''}`} onClick={() => setAuditLayout('rich')} title="Rich lista nézet">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="4" rx="1"/><rect x="3" y="10" width="18" height="4" rx="1"/><rect x="3" y="16" width="18" height="4" rx="1"/>
                  </svg>
                </button>
                <button className={`layout-btn${auditLayout === 'table' ? ' active' : ''}`} onClick={() => setAuditLayout('table')} title="Táblázat nézet">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/>
                  </svg>
                </button>
              </div>
            </div>

            {loading ? (
              <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-faint)', fontSize: '13px' }}>Betöltés...</div>
            ) : auditLayout === 'table' ? (
              <AuditTable items={filtered} gscData={gscData} gscConnected={gscConnected} onQueryClick={(slug) => setDrawerSlug(slug)} />
            ) : (
              <AuditRich items={filtered} gscData={gscData} gscConnected={gscConnected} onQueryClick={(slug) => setDrawerSlug(slug)} />
            )}
          </div>
        )}

        {drawerSlug && <QueryDrawer slug={drawerSlug} onClose={() => setDrawerSlug(null)} isMock={isMock} />}

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </>
  );
};
