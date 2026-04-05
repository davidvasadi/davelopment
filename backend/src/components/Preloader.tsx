'use client'
import { useEffect } from 'react'

const SQUARES = 10

export function Preloader() {
  useEffect(() => {
    document.querySelectorAll('[data-dave-preloader]').forEach(e => e.remove())

    const el = document.createElement('div')
    el.setAttribute('data-dave-preloader', '')
    el.innerHTML = `
      <div class="dave-pre-inner">
        <div class="dave-pre-logo">[davelopment]<sup class="dave-pre-reg">®</sup></div>
        <div class="dave-pre-wrap">
          <div class="dave-pre-squares">
            ${Array.from({ length: SQUARES }).map(() => `<div class="dave-pre-square"></div>`).join('')}
          </div>
          <div class="dave-pre-counter">0%</div>
        </div>
      </div>
    `
    document.body.prepend(el)

    const squares = Array.from(el.querySelectorAll<HTMLElement>('.dave-pre-square'))
    const counter = el.querySelector<HTMLElement>('.dave-pre-counter')

    let current = 0

    function setProgress(pct: number) {
      const filled = Math.round((pct / 100) * SQUARES)
      squares.forEach((sq, i) => {
        if (i < filled) sq.classList.add('active')
      })
      if (counter) counter.textContent = `${Math.round(pct)}%`
    }

    function finish() {
      setProgress(100)
      setTimeout(() => {
        el.classList.add('dave-pre-hide')
        setTimeout(() => el.remove(), 300)
      }, 80)
    }

    // Drive progress by real load events
    function advance(to: number) {
      if (to > current) {
        current = to
        setProgress(current)
      }
    }

    advance(20)

    if (document.readyState === 'complete') {
      advance(100)
      finish()
    } else {
      window.addEventListener('load', () => { advance(90) }, { once: true })
      document.addEventListener('readystatechange', () => {
        if (document.readyState === 'interactive') advance(60)
        if (document.readyState === 'complete') { advance(90); finish() }
      }, { once: true })

      // Fallback — max 3s
      const fallback = setTimeout(finish, 3000)
      el.addEventListener('dave-done', () => clearTimeout(fallback))
    }

    return () => { el.remove() }
  }, [])

  return null
}
