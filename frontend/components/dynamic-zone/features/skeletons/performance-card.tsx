'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const C = 2 * Math.PI * 34;
const ACCENT = '#60a5fa';

const categories = [
  { label: 'Sebesség',         sub: 'Oldalbetöltési idő · Next.js SSG',   score: 98  },
  { label: 'Hozzáférhetőség', sub: 'ARIA · kontraszt · billentyűzet',     score: 100 },
  { label: 'Bevált módszerek',sub: 'HTTPS · modern API-k · biztonság',    score: 100 },
  { label: 'SEO pontszám',    sub: 'Meta · strukturált adat · crawlable', score: 100 },
];

const vitals = [
  { label: 'FCP', full: 'First Contentful Paint',  value: '0.8s',  pct: 92  },
  { label: 'LCP', full: 'Largest Contentful Paint', value: '1.2s',  pct: 96  },
  { label: 'CLS', full: 'Cumulative Layout Shift',  value: '0.00',  pct: 100 },
  { label: 'TTI', full: 'Time to Interactive',      value: '1.4s',  pct: 88  },
  { label: 'TBT', full: 'Total Blocking Time',      value: '12ms',  pct: 95  },
];

const optimizations = [
  { label: 'Képek WebP formátumban',  sub: 'Átlag 68% méretcsökkentés', gain: '+8' },
  { label: 'CSS bundle tömörítve',    sub: '142 KB → 38 KB · gzip',     gain: '+5' },
  { label: 'Képek lazy loadingja',    sub: 'Below-the-fold tartalom',    gain: '+4' },
  { label: 'Service Worker cache',    sub: 'Offline elérés támogatva',   gain: '+3' },
];

export const performanceTabs = [
  {
    key: 'categories' as const,
    label: 'Kategóriák',
    icon: <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  },
  {
    key: 'vitals' as const,
    label: 'Web Vitals',
    icon: <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  },
  {
    key: 'optimization' as const,
    label: 'Optimalizáció',
    icon: <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  },
];

type View = 'categories' | 'vitals' | 'optimization';

function useCount(to: number, delay = 300, duration = 1400) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        setV(Math.round((1 - Math.pow(1 - p, 3)) * to));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(t);
  }, [to, delay, duration]);
  return v;
}

interface Props {
  /** If provided, external parent controls the view (single-feature mode) */
  controlledView?: View;
  onViewChange?: (v: View) => void;
}

export const SkeletonOne = ({ controlledView, onViewChange }: Props) => {
  const score = useCount(98, 300, 1600);
  const offset = C * (1 - score / 100);
  const [internalView, setInternalView] = useState<View>('categories');
  const [activeRow, setActiveRow] = useState(0);

  const view = controlledView ?? internalView;
  const setView = (v: View) => {
    if (onViewChange) onViewChange(v);
    else setInternalView(v);
  };

  const rowCount = view === 'categories' ? categories.length : view === 'vitals' ? vitals.length : optimizations.length;

  useEffect(() => {
    const id = setInterval(() => setActiveRow(r => (r + 1) % rowCount), 1800);
    return () => clearInterval(id);
  }, [rowCount]);

  // Auto-cycle views only in uncontrolled (summary) mode
  useEffect(() => {
    if (controlledView !== undefined) return;
    const views: View[] = ['categories', 'vitals', 'optimization'];
    let idx = 0;
    const id = setInterval(() => {
      idx = (idx + 1) % views.length;
      setInternalView(views[idx]);
      setActiveRow(0);
    }, 5000);
    return () => clearInterval(id);
  }, [controlledView]);

  // Reset row when controlled view changes
  useEffect(() => { setActiveRow(0); }, [controlledView]);

  return (
    <div className="w-full h-full flex items-center justify-center p-5 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 22, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full rounded-[18px] overflow-hidden"
        style={{
          background: '#1c1c1e',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 0 0 0.5px rgba(255,255,255,0.05) inset',
        }}
      >
        {/* Search bar */}
        <div className="flex items-center gap-3 px-4 h-[52px] border-b border-white/[0.07]">
          <div className="w-[24px] h-[24px] rounded-[7px] flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.07)', border: '0.5px solid rgba(255,255,255,0.1)' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
          </div>
          <span className="text-[13px] flex-1" style={{ color: 'rgba(255,255,255,0.28)' }}>davelopment.hu · Lighthouse riport</span>
          <kbd className="text-[10px] rounded-[5px] px-[7px] py-[2px] font-mono flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.22)', border: '0.5px solid rgba(255,255,255,0.1)' }}>⌘K</kbd>
        </div>

        {/* Score hero */}
        <div className="flex items-center gap-5 px-5 py-4 border-b border-white/[0.05]"
          style={{ background: 'rgba(255,255,255,0.03)' }}>
          <div className="relative flex-shrink-0" style={{ width: 84, height: 84 }}>
            <svg width="84" height="84" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="42" cy="42" r="34" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5.5" />
              <motion.circle cx="42" cy="42" r="34" fill="none"
                stroke={ACCENT} strokeWidth="5.5" strokeLinecap="round"
                strokeDasharray={C}
                initial={{ strokeDashoffset: C }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1.6, delay: 0.4, ease: [0.4, 0, 0.2, 1] }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-[1px]">
              <span className="text-[26px] font-bold leading-none tabular-nums" style={{ color: ACCENT }}>{score}</span>
              <span className="text-[9px]" style={{ color: 'rgba(255,255,255,0.28)' }}>/100</span>
            </div>
          </div>
          <div>
            <div className="text-[15px] font-semibold mb-[5px] text-white">Kiváló teljesítmény</div>
            <div className="text-[12px] mb-[8px]" style={{ color: 'rgba(255,255,255,0.32)' }}>Next.js · Vercel Edge · CDN gyorsítótár</div>
            <div className="flex items-center gap-[6px]">
              <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 2 }}
                className="w-[6px] h-[6px] rounded-full" style={{ background: ACCENT }} />
              <span className="text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>Mind a 4 kategória kiváló</span>
            </div>
          </div>
        </div>

        {/* Section header */}
        <div className="px-4 h-[28px] flex items-center">
          <span className="text-[10px] font-semibold tracking-[.12em] uppercase" style={{ color: 'rgba(255,255,255,0.22)' }}>
            {view === 'categories' ? 'Lighthouse kategóriák' : view === 'vitals' ? 'Core Web Vitals' : 'Optimalizációk'}
          </span>
        </div>

        {/* Rows */}
        <AnimatePresence mode="wait">
          <motion.div key={view} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            {view === 'categories' && categories.map((c, i) => (
              <motion.div key={c.label} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}
                className="flex items-center gap-3 h-[44px] px-4 transition-colors duration-300"
                style={{ background: i === activeRow ? 'rgba(255,255,255,0.04)' : 'transparent' }}>
                <div className="w-[36px] h-[36px] rounded-[9px] flex items-center justify-center flex-shrink-0 text-[12px] font-bold tabular-nums"
                  style={{ background: i === activeRow ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.07)', color: i === activeRow ? ACCENT : 'rgba(255,255,255,0.4)' }}>{c.score}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium leading-none mb-[4px]" style={{ color: i === activeRow ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)' }}>{c.label}</div>
                  <div className="text-[11px] leading-none truncate" style={{ color: 'rgba(255,255,255,0.25)' }}>{c.sub}</div>
                </div>
                <div className="w-[56px] h-[3px] rounded-full overflow-hidden flex-shrink-0" style={{ background: 'rgba(255,255,255,0.07)' }}>
                  <motion.div className="h-full rounded-full" style={{ background: i === activeRow ? ACCENT : 'rgba(255,255,255,0.2)' }}
                    initial={{ width: 0 }} animate={{ width: c.score + '%' }} transition={{ duration: 1.1, delay: 0.4 + i * 0.08 }} />
                </div>
                {i === activeRow && <kbd className="text-[9px] rounded-[4px] px-[5px] py-[2px] font-mono flex-shrink-0" style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.2)' }}>↵</kbd>}
              </motion.div>
            ))}
            {view === 'vitals' && vitals.map((v, i) => (
              <motion.div key={v.label} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}
                className="flex items-center gap-3 h-[44px] px-4 transition-colors duration-300"
                style={{ background: i === activeRow ? 'rgba(255,255,255,0.04)' : 'transparent' }}>
                <div className="w-[36px] h-[36px] rounded-[9px] flex items-center justify-center flex-shrink-0 text-[9px] font-bold"
                  style={{ background: i === activeRow ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.07)', color: i === activeRow ? ACCENT : 'rgba(255,255,255,0.4)' }}>{v.label}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium leading-none mb-[4px]" style={{ color: i === activeRow ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)' }}>{v.full}</div>
                  <div className="w-full h-[3px] rounded-full overflow-hidden mt-[6px]" style={{ background: 'rgba(255,255,255,0.07)' }}>
                    <motion.div className="h-full rounded-full" style={{ background: i === activeRow ? ACCENT : 'rgba(255,255,255,0.2)' }}
                      initial={{ width: 0 }} animate={{ width: v.pct + '%' }} transition={{ duration: 1.1, delay: 0.3 + i * 0.08 }} />
                  </div>
                </div>
                <span className="text-[13px] font-semibold tabular-nums flex-shrink-0" style={{ color: i === activeRow ? ACCENT : 'rgba(255,255,255,0.35)' }}>{v.value}</span>
              </motion.div>
            ))}
            {view === 'optimization' && optimizations.map((o, i) => (
              <motion.div key={o.label} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}
                className="flex items-center gap-3 h-[44px] px-4 transition-colors duration-300"
                style={{ background: i === activeRow ? 'rgba(255,255,255,0.04)' : 'transparent' }}>
                <div className="w-[36px] h-[36px] rounded-[9px] flex items-center justify-center flex-shrink-0"
                  style={{ background: i === activeRow ? `${ACCENT}22` : 'rgba(255,255,255,0.05)', border: i === activeRow ? `0.5px solid ${ACCENT}55` : '0.5px solid rgba(255,255,255,0.07)' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={i === activeRow ? ACCENT : 'rgba(255,255,255,0.3)'} strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium leading-none mb-[4px]" style={{ color: i === activeRow ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)' }}>{o.label}</div>
                  <div className="text-[11px] leading-none truncate" style={{ color: 'rgba(255,255,255,0.25)' }}>{o.sub}</div>
                </div>
                <span className="text-[12px] font-bold tabular-nums flex-shrink-0" style={{ color: i === activeRow ? ACCENT : 'rgba(255,255,255,0.3)' }}>{o.gain}</span>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Internal mini tab bar — only in summary (uncontrolled) mode */}
        {controlledView === undefined && (
          <div className="flex items-center justify-center gap-[5px] px-4 py-[8px] border-t border-white/[0.05]">
            {performanceTabs.map(({ key, label, icon }) => (
              <button key={key} onClick={() => setView(key)}
                className="flex items-center gap-[5px] rounded-[8px] px-3 py-[5px] text-[10px] font-medium transition-all"
                style={{
                  background: view === key ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)',
                  color: view === key ? ACCENT : 'rgba(255,255,255,0.3)',
                  border: view === key ? '0.5px solid rgba(255,255,255,0.2)' : '0.5px solid rgba(255,255,255,0.07)',
                }}>
                {icon}{label}
              </button>
            ))}
          </div>
        )}

        {/* Action bar */}
        <div className="flex items-center justify-between px-4 h-[34px] border-t border-white/[0.06]"
          style={{ background: 'rgba(0,0,0,0.25)' }}>
          <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.2)' }}>Webteljesítmény bővítmény</span>
          <div className="flex items-center gap-[6px]">
            <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.28)' }}>Teljes riport megnyitása</span>
            <kbd className="text-[9px] rounded-[4px] px-[5px] py-[1px] font-mono" style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.2)' }}>↵</kbd>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
