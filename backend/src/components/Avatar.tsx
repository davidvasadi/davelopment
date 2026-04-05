'use client'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@payloadcms/ui'
import { motion, AnimatePresence } from 'framer-motion'

export function Avatar() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (e.metaKey && e.key === 's') { e.preventDefault(); window.location.href = '/admin/account' }
      if (e.metaKey && e.key === 'q') { e.preventDefault(); window.location.href = '/admin/logout' }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const initials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : (user?.email as string)?.[0]?.toUpperCase() ?? 'U'

  const avatarUrl = (user?.avatar as any)?.url as string | undefined

  if (!mounted) {
    return <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--theme-elevation-200)', border: '1px solid var(--theme-elevation-300)' }} />
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={e => { e.stopPropagation(); e.preventDefault(); setOpen(v => !v) }}
        style={{
          width: 28, height: 28, borderRadius: '50%', padding: 0,
          background: open ? 'var(--theme-elevation-300)' : 'var(--theme-elevation-200)',
          border: '1px solid var(--theme-elevation-300)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', fontSize: 11, fontWeight: 700,
          color: 'var(--theme-text)', letterSpacing: '0.02em',
          transition: 'background 150ms, opacity 150ms', overflow: 'hidden',
        }}
        onMouseEnter={e => { if (!avatarUrl) e.currentTarget.style.background = 'var(--theme-elevation-300)'; else e.currentTarget.style.opacity = '0.85' }}
        onMouseLeave={e => { if (!avatarUrl && !open) e.currentTarget.style.background = 'var(--theme-elevation-200)'; else e.currentTarget.style.opacity = '1' }}
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }} />
        ) : initials}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -6 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            style={{
              position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: 220,
              background: 'var(--theme-elevation-0)', border: '1px solid var(--theme-elevation-200)',
              borderRadius: 10, boxShadow: '0 8px 30px rgba(0,0,0,0.12)', zIndex: 9999, overflow: 'hidden',
              transformOrigin: 'top right',
            }}
          >
            <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--theme-elevation-150)' }}>
              {user?.name && (
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--theme-text)', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.name as string}
                </div>
              )}
              <div style={{ fontSize: 11, color: 'var(--theme-elevation-500)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.email as string}
              </div>
            </div>

            <div style={{ padding: '4px' }}>
              <MenuItem label="Fiók beállítások" href="/admin/account" onNavigate={() => setOpen(false)}
                shortcut="⌘ s"
                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>}
              />
            </div>
            <div style={{ borderTop: '1px solid var(--theme-elevation-150)', padding: '4px' }}>
              <MenuItem label="Kijelentkezés" href="/admin/logout" danger onNavigate={() => setOpen(false)}
                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function MenuItem({ href, label, icon, onNavigate, danger, shortcut }: { href: string; label: string; icon: React.ReactNode; onNavigate?: () => void; danger?: boolean; shortcut?: string }) {
  return (
    <button
      onClick={() => { onNavigate?.(); window.location.href = href }}
      style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 6, border: 'none', background: 'transparent', width: '100%', textAlign: 'left', fontSize: 13, lineHeight: 1, color: danger ? 'var(--theme-error-500)' : 'var(--theme-elevation-700)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}
      onMouseEnter={e => { e.currentTarget.style.background = danger ? 'var(--theme-error-100)' : 'var(--theme-elevation-100)'; if (!danger) e.currentTarget.style.color = 'var(--theme-text)' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = danger ? 'var(--theme-error-500)' : 'var(--theme-elevation-700)' }}
    >
      <span style={{ opacity: 0.7, display: 'flex', alignItems: 'center', flexShrink: 0 }}>{icon}</span>
      <span style={{ flex: 1, display: 'flex', alignItems: 'center' }}>{label}</span>
      {shortcut && (
        <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          {shortcut.split(' ').map((k, i) => (
            <kbd key={i} style={{
              fontSize: 12,
              fontFamily: 'ui-monospace, monospace',
              opacity: 0.6,
              padding: '2px 6px',
              borderRadius: 4,
              border: '1px solid var(--theme-elevation-300)',
              background: 'var(--theme-elevation-100)',
              color: 'inherit',
              lineHeight: 1.5,
            }}>{k}</kbd>
          ))}
        </span>
      )}
    </button>
  )
}
