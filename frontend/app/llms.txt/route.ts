// llms.txt — a feltörekvő llmstxt.org szabvány szerint, hogy az LLM-alapú
// keresők (ChatGPT, Perplexity, Claude stb.) gyorsan megértsék, mit csinál
// az oldal és hol találják a legfontosabb tartalmakat.
export const dynamic = 'force-static';

export async function GET() {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://davelopment.hu').replace(/\/+$/, '');

  const content = `# [davelopment]®

> Weboldal készítés, UX/UI design, branding/arculattervezés és digitális marketing (SEO, Google Ads) egy kézben, magyar kisvállalkozásoknak és vállalkozóknak. Havi előfizetéses csomagok karbantartással, vagy egyszeri fejlesztés — egyedi design, nem sablon.

## Szolgáltatások

- [Szolgáltatások áttekintés](${base}/hu/szolgaltatasok): Webdesign és fejlesztés, branding, SEO/tartalommarketing, digitális rendszerek.
- [Weboldal készítés](${base}/hu/szolgaltatasok/weboldal-keszites): Egyedi weboldal tervezés és fejlesztés kisvállalkozásoknak.
- [UX/UI Design & fejlesztés](${base}/hu/szolgaltatasok/ux-ui-design-fejlesztes): Felhasználói élmény tervezés és interfész fejlesztés.
- [Branding & arculattervezés](${base}/hu/szolgaltatasok/branding-arculat): Márkaépítés, logó, vizuális identitás.
- [SEO & tartalommarketing](${base}/hu/szolgaltatasok/seo-tartalommarketing): Keresőoptimalizálás és tartalomstratégia.
- [Digitális rendszerek](${base}/hu/szolgaltatasok/digitalis-rendszerek): Időpontfoglaló, CRM, email marketing, egyedi vállalatirányítási rendszerek.

## Árak és csomagok

- [Árak](${base}/hu/arak): Havi előfizetéses weboldal-csomagok (Mikró, Rajt, Növekedés) és egyedi Partner ajánlat, induló ártól.

## Munkáink

- [Projektek](${base}/hu/projektek): Elkészült weboldalak és digitális termékek referenciái (pl. [davelopment]® Booking, LAZAR'S, The Place Studio).

## Tartalom

- [Blog](${base}/hu/blog): Cikkek weboldal készítésről, SEO-ról, digitális marketingről és üzletépítésről.
- [GYIK](${base}/hu/gyik): Gyakori kérdések az együttműködésről, árazásról és folyamatról.

## Kapcsolat

- [Kapcsolat](${base}/hu/kapcsolat): Ajánlatkérés és kapcsolatfelvétel.

## Egyéb

- [Adatkezelési tájékoztató](${base}/hu/adatkezeles)
- [Felhasználási feltételek](${base}/hu/felhasznalasi-feltetelek)
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
