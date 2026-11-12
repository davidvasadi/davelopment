/**
 * Service pages (the "service" global's list): in every "Kiemelt projektek" (products) block, davelopment booking
 * (product #9) is the first project (2026-11 redesign, like the homepage). Adds it if missing, moves it if not first.
 * Also fixes Hungarian badge labels left on EN rows (Szépségszalon → Beauty Salon, Egészségügy → Healthcare).
 *
 *   npx payload run scripts/content/booking-first-on-service-pages.ts              # dry run
 *   npx payload run scripts/content/booking-first-on-service-pages.ts -- --apply   # write
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const apply = process.argv.includes('--apply')
const BOOKING = 9
const BADGE = { hu: 'Időpontfoglaló rendszer', en: 'Booking system' } as const
const EN_FIX: Record<string, string> = { Szépségszalon: 'Beauty Salon', 'Egészségügy': 'Healthcare' }
const idOf = (x: any) => (x && typeof x === 'object' ? x.id : x)

const payload = await getPayload({ config })
const svc: any = await payload.findGlobal({ slug: 'service', depth: 0 })
// a főoldal (#220) is: ott az angol booking-sorról hiányzott a címke
const pageIds: any[] = [220, ...(svc.pages ?? []).map(idOf)]

for (const id of pageIds) {
  for (const locale of ['hu', 'en'] as const) {
    const page: any = await payload.findByID({ collection: 'pages', id, locale, fallbackLocale: false as any, depth: 0 }).catch(() => null)
    const zone = page?.dynamic_zone ?? []
    if (!zone.some((b: any) => b.blockType === 'products')) continue
    let changed = false
    const next = zone.map((b: any) => {
      if (b.blockType !== 'products') return b
      let projects: any[] = (b.projects ?? []).map((p: any) => ({ ...p, product: idOf(p.product) }))
      if (locale === 'en') projects = projects.map((p) => (EN_FIX[p.badge_label] ? ((changed = true), { ...p, badge_label: EN_FIX[p.badge_label] }) : p))
      const at = projects.findIndex((p) => p.product === BOOKING)
      if (at === 0 && projects[0].badge_label) return { ...b, projects }
      if (at === 0) { changed = true; projects[0] = { ...projects[0], badge_label: BADGE[locale] }; return { ...b, projects } }
      const booking = at > 0 ? projects.splice(at, 1)[0] : { product: BOOKING, badge_label: BADGE[locale], result_line: '', tags: [] }
      changed = true
      return { ...b, projects: [booking, ...projects] }
    })
    if (!changed) { console.log(`– #${id} ${locale}: rendben`); continue }
    console.log(`#${id} ${locale} (${page.slug}): booking az első helyre`)
    if (!apply) continue
    await payload.update({ collection: 'pages', id, locale, depth: 0, data: { dynamic_zone: next, _status: 'published' } as any })
    console.log(`✓ #${id} ${locale}`)
  }
}
process.exit(0)
