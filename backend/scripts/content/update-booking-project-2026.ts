/**
 * Projects: the davelopment booking case study (product #9) gets the current wording of booking.davelopment.hu
 * (2026-11): description, the two text sections, meta row and buttons; the CTA block's button text too. HU + EN.
 * Images are not touched.
 *
 *   npx payload run scripts/content/update-booking-project-2026.ts              # dry run
 *   npx payload run scripts/content/update-booking-project-2026.ts -- --apply   # write
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const apply = process.argv.includes('--apply')
const ID = 9
const URL = 'https://booking.davelopment.hu'

const TEXT = {
  hu: {
    badge_label: 'Saját fejlesztésű SaaS platform',
    description:
      'Kezeld a naptárad, foglaljanak azonnal, építsd az üzleted. Online időpont- és asztalfoglaló rendszer szakembereknek és éttermeknek: a vendégek a saját foglalóoldalon foglalnak, a vállalkozás pedig egy helyen kezeli a naptárat, a csapatot, az értesítéseket és a fizetéseket.',
    industry: 'Időpont- és asztalfoglalás',
    scope: 'SaaS platform, tervezéstől az üzemeltetésig',
    timeline: '12 hét',
    badge_label_center: 'Amit tud',
    heading_center: 'Foglalás, csapat és fizetés egy összekötött rendszerben.',
    description_center: [
      'Az ismétlődő munkát a davelopment booking végzi el — a szalon közben dolgozik.',
      '- Online időpontfoglalás: saját foglalóoldal, ahol a vendég a nap 24 órájában foglal — fodrászatnak, szépségszalonnak, rendelőnek, stúdiónak.',
      '- Online asztalfoglalás: éttermeknek asztaltérképpel, létszámmal és alkalmakkal, azonnali visszaigazolással vagy kézi jóváhagyással.',
      '- Előleg és no-show védelem: előleg bekérése foglaláskor és automatikus emlékeztető — kevesebb elmaradt időpont, jutalék nélkül.',
      '- Csapatbeosztás kézi egyeztetés nélkül: mindenki a saját naptárán dolgozik, és látja a saját műszakját.',
    ].join('\n'),
    button_center: { text: 'Kipróbálom ingyen', URL, target: '_blank', variant: 'primary' },
    badge_label_bottom: 'Eredmény',
    heading_bottom: 'Kevesebb adminisztráció, több vendég.',
    description_bottom: [
      'Minden foglalásról és fizetésről azonnal tudsz — ott, ahol épp vagy. A számlát Számlázz.hu vagy Billingo állítja ki automatikusan, az ajándékutalvány online eladható.',
      '5 perc, és éles a foglalóoldal: a rendszer betölt egy kész sablont az üzlet típusához, vagy a Google Business fiókból tölti ki az adatokat. Minden csomag 30 napig ingyenes, kártya nélkül.',
    ].join('\n'),
    button_bottom: { text: null, URL, target: '_blank', variant: 'primary' },
    ctaButton: 'Kipróbálom ingyen',
  },
  en: {
    badge_label: 'Our own SaaS platform',
    description:
      'Manage your calendar, let clients book instantly, grow the business. An online appointment and table booking system for service providers and restaurants: clients book on your own booking page, and you run the calendar, the team, notifications and payments in one place.',
    industry: 'Appointment and table booking',
    scope: 'SaaS platform, from design to operations',
    timeline: '12 weeks',
    badge_label_center: 'What it does',
    heading_center: 'Bookings, team and payments in one connected system.',
    description_center: [
      'davelopment booking does the repetitive work — while the salon keeps working.',
      '- Online appointment booking: your own booking page where clients book around the clock — for hair salons, beauty salons, clinics and studios.',
      '- Online table booking: for restaurants, with a table map, party sizes and occasions, instant confirmation or manual approval.',
      '- Deposits and no-show protection: a deposit at booking and automatic reminders — fewer missed appointments, no commission.',
      '- Team scheduling without back-and-forth: everyone works in their own calendar and sees their own shifts.',
    ].join('\n'),
    button_center: { text: 'Try it free', URL, target: '_blank', variant: 'primary' },
    badge_label_bottom: 'Result',
    heading_bottom: 'Less admin, more clients.',
    description_bottom: [
      'You know about every booking and payment instantly — wherever you are. Invoices are issued automatically via Számlázz.hu or Billingo, and gift vouchers can be sold online.',
      'Five minutes and the booking page is live: the system loads a ready-made template for the business type, or fills in the details from Google Business. Every plan is free for 30 days, no card needed.',
    ].join('\n'),
    button_bottom: { text: null, URL, target: '_blank', variant: 'primary' },
    ctaButton: 'Try it free',
  },
} as const

const payload = await getPayload({ config })
for (const locale of ['hu', 'en'] as const) {
  const doc: any = await payload.findByID({ collection: 'products', id: ID, locale, fallbackLocale: false as any, depth: 0 })
  const { ctaButton, ...fields } = TEXT[locale]
  const zone = (doc.dynamic_zone ?? []).map((b: any) =>
    b.blockType === 'cta' ? { ...b, CTAs: (b.CTAs ?? []).map((c: any, i: number) => (i === 0 ? { ...c, text: ctaButton, target: '_blank' } : c)) } : b,
  )
  console.log(`${locale}: ${doc.heading_center?.slice(0, 50)}… → ${fields.heading_center}`)
  if (!apply) continue
  await payload.update({ collection: 'products', id: ID, locale, depth: 0, data: { ...fields, dynamic_zone: zone, _status: 'published' } as any })
  console.log(`✓ ${locale}`)
}
process.exit(0)
