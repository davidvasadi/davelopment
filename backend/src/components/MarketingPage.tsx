'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { useStepNav } from '@payloadcms/ui'

// ─── Types ────────────────────────────────────────────────────────────────────
interface PageAudit { id: string; type: string; label: string; slug: string; issues: string[]; score: number; editUrl: string }
interface GscPageData { clicks: number; impressions: number; ctr: number; position: number }
interface TrendPoint { date: string; clicks: number; impressions: number; position: number }
interface TopPage { url: string; slug: string; clicks: number; impressions: number; position: number }
interface QueryRow { query: string; clicks: number; impressions: number; position: number }
interface Stats { ok: boolean; totalClicks: number; totalImpressions: number; avgCtr: number; avgPosition: number; clicksDelta: number; impsDelta: number; trend: TrendPoint[]; topPages: TopPage[] }
interface SeoResult { ok: boolean; url: string; title: string | null; description: string | null; canonical: string | null; hreflang: { lang: string; href: string }[]; ogTitle: string | null; ogImage: string | null; structuredData: any[]; robots: string | null; h1: string[]; issues: string[]; score: number }
interface PageSpeedData { slug: string; score: number; lcp: string; lcpMs: number; cls: string; clsVal: number; inp: string; inpMs: number; fcp: string; strategy: 'mobile' | 'desktop'; fetchedAt: number }

const SITE = 'https://davelopment.hu'
const SEO_PAGES = ['/hu', '/en', '/hu/blog', '/hu/projektek', '/hu/szolgaltatasok', '/hu/arak', '/hu/kapcsolat']
const PSI_CACHE_KEY = 'mp_psi_v1'
const PSI_TTL = 60 * 60 * 1000

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmt = (n: number) => n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n)
const scoreColor = (s: number) => s >= 80 ? '#22c55e' : s >= 50 ? '#f0c742' : '#ef4444'
const posColor = (p: number) => p <= 3 ? '#22c55e' : p <= 10 ? '#f0c742' : 'var(--theme-elevation-500)'
const cwvColor = {
  lcp: (ms: number) => ms <= 2500 ? '#22c55e' : ms <= 4000 ? '#f0c742' : '#ef4444',
  cls: (v: number) => v <= 0.1 ? '#22c55e' : v <= 0.25 ? '#f0c742' : '#ef4444',
  inp: (ms: number) => ms <= 200 ? '#22c55e' : ms <= 500 ? '#f0c742' : '#ef4444',
}

function loadPsiCache(): Record<string, PageSpeedData> {
  try { return JSON.parse(localStorage.getItem(PSI_CACHE_KEY) || '{}') } catch { return {} }
}
function savePsiCache(c: Record<string, PageSpeedData>) {
  try { localStorage.setItem(PSI_CACHE_KEY, JSON.stringify(c)) } catch {}
}

async function fetchPsi(slug: string): Promise<PageSpeedData | null> {
  const url = `${SITE}${slug || '/'}`
  const endpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=mobile`
  try {
    const res = await fetch(endpoint)
    if (!res.ok) return null
    const d = await res.json()
    const aud = d?.lighthouseResult?.audits
    const cats = d?.lighthouseResult?.categories
    if (!aud || !cats) return null
    const score = Math.round((cats.performance?.score ?? 0) * 100)
    const lcpMs = Math.round(aud['largest-contentful-paint']?.numericValue ?? 0)
    const clsVal = parseFloat((aud['cumulative-layout-shift']?.numericValue ?? 0).toFixed(3))
    const inpMs = Math.round(aud['interaction-to-next-paint']?.numericValue ?? aud['total-blocking-time']?.numericValue ?? 0)
    const fcpMs = Math.round(aud['first-contentful-paint']?.numericValue ?? 0)
    const ms2str = (ms: number) => ms >= 1000 ? `${(ms / 1000).toFixed(1)} s` : `${ms} ms`
    return { slug, score, lcp: ms2str(lcpMs), lcpMs, cls: clsVal.toFixed(2), clsVal, inp: ms2str(inpMs), inpMs, fcp: ms2str(fcpMs), strategy: 'mobile', fetchedAt: Date.now() }
  } catch { return null }
}

// ─── CSS ─────────────────────────────────────────────────────────────────────
const CSS = `
  @keyframes mp-in  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
  @keyframes mp-spin{ to{transform:rotate(360deg)} }
  @keyframes mp-bar { from{width:0} to{width:var(--w)} }
  @keyframes mp-sk  { to{stroke-dashoffset:0} }
  @keyframes mp-stagger { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }

  .mp-w { animation:mp-in .3s ease forwards }
  .mp-card { background:var(--theme-elevation-50); border:1px solid var(--theme-elevation-150); border-radius:12px; overflow:hidden }
  .mp-card-pad { padding:14px 16px }

  .mp-tab-bar { display:flex; gap:2px; background:var(--theme-elevation-100); padding:3px; border-radius:12px; width:fit-content; margin-bottom:1.5rem }
  .mp-tab { padding:6px 16px; border-radius:9px; border:none; cursor:pointer; font-size:13px; font-weight:500; background:transparent; color:var(--theme-elevation-500); transition:all .15s; font-family:var(--font-body) }
  .mp-tab.active { background:var(--theme-elevation-0); color:var(--theme-text); font-weight:600; box-shadow:0 1px 4px rgba(0,0,0,.12) }

  .mp-stat { background:var(--theme-elevation-50); border:1px solid var(--theme-elevation-150); border-radius:10px; padding:12px 14px; cursor:default; transition:transform .14s,box-shadow .14s }
  .mp-stat:hover { transform:translateY(-1px); box-shadow:0 4px 16px rgba(0,0,0,.1) }

  .mp-table { width:100%; border-collapse:collapse; font-size:13px }
  .mp-table th { font-size:9px; font-weight:600; text-transform:uppercase; letter-spacing:.08em; color:var(--theme-elevation-400); padding:8px 12px; text-align:left; border-bottom:1px solid var(--theme-elevation-150); font-family:ui-monospace,monospace }
  .mp-table td { padding:9px 12px; border-bottom:1px solid var(--theme-elevation-100); color:var(--theme-text) }
  .mp-table tr:last-child td { border-bottom:none }
  .mp-table tr:hover td { background:var(--theme-elevation-100) }

  /* Audit list */
  .mp-audit-row { display:flex; align-items:center; gap:14px; flex-wrap:wrap; padding:14px 18px; background:var(--theme-elevation-50); border:1px solid var(--theme-elevation-150); border-radius:12px; transition:border-color .15s,box-shadow .15s; cursor:default }
  .mp-audit-row:hover { border-color:var(--theme-elevation-300); box-shadow:0 4px 16px rgba(0,0,0,.1) }

  /* Audit grid */
  .mp-audit-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:12px }
  .mp-audit-card { background:var(--theme-elevation-50); border:1px solid var(--theme-elevation-150); border-radius:14px; padding:18px; display:flex; flex-direction:column; gap:14px; transition:border-color .15s,box-shadow .15s,transform .15s; cursor:default }
  .mp-audit-card:hover { border-color:var(--theme-elevation-300); box-shadow:0 4px 20px rgba(0,0,0,.12); transform:translateY(-2px) }

  /* Score bar */
  .mp-score-track { flex:1; height:3px; background:var(--theme-elevation-150); border-radius:999px; overflow:hidden }
  .mp-score-fill { height:100%; border-radius:999px; transition:width .65s cubic-bezier(.25,.46,.45,.94) }

  /* Metric bar */
  .mp-metric-track { flex:1; height:4px; background:var(--theme-elevation-150); border-radius:999px; overflow:hidden }
  .mp-metric-fill { height:100%; border-radius:999px; width:0; animation:mp-bar .7s cubic-bezier(.25,.46,.45,.94) forwards }

  /* Filter chips */
  .mp-chip { padding:5px 12px; border-radius:8px; font-size:12px; font-weight:500; cursor:pointer; border:1px solid var(--theme-elevation-150); background:var(--theme-elevation-50); color:var(--theme-elevation-500); transition:all .12s; font-family:var(--font-body) }
  .mp-chip:hover { border-color:var(--theme-elevation-300); color:var(--theme-text) }
  .mp-chip.active { background:var(--theme-text); border-color:var(--theme-text); color:var(--theme-bg) }

  /* Layout toggle */
  .mp-layout-btn { width:32px; height:32px; border-radius:8px; cursor:pointer; border:1px solid var(--theme-elevation-150); background:transparent; color:var(--theme-elevation-500); display:flex; align-items:center; justify-content:center; transition:all .14s }
  .mp-layout-btn:hover { border-color:var(--theme-elevation-300); background:var(--theme-elevation-100); color:var(--theme-text) }
  .mp-layout-btn.active { border-color:var(--theme-elevation-300); background:var(--theme-elevation-150); color:var(--theme-text) }

  /* Query drawer */
  .mp-drawer-overlay { position:fixed; inset:0; background:rgba(0,0,0,.45); z-index:9998; display:flex; justify-content:flex-end }
  .mp-drawer { width:360px; max-width:100vw; background:var(--theme-elevation-0); border-left:1px solid var(--theme-elevation-200); height:100vh; overflow-y:auto; display:flex; flex-direction:column; animation:mp-in .2s ease }
  .mp-drawer-header { padding:18px 20px; border-bottom:1px solid var(--theme-elevation-150); display:flex; align-items:center; justify-content:space-between; flex-shrink:0 }

  /* CWV badge */
  .mp-cwv-badge { display:flex; flex-direction:column; align-items:center; gap:2px; min-width:52px }
  .mp-cwv-val { font-size:11px; font-weight:600; padding:2px 7px; border-radius:6px; font-family:ui-monospace,monospace; white-space:nowrap }

  /* Stagger animation for audit items */
  .mp-stagger-item { opacity:0; animation:mp-stagger .25s ease forwards }

  /* Info tip */
  .mp-info-tip { position:relative; display:inline-flex; align-items:center; cursor:help; margin-left:3px }
  .mp-info-tip .tip-box { display:none; position:absolute; bottom:calc(100% + 6px); left:50%; transform:translateX(-50%); background:var(--theme-elevation-100); color:var(--theme-text); font-size:11px; line-height:1.5; padding:7px 10px; border-radius:8px; border:1px solid var(--theme-elevation-200); box-shadow:0 4px 16px rgba(0,0,0,.15); z-index:200; pointer-events:none; width:200px; text-align:center; white-space:normal }
  .mp-info-tip:hover .tip-box { display:block }

  @media (max-width:768px) {
    .mp-audit-grid { grid-template-columns:1fr }
    .mp-audit-row { flex-direction:column; align-items:flex-start }
    .mp-table th:nth-child(3),.mp-table td:nth-child(3),.mp-table th:nth-child(4),.mp-table td:nth-child(4) { display:none }
    .mp-drawer { width:100vw }
  }
`

// ─── Small components ─────────────────────────────────────────────────────────
function Spinner() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation:'mp-spin 1s linear infinite', flexShrink:0 }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
}

function ScoreRing({ score, size = 44 }: { score: number; size?: number }) {
  const r = (size - 5) / 2, circ = 2 * Math.PI * r, dash = (score / 100) * circ, c = scoreColor(score)
  return (
    <svg width={size} height={size} style={{ flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--theme-elevation-150)" strokeWidth="3.5"/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={c} strokeWidth="3.5" strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} style={{ transition:'stroke-dasharray .5s ease' }}/>
      <text x={size/2} y={size/2+4} textAnchor="middle" fontSize="10" fontWeight="600" fill={c}>{score}</text>
    </svg>
  )
}

function ScoreBar({ score }: { score: number }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
      <div className="mp-score-track">
        <div className="mp-score-fill" style={{ width:`${score}%`, background:scoreColor(score) }}/>
      </div>
      <span style={{ fontSize:11, fontWeight:500, color:scoreColor(score), minWidth:30, textAlign:'right', fontVariantNumeric:'tabular-nums' }}>{score}%</span>
    </div>
  )
}

function IssuePills({ issues }: { issues: string[] }) {
  if (issues.length === 0)
    return <span style={{ fontSize:11, color:'#22c55e', display:'flex', alignItems:'center', gap:4 }}><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>Rendben</span>
  return (
    <div style={{ display:'flex', flexWrap:'wrap', gap:3 }}>
      {issues.map((issue, i) => (
        <span key={i} style={{ fontSize:10, color:'#ef4444', background:'rgba(239,68,68,.08)', border:'1px solid rgba(239,68,68,.16)', padding:'2px 6px', borderRadius:4 }}>{issue}</span>
      ))}
    </div>
  )
}

function CwvBadge({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="mp-cwv-badge">
      <span className="mp-cwv-val" style={{ color, background:`${color}18`, border:`1px solid ${color}30` }}>{value}</span>
      <span style={{ fontSize:'9.5px', color:'var(--theme-elevation-400)', textTransform:'uppercase', letterSpacing:'.04em', fontWeight:500 }}>{label}</span>
    </div>
  )
}

function CwvRow({ psi, loading }: { psi: PageSpeedData | null; loading: boolean }) {
  if (loading) return (
    <div style={{ display:'flex', gap:8 }}>
      {['LCP','CLS','INP'].map(l => (
        <div key={l} className="mp-cwv-badge">
          <div style={{ width:44, height:20, borderRadius:6, background:'var(--theme-elevation-150)', animation:'mp-spin 1.4s linear infinite', opacity:.5 }}/>
          <span style={{ fontSize:'9.5px', color:'var(--theme-elevation-300)', textTransform:'uppercase' }}>{l}</span>
        </div>
      ))}
    </div>
  )
  if (!psi) return <span style={{ fontSize:11, color:'var(--theme-elevation-300)' }}>— nincs PSI adat</span>
  return (
    <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
      <CwvBadge label="LCP" value={psi.lcp} color={cwvColor.lcp(psi.lcpMs)}/>
      <CwvBadge label="CLS" value={psi.cls} color={cwvColor.cls(psi.clsVal)}/>
      <CwvBadge label="INP" value={psi.inp} color={cwvColor.inp(psi.inpMs)}/>
    </div>
  )
}

function ChangeBadge({ value, invert = false }: { value: number | null; invert?: boolean }) {
  if (value === null) return null
  const pos = invert ? value < 0 : value > 0
  const c = value === 0 ? 'var(--theme-elevation-400)' : pos ? '#22c55e' : '#ef4444'
  return <span style={{ fontSize:11, fontWeight:500, color:c, padding:'2px 7px', borderRadius:20, background:value === 0 ? 'transparent' : pos ? 'rgba(34,197,94,.08)' : 'rgba(239,68,68,.08)' }}>{value > 0 ? '+' : ''}{value}%</span>
}

function InfoTip({ text }: { text: string }) {
  return (
    <span className="mp-info-tip">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--theme-elevation-400)" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
      <span className="tip-box">{text}</span>
    </span>
  )
}

// ─── Dual Chart ───────────────────────────────────────────────────────────────
function DualChart({ trend }: { trend: TrendPoint[] }) {
  const [metric, setMetric] = useState<'clicks' | 'impressions' | 'dual'>('dual')
  const [tt, setTt] = useState<number | null>(null)
  const key = useRef(0)

  useEffect(() => { key.current++ }, [trend, metric])

  if (!trend.length) return <div style={{ height:120, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, color:'var(--theme-elevation-400)' }}>Nincs adat</div>

  const W = 700, H = 140
  const PAD = { top:16, right:16, bottom:28, left:44 }
  const iW = W - PAD.left - PAD.right, iH = H - PAD.top - PAD.bottom

  const cVals = trend.map(t => t.clicks), iVals = trend.map(t => t.impressions)
  const n = trend.length
  const px = (i: number) => PAD.left + (i / Math.max(n - 1, 1)) * iW
  const scale = (vals: number[]) => { const mx = Math.max(...vals, 1); return { mx, py: (v: number) => PAD.top + iH - (v / mx) * iH } }
  const cS = scale(cVals), iS = scale(iVals)
  const path = (vals: number[], s: ReturnType<typeof scale>) => vals.map((v, i) => `${i === 0 ? 'M' : 'L'}${px(i).toFixed(1)},${s.py(v).toFixed(1)}`).join(' ')
  const area = (vals: number[], s: ReturnType<typeof scale>) => `${path(vals, s)} L${px(n - 1).toFixed(1)},${PAD.top + iH} L${PAD.left},${PAD.top + iH} Z`

  const showC = metric === 'clicks' || metric === 'dual'
  const showI = metric === 'impressions' || metric === 'dual'

  const yS = showC ? cS : iS
  const yTicks = [0, .5, 1].map(t => { const v = yS.mx * t; return { y: yS.py(v), label: v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(Math.round(v)) } })
  const xLabels = [0, Math.floor((n - 1) / 2), n - 1].map((i, li) => ({ i, d: trend[i] ? new Date(trend[i].date).toLocaleDateString('hu-HU', { month:'short', day:'numeric' }) : '', a: li === 0 ? 'start' : li === 2 ? 'end' : 'middle' }))

  const TABS = [{ k: 'dual' as const, l: 'Mindkettő' }, { k: 'clicks' as const, l: 'Kattintás' }, { k: 'impressions' as const, l: 'Megjelenés' }]

  return (
    <div className="mp-card">
      <div style={{ padding:'12px 14px 0', display:'flex', gap:6 }}>
        {TABS.map(t => (
          <button key={t.k} onClick={() => setMetric(t.k)} style={{ padding:'4px 12px', borderRadius:999, fontSize:12, fontFamily:'ui-monospace,monospace', fontWeight:600, cursor:'pointer', border:'1px solid', borderColor:metric === t.k ? (t.k === 'clicks' ? '#3dffa0' : t.k === 'impressions' ? '#7c6af7' : 'var(--theme-elevation-300)') : 'var(--theme-elevation-200)', background:metric === t.k ? (t.k === 'clicks' ? 'rgba(61,255,160,.12)' : t.k === 'impressions' ? 'rgba(124,106,247,.12)' : 'var(--theme-elevation-100)') : 'transparent', color:metric === t.k ? (t.k === 'clicks' ? '#3dffa0' : t.k === 'impressions' ? '#7c6af7' : 'var(--theme-text)') : 'var(--theme-elevation-500)' }}>
            {t.l}
          </button>
        ))}
      </div>
      <div style={{ padding:'8px 12px 12px', position:'relative' }}>
        <svg key={`${metric}-${key.current}`} width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display:'block', overflow:'hidden', cursor:'crosshair' }}
          onMouseMove={e => { const r = e.currentTarget.getBoundingClientRect(); const mx = (e.clientX - r.left) * (W / r.width); let ni = 0, nd = Infinity; for (let i = 0; i < n; i++) { const dd = Math.abs(px(i) - mx); if (dd < nd) { nd = dd; ni = i } }; setTt(ni) }}
          onMouseLeave={() => setTt(null)}>
          <defs>
            <linearGradient id="mpgc" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3dffa0" stopOpacity=".15"/><stop offset="85%" stopColor="#3dffa0" stopOpacity="0"/></linearGradient>
            <linearGradient id="mpgi" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7c6af7" stopOpacity=".15"/><stop offset="85%" stopColor="#7c6af7" stopOpacity="0"/></linearGradient>
            <clipPath id="mpclip"><rect x={PAD.left} y={PAD.top - 2} width={iW} height={iH + 4}/></clipPath>
          </defs>
          {yTicks.map((tk, i) => (
            <g key={i}>
              <line x1={PAD.left} y1={tk.y} x2={PAD.left + iW} y2={tk.y} stroke="var(--theme-elevation-150)" strokeWidth=".5" strokeDasharray={i === 0 ? undefined : '3 5'} opacity={i === 0 ? .8 : .4}/>
              <text x={PAD.left - 4} y={tk.y + 3.5} textAnchor="end" fontSize="6.5" fill="var(--theme-elevation-400)" style={{ fontFamily:'ui-monospace,monospace' }}>{tk.label}</text>
            </g>
          ))}
          {showI && <path d={area(iVals, iS)} fill="url(#mpgi)" clipPath="url(#mpclip)"/>}
          {showC && <path d={area(cVals, cS)} fill="url(#mpgc)" clipPath="url(#mpclip)"/>}
          {showI && <path d={path(iVals, iS)} fill="none" stroke="#7c6af7" strokeWidth="1.25" strokeLinejoin="round" clipPath="url(#mpclip)" strokeDasharray="10000" strokeDashoffset="10000" style={{ animation:'mp-sk .9s ease forwards' }}/>}
          {showC && <path d={path(cVals, cS)} fill="none" stroke="#3dffa0" strokeWidth="1.5" strokeLinejoin="round" clipPath="url(#mpclip)" strokeDasharray="10000" strokeDashoffset="10000" style={{ animation:'mp-sk .9s ease forwards' }}/>}
          {tt !== null && (
            <>
              <line x1={px(tt)} y1={PAD.top} x2={px(tt)} y2={PAD.top + iH} stroke="var(--theme-elevation-300)" strokeWidth=".75" strokeDasharray="2 3"/>
              {showC && <circle cx={px(tt)} cy={cS.py(cVals[tt])} r="4" fill="#3dffa0" stroke="var(--theme-elevation-50)" strokeWidth="2"/>}
              {showI && <circle cx={px(tt)} cy={iS.py(iVals[tt])} r="4" fill="#7c6af7" stroke="var(--theme-elevation-50)" strokeWidth="2"/>}
            </>
          )}
          {xLabels.map(({ i, d, a }) => <text key={i} x={px(i)} y={H - 4} textAnchor={a as any} fontSize="7" fill="var(--theme-elevation-400)" style={{ fontFamily:'ui-monospace,monospace' }}>{d}</text>)}
        </svg>
        {tt !== null && trend[tt] && (
          <div style={{ position:'absolute', top:8, left:`${Math.min(Math.max((tt / (n - 1)) * 100, 8), 68)}%`, transform:'translateX(-50%)', background:'var(--theme-elevation-100)', border:'1px solid var(--theme-elevation-200)', borderRadius:6, padding:'4px 8px', fontSize:11, fontFamily:'ui-monospace,monospace', pointerEvents:'none', whiteSpace:'nowrap', zIndex:10 }}>
            <div style={{ color:'var(--theme-elevation-500)', marginBottom:2 }}>{new Date(trend[tt].date).toLocaleDateString('hu-HU', { month:'short', day:'numeric' })}</div>
            {showC && <div style={{ color:'#3dffa0', fontWeight:700 }}>{fmt(trend[tt].clicks)} klikk</div>}
            {showI && <div style={{ color:'#7c6af7' }}>{fmt(trend[tt].impressions)} megj.</div>}
          </div>
        )}
      </div>
      {metric === 'dual' && (
        <div style={{ display:'flex', gap:16, padding:'0 14px 12px', fontSize:11, fontFamily:'ui-monospace,monospace' }}>
          <span style={{ display:'flex', alignItems:'center', gap:5 }}><span style={{ width:10, height:2, background:'#3dffa0', borderRadius:99, display:'inline-block' }}/><span style={{ color:'var(--theme-elevation-500)' }}>Kattintás</span></span>
          <span style={{ display:'flex', alignItems:'center', gap:5 }}><span style={{ width:10, height:2, background:'#7c6af7', borderRadius:99, display:'inline-block' }}/><span style={{ color:'var(--theme-elevation-500)' }}>Megjelenés</span></span>
        </div>
      )}
    </div>
  )
}

// ─── Audit Row (list layout) ──────────────────────────────────────────────────
function AuditRow({ item, gsc, psi, psiLoading, psiEnabled, gscConnected, onQueryClick, delay }: {
  item: PageAudit; gsc: GscPageData | null; psi: PageSpeedData | null; psiLoading: boolean
  psiEnabled: boolean; gscConnected: boolean; onQueryClick: (s: string) => void; delay: number
}) {
  return (
    <div className="mp-audit-row mp-stagger-item" style={{ animationDelay:`${delay}ms` }}>
      <ScoreRing score={item.score} size={46}/>

      <div style={{ flex:'2 1 160px', minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:3, flexWrap:'wrap' }}>
          <span style={{ fontSize:10, color:'var(--theme-elevation-500)', background:'var(--theme-elevation-150)', border:'1px solid var(--theme-elevation-200)', padding:'1px 6px', borderRadius:5, fontFamily:'ui-monospace,monospace', flexShrink:0 }}>{item.type}</span>
          {item.score === 100 && <span style={{ fontSize:10, color:'#22c55e', background:'rgba(34,197,94,.06)', border:'1px solid rgba(34,197,94,.15)', padding:'1px 7px', borderRadius:20, flexShrink:0 }}>✓ Teljes</span>}
        </div>
        <div style={{ fontSize:13.5, fontWeight:600, color:'var(--theme-text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.label}</div>
        <div style={{ fontSize:10.5, color:'var(--theme-elevation-400)', fontFamily:'ui-monospace,monospace', marginTop:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.slug || '/'}</div>
      </div>

      <div style={{ flex:'2 1 130px', minWidth:120 }}>
        <div style={{ fontSize:10, color:'var(--theme-elevation-400)', marginBottom:6, fontWeight:500, letterSpacing:'.05em', textTransform:'uppercase' }}>SEO Score</div>
        <ScoreBar score={item.score}/>
      </div>

      <div style={{ flex:'2 1 130px', minWidth:120 }}>
        <div style={{ fontSize:10, color:'var(--theme-elevation-400)', marginBottom:6, fontWeight:500, letterSpacing:'.05em', textTransform:'uppercase' }}>{item.issues.length === 0 ? 'Státusz' : `${item.issues.length} Hiányzik`}</div>
        <IssuePills issues={item.issues}/>
      </div>

      {psiEnabled && (
        <div style={{ flex:'0 0 auto' }}>
          <div style={{ fontSize:10, color:'var(--theme-elevation-400)', marginBottom:6, fontWeight:500, letterSpacing:'.05em', textTransform:'uppercase' }}>Core Web Vitals</div>
          <CwvRow psi={psi} loading={psiLoading}/>
        </div>
      )}

      {gscConnected && (
        <div style={{ marginLeft:'auto', flexShrink:0 }}>
          <div style={{ fontSize:10, color:'var(--theme-elevation-400)', marginBottom:6, fontWeight:500, letterSpacing:'.05em', textTransform:'uppercase' }}>Search Console</div>
          {!gsc ? (
            <div style={{ display:'flex', gap:16 }}>
              {['klikk','megj.','pozíció'].map(l => <div key={l} style={{ textAlign:'right', minWidth:36 }}><div style={{ fontSize:13, color:'var(--theme-elevation-200)', fontFamily:'ui-monospace,monospace' }}>—</div><div style={{ fontSize:10, color:'var(--theme-elevation-300)' }}>{l}</div></div>)}
            </div>
          ) : (
            <div style={{ display:'flex', gap:16 }}>
              <div style={{ textAlign:'right' }}><div style={{ fontSize:13, fontWeight:600, color:'#3dffa0', fontVariantNumeric:'tabular-nums' }}>{fmt(gsc.clicks)}</div><div style={{ fontSize:10, color:'var(--theme-elevation-400)' }}>klikk</div></div>
              <div style={{ textAlign:'right' }}><div style={{ fontSize:13, color:'var(--theme-elevation-500)', fontVariantNumeric:'tabular-nums' }}>{fmt(gsc.impressions)}</div><div style={{ fontSize:10, color:'var(--theme-elevation-400)', display:'flex', alignItems:'center', justifyContent:'flex-end' }}>megj.<InfoTip text="Hányszor jelent meg az oldal a Google találatokban."/></div></div>
              <button onClick={() => onQueryClick(item.slug)} style={{ textAlign:'right', background:'none', border:'none', cursor:'pointer', padding:0 }}>
                <div style={{ fontSize:13, fontWeight:600, color:posColor(gsc.position), fontVariantNumeric:'tabular-nums', textDecoration:'underline dotted', textUnderlineOffset:2 }}>#{gsc.position}</div>
                <div style={{ fontSize:10, color:'var(--theme-elevation-400)' }}>pozíció</div>
              </button>
            </div>
          )}
        </div>
      )}

      <button onClick={() => { window.location.href = item.editUrl }}
        style={{ padding:'5px 12px', borderRadius:8, fontSize:11.5, fontWeight:500, background:'transparent', color:'var(--theme-elevation-500)', border:'1px solid var(--theme-elevation-200)', cursor:'pointer', flexShrink:0, whiteSpace:'nowrap', transition:'all .12s', fontFamily:'var(--font-body)' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor='var(--theme-elevation-400)'; e.currentTarget.style.color='var(--theme-text)'; e.currentTarget.style.background='var(--theme-elevation-100)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor='var(--theme-elevation-200)'; e.currentTarget.style.color='var(--theme-elevation-500)'; e.currentTarget.style.background='transparent' }}>
        Szerkesztés →
      </button>
    </div>
  )
}

// ─── Audit Card (grid layout) ─────────────────────────────────────────────────
function AuditCard({ item, gsc, psi, psiLoading, psiEnabled, gscConnected, onQueryClick, delay }: {
  item: PageAudit; gsc: GscPageData | null; psi: PageSpeedData | null; psiLoading: boolean
  psiEnabled: boolean; gscConnected: boolean; onQueryClick: (s: string) => void; delay: number
}) {
  const sColor = scoreColor(item.score)
  return (
    <div className="mp-audit-card mp-stagger-item" style={{ animationDelay:`${delay}ms` }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:10 }}>
        <div style={{ minWidth:0, flex:1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:5, flexWrap:'wrap' }}>
            <span style={{ fontSize:10, color:'var(--theme-elevation-500)', background:'var(--theme-elevation-150)', border:'1px solid var(--theme-elevation-200)', padding:'1px 6px', borderRadius:4, fontFamily:'ui-monospace,monospace', flexShrink:0 }}>{item.type}</span>
            {item.score === 100 && <span style={{ fontSize:10, color:'#22c55e', background:'rgba(34,197,94,.06)', border:'1px solid rgba(34,197,94,.15)', padding:'1px 7px', borderRadius:20 }}>✓</span>}
          </div>
          <div style={{ fontSize:13.5, fontWeight:600, color:'var(--theme-text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.label}</div>
          <div style={{ fontSize:10.5, color:'var(--theme-elevation-400)', fontFamily:'ui-monospace,monospace', marginTop:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.slug || '/'}</div>
        </div>
        <ScoreRing score={item.score} size={44}/>
      </div>

      <div>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
          <span style={{ fontSize:10, color:'var(--theme-elevation-400)', fontWeight:500, letterSpacing:'.05em', textTransform:'uppercase' }}>SEO Score</span>
          <span style={{ fontSize:11, fontWeight:600, color:sColor }}>{item.score}%</span>
        </div>
        <ScoreBar score={item.score}/>
      </div>

      <div>
        <div style={{ fontSize:10, color:'var(--theme-elevation-400)', fontWeight:500, letterSpacing:'.05em', textTransform:'uppercase', marginBottom:5 }}>{item.issues.length === 0 ? 'Státusz' : `${item.issues.length} hiányzó mező`}</div>
        <IssuePills issues={item.issues}/>
      </div>

      {gscConnected && gsc && (
        <div style={{ borderTop:'1px solid var(--theme-elevation-150)', paddingTop:12, display:'flex', flexDirection:'column', gap:8 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontSize:10, color:'var(--theme-elevation-400)' }}>Klikk</span>
            <span style={{ fontSize:12, fontWeight:600, color:'#3dffa0', fontVariantNumeric:'tabular-nums' }}>{fmt(gsc.clicks)}</span>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontSize:10, color:'var(--theme-elevation-400)', display:'flex', alignItems:'center' }}>Megjelenés<InfoTip text="Hányszor jelent meg a Google találatokban."/></span>
            <span style={{ fontSize:12, color:'var(--theme-elevation-500)', fontVariantNumeric:'tabular-nums' }}>{fmt(gsc.impressions)}</span>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontSize:10, color:'var(--theme-elevation-400)' }}>Pozíció</span>
            <button onClick={() => onQueryClick(item.slug)} style={{ background:'none', border:'none', cursor:'pointer', padding:0, fontSize:12, fontWeight:600, color:posColor(gsc.position), fontVariantNumeric:'tabular-nums', textDecoration:'underline dotted', textUnderlineOffset:2 }}>
              #{gsc.position}
            </button>
          </div>
        </div>
      )}

      {psiEnabled && (
        <div style={{ borderTop:'1px solid var(--theme-elevation-150)', paddingTop:12 }}>
          <div style={{ fontSize:10, color:'var(--theme-elevation-400)', marginBottom:8, fontWeight:500, letterSpacing:'.05em', textTransform:'uppercase', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span>Core Web Vitals</span>
            {psi && <span style={{ color:cwvColor.lcp(psi.lcpMs), fontFamily:'ui-monospace,monospace', fontWeight:600 }}>{psi.score}/100</span>}
          </div>
          <CwvRow psi={psi} loading={psiLoading}/>
        </div>
      )}

      <div style={{ display:'flex', justifyContent:'flex-end' }}>
        <button onClick={() => { window.location.href = item.editUrl }}
          style={{ padding:'5px 12px', borderRadius:8, fontSize:11.5, fontWeight:500, background:'transparent', color:'var(--theme-elevation-500)', border:'1px solid var(--theme-elevation-200)', cursor:'pointer', transition:'all .12s', whiteSpace:'nowrap', fontFamily:'var(--font-body)' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor='var(--theme-elevation-400)'; e.currentTarget.style.color='var(--theme-text)'; e.currentTarget.style.background='var(--theme-elevation-100)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor='var(--theme-elevation-200)'; e.currentTarget.style.color='var(--theme-elevation-500)'; e.currentTarget.style.background='transparent' }}>
          Szerkesztés →
        </button>
      </div>
    </div>
  )
}

// ─── Query Drawer ─────────────────────────────────────────────────────────────
function QueryDrawer({ slug, onClose }: { slug: string; onClose: () => void }) {
  const [queries, setQueries] = useState<QueryRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const s = slug || ''
    fetch(`/api/marketing-metrics/gsc-queries?slug=${encodeURIComponent(s)}`).then(r => r.json()).then(d => {
      if (d.ok) setQueries(d.queries)
    }).finally(() => setLoading(false))
  }, [slug])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div className="mp-drawer-overlay" onClick={onClose}>
      <div className="mp-drawer" onClick={e => e.stopPropagation()}>
        <div className="mp-drawer-header">
          <div>
            <div style={{ fontSize:13, fontWeight:600, color:'var(--theme-text)', marginBottom:2 }}>Keresési kifejezések</div>
            <div style={{ fontSize:11, color:'var(--theme-elevation-400)', fontFamily:'ui-monospace,monospace', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:260 }}>{slug || 'összes oldal'}</div>
          </div>
          <button onClick={onClose} style={{ width:26, height:26, borderRadius:6, border:'1px solid var(--theme-elevation-200)', background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--theme-elevation-500)' }}
            onMouseEnter={e => { e.currentTarget.style.background='var(--theme-elevation-100)'; e.currentTarget.style.color='var(--theme-text)' }}
            onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='var(--theme-elevation-500)' }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <div style={{ flex:1, overflowY:'auto' }}>
          {loading ? (
            <div style={{ display:'flex', justifyContent:'center', padding:'3rem', color:'var(--theme-elevation-400)', gap:8 }}><Spinner/><span style={{ fontSize:12 }}>Betöltés...</span></div>
          ) : queries.length === 0 ? (
            <div style={{ textAlign:'center', padding:'3rem', fontSize:12, color:'var(--theme-elevation-400)' }}>Nincs keresési adat ehhez az oldalhoz</div>
          ) : (
            <>
              <div style={{ display:'grid', gridTemplateColumns:'1fr auto auto auto', gap:0 }}>
                <div style={{ padding:'8px 16px', fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'.08em', color:'var(--theme-elevation-400)', fontFamily:'ui-monospace,monospace', borderBottom:'1px solid var(--theme-elevation-150)' }}>Kifejezés</div>
                {['Klikk','Megj.','Pozíció'].map(h => <div key={h} style={{ padding:'8px 12px', fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'.08em', color:'var(--theme-elevation-400)', fontFamily:'ui-monospace,monospace', textAlign:'right', borderBottom:'1px solid var(--theme-elevation-150)' }}>{h}</div>)}
              </div>
              {queries.map((q, i) => (
                <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr auto auto auto', gap:0, borderBottom:'1px solid var(--theme-elevation-100)' }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background='var(--theme-elevation-50)'}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background='transparent'}>
                  <div style={{ padding:'9px 16px', fontSize:12, color:'var(--theme-text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{q.query}</div>
                  <div style={{ padding:'9px 12px', fontSize:12, fontWeight:600, color:'#3dffa0', fontFamily:'ui-monospace,monospace', textAlign:'right' }}>{q.clicks}</div>
                  <div style={{ padding:'9px 12px', fontSize:12, color:'var(--theme-elevation-500)', fontFamily:'ui-monospace,monospace', textAlign:'right' }}>{fmt(q.impressions)}</div>
                  <div style={{ padding:'9px 12px', fontSize:12, fontWeight:600, color:posColor(q.position as number), fontFamily:'ui-monospace,monospace', textAlign:'right' }}>#{q.position}</div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── SEO Analyzer ─────────────────────────────────────────────────────────────
function ScoreRingLg({ score }: { score: number }) {
  const c = scoreColor(score), r = 22, circ = 2 * Math.PI * r, dash = (score / 100) * circ
  return (
    <svg width={56} height={56} viewBox="0 0 56 56">
      <circle cx={28} cy={28} r={r} fill="none" stroke="var(--theme-elevation-150)" strokeWidth={5}/>
      <circle cx={28} cy={28} r={r} fill="none" stroke={c} strokeWidth={5} strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" transform="rotate(-90 28 28)" style={{ transition:'stroke-dasharray .5s ease' }}/>
      <text x={28} y={33} textAnchor="middle" fontSize={13} fontWeight={700} fill={c} style={{ fontFamily:'ui-monospace,monospace' }}>{score}</text>
    </svg>
  )
}

function SeoAnalyzer() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SeoResult | null>(null)
  const [err, setErr] = useState<string | null>(null)

  const analyze = async (path: string) => {
    const full = path.startsWith('http') ? path : `${SITE}${path}`
    setUrl(full); setLoading(true); setResult(null); setErr(null)
    try {
      const r = await fetch(`/api/seo-analyze?url=${encodeURIComponent(full)}`)
      const d = await r.json()
      if (d.ok) setResult(d)
      else setErr(d.error || 'Hiba')
    } catch (e) { setErr(String(e)) }
    finally { setLoading(false) }
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
      <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
        {SEO_PAGES.map(p => <button key={p} onClick={() => analyze(p)} style={{ fontSize:11, padding:'4px 12px', borderRadius:999, background:'var(--theme-elevation-100)', border:'1px solid var(--theme-elevation-200)', color:'var(--theme-text)', cursor:'pointer', fontFamily:'ui-monospace,monospace', transition:'all .12s' }} onMouseEnter={e => { e.currentTarget.style.borderColor='var(--theme-elevation-400)'; e.currentTarget.style.background='var(--theme-elevation-150)' }} onMouseLeave={e => { e.currentTarget.style.borderColor='var(--theme-elevation-200)'; e.currentTarget.style.background='var(--theme-elevation-100)' }}>{p}</button>)}
      </div>
      <div style={{ display:'flex', gap:8 }}>
        <input value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === 'Enter' && analyze(url)} placeholder={`${SITE}/hu/...`} style={{ flex:1, padding:'8px 12px', borderRadius:8, border:'1px solid var(--theme-elevation-200)', background:'var(--theme-elevation-50)', color:'var(--theme-text)', fontSize:13, fontFamily:'ui-monospace,monospace', outline:'none' }}/>
        <button onClick={() => analyze(url)} disabled={loading || !url} style={{ padding:'8px 18px', borderRadius:8, background:'#6366f1', color:'#fff', border:'none', fontWeight:600, fontSize:13, cursor:'pointer', opacity: loading || !url ? 0.5 : 1 }}>{loading ? '…' : 'Elemzés'}</button>
      </div>
      {err && <div style={{ padding:'10px 14px', borderRadius:8, background:'rgba(239,68,68,.08)', border:'1px solid rgba(239,68,68,.2)', color:'#ef4444', fontSize:13 }}>{err}</div>}
      {result && (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <div className="mp-card" style={{ display:'flex', alignItems:'center', gap:16, padding:'14px 16px' }}>
            <ScoreRingLg score={result.score}/>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:15, fontWeight:700, color:'var(--theme-text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{result.title || '(nincs title)'}</div>
              <div style={{ fontSize:11, color:'var(--theme-elevation-500)', fontFamily:'ui-monospace,monospace', marginTop:3, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{result.url}</div>
            </div>
            <div style={{ display:'flex', gap:5, flexWrap:'wrap', justifyContent:'flex-end' }}>
              {[{ label:`hreflang ${result.hreflang.length > 0 ? '✓' : '✗'}`, ok: result.hreflang.length > 0 }, { label:`canonical ${result.canonical ? '✓' : '✗'}`, ok:!!result.canonical }, { label:`JSON-LD ${result.structuredData.length}`, ok: result.structuredData.length > 0 }].map(b => (
                <span key={b.label} style={{ fontSize:10, padding:'2px 8px', borderRadius:999, background:b.ok ? 'rgba(34,197,94,.1)' : 'rgba(239,68,68,.1)', color:b.ok ? '#22c55e' : '#ef4444', fontFamily:'ui-monospace,monospace', fontWeight:600 }}>{b.label}</span>
              ))}
            </div>
          </div>
          {result.issues.length > 0 && (
            <div className="mp-card">
              <div style={{ padding:'8px 14px', borderBottom:'1px solid var(--theme-elevation-150)', fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.08em', color:'#f59e0b', fontFamily:'ui-monospace,monospace' }}>Problémák ({result.issues.length})</div>
              <div style={{ padding:'10px 14px', display:'flex', flexDirection:'column', gap:6 }}>
                {result.issues.map((issue, i) => <div key={i} style={{ fontSize:13, color:'var(--theme-text)', display:'flex', gap:8 }}><span style={{ color:'#f59e0b' }}>⚠</span>{issue}</div>)}
              </div>
            </div>
          )}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            {[
              { label:'Title', val:result.title, len:result.title?.length, min:30, max:60 },
              { label:'Description', val:(result as any).description, len:(result as any).description?.length, min:70, max:160 },
              { label:'Canonical', val:result.canonical, mono:true },
              { label:'OG Title', val:result.ogTitle },
              { label:'OG Image', val:result.ogImage, mono:true },
              { label:'Robots', val:result.robots || 'index, follow' },
            ].map(f => (
              <div key={f.label} className="mp-card" style={{ padding:'10px 12px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                  <span style={{ fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'.06em', color:'var(--theme-elevation-500)', fontFamily:'ui-monospace,monospace' }}>{f.label}</span>
                  {f.len !== undefined && <span style={{ fontSize:9, padding:'1px 6px', borderRadius:999, fontFamily:'ui-monospace,monospace', fontWeight:600, background: f.len < (f.min || 0) ? 'rgba(245,158,11,.1)' : f.len > (f.max || 999) ? 'rgba(239,68,68,.1)' : 'rgba(34,197,94,.1)', color: f.len < (f.min || 0) ? '#f59e0b' : f.len > (f.max || 999) ? '#ef4444' : '#22c55e' }}>{f.len} kar.</span>}
                </div>
                <div style={{ fontSize:12, color:f.val ? 'var(--theme-text)' : 'var(--theme-elevation-300)', fontFamily:(f as any).mono ? 'ui-monospace,monospace' : undefined, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{f.val || '—'}</div>
              </div>
            ))}
          </div>
          {result.hreflang.length > 0 && (
            <div className="mp-card">
              <div style={{ padding:'8px 14px', borderBottom:'1px solid var(--theme-elevation-150)', fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.08em', color:'var(--theme-elevation-500)', fontFamily:'ui-monospace,monospace' }}>Hreflang ({result.hreflang.length})</div>
              <div style={{ padding:'10px 14px', display:'flex', flexDirection:'column', gap:5 }}>
                {result.hreflang.map((h, i) => <div key={i} style={{ display:'flex', gap:10, fontSize:12, fontFamily:'ui-monospace,monospace' }}><span style={{ fontSize:10, padding:'1px 7px', borderRadius:999, background:'var(--theme-elevation-100)', color:'var(--theme-elevation-600)', border:'1px solid var(--theme-elevation-200)' }}>{h.lang}</span><span style={{ color:'var(--theme-elevation-500)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{h.href}</span></div>)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const TABS = ['SEO Audit', 'Analytics', 'URL Ellenőrzés'] as const
type Tab = typeof TABS[number]

const AUDIT_FILTERS = ['Összes', 'Problémák', 'Cikk', 'Termék', 'Oldal'] as const
type AuditFilter = typeof AUDIT_FILTERS[number]

export function MarketingPage() {
  const { setStepNav } = useStepNav()
  useEffect(() => { setStepNav([{ label: 'Marketing & SEO' }]) }, [setStepNav])

  const [tab, setTab] = useState<Tab>('SEO Audit')

  // Analytics state
  const [stats, setStats] = useState<Stats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [noAuth, setNoAuth] = useState(false)

  // Audit state
  const [auditItems, setAuditItems] = useState<PageAudit[]>([])
  const [auditLoading, setAuditLoading] = useState(true)
  const [gscPages, setGscPages] = useState<Record<string, GscPageData>>({})
  const [auditFilter, setAuditFilter] = useState<AuditFilter>('Összes')
  const [layout, setLayout] = useState<'list' | 'grid'>('list')

  // PSI state
  const [psiEnabled, setPsiEnabled] = useState(false)
  const [psiData, setPsiData] = useState<Record<string, PageSpeedData>>({})
  const [psiLoading, setPsiLoading] = useState<Set<string>>(new Set())

  // Query drawer
  const [drawerSlug, setDrawerSlug] = useState<string | null>(null)

  // Top queries
  const [topQueries, setTopQueries] = useState<QueryRow[]>([])

  useEffect(() => {
    fetch('/api/marketing-metrics/gsc-stats').then(r => r.json()).then(d => {
      if (d.ok) setStats(d)
      else setNoAuth(true)
    }).catch(() => setNoAuth(true)).finally(() => setStatsLoading(false))

    fetch('/api/marketing-metrics/gsc-pages').then(r => r.json()).then(d => {
      if (d.ok) setGscPages(d.data)
    }).catch(() => {})

    fetch('/api/marketing-metrics/gsc-queries').then(r => r.json()).then(d => {
      if (d.ok) setTopQueries(d.queries)
    }).catch(() => {})

    fetch('/api/seo-audit').then(r => r.json()).then(d => {
      if (d.ok) setAuditItems(d.items)
    }).finally(() => setAuditLoading(false))
  }, [])

  // PSI: load from cache on mount
  useEffect(() => {
    const cache = loadPsiCache()
    const now = Date.now()
    const valid: Record<string, PageSpeedData> = {}
    for (const [k, v] of Object.entries(cache)) {
      if (now - v.fetchedAt < PSI_TTL) valid[k] = v
    }
    if (Object.keys(valid).length) setPsiData(valid)
  }, [])

  const runPsi = useCallback(async (items: PageAudit[]) => {
    const cache = loadPsiCache()
    const now = Date.now()
    for (const item of items) {
      const slug = item.slug || '/'
      if (cache[slug] && now - cache[slug].fetchedAt < PSI_TTL) {
        setPsiData(prev => ({ ...prev, [slug]: cache[slug] }))
        continue
      }
      setPsiLoading(prev => new Set([...prev, slug]))
      await new Promise(r => setTimeout(r, 350))
      const result = await fetchPsi(slug)
      setPsiLoading(prev => { const s = new Set(prev); s.delete(slug); return s })
      if (result) {
        cache[slug] = result
        setPsiData(prev => ({ ...prev, [slug]: result }))
      }
    }
    savePsiCache(cache)
  }, [])

  useEffect(() => {
    if (psiEnabled && auditItems.length > 0) runPsi(auditItems)
  }, [psiEnabled, auditItems, runPsi])

  // Filtered audit items
  const filteredItems = auditItems.filter(item => {
    if (auditFilter === 'Problémák') return item.score < 100
    if (auditFilter === 'Cikk') return item.type === 'Cikk'
    if (auditFilter === 'Termék') return item.type === 'Termék'
    if (auditFilter === 'Oldal') return item.type === 'Oldal'
    return true
  })

  // GSC match: try exact slug, then partial match
  const getGsc = (slug: string): GscPageData | null => {
    if (!slug) return null
    const s = slug.startsWith('/') ? slug : `/${slug}`
    if (gscPages[s]) return gscPages[s]
    // try matching /hu/slug or /en/slug
    const match = Object.entries(gscPages).find(([k]) => k.endsWith(s))
    return match ? match[1] : null
  }

  const gscConnected = !noAuth && Object.keys(gscPages).length > 0

  const commonAuditProps = { gscConnected, psiEnabled, onQueryClick: (s: string) => setDrawerSlug(s) }

  return (
    <>
      <style>{CSS}</style>

      <div style={{ padding:'var(--gutter-h)' }}>
        {/* Header */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'1.5rem', flexWrap:'wrap', gap:12 }}>
          <div>
            <h1 style={{ margin:0, fontSize:26, lineHeight:'32px', fontWeight:500, letterSpacing:'-0.5px', fontFamily:'var(--font-body)', color:'var(--theme-text)' }}>Marketing & SEO</h1>
            <p style={{ margin:'4px 0 0', fontSize:'var(--base-body-size)', color:'var(--theme-elevation-500)' }}>Google Search Console · Tartalomaudit · Core Web Vitals</p>
          </div>
          {!statsLoading && (noAuth
            ? <a href="/api/marketing-metrics/gsc-auth" style={{ padding:'8px 16px', borderRadius:8, background:'#6366f1', color:'#fff', textDecoration:'none', fontWeight:600, fontSize:13 }}>GSC csatlakoztatása</a>
            : <form action="/api/marketing-metrics/gsc-disconnect" method="POST"><button type="submit" style={{ padding:'6px 14px', borderRadius:8, background:'var(--theme-elevation-100)', color:'var(--theme-elevation-500)', border:'1px solid var(--theme-elevation-200)', cursor:'pointer', fontSize:12, fontFamily:'var(--font-body)' }}>Lecsatlakozás</button></form>
          )}
        </div>

        {/* Tab bar */}
        <div className="mp-tab-bar">
          {TABS.map(t => <button key={t} className={`mp-tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>{t}</button>)}
        </div>

        {/* ── SEO AUDIT ── */}
        {tab === 'SEO Audit' && (
          <div className="mp-w">
            {/* Toolbar */}
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:'1rem', flexWrap:'wrap' }}>
              <div style={{ display:'flex', gap:5, flexWrap:'wrap', flex:1 }}>
                {AUDIT_FILTERS.map(f => <button key={f} className={`mp-chip${auditFilter === f ? ' active' : ''}`} onClick={() => setAuditFilter(f)}>{f}{f !== 'Összes' && f !== 'Problémák' ? '' : ''}</button>)}
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <button
                  onClick={() => setPsiEnabled(v => !v)}
                  style={{ padding:'5px 12px', borderRadius:8, fontSize:12, fontWeight:500, cursor:'pointer', border:'1px solid', borderColor:psiEnabled ? '#22c55e' : 'var(--theme-elevation-200)', background:psiEnabled ? 'rgba(34,197,94,.08)' : 'transparent', color:psiEnabled ? '#22c55e' : 'var(--theme-elevation-500)', fontFamily:'var(--font-body)', transition:'all .15s', display:'flex', alignItems:'center', gap:5 }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  Core Web Vitals {psiEnabled ? 'BE' : 'KI'}
                </button>
                <button className={`mp-layout-btn${layout === 'list' ? ' active' : ''}`} onClick={() => setLayout('list')} title="Lista">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                </button>
                <button className={`mp-layout-btn${layout === 'grid' ? ' active' : ''}`} onClick={() => setLayout('grid')} title="Kártya">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                </button>
              </div>
            </div>

            {auditLoading ? (
              <div style={{ display:'flex', justifyContent:'center', padding:'4rem', gap:8, color:'var(--theme-elevation-400)' }}><Spinner/><span style={{ fontSize:13 }}>Tartalom betöltése...</span></div>
            ) : filteredItems.length === 0 ? (
              <div style={{ textAlign:'center', padding:'4rem', color:'var(--theme-elevation-400)', fontSize:13 }}>Nincs találat</div>
            ) : layout === 'list' ? (
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {filteredItems.map((item, i) => (
                  <AuditRow key={item.id} item={item} gsc={getGsc(item.slug)} psi={psiData[item.slug || '/'] || null} psiLoading={psiLoading.has(item.slug || '/')} {...commonAuditProps} delay={i * 30}/>
                ))}
              </div>
            ) : (
              <div className="mp-audit-grid">
                {filteredItems.map((item, i) => (
                  <AuditCard key={item.id} item={item} gsc={getGsc(item.slug)} psi={psiData[item.slug || '/'] || null} psiLoading={psiLoading.has(item.slug || '/')} {...commonAuditProps} delay={i * 40}/>
                ))}
              </div>
            )}

            {!gscConnected && !noAuth && (
              <div style={{ marginTop:16, padding:'10px 14px', borderRadius:8, background:'rgba(99,102,241,.06)', border:'1px solid rgba(99,102,241,.2)', fontSize:12, color:'var(--theme-elevation-500)', display:'flex', alignItems:'center', gap:8 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#7c6af7" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                GSC nincs csatlakoztatva — a keresési adatok nem jelennek meg az auditban.
                <a href="/api/marketing-metrics/gsc-auth" style={{ color:'#7c6af7', fontWeight:600, textDecoration:'none' }}>Csatlakoztatás →</a>
              </div>
            )}
          </div>
        )}

        {/* ── ANALYTICS ── */}
        {tab === 'Analytics' && (
          <div className="mp-w" style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
            {statsLoading ? (
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:200, gap:8, color:'var(--theme-elevation-400)', fontSize:13 }}><Spinner/>Betöltés...</div>
            ) : noAuth ? (
              <div className="mp-card" style={{ padding:'3rem', textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
                <p style={{ color:'var(--theme-elevation-500)', fontSize:14, margin:0 }}>A Google Search Console nincs csatlakoztatva.</p>
                <a href="/api/marketing-metrics/gsc-auth" style={{ padding:'10px 24px', borderRadius:8, background:'#6366f1', color:'#fff', textDecoration:'none', fontWeight:600, fontSize:14 }}>GSC csatlakoztatása</a>
              </div>
            ) : stats ? (
              <>
                {/* 4 stat cards */}
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:10 }}>
                  {[
                    { label:'Kattintás (31n)', value:fmt(stats.totalClicks), delta:stats.clicksDelta, color:'#3dffa0' },
                    { label:'Megjelenés (31n)', value:fmt(stats.totalImpressions), delta:stats.impsDelta, color:'#7c6af7' },
                    { label:'Átl. CTR', value:`${stats.avgCtr}%`, color:'#f0c742' },
                    { label:'Átl. pozíció', value:`#${stats.avgPosition}`, color:'var(--theme-text)' },
                  ].map(s => (
                    <div key={s.label} className="mp-stat">
                      <div style={{ fontSize:10, color:'var(--theme-elevation-500)', fontFamily:'ui-monospace,monospace', marginBottom:6 }}>{s.label}</div>
                      <div style={{ fontSize:22, fontWeight:700, letterSpacing:'-0.04em', fontFamily:'ui-monospace,monospace', color:s.color, lineHeight:1 }}>{s.value}</div>
                      {s.delta !== undefined && s.delta !== 0 && <div style={{ marginTop:4 }}><ChangeBadge value={s.delta}/></div>}
                    </div>
                  ))}
                </div>

                {/* Dual chart */}
                <DualChart trend={stats.trend}/>

                {/* Top pages */}
                <div className="mp-card">
                  <div style={{ padding:'10px 14px', borderBottom:'1px solid var(--theme-elevation-150)', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'.07em', color:'var(--theme-elevation-500)', fontFamily:'ui-monospace,monospace' }}>Top oldalak (31n)</div>
                  <table className="mp-table">
                    <thead><tr><th>Oldal</th><th style={{ textAlign:'right' }}>Klikk</th><th style={{ textAlign:'right' }}>Megjelenés</th><th style={{ textAlign:'right' }}>Pozíció</th></tr></thead>
                    <tbody>
                      {stats.topPages.map((p, i) => (
                        <tr key={i}>
                          <td style={{ fontFamily:'ui-monospace,monospace', fontSize:12, maxWidth:380, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.slug}</td>
                          <td style={{ textAlign:'right', fontFamily:'ui-monospace,monospace', color:'#3dffa0', fontWeight:600 }}>{p.clicks}</td>
                          <td style={{ textAlign:'right', fontFamily:'ui-monospace,monospace', color:'var(--theme-elevation-500)' }}>{fmt(p.impressions)}</td>
                          <td style={{ textAlign:'right', fontFamily:'ui-monospace,monospace', color:posColor(p.position) }}>#{p.position}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Top queries */}
                {topQueries.length > 0 && (
                  <div className="mp-card">
                    <div style={{ padding:'10px 14px', borderBottom:'1px solid var(--theme-elevation-150)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                      <span style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'.07em', color:'var(--theme-elevation-500)', fontFamily:'ui-monospace,monospace' }}>Top keresési kifejezések</span>
                      <button onClick={() => setDrawerSlug('')} style={{ fontSize:11, color:'var(--theme-elevation-500)', background:'transparent', border:'none', cursor:'pointer', fontFamily:'var(--font-body)', textDecoration:'underline dotted' }}>Összes →</button>
                    </div>
                    <table className="mp-table">
                      <thead><tr><th>Kifejezés</th><th style={{ textAlign:'right' }}>Klikk</th><th style={{ textAlign:'right' }}>Megjelenés</th><th style={{ textAlign:'right' }}>Pozíció</th></tr></thead>
                      <tbody>
                        {topQueries.slice(0, 10).map((q, i) => (
                          <tr key={i}>
                            <td style={{ fontSize:12 }}>{q.query}</td>
                            <td style={{ textAlign:'right', fontFamily:'ui-monospace,monospace', color:'#3dffa0', fontWeight:600 }}>{q.clicks}</td>
                            <td style={{ textAlign:'right', fontFamily:'ui-monospace,monospace', color:'var(--theme-elevation-500)' }}>{fmt(q.impressions)}</td>
                            <td style={{ textAlign:'right', fontFamily:'ui-monospace,monospace', color:posColor(q.position) }}>#{q.position}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            ) : null}
          </div>
        )}

        {/* ── URL ELLENŐRZÉS ── */}
        {tab === 'URL Ellenőrzés' && (
          <div className="mp-w">
            <SeoAnalyzer/>
          </div>
        )}
      </div>

      {/* Query drawer */}
      {drawerSlug !== null && <QueryDrawer slug={drawerSlug} onClose={() => setDrawerSlug(null)}/>}
    </>
  )
}
