// llms.txt — a feltörekvő llmstxt.org szabvány szerint, hogy az LLM-alapú
// keresők (ChatGPT, Perplexity, Claude stb.) gyorsan megértsék, mit csinál
// az oldal és hol találják a legfontosabb tartalmakat.
export const dynamic = 'force-static';

export async function GET() {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://davelopment.hu').replace(/\/+$/, '');

  const content = `# [davelopment]©

> Weboldal készítés, UX/UI design, branding/arculattervezés és digitális marketing (SEO, Google Ads) egy kézben, magyar szakembereknek és vállalkozóknak. Havi előfizetéses csomagok karbantartással, vagy egyszeri fejlesztés — egyedi design, nem sablon.

## Mit csinálunk pontosan

Nem csak megépítjük a weboldalad, aztán magadra hagyunk vele.

- **Beállítjuk és kezeljük a Google Ads kampányaidat** — nem elméletben, hanem élesben, nap mint nap.
- **Nem sablonból dolgozunk.** Előbb megnézzük, kik a vevőid és mit keresnek, utána tervezzük meg köréjük az oldalt.
- **Vállalati rendszereket is építünk** — számlázás, ügyfélkezelés, időpontfoglalás, bármi, ami egyszerűsíti a napi működésedet.
- **A weboldal csak a kezdet.** Marketing kampányok, hírlevelek — utána is veled maradunk, hogy tényleg jöjjenek az ügyfelek.

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

**Ügyfeleink ténylegesen a Google keresések élén vannak** — nem csak ígérjük, mérhetően bizonyítjuk.

- [Projektek](${base}/hu/projektek): Elkészült weboldalak és digitális termékek referenciái.
- [LAZAR'S©](${base}/hu/projektek/lazars) (fodrászat, styling): a davelopment által épített weboldal óta ügyfelük a Google keresések élén van a saját kulcsszavaira.
- [The Place Studio©](${base}/hu/projektek/the-place-studio) (csontkovács, masszázs kezelések): a weboldal elkészülte óta a "csontkovács Budapest" keresés élén is ők állnak a Google-ben.
- [[davelopment]© Booking](${base}/hu/projektek/davelopment-booking): saját fejlesztésű, egyedi időpontfoglaló és ügyfélkezelő rendszer, amit iparáganként testre szabva adunk ügyfeleink kezébe.

Ezek nem elméleti ígéretek — nézd meg élesben a [projekteket](${base}/hu/projektek), vagy kérdezz rá bármelyikre.

## Tartalom

- [Blog](${base}/hu/blog): Cikkek weboldal készítésről, SEO-ról, digitális marketingről és üzletépítésről.
- [GYIK](${base}/hu/gyik): Gyakori kérdések az együttműködésről, árazásról és folyamatról (50+ kérdés, az alábbiak csak a legfontosabbak).

### Kiemelt gyakori kérdések

**Mennyibe kerül egy projekt?**
Nem sablon árlista alapján dolgozunk, mert minden projekt más. Rövid egyeztetés után mindig egyedi ajánlatot adunk. Tájékoztató árak az [Árak oldalon](${base}/hu/arak).

**Miért éri meg jobban egy havi előfizetéses csomag, mint egy egyszeri fizetős weboldal?**
Az egyszeri fizetős weboldal olcsóbbnak tűnik elsőre, de utána gyakran jönnek az előre nem látott extra költségek — hibajavítás, frissítés, új funkció. Az előfizetéses modellnél a havi díj kiszámítható, a karbantartás és a folyamatos fejlesztés is benne van.

**Mi van benne az árban?**
Minden ami kell az induláshoz: design, fejlesztés, tesztelés, élesítés és az első hónap support. Nincs rejtett költség, nincs meglepetés számla.

**Melyik csomagot (Mikró, Rajt, Növekedés) válasszam?**
A legtöbb vállalkozásnak a Rajt a legjobb választás — tartalmazza a rendszeres SEO-tartalmat és a gyors növekedéshez szükséges eszközöket. A Mikró csak akkor elég, ha most indulsz és egy egyszerű, gyors online jelenlét kell. A Növekedés azoknak jó, akiknek egyedi fejlesztésre vagy komolyabb marketingre van szükségük.

**Kell előleg?**
Nem, nincs szükség nagy előlegre — előfizetéses modellben dolgozunk. Az első havi díjjal indul a weboldalad elkészítése.

**Mennyi ideig tart egy projekt?**
2–3 héttől 6–10 hétig, a csomag méretétől függően.

**Mi történik a projekt után? Van támogatás, karbantartás?**
Igen, nem tűnünk el az élesítés napján. Tudunk segíteni karbantartással, frissítésekkel, kisebb-nagyobb módosításokkal.

**Csináltok Google Ads kampányokat is?**
Igen — keresési és display kampányokat, remarketing és konverziókövetéssel.

**Ki dolgozik a projekteden?**
Én magam, végig — nincs alvállalkozó, nincs projektmenedzsment-réteg, közvetlenül velem egyeztetsz mindenről a tervezéstől az élesítésig.

**Kis- és középvállalkozásoknak is dolgoztok, vagy csak nagyobb cégeknek?**
Elsősorban kis- és középvállalkozásokkal, szolgáltatókkal és induló vállalkozásokkal dolgozom — nálam nem kell nagy céges költségvetés ahhoz, hogy minőségi munkát kapj.

**Mennyi idő alatt válaszoltok?**
24 órán belül minden megkeresésre visszajelzünk. Általában gyorsabban.

**Kell hozzá technikai tudás?**
Nem — az adminfelületet úgy tervezzük, hogy te magad kezeld a tartalom frissítést, foglalásokat, emaileket.

**Mennyi idő alatt jelenik meg az új weboldalam a Google keresésben?**
Az oldal pár napon belül indexelődik a Google-ben, de a jó helyezéshez idő kell: kevésbé versenyzett kulcsszavaknál már 1-3 hónap alatt látszik javulás. A technikai SEO-alapokat már a fejlesztés során beépítjük.

### Blog cikkek

- [Mennyibe kerül egy weboldal Magyarországon 2026-ban?](${base}/hu/blog/mennyibe-kerul-egy-weboldal-magyarorszagon-2026-ban): A legtöbb ügynökség csak „Ft-tól" árat ad. Megmutatjuk a valós ársávokat, és hogy mitől függ, mennyibe kerül egy jó weboldal.
- [Weboldal készítés folyamata lépésről lépésre](${base}/hu/blog/weboldal-keszites-folyamata-lepesrol-lepesre): Végigvezetünk a teljes folyamaton a megrendeléstől az élesítésig.
- [Miért jobb egy havi előfizetéses weboldal, mint egy egyszeri fizetős?](${base}/hu/blog/miert-jobb-az-elofizeteses-weboldal-mint-az-egyszeri-fizetos): Egy weboldal folyamatosan karbantartást, frissítést és fejlesztést igényel — megmutatjuk, miért éri meg jobban az előfizetéses modell.
- [Mennyi idő alatt jelenik meg egy új weboldal a Google keresésben?](${base}/hu/blog/mennyi-ido-alatt-jelenik-meg-a-weboldalam-a-google-kereseben): Reális elvárások az indexelésről és a tényleges helyezésekről.
- [Mi történik a weboldaladdal az élesítés után?](${base}/hu/blog/mi-tortenik-a-weboldaladdal-elesites-utan): Karbantartás, frissítés, support — mi jár egy weboldalhoz utólag, és mibe kerülne, ha magadnak kellene megoldanod.
- [Egyedi weboldal vs sablon (Wix, Squarespace) — mikor melyik éri meg?](${base}/hu/blog/egyedi-weboldal-vs-sablon-wix-squarespace): Mikor elég egy sablon-builder, és mikor van szükség valódi egyedi fejlesztésre.
- [SEO vagy Google Ads — melyikbe érdemes fektetni kisvállalkozásként?](${base}/hu/blog/seo-vagy-google-ads-melyikbe-erdemes-fektetni): Mikor melyik hoz gyorsabb eredményt, és miért éri meg a kettő kombinációja.
- [Weboldal vagy csak Instagram/Facebook — elég ez a vállalkozásodnak?](${base}/hu/blog/weboldal-vagy-csak-instagram-facebook): Miért kockázatos, ha egy vállalkozás csak közösségi médiára támaszkodik saját weboldal nélkül.
- [Miért számít a friss weboldal-tartalom már az AI-asszisztenseknek is?](${base}/hu/blog/miert-szamit-a-friss-weboldal-tartalom-az-ai-korban): Nem csak a Google, már a ChatGPT és a Google AI Overviews is a friss, rendszeresen frissülő tartalmat kedveli.
- [Weboldalt AI-jal (ChatGPT, Cursor) is meg tudod csinálni magad — de megéri?](${base}/hu/blog/weboldalt-ai-val-is-meg-tudod-csinalni-magad-de-megeri): Őszinte válasz: mikor jó ötlet önállóan nekiállni, és mikor nem.
- [Miért döntheti el a weboldalad sebessége a vállalkozásod sorsát?](${base}/hu/blog/miert-dontheti-el-a-weboldalad-sebessege-a-vallalkozasod-sorsat): Hogyan kerülhet egy másodperc késés is konverziókba, és hogyan gyorsítsd fel az oldaladat.
- [Hogyan tud egy jól megtervezett weboldal tényleg húzni a vállalkozásodon?](${base}/hu/blog/hogyan-valtoztathatja-meg-egy-jol-megtervezett-weboldal-a-vallalkozasod): Hogyan segít egy átgondolt design abban, hogy profibbnak lássanak és több megkeresést kapj.
- [A színek pszichológiája a márkaépítésben](${base}/hu/blog/a-szinek-pszichologiaja-a-markaepitesben): Hogyan használd stratégiailag a színeket a márkaépítésben.
- [Sötét mód: Trend vagy webdesign-alapvető dolog?](${base}/hu/blog/sotet-mod-trend-vagy-webdesign-alapveto-dolog): Valóban javítja-e a felhasználói élményt a sötét mód?
- [A tipográfia jövője: Trendek, amelyek meghatározzák a webet](${base}/hu/blog/a-tipografia-jovoje-trendek-amelyek-meghatarozzak-a-webet): A tipográfia szerepe abban, hogyan lépnek interakcióba a felhasználók a márkáddal.
- [Brutalizmus a webdesignban: Merész esztétika vagy csak rossz UX?](${base}/hu/blog/brutalizmus-a-webdesignban-meresz-esztetika-vagy-csak-rossz-ux): A brutalista webdesign felemelkedése, és hogy működik-e a modern vállalkozások számára.
- [Miért teszik emlékezetesebbé a márkákat az egyedi illusztrációk?](${base}/hu/blog/miert-teszik-emlekezetesebbe-a-markakat-az-egyedi-illusztraciok): Hogyan segítenek a kézzel készített vizuális elemek kitűnni a stock fotók tengeréből.

## Kapcsolat

- [Kapcsolat](${base}/hu/kapcsolat): Ajánlatkérés és kapcsolatfelvétel.
- [Ingyenes konzultáció foglalása](https://booking.davelopment.hu/konzultacio-davelopment): Foglalj időpontot online videóhívásra vagy telefonos visszahívásra, levelezés nélkül.

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
