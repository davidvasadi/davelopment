// lib/shared/google-rating.ts
// A scripts/google-reviews/fetch_rating.py cron script által naponta
// kiírt, cache-elt Google Cégem-pontszám beolvasása. Nincs élő API-hívás
// oldalbetöltéskor — lásd docs/audit/2026-10-09.md a döntés indoklásáért.

import { readFile, stat } from 'fs/promises';
import path from 'path';

export type GoogleRating = {
  rating: number;
  userRatingCount: number;
  name?: string;
  googleMapsUrl?: string;
  fetchedAt: string;
};

export async function getCachedGoogleRating(): Promise<GoogleRating | null> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'google-rating.json');
    const raw = await readFile(filePath, 'utf-8');
    const data = JSON.parse(raw);
    if (typeof data?.rating !== 'number' || typeof data?.userRatingCount !== 'number') return null;
    return data as GoogleRating;
  } catch {
    return null;
  }
}

export type GoogleReview = {
  authorName: string;
  text: string;
  rating: number | null;
  /** Relatív útvonal a saját public/ mappánkban (a cron script tölti le, nem Google-hotlink). */
  photoUrl: string | null;
  publishTime: string | null;
};

/** Csak az 1 mondatnál hosszabb, tartalmas véleményeket tartalmazza (lásd fetch_rating.py szűrője). */
export async function getCachedGoogleReviews(): Promise<GoogleReview[]> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'google-reviews.json');
    const raw = await readFile(filePath, 'utf-8');
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data as GoogleReview[];
  } catch {
    return [];
  }
}

// Csak a valódi profilképes értékelések (a főoldali értékelés-blokkhoz, 2026-11).
// A Google a kép nélküli fiókoknak is ad „képet” (egyszínű kör egy betűvel) — ez kicsi fájl (~3 KB), egy valódi
// fotó 25 KB fölött van. Fájlméret alapján szűrünk: a sharp a deployban nem tölthető be (az rsync kihagyja a
// .next/node_modules-t, ahová a Turbopack a külső modult linkeli), és itt nem is kell.
const REAL_PHOTO_MIN_BYTES = 10_000;
const photoSizeCache = new Map<string, number>();
export async function getGoogleReviewsWithRealPhoto(): Promise<GoogleReview[]> {
  const reviews = await getCachedGoogleReviews();
  const out: GoogleReview[] = [];
  for (const r of reviews) {
    const file = r.photoUrl?.split('/').pop();
    if (!file || !/^[\w.-]+$/.test(file)) continue;
    let size = photoSizeCache.get(file);
    if (size === undefined) {
      try {
        size = (await stat(path.join(process.cwd(), 'public', 'data', 'google-review-photos', file))).size;
      } catch {
        size = 0;
      }
      photoSizeCache.set(file, size);
    }
    if (size >= REAL_PHOTO_MIN_BYTES) out.push(r);
  }
  return out;
}
