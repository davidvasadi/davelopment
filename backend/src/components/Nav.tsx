'use client'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Nav struktúra ────────────────────────────────────────────────────────────

const NAV: Array<{
  group?: string
  divider?: boolean
  items?: { href: string; label: string; exact?: boolean; icon: React.ReactNode; shortcut?: string }[]
}> = [
  {
    items: [
      {
        href: '/admin',
        label: 'Dashboard',
        exact: true,
        shortcut: '⌘ D',
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
      },
    ],
  },
  {
    group: 'Analytics',
    items: [
      {
        href: '/admin/marketing',
        label: 'Marketing & SEO',
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
      },
      {
        href: '/admin/communications',
        label: 'Kommunikáció',
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
      },
    ],
  },
  { divider: true },
  {
    group: 'Tartalom',
    items: [
      {
        href: '/admin/collections/articles',
        label: 'Cikkek',
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
      },
      {
        href: '/admin/collections/products',
        label: 'Projektek',
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
      },
      {
        href: '/admin/collections/pages',
        label: 'Oldalak',
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
      },
      {
        href: '/admin/collections/media',
        label: 'Média',
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
      },
      {
        href: '/admin/collections/categories',
        label: 'Kategóriák',
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
      },
      {
        href: '/admin/collections/faqs',
        label: 'GYIK',
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
      },
      {
        href: '/admin/collections/testimonials',
        label: 'Vélemények',
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
      },
      {
        href: '/admin/collections/logos',
        label: 'Logók',
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
      },
      {
        href: '/admin/collections/plans',
        label: 'Árak',
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
      },
    ],
  },
  {
    group: 'Weboldal',
    items: [
      {
        href: '/admin/globals/global',
        label: 'Navbar & Footer',
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="4" rx="1"/><rect x="3" y="10" width="18" height="7" rx="1"/><rect x="3" y="20" width="18" height="1" rx="1"/></svg>,
      },
      {
        href: '/admin/globals/service',
        label: 'Szolgáltatások',
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
      },
      {
        href: '/admin/globals/blog-page',
        label: 'Blog oldal',
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
      },
      {
        href: '/admin/globals/product-page',
        label: 'Projekt oldal',
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
      },
    ],
  },
  {
    group: 'Rendszer',
    items: [
      {
        href: '/admin/collections/users',
        label: 'Felhasználók',
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
      },
      {
        href: '/admin/collections/redirections',
        label: 'Átirányítások',
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>,
      },
    ],
  },
]

const SEARCH_ITEMS = [
  { label: 'Dashboard', href: '/admin', type: 'Oldal' },
  { label: 'Marketing & SEO', href: '/admin/marketing', type: 'Oldal' },
  { label: 'Kommunikáció', href: '/admin/communications', type: 'Oldal' },
  { label: 'Cikkek', href: '/admin/collections/articles', type: 'Gyűjtemény' },
  { label: 'Projektek', href: '/admin/collections/products', type: 'Gyűjtemény' },
  { label: 'Oldalak', href: '/admin/collections/pages', type: 'Gyűjtemény' },
  { label: 'Média', href: '/admin/collections/media', type: 'Gyűjtemény' },
  { label: 'Kategóriák', href: '/admin/collections/categories', type: 'Gyűjtemény' },
  { label: 'GYIK', href: '/admin/collections/faqs', type: 'Gyűjtemény' },
  { label: 'Vélemények', href: '/admin/collections/testimonials', type: 'Gyűjtemény' },
  { label: 'Logók', href: '/admin/collections/logos', type: 'Gyűjtemény' },
  { label: 'Árak', href: '/admin/collections/plans', type: 'Gyűjtemény' },
  { label: 'Feliratkozók', href: '/admin/collections/newsletters', type: 'Gyűjtemény' },
  { label: 'Kapcsolatok', href: '/admin/collections/contacts', type: 'Gyűjtemény' },
  { label: 'Felhasználók', href: '/admin/collections/users', type: 'Rendszer' },
  { label: 'Átirányítások', href: '/admin/collections/redirections', type: 'Rendszer' },
  { label: 'Navbar & Footer', href: '/admin/globals/global', type: 'Global' },
  { label: 'Szolgáltatások', href: '/admin/globals/service', type: 'Global' },
]

// ─── Stílusok ─────────────────────────────────────────────────────────────────

const s = {
  nav: {
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100%',
    overflow: 'hidden',
  },
  top: {
    padding: '60px 8px 8px',
    flexShrink: 0,
  },
  scroll: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '0 8px 16px',
  },
  divider: {
    height: 1,
    background: 'var(--border)',
    margin: '6px 8px',
  },
  groupLabel: {
    fontSize: '10px',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.08em',
    color: 'var(--muted)',
    padding: '10px 10px 4px',
    fontFamily: 'ui-monospace, monospace',
  },
}

// ─── SearchModal ──────────────────────────────────────────────────────────────

function SearchModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const results = query.length > 0
    ? SEARCH_ITEMS.filter(l => l.label.toLowerCase().includes(query.toLowerCase()))
    : SEARCH_ITEMS

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 30)
  }, [])

  useEffect(() => { setSelected(0) }, [query])

  function navigate(href: string) {
    router.push(href)
    onClose()
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, results.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)) }
    else if (e.key === 'Enter' && results[selected]) navigate(results[selected].href)
    else if (e.key === 'Escape') onClose()
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(2px)', zIndex: 999 }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -12 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        style={{
          position: 'fixed', top: '18%', left: '50%', translateX: '-50%',
          width: 'calc(100% - 48px)', maxWidth: 500,
          background: 'var(--surface)', border: '1px solid var(--border-h)',
          borderRadius: 12, boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
          zIndex: 1000, overflow: 'hidden',
        }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderBottom: '1px solid var(--border)' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Keresés..."
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 14, color: 'var(--text)', fontFamily: 'var(--font-body)' }}
          />
          <Kbd>esc</Kbd>
        </div>

        <div style={{ maxHeight: 320, overflowY: 'auto' }}>
          {results.length === 0
            ? <div style={{ padding: '18px 14px', color: 'var(--muted)', fontSize: 13, textAlign: 'center' }}>Nincs találat</div>
            : results.map((r, i) => (
              <button key={r.href} onClick={() => navigate(r.href)} onMouseEnter={() => setSelected(i)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  width: '100%', padding: '9px 14px', border: 'none',
                  background: i === selected ? 'var(--hover2)' : 'transparent',
                  color: 'var(--text)', fontSize: 13, cursor: 'pointer',
                  textAlign: 'left', fontFamily: 'var(--font-body)',
                }}
              >
                <span>{r.label}</span>
                <span style={{ fontSize: 11, color: 'var(--muted)' }}>{r.type}</span>
              </button>
            ))
          }
        </div>

        <div style={{ display: 'flex', gap: 12, padding: '7px 14px', borderTop: '1px solid var(--border)', color: 'var(--muted)', fontSize: 11 }}>
          <span><Kbd>↑</Kbd> <Kbd>↓</Kbd> navigálás</span>
          <span><Kbd>↵</Kbd> megnyitás</span>
          <span><Kbd>esc</Kbd> bezárás</span>
        </div>
      </motion.div>
    </>
  )
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      padding: '1px 5px', borderRadius: 4,
      border: '1px solid var(--border-h)', background: 'var(--surface2)',
      fontSize: 11, fontFamily: 'ui-monospace, monospace', color: 'var(--muted)', lineHeight: 1.5,
    }}>{children}</kbd>
  )
}

// ─── NavItem ──────────────────────────────────────────────────────────────────

function NavItem({ href, label, icon, exact, shortcut }: { href: string; label: string; icon: React.ReactNode; exact?: boolean; shortcut?: string }) {
  const pathname = usePathname()
  const isActive = exact ? pathname === href : pathname.startsWith(href)

  return (
    <Link href={href} style={{
      display: 'flex', alignItems: 'center', gap: '9px',
      padding: '6px 10px', borderRadius: '6px', textDecoration: 'none',
      fontSize: '13px', fontWeight: isActive ? 600 : 400,
      color: isActive ? 'var(--text)' : 'var(--text-sec)',
      background: isActive ? 'var(--hover2)' : 'transparent',
      transition: 'background 100ms, color 100ms',
      marginBottom: '1px', lineHeight: 1.3,
    }}
      onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'var(--hover)' }}
      onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
    >
      <span style={{ opacity: isActive ? 1 : 0.5, flexShrink: 0, display: 'flex' }}>{icon}</span>
      <span style={{ flex: 1 }}>{label}</span>
      {shortcut && (
        <span style={{ display: 'flex', gap: 2 }}>
          {shortcut.split(' ').map((k, i) => <Kbd key={i}>{k}</Kbd>)}
        </span>
      )}
    </Link>
  )
}

const navContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.035, delayChildren: 0.05 } },
}
const navItem = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0, transition: { duration: 0.22, ease: 'easeOut' as const } },
}

// ─── Nav ──────────────────────────────────────────────────────────────────────

export function Nav() {
  const [searchOpen, setSearchOpen] = useState(false)

  const router = useRouter()

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') { e.preventDefault(); setSearchOpen(true) }
      if ((e.metaKey || e.ctrlKey) && e.key === 'd') { e.preventDefault(); router.push('/admin') }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [router])

  return (
    <div style={s.nav}>
      {/* Search gomb a nav tetején */}
      <motion.div style={s.top} variants={navItem} initial="hidden" animate="show">
        <button onClick={() => setSearchOpen(true)} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '100%', padding: '7px 10px', borderRadius: 6,
          border: '1px solid var(--border)', background: 'transparent',
          color: 'var(--muted)', fontSize: 12, cursor: 'pointer',
          fontFamily: 'var(--font-body)', gap: 6,
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            Keresés
          </span>
          <span style={{ display: 'flex', gap: 2 }}>
            <Kbd>⌘</Kbd><Kbd>F</Kbd>
          </span>
        </button>
      </motion.div>

      <motion.div style={s.scroll} variants={navContainer} initial="hidden" animate="show">
        {NAV.map((section, si) => {
          if (section.divider) return <motion.div key={si} variants={navItem} style={s.divider} />
          return (
            <div key={si}>
              {section.group && <motion.div variants={navItem} style={s.groupLabel}>{section.group}</motion.div>}
              {section.items?.map(item => (
                <motion.div key={item.href} variants={navItem}>
                  <NavItem {...item} />
                </motion.div>
              ))}
            </div>
          )
        })}
      </motion.div>

      <AnimatePresence>
        {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
      </AnimatePresence>
    </div>
  )
}
