import { AmbientColor } from '@/components/decorations/ambient-color';
import DynamicZoneManager from '@/components/dynamic-zone/manager';

export default function PageContent({ pageData, locale }: { pageData: any; locale?: string }) {
  const dynamicZone = pageData?.dynamic_zone;
  const resolvedLocale = locale ?? pageData?.locale ?? 'hu';
  return (
    <div className="relative w-full">
      {/* <AmbientColor /> */}
      {dynamicZone && (
        <DynamicZoneManager
          dynamicZone={dynamicZone}
          locale={resolvedLocale}
        />
      )}
    </div>
  );
}
