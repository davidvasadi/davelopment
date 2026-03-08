// ./src/admin/widgets/communications.tsx
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
interface MonthPoint { month: string; sent: number; }

// ─── Theme ────────────────────────────────────────────────────────────────────
const DARK: Record<string, string> = {
  '--cw-bg':        '#0d1117',
  '--cw-bg-inner':  '#161b22',
  '--cw-bg-inner2': '#21262d',
  '--cw-border':    '#21262d',
  '--cw-border-h':  '#30363d',
  '--cw-text':      '#f0f6fc',
  '--cw-text-2':    '#c9d1d9',
  '--cw-muted':     '#8b949e',
  '--cw-faint':     '#484f58',
  '--cw-green':     '#3dffa0',
  '--cw-amber':     '#f0c742',
  '--cw-red':       '#f85149',
  '--cw-indigo':    '#7c6af7',
  '--cw-bar-idle':  '#1a1f26',
};
const LIGHT: Record<string, string> = {
  '--cw-bg':        '#ffffff',
  '--cw-bg-inner':  '#f5f5f5',
  '--cw-bg-inner2': '#ebebeb',
  '--cw-border':    'rgba(15,23,42,0.09)',
  '--cw-border-h':  'rgba(15,23,42,0.17)',
  '--cw-text':      '#0b1220',
  '--cw-text-2':    '#1a2235',
  '--cw-muted':     'rgba(17,24,39,0.55)',
  '--cw-faint':     'rgba(17,24,39,0.35)',
  '--cw-green':     '#059669',
  '--cw-amber':     '#d97706',
  '--cw-red':       '#dc2626',
  '--cw-indigo':    '#4f46e5',
  '--cw-bar-idle':  '#e5e7eb',
};

function getStrapiTheme(): 'light' | 'dark' {
  const a = document.documentElement.getAttribute('data-theme');
  if (a === 'light') return 'light';
  if (a === 'dark') return 'dark';
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}
function applyTokens(t: 'light' | 'dark') {
  Object.entries(t === 'dark' ? DARK : LIGHT).forEach(([k, v]) =>
    document.documentElement.style.setProperty(k, v)
  );
}

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
  @keyframes cw-spin { to { transform: rotate(360deg); } }
  @keyframes cw-in   { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:none; } }
  .cw-w * { box-sizing: border-box; }
  .cw-w { animation: cw-in 0.25s ease forwards; }

  .cw-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1px;
    background: var(--cw-border);
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid var(--cw-border);
  }
  .cw-cell {
    background: var(--cw-bg);
    padding: 13px 14px;
    transition: background 120ms;
  }
  .cw-cell:hover { background: var(--cw-bg-inner); }
  .cw-cell-val {
    font-size: 22px; font-weight: 700; letter-spacing: -0.04em;
    font-family: ui-monospace, monospace; line-height: 1;
    color: var(--cw-text);
  }
  .cw-cell-lbl {
    font-size: 11px; color: var(--cw-muted); margin-top: 3px;
  }
  .cw-cell-delta {
    font-size: 10px; margin-top: 5px;
    display: flex; align-items: center; gap: 3px;
    font-weight: 500;
  }

  .cw-sec {
    font-size: 9px; font-weight: 600; text-transform: uppercase;
    letter-spacing: 0.09em; color: var(--cw-faint);
    display: flex; align-items: center; gap: 5px;
  }
  .cw-sec::after { content:''; flex:1; height:1px; background:var(--cw-border); }

  .cw-quota-track {
    height: 3px; background: var(--cw-bg-inner2);
    border-radius: 999px; overflow: hidden;
  }
  .cw-quota-fill {
    height: 100%; border-radius: 999px;
    transition: width 0.8s cubic-bezier(.25,.46,.45,.94);
  }

  .cw-bar {
    flex: 1; border-radius: 3px 3px 0 0;
    cursor: pointer; transition: opacity 0.15s, filter 0.15s;
    position: relative;
  }
  .cw-bar:not(.cw-bar-active) { opacity: 0.25; }
  .cw-bar:hover { opacity: 1 !important; filter: brightness(1.15); }
  .cw-bar-tip {
    position: absolute; top: -22px; left: 50%; transform: translateX(-50%);
    font-size: 9px; color: var(--cw-text-2);
    background: var(--cw-bg-inner2); border: 1px solid var(--cw-border-h);
    padding: 2px 6px; border-radius: 5px; white-space: nowrap;
    font-family: ui-monospace, monospace;
    pointer-events: none; opacity: 0; transition: opacity 0.1s;
  }
  .cw-bar:hover .cw-bar-tip { opacity: 1; }

  .cw-footer {
    font-size: 10px; color: var(--cw-muted); text-decoration: none;
    display: inline-flex; align-items: center; gap: 3px;
    transition: color 120ms;
  }
  .cw-footer:hover { color: var(--cw-text); }

  .cw-badge {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 10px; padding: 2px 8px; border-radius: 20px;
    border: 1px solid var(--cw-border); color: var(--cw-muted);
    background: var(--cw-bg-inner);
  }
  .cw-badge-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: var(--cw-green);
    box-shadow: 0 0 5px var(--cw-green);
  }
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M`
  : n >= 1000    ? `${(n / 1000).toFixed(1)}k`
  : String(n);

const ChevronRight = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

// ─── Delta badge ──────────────────────────────────────────────────────────────
const Delta = ({ v, inv }: { v: number; inv?: boolean }) => {
  const pos = inv ? v < 0 : v > 0;
  if (v === 0) return <span style={{ fontSize: 10, color: 'var(--cw-faint)' }}>— változatlan</span>;
  return (
    <span style={{ color: pos ? 'var(--cw-green)' : 'var(--cw-red)' }}>
      {pos ? '↑' : '↓'} {Math.abs(v)}% előző hónaphoz
    </span>
  );
};

// ─── Metric cell ──────────────────────────────────────────────────────────────
const Cell = ({ label, value, color, delta, inv, alert }: {
  label: string; value: string | number; color?: string;
  delta?: number; inv?: boolean; alert?: boolean;
}) => (
  <div className="cw-cell">
    <div className="cw-cell-val" style={color ? { color } : undefined}>
      {value}
      {alert && (
        <span style={{
          display: 'inline-block', width: 6, height: 6, borderRadius: '50%',
          background: 'var(--cw-amber)', boxShadow: '0 0 5px var(--cw-amber)',
          marginLeft: 5, verticalAlign: 'middle', marginBottom: 2,
        }} />
      )}
    </div>
    <div className="cw-cell-lbl">{label}</div>
    {delta !== undefined && (
      <div className="cw-cell-delta"><Delta v={delta} inv={inv} /></div>
    )}
  </div>
);

// ─── Monthly bar chart ────────────────────────────────────────────────────────
const MonthlyBars = ({ data }: { data: MonthPoint[] }) => {
  const max = Math.max(...data.map(d => d.sent), 1);
  return (
    <div style={{ display: 'flex', gap: '3px', alignItems: 'flex-end', height: '48px' }}>
      {data.map((d, i) => {
        const h = Math.max((d.sent / max) * 44, 3);
        const isLast = i === data.length - 1;
        const mo = d.month.slice(5);
        return (
          <div key={d.month} className={`cw-bar${isLast ? ' cw-bar-active' : ''}`} style={{
            height: `${h}px`,
            background: isLast ? 'var(--cw-green)' : 'var(--cw-bar-idle)',
            ...(isLast ? { boxShadow: '0 0 8px rgba(61,255,160,0.25)' } : {}),
          }}>
            <div className="cw-bar-tip">{mo}: {fmt(d.sent)}</div>
          </div>
        );
      })}
    </div>
  );
};

// ─── Data loader ──────────────────────────────────────────────────────────────
async function loadData() {
  const [s, m] = await Promise.all([
    fetch('/api/communications/stats').then(r => r.json()),
    fetch('/api/communications/monthly-stats').then(r => r.json()),
  ]);
  if (!s.ok) throw new Error('stats_error');
  return {
    stats: s as Stats,
    monthly: Array.isArray(m.data) ? (m.data as MonthPoint[]) : [],
  };
}

// ─── Main Widget ──────────────────────────────────────────────────────────────
const CommunicationsWidget = () => {
  const [stats, setStats]     = useState<Stats | null>(null);
  const [monthly, setMonthly] = useState<MonthPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);

  // theme
  useEffect(() => {
    const apply = () => applyTokens(getStrapiTheme());
    apply();
    const obs = new MutationObserver(apply);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] });
    return () => obs.disconnect();
  }, []);

  // data
  useEffect(() => {
    let alive = true;
    loadData()
      .then(d => { if (!alive) return; setStats(d.stats); setMonthly(d.monthly); })
      .catch(() => { if (alive) setError(true); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100px', color: 'var(--cw-faint)', fontSize: '12px', gap: '8px' }}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'cw-spin 1s linear infinite' }}>
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
      Betöltés...
    </div>
  );

  if (error || !stats) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80px', color: 'var(--cw-red)', fontSize: '12px' }}>
      Nem sikerült betölteni az adatokat
    </div>
  );

  const LIMIT = 3000;
  const pct = Math.min((stats.monthSent / LIMIT) * 100, 100);
  const quotaColor = pct >= 90 ? 'var(--cw-red)' : pct >= 70 ? 'var(--cw-amber)' : 'var(--cw-green)';

  // delta számítás havi adatokból
  const prevMonth  = monthly.length >= 2 ? monthly[monthly.length - 2].sent : 0;
  const thisMonth  = monthly.length >= 1 ? monthly[monthly.length - 1].sent : stats.monthSent;
  const sentDelta  = prevMonth > 0 ? Math.round(((thisMonth - prevMonth) / prevMonth) * 100) : 0;
  const subsDelta  = stats.newSubs > 0 ? Math.round((stats.newSubs / Math.max(stats.activeSubs - stats.newSubs, 1)) * 100) : 0;
  const leadsDelta = 0; // nincs előző adat ehhez

  return (
    <>
      <style>{CSS}</style>
      <div className="cw-w" style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '2px' }}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="cw-sec" style={{ flex: 1 }}>Kommunikáció</div>
          <span className="cw-badge">
            <span className="cw-badge-dot" />
            Aktív
          </span>
        </div>

        {/* ── 2×2 Metric grid ── */}
        <div className="cw-grid">
          <Cell
            label="Új érdeklődő" value={stats.newLeads}
            color={stats.newLeads > 0 ? 'var(--cw-amber)' : undefined}
            delta={leadsDelta} alert={stats.newLeads > 0}
          />
          <Cell
            label="Összes lead" value={stats.totalLeads}
          />
          <Cell
            label="Feliratkozó" value={stats.activeSubs}
            color="var(--cw-green)" delta={subsDelta}
          />
          <Cell
            label="Küldött / hó" value={fmt(stats.monthSent)}
            color="var(--cw-indigo)" delta={sentDelta}
          />
        </div>

        {/* ── Kvóta ── */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
            <span style={{ fontSize: 10, color: 'var(--cw-faint)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Havi kvóta</span>
            <span style={{ fontSize: 11, fontFamily: 'ui-monospace, monospace', color: quotaColor, fontWeight: 600 }}>
              {fmt(stats.monthSent)} / {fmt(LIMIT)}
            </span>
          </div>
          <div className="cw-quota-track">
            <div className="cw-quota-fill" style={{ width: `${pct}%`, background: quotaColor }} />
          </div>
          <div style={{ fontSize: 10, color: 'var(--cw-faint)', marginTop: 3, textAlign: 'right', fontFamily: 'ui-monospace, monospace' }}>
            {fmt(LIMIT - stats.monthSent)} maradt
          </div>
        </div>

        {/* ── Havi bar chart ── */}
        {monthly.length > 1 && (
          <div>
            <div style={{ fontSize: 9, color: 'var(--cw-faint)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 7 }}>
              Küldések / hó
            </div>
            <MonthlyBars data={monthly} />
            {/* X tengelycímkék */}
            <div style={{ display: 'flex', gap: 3, marginTop: 4 }}>
              {monthly.map(d => (
                <div key={d.month} style={{ flex: 1, textAlign: 'center', fontSize: 8, color: 'var(--cw-faint)', fontFamily: 'ui-monospace, monospace' }}>
                  {d.month.slice(5)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Footer ── */}
        <a href="/admin/plugins/communications" className="cw-footer">
          Megnyitás <ChevronRight />
        </a>

      </div>
    </>
  );
};

export default CommunicationsWidget;
