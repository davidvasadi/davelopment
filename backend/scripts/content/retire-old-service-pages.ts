/**
 * The old UX/UI (#218) and Digitális rendszerek (#219) service pages are retired (2026-11): they leave the "service"
 * global's page list (so no related-services list links to them). The pages stay in the CMS; their URLs 301-redirect
 * (UX/UI → Arculat & design, Digitális rendszerek → Árak) in frontend next.config.mjs.
 *
 *   npx payload run scripts/content/retire-old-service-pages.ts              # dry run
 *   npx payload run scripts/content/retire-old-service-pages.ts -- --apply   # write
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const apply = process.argv.includes('--apply')
const RETIRE = [218, 219]
const payload = await getPayload({ config })
const svc: any = await payload.findGlobal({ slug: 'service', depth: 0 })
const ids: any[] = (svc.pages ?? []).map((p: any) => (typeof p === 'object' ? p.id : p))
const next = ids.filter((x) => !RETIRE.includes(Number(x)))
console.log(`szolgáltatáslista: ${ids.join(', ')} → ${next.join(', ')}`)
if (apply && next.length !== ids.length) {
  await payload.updateGlobal({ slug: 'service', depth: 0, data: { pages: next } as any })
  console.log('✓ szolgáltatáslista')
} else if (apply) console.log('– már rendben')
process.exit(0)
