// frontend/components/google-rating-badge.tsx
// Szerver-komponens: a napi cron script által kiírt cache-elt Google
// Cégem-pontszámot jeleníti meg. Nincs élő API-hívás oldalbetöltéskor —
// a fájlt a scripts/google-reviews/fetch_rating.py tölti fel naponta.
// Ha a fájl hiányzik vagy hibás (pl. még nem futott le a cron), a komponens
// egyszerűen nem renderel semmit — nincs hibaüzenet, nincs placeholder.

import { Star } from 'lucide-react';
import { getCachedGoogleRating } from '@/lib/shared/google-rating';

export async function GoogleRatingBadge({
  locale,
  className = '',
  dark = false,
}: {
  locale: string;
  className?: string;
  /** Sötét hátterű szekciókhoz (pl. lábléc) — világos szöveg/csillag-kontraszt. */
  dark?: boolean;
}) {
  const data = await getCachedGoogleRating();
  if (!data) return null;

  const isHu = locale === 'hu';
  const label = isHu
    ? `${data.userRatingCount} Google-értékelés`
    : `${data.userRatingCount} Google reviews`;

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-0.5" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < Math.round(data.rating)
                ? 'fill-current text-amber-400'
                : dark
                  ? 'text-white/30'
                  : 'text-neutral-300'
            }`}
          />
        ))}
      </div>
      <span className={`text-sm font-medium ${dark ? 'text-white/80' : 'text-neutral-700'}`}>
        {data.rating.toFixed(1)} · {label}
      </span>
    </div>
  );
}
