'use client';

import { OPEN_CONSENT_EVENT } from '@/lib/consent';

/** Footer link that reopens the cookie banner, so consent can be changed or withdrawn any time. */
export function CookieSettingsButton({ locale, className }: { locale: string; className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}
      className={className}
    >
      {locale === 'en' ? 'Cookie settings' : 'Süti-beállítások'}
    </button>
  );
}
