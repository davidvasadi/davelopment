'use client';

import { motion } from 'framer-motion';
import { DesktopNavbar } from './desktop-navbar';
import { MobileNavbar } from './mobile-navbar';
import { cn } from '@/lib/utils';

export function Navbar({
  data,
  locale,
  navBgClass = 'bg-#f5f5f5', // ⬅️ ÚJ: kívülről állítható háttér
}: {
  data: any;
  locale: string;
  navBgClass?: string;              // ⬅️ ÚJ
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

  return (
    <motion.nav className={cn('fixed top-0 inset-x-0 z-50 isolate', navBgClass='bg-[#f5f5f5]')}>{/* ⬅️ wrapper is kap háttért */}
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
          navBgClass={navBgClass} // ⬅️ továbbadjuk
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
          navBgClass={navBgClass} // ⬅️ továbbadjuk
        />
      </div>
    </motion.nav>
  );
}
