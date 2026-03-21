'use client';

import { useEffect, useRef } from 'react';

const serpRows = [
  { pos: '1', title: 'Webdesign Budapest | [davelopment]®', url: 'davelopment.hu › webdesign-budapest' },
  { pos: '2', title: 'Next.js Fejlesztő Budapest | [davelopment]®', url: 'davelopment.hu › fejlesztes' },
  { pos: '3', title: 'Branding & Arculat | [davelopment]®', url: 'davelopment.hu › branding' },
  { pos: '4', title: 'SEO & Tartalommarketing | [davelopment]®', url: 'davelopment.hu › seo' },
];

const keywords = [
  { label: 'webdesign budapest', vol: '2.4k/hó', width: 88 },
  { label: 'webfejlesztés árak', vol: '1.8k/hó', width: 72 },
  { label: 'freelancer fejlesztő', vol: '960/hó', width: 48 },
  { label: 'next.js fejlesztő', vol: '720/hó', width: 36 },
];

const metrics = [
  { val: '4.2k', label: 'Organikus forgalom', delta: '↑ 340%' },
  { val: '14', label: 'Kulcsszó #1 pozíció', delta: '↑ 12 hellyel' },
  { val: '8.4%', label: 'CTR átlag', delta: '↑ 2.4x' },
];

const audits = [
  { text: 'Technikai SEO audit — meta, canonical, structured data' },
  { text: 'Kulcsszókutatás & tartalomstratégia' },
  { text: 'Google Search Console integráció & monitoring' },
];

interface Props {
  expanded?: boolean;
}

export const SkeletonTwo = ({ expanded = false }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  const activeIdxRef = useRef(0);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const kwRefs = useRef<(HTMLDivElement | null)[]>([]);
  const metricRefs = useRef<(HTMLDivElement | null)[]>([]);
  const auditRefs = useRef<(HTMLDivElement | null)[]>([]);
  const serpIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // SERP tick — compact és expanded közös
  function startSerpTick() {
    if (serpIntervalRef.current) clearInterval(serpIntervalRef.current);
    const tick = () => {
      rowRefs.current.forEach((el, i) => {
        if (!el) return;
        if (i === activeIdxRef.current) {
          el.style.borderColor = 'rgba(52,211,153,0.28)';
          el.style.background = 'rgba(52,211,153,0.05)';
          el.style.transform = 'translateX(6px)';
        } else {
          el.style.borderColor = 'rgba(255,255,255,0.05)';
          el.style.background = '#111';
          el.style.transform = 'translateX(0)';
        }
      });
      activeIdxRef.current = (activeIdxRef.current + 1) % serpRows.length;
    };
    tick();
    serpIntervalRef.current = setInterval(tick, 1400);
  }

  // Compact — mount-on indul
  useEffect(() => {
    if (expanded) return;
    const timer = setTimeout(() => startSerpTick(), 400);
    return () => {
      clearTimeout(timer);
      if (serpIntervalRef.current) clearInterval(serpIntervalRef.current);
    };
  }, [expanded]);

  // Expanded — IntersectionObserver
  useEffect(() => {
    if (!expanded) return;
    const container = containerRef.current;
    if (!container) return;

    function runAnimations() {
      kwRefs.current.forEach(el => { if (el) el.style.width = '0%'; });
      metricRefs.current.forEach(el => { if (el) el.textContent = '—'; });
      auditRefs.current.forEach(el => {
        if (el) { el.style.opacity = '0'; el.style.transform = 'translateY(8px)'; }
      });

      setTimeout(() => {
        startSerpTick();
        kwRefs.current.forEach((el, i) => {
          if (el) setTimeout(() => { el.style.width = keywords[i].width + '%'; }, 500);
        });
        metricRefs.current.forEach((el, i) => {
          if (el) setTimeout(() => { el.textContent = metrics[i].val; }, 700 + i * 150);
        });
        auditRefs.current.forEach((el, i) => {
          if (el) setTimeout(() => {
            el.style.transition = 'opacity .4s, transform .4s';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          }, 900 + i * 150);
        });
      }, 400);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          runAnimations();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(container);
    return () => {
      observer.disconnect();
      if (serpIntervalRef.current) clearInterval(serpIntervalRef.current);
    };
  }, [expanded]);

  if (!expanded) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div className="flex flex-col gap-1 w-[190px]">
          {serpRows.map((row, i) => (
            <div
              key={row.pos}
              ref={el => { rowRefs.current[i] = el; }}
              className="flex items-center gap-2 px-[10px] py-[6px] rounded-lg border"
              style={{ borderColor: 'rgba(255,255,255,0.05)', background: '#111', transition: 'all .45s cubic-bezier(.4,0,.2,1)' }}
            >
              <span className="text-[10px] font-medium w-3" style={{ color: 'rgba(255,255,255,0.18)' }}>{row.pos}</span>
              <div className="flex-1 flex flex-col gap-[3px]">
                <div className="h-[3px] rounded-sm bg-white/[0.08] w-[88%]" />
                <div className="h-[2px] rounded-sm bg-white/[0.04] w-[52%]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex flex-col gap-5 p-5 md:p-8 w-full relative">
      <div className="absolute top-3 right-3 bg-[rgba(52,211,153,0.1)] border border-[rgba(52,211,153,0.25)] rounded-full px-[9px] py-[3px] text-[9px] text-[#34d399] font-medium">
        Google Search Console
      </div>

      <div className="flex flex-col gap-[6px] pt-8">
        {serpRows.map((row, i) => (
          <div
            key={row.pos}
            ref={el => { rowRefs.current[i] = el; }}
            className="flex items-center gap-[10px] px-[14px] py-[10px] rounded-[10px] border"
            style={{ borderColor: 'rgba(255,255,255,0.05)', background: '#111', transition: 'all .45s cubic-bezier(.4,0,.2,1)' }}
          >
            <span className="text-[11px] font-medium w-4 flex-shrink-0 text-white/18">{row.pos}</span>
            <div className="flex-1 flex flex-col gap-[3px] overflow-hidden">
              <div className="text-[11px] font-medium text-white/70 truncate">{row.title}</div>
              <div className="text-[9px] text-white/25">{row.url}</div>
            </div>
            <span className="text-[9px] font-medium px-[7px] py-[2px] rounded-full opacity-0 bg-[rgba(52,211,153,0.12)] text-[#34d399] border border-[rgba(52,211,153,0.25)] flex-shrink-0">
              #{row.pos}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-[6px]">
        {keywords.map((kw, i) => (
          <div key={kw.label} className="flex items-center gap-[10px]">
            <span className="text-[10px] text-white/40 w-[140px] flex-shrink-0 truncate">{kw.label}</span>
            <div className="flex-1 h-[3px] bg-white/[0.06] rounded-full overflow-hidden">
              <div
                ref={el => { kwRefs.current[i] = el; }}
                className="h-full rounded-full bg-[#34d399] w-0"
                style={{ transition: 'width 1.4s cubic-bezier(.4,0,.2,1)' }}
              />
            </div>
            <span className="text-[10px] text-white/30 w-[44px] text-right flex-shrink-0">{kw.vol}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 md:gap-[10px]">
        {metrics.map((m, i) => (
          <div key={m.label} className="bg-[rgba(52,211,153,0.04)] border border-[rgba(52,211,153,0.12)] rounded-[10px] p-3 md:p-[18px]">
            <div ref={el => { metricRefs.current[i] = el; }} className="text-[20px] md:text-[28px] font-medium text-white leading-none mb-1">—</div>
            <div className="text-[9px] md:text-[10px] text-white/30">{m.label}</div>
            <div className="text-[9px] md:text-[10px] text-[#34d399] font-medium mt-[3px]">{m.delta}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-[6px] md:gap-2">
        {audits.map((a, i) => (
          <div
            key={a.text}
            ref={el => { auditRefs.current[i] = el; }}
            className="flex items-center gap-2 md:gap-[10px] bg-white/[0.02] border border-white/[0.04] rounded-[8px] p-[9px] md:p-[10px]"
            style={{ opacity: 0, transform: 'translateY(8px)' }}
          >
            <div className="w-[18px] h-[18px] md:w-[20px] md:h-[20px] rounded-full bg-[rgba(52,211,153,0.12)] flex items-center justify-center flex-shrink-0">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 5l2.5 2.5L8 3" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-[10px] md:text-[11px] text-white/45 flex-1">{a.text}</span>
            <span className="text-[10px] md:text-[11px] font-medium text-[#34d399] flex-shrink-0">✓</span>
          </div>
        ))}
      </div>
    </div>
  );
};