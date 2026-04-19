import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Vasadi Dávid — [davelopment]®',
  description: 'Web · Márka · Stratégia',
  robots: 'noindex',
}

const CONTACT = {
  name: 'Vasadi Dávid',
  tagline: 'Web · Márka · Stratégia',
  email: 'hello@davelopment.hu',
  phone: '+36303628377',
  phoneDisplay: '(36)303628377',
  website: 'davelopment.hu',
  websiteUrl: 'https://davelopment.hu',
  photo: '/dave.jpg',
}

const rows = [
  { label: 'Név',      value: CONTACT.name,        href: null,                      icon: 'photo' },
  { label: 'Email',    value: CONTACT.email,        href: `mailto:${CONTACT.email}`, icon: 'email' },
  { label: 'Telefon',  value: CONTACT.phoneDisplay, href: `tel:${CONTACT.phone}`,    icon: 'phone' },
  { label: 'Weboldal', value: CONTACT.website,      href: CONTACT.websiteUrl,        icon: 'globe' },
]

function RowIcon({ type }: { type: string }) {
  if (type === 'photo') {
    return (
      <img
        src={CONTACT.photo}
        alt={CONTACT.name}
        className="w-11 h-11 rounded-full object-cover object-top flex-shrink-0"
      />
    )
  }

  const svgs: Record<string, React.ReactNode> = {
    email: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="3" />
        <path d="m2 7 10 7 10-7" />
      </svg>
    ),
    phone: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6.5 2h11A1.5 1.5 0 0 1 19 3.5v17a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 20.5v-17A1.5 1.5 0 0 1 6.5 2Z" />
        <circle cx="12" cy="19" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
    globe: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  }

  return (
    <div className="w-11 h-11 rounded-full bg-black/[0.05] flex items-center justify-center flex-shrink-0 text-black/40">
      {svgs[type]}
    </div>
  )
}

export default function VisualCard() {
  return (
    <div className="fixed inset-0 z-[100] bg-[#f5f5f5] overflow-y-auto flex flex-col items-center justify-start px-4">
      <div className="w-full max-w-sm mt-12 mb-8">

        {/* Egy nagy fehér konténer — overflow-hidden levágja a fejléc felső sarkait */}
        <div className="bg-white rounded-[32px] overflow-hidden shadow-sm">

          {/* Fejléc: nincs saját border-radius, az alap egyenes → belesimuló a fehérbe */}
          <div className="bg-[#0e0e0e] px-7 pt-10 pb-10">
            <p className="text-[11px] tracking-[0.18em] uppercase text-white/30 mb-1">Studio</p>
            <h1 className="text-3xl font-bold text-white tracking-tight leading-none mb-3">
              [davelopment]®
            </h1>
            <p className="text-[13px] text-white/45 tracking-[0.08em]">{CONTACT.tagline}</p>
          </div>

          {/* Gombok a fehér részen belül */}
          <div className="flex flex-col gap-3 p-4">

            {rows.map((row) => {
              const inner = (
                <div className="flex items-center gap-4 bg-white rounded-2xl px-4 py-3.5 border border-black/[0.08]">
                  <RowIcon type={row.icon} />
                  <div className="min-w-0">
                    <p className="text-[11px] text-black/35 font-medium mb-[2px]">{row.label}</p>
                    <p className="text-[15px] font-semibold text-black truncate">{row.value}</p>
                  </div>
                </div>
              )

              return row.href ? (
                <a key={row.label} href={row.href} className="block active:scale-[0.98] transition-transform">
                  {inner}
                </a>
              ) : (
                <div key={row.label}>{inner}</div>
              )
            })}

            {/* Mentés gomb — ugyanolyan stílus */}
            <a
              href="/visual-card"
              className="flex items-center justify-center gap-2 bg-white rounded-2xl px-4 py-4 border border-black/[0.08] active:scale-[0.98] transition-transform"
            >
              <span className="text-[18px] font-light text-black leading-none">+</span>
              <span className="text-[15px] font-semibold text-black">Mentés a névjegykártyába</span>
            </a>

          </div>
        </div>

        {/* Footer */}
        <p className="mt-4 text-center text-[11px] text-black/25">
          davelopment.hu 2026©
        </p>

      </div>
    </div>
  )
}
