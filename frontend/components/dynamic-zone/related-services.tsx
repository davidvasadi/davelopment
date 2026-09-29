// frontend/components/dynamic-zone/related-services.tsx
// „Kapcsolódó szolgáltatások" blokk. A tartalom (services) szerver-oldalon
// injektálódik a szolgáltatás-oldal sablonjából — a többi szolgáltatás a global
// sorrendjében, az aktuális oldalt kiszűrve. Ugyanazt a rács-komponenst használja,
// mint a /szolgaltatasok listázó oldal, hogy a megjelenés egyezzen.

'use client';

import { ServicesPage } from '@/components/services/services-page';

export type RelatedServicePage = {
    id: number;
    slug: string;
    label?: string | null;
    card_short_description?: string | null;
    card_tags?: { tag: string }[] | null;
    video_poster?: { url?: string | null } | null;
};

export const RelatedServices = ({
    heading,
    badge_label,
    services,
    locale,
}: {
    heading?: string | null;
    badge_label?: string | null;
    services?: RelatedServicePage[];
    locale: string;
}) => {
    const list = (services ?? []).filter((p) => p?.slug);
    if (!list.length) return null;

    const isHu = locale?.toLowerCase().startsWith('hu');
    const headingText = heading?.trim() || (isHu ? 'Fedezd fel a többi szolgáltatást is.' : 'Discover the other services too.');

    return (
        <ServicesPage
            pages={list.map((p) => ({ ...p, locale }))}
            locale={locale}
            heading={headingText}
            badge_label={badge_label?.trim() || undefined}
        />
    );
};
