import { AmbientColor } from '@/components/decorations/ambient-color';
import DynamicZoneManager from '@/components/dynamic-zone/manager';
import { getCachedGoogleReviews } from '@/lib/shared/google-rating';

// A CMS-es "testimonials" blokk StatCard-ja (heading, leírás, CTA-gomb)
// oldalanként kézzel szerkesztett marad — csak az idézet-kártyák (szöveg,
// fotó, név, csillag) jönnek élő Google-értékelésekből, hogy ne kézzel
// felvitt, nem valós tartalom szerepeljen. Lásd
// components/dynamic-zone/testimonials/index.tsx (googleReviews prop) és
// docs/audit/2026-10-09.md.
export default async function PageContent({ pageData, locale, fadeZoom = false }: { pageData: any; locale?: string; fadeZoom?: boolean }) {
  const dynamicZone = pageData?.dynamic_zone;
  const resolvedLocale = locale ?? pageData?.locale ?? 'hu';

  const googleReviews = await getCachedGoogleReviews();

  return (
    <div className="relative w-full">
      {/* <AmbientColor /> */}
      {dynamicZone && (
        <DynamicZoneManager
          dynamicZone={dynamicZone}
          locale={resolvedLocale}
          fadeZoom={fadeZoom}
          googleReviews={googleReviews}
        />
      )}
    </div>
  );
}
