import Link from 'next/link';
import { Container } from '@/components/container';
import { getLocalizedSegment } from '@/lib/i18n/segments';

type ServiceRow = {
  slug?: string;
  label?: string | null;
  card_short_description?: string | null;
  card_tags?: { tag?: string }[] | null;
};

/**
 * Statikus, mindig renderelt összehasonlító táblázat a szolgáltatás-lista
 * oldalhoz — nem árakat hasonlít (nincs pricing itt), hanem azt, hogy melyik
 * szolgáltatás mire jó, a ténylegesen szerkesztett card_short_description és
 * card_tags mezőkből. Lásd GEO audit, 2026-10-14 ("Comparison Table is missing").
 */
export const ServicesComparisonTable = ({
  pages,
  locale,
}: {
  pages: ServiceRow[];
  locale: string;
}) => {
  const clean = (pages || []).filter((p) => p.slug && p.label);
  if (clean.length < 2) return null;

  const isHu = locale === 'hu';
  const segment = getLocalizedSegment(locale, 'services');

  return (
    <section className="w-full">
      <Container className="py-8 md:py-10">
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-sm md:text-base">
              <caption className="sr-only">
                {isHu ? 'Szolgáltatások összehasonlítása' : 'Compare our services'}
              </caption>
              <thead>
                <tr className="border-b border-gray-100">
                  <th scope="col" className="text-left text-black/50 font-normal py-4 px-6">
                    {isHu ? 'Szolgáltatás' : 'Service'}
                  </th>
                  <th scope="col" className="text-left text-black/50 font-normal py-4 px-6">
                    {isHu ? 'Mire jó' : 'Best for'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {clean.map((p) => (
                  <tr key={p.slug} className="border-b border-gray-100 last:border-b-0">
                    <th scope="row" className="text-left font-semibold py-4 px-6 align-top whitespace-nowrap">
                      <Link href={`/${locale}/${segment}/${p.slug}`} className="hover:underline">
                        {p.label}
                      </Link>
                    </th>
                    <td className="text-black/70 py-4 px-6 align-top">
                      {p.card_short_description || '—'}
                      {!!p.card_tags?.length && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {p.card_tags.map((t, i) => (
                            <span
                              key={i}
                              className="text-xs text-black/60 bg-black/5 rounded-full px-2.5 py-0.5"
                            >
                              {t.tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Container>
    </section>
  );
};
