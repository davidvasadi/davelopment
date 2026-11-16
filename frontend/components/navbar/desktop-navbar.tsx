'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'next-view-transitions';

import { LocaleSwitcher } from '../locale-switcher';
import { Logo } from '@/components/logo';
import { MotionLink } from '@/components/motion-link';
import { cn } from '@/lib/utils';
import { localizeHref } from '@/lib/i18n/localize-href';
import { PillLink } from '@/components/pill-link';
import { PersonCard } from '@/components/person-card';
import { strapiImage } from '@/lib/strapi/strapiImage';
import { ArrowUpRight } from 'lucide-react';
import { serviceNavItems } from '@/components/services/services-showcase';

const isServices = (u: string) => /\/(szolgaltatasok|services)\/?$/.test(u || '');

type NavItem = { URL: string; text: string; target?: string };
type LinkItem = { text: string; URL: string; target?: '_self' | '_blank' };
type ContactInput = { type?: string; name?: string; placeholder?: string };

const isExternal = (u: string) =>
  u?.startsWith('http') || u?.startsWith('mailto:') || u?.startsWith('tel:');
const withLocale = (u: string, locale: string) => localizeHref(u, locale, `/${locale}`);

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

const FLIP_VARIANTS = {
  rest: { y: '0%' },
  hover: { y: '-50%', transition: { duration: 0.3, ease: 'easeInOut' } },
} as const;

export type MenuPerson = { name: string; role?: string; org?: string; image?: string | null; cta?: { text: string; URL: string; target?: string } | null };

export function DesktopNavbar({
  leftNavbarItems,
  rightNavbarItems,
  logo,
  locale,
  policyLinks = [],
  contactInputs = [],
  copyrightText,
  navBgClass = 'bg-[#f5f5f5]',
  overlayBgClass,
  pill = false,
  person = null,
}: {
  leftNavbarItems: NavItem[];
  rightNavbarItems: NavItem[];
  logo: any;
  locale: string;
  policyLinks?: LinkItem[];
  contactInputs?: ContactInput[];
  copyrightText?: string | null;
  navBgClass?: string;
  overlayBgClass?: string;
  pill?: boolean;
  person?: MenuPerson | null;
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

const inline = useMemo(
  () => (leftNavbarItems || []).filter((it) => {
    const t = (it.text || '').toLowerCase();
    const u = it.URL || '';
    return !(u === '/' || u === '' || t === 'home' || t === 'főoldal');
  }).slice(0, 4), // ← inline max 4 elem, hogy ne zsúfoljuk túl a felső sávot (ha több van, úgyis ott a hamburger menü)
  [leftNavbarItems]
);

  // pill = a hero fölött vagyunk (átlátszó háttér, fehér szöveg) — ugyanaz a
  // navbar-szerkezet/betűtípus mint mindenhol, csak a szín vált, folyamatos
  // átmenettel (nincs villanás), amikor scrollra visszaáll a normál sáv.
  return (
    <>
      <div className={cn(open ? (overlayBgClass || navBgClass) : navBgClass, HEADER_H, 'transition-colors duration-300')}>
        <nav className="relative flex items-center px-6 h-full">
          <Logo locale={locale} image={logo?.image} text={logo?.company} dark={pill && !open} />

          {/* Inline nav gombok — ezeken nincs flip hover, csak az overlay-en */}
          <div className={cn(
            'hidden xl:flex absolute left-1/2 -translate-x-1/2 gap-[10rem] transition-opacity',
            open ? 'opacity-0 pointer-events-none' : 'opacity-100'
          )}>
            {inline.map((it) => {
              const external = isExternal(it.URL);
              return (
                <Link
                  key={it.text}
                  href={external ? it.URL : `/${locale}${it.URL}`}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                  className={cn('text-base font-semibold transition-colors duration-300', pill ? 'text-white' : 'text-black')}
                >
                  {it.text}
                </Link>
              );
            })}
          </div>

          <div className="ml-auto flex items-center gap-6">
            <LocaleSwitcher currentLocale={locale} dark={pill && !open} />
            <button
              aria-label={open ? (locale === 'hu' ? 'Menü bezárása' : 'Close menu') : (locale === 'hu' ? 'Menü megnyitása' : 'Open menu')}
              aria-expanded={open}
              onClick={() => setOpen(v => !v)}
              className="relative w-16 h-16 overflow-hidden"
            >
              <motion.span className={cn('absolute inset-x-1 h-0.5 transition-colors duration-300', pill && !open ? 'bg-white' : 'bg-black')} initial={false} animate={open ? { y: 0, rotate: 12 } : { y: -4, rotate: 0 }} transition={SPRING_FAST} />
              <motion.span className={cn('absolute inset-x-1 h-0.5 transition-colors duration-300', pill && !open ? 'bg-white' : 'bg-black')} initial={false} animate={open ? { y: 0, rotate: -12 } : { y: 4, rotate: 0 }} transition={SPRING_FAST} />
            </button>
          </div>
        </nav>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="desktop-overlay"
            className={cn('fixed left-0 right-0 bottom-0 z-[70] origin-top overflow-hidden', OVERLAY_OFFSET, overlayBgClass || navBgClass)}
            style={{ willChange: 'transform, opacity' }}
            variants={OVERLAY_VARIANTS}
            initial="closed"
            animate="open"
            exit="closed"
            transition={OVERLAY_SPRING}
          >
            {/* a mobil menüvel egyező tartalom (2026-11), gépen középre igazítva: nagy menüpontok, a Szolgáltatások +/− lenyílóval
                (képes lista), alatta fekete gomb, az e-mail és a telefon, a copyright; a jogi linkek a láblécben vannak */}
            <div className="h-full overflow-y-auto overscroll-contain" data-lenis-prevent>
            <div className="px-10 pb-48 pt-10 xl:px-16">
              <motion.ul className="mx-auto flex max-w-3xl flex-col gap-1 text-center" variants={LIST_VARIANTS} initial="closed" animate="open">
                {leftNavbarItems.map((it, i) => {
                  const href = isExternal(it.URL) ? it.URL : `/${locale}${it.URL}`;
                  const services = isServices(it.URL);
                  return (
                    <motion.li key={`${it.text}-${i}`} variants={ITEM_VARIANTS}>
                      <div className="flex items-center justify-center gap-1">
                        <MotionLink
                          href={href}
                          target={isExternal(it.URL) ? '_blank' : undefined}
                          rel={isExternal(it.URL) ? 'noopener noreferrer' : undefined}
                          onClick={() => setOpen(false)}
                          className="inline-block font-semibold text-black"
                          whileHover="hover"
                          initial="rest"
                          animate="rest"
                        >
                          <div className="relative h-[72px] overflow-hidden">
                            {/* láthatatlan szöveg: a link szélessége a feliratéhoz igazodik, így a + közvetlenül mellé kerül */}
                            <span aria-hidden="true" className="invisible block whitespace-nowrap text-[58px] leading-[72px]">{it.text}</span>
                            <motion.div className="absolute left-0 right-0 top-0 text-[58px] leading-[72px]" variants={{ rest: { y: 0 }, hover: { y: -72, transition: { duration: 0.35, ease: [0.33, 1, 0.68, 1] } } }}>{it.text}</motion.div>
                            <motion.div className="absolute left-0 right-0 top-[72px] text-[58px] leading-[72px]" variants={{ rest: { y: 0 }, hover: { y: -72, transition: { duration: 0.35, ease: [0.33, 1, 0.68, 1] } } }}>{it.text}</motion.div>
                          </div>
                        </MotionLink>
                        {services && svc.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setSvcOpen((v) => !v)}
                            aria-expanded={svcOpen}
                            aria-label={locale === 'en' ? 'Show services' : 'Szolgáltatások mutatása'}
                            className="grid h-12 w-12 shrink-0 place-items-center text-black"
                          >
                            {/* + → −: a függőleges szár elfordul és eltűnik (margóval középre, nem transformmal) */}
                            <span aria-hidden="true" className="relative block h-5 w-5">
                              <span className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-current" />
                              <motion.span
                                className="absolute inset-y-0 left-0 right-0 mx-auto w-[2px] rounded-full bg-current"
                                initial={false}
                                animate={svcOpen ? { rotate: 90, scaleY: 0, opacity: 0 } : { rotate: 0, scaleY: 1, opacity: 1 }}
                                transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
                              />
                            </span>
                          </button>
                        )}
                      </div>
                      {services && (
                        <motion.div
                          initial={false}
                          animate={{ height: svcOpen ? 'auto' : 0, opacity: svcOpen ? 1 : 0 }}
                          transition={{ height: { duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }, opacity: { duration: 0.3, delay: svcOpen ? 0.1 : 0 } }}
                          className="overflow-hidden"
                        >
                          <ul className="grid grid-cols-5 gap-4 pb-6 pt-5">
                            {svc.map((sv, k) => (
                              <motion.li key={sv.slug} initial={false} animate={svcOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }} transition={{ type: 'spring', stiffness: 280, damping: 24, delay: svcOpen ? 0.08 + k * 0.05 : 0 }}>
                                <Link
                                  href={`/${locale}/${locale === 'en' ? 'services' : 'szolgaltatasok'}/${sv.slug}`}
                                  onClick={() => setOpen(false)}
                                  className="group flex flex-col gap-3 text-left"
                                >
                                  {/* kivágott sarkú kártya: a jobb alsó sarokban a menü hátterével „kiharapott” mélyedés, benne
                                      sötét, kerek nyíl-gomb; a két homorú átmenet radial-gradient (a háttér színe: #f5f5f5) */}
                                  <span className="relative block aspect-[4/3] w-full">
                                    <span className="absolute inset-0 overflow-hidden rounded-2xl">
                                      {/* eslint-disable-next-line @next/next/no-img-element */}
                                      <img src={sv.image} alt="" width={240} height={180} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                    </span>
                                    <span aria-hidden="true" className="absolute bottom-0 right-0 h-[46px] w-[46px] rounded-tl-[14px] bg-[#f5f5f5]" />
                                    <span aria-hidden="true" className="absolute bottom-[46px] right-0 h-[14px] w-[14px]" style={{ background: 'radial-gradient(circle at 0 0, transparent 13.5px, #f5f5f5 14px)' }} />
                                    <span aria-hidden="true" className="absolute bottom-0 right-[46px] h-[14px] w-[14px]" style={{ background: 'radial-gradient(circle at 0 0, transparent 13.5px, #f5f5f5 14px)' }} />
                                    <span aria-hidden="true" className="absolute bottom-0 right-0 flex h-[38px] w-[38px] items-center justify-center overflow-hidden rounded-full bg-black text-white transition-transform duration-300 group-hover:scale-95">
                                      <ArrowUpRight className="absolute h-3.5 w-3.5 transition-[transform,opacity] duration-300 ease-out group-hover:translate-x-7 group-hover:-translate-y-7 group-hover:opacity-0" strokeWidth={2} />
                                      <ArrowUpRight className="absolute h-3.5 w-3.5 -translate-x-7 translate-y-7 opacity-0 transition-[transform,opacity] duration-300 ease-out group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" strokeWidth={2} />
                                    </span>
                                  </span>
                                  <span className="px-0.5 text-lg font-medium leading-tight tracking-tight text-black">{sv.title}</span>
                                </Link>
                              </motion.li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </motion.li>
                  );
                })}
              </motion.ul>


              <div className="mt-12 flex flex-col items-center gap-6 text-center">
                <motion.div className="flex flex-col items-center gap-3" initial="initial" animate="enter">
                  {contactInputs.map((it, idx) => {
                    const raw = String(it?.name || '').trim();
                    if (!raw) return null;
                    const isEmail = raw.includes('@');
                    const value = raw.replace(/^mailto:/, '');
                    const cHref = isEmail ? `mailto:${value}` : `tel:${value.replace(/[^\d+]/g, '')}`;
                    return isEmail ? (
                      <motion.a key={`ct-${idx}`} href={cHref} onClick={() => setOpen(false)}
                        className="group inline-flex cursor-pointer select-none items-center gap-3 py-1"
                        variants={CONTACT_ITEM} custom={idx} whileHover="hover">
                        <motion.div className="grid h-6 w-6 place-items-center rounded-full bg-black" variants={{ hover: CONTACT_HOVER.plus }}>
                          <div className="relative h-3 w-3">
                            <span className="absolute inset-x-0 top-1/2 block h-0.5 -translate-y-1/2 bg-white" />
                            <span className="absolute inset-y-0 left-1/2 block w-0.5 -translate-x-1/2 bg-white" />
                          </div>
                        </motion.div>
                        <span className="relative block text-[32px] font-semibold tracking-tight text-black lg:text-[22px] xl:text-[32px]">
                          {value}
                          <motion.span className="absolute -bottom-[2px] left-0 right-0 h-0.5 origin-left bg-black" variants={{ hover: CONTACT_HOVER.underline }} />
                        </span>
                      </motion.a>
                    ) : (
                      <motion.a key={`ct-${idx}`} href={cHref} onClick={() => setOpen(false)}
                        className="cursor-pointer text-[18px] text-black transition hover:opacity-70"
                        variants={CONTACT_ITEM} custom={idx}>{raw}</motion.a>
                    );
                  })}
                </motion.div>
                {copyrightText && <div className="px-4 py-2 text-sm text-neutral-600">{copyrightText}</div>}
              </div>
            </div>
            </div>

            {/* a jobb alsó sarokban végig látszik (nem görög): a főoldali hero személyes kártyája, ugyanabból a CMS-adatból */}
            {person && (
              <motion.div
                className="absolute bottom-8 right-8 z-10"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 24, delay: 0.25 }}
              >
                <PersonCard
                  name={person.name}
                  role={person.role}
                  org={person.org}
                  imageUrl={person.image ? strapiImage(person.image) : null}
                  action={person.cta ? (
                    <PillLink href={localizeHref(person.cta.URL, locale)} cta="desktop-menu:person" className="mt-1 self-start">
                      {person.cta.text}
                    </PillLink>
                  ) : null}
                />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
