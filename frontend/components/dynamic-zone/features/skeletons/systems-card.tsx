'use client';

import { useEffect, useRef, useState } from 'react';

const COLORS = {
  green: '#34d399',
  yellow: '#f0c742',
  purple: '#7c6af7',
  blue: '#60a5fa',
};

const bookingDays = [3, 7, 8, 12, 14, 15, 18, 20, 21, 25, 27];
const today = 20;

const emailQueue = [
  { to: 'kovacs.peter@gmail.com', prog: 100, status: 'Elküldve', statusColor: COLORS.green },
  { to: 'info@lazars.hu', prog: 65, status: 'Küldés...', statusColor: COLORS.yellow },
  { to: 'newsletter@lista.hu', prog: 0, status: 'Várakozik', statusColor: 'rgba(255,255,255,0.2)' },
];

const feedData = [
  { color: COLORS.green, text: 'Új foglalás érkezett', time: '2p' },
  { color: COLORS.yellow, text: 'Email kampány elküldve', time: '14p' },
  { color: COLORS.purple, text: 'Utalvány beváltva', time: '31p' },
  { color: COLORS.green, text: 'CMS tartalom frissítve', time: '1ó' },
  { color: COLORS.yellow, text: 'Új blog bejegyzés', time: '2ó' },
];

const newFeedItems = [
  { color: COLORS.green, text: 'Új foglalás érkezett', time: 'most' },
  { color: COLORS.yellow, text: 'Email elküldve', time: 'most' },
  { color: COLORS.purple, text: 'Utalvány létrehozva', time: 'most' },
];

const statuses = [
  { name: 'Email', color: COLORS.yellow, pct: '99.9%', val: 99.9 },
  { name: 'Időpont', color: COLORS.purple, pct: '100%', val: 100 },
  { name: 'Strapi CMS', color: COLORS.green, pct: '99.8%', val: 99.8 },
  { name: 'Utalvány', color: COLORS.blue, pct: '100%', val: 100 },
];

const summaryItems = [
  { label: 'Aktív rendszer', target: 4, dotColor: COLORS.green, sub: 'Mind online' },
  { label: 'Email küldve', target: 247, dotColor: COLORS.yellow, sub: '↑ 24% ma' },
  { label: 'Foglalás ma', target: 38, dotColor: COLORS.purple, sub: '↑ 8 új' },
  { label: 'Látogató', target: 1840, dotColor: COLORS.green, sub: '↑ 12%' },
];

const chartData = [42, 58, 45, 72, 65, 88, 95];

interface Props {
  expanded?: boolean;
}

export const SkeletonFour = ({ expanded = false }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartWrapRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sumRefs = useRef<(HTMLDivElement | null)[]>([]);
  const queueBarRefs = useRef<(HTMLDivElement | null)[]>([]);
  const statusBarRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hasAnimated = useRef(false);
  const feedIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [clock, setClock] = useState('');
  const [feed, setFeed] = useState(feedData);

  // Clock
  useEffect(() => {
    if (!expanded) return;
    const update = () => setClock(new Date().toLocaleTimeString('hu-HU'));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [expanded]);

  // Compact canvas
  useEffect(() => {
    if (expanded) return;
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const W = wrap.offsetWidth;
    const H = wrap.offsetHeight;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d')!;

    const NODE_DEFS = [
      { id: 'web', label: 'Weboldal', rx: 0.13, ry: 0.5 },
      { id: 'strapi', label: 'Strapi', rx: 0.31, ry: 0.5 },
      { id: 'email', label: 'Email', rx: 0.50, ry: 0.2 },
      { id: 'blog', label: 'Blog', rx: 0.50, ry: 0.8 },
      { id: 'idop', label: 'Időpont', rx: 0.70, ry: 0.2 },
      { id: 'anal', label: 'Anal.', rx: 0.70, ry: 0.8 },
      { id: 'next', label: 'Next.js', rx: 0.88, ry: 0.5 },
    ];
    const EDGES = [[0,1],[1,2],[1,3],[2,4],[3,5],[4,6],[5,6]];
    const FLOWS = [[0,1,2,4,6],[0,1,3,5,6],[1,2,4],[1,3,5]];
    const ns = NODE_DEFS.map(n => ({ ...n, px: n.rx*W, py: n.ry*H, glow: 0, active: false }));
    const pkts: any[] = [];
    let fi = 0, animId: number;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    function drawIcon(id: string, x: number, y: number, r: number) {
      const s = r;
      ctx.beginPath();
      switch (id) {
        case 'web': ctx.arc(x,y,s*.42,0,Math.PI*2); ctx.moveTo(x-s*.42,y); ctx.lineTo(x+s*.42,y); ctx.moveTo(x,y-s*.42); ctx.lineTo(x,y+s*.42); break;
        case 'strapi': ctx.rect(x-s*.35,y-s*.35,s*.7,s*.7); ctx.moveTo(x-s*.35,y); ctx.lineTo(x+s*.35,y); ctx.moveTo(x,y-s*.35); ctx.lineTo(x,y+s*.35); break;
        case 'email': ctx.rect(x-s*.4,y-s*.28,s*.8,s*.56); ctx.moveTo(x-s*.4,y-s*.28); ctx.lineTo(x,y+s*.05); ctx.lineTo(x+s*.4,y-s*.28); break;
        case 'blog': ctx.moveTo(x-s*.35,y-s*.25); ctx.lineTo(x+s*.35,y-s*.25); ctx.moveTo(x-s*.35,y); ctx.lineTo(x+s*.35,y); ctx.moveTo(x-s*.35,y+s*.25); ctx.lineTo(x+s*.1,y+s*.25); break;
        case 'idop': ctx.rect(x-s*.35,y-s*.28,s*.7,s*.56); ctx.moveTo(x-s*.35,y-s*.05); ctx.lineTo(x+s*.35,y-s*.05); ctx.moveTo(x-s*.12,y-s*.42); ctx.lineTo(x-s*.12,y-s*.18); ctx.moveTo(x+s*.12,y-s*.42); ctx.lineTo(x+s*.12,y-s*.18); break;
        case 'anal': ctx.moveTo(x-s*.35,y+s*.3); ctx.lineTo(x-s*.35,y-s*.3); ctx.lineTo(x+s*.35,y-s*.3); ctx.moveTo(x-s*.2,y+s*.1); ctx.lineTo(x-s*.02,y-s*.1); ctx.lineTo(x+s*.15,y+s*.05); ctx.lineTo(x+s*.35,y-s*.2); break;
        case 'next': ctx.moveTo(x-s*.25,y-s*.35); ctx.lineTo(x-s*.25,y+s*.35); ctx.lineTo(x+s*.35,y-s*.35); ctx.moveTo(x-s*.25,y); ctx.lineTo(x+s*.15,y); break;
      }
      ctx.strokeStyle = '#fb7185';
      ctx.lineWidth = 0.8;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.stroke();
    }

    function spawnFlow() {
      const flow = FLOWS[fi++ % FLOWS.length];
      flow.forEach((_, i) => {
        if (i < flow.length - 1) {
          const t = setTimeout(() => {
            ns[flow[i]].active = true;
            pkts.push({ fi: flow[i], ti: flow[i+1], t: 0, x: 0, y: 0, trail: [] });
            const t2 = setTimeout(() => { ns[flow[i]].active = false; }, 500);
            timeouts.push(t2);
          }, i * 480);
          timeouts.push(t);
        }
      });
      const t = setTimeout(spawnFlow, flow.length * 480 + 500);
      timeouts.push(t);
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      EDGES.forEach(([a, b]) => {
        ctx.beginPath();
        ctx.moveTo(ns[a].px, ns[a].py);
        ctx.lineTo(ns[b].px, ns[b].py);
        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });
      for (let i = pkts.length - 1; i >= 0; i--) {
        const p = pkts[i];
        p.t = Math.min(p.t + 0.026, 1);
        const e = p.t < 0.5 ? 2*p.t*p.t : -1+(4-2*p.t)*p.t;
        p.x = ns[p.fi].px + (ns[p.ti].px - ns[p.fi].px) * e;
        p.y = ns[p.fi].py + (ns[p.ti].py - ns[p.fi].py) * e;
        p.trail.push({ x: p.x, y: p.y, a: 1 });
        p.trail.forEach((pt: any, j: number) => {
          pt.a *= 0.8;
          if (pt.a < 0.03) return;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 2*(j/p.trail.length), 0, Math.PI*2);
          ctx.fillStyle = `rgba(251,113,133,${pt.a*0.35})`;
          ctx.fill();
        });
        p.trail = p.trail.filter((pt: any) => pt.a > 0.03).slice(-18);
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 5);
        g.addColorStop(0, 'rgba(255,255,255,0.95)');
        g.addColorStop(0.5, 'rgba(251,113,133,0.85)');
        g.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, Math.PI*2);
        ctx.fillStyle = g;
        ctx.fill();
        if (p.t >= 1) { ns[p.ti].active = true; pkts.splice(i, 1); }
      }
      ns.forEach(n => {
        n.glow = n.active ? Math.min(n.glow + 0.1, 1) : Math.max(n.glow - 0.04, 0);
        const r = 13;
        if (n.glow > 0) {
          const gl = ctx.createRadialGradient(n.px, n.py, r, n.px, n.py, r*2.6);
          gl.addColorStop(0, `rgba(251,113,133,${0.2*n.glow})`);
          gl.addColorStop(1, 'transparent');
          ctx.beginPath();
          ctx.arc(n.px, n.py, r*2.6, 0, Math.PI*2);
          ctx.fillStyle = gl;
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(n.px, n.py, r, 0, Math.PI*2);
        ctx.strokeStyle = n.glow > 0 ? `rgba(251,113,133,${0.45+n.glow*0.5})` : 'rgba(255,255,255,0.09)';
        ctx.lineWidth = 0.5 + n.glow*0.5;
        ctx.fillStyle = n.glow > 0 ? `rgba(251,113,133,${0.1*n.glow})` : 'rgba(14,14,14,0.95)';
        ctx.fill();
        ctx.stroke();
        drawIcon(n.id, n.px, n.py, r);
        ctx.fillStyle = n.glow > 0 ? `rgba(251,113,133,${0.65+n.glow*0.35})` : 'rgba(255,255,255,0.28)';
        ctx.font = '500 7.5px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(n.label, n.px, n.py + r + 10);
      });
      animId = requestAnimationFrame(draw);
    }

    draw();
    spawnFlow();

    return () => {
      cancelAnimationFrame(animId);
      timeouts.forEach(clearTimeout);
    };
  }, [expanded]);

  // IntersectionObserver — expanded animációk
  useEffect(() => {
    if (!expanded) return;

    const container = containerRef.current;
    if (!container) return;

    function runAnimations() {
      // Summary counters
      sumRefs.current.forEach((el, i) => {
        if (!el) return;
        const target = summaryItems[i].target;
        let v = 0;
        const step = Math.max(1, Math.ceil(target / 40));
        const si = setInterval(() => {
          v = Math.min(v + step, target);
          el.textContent = v.toLocaleString();
          if (v >= target) clearInterval(si);
        }, 20);
      });

      // Queue bars
      queueBarRefs.current.forEach((el, i) => {
        if (el) setTimeout(() => { el.style.width = emailQueue[i].prog + '%'; }, 500 + i * 200);
      });

      // Status bars
      statusBarRefs.current.forEach((el, i) => {
        if (el) setTimeout(() => { el.style.width = statuses[i].val + '%'; }, 600 + i * 80);
      });

      // Chart
      setTimeout(() => {
        const mc = chartRef.current;
        const wrap = chartWrapRef.current;
        if (!mc || !wrap) return;
        const mw = wrap.offsetWidth || 200;
        const mh = wrap.offsetHeight || 58;
        mc.width = mw;
        mc.height = mh;
        const ctx = mc.getContext('2d')!;
        const maxV = Math.max(...chartData);
        const pts = chartData.map((v, i) => ({
          x: (i / (chartData.length - 1)) * mw,
          y: mh - (v / maxV) * (mh - 8) - 4,
        }));
        let prog = 0;
        const anim = () => {
          ctx.clearRect(0, 0, mw, mh);
          prog = Math.min(prog + 0.025, 1);
          const n = Math.min(Math.floor(prog * (pts.length - 1)) + 2, pts.length);
          const vp = pts.slice(0, n);
          if (vp.length < 2) { requestAnimationFrame(anim); return; }
          const g = ctx.createLinearGradient(0, 0, 0, mh);
          g.addColorStop(0, 'rgba(52,211,153,0.2)');
          g.addColorStop(1, 'rgba(52,211,153,0)');
          ctx.beginPath();
          ctx.moveTo(vp[0].x, mh);
          ctx.lineTo(vp[0].x, vp[0].y);
          for (let i = 1; i < vp.length; i++) {
            const c = { x: (vp[i-1].x + vp[i].x) / 2, y: (vp[i-1].y + vp[i].y) / 2 };
            ctx.quadraticCurveTo(vp[i-1].x, vp[i-1].y, c.x, c.y);
          }
          ctx.lineTo(vp[vp.length-1].x, mh);
          ctx.closePath();
          ctx.fillStyle = g;
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(vp[0].x, vp[0].y);
          for (let i = 1; i < vp.length; i++) {
            const c = { x: (vp[i-1].x + vp[i].x) / 2, y: (vp[i-1].y + vp[i].y) / 2 };
            ctx.quadraticCurveTo(vp[i-1].x, vp[i-1].y, c.x, c.y);
          }
          ctx.strokeStyle = COLORS.green;
          ctx.lineWidth = 1.5;
          ctx.stroke();
          const last = vp[vp.length - 1];
          ctx.beginPath();
          ctx.arc(last.x, last.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = COLORS.green;
          ctx.fill();
          if (prog < 1) requestAnimationFrame(anim);
        };
        requestAnimationFrame(anim);
      }, 200);

      // Live feed
      let ni = 0;
      feedIntervalRef.current = setInterval(() => {
        const item = newFeedItems[ni++ % newFeedItems.length];
        setFeed(prev => [item, ...prev.slice(0, 4)]);
      }, 2500);
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
      if (feedIntervalRef.current) clearInterval(feedIntervalRef.current);
    };
  }, [expanded]);

  if (!expanded) {
    return (
      <div ref={wrapRef} className="relative w-full h-full overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex flex-col gap-[7px] p-3 md:p-4 w-full">

      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
        <div className="flex items-center gap-[6px]">
          <div
            className="w-[6px] h-[6px] rounded-full bg-[#34d399]"
            style={{ animation: 'pulse 2s infinite' }}
          />
          <span className="text-[10px] font-medium text-white/40">Rendszerek — Élő</span>
        </div>
        <span className="text-[10px] text-white/20 tabular-nums">{clock}</span>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 bg-[#111] border border-white/[0.07] rounded-[9px] divide-x divide-white/[0.06]">
        {summaryItems.map((s, i) => (
          <div key={s.label} className="flex flex-col gap-[3px] px-3 py-[10px] md:px-[14px]">
            <div className="text-[9px] text-white/25">{s.label}</div>
            <div ref={el => { sumRefs.current[i] = el; }} className="text-[20px] md:text-[24px] font-semibold text-white leading-none tabular-nums">0</div>
            <div className="flex items-center gap-[3px]">
              <div className="w-[5px] h-[5px] rounded-full flex-shrink-0" style={{ background: s.dotColor }} />
              <span className="text-[9px] font-medium" style={{ color: s.dotColor }}>{s.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Calendar + Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[7px]">
        <div className="bg-[#111] border border-white/[0.07] rounded-[9px] p-[10px_12px]">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[9px] text-white/25 uppercase tracking-[.07em]">Foglalások — márc.</span>
            <span className="text-[9px] text-white/20">2026</span>
          </div>
          <div className="grid grid-cols-7 gap-[3px]">
            {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
              <div
                key={d}
                className="aspect-square rounded-[4px] flex items-center justify-center text-[8px] relative"
                style={{
                  background: d === today && bookingDays.includes(d) ? 'rgba(124,106,247,0.22)'
                    : d === today ? 'rgba(255,255,255,0.09)'
                    : bookingDays.includes(d) ? 'rgba(124,106,247,0.1)' : 'transparent',
                  border: d === today && bookingDays.includes(d) ? '0.5px solid rgba(124,106,247,0.45)'
                    : d === today ? '0.5px solid rgba(255,255,255,0.15)'
                    : bookingDays.includes(d) ? '0.5px solid rgba(124,106,247,0.2)' : 'none',
                  color: d === today ? '#fff' : bookingDays.includes(d) ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)',
                  fontWeight: d === today ? '600' : '400',
                }}
              >
                {d}
                {bookingDays.includes(d) && (
                  <div className="absolute bottom-[1px] left-1/2 -translate-x-1/2 w-[3px] h-[3px] rounded-full" style={{ background: COLORS.purple }} />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#111] border border-white/[0.07] rounded-[9px] p-[10px_12px]">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[9px] text-white/25 uppercase tracking-[.07em]">Forgalom / hét</span>
            <span className="text-[13px] font-semibold text-white tabular-nums">4.2k</span>
          </div>
          <div ref={chartWrapRef} className="relative h-[58px]">
            <canvas ref={chartRef} className="absolute inset-0 w-full h-full" />
          </div>
        </div>
      </div>

      {/* Queue + Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[7px]">
        <div className="bg-[#111] border border-white/[0.07] rounded-[9px] p-[10px_12px]">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[9px] text-white/25 uppercase tracking-[.07em]">Email sor</span>
            <span className="text-[9px] text-white/20">3 várakozó</span>
          </div>
          {emailQueue.map((e, i) => (
            <div key={e.to} className="flex items-center gap-2 mb-[6px] last:mb-0">
              <div className="w-[18px] h-[18px] rounded-[4px] flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(240,199,66,0.08)', border: '0.5px solid rgba(240,199,66,0.18)' }}>
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#f0c742" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 8 10-8"/></svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[9px] text-white/45 truncate">{e.to}</div>
                <div className="h-[2px] bg-white/[0.05] rounded-full overflow-hidden mt-[3px]">
                  <div
                    ref={el => { queueBarRefs.current[i] = el; }}
                    className="h-full rounded-full w-0"
                    style={{ background: COLORS.yellow, transition: 'width 1s cubic-bezier(.4,0,.2,1)' }}
                  />
                </div>
              </div>
              <span className="text-[8px] font-medium flex-shrink-0" style={{ color: e.statusColor }}>{e.status}</span>
            </div>
          ))}
        </div>
        <div className="bg-[#111] border border-white/[0.07] rounded-[9px] p-[10px_12px]">
          <div className="text-[9px] text-white/25 uppercase tracking-[.07em] mb-2">Aktivitás</div>
          {feed.slice(0, 5).map((f, i) => (
            <div key={i} className="flex items-center gap-[7px] py-1 border-b border-white/[0.03] last:border-0">
              <div className="w-[5px] h-[5px] rounded-full flex-shrink-0" style={{ background: f.color }} />
              <span className="text-[9px] text-white/40 flex-1">{f.text}</span>
              <span className="text-[8px] text-white/15 flex-shrink-0">{f.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Status */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-[6px]">
        {statuses.map((s, i) => (
          <div key={s.name} className="bg-[#111] border border-white/[0.07] rounded-[8px] p-[8px_10px]">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[9px] font-medium text-white/50">{s.name}</span>
              <div className="w-[5px] h-[5px] rounded-full" style={{ background: s.color, boxShadow: `0 0 5px ${s.color}55` }} />
            </div>
            <div className="text-[8px] text-white/18 mb-1">{s.pct}</div>
            <div className="h-[2px] bg-white/[0.04] rounded-full overflow-hidden">
              <div
                ref={el => { statusBarRefs.current[i] = el; }}
                className="h-full rounded-full w-0"
                style={{ background: s.color, transition: 'width 1.4s cubic-bezier(.4,0,.2,1)' }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};