/**
 * Privacy policy (/hu/adatkezeles, /en/privacy-policy — page #230, "launches" block): adds Microsoft Clarity
 * (live since 2026-11-11, loaded only after analytics consent), adds Google Ads to the Hungarian text (it was only in
 * the English one), fixes the Google Analytics ID (the text said G-MXYSTX2XXK, the site runs G-9JD4BVWQ63) and
 * updates the "last updated" date. Sections 003 (processors), 004 (cookies) and 007 (amendments) are replaced.
 *
 *   npx payload run scripts/content/privacy-clarity.ts -- 2026-11-12             # dry run (date = "last updated")
 *   npx payload run scripts/content/privacy-clarity.ts -- 2026-11-12 --apply     # write
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const apply = process.argv.includes('--apply')
const date = process.argv.find((a) => /^\d{4}-\d{2}-\d{2}$/.test(a))
if (!date) throw new Error('usage: … -- YYYY-MM-DD [--apply]   (the "last updated" date = the day it goes live)')
const [y, m, d] = date.split('-').map(Number)
const HU_MONTHS = ['január', 'február', 'március', 'április', 'május', 'június', 'július', 'augusztus', 'szeptember', 'október', 'november', 'december']
const EN_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const TEXT = {
  hu: {
    '003': `A weboldal tárhelyét és szerver-üzemeltetését a RackForest Kft. (Magyarország) biztosítja, amely az adatokat kizárólag az Európai Unión belül kezeli. A látogatottsági statisztika méréséhez a Google Analytics, a hirdetéseink teljesítményének méréséhez és a remarketinghez a Google Ads szolgáltatást vesszük igénybe, amelyeket a Google LLC (Egyesült Államok) üzemeltet. A weboldal használatának elemzéséhez (kattintás- és görgetéstérkép, anonim munkamenet-felvétel) a Microsoft Clarity szolgáltatást használjuk, amelyet a Microsoft Corporation (Egyesült Államok) üzemeltet. Az e-mailek kézbesítéséhez a Resend Inc. (Egyesült Államok) szolgáltatását használjuk. Az Egyesült Államokba történő adattovábbítás az EU–US Data Privacy Framework, illetve az Európai Bizottság által elfogadott általános szerződési feltételek alapján, megfelelő garanciák mellett történik. Harmadik felek saját adatkezelési gyakorlatáért az adatkezelő felelősséget nem vállal.`,
    '004': `Weboldalunk a működéséhez, a látogatottság méréséhez és hirdetési célokra sütiket (cookie-kat) használ. Az oldal első látogatásakor megjelenő süti-tájékoztató sávban Ön kategóriánként engedélyezheti vagy elutasíthatja a sütiket, és választását bármikor módosíthatja az oldal alján található „Süti-beállítások” gombbal. A weboldal működéséhez elengedhetetlen szükséges sütik mindig aktívak.

Az analitikai sütik csak az Ön előzetes hozzájárulásával aktiválódnak. Ide tartozik a Google Analytics (azonosító: G-9JD4BVWQ63), amely anonimizált látogatói statisztikát gyűjt (oldalmegtekintés, tartózkodási idő, forrás), és a Microsoft Clarity, amely azt méri, hogyan használják a látogatók az oldalt: kattintásokat, görgetést, egérmozgást, valamint az eszköz és a böngésző típusát rögzíti, és ezekből hőtérképet, illetve anonim munkamenet-felvételt készít. A Clarity a beírt adatokat (például az űrlapmezők tartalmát) nem rögzíti, azokat maszkolja. A Clarity által használt sütik: _clck (1 év), _clsk (1 nap), CLID (1 év) és MUID (1 év). A felvételeket a Microsoft legfeljebb 30 napig, az összesített statisztikát legfeljebb 13 hónapig őrzi meg.

A marketing sütik — köztük a Google Ads sütijei — a hirdetéseink teljesítményének mérését, a konverziókövetést és a remarketinget szolgálják, és szintén csak az Ön előzetes hozzájárulásával aktiválódnak. A Google-szolgáltatások a Google Consent Mode alkalmazásával működnek: hozzájárulás nélkül nem helyeznek el analitikai vagy hirdetési sütit.

Az analitikai és marketing sütik adatait a Google LLC és a Microsoft Corporation az Egyesült Államokban, az EU–US Data Privacy Framework keretében dolgozza fel. Hozzájárulását bármikor visszavonhatja a süti-beállítások újranyitásával; a visszavonás a korábbi adatkezelés jogszerűségét nem érinti.`,
    '007': `Az adatkezelő fenntartja a jogot a jelen tájékoztató módosítására; a mindenkori hatályos változat a weboldalon érhető el. Utoljára módosítva: ${y}. ${HU_MONTHS[m - 1]} ${d}.`,
  },
  en: {
    '003': `The hosting and server operation of the website is provided by RackForest Kft. (registered seat: Victor Hugo utca 11–15, 5th floor, 1132 Budapest, Hungary), which processes the data exclusively within the European Union. For measuring website traffic we use Google Analytics, and for measuring the performance of our advertisements and for remarketing we use Google Ads, both operated by Google LLC (United States). For analysing how the website is used (click and scroll heatmaps, anonymous session recordings) we use Microsoft Clarity, operated by Microsoft Corporation (United States). For the delivery of e-mails we use the services of Resend Inc. (United States). Data is transferred to the United States subject to appropriate safeguards, under the EU–US Data Privacy Framework and/or the Standard Contractual Clauses adopted by the European Commission. The data controller assumes no responsibility for the data processing practices of third parties.`,
    '004': `Our website uses cookies for its operation, for measuring traffic and for advertising purposes. In the cookie banner displayed on your first visit you may enable or disable cookies by category, and you may change your choice at any time using the "Cookie settings" button at the bottom of the page. Cookies strictly necessary for the operation of the website are always active.

Analytics cookies are activated solely with your prior consent. They include Google Analytics (identifier: G-9JD4BVWQ63), which collects anonymised visitor statistics (page views, time spent, source), and Microsoft Clarity, which measures how visitors use the site: it records clicks, scrolling, mouse movement and the type of device and browser, and uses these to create heatmaps and anonymous session recordings. Clarity does not record what you type (for example the content of form fields); it masks it. The cookies used by Clarity are _clck (1 year), _clsk (1 day), CLID (1 year) and MUID (1 year). Microsoft keeps recordings for up to 30 days and aggregated statistics for up to 13 months.

Marketing cookies — including those of Google Ads — enable the measurement of our advertising performance, conversion tracking and remarketing, and are likewise activated solely with your prior consent. Google services operate using Google Consent Mode: without consent they do not set analytics or advertising cookies.

Data from analytics and marketing cookies is processed by Google LLC and Microsoft Corporation in the United States under the EU–US Data Privacy Framework. You may withdraw your consent at any time by reopening the cookie settings; such withdrawal does not affect the lawfulness of processing carried out prior to the withdrawal.`,
    '007': `The data controller reserves the right to amend this policy; the version in force at any given time is available on the website. Last updated: ${d} ${EN_MONTHS[m - 1]} ${y}.`,
  },
} as const

const PAGE_ID = 230
const payload = await getPayload({ config })

for (const locale of ['hu', 'en'] as const) {
  const page: any = await payload.findByID({ collection: 'pages', id: PAGE_ID, locale, fallbackLocale: false as any, depth: 0 })
  const zone = page.dynamic_zone ?? []
  const block = zone.find((b: any) => b.blockType === 'launches')
  if (!block) { console.log(`✗ ${locale}: nincs launches blokk`); continue }
  const launches = block.launches.map((l: any) => {
    const next = (TEXT[locale] as Record<string, string>)[l.mission_number]
    if (!next) return l
    console.log(`${locale} ${l.mission_number} ${l.title}: ${l.description.length} → ${next.length} karakter`)
    return { ...l, description: next }
  })
  if (!apply) continue
  const nextZone = zone.map((b: any) => (b === block ? { ...b, launches } : b))
  await payload.update({ collection: 'pages', id: PAGE_ID, locale, depth: 0, data: { dynamic_zone: nextZone, _status: 'published' } as any })
  console.log(`✓ ${locale}: mentve`)
}
process.exit(0)
