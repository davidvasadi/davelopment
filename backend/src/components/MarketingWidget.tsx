'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface TrendPoint { date: string; clicks: number; impressions: number; position: number }
interface GscStats { ok: boolean; totalClicks: number; totalImpressions: number; avgCtr: number; avgPosition: number; clicksDelta: number; impsDelta: number; trend: TrendPoint[] }
interface QueryRow { query: string; clicks: number; impressions: number; position: number }

const fmt = (n: number) => n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n)
const posColor = (p: number) => p <= 3 ? 'var(--bw-success, #22c55e)' : p <= 10 ? 'var(--bw-yellow, #f0c742)' : 'var(--theme-elevation-500)'

const CSS = `
  @keyframes mw-spin { to{transform:rotate(360deg)} }
  @keyframes mw-sk   { to{stroke-dashoffset:0} }

  .mw-w { display:flex; flex-direction:column; gap:10px; }

  .mw-stats { display:grid; grid-template-columns:1fr 1fr; gap:1px; background:var(--theme-elevation-150); border-radius:12px; overflow:hidden; border:1px solid var(--theme-elevation-150) }
  .mw-stat  { background:var(--theme-elevation-50); padding:12px 14px; transition:background 120ms; cursor:default }
  .mw-stat:hover { background:var(--theme-elevation-100) }
  .mw-stat-label { font-size:9.5px; font-weight:600; text-transform:uppercase; letter-spacing:.06em; color:var(--theme-elevation-500); margin-bottom:5px; font-family:ui-monospace,monospace }
  .mw-stat-val   { font-size:1.6rem; font-weight:700; letter-spacing:-0.04em; font-family:ui-monospace,monospace; line-height:1 }
  .mw-stat-delta { margin-top:4px; font-size:.7rem }

  .mw-chart-wrap { background:var(--theme-elevation-50); border:1px solid var(--theme-elevation-150); border-radius:12px; overflow:hidden }

  .mw-queries { background:var(--theme-elevation-50); border:1px solid var(--theme-elevation-150); border-radius:12px; overflow:hidden }
  .mw-q-head  { display:grid; grid-template-columns:1fr auto auto; gap:0; padding:6px 14px; border-bottom:1px solid var(--theme-elevation-150) }
  .mw-q-row   { display:grid; grid-template-columns:1fr auto auto; gap:0; padding:7px 14px; border-bottom:1px solid var(--theme-elevation-100); transition:background 100ms; cursor:default }
  .mw-q-row:last-child { border-bottom:none }
  .mw-q-row:hover { background:var(--theme-elevation-100) }
`

function Delta({ v, inv }: { v: number; inv?: boolean }) {
  const pos = inv ? v < 0 : v > 0
  if (v === 0) return <span style={{ color:'var(--theme-elevation-300)' }}>—</span>
  return (
    <span style={{ color: pos ? 'var(--bw-success, #22c55e)' : 'var(--bw-danger, #ef4444)', background: pos ? 'rgba(34,197,94,.08)' : 'rgba(239,68,68,.08)', padding:'1px 6px', borderRadius:20 }}>
      {pos ? '↑' : '↓'} {Math.abs(v)}%
    </span>
  )
}

// ─── Compact Dual Chart ───────────────────────────────────────────────────────
function MiniDualChart({ trend }: { trend: TrendPoint[] }) {
  const [tt, setTt] = useState<number | null>(null)
  const chartKey = trend.length > 0 ? `${trend[0].date}-${trend[trend.length - 1].date}` : 'empty'

  if (trend.length < 2) return null

  const W = 700, H = 90
  const PAD = { top: 8, right: 8, bottom: 20, left: 36 }
  const iW = W - PAD.left - PAD.right
  const iH = H - PAD.top - PAD.bottom
  const n = trend.length

  const cVals = trend.map(t => t.clicks)
  const iVals = trend.map(t => t.impressions)
  const px = (i: number) => PAD.left + (i / Math.max(n - 1, 1)) * iW
  const makeScale = (vals: number[]) => {
    const mx = Math.max(...vals, 1)
    return { mx, py: (v: number) => PAD.top + iH - (v / mx) * iH }
  }
  const cS = makeScale(cVals), iS = makeScale(iVals)

  const linePath = (vals: number[], s: ReturnType<typeof makeScale>) => {
    return vals.map((v, i) => `${i === 0 ? 'M' : 'L'}${px(i).toFixed(1)},${s.py(v).toFixed(1)}`).join(' ')
  }
  const path = linePath
  const area = (vals: number[], s: ReturnType<typeof makeScale>) =>
    `${linePath(vals, s)} L${px(n - 1).toFixed(1)},${PAD.top + iH} L${PAD.left},${PAD.top + iH} Z`

  const yMx = Math.max(...cVals, 1)
  const yTicks = [0, 0.5, 1].map(t => {
    const v = yMx * t
    return { y: cS.py(v), label: v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(Math.round(v)) }
  })
  const xLabels = [0, Math.floor((n - 1) / 2), n - 1].map((i, li) => ({
    i, d: trend[i] ? new Date(trend[i].date).toLocaleDateString('hu-HU', { month:'short', day:'numeric' }) : '',
    a: li === 0 ? 'start' : li === 2 ? 'end' : 'middle',
  }))

  return (
    <div className="mw-chart-wrap">
      <div style={{ padding:'8px 10px 4px', display:'flex', gap:12, fontSize:10, fontFamily:'ui-monospace,monospace', color:'var(--theme-elevation-400)' }}>
        <span style={{ display:'flex', alignItems:'center', gap:5 }}>
          <span style={{ width:10, height:2, background:'var(--bw-green, #3dffa0)', borderRadius:99, display:'inline-block' }}/>Kattintás
        </span>
        <span style={{ display:'flex', alignItems:'center', gap:5 }}>
          <span style={{ width:10, height:2, background:'var(--bw-purple, #7c6af7)', borderRadius:99, display:'inline-block' }}/>Megjelenés
        </span>
      </div>
      <div style={{ position:'relative', padding:'0 4px 2px' }}>
        <svg key={chartKey} width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display:'block', overflow:'hidden', cursor:'crosshair' }}
          onMouseMove={e => {
            const r = e.currentTarget.getBoundingClientRect()
            const mx = (e.clientX - r.left) * (W / r.width)
            let ni = 0, nd = Infinity
            for (let i = 0; i < n; i++) { const dd = Math.abs(px(i) - mx); if (dd < nd) { nd = dd; ni = i } }
            setTt(ni)
          }}
          onMouseLeave={() => setTt(null)}>
          <defs>
            <linearGradient id="mwgc" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={'var(--bw-green, #3dffa0)'} stopOpacity=".14"/><stop offset="100%" stopColor={'var(--bw-green, #3dffa0)'} stopOpacity="0"/>
            </linearGradient>
            <linearGradient id="mwgi" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={'var(--bw-purple, #7c6af7)'} stopOpacity=".12"/><stop offset="100%" stopColor={'var(--bw-purple, #7c6af7)'} stopOpacity="0"/>
            </linearGradient>
            <clipPath id="mwclip"><rect x={PAD.left} y={PAD.top - 2} width={iW} height={iH + 4}/></clipPath>
          </defs>

          {yTicks.map((tk, i) => (
            <g key={i}>
              <line x1={PAD.left} y1={tk.y} x2={PAD.left + iW} y2={tk.y} stroke="var(--theme-elevation-150)" strokeWidth=".5" strokeDasharray={i === 0 ? undefined : '3 5'} opacity={i === 0 ? .8 : .35}/>
              <text x={PAD.left - 3} y={tk.y + 3} textAnchor="end" fontSize="6" fill="var(--theme-elevation-400)" fontFamily="ui-monospace,monospace">{tk.label}</text>
            </g>
          ))}

          <path d={area(iVals, iS)} fill="url(#mwgi)" clipPath="url(#mwclip)"/>
          <path d={area(cVals, cS)} fill="url(#mwgc)" clipPath="url(#mwclip)"/>
          <path d={path(iVals, iS)} fill="none" stroke={'var(--bw-purple, #7c6af7)'} strokeWidth="1.2" strokeLinejoin="round" clipPath="url(#mwclip)" strokeDasharray="10000" strokeDashoffset="10000" style={{ animation:'mw-sk .9s ease forwards' }}/>
          <path d={path(cVals, cS)} fill="none" stroke={'var(--bw-green, #3dffa0)'} strokeWidth="1.5" strokeLinejoin="round" clipPath="url(#mwclip)" strokeDasharray="10000" strokeDashoffset="10000" style={{ animation:'mw-sk .9s ease forwards' }}/>

          {tt !== null && (
            <>
              <line x1={px(tt)} y1={PAD.top} x2={px(tt)} y2={PAD.top + iH} stroke="var(--theme-elevation-300)" strokeWidth=".75" strokeDasharray="2 3"/>
              <circle cx={px(tt)} cy={cS.py(cVals[tt])} r="3.5" fill={'var(--bw-green, #3dffa0)'} stroke="var(--theme-elevation-50)" strokeWidth="1.5"/>
              <circle cx={px(tt)} cy={iS.py(iVals[tt])} r="3.5" fill={'var(--bw-purple, #7c6af7)'} stroke="var(--theme-elevation-50)" strokeWidth="1.5"/>
            </>
          )}
          {xLabels.map(({ i, d, a }) => (
            <text key={i} x={px(i)} y={H - 4} textAnchor={a as any} fontSize="6" fill="var(--theme-elevation-400)" fontFamily="ui-monospace,monospace">{d}</text>
          ))}
        </svg>

        {tt !== null && trend[tt] && (
          <div style={{ position:'absolute', top:6, left:`${Math.min(Math.max((tt / (n - 1)) * 100, 8), 68)}%`, transform:'translateX(-50%)', background:'var(--theme-elevation-100)', border:'1px solid var(--theme-elevation-200)', borderRadius:6, padding:'4px 8px', fontSize:10, fontFamily:'ui-monospace,monospace', pointerEvents:'none', whiteSpace:'nowrap', zIndex:10, boxShadow:'0 2px 8px rgba(0,0,0,.12)' }}>
            <div style={{ color:'var(--theme-elevation-500)', marginBottom:2 }}>{new Date(trend[tt].date).toLocaleDateString('hu-HU', { month:'short', day:'numeric' })}</div>
            <div style={{ color:'var(--bw-green, #3dffa0)', fontWeight:700 }}>{fmt(trend[tt].clicks)} klikk</div>
            <div style={{ color:'var(--bw-purple, #7c6af7)' }}>{fmt(trend[tt].impressions)} megj.</div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main Widget ──────────────────────────────────────────────────────────────
export function MarketingWidget() {
  const [stats, setStats] = useState<GscStats | null>(null)
  const [queries, setQueries] = useState<QueryRow[]>([])
  const [loading, setLoading] = useState(true)
  const [noAuth, setNoAuth] = useState(false)

  useEffect(() => {
    let alive = true
    Promise.all([
      fetch('/api/marketing-metrics/gsc-stats').then(r => r.json()),
      fetch('/api/marketing-metrics/gsc-queries').then(r => r.json()),
    ]).then(([s, q]) => {
      if (!alive) return
      if (s.ok) setStats(s); else setNoAuth(true)
      if (q.ok) setQueries(q.queries.slice(0, 5))
    }).catch(() => { if (alive) setNoAuth(true) })
      .finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [])

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:100, gap:8, color:'var(--theme-elevation-400)', fontSize:'0.8rem' }}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation:'mw-spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
      Betöltés...
    </div>
  )

  if (noAuth || !stats) return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:10, height:100 }}>
      <span style={{ fontSize:'0.8rem', color:'var(--theme-elevation-500)' }}>Google Search Console nincs csatlakoztatva</span>
      <a href="/api/marketing-metrics/gsc-auth" style={{ fontSize:'0.75rem', padding:'4px 14px', borderRadius:6, background:'#4f46e5', color:'#fff', textDecoration:'none', fontWeight:600 }}>Csatlakoztatás</a>
    </div>
  )

  const STATS = [
    { label:'Kattintás (31n)',  val:fmt(stats.totalClicks),        color:'var(--bw-green, #3dffa0)', delta:stats.clicksDelta },
    { label:'Megjelenés (31n)', val:fmt(stats.totalImpressions),   color:'var(--bw-purple, #7c6af7)', delta:stats.impsDelta },
    { label:'Átl. CTR',         val:`${stats.avgCtr}%`,            color:'var(--bw-yellow, #f0c742)', delta:null },
    { label:'Átl. pozíció',     val:`#${stats.avgPosition}`,       color:'var(--theme-text)', delta:null },
  ]

  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
  const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: 'easeOut' as const } } }

  return (
    <>
      <style>{CSS}</style>
      <motion.div className="mw-w" initial="hidden" animate="show" variants={stagger}>

        {/* Stat cards */}
        <motion.div className="mw-stats" variants={item}>
          {STATS.map(s => (
            <div key={s.label} className="mw-stat">
              <div className="mw-stat-label">{s.label}</div>
              <div className="mw-stat-val" style={{ color:s.color }}>{s.val}</div>
              {s.delta !== null && <div className="mw-stat-delta"><Delta v={s.delta}/></div>}
            </div>
          ))}
        </motion.div>

        {/* Dual trend chart */}
        <motion.div variants={item}><MiniDualChart trend={stats.trend}/></motion.div>

        {/* Top queries */}
        {queries.length > 0 && (
          <motion.div className="mw-queries" variants={item}>
            <div className="mw-q-head">
              <span style={{ fontSize:'9px', fontWeight:700, textTransform:'uppercase', letterSpacing:'.07em', color:'var(--theme-elevation-400)', fontFamily:'ui-monospace,monospace' }}>Top keresési kifejezések</span>
              <span style={{ fontSize:'9px', fontWeight:700, textTransform:'uppercase', letterSpacing:'.07em', color:'var(--theme-elevation-400)', fontFamily:'ui-monospace,monospace', textAlign:'right', paddingLeft:12 }}>Klikk</span>
              <span style={{ fontSize:'9px', fontWeight:700, textTransform:'uppercase', letterSpacing:'.07em', color:'var(--theme-elevation-400)', fontFamily:'ui-monospace,monospace', textAlign:'right', paddingLeft:12 }}>Poz.</span>
            </div>
            {queries.map((q, i) => (
              <div key={i} className="mw-q-row">
                <span style={{ fontSize:12, color:'var(--theme-text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', paddingRight:8 }}>{q.query}</span>
                <span style={{ fontSize:12, fontWeight:600, color:'var(--bw-green, #3dffa0)', fontFamily:'ui-monospace,monospace', textAlign:'right', paddingLeft:12 }}>{q.clicks}</span>
                <span style={{ fontSize:12, fontWeight:600, color:posColor(q.position), fontFamily:'ui-monospace,monospace', textAlign:'right', paddingLeft:12 }}>#{q.position}</span>
              </div>
            ))}
          </motion.div>
        )}

        {/* Footer link */}
        <a href="/admin/marketing"
          style={{ fontSize:13, color:'var(--theme-elevation-500)', textDecoration:'none', display:'inline-flex', alignItems:'center', gap:4, transition:'color 120ms', fontWeight:500, fontFamily:'var(--font-body)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--theme-text)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--theme-elevation-500)')}>
          Megnyitás <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </a>

      </motion.div>
    </>
  )
}
