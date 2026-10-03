'use client';

import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useRef, useState } from 'react';
import { DesktopNavbar } from './desktop-navbar';
import { MobileNavbar } from './mobile-navbar';
import { isServiceHeroPath } from './navbar-theme';
import { usePreloaderDone } from '../ui/preloader';
import { cn } from '@/lib/utils';

const DEFAULT_NAV_BG = 'bg-[#f5f5f5]';
const TOP_THRESHOLD = 80;

export function Navbar({
  data,
  locale,
  navBgClass = DEFAULT_NAV_BG,
}: {
  data: any;
  locale: string;
  navBgClass?: string;
}) {
  const policyLinks = data?.policy_links ?? data?.policy ?? [];
  const contactInputs = (() => {
    // Payload Global navbar.contact_email / contact_phone
    if (data?.contact_email || data?.contact_phone) {
      return [
        data?.contact_phone ? { type: 'tel', name: data.contact_phone } : null,
        data?.contact_email ? { type: 'email', name: data.contact_email } : null,
      ].filter(Boolean);
    }
    // fallback: old Strapi form inputs format
    return (
      data?.Form?.[0]?.inputs ??
      data?.form?.[0]?.inputs ??
      data?.contact?.inputs ??
      []
    );
  })();
  const copyrightText = `© ${new Date().getFullYear()} [davelopment]©`;

  const pathname = usePathname();
  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;
  const leftNavbarItems = (data?.left_navbar_items ?? []).filter(
    (it: { URL: string }) => !(isHome && it.URL === '/')
  );

  // Szinkron, pathname-alapú detektálás — nincs react-effect-késés, az első
  // kirajzoláskor már helyes (lásd navbar-theme.tsx).
  const isServiceHero = isServiceHeroPath(pathname);

  // Lefelé görgetve elrejtjük, felfelé görgetve (vagy az oldal tetején) megjelenik.
  // Szolgáltatás-aloldalakon a hero fölött lebegő "pill" navbar amíg a tetején
  // vagyunk (atTop) — utána visszavált a megszokott, elrejthető sávra.
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const lastScrollY = useRef(0);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setAtTop(latest < TOP_THRESHOLD);
    const pillActive = isServiceHero && latest < TOP_THRESHOLD;
    if (pillActive) {
      setHidden(false);
      lastScrollY.current = latest;
      return;
    }
    const diff = latest - lastScrollY.current;
    if (latest < 80) {
      setHidden(false);
    } else if (diff > 5) {
      setHidden(true);
    } else if (diff < -5) {
      setHidden(false);
    }
    lastScrollY.current = latest;
  });

  const pill = isServiceHero && atTop;
  const resolvedBg = pill ? 'bg-transparent' : (navBgClass || DEFAULT_NAV_BG);

  // A tartalom (lásd preloader.tsx AppWrapper) már a Preloader alatt renderelődik,
  // nem azután — enélkül a nav fade-in-je végigfutott volna, mire a Preloader
  // eltűnik, és instant jelenne meg becsúszás helyett.
  const preloaderDone = usePreloaderDone();

  return (
    <motion.nav
      className={cn('fixed top-0 inset-x-0 z-50 isolate', resolvedBg)}
      initial={{ opacity: 0, y: -8 }}
      animate={preloaderDone ? { opacity: 1, y: hidden ? '-100%' : 0 } : { opacity: 0, y: -8 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* DESKTOP */}
      <div className="hidden lg:block">
        <DesktopNavbar
          locale={locale}
          leftNavbarItems={leftNavbarItems}
          rightNavbarItems={data?.right_navbar_items ?? []}
          logo={data?.logo}
          policyLinks={policyLinks}
          contactInputs={contactInputs}
          copyrightText={copyrightText}
          navBgClass={resolvedBg}
          overlayBgClass={navBgClass || DEFAULT_NAV_BG}
          pill={pill}
        />
      </div>

      {/* MOBILE */}
      <div className="lg:hidden">
        <MobileNavbar
          locale={locale}
          leftNavbarItems={leftNavbarItems}
          logo={data?.logo}
          policyLinks={policyLinks}
          contactInputs={contactInputs}
          copyrightText={copyrightText}
          navBgClass={resolvedBg}
          overlayBgClass={navBgClass || DEFAULT_NAV_BG}
          pill={pill}
        />
      </div>
    </motion.nav>
  );
}
