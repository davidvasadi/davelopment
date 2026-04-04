'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

import { LocaleSwitcher } from '../locale-switcher';
import { Logo } from '@/components/logo';
import { cn } from '@/lib/utils';
import { useNavClose } from '@/components/ui/preloader';

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

const FLIP_VARIANTS = {
  rest: { y: '0%' },
  hover: { y: '-50%', transition: { duration: 0.3, ease: 'easeInOut' } },
} as const;

export function MobileNavbar({
  leftNavbarItems,
  logo,
  locale,
  policyLinks = [],
  contactInputs = [],
  copyrightText,
  navBgClass = 'bg-white',
}: {
  leftNavbarItems: NavItem[];
  logo: any;
  locale: string;
  policyLinks?: LinkItem[];
  contactInputs?: ContactInput[];
  copyrightText?: string | null;
  navBgClass?: string;
}) {
  const [open, setOpen] = useState(false);
  const { navigateAfterClose } = useNavClose();
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useMemo(() => leftNavbarItems, [leftNavbarItems]);

  const handleNavClick = (href: string, external?: boolean) => {
    if (external) { window.open(href, '_blank'); return; }
    setOpen(false);
    router.push(href);
  };

  return (
    <>
      <div className={cn(navBgClass, HEADER_H)}>
        <nav className="flex items-center justify-between px-6 h-full">
          <Logo locale={locale} image={logo?.image} text={logo?.company} />
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

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="mobile-overlay"
            className={cn('fixed left-0 right-0 bottom-0 z-[70]', OVERLAY_OFFSET, navBgClass)}
            style={{ transformOrigin: 'top', overflow: 'hidden', willChange: 'transform, opacity' }}
            initial={{ y: -10, scaleY: 0.965, opacity: 0 }}
            animate={{ y: 0, scaleY: 1, opacity: 1 }}
            exit={{ y: -10, scaleY: 0.965, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 240, damping: 26, mass: 0.95 }}
          >
            <div className="px-6 pt-10 pb-24">
              <ul className="max-w-md mx-auto flex flex-col items-center text-center gap-1">
                {leftNavbarItems.map((it, i) => (
                  <li key={`${it.text}-${i}`} className="w-full">
                    {/* Szöveg-flip hover: overflow-hidden + dupla szöveg + translateY
                        Mobilon touch eszközön a hover nem aktív, de desktop szélességen működik */}
                    <motion.button
                      onClick={() => handleNavClick(
                        isExternal(it.URL) ? it.URL : `/${locale}${it.URL}`,
                        isExternal(it.URL)
                      )}
                      className="block w-full font-semibold text-black text-center"
                      whileHover="hover"
                      initial="rest"
                      animate="rest"
                    >
                      <div style={{ height: 50, overflow: 'hidden', position: 'relative' }}>
                        <motion.div
                          style={{ position: 'absolute', top: 0, left: 0, right: 0, fontSize: 38, lineHeight: '50px', textAlign: 'center' }}
                          variants={{ rest: { y: 0 }, hover: { y: -50, transition: { duration: 0.35, ease: [0.33,1,0.68,1] } } }}
                        >{it.text}</motion.div>
                        <motion.div
                          style={{ position: 'absolute', top: 50, left: 0, right: 0, fontSize: 38, lineHeight: '50px', textAlign: 'center' }}
                          variants={{ rest: { y: 0 }, hover: { y: -50, transition: { duration: 0.35, ease: [0.33,1,0.68,1] } } }}
                        >{it.text}</motion.div>
                      </div>
                    </motion.button>
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
                      <motion.a key={`m-ct-${idx}`} href={href} onClick={() => setOpen(false)}
                        className="group inline-flex items-center gap-3 py-1 cursor-pointer select-none"
                        variants={CONTACT_ITEM} custom={idx} whileHover="hover">
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
                      <motion.a key={`m-ct-${idx}`} href={href} onClick={() => setOpen(false)}
                        className="text-[16px] text-black hover:opacity-70 transition cursor-pointer"
                        variants={CONTACT_ITEM} custom={idx}>{raw}</motion.a>
                    );
                  })}
                </motion.div>
              )}

              {policyLinks.length > 0 && (
                <div className="mt-10 max-w-md mx-auto flex flex-col items-center gap-2">
                  {policyLinks.map((p, i) =>
                    isExternal(p.URL) ? (
                      <a key={`m-pol-${i}`} href={p.URL} target={p.target || '_self'} rel={p.target === '_blank' ? 'noreferrer' : undefined} onClick={() => setOpen(false)} className="text-sm text-black hover:opacity-70 transition">{p.text}</a>
                    ) : (
                      <button key={`m-pol-${i}`} onClick={() => handleNavClick(withLocale(p.URL, locale))} className="text-sm text-black hover:opacity-70 transition">{p.text}</button>
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
