'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'next-view-transitions';

import { LocaleSwitcher } from '../locale-switcher';
import { Logo } from '@/components/logo';
import { cn } from '@/lib/utils';

type NavItem = { URL: string; text: string; target?: string };
type LinkItem = { text: string; URL: string; target?: '_self' | '_blank' };
type ContactInput = { type?: string; name?: string; placeholder?: string };

const isExternal = (u: string) => u?.startsWith('http') || u?.startsWith('mailto:') || u?.startsWith('tel:');
const withLocale = (u: string, locale: string) => (isExternal(u) ? u : `/${locale}${u}`);

const HEADER_H = 'h-16';
const OVERLAY_OFFSET = 'top-16';
const DURATION = 0.38;
const EASE: [number, number, number, number] = [0.2, 0.8, 0.2, 1];

const CONTACT_ITEM = { initial: { y: 8, opacity: 0 }, enter: (i: number) => ({ y: 0, opacity: 1, transition: { delay: 0.06 * i, duration: 0.26, ease: EASE } }) } as const;
const CONTACT_HOVER = { plus: { rotate: 90, transition: { duration: 0.22 } }, underline: { scaleX: 0, transition: { duration: 0.3 } } } as const;

export function MobileNavbar({
  leftNavbarItems,
  logo,
  locale,
  policyLinks = [],
  contactInputs = [],
  copyrightText,
  navBgClass = 'bg-white', // ⬅️ ÚJ
}: {
  leftNavbarItems: NavItem[];
  logo: any;
  locale: string;
  policyLinks?: LinkItem[];
  contactInputs?: ContactInput[];
  copyrightText?: string | null;
  navBgClass?: string;              // ⬅️ ÚJ
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useMemo(() => leftNavbarItems, [leftNavbarItems]);

  return (
    <>
      {/* FEJ */}
      <div className={cn(navBgClass, HEADER_H)}>{/* ⬅️ bg-white → navBgClass */}
        <nav className="flex items-center justify-between px-6 h-full">
          <Logo locale={locale} image={logo?.image} />
          <div className="flex items-center gap-6">
            <LocaleSwitcher currentLocale={locale} />
            <button
              aria-label={open ? 'Menü bezárása' : 'Menü megnyitása'}
              aria-expanded={open}
              onClick={() => setOpen(v => !v)}
              className="relative w-16 h-16 overflow-hidden"
            >
              <motion.span className="absolute inset-x-1 h-0.5 bg-black" initial={false} animate={open ? { y: 0, rotate: 12 } : { y: -4, rotate: 0 }} transition={{ duration: 0.18, ease: 'easeInOut' }} />
              <motion.span className="absolute inset-x-1 h-0.5 bg-black" initial={false} animate={open ? { y: 0, rotate: -12 } : { y: 4, rotate: 0 }} transition={{ duration: 0.18, ease: 'easeInOut' }} />
            </button>
          </div>
        </nav>
      </div>

      {/* OVERLAY */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="mobile-overlay"
            className={cn('fixed left-0 right-0 bottom-0 z-[70]', OVERLAY_OFFSET, navBgClass)} // ⬅️ bg-white → navBgClass
            style={{ transformOrigin: 'top', willChange: 'clip-path' }}
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: DURATION, ease: EASE }}
          >
            <div className="px-6 pt-10 pb-24">
              <ul className="max-w-md mx-auto flex flex-col items-center text-center gap-5">
                {leftNavbarItems.map((it, i) => (
                  <li key={`${it.text}-${i}`} className="w-full">
                    <Link
                      href={`/${locale}${it.URL}`}
                      target={it.target}
                      onClick={() => setOpen(false)}
                      className="block text-[38px] leading-[0.98] font-semibold text-black hover:opacity-90 transition"
                    >
                      {it.text}
                    </Link>
                  </li>
                ))}
              </ul>

              {contactInputs.length > 0 && (
                <motion.div className="mt-10 max-w-md mx-auto flex flex-col items-center gap-3 text-center" initial={false} animate="enter">
                  {contactInputs.map((it, idx) => {
                    const raw = String(it?.name || '').trim();
                    if (!raw) return null;
                    const isEmail = raw.includes('@');
                    const value = raw.replace(/^mailto:/, '');
                    const href = isEmail ? `mailto:${value}` : `tel:${value.replace(/[^\d+]/g, '')}`;

                    return isEmail ? (
                      <motion.a
                        key={`m-ct-${idx}`}
                        href={href}
                        onClick={() => setOpen(false)}
                        className="group inline-flex items-center gap-3 py-1 cursor-pointer select-none"
                        variants={CONTACT_ITEM}
                        custom={idx}
                        whileHover="hover"
                      >
                        <motion.div className="w-6 h-6 rounded-full bg-black grid place-items-center" variants={{ hover: CONTACT_HOVER.plus }}>
                          <div className="relative w-3 h-3">
                            <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-white block" />
                            <span className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 bg-white block" />
                          </div>
                        </motion.div>
                        <span className="relative block text-[22px] font-semibold text-black tracking-tight">
                          {value}
                          <motion.span className="absolute left-0 -bottom-[2px] right-0 h-0.5 bg-black origin-left" variants={{ hover: CONTACT_HOVER.underline }} />
                        </span>
                      </motion.a>
                    ) : (
                      <motion.a key={`m-ct-${idx}`} href={href} onClick={() => setOpen(false)} className="text-[16px] text-black hover:opacity-70 transition cursor-pointer" variants={CONTACT_ITEM} custom={idx}>
                        {raw}
                      </motion.a>
                    );
                  })}
                </motion.div>
              )}

              {policyLinks.length > 0 && (
                <div className="mt-10 max-w-md mx-auto flex flex-col items-center gap-2">
                  {policyLinks.map((p, i) =>
                    isExternal(p.URL) ? (
                      <a key={`m-pol-${i}`} href={p.URL} target={p.target || '_self'} rel={p.target === '_blank' ? 'noreferrer' : undefined} onClick={() => setOpen(false)} className="text-sm text-black hover:opacity-70 transition">
                        {p.text}
                      </a>
                    ) : (
                      <Link key={`m-pol-${i}`} href={withLocale(p.URL, locale)} onClick={() => setOpen(false)} className="text-sm text-black hover:opacity-70 transition">
                        {p.text}
                      </Link>
                    )
                  )}
                </div>
              )}

              {copyrightText && (
                <div className="mt-6 max-w-md mx-auto flex flex-col items-center">
                  <div className="rounded-full px-3 py-1.5 border border-neutral-200 bg-white text-xs text-neutral-600 shadow-sm">
                    {copyrightText}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
