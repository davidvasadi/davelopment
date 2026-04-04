'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
type Section = {
  title: string;
  description: string;
  mission_number?: string | number;
};

export const Launches = ({
  heading,
  sub_heading,
  launches,
}: {
  heading: string;
  sub_heading?: string;
  launches: Section[];
}) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY + window.innerHeight * 0.25;
      let current = 0;
      sectionRefs.current.forEach((el, idx) => {
        if (el && el.offsetTop <= scrollY) current = idx;
      });
      setActiveIdx(current);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [launches.length]);

  const scrollTo = (idx: number) => {
    sectionRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen">

      {/* Page header */}
      <div className="px-6 md:px-12 pt-24 pb-12 border-b border-black/10">
        {/* <motion.p
          className="text-[10px] tracking-[0.2em] text-black/30 mb-5"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          [davelopment]® — Jogi dokumentum
        </motion.p> */}
        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-black leading-none mb-5"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
        >
          {heading}
        </motion.h1>
        {sub_heading && (
          <motion.p
            className="text-sm text-black/40 max-w-xl leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            {sub_heading}
          </motion.p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row">

        {/* ── Sticky sidebar TOC — desktop ── */}
        <aside
          className="hidden lg:block w-64 xl:w-72 shrink-0 self-start sticky top-16 max-h-[calc(100vh-4rem)] overflow-y-auto border-r border-black/10 py-10 px-6"
        >
          <p className="text-[9px] tracking-[0.2em] uppercase text-black/25 mb-5 px-2">
            Tartalomjegyzék
          </p>
          <nav>
            {launches.map((section, idx) => (
              <button
                key={idx}
                onClick={() => scrollTo(idx)}
                className={cn(
                  'w-full text-left flex items-start gap-3 px-2 py-2.5 rounded-lg text-sm transition-all duration-200 group',
                  activeIdx === idx
                    ? 'text-black'
                    : 'text-black/30 hover:text-black/60'
                )}
              >
                <span className={cn(
                  'text-[9px] font-mono mt-0.5 shrink-0 transition-colors',
                  activeIdx === idx ? 'text-black/50' : 'text-black/20'
                )}>
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <span className="leading-snug">{section.title}</span>
                {activeIdx === idx && (
                  <motion.div
                    layoutId="toc-dot"
                    className="ml-auto w-1 h-1 rounded-full bg-black shrink-0 mt-1.5"
                  />
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* ── Mobile TOC ── */}
        <div className="lg:hidden sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-black/10">
          <button
            onClick={() => setMobileOpen(v => !v)}
            className="w-full flex items-center justify-between px-6 py-4"
          >
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono text-black/30">
                {String(activeIdx + 1).padStart(2, '0')}
              </span>
              <span className="text-sm font-medium text-black truncate">
                {launches[activeIdx]?.title ?? 'Tartalomjegyzék'}
              </span>
            </div>
            <span className={cn(
              'text-black/40 transition-transform duration-200 text-xs',
              mobileOpen ? 'rotate-180' : ''
            )}>▾</span>
          </button>

          <AnimatePresence>
            {mobileOpen && (
              <motion.nav
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden px-6 pb-3 space-y-1"
              >
                {launches.map((section, idx) => (
                  <button
                    key={idx}
                    onClick={() => scrollTo(idx)}
                    className="w-full text-left flex items-center gap-3 py-2 text-sm text-black/50 hover:text-black transition-colors"
                  >
                    <span className="text-[9px] font-mono text-black/25">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    {section.title}
                  </button>
                ))}
              </motion.nav>
            )}
          </AnimatePresence>
        </div>

        {/* ── Main content ── */}
        <main className="flex-1 px-6 md:px-12 lg:px-16 xl:px-20 py-12 lg:py-16 max-w-3xl">
          {launches.map((section, idx) => (
            <motion.section
              key={idx}
              ref={(el) => { sectionRefs.current[idx] = el; }}
              id={`section-${idx}`}
              className="mb-20 scroll-mt-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.05 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-[10px] font-mono text-black/20 shrink-0">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <h2 className="text-2xl md:text-3xl font-semibold text-black tracking-tight leading-tight">
                  {section.title}
                </h2>
              </div>

              <div className="pl-8 text-sm md:text-base text-black/65 leading-relaxed [&_p]:mb-3">
                {section.description?.split('\n').map((para: string, pIdx: number) =>
                  para.trim() ? <p key={pIdx}>{para}</p> : null
                )}
              </div>

              {idx < launches.length - 1 && (
                <div className="mt-20 h-px bg-black/8" />
              )}
            </motion.section>
          ))}

          <div className="mt-8 pt-8 border-t border-black/8">
            <p className="text-xs text-black/25">[davelopment]® — Minden jog fenntartva.</p>
          </div>
        </main>

      </div>
    </div>
  );
};
