'use client'
import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { NotificationBell } from './NotificationBell'
import { useNav } from '@payloadcms/ui'

// Fix-pozicionált X gomb — mindig a viewport-ban marad mobilon, még ha a header kicsúszik is
function MobileNavClose() {
  const { navOpen, setNavOpen } = useNav()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <button
      onClick={() => setNavOpen(false)}
      className={`mobile-nav-close${navOpen ? ' mobile-nav-close--open' : ''}`}
      aria-label="Menü bezárása"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
  )
}

export function Header() {
  useEffect(() => {
    // Already injected (e.g. hot reload)
    if (document.querySelector('[data-bell-container]')) return

    const account = document.querySelector('.app-header__account')
    if (!account?.parentElement) return

    const container = document.createElement('div')
    container.setAttribute('data-bell-container', '')
    container.style.cssText = 'display:flex;align-items:center;flex-shrink:0;'
    account.parentElement.insertBefore(container, account)

    const root = createRoot(container)
    root.render(<NotificationBell />)

    return () => {
      container.remove()
      // Defer unmount to avoid "sync unmount during render" React error
      setTimeout(() => root.unmount(), 0)
    }
  }, [])

  return <MobileNavClose />
}
