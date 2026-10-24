/**
 * "Dióhéjban" (key_points) blokk hozzáadása a 61–66-os cikkek elejére, hu +
 * en nyelven, a Payload Local API-n keresztül. Idempotens: ha egy cikkben már
 * van key_points blokk, kihagyja.
 *
 * A meglévő blokkok (CTA) angol értékeit a magyar mentés ELŐTT kiolvassa, és
 * az angol mentésnél block-id alapján visszaadja, hogy semmi ne vesszen el.
 *
 *   npx payload run scripts/content/add-key-points.ts              # dry run
 *   npx payload run scripts/content/add-key-points.ts -- --apply   # írás
 */
import fs from 'node:fs'
import path from 'node:path'
import { getPayload } from 'payload'
import config from '@payload-config'

type KP = { heading: string; points: string[] }
const apply = process.argv.includes('--apply')
const source = JSON.parse(
  fs.readFileSync(path.resolve(process.cwd(), 'scripts/content/en-articles-61-66.json'), 'utf8'),
) as { articles: Record<string, { keyPoints: KP; keyPointsHu: KP }> }

const payload = await getPayload({ config })
const read = (id: string, locale: 'hu' | 'en') =>
  payload.findByID({ collection: 'articles', id, locale, fallbackLocale: false as any, depth: 0 }) as Promise<any>
let failed = false

for (const [id, t] of Object.entries(source.articles)) {
  const huBefore = await read(id, 'hu')
  if ((huBefore.dynamic_zone ?? []).some((b: any) => b.blockType === 'key_points')) {
    console.log(`– ${id}: már van Dióhéjban blokk, kihagyva`)
    continue
  }
  if (t.keyPointsHu.points.length !== t.keyPoints.points.length) {
    failed = true
    console.log(`✗ ${id}: hu/en pontszám eltér`)
    continue
  }
  if (!apply) {
    console.log(`○ ${id}: + Dióhéjban (${t.keyPointsHu.points.length} pont) a meglévő ${(huBefore.dynamic_zone ?? []).map((b: any) => b.blockType).join(',')} elé (dry run)`)
    continue
  }

  try {
    const enBefore = await read(id, 'en')
    const enById = new Map((enBefore.dynamic_zone ?? []).map((b: any) => [b.id, b]))

    await payload.update({
      collection: 'articles', id, locale: 'hu',
      data: {
        dynamic_zone: [
          { blockType: 'key_points', heading: t.keyPointsHu.heading, points: t.keyPointsHu.points.map((text) => ({ text })) },
          ...(huBefore.dynamic_zone ?? []),
        ],
      } as any,
    })

    const huAfter = await read(id, 'hu')
    const enZone = (huAfter.dynamic_zone ?? []).map((b: any) => {
      if (b.blockType === 'key_points') {
        return { ...b, heading: t.keyPoints.heading, points: b.points.map((p: any, i: number) => ({ id: p.id, text: t.keyPoints.points[i] })) }
      }
      const en: any = enById.get(b.id)
      return en ? { ...en, CTAs: (en.CTAs ?? []).map(({ id: _id, ...c }: any) => c) } : b
    })
    await payload.update({ collection: 'articles', id, locale: 'en', data: { dynamic_zone: enZone } as any })

    const [hu, en] = await Promise.all([read(id, 'hu'), read(id, 'en')])
    const summary = (doc: any) =>
      doc.dynamic_zone.map((b: any) => (b.blockType === 'key_points' ? `${b.heading}(${b.points.length})` : `cta:${b.CTAs?.[0]?.text}`)).join(' + ')
    console.log(`✓ ${id}: hu ${summary(hu)} | en ${summary(en)}`)
  } catch (e: any) {
    failed = true
    console.log(`✗ ${id}: ${JSON.stringify(e?.data?.errors ?? e?.message)}`)
  }
}
process.exit(failed ? 1 : 0)
