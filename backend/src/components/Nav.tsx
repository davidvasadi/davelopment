'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

// ─── Nav struktúra ────────────────────────────────────────────────────────────

const NAV: Array<{
  group?: string
  divider?: boolean
  items?: { href: string; label: string; exact?: boolean; icon: React.ReactNode }[]
}> = [
  {
    items: [
      {
        href: '/admin',
        label: 'Dashboard',
        exact: true,
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

// ─── Stílusok ─────────────────────────────────────────────────────────────────

const s = {
  nav: {
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100%',
    overflow: 'hidden',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '20px 16px 16px',
    borderBottom: '1px solid var(--theme-elevation-150)',
    flexShrink: 0,
  },
  brandIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    background: 'var(--theme-text)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  brandLabel: {
    fontSize: 13,
    fontWeight: 700,
    color: 'var(--theme-text)',
    letterSpacing: '-0.01em',
  },
  scroll: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '56px 8px 16px',
  },
  divider: {
    height: 1,
    background: 'var(--theme-elevation-150)',
    margin: '6px 8px',
  },
  groupLabel: {
    fontSize: '10px',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.08em',
    color: 'var(--theme-elevation-500)',
    padding: '10px 10px 4px',
    fontFamily: 'ui-monospace, monospace',
  },
}

// ─── NavItem ──────────────────────────────────────────────────────────────────

function NavItem({
  href,
  label,
  icon,
  exact,
}: {
  href: string
  label: string
  icon: React.ReactNode
  exact?: boolean
}) {
  const pathname = usePathname()
  const isActive = exact ? pathname === href : pathname.startsWith(href)

  return (
    <Link
      href={href}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '9px',
        padding: '6px 10px',
        borderRadius: '6px',
        textDecoration: 'none',
        fontSize: '13px',
        fontWeight: isActive ? 600 : 400,
        color: isActive ? 'var(--theme-text)' : 'var(--theme-elevation-600)',
        background: isActive ? 'var(--theme-elevation-100)' : 'transparent',
        transition: 'background 100ms, color 100ms',
        marginBottom: '1px',
        lineHeight: 1.3,
      }}
      onMouseEnter={e => {
        if (!isActive) (e.currentTarget as HTMLElement).style.background = 'var(--theme-elevation-50)'
      }}
      onMouseLeave={e => {
        if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'
      }}
    >
      <span style={{ opacity: isActive ? 1 : 0.5, flexShrink: 0, display: 'flex' }}>
        {icon}
      </span>
      {label}
    </Link>
  )
}

// ─── Nav ──────────────────────────────────────────────────────────────────────

export function Nav() {
  return (
    <div style={s.nav}>
      <div style={s.scroll}>
        {NAV.map((section, si) => {
          if (section.divider) return <div key={si} style={s.divider}/>

          return (
            <div key={si}>
              {section.group && <div style={s.groupLabel}>{section.group}</div>}
              {section.items?.map(item => (
                <NavItem key={item.href} {...item}/>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
