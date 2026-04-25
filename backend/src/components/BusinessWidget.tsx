'use client'
import { useEffect, useRef, useState } from 'react'

export interface MonthlyPoint { month: string; amount: number }

interface Props {
  activeJobs: number
  jobsValue: number
  mrr: number
  unpaidTotal: number
  paidThisMonth: number
  monthlyRevenue: MonthlyPoint[]
}

const fmtFt = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M Ft` : n >= 1000 ? `${Math.round(n / 1000)}k Ft` : `${n} Ft`

const CSS = `
  @keyframes bw-in  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
  @keyframes bw-sk  { to{stroke-dashoffset:0} }
  @keyframes bw-dot { from{opacity:0;transform:scale(0)} to{opacity:1;transform:scale(1)} }

  .bw-w { display:flex; flex-direction:column; gap:10px; animation:bw-in .35s ease forwards }

  .bw-stats { display:grid; grid-template-columns:1fr 1fr; gap:1px; background:var(--theme-elevation-150); border-radius:12px; overflow:hidden; border:1px solid var(--theme-elevation-150) }
  .bw-stat  { background:var(--theme-elevation-50); padding:12px 14px; transition:background 120ms; cursor:default }
  .bw-stat:hover { background:var(--theme-elevation-100) }
  .bw-stat-label { font-size:9.5px; font-weight:600; text-transform:uppercase; letter-spacing:.06em; color:var(--theme-elevation-500); margin-bottom:5px; font-family:ui-monospace,monospace }
  .bw-stat-val   { font-size:1.6rem; font-weight:700; letter-spacing:-0.04em; font-family:ui-monospace,monospace; line-height:1 }
  .bw-stat-sub   { margin-top:4px; font-size:.7rem; color:var(--theme-elevation-400); font-family:ui-monospace,monospace }

  .bw-chart-wrap { background:var(--theme-elevation-50); border:1px solid var(--theme-elevation-150); border-radius:12px; overflow:hidden }
  .bw-chart-head { display:flex; align-items:center; justify-content:space-between; padding:12px 16px 0; }
  .bw-chart-title { font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:.06em; color:var(--theme-elevation-500); font-family:ui-monospace,monospace }

  .bw-tooltip { position:absolute; top:-32px; transform:translateX(-50%); background:var(--theme-elevation-100); border:1px solid var(--theme-elevation-200); border-radius:6px; padding:3px 8px; font-size:11px; font-family:ui-monospace,monospace; color:var(--theme-text); white-space:nowrap; pointer-events:none; z-index:10 }
`

const GREEN = 'var(--bw-green, #3dffa0)'
const PURPLE = 'var(--bw-purple, #7c6af7)'

const HU_MONTHS = ['Jan', 'Feb', 'Már', 'Ápr', 'Máj', 'Jún', 'Júl', 'Aug', 'Szep', 'Okt', 'Nov', 'Dec']

function LineChart({ data }: { data: MonthlyPoint[] }) {
  const [drawn, setDrawn] = useState(false)
  const [hover, setHover] = useState<number | null>(null)
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setTimeout(() => setDrawn(true), 200) } }, { threshold: 0.2 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  if (data.length < 2) {
    return (
      <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--theme-elevation-400)', fontSize: 13 }}>
        Még nincs elegendő adat a diagram megjelenítéséhez.
      </div>
    )
  }

  const W = 400, H = 90, PAD = { t: 16, b: 28, l: 8, r: 8 }
  const IW = W - PAD.l - PAD.r
  const IH = H - PAD.t - PAD.b
  const maxVal = Math.max(...data.map(d => d.amount), 1)

  const pts = data.map((d, i) => ({
    x: PAD.l + (i / (data.length - 1)) * IW,
    y: PAD.t + IH - (d.amount / maxVal) * IH,
    ...d,
  }))

  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  const areaPath = linePath + ` L${pts[pts.length - 1].x},${PAD.t + IH} L${pts[0].x},${PAD.t + IH} Z`
  const totalLen = 600

  return (
    <div style={{ position: 'relative', padding: '0 16px 8px' }}>
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', overflow: 'visible' }}>
        <defs>
          <linearGradient id="bw-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={GREEN} stopOpacity="0.18" />
            <stop offset="100%" stopColor={GREEN} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.5, 1].map(v => (
          <line key={v}
            x1={PAD.l} y1={PAD.t + IH * (1 - v)}
            x2={W - PAD.r} y2={PAD.t + IH * (1 - v)}
            stroke="var(--theme-elevation-150)" strokeWidth="0.5"
          />
        ))}

        {/* Area fill */}
        <path d={areaPath} fill="url(#bw-area)"
          opacity={drawn ? 1 : 0} style={{ transition: 'opacity 0.5s ease 0.8s' }}
        />

        {/* Line */}
        <path d={linePath} fill="none" stroke={GREEN} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"
          strokeDasharray={totalLen} strokeDashoffset={drawn ? 0 : totalLen}
          style={{ transition: 'stroke-dashoffset 1s ease 0.3s' }}
        />

        {/* Hover dots */}
        {pts.map((p, i) => (
          <g key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
            <circle cx={p.x} cy={p.y} r={8} fill="transparent" />
            {hover === i && (
              <>
                <circle cx={p.x} cy={p.y} r={3} fill={GREEN}
                  style={{ animation: 'bw-dot .15s ease forwards' }} />
                <foreignObject x={p.x - 40} y={p.y - 38} width={80} height={28}>
                  <div className="bw-tooltip">{fmtFt(p.amount)}</div>
                </foreignObject>
              </>
            )}
          </g>
        ))}

        {/* Month labels */}
        {pts.map((p, i) => (
          <text key={i} x={p.x} y={H - 4} textAnchor="middle"
            fill="var(--theme-elevation-400)" fontSize="8" fontFamily="ui-monospace,monospace">
            {HU_MONTHS[new Date(p.month + '-01').getMonth()]}
          </text>
        ))}
      </svg>
    </div>
  )
}

export function BusinessWidget({ activeJobs, jobsValue, mrr, unpaidTotal, paidThisMonth, monthlyRevenue }: Props) {
  const prevMonthAmt = monthlyRevenue.length >= 2 ? monthlyRevenue[monthlyRevenue.length - 2].amount : 0
  const revDelta = prevMonthAmt > 0
    ? Math.round(((paidThisMonth - prevMonthAmt) / prevMonthAmt) * 100)
    : null

  return (
    <>
      <style>{CSS}</style>
      <div className="bw-w">

        {/* Line chart — first */}
        <div className="bw-chart-wrap">
          <div className="bw-chart-head">
            <span className="bw-chart-title">Havi bevétel</span>
            <span style={{ fontSize: 10, color: 'var(--theme-elevation-400)', fontFamily: 'ui-monospace,monospace' }}>
              elmúlt {monthlyRevenue.length} hónap
            </span>
          </div>
          <LineChart data={monthlyRevenue} />
        </div>

        {/* Stats 2×2 */}
        <div className="bw-stats">
          <div className="bw-stat">
            <div className="bw-stat-label">Aktív megbízások</div>
            <div className="bw-stat-val" style={{ color: PURPLE }}>{activeJobs}</div>
            <div className="bw-stat-sub">{fmtFt(jobsValue)} összértékben</div>
          </div>
          <div className="bw-stat">
            <div className="bw-stat-label">Havi ismétlődő (MRR)</div>
            <div className="bw-stat-val" style={{ color: GREEN }}>{fmtFt(mrr)}</div>
            <div className="bw-stat-sub">aktív havidíjakból</div>
          </div>
          <div className="bw-stat">
            <div className="bw-stat-label">Ez havi bevétel</div>
            <div className="bw-stat-val" style={{ color: 'var(--bw-blue, #60a5fa)' }}>{fmtFt(paidThisMonth)}</div>
            <div className="bw-stat-sub">
              {revDelta !== null
                ? <span style={{ color: revDelta >= 0 ? 'var(--bw-success, #22c55e)' : 'var(--bw-danger, #ef4444)' }}>{revDelta >= 0 ? '↑' : '↓'} {Math.abs(revDelta)}% előző hónaphoz</span>
                : 'fizetve státuszú számlák'}
            </div>
          </div>
          <div className="bw-stat">
            <div className="bw-stat-label">Kifizetetlen</div>
            <div className="bw-stat-val" style={{ color: unpaidTotal > 0 ? 'var(--bw-yellow, #f0c742)' : 'var(--theme-elevation-400)', display: 'flex', alignItems: 'center', gap: 6 }}>
              {fmtFt(unpaidTotal)}
              {unpaidTotal > 0 && (
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#f0c742', boxShadow: '0 0 6px #f0c742', display: 'inline-block', flexShrink: 0, marginBottom: 2 }} />
              )}
            </div>
            <div className="bw-stat-sub">nyitott számlák</div>
          </div>
        </div>

      </div>
    </>
  )
}
