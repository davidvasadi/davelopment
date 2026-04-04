'use client'
import { useEffect } from 'react'

export function BeforeLogin() {
  useEffect(() => {
    function injectToggle() {
      const passwordField = document.querySelector<HTMLInputElement>(
        'input[name="password"][type="password"], input[name="password"][type="text"]'
      )
      if (!passwordField) return
      if (passwordField.parentElement?.querySelector('[data-pw-toggle]')) return

      const wrapper = passwordField.parentElement
      if (!wrapper) return

      // Make wrapper relative so we can position the button inside
      if (getComputedStyle(wrapper).position === 'static') {
        wrapper.style.position = 'relative'
      }

      const btn = document.createElement('button')
      btn.setAttribute('data-pw-toggle', '')
      btn.setAttribute('type', 'button')
      btn.setAttribute('aria-label', 'Jelszó megjelenítése')
      btn.style.cssText = `
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
        color: var(--theme-elevation-500);
        display: flex;
        align-items: center;
        justify-content: center;
      `
      btn.innerHTML = eyeIcon(false)

      let visible = false
      btn.addEventListener('click', () => {
        visible = !visible
        passwordField.type = visible ? 'text' : 'password'
        btn.innerHTML = eyeIcon(visible)
      })

      wrapper.appendChild(btn)
    }

    // Try immediately, then watch for DOM changes (form renders async)
    injectToggle()
    const observer = new MutationObserver(injectToggle)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [])

  return null
}

function eyeIcon(open: boolean) {
  if (open) {
    // Eye with slash (hide password)
    return `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>`
  }
  // Eye (show password)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>`
}
