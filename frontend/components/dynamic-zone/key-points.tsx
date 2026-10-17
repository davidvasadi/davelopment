import { Container } from '@/components/container';
import { PlusIcon } from 'lucide-react';

type Point = { text?: string | null };

/**
 * Rövid, pontokba szedett "dióhéjban" összefoglaló — mindig statikus HTML-ben
 * (nincs 'use client' interakció mögé rejtve), hogy a Google/AI-crawlerek
 * JS nélkül is lássák a legfontosabb tényeket. Lásd GEO audit, 2026-10-14.
 */
export const KeyPoints = ({
  heading,
  points,
}: {
  heading?: string | null;
  points?: Point[] | null;
}) => {
  const clean = (points || []).map((p) => p?.text).filter(Boolean) as string[];
  if (!clean.length) return null;

  return (
    <section className="w-full">
      <Container className="py-8 md:py-10">
        <div className="bg-white border border-gray-100 rounded-2xl px-6 py-6 md:px-8 md:py-7">
          {heading && (
            <p className="text-xs font-semibold uppercase tracking-wide text-black/50 mb-4">
              {heading}
            </p>
          )}
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
            {clean.map((text, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5 w-5 h-5 bg-black border border-gray-200 rounded-full flex items-center justify-center">
                  <PlusIcon className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm md:text-base text-black/80">{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
};
