/**
 * 2026-10-24-i tartalomjavítások a Payload Local API-n keresztül (helyben
 * és élesen ugyanígy futtatható, nem nyers SQL):
 *  1. magyar SEO title/description/keywords a 61–66-os cikkekre,
 *  2. a 60 karakternél hosszabb angol meta címek rövidítése (ezek miatt az
 *     admin angolul el sem mentette a cikket),
 *  3. a Blog oldal kiemelt listája: az új cikkek előre.
 *
 *   npx payload run scripts/content/sync-seo-and-blog-order.ts              # dry run
 *   npx payload run scripts/content/sync-seo-and-blog-order.ts -- --apply   # írás
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const apply = process.argv.includes('--apply')
const skipBlog = process.argv.includes('--skip-blog')
const onlyBlog = process.argv.includes('--only-blog')
const payload = await getPayload({ config })
const idOf = (v: any) => (v && typeof v === 'object' ? v.id : v)

const huSeo: Record<number, { metaTitle: string; keywords: string }> = {
  61: { metaTitle: '7 SEO-tipp kisvállalkozásoknak: több organikus forgalom', keywords: 'seo tippek, kisvállalkozás seo, organikus forgalom növelése, seo kezdőknek, helyi seo' },
  62: { metaTitle: 'Landing oldal dizájn: elemek, amik növelik a konverziót', keywords: 'landing oldal konverzió, landing page dizájn, konverzió optimalizálás, cta gomb, űrlap konverzió' },
  63: { metaTitle: 'Lead generálás weboldallal: ügyfelek, nem csak látogatók', keywords: 'lead generálás weboldallal, leadgenerálás, ügyfélszerzés weboldallal, weboldal konverzió, b2b leadek' },
  64: { metaTitle: 'Arculat vagy weboldal: mivel kezdjen egy induló cég?', keywords: 'arculat vagy weboldal, induló vállalkozás arculat, arculattervezés, weboldal induló cégnek, logótervezés' },
  65: { metaTitle: 'Egységes arculat a weboldalon és a közösségi médiában', keywords: 'egységes arculat, brand konzisztencia, közösségi média arculat, arculati kézikönyv, márkaépítés' },
  66: { metaTitle: 'B2B weboldal SEO-optimalizálással: mire figyelj?', keywords: 'b2b weboldal, b2b seo, b2b weboldal készítés, b2b kulcsszavak, b2b tartalommarketing' },
}

const enTitles: Record<number, string> = {
  50: 'What Happens to Your Website After Launch?',
  51: 'Custom Website vs Template (Wix, Squarespace)',
  53: 'Website or Just Instagram/Facebook — Is It Enough?',
  56: 'Building a Website With AI Yourself — Is It Worth It?',
  58: 'Zero-Click Search: Why Customers Stop Clicking',
}

const featuredFront = [64, 62, 61, 63, 66, 65]

async function save(label: string, fn: () => Promise<unknown>) {
  if (!apply) return console.log(`○ ${label} (dry run)`)
  try {
    await fn()
    console.log(`✓ ${label}`)
  } catch (e: any) {
    console.log(`✗ ${label}: ${JSON.stringify(e?.data?.errors ?? e?.message)}`)
  }
}

for (const [id, s] of Object.entries(onlyBlog ? {} : huSeo)) {
  const hu: any = await payload.findByID({ collection: 'articles', id, locale: 'hu', fallbackLocale: false as any, depth: 0 })
  const seo = { ...hu.seo, metaTitle: s.metaTitle, metaDescription: hu.description, keywords: s.keywords }
  await save(`hu SEO ${id}: "${hu.seo?.metaTitle ?? ''}" → "${s.metaTitle}"`, () =>
    payload.update({ collection: 'articles', id, locale: 'hu', data: { seo } as any }),
  )
}

for (const [id, title] of Object.entries(onlyBlog ? {} : enTitles)) {
  const en: any = await payload.findByID({ collection: 'articles', id, locale: 'en', fallbackLocale: false as any, depth: 0 })
  if ((en.seo?.metaTitle ?? '').length <= 60) {
    console.log(`– en cím ${id}: már rendben (${en.seo?.metaTitle})`)
    continue
  }
  await save(`en cím ${id}: "${en.seo.metaTitle}" → "${title}"`, () =>
    payload.update({ collection: 'articles', id, locale: 'en', data: { seo: { ...en.seo, metaTitle: title } } as any }),
  )
}

if (skipBlog) {
  console.log('– blog sorrend kihagyva (--skip-blog)')
  process.exit(0)
}
const blog: any = await payload.findGlobal({ slug: 'blog-page', depth: 0, draft: true })
const current: number[] = (blog.featured_articles ?? []).map(idOf)
const next = [...featuredFront, ...current.filter((id) => !featuredFront.includes(id))]
await save(`blog sorrend: ${current.length} → ${next.length} cikk, eleje ${next.slice(0, 7).join(',')}`, () =>
  payload.updateGlobal({ slug: 'blog-page', data: { featured_articles: next, _status: 'published' } as any }),
)

process.exit(0)
