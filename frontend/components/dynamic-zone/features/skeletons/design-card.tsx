'use client';

import { useEffect, useRef } from 'react';

const cursorPositions = [
  { left: 130, top: 20 },
  { left: 60, top: 58 },
  { left: 100, top: 104 },
  { left: 72, top: 74 },
  { left: 124, top: 46 },
];

const colors = ['#111111', '#fbbf24', '#f5f5f5', '#6366f1', '#34d399'];

const fonts = [
  { name: 'Heading', style: { fontSize: '15px', fontWeight: '700' } },
  { name: 'Body', style: { fontSize: '13px', fontWeight: '400' } },
  { name: 'Mono', style: { fontSize: '12px', fontFamily: 'monospace' } },
];

const layers = [
  { name: 'Navigation', color: 'rgba(99,102,241,0.4)', activeColor: { bg: 'rgba(99,102,241,0.05)', border: 'rgba(99,102,241,0.5)', text: 'rgba(99,102,241,0.6)' }, height: 18 },
  { name: 'Hero', color: 'rgba(251,191,36,0.4)', activeColor: { bg: 'rgba(251,191,36,0.05)', border: '#fbbf24', text: 'rgba(251,191,36,0.6)' }, height: 44 },
  { name: 'Features', color: 'rgba(52,211,153,0.4)', activeColor: { bg: 'rgba(52,211,153,0.05)', border: 'rgba(52,211,153,0.5)', text: 'rgba(52,211,153,0.6)' }, height: 28 },
  { name: 'CTA Block', color: 'rgba(251,113,133,0.4)', activeColor: { bg: 'rgba(251,113,133,0.05)', border: 'rgba(251,113,133,0.5)', text: 'rgba(251,113,133,0.6)' }, height: 18 },
  { name: 'Footer', color: 'rgba(167,139,250,0.4)', activeColor: { bg: 'rgba(167,139,250,0.05)', border: 'rgba(167,139,250,0.5)', text: 'rgba(167,139,250,0.6)' }, height: 14 },
];

const devices = [
  { label: 'Főoldal', accentColor: 'rgba(251,191,36,0.08)', borderColor: 'rgba(251,191,36,0.2)', textColor: 'rgba(251,191,36,0.7)' },
  { label: 'Projektek', accentColor: 'rgba(99,102,241,0.08)', borderColor: 'rgba(99,102,241,0.2)', textColor: 'rgba(99,102,241,0.7)' },
  { label: 'Kapcsolat', accentColor: 'rgba(52,211,153,0.08)', borderColor: 'rgba(52,211,153,0.2)', textColor: 'rgba(52,211,153,0.7)' },
];

const metrics = [
  { val: '3-5x', label: 'Design iteráció', delta: 'Figma alapú' },
  { val: '5+', label: 'Képernyőméret', delta: 'Reszponzív' },
  { val: '1 hét', label: 'Átadási idő', delta: 'Gyors sprint' },
];

interface Props {
  expanded?: boolean;
}

export const SkeletonThree = ({ expanded = false }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  const curRef = useRef<HTMLDivElement>(null);
  const selRef = useRef<HTMLDivElement>(null);
  const colorRefs = useRef<(HTMLDivElement | null)[]>([]);
  const fontRefs = useRef<(HTMLDivElement | null)[]>([]);
  const deviceRefs = useRef<(HTMLDivElement | null)[]>([]);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const previewRefs = useRef<(HTMLDivElement | null)[]>([]);
  const metricRefs = useRef<(HTMLDivElement | null)[]>([]);
  const baBeforeRef = useRef<HTMLDivElement>(null);
  const baDivRef = useRef<HTMLDivElement>(null);
  const baWrapRef = useRef<HTMLDivElement>(null);
  const intervalsRef = useRef<ReturnType<typeof setInterval>[]>([]);

  function startCursor() {
    let pi = 0;
    const curInterval = setInterval(() => {
      pi = (pi + 1) % cursorPositions.length;
      if (curRef.current) {
        curRef.current.style.left = cursorPositions[pi].left + 'px';
        curRef.current.style.top = cursorPositions[pi].top + 'px';
      }
      if (selRef.current) {
        if (pi === 2) {
          selRef.current.style.display = 'block';
          selRef.current.style.left = '48px';
          selRef.current.style.top = '58px';
          selRef.current.style.width = '66px';
          selRef.current.style.height = '32px';
        } else {
          selRef.current.style.display = 'none';
        }
      }
    }, 1100);
    intervalsRef.current.push(curInterval);
  }

  // Compact — mount-on indul
  useEffect(() => {
    if (expanded) return;
    const timer = setTimeout(() => startCursor(), 400);
    return () => {
      clearTimeout(timer);
      intervalsRef.current.forEach(clearInterval);
      intervalsRef.current = [];
    };
  }, [expanded]);

  // Expanded — IntersectionObserver
  useEffect(() => {
    if (!expanded) return;
    const container = containerRef.current;
    if (!container) return;

    function runAnimations() {
      colorRefs.current.forEach(el => { if (el) { el.style.opacity = '0'; el.style.transform = 'scale(0.8)'; } });
      fontRefs.current.forEach(el => { if (el) { el.style.opacity = '0'; el.style.transform = 'translateX(-8px)'; } });
      deviceRefs.current.forEach(el => { if (el) { el.style.opacity = '0'; el.style.transform = 'translateY(8px)'; } });
      layerRefs.current.forEach(el => { if (el) { el.style.opacity = '0'; el.style.transform = 'translateX(-6px)'; } });
      metricRefs.current.forEach(el => { if (el) el.textContent = '—'; });

      setTimeout(() => {
        startCursor();

        colorRefs.current.forEach((el, i) => {
          if (el) setTimeout(() => {
            el.style.transition = 'opacity .3s, transform .3s';
            el.style.opacity = '1';
            el.style.transform = 'scale(1)';
          }, 300 + i * 80);
        });

        fontRefs.current.forEach((el, i) => {
          if (el) setTimeout(() => {
            el.style.transition = 'opacity .3s, transform .3s';
            el.style.opacity = '1';
            el.style.transform = 'translateX(0)';
          }, 500 + i * 100);
        });

        deviceRefs.current.forEach((el, i) => {
          if (el) setTimeout(() => {
            el.style.transition = 'opacity .4s, transform .4s';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          }, 400 + i * 120);
        });

        layerRefs.current.forEach((el, i) => {
          if (el) setTimeout(() => {
            el.style.transition = 'opacity .3s, transform .3s';
            el.style.opacity = '1';
            el.style.transform = 'translateX(0)';
          }, 300 + i * 80);
        });

        let activeL = 0;
        const setLayer = (idx: number) => {
          layerRefs.current.forEach((el, i) => {
            if (!el) return;
            el.style.background = i === idx ? 'rgba(251,191,36,0.08)' : 'transparent';
          });
          previewRefs.current.forEach((el, i) => {
            if (!el) return;
            const l = layers[i];
            if (i === idx) {
              el.style.background = l.activeColor.bg;
              el.style.borderColor = l.activeColor.border;
              const span = el.querySelector('span') as HTMLSpanElement;
              if (span) { span.style.color = l.activeColor.text; span.style.opacity = '1'; }
            } else {
              el.style.background = 'rgba(255,255,255,0.03)';
              el.style.borderColor = 'transparent';
              const span = el.querySelector('span') as HTMLSpanElement;
              if (span) span.style.opacity = '0';
            }
          });
        };
        setLayer(0);
        const layerInterval = setInterval(() => { activeL = (activeL + 1) % layers.length; setLayer(activeL); }, 1200);
        intervalsRef.current.push(layerInterval);

        metricRefs.current.forEach((el, i) => {
          if (el) setTimeout(() => { el.textContent = metrics[i].val; }, 700 + i * 150);
        });

        // Before/After
        let baPos = 50, baDir = -1, dragging = false;
        const baInterval = setInterval(() => {
          if (dragging) return;
          baPos += baDir * 0.4;
          if (baPos <= 20) baDir = 1;
          if (baPos >= 80) baDir = -1;
          if (baBeforeRef.current) baBeforeRef.current.style.width = baPos + '%';
          if (baDivRef.current) baDivRef.current.style.left = baPos + '%';
        }, 30);
        intervalsRef.current.push(baInterval);

        const getX = (e: MouseEvent | TouchEvent) => 'touches' in e ? e.touches[0].clientX : e.clientX;
        const onDown = () => { dragging = true; };
        const onUp = () => { dragging = false; };
        const onMove = (e: MouseEvent | TouchEvent) => {
          if (!dragging || !baWrapRef.current) return;
          const r = baWrapRef.current.getBoundingClientRect();
          baPos = Math.max(5, Math.min(95, (getX(e) - r.left) / r.width * 100));
          if (baBeforeRef.current) baBeforeRef.current.style.width = baPos + '%';
          if (baDivRef.current) baDivRef.current.style.left = baPos + '%';
        };
        const baEl = baWrapRef.current;
        if (baEl) {
          baEl.addEventListener('mousedown', onDown);
          baEl.addEventListener('touchstart', onDown);
          window.addEventListener('mouseup', onUp);
          window.addEventListener('touchend', onUp);
          window.addEventListener('mousemove', onMove as any);
          window.addEventListener('touchmove', onMove as any);
        }
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
      intervalsRef.current.forEach(clearInterval);
      intervalsRef.current = [];
    };
  }, [expanded]);

  if (!expanded) {
    return (
      <div className="flex items-center justify-center h-full w-full relative">
        <div className="relative flex items-center justify-center">
          <div className="bg-[#181818] border border-white/[0.08] rounded-[10px] p-3 w-[128px] flex flex-col gap-[6px]">
            <div className="h-[3px] rounded-sm bg-white/[0.10]" style={{ width: '68%' }} />
            <div className="h-[3px] rounded-sm bg-white/[0.10]" style={{ width: '46%' }} />
            <div className="h-[30px] rounded bg-white/[0.05]" />
            <div className="h-[3px] rounded-sm bg-white/[0.10] w-full" />
            <div className="h-[3px] rounded-sm bg-white/[0.10]" style={{ width: '74%' }} />
            <div className="h-[12px] w-[52px] rounded-sm bg-[#fbbf24]" />
          </div>
          <div
            ref={curRef}
            className="absolute pointer-events-none"
            style={{ left: 130, top: 20, transition: 'left 1s cubic-bezier(.4,0,.2,1), top 1s cubic-bezier(.4,0,.2,1)', filter: 'drop-shadow(0 2px 5px rgba(0,0,0,.8))' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24"><path d="M4 2l16 8-8 2-4 8z" fill="#fbbf24" /></svg>
            <div className="absolute top-[14px] left-[9px] bg-[#fbbf24] text-black text-[9px] px-[6px] py-[2px] rounded font-semibold whitespace-nowrap">Dávid</div>
          </div>
          <div ref={selRef} className="absolute pointer-events-none border-[1.5px] border-[#fbbf24] rounded-sm bg-[rgba(251,191,36,0.07)]" style={{ display: 'none' }} />
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex flex-col gap-5 p-5 md:p-7 w-full relative">
      <div className="absolute top-3 right-3 bg-[rgba(251,191,36,0.1)] border border-[rgba(251,191,36,0.25)] rounded-full px-[9px] py-[3px] text-[9px] text-[#fbbf24] font-medium">
        Figma Design
      </div>

      <div className="flex gap-4 items-start pt-2">
        <div className="relative flex-shrink-0">
          <div className="bg-[#181818] border border-white/[0.08] rounded-[10px] p-3 w-[160px] flex flex-col gap-[6px]">
            <div className="h-[3px] rounded-sm bg-white/[0.10]" style={{ width: '68%' }} />
            <div className="h-[3px] rounded-sm bg-white/[0.10]" style={{ width: '46%' }} />
            <div className="h-[36px] rounded bg-white/[0.05]" />
            <div className="h-[3px] rounded-sm bg-white/[0.10] w-full" />
            <div className="h-[3px] rounded-sm bg-white/[0.10]" style={{ width: '74%' }} />
            <div className="h-[14px] w-[64px] rounded-sm bg-[#fbbf24]" />
          </div>
          <div
            ref={curRef}
            className="absolute pointer-events-none"
            style={{ left: 130, top: 20, transition: 'left 1s cubic-bezier(.4,0,.2,1), top 1s cubic-bezier(.4,0,.2,1)', filter: 'drop-shadow(0 2px 5px rgba(0,0,0,.8))' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24"><path d="M4 2l16 8-8 2-4 8z" fill="#fbbf24" /></svg>
            <div className="absolute top-[14px] left-[9px] bg-[#fbbf24] text-black text-[9px] px-[6px] py-[2px] rounded font-semibold whitespace-nowrap">Dávid</div>
          </div>
          <div ref={selRef} className="absolute pointer-events-none border-[1.5px] border-[#fbbf24] rounded-sm bg-[rgba(251,191,36,0.07)]" style={{ display: 'none' }} />
        </div>

        <div className="flex-1 flex flex-col gap-3">
          <div>
            <div className="text-[9px] text-white/30 uppercase tracking-[.08em] font-medium mb-[6px]">Színpaletta</div>
            <div className="flex gap-[6px] flex-wrap">
              {colors.map((c, i) => (
                <div
                  key={c}
                  ref={el => { colorRefs.current[i] = el; }}
                  className="w-7 h-7 rounded-[6px] border border-white/10 flex-shrink-0"
                  style={{ background: c, opacity: 0, transform: 'scale(0.8)' }}
                />
              ))}
            </div>
          </div>
          <div>
            <div className="text-[9px] text-white/30 uppercase tracking-[.08em] font-medium mb-[6px]">Tipográfia</div>
            <div className="flex flex-col gap-1">
              {fonts.map((f, i) => (
                <div
                  key={f.name}
                  ref={el => { fontRefs.current[i] = el; }}
                  className="flex items-center gap-2 bg-white/[0.02] border border-white/[0.05] rounded-[6px] px-[10px] py-[6px]"
                  style={{ opacity: 0, transform: 'translateX(-8px)' }}
                >
                  <span className="text-[10px] text-white/40 w-[60px] flex-shrink-0">{f.name}</span>
                  <span className="text-white/80" style={f.style}>Aa</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        ref={baWrapRef}
        className="relative h-[160px] rounded-[10px] overflow-hidden border border-white/[0.06] cursor-ew-resize select-none"
      >
        <span className="absolute top-[6px] left-[8px] text-[8px] font-semibold uppercase tracking-[.08em] text-white/25 z-[4]">Drót</span>
        <span className="absolute top-[6px] right-[8px] text-[8px] font-semibold uppercase tracking-[.08em] text-[rgba(251,191,36,0.6)] z-[4]">Design</span>
        <div className="absolute inset-0 bg-[#181818] flex flex-col">
          <div className="h-[22px] bg-[#111] border-b border-white/[0.05] flex items-center gap-1 px-2 flex-shrink-0">
            <div className="w-[5px] h-[5px] rounded-full bg-[#ff5f57]" />
            <div className="w-[5px] h-[5px] rounded-full bg-[#ffbd2e]" />
            <div className="w-[5px] h-[5px] rounded-full bg-[#28c840]" />
          </div>
          <div className="flex-1 p-[8px_10px] flex flex-col gap-[5px]">
            <div className="h-[44px] bg-[rgba(251,191,36,0.08)] border border-[rgba(251,191,36,0.2)] rounded-[5px] flex items-center justify-center">
              <span className="text-[9px] font-semibold text-[rgba(251,191,36,0.8)]">Budapest legmenőbb tech vállalata</span>
            </div>
            <div className="h-[16px] w-[68px] bg-[#fbbf24] rounded-[3px]" />
            <div className="h-[3px] rounded bg-white/[0.08]" style={{ width: '90%' }} />
            <div className="h-[3px] rounded bg-white/[0.08]" style={{ width: '72%' }} />
          </div>
        </div>
        <div ref={baBeforeRef} className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
          <div className="h-full w-full bg-[#111] flex flex-col" style={{ width: 'calc(100vw)' }}>
            <div className="h-[22px] bg-white/[0.02] border-b border-white/[0.04] flex-shrink-0" />
            <div className="flex-1 p-[8px_10px] flex flex-col gap-[5px]">
              <div className="h-[44px] border border-dashed border-white/[0.1] rounded-[4px] flex items-center justify-center">
                <span className="text-[8px] text-white/18">HERO</span>
              </div>
              <div className="h-[14px] w-[52px] border border-dashed border-white/[0.12] rounded-[3px]" />
              <div className="h-[3px] rounded bg-white/[0.05]" style={{ width: '88%' }} />
              <div className="h-[3px] rounded bg-white/[0.05]" style={{ width: '68%' }} />
            </div>
          </div>
        </div>
        <div ref={baDivRef} className="absolute top-0 bottom-0 w-[2px] bg-[#fbbf24] z-[5]" style={{ left: '50%', transform: 'translateX(-50%)' }}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-[#fbbf24] rounded-full flex items-center justify-center shadow-lg">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5"><path d="M8 4l-4 8 4 8M16 4l4 8-4 8"/></svg>
          </div>
        </div>
      </div>

      <div className="flex gap-[10px]">
        <div className="w-[130px] flex-shrink-0 bg-white/[0.02] border border-white/[0.05] rounded-[8px] p-[7px] flex flex-col gap-[3px]">
          <div className="text-[8px] text-white/20 uppercase tracking-[.08em] px-[5px] mb-[3px]">Layers</div>
          {layers.map((l, i) => (
            <div
              key={l.name}
              ref={el => { layerRefs.current[i] = el; }}
              className="flex items-center gap-[5px] px-[5px] py-[4px] rounded-[4px]"
              style={{ opacity: 0, transform: 'translateX(-6px)', transition: 'background .3s' }}
            >
              <div className="w-[10px] h-[10px] rounded-[2px] flex-shrink-0" style={{ background: l.color }} />
              <span className="text-[9px] text-white/40">{l.name}</span>
            </div>
          ))}
        </div>
        <div className="flex-1 bg-white/[0.02] border border-white/[0.05] rounded-[8px] p-[8px] flex flex-col gap-[5px]">
          {layers.map((l, i) => (
            <div
              key={l.name}
              ref={el => { previewRefs.current[i] = el; }}
              className="rounded-[4px] flex items-center justify-center"
              style={{ height: l.height, background: 'rgba(255,255,255,0.03)', border: '0.5px solid transparent', transition: 'all .3s' }}
            >
              <span className="text-[8px] font-medium" style={{ opacity: 0, color: l.activeColor.text, transition: 'opacity .3s' }}>{l.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {devices.map((d, i) => (
          <div
            key={d.label}
            ref={el => { deviceRefs.current[i] = el; }}
            className="bg-[#181818] border border-white/[0.08] rounded-[8px] overflow-hidden"
            style={{ opacity: 0, transform: 'translateY(8px)' }}
          >
            <div className="h-[16px] bg-[#111] border-b border-white/[0.05] flex items-center gap-[3px] px-[6px]">
              <div className="w-[4px] h-[4px] rounded-full bg-[#ff5f57]" />
              <div className="w-[4px] h-[4px] rounded-full bg-[#ffbd2e]" />
              <div className="w-[4px] h-[4px] rounded-full bg-[#28c840]" />
            </div>
            <div className="p-[6px_8px] flex flex-col gap-[3px]">
              <div className="h-[28px] rounded-[4px] flex items-center justify-center" style={{ background: d.accentColor, border: `0.5px solid ${d.borderColor}` }}>
                <span className="text-[8px] font-semibold" style={{ color: d.textColor }}>{d.label}</span>
              </div>
              <div className="h-[3px] rounded bg-white/[0.08]" style={{ width: '90%' }} />
              <div className="h-[8px] w-[44px] bg-[#fbbf24] rounded-[3px]" />
            </div>
            <div className="text-[8px] text-white/20 text-center pb-[4px]">{d.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 md:gap-[10px]">
        {metrics.map((m, i) => (
          <div key={m.label} className="bg-[rgba(251,191,36,0.04)] border border-[rgba(251,191,36,0.12)] rounded-[10px] p-3 md:p-[18px]">
            <div ref={el => { metricRefs.current[i] = el; }} className="text-[20px] md:text-[28px] font-medium text-white leading-none mb-1">—</div>
            <div className="text-[9px] md:text-[10px] text-white/30">{m.label}</div>
            <div className="text-[9px] md:text-[10px] text-[#fbbf24] font-medium mt-[3px]">{m.delta}</div>
          </div>
        ))}
      </div>
    </div>
  );
};