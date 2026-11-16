'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'next-view-transitions';

import { LocaleSwitcher } from '../locale-switcher';
import { Logo } from '@/components/logo';
import { MotionLink } from '@/components/motion-link';
import { PillLink } from '@/components/pill-link';
import { cn } from '@/lib/utils';
import { localizeHref } from '@/lib/i18n/localize-href';
import { ArrowRight } from 'lucide-react';
import { serviceNavItems } from '@/components/services/services-showcase';

type NavItem = { URL: string; text: string; target?: string };
type LinkItem = { text: string; URL: string; target?: '_self' | '_blank' };
type ContactInput = { type?: string; name?: string; placeholder?: string };

const isExternal = (u: string) => u?.startsWith('http') || u?.startsWith('mailto:') || u?.startsWith('tel:');
const withLocale = (u: string, locale: string) => localizeHref(u, locale, `/${locale}`);

const HEADER_H = 'h-16';
const OVERLAY_OFFSET = 'top-16';
const DURATION = 0.38;
const EASE: [number, number, number, number] = [0.2, 0.8, 0.2, 1];


const CONTACT_ITEM = { initial: { y: 8, opacity: 0 }, enter: (i: number) => ({ y: 0, opacity: 1, transition: { delay: 0.06 * i, duration: 0.26, ease: EASE } }) } as const;
const CONTACT_HOVER = { plus: { rotate: 90, transition: { duration: 0.22 } }, underline: { scaleX: 0, transition: { duration: 0.3 } } } as const;

// a menüpontok belépése: alulról, rugósan, egymás után
const ITEM_IN = (i: number) => ({ initial: { opacity: 0, y: 28 }, animate: { opacity: 1, y: 0 }, transition: { type: 'spring' as const, stiffness: 260, damping: 22, delay: 0.06 + i * 0.05 } });
const isServices = (u: string) => /\/(szolgaltatasok|services)\/?$/.test(u || '');

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
  overlayBgClass,
  pill = false,
}: {
  leftNavbarItems: NavItem[];
  logo: any;
  locale: string;
  policyLinks?: LinkItem[];
  contactInputs?: ContactInput[];
  copyrightText?: string | null;
  navBgClass?: string;
  overlayBgClass?: string;
  pill?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [svcOpen, setSvcOpen] = useState(false);
  useEffect(() => { if (!open) setSvcOpen(false); }, [open]);
  const svc = useMemo(() => serviceNavItems(locale !== 'en'), [locale]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useMemo(() => leftNavbarItems, [leftNavbarItems]);

  // pill = a hero fölött vagyunk (átlátszó háttér, fehér szöveg) — a
  // nyitott menü alatt mindig a szolid overlayBgClass-hoz igazodik a felső
  // sáv is, folyamatos (nem villanó) átmenettel.
  const dark = pill && !open;

  return (
    <>
      <div className={cn(open ? (overlayBgClass || navBgClass) : navBgClass, HEADER_H, 'transition-colors duration-300')}>
        <nav className="flex items-center justify-between px-6 h-full">
          <Logo locale={locale} image={logo?.image} text={logo?.company} dark={dark} />
          <div className="flex items-center gap-6">
            <LocaleSwitcher currentLocale={locale} dark={dark} />
            <button
              aria-label={open ? (locale === 'hu' ? 'Menü bezárása' : 'Close menu') : (locale === 'hu' ? 'Menü megnyitása' : 'Open menu')}
              aria-expanded={open}
              onClick={() => setOpen(v => !v)}
              className="relative w-16 h-16 overflow-hidden"
            >
              <motion.span className={cn('absolute inset-x-1 h-0.5 transition-colors duration-300', dark ? 'bg-white' : 'bg-black')} initial={false} animate={open ? { y: 0, rotate: 12 } : { y: -4, rotate: 0 }} transition={{ duration: 0.18, ease: 'easeInOut' }} />
              <motion.span className={cn('absolute inset-x-1 h-0.5 transition-colors duration-300', dark ? 'bg-white' : 'bg-black')} initial={false} animate={open ? { y: 0, rotate: -12 } : { y: 4, rotate: 0 }} transition={{ duration: 0.18, ease: 'easeInOut' }} />
            </button>
          </div>
        </nav>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="mobile-overlay"
            className={cn('fixed left-0 right-0 bottom-0 z-[70] origin-top overflow-y-auto overscroll-contain', OVERLAY_OFFSET, overlayBgClass || navBgClass)}
            data-lenis-prevent
            style={{ willChange: 'transform, opacity' }}
            initial={{ y: -10, scaleY: 0.965, opacity: 0 }}
            animate={{ y: 0, scaleY: 1, opacity: 1 }}
            exit={{ y: -10, scaleY: 0.965, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 240, damping: 26, mass: 0.95 }}
          >
            <div className="px-6 pt-10 pb-24">
              <ul className="flex max-w-md flex-col gap-1 text-left">
                {leftNavbarItems.map((it, i) => {
                  const href = isExternal(it.URL) ? it.URL : `/${locale}${it.URL}`;
                  const services = isServices(it.URL);
                  const label = (
                    <div className="relative h-[50px] overflow-hidden">
                      <motion.div className="absolute left-0 right-0 top-0 text-[38px] leading-[50px]" variants={{ rest: { y: 0 }, hover: { y: -50, transition: { duration: 0.35, ease: [0.33, 1, 0.68, 1] } } }}>{it.text}</motion.div>
                      <motion.div className="absolute left-0 right-0 top-[50px] text-[38px] leading-[50px]" variants={{ rest: { y: 0 }, hover: { y: -50, transition: { duration: 0.35, ease: [0.33, 1, 0.68, 1] } } }}>{it.text}</motion.div>
                    </div>
                  );
                  return (
                    <motion.li key={`${it.text}-${i}`} className="w-full" {...ITEM_IN(i)}>
                      <div className="flex items-center justify-between gap-3">
                        <MotionLink
                          href={href}
                          target={isExternal(it.URL) ? '_blank' : undefined}
                          rel={isExternal(it.URL) ? 'noopener noreferrer' : undefined}
                          onClick={() => setOpen(false)}
                          className="block min-w-0 flex-1 font-semibold text-black"
                          whileHover="hover"
                          initial="rest"
                          animate="rest"
                        >
                          {label}
                        </MotionLink>
                        {services && svc.length > 0 && (
                          <motion.button
                            type="button"
                            onClick={() => setSvcOpen((v) => !v)}
                            aria-expanded={svcOpen}
                            aria-label={locale === 'en' ? 'Show services' : 'Szolgáltatások mutatása'}
                            className="-mr-2 grid h-11 w-11 shrink-0 place-items-center text-black"
                          >
                            {/* + → −: a függőleges szár elfordul és eltűnik, a vízszintes marad */}
                            <span aria-hidden="true" className="relative block h-3.5 w-3.5">
                              <span className="absolute inset-x-0 top-1/2 h-[1.5px] -translate-y-1/2 rounded-full bg-current" />
                              <motion.span
                                className="absolute inset-y-0 left-0 right-0 mx-auto w-[1.5px] rounded-full bg-current"
                                initial={false}
                                animate={svcOpen ? { rotate: 90, scaleY: 0, opacity: 0 } : { rotate: 0, scaleY: 1, opacity: 1 }}
                                transition={{ duration: 0.3, ease: EASE }}
                              />
                            </span>
                          </motion.button>
                        )}
                      </div>
                      {/* a Szolgáltatások lenyílója: a szolgáltatások képpel, egyenként beúszva (mint a szolgáltatás-lenyíló) */}
                      {services && (
                        <motion.div
                          initial={false}
                          animate={{ height: svcOpen ? 'auto' : 0, opacity: svcOpen ? 1 : 0 }}
                          transition={{ height: { duration: 0.45, ease: EASE }, opacity: { duration: 0.3, delay: svcOpen ? 0.1 : 0 } }}
                          className="overflow-hidden"
                        >
                          <ul className="flex flex-col gap-2 pb-4 pt-3">
                            {svc.map((s, k) => (
                              <motion.li key={s.slug} initial={false} animate={svcOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }} transition={{ type: 'spring', stiffness: 280, damping: 24, delay: svcOpen ? 0.08 + k * 0.05 : 0 }}>
                                <Link
                                  href={`/${locale}/${locale === 'en' ? 'services' : 'szolgaltatasok'}/${s.slug}`}
                                  onClick={() => setOpen(false)}
                                  className="group flex items-center gap-4 rounded-2xl py-1.5"
                                >
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src={s.image} alt="" width={56} height={56} loading="lazy" className="h-14 w-14 shrink-0 rounded-xl object-cover" />
                                  <span className="flex-1 text-xl font-medium text-black">{s.title}</span>
                                  <ArrowRight className="h-5 w-5 text-black/40 transition-transform group-hover:translate-x-0.5" />
                                </Link>
                              </motion.li>
                            ))}
                            <li>
                              <Link href={href} onClick={() => setOpen(false)} className="mt-1 inline-block text-base font-medium text-black underline underline-offset-4">
                                {locale === 'en' ? 'All services' : 'Összes szolgáltatás'}
                              </Link>
                            </li>
                          </ul>
                        </motion.div>
                      )}
                    </motion.li>
                  );
                })}
              </ul>

              {/* fő gomb a menüpontok alatt (fekete, mint az oldal többi gombja) */}
              <motion.div className="mt-10" {...ITEM_IN(leftNavbarItems.length)}>
                <PillLink href={`/${locale}/${locale === 'en' ? 'contact' : 'kapcsolat'}`} cta="mobile-menu:start" className="!px-6 !py-4 !text-base">
                  {locale === 'en' ? 'Start a project' : 'Kezdjük el a projektet'}
                </PillLink>
              </motion.div>

              {contactInputs.length > 0 && (
                <motion.div className="mt-10 flex max-w-md flex-col items-start gap-3 text-left" initial={false} animate="enter">
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

              {copyrightText && (
                <div className="mt-6 flex max-w-md flex-col items-start">
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
