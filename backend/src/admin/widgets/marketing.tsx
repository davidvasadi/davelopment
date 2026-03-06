// ./src/admin/widgets/marketing.tsx
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Types ────────────────────────────────────────────────────────────────────

interface GscStats {
  ok: boolean; totalClicks: number; totalImpressions: number;
  avgCtr: number; avgPosition: number; clicksDelta: number; impsDelta: number;
}
interface TrendPoint { date: string; clicks: number; impressions: number; position: number; }
interface TopPage { url: string; slug: string; clicks: number; impressions: number; position: number; }
interface TopQuery { query: string; clicks: number; impressions: number; position: number | string; }

// ─── Theme ────────────────────────────────────────────────────────────────────

const SOTET: Record<string, string> = {
  '--bg-page': '#030712', '--bg-card': '#0d1117', '--bg-inner': '#161b22',
  '--bg-inner2': '#21262d', '--border': '#21262d', '--border-hover': '#30363d',
  '--text-primary': '#f0f6fc', '--text-secondary': '#c9d1d9',
  '--text-muted': '#8b949e', '--text-faint': '#484f58',
  '--accent-green': '#3dffa0', '--accent-amber': '#f0c742',
  '--accent-red': '#f85149', '--accent-indigo': '#7c6af7',
};
const VILAGOS: Record<string, string> = {
  '--bg-page': '#fafafa', '--bg-card': '#ffffff', '--bg-inner': '#f5f5f5',
  '--bg-inner2': '#ebebeb', '--border': 'rgba(15,23,42,0.09)',
  '--border-hover': 'rgba(15,23,42,0.17)',
  '--text-primary': '#0b1220', '--text-secondary': '#1a2235',
  '--text-muted': 'rgba(17,24,39,0.58)', '--text-faint': 'rgba(17,24,39,0.35)',
  '--accent-green': '#059669', '--accent-amber': '#d97706',
  '--accent-red': '#dc2626', '--accent-indigo': '#4f46e5',
};

function getStrapiTema(): 'vilagos' | 'sotet' {
  const a = document.documentElement.getAttribute('data-theme');
  if (a === 'light') return 'vilagos';
  if (a === 'dark') return 'sotet';
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'vilagos' : 'sotet';
}
function alkalmazTokenek(t: 'vilagos' | 'sotet') {
  Object.entries(t === 'sotet' ? SOTET : VILAGOS).forEach(([k, v]) =>
    document.documentElement.style.setProperty(k, v)
  );
}

// ─── Animation variants ───────────────────────────────────────────────────────

const cardV = {
  hidden: { opacity: 0, y: 12, scale: 0.97 },
  show: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring' as const, stiffness: 400, damping: 30, delay: i * 0.06 },
  }),
};
const fadeUpV = {
  hidden: { opacity: 0, y: 8 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.22, delay: i * 0.04, ease: [0.25, 0.46, 0.45, 0.94] as any },
  }),
};

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `
  @keyframes mkt-spin { to { transform: rotate(360deg); } }
  .mkt-w * { box-sizing: border-box; }

  .mkt-sec {
    font-size: 9px; font-weight: 600; text-transform: uppercase;
    letter-spacing: 0.09em; color: var(--text-faint); margin-bottom: 7px;
    display: flex; align-items: center; gap: 5px;
  }
  .mkt-sec::after { content:''; flex:1; height:1px; background:var(--border); }
  .mkt-hr { height:1px; background:var(--border); }

  .mkt-kpi {
    background: var(--bg-inner); border: 0.5px solid var(--border);
    border-radius: 10px; padding: 10px 11px; flex: 1; min-width: 0; cursor: pointer;
    transition: border-color 120ms, background 120ms, box-shadow 120ms;
  }
  .mkt-kpi:hover { border-color: var(--border-hover); background: var(--bg-inner2); }
  .mkt-kpi.aktiv {
    border-color: var(--kpi-c, var(--accent-green));
    box-shadow: 0 0 0 1px var(--kpi-c, var(--accent-green));
    background: var(--bg-inner2);
  }

  .mkt-det {
    display: flex; justify-content: space-between; align-items: center;
    padding: 4px 0; border-bottom: 1px solid var(--border);
    font-size: 10.5px; min-height: 24px;
  }
  .mkt-det:last-child { border-bottom: none; }

  /* ── Frost Vercel tabs ── */
  .mkt-frost-tabs {
    display: flex;
    border-bottom: 1px solid var(--border);
    margin-bottom: 10px;
    gap: 0;
  }
  .mkt-frost-tab {
    font-family: inherit;
    font-size: 10px;
    font-weight: 400;
    letter-spacing: -0.01em;
    padding: 5px 8px;
    border: none;
    border-bottom: 2px solid transparent;
    background: transparent;
    cursor: pointer;
    margin-bottom: -1px;
    transition: color 0.15s, border-color 0.15s;
    outline: none;
    white-space: nowrap;
  }
  .mkt-frost-tab:hover { color: var(--text-secondary) !important; }

  .mkt-tab-scroll::-webkit-scrollbar { display: none; }

  .mkt-tip-icon {
    display: inline-flex; align-items: center; cursor: help; margin-left: 3px;
  }
  .mkt-portal-tip {
    position: fixed; z-index: 99999;
    background: var(--bg-inner2, #21262d); color: var(--text-secondary, #c9d1d9);
    font-size: 10px; line-height: 1.55; padding: 7px 10px;
    border-radius: 8px; border: 1px solid var(--border-hover, #30363d);
    box-shadow: 0 6px 24px rgba(0,0,0,0.5);
    pointer-events: none; width: 190px; word-break: break-word; white-space: normal;
  }

  @media (max-width: 500px) {
    .mkt-kpi-row { flex-wrap: wrap !important; }
    .mkt-kpi { min-width: calc(50% - 3px) !important; flex: none !important; }
    .mkt-kpi:last-child { min-width: 100% !important; }
    .mkt-ctr-body { flex-direction: column !important; }
    .mkt-ctr-left {
      width: 100% !important; flex-direction: row !important;
      align-items: center !important; gap: 12px !important;
    }
    .mkt-detail-box { margin-top: 0 !important; flex: 1; min-width: 0; }
  }
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M`
    : n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

const posColor = (p: number) =>
  p > 0 && p <= 3 ? 'var(--accent-green)' : p <= 10 ? 'var(--accent-amber)' : 'var(--text-muted)';

// ─── Tooltip — React Portal ───────────────────────────────────────────────────

const Tip = ({ t }: { t: string }) => {
  const iconRef = useRef<HTMLSpanElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const show = () => {
    if (!iconRef.current) return;
    const r = iconRef.current.getBoundingClientRect();
    setPos({ x: r.left + r.width / 2, y: r.top - 10 });
  };
  return (
    <>
      <span ref={iconRef} className="mkt-tip-icon" onMouseEnter={show} onMouseLeave={() => setPos(null)}>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--text-faint)" strokeWidth="2.5">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      </span>
      {pos && createPortal(
        <div className="mkt-portal-tip" style={{ left: pos.x, top: pos.y, transform: 'translate(-50%, -100%)' }}>{t}</div>,
        document.body
      )}
    </>
  );
};

// ─── Delta badge ──────────────────────────────────────────────────────────────

const Delta = ({ v, inv }: { v: number; inv?: boolean }) => {
  const pos = inv ? v < 0 : v > 0;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '2px', fontSize: '9px', fontWeight: 500,
      color: pos ? 'var(--accent-green)' : v === 0 ? 'var(--text-faint)' : 'var(--accent-red)',
      background: pos ? 'rgba(61,255,160,0.07)' : v === 0 ? 'transparent' : 'rgba(248,81,73,0.07)',
      padding: '1px 5px', borderRadius: '20px', whiteSpace: 'nowrap',
    }}>
      {v > 0 ? '↑' : v < 0 ? '↓' : '—'}{Math.abs(v)}%
    </span>
  );
};

// ─── Sparkline ────────────────────────────────────────────────────────────────

const Spark = ({ data, color, w = 38, h = 16 }: { data: number[]; color: string; w?: number; h?: number }) => {
  const [go, setGo] = useState(false);
  useEffect(() => { const t = setTimeout(() => setGo(true), 80); return () => clearTimeout(t); }, []);
  if (data.length < 2) return null;
  const max = Math.max(...data, 1);
  const px = (i: number) => (i / (data.length - 1)) * w;
  const py = (v: number) => h - (v / max) * (h - 2) - 1;
  const path = data.map((v, i) => `${i === 0 ? 'M' : 'L'}${px(i).toFixed(1)},${py(v).toFixed(1)}`).join(' ');
  const len = Math.round(data.reduce((a, v, i) => {
    if (!i) return 0;
    const dx = px(i) - px(i - 1), dy = py(v) - py(data[i - 1]);
    return a + Math.sqrt(dx * dx + dy * dy);
  }, 0));
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block', overflow: 'hidden', flexShrink: 0 }}>
      {go && <path d={path} fill="none" stroke={color} strokeWidth="0.75" strokeLinejoin="round" strokeLinecap="round"
        style={{ strokeDasharray: len, strokeDashoffset: len, animation: `sk-draw 0.9s cubic-bezier(.25,.46,.45,.94) forwards` }} />}
      <style>{`@keyframes sk-draw{to{stroke-dashoffset:0}}`}</style>
    </svg>
  );
};

// ─── Smooth path helper ───────────────────────────────────────────────────────

function smoothPath(pts: [number, number][]): string {
  if (pts.length < 2) return '';
  if (pts.length === 2) return `M${pts[0][0]},${pts[0][1]} L${pts[1][0]},${pts[1][1]}`;
  let d = `M${pts[0][0].toFixed(2)},${pts[0][1].toFixed(2)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(i + 2, pts.length - 1)];
    const t = 0.15;
    const cp1x = p1[0] + (p2[0] - p0[0]) * t, cp1y = p1[1] + (p2[1] - p0[1]) * t;
    const cp2x = p2[0] - (p3[0] - p1[0]) * t, cp2y = p2[1] - (p3[1] - p1[1]) * t;
    d += ` C${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${p2[0].toFixed(2)},${p2[1].toFixed(2)}`;
  }
  return d;
}

// ─── Frost Grafikon ───────────────────────────────────────────────────────────

interface GrafikonSeries { data: number[]; color: string; label: string; }

const FrostGrafikon = ({ series, trend, tab, h = 110 }: {
  series: GrafikonSeries[]; trend: TrendPoint[]; tab: string; h?: number;
}) => {
  const uid = useRef(0);
  const [progress, setProgress] = useState(0);
  const [tt, setTt] = useState<number | null>(null);
  const raf = useRef<number>(0);
  const key = series.map(s => s.label + s.data.length).join('|');

  useEffect(() => {
    uid.current++; setProgress(0); setTt(null);
    const start = performance.now(), dur = 1000;
    const ease = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      setProgress(ease(p));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [key]);

  if (!series.length || series[0].data.length < 2) return (
    <div style={{ height: h, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontSize: '11px', color: 'var(--text-faint)' }}>Nincs adat</span>
    </div>
  );

  // single-series mode when tab !== 'all'
  const isSingle = tab !== 'all';
  const primary = series[0];

  const W = 300, H = h;
  const PL = isSingle ? 28 : 4, PR = 4, PT = 8, PB = 16;
  const iW = W - PL - PR, iH = H - PT - PB;
  const baseY = PT + iH;
  const n = series[0].data.length;
  const px = (i: number) => PL + (i / (n - 1)) * iW;

  // for single series: real min/max range
  const buildSingle = (data: number[]) => {
    const max = Math.max(...data, 1);
    const min = Math.min(...data, 0);
    const range = max - min || 1;
    const py = (v: number) => PT + iH - ((v - min) / range) * iH;
    const pts: [number, number][] = data.map((v, i) => [px(i), py(v)]);
    const vis = pts.slice(0, Math.max(2, Math.ceil(progress * (n - 1)) + 1));
    const line = smoothPath(vis);
    const area = vis.length >= 2 ? `${line} L${vis[vis.length - 1][0]},${baseY} L${PL},${baseY} Z` : '';
    return { line, area, py, max, min, range };
  };

  // for multi: normalized 0-max
  const buildMulti = (data: number[]) => {
    const max = Math.max(...data, 1);
    const py = (v: number) => Math.min(PT + iH - (v / max) * iH, baseY);
    const pts: [number, number][] = data.map((v, i) => [px(i), py(v)]);
    const vis = pts.slice(0, Math.max(2, Math.ceil(progress * (n - 1)) + 1));
    const line = smoothPath(vis);
    const area = vis.length >= 2 ? `${line} L${vis[vis.length - 1][0]},${baseY} L${PL},${baseY} Z` : '';
    return { line, area, py, max, min: 0, range: max };
  };

  const built = series.map(s => {
    const b = isSingle ? buildSingle(s.data) : buildMulti(s.data);
    return { ...b, color: s.color, label: s.label, data: s.data };
  });

  // Y ticks — only in single mode
  const yTicks = isSingle ? (() => {
    const { min, max } = built[0];
    return [min, min + (max - min) * 0.5, max].map(v => ({
      v: tab === 'position' ? v.toFixed(1) : Math.round(v) >= 1000 ? `${(Math.round(v) / 1000).toFixed(1)}k` : String(Math.round(v)),
      y: built[0].py(v),
    }));
  })() : [];

  // X axis date labels from trend
  const xDates = trend.length >= n
    ? [0, Math.floor((n - 1) / 2), n - 1].map(i => {
        const raw = trend[i]?.date;
        if (!raw) return '';
        const d = new Date(raw);
        return d.toLocaleDateString('hu-HU', { month: 'short', day: 'numeric' });
      })
    : [`–${n - 1}n`, `–${Math.floor((n - 1) / 2)}n`, 'ma'];

  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const mx = (e.clientX - r.left) * (W / r.width);
    let ni = 0, nd = Infinity;
    for (let i = 0; i < n; i++) { const dd = Math.abs(px(i) - mx); if (dd < nd) { nd = dd; ni = i; } }
    setTt(ni);
  };

  // hover date
  const hovDate = tt !== null && trend[tt]?.date
    ? new Date(trend[tt].date).toLocaleDateString('hu-HU', { month: 'short', day: 'numeric' })
    : null;

  return (
    <div style={{ position: 'relative', userSelect: 'none' }}>
      <svg key={uid.current} width="100%" viewBox={`0 0 ${W} ${H}`}
        style={{ display: 'block', overflow: 'hidden', cursor: 'crosshair' }}
        onMouseMove={onMove} onMouseLeave={() => setTt(null)}>
        <defs>
          {built.map((s, i) => (
            <linearGradient key={i} id={`fg${uid.current}_${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity={0.12} />
              <stop offset="100%" stopColor={s.color} stopOpacity={0} />
            </linearGradient>
          ))}
          <clipPath id={`fc${uid.current}`}>
            <rect x={PL} y={PT} width={iW} height={iH} />
          </clipPath>
        </defs>

        {/* Y grid + labels (single mode) */}
        {isSingle && yTicks.map((tk, i) => (
          <g key={i}>
            <line x1={PL} y1={tk.y} x2={PL + iW} y2={tk.y}
              stroke="var(--border)" strokeWidth="0.5"
              strokeDasharray={i === 0 ? 'none' : '3 5'} opacity={i === 0 ? 1 : 0.5} />
            <text x={PL - 4} y={tk.y + 3.5} textAnchor="end" fontSize="6.5"
              fill="var(--text-faint)" style={{ fontFamily: '-apple-system,sans-serif' }}>
              {tk.v}
            </text>
          </g>
        ))}

        {/* multi mode: subtle grid only */}
        {!isSingle && [0.33, 0.66].map((t, i) => (
          <line key={i} x1={PL} y1={PT + (1 - t) * iH} x2={PL + iW} y2={PT + (1 - t) * iH}
            stroke="var(--border)" strokeWidth="0.5" opacity="0.5" />
        ))}

        {/* area + line */}
        {built.map((s, i) => (
          <g key={i}>
            {s.area && <path d={s.area} fill={`url(#fg${uid.current}_${i})`} clipPath={`url(#fc${uid.current})`} />}
            {s.line && <path d={s.line} fill="none" stroke={s.color} strokeWidth={isSingle ? '1' : '0.75'}
              strokeLinejoin="round" strokeLinecap="round" clipPath={`url(#fc${uid.current})`} />}
          </g>
        ))}

        {/* hover crosshair */}
        {tt !== null && (
          <>
            <line x1={px(tt)} y1={PT} x2={px(tt)} y2={baseY}
              stroke="var(--border-hover)" strokeWidth="1" />
            {built.map((s, i) => (
              <circle key={i} cx={px(tt)} cy={Math.min(s.py(s.data[tt]), baseY - 1)}
                r={isSingle ? 4 : 2.5} fill={s.color} stroke="var(--bg-card)" strokeWidth="2" />
            ))}
          </>
        )}

        {/* end dot (single mode) */}
        {isSingle && progress >= 0.99 && tt === null && (
          <circle cx={px(n - 1)} cy={built[0].py(built[0].data[n - 1])}
            r="3.5" fill={built[0].color} stroke="var(--bg-card)" strokeWidth="2" />
        )}

        {/* X axis date labels */}
        {[0, Math.floor((n - 1) / 2), n - 1].map((i, li) => (
          <text key={i} x={px(i)} y={H - 3} textAnchor="middle" fontSize="7"
            fill="var(--text-faint)" style={{ fontFamily: '-apple-system,sans-serif' }}>
            {xDates[li]}
          </text>
        ))}
      </svg>

      {/* tooltip */}
      {tt !== null && (
        <div style={{
          position: 'absolute', top: 0,
          left: `${Math.min(Math.max((tt / (n - 1)) * 100, 5), 80)}%`,
          transform: 'translateX(-50%)',
          background: 'var(--bg-inner)', border: '0.5px solid var(--border-hover)',
          borderRadius: '8px', padding: '6px 10px',
          pointerEvents: 'none', whiteSpace: 'nowrap',
          boxShadow: '0 4px 20px rgba(0,0,0,0.22)', zIndex: 20,
          display: 'flex', flexDirection: 'column', gap: '3px',
        }}>
          {hovDate && (
            <div style={{ fontSize: '9px', color: 'var(--text-faint)', marginBottom: '2px' }}>{hovDate}</div>
          )}
          {built.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: s.color, flexShrink: 0 }} />
              <span style={{ fontSize: '12px', fontWeight: 600, color: s.color, letterSpacing: '-0.02em' }}>
                {tab === 'position' ? `#${s.data[tt].toFixed(1)}` : fmt(s.data[tt])}
              </span>
              <span style={{ fontSize: '9px', color: 'var(--text-faint)' }}>{s.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── CTR Arc ─────────────────────────────────────────────────────────────────

const CtrArc = ({ ctr, max = 25 }: { ctr: number; max?: number }) => {
  const r = 30, cx = 40, cy = 38;
  const path = `M ${cx - r},${cy} A ${r},${r} 0 0 1 ${cx + r},${cy}`;
  const circ = Math.PI * r;
  const filled = Math.min(Math.max(ctr / max, 0), 1) * circ;
  const color = ctr >= 15 ? 'var(--accent-green)' : ctr >= 5 ? 'var(--accent-amber)' : 'var(--accent-indigo)';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <motion.svg width={80} height={44} viewBox="0 0 80 44" style={{ display: 'block', overflow: 'visible' }}
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28, delay: 0.3 }}>
        <path d={path} fill="none" stroke="var(--bg-inner2)" strokeWidth="5" strokeLinecap="round" />
        <motion.path d={path} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"
          strokeDasharray={`${filled} ${circ}`}
          initial={{ strokeDashoffset: filled }} animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.45 }} />
      </motion.svg>
      <motion.div style={{ marginTop: '-8px', textAlign: 'center', lineHeight: 1 }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <div style={{ fontSize: '14px', fontWeight: 700, color, fontFamily: 'ui-monospace, monospace', letterSpacing: '-0.3px' }}>
          {ctr.toFixed(1)}%
        </div>
        <div style={{ fontSize: '8px', color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '2px' }}>CTR</div>
      </motion.div>
    </div>
  );
};

// ─── KPI Card ─────────────────────────────────────────────────────────────────

const KpiCard = ({ label, value, display, color, spark, delta, tip, active, onClick, invDelta, index }: {
  label: string; value: number; display?: string; color: string; spark: number[];
  delta?: number; tip?: string; active: boolean; onClick: () => void; invDelta?: boolean; index: number;
}) => (
  <motion.div
    className={`mkt-kpi${active ? ' aktiv' : ''}`}
    style={{ '--kpi-c': color } as React.CSSProperties & { '--kpi-c': string }}
    onClick={onClick}
    custom={index} variants={cardV} initial="hidden" animate="show"
    whileHover={{ y: -1, transition: { duration: 0.12 } }}
    whileTap={{ scale: 0.97 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
      <span style={{ fontSize: '9px', color: active ? color : 'var(--text-faint)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', display: 'flex', alignItems: 'center', transition: 'color 120ms' }}>
        {label}{tip && <Tip t={tip} />}
      </span>
      <Spark data={spark} color={color} />
    </div>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px', marginBottom: delta != null ? '4px' : 0 }}>
      <span style={{ fontSize: '17px', fontWeight: 700, color, fontFamily: 'ui-monospace, monospace', letterSpacing: '-0.4px', lineHeight: 1 }}>
        {display ?? fmt(value)}
      </span>
    </div>
    {delta != null && <Delta v={delta} inv={invDelta} />}
  </motion.div>
);

// ─── Top Pages ────────────────────────────────────────────────────────────────

const TopPages = ({ pages }: { pages: TopPage[] }) => {
  if (!pages.length) return null;
  const maxC = pages[0]?.clicks || 1;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      {pages.slice(0, 5).map((p, i) => (
        <motion.div key={i} custom={i} variants={fadeUpV} initial="hidden" animate="show"
          style={{ display: 'grid', gridTemplateColumns: '14px 1fr 36px 42px', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '9px', color: 'var(--text-faint)', fontFamily: 'monospace', textAlign: 'right' }}>{i + 1}</span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)', fontFamily: 'ui-monospace, monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {p.slug || '/'}
            </div>
            <div style={{ marginTop: '2px', height: '2px', background: 'var(--bg-inner2)', borderRadius: '2px', overflow: 'hidden' }}>
              <motion.div style={{ height: '100%', background: 'var(--accent-green)', borderRadius: '2px' }}
                initial={{ width: 0 }} animate={{ width: `${(p.clicks / maxC) * 100}%` }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }} />
            </div>
          </div>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent-green)', fontFamily: 'monospace', textAlign: 'right' }}>{fmt(p.clicks)}</span>
          <span style={{ fontSize: '11px', fontWeight: 600, color: posColor(p.position), fontFamily: 'monospace', textAlign: 'right' }}>#{p.position.toFixed(1)}</span>
        </motion.div>
      ))}
    </div>
  );
};

// ─── Top Queries ──────────────────────────────────────────────────────────────

const TopQueries = ({ queries }: { queries: TopQuery[] }) => {
  if (!queries.length) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {queries.slice(0, 5).map((q, i) => {
        const pos = typeof q.position === 'number' ? q.position : Number(q.position);
        return (
          <motion.div key={i} custom={i} variants={fadeUpV} initial="hidden" animate="show"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 8px', borderRadius: '7px', background: 'var(--bg-inner)', border: '0.5px solid var(--border)' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{q.query}</div>
            </div>
            <span style={{ fontSize: '10px', color: 'var(--accent-green)', fontFamily: 'monospace', fontWeight: 600, flexShrink: 0 }}>{fmt(q.clicks)}</span>
            <span style={{ fontSize: '10px', color: posColor(pos), fontFamily: 'monospace', fontWeight: 600, flexShrink: 0 }}>
              {Number.isFinite(pos) ? `#${pos.toFixed(1)}` : '—'}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
};

// ─── Chevron ──────────────────────────────────────────────────────────────────

const ChevronRight = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

// ─── Data loader ──────────────────────────────────────────────────────────────

async function loadGscData() {
  const [statusRes, trendRes, topRes] = await Promise.all([
    fetch('/api/marketing-metrics/gsc-status').then(r => r.json()),
    fetch('/api/marketing-metrics/gsc-trend?days=28').then(r => r.json()),
    fetch('/api/marketing-metrics/gsc-top-pages').then(r => r.json()),
  ]);
  if (!statusRes.connected) throw new Error('not_connected');
  const trendArr: TrendPoint[] = trendRes.ok ? (trendRes.trend || []) : [];
  const half = Math.floor(trendArr.length / 2);
  const prev = trendArr.slice(0, half), curr = trendArr.slice(half);
  const sumC = (a: TrendPoint[]) => a.reduce((s, b) => s + b.clicks, 0);
  const sumI = (a: TrendPoint[]) => a.reduce((s, b) => s + b.impressions, 0);
  const pC = sumC(prev), cC = sumC(curr), pI = sumI(prev), cI = sumI(curr);
  const totalClicks = sumC(trendArr), totalImps = sumI(trendArr);
  const avgCtr = totalImps > 0 ? (totalClicks / totalImps) * 100 : 0;
  const posList = trendArr.filter(t => t.position > 0).map(t => t.position);
  const avgPos = posList.length ? posList.reduce((a, b) => a + b, 0) / posList.length : 0;
  const clicksDelta = pC > 0 ? Math.round(((cC - pC) / pC) * 100) : 0;
  const impsDelta = pI > 0 ? Math.round(((cI - pI) / pI) * 100) : 0;
  const stats: GscStats = { ok: true, totalClicks, totalImpressions: totalImps, avgCtr, avgPosition: avgPos, clicksDelta, impsDelta };
  const pages: TopPage[] = topRes.ok ? (topRes.pages || []) : [];
  let queries: TopQuery[] = [];
  try {
    const qRes = await fetch('/api/marketing-metrics/gsc-queries', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: '/' }),
    }).then(r => r.json());
    queries = Array.isArray(qRes?.queries) ? qRes.queries : [];
  } catch { /* optional */ }
  return { stats, trend: trendArr, pages, queries };
}

// ─── Main Widget ──────────────────────────────────────────────────────────────

const MarketingWidget = () => {
  const [stats, setStats] = useState<GscStats | null>(null);
  const [trend, setTrend] = useState<TrendPoint[]>([]);
  const [pages, setPages] = useState<TopPage[]>([]);
  const [queries, setQueries] = useState<TopQuery[]>([]);
  const [loading, setLoading] = useState(true);
  const [notConnected, setNotConnected] = useState(false);
  const [tab, setTab] = useState<'all' | 'clicks' | 'impressions' | 'position'>('all');
  const [tema, setTema] = useState<'vilagos' | 'sotet'>('sotet');

  useEffect(() => {
    const apply = () => {
      const t = getStrapiTema();
      setTema(t);
      alkalmazTokenek(t);
    };
    apply();
    const obs = new MutationObserver(apply);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    let alive = true;
    loadGscData()
      .then(d => { if (!alive) return; setStats(d.stats); setTrend(d.trend); setPages(d.pages); setQueries(d.queries); })
      .catch(() => { if (alive) setNotConnected(true); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  if (loading) return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80px', color: 'var(--text-faint)', fontSize: '12px', gap: '8px' }}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'mkt-spin 1s linear infinite' }}>
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
      Betöltés...
    </motion.div>
  );

  if (notConnected || !stats) return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '20px 0', textAlign: 'center' }}>
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--text-faint)" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
      <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>Search Console nincs csatlakoztatva</span>
      <motion.a href="/admin/plugins/marketing-metrics" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
        style={{ fontSize: '11px', color: 'var(--accent-indigo)', textDecoration: 'none', padding: '5px 14px', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--bg-inner)', display: 'flex', alignItems: 'center', gap: '4px' }}>
        Csatlakoztatás <ChevronRight />
      </motion.a>
    </motion.div>
  );

  const isDark = tema === 'sotet';
  const maxPos = Math.max(...trend.map(t => t.position), 1);
  const clickSpark = trend.slice(-8).map(t => t.clicks);
  const impsSpark = trend.slice(-8).map(t => t.impressions);
  const posSpark = trend.slice(-8).map(t => t.position > 0 ? maxPos - t.position + 1 : 0);

  const S = {
    clicks:      { data: trend.map(t => t.clicks),                           color: 'var(--accent-green)',  label: 'klikk' },
    impressions: { data: trend.map(t => t.impressions),                       color: 'var(--accent-indigo)', label: 'megj.' },
    position:    { data: trend.map(t => t.position > 0 ? t.position : 0),    color: 'var(--accent-amber)',  label: 'poz.' },
  };

  // all nézetben invertált pozíció: kisebb helyezés → magasabb vonal
  const positionAllData = trend.map(t => t.position > 0 ? maxPos - t.position + 1 : 0);

  const chartSeries: GrafikonSeries[] =
    tab === 'all'           ? [S.clicks, S.impressions, { data: positionAllData, color: 'var(--accent-amber)', label: 'poz.' }]
    : tab === 'clicks'      ? [S.clicks]
    : tab === 'impressions' ? [S.impressions]
    :                         [S.position];

  // tab color tokens
  const TAB_DEFS = [
    { k: 'all' as const,         l: 'Összes',     c: isDark ? '#c9d1d9' : '#374151' },
    { k: 'clicks' as const,      l: 'Klikk',      c: 'var(--accent-green)'  },
    { k: 'impressions' as const, l: 'Megjelenés',  c: 'var(--accent-indigo)' },
    { k: 'position' as const,    l: 'Pozíció',    c: 'var(--accent-amber)'  },
  ];

  // single tab: delta + stats
  const singleData = tab !== 'all' ? S[tab].data : null;
  const singleFirst = singleData ? singleData[0] : 0;
  const singleLast = singleData ? singleData[singleData.length - 1] : 0;
  const singleDelta = singleFirst > 0 ? Math.round(((singleLast - singleFirst) / singleFirst) * 100) : 0;
  const singleDeltaPos = tab === 'position' ? singleDelta < 0 : singleDelta > 0;
  const singleAvg = singleData ? Math.round(singleData.reduce((a, b) => a + b, 0) / singleData.length * 10) / 10 : 0;
  const singleMax = singleData ? Math.max(...singleData) : 0;
  const singleMin = singleData ? Math.min(...singleData) : 0;
  const fmtSingle = (v: number) => tab === 'position' ? `#${v.toFixed(1)}` : fmt(v);

  return (
    <>
      <style>{CSS}</style>
      <div className="mkt-w" style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '2px' }}>

        {/* ── KPI kártyák ── */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}>
          <div className="mkt-sec">Google Search Console</div>
          <div className="mkt-kpi-row" style={{ display: 'flex', gap: '5px' }}>
            <KpiCard index={0} label="Klikk" value={stats.totalClicks} color="var(--accent-green)"
              spark={clickSpark} delta={stats.clicksDelta} active={tab === 'clicks'} onClick={() => setTab('clicks')}
              tip="Hányszor kattintottak az oldalra Google keresőből (28 nap)." />
            <KpiCard index={1} label="Megjelenés" value={stats.totalImpressions} color="var(--accent-indigo)"
              spark={impsSpark} delta={stats.impsDelta} active={tab === 'impressions'} onClick={() => setTab('impressions')}
              tip="Hányszor jelent meg az oldal a Google találati listáján (28 nap)." />
            <KpiCard index={2} label="Pozíció" value={0} display={`#${stats.avgPosition.toFixed(1)}`}
              color="var(--accent-amber)" spark={posSpark} active={tab === 'position'} onClick={() => setTab('position')}
              tip="Átlagos Google helyezés. Minél kisebb szám, annál jobb." invDelta />
          </div>
        </motion.div>

        <motion.div className="mkt-hr"
          initial={{ scaleX: 0, originX: '0%' }} animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }} />

        {/* ── CTR + Grafikon ── */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24, delay: 0.14, ease: [0.25, 0.46, 0.45, 0.94] }}>
          <div className="mkt-sec">CTR &amp; Grafikon</div>
          <div className="mkt-ctr-body" style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>

            {/* CTR bal oldal */}
            <div className="mkt-ctr-left" style={{ flexShrink: 0, width: 88, display: 'flex', flexDirection: 'column' }}>
              <CtrArc ctr={stats.avgCtr} max={25} />
              <motion.div className="mkt-detail-box"
                style={{ marginTop: '6px', background: 'var(--bg-inner)', border: '0.5px solid var(--border)', borderRadius: '8px', padding: '5px 8px' }}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.52, duration: 0.22 }}>
                <div className="mkt-det">
                  <span style={{ color: 'var(--text-faint)', fontSize: '10px', display: 'flex', alignItems: 'center' }}>Klikk<Tip t="Összes organikus klikk (28 nap)." /></span>
                  <span style={{ fontWeight: 600, color: 'var(--accent-green)', fontFamily: 'monospace', fontSize: '11px' }}>{fmt(stats.totalClicks)}</span>
                </div>
                <div className="mkt-det">
                  <span style={{ color: 'var(--text-faint)', fontSize: '10px', display: 'flex', alignItems: 'center' }}>Megj.<Tip t="Megjelenések száma Google találatokban (28 nap)." /></span>
                  <span style={{ fontWeight: 600, color: 'var(--accent-indigo)', fontFamily: 'monospace', fontSize: '11px' }}>{fmt(stats.totalImpressions)}</span>
                </div>
                <div className="mkt-det">
                  <span style={{ color: 'var(--text-faint)', fontSize: '10px', display: 'flex', alignItems: 'center' }}>Poz.<Tip t="Átlagos Google helyezés. Top 3 = zöld, top 10 = sárga." /></span>
                  <span style={{ fontWeight: 600, fontFamily: 'monospace', fontSize: '11px', color: posColor(stats.avgPosition) }}>#{stats.avgPosition.toFixed(1)}</span>
                </div>
              </motion.div>
            </div>

            {/* Grafikon jobb oldal */}
            <div style={{ flex: 1, minWidth: 0 }}>

              {/* ── Frost Vercel-style tabs ── */}
              <div className="mkt-frost-tabs">
                {TAB_DEFS.map((bt, i) => (
                  <motion.button
                    key={bt.k}
                    className="mkt-frost-tab"
                    onClick={() => setTab(bt.k)}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.04, duration: 0.16 }}
                    style={{
                      color: tab === bt.k ? bt.c : 'var(--text-faint)',
                      borderBottomColor: tab === bt.k ? bt.c : 'transparent',
                      fontWeight: tab === bt.k ? 500 : 400,
                    }}>
                    {bt.l}
                  </motion.button>
                ))}
              </div>

              {/* single tab: value + delta + mini stats sor */}
              {tab !== 'all' && singleData && (
                <motion.div
                  key={`stats-${tab}`}
                  initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18 }}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1 }}>
                      {fmtSingle(singleLast)}
                    </div>
                    <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span style={{
                        fontSize: 10, fontWeight: 500,
                        color: singleDeltaPos ? 'var(--accent-green)' : 'var(--accent-red)',
                        background: singleDeltaPos ? 'rgba(61,255,160,0.07)' : 'rgba(248,81,73,0.07)',
                        padding: '1px 7px', borderRadius: 20,
                      }}>
                        {singleDeltaPos ? '↑' : '↓'} {Math.abs(singleDelta)}%
                      </span>
                      <span style={{ fontSize: 9, color: 'var(--text-faint)' }}>előző időszakhoz</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 12, paddingBottom: 2 }}>
                    {[
                      { l: 'Max', v: fmtSingle(singleMax) },
                      { l: 'Min', v: fmtSingle(singleMin) },
                      { l: 'Átl', v: fmtSingle(singleAvg) },
                    ].map(s => (
                      <div key={s.l} style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 8, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.l}</div>
                        <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)', letterSpacing: '-0.01em' }}>{s.v}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* chart */}
              <AnimatePresence mode="wait">
                <motion.div key={tab}
                  initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -3 }}
                  transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}>
                  <FrostGrafikon series={chartSeries} trend={trend} tab={tab} h={tab !== 'all' ? 90 : 80} />
                </motion.div>
              </AnimatePresence>

              {/* all mode legend */}
              {tab === 'all' && (
                <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                  {[S.clicks, S.impressions, S.position].map(s => (
                    <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <div style={{ width: 12, height: 2, background: s.color, borderRadius: 1 }} />
                      <span style={{ fontSize: 8, color: 'var(--text-faint)', letterSpacing: '0.04em' }}>{s.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div className="mkt-hr"
          initial={{ scaleX: 0, originX: '0%' }} animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.32, ease: [0.25, 0.46, 0.45, 0.94] }} />

        {/* ── Top oldalak ── */}
        {pages.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, delay: 0.26, ease: [0.25, 0.46, 0.45, 0.94] }}>
            <div className="mkt-sec">
              Top oldalak
              <span style={{ fontSize: '8.5px', color: 'var(--text-faint)', fontFamily: 'monospace', background: 'var(--bg-inner2)', padding: '1px 5px', borderRadius: '4px', fontWeight: 400 }}>klikk · pozíció</span>
            </div>
            <TopPages pages={pages} />
          </motion.div>
        )}

        {/* ── Top keresések ── */}
        {queries.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, delay: 0.32, ease: [0.25, 0.46, 0.45, 0.94] }}>
            <div className="mkt-sec">Top keresések</div>
            <TopQueries queries={queries} />
          </motion.div>
        )}

        {/* ── Footer ── */}
        <motion.a href="/admin/plugins/marketing-metrics"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          whileHover={{ x: 2 }}
          style={{ fontSize: '10px', color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
          onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = 'var(--text-muted)')}>
          Megnyitás a Marketing Metrics pluginban <ChevronRight />
        </motion.a>

      </div>
    </>
  );
};

export default MarketingWidget;
