/**
 * 2026-10-24: két kisebb tartalomjavítás a Payload Local API-n keresztül.
 *  1. A 63-as és 64-es cikk magyar bevezetőjében duplán szereplő mondat
 *     javítása (pontos szövegegyezésre cserél, különben nem nyúl hozzá).
 *  2. Minden cikknél: ha az angol borítókép hiányzik vagy eltér a magyartól,
 *     az angol megkapja a magyar képet (mindig az adott DB magyar képét).
 *
 *   npx payload run scripts/content/fix-intros-and-en-images.ts              # dry run
 *   npx payload run scripts/content/fix-intros-and-en-images.ts -- --apply   # írás
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const apply = process.argv.includes('--apply')
const payload = await getPayload({ config })
const idOf = (v: any) => (v && typeof v === 'object' ? v.id : v)
let failed = false

const intros: Record<number, { from: string; to: string }> = {
  63: {
    from: '-nél sok vállalkozóval találkozunk, akik ezzel szembesülnek: Sok vállalkozó azzal szembesül, hogy van látogatója a weboldalán, mégsem jönnek megkeresések. A probléma legtöbbször nem a forgalom mennyisége, hanem az, hogy az oldal nem vezeti el a látogatót a megkereséshez.',
    to: '-nél sok vállalkozóval találkozunk, akik ugyanezzel szembesülnek: van látogatójuk a weboldalukon, mégsem jönnek megkeresések. A probléma legtöbbször nem a forgalom mennyisége, hanem az, hogy az oldal nem vezeti el a látogatót a megkereséshez.',
  },
  64: {
    from: '-nél ez az egyik leggyakrabban feltett kérdés: Ez az egyik leggyakrabban feltett kérdés, amikor valaki most indítja a vállalkozását — és a válasz nem fekete-fehér, de van egy gyakorlati szempont, ami sokszor eldönti.',
    to: '-nél ez az egyik leggyakrabban feltett kérdés, amikor valaki most indítja a vállalkozását — és a válasz nem fekete-fehér, de van egy gyakorlati szempont, ami sokszor eldönti.',
  },
}

async function save(label: string, fn: () => Promise<unknown>) {
  if (!apply) return console.log(`○ ${label} (dry run)`)
  try {
    await fn()
    console.log(`✓ ${label}`)
  } catch (e: any) {
    failed = true
    console.log(`✗ ${label}: ${JSON.stringify(e?.data?.errors ?? e?.message)}`)
  }
}

for (const [id, { from, to }] of Object.entries(intros)) {
  const hu: any = await payload.findByID({ collection: 'articles', id, locale: 'hu', fallbackLocale: false as any, depth: 0 })
  const content = structuredClone(hu.content)
  let hits = 0
  const walk = (node: any) => {
    if (node?.type === 'text' && node.text === from) {
      node.text = to
      hits++
    }
    for (const child of node?.children ?? []) walk(child)
  }
  walk(content.root)
  if (hits !== 1) {
    console.log(`– bevezető ${id}: a régi szöveg nem található pontosan (${hits} találat), kihagyva`)
    continue
  }
  await save(`bevezető ${id}: dupla mondat javítva`, () =>
    payload.update({ collection: 'articles', id, locale: 'hu', data: { content } as any }),
  )
}

const { docs } = await payload.find({ collection: 'articles', locale: 'hu', fallbackLocale: false as any, depth: 0, limit: 500, pagination: false })
for (const hu of docs as any[]) {
  const en: any = await payload.findByID({ collection: 'articles', id: hu.id, locale: 'en', fallbackLocale: false as any, depth: 0 })
  if (!en.slug) continue // nincs angol változat
  const huImage = idOf(hu.image)
  const enImage = idOf(en.image)
  if (!huImage || huImage === enImage) continue
  await save(`kép ${hu.id}: en ${enImage ?? 'nincs'} → ${huImage} (${en.title?.slice(0, 40)})`, () =>
    payload.update({ collection: 'articles', id: hu.id, locale: 'en', data: { image: huImage } as any }),
  )
}

process.exit(failed ? 1 : 0)
