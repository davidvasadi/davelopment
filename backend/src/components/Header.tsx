'use client'
import { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { NotificationBell } from './NotificationBell'

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

  return null
}
