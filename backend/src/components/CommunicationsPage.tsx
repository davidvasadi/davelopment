'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useStepNav } from '@payloadcms/ui'

interface Lead { id: string; name?: string; email?: string; message?: string; page?: string; language?: string; state?: string; createdAt: string }
interface Subscriber { id: string; email: string; name?: string; language?: string; confirmed?: boolean; unsubscribed?: boolean; createdAt: string }
interface Campaign { id: string; subject?: string; ref_id?: string; sentCount?: number; fullHtml?: string; isTest?: boolean; createdAt: string; recipients?: string[]; language?: string }
interface Stats { ok: boolean; newLeads: number; totalLeads: number; activeSubs: number; newSubs: number; monthSent: number; prevMonthSent: number; huSubs?: number; enSubs?: number; totalSubs?: number }
interface MonthPoint { month: string; sent: number }
interface Toast { type: 'success' | 'error' | 'info'; text: string }

const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n)
const QUOTA = 3000

const formatDate = (d: string) => {
  if (!d) return '–'
  return new Date(d).toLocaleString('hu-HU', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}
const formatDateShort = (d: string) => {
  if (!d) return '–'
  return new Date(d).toLocaleString('hu-HU', { year: 'numeric', month: 'short', day: 'numeric' })
}

const CSS = `
  @keyframes cp-in { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
  @keyframes cp-spin { to{transform:rotate(360deg)} }
  .cp-w { animation:cp-in .3s ease forwards }
  .cp-card { background:var(--theme-elevation-50); border:1px solid var(--theme-elevation-150); border-radius:12px; overflow:hidden }
  .cp-table { width:100%; border-collapse:collapse }
  .cp-table th { font-size:9px; font-weight:600; text-transform:uppercase; letter-spacing:.08em; color:var(--theme-elevation-400); padding:8px 14px; text-align:left; border-bottom:1px solid var(--theme-elevation-150); font-family:ui-monospace,monospace }
  .cp-table td { padding:10px 14px; border-bottom:1px solid var(--theme-elevation-100); font-size:13px; color:var(--theme-text) }
  .cp-table tr:last-child td { border-bottom:none }
  .cp-table tr:hover td { background:var(--theme-elevation-100) }
  .cp-bar { flex:1; border-radius:3px 3px 0 0; position:relative; cursor:default; transition:opacity .15s }
  .cp-bar:not(.active) { opacity:0.25 }
  .cp-bar-tip { position:absolute; top:-22px; left:50%; transform:translateX(-50%); font-size:9px; color:var(--theme-text); background:var(--theme-elevation-100); border:1px solid var(--theme-elevation-200); padding:2px 6px; border-radius:5px; white-space:nowrap; font-family:ui-monospace,monospace; pointer-events:none; opacity:0; transition:opacity .1s; z-index:10 }
  .cp-bar:hover .cp-bar-tip { opacity:1 }
  .cp-input { padding:6px 10px; border-radius:8px; border:1px solid var(--theme-elevation-200); background:var(--theme-elevation-100); color:var(--theme-text); font-size:12px; outline:none; font-family:inherit; box-sizing:border-box }
  .cp-input:focus { border-color:var(--theme-elevation-400) }
  .cp-textarea { padding:10px 12px; border-radius:8px; border:1px solid var(--theme-elevation-200); background:var(--theme-elevation-100); color:var(--theme-text); font-size:12px; outline:none; resize:vertical; line-height:1.6; font-family:ui-monospace,monospace; min-height:220px; box-sizing:border-box }
  .cp-textarea:focus { border-color:var(--theme-elevation-400) }
  .cp-btn { display:inline-flex; align-items:center; gap:6px; padding:6px 14px; border-radius:8px; font-size:12px; font-weight:600; cursor:pointer; border:none; transition:all .14s; font-family:inherit }
  .cp-btn-primary { background:#6366f1; color:#fff }
  .cp-btn-primary:hover { background:#4f46e5 }
  .cp-btn-primary:disabled { background:var(--theme-elevation-200); color:var(--theme-elevation-400); cursor:not-allowed }
  .cp-btn-success { background:#22c55e; color:#fff }
  .cp-btn-success:hover { background:#16a34a }
  .cp-btn-success:disabled { background:var(--theme-elevation-200); color:var(--theme-elevation-400); cursor:not-allowed }
  .cp-btn-ghost { background:transparent; color:var(--theme-elevation-500); border:1px solid var(--theme-elevation-200) }
  .cp-btn-ghost:hover { color:var(--theme-text); border-color:var(--theme-elevation-400); background:var(--theme-elevation-100) }
  .cp-btn-ghost:disabled { opacity:0.4; cursor:not-allowed }
  .cp-btn-danger { background:transparent; color:#ef4444; border:1px solid rgba(239,68,68,.25) }
  .cp-btn-danger:hover { background:rgba(239,68,68,.08) }
  .cp-chip { padding:4px 10px; border-radius:6px; font-size:11px; font-weight:600; cursor:pointer; border:1px solid var(--theme-elevation-150); background:var(--theme-elevation-50); color:var(--theme-elevation-500); transition:all .12s }
  .cp-chip:hover { border-color:var(--theme-elevation-400); color:var(--theme-text) }
  .cp-chip.active { background:var(--theme-text); border-color:var(--theme-text); color:var(--theme-bg) }
  .cp-toast { position:fixed; bottom:24px; right:24px; z-index:9999; padding:10px 16px; border-radius:10px; font-size:13px; font-weight:500; display:flex; align-items:center; gap:8px; animation:cp-in .2s ease }
  .cp-toast-success { background:#22c55e; color:#fff }
  .cp-toast-error { background:#ef4444; color:#fff }
  .cp-toast-info { background:#6366f1; color:#fff }
  .cp-select { padding:5px 8px; border-radius:7px; border:1px solid var(--theme-elevation-200); background:var(--theme-elevation-100); color:var(--theme-text); font-size:11px; outline:none; cursor:pointer; font-family:inherit }
  .cp-badge { display:inline-flex; align-items:center; padding:2px 8px; border-radius:20px; font-size:11px; font-weight:600; font-family:ui-monospace,monospace }
  .cp-badge-new { background:rgba(245,158,11,.1); color:#f59e0b; border:1px solid rgba(245,158,11,.2) }
  .cp-badge-in_progress { background:rgba(99,102,241,.1); color:#6366f1; border:1px solid rgba(99,102,241,.2) }
  .cp-badge-done { background:rgba(34,197,94,.1); color:#22c55e; border:1px solid rgba(34,197,94,.2) }
  .cp-badge-active { background:rgba(34,197,94,.1); color:#22c55e; border:1px solid rgba(34,197,94,.2) }
  .cp-badge-unsub { background:rgba(239,68,68,.08); color:#ef4444; border:1px solid rgba(239,68,68,.2) }
  .cp-badge-hu { background:rgba(37,99,235,.1); color:#7C6AF7; border:1px solid rgba(37,99,235,.2) }
  .cp-badge-en { background:rgba(220,38,38,.1); color:#7C6AF7; border:1px solid rgba(220,38,38,.2) }
  .cp-modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,.6); z-index:999; display:flex; align-items:center; justify-content:center; padding:20px }
  .cp-modal { background:var(--theme-elevation-50); border:1px solid var(--theme-elevation-200); border-radius:14px; width:100%; max-width:520px; max-height:90vh; overflow-y:auto; box-shadow:0 20px 60px rgba(0,0,0,.3) }
  .cp-modal-header { display:flex; align-items:center; justify-content:space-between; padding:18px 22px 14px; border-bottom:1px solid var(--theme-elevation-150) }
  .cp-modal-title { font-size:14px; font-weight:700; color:var(--theme-text) }
  .cp-modal-body { padding:18px 22px }
  .cp-modal-footer { display:flex; justify-content:flex-end; gap:8px; padding:14px 22px; border-top:1px solid var(--theme-elevation-150) }
  .cp-detail-row { display:flex; gap:12px; margin-bottom:10px; align-items:flex-start }
  .cp-detail-label { width:100px; flex-shrink:0; font-size:12px; color:var(--theme-elevation-500); padding-top:2px }
  .cp-detail-value { font-size:13px; color:var(--theme-text); line-height:1.5; flex:1 }
  .cp-msg-box { background:var(--theme-elevation-100); border:1px solid var(--theme-elevation-200); border-radius:8px; padding:10px 12px; font-size:13px; color:var(--theme-text); line-height:1.6; white-space:pre-wrap; margin-top:6px }
  .cp-info-row { display:flex; align-items:center; justify-content:space-between; padding:8px 10px; background:var(--theme-elevation-100); border-radius:7px; border:1px solid var(--theme-elevation-150); margin-bottom:6px }
  .cp-info-key { font-size:12px; color:var(--theme-elevation-400) }
  .cp-info-val { font-size:12px; color:var(--theme-text); font-weight:500; font-family:ui-monospace,monospace }
  .cp-stat-card { background:var(--theme-elevation-50); border:1px solid var(--theme-elevation-150); border-radius:10px; padding:12px 14px; cursor:pointer; transition:all .14s }
  .cp-stat-card:hover { border-color:var(--theme-elevation-300); transform:translateY(-1px) }
  .cp-toolbar-editor { display:flex; gap:4px; flex-wrap:wrap; padding:7px 10px; background:var(--theme-elevation-100); border-radius:7px 7px 0 0; border:1px solid var(--theme-elevation-200); border-bottom:none }
  .cp-toolbar-btn { padding:3px 8px; border-radius:5px; border:1px solid var(--theme-elevation-200); background:transparent; color:var(--theme-elevation-500); cursor:pointer; font-size:12px; font-weight:600; font-family:inherit; transition:all .12s }
  .cp-toolbar-btn:hover { color:var(--theme-text); border-color:var(--theme-elevation-400); background:var(--theme-elevation-50) }
  .cp-history-row { display:flex; align-items:center; gap:10px; padding:10px 14px; border-bottom:1px solid var(--theme-elevation-100); cursor:pointer; transition:background .1s }
  .cp-history-row:last-child { border-bottom:none }
  .cp-history-row:hover { background:var(--theme-elevation-100) }
  .cp-campaign-layout { display:flex; gap:16px; align-items:flex-start; flex-wrap:wrap }
  .cp-campaign-sidebar { flex:0 0 270px; min-width:0; display:flex; flex-direction:column; gap:12px }
  .cp-sidebar-card { background:var(--theme-elevation-50); border:1px solid var(--theme-elevation-150); border-radius:12px; overflow:hidden }
  .cp-sidebar-card-header { padding:12px 16px; border-bottom:1px solid var(--theme-elevation-150); display:flex; align-items:center; gap:10px }
  .cp-sidebar-icon { width:28px; height:28px; border-radius:7px; display:flex; align-items:center; justify-content:center; flex-shrink:0 }
  .cp-sidebar-card-body { padding:14px 16px; display:flex; flex-direction:column; gap:10px }
  .cp-tab-btn { padding:6px 14px; border-radius:8px; border:none; cursor:pointer; font-size:13px; font-weight:600; transition:all .15s; position:relative; white-space:nowrap }
  .cp-reply-btn { opacity:0; transition:opacity .12s }
  .cp-lead-row:hover .cp-reply-btn { opacity:1 }
  .cp-page { padding:var(--gutter-h) }
  .cp-tab-bar { display:flex; gap:2px; margin-bottom:1.5rem; background:var(--theme-elevation-100); padding:3px; border-radius:12px; overflow-x:auto; -webkit-overflow-scrolling:touch; scrollbar-width:none }
  .cp-tab-bar::-webkit-scrollbar { display:none }
  .cp-stat-grid-3 { display:grid; grid-template-columns:repeat(3,1fr); gap:10px }
  .cp-settings-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:12px }
  .cp-hu-en { display:flex; gap:20px }
  .cp-filter-bar { display:flex; align-items:center; gap:8px; flex-wrap:wrap; padding:10px 14px; border-bottom:1px solid var(--theme-elevation-150) }
  .cp-filter-chips { display:flex; gap:5px; flex-wrap:wrap }
  @media (max-width: 768px) {
    .cp-campaign-layout { flex-direction:column; align-items:stretch }
    .cp-campaign-sidebar { width:100%; display:grid; grid-template-columns:1fr 1fr; flex-direction:unset }
    .cp-campaign-sidebar .cp-sidebar-card:nth-child(n+3) { grid-column:1 / -1 }
    .cp-page { padding:16px }
    .cp-tab-btn { font-size:12px; padding:5px 10px }
    .cp-stat-grid-3 { grid-template-columns:repeat(2,1fr) }
    .cp-settings-grid { grid-template-columns:1fr }
    .cp-settings-grid .cp-quota-span { grid-column:1 }
    .cp-hu-en { flex-direction:column; gap:12px }
    .cp-modal-body { padding:14px 16px }
    .cp-modal-footer { padding:12px 16px }
    .cp-modal-header { padding:14px 16px 12px }
    .cp-detail-label { width:80px }
    /* Leads tábla: elrejt Üzenet(3), Oldal(4), Nyelv(5) */
    .cp-leads-table th:nth-child(3), .cp-leads-table td:nth-child(3),
    .cp-leads-table th:nth-child(4), .cp-leads-table td:nth-child(4),
    .cp-leads-table th:nth-child(5), .cp-leads-table td:nth-child(5) { display:none }
    .cp-leads-table td:nth-child(2) { max-width:140px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap }
    /* Subscribers tábla: elrejt Név(2), Megerősített(5), Kor(6) */
    .cp-subs-table th:nth-child(2), .cp-subs-table td:nth-child(2),
    .cp-subs-table th:nth-child(5), .cp-subs-table td:nth-child(5),
    .cp-subs-table th:nth-child(6), .cp-subs-table td:nth-child(6) { display:none }
    .cp-subs-table td:nth-child(1) { max-width:150px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap }
  }
  @media (max-width: 480px) {
    .cp-page { padding:12px }
    .cp-stat-grid-3 { grid-template-columns:1fr }
    .cp-tab-btn { font-size:11px; padding:4px 9px }
    .cp-info-row { flex-direction:column; align-items:flex-start; gap:2px }
    .cp-info-val { font-size:11px }
    /* Leads tábla: csak Név(1), Státusz(6→3), Törlés(8→5) marad */
    .cp-leads-table th:nth-child(2), .cp-leads-table td:nth-child(2),
    .cp-leads-table th:nth-child(7), .cp-leads-table td:nth-child(7) { display:none }
    /* Subscribers tábla: csak Email(1), Státusz(3→2) marad */
    .cp-subs-table th:nth-child(4), .cp-subs-table td:nth-child(4) { display:none }
  }
`

function Spinner() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'cp-spin 1s linear infinite', flexShrink: 0 }}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
}

function MonthBars({ data }: { data: MonthPoint[] }) {
  const max = Math.max(...data.map(d => d.sent), 1)
  return (
    <div>
      <div style={{ fontSize: 9, color: 'var(--theme-elevation-400)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>Küldések / hó</div>
      <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 52 }}>
        {data.map((d, i) => {
          const h = Math.max((d.sent / max) * 48, 3)
          const isLast = i === data.length - 1
          return (
            <div key={d.month} className={`cp-bar${isLast ? ' active' : ''}`} style={{ height: `${h}px`, background: isLast ? '#22c55e' : 'var(--theme-elevation-200)', ...(isLast ? { boxShadow: '0 0 8px rgba(34,197,94,.3)' } : {}) }}>
              <div className="cp-bar-tip">{d.month.slice(5)}: {fmt(d.sent)}</div>
            </div>
          )
        })}
      </div>
      <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
        {data.map(d => <div key={d.month} style={{ flex: 1, textAlign: 'center', fontSize: 8, color: 'var(--theme-elevation-400)', fontFamily: 'ui-monospace,monospace' }}>{d.month.slice(5)}</div>)}
      </div>
    </div>
  )
}

function Pagination({ page, pageSize, total, onPage }: { page: number; pageSize: number; total: number; onPage: (p: number) => void }) {
  const totalPages = Math.ceil(total / pageSize)
  if (totalPages <= 1) return null
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderTop: '1px solid var(--theme-elevation-150)', fontSize: 12, color: 'var(--theme-elevation-500)' }}>
      <span>{(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} / {total}</span>
      <div style={{ display: 'flex', gap: 6 }}>
        <button className="cp-btn cp-btn-ghost" onClick={() => onPage(page - 1)} disabled={page <= 1} style={{ padding: '4px 10px', fontSize: 11 }}>← Előző</button>
        <button className="cp-btn cp-btn-ghost" onClick={() => onPage(page + 1)} disabled={page >= totalPages} style={{ padding: '4px 10px', fontSize: 11 }}>Következő →</button>
      </div>
    </div>
  )
}

const ago = (date: string) => {
  const m = Math.round((Date.now() - new Date(date).getTime()) / 60000)
  if (m < 60) return `${m}p`
  if (m < 1440) return `${Math.round(m / 60)}h`
  return `${Math.round(m / 1440)}n`
}

// ─── StateBadge ───────────────────────────────────────────────────────────────

function StateBadge({ state }: { state: string }) {
  const labels: Record<string, string> = { new: 'Új', in_progress: 'Folyamatban', done: 'Kész' }
  return <span className={`cp-badge cp-badge-${state}`}>{labels[state] || state}</span>
}

// ─── Lead Modal ───────────────────────────────────────────────────────────────

function LeadModal({ lead, onClose, onUpdate }: { lead: Lead; onClose: () => void; onUpdate: (id: string, state: string) => void }) {
  const [state, setState] = useState(lead.state || 'new')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await onUpdate(lead.id, state)
    setSaving(false)
    onClose()
  }

  return (
    <div className="cp-modal-overlay" onClick={onClose}>
      <div className="cp-modal" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
        <div className="cp-modal-header">
          <div className="cp-modal-title">Érdeklődő részletei</div>
          <button className="cp-btn cp-btn-ghost" onClick={onClose} style={{ padding: '3px 8px', fontSize: 11 }}>✕</button>
        </div>
        <div className="cp-modal-body">
          {[
            { label: 'Név', value: lead.name || '–' },
            { label: 'Oldal', value: lead.page || '–' },
            { label: 'Beérkezett', value: formatDate(lead.createdAt) },
          ].map(r => (
            <div key={r.label} className="cp-detail-row">
              <div className="cp-detail-label">{r.label}</div>
              <div className="cp-detail-value">{r.value}</div>
            </div>
          ))}
          <div className="cp-detail-row">
            <div className="cp-detail-label">Email</div>
            <div className="cp-detail-value">
              <a href={`mailto:${lead.email}`} style={{ color: '#6366f1' }}>{lead.email}</a>
            </div>
          </div>
          {lead.language && (
            <div className="cp-detail-row">
              <div className="cp-detail-label">Nyelv</div>
              <div className="cp-detail-value">
                <span className={`cp-badge cp-badge-${lead.language}`}>{lead.language.toUpperCase()}</span>
              </div>
            </div>
          )}
          <div className="cp-detail-row">
            <div className="cp-detail-label">Státusz</div>
            <div className="cp-detail-value">
              <select className="cp-select" value={state} onChange={e => setState(e.target.value)} style={{ fontSize: 12 }}>
                <option value="new">Új</option>
                <option value="in_progress">Folyamatban</option>
                <option value="done">Kész</option>
              </select>
            </div>
          </div>
          {lead.message && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--theme-elevation-500)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 6 }}>Üzenet</div>
              <div className="cp-msg-box">{lead.message}</div>
            </div>
          )}
        </div>
        <div className="cp-modal-footer" style={{ justifyContent: 'space-between' }}>
          <a href={`mailto:${lead.email}?subject=Re: ${lead.page || 'Érdeklődés'}`} className="cp-btn cp-btn-ghost" style={{ textDecoration: 'none', fontSize: 11, padding: '4px 10px' }}>↩ Válasz</a>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="cp-btn cp-btn-ghost" onClick={onClose}>Mégse</button>
            <button className="cp-btn cp-btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Mentés...' : 'Mentés'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Subscriber Modal ─────────────────────────────────────────────────────────

function SubscriberModal({ sub, onClose, showToast }: { sub: Subscriber; onClose: () => void; showToast: (type: Toast['type'], text: string) => void }) {
  return (
    <div className="cp-modal-overlay" onClick={onClose}>
      <div className="cp-modal" style={{ maxWidth: 460 }} onClick={e => e.stopPropagation()}>
        <div className="cp-modal-header">
          <div className="cp-modal-title">Feliratkozó részletei</div>
          <button className="cp-btn cp-btn-ghost" onClick={onClose} style={{ padding: '3px 8px', fontSize: 11 }}>✕</button>
        </div>
        <div className="cp-modal-body">
          <div className="cp-detail-row">
            <div className="cp-detail-label">Email</div>
            <div className="cp-detail-value">
              <a href={`mailto:${sub.email}`} style={{ color: '#6366f1', fontFamily: 'ui-monospace,monospace', fontSize: 12 }}>{sub.email}</a>
            </div>
          </div>
          <div className="cp-detail-row">
            <div className="cp-detail-label">Név</div>
            <div className="cp-detail-value">{sub.name || '–'}</div>
          </div>
          <div className="cp-detail-row">
            <div className="cp-detail-label">Nyelv</div>
            <div className="cp-detail-value">
              {sub.language
                ? <span className={`cp-badge cp-badge-${sub.language}`}>{sub.language.toUpperCase()}</span>
                : '–'}
            </div>
          </div>
          <div className="cp-detail-row">
            <div className="cp-detail-label">Státusz</div>
            <div className="cp-detail-value">
              {sub.unsubscribed
                ? <span className="cp-badge cp-badge-unsub">Leiratkozott</span>
                : <span className="cp-badge cp-badge-active">Aktív</span>}
            </div>
          </div>
          <div className="cp-detail-row">
            <div className="cp-detail-label">Megerősített</div>
            <div className="cp-detail-value">{sub.confirmed ? 'Igen' : 'Nem'}</div>
          </div>
          <div className="cp-detail-row">
            <div className="cp-detail-label">Feliratkozott</div>
            <div className="cp-detail-value" style={{ fontFamily: 'ui-monospace,monospace', fontSize: 12 }}>{formatDate(sub.createdAt)}</div>
          </div>
        </div>
        <div className="cp-modal-footer">
          <button className="cp-btn cp-btn-ghost" onClick={onClose}>Bezárás</button>
          <a href={`/admin/collections/newsletters/${sub.id}`} target="_blank" rel="noreferrer" className="cp-btn cp-btn-primary" style={{ textDecoration: 'none', fontSize: 11 }}>Szerkesztés →</a>
        </div>
      </div>
    </div>
  )
}

// ─── Campaign History Modal ───────────────────────────────────────────────────

function CampaignHistoryModal({ campaign, onClose, onLoadSubject, onResendsent }: { campaign: Campaign; onClose: () => void; onLoadSubject: (s: string) => void; onResendsent?: (sent: number, newRecipients: string[]) => void }) {
  const [previewTab, setPreviewTab] = useState<'info' | 'preview'>('info')
  const [showRecipients, setShowRecipients] = useState(false)
  const [resending, setResending] = useState(false)

  const handleResend = async () => {
    setResending(true)
    try {
      const res = await fetch('/api/communications/resend-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId: campaign.id }),
      })
      const d = await res.json()
      if (d.ok) {
        await fetch('/api/communications/campaigns', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subject: `[Újraküldés] ${campaign.subject}`,
            sentCount: d.sent,
            fullHtml: campaign.fullHtml,
            language: campaign.language,
            recipients: d.recipients,
          }),
        })
        onResendsent?.(d.sent, d.recipients || [])
        onClose()
      } else {
        alert(d.error || 'Hiba történt az újraküldésnél')
      }
    } catch (e) {
      alert('Hiba: ' + String(e))
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="cp-modal-overlay" onClick={onClose}>
      <div className="cp-modal" style={{ maxWidth: 540 }} onClick={e => e.stopPropagation()}>
        <div className="cp-modal-header">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div className="cp-modal-title" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 360 }}>{campaign.subject || '—'}</div>
            <div style={{ fontSize: 11, color: 'var(--theme-elevation-400)', fontFamily: 'ui-monospace,monospace' }}>{formatDate(campaign.createdAt)}{campaign.ref_id && campaign.ref_id !== 'test' ? ` · ${campaign.ref_id} fő` : ''}</div>
          </div>
          <button className="cp-btn cp-btn-ghost" onClick={onClose} style={{ padding: '3px 8px', fontSize: 11 }}>✕</button>
        </div>
        <div style={{ display: 'flex', gap: 2, padding: '8px 16px 0', borderBottom: '1px solid var(--theme-elevation-150)' }}>
          {(['info', 'preview'] as const).map(t => (
            <button key={t} onClick={() => setPreviewTab(t)} style={{ padding: '6px 14px', fontSize: 12, fontWeight: previewTab === t ? 700 : 400, color: previewTab === t ? 'var(--theme-text)' : 'var(--theme-elevation-500)', background: 'none', border: 'none', cursor: 'pointer', borderBottom: previewTab === t ? '2px solid var(--theme-text)' : '2px solid transparent', marginBottom: -1, transition: 'all 140ms' }}>
              {t === 'info' ? 'Részletek' : 'Email előnézet'}
            </button>
          ))}
        </div>
        <div className="cp-modal-body" style={{ padding: previewTab === 'preview' ? 0 : undefined }}>
          {previewTab === 'info' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Tárgy', value: campaign.subject || '—' },
                { label: 'Kiküldve', value: formatDate(campaign.createdAt) },
                { label: 'Elküldve', value: campaign.ref_id && campaign.ref_id !== 'test' && campaign.ref_id !== 'campaign' ? `${campaign.ref_id} főnek` : campaign.isTest ? 'Teszt' : '—' },
              ].map(r => (
                <div key={r.label} className="cp-detail-row">
                  <div className="cp-detail-label">{r.label}</div>
                  <div className="cp-detail-value" style={{ fontFamily: 'ui-monospace,monospace', fontSize: 12 }}>{r.value}</div>
                </div>
              ))}
              {campaign.recipients && campaign.recipients.length > 0 && (
                <div>
                  <button
                    onClick={() => setShowRecipients(v => !v)}
                    className="cp-btn cp-btn-ghost"
                    style={{ fontSize: 11, padding: '3px 10px', marginTop: 2 }}
                  >
                    {showRecipients ? '▲ Bezárás' : `▼ Bővebben — ${campaign.recipients.length} email cím`}
                  </button>
                  {showRecipients && (
                    <div style={{ marginTop: 8, maxHeight: 180, overflowY: 'auto', background: 'var(--theme-elevation-100)', borderRadius: 8, border: '1px solid var(--theme-elevation-200)', padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {campaign.recipients.map(email => (
                        <div key={email} style={{ fontSize: 12, fontFamily: 'ui-monospace,monospace', color: 'var(--theme-text)', padding: '1px 0' }}>{email}</div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          {previewTab === 'preview' && (
            campaign.fullHtml
              ? <iframe srcDoc={campaign.fullHtml} style={{ width: '100%', height: 480, border: 'none', borderRadius: '0 0 12px 12px', background: '#fff' }} title="Email előnézet" />
              : <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--theme-elevation-400)', fontSize: 13 }}>Az előnézet nem elérhető ehhez a kampányhoz.</div>
          )}
        </div>
        {previewTab === 'info' && (
          <div className="cp-modal-footer" style={{ justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="cp-btn cp-btn-ghost" style={{ fontSize: 11, padding: '4px 10px' }} onClick={() => { onLoadSubject(campaign.subject || ''); onClose() }}>Tárgy betöltése</button>
              {!campaign.isTest && campaign.fullHtml && (
                <button className="cp-btn cp-btn-ghost" style={{ fontSize: 11, padding: '4px 10px' }} onClick={handleResend} disabled={resending}>
                  {resending ? '⏳ Küldés...' : '↺ Újraküldés az újaknak'}
                </button>
              )}
            </div>
            <button className="cp-btn cp-btn-ghost" onClick={onClose}>Bezárás</button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Confirm Dialog ───────────────────────────────────────────────────────────

function ConfirmDialog({ title, message, confirmLabel = 'Igen', danger = false, onConfirm, onCancel }: { title: string; message: string; confirmLabel?: string; danger?: boolean; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="cp-modal-overlay" style={{ zIndex: 1100 }} onClick={onCancel}>
      <div className="cp-modal" style={{ maxWidth: 360 }} onClick={e => e.stopPropagation()}>
        <div className="cp-modal-header">
          <div className="cp-modal-title">{title}</div>
        </div>
        <div className="cp-modal-body">
          <p style={{ color: 'var(--theme-text)', fontSize: 13, lineHeight: 1.6, margin: 0 }}>{message}</p>
        </div>
        <div className="cp-modal-footer">
          <button className="cp-btn cp-btn-ghost" onClick={onCancel}>Mégse</button>
          <button className={`cp-btn ${danger ? 'cp-btn-danger' : 'cp-btn-primary'}`} onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  )
}

// ─── TABS ─────────────────────────────────────────────────────────────────────

const TABS = ['Összesítő', 'Érdeklődők', 'Feliratkozók', 'Kampányok', 'Beállítások'] as const
type Tab = typeof TABS[number]

// ─── HTML Template ────────────────────────────────────────────────────────────

const HTML_TEMPLATE = `<!DOCTYPE html>
<html lang="hu">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Hírlevél</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;-webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f5f5f5;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:440px;">

        <tr><td style="background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">

            <!-- Header -->
            <tr><td style="padding:18px 24px 16px;border-bottom:1px solid #f3f4f6;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-size:13px;font-weight:700;color:#111;font-family:'Courier New',Courier,monospace;letter-spacing:0.2px;">[davelopment]®</td>
                  <td align="right">
                    <span style="display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;background:#f0f0f0;color:#555;font-family:'Courier New',Courier,monospace;">hírlevél</span>
                  </td>
                </tr>
              </table>
            </td></tr>

            <!-- Body -->
            <tr><td style="padding:32px 24px 28px;">

              <h1 style="font-size:22px;font-weight:700;color:#111;margin:0 0 14px;letter-spacing:-0.3px;line-height:1.3;">Az email főcíme</h1>
              <p style="font-size:14px;color:#6b7280;line-height:1.75;margin:0 0 24px;">Az email szövege ide kerül. Több bekezdést is írhatsz egymás után.</p>

              <!-- CTA gomb (opcionális) -->
              <a href="https://davelopment.hu" style="display:inline-block;padding:12px 22px;background:#111;color:#ffffff;border-radius:10px;text-decoration:none;font-size:13px;font-weight:600;letter-spacing:0.2px;">Megnézem ›</a>

            </td></tr>
          </table>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:18px 4px 0;text-align:center;">
          <p style="font-size:11px;color:#9ca3af;margin:0 0 5px;font-family:'Courier New',Courier,monospace;">davelopment.hu · hello@davelopment.hu</p>
          <a href="{{unsubscribe_url}}" style="font-size:11px;color:#9ca3af;text-decoration:none;font-family:'Courier New',Courier,monospace;">Leiratkozás a hírlevélről</a>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`

// ─── TOOLBAR ACTIONS ──────────────────────────────────────────────────────────

const TOOLBAR_ACTIONS = [
  { label: 'B',   title: 'Bold',       open: '<strong>',                                                                                                          close: '</strong>', placeholder: 'félkövér szöveg' },
  { label: 'I',   title: 'Dőlt',       open: '<em>',                                                                                                              close: '</em>',     placeholder: 'dőlt szöveg' },
  { label: 'H1',  title: 'Főcím',      open: '<h1 style="font-size:26px;font-weight:700;color:#111;margin:0 0 14px;letter-spacing:-0.3px;">',                     close: '</h1>',     placeholder: 'Főcím' },
  { label: 'H2',  title: 'Alcím',      open: '<h2 style="font-size:18px;font-weight:600;color:#111;margin:0 0 10px;">',                                           close: '</h2>',     placeholder: 'Alcím' },
  { label: 'P',   title: 'Bekezdés',   open: '<p style="font-size:14px;color:#6b7280;line-height:1.75;margin:0 0 16px;">',                                        close: '</p>',      placeholder: 'Szöveg...' },
  { label: 'HR',  title: 'Elválasztó', open: '',                                                                                                                  close: '',          placeholder: '<hr style="border:none;border-top:1px solid #e5e7eb;margin:28px 0;" />' },
  { label: 'CTA', title: 'Gomb',       open: '<a href="https://" style="display:inline-block;padding:12px 24px;background:#111;color:#fff;border-radius:10px;text-decoration:none;font-size:13px;font-weight:600;">', close: '</a>', placeholder: 'Gomb szövege' },
]

// ─── Main Component ───────────────────────────────────────────────────────────

export function CommunicationsPage() {
  const { setStepNav } = useStepNav()
  useEffect(() => {
    setStepNav([{ label: 'Kommunikáció' }])
  }, [setStepNav])

  const [tab, setTab] = useState<Tab>('Összesítő')
  const [toast, setToast] = useState<Toast | null>(null)

  // Stats
  const [stats, setStats] = useState<Stats | null>(null)
  const [monthly, setMonthly] = useState<MonthPoint[]>([])
  const [statsLoading, setStatsLoading] = useState(true)

  // Leads
  const [leads, setLeads] = useState<Lead[]>([])
  const [leadsTotal, setLeadsTotal] = useState(0)
  const [leadsPage, setLeadsPage] = useState(1)
  const [leadsState, setLeadsState] = useState('all')
  const [leadsLoading, setLeadsLoading] = useState(false)
  const [leadsSearch, setLeadsSearch] = useState('')
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [deleteLeadConfirm, setDeleteLeadConfirm] = useState<string | null>(null)
  const [deleteAllLeadsConfirm, setDeleteAllLeadsConfirm] = useState(false)

  // Subscribers
  const [subs, setSubs] = useState<Subscriber[]>([])
  const [subsTotal, setSubsTotal] = useState(0)
  const [subsPage, setSubsPage] = useState(1)
  const [subsLang, setSubsLang] = useState('all')
  const [subsFilter, setSubsFilter] = useState('all')
  const [subsLoading, setSubsLoading] = useState(false)
  const [subsSearch, setSubsSearch] = useState('')
  const [selectedSub, setSelectedSub] = useState<Subscriber | null>(null)

  // Campaigns
  const [campaignSubject, setCampaignSubject] = useState('')
  const [campaignHtml, setCampaignHtml] = useState('')
  const [campaignLang, setCampaignLang] = useState('all')
  const [testEmail, setTestEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [sendingTest, setSendingTest] = useState(false)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [campsLoading, setCampsLoading] = useState(false)
  const [editorMode, setEditorMode] = useState<'editor' | 'html' | 'preview'>('editor')
  const [imgDialog, setImgDialog] = useState(false)
  const [imgUrl, setImgUrl] = useState('')
  const [imgAlt, setImgAlt] = useState('')
  const [imgWidth, setImgWidth] = useState('')
  const [linkDialog, setLinkDialog] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [linkText, setLinkText] = useState('')
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [sendConfirmOpen, setSendConfirmOpen] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const richEditorRef = useRef<HTMLDivElement>(null)

  const showToast = (type: Toast['type'], text: string) => {
    setToast({ type, text })
    setTimeout(() => setToast(null), 3500)
  }

  // Load stats on mount
  useEffect(() => {
    Promise.all([
      fetch('/api/communications/stats').then(r => r.json()),
      fetch('/api/communications/monthly-stats').then(r => r.json()),
    ]).then(([s, m]) => {
      if (s.ok) setStats(s)
      if (Array.isArray(m.data)) setMonthly(m.data)
    }).finally(() => setStatsLoading(false))
  }, [])

  // Load leads
  const loadLeads = useCallback((page: number, state: string) => {
    setLeadsLoading(true)
    fetch(`/api/communications/leads?page=${page}&pageSize=20&state=${state}`)
      .then(r => r.json())
      .then(d => { if (d.ok) { setLeads(d.data); setLeadsTotal(d.total) } })
      .finally(() => setLeadsLoading(false))
  }, [])

  useEffect(() => { if (tab === 'Érdeklődők') loadLeads(leadsPage, leadsState) }, [tab, leadsPage, leadsState, loadLeads])

  // Load subscribers
  const loadSubs = useCallback((page: number, lang: string) => {
    setSubsLoading(true)
    fetch(`/api/communications/subscribers?page=${page}&pageSize=50&language=${lang}`)
      .then(r => r.json())
      .then(d => { if (d.ok) { setSubs(d.data); setSubsTotal(d.total) } })
      .finally(() => setSubsLoading(false))
  }, [])

  useEffect(() => { if (tab === 'Feliratkozók') loadSubs(subsPage, subsLang) }, [tab, subsPage, subsLang, loadSubs])

  // Load campaigns
  useEffect(() => {
    if (tab !== 'Kampányok') return
    setCampsLoading(true)
    fetch('/api/communications/campaigns').then(r => r.json())
      .then(d => { if (d.ok) setCampaigns(d.data) })
      .finally(() => setCampsLoading(false))
  }, [tab])

  // Lead actions
  const changeLeadState = async (id: string, state: string) => {
    const res = await fetch(`/api/communications/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ state }),
    })
    if (res.ok) {
      setLeads(prev => prev.map(l => l.id === id ? { ...l, state } : l))
      showToast('success', 'Státusz frissítve')
    }
  }

  const deleteLead = async (id: string) => {
    setDeleteLeadConfirm(null)
    const res = await fetch(`/api/communications/leads/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setLeads(prev => prev.filter(l => l.id !== id))
      setLeadsTotal(p => p - 1)
      showToast('success', 'Érdeklődő törölve')
    }
  }

  const deleteAllLeads = async () => {
    setDeleteAllLeadsConfirm(false)
    const res = await fetch('/api/communications/leads', { method: 'DELETE' })
    if (res.ok) {
      setLeads([])
      setLeadsTotal(0)
      showToast('success', 'Összes lead törölve')
    }
  }

  // Insert at cursor (for textarea-based HTML editor)
  const insertAtCursor = (snippet: string) => {
    const el = textareaRef.current
    if (!el) { setCampaignHtml(h => h + snippet); return }
    const start = el.selectionStart
    const end = el.selectionEnd
    const newVal = campaignHtml.slice(0, start) + snippet + campaignHtml.slice(end)
    setCampaignHtml(newVal)
    setTimeout(() => { el.focus(); el.setSelectionRange(start + snippet.length, start + snippet.length) }, 0)
  }

  // Wraps selected text in open+close, or inserts open+placeholder+close
  const wrapOrInsert = (open: string, close: string, placeholder: string) => {
    const el = textareaRef.current
    if (!el) { insertAtCursor(`${open}${placeholder}${close}`); return }
    const start = el.selectionStart
    const end = el.selectionEnd
    const selected = campaignHtml.slice(start, end)
    insertAtCursor(`${open}${selected || placeholder}${close}`)
  }

  const insertImg = () => {
    if (!imgUrl.trim()) return
    const widthStyle = imgWidth ? `width:${imgWidth}px;` : 'max-width:100%;'
    const snippet = `<img src="${imgUrl}" alt="${imgAlt}" style="${widthStyle}height:auto;display:block;" />`
    if (editorMode === 'editor') {
      // Insert into rich editor
      const el = richEditorRef.current
      if (el) {
        el.focus()
        document.execCommand('insertHTML', false, snippet)
      }
    } else {
      insertAtCursor(snippet)
    }
    setImgUrl(''); setImgAlt(''); setImgWidth(''); setImgDialog(false)
  }

  const insertLink = () => {
    if (!linkUrl.trim()) return
    const el = textareaRef.current
    const selected = el ? campaignHtml.slice(el.selectionStart, el.selectionEnd) : ''
    const anchor = `<a href="${linkUrl}" style="color:#111;text-decoration:underline;">${linkText || selected || linkUrl}</a>`
    if (editorMode === 'editor') {
      const edEl = richEditorRef.current
      if (edEl) { edEl.focus(); document.execCommand('insertHTML', false, anchor) }
    } else {
      insertAtCursor(anchor)
    }
    setLinkUrl(''); setLinkText(''); setLinkDialog(false)
  }

  // Build full HTML from rich editor content
  const buildFullHtml = (innerHtml = '') => {
    const body = innerHtml || '<p>(Szöveg...)</p>'
    return `<!DOCTYPE html><html lang="hu"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><style>*{box-sizing:border-box;}body{margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#111;}.outer{padding:32px 16px;}.card{max-width:540px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden;}.card-header{padding:18px 28px 16px;border-bottom:1px solid #f3f4f6;display:flex;align-items:center;justify-content:space-between;}.logo{font-size:13px;font-weight:700;color:#111;font-family:'Courier New',Courier,monospace;}.badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;background:#f3f4f6;border:1px solid #e5e7eb;color:#6b7280;font-family:'Courier New',Courier,monospace;}.body{padding:32px 28px;}h1{font-size:22px;font-weight:700;color:#111;margin:0 0 20px;letter-spacing:-0.3px;line-height:1.3;}h2{font-size:18px;font-weight:700;color:#111;margin:20px 0 10px;}p{font-size:15px;color:#444;line-height:1.75;margin:0 0 14px;}hr{border:none;border-top:1px solid #f0f0f0;margin:24px 0;}img{max-width:100%;border-radius:8px;}a{color:#6d5df4;}.footer{background:#fafafa;border-top:1px solid #f0f0f0;padding:16px 28px;text-align:center;}.footer p{font-size:12px;color:#9ca3af;margin:0 0 4px;font-family:'Courier New',Courier,monospace;}.unsub{font-size:11px;color:#9ca3af!important;text-decoration:none;font-family:'Courier New',Courier,monospace;}</style></head><body><div class="outer"><div class="card"><div class="card-header"><div class="logo">[davelopment]®</div><span class="badge">hírlevél</span></div><div class="body"><h1>${campaignSubject || '(Tárgy)'}</h1>${body}</div><div class="footer"><p>davelopment.hu · hello@davelopment.hu</p><a class="unsub" href="{{unsubscribe_url}}">Leiratkozás a hírlevélről</a></div></div></div></body></html>`
  }

  const getFinalHtml = () => {
    if (editorMode === 'html') return campaignHtml
    const editorContent = richEditorRef.current?.innerHTML || ''
    return buildFullHtml(editorContent)
  }

  const sendCampaign = async (isTest: boolean) => {
    if (!campaignSubject.trim()) { showToast('error', 'Tárgy kötelező'); return }
    const finalHtml = getFinalHtml()
    if (!finalHtml.trim()) { showToast('error', 'Tartalom kötelező'); return }
    if (isTest && !testEmail.trim()) { showToast('error', 'Test email cím kötelező'); return }

    if (isTest) {
      setSendingTest(true)
    } else {
      setSending(true)
      setSendConfirmOpen(false)
    }

    try {
      const res = await fetch('/api/communications/send-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: campaignSubject,
          html: finalHtml,
          testEmail: isTest ? testEmail : undefined,
          language: isTest ? undefined : campaignLang,
        }),
      })
      const d = await res.json()
      if (d.ok) {
        showToast('success', isTest ? `Test elküldve: ${testEmail}` : `Elküldve: ${d.sent} feliratkozónak`)
        if (!isTest) {
          await fetch('/api/communications/campaigns', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subject: campaignSubject, sentCount: d.sent, fullHtml: finalHtml, language: campaignLang, recipients: d.recipients || null }),
          })
          fetch('/api/communications/campaigns').then(r => r.json()).then(c => { if (c.ok) setCampaigns(c.data) })
          if (stats) setStats({ ...stats, monthSent: stats.monthSent + (d.sent || 0) })
        }
      } else {
        showToast('error', d.error || 'Hiba küldés közben')
      }
    } finally {
      setSending(false)
      setSendingTest(false)
    }
  }

  const targetCount = !stats ? 0
    : campaignLang === 'hu' ? (stats.huSubs ?? 0)
    : campaignLang === 'en' ? (stats.enSubs ?? 0)
    : stats.activeSubs

  // Filtered leads by search
  const filteredLeads = leads.filter(l => {
    if (!leadsSearch) return true
    const q = leadsSearch.toLowerCase()
    return (l.name || '').toLowerCase().includes(q) || (l.email || '').toLowerCase().includes(q)
  })

  // Filtered subscribers for display
  const filteredSubs = subs.filter(s => {
    const matchesFilter = subsFilter === 'active' ? (!s.unsubscribed && s.confirmed)
      : subsFilter === 'unconfirmed' ? (!s.unsubscribed && !s.confirmed)
      : subsFilter === 'unsubscribed' ? !!s.unsubscribed
      : true
    if (!matchesFilter) return false
    if (!subsSearch) return true
    const q = subsSearch.toLowerCase()
    return s.email.toLowerCase().includes(q) || (s.name || '').toLowerCase().includes(q)
  })

  const subCounts = {
    all: subs.length,
    active: subs.filter(s => !s.unsubscribed && s.confirmed).length,
    unconfirmed: subs.filter(s => !s.unsubscribed && !s.confirmed).length,
    unsubscribed: subs.filter(s => s.unsubscribed).length,
  }

  return (
    <>
      <style>{CSS}</style>
      {toast && <div className={`cp-toast cp-toast-${toast.type}`}>{toast.text}</div>}

      <div className="cp-page">

        {/* Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ margin: 0, fontSize: 26, lineHeight: '32px', fontWeight: 500, letterSpacing: '-0.5px', fontFamily: 'var(--font-body)', color: 'var(--theme-text)' }}>Kommunikáció</h1>
          <p style={{ margin: '4px 0 0', fontSize: 'var(--base-body-size)', color: 'var(--theme-elevation-500)' }}>Érdeklődők, feliratkozók és email kampányok</p>
        </div>

        {/* Stat cards */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 10, marginBottom: '1.5rem' }}>
            {[
              { label: 'Új érdeklődő', value: stats.newLeads, color: stats.newLeads > 0 ? '#f0c742' : undefined, alert: stats.newLeads > 0, sub: 'feldolgozásra vár', onClick: () => { setTab('Érdeklődők'); setLeadsState('new') } },
              { label: 'Összes érdeklődő', value: stats.totalLeads, color: undefined, alert: false, sub: 'beérkezett', onClick: () => setTab('Érdeklődők') },
              { label: 'Új feliratkozó', value: stats.newSubs, color: stats.newSubs > 0 ? '#f0c742' : undefined, alert: stats.newSubs > 0, sub: 'megerősítés alatt', onClick: () => { setTab('Feliratkozók'); setSubsFilter('unconfirmed') } },
              { label: 'Aktív feliratkozó', value: stats.activeSubs, color: '#22c55e', alert: false, sub: `${stats.totalSubs ?? 0} összes`, onClick: () => setTab('Feliratkozók') },
              { label: `Email / ${new Date().toLocaleString('hu', { month: 'short' })}`, value: fmt(stats.monthSent), color: '#7c6af7', alert: false, sub: `${fmt(QUOTA - stats.monthSent)} maradt`, onClick: () => setTab('Kampányok') },
            ].map(s => (
              <div key={s.label} className="cp-stat-card" onClick={s.onClick}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.04em', fontFamily: 'ui-monospace,monospace', color: s.color || 'var(--theme-text)', lineHeight: 1 }}>{s.value}</div>
                  {s.alert && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#f0c742', boxShadow: '0 0 6px #f0c742', marginTop: 6, flexShrink: 0 }} />}
                </div>
                <div style={{ fontSize: 11, color: 'var(--theme-elevation-500)', marginTop: 4 }}>{s.label}</div>
                <div style={{ fontSize: 10, color: 'var(--theme-elevation-400)', marginTop: 1, fontFamily: 'ui-monospace,monospace' }}>{s.sub}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tab bar */}
        <div className="cp-tab-bar">
          {TABS.map(t => (
            <button
              key={t}
              className="cp-tab-btn"
              onClick={() => setTab(t)}
              style={{
                background: tab === t ? 'var(--theme-elevation-0, #fff)' : 'transparent',
                color: tab === t ? 'var(--theme-text)' : 'var(--theme-elevation-500)',
                boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,.08)' : 'none',
                border: tab === t ? '1px solid var(--theme-elevation-200)' : '1px solid transparent',
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ─── ÖSSZESÍTŐ ─────────────────────────────────────────────── */}
        {tab === 'Összesítő' && (
          statsLoading
            ? <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--theme-elevation-400)', fontSize: 13 }}><Spinner /> Betöltés...</div>
            : stats && <div className="cp-w" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

              {/* ── Stat kártyák ── */}
              <div className="cp-stat-grid-3">
                <div className="cp-stat-card" onClick={() => setTab('Érdeklődők')} style={{ cursor: 'pointer' }}>
                  <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--theme-elevation-400)', fontFamily: 'ui-monospace,monospace', marginBottom: 8 }}>Új érdeklődő <span style={{ opacity: .6 }}>(7n)</span></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <span style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-0.04em', fontFamily: 'ui-monospace,monospace', lineHeight: 1, color: stats.newLeads > 0 ? '#f59e0b' : 'var(--theme-text)' }}>{stats.newLeads}</span>
                    {stats.newLeads > 0 && <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 6px #f59e0b', display: 'inline-block', flexShrink: 0 }} />}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--theme-elevation-400)', marginTop: 5, fontFamily: 'ui-monospace,monospace' }}>Összes: {stats.totalLeads}</div>
                  <div style={{ fontSize: 10, color: 'var(--theme-elevation-400)', marginTop: 2 }}>Érdeklődők →</div>
                </div>

                <div className="cp-stat-card" onClick={() => setTab('Feliratkozók')} style={{ cursor: 'pointer' }}>
                  <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--theme-elevation-400)', fontFamily: 'ui-monospace,monospace', marginBottom: 8 }}>Aktív feliratkozó</div>
                  <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-0.04em', fontFamily: 'ui-monospace,monospace', lineHeight: 1, color: '#22c55e' }}>{fmt(stats.activeSubs)}</div>
                  {stats.newSubs > 0
                    ? <div style={{ fontSize: 10, color: '#22c55e', marginTop: 5, fontFamily: 'ui-monospace,monospace' }}>+{stats.newSubs} új (7n)</div>
                    : <div style={{ fontSize: 10, color: 'var(--theme-elevation-400)', marginTop: 5 }}>Nincs új (7n)</div>}
                  <div style={{ fontSize: 10, color: 'var(--theme-elevation-400)', marginTop: 2 }}>Feliratkozók →</div>
                </div>

                <div className="cp-stat-card" onClick={() => setTab('Kampányok')} style={{ cursor: 'pointer' }}>
                  <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--theme-elevation-400)', fontFamily: 'ui-monospace,monospace', marginBottom: 8 }}>Email / hó</div>
                  <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-0.04em', fontFamily: 'ui-monospace,monospace', lineHeight: 1, color: '#7c6af7' }}>{fmt(stats.monthSent)}</div>
                  {stats.prevMonthSent > 0 ? (() => {
                    const d = Math.round(((stats.monthSent - stats.prevMonthSent) / stats.prevMonthSent) * 100)
                    return <div style={{ fontSize: 10, color: d > 0 ? '#22c55e' : d < 0 ? '#ef4444' : 'var(--theme-elevation-400)', marginTop: 5, fontFamily: 'ui-monospace,monospace' }}>{d > 0 ? '↑' : d < 0 ? '↓' : '—'} {Math.abs(d)}% előző hóhoz</div>
                  })() : <div style={{ fontSize: 10, color: 'var(--theme-elevation-400)', marginTop: 5 }}>Nincs előző hó adat</div>}
                  <div style={{ fontSize: 10, color: 'var(--theme-elevation-400)', marginTop: 2 }}>Kampányok →</div>
                </div>
              </div>

              {/* ── Konverziós arány ── */}
              {stats.totalLeads > 0 && (() => {
                const convRate = Math.round((stats.activeSubs / stats.totalLeads) * 100)
                const convColor = convRate >= 30 ? '#22c55e' : convRate >= 10 ? '#f59e0b' : '#ef4444'
                return (
                  <div className="cp-card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--theme-elevation-400)', fontFamily: 'ui-monospace,monospace', marginBottom: 6 }}>Konverziós arány</div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                        <span style={{ fontSize: 28, fontWeight: 700, fontFamily: 'ui-monospace,monospace', color: convColor, letterSpacing: '-0.04em' }}>{convRate}%</span>
                        <span style={{ fontSize: 11, color: 'var(--theme-elevation-400)' }}>érdeklődőből lett feliratkozó</span>
                      </div>
                      <div style={{ height: 3, background: 'var(--theme-elevation-150)', borderRadius: 999, overflow: 'hidden', marginTop: 8 }}>
                        <div style={{ height: '100%', width: `${Math.min(convRate, 100)}%`, background: convColor, borderRadius: 999, transition: 'width .8s' }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                        <span style={{ fontSize: 10, color: 'var(--theme-elevation-400)', fontFamily: 'ui-monospace,monospace' }}>{stats.totalLeads} érdeklődő</span>
                        <span style={{ fontSize: 10, color: 'var(--theme-elevation-400)', fontFamily: 'ui-monospace,monospace' }}>{stats.activeSubs} aktív feliratkozó</span>
                      </div>
                    </div>
                  </div>
                )
              })()}

              {/* ── HU/EN breakdown ── */}
              {(stats.huSubs != null || stats.enSubs != null) && (
                <div className="cp-card" style={{ padding: '12px 16px' }}>
                  <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--theme-elevation-400)', fontFamily: 'ui-monospace,monospace', marginBottom: 10 }}>Feliratkozók nyelv szerint</div>
                  <div className="cp-hu-en">
                    {([['hu', stats.huSubs], ['en', stats.enSubs]] as [string, number | undefined][]).map(([lang, count]) => count != null && (
                      <div key={lang} style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                          <span className={`cp-badge cp-badge-${lang}`}>{lang.toUpperCase()}</span>
                          <span style={{ fontFamily: 'ui-monospace,monospace', fontSize: 13, fontWeight: 700 }}>{count}</span>
                        </div>
                        <div style={{ height: 3, background: 'var(--theme-elevation-150)', borderRadius: 999, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${stats.activeSubs ? Math.round((count / stats.activeSubs) * 100) : 0}%`, background: '#7c6af7', borderRadius: 999, transition: 'width .8s' }} />
                        </div>
                        <div style={{ fontSize: 9, color: 'var(--theme-elevation-400)', marginTop: 3, fontFamily: 'ui-monospace,monospace' }}>{stats.activeSubs ? Math.round((count / stats.activeSubs) * 100) : 0}% az aktívakból</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Kvóta ── */}
              <div className="cp-card" style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                  <span style={{ fontSize: 11, color: 'var(--theme-elevation-500)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em', fontFamily: 'ui-monospace,monospace' }}>Havi email kvóta</span>
                  <span style={{ fontSize: 12, fontFamily: 'ui-monospace,monospace', fontWeight: 700, color: (stats.monthSent / QUOTA) >= .9 ? '#ef4444' : (stats.monthSent / QUOTA) >= .7 ? '#f59e0b' : '#22c55e' }}>{fmt(stats.monthSent)} / {fmt(QUOTA)}</span>
                </div>
                <div style={{ height: 4, background: 'var(--theme-elevation-150)', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.min((stats.monthSent / QUOTA) * 100, 100)}%`, borderRadius: 999, background: (stats.monthSent / QUOTA) >= .9 ? '#ef4444' : (stats.monthSent / QUOTA) >= .7 ? '#f59e0b' : '#22c55e', transition: 'width .8s' }} />
                </div>
                <div style={{ fontSize: 10, color: 'var(--theme-elevation-400)', marginTop: 4, textAlign: 'right', fontFamily: 'ui-monospace,monospace' }}>{fmt(QUOTA - stats.monthSent)} maradt</div>
              </div>

              {/* ── Havi chart ── */}
              {monthly.length > 1 && <div className="cp-card" style={{ padding: '14px 16px' }}><MonthBars data={monthly} /></div>}
            </div>
        )}

        {/* ─── ÉRDEKLŐDŐK ────────────────────────────────────────────── */}
        {tab === 'Érdeklődők' && (
          <div className="cp-w cp-card">
            <div className="cp-filter-bar">
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--theme-elevation-500)', fontFamily: 'ui-monospace,monospace', flexShrink: 0 }}>
                Érdeklődők {leadsTotal > 0 ? `(${leadsTotal})` : ''}
              </span>
              <div className="cp-filter-chips">
                {[['all', 'Összes'], ['new', 'Új'], ['in_progress', 'Folyamatban'], ['done', 'Kész']].map(([v, l]) => (
                  <button key={v} className={`cp-chip${leadsState === v ? ' active' : ''}`} onClick={() => { setLeadsState(v); setLeadsPage(1) }}>{l}</button>
                ))}
              </div>
              <input
                className="cp-input"
                placeholder="Keresés névben / emailben..."
                value={leadsSearch}
                onChange={e => setLeadsSearch(e.target.value)}
                style={{ flex: '1 1 160px', minWidth: 0 }}
              />
              <button className="cp-btn cp-btn-danger" onClick={() => setDeleteAllLeadsConfirm(true)} style={{ fontSize: 11, padding: '4px 10px', flexShrink: 0 }}>Összes törlése</button>
            </div>
            {leadsLoading
              ? <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 120, gap: 8, color: 'var(--theme-elevation-400)', fontSize: 13 }}><Spinner /> Betöltés...</div>
              : leads.length === 0
                ? <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--theme-elevation-400)' }}>
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" style={{ opacity: .3, marginBottom: 10 }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>Még nincs érdeklődő</div>
                    <div style={{ fontSize: 11, marginTop: 4 }}>A kontakt űrlapon beérkező üzenetek itt jelennek meg</div>
                  </div>
                : filteredLeads.length === 0
                  ? <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--theme-elevation-400)', fontSize: 13 }}>
                      Nincs találat: <strong style={{ color: 'var(--theme-text)' }}>{leadsSearch}</strong>
                    </div>
                  : <>
                  <table className="cp-table cp-leads-table">
                      <thead>
                        <tr>
                          <th>Név</th>
                          <th>Email</th>
                          <th>Üzenet</th>
                          <th>Oldal</th>
                          <th>Nyelv</th>
                          <th>Státusz</th>
                          <th>Kor</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredLeads.map(l => (
                          <tr key={l.id} className="cp-lead-row" style={{ cursor: 'pointer' }} onClick={() => setSelectedLead(l)}>
                            <td style={{ fontWeight: 500 }}>{l.name || '—'}</td>
                            <td style={{ fontFamily: 'ui-monospace,monospace', fontSize: 11, color: '#6366f1' }}>{l.email}</td>
                            <td style={{ maxWidth: 160 }}>
                              <div style={{ fontSize: 11, color: 'var(--theme-elevation-500)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.message || '—'}</div>
                            </td>
                            <td style={{ fontSize: 11, color: 'var(--theme-elevation-500)' }}>{l.page || '—'}</td>
                            <td>
                              {l.language
                                ? <span className={`cp-badge cp-badge-${l.language}`}>{l.language.toUpperCase()}</span>
                                : '—'}
                            </td>
                            <td onClick={e => e.stopPropagation()}>
                              <select className="cp-select" value={l.state || 'new'} onChange={e => changeLeadState(l.id, e.target.value)}>
                                <option value="new">Új</option>
                                <option value="in_progress">Folyamatban</option>
                                <option value="done">Kész</option>
                              </select>
                            </td>
                            <td style={{ fontSize: 11, color: 'var(--theme-elevation-400)', fontFamily: 'ui-monospace,monospace' }}>{ago(l.createdAt)}</td>
                            <td onClick={e => e.stopPropagation()}>
                              <div style={{ display: 'flex', gap: 4 }}>
                                <a href={`mailto:${l.email}?subject=Re: ${l.page || 'Érdeklődés'}`} className="cp-btn cp-btn-ghost cp-reply-btn" style={{ fontSize: 11, padding: '3px 8px', textDecoration: 'none' }} title="Válasz küldése">↩</a>
                                <button className="cp-btn cp-btn-danger" onClick={() => setDeleteLeadConfirm(l.id)} style={{ fontSize: 11, padding: '3px 8px' }}>✕</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  <Pagination page={leadsPage} pageSize={20} total={leadsTotal} onPage={p => setLeadsPage(p)} />
                </>
            }
          </div>
        )}

        {/* ─── FELIRATKOZÓK ───────────────────────────────────────────── */}
        {tab === 'Feliratkozók' && (
          <div className="cp-w cp-card">
            <div className="cp-filter-bar">
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--theme-elevation-500)', fontFamily: 'ui-monospace,monospace' }}>
                Feliratkozók
              </span>
              <div className="cp-filter-chips">
                {([
                  ['all', `Összes (${subCounts.all})`],
                  ['active', `Aktív (${subCounts.active})`],
                  ['unconfirmed', `Új (${subCounts.unconfirmed})`],
                  ['unsubscribed', `Leiratkozott (${subCounts.unsubscribed})`],
                ] as [string, string][]).map(([v, l]) => (
                  <button key={v} className={`cp-chip${subsFilter === v ? ' active' : ''}`} onClick={() => setSubsFilter(v)}>{l}</button>
                ))}
              </div>
              <div className="cp-filter-chips">
                {[['all', 'Mind'], ['hu', 'HU'], ['en', 'EN']].map(([v, l]) => (
                  <button key={v} className={`cp-chip${subsLang === v ? ' active' : ''}`} onClick={() => { setSubsLang(v); setSubsPage(1) }}>{l}</button>
                ))}
              </div>
              <input
                className="cp-input"
                placeholder="Keresés emailben / névben..."
                value={subsSearch}
                onChange={e => setSubsSearch(e.target.value)}
                style={{ flex: '1 1 160px', minWidth: 0 }}
              />
              <a href="/admin/collections/newsletters" style={{ marginLeft: 'auto', fontSize: 11, color: '#6366f1', textDecoration: 'none', fontWeight: 600, flexShrink: 0 }}>Szerkesztés →</a>
            </div>
            {subsLoading
              ? <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 120, gap: 8, color: 'var(--theme-elevation-400)', fontSize: 13 }}><Spinner /> Betöltés...</div>
              : subs.length === 0
                ? <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--theme-elevation-400)' }}>
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" style={{ opacity: .3, marginBottom: 10 }}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>Még nincs feliratkozó</div>
                    <div style={{ fontSize: 11, marginTop: 4 }}>A hírlevél feliratkozók itt jelennek meg</div>
                  </div>
              : filteredSubs.length === 0
                ? <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--theme-elevation-400)', fontSize: 13 }}>
                    {subsSearch
                      ? <>Nincs találat: <strong style={{ color: 'var(--theme-text)' }}>{subsSearch}</strong></>
                      : 'Nincs feliratkozó ebben a kategóriában'}
                  </div>
                : <>
                  <table className="cp-table cp-subs-table">
                      <thead>
                        <tr>
                          <th>Email</th>
                          <th>Név</th>
                          <th>Státusz</th>
                          <th>Nyelv</th>
                          <th>Megerősített</th>
                          <th>Kor</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredSubs.map(s => (
                          <tr key={s.id} onClick={() => setSelectedSub(s)} style={{ cursor: 'pointer' }}>
                            <td style={{ fontFamily: 'ui-monospace,monospace', fontSize: 12, color: '#6366f1' }}>{s.email}</td>
                            <td style={{ fontWeight: 500 }}>{s.name || '—'}</td>
                            <td>
                              {s.unsubscribed
                                ? <span className="cp-badge cp-badge-unsub">leiratkozott</span>
                                : <span className="cp-badge cp-badge-active">aktív</span>}
                            </td>
                            <td>
                              <span className={`cp-badge cp-badge-${s.language || 'hu'}`}>
                                {(s.language || 'hu').toUpperCase()}
                              </span>
                            </td>
                            <td>
                              <span style={{ fontSize: 11, color: s.confirmed ? '#22c55e' : 'var(--theme-elevation-400)' }}>
                                {s.confirmed ? '✓ Igen' : '– Nem'}
                              </span>
                            </td>
                            <td style={{ fontSize: 11, color: 'var(--theme-elevation-400)', fontFamily: 'ui-monospace,monospace' }}>{ago(s.createdAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  <div style={{ padding: '10px 14px', borderTop: '1px solid var(--theme-elevation-150)', fontSize: 12, color: 'var(--theme-elevation-400)', fontFamily: 'ui-monospace,monospace' }}>
                    {filteredSubs.length} feliratkozó látható
                  </div>
                </>
            }
          </div>
        )}

        {/* ─── KAMPÁNYOK ──────────────────────────────────────────────── */}
        {tab === 'Kampányok' && (
          <div className="cp-w cp-campaign-layout">

            {/* Image dialog */}
            {imgDialog && (
              <div className="cp-modal-overlay">
                <div className="cp-modal" style={{ maxWidth: 380 }} onClick={e => e.stopPropagation()}>
                  <div className="cp-modal-header">
                    <div className="cp-modal-title">Kép beillesztése</div>
                    <button className="cp-btn cp-btn-ghost" onClick={() => setImgDialog(false)} style={{ padding: '3px 8px', fontSize: 11 }}>✕</button>
                  </div>
                  <div className="cp-modal-body">
                    <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--theme-elevation-500)', display: 'block', marginBottom: 4 }}>Kép URL *</label>
                    <input className="cp-input" value={imgUrl} onChange={e => setImgUrl(e.target.value)} placeholder="https://..." style={{ width: '100%', marginBottom: 10 }} autoFocus />
                    <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--theme-elevation-500)', display: 'block', marginBottom: 4 }}>Alt szöveg</label>
                    <input className="cp-input" value={imgAlt} onChange={e => setImgAlt(e.target.value)} placeholder="Kép leírása..." style={{ width: '100%', marginBottom: 10 }} />
                    <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--theme-elevation-500)', display: 'block', marginBottom: 4 }}>Szélesség (px, opcionális)</label>
                    <input className="cp-input" value={imgWidth} onChange={e => setImgWidth(e.target.value)} placeholder="pl. 480 (üresen: max-width:100%)" style={{ width: '100%' }} />
                  </div>
                  <div className="cp-modal-footer">
                    <button className="cp-btn cp-btn-ghost" onClick={() => setImgDialog(false)}>Mégse</button>
                    <button className="cp-btn cp-btn-primary" onClick={insertImg}>Beillesztés</button>
                  </div>
                </div>
              </div>
            )}

            {/* Link dialog */}
            {linkDialog && (
              <div className="cp-modal-overlay">
                <div className="cp-modal" style={{ maxWidth: 380 }} onClick={e => e.stopPropagation()}>
                  <div className="cp-modal-header">
                    <div className="cp-modal-title">Link beillesztése</div>
                    <button className="cp-btn cp-btn-ghost" onClick={() => setLinkDialog(false)} style={{ padding: '3px 8px', fontSize: 11 }}>✕</button>
                  </div>
                  <div className="cp-modal-body">
                    <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--theme-elevation-500)', display: 'block', marginBottom: 4 }}>URL *</label>
                    <input className="cp-input" value={linkUrl} onChange={e => setLinkUrl(e.target.value)} placeholder="https://..." style={{ width: '100%', marginBottom: 10 }} autoFocus />
                    <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--theme-elevation-500)', display: 'block', marginBottom: 4 }}>Link szövege</label>
                    <input className="cp-input" value={linkText} onChange={e => setLinkText(e.target.value)} placeholder="Kattints ide..." style={{ width: '100%' }} />
                  </div>
                  <div className="cp-modal-footer">
                    <button className="cp-btn cp-btn-ghost" onClick={() => setLinkDialog(false)}>Mégse</button>
                    <button className="cp-btn cp-btn-primary" onClick={insertLink}>Beillesztés</button>
                  </div>
                </div>
              </div>
            )}

            {/* Campaign editor */}
            <div style={{ flex: '1 1 480px', minWidth: 0 }}>
              <div className="cp-card">
                <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--theme-elevation-150)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--theme-text)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    ✉ Hírlevél szerkesztő
                  </span>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {(['editor', 'html', 'preview'] as const).map((m, i) => (
                      <button
                        key={m}
                        className="cp-btn cp-btn-ghost"
                        onClick={() => {
                          if (m === 'html' && editorMode === 'editor') {
                            setCampaignHtml(buildFullHtml(richEditorRef.current?.innerHTML || ''))
                          }
                          setEditorMode(m)
                        }}
                        style={{ fontSize: 11, padding: '3px 10px', fontWeight: editorMode === m ? 700 : undefined, color: editorMode === m ? 'var(--theme-text)' : undefined }}
                      >
                        {['Szerkesztő', 'HTML', 'Előnézet'][i]}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--theme-elevation-500)', display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.05em' }}>Tárgy</label>
                    <input className="cp-input" value={campaignSubject} onChange={e => setCampaignSubject(e.target.value)} placeholder="pl. Új funkció a Davelopmentnél" style={{ width: '100%' }} />
                  </div>

                  {/* Szerkesztő mode: rich editor */}
                  {editorMode === 'editor' && (
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--theme-elevation-500)', display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.05em' }}>Tartalom</label>
                      {/* Rich editor toolbar */}
                      <div className="cp-toolbar-editor">
                        <button className="cp-toolbar-btn" style={{ fontWeight: 700 }} onMouseDown={e => { e.preventDefault(); richEditorRef.current?.focus(); document.execCommand('bold') }}><b>B</b></button>
                        <button className="cp-toolbar-btn" onMouseDown={e => { e.preventDefault(); richEditorRef.current?.focus(); document.execCommand('italic') }}><em>I</em></button>
                        <button className="cp-toolbar-btn" onMouseDown={e => { e.preventDefault(); richEditorRef.current?.focus(); document.execCommand('underline') }}><u>U</u></button>
                        <div style={{ width: 1, background: 'var(--theme-elevation-200)', margin: '0 2px' }} />
                        <button className="cp-toolbar-btn" onMouseDown={e => { e.preventDefault(); richEditorRef.current?.focus(); document.execCommand('formatBlock', false, 'h1') }}>H1</button>
                        <button className="cp-toolbar-btn" onMouseDown={e => { e.preventDefault(); richEditorRef.current?.focus(); document.execCommand('formatBlock', false, 'h2') }}>H2</button>
                        <button className="cp-toolbar-btn" onMouseDown={e => { e.preventDefault(); richEditorRef.current?.focus(); document.execCommand('formatBlock', false, 'p') }}>P</button>
                        <div style={{ width: 1, background: 'var(--theme-elevation-200)', margin: '0 2px' }} />
                        <button className="cp-toolbar-btn" onMouseDown={e => { e.preventDefault(); richEditorRef.current?.focus(); document.execCommand('insertHorizontalRule') }}>─</button>
                        <button className="cp-toolbar-btn" onMouseDown={e => { e.preventDefault(); richEditorRef.current?.focus(); document.execCommand('insertUnorderedList') }}>• ul</button>
                        <div style={{ width: 1, background: 'var(--theme-elevation-200)', margin: '0 2px' }} />
                        <button className="cp-toolbar-btn" onClick={() => setImgDialog(true)} title="Kép beszúrása"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></button>
                        <button className="cp-toolbar-btn" onClick={() => setLinkDialog(true)} title="Link beszúrása"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg></button>
                        <button className="cp-toolbar-btn" onMouseDown={e => { e.preventDefault(); richEditorRef.current?.focus(); document.execCommand('removeFormat') }}>Tx</button>
                      </div>
                      <div
                        ref={richEditorRef}
                        contentEditable
                        suppressContentEditableWarning
                        data-placeholder="Kezdd el írni a hírlevelet..."
                        style={{
                          minHeight: 280,
                          padding: '12px 14px',
                          borderRadius: '0 0 8px 8px',
                          border: '1px solid var(--theme-elevation-200)',
                          borderTop: 'none',
                          background: 'var(--theme-elevation-100)',
                          color: 'var(--theme-text)',
                          fontSize: 14,
                          lineHeight: 1.7,
                          outline: 'none',
                          overflowY: 'auto',
                          fontFamily: 'inherit',
                        }}
                        onFocus={e => { e.currentTarget.style.borderColor = 'var(--theme-elevation-400)' }}
                        onBlur={e => { e.currentTarget.style.borderColor = 'var(--theme-elevation-200)' }}
                      />
                      <style>{`[contenteditable]:empty:before{content:attr(data-placeholder);color:var(--theme-elevation-300);pointer-events:none;}[contenteditable] h1{font-size:22px;font-weight:700;color:var(--theme-text);margin:16px 0 10px;}[contenteditable] h2{font-size:18px;font-weight:600;color:var(--theme-text);margin:12px 0 8px;}[contenteditable] p{margin:0 0 10px;}[contenteditable] ul,[contenteditable] ol{margin:0 0 10px;padding-left:22px;}[contenteditable] hr{border:none;border-top:1px solid var(--theme-elevation-200);margin:18px 0;}[contenteditable] a{color:#6366f1;}`}</style>
                    </div>
                  )}

                  {/* HTML mode */}
                  {editorMode === 'html' && (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--theme-elevation-500)', textTransform: 'uppercase', letterSpacing: '.05em' }}>HTML tartalom</label>
                        <div style={{ display: 'flex', gap: 5 }}>
                          <button className="cp-btn cp-btn-ghost" onClick={() => { if (!campaignHtml) setCampaignHtml(HTML_TEMPLATE) }} style={{ fontSize: 11, padding: '3px 10px' }}>Sablon betöltése</button>
                          <button className="cp-btn cp-btn-ghost" onClick={() => setCampaignHtml(buildFullHtml(richEditorRef.current?.innerHTML || ''))} style={{ fontSize: 11, padding: '3px 10px' }}>← Betöltés szerkesztőből</button>
                        </div>
                      </div>
                      {/* HTML toolbar — works with wrapOrInsert on the textarea */}
                      <div style={{ padding: '7px 10px', background: 'var(--theme-elevation-100)', borderRadius: '7px 7px 0 0', border: '1px solid var(--theme-elevation-200)', borderBottom: 'none', display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {TOOLBAR_ACTIONS.map(a => (
                          <button
                            key={a.label}
                            title={a.title}
                            className="cp-toolbar-btn"
                            onClick={() => wrapOrInsert(a.open, a.close, a.placeholder)}
                            style={{ fontWeight: a.label === 'B' ? 700 : 600, fontStyle: a.label === 'I' ? 'italic' : undefined }}
                          >
                            {a.label}
                          </button>
                        ))}
                        <div style={{ width: 1, background: 'var(--theme-elevation-200)', margin: '0 2px' }} />
                        <button className="cp-toolbar-btn" onClick={() => setImgDialog(true)} title="Kép beszúrása"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></button>
                        <button className="cp-toolbar-btn" onClick={() => setLinkDialog(true)} title="Link beszúrása"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg></button>
                      </div>
                      <textarea
                        ref={textareaRef}
                        className="cp-textarea"
                        value={campaignHtml}
                        onChange={e => setCampaignHtml(e.target.value)}
                        placeholder="<!DOCTYPE html>..."
                        style={{ width: '100%', minHeight: 360, borderRadius: '0 0 8px 8px' }}
                      />
                      <div style={{ fontSize: 11, color: 'var(--theme-elevation-400)', marginTop: 4 }}>
                        A <span style={{ fontFamily: 'ui-monospace,monospace', color: 'var(--theme-elevation-500)' }}>{'{{unsubscribe_url}}'}</span> automatikusan kicserélődik leiratkozó linkre.
                      </div>
                    </div>
                  )}

                  {/* Preview mode */}
                  {editorMode === 'preview' && (
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--theme-elevation-500)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.05em' }}>Előnézet</label>
                      <div style={{ border: '1px solid var(--theme-elevation-200)', borderRadius: 8, overflow: 'hidden' }}>
                        <iframe
                          srcDoc={getFinalHtml()}
                          style={{ width: '100%', height: 500, border: 'none' }}
                          title="preview"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="cp-campaign-sidebar">

              {/* Kinek megy? */}
              <div className="cp-sidebar-card">
                <div className="cp-sidebar-card-header">
                  <div className="cp-sidebar-icon" style={{ background: 'rgba(99,102,241,.1)', color: '#6366f1' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--theme-text)' }}>Kinek megy?</div>
                    <div style={{ fontSize: 11, color: 'var(--theme-elevation-400)' }}>Válaszd ki a célcsoportot</div>
                  </div>
                </div>
                <div className="cp-sidebar-card-body">
                  <select className="cp-select" value={campaignLang} onChange={e => setCampaignLang(e.target.value)} style={{ width: '100%', fontSize: 12 }}>
                    <option value="all">Mindenki – {stats?.activeSubs ?? '...'} fő</option>
                    <option value="hu">Magyar feliratkozók – {stats?.huSubs ?? '...'} fő</option>
                    <option value="en">Angol feliratkozók – {stats?.enSubs ?? '...'} fő</option>
                  </select>
                  <div style={{ background: 'var(--theme-elevation-100)', border: '1px solid var(--theme-elevation-150)', borderRadius: 8, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 7, background: 'rgba(34,197,94,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22c55e', flexShrink: 0 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>
                    </div>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: '#22c55e', fontFamily: 'ui-monospace,monospace', letterSpacing: '-0.5px' }}>{targetCount}</div>
                      <div style={{ fontSize: 11, color: 'var(--theme-elevation-400)' }}>
                        {campaignLang === 'hu' ? 'Magyar feliratkozók' : campaignLang === 'en' ? 'Angol feliratkozók' : 'Minden aktív feliratkozó'}
                      </div>
                    </div>
                  </div>
                  {targetCount === 0 && (
                    <div style={{ fontSize: 12, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: 6 }}>
                      ⚠ Nincs aktív feliratkozó
                    </div>
                  )}
                </div>
              </div>

              {/* Teszt küldés */}
              <div className="cp-sidebar-card">
                <div className="cp-sidebar-card-header">
                  <div className="cp-sidebar-icon" style={{ background: 'rgba(245,158,11,.1)', color: '#f59e0b' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 3h6M9 3v7l-4.5 9A1 1 0 0 0 5.5 21h13a1 1 0 0 0 .9-1.45L15 10V3"/><path d="M6.5 15h11"/></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--theme-text)' }}>Teszt küldés</div>
                    <div style={{ fontSize: 11, color: 'var(--theme-elevation-400)' }}>Ellenőrizd mielőtt kiküldöd</div>
                  </div>
                </div>
                <div className="cp-sidebar-card-body">
                  <input className="cp-input" type="email" value={testEmail} onChange={e => setTestEmail(e.target.value)} placeholder="hello.davelopment@gmail.com" style={{ width: '100%' }} />
                  <button className="cp-btn cp-btn-ghost" onClick={() => sendCampaign(true)} disabled={sendingTest || !testEmail || !campaignSubject} style={{ width: '100%', justifyContent: 'center' }}>
                    {sendingTest ? <><Spinner /> Küldés...</> : '↗ Teszt elküldése'}
                  </button>
                  <div style={{ fontSize: 11, color: 'var(--theme-elevation-400)', lineHeight: 1.5 }}>A tárgyban <span style={{ fontFamily: 'ui-monospace,monospace', color: 'var(--theme-elevation-500)' }}>[TEST]</span> prefix lesz.</div>
                </div>
              </div>

              {/* Éles küldés */}
              <div className="cp-sidebar-card">
                <div className="cp-sidebar-card-header">
                  <div className="cp-sidebar-icon" style={{ background: 'rgba(34,197,94,.08)', color: '#22c55e' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--theme-text)' }}>Éles küldés</div>
                    <div style={{ fontSize: 11, color: '#ef4444' }}>Visszavonhatatlan</div>
                  </div>
                </div>
                <div className="cp-sidebar-card-body">
                  <button
                    className="cp-btn cp-btn-success"
                    onClick={() => setSendConfirmOpen(true)}
                    disabled={sending || !campaignSubject || targetCount === 0}
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    {sending ? <><Spinner /> Küldés...</> : `↗ Küldés – ${targetCount} főnek`}
                  </button>
                </div>
              </div>

              {/* Campaign history sidebar */}
              <div className="cp-sidebar-card">
                <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--theme-elevation-150)' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--theme-elevation-500)', fontFamily: 'ui-monospace,monospace' }}>Előzmények</span>
                </div>
                {campsLoading
                  ? <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 80, gap: 8, color: 'var(--theme-elevation-400)', fontSize: 12 }}><Spinner /></div>
                  : campaigns.length === 0
                    ? <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--theme-elevation-400)', fontSize: 12 }}>Még nincs elküldött kampány</div>
                    : campaigns.map(c => (
                      <div key={c.id} className="cp-history-row" onClick={() => setSelectedCampaign(c)} style={{ opacity: c.isTest ? 0.6 : 1 }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--theme-text)', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.subject || '—'}</div>
                          <div style={{ fontSize: 10, color: 'var(--theme-elevation-400)', fontFamily: 'ui-monospace,monospace' }}>{ago(c.createdAt)}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                          {c.isTest && (
                            <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 5, background: 'rgba(245,158,11,.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,.2)', fontFamily: 'ui-monospace,monospace', fontWeight: 600 }}>TEST</span>
                          )}
                          {c.ref_id && c.ref_id !== 'test' && c.ref_id !== 'campaign' && (
                            <span style={{ fontSize: 10, color: '#22c55e', fontFamily: 'ui-monospace,monospace' }}>{c.ref_id} fő</span>
                          )}
                        </div>
                      </div>
                    ))
                }
              </div>
            </div>
          </div>
        )}

        {/* ─── BEÁLLÍTÁSOK ─────────────────────────────────────────────── */}
        {tab === 'Beállítások' && (
          <div className="cp-w cp-settings-grid">
            {[
              {
                iconColor: '#f59e0b', iconBg: 'rgba(245,158,11,.1)', title: 'Resend konfiguráció', subtitle: 'Email küldő szolgáltatás',
                icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
                rows: [
                  { k: 'Szolgáltatás', v: 'Resend.com' },
                  { k: 'API kulcs', v: '.env-ből betöltve' },
                  { k: 'Feladó', v: 'hello@davelopment.hu' },
                  { k: 'Domain', v: 'davelopment.hu ✓ Verified' },
                  { k: 'Értesítések', v: 'hello.davelopment@gmail.com' },
                  { k: 'Free tier', v: '3 000 email/hó · 100/nap' },
                ],
              },
              {
                iconColor: '#60a5fa', iconBg: 'rgba(37,99,235,.1)', title: 'DNS rekordok', subtitle: 'Rackforest – davelopment.hu',
                icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
                rows: [
                  { k: 'TXT · resend._domainkey', v: 'DKIM ✓' },
                  { k: 'MX · send', v: 'Visszapattanó email ✓' },
                  { k: 'TXT · send', v: 'SPF ✓' },
                ],
              },
              {
                iconColor: '#22c55e', iconBg: 'rgba(34,197,94,.08)', title: 'Biztonság', subtitle: 'Környezeti változók',
                icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
                rows: [
                  { k: 'RESEND_API_KEY', v: 'GitHub Secrets ✓' },
                  { k: 'NOTIFY_EMAIL', v: 'hello.davelopment@gmail.com' },
                ],
              },
            ].map(s => (
              <div key={s.title} className="cp-card">
                <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--theme-elevation-150)', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 7, background: s.iconBg, color: s.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{s.icon}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--theme-text)' }}>{s.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--theme-elevation-400)' }}>{s.subtitle}</div>
                  </div>
                </div>
                <div style={{ padding: '12px 16px' }}>
                  {s.rows.map(r => (
                    <div key={r.k} className="cp-info-row">
                      <span className="cp-info-key">{r.k}</span>
                      <span className="cp-info-val">{r.v}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Quota card */}
            <div className="cp-card cp-quota-span" style={{ gridColumn: '1 / -1' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--theme-elevation-150)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: 7, background: 'rgba(99,102,241,.1)', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--theme-text)' }}>Resend kvóta</div>
                  <div style={{ fontSize: 11, color: 'var(--theme-elevation-400)' }}>Free tier: 3 000/hó · 100/nap</div>
                </div>
              </div>
              {stats && (
                <div style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: 'var(--theme-elevation-500)' }}>Havi felhasználás</span>
                    <span style={{ fontSize: 18, fontWeight: 700, fontFamily: 'ui-monospace,monospace', color: (stats.monthSent / QUOTA) >= .9 ? '#ef4444' : (stats.monthSent / QUOTA) >= .7 ? '#f59e0b' : '#6366f1' }}>
                      {stats.monthSent} <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--theme-elevation-400)' }}>/ {QUOTA}</span>
                    </span>
                  </div>
                  <div style={{ height: 6, background: 'var(--theme-elevation-150)', borderRadius: 3, overflow: 'hidden', marginBottom: 6 }}>
                    <div style={{ height: '100%', width: `${Math.min((stats.monthSent / QUOTA) * 100, 100)}%`, background: (stats.monthSent / QUOTA) >= .9 ? '#ef4444' : (stats.monthSent / QUOTA) >= .7 ? '#f59e0b' : '#6366f1', borderRadius: 3, transition: 'width .8s' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 11, color: 'var(--theme-elevation-400)', fontFamily: 'ui-monospace,monospace' }}>{Math.round((stats.monthSent / QUOTA) * 100)}% felhasználva</span>
                    <span style={{ fontSize: 11, fontWeight: 600, fontFamily: 'ui-monospace,monospace', color: (QUOTA - stats.monthSent) < 300 ? '#ef4444' : '#22c55e' }}>{QUOTA - stats.monthSent} maradt</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* ─── MODALS ─────────────────────────────────────────────────────── */}

      {selectedLead && (
        <LeadModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onUpdate={async (id, state) => { await changeLeadState(id, state) }}
        />
      )}

      {selectedSub && (
        <SubscriberModal
          sub={selectedSub}
          onClose={() => setSelectedSub(null)}
          showToast={showToast}
        />
      )}

      {selectedCampaign && (
        <CampaignHistoryModal
          campaign={selectedCampaign}
          onClose={() => setSelectedCampaign(null)}
          onLoadSubject={s => { setCampaignSubject(s); setTab('Kampányok') }}
          onResendsent={(sent, _newR) => {
            showToast('success', `Újraküldés kész: ${sent} új feliratkozónak`)
            fetch('/api/communications/campaigns').then(r => r.json()).then(c => { if (c.ok) setCampaigns(c.data) })
          }}
        />
      )}

      {deleteLeadConfirm && (
        <ConfirmDialog
          title="Érdeklődő törlése"
          message="Biztosan törlöd ezt az érdeklődőt? A művelet nem vonható vissza."
          confirmLabel="Igen, törlöm"
          danger
          onConfirm={() => deleteLead(deleteLeadConfirm)}
          onCancel={() => setDeleteLeadConfirm(null)}
        />
      )}

      {deleteAllLeadsConfirm && (
        <ConfirmDialog
          title="Összes érdeklődő törlése"
          message={`Biztosan törlöd az összes ${leadsTotal} érdeklődőt? Ez a művelet nem vonható vissza.`}
          confirmLabel="Igen, mindet törlöm"
          danger
          onConfirm={deleteAllLeads}
          onCancel={() => setDeleteAllLeadsConfirm(false)}
        />
      )}

      {sendConfirmOpen && (
        <ConfirmDialog
          title="Megerősítés szükséges"
          message={`Biztosan elkülded a „${campaignSubject}" tárgyú hírlevelet ${targetCount} főnek? Ez a művelet nem vonható vissza.`}
          confirmLabel="Igen, küldés"
          onConfirm={() => sendCampaign(false)}
          onCancel={() => setSendConfirmOpen(false)}
        />
      )}
    </>
  )
}
