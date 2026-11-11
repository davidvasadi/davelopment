/**
 * The Hungarian body of five design articles (#40–#44) was, by mistake, the same copied "website speed" text in all
 * five (the English versions are correct). This rewrites the HU body on topic, with real H2 headings and relevant
 * internal links. The first paragraph keeps its "[davelopment]®" → /hu link, and each article's existing closing
 * paragraph (with its links) is kept as it is.
 *
 *   npx payload run scripts/content/rewrite-design-articles-hu.ts              # dry run
 *   npx payload run scripts/content/rewrite-design-articles-hu.ts -- --apply   # write
 *
 * Markup: "!" first line = bold intro paragraph, "## " = H2, "- " = bullet, {url|text} = link.
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const apply = process.argv.includes('--apply')

const ARTICLES: Record<number, string> = {
  44: `
!A {/hu|[davelopment]®} csapata olyan weboldalakat épít, amelyek nemcsak jól néznek ki, hanem felismerhetővé is teszik a márkát — ebben az egyedi illusztrációk az egyik legerősebb eszközünk.
A stock fotók mindenhol ott vannak. Ugyanaz a mosolygó csapat a tárgyalóasztalnál, ugyanaz a laptopon gépelő kéz — és a látogató ezt pillanatok alatt észreveszi. Egy egyedi illusztráció ezzel szemben csak a tiéd: senki más nem használhatja, és első ránézésre a te márkádhoz kapcsolódik.
## Amire a stock fotó nem képes
A stock képek eleve általánosnak készülnek, hogy minél több cég használhassa őket. Ha a versenytársaid ugyanabból a képbankból válogatnak, a weboldalad beleolvad a többibe — pont akkor, amikor ki kellene tűnnie.
Az emberek a képeket sokkal könnyebben megjegyzik, mint a szöveget. Egy jól megválasztott illusztráció a márkádhoz köti ezt az emléket: legközelebb, amikor a látogató ugyanezt a stílust egy hirdetésben vagy az Instagramon látja, már tudja, kiről van szó.
## Hogyan erősíti az illusztráció a márkát?
Az egységes illusztrációs stílus olyan, mint egy vizuális ujjlenyomat. Gondolj azokra a márkákra, amelyeket egyetlen képről felismersz — legtöbbször nem a logójuk, hanem a teljes vizuális világuk teszi őket ilyen azonnal azonosíthatóvá.
Az illusztráció ráadásul érzelmet is ad. Egy kézzel rajzolt figura vagy egy játékos jelenet közelebb hozza a márkát az emberekhez, és barátságosabbá teszi a nehezebben érthető szolgáltatásokat is — legyen szó könyvelésről, egészségügyről vagy szoftverről.
## Hol érdemes egyedi illusztrációt használni?
- A főoldal első képernyőjén, hogy azonnal megadja a hangulatot
- Folyamatok és szolgáltatások elmagyarázásánál, ahol egy kép többet mond egy bekezdésnél
- Üres oldalakon és hibaoldalakon (pl. 404), ahol egy kis humor sokat javít az élményen
- Ikonokban és apró díszítőelemekben, hogy a teljes oldal egységes legyen
- A közösségi médiában és a hirdetésekben, hogy minden csatornán ugyanaz a márka köszönjön vissza
## Mire figyelj, ha illusztrációt rendelsz?
Az illusztráció akkor működik, ha az {/hu/szolgaltatasok/branding-arculat|arculatod} része, nem egy különálló dísz. Legyen meg hozzá a színpaletta, a vonalvastagság és a figurák stílusa, hogy később bárki ugyanabban a világban tudja folytatni. Egy-két látványos kép kevés — a hatás az ismétlésből jön.
Gondolj a weboldalra is: a vektoros (SVG) illusztrációk minden képernyőn élesek maradnak, és kis méretük miatt nem lassítják az oldalt.
## Megéri a befektetést
Az egyedi illusztráció elkészítése időt és szakértelmet kíván, de hosszú távon többszörösen megtérül. A stock fotóval ellentétben nem kell attól tartanod, hogy holnap a versenytársad oldalán is ugyanaz jelenik meg — ez a te vizuális tőkéd, amely minden használattal erősebb lesz.
A [davelopment]®-nél az egyedi vizuális elemeket ott építjük be a weboldalakba, ahol valóban erősítik a márkát — nem díszként, hanem a teljes megjelenés részeként.
`,
  42: `
!A {/hu|[davelopment]®} csapata a webet formáló tipográfiai trendeket vizsgálja — és azt, hogy ezek mit jelentenek a te márkádnak.
A tipográfia mindig is a tervezők egyik legerősebb eszköze volt, de az utóbbi években a szerepe tovább nőtt. Ma már nem csak arról szól, hogy egy szöveg olvasható legyen: a betűk hangulatot, személyiséget és mozgást is adnak a weboldalnak.
## Változó betűtípusok: egy fájl, végtelen lehetőség
A változó betűtípusok (variable fonts) egyetlen fájlban tartalmazzák a betűcsalád összes vastagságát és szélességét. A böngészőnek így egyetlen fájlt kell letöltenie a korábbi négy-öt helyett, ami gyorsabb betöltést jelent.
Emellett a betűk finoman alkalmazkodhatnak a képernyőmérethez vagy akár a görgetéshez is: a címsor vastagsága és szélessége folyamatosan változhat, ettől az oldal élőbbnek hat.
## Óriási, kifejező címsorok
A kicsi, óvatos betűk korszaka véget ért. Egyre több márka mer a képernyő felét kitöltő címsorokkal dolgozni, ahol maga a szöveg a látvány. Ez különösen ott működik jól, ahol a márkának határozott mondanivalója van: stúdióknál, ügynökségeknél és olyan szolgáltatóknál, amelyek magabiztosságot akarnak sugározni.
A titok az arányokban van: a hatalmas címsor mellé nyugodt, jól olvasható törzsszöveg kell, különben az oldal kiabál.
## Mozgó, animált tipográfia
A szöveg már nem statikus. Görgetésre megjelenő, egérmozgásra reagáló vagy finoman animált betűk irányítják a figyelmet:
- betűről betűre feltűnő címsorok görgetés közben
- egymásba alakuló szavak, amelyek több üzenetet mutatnak egy helyen
- a kurzor mozgására reagáló címsorok
Mértékkel használva az animáció segít kiemelni a lényeget — a túl sok mozgás viszont elvonja a figyelmet és lassíthatja az oldalt.
## Az olvashatóság nem alku tárgya
Minél kifejezőbb a tipográfia, annál nagyobb a kockázat, hogy az olvashatóság sérül. A trendek követése nem mehet a tartalom rovására: megfelelő betűméret, sorköz és kontraszt kell, főleg mobilon. A jó {/hu/szolgaltatasok/ux-ui-design-fejlesztes|UX/UI design} ezért mindig az olvasóból indul ki, nem a trendből.
A legjobb tipográfiai döntések egyensúlyt találnak a kifejezőerő és az érthetőség között — a látogatónak el kell tudnia olvasni, amit mondani akarsz.
## Mit jelent ez a márkádnak?
A tipográfia márkadöntés, nem apró dizájnrészlet. A betűtípus, amit választasz, és ahogyan használod, elárulja, ki vagy: komoly vagy játékos, prémium vagy közvetlen. Ezért nálunk a betűválasztás az {/hu/szolgaltatasok/branding-arculat|arculattervezés} része, és a weboldaltól a névjegykártyáig mindenhol ugyanaz.
`,
  41: `
!A {/hu|[davelopment]®} csapata megvizsgálja, hogy a sötét mód csak múló divat, vagy tartós változás abban, ahogyan a webet tervezzük.
A sötét mód ma már mindenhol ott van: az operációs rendszerekben, az alkalmazásokban, a böngészőkben és egyre több weboldalon. Ami néhány éve még a fejlesztők kedvenc beállítása volt, mára a felhasználók elvárása lett.
## Mi szól a sötét mód mellett?
Gyenge fényben a sötét felület kíméli a szemet — ez valódi előny azoknak, akik este vagy hosszú órákon át használják a telefonjukat. OLED kijelzős telefonokon ráadásul kevesebb energiát fogyaszt, így az akkumulátor is tovább bírja.
A funkción túl a sötét mód erős hangulatot is ad: prémium, letisztult, fókuszált érzést kelt. A képek és a színes kiemelések sötét háttéren jobban világítanak, ezért a portfóliók, a kreatív stúdiók és a technológiai termékek különösen szeretik.
## A nehézségek
- A kontrasztra külön figyelni kell: a tiszta fehér szöveg fekete háttéren vibrálhat, ezért érdemes törtfehér szöveget és nagyon sötétszürke hátteret használni
- A színeket újra kell hangolni — ami világos háttéren jól működik, sötéten túl harsány vagy túl halvány lehet
- A képeket, logókat és árnyékokat mindkét módra el kell készíteni
- Hosszabb szövegeknél sokan még mindig a világos hátteret olvassák kényelmesebben
## Alkalmazkodj a látogató beállításához
A modern megoldás nem az, hogy egyetlen módot erőltetünk rá mindenkire, hanem hogy tiszteletben tartjuk, amit a látogató már kiválasztott. A böngésző jelzi, hogy a látogató telefonja világos vagy sötét módban van, és a weboldal automatikusan ehhez igazodhat.
Ha még több kontrollt szeretnél adni, egy kézi kapcsoló is jó kiegészítés — főleg tartalmas oldalakon, ahol az olvasók napszaktól függően váltanak.
## Mikor illik a sötét mód a márkádhoz?
A sötét mód ott működik a legjobban, ahol a hangulat és a közönség is ezt kívánja: technológiai termékeknél, kreatív stúdióknál, a szórakoztatóiparban és prémium márkáknál. Egy egészségügyi szolgáltatónál vagy egy családi vállalkozásnál a világos, barátságos felület gyakran jobb első benyomást kelt — itt elég, ha a sötét mód választható.
A döntés tehát nem divatkérdés, hanem {/hu/szolgaltatasok/ux-ui-design-fejlesztes|felhasználói élmény}: az számít, hogy a te látogatóid mit tartanak kényelmesnek.
## Összegzés
A sötét mód már nem trend, hanem elvárás. A kérdés nem az, hogy támogasd-e, hanem az, hogyan valósítsd meg jól: megfelelő kontraszttal, átgondolt színekkel, és úgy, hogy a látogató maga dönthessen.
`,
  43: `
!A {/hu|[davelopment]®} csapata a brutalista webdesign térnyerését vizsgálja — és azt, hogy működik-e egy mai vállalkozásnak.
A brutalizmus a webdesignban felrúgja a szabályokat: nyers rácsok, éles kontrasztok, látható szerkezet, egymással ütköző betűtípusok és szándékosan „befejezetlen” hatás. Egyesek szerint ez a sablonos, egyforma weboldalak elleni lázadás, mások szerint egyszerűen rossz tervezés szép csomagolásban.
## Honnan ered?
A webes brutalizmus az 1950–60-as évek építészeti irányzatától kölcsönözte a nevét, amely a nyers betont és a díszítés nélküli, őszinte szerkezetet ünnepelte. A weben ugyanez a gondolat: ne rejtsük el, miből épül fel az oldal.
Az internet korai oldalai sokszor véletlenül voltak brutalisták — egyszerű szöveg, alapértelmezett linkek, semmi díszítés. A mai brutalista oldalak viszont tudatosan nyúlnak ehhez a nyersességhez, merész tipográfiával, erős színekkel és szokatlan elrendezéssel.
## Mikor működik a brutalizmus?
- Kreatív ügynökségeknél, amelyek merészséget és eredetiséget akarnak sugározni
- Divat- és streetwear-márkáknál, amelyek fiatal, trendérzékeny közönséget céloznak
- Művészeknél, zenekaroknál, kiadóknál és kulturális projekteknél
- Kampányoldalaknál, ahol a cél az, hogy az oldal beszédtéma legyen
## A UX-probléma
Az őszinte igazság: a brutalizmus sokszor nehezebben használhatóvá teszi a weboldalt. A szokatlan navigáció, a gyenge kontraszt és a kiszámíthatatlan elrendezés összezavarja a látogatót, aki gyorsan akar információt vagy egy gombot találni. Mobilon ez még inkább igaz.
A kulcs a tudatosság. A brutalizmus öncélú stíluskísérletként kockázatos, átgondolt márkadöntésként viszont működhet — ha közben az alapok rendben vannak: a látogató megtalálja, amit keres, a szöveg olvasható, és a fontos gomb ott van, ahol várja. Ez a jó {/hu/szolgaltatasok/ux-ui-design-fejlesztes|UX/UI design} lényege, bármilyen is a stílus.
## Brutalista legyen a márkád?
Csak akkor, ha valóban illik hozzád. Ha könyvelőirodát, egészségügyi szolgáltatót vagy olyan céget viszel, ahol a bizalom az első, a nyers, kihívó stílus inkább elriaszt, mint vonz.
Ha viszont kreatív stúdió, zenei kiadó vagy olyan márka vagy, amelyik provokatív és emlékezetes akar lenni, a brutalizmus erős eszköz — feltéve, hogy a használhatóságot nem áldozod fel érte.
A [davelopment]®-nél olyan weboldalakat tervezünk, amelyek a márkád valódi személyiségéhez illenek: merészek, ha ez a helyes irány, és visszafogottak, ha az ügyfeleid ezt várják.
`,
  40: `
!A {/hu|[davelopment]®} olyan vizuális arculatokat épít, amelyek működnek — és ez a legalapvetőbb elemmel kezdődik: a színnel.
A szín az egyik leggyorsabb üzenet, amit egy márka küld. Mielőtt a látogató egyetlen szót elolvasna, a színek alapján már kialakít egy első benyomást: megbízható vagy játékos, prémium vagy kedvező árú, nyugodt vagy energikus.
## Hogyan hatnak a színek az észlelésre?
A különböző színek különböző érzéseket keltenek — nem mindenkinél ugyanúgy, de elég következetesen ahhoz, hogy számítani lehessen rájuk:
- Kék: bizalom, megbízhatóság, szakértelem — a pénzügyben, a technológiában és az egészségügyben a leggyakoribb
- Piros: sürgetés, szenvedély, energia — a vendéglátásban és az akcióknál gyakori
- Zöld: egészség, természet, növekedés — wellness- és fenntarthatósági márkáknál
- Sárga: optimizmus és figyelemfelkeltés — kiemelésekre kiváló, nagy felületen viszont fárasztó lehet
- Fekete: elegancia, prémium minőség, letisztultság
- Lila: kreativitás, luxus, különlegesség
## A környezet számít, nem a szabályok
A színpszichológia kiindulópont, nem képlet. A „helyes” szín az iparágadtól, a célközönségedtől, a versenytársaidtól és a kultúrától is függ. Ugyanaz a piros egy étteremnél étvágygerjesztő, egy könyvelőnél inkább riasztó.
A cél tehát nem a „jó” szín megtalálása, hanem olyan színé, amely megerősíti, amit az emberek rólad gondolni szeretnének.
## Gyakorlati tippek a márkaszínek kiválasztásához
- Nézd meg a versenytársaidat: ha a szakmádban mindenki kéket használ, gondold át, mivel tűnhetsz ki
- Válassz egy fő színt, mellé pedig egy-két kiegészítőt — a túl sok szín szétesett hatást kelt
- Gondolj az olvashatóságra: a szövegnek a háttéren mindig jól kell látszania
- Próbáld ki a színeket telefonon és nyomtatásban is, mert máshogy hatnak
- Rögzítsd a pontos színkódokat, hogy mindenhol ugyanaz jelenjen meg
## Az egységes színhasználat értéket épít
A márkaszín ereje a következetességből jön. Ha a látogatóid újra és újra ugyanazzal a palettával találkoznak — a weboldalon, az Instagramon, a névjegyen és a hirdetésekben —, a színek a márkád azonnal felismerhető jelévé válnak.
A [davelopment]®-nél a színrendszert minden {/hu/szolgaltatasok/branding-arculat|arculattervezés} részeként határozzuk meg: nem csak kiválasztjuk a színeket, hanem azt is rögzítjük, hogyan és hol használd őket, hogy minden felületen egységes maradjon a megjelenés.
`,
}

// ── Lexical node builders ────────────────────────────────────────────────────────────────────────────────────
const text = (t: string, bold = false) => ({ mode: 'normal', text: t, type: 'text', style: '', detail: 0, format: bold ? 1 : 0, version: 1 })
const inline = (s: string, bold = false) => {
  const out: any[] = []
  let last = 0
  for (const m of s.matchAll(/\{([^|}]+)\|([^}]+)\}/g)) {
    if (m.index! > last) out.push(text(s.slice(last, m.index), bold))
    out.push({ type: 'link', fields: { url: m[1], newTab: false, linkType: 'custom' }, format: '', indent: 0, version: 3, children: [text(m[2], bold)], direction: 'ltr' })
    last = m.index! + m[0].length
  }
  if (last < s.length) out.push(text(s.slice(last), bold))
  return out
}
const para = (s: string, bold = false) => ({ type: 'paragraph', format: '', indent: 0, version: 1, children: inline(s, bold), direction: 'ltr', textStyle: '', textFormat: bold ? 1 : 0 })
const heading = (s: string) => ({ type: 'heading', tag: 'h2', format: '', indent: 0, version: 1, children: inline(s), direction: 'ltr' })
const list = (items: string[]) => ({
  type: 'list', listType: 'bullet', tag: 'ul', start: 1, format: '', indent: 0, version: 1, direction: 'ltr',
  children: items.map((it, i) => ({ type: 'listitem', value: i + 1, format: '', indent: 0, version: 1, direction: 'ltr', children: inline(it) })),
})

function build(src: string): any[] {
  const nodes: any[] = []
  let bullets: string[] = []
  const flush = () => { if (bullets.length) { nodes.push(list(bullets)); bullets = [] } }
  for (const raw of src.trim().split('\n')) {
    const line = raw.trim()
    if (!line) continue
    if (line.startsWith('- ')) { bullets.push(line.slice(2)); continue }
    flush()
    if (line.startsWith('## ')) nodes.push(heading(line.slice(3)))
    else if (line.startsWith('!')) nodes.push(para(line.slice(1), true))
    else nodes.push(para(line))
  }
  flush()
  return nodes
}

const plain = (n: any): string => (typeof n?.text === 'string' ? n.text : (n?.children ?? []).map(plain).join(''))

const payload = await getPayload({ config })

for (const [idStr, src] of Object.entries(ARTICLES)) {
  const id = Number(idStr)
  const doc: any = await payload.findByID({ collection: 'articles' as any, id, locale: 'hu', fallbackLocale: false as any, depth: 0 })
  const old = doc.content?.root?.children ?? []
  // the article's own closing paragraph (with its links) stays — the last non-empty paragraph
  const closing = [...old].reverse().find((n: any) => n.type === 'paragraph' && plain(n).trim())
  const body = build(src)
  const children = closing ? [...body, closing] : body
  const words = children.map(plain).join(' ').split(/\s+/).filter(Boolean).length
  const h2 = children.filter((n) => n.type === 'heading').length
  console.log(`#${id} ${doc.title}\n   régi: ${old.length} blokk → új: ${children.length} blokk, ${h2} H2, ${words} szó\n   záró: ${plain(closing).slice(0, 90)}…`)
  if (!apply) continue
  await payload.update({
    collection: 'articles' as any, id, locale: 'hu', depth: 0,
    data: { content: { root: { ...doc.content.root, children } }, _status: 'published' } as any,
  })
  console.log('   ✓ mentve')
}

process.exit(0)
