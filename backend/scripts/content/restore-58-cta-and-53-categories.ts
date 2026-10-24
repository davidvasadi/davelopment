/**
 * 2026-10-24 helyreállítás (Payload Local API). A 2026-10-24 12:26-os angol
 * meta-cím rövidítésnél a Payload a cikk legutóbbi VERZIÓJÁBÓL töltötte
 * vissza a többi mezőt, ami eltért a fő táblától (korábbi SQL-szinkron
 * nyoma). Emiatt:
 *  - a 58-as cikkből eltűnt a CTA blokk → itt visszaállítjuk (hu + en,
 *    a reggeli éles mentés tartalmával; az angol gomb /pricing-ra mutat,
 *    nem a nem létező /en/arak-ra),
 *  - a 53-as cikk magyar kategóriái duplázódtak → itt egyedivé tesszük.
 *
 *   npx payload run scripts/content/restore-58-cta-and-53-categories.ts              # dry run
 *   npx payload run scripts/content/restore-58-cta-and-53-categories.ts -- --apply   # írás
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const apply = process.argv.includes('--apply')
const payload = await getPayload({ config })
const idOf = (v: any) => (v && typeof v === 'object' ? v.id : v)
const read = (id: number, locale: 'hu' | 'en') =>
  payload.findByID({ collection: 'articles', id, locale, fallbackLocale: false as any, depth: 0 }) as Promise<any>

const cta = {
  hu: {
    badge_label: 'Láthatóság',
    heading: 'Szeretnéd, hogy',
    heading_highlight: 'a zero-click korban is megtaláljanak?',
    sub_heading: 'Olyan weboldalt építünk, ami a hagyományos Google-találatokban és az AI-asszisztensekben is megjelenik.',
    CTAs: [{ text: 'Nézd meg az árainkat', URL: '/arak', target: '_self', variant: 'primary' }],
  },
  en: {
    badge_label: 'Visibility',
    heading: 'Want to stay findable',
    heading_highlight: 'in the zero-click era?',
    sub_heading: 'We build sites that show up in both classic Google results and AI assistants.',
    CTAs: [{ text: 'See our pricing', URL: '/pricing', target: '_self', variant: 'primary' }],
  },
}

// 58: CTA blokk vissza
const hu58 = await read(58, 'hu')
if ((hu58.dynamic_zone ?? []).some((b: any) => b.blockType === 'cta')) {
  console.log('– 58: már van CTA blokk, kihagyva')
} else if (!apply) {
  console.log(`○ 58: CTA blokk visszaállítása (jelenlegi blokkok: ${(hu58.dynamic_zone ?? []).length}) (dry run)`)
} else {
  await payload.update({
    collection: 'articles', id: 58, locale: 'hu',
    data: { dynamic_zone: [...(hu58.dynamic_zone ?? []), { blockType: 'cta', image: [284], ...cta.hu }] } as any,
  })
  const huAfter = await read(58, 'hu')
  const enZone = huAfter.dynamic_zone.map((b: any) => (b.blockType === 'cta' ? { ...b, ...cta.en } : b))
  await payload.update({ collection: 'articles', id: 58, locale: 'en', data: { dynamic_zone: enZone } as any })
  const [hu, en] = await Promise.all([read(58, 'hu'), read(58, 'en')])
  const c = (d: any) => d.dynamic_zone.find((b: any) => b.blockType === 'cta')
  console.log(`✓ 58: hu "${c(hu)?.heading}" → ${c(hu)?.CTAs?.[0]?.URL} | en "${c(en)?.heading}" → ${c(en)?.CTAs?.[0]?.URL} | kép ${c(hu)?.image}`)
}

// 53: duplikált magyar kategóriák
const hu53 = await read(53, 'hu')
const cats = (hu53.categories ?? []).map(idOf)
const unique = [...new Set(cats)]
if (unique.length === cats.length) {
  console.log(`– 53: kategóriák rendben (${cats.join(',')})`)
} else if (!apply) {
  console.log(`○ 53: kategóriák ${cats.join(',')} → ${unique.join(',')} (dry run)`)
} else {
  await payload.update({ collection: 'articles', id: 53, locale: 'hu', data: { categories: unique } as any })
  console.log(`✓ 53: kategóriák → ${(await read(53, 'hu')).categories.map(idOf).join(',')}`)
}

process.exit(0)
