'use client'

import React from 'react'

type Props = {
  name: string
  phone: string
  email: string
  org: string
  title: string
  website: string
}

/**
 * Androidon a Contacts "Insert" intentet nyitja (előre kitöltött Új névjegy
 * szerkesztő), így a felhasználó egy koppintással menthet — az iPhone-élményhez
 * hasonlóan. iOS-en és minden más böngészőben a működő /visual-card letöltés
 * marad. Ha az intent nem indul el (pl. beágyazott in-app böngésző elnyeli),
 * fallbackként szintén a letöltésre esünk vissza.
 */
export default function SaveContactButton({
  name,
  phone,
  email,
  org,
  title,
  website,
}: Props) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (typeof navigator === 'undefined') return

    const isAndroid = /android/i.test(navigator.userAgent)
    if (!isAndroid) return // iOS és desktop: hagyjuk a sima /visual-card letöltést

    e.preventDefault()

    // Android Contacts insert intent. A mezők a query paramétereken keresztül
    // mennek; a "package=com.android.contacts" segít a megfelelő appot célozni,
    // az S.browser_fallback_url pedig visszaesik a letöltésre, ha nincs kezelő.
    const p = new URLSearchParams({
      name,
      phone,
      email,
      company: org,
      job_title: title,
      // a notes mezőbe tesszük a weboldalt, mert a websitere nincs szabványos
      // intent extra minden launcherben
      notes: website,
    })

    const fallback = encodeURIComponent(
      `${window.location.origin}/visual-card`
    )

    const intentUrl =
      `intent://contacts/people/#Intent;` +
      `action=android.intent.action.INSERT;` +
      `type=vnd.android.cursor.dir/raw_contact;` +
      p
        .toString()
        .split('&')
        .map((kv) => {
          const [k, v] = kv.split('=')
          return `S.${k}=${v}`
        })
        .join(';') +
      `;S.browser_fallback_url=${fallback};end`

    window.location.href = intentUrl
  }

  return (
    <a
      href="/visual-card"
      onClick={handleClick}
      className="flex items-center justify-center gap-2 bg-white rounded-2xl px-4 py-4 border border-black/[0.08] active:scale-[0.98] transition-transform"
    >
      <span className="text-[18px] font-light text-black leading-none">+</span>
      <span className="text-[15px] font-semibold text-black">Mentés a névjegykártyába</span>
    </a>
  )
}
