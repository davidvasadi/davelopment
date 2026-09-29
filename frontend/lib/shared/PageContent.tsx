import { AmbientColor } from '@/components/decorations/ambient-color';
import DynamicZoneManager from '@/components/dynamic-zone/manager';

export default function PageContent({ pageData, locale, fadeZoom = false }: { pageData: any; locale?: string; fadeZoom?: boolean }) {
  const dynamicZone = pageData?.dynamic_zone;
  const resolvedLocale = locale ?? pageData?.locale ?? 'hu';
  return (
    <div className="relative w-full">
      {/* <AmbientColor /> */}
      {dynamicZone && (
        <DynamicZoneManager
          dynamicZone={dynamicZone}
          locale={resolvedLocale}
          fadeZoom={fadeZoom}
        />
      )}
    </div>
  );
}
