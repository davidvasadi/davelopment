// components/services/other-services.tsx
// „További szolgáltatások" — az egyedi szolgáltatás-oldalak aljára.
// A `service` global oldal-listájából épül, kiszűrve az aktuális oldalt.
// Képes linksor: soronként thumbnail + sorszám + cím + körös nyíl.
// Reszponzív: mindig lefelé haladó, egymás alá pakolt lista.

import Link from 'next/link';
import { Plus, ArrowRight } from 'lucide-react';

import { getLocalizedSegment } from '@/lib/i18n/segments';
import { strapiImage } from '@/lib/strapi/strapiImage';

export type OtherServicePage = {
  id: number;
  slug: string;
  label?: string | null;
  video_poster?: { url?: string | null } | null;
};

type OtherServicesProps = {
  pages: OtherServicePage[];
  locale: string;
  /** Opcionális felülírás (pl. a Payload blokkból). Üresen az alapértelmezett. */
  heading?: string | null;
  badgeLabel?: string | null;
};

export function OtherServices({ pages, locale, heading, badgeLabel }: OtherServicesProps) {
  const list = (pages ?? []).filter((p) => p?.slug);
  if (!list.length) return null;

  const segment = getLocalizedSegment(locale, 'services');
  const isHu = locale?.toLowerCase().startsWith('hu');
  const headingText = heading?.trim() || (isHu ? 'További szolgáltatások' : 'More services');
  const eyebrow = badgeLabel?.trim() || (isHu ? 'Fedezd fel' : 'Discover');

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-10 xl:px-0 py-16 md:py-24">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-4 h-4 rounded-full bg-black flex items-center justify-center flex-none">
          <Plus className="w-2.5 h-2.5 text-white" strokeWidth={3} />
        </span>
        <span className="text-xs font-semibold text-black/50">{eyebrow}</span>
      </div>

      <h2 className="text-black text-3xl md:text-4xl font-semibold tracking-tight mb-8">
        {headingText}
      </h2>

      <nav className="border-t border-black/10">
        {list.map((page, idx) => {
          const img = page.video_poster?.url ? strapiImage(page.video_poster.url) : null;
          return (
            <Link
              key={page.id ?? idx}
              href={`/${locale}/${segment}/${page.slug}`}
              className="group flex items-center gap-4 md:gap-5 py-4 border-b border-black/10"
            >
              <span
                className="w-16 h-16 rounded-2xl bg-black/5 bg-cover bg-center flex-none"
                style={img ? { backgroundImage: `url(${img})` } : undefined}
              />

              <span className="flex flex-col gap-0.5 min-w-0 flex-1">
                <span className="text-xs font-bold text-black/30 tabular-nums tracking-wider">
                  {String(idx + 1).padStart(3, '0')}
                </span>
                <span className="text-xl md:text-2xl font-semibold tracking-tight text-black leading-tight transition-transform duration-300 group-hover:translate-x-1">
                  {page.label ?? page.slug}
                </span>
              </span>

              <span className="w-10 h-10 rounded-full border border-black/15 flex items-center justify-center flex-none transition-all duration-300 group-hover:bg-black group-hover:translate-x-1">
                <ArrowRight className="h-[18px] w-[18px] text-black transition-colors duration-300 group-hover:text-white" strokeWidth={2.2} />
              </span>
            </Link>
          );
        })}
      </nav>
    </section>
  );
}
