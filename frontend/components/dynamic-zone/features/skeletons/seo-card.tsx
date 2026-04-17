'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const ACCENT = '#34a853';

const keywords = [
  { kw: 'Webdesign Budapest',       url: 'davelopment.hu › webdesign-budapest', pos: '#1', change: '+3' },
  { kw: 'Next.js ügynökség',        url: 'davelopment.hu › nextjs-ugynokseg',   pos: '#2', change: '+1' },
  { kw: 'Webfejlesztő Budapest',    url: 'davelopment.hu › webfejleszto',       pos: '#3', change: '+7' },
  { kw: 'Egyedi weboldal készítés', url: 'davelopment.hu › egyedi-weboldal',    pos: '#5', change: '+2' },
];

const analytics = [
  { label: 'Organikus munkamenet', value: '3 812', sub: '+12% előző hónaphoz', pct: 76 },
  { label: 'Oldalmegtekintés',     value: '9 140', sub: 'átlag 2.4 oldal/látogató',  pct: 88 },
  { label: 'Visszafordulási arány',value: '34%',   sub: 'Iparági átlag: 52%',       pct: 34 },
  { label: 'Átl. munkamenet idő',  value: '2m 48s',sub: '+0:22 előző hónaphoz',     pct: 62 },
];

const competitors = [
  { name: 'sajtunk.hu',     kw: 'webdesign',     pos: '#4',  trend: '↓1' },
  { name: 'webartisan.hu',  kw: 'webfejlesztés', pos: '#7',  trend: '→'  },
  { name: 'kreativ.hu',     kw: 'ui tervezés',   pos: '#9',  trend: '↓2' },
  { name: 'digitalpro.hu',  kw: 'seo budapest',  pos: '#12', trend: '↓3' },
];

export const seoTabs = [
  {
    key: 'keywords' as const,
    label: 'Kulcsszavak',
    icon: <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>,
  },
  {
    key: 'analytics' as const,
    label: 'Analitika',
    icon: <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  },
  {
    key: 'competitors' as const,
    label: 'Versenytársak',
    icon: <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  },
];

type View = 'keywords' | 'analytics' | 'competitors';

function useCount(to: number, delay = 400, duration = 1200) {
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
  controlledView?: View;
  onViewChange?: (v: View) => void;
}

export const SkeletonTwo = ({ controlledView, onViewChange }: Props) => {
  const clicks = useCount(1240, 500, 1400);
  const impressions = useCount(48000, 500, 1600);
  const [internalView, setInternalView] = useState<View>('keywords');
  const [activeRow, setActiveRow] = useState(0);

  const view = controlledView ?? internalView;
  const setView = (v: View) => {
    if (onViewChange) onViewChange(v);
    else setInternalView(v);
  };

  const rowCount = view === 'keywords' ? keywords.length : view === 'analytics' ? analytics.length : competitors.length;

  useEffect(() => {
    const id = setInterval(() => setActiveRow(r => (r + 1) % rowCount), 1800);
    return () => clearInterval(id);
  }, [rowCount]);

  useEffect(() => {
    if (controlledView !== undefined) return;
    const views: View[] = ['keywords', 'analytics', 'competitors'];
    let idx = 0;
    const id = setInterval(() => {
      idx = (idx + 1) % views.length;
      setInternalView(views[idx]);
      setActiveRow(0);
    }, 5000);
    return () => clearInterval(id);
  }, [controlledView]);

  useEffect(() => { setActiveRow(0); }, [controlledView]);

  return (
    <div className="w-full h-full flex items-center justify-center p-5 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 55% 45% at 80% 30%, rgba(52,168,83,0.12) 0%, transparent 60%)' }} />

      <motion.div
        initial={{ opacity: 0, y: 22, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full rounded-[18px] overflow-hidden"
        style={{
          background: '#1c1c1e',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 0 0 0.5px rgba(255,255,255,0.05) inset',
        }}
      >
        <div className="flex items-center gap-3 px-4 h-[52px] border-b border-white/[0.07]">
          <div className="w-[24px] h-[24px] rounded-[7px] flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.07)', border: '0.5px solid rgba(255,255,255,0.1)' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
          </div>
          <span className="text-[13px] flex-1" style={{ color: 'rgba(255,255,255,0.28)' }}>davelopment.hu · Google Search Console</span>
          <kbd className="text-[10px] rounded-[5px] px-[7px] py-[2px] font-mono flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.22)', border: '0.5px solid rgba(255,255,255,0.1)' }}>⌘K</kbd>
        </div>

        <div className="flex items-center gap-0 border-b border-white/[0.05]" style={{ background: `${ACCENT}08` }}>
          {[
            { label: 'Kattintás / hó',  value: clicks.toLocaleString('hu-HU'),      color: ACCENT },
            { label: 'Megjelenés / hó', value: impressions.toLocaleString('hu-HU'), color: 'rgba(255,255,255,0.55)' },
            { label: 'Átlagos pozíció', value: '2.4',                                color: 'rgba(255,255,255,0.55)' },
          ].map((stat) => (
            <div key={stat.label} className="flex-1 flex flex-col items-center justify-center py-4 border-r border-white/[0.05] last:border-0">
              <span className="text-[20px] font-bold tabular-nums leading-none mb-[5px]" style={{ color: stat.color }}>{stat.value}</span>
              <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.28)' }}>{stat.label}</span>
            </div>
          ))}
        </div>

        <div className="px-4 h-[28px] flex items-center">
          <span className="text-[10px] font-semibold tracking-[.12em] uppercase" style={{ color: 'rgba(255,255,255,0.22)' }}>
            {view === 'keywords' ? 'Top kulcsszavak' : view === 'analytics' ? 'Analitika' : 'Versenytársak'}
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={view} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            {view === 'keywords' && keywords.map((kw, i) => (
              <motion.div key={kw.kw} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}
                className="flex items-center gap-3 h-[46px] px-4 transition-colors duration-300"
                style={{ background: i === activeRow ? `${ACCENT}0d` : 'transparent' }}>
                <div className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center flex-shrink-0"
                  style={{ background: i === activeRow ? `${ACCENT}22` : 'rgba(255,255,255,0.05)', border: i === activeRow ? `0.5px solid ${ACCENT}55` : '0.5px solid rgba(255,255,255,0.07)' }}>
                  {i === 0
                    ? <svg width="14" height="14" viewBox="0 0 24 24" fill={i === activeRow ? ACCENT : 'rgba(255,255,255,0.25)'}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={i === activeRow ? ACCENT : 'rgba(255,255,255,0.25)'} strokeWidth="2.5" strokeLinecap="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium leading-none mb-[4px] truncate" style={{ color: i === activeRow ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.52)' }}>{kw.kw}</div>
                  <div className="text-[11px] leading-none truncate" style={{ color: 'rgba(255,255,255,0.25)' }}>{kw.url}</div>
                </div>
                <span className="text-[11px] font-medium flex-shrink-0 tabular-nums" style={{ color: i === activeRow ? ACCENT : 'rgba(255,255,255,0.22)' }}>↑{kw.change}</span>
                <span className="text-[12px] font-bold tabular-nums flex-shrink-0" style={{ color: i === activeRow ? ACCENT : 'rgba(255,255,255,0.38)' }}>{kw.pos}</span>
                {i === activeRow && <kbd className="text-[9px] rounded-[4px] px-[5px] py-[2px] font-mono flex-shrink-0" style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.2)' }}>↵</kbd>}
              </motion.div>
            ))}
            {view === 'analytics' && analytics.map((a, i) => (
              <motion.div key={a.label} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}
                className="flex items-center gap-3 h-[46px] px-4 transition-colors duration-300"
                style={{ background: i === activeRow ? `${ACCENT}0d` : 'transparent' }}>
                <div className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center flex-shrink-0"
                  style={{ background: i === activeRow ? `${ACCENT}22` : 'rgba(255,255,255,0.05)', border: i === activeRow ? `0.5px solid ${ACCENT}55` : '0.5px solid rgba(255,255,255,0.07)' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={i === activeRow ? ACCENT : 'rgba(255,255,255,0.3)'} strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium leading-none mb-[4px]" style={{ color: i === activeRow ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)' }}>{a.label}</div>
                  <div className="w-full h-[3px] rounded-full overflow-hidden mt-[6px]" style={{ background: 'rgba(255,255,255,0.07)' }}>
                    <motion.div className="h-full rounded-full" style={{ background: i === activeRow ? ACCENT : 'rgba(255,255,255,0.2)' }}
                      initial={{ width: 0 }} animate={{ width: a.pct + '%' }} transition={{ duration: 1.1, delay: 0.3 + i * 0.08 }} />
                  </div>
                </div>
                <div className="flex flex-col items-end flex-shrink-0">
                  <span className="text-[13px] font-semibold tabular-nums" style={{ color: i === activeRow ? ACCENT : 'rgba(255,255,255,0.35)' }}>{a.value}</span>
                  <span className="text-[9px]" style={{ color: 'rgba(255,255,255,0.22)' }}>{a.sub}</span>
                </div>
              </motion.div>
            ))}
            {view === 'competitors' && competitors.map((c, i) => (
              <motion.div key={c.name} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}
                className="flex items-center gap-3 h-[46px] px-4 transition-colors duration-300"
                style={{ background: i === activeRow ? `${ACCENT}0d` : 'transparent' }}>
                <div className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center flex-shrink-0 text-[10px] font-bold"
                  style={{ background: i === activeRow ? `${ACCENT}22` : 'rgba(255,255,255,0.05)', border: i === activeRow ? `0.5px solid ${ACCENT}55` : '0.5px solid rgba(255,255,255,0.07)', color: i === activeRow ? ACCENT : 'rgba(255,255,255,0.3)' }}>{c.pos}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium leading-none mb-[3px]" style={{ color: i === activeRow ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)' }}>{c.name}</div>
                  <div className="text-[11px] leading-none truncate" style={{ color: 'rgba(255,255,255,0.25)' }}>kulcsszó: {c.kw}</div>
                </div>
                <span className="text-[11px] flex-shrink-0" style={{ color: 'rgba(255,255,255,0.28)' }}>{c.trend}</span>
                <span className="text-[9px] px-[6px] py-[2px] rounded-full font-medium flex-shrink-0"
                  style={{ background: `${ACCENT}15`, color: ACCENT, border: `0.5px solid ${ACCENT}40` }}>előttünk</span>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {controlledView === undefined && (
          <div className="flex items-center justify-center gap-[5px] px-4 py-[8px] border-t border-white/[0.05]">
            {seoTabs.map(({ key, label, icon }) => (
              <button key={key} onClick={() => setView(key)}
                className="flex items-center gap-[5px] rounded-[8px] px-3 py-[5px] text-[10px] font-medium transition-all"
                style={{
                  background: view === key ? `${ACCENT}1a` : 'rgba(255,255,255,0.04)',
                  color: view === key ? ACCENT : 'rgba(255,255,255,0.3)',
                  border: view === key ? `0.5px solid ${ACCENT}40` : '0.5px solid rgba(255,255,255,0.07)',
                }}>
                {icon}{label}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between px-4 h-[34px] border-t border-white/[0.06]"
          style={{ background: 'rgba(0,0,0,0.25)' }}>
          <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.2)' }}>SEO Tracker bővítmény</span>
          <div className="flex items-center gap-[6px]">
            <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.28)' }}>Search Console megnyitása</span>
            <kbd className="text-[9px] rounded-[4px] px-[5px] py-[1px] font-mono" style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.2)' }}>↵</kbd>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
