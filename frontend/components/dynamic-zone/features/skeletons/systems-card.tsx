'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const ACCENT = '#f59e0b';

const services = [
  { name: 'API szerver',    sub: 'Válasz 12ms · 99.9% uptime 30 nap',  latency: '12ms' },
  { name: 'Payload CMS',   sub: 'Utolsó deploy 2 órája · 100% uptime', latency: '28ms' },
  { name: 'PostgreSQL',    sub: '3ms átlag query · 0 lassú lekérdezés', latency: '3ms'  },
  { name: 'Email szerviz', sub: '247 elküldve ma · sor üres',           latency: '—'    },
  { name: 'CDN / Eszközök',sub: 'Globálisan cache-elve · 0 hiba',      latency: '<1ms' },
];

const logs = [
  { msg: 'Deploy sikeres → production',        time: '4p',  level: 'ok'   },
  { msg: 'PostgreSQL backup befejezve',         time: '12p', level: 'ok'   },
  { msg: 'SSL tanúsítvány megújítva · 89 nap', time: '1ó',  level: 'info' },
  { msg: 'CDN cache kiürítve · 2.1 MB',        time: '2ó',  level: 'info' },
];

const metrics = [
  { label: 'CPU kihasználtság',  value: '12%',           pct: 12 },
  { label: 'Memória (RAM)',       value: '2.4 GB / 8 GB', pct: 30 },
  { label: 'Tárhelyfoglalás',    value: '18 GB / 50 GB', pct: 36 },
  { label: 'Hálózati átvitel',   value: '42 MB/s',       pct: 21 },
];

const serviceIcons: Record<string, (active: boolean) => React.ReactNode> = {
  'API szerver':    (a) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={a ? ACCENT : 'rgba(255,255,255,0.28)'} strokeWidth="2.5" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
  'Payload CMS':   (a) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={a ? ACCENT : 'rgba(255,255,255,0.28)'} strokeWidth="2.5" strokeLinecap="round"><path d="M4 4l6 16 3-8 8-3L4 4z"/></svg>,
  'PostgreSQL':    (a) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={a ? ACCENT : 'rgba(255,255,255,0.28)'} strokeWidth="2.5" strokeLinecap="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/></svg>,
  'Email szerviz': (a) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={a ? ACCENT : 'rgba(255,255,255,0.28)'} strokeWidth="2.5" strokeLinecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 8 10-8"/></svg>,
  'CDN / Eszközök':(a) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={a ? ACCENT : 'rgba(255,255,255,0.28)'} strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
};

export const systemsTabs = [
  {
    key: 'services' as const,
    label: 'Szervizek',
    icon: <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
  },
  {
    key: 'logs' as const,
    label: 'Napló',
    icon: <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  },
  {
    key: 'metrics' as const,
    label: 'Metrikák',
    icon: <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  },
];

type View = 'services' | 'logs' | 'metrics';

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

export const SkeletonFour = ({ controlledView, onViewChange }: Props) => {
  const uptime = useCount(999, 600, 1400);
  const sent = useCount(247, 500, 1300);
  const visitors = useCount(1840, 550, 1500);
  const [internalView, setInternalView] = useState<View>('services');
  const [activeRow, setActiveRow] = useState(0);

  const view = controlledView ?? internalView;
  const setView = (v: View) => {
    if (onViewChange) onViewChange(v);
    else setInternalView(v);
  };

  const rowCount = view === 'services' ? services.length : view === 'logs' ? logs.length : metrics.length;

  useEffect(() => {
    const id = setInterval(() => setActiveRow(r => (r + 1) % rowCount), 1800);
    return () => clearInterval(id);
  }, [rowCount]);

  useEffect(() => {
    if (controlledView !== undefined) return;
    const views: View[] = ['services', 'logs', 'metrics'];
    let idx = 0;
    const id = setInterval(() => { idx = (idx + 1) % views.length; setInternalView(views[idx]); setActiveRow(0); }, 5000);
    return () => clearInterval(id);
  }, [controlledView]);

  useEffect(() => { setActiveRow(0); }, [controlledView]);

  return (
    <div className="w-full h-full flex items-center justify-center p-5 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 55% 45% at 35% 65%, rgba(245,158,11,0.1) 0%, transparent 60%)' }} />

      <motion.div
        initial={{ opacity: 0, y: 22, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full rounded-[18px] overflow-hidden"
        style={{ background: '#1c1c1e', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 0 0 0.5px rgba(255,255,255,0.05) inset' }}
      >
        <div className="flex items-center gap-3 px-4 h-[52px] border-b border-white/[0.07]">
          <div className="w-[24px] h-[24px] rounded-[7px] flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.07)', border: '0.5px solid rgba(255,255,255,0.1)' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
          </div>
          <span className="text-[13px] flex-1" style={{ color: 'rgba(255,255,255,0.28)' }}>Infrastruktúra · Státusz monitor</span>
          <div className="flex items-center gap-[6px]">
            <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="w-[6px] h-[6px] rounded-full" style={{ background: ACCENT, boxShadow: `0 0 7px ${ACCENT}` }} />
            <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.2)' }}>élő</span>
          </div>
        </div>

        <div className="flex items-center border-b border-white/[0.05]" style={{ background: `${ACCENT}06` }}>
          {[
            { label: 'Uptime / 30 nap', value: (uptime / 10).toFixed(1) + '%', color: ACCENT },
            { label: 'Email elküldve',   value: sent.toString(),                 color: 'rgba(255,255,255,0.55)' },
            { label: 'Látogató / nap',   value: visitors.toLocaleString('hu-HU'),color: 'rgba(255,255,255,0.55)' },
          ].map((stat) => (
            <div key={stat.label} className="flex-1 flex flex-col items-center justify-center py-4 border-r border-white/[0.05] last:border-0">
              <span className="text-[20px] font-bold tabular-nums leading-none mb-[5px]" style={{ color: stat.color }}>{stat.value}</span>
              <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.28)' }}>{stat.label}</span>
            </div>
          ))}
        </div>

        <div className="px-4 h-[28px] flex items-center">
          <span className="text-[10px] font-semibold tracking-[.12em] uppercase" style={{ color: 'rgba(255,255,255,0.22)' }}>
            {view === 'services' ? 'Szolgáltatások' : view === 'logs' ? 'Eseménynapló' : 'Rendszer metrikák'}
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={view} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            {view === 'services' && services.map((svc, i) => (
              <motion.div key={svc.name} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}
                className="flex items-center gap-3 h-[44px] px-4 transition-colors duration-300"
                style={{ background: i === activeRow ? `${ACCENT}0d` : 'transparent' }}>
                <div className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center flex-shrink-0"
                  style={{ background: i === activeRow ? `${ACCENT}22` : 'rgba(255,255,255,0.05)', border: i === activeRow ? `0.5px solid ${ACCENT}55` : '0.5px solid rgba(255,255,255,0.07)' }}>
                  {serviceIcons[svc.name]?.(i === activeRow)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium leading-none mb-[4px]" style={{ color: i === activeRow ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.52)' }}>{svc.name}</div>
                  <div className="text-[11px] leading-none truncate" style={{ color: 'rgba(255,255,255,0.25)' }}>{svc.sub}</div>
                </div>
                <span className="text-[11px] font-mono tabular-nums flex-shrink-0" style={{ color: 'rgba(255,255,255,0.28)' }}>{svc.latency}</span>
                <div className="flex items-center gap-[5px] flex-shrink-0">
                  <div className="w-[5px] h-[5px] rounded-full"
                    style={{ background: i === activeRow ? ACCENT : 'rgba(255,255,255,0.2)', boxShadow: i === activeRow ? `0 0 5px ${ACCENT}` : 'none' }} />
                  <span className="text-[9px] font-medium" style={{ color: i === activeRow ? ACCENT : 'rgba(255,255,255,0.22)' }}>OK</span>
                </div>
              </motion.div>
            ))}
            {view === 'logs' && logs.map((log, i) => (
              <motion.div key={log.msg} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}
                className="flex items-center gap-3 h-[44px] px-4 transition-colors duration-300"
                style={{ background: i === activeRow ? `${ACCENT}0d` : 'transparent' }}>
                <div className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center flex-shrink-0"
                  style={{ background: i === activeRow ? `${ACCENT}22` : 'rgba(255,255,255,0.05)', border: i === activeRow ? `0.5px solid ${ACCENT}55` : '0.5px solid rgba(255,255,255,0.07)' }}>
                  {log.level === 'ok'
                    ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={i === activeRow ? ACCENT : 'rgba(255,255,255,0.3)'} strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                    : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={i === activeRow ? '#60a5fa' : 'rgba(255,255,255,0.3)'} strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium leading-none truncate" style={{ color: i === activeRow ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)' }}>{log.msg}</div>
                </div>
                <span className="text-[11px] tabular-nums flex-shrink-0 font-mono" style={{ color: 'rgba(255,255,255,0.25)' }}>{log.time}</span>
                {i === activeRow && <kbd className="text-[9px] rounded-[4px] px-[5px] py-[2px] font-mono flex-shrink-0" style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.2)' }}>↵</kbd>}
              </motion.div>
            ))}
            {view === 'metrics' && metrics.map((m, i) => (
              <motion.div key={m.label} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}
                className="flex items-center gap-3 h-[44px] px-4 transition-colors duration-300"
                style={{ background: i === activeRow ? `${ACCENT}0d` : 'transparent' }}>
                <div className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center flex-shrink-0"
                  style={{ background: i === activeRow ? `${ACCENT}22` : 'rgba(255,255,255,0.05)', border: i === activeRow ? `0.5px solid ${ACCENT}55` : '0.5px solid rgba(255,255,255,0.07)' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={i === activeRow ? ACCENT : 'rgba(255,255,255,0.3)'} strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium leading-none mb-[4px]" style={{ color: i === activeRow ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)' }}>{m.label}</div>
                  <div className="w-full h-[3px] rounded-full overflow-hidden mt-[6px]" style={{ background: 'rgba(255,255,255,0.07)' }}>
                    <motion.div className="h-full rounded-full" style={{ background: i === activeRow ? ACCENT : 'rgba(255,255,255,0.2)' }}
                      initial={{ width: 0 }} animate={{ width: m.pct + '%' }} transition={{ duration: 1.1, delay: 0.3 + i * 0.08 }} />
                  </div>
                </div>
                <span className="text-[12px] font-semibold tabular-nums flex-shrink-0" style={{ color: i === activeRow ? ACCENT : 'rgba(255,255,255,0.35)' }}>{m.value}</span>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {controlledView === undefined && (
          <div className="flex items-center justify-center gap-[5px] px-4 py-[8px] border-t border-white/[0.05]">
            {systemsTabs.map(({ key, label, icon }) => (
              <button key={key} onClick={() => setView(key)}
                className="flex items-center gap-[5px] rounded-[8px] px-3 py-[5px] text-[10px] font-medium transition-all"
                style={{ background: view === key ? `${ACCENT}1a` : 'rgba(255,255,255,0.04)', color: view === key ? ACCENT : 'rgba(255,255,255,0.3)', border: view === key ? `0.5px solid ${ACCENT}40` : '0.5px solid rgba(255,255,255,0.07)' }}>
                {icon}{label}
              </button>
            ))}
          </div>
        )}

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
          className="flex items-center justify-between px-4 h-[34px] border-t border-white/[0.06]"
          style={{ background: 'rgba(0,0,0,0.25)' }}>
          <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.2)' }}>Rendszer monitor bővítmény</span>
          <div className="flex items-center gap-[6px]">
            <div className="w-[5px] h-[5px] rounded-full" style={{ background: ACCENT, boxShadow: `0 0 5px ${ACCENT}` }} />
            <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.28)' }}>Minden rendszer működik ✓</span>
            <kbd className="text-[9px] rounded-[4px] px-[5px] py-[1px] font-mono" style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.2)' }}>↵</kbd>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
