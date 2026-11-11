import { i18n } from '@/i18n.config';

const LOCALE_PREFIX = new RegExp(`^/(${i18n.locales.join('|')})(/|$|\\?|#)`);

/**
 * Turns a CMS link into a final internal URL for the given locale.
 * - external / mailto / tel / #anchor links are returned unchanged
 * - links that already carry a locale prefix (/hu/..., /en/...) are left alone (no /hu/hu/...)
 * - everything else gets the locale prefix (/arak -> /hu/arak), so internal links never go through a redirect
 */
export function localizeHref(url: string | null | undefined, locale: string, fallback = '#'): string {
  const u = (url ?? '').trim();
  if (!u) return fallback;
  if (/^(https?:|mailto:|tel:|#)/i.test(u)) return u;
  if (!u.startsWith('/')) return u;
  if (LOCALE_PREFIX.test(u)) return u;
  // non-page paths (API, uploads, Next assets, files like .pdf / .png / llms.txt) are never prefixed
  if (/^\/(api|admin|uploads|_next|images)(\/|$)/.test(u)) return u;
  if (/\.[a-z0-9]{2,5}(\?|#|$)/i.test(u)) return u;
  return `/${locale}${u}`;
}
