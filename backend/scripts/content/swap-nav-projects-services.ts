/**
 * Navbar: "Projektek" before "Szolgáltatások" (2026-11 redesign; HU + EN).
 *
 *   npx payload run scripts/content/swap-nav-projects-services.ts              # dry run
 *   npx payload run scripts/content/swap-nav-projects-services.ts -- --apply   # write
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const apply = process.argv.includes('--apply')
const payload = await getPayload({ config })
const SERVICES = /^\/(szolgaltatasok|services)$/
const PROJECTS = /^\/(projektek|products)$/

for (const locale of ['hu', 'en'] as const) {
  const g: any = await payload.findGlobal({ slug: 'global', locale, fallbackLocale: false as any, depth: 0 })
  const items: any[] = [...(g.navbar?.left_navbar_items ?? [])]
  const si = items.findIndex((i) => SERVICES.test(i.URL ?? i.url ?? ''))
  const pi = items.findIndex((i) => PROJECTS.test(i.URL ?? i.url ?? ''))
  console.log(`${locale}: ${items.map((i) => i.text).join(' · ')}`)
  if (si === -1 || pi === -1 || pi < si) { console.log('  – nincs teendő'); continue }
  ;[items[si], items[pi]] = [items[pi], items[si]]
  console.log(`  → ${items.map((i) => i.text).join(' · ')}`)
  if (!apply) continue
  await payload.updateGlobal({ slug: 'global', locale, depth: 0, data: { navbar: { ...g.navbar, left_navbar_items: items } } as any })
  console.log(`✓ ${locale}`)
}
process.exit(0)
