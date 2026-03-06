import React, { useEffect, useRef, useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Stats {
  ok: boolean;
  newLeads: number;
  totalLeads: number;
  activeSubs: number;
  newSubs: number;
  monthSent: number;
}

interface MonthPoint {
  month: string; // "2025-01"
  sent: number;
}

// ─── Theme tokens (mirrors marketing-metrics plugin) ──────────────────────────
const DARK: Record<string, string> = {
  '--bg-page': '#030712', '--bg-card': '#0d1117', '--bg-inner': '#161b22',
  '--bg-inner2': '#21262d', '--border': '#21262d', '--border-hover': '#30363d',
  '--text-primary': '#f0f6fc', '--text-secondary': '#c9d1d9',
  '--text-muted': '#8b949e', '--text-faint': '#484f58',
  '--accent-green': '#3dffa0', '--accent-amber': '#f0c742',
  '--accent-red': '#f85149', '--accent-indigo': '#7c6af7',
  '--shadow': '0 0 0 1px rgba(240,246,252,0.04), 0 2px 8px rgba(0,0,0,0.5)',
  '--shadow-hover': '0 0 0 1px rgba(240,246,252,0.06), 0 8px 28px rgba(0,0,0,0.55)',
  '--chart-green': '#3dffa0', '--chart-indigo': '#7c6af7',
};
const LIGHT: Record<string, string> = {
  '--bg-page': '#fafafa', '--bg-card': '#ffffff', '--bg-inner': '#eeeeee',
  '--bg-inner2': '#e6e6e6', '--border': 'rgba(15,23,42,0.09)', '--border-hover': 'rgba(15,23,42,0.17)',
  '--text-primary': '#0b1220', '--text-secondary': '#1a2235',
  '--text-muted': 'rgba(17,24,39,0.58)', '--text-faint': 'rgba(17,24,39,0.40)',
  '--accent-green': '#1a7f37', '--accent-amber': '#9a6700',
  '--accent-red': '#cf222e', '--accent-indigo': '#6639ba',
  '--shadow': '0 0 0 1px rgba(15,23,42,0.06), 0 1px 4px rgba(15,23,42,0.06)',
  '--shadow-hover': '0 0 0 1px rgba(15,23,42,0.08), 0 6px 20px rgba(15,23,42,0.10)',
  '--chart-green': '#1a7f37', '--chart-indigo': '#6639ba',
};

function getStrapiTheme(): 'light' | 'dark' {
  const attr = document.documentElement.getAttribute('data-theme');
  if (attr === 'light') return 'light';
  if (attr === 'dark') return 'dark';
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}
function applyTokens(t: 'light' | 'dark') {
  const tokens = t === 'dark' ? DARK : LIGHT;
  Object.entries(tokens).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
}

// ─── CSS ─────────────────────────────────────────────────────────────────────
const CSS = `
  @keyframes comm-spin { to { transform: rotate(360deg); } }
  @keyframes comm-fadein { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
  @keyframes chart-draw {
    from { stroke-dashoffset: var(--dash-total); }
    to   { stroke-dashoffset: 0; }
  }
  @keyframes bar-grow { from { transform: scaleY(0); } to { transform: scaleY(1); } }
  .comm-widget { animation: comm-fadein 0.3s ease forwards; }
  .comm-bar { transform-origin: bottom; animation: bar-grow 0.6s cubic-bezier(0.25,0.46,0.45,0.94) forwards; }
  .chart-line {
    stroke-dasharray: var(--dash-total);
    stroke-dashoffset: var(--dash-total);
    animation: chart-draw 1s cubic-bezier(0.25,0.46,0.45,0.94) forwards;
  }
`;

// ─── Sparkline ────────────────────────────────────────────────────────────────
const Sparkline = ({ data, color, height = 40 }: { data: number[]; color: string; height?: number }) => {
  const animKey = useRef(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    animKey.current++;
    setMounted(false);
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, [data]);

  if (data.length < 2) return null;
  const W = 300, H = height;
  const max = Math.max(...data, 1);
  const px = (i: number) => (i / (data.length - 1)) * W;
  const py = (v: number) => H - (v / max) * (H - 4) - 2;
  const path = data.map((v, i) => `${i === 0 ? 'M' : 'L'}${px(i).toFixed(1)},${py(v).toFixed(1)}`).join(' ');
  const area = `${path} L${W},${H} L0,${H} Z`;
  const len = Math.round(data.reduce((acc, v, i) => {
    if (i === 0) return 0;
    const dx = px(i) - px(i - 1), dy = py(v) - py(data[i - 1]);
    return acc + Math.sqrt(dx * dx + dy * dy);
  }, 0));

  const isDark = getStrapiTheme() === 'dark';
  const greenRaw = isDark ? '#3dffa0' : '#1a7f37';

  return (
    <svg key={animKey.current} width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id="comm-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={greenRaw} stopOpacity={isDark ? 0.18 : 0.12} />
          <stop offset="100%" stopColor={greenRaw} stopOpacity={0} />
        </linearGradient>
      </defs>
      {mounted && (
        <>
          <path d={area} fill="url(#comm-grad)" />
          <path d={path} fill="none" stroke={color} strokeWidth="2"
            strokeLinejoin="round" strokeLinecap="round"
            className="chart-line"
            style={{ '--dash-total': len } as React.CSSProperties} />
        </>
      )}
    </svg>
  );
};

// ─── Quota Bar Chart ──────────────────────────────────────────────────────────
const QuotaBar = ({ sent, limit = 3000 }: { sent: number; limit?: number }) => {
  const pct = Math.min((sent / limit) * 100, 100);
  const color = pct >= 90 ? 'var(--accent-red)' : pct >= 70 ? 'var(--accent-amber)' : 'var(--accent-green)';
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
        <span style={{ fontSize: '10px', color: 'var(--text-faint)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Havi kvóta
        </span>
        <span style={{ fontSize: '11px', fontFamily: "'Geist Mono', monospace", color, fontWeight: 600 }}>
          {sent} / {limit}
        </span>
      </div>
      <div style={{ height: '6px', background: 'var(--bg-inner2)', borderRadius: '999px', overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${pct}%`, background: color,
          borderRadius: '999px', transition: 'width 0.7s cubic-bezier(0.25,0.46,0.45,0.94)',
        }} />
      </div>
      <div style={{ fontSize: '10px', color: 'var(--text-faint)', marginTop: '4px', textAlign: 'right', fontFamily: "'Geist Mono', monospace" }}>
        {Math.round(limit - sent)} maradt
      </div>
    </div>
  );
};

// ─── Monthly bar chart ────────────────────────────────────────────────────────
const MonthlyBars = ({ data }: { data: MonthPoint[] }) => {
  const max = Math.max(...data.map(d => d.sent), 1);
  return (
    <div>
      <div style={{ fontSize: '10px', color: 'var(--text-faint)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
        Küldések / hó
      </div>
      <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', height: '48px' }}>
        {data.map((d, i) => {
          const h = Math.max((d.sent / max) * 44, 2);
          const isLast = i === data.length - 1;
          return (
            <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
              <div style={{
                width: '100%', height: `${h}px`,
                background: isLast ? 'var(--chart-green)' : 'var(--bg-inner2)',
                borderRadius: '3px 3px 0 0',
                transition: 'height 0.6s cubic-bezier(0.25,0.46,0.45,0.94)',
              }} className="comm-bar" />
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
        {data.map((d) => (
          <div key={d.month} style={{ flex: 1, textAlign: 'center', fontSize: '9px', color: 'var(--text-faint)', fontFamily: "'Geist Mono', monospace" }}>
            {d.month.slice(5)}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Stat pill ────────────────────────────────────────────────────────────────
const Stat = ({ label, value, color, alert }: { label: string; value: number | string; color: string; alert?: boolean }) => (
  <div style={{
    background: 'var(--bg-inner)', border: '0.5px solid var(--border)',
    borderRadius: '10px', padding: '10px 12px', flex: 1, minWidth: '80px',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
      <span style={{ fontSize: '18px', fontWeight: 600, color, fontVariantNumeric: 'tabular-nums', fontFamily: "'Geist Mono', monospace", letterSpacing: '-0.5px' }}>
        {value}
      </span>
      {alert && (
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-amber)', flexShrink: 0, boxShadow: '0 0 5px var(--accent-amber)' }} />
      )}
    </div>
    <div style={{ fontSize: '10px', color: 'var(--text-faint)', marginTop: '2px', fontWeight: 500 }}>{label}</div>
  </div>
);

// ─── Main Widget ──────────────────────────────────────────────────────────────
const CommunicationsWidget = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [monthly, setMonthly] = useState<MonthPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // theme
  useEffect(() => {
    const apply = () => applyTokens(getStrapiTheme());
    apply();
    const obs = new MutationObserver(apply);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const [s, m] = await Promise.all([
          fetch('/api/communications/stats').then(r => r.json()),
          fetch('/api/communications/monthly-stats').then(r => r.json()),
        ]);
        if (!alive) return;
        if (s.ok) setStats(s);
        if (Array.isArray(m.data)) setMonthly(m.data);
      } catch {
        if (alive) setError(true);
      } finally {
        if (alive) setLoading(false);
      }
    };
    load();
    return () => { alive = false; };
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '120px', color: 'var(--text-faint)', fontSize: '12px', gap: '8px' }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'comm-spin 1s linear infinite' }}>
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
      Betöltés...
    </div>
  );

  if (error || !stats) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80px', color: 'var(--accent-red)', fontSize: '12px' }}>
      Nem sikerült betölteni az adatokat
    </div>
  );

  const sparkData = monthly.map(m => m.sent);

  return (
    <>
      <style>{CSS}</style>
      <div className="comm-widget" style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '2px' }}>

        {/* Stat pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Stat label="Új érdeklődő" value={stats.newLeads} color="var(--accent-amber)" alert={stats.newLeads > 0} />
          <Stat label="Összes lead" value={stats.totalLeads} color="var(--text-primary)" />
          <Stat label="Feliratkozó" value={stats.activeSubs} color="var(--accent-green)" />
        </div>

        {/* Quota bar */}
        <QuotaBar sent={stats.monthSent} limit={3000} />

        {/* Monthly bar chart */}
        {monthly.length > 1 && <MonthlyBars data={monthly} />}

        {/* Sparkline trend */}
        {sparkData.length > 1 && (
          <div>
            <div style={{ fontSize: '10px', color: 'var(--text-faint)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
              Trend
            </div>
            <Sparkline data={sparkData} color="var(--chart-green)" height={36} />
          </div>
        )}

        {/* Footer link */}
        <a href="/admin/plugins/communications"
          style={{ fontSize: '11px', color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '-4px' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
          Megnyitás →
        </a>
      </div>
    </>
  );
};

export default CommunicationsWidget;
