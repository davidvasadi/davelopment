'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GrainCanvas } from '@/components/ui/grain-canvas';
import { SkeletonOne, performanceTabs } from './skeletons/performance-card';
import { SkeletonTwo, seoTabs } from './skeletons/seo-card';
import { SkeletonThree, designTabs } from './skeletons/design-card';
import { SkeletonFour, systemsTabs } from './skeletons/systems-card';

const INTERVAL = 4500;

// Summary mode: 4 main dock tabs
const summaryTabs = [
  {
    key: 'performance',
    color: '#60a5fa',
    label: 'Performance',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    ),
  },
  {
    key: 'seo',
    color: '#34a853',
    label: 'SEO',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
      </svg>
    ),
  },
  {
    key: 'design',
    color: '#a78bfa',
    label: 'Design',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><circle cx="11" cy="11" r="2"/>
      </svg>
    ),
  },
  {
    key: 'systems',
    color: '#f59e0b',
    label: 'Rendszerek',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
      </svg>
    ),
  },
];

// Single-feature tab configs (each card's inner views → dock buttons)
const singleConfigs = {
  performance: {
    color: '#60a5fa',
    label: 'Performance',
    dockTabs: performanceTabs,
    accent: '#60a5fa',
  },
  seo: {
    color: '#34a853',
    label: 'SEO',
    dockTabs: seoTabs,
    accent: '#34a853',
  },
  design: {
    color: '#a78bfa',
    label: 'Design',
    dockTabs: designTabs,
    accent: '#a78bfa',
  },
  systems: {
    color: '#f59e0b',
    label: 'Rendszerek',
    dockTabs: systemsTabs,
    accent: '#f59e0b',
  },
} as const;

type SingleFeature = keyof typeof singleConfigs;

const MacMenuBar = () => {
  const [time, setTime] = useState('');
  useEffect(() => {
    const fmt = () => {
      const d = new Date();
      setTime(d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }));
    };
    fmt();
    const id = setInterval(fmt, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="flex items-center justify-between px-6 h-[32px] flex-shrink-0 select-none"
      style={{
        background: 'rgba(16,16,16,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '0.5px solid rgba(255,255,255,0.07)',
      }}
    >
      <div className="flex items-center gap-[18px]">
        <span className="text-[12px] font-semibold" style={{ color: 'rgba(255,255,255,0.88)' }}>[davelopment]®</span>
        {['File', 'Edit', 'View', 'Window', 'Help'].map(m => (
          <span key={m} className="hidden md:block text-[12px]" style={{ color: 'rgba(255,255,255,0.38)' }}>{m}</span>
        ))}
        <span className="md:hidden text-[12px]" style={{ color: 'rgba(255,255,255,0.38)' }}>menu</span>
      </div>
      <div className="flex items-center gap-[14px]">
        <svg width="14" height="10" viewBox="0 0 24 18" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round">
          <path d="M1 5C5.5.5 18.5.5 23 5"/><path d="M4.5 8.5C8 5.5 16 5.5 19.5 8.5"/><path d="M8 12c2.2-2 6-2 8 0"/><circle cx="12" cy="15" r="1.5" fill="rgba(255,255,255,0.5)"/>
        </svg>
        <div className="flex items-center gap-[2px]">
          <div className="rounded-[2px] flex items-center" style={{ width: 22, height: 11, padding: '2px', border: '1px solid rgba(255,255,255,0.3)' }}>
            <div className="rounded-[1px] h-full" style={{ width: '82%', background: 'rgba(255,255,255,0.7)' }} />
          </div>
          <div className="rounded-r-[1px]" style={{ width: 2, height: 5, background: 'rgba(255,255,255,0.3)' }} />
        </div>
        <span className="text-[12px] tabular-nums" style={{ color: 'rgba(255,255,255,0.55)' }}>{time || '9:41 AM'}</span>
      </div>
    </div>
  );
};

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] as any } },
  exit:   (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0, transition: { duration: 0.2, ease: [0.4, 0, 1, 1] as any } }),
};

export const Features = ({
  heading,
  sub_heading,
  feature,
  globe_card: _g,
  ray_card: _r,
  graph_card: _gr,
  social_media_card: _s,
}: {
  heading?: string;
  sub_heading?: string;
  /** If set, shows only that one card; dock becomes its internal views */
  feature?: SingleFeature;
  globe_card?: any;
  ray_card?: any;
  graph_card?: any;
  social_media_card?: any;
}) => {
  // ── Summary mode state ──────────────────────────────────────────────────
  const [activeIdx, setActiveIdx] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Single-feature mode state ───────────────────────────────────────────
  const isSingle = !!feature;
  const singleCfg = feature ? singleConfigs[feature] : null;

  // Init single view immediately (not in useEffect) to avoid first-render flash
  const [singleView, setSingleView] = useState<string | undefined>(
    () => singleCfg?.dockTabs[0]?.key
  );

  // Summary auto-advance
  useEffect(() => {
    if (isSingle || paused) return;
    intervalRef.current = setInterval(() => {
      setActiveIdx(prev => (prev + 1) % summaryTabs.length);
      setDirection(1);
    }, INTERVAL);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isSingle, paused, activeIdx]);

  const goTo = (i: number) => {
    if (i === activeIdx) return;
    setDirection(i > activeIdx ? 1 : -1);
    setActiveIdx(i);
  };

  const activeSummaryTab = summaryTabs[activeIdx];
  const activeColor = isSingle ? singleCfg!.color : activeSummaryTab.color;
  const activeLabel = isSingle ? (singleCfg!.dockTabs.find(t => t.key === singleView)?.label ?? singleCfg!.label) : activeSummaryTab.label;

  // Render the skeleton for single mode
  const renderSingleSkeleton = () => {
    if (!feature) return null;
    const v = singleView as any;
    switch (feature) {
      case 'performance': return <SkeletonOne controlledView={v} onViewChange={setSingleView as any} />;
      case 'seo':         return <SkeletonTwo controlledView={v} onViewChange={setSingleView as any} />;
      case 'design':      return <SkeletonThree controlledView={v} onViewChange={setSingleView as any} />;
      case 'systems':     return <SkeletonFour controlledView={v} onViewChange={setSingleView as any} />;
    }
  };

  // Summary skeletons (no controlled view — self-managed)
  const summarySkeletons: Record<string, React.ReactNode> = {
    performance: <SkeletonOne />,
    seo:         <SkeletonTwo />,
    design:      <SkeletonThree />,
    systems:     <SkeletonFour />,
  };

  return (
    <div className="px-0 md:px-2 md:my-20">
      <div className="relative w-full overflow-hidden rounded-none md:rounded-3xl" style={{ background: '#080809' }}>

        <GrainCanvas strength="light" opacity={0.45} zIndex={1} />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background: 'radial-gradient(ellipse 70% 55% at 50% 10%, rgba(80,80,120,0.22) 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 px-4 md:px-8 pt-10 pb-8">

          {(heading || sub_heading) && (
            <div className="text-center mb-8">
              {heading && (
                <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">{heading}</h2>
              )}
              {sub_heading && (
                <p className="text-sm mt-2 max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.38)' }}>{sub_heading}</p>
              )}
            </div>
          )}

          {/* macOS bezel */}
          <div
            className="relative rounded-[20px] p-[3px]"
            style={{
              background: 'linear-gradient(180deg, #3a3a3a 0%, #1a1a1a 40%, #111 100%)',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.06), 0 40px 100px rgba(0,0,0,0.8), 0 16px 40px rgba(0,0,0,0.5)',
            }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div
              className="relative overflow-hidden rounded-[18px]"
              style={{ boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.8), inset 0 2px 8px rgba(0,0,0,0.6)' }}
            >
              <MacMenuBar />

              <div
                className="relative flex flex-col items-center justify-center"
                style={{ minHeight: 780, background: '#0e0e0e' }}
              >
                {/* Wallpaper ambient glow */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  animate={{ background: `radial-gradient(ellipse 65% 55% at 50% 45%, ${activeColor}16 0%, transparent 65%)` }}
                  transition={{ duration: 0.8 }}
                />
                <div className="absolute inset-0 pointer-events-none" style={{
                  background: 'radial-gradient(ellipse 50% 40% at 15% 80%, rgba(120,40,40,0.12) 0%, transparent 55%), radial-gradient(ellipse 40% 35% at 85% 15%, rgba(60,40,90,0.1) 0%, transparent 50%)',
                }} />

                {/* Content window */}
                <div className="w-full max-w-[580px] mx-auto px-4 pt-4 pb-10 z-10 relative">
                  {isSingle ? (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {renderSingleSkeleton()}
                    </motion.div>
                  ) : (
                    <AnimatePresence mode="wait" custom={direction}>
                      <motion.div
                        key={activeSummaryTab.key}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                      >
                        {summarySkeletons[activeSummaryTab.key]}
                      </motion.div>
                    </AnimatePresence>
                  )}
                </div>

                {/* Glass dock */}
                <div className="absolute bottom-5 left-0 right-0 flex flex-col items-center gap-[6px]">
                  {/* Label above dock */}
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={activeLabel}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="text-[11px] font-medium"
                      style={{ color: 'rgba(255,255,255,0.45)' }}
                    >
                      {activeLabel}
                    </motion.span>
                  </AnimatePresence>

                  <div
                    className="flex items-center gap-[6px] rounded-[20px] p-[6px]"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      backdropFilter: 'blur(24px)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 8px 32px rgba(0,0,0,0.4)',
                    }}
                  >
                    {isSingle
                      // Single mode: dock = feature's own tabs (same style as summary)
                      ? singleCfg!.dockTabs.map((tab) => {
                          const isActive = singleView === tab.key;
                          return (
                            <motion.button
                              key={tab.key}
                              onClick={() => setSingleView(tab.key)}
                              animate={{ scale: isActive ? 1.28 : 1 }}
                              whileTap={{ scale: 0.9 }}
                              transition={{ type: 'spring', stiffness: 400, damping: 26 }}
                              title={tab.label}
                              className="relative flex items-center justify-center rounded-[14px] cursor-pointer"
                              style={{
                                width: 48,
                                height: 48,
                                background: isActive ? `${singleCfg!.accent}22` : 'rgba(255,255,255,0.04)',
                                border: isActive ? `1px solid ${singleCfg!.accent}55` : '1px solid rgba(255,255,255,0.07)',
                                color: isActive ? singleCfg!.accent : 'rgba(255,255,255,0.3)',
                                boxShadow: isActive
                                  ? `inset 0 1px 0 rgba(255,255,255,0.15), 0 4px 16px rgba(0,0,0,0.4)`
                                  : 'inset 0 1px 0 rgba(255,255,255,0.04)',
                              }}
                            >
                              <span style={{ transform: 'scale(1.8)', display: 'flex' }}>{tab.icon}</span>
                            </motion.button>
                          );
                        })
                      // Summary mode: dock = 4 card switchers
                      : summaryTabs.map((tab, i) => {
                          const isActive = i === activeIdx;
                          return (
                            <motion.button
                              key={tab.key}
                              onClick={() => goTo(i)}
                              animate={{ scale: isActive ? 1.28 : 1 }}
                              whileTap={{ scale: 0.9 }}
                              transition={{ type: 'spring', stiffness: 400, damping: 26 }}
                              title={tab.label}
                              className="relative flex items-center justify-center rounded-[14px] cursor-pointer"
                              style={{
                                width: 48,
                                height: 48,
                                background: isActive ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.04)',
                                border: isActive ? '1px solid rgba(255,255,255,0.22)' : '1px solid rgba(255,255,255,0.07)',
                                color: isActive ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.3)',
                                boxShadow: isActive
                                  ? 'inset 0 1px 0 rgba(255,255,255,0.15), 0 4px 16px rgba(0,0,0,0.4)'
                                  : 'inset 0 1px 0 rgba(255,255,255,0.04)',
                              }}
                            >
                              {tab.icon}
                            </motion.button>
                          );
                        })
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
