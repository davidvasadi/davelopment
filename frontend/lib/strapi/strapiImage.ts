// lib/strapi/strapiImage.ts
import { unstable_noStore as noStore } from 'next/cache';

const STRAPI_BASE_URL = (process.env.NEXT_PUBLIC_STRAPI_URL ?? 'http://localhost:1337').replace(
  /\/+$/,
  ''
);

/**
 * Strapi media helper:
 * - Relatív `/uploads/...` URL-ből abszolút URL-t csinál.
 * - Ha már abszolút (http/https), érintetlenül hagyja.
 */
export function strapiImage(url?: string | null): string {
  noStore();

  if (!url) return '';

  // már abszolút (pl. https://davelopment.hu/uploads/...)
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // relatív útvonal /uploads-szal vagy anélkül
  if (url.startsWith('/')) {
    return `${STRAPI_BASE_URL}${url}`;
  }

  // biztos ami biztos: ha nincs / az elején
  return `${STRAPI_BASE_URL}/${url.replace(/^\/+/, '')}`;
}
