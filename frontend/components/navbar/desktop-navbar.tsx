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

const isExternal = (u: string) =>
  u?.startsWith('http') || u?.startsWith('mailto:') || u?.startsWith('tel:');
const withLocale = (u: string, locale: string) =>
  isExternal(u) ? u : `/${locale}${u}`;

const HEADER_H = 'h-16';
const OVERLAY_OFFSET = 'top-16';
const DURATION = 0.56;
const EASE: [number, number, number, number] = [0.33, 1, 0.68, 1];

const OVERLAY_SPRING = { type: 'spring', stiffness: 240, damping: 26, mass: 0.95 } as const;
const OVERLAY_VARIANTS = { closed: { y: -10, scaleY: 0.965, opacity: 0 }, open: { y: 0, scaleY: 1, opacity: 1 } } as const;
const LIST_VARIANTS = { closed: { transition: { staggerChildren: 0.036, staggerDirection: -1 } }, open: { transition: { delayChildren: 0.06, staggerChildren: 0.055 } } } as const;
const ITEM_VARIANTS = { closed: { opacity: 0, y: -10 }, open: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 520, damping: 32, mass: 0.68 } } } as const;

const CONTACT_ITEM = { initial: { y: 8, opacity: 0 }, enter: (i: number) => ({ y: 0, opacity: 1, transition: { delay: 0.06 * i, duration: 0.26, ease: EASE } }) } as const;
const CONTACT_HOVER = { plus: { rotate: 90, transition: { duration: 0.22 } }, underline: { scaleX: 0, transition: { duration: 0.3 } } } as const;

const SPRING_FAST = { type: 'spring', stiffness: 260, damping: 28, mass: 0.9, restDelta: 0.001 } as const;

export function DesktopNavbar({
  leftNavbarItems,
  rightNavbarItems,
  logo,
  locale,
  policyLinks = [],
  contactInputs = [],
  copyrightText,
  navBgClass = 'bg-#f5f5f5', // ⬅️ ÚJ
}: {
  leftNavbarItems: NavItem[];
  rightNavbarItems: NavItem[];
  logo: any;
  locale: string;
  policyLinks?: LinkItem[];
  contactInputs?: ContactInput[];
  copyrightText?: string | null;
  navBgClass?: string;               // ⬅️ ÚJ
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const inline = useMemo(
    () =>
      (leftNavbarItems || []).filter((it) => {
        const t = (it.text || '').toLowerCase();
        const u = it.URL || '';
        return !(u === '/' || u === '' || t === 'home' || t === 'főoldal');
      }),
    [leftNavbarItems]
  );

  return (
    <>
      {/* FEJ */}
      <div className={cn(navBgClass, HEADER_H)}>{/* ⬅️ bg-white → navBgClass */}
        <nav className="relative flex items-center px-6 h-full">
          <Logo locale={locale} image={logo?.image} />

          <div
            className={cn(
              'hidden xl:flex absolute left-1/2 -translate-x-1/2 gap-[12rem] transition-opacity',
              open ? 'opacity-0 pointer-events-none' : 'opacity-100'
            )}
          >
            {inline.map((it) => (
              <Link
                key={it.text}
                href={`/${locale}${it.URL}`}
                target={it.target}
                className="text-base font-semibold text-black"
              >
                <span>{it.text}</span>
              </Link>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-6">
            <LocaleSwitcher currentLocale={locale} />
            <button
              aria-label={open ? 'Menü bezárása' : 'Menü megnyitása'}
              aria-expanded={open}
              onClick={() => setOpen(v => !v)}
              className="relative w-16 h-16 overflow-hidden"
            >
              <motion.span className="absolute inset-x-1 h-0.5 bg-black" initial={false} animate={open ? { y: 0, rotate: 12 } : { y: -4, rotate: 0 }} transition={SPRING_FAST} />
              <motion.span className="absolute inset-x-1 h-0.5 bg-black" initial={false} animate={open ? { y: 0, rotate: -12 } : { y: 4, rotate: 0 }} transition={SPRING_FAST} />
            </button>
          </div>
        </nav>
      </div>

      {/* OVERLAY */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="desktop-overlay"
            className={cn('fixed left-0 right-0 bottom-0 z-[70]', OVERLAY_OFFSET, navBgClass)} // ⬅️ bg-white → navBgClass
            style={{ transformOrigin: 'top', overflow: 'hidden', willChange: 'transform, opacity' }}
            variants={OVERLAY_VARIANTS}
            initial="closed"
            animate="open"
            exit="closed"
            transition={OVERLAY_SPRING}
          >
            <div className="px-6 pt-10 pb-16">
              <motion.ul className="max-w-4xl mx-auto text-center space-y-6" variants={LIST_VARIANTS} initial="closed" animate="open">
                {leftNavbarItems.map((it, i) => (
                  <motion.li key={`${it.text}-${i}`} variants={ITEM_VARIANTS}>
                    <Link
                      href={`/${locale}${it.URL}`}
                      target={it.target}
                      onClick={() => setOpen(false)}
                      className="block text-[60px] md:text-[72px] leading-[0.95] font-semibold text-black hover:opacity-90 transition"
                    >
                      {it.text}
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
            </div>

            <motion.div className="absolute bottom-8 left-8 flex flex-col items-start gap-3" initial="initial" animate="enter">
              {contactInputs.map((it, idx) => {
                const raw = String(it?.name || '').trim();
                if (!raw) return null;
                const isEmail = raw.includes('@');
                const value = raw.replace(/^mailto:/, '');
                const href = isEmail ? `mailto:${value}` : `tel:${value.replace(/[^\d+]/g, '')}`;

                return isEmail ? (
                  <motion.a
                    key={`ct-${idx}`}
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
                    <span className="relative block text-[30px] md:text-[32px] font-semibold text-black tracking-tight">
                      {value}
                      <motion.span className="absolute left-0 -bottom-[2px] right-0 h-0.5 bg-black origin-left" variants={{ hover: CONTACT_HOVER.underline }} />
                    </span>
                  </motion.a>
                ) : (
                  <motion.a key={`ct-${idx}`} href={href} onClick={() => setOpen(false)} className="text-[18px] text-black hover:opacity-70 transition cursor-pointer" variants={CONTACT_ITEM} custom={idx}>
                    {raw}
                  </motion.a>
                );
              })}
            </motion.div>

            {policyLinks.length > 0 && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-8">
                {policyLinks.map((p, i) =>
                  isExternal(p.URL) ? (
                    <a key={`pol-${i}`} href={p.URL} target={p.target || '_self'} rel={p.target === '_blank' ? 'noreferrer' : undefined} onClick={() => setOpen(false)} className="text-sm text-black hover:opacity-70 transition">
                      {p.text}
                    </a>
                  ) : (
                    <Link key={`pol-${i}`} href={withLocale(p.URL, locale)} onClick={() => setOpen(false)} className="text-sm text-black hover:opacity-70 transition">
                      {p.text}
                    </Link>
                  )
                )}
              </div>
            )}

            {copyrightText && (
              <div className="absolute bottom-6 right-6">
                <div className="px-4 py-2 text-sm text-neutral-600 shadow-sm">{copyrightText}</div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
