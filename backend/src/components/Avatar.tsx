'use client'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@payloadcms/ui'
import { motion, AnimatePresence } from 'framer-motion'

type Theme = 'dark' | 'light' | 'auto'

function useTheme() {
  const [theme, setTheme] = useState<Theme>('dark')
  useEffect(() => {
    const saved = (localStorage.getItem('payload-theme') as Theme) || 'dark'
    setTheme(saved)
  }, [])
  function applyTheme(t: Theme) {
    setTheme(t)
    localStorage.setItem('payload-theme', t)
    const resolved = t === 'auto'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : t
    document.documentElement.setAttribute('data-theme', resolved)
  }
  return { theme, applyTheme }
}

const SunIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
)
const MoonIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
)
const MonitorIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
  </svg>
)

const THEMES: { value: Theme; Icon: () => React.ReactElement; label: string }[] = [
  { value: 'light', Icon: SunIcon,     label: 'Világos'  },
  { value: 'dark',  Icon: MoonIcon,    label: 'Sötét'    },
  { value: 'auto',  Icon: MonitorIcon, label: 'Rendszer' },
]

export function Avatar() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { theme, applyTheme } = useTheme()

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

            {/* ── Témaváltó ── */}
            <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--theme-elevation-150)' }}>
              <div style={{ display: 'flex', background: 'var(--theme-elevation-100)', borderRadius: 8, padding: 3 }}>
                {THEMES.map(({ value, Icon }) => {
                  const active = theme === value
                  return (
                    <button key={value} onClick={() => applyTheme(value)} title={value} style={{
                      flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      padding: '6px 4px', border: 'none', borderRadius: 6, cursor: 'pointer',
                      background: 'transparent',
                      color: active ? 'var(--theme-text)' : 'var(--theme-elevation-400)',
                      transition: 'color 200ms',
                      zIndex: 1,
                    }}>
                      {active && (
                        <motion.div
                          layoutId="theme-pill"
                          style={{
                            position: 'absolute', inset: 0, borderRadius: 6,
                            background: 'var(--theme-elevation-0)',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
                            zIndex: -1,
                          }}
                          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                        />
                      )}
                      <Icon />
                    </button>
                  )
                })}
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
