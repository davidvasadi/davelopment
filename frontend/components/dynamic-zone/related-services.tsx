// frontend/components/dynamic-zone/related-services.tsx
// „Kapcsolódó szolgáltatások" blokk. A tartalom (services) szerver-oldalon
// injektálódik a szolgáltatás-oldal sablonjából — a többi szolgáltatás a global
// sorrendjében, az aktuális oldalt kiszűrve. A blokk csak a POZÍCIÓT + a fejlécet adja.

'use client';

import { OtherServices, type OtherServicePage } from '@/components/services/other-services';

export const RelatedServices = ({
  heading,
  badge_label,
  services,
  locale,
}: {
  heading?: string | null;
  badge_label?: string | null;
  services?: OtherServicePage[];
  locale: string;
}) => {
  return (
    <OtherServices
      pages={services ?? []}
      locale={locale}
      heading={heading}
      badgeLabel={badge_label}
    />
  );
};
