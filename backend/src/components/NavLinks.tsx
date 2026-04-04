'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const LINKS = [
  {
    href: '/admin/marketing',
    label: 'Marketing & SEO',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
        <polyline points="16 7 22 7 22 13"/>
      </svg>
    ),
  },
  {
    href: '/admin/communications',
    label: 'Kommunikáció',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
  },
]

export function NavLinks() {
  const pathname = usePathname()

  return (
    <div style={{
      padding: '0 var(--base) var(--base)',
      borderTop: '1px solid var(--theme-elevation-150)',
      marginTop: 'var(--base)',
      paddingTop: 'var(--base)',
    }}>
      <div style={{
        fontSize: '10px',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: 'var(--theme-elevation-500)',
        fontFamily: 'ui-monospace, monospace',
        marginBottom: '6px',
        paddingLeft: '10px',
      }}>
        Analytics
      </div>

      {LINKS.map(({ href, label, icon }) => {
        const isActive = pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 10px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: isActive ? 600 : 500,
              color: isActive ? 'var(--theme-text)' : 'var(--theme-elevation-600)',
              background: isActive ? 'var(--theme-elevation-100)' : 'transparent',
              transition: 'background 120ms, color 120ms',
              marginBottom: '2px',
            }}
            onMouseEnter={e => {
              if (!isActive) (e.currentTarget as HTMLElement).style.background = 'var(--theme-elevation-50)'
            }}
            onMouseLeave={e => {
              if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'
            }}
          >
            <span style={{ opacity: isActive ? 1 : 0.6, flexShrink: 0 }}>{icon}</span>
            {label}
          </Link>
        )
      })}
    </div>
  )
}
