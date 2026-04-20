'use client'
import { useEffect, useRef, useState } from 'react'

const HEADLINE_FROM = 'Tervezés, fejlesztés, vevőszerzés.'
const HEADLINE_TO   = 'Web · Márka · Stratégia.'
const CTA_FROM      = 'Kapcsolatfelvétel →'
const CTA_TO        = 'Kezdjük el →'

// ── custom.scss dark theme tokens ─────────────────────────────
const BG       = '#0a0a0a'
const SURFACE  = '#111111'
const SURFACE2 = '#171717'
const BORDER   = 'rgba(255,255,255,0.06)'
const BORDER_H = 'rgba(255,255,255,0.11)'
const TEXT     = '#ededed'
const TEXT_SEC = '#999'
const MUTED    = '#666'
const HOVER2   = 'rgba(255,255,255,0.055)'

// ── Admin brand colors (from actual ContentSummary / MarketingWidget) ─
const GREEN_A  = '#3dffa0'   // Cikk, Kattintás
const PURPLE_A = '#7c6af7'   // Projekt, Megjelenés
const YELLOW_A = '#f0c742'   // Oldal, CTR
const BLUE_A   = '#60a5fa'   // Média
const GREEN    = '#22c55e'   // success / save

// ── Content summary data ──────────────────────────────────────
const C_ITEMS = [
  { label: 'Cikk',    v0: '12', v1: '13', color: GREEN_A  },
  { label: 'Projekt', v0: '8',  v1: '8',  color: PURPLE_A },
  { label: 'Oldal',   v0: '5',  v1: '6',  color: YELLOW_A },
  { label: 'Média',   v0: '84', v1: '87', color: BLUE_A   },
]

// ── Marketing (GSC-style) stats ───────────────────────────────
const M_STATS = [
  { label: 'Kattintás (31n)',   v0: '1.4k',  v1: '1.6k',  color: GREEN_A  },
  { label: 'Megjelenés (31n)',  v0: '18.2k', v1: '19.1k', color: PURPLE_A },
  { label: 'Átl. CTR',          v0: '7.8%',  v1: '8.1%',  color: YELLOW_A },
  { label: 'Átl. pozíció',      v0: '#3.2',  v1: '#3.1',  color: TEXT     },
]

// ── Area chart pre-computed ───────────────────────────────────
const BARS = [31, 58, 44, 71, 63, 49, 88]
const DAYS = ['H','K','Sz','Cs','P','Sz','V']
const AW = 100, AH = 40
const maxBar = Math.max(...BARS)
const mainPts  = BARS.map((v,i) => [(i/(BARS.length-1))*AW, AH-(v/maxBar)*(AH*0.82)-2] as [number,number])
const mainLine = mainPts.map((p,i) => `${i===0?'M':'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')
const mainArea = mainLine + ` L${AW},${AH} L0,${AH} Z`
// "clicks" line — slightly compressed vertically (appears above the main line)
const clickPts  = BARS.map((v,i) => [(i/(BARS.length-1))*AW, (AH-(v/maxBar)*(AH*0.82)-2)*0.82+3] as [number,number])
const clickLine = clickPts.map((p,i) => `${i===0?'M':'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')
const clickArea = clickLine + ` L${AW},${AH} L0,${AH} Z`

// ── Nav structure (matches actual Nav.tsx) ────────────────────
type NavItem = { label: string; active: 'dash' | 'edit' | 'never'; d: string }
type NavSection = { type: 'group'; group?: string; items: NavItem[] } | { type: 'divider' }

const NAV_SECTIONS: NavSection[] = [
  { type: 'group', items: [
    { label: 'Dashboard',    active: 'dash',  d: 'M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3zm11 0h7v7h-7z' },
  ]},
  { type: 'group', group: 'Analytics', items: [
    { label: 'Marketing',    active: 'never', d: 'M22 7 13.5 15.5 8.5 10.5 2 17M16 7h6v6' },
    { label: 'Kommunikáció', active: 'never', d: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6' },
  ]},
  { type: 'divider' },
  { type: 'group', group: 'Tartalom', items: [
    { label: 'Cikkek',       active: 'never', d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8' },
    { label: 'Projektek',    active: 'never', d: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
    { label: 'Oldalak',      active: 'edit',  d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6' },
    { label: 'Média',        active: 'never', d: 'M4 3h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM21 15l-5-5L5 21' },
  ]},
]

type Scene = 'dashboard' | 'editor'
type Phase = 'dash-idle'|'dash-live'|'dash-click'|'edit-idle'|'edit-typing-h'|'edit-saving-h'|'edit-pause'|'edit-typing-c'|'edit-saving-c'|'edit-done'

// ── Mini icon ─────────────────────────────────────────────────
function Ico({ d, sz = 10, color = TEXT_SEC, opacity = 0.5 }: { d: string; sz?: number; color?: string; opacity?: number }) {
  return (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75"
      strokeLinecap="round" strokeLinejoin="round" style={{ opacity, flexShrink: 0 }}>
      {d.split('M').filter(Boolean).map((seg, i) => <path key={i} d={'M' + seg} />)}
    </svg>
  )
}

// ── Left nav sidebar ─────────────────────────────────────────
// activeKey: 'dash' = Dashboard active, 'edit' = Oldalak active
function NavSidebar({ activeKey }: { activeKey: 'dash' | 'edit' }) {
  return (
    <div style={{ width: '92px', height: '100%', background: BG, borderRight: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', flexShrink: 0, overflow: 'hidden' }}>
      {/* Search button — matches Nav.tsx */}
      <div style={{ padding: '9px 6px 6px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 7px', borderRadius: '5px', border: `1px solid ${BORDER}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <span style={{ color: MUTED, fontSize: '5px' }}>Keresés</span>
          </div>
          <div style={{ display: 'flex', gap: '1px' }}>
            {['⌘','F'].map(k => (
              <span key={k} style={{ display: 'inline-flex', alignItems: 'center', padding: '0 2px', borderRadius: '2px', border: `1px solid ${BORDER_H}`, background: SURFACE2, fontSize: '4px', fontFamily: 'ui-monospace,monospace', color: MUTED, lineHeight: '1.5' }}>{k}</span>
            ))}
          </div>
        </div>
      </div>
      {/* Nav items */}
      <div style={{ flex: 1, overflow: 'hidden', padding: '0 4px 8px' }}>
        {NAV_SECTIONS.map((section, si) => {
          if (section.type === 'divider') {
            return <div key={si} style={{ height: '1px', background: BORDER, margin: '4px 6px' }} />
          }
          return (
            <div key={si}>
              {section.group && (
                <div style={{ fontSize: '3.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: MUTED, padding: '6px 8px 3px', fontFamily: 'ui-monospace,monospace' }}>
                  {section.group}
                </div>
              )}
              {section.items.map(item => {
                const isActive = item.active === activeKey
                return (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '3.5px 7px', borderRadius: '4px', background: isActive ? HOVER2 : 'transparent', marginBottom: '1px', transition: 'background 100ms' }}>
                    <Ico d={item.d} sz={9} color={isActive ? TEXT : TEXT_SEC} opacity={isActive ? 1 : 0.45} />
                    <span style={{ color: isActive ? TEXT : TEXT_SEC, fontSize: '5.5px', fontWeight: isActive ? 600 : 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.3 }}>
                      {item.label}
                    </span>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function LiveEditDemo({ mobile = false }: { mobile?: boolean }) {
  const rootRef  = useRef<HTMLDivElement>(null)
  const [ready,   setReady]   = useState(false)
  const [scene,   setScene]   = useState<Scene>('dashboard')
  const [phase,   setPhase]   = useState<Phase>('dash-idle')
  const [flash,   setFlash]   = useState(false)
  const [cVals,   setCVals]   = useState(C_ITEMS.map(x => x.v0))
  const [mVals,   setMVals]   = useState(M_STATS.map(x => x.v0))
  const [charts,  setCharts]  = useState(false)
  const [field,   setField]   = useState<'headline'|'cta'>('headline')
  const [inputH,  setInputH]  = useState(HEADLINE_FROM)
  const [inputC,  setInputC]  = useState(CTA_FROM)
  const [saveFx,  setSaveFx]  = useState(false)
  const [wsH,     setWsH]     = useState(HEADLINE_FROM)
  const [wsC,     setWsC]     = useState(CTA_FROM)
  const [wsFade,  setWsFade]  = useState(false)

  useEffect(() => {
    const el = rootRef.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { obs.disconnect(); setTimeout(() => setReady(true), 700) }
    }, { threshold: 0.05 })
    obs.observe(el); return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!ready) return
    let ok = true
    const ids: ReturnType<typeof setTimeout>[] = []
    const t  = (fn: () => void, ms: number) => { const id = setTimeout(() => { if (ok) fn() }, ms); ids.push(id) }
    const typ = (target: string, set: (s: string) => void, done: () => void) => {
      let i = 0; const s = () => { i++; set(target.slice(0,i)); i < target.length ? t(s, 44) : t(done, 0) }; t(s, 44)
    }
    const save = (done: () => void) => { setSaveFx(true); t(() => { setSaveFx(false); done() }, 540) }
    const swap = (set: () => void, done: () => void) => {
      setWsFade(true); t(() => { set(); t(() => { setWsFade(false); t(done, 260) }, 50) }, 230)
    }
    const cut  = (fn: () => void, done: () => void) => {
      setFlash(true); t(() => { fn(); t(() => { setFlash(false); t(done, 140) }, 55) }, 110)
    }

    function run() {
      setScene('dashboard'); setPhase('dash-idle')
      setCVals(C_ITEMS.map(x => x.v0)); setMVals(M_STATS.map(x => x.v0))
      setCharts(false); setWsH(HEADLINE_FROM); setWsC(CTA_FROM); setWsFade(false)
      setInputH(HEADLINE_FROM); setInputC(CTA_FROM); setSaveFx(false); setField('headline'); setFlash(false)

      t(() => { setPhase('dash-live'); setCharts(true) },                          600)
      t(() => { setCVals(['13','8','5','85']); setMVals(['1.5k','18.7k','7.9%','#3.2']) }, 1200)
      t(() => { setCVals(C_ITEMS.map(x=>x.v1)); setMVals(M_STATS.map(x=>x.v1)) }, 2400)

      // "user clicks" Oldalak in the nav after a long visible pause
      t(() => setPhase('dash-click'),                                               5500)

      // flash cut → editor
      t(() => cut(
        () => { setScene('editor'); setPhase('edit-idle') },
        () => t(() => {
          setPhase('edit-typing-h'); setField('headline'); setInputH('')
          typ(HEADLINE_TO, setInputH, () => {
            setPhase('edit-saving-h')
            save(() => swap(() => setWsH(HEADLINE_TO), () => {
              setPhase('edit-pause')
              t(() => {
                setPhase('edit-typing-c'); setField('cta'); setInputC('')
                typ(CTA_TO, setInputC, () => {
                  setPhase('edit-saving-c')
                  save(() => swap(() => setWsC(CTA_TO), () => {
                    setPhase('edit-done')
                    t(() => cut(() => { setScene('dashboard'); setPhase('dash-idle') }, run), 1800)
                  }))
                })
              }, 900)
            }))
          })
        }, 500)
      ), 6400)
    }

    run()
    return () => { ok = false; ids.forEach(clearTimeout) }
  }, [ready])

  const isDash = scene === 'dashboard'
  const sz = (d: string|number, m: string|number) => mobile ? m : d

  const flashEl = (
    <div style={{ position: 'absolute', inset: 0, zIndex: 50, background: BG, pointerEvents: 'none', opacity: flash ? 1 : 0, transition: 'opacity 0.1s' }} />
  )

  // ── Website preview (aurora hero) ─────────────────────────────
  const wsEl = (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#04040a', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '-15%', left: '-10%', width: '55%', height: '70%', borderRadius: '50%', background: 'radial-gradient(circle,rgba(59,130,246,0.22) 0%,transparent 70%)', filter: 'blur(18px)', zIndex: 0, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '20%', right: '-15%', width: '50%', height: '65%', borderRadius: '50%', background: 'radial-gradient(circle,rgba(139,92,246,0.18) 0%,transparent 70%)', filter: 'blur(20px)', zIndex: 0, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-10%', left: '30%', width: '45%', height: '50%', borderRadius: '50%', background: 'radial-gradient(circle,rgba(6,182,212,0.1) 0%,transparent 70%)', filter: 'blur(16px)', zIndex: 0, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 100% 100% at 50% 50%,transparent 40%,rgba(4,4,10,0.6) 100%)', zIndex: 0, pointerEvents: 'none' }} />
      {/* nav */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: sz('6px 14px','8px 16px'), borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
        <span style={{ color: '#fff', fontWeight: 700, letterSpacing: '-0.02em', fontSize: sz('7px','10px') }}>[davelopment]®</span>
        <div style={{ display: 'flex', gap: sz('9px','13px') }}>
          {['Blog','Munkák','Árak'].map(l => <span key={l} style={{ color: 'rgba(255,255,255,0.3)', fontSize: sz('5.5px','7px') }}>{l}</span>)}
        </div>
      </div>
      {/* hero */}
      <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: sz('0 14px','0 18px'), gap: sz('7px','10px'), overflow: 'hidden', minHeight: 0 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: sz('2px 8px','3px 10px'), borderRadius: '999px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', flexShrink: 0 }}>
          <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: GREEN, boxShadow: `0 0 5px ${GREEN}` }} />
          <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: sz('5px','6.5px'), letterSpacing: '0.05em', textTransform: 'uppercase' }}>Budapest · Web studio</span>
        </div>
        <div style={{ overflow: 'hidden', maxWidth: '100%', opacity: wsFade ? 0 : 1, transition: 'opacity 0.22s ease' }}>
          <span style={{ display: 'block', fontWeight: 800, lineHeight: 1.15, fontSize: sz('10px','14px'), letterSpacing: '-0.025em', background: 'linear-gradient(180deg,#fff 50%,rgba(255,255,255,0.45))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            {wsH}
          </span>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', flexShrink: 0, padding: sz('3px 11px','4px 16px'), borderRadius: '999px', background: '#fff', opacity: wsFade ? 0 : 1, transition: 'opacity 0.22s ease' }}>
          <span style={{ color: '#000', fontWeight: 700, whiteSpace: 'nowrap', fontSize: sz('6.5px','8.5px') }}>{wsC}</span>
          <div style={{ width: sz('4px','5px'), height: sz('4px','5px'), borderRadius: '50%', background: '#000', flexShrink: 0 }} />
        </div>
        <div style={{ display: 'flex', gap: sz('12px','18px'), flexShrink: 0 }}>
          {[{v:'40+',l:'projekt'},{v:'98%',l:'elégedett'},{v:'5★',l:'értékelés'}].map(item => (
            <div key={item.l} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 700, fontSize: sz('7px','9px') }}>{item.v}</span>
              <span style={{ color: 'rgba(255,255,255,0.22)', fontSize: sz('4.5px','6px') }}>{item.l}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // ── Dashboard main content ─────────────────────────────────────
  // Matches BeforeDashboard → ContentSummary + MarketingWidget layout
  const dashContentEl = (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
      {/* Page header — breadcrumb + bell + avatar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px 7px', flexShrink: 0, borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ color: TEXT, fontWeight: 700, fontSize: '7px', letterSpacing: '-0.01em' }}>[davelopment]®</span>
          <span style={{ color: MUTED, fontSize: '5.5px' }}>/</span>
          <span style={{ color: TEXT_SEC, fontSize: '5.5px' }}>Dashboard</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
          {/* Bell icon with red dot — matches NotificationBell */}
          <div style={{ width: '16px', height: '16px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', flexShrink: 0 }}>
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={TEXT_SEC} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span style={{ position: 'absolute', top: '2px', right: '2px', width: '4px', height: '4px', borderRadius: '50%', background: '#ef4444', border: `1px solid ${BG}` }} />
          </div>
          {/* Avatar */}
          <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: SURFACE2, border: `1px solid ${BORDER_H}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ color: TEXT, fontWeight: 700, fontSize: '5px' }}>D</span>
          </div>
        </div>
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflow: 'hidden', padding: '9px 12px', display: 'flex', flexDirection: 'column', gap: '7px', minHeight: 0 }}>

        {/* ── Tartalom section ── */}
        <div style={{ flexShrink: 0 }}>
          {/* Section label (matches BeforeDashboard h2 style, scaled down) */}
          <div style={{ marginBottom: '5px' }}>
            <span style={{ fontSize: '8px', fontWeight: 500, color: TEXT, letterSpacing: '-0.01em' }}>Tartalom</span>
          </div>
          {/* ContentSummary: 4-col grid — stagger fade+slide (matches motion.a variants in ContentSummary.tsx) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '4px' }}>
            {C_ITEMS.map((item, i) => (
              <div key={item.label} style={{ display: 'flex', flexDirection: 'column', gap: '2px', background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: '6px', padding: '6px 8px', opacity: charts ? 1 : 0, transform: charts ? 'none' : 'translateY(6px)', transition: `opacity 0.3s ease ${0.07*i}s, transform 0.3s ease ${0.07*i}s` }}>
                <span style={{ fontSize: '3.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: TEXT_SEC, fontFamily: 'ui-monospace,monospace' }}>{item.label}</span>
                <span style={{ fontSize: '14px', fontWeight: 700, lineHeight: 1, color: item.color, fontFamily: 'ui-monospace,monospace', transition: 'all 0.35s ease' }}>{cVals[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Divider (matches BeforeDashboard Divider) */}
        <div style={{ height: '1px', background: BORDER, flexShrink: 0 }} />

        {/* ── Marketing & SEO section ── */}
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '5px', overflow: 'hidden' }}>
          <div style={{ flexShrink: 0 }}>
            <span style={{ fontSize: '8px', fontWeight: 500, color: TEXT, letterSpacing: '-0.01em' }}>Marketing & SEO</span>
          </div>

          {/* mw-stats: 2×2 grid — stagger slide (matches MarketingWidget stagger) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: BORDER, borderRadius: '8px', overflow: 'hidden', border: `1px solid ${BORDER}`, flexShrink: 0 }}>
            {M_STATS.map((st, i) => (
              <div key={st.label} style={{ background: SURFACE, padding: '6px 8px', opacity: charts ? 1 : 0, transform: charts ? 'none' : 'translateY(5px)', transition: `opacity 0.28s ease ${0.08*(i+4)}s, transform 0.28s ease ${0.08*(i+4)}s` }}>
                <div style={{ fontSize: '3.8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: TEXT_SEC, marginBottom: '3px', fontFamily: 'ui-monospace,monospace' }}>{st.label}</div>
                <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '-0.03em', fontFamily: 'ui-monospace,monospace', lineHeight: 1, color: st.color, transition: 'all 0.35s ease' }}>{mVals[i]}</div>
              </div>
            ))}
          </div>

          {/* Dual area chart (matches MiniDualChart style: green=clicks, purple=impressions) */}
          <div style={{ flex: 1, minHeight: 0, background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {/* Legend */}
            <div style={{ padding: '4px 7px 2px', display: 'flex', gap: '9px', flexShrink: 0 }}>
              {[{ label: 'Kattintás', color: GREEN_A }, { label: 'Megjelenés', color: PURPLE_A }].map(l => (
                <span key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '4px', fontFamily: 'ui-monospace,monospace', color: TEXT_SEC }}>
                  <span style={{ width: '8px', height: '1.5px', background: l.color, borderRadius: '99px', display: 'inline-block' }} />
                  {l.label}
                </span>
              ))}
            </div>
            {/* SVG */}
            <svg width="100%" height="100%" viewBox={`0 0 ${AW} ${AH}`} preserveAspectRatio="none" style={{ flex: 1, display: 'block', minHeight: 0 }}>
              <defs>
                <linearGradient id="lgC" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={GREEN_A}  stopOpacity="0.16"/><stop offset="100%" stopColor={GREEN_A}  stopOpacity="0"/>
                </linearGradient>
                <linearGradient id="lgI" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={PURPLE_A} stopOpacity="0.13"/><stop offset="100%" stopColor={PURPLE_A} stopOpacity="0"/>
                </linearGradient>
              </defs>
              {[0.25, 0.5, 0.75].map(y => <line key={y} x1="0" y1={AH*y} x2={AW} y2={AH*y} stroke={BORDER} strokeWidth="0.5"/>)}
              {/* Impressions (purple, behind) — fill fades, line draws left→right */}
              <path d={mainArea}  fill="url(#lgI)" style={{ opacity: charts ? 1 : 0, transition: 'opacity 0.9s ease 0.5s' }}/>
              <path d={mainLine}  fill="none" stroke={PURPLE_A} strokeWidth="0.5" strokeLinejoin="round"
                strokeDasharray="500" strokeDashoffset={charts ? 0 : 500}
                style={{ transition: 'stroke-dashoffset 0.9s ease 0.5s' }}/>
              {/* Clicks (green, in front) — draws slightly earlier */}
              <path d={clickArea} fill="url(#lgC)" style={{ opacity: charts ? 1 : 0, transition: 'opacity 0.9s ease 0.3s' }}/>
              <path d={clickLine} fill="none" stroke={GREEN_A} strokeWidth="0.6" strokeLinejoin="round"
                strokeDasharray="500" strokeDashoffset={charts ? 0 : 500}
                style={{ transition: 'stroke-dashoffset 0.9s ease 0.3s' }}/>
            </svg>
            {/* X axis */}
            <div style={{ display: 'flex', padding: '1px 4px 3px', flexShrink: 0 }}>
              {DAYS.map((d,i) => <span key={i} style={{ flex: 1, textAlign: 'center', color: MUTED, fontSize: '3px', fontFamily: 'ui-monospace,monospace' }}>{d}</span>)}
            </div>
          </div>
        </div>

      </div>
    </div>
  )

  // ── Editor fields (right of sidebar) ─────────────────────────
  const editorFieldsEl = (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px 7px', flexShrink: 0, borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ color: TEXT, fontWeight: 700, fontSize: '7px', letterSpacing: '-0.01em' }}>[davelopment]®</span>
          <span style={{ color: MUTED, fontSize: '5.5px' }}>/</span>
          <span style={{ color: TEXT_SEC, fontSize: '5.5px' }}>Oldalak</span>
          <span style={{ color: MUTED, fontSize: '5.5px' }}>/</span>
          <span style={{ color: TEXT_SEC, fontWeight: 500, fontSize: '5.5px' }}>Főoldal</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
          <div style={{ width: '16px', height: '16px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', flexShrink: 0 }}>
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={TEXT_SEC} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span style={{ position: 'absolute', top: '2px', right: '2px', width: '4px', height: '4px', borderRadius: '50%', background: '#ef4444', border: `1px solid ${BG}` }} />
          </div>
          <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: SURFACE2, border: `1px solid ${BORDER_H}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ color: TEXT, fontWeight: 700, fontSize: '5px' }}>D</span>
          </div>
        </div>
      </div>
      {/* Fields */}
      <div style={{ flex: 1, overflow: 'hidden', padding: '9px 12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {(['headline','cta'] as const).map(f => {
          const isH = f === 'headline', act = field === f, val = isH ? inputH : inputC
          const typing = isH ? phase === 'edit-typing-h' : phase === 'edit-typing-c'
          return (
            <div key={f} style={{ marginBottom: isH ? '2px' : '0' }}>
              <div style={{ fontSize: '4.5px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginBottom: '3px', color: act ? TEXT_SEC : MUTED, fontFamily: 'ui-monospace,monospace', transition: 'color 0.2s' }}>
                {isH ? 'Hero cím' : 'CTA felirat'}
              </div>
              <div style={{ padding: '5px 8px', borderRadius: '5px', background: SURFACE, border: `1px solid ${act ? BORDER_H : BORDER}`, boxShadow: act ? `0 0 0 2px rgba(255,255,255,0.04)` : 'none', minHeight: isH ? '22px' : undefined, transition: 'all 0.2s' }}>
                <span className={isH ? 'break-words' : ''} style={{ color: TEXT, fontSize: sz('7px','7.5px'), lineHeight: 1.35 }}>
                  {val}{typing && <span style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '1px', width: '1px', height: '9px', background: TEXT, opacity: 0.7 }} />}
                </span>
              </div>
            </div>
          )
        })}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto', paddingTop: '6px', flexShrink: 0 }}>
          <div style={{ padding: '2.5px 10px', borderRadius: '5px', fontSize: '6.5px', fontWeight: 600, background: saveFx ? GREEN : SURFACE2, color: saveFx ? '#000' : TEXT_SEC, border: `1px solid ${saveFx ? GREEN : BORDER}`, boxShadow: saveFx ? `0 0 8px ${GREEN}44` : 'none', transform: saveFx ? 'scale(0.97)' : 'scale(1)', transition: 'all 0.15s' }}>
            {saveFx ? 'Mentve ✓' : 'Mentés'}
          </div>
        </div>
      </div>
    </div>
  )

  // ── Mobile nav drawer (slides in when dash-click phase) ───────
  const navDrawerOpen = isDash && phase === 'dash-click'
  const mobileNavDrawer = (
    <>
      {/* dimmer */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 8, background: 'rgba(0,0,0,0.45)', opacity: navDrawerOpen ? 1 : 0, transition: 'opacity 0.22s ease', pointerEvents: 'none' }} />
      {/* drawer panel */}
      <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '82%', zIndex: 9, background: BG, borderRight: `1px solid ${BORDER_H}`, display: 'flex', flexDirection: 'column', transform: navDrawerOpen ? 'translateX(0)' : 'translateX(-100%)', transition: 'transform 0.25s cubic-bezier(0.33,1,0.68,1)' }}>
        {/* drawer header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px 6px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
          <span style={{ color: TEXT, fontWeight: 700, fontSize: '8px', letterSpacing: '-0.01em' }}>[davelopment]®</span>
          <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: SURFACE2, border: `1px solid ${BORDER_H}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: TEXT, fontWeight: 700, fontSize: '4.5px' }}>D</span>
          </div>
        </div>
        {/* nav items — same as NavSidebar but full labels for mobile */}
        <div style={{ flex: 1, overflow: 'hidden', padding: '4px 6px 8px' }}>
          {NAV_SECTIONS.map((section, si) => {
            if (section.type === 'divider') return <div key={si} style={{ height: '1px', background: BORDER, margin: '3px 4px' }} />
            return (
              <div key={si}>
                {section.group && (
                  <div style={{ fontSize: '4px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: MUTED, padding: '5px 6px 2px', fontFamily: 'ui-monospace,monospace' }}>{section.group}</div>
                )}
                {section.items.map(item => {
                  const isActive = item.active === 'edit'
                  return (
                    <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 8px', borderRadius: '5px', background: isActive ? HOVER2 : 'transparent', marginBottom: '1px' }}>
                      <Ico d={item.d} sz={10} color={isActive ? TEXT : TEXT_SEC} opacity={isActive ? 1 : 0.45} />
                      <span style={{ color: isActive ? TEXT : TEXT_SEC, fontSize: '6.5px', fontWeight: isActive ? 600 : 400 }}>{item.label}</span>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </>
  )

  // ── Mobile dashboard ──────────────────────────────────────────
  // Same structure as desktop: Tartalom section + divider + Marketing section
  const mobileDashEl = (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: BG, overflow: 'hidden', position: 'relative' }}>
      {/* header — matches desktop header exactly */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 11px 6px', flexShrink: 0, borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {/* hamburger / grid nav trigger */}
          <div style={{ width: '14px', height: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2.5px', marginRight: '3px' }}>
            {[0,1,2].map(i => <div key={i} style={{ width: '10px', height: '1px', background: TEXT_SEC, borderRadius: '1px', opacity: 0.5 }} />)}
          </div>
          <span style={{ color: TEXT, fontWeight: 700, fontSize: '7.5px', letterSpacing: '-0.01em' }}>[davelopment]®</span>
          <span style={{ color: MUTED, fontSize: '5px' }}>/</span>
          <span style={{ color: TEXT_SEC, fontSize: '5px' }}>Dashboard</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
          <div style={{ width: '14px', height: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={TEXT_SEC} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span style={{ position: 'absolute', top: '1px', right: '1px', width: '3.5px', height: '3.5px', borderRadius: '50%', background: '#ef4444', border: `1px solid ${BG}` }} />
          </div>
          <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: SURFACE2, border: `1px solid ${BORDER_H}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: TEXT, fontWeight: 700, fontSize: '4.5px' }}>D</span>
          </div>
        </div>
      </div>

      {/* scrollable body */}
      <div style={{ flex: 1, overflow: 'hidden', padding: '7px 11px', display: 'flex', flexDirection: 'column', gap: '6px', minHeight: 0 }}>

        {/* Tartalom section */}
        <div style={{ flexShrink: 0 }}>
          <span style={{ fontSize: '7.5px', fontWeight: 500, color: TEXT, display: 'block', marginBottom: '4px' }}>Tartalom</span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '3px' }}>
            {C_ITEMS.map((item, i) => (
              <div key={item.label} style={{ display: 'flex', flexDirection: 'column', gap: '2px', background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: '5px', padding: '5px 6px', opacity: charts ? 1 : 0, transform: charts ? 'none' : 'translateY(5px)', transition: `opacity 0.3s ease ${0.07*i}s, transform 0.3s ease ${0.07*i}s` }}>
                <span style={{ fontSize: '3px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: TEXT_SEC, fontFamily: 'ui-monospace,monospace' }}>{item.label}</span>
                <span style={{ fontSize: '12px', fontWeight: 700, lineHeight: 1, color: item.color, fontFamily: 'ui-monospace,monospace', transition: 'all 0.35s' }}>{cVals[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: BORDER, flexShrink: 0 }} />

        {/* Marketing & SEO section */}
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '5px', overflow: 'hidden' }}>
          <span style={{ fontSize: '7.5px', fontWeight: 500, color: TEXT, flexShrink: 0 }}>Marketing & SEO</span>

          {/* 2×2 stats grid — stagger animation */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: BORDER, borderRadius: '7px', overflow: 'hidden', border: `1px solid ${BORDER}`, flexShrink: 0 }}>
            {M_STATS.map((st, i) => (
              <div key={st.label} style={{ background: SURFACE, padding: '5px 7px', opacity: charts ? 1 : 0, transform: charts ? 'none' : 'translateY(5px)', transition: `opacity 0.28s ease ${0.08*(i+4)}s, transform 0.28s ease ${0.08*(i+4)}s` }}>
                <div style={{ fontSize: '3.5px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: TEXT_SEC, marginBottom: '2px', fontFamily: 'ui-monospace,monospace' }}>{st.label}</div>
                <div style={{ fontSize: '10px', fontWeight: 700, fontFamily: 'ui-monospace,monospace', color: st.color, lineHeight: 1, transition: 'all 0.35s' }}>{mVals[i]}</div>
              </div>
            ))}
          </div>

          {/* chart — strokeDashoffset draw animation (same as desktop) */}
          <div style={{ flex: 1, minHeight: 0, background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: '7px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '3px 6px 2px', display: 'flex', gap: '8px', flexShrink: 0 }}>
              {[{ label: 'Kattintás', color: GREEN_A }, { label: 'Megjelenés', color: PURPLE_A }].map(l => (
                <span key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '3.5px', fontFamily: 'ui-monospace,monospace', color: TEXT_SEC }}>
                  <span style={{ width: '7px', height: '1.5px', background: l.color, borderRadius: '99px', display: 'inline-block' }} />
                  {l.label}
                </span>
              ))}
            </div>
            <svg width="100%" height="100%" viewBox={`0 0 ${AW} ${AH}`} preserveAspectRatio="none" style={{ flex: 1, display: 'block', minHeight: 0 }}>
              <defs>
                <linearGradient id="lgCm" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={GREEN_A}  stopOpacity="0.16"/><stop offset="100%" stopColor={GREEN_A}  stopOpacity="0"/>
                </linearGradient>
                <linearGradient id="lgIm" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={PURPLE_A} stopOpacity="0.13"/><stop offset="100%" stopColor={PURPLE_A} stopOpacity="0"/>
                </linearGradient>
              </defs>
              {[0.25,0.5,0.75].map(y => <line key={y} x1="0" y1={AH*y} x2={AW} y2={AH*y} stroke={BORDER} strokeWidth="0.5"/>)}
              <path d={mainArea}  fill="url(#lgIm)" style={{ opacity: charts ? 1 : 0, transition: 'opacity 0.9s ease 0.5s' }}/>
              <path d={mainLine}  fill="none" stroke={PURPLE_A} strokeWidth="0.5" strokeLinejoin="round"
                strokeDasharray="500" strokeDashoffset={charts ? 0 : 500}
                style={{ transition: 'stroke-dashoffset 0.9s ease 0.5s' }}/>
              <path d={clickArea} fill="url(#lgCm)" style={{ opacity: charts ? 1 : 0, transition: 'opacity 0.9s ease 0.3s' }}/>
              <path d={clickLine} fill="none" stroke={GREEN_A} strokeWidth="0.6" strokeLinejoin="round"
                strokeDasharray="500" strokeDashoffset={charts ? 0 : 500}
                style={{ transition: 'stroke-dashoffset 0.9s ease 0.3s' }}/>
            </svg>
            <div style={{ display: 'flex', padding: '1px 4px 3px', flexShrink: 0 }}>
              {DAYS.map((d,i) => <span key={i} style={{ flex: 1, textAlign: 'center', color: MUTED, fontSize: '3px', fontFamily: 'ui-monospace,monospace' }}>{d}</span>)}
            </div>
          </div>
        </div>
      </div>

      {/* nav drawer slides in from left when Oldalak is "tapped" */}
      {mobileNavDrawer}
    </div>
  )

  // ── Mobile editor ─────────────────────────────────────────────
  const mobileEditorEl = (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: BG, overflow: 'hidden' }}>
      {/* header — same style as desktop editor header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 11px 6px', flexShrink: 0, borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ color: TEXT, fontWeight: 700, fontSize: '7.5px', letterSpacing: '-0.01em' }}>[davelopment]®</span>
          <span style={{ color: MUTED, fontSize: '5px' }}>/</span>
          <span style={{ color: TEXT_SEC, fontSize: '5px' }}>Oldalak</span>
          <span style={{ color: MUTED, fontSize: '5px' }}>/</span>
          <span style={{ color: TEXT_SEC, fontWeight: 500, fontSize: '5px' }}>Főoldal</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
          <div style={{ width: '14px', height: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={TEXT_SEC} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span style={{ position: 'absolute', top: '1px', right: '1px', width: '3.5px', height: '3.5px', borderRadius: '50%', background: '#ef4444', border: `1px solid ${BG}` }} />
          </div>
          <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: SURFACE2, border: `1px solid ${BORDER_H}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: TEXT, fontWeight: 700, fontSize: '4.5px' }}>D</span>
          </div>
        </div>
      </div>
      {/* Fields */}
      <div style={{ flexShrink: 0, padding: '7px 11px', display: 'flex', flexDirection: 'column', gap: '5px', borderBottom: `1px solid ${BORDER}`, height: '42%' }}>
        {(['headline','cta'] as const).map(f => {
          const isH = f === 'headline', act = field === f, val = isH ? inputH : inputC
          const typing = isH ? phase === 'edit-typing-h' : phase === 'edit-typing-c'
          return (
            <div key={f}>
              <div style={{ fontSize: '4px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginBottom: '2px', color: act ? TEXT_SEC : MUTED, fontFamily: 'ui-monospace,monospace' }}>
                {isH ? 'Hero cím' : 'CTA felirat'}
              </div>
              <div style={{ padding: '4px 7px', borderRadius: '4px', background: SURFACE, border: `1px solid ${act ? BORDER_H : BORDER}`, minHeight: isH ? '16px' : undefined, transition: 'border-color 0.2s' }}>
                <span className={isH ? 'break-words' : ''} style={{ color: TEXT, fontSize: '7px', lineHeight: 1.3 }}>
                  {val}{typing && <span style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '1px', width: '1px', height: '9px', background: TEXT, opacity: 0.7 }} />}
                </span>
              </div>
            </div>
          )
        })}
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '2px' }}>
          <div style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '6px', fontWeight: 600, background: saveFx ? GREEN : SURFACE2, color: saveFx ? '#000' : TEXT_SEC, border: `1px solid ${saveFx ? GREEN : BORDER}`, transition: 'all 0.15s' }}>
            {saveFx ? 'Mentve ✓' : 'Mentés'}
          </div>
        </div>
      </div>
      {/* website preview below */}
      <div style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>{wsEl}</div>
    </div>
  )

  // ── Mobile render ─────────────────────────────────────────────
  if (mobile) {
    return (
      <div ref={rootRef} style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: BG }}>
        {flashEl}
        {isDash ? mobileDashEl : mobileEditorEl}
      </div>
    )
  }

  // ── Desktop render ────────────────────────────────────────────
  // Sidebar is ALWAYS rendered at the same position — only the content area changes.
  // This eliminates any layout shift on scene switch.
  return (
    <div ref={rootRef} style={{ width: '100%', height: '100%', overflow: 'hidden', background: BG, position: 'relative', display: 'flex' }}>
      {flashEl}
      {/* Sidebar — same component in both scenes, only activeKey changes */}
      <NavSidebar activeKey={isDash ? 'dash' : 'edit'} />
      {/* Content area */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minWidth: 0 }}>
        {isDash
          ? dashContentEl
          : <>
              <div style={{ width: '48%', height: '100%', overflow: 'hidden', borderRight: `1px solid ${BORDER}` }}>{editorFieldsEl}</div>
              <div style={{ flex: 1, height: '100%', overflow: 'hidden', position: 'relative' }}>{wsEl}</div>
            </>
        }
      </div>
    </div>
  )
}
