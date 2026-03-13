'use client';

import { motion } from 'framer-motion';
import { DesktopNavbar } from './desktop-navbar';
import { MobileNavbar } from './mobile-navbar';
import { cn } from '@/lib/utils';

const DEFAULT_NAV_BG = 'bg-[#f5f5f5]';

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
  const contactInputs =
    data?.Form?.[0]?.inputs ??
    data?.form?.[0]?.inputs ??
    data?.contact?.inputs ??
    [];
  const copyrightText =
    data?.copyright ??
    data?.footer?.copyright ??
    data?.global?.copyright ??
    '';

  // Fix: navBgClass-t clean class stringként adjuk át, nem assignment-ként
  const resolvedBg = navBgClass || DEFAULT_NAV_BG;

  return (
    <motion.nav
      className={cn('fixed top-0 inset-x-0 z-50 isolate', resolvedBg)}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* DESKTOP */}
      <div className="hidden lg:block">
        <DesktopNavbar
          locale={locale}
          leftNavbarItems={data?.left_navbar_items ?? []}
          rightNavbarItems={data?.right_navbar_items ?? []}
          logo={data?.logo}
          policyLinks={policyLinks}
          contactInputs={contactInputs}
          copyrightText={copyrightText}
          navBgClass={resolvedBg}
        />
      </div>

      {/* MOBILE */}
      <div className="lg:hidden">
        <MobileNavbar
          locale={locale}
          leftNavbarItems={data?.left_navbar_items ?? []}
          logo={data?.logo}
          policyLinks={policyLinks}
          contactInputs={contactInputs}
          copyrightText={copyrightText}
          navBgClass={resolvedBg}
        />
      </div>
    </motion.nav>
  );
}
