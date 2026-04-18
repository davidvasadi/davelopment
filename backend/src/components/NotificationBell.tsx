'use client'
import { useState, useEffect, useRef } from 'react'

type NewsletterDoc = { id: string; email?: string; name?: string; createdAt: string }
type ContactDoc = { id: string; email?: string; name?: string; message?: string; page?: string; state?: string; createdAt: string }
type CampaignDoc = { id: number; subject: string; sentCount: number; createdAt: string }
type NotifData = { newsletters: NewsletterDoc[]; contacts: ContactDoc[]; campaigns: CampaignDoc[]; lastSeenAt: string | null }

const ago = (t: string) => {
  const m = Math.floor((Date.now() - new Date(t).getTime()) / 60000)
  if (m < 1) return 'most'
  if (m < 60) return `${m}p`
  if (m < 1440) return `${Math.floor(m / 60)}ó`
  return `${Math.floor(m / 1440)}n`
}

const fmtDate = (t: string) => {
  const d = new Date(t)
  return d.toLocaleDateString('hu-HU', { month: 'short', day: 'numeric' })
}

const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n)

// ── Contact Detail Modal ──────────────────────────────────────────────────────
function ContactModal({ contact, onClose }: { contact: ContactDoc; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--theme-elevation-0)', border: '1px solid var(--theme-elevation-200)',
          borderRadius: 12, width: '100%', maxWidth: 420,
          boxShadow: '0 20px 60px rgba(0,0,0,0.25)', overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--theme-elevation-150)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--theme-text)', fontFamily: 'var(--font-body)' }}>
            {contact.name ?? contact.email ?? 'Kapcsolatfelvétel'}
          </span>
          <button
            onClick={onClose}
            style={{ width: 24, height: 24, borderRadius: 5, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--theme-elevation-500)', padding: 0 }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--theme-elevation-150)'; e.currentTarget.style.color = 'var(--theme-text)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--theme-elevation-500)' }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Email row */}
          {contact.email && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--theme-elevation-400)', marginBottom: 2, fontFamily: 'ui-monospace,monospace' }}>Email</div>
                <div style={{ fontSize: 12, color: 'var(--theme-text)', fontFamily: 'var(--font-body)', wordBreak: 'break-all' }}>{contact.email}</div>
              </div>
              <a
                href={`mailto:${contact.email}`}
                style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, color: '#3b82f6', textDecoration: 'none', padding: '4px 10px', borderRadius: 6, border: '1px solid rgba(59,130,246,0.3)', background: 'rgba(59,130,246,0.07)', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.15)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.07)' }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/></svg>
                Válasz
              </a>
            </div>
          )}

          {/* Message */}
          {contact.message && (
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--theme-elevation-400)', marginBottom: 4, fontFamily: 'ui-monospace,monospace' }}>Üzenet</div>
              <div style={{ fontSize: 12, color: 'var(--theme-text)', fontFamily: 'var(--font-body)', lineHeight: '1.55', background: 'var(--theme-elevation-50)', border: '1px solid var(--theme-elevation-150)', borderRadius: 7, padding: '8px 10px', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {contact.message}
              </div>
            </div>
          )}

          {/* Page + State + Date row */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {contact.page && (
              <div style={{ flex: 1, minWidth: 100 }}>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--theme-elevation-400)', marginBottom: 2, fontFamily: 'ui-monospace,monospace' }}>Oldal</div>
                <div style={{ fontSize: 11, color: 'var(--theme-text)', fontFamily: 'var(--font-body)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{contact.page}</div>
              </div>
            )}
            {contact.state && (
              <div style={{ flex: 1, minWidth: 80 }}>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--theme-elevation-400)', marginBottom: 2, fontFamily: 'ui-monospace,monospace' }}>Állapot</div>
                <div style={{ fontSize: 11, color: 'var(--theme-text)', fontFamily: 'var(--font-body)' }}>{contact.state}</div>
              </div>
            )}
            <div style={{ flex: 1, minWidth: 80 }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--theme-elevation-400)', marginBottom: 2, fontFamily: 'ui-monospace,monospace' }}>Időpont</div>
              <div style={{ fontSize: 11, color: 'var(--theme-text)', fontFamily: 'ui-monospace,monospace' }}>{fmtDate(contact.createdAt)}</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '10px 16px', borderTop: '1px solid var(--theme-elevation-150)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a
            href={`/admin/collections/contacts/${contact.id}`}
            style={{ fontSize: 12, color: 'var(--theme-elevation-500)', textDecoration: 'none', fontFamily: 'var(--font-body)', display: 'inline-flex', alignItems: 'center', gap: 4 }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--theme-text)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--theme-elevation-500)' }}
          >
            Megnyitás a CMS-ben
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </a>
          <button
            onClick={onClose}
            style={{ fontSize: 12, padding: '4px 12px', borderRadius: 6, border: '1px solid var(--theme-elevation-200)', background: 'transparent', cursor: 'pointer', color: 'var(--theme-elevation-500)', fontFamily: 'var(--font-body)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--theme-elevation-100)'; e.currentTarget.style.color = 'var(--theme-text)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--theme-elevation-500)' }}
          >
            Bezárás
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Section header ────────────────────────────────────────────────────────────
function Section({ label, color, children }: { label: string; color: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ padding: '8px 14px 4px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--theme-elevation-400)', display: 'flex', alignItems: 'center', gap: 5 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0 }} />
        {label}
      </div>
      {children}
    </div>
  )
}

// ── Newsletter row ────────────────────────────────────────────────────────────
function NewsletterRow({ item, isNew, onClose }: { item: NewsletterDoc; isNew: boolean; onClose: () => void }) {
  return (
    <button
      onClick={() => { onClose(); window.location.href = `/admin/collections/newsletters/${item.id}` }}
      style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px', width: '100%', border: 'none', background: isNew ? 'var(--theme-elevation-50)' : 'transparent', cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-body)' }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--theme-elevation-100)'}
      onMouseLeave={e => e.currentTarget.style.background = isNew ? 'var(--theme-elevation-50)' : 'transparent'}
    >
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: isNew ? '#10b981' : 'var(--theme-elevation-300)', flexShrink: 0 }} />
      <span style={{ fontSize: 12, color: 'var(--theme-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, fontWeight: isNew ? 600 : 400 }}>{item.email ?? 'Ismeretlen'}</span>
      <span style={{ fontSize: 11, color: 'var(--theme-elevation-400)', flexShrink: 0 }}>{ago(item.createdAt)}</span>
    </button>
  )
}

// ── Contact row (with preview + modal) ────────────────────────────────────────
function ContactRow({ item, isNew, onOpenModal }: { item: ContactDoc; isNew: boolean; onOpenModal: (c: ContactDoc) => void }) {
  const preview = item.message ? item.message.slice(0, 55) + (item.message.length > 55 ? '…' : '') : null

  return (
    <div
      style={{ padding: '7px 14px', background: isNew ? 'var(--theme-elevation-50)' : 'transparent', cursor: 'pointer', fontFamily: 'var(--font-body)', borderBottom: '1px solid transparent' }}
      onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = 'var(--theme-elevation-100)'}
      onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = isNew ? 'var(--theme-elevation-50)' : 'transparent'}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: isNew ? '#3b82f6' : 'var(--theme-elevation-300)', flexShrink: 0 }} />
        <button
          onClick={() => onOpenModal(item)}
          style={{ fontSize: 12, color: 'var(--theme-text)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: isNew ? 600 : 400, fontFamily: 'var(--font-body)', padding: 0 }}
        >
          {item.name ?? item.email ?? 'Ismeretlen'}
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          {item.email && (
            <a
              href={`mailto:${item.email}`}
              title="Válasz"
              onClick={e => e.stopPropagation()}
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 18, height: 18, borderRadius: 4, color: '#3b82f6', background: 'rgba(59,130,246,0.12)', border: 'none', textDecoration: 'none' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.25)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.12)' }}
            >
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/></svg>
            </a>
          )}
          <span style={{ fontSize: 11, color: 'var(--theme-elevation-400)' }}>{ago(item.createdAt)}</span>
        </div>
      </div>
      {preview && (
        <div style={{ fontSize: 11, color: 'var(--theme-elevation-400)', marginLeft: 14, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: '1.4' }}>
          {preview}
        </div>
      )}
    </div>
  )
}

// ── Campaign row ──────────────────────────────────────────────────────────────
function CampaignRow({ item, onClose }: { item: CampaignDoc; onClose: () => void }) {
  return (
    <button
      onClick={() => { onClose(); window.location.href = '/admin/communications' }}
      style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px', width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-body)' }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--theme-elevation-100)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#7c6af7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, color: 'var(--theme-text)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.subject}</div>
        <div style={{ fontSize: 10, color: 'var(--theme-elevation-400)', marginTop: 1, fontFamily: 'ui-monospace,monospace' }}>{fmt(item.sentCount)} cím · {fmtDate(item.createdAt)}</div>
      </div>
    </button>
  )
}

// ── Main NotificationBell ─────────────────────────────────────────────────────
export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [data, setData] = useState<NotifData>({ newsletters: [], contacts: [], campaigns: [], lastSeenAt: null })
  const [modal, setModal] = useState<ContactDoc | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  const isNew = (createdAt: string) =>
    !data.lastSeenAt || new Date(createdAt) > new Date(data.lastSeenAt)

  const newCount =
    data.newsletters.filter(n => isNew(n.createdAt)).length +
    data.contacts.filter(n => isNew(n.createdAt)).length +
    data.campaigns.filter(n => isNew(n.createdAt)).length

  useEffect(() => {
    fetch('/api/notifications').then(r => r.json()).then(d => setData({ campaigns: [], ...d })).catch(() => {})
  }, [])

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const handleOpen = () => {
    if (!open) {
      fetch('/api/notifications', { method: 'POST' }).catch(() => {})
      setData(d => ({ ...d, lastSeenAt: new Date().toISOString() }))
    }
    setOpen(v => !v)
  }

  const total = data.newsletters.length + data.contacts.length + data.campaigns.length

  return (
    <>
      <div ref={ref} style={{ position: 'relative', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        <button
          onClick={handleOpen}
          style={{
            width: 28, height: 28, borderRadius: 6, padding: 0, border: 'none',
            background: open ? 'var(--theme-elevation-100)' : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--theme-elevation-600)', position: 'relative',
            flexShrink: 0, transition: 'background 120ms',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--theme-elevation-100)'; e.currentTarget.style.color = 'var(--theme-text)' }}
          onMouseLeave={e => { if (!open) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--theme-elevation-600)' } }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          {newCount > 0 && (
            <span style={{
              position: 'absolute', top: 4, right: 4,
              width: 6, height: 6, borderRadius: '50%',
              background: '#ef4444', border: '1.5px solid var(--theme-bg)',
            }} />
          )}
        </button>

        {open && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 8px)', right: 0,
            width: 300, background: 'var(--theme-elevation-0)',
            border: '1px solid var(--theme-elevation-200)', borderRadius: 10,
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)', zIndex: 9999, overflow: 'hidden',
          }}>
            {/* Header */}
            <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--theme-elevation-150)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--theme-text)' }}>Értesítések</span>
              {total > 0 && <span style={{ fontSize: 10, fontWeight: 600, background: 'var(--theme-elevation-200)', color: 'var(--theme-text)', borderRadius: 4, padding: '1px 5px' }}>{total}</span>}
            </div>

            {/* Body */}
            <div style={{ maxHeight: 380, overflowY: 'auto' }}>
              {data.newsletters.length > 0 && (
                <Section label="Feliratkozók" color="#10b981">
                  {data.newsletters.map(item => (
                    <NewsletterRow key={item.id} item={item} isNew={isNew(item.createdAt)} onClose={() => setOpen(false)} />
                  ))}
                </Section>
              )}

              {data.contacts.length > 0 && (
                <Section label="Kapcsolatfelvételek" color="#3b82f6">
                  {data.contacts.map(item => (
                    <ContactRow key={item.id} item={item} isNew={isNew(item.createdAt)} onOpenModal={c => { setModal(c); setOpen(false) }} />
                  ))}
                </Section>
              )}

              {data.campaigns && data.campaigns.length > 0 && (
                <Section label="Kampányok" color="#7c6af7">
                  {data.campaigns.map(item => (
                    <CampaignRow key={item.id} item={item} onClose={() => setOpen(false)} />
                  ))}
                </Section>
              )}

              {total === 0 && (
                <div style={{ padding: '28px 16px', textAlign: 'center', fontSize: 12, color: 'var(--theme-elevation-400)' }}>
                  Nincs értesítés az elmúlt 7 napból
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Contact detail modal — rendered outside dropdown */}
      {modal && <ContactModal contact={modal} onClose={() => setModal(null)} />}
    </>
  )
}
