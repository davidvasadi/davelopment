'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const ACCENT = '#a78bfa';

const components = [
  { title: 'Hero szekció',   sub: 'Frissítve 2 perce · v3.1',         status: 'Élő',        sc: '#34d399', editor: 'D', bg: '#fbbf24' },
  { title: 'Navigáció',      sub: 'Átnézés alatt · Kliens szerkeszti', status: 'Átnézés',    sc: '#60a5fa', editor: 'K', bg: '#a78bfa' },
  { title: 'Árlista tábla',  sub: 'Jóváhagyva · v1 · Kész',           status: 'Jóváhagyva', sc: '#34d399', editor: 'D', bg: '#fbbf24' },
  { title: 'CTA gomb',       sub: 'Visszajelzés várva · Kliens',       status: 'Függőben',   sc: '#f0c742', editor: 'K', bg: '#a78bfa' },
];

const assets = [
  { name: 'Logo variációk',    sub: 'SVG · 4 variáns · v2',      size: '48 KB',  type: 'SVG'  },
  { name: 'Ikon rendszer',     sub: '120 ikon · outline stílus',  size: '210 KB', type: 'SVG'  },
  { name: 'Tipográfia készlet',sub: 'Inter + Space Grotesk',      size: '12 MB',  type: 'TTF'  },
  { name: 'Illusztrációk',     sub: 'Lottie · 6 animáció',       size: '380 KB', type: 'JSON' },
];

const deploys = [
  { version: 'v3.1.2', env: 'Production', branch: 'main',    time: '2p'    },
  { version: 'v3.1.1', env: 'Staging',    branch: 'staging', time: '1ó'    },
  { version: 'v3.1.0', env: 'Production', branch: 'main',    time: '3ó'    },
  { version: 'v3.0.9', env: 'Production', branch: 'main',    time: '2 nap' },
];

const activity = [
  { msg: 'Dávid pusolta: "Hero szekció" v3.1', time: '2p',  color: '#fbbf24' },
  { msg: 'Kliens jóváhagyta: "Árlista tábla"', time: '14p', color: '#a78bfa' },
  { msg: 'Deploy → production sikeres',         time: '1ó',  color: '#34d399' },
];

export const designTabs = [
  {
    key: 'components' as const,
    label: 'Komponensek',
    icon: <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  },
  {
    key: 'assets' as const,
    label: 'Eszközök',
    icon: <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
  },
  {
    key: 'deploy' as const,
    label: 'Deploy',
    icon: <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M22 2L11 13"/><path d="M22 2L15 22 11 13 2 9l20-7z"/></svg>,
  },
];

type View = 'components' | 'assets' | 'deploy';

interface Props {
  controlledView?: View;
  onViewChange?: (v: View) => void;
}

export const SkeletonThree = ({ controlledView, onViewChange }: Props) => {
  const [internalView, setInternalView] = useState<View>('components');
  const [activeRow, setActiveRow] = useState(0);
  const [tick, setTick] = useState(0);

  const view = controlledView ?? internalView;
  const setView = (v: View) => {
    if (onViewChange) onViewChange(v);
    else setInternalView(v);
  };

  const rowCount = view === 'components' ? components.length : view === 'assets' ? assets.length : deploys.length;

  useEffect(() => { const t = setTimeout(() => setTick(1), 2200); return () => clearTimeout(t); }, []);

  useEffect(() => {
    const id = setInterval(() => setActiveRow(r => (r + 1) % rowCount), 1800);
    return () => clearInterval(id);
  }, [rowCount]);

  useEffect(() => {
    if (controlledView !== undefined) return;
    const views: View[] = ['components', 'assets', 'deploy'];
    let idx = 0;
    const id = setInterval(() => { idx = (idx + 1) % views.length; setInternalView(views[idx]); setActiveRow(0); }, 5000);
    return () => clearInterval(id);
  }, [controlledView]);

  useEffect(() => { setActiveRow(0); }, [controlledView]);

  return (
    <div className="w-full h-full flex items-center justify-center p-5 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 55% 45% at 70% 25%, rgba(167,139,250,0.14) 0%, transparent 60%)' }} />

      <motion.div
        initial={{ opacity: 0, y: 22, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full rounded-[18px] overflow-hidden"
        style={{ background: '#1c1c1e', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 0 0 0.5px rgba(255,255,255,0.05) inset' }}
      >
        <div className="flex items-center gap-3 px-4 h-[52px] border-b border-white/[0.07]">
          <div className="w-[24px] h-[24px] rounded-[7px] flex items-center justify-center flex-shrink-0" style={{ background: '#111', border: '0.5px solid rgba(255,255,255,0.1)' }}>
            <svg width="9" height="12" viewBox="0 0 38 57" fill="none">
              <path d="M19 28.5A9.5 9.5 0 0 1 28.5 19H38V38H28.5A9.5 9.5 0 0 1 19 28.5z" fill="#1abcfe"/>
              <path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19V57H9.5A9.5 9.5 0 0 1 0 47.5z" fill="#0acf83"/>
              <path d="M19 0H28.5A9.5 9.5 0 0 1 28.5 19H19V0z" fill="#ff7262"/>
              <path d="M0 9.5A9.5 9.5 0 0 1 9.5 0H19V19H9.5A9.5 9.5 0 0 1 0 9.5z" fill="#f24e1e"/>
              <path d="M0 28.5A9.5 9.5 0 0 1 9.5 19H19V38H9.5A9.5 9.5 0 0 1 0 28.5z" fill="#a259ff"/>
            </svg>
          </div>
          <span className="text-[13px] flex-1" style={{ color: 'rgba(255,255,255,0.28)' }}>davelopment-design / komponensek</span>
          <div className="flex items-center gap-[6px]">
            <div className="flex items-center -space-x-[6px]">
              <motion.div animate={{ boxShadow: tick ? '0 0 10px rgba(251,191,36,0.7)' : '0 0 6px rgba(251,191,36,0.4)' }}
                className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-[8px] font-bold z-10 relative"
                style={{ background: '#fbbf24', color: '#000' }}>D</motion.div>
              <div className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-[8px] font-bold relative"
                style={{ background: '#a78bfa', color: '#000', border: '2px solid #1c1c1e' }}>K</div>
            </div>
            <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 1.8 }}
              className="w-[6px] h-[6px] rounded-full flex-shrink-0" style={{ background: ACCENT, boxShadow: `0 0 6px ${ACCENT}` }} />
          </div>
        </div>

        <div className="border-b border-white/[0.05] px-4 py-3" style={{ background: `${ACCENT}06` }}>
          <div className="text-[10px] font-semibold tracking-[.12em] uppercase mb-[8px]" style={{ color: 'rgba(255,255,255,0.22)' }}>Élő aktivitás</div>
          {activity.map((a, i) => (
            <motion.div key={a.msg} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.12 }}
              className="flex items-center gap-[8px] mb-[6px] last:mb-0">
              <div className="w-[5px] h-[5px] rounded-full flex-shrink-0" style={{ background: a.color, boxShadow: `0 0 4px ${a.color}` }} />
              <span className="text-[11px] flex-1" style={{ color: 'rgba(255,255,255,0.52)' }}>{a.msg}</span>
              <span className="text-[10px] flex-shrink-0" style={{ color: 'rgba(255,255,255,0.22)' }}>{a.time}</span>
            </motion.div>
          ))}
        </div>

        <div className="px-4 h-[28px] flex items-center">
          <span className="text-[10px] font-semibold tracking-[.12em] uppercase" style={{ color: 'rgba(255,255,255,0.22)' }}>
            {view === 'components' ? 'Komponensek' : view === 'assets' ? 'Eszközök' : 'Deploy history'}
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={view} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            {view === 'components' && components.map((c, i) => (
              <motion.div key={c.title} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}
                className="flex items-center gap-3 h-[44px] px-4 transition-colors duration-300"
                style={{ background: i === activeRow ? `${ACCENT}0d` : 'transparent' }}>
                <div className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center flex-shrink-0"
                  style={{ background: i === activeRow ? `${ACCENT}22` : 'rgba(255,255,255,0.05)', border: i === activeRow ? `0.5px solid ${ACCENT}55` : '0.5px solid rgba(255,255,255,0.07)' }}>
                  <div className="rounded-[3px]" style={{ width: 14, height: 14, background: i === activeRow ? ACCENT : 'rgba(255,255,255,0.2)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium leading-none mb-[4px] truncate" style={{ color: i === activeRow ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.52)' }}>{c.title}</div>
                  <div className="text-[11px] leading-none truncate" style={{ color: 'rgba(255,255,255,0.25)' }}>{c.sub}</div>
                </div>
                <div className="w-[20px] h-[20px] rounded-full flex items-center justify-center text-[7.5px] font-bold flex-shrink-0" style={{ background: c.bg, color: '#000' }}>{c.editor}</div>
                <span className="text-[9px] px-[7px] py-[2.5px] rounded-full font-medium flex-shrink-0"
                  style={{ background: `${c.sc}18`, color: c.sc, border: `0.5px solid ${c.sc}44` }}>{c.status}</span>
                {i === activeRow && <kbd className="text-[9px] rounded-[4px] px-[5px] py-[2px] font-mono flex-shrink-0" style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.2)' }}>↵</kbd>}
              </motion.div>
            ))}
            {view === 'assets' && assets.map((a, i) => (
              <motion.div key={a.name} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}
                className="flex items-center gap-3 h-[44px] px-4 transition-colors duration-300"
                style={{ background: i === activeRow ? `${ACCENT}0d` : 'transparent' }}>
                <div className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center flex-shrink-0 text-[8px] font-bold font-mono"
                  style={{ background: i === activeRow ? `${ACCENT}22` : 'rgba(255,255,255,0.05)', border: i === activeRow ? `0.5px solid ${ACCENT}55` : '0.5px solid rgba(255,255,255,0.07)', color: i === activeRow ? ACCENT : 'rgba(255,255,255,0.3)' }}>{a.type}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium leading-none mb-[4px]" style={{ color: i === activeRow ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)' }}>{a.name}</div>
                  <div className="text-[11px] leading-none truncate" style={{ color: 'rgba(255,255,255,0.25)' }}>{a.sub}</div>
                </div>
                <span className="text-[11px] font-mono tabular-nums flex-shrink-0" style={{ color: i === activeRow ? ACCENT : 'rgba(255,255,255,0.25)' }}>{a.size}</span>
                {i === activeRow && <kbd className="text-[9px] rounded-[4px] px-[5px] py-[2px] font-mono flex-shrink-0" style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.2)' }}>↵</kbd>}
              </motion.div>
            ))}
            {view === 'deploy' && deploys.map((d, i) => (
              <motion.div key={d.version + i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}
                className="flex items-center gap-3 h-[44px] px-4 transition-colors duration-300"
                style={{ background: i === activeRow ? `${ACCENT}0d` : 'transparent' }}>
                <div className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center flex-shrink-0"
                  style={{ background: i === activeRow ? `${ACCENT}22` : 'rgba(255,255,255,0.05)', border: i === activeRow ? `0.5px solid ${ACCENT}55` : '0.5px solid rgba(255,255,255,0.07)' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={i === activeRow ? ACCENT : 'rgba(255,255,255,0.3)'} strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium leading-none mb-[3px]" style={{ color: i === activeRow ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)' }}>{d.version} → {d.env}</div>
                  <div className="text-[11px] leading-none truncate" style={{ color: 'rgba(255,255,255,0.25)' }}>branch: {d.branch}</div>
                </div>
                <span className="text-[11px] font-mono tabular-nums flex-shrink-0" style={{ color: 'rgba(255,255,255,0.25)' }}>{d.time}</span>
                <span className="text-[9px] px-[6px] py-[2px] rounded-full font-medium flex-shrink-0"
                  style={{ background: `${ACCENT}15`, color: ACCENT, border: `0.5px solid ${ACCENT}40` }}>OK</span>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {controlledView === undefined && (
          <div className="flex items-center justify-center gap-[5px] px-4 py-[8px] border-t border-white/[0.05]">
            {designTabs.map(({ key, label, icon }) => (
              <button key={key} onClick={() => setView(key)}
                className="flex items-center gap-[5px] rounded-[8px] px-3 py-[5px] text-[10px] font-medium transition-all"
                style={{ background: view === key ? `${ACCENT}1a` : 'rgba(255,255,255,0.04)', color: view === key ? ACCENT : 'rgba(255,255,255,0.3)', border: view === key ? `0.5px solid ${ACCENT}40` : '0.5px solid rgba(255,255,255,0.07)' }}>
                {icon}{label}
              </button>
            ))}
          </div>
        )}

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}
          className="flex items-center justify-between px-4 h-[34px] border-t border-white/[0.06]"
          style={{ background: 'rgba(0,0,0,0.25)' }}>
          <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.2)' }}>Figma bővítmény</span>
          <div className="flex items-center gap-[6px]">
            <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 2 }}
              className="w-[5px] h-[5px] rounded-full flex-shrink-0" style={{ background: '#fbbf24', boxShadow: '0 0 5px #fbbf24' }} />
            <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.28)' }}>Megnyitás Figmában</span>
            <kbd className="text-[9px] rounded-[4px] px-[5px] py-[1px] font-mono" style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.2)' }}>↵</kbd>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
