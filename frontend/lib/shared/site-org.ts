// lib/shared/site-org.ts
// Site-wide brand data for structured data (Organization node).
// The logo lives in Payload: global.navbar.logo → logos.image → media.url.
// Wrapped in React cache() so multiple callers in one request share one fetch.

import { cache } from 'react';
import fetchContentType from '@/lib/strapi/fetchContentType';
import { strapiImage } from '@/lib/strapi/strapiImage';

/**
 * Absolute URL of the brand logo from the `global` global. Returns null if not
 * set (Organization.logo is then simply omitted — never a broken reference).
 * The logo is not localized, so we always read the default locale.
 */
export const getSiteLogoUrl = cache(async (): Promise<string | null> => {
  try {
    const global = await fetchContentType('global', { filters: { locale: 'hu' } }, true);
    const logo = global?.navbar?.logo ?? global?.footer?.logo;
    const raw = logo?.image?.url ?? logo?.url ?? null;
    if (!raw || typeof raw !== 'string') return null;
    return strapiImage(raw) || null;
  } catch {
    return null;
  }
});
