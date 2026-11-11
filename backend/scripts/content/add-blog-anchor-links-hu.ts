/**
 * Internal links from Hungarian blog articles to the service pages: an existing phrase in the article text becomes a
 * link (the wording does not change). First occurrence in body text only (headings and existing links are skipped).
 * Idempotent: a phrase that is already a link to the target is skipped.
 *
 *   npx payload run scripts/content/add-blog-anchor-links-hu.ts              # dry run
 *   npx payload run scripts/content/add-blog-anchor-links-hu.ts -- --apply   # write
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const apply = process.argv.includes('--apply')

const S = '/hu/szolgaltatasok/'
const LINKS: [slug: string, phrase: string, url: string][] = [
  ['weboldal-vagy-csak-instagram-facebook', 'SEO-optimalizálható', S + 'seo-tartalommarketing'],
  ['mennyi-ido-alatt-jelenik-meg-a-weboldalam-a-google-kereseben', 'fizetett hirdetést', S + 'hirdeteskezeles'],
  ['miert-jobb-az-elofizeteses-weboldal-mint-az-egyszeri-fizetos', 'karbantartást', S + 'karbantartas'],
  ['miert-jobb-az-elofizeteses-weboldal-mint-az-egyszeri-fizetos', 'időpontfoglaló rendszeren', S + 'digitalis-rendszerek'],
  ['hogyan-valtoztathatja-meg-egy-jol-megtervezett-weboldal-a-vallalkozasod', 'hirdetéseidet és kampányaidat', S + 'hirdeteskezeles'],
  ['hogyan-valtoztathatja-meg-egy-jol-megtervezett-weboldal-a-vallalkozasod', 'időpontfoglalás', S + 'digitalis-rendszerek'],
  ['wordpress-vagy-egyedi-weboldal-2026-ban', 'technikai SEO/GEO-alapok', S + 'seo-tartalommarketing'],
  ['seo-vagy-google-ads-melyikbe-erdemes-fektetni', 'fizetett hirdetés', S + 'hirdeteskezeles'],
  ['egyedi-weboldal-vs-sablon-wix-squarespace', 'nehezebb SEO-optimalizálás', S + 'seo-tartalommarketing'],
  ['egyedi-weboldal-vs-sablon-wix-squarespace', 'foglalási rendszer', S + 'digitalis-rendszerek'],
  ['weboldal-keszites-folyamata-lepesrol-lepesre', 'egyedi weboldal', S + 'weboldal-keszites'],
  ['weboldal-keszites-folyamata-lepesrol-lepesre', 'egyedi arculatról', S + 'branding-arculat'],
  ['weboldal-keszites-folyamata-lepesrol-lepesre', 'karbantartás', S + 'karbantartas'],
  ['weboldal-keszites-folyamata-lepesrol-lepesre', 'foglalási rendszer', S + 'digitalis-rendszerek'],
  ['weboldalt-ai-val-is-meg-tudod-csinalni-magad-de-megeri', 'SEO-alapok helyes beállítása', S + 'seo-tartalommarketing'],
  ['mennyibe-kerul-egy-weboldal-magyarorszagon-2026-ban', 'karbantartás', S + 'karbantartas'],
  ['mennyibe-kerul-egy-weboldal-magyarorszagon-2026-ban', 'foglalási rendszer', S + 'digitalis-rendszerek'],
  ['b2b-weboldal-seo-optimalizalassal', 'SEO-stratégiáját', S + 'seo-tartalommarketing'],
  ['miert-dontheti-el-a-weboldalad-sebessege-a-vallalkozasod-sorsat', 'felhasználói élményt', S + 'ux-ui-design-fejlesztes'],
]

const linkNode = (url: string, child: any) => ({
  type: 'link', fields: { url, newTab: false, linkType: 'custom' }, format: '', indent: 0, version: 3, children: [child], direction: 'ltr',
})

/** Puts the first body-text occurrence of `phrase` into a link. Returns the sentence around it, or null. */
function linkify(root: any, phrase: string, url: string): string | null {
  let done: string | null = null
  const visit = (node: any) => {
    if (done || !node || typeof node !== 'object') return
    if (node.type === 'heading' || node.type === 'link' || node.type === 'autolink') return
    const kids: any[] = node.children
    if (!Array.isArray(kids)) return
    for (let i = 0; i < kids.length && !done; i++) {
      const k = kids[i]
      if (k?.type === 'text' && typeof k.text === 'string') {
        const at = k.text.indexOf(phrase)
        if (at === -1) continue
        const before = k.text.slice(0, at), after = k.text.slice(at + phrase.length)
        const repl: any[] = []
        if (before) repl.push({ ...k, text: before })
        repl.push(linkNode(url, { ...k, text: phrase }))
        if (after) repl.push({ ...k, text: after })
        kids.splice(i, 1, ...repl)
        done = `…${before.slice(-50)}[${phrase}]${after.slice(0, 40)}…`
      } else visit(k)
    }
  }
  visit(root)
  return done
}

const hasLinkTo = (n: any, url: string): boolean =>
  !!n && typeof n === 'object' && ((n.type === 'link' && n.fields?.url === url) || (Array.isArray(n.children) && n.children.some((c: any) => hasLinkTo(c, url))))

const payload = await getPayload({ config })

const bySlug = new Map<string, [string, string][]>()
for (const [slug, phrase, url] of LINKS) bySlug.set(slug, [...(bySlug.get(slug) ?? []), [phrase, url]])

let total = 0
for (const [slug, items] of bySlug) {
  const res = await payload.find({ collection: 'articles' as any, locale: 'hu', fallbackLocale: false as any, depth: 0, limit: 1, where: { slug: { equals: slug } } })
  const doc: any = res.docs[0]
  if (!doc) { console.log(`✗ nincs ilyen cikk: ${slug}`); continue }
  const root = structuredClone(doc.content.root)
  let changed = 0
  console.log(`\n${doc.title}`)
  for (const [phrase, url] of items) {
    if (hasLinkTo(root, url)) { console.log(`   – már linkel ide: ${url}`); continue }
    const ctx = linkify(root, phrase, url)
    if (ctx) { changed++; total++; console.log(`   ✓ ${url.replace(S, '')}: ${ctx}`) }
    else console.log(`   ✗ nem találom a szövegben: „${phrase}”`)
  }
  if (apply && changed) {
    await payload.update({ collection: 'articles' as any, id: doc.id, locale: 'hu', depth: 0, data: { content: { root }, _status: 'published' } as any })
    console.log('   → mentve')
  }
}
console.log(`\nÖsszesen ${total} link${apply ? ' mentve' : ' (próbafuttatás)'}`)
process.exit(0)
