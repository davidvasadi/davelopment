// Statikus, kódba épített összehasonlító táblázat a "WordPress vagy egyedi
// weboldal 2026-ban?" cikkhez — a GEO audit (2026-10-14) kifejezetten ezt az
// oldalt jelölte meg "Comparison Table is missing" hibával (1-es prioritás).
// Szándékosan NEM új Payload-blokk/tábla (nincs séma-/migrációs kockázat) —
// csak erre az egy cikkre renderelődik, a cikk saját, valódi szövegéből vett
// szempontok alapján (sebesség, AI-láthatóság, karbantartási kockázat,
// hosszú távú költség), nem kitalált adatokkal.
import { Container } from '@/components/container';

const ROWS: { aspect: { hu: string; en: string }; wordpress: { hu: string; en: string }; custom: { hu: string; en: string } }[] = [
  {
    aspect: { hu: 'Betöltési sebesség', en: 'Load speed' },
    wordpress: { hu: 'Plugin-ökoszisztéma miatt gyakran lassabb, ahogy nő az oldal', en: 'Often slower as the site grows, due to the plugin ecosystem' },
    custom: { hu: 'Eleve gyors, nincs felesleges plugin-kód', en: 'Fast by default, no unnecessary plugin code' },
  },
  {
    aspect: { hu: 'AI-keresők láthatósága', en: 'AI search visibility' },
    wordpress: { hu: 'Tiszta, strukturált jelölés nélkül eleve hátránnyal indul', en: 'Starts at a disadvantage without clean, structured markup' },
    custom: { hu: 'Gyors, tiszta kód — könnyebben értelmezhető és idézhető', en: 'Fast, clean code — easier for AI engines to parse and cite' },
  },
  {
    aspect: { hu: 'SEO/GEO alapok', en: 'SEO/GEO foundations' },
    wordpress: { hu: 'Utólag kell rájuk vadászni, karbantartás-függő', en: 'Have to be retrofitted later, depends on ongoing maintenance' },
    custom: { hu: 'Már a fejlesztés során beépülnek', en: 'Built in during development, not bolted on after' },
  },
  {
    aspect: { hu: 'Karbantartási kockázat', en: 'Maintenance risk' },
    wordpress: { hu: 'Folyamatos plugin-/mag-frissítés, hiba esetén helyreállítás kell', en: 'Ongoing plugin/core updates, recovery needed if something breaks' },
    custom: { hu: 'Nem épül plugin-ökoszisztémára, ez a kockázat eltűnik', en: "Doesn't rely on a plugin ecosystem, so this risk disappears" },
  },
  {
    aspect: { hu: 'Hosszú távú költség', en: 'Long-term cost' },
    wordpress: { hu: 'A karbantartási díj évek alatt összeadódik', en: 'Maintenance fees add up over the years' },
    custom: { hu: '2-3 év karbantartási díja gyakran kijön egy modern oldal árából', en: "2-3 years of maintenance fees often cover a modern site's cost" },
  },
];

export const WordpressVsCustomTable = ({ locale }: { locale: string }) => {
  const isHu = locale === 'hu';
  return (
    <section className="w-full not-prose">
      <Container className="py-8 md:py-10 px-0">
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-sm md:text-base">
              <caption className="sr-only">
                {isHu ? 'WordPress vs egyedi weboldal összehasonlítás' : 'WordPress vs custom website comparison'}
              </caption>
              <thead>
                <tr className="border-b border-gray-100">
                  <th scope="col" className="text-left text-black/50 font-normal py-4 px-6">
                    {isHu ? 'Szempont' : 'Aspect'}
                  </th>
                  <th scope="col" className="text-left text-black/50 font-normal py-4 px-6">
                    WordPress
                  </th>
                  <th scope="col" className="text-left text-black/50 font-normal py-4 px-6">
                    {isHu ? 'Egyedi fejlesztés' : 'Custom build'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row) => (
                  <tr key={row.aspect.hu} className="border-b border-gray-100 last:border-b-0">
                    <th scope="row" className="text-left font-semibold py-4 px-6 align-top whitespace-nowrap">
                      {isHu ? row.aspect.hu : row.aspect.en}
                    </th>
                    <td className="text-black/70 py-4 px-6 align-top">{isHu ? row.wordpress.hu : row.wordpress.en}</td>
                    <td className="text-black/70 py-4 px-6 align-top">{isHu ? row.custom.hu : row.custom.en}</td>
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
