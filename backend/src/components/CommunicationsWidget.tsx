'use client'
import { useEffect, useState } from 'react'

interface Stats {
  ok: boolean
  newLeads: number
  totalLeads: number
  activeSubs: number
  newSubs: number
  monthSent: number
  prevMonthSent: number
  prevMonthSubs?: number
  lastLeadName?: string
  lastLeadAgo?: string
  lastCampaignSubject?: string
  lastCampaignDate?: string
  lastCampaignSent?: number
}
interface MonthPoint { month: string; sent: number }

const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n)
const QUOTA = parseInt(typeof process !== 'undefined' ? (process.env.NEXT_PUBLIC_EMAIL_MONTHLY_QUOTA || '3000') : '3000', 10)
const DAILY = 100

function pct(curr: number, total: number) {
  return total ? Math.min(Math.round((curr / total) * 100), 100) : 0
}
function delta(curr: number, prev: number) {
  if (!prev) return null
  return Math.round(((curr - prev) / prev) * 100)
}

const CSS = `
  @keyframes cw-in { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }
  @keyframes cw-spin { to{transform:rotate(360deg)} }
  .cw-w { animation:cw-in 0.25s ease forwards; display:flex; flex-direction:column; gap:0.75rem; }
  .cw-section-label { font-size:0.7rem; font-weight:600; text-transform:uppercase; letter-spacing:.06em; color:var(--theme-elevation-500); margin-bottom:0.4rem; font-family:ui-monospace,monospace; }
  .cw-grid { display:grid; grid-template-columns:1fr 1fr; gap:1px; background:var(--theme-elevation-150); border-radius:0.75rem; overflow:hidden; border:1px solid var(--theme-elevation-150); }
  .cw-cell { background:var(--theme-elevation-50); padding:1rem 1.25rem; transition:background 120ms; cursor:default; }
  .cw-cell:hover { background:var(--theme-elevation-100); }
  .cw-cell-val { font-size:2rem; font-weight:700; letter-spacing:-0.04em; font-family:ui-monospace,monospace; line-height:1; }
  .cw-cell-label { font-size:0.7rem; font-weight:600; text-transform:uppercase; letter-spacing:.06em; color:var(--theme-elevation-500); margin-bottom:0.3rem; font-family:ui-monospace,monospace; }
  .cw-cell-sub { font-size:0.75rem; margin-top:0.25rem; font-family:ui-monospace,monospace; color:var(--theme-elevation-400); }
  .cw-delta-pos { font-size:0.75rem; color:#22c55e; }
  .cw-delta-neg { font-size:0.75rem; color:#ef4444; }
  .cw-delta-neu { font-size:0.75rem; color:var(--theme-elevation-400); }
  .cw-track { height:4px; background:var(--theme-elevation-150); border-radius:999px; overflow:hidden; }
  .cw-fill { height:100%; border-radius:999px; transition:width .8s cubic-bezier(.25,.46,.45,.94); }
  .cw-bar { flex:1; border-radius:3px 3px 0 0; cursor:pointer; transition:opacity .15s,filter .15s; position:relative; }
  .cw-bar:not(.active) { opacity:0.22; }
  .cw-bar:hover { opacity:1 !important; filter:brightness(1.15); }
  .cw-bar-tip { position:absolute; top:-24px; left:50%; transform:translateX(-50%); font-size:0.7rem; color:var(--theme-text); background:var(--theme-elevation-100); border:1px solid var(--theme-elevation-200); padding:2px 7px; border-radius:5px; white-space:nowrap; font-family:ui-monospace,monospace; pointer-events:none; opacity:0; transition:opacity .1s; z-index:10; }
  .cw-bar:hover .cw-bar-tip { opacity:1; }
  .cw-campaign-row { display:flex; align-items:center; gap:0.75rem; padding:0.75rem 1rem; background:var(--theme-elevation-100); border-radius:0.5rem; border:1px solid var(--theme-elevation-150); }
  .cw-link { font-size:13px; color:var(--theme-elevation-500); text-decoration:none; display:inline-flex; align-items:center; gap:4px; transition:color 120ms; font-weight:500; font-family:var(--font-body); }
  .cw-link:hover { color:var(--theme-text); }
`

function DeltaBadge({ v }: { v: number | null }) {
  if (v === null) return null
  if (v === 0) return <span className="cw-delta-neu">— változatlan</span>
  return <span className={v > 0 ? 'cw-delta-pos' : 'cw-delta-neg'}>{v > 0 ? '↑' : '↓'} {Math.abs(v)}%</span>
}

function MonthlyBars({ data }: { data: MonthPoint[] }) {
  const max = Math.max(...data.map(d => d.sent), 1)
  return (
    <div>
      <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 56 }}>
        {data.map((d, i) => {
          const h = Math.max((d.sent / max) * 52, 3)
          const isLast = i === data.length - 1
          return (
            <div key={d.month} className={`cw-bar${isLast ? ' active' : ''}`}
              style={{ height: `${h}px`, background: isLast ? '#22c55e' : 'var(--theme-elevation-200)', ...(isLast ? { boxShadow: '0 0 8px rgba(34,197,94,.3)' } : {}) }}>
              <div className="cw-bar-tip">{d.month.slice(5)}: {fmt(d.sent)}</div>
            </div>
          )
        })}
      </div>
      <div style={{ display: 'flex', gap: 4, marginTop: 5 }}>
        {data.map(d => (
          <div key={d.month} style={{ flex: 1, textAlign: 'center', fontSize: 10, color: 'var(--theme-elevation-400)', fontFamily: 'ui-monospace,monospace' }}>
            {d.month.slice(5)}
          </div>
        ))}
      </div>
    </div>
  )
}

export function CommunicationsWidget() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [monthly, setMonthly] = useState<MonthPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let alive = true
    Promise.all([
      fetch('/api/communications/stats').then(r => r.json()),
      fetch('/api/communications/monthly-stats').then(r => r.json()),
    ])
      .then(([s, m]) => {
        if (!alive) return
        if (s.ok) setStats(s)
        else setError(true)
        if (Array.isArray(m.data)) setMonthly(m.data)
      })
      .catch(() => { if (alive) setError(true) })
      .finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [])

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 120, gap: 8, color: 'var(--theme-elevation-400)', fontSize: '0.8rem' }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'cw-spin 1s linear infinite' }}>
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
      Betöltés...
    </div>
  )

  if (error || !stats) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 80, color: '#ef4444', fontSize: '0.8rem' }}>
      Nem sikerült betölteni
    </div>
  )

  const quotaColor = pct(stats.monthSent, QUOTA) >= 90 ? '#ef4444' : pct(stats.monthSent, QUOTA) >= 70 ? '#f0c742' : '#22c55e'
  const sentDelta = delta(stats.monthSent, stats.prevMonthSent)
  const subsDelta = delta(stats.activeSubs, stats.prevMonthSubs ?? 0)
  const convRate = stats.totalLeads > 0 ? Math.round((stats.activeSubs / stats.totalLeads) * 100) : null
  const convColor = convRate !== null ? (convRate >= 30 ? '#22c55e' : convRate >= 10 ? '#f0c742' : '#ef4444') : '#22c55e'

  return (
    <>
      <style>{CSS}</style>
      <div className="cw-w">

        {/* ── 4 stat cella ── */}
        <div className="cw-grid">
          {/* Érdeklődők */}
          <div className="cw-cell">
            <div className="cw-cell-label">Új érdeklődő (7n)</div>
            <div className="cw-cell-val" style={{ color: stats.newLeads > 0 ? '#f0c742' : 'var(--theme-text)' }}>
              {stats.newLeads}
              {stats.newLeads > 0 && <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: '#f0c742', boxShadow: '0 0 5px #f0c742', marginLeft: 6, verticalAlign: 'middle', marginBottom: 3 }} />}
            </div>
            <div className="cw-cell-sub">összes: {stats.totalLeads}</div>
            {stats.lastLeadName && (
              <div className="cw-cell-sub" style={{ color: '#f0c742' }}>↳ {stats.lastLeadName}{stats.lastLeadAgo ? `, ${stats.lastLeadAgo}` : ''}</div>
            )}
          </div>

          {/* Feliratkozók */}
          <div className="cw-cell">
            <div className="cw-cell-label">Aktív feliratkozó</div>
            <div className="cw-cell-val" style={{ color: '#22c55e' }}>{fmt(stats.activeSubs)}</div>
            <div className="cw-cell-sub"><DeltaBadge v={subsDelta} /></div>
            {stats.newSubs > 0 && (
              <div className="cw-cell-sub" style={{ color: '#22c55e' }}>+{stats.newSubs} új (7n)</div>
            )}
          </div>

          {/* Email / hó */}
          <div className="cw-cell">
            <div className="cw-cell-label">Email / hó</div>
            <div className="cw-cell-val" style={{ color: '#7c6af7' }}>{fmt(stats.monthSent)}</div>
            <div className="cw-cell-sub"><DeltaBadge v={sentDelta} /></div>
          </div>

          {/* Konverzió */}
          <div className="cw-cell">
            <div className="cw-cell-label">Konverzió</div>
            <div className="cw-cell-val" style={{ color: convColor }}>{convRate !== null ? `${convRate}%` : '—'}</div>
            <div className="cw-cell-sub">lead → feliratkozó</div>
          </div>
        </div>

        {/* ── Kvóta ── */}
        <div>
          <div className="cw-section-label">Email kvóta</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--theme-elevation-500)' }}>Havi</span>
            <span style={{ fontSize: '0.8rem', fontFamily: 'ui-monospace,monospace', color: quotaColor, fontWeight: 700 }}>
              {fmt(stats.monthSent)} <span style={{ fontWeight: 400, color: 'var(--theme-elevation-400)' }}>/ {fmt(QUOTA)}</span>
            </span>
          </div>
          <div className="cw-track">
            <div className="cw-fill" style={{ width: `${pct(stats.monthSent, QUOTA)}%`, background: quotaColor }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.3rem' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--theme-elevation-400)', fontFamily: 'ui-monospace,monospace' }}>{pct(stats.monthSent, QUOTA)}% felhasználva</span>
            <span style={{ fontSize: '0.7rem', fontFamily: 'ui-monospace,monospace', color: (QUOTA - stats.monthSent) < 300 ? '#ef4444' : 'var(--theme-elevation-400)' }}>{fmt(QUOTA - stats.monthSent)} maradt</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.6rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--theme-elevation-500)' }}>Napi limit</span>
            <span style={{ fontSize: '0.8rem', fontFamily: 'ui-monospace,monospace', color: 'var(--theme-elevation-500)', fontWeight: 700 }}>{DAILY} email / nap</span>
          </div>
        </div>

        {/* ── Havi bar chart ── */}
        {monthly.length > 1 && (
          <div>
            <div className="cw-section-label">Küldések / hó</div>
            <MonthlyBars data={monthly} />
          </div>
        )}

        {/* ── Utolsó kampány ── */}
        {stats.lastCampaignSubject && (
          <div>
            <div className="cw-section-label">Legutóbbi kampány</div>
            <div className="cw-campaign-row">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7c6af7" strokeWidth="1.8" style={{ flexShrink: 0 }}>
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--theme-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {stats.lastCampaignSubject}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--theme-elevation-400)', marginTop: 2, fontFamily: 'ui-monospace,monospace' }}>
                  {stats.lastCampaignSent != null ? `${stats.lastCampaignSent} cím` : ''}
                  {stats.lastCampaignDate ? ` · ${stats.lastCampaignDate}` : ''}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Link ── */}
        <a href="/admin/communications" className="cw-link">
          Megnyitás
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </a>

      </div>
    </>
  )
}
