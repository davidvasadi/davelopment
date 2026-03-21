'use client';

import { useEffect, useRef } from 'react';

const vitals = [
  { label: 'FCP', value: '0.8s', width: 92 },
  { label: 'LCP', value: '1.2s', width: 96 },
  { label: 'CLS', value: '0.00', width: 100 },
  { label: 'TTI', value: '1.8s', width: 88 },
  { label: 'TBT', value: '12ms', width: 95 },
];

const metrics = [
  { val: '1.2s', label: 'Oldalbetöltés', delta: '↓ 68% gyorsabb' },
  { val: '18', label: 'HTTP kérések', delta: '↓ 42% kevesebb' },
  { val: '320kb', label: 'Oldalméret', delta: '↓ 71% kisebb' },
];

const compare = [
  { name: 'Te', score: 98, color: '#a78bfa', barColor: '#a78bfa' },
  { name: 'Iparági átlag', score: 51, color: 'rgba(255,255,255,0.4)', barColor: 'rgba(255,255,255,0.15)' },
  { name: 'Versenytárs', score: 63, color: 'rgba(255,255,255,0.4)', barColor: 'rgba(255,255,255,0.15)' },
];

const audits = [
  { text: 'Képek WebP/AVIF formátumban, lazy loading', gain: '+1.4s' },
  { text: 'JavaScript code splitting & tree shaking', gain: '+0.8s' },
  { text: 'CDN cache, statikus fájlok edge-ről', gain: '+0.6s' },
];

interface Props {
  expanded?: boolean;
}

export const SkeletonOne = ({ expanded = false }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  const arcRef = useRef<SVGCircleElement>(null);
  const scoreRef = useRef<HTMLSpanElement>(null);
  const vitalRefs = useRef<(HTMLDivElement | null)[]>([]);
  const metricRefs = useRef<(HTMLDivElement | null)[]>([]);
  const compareRefs = useRef<(HTMLDivElement | null)[]>([]);
  const auditRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Compact animáció — mindig fut mount-on
  useEffect(() => {
    if (expanded) return;
    const circumference = 220;
    if (arcRef.current) {
      arcRef.current.style.strokeDasharray = String(circumference);
      arcRef.current.style.strokeDashoffset = String(circumference);
      arcRef.current.style.transition = 'none';
    }
    vitalRefs.current.forEach(el => { if (el) el.style.width = '0%'; });
    if (scoreRef.current) scoreRef.current.textContent = '0';

    const timer = setTimeout(() => {
      if (arcRef.current) {
        arcRef.current.style.transition = 'stroke-dashoffset 2s cubic-bezier(.4,0,.2,1)';
        arcRef.current.style.strokeDashoffset = String(circumference * 0.02);
      }
      let s = 0;
      const si = setInterval(() => {
        s = Math.min(s + 2, 98);
        if (scoreRef.current) scoreRef.current.textContent = String(s);
        if (s >= 98) clearInterval(si);
      }, 18);
      vitalRefs.current.forEach((el, i) => {
        if (el) setTimeout(() => { el.style.width = vitals[i].width + '%'; }, 500);
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [expanded]);

  // Expanded — IntersectionObserver
  useEffect(() => {
    if (!expanded) return;
    const container = containerRef.current;
    if (!container) return;

    function runAnimations() {
      const circumference = 314;
      if (arcRef.current) {
        arcRef.current.style.strokeDasharray = String(circumference);
        arcRef.current.style.strokeDashoffset = String(circumference);
        arcRef.current.style.transition = 'none';
      }
      vitalRefs.current.forEach(el => { if (el) el.style.width = '0%'; });
      if (scoreRef.current) scoreRef.current.textContent = '0';
      compareRefs.current.forEach(el => { if (el) el.style.width = '0%'; });
      auditRefs.current.forEach(el => { if (el) { el.style.opacity = '0'; el.style.transform = 'translateY(8px)'; } });
      metricRefs.current.forEach(el => { if (el) el.textContent = '—'; });

      setTimeout(() => {
        if (arcRef.current) {
          arcRef.current.style.transition = 'stroke-dashoffset 2s cubic-bezier(.4,0,.2,1)';
          arcRef.current.style.strokeDashoffset = String(circumference * 0.02);
        }
        let s = 0;
        const si = setInterval(() => {
          s = Math.min(s + 2, 98);
          if (scoreRef.current) scoreRef.current.textContent = String(s);
          if (s >= 98) clearInterval(si);
        }, 18);
        vitalRefs.current.forEach((el, i) => {
          if (el) setTimeout(() => { el.style.width = vitals[i].width + '%'; }, 500);
        });
        metricRefs.current.forEach((el, i) => {
          if (el) setTimeout(() => { el.textContent = metrics[i].val; }, 700 + i * 150);
        });
        compareRefs.current.forEach((el, i) => {
          if (el) setTimeout(() => { el.style.width = compare[i].score + '%'; }, 600 + i * 150);
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
    return () => observer.disconnect();
  }, [expanded]);

  if (!expanded) {
    return (
      <div className="flex items-center justify-center h-full w-full relative">
        <div className="flex items-center gap-6 px-7">
          <div className="relative flex-shrink-0">
            <svg width="88" height="88" viewBox="0 0 88 88" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="44" cy="44" r="35" fill="none" stroke="rgba(167,139,250,0.08)" strokeWidth="2.5" />
              <circle
                ref={arcRef}
                cx="44" cy="44" r="35"
                fill="none" stroke="#a78bfa" strokeWidth="2.5"
                strokeLinecap="round" strokeDasharray="220" strokeDashoffset="220"
                style={{ transition: 'stroke-dashoffset 2s cubic-bezier(.4,0,.2,1)' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span ref={scoreRef} className="text-[22px] font-medium text-white leading-none">0</span>
              <span className="text-[9px] text-white/30 mt-[2px]">/ 100</span>
            </div>
          </div>
          <div className="flex flex-col gap-[10px]">
            {vitals.map((v, i) => (
              <div key={v.label} className="flex items-center gap-2">
                <span className="text-[10px] text-white/25 w-7 flex-shrink-0">{v.label}</span>
                <div className="w-[52px] h-[2px] bg-white/[0.06] rounded-full overflow-hidden">
                  <div
                    ref={el => { vitalRefs.current[i] = el; }}
                    className="h-full rounded-full bg-[#a78bfa] w-0"
                    style={{ transition: 'width 1.6s cubic-bezier(.4,0,.2,1)' }}
                  />
                </div>
                <span className="text-[10px] text-white/40 w-7 text-right flex-shrink-0">{v.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute top-3 right-3 bg-[rgba(167,139,250,0.1)] border border-[rgba(167,139,250,0.25)] rounded-full px-[9px] py-[3px] text-[9px] text-[#a78bfa] font-medium">
          Google PageSpeed
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex flex-col gap-5 p-5 md:p-8 w-full relative">
      <div className="absolute top-3 right-3 bg-[rgba(167,139,250,0.1)] border border-[rgba(167,139,250,0.25)] rounded-full px-[9px] py-[3px] text-[9px] text-[#a78bfa] font-medium">
        Google PageSpeed
      </div>

      <div className="flex items-center gap-6 md:gap-12">
        <div className="relative flex-shrink-0">
          <svg width="100" height="100" viewBox="0 0 120 120" className="md:w-[130px] md:h-[130px]" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(167,139,250,0.08)" strokeWidth="4" />
            <circle
              ref={arcRef}
              cx="60" cy="60" r="50"
              fill="none" stroke="#a78bfa" strokeWidth="4"
              strokeLinecap="round" strokeDasharray="314" strokeDashoffset="314"
              style={{ transition: 'stroke-dashoffset 2s cubic-bezier(.4,0,.2,1)' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span ref={scoreRef} className="text-[32px] md:text-[40px] font-medium text-white leading-none">0</span>
            <span className="text-[9px] text-white/30 mt-[3px]">/ 100</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-[11px] md:gap-[14px]">
          {vitals.map((v, i) => (
            <div key={v.label} className="flex items-center gap-2 md:gap-3">
              <span className="text-[10px] md:text-[11px] text-white/30 w-7 md:w-8 flex-shrink-0">{v.label}</span>
              <div className="flex-1 h-[3px] md:h-[4px] bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  ref={el => { vitalRefs.current[i] = el; }}
                  className="h-full rounded-full bg-[#a78bfa] w-0"
                  style={{ transition: 'width 1.6s cubic-bezier(.4,0,.2,1)' }}
                />
              </div>
              <span className="text-[10px] md:text-[11px] text-white/40 w-8 md:w-9 text-right flex-shrink-0">{v.value}</span>
              <div className="w-[6px] h-[6px] md:w-[7px] md:h-[7px] rounded-full bg-[#34d399] flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 md:gap-[10px]">
        {metrics.map((m, i) => (
          <div key={m.label} className="bg-[rgba(167,139,250,0.04)] border border-[rgba(167,139,250,0.12)] rounded-[10px] p-3 md:p-[18px]">
            <div ref={el => { metricRefs.current[i] = el; }} className="text-[20px] md:text-[28px] font-medium text-white leading-none mb-1">—</div>
            <div className="text-[9px] md:text-[10px] text-white/30">{m.label}</div>
            <div className="text-[9px] md:text-[10px] text-[#34d399] font-medium mt-[3px]">{m.delta}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 md:gap-[10px]">
        {compare.map((c, i) => (
          <div key={c.name} className="bg-white/[0.02] border border-white/[0.05] rounded-[10px] p-[10px] md:p-4 flex flex-col gap-[6px] md:gap-2">
            <div className="flex items-center gap-[5px]">
              <div className="w-[5px] h-[5px] rounded-full flex-shrink-0" style={{ background: c.barColor }} />
              <span className="text-[9px] md:text-[10px] text-white/35">{c.name}</span>
            </div>
            <div className="text-[24px] md:text-[32px] font-medium leading-none" style={{ color: c.color }}>{c.score}</div>
            <div className="h-[2px] md:h-[3px] bg-white/[0.06] rounded-full overflow-hidden">
              <div
                ref={el => { compareRefs.current[i] = el; }}
                className="h-full rounded-full w-0"
                style={{ background: c.barColor, transition: 'width 1.6s cubic-bezier(.4,0,.2,1)' }}
              />
            </div>
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
            <span className="text-[10px] md:text-[11px] font-medium text-[#34d399] flex-shrink-0">{a.gain}</span>
          </div>
        ))}
      </div>
    </div>
  );
};