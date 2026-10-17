/**
 * Migrációk futtatása — a DEPLOY futtatja, a kézi SSH+psql lépés helyett.
 *
 * A booking projekt bevált mintáját követi (lásd [davelopment]® Booking
 * scripts/migrate.ts). Non-interaktív, idempotens: a payload_migrations-ben
 * még NEM szereplő commitolt migrációkat futtatja le, sorrendben.
 *
 * A "dev" sentinel sor (batch=-1) a hónapokig tartó `push: true` dev-szinkron
 * korából maradt, és a Payload saját migrate()-je emiatt interaktívan
 * kérdezne rá ("data loss will occur, proceed?"), ami a deploy-on
 * végtelenül lógna — ezért törli defenzíven minden futtatás előtt, mielőtt
 * a tényleges (névvel azonosított, jóváhagyott) migrációk futnának.
 *
 * Futtatás (a szerveren, Node 22 + tsx):
 *   npx tsx scripts/migrate.ts
 */
import fs from 'fs'
import path from 'path'

const envPath = path.join(process.cwd(), '.env')
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2]
  }
}

const run = async () => {
  const { getPayload } = await import('payload')
  const { sql } = await import('@payloadcms/db-postgres')
  const { default: config } = await import('../src/payload.config')

  console.log('[migrate] Payload init…')
  const payload = await getPayload({ config })

  const removed = await payload.db.drizzle.execute(
    sql`DELETE FROM payload_migrations WHERE batch = -1`,
  )
  if (removed?.rowCount) console.log(`[migrate] dev-push sentinel sor törölve (${removed.rowCount}).`)

  console.log('[migrate] Migrációk futtatása…')
  await payload.db.migrate()
  console.log('[migrate] Kész. A séma naprakész.')

  process.exit(0)
}

run().catch((err) => {
  console.error('[migrate] HIBA:', err)
  process.exit(1)
})
