// Szolgáltatás-aloldalak új fejlécének tartalma slugonként (HU/EN) — szerver- és kliensoldalon is használható
// (NEM 'use client' fájl, mert a services/[slug]/page.tsx szerveren hívja a getServiceDetail-t).
// Megjelenítés: components/services/service-detail-hero.tsx. Az árak a főoldali árazással egyeznek.

export type ServiceDetail = {
  crumb: string;
  title: string;
  lead: string;
  audience: string;
  points: string[];
  cta: string;
  question: string;
  image: string;
  imageAlt: string;
  faqImage: string; // a GYIK „Még döntesz?” kártyájának képe (minden aloldalon más)
  priceLabel: string;
  price: string;
  priceSuffix: string;
  timeLabel: string;
  time: string;
  // „Mit tartalmaz” blokk (ServiceIncluded)
  includedTitle: string;
  handoverTitle: string;
  handover: string[];
  included: { title: string; text: string }[];
  // oldal vége (ServiceEnd): következő szolgáltatás
  next: { title: string; slug: string };
  // ütemterv (ServiceTimeline): hetek száma, fázisok kezdete/vége hétben (0-tól, fél hét is lehet)
  timeline: {
    title: string;
    sub: string;
    weeks: number;
    weekShort: string; // oszlopfejléc előtag, pl. 'H' → H1, H2…
    weekLabel: string; // a jelölő címkéje, {n} helyére kerül a hét száma (szerializálható — kliens-komponens kapja)
    phases: { title: string; when: string; text: string; from: number; to: number }[];
  };
};

const DETAILS: Record<string, ServiceDetail> = {
  // HU: /hu/szolgaltatasok/weboldal-keszites
  'weboldal-keszites': {
    crumb: 'Weboldal készítés',
    title: 'Weboldal készítés',
    lead: 'Üres lapról tervezett marketingoldal, olyan tartalomkezelővel, amit a csapatod egyedül is visz.',
    audience: 'Cégeknek, akiknek a weboldala az elején gyorsan, összecsapva készült, és ma már alulmúlja a vállalkozást. Jellemzően 2–20 fős marketingcsapat és egy 8–40 oldalas weboldal.',
    points: ['B2B és szakmai szolgáltatások', 'Szállodák és vendéglátás', 'Termék- és hardverbevezetések'],
    cta: 'Kezdjük el a projektet',
    question: 'Előbb kérdeznék',
    image: 'davelopment-weboldal-keszites.avif',
    imageAlt: 'Weboldal készítése laptopon',
    faqImage: 'davelopment-business-weboldal.avif',
    priceLabel: 'Üzleti weboldal',
    price: '190 000 Ft',
    priceSuffix: '-tól',
    timeLabel: 'Átlagos átfutás',
    time: '1–4 hét',
    includedTitle: 'Mit tartalmaz',
    handoverTitle: 'Átadáskor megkapod',
    handover: ['Jóváhagyott, írásos brief', 'Figma-fájl minden oldallal és állapottal', 'Élő oldal a saját domaineden', 'Tartalomkezelő szerkesztői fiókokkal', 'Személyes betanítás a tartalomkezelőhöz', '30 nap hibajavítás az indulás után'],
    included: [
      { title: 'Felfedező workshop', text: 'Két óra a csapatoddal a célokról, a célközönségről és arról, mit ront el a mostani oldal.' },
      { title: 'Tartalomstruktúra', text: 'Oldaltérkép és oldalvázlatok, amiket még a tervezés előtt jóváhagyunk, így semmit nem tervezünk kétszer.' },
      { title: 'Vizuális irány', text: 'Betűk, színek, képek és elrendezési elvek, valódi oldalakon bemutatva, nem moodboardon.' },
      { title: 'Legfeljebb nyolc egyedi oldalterv', text: 'Minden oldal és állapot Figmában, a böngészőben kattintható prototípusként átnézve.' },
      { title: 'Mozgás és interakciók', text: 'Görgetés, hover és oldalváltás az oldalakkal együtt tervezve, nem a végén hozzáadva.' },
      { title: 'Tartalomkezelő', text: 'Payload, Strapi vagy Framer, a leggyakrabban közzétett tartalmaidra előre beállított gyűjteményekkel.' },
      { title: 'Technikai SEO és analitika', text: 'Metaadatok, oldaltérkép, strukturált adatok, átirányítások és mérés, ami az első naptól működik.' },
      { title: 'Betanítás és átadás', text: 'Személyes betanítás mindenkinek, aki szerkeszteni fogja az oldalt — utána is kérdezhetsz.' },
    ],
    next: { title: 'Weboldal újratervezés', slug: 'weboldal-ujratervezes' },
    timeline: {
      title: 'Négy hét, fázisról fázisra',
      sub: 'Egy jellemző ütemterv. A pontos dátumokat az ajánlatban rögzítjük, még a munka előtt.',
      weeks: 4,
      weekShort: 'H',
      weekLabel: '{n}. hét',
      phases: [
        { title: 'Felfedezés', when: '1. hét', text: 'Workshop, a mostani számok áttekintése és egy írásos brief.', from: 0, to: 1 },
        { title: 'Tervezés', when: '1–2. hét', text: 'Előbb a vizuális irány, utána minden oldal Figmában, két átnézési körrel.', from: 0.5, to: 2 },
        { title: 'Fejlesztés', when: '2–4. hét', text: 'Tartalomkezelő, tartalommodell és oldalak, párhuzamosan az utolsó tervezési körrel.', from: 1.5, to: 3.75 },
        { title: 'Indulás', when: '4. hét', text: 'Átirányítások, mérés, tesztelés és egy nyugodt indulónap.', from: 3.5, to: 4 },
      ],
    },
  },
  // EN: /en/services/start-your-business-online
  'start-your-business-online': {
    crumb: 'Websites',
    title: 'Websites',
    lead: 'A marketing site designed from a blank page, built on a CMS your team can run on its own.',
    audience: 'Companies whose website was put together quickly at the start and now undersells the business. Usually a marketing team of two to twenty, and a site of eight to forty pages.',
    points: ['B2B and professional services', 'Hotels and hospitality', 'Product and hardware launches'],
    cta: 'Start a project',
    question: 'Questions first',
    image: 'davelopment-weboldal-keszites.avif',
    imageAlt: 'Building a website on a laptop',
    faqImage: 'davelopment-business-weboldal.avif',
    priceLabel: 'Business website',
    price: '190,000 HUF',
    priceSuffix: 'from',
    timeLabel: 'Typical timeline',
    time: '1–4 weeks',
    includedTitle: 'What’s included',
    handoverTitle: 'On handover',
    handover: ['Signed-off written brief', 'Figma file with every page and state', 'Live site on your domain', 'CMS with editor accounts', 'Hands-on CMS training', '30 days of fixes after launch'],
    included: [
      { title: 'Discovery workshop', text: 'Two hours with your team on goals, audiences and what the current site gets wrong.' },
      { title: 'Content structure', text: 'A sitemap and page outlines agreed before design starts, so nothing is designed twice.' },
      { title: 'Art direction', text: 'Type, colour, imagery and layout principles, shown on real pages rather than a moodboard.' },
      { title: 'Up to eight custom page designs', text: 'Every page and state in Figma, reviewed in the browser as a clickable prototype.' },
      { title: 'Motion and interaction', text: 'Scroll, hover and page transitions designed with the pages, not added at the end.' },
      { title: 'CMS build', text: 'Payload, Strapi or Framer, with collections set up for the content you publish most.' },
      { title: 'Technical SEO and analytics', text: 'Metadata, sitemaps, structured data, redirects and tracking that works on day one.' },
      { title: 'Training and handover', text: 'A hands-on session for everyone who will edit the site — and questions are welcome after.' },
    ],
    next: { title: 'Website redesign', slug: 'website-redesign' },
    timeline: {
      title: 'Four weeks, phase by phase',
      sub: 'A typical plan. We confirm exact dates in the proposal, before any work starts.',
      weeks: 4,
      weekShort: 'W',
      weekLabel: 'Week {n}',
      phases: [
        { title: 'Discover', when: 'Week 1', text: 'Workshop, a look at the current numbers and a written brief.', from: 0, to: 1 },
        { title: 'Design', when: 'Weeks 1 to 2', text: 'Art direction first, then every page in Figma with two review rounds.', from: 0.5, to: 2 },
        { title: 'Build', when: 'Weeks 2 to 4', text: 'CMS, content model and pages built in parallel with the last design round.', from: 1.5, to: 3.75 },
        { title: 'Launch', when: 'Week 4', text: 'Redirects, tracking, testing and a calm launch day.', from: 3.5, to: 4 },
      ],
    },
  },
  // HU: /hu/szolgaltatasok/weboldal-ujratervezes
  'weboldal-ujratervezes': {
    crumb: 'Weboldal újratervezés',
    title: 'Weboldal újratervezés',
    lead: 'Új alapokra helyezzük az oldalt, ami már nem illik a vállalkozásodhoz — úgy, hogy a megszerzett Google-helyezéseid megmaradjanak.',
    audience: 'Csapatoknak, akiknek a weboldala működik, de kinézetben és érzésben évekkel a cég mögött jár. Gyakran jó keresési forgalmú oldal, amit senki nem akar kockáztatni.',
    points: ['Évek óta keresési forgalmat hozó oldalak', 'Márkák arculatváltás vagy fúzió után', 'Csapatok, akik elhagynák a régi tartalomkezelőt'],
    cta: 'Kezdjük el a projektet',
    question: 'Előbb kérdeznék',
    image: 'davelopment-felfedezes.avif',
    imageAlt: 'Két kéz egy tervvázlattal egy asztalon — a régi oldal átvilágítása',
    faqImage: 'davelopment-egyedi-weboldal.avif',
    priceLabel: 'Ára, mint egy üzleti weboldalé',
    price: '190 000 Ft',
    priceSuffix: '-tól',
    timeLabel: 'Átlagos átfutás',
    time: '2–6 hét',
    includedTitle: 'Mit tartalmaz',
    handoverTitle: 'Átadáskor megkapod',
    handover: ['Átvilágítás és teljes URL-lista', 'Figma-fájl minden oldallal és állapottal', 'Átköltöztetett tartalom és képek', 'Tesztelt átirányítási térkép', 'Élő oldal a saját domaineden', 'Nyolchetes helyezésriport'],
    included: [
      { title: 'Keresési és analitikai átvilágítás', text: 'Mely oldalak hoznak forgalmat és megkeresést, milyen kulcsszavakra, és mit kell mindenképp megtartani.' },
      { title: 'Teljes URL-lista', text: 'Minden élő URL megkapja az új helyét, még mielőtt egyetlen oldalt is megterveznénk.' },
      { title: 'Tartalom-átvilágítás', text: 'Mi marad, mit vonunk össze, írunk újra vagy vezetünk ki — oldalanként, a csapatoddal egyeztetve.' },
      { title: 'Új design-rendszer', text: 'Friss vizuális irány és oldaltervek, a mostani arculatodra vagy egy újra építve.' },
      { title: 'Tartalom átköltöztetése', text: 'Bejegyzések, esettanulmányok és termékek átköltöztetve, a képeikkel és metaadataikkal együtt.' },
      { title: 'Átirányítási térkép', text: 'Tesztelt 301-es átirányítás minden megváltozott URL-re, az indulás napján újra ellenőrizve.' },
      { title: 'Helyezésfigyelés', text: 'A keresési pozíciókat és a forgalmat nyolc hétig követjük az indulás után, riporttal.' },
    ],
    next: { title: 'Marketing & SEO', slug: 'marketing-es-seo' },
    timeline: {
      title: 'Hat hét, fázisról fázisra',
      sub: 'Egy jellemző ütemterv. A pontos dátumokat az ajánlatban rögzítjük, még a munka előtt.',
      weeks: 6,
      weekShort: 'H',
      weekLabel: '{n}. hét',
      phases: [
        { title: 'Átvilágítás', when: '1. hét', text: 'Analitika, keresési adatok és minden élő URL, hogy lássuk, mit ér ma az oldal.', from: 0, to: 1 },
        { title: 'Struktúra', when: '2. hét', text: 'Új oldaltérkép és tartalomterv: mi marad, mit vonunk össze, írunk újra vagy vezetünk ki.', from: 1, to: 2 },
        { title: 'Tervezés', when: '2–4. hét', text: 'Vizuális irány és oldaltervek, a böngészőben prototípusként átnézve.', from: 1.5, to: 4 },
        { title: 'Fejlesztés és költöztetés', when: '4–6. hét', text: 'Új oldal, tartalomköltöztetés és átirányítási térkép, együtt tesztelve.', from: 3.5, to: 5.75 },
        { title: 'Indulás és figyelés', when: '6. hét', text: 'Ellenőrzések az indulás napján, utána nyolc hét helyezésfigyelés.', from: 5.5, to: 6 },
      ],
    },
  },
  // EN: /en/services/website-redesign
  'website-redesign': {
    crumb: 'Redesigns',
    title: 'Website redesign',
    lead: 'A rebuild for the site that no longer matches the business, without losing the rankings it has earned.',
    audience: 'Teams with a site that works but looks and feels years behind the company. Often a site with good search traffic that nobody wants to put at risk.',
    points: ['Sites with years of search traffic', 'Brands after a rebrand or merger', 'Teams leaving an old CMS'],
    cta: 'Start a project',
    question: 'Questions first',
    image: 'davelopment-felfedezes.avif',
    imageAlt: 'Hands holding a sketched plan on a table — auditing the old site',
    faqImage: 'davelopment-egyedi-weboldal.avif',
    priceLabel: 'Priced as a business website',
    price: '190,000 HUF',
    priceSuffix: 'from',
    timeLabel: 'Typical timeline',
    time: '2–6 weeks',
    includedTitle: 'What’s included',
    handoverTitle: 'On handover',
    handover: ['Audit and URL inventory', 'Figma file with every page and state', 'Migrated content and media', 'Tested redirect map', 'Live site on your domain', 'Eight-week ranking report'],
    included: [
      { title: 'Search and analytics audit', text: 'Which pages bring traffic and leads, which keywords they hold, and what must survive.' },
      { title: 'Full URL inventory', text: 'Every live URL mapped to its new home before a single page is designed.' },
      { title: 'Content audit', text: 'What to keep, merge, rewrite or retire, agreed page by page with your team.' },
      { title: 'New design system', text: 'Fresh art direction and page designs, built from your current brand or a new one.' },
      { title: 'Content migration', text: 'Posts, case studies and products moved across with their images and metadata.' },
      { title: 'Redirect map', text: 'Tested 301 redirects for every changed URL, checked again on launch day.' },
      { title: 'Ranking watch', text: 'Search positions and traffic tracked for eight weeks after launch, with a report.' },
    ],
    next: { title: 'Marketing & SEO', slug: 'marketing-and-seo' },
    timeline: {
      title: 'Six weeks, phase by phase',
      sub: 'A typical plan. We confirm exact dates in the proposal, before any work starts.',
      weeks: 6,
      weekShort: 'W',
      weekLabel: 'Week {n}',
      phases: [
        { title: 'Audit', when: 'Week 1', text: 'Analytics, search data and every live URL, so we know what the site is worth today.', from: 0, to: 1 },
        { title: 'Structure', when: 'Week 2', text: 'New sitemap and the content plan: keep, merge, rewrite or retire.', from: 1, to: 2 },
        { title: 'Design', when: 'Weeks 2 to 4', text: 'Art direction and page designs, reviewed in the browser as a prototype.', from: 1.5, to: 4 },
        { title: 'Build and migrate', when: 'Weeks 4 to 6', text: 'New build, content migration and the redirect map, tested together.', from: 3.5, to: 5.75 },
        { title: 'Launch and watch', when: 'Week 6', text: 'Launch day checks, then rankings watched for eight weeks.', from: 5.5, to: 6 },
      ],
    },
  },
  // HU: /hu/szolgaltatasok/branding-arculat
  'branding-arculat': {
    crumb: 'Arculat és design',
    title: 'Arculat és design',
    lead: 'Betűk, színek, elemek és mozgás, amelyek a márkádat rendesen átviszik az online térbe.',
    audience: 'Márkáknak, akiknek erős a logójuk, de gyenge a weboldaluk, vagy új cégeknek, akiknek az arculata elsőként képernyőn kell, hogy működjön. Általában egy weboldal-projekt része.',
    points: ['Online induló új márkák', 'Nyomtatásra készült arculatú márkák', 'Termékoldalt építő csapatok'],
    cta: 'Kezdjük el a projektet',
    question: 'Előbb kérdeznék',
    image: 'davelopment-markaepites.avif',
    imageAlt: 'Márkaépítés és arculattervezés',
    faqImage: 'davelopment-launch.avif',
    priceLabel: 'Weboldal-projekt része',
    price: '190 000 Ft',
    priceSuffix: '-tól',
    timeLabel: 'Átlagos átfutás',
    time: '3–5 hét, a projekten belül',
    includedTitle: 'Mit tartalmaz',
    handoverTitle: 'Átadáskor megkapod',
    handover: ['Online arculati kézikönyv', 'Figma-elemkönyvtár', 'Design tokenek a fejlesztőknek', 'Mozgásleírás és példák', 'Képi irány útmutató', 'Közösségimédia- és e-mail-sablonok'],
    included: [
      { title: 'Arculat-átvilágítás képernyőre', text: 'Hogyan működik az arculat telefonméretben, sötét módban és a versenytársak mellett.' },
      { title: 'Webes betűrendszer', text: 'Betűtípusok, méretek és térközök, amelyek egy 390 px-es telefontól egy 2560 px-es monitorig jól olvashatók.' },
      { title: 'Színek képernyőre', text: 'Kontrasztra és akadálymentességre tesztelt paletta, tokenekkel, amiket a fejlesztők használni tudnak.' },
      { title: 'Elemkönyvtár', text: 'Gombok, kártyák, űrlapok és navigáció, egyszer megtervezve, és minden oldalon újrahasználva.' },
      { title: 'Mozgási elvek', text: 'Időzítés, gyorsulás és az a néhány jellegzetes mozdulat, amitől a márka felismerhető.' },
      { title: 'Kép és képi irány', text: 'Hogyan vágjuk, világítjuk és helyezzük el a fotókat, illusztrációkat és termékképeket.' },
    ],
    next: { title: 'Támogatás és növekedés', slug: 'karbantartas' },
    timeline: {
      title: 'Öt hét, a projekten belül',
      sub: 'Egy jellemző ütemterv. A pontos dátumokat az ajánlatban rögzítjük, még a munka előtt.',
      weeks: 5,
      weekShort: 'H',
      weekLabel: '{n}. hét',
      phases: [
        { title: 'Átvilágítás', when: '1. hét', text: 'Az arculat valódi képernyőkön, a versenytársaid és az általad kedvelt oldalak mellett.', from: 0, to: 1 },
        { title: 'Betűk és színek', when: '1–3. hét', text: 'Két irány valódi oldalakon, utána egy kidolgozott rendszer.', from: 0, to: 3 },
        { title: 'Elemek', when: '2–4. hét', text: 'Az építőelemek, amelyekből minden oldal áll, minden állapotukkal.', from: 1, to: 4 },
        { title: 'Mozgás', when: '3–5. hét', text: 'Időzítés és jellegzetes mozdulatok, böngészős prototípusban.', from: 2, to: 5 },
        { title: 'Átadás', when: '5. hét', text: 'Kézikönyv, tokenek és a Figma-könyvtár átadva a csapatodnak.', from: 4, to: 5 },
      ],
    },
  },
  // EN: /en/services/branding-identity
  'branding-identity': {
    crumb: 'Brand & motion',
    title: 'Brand & motion',
    lead: 'Type, colour, components and movement that carry the brand properly online.',
    audience: 'Brands with a strong logo and a weak website, or a new company that needs its identity to work on screens first. Usually part of a website project.',
    points: ['New brands launching online', 'Brands whose identity was made for print', 'Teams building a product site'],
    cta: 'Start a project',
    question: 'Questions first',
    image: 'davelopment-markaepites.avif',
    imageAlt: 'Brand building and identity design',
    faqImage: 'davelopment-launch.avif',
    priceLabel: 'Part of website projects',
    price: '190,000 HUF',
    priceSuffix: 'from',
    timeLabel: 'Typical timeline',
    time: '3 to 5 weeks inside the project',
    includedTitle: 'What’s included',
    handoverTitle: 'On handover',
    handover: ['Web brand guidelines', 'Figma component library', 'Design tokens for developers', 'Motion specification and examples', 'Art direction guide', 'Social and email templates'],
    included: [
      { title: 'Brand audit for screens', text: 'How the identity holds up at phone size, in dark rooms and next to competitors.' },
      { title: 'Web type system', text: 'Typefaces, sizes and spacing that read well from a 390px phone to a 2560px monitor.' },
      { title: 'Colour for screens', text: 'A palette tested for contrast and accessibility, with tokens your developers can use.' },
      { title: 'Component library', text: 'Buttons, cards, forms and navigation, designed once and used across every page.' },
      { title: 'Motion principles', text: 'Timing, easing and the few signature movements that make the brand recognisable.' },
      { title: 'Image and art direction', text: 'How photography, illustration and product shots are cropped, lit and placed.' },
    ],
    next: { title: 'Support & growth', slug: 'maintenance' },
    timeline: {
      title: 'Five weeks, inside the project',
      sub: 'A typical plan. We confirm exact dates in the proposal, before any work starts.',
      weeks: 5,
      weekShort: 'W',
      weekLabel: 'Week {n}',
      phases: [
        { title: 'Audit', when: 'Week 1', text: 'The identity on real screens, alongside your competitors and sites you admire.', from: 0, to: 1 },
        { title: 'Type and colour', when: 'Weeks 1 to 3', text: 'Two directions on real pages, then one refined system.', from: 0, to: 3 },
        { title: 'Components', when: 'Weeks 2 to 4', text: 'The parts every page is made from, with every state designed.', from: 1, to: 4 },
        { title: 'Motion', when: 'Weeks 3 to 5', text: 'Timing and signature movements, prototyped in the browser.', from: 2, to: 5 },
        { title: 'Handover', when: 'Week 5', text: 'Guidelines, tokens and the Figma library handed to your team.', from: 4, to: 5 },
      ],
    },
  },
  // HU: /hu/szolgaltatasok/karbantartas — a támogatási csomagokhoz igazítva (Alap támogatás / Növekedés / Beágyazott csapat)
  'karbantartas': {
    crumb: 'Támogatás és növekedés',
    title: 'Weboldal karbantartás',
    lead: 'Frissítések, sebesség, tesztelés és közvetlen kapcsolat a fejlesztővel az indulás után is.',
    audience: 'Csapatoknak, akik azt szeretnék, hogy az oldal az indulás után is fejlődjön, fejlesztő felvétele nélkül. Az általunk épített oldalakra, és egy átvilágítás után máshol készült oldalakra is vállaljuk.',
    points: ['Az általunk indított oldalak', 'Gyakori kampányokkal dolgozó cégek', 'Saját fejlesztő nélküli csapatok'],
    cta: 'Beszéljünk a támogatásról',
    question: 'Előbb kérdeznék',
    image: 'davelopment-karbantartas.avif',
    imageAlt: 'Weboldal-karbantartás és támogatás',
    faqImage: 'davelopment-novekedes.avif',
    priceLabel: 'Alap támogatás',
    price: '29 900 Ft',
    priceSuffix: '/hó-tól',
    timeLabel: 'Szerződés',
    time: 'Havonta megújuló',
    includedTitle: 'Mit tartalmaz',
    handoverTitle: 'Induláskor megkapod',
    handover: ['Belépő átvilágítás', 'Rangsorolt javítási lista', 'Havi teljesítményriport', 'Közös csatorna a kérésekhez', 'Negyedéves tervező beszélgetés', 'Havonta megújuló szerződés'],
    included: [
      { title: 'Közvetlen kapcsolat', text: 'Egy ember, aki ismeri az oldaladat, válaszol az üzeneteidre és el is végzi a munkát — nincs közvetítő, nincs ügyfélszolgálati sor.' },
      { title: 'Frissítések és biztonság', text: 'Platform-, bővítmény- és rendszerfrissítések, tesztelve, mielőtt a látogatóidhoz érnének. Minden csomagban.' },
      { title: 'Elérhetőség- és sebességfigyelés', text: 'Riasztás, ha az oldal leáll vagy lelassul — általában megjavítjuk, mielőtt észrevennéd.' },
      { title: 'Folyamatos módosítások', text: 'Kisebb módosítások és tartalomfrissítések folyamatosan, órák számolgatása nélkül — a Növekedés csomagban nagyobb fejlesztésekkel, a Beágyazott csapatban elsőbbséggel.' },
      { title: 'Teljesítményriport', text: 'Forgalom, megkeresések és sebesség havonta, azzal együtt, mit és miért változtattunk. A Növekedés csomagtól.' },
      { title: 'Tesztelés a kulcsoldalakon', text: 'A/B tesztek azokon az oldalakon, amelyek a legtöbbet számítanak, a Növekedés és a Beágyazott csapat csomagban.' },
      { title: 'Technikai SEO-figyelés', text: 'Search Console-hibák, indexelés, Core Web Vitals és törött linkek havi ellenőrzése és javítása. A Növekedés csomagtól.' },
      { title: 'SEO-cikkek', text: 'Havi 4 kulcsszóra írt, belső linkekkel ellátott cikk a blogodra, a Beágyazott csapat csomagban.' },
    ],
    next: { title: 'Weboldal készítés', slug: 'weboldal-keszites' },
    timeline: {
      title: 'Az első tizenkét hét',
      sub: 'Így áll be egy támogatási csomag, és utána a havi ritmus.',
      weeks: 12,
      weekShort: 'H',
      weekLabel: '{n}. hét',
      phases: [
        { title: 'Belépő átvilágítás', when: '1–2. hét', text: 'Sebesség, akadálymentesség, keresés és analitika ellenőrzése, javítási listával.', from: 0, to: 2 },
        { title: 'Javítási lista', when: '2–4. hét', text: 'Az átvilágítás legértékesebb javításai, elsőként.', from: 1.5, to: 4 },
        { title: 'Havi ritmus', when: '4–7. hét', text: 'Módosítások, frissítések és az első havi riport, veled együtt tervezve.', from: 4, to: 7 },
        { title: 'SEO és tartalom', when: '7–10. hét', text: 'Search Console, indexelés és sebesség; a Beágyazott csapatban havi 4 SEO-cikk.', from: 6.5, to: 10 },
        { title: 'Tesztelés', when: '10–12. hét', text: 'A/B tesztek a kulcsoldalakon, a Növekedés és a Beágyazott csapat csomagban.', from: 9.5, to: 12 },
      ],
    },
  },
  // EN: /en/services/maintenance
  'maintenance': {
    crumb: 'Care & growth',
    title: 'Website care & growth',
    lead: 'Updates, speed, testing and a direct line to your developer after launch.',
    audience: 'Teams who want the site to keep improving after launch without hiring a developer. Open to sites we built and, after an audit, to sites built elsewhere.',
    points: ['Sites we have launched', 'Businesses with frequent campaigns', 'Teams without an in-house developer'],
    cta: 'Talk about care',
    question: 'Questions first',
    image: 'davelopment-karbantartas.avif',
    imageAlt: 'Website maintenance and support',
    faqImage: 'davelopment-novekedes.avif',
    priceLabel: 'Essential care',
    price: '29,900 HUF',
    priceSuffix: 'from',
    timeLabel: 'Contract',
    time: 'Rolling monthly',
    includedTitle: 'What’s included',
    handoverTitle: 'When we start',
    handover: ['Onboarding audit', 'Prioritised improvement list', 'Monthly performance report', 'Shared request channel', 'Quarterly planning call', 'Rolling monthly contract'],
    included: [
      { title: 'A direct line', text: 'One person who knows your site, answers your messages and does the work — no account manager, no support queue.' },
      { title: 'Updates and security', text: 'Platform, plugin and app updates applied and tested before they reach your visitors. On every plan.' },
      { title: 'Uptime and speed monitoring', text: 'Alerts if the site goes down or slows down, usually fixed before you notice.' },
      { title: 'Ongoing changes', text: 'Small changes and content updates as you need them, without counting hours — bigger work on the Growth plan, priority on the Embedded plan.' },
      { title: 'Performance reports', text: 'Traffic, leads and speed each month, with what we changed and why. From the Growth plan.' },
      { title: 'Testing on key pages', text: 'A/B tests on the pages that matter most, on the Growth and Embedded plans.' },
      { title: 'Technical SEO watch', text: 'Search Console errors, indexing, Core Web Vitals and broken links checked and fixed monthly. From the Growth plan.' },
      { title: 'SEO articles', text: 'Four keyword-led articles a month for your blog, with internal links, on the Embedded plan.' },
    ],
    next: { title: 'Websites', slug: 'start-your-business-online' },
    timeline: {
      title: 'The first twelve weeks',
      sub: 'How a care plan settles in, then the monthly rhythm after that.',
      weeks: 12,
      weekShort: 'W',
      weekLabel: 'Week {n}',
      phases: [
        { title: 'Onboarding audit', when: 'Weeks 1 to 2', text: 'Speed, accessibility, search and analytics checked, with a list of fixes.', from: 0, to: 2 },
        { title: 'Fix list', when: 'Weeks 2 to 4', text: 'The most valuable fixes from the audit, done first.', from: 1.5, to: 4 },
        { title: 'Monthly rhythm', when: 'Weeks 4 to 7', text: 'Changes, updates and the first monthly report, planned with you.', from: 4, to: 7 },
        { title: 'SEO and content', when: 'Weeks 7 to 10', text: 'Search Console, indexing and speed; four SEO articles a month on the Embedded plan.', from: 6.5, to: 10 },
        { title: 'Testing', when: 'Weeks 10 to 12', text: 'A/B tests on key pages, on the Growth and Embedded plans.', from: 9.5, to: 12 },
      ],
    },
  },
  // HU: /hu/szolgaltatasok/marketing-es-seo — közös Marketing & SEO oldal (a Hirdetéskezelés is ide költözött, 301)
  'marketing-es-seo': {
    crumb: 'Marketing & SEO',
    title: 'Marketing és SEO',
    lead: 'Keresőoptimalizálás, tartalom és Google-hirdetések a weboldalad mellé.',
    audience: 'Vállalkozásoknak, akiknek megvan a weboldaluk, de kevés megkeresést hoz. Akár most indulsz, és gyorsan kellenek az első ügyfelek, akár hosszú távon építenél stabil Google-forgalmat.',
    points: ['Induló vállalkozások, akiknek most kellenek az ügyfelek', 'Helyi szolgáltatók, akiket a környéken keresnek', 'B2B cégek és szakmai szolgáltatók'],
    cta: 'Kezdjük el a projektet',
    question: 'Előbb kérdeznék',
    image: 'davelopment-hirdeteskezeles.avif',
    imageAlt: 'Online hirdetések és marketing',
    faqImage: 'davelopment-beagyazott-csapat.avif',
    priceLabel: 'Weboldal + marketing',
    price: '330 000 Ft',
    priceSuffix: '-tól',
    timeLabel: 'Átlagos átfutás',
    time: '4–6 hét, utána havonta',
    includedTitle: 'Mit tartalmaz',
    handoverTitle: 'Induláskor megkapod',
    handover: ['Kulcsszókutatás és versenytárs-elemzés', 'Tartalomstratégia és cikkterv', '4–5 induló SEO-cikk', 'Beállított Google Ads kampány', 'Konverziókövetés (GA4, Google Ads)', 'Havi riport érthető nyelven'],
    included: [
      { title: 'Kulcsszókutatás', text: 'Mire keresnek az ügyfeleid, mennyien, és hol vannak a leggyorsabban megszerezhető helyezések.' },
      { title: 'Technikai SEO', text: 'Sebesség, indexelés, strukturált adatok és belső linkek, hogy a Google pontosan értse az oldalt.' },
      { title: 'Tartalomstratégia', text: 'Cikk- és oldalterv a kulcsszavakra, a vásárlási út minden szakaszára.' },
      { title: 'SEO-cikkek', text: 'Kulcsszóra írt, belső linkekkel ellátott cikkek, amelyek hónapok múlva is hozzák a forgalmat.' },
      { title: 'Helyi SEO', text: 'Google Cégprofil, értékelések és helyi oldalak Budapestre, Debrecenre vagy a te városodra.' },
      { title: 'Google Ads kampány', text: 'Kampány, kulcsszavak, kizárások és hirdetésszövegek, hogy már az indulás hetében megjelenj.' },
      { title: 'Konverziókövetés', text: 'GA4 és Google Ads-konverziók beállítva, hogy lásd, melyik hirdetés és oldal hozza a megkeresést.' },
      { title: 'Havi optimalizálás és riport', text: 'Ajánlatok, kulcsszavak és oldalak finomhangolása — és havonta érthetően megmutatjuk, mit hozott a pénz.' },
    ],
    next: { title: 'Arculat és design', slug: 'branding-arculat' },
    timeline: {
      title: 'Akár négy hét az első eredményekig',
      sub: 'Egy jellemző indulás. Utána havi ritmusban optimalizálunk, riporttal.',
      weeks: 4,
      weekShort: 'H',
      weekLabel: '{n}. hét',
      phases: [
        { title: 'Kutatás', when: '1. hét', text: 'Kulcsszavak, versenytársak és a mostani számok.', from: 0, to: 1 },
        { title: 'Mérés és technikai SEO', when: '1–2. hét', text: 'Konverziókövetés, Search Console és a technikai hibák javítása.', from: 0.5, to: 1.5 },
        { title: 'Hirdetések indulása', when: '2. hét', text: 'Google Ads kampány beállítva és élesítve, az első hetekben napi figyeléssel.', from: 1, to: 2 },
        { title: 'Tartalom', when: '2–4. hét', text: 'Az induló cikkek és a kulcsoldalak szövegei, kulcsszóra írva.', from: 1.5, to: 3.5 },
        { title: 'Optimalizálás', when: '4. hét', text: 'Első riport és finomhangolás, utána havi ritmus.', from: 3, to: 4 },
      ],
    },
  },
  // EN: /en/services/marketing-and-seo — combined Marketing & SEO page (ad management redirects here)
  'marketing-and-seo': {
    crumb: 'Marketing & SEO',
    title: 'Marketing & SEO',
    lead: 'Search optimisation, content and Google Ads alongside your website.',
    audience: 'Businesses whose website is live but brings few enquiries. Whether you are launching and need the first customers fast, or want steady Google traffic for the long run.',
    points: ['New businesses that need customers now', 'Local businesses people search for nearby', 'B2B companies and professional services'],
    cta: 'Start a project',
    question: 'Questions first',
    image: 'davelopment-hirdeteskezeles.avif',
    imageAlt: 'Online advertising and marketing',
    faqImage: 'davelopment-beagyazott-csapat.avif',
    priceLabel: 'Website + marketing',
    price: '330,000 HUF',
    priceSuffix: 'from',
    timeLabel: 'Typical timeline',
    time: '4–6 weeks, then monthly',
    includedTitle: 'What’s included',
    handoverTitle: 'When we start',
    handover: ['Keyword and competitor research', 'Content strategy and article plan', '4–5 launch SEO articles', 'A live Google Ads campaign', 'Conversion tracking (GA4, Google Ads)', 'A monthly report in plain language'],
    included: [
      { title: 'Keyword research', text: 'What your customers search for, how many of them, and where the quickest rankings are.' },
      { title: 'Technical SEO', text: 'Speed, indexing, structured data and internal links, so Google understands the site.' },
      { title: 'Content strategy', text: 'An article and page plan around the keywords, for every stage of the buying journey.' },
      { title: 'SEO articles', text: 'Keyword-led articles with internal links that keep bringing traffic months later.' },
      { title: 'Local SEO', text: 'Google Business Profile, reviews and local pages for Budapest, Debrecen or your city.' },
      { title: 'Google Ads campaign', text: 'Campaign, keywords, negatives and ad copy, so you show up from launch week.' },
      { title: 'Conversion tracking', text: 'GA4 and Google Ads conversions set up, so you see which ad and page brings the enquiry.' },
      { title: 'Monthly optimisation and report', text: 'Bids, keywords and pages refined — and every month we show plainly what the money brought.' },
    ],
    next: { title: 'Brand & motion', slug: 'branding-identity' },
    timeline: {
      title: 'As little as four weeks to first results',
      sub: 'A typical start. After that we optimise in a monthly rhythm, with a report.',
      weeks: 4,
      weekShort: 'W',
      weekLabel: 'Week {n}',
      phases: [
        { title: 'Research', when: 'Week 1', text: 'Keywords, competitors and the current numbers.', from: 0, to: 1 },
        { title: 'Tracking and technical SEO', when: 'Weeks 1 to 2', text: 'Conversion tracking, Search Console and technical fixes.', from: 0.5, to: 1.5 },
        { title: 'Ads go live', when: 'Week 2', text: 'Google Ads campaign set up and launched, watched daily in the first weeks.', from: 1, to: 2 },
        { title: 'Content', when: 'Weeks 2 to 4', text: 'Launch articles and key page copy, written around the keywords.', from: 1.5, to: 3.5 },
        { title: 'Optimisation', when: 'Week 4', text: 'First report and refinements, then a monthly rhythm.', from: 3, to: 4 },
      ],
    },
  },
};

// ── Városoldalak (2026-11): /hu/weboldal-keszites-budapest|debrecen, /en/web-design-budapest|debrecen ──
// Ugyanaz a csomag és folyamat, mint a Weboldal készítésnél, városra szabott fejléccel. A [slug]/page.tsx rendereli.
const cityHu = (city: string, extra: Partial<ServiceDetail>): ServiceDetail => ({
  ...DETAILS['weboldal-keszites'],
  crumb: `Weboldal készítés ${city}`,
  title: `Weboldal készítés ${city}`,
  next: { title: 'Marketing & SEO', slug: 'marketing-es-seo' },
  ...extra,
});
const cityEn = (city: string, extra: Partial<ServiceDetail>): ServiceDetail => ({
  ...DETAILS['start-your-business-online'],
  crumb: `Web design ${city}`,
  title: `Web design ${city}`,
  next: { title: 'Marketing & SEO', slug: 'marketing-and-seo' },
  ...extra,
});
Object.assign(DETAILS, {
  'weboldal-keszites-budapest': cityHu('Budapest', {
    lead: 'Nem sablon, nem Wix — egyedi tervezésű weboldal budapesti vállalkozásoknak, olyan tartalomkezelővel, amit a csapatod egyedül is visz.',
    audience: 'Budapesti cégeknek, akiknek a weboldala az elején gyorsan, összecsapva készült, és ma már alulmúlja a vállalkozást — egy olyan piacon, ahol a konkurencia egy kattintásra van.',
    points: ['Budapesti szalonok, stúdiók és szolgáltatók', 'B2B és szakmai szolgáltatások', 'Vendéglátás és szállodák'],
    image: 'davelopment-launch.avif',
    imageAlt: 'Telefon a kézben egy napsütéses budapesti utcán, villamossal a háttérben',
    faqImage: 'davelopment-beagyazott-csapat.avif',
  }),
  'weboldal-keszites-debrecen': cityHu('Debrecen', {
    lead: 'Nem kell Budapestre utaznod egy jó weboldalért — egyedi tervezésű weboldal debreceni vállalkozásoknak, teljesen online folyamattal, ugyanabban a minőségben.',
    audience: 'Debreceni és kelet-magyarországi cégeknek, akiknek a weboldala ma már alulmúlja a vállalkozást. Az egyeztetés, a tervezés és az átadás is online zajlik, videóhívással.',
    points: ['Debreceni szalonok, stúdiók és szolgáltatók', 'B2B és szakmai szolgáltatások', 'Vendéglátás és szállodák'],
    image: 'davelopment-egyedi-weboldal.avif',
    imageAlt: 'Kezek gépelnek egy laptopon, napfényes asztalon — online együttműködés',
    faqImage: 'davelopment-novekedes.avif',
  }),
  'web-design-budapest': cityEn('Budapest', {
    lead: 'Not a template, not Wix — a custom-designed website for Budapest businesses, on a CMS your team can run on its own.',
    audience: 'Budapest companies whose website was put together quickly at the start and now undersells the business — in a market where the competition is one click away.',
    points: ['Budapest salons, studios and service businesses', 'B2B and professional services', 'Hospitality and hotels'],
    image: 'davelopment-launch.avif',
    imageAlt: 'A phone held up on a sunny Budapest street, with a tram behind it',
    faqImage: 'davelopment-beagyazott-csapat.avif',
  }),
  'web-design-debrecen': cityEn('Debrecen', {
    lead: 'No need to travel to Budapest for a great website — a custom-designed site for Debrecen businesses, with a fully remote process and the same quality.',
    audience: 'Companies in Debrecen and eastern Hungary whose website now undersells the business. Consultation, design and handover all happen online, over video calls.',
    points: ['Debrecen salons, studios and service businesses', 'B2B and professional services', 'Hospitality and hotels'],
    image: 'davelopment-egyedi-weboldal.avif',
    imageAlt: 'Hands typing on a laptop on a sunlit desk — working together remotely',
    faqImage: 'davelopment-novekedes.avif',
  }),
});


export function getServiceDetail(slug: string): ServiceDetail | null {
  return DETAILS[slug] ?? null;
}

