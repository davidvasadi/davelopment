/**
 * Migráció generálása — LOKÁLISAN futtatandó séma-változás után.
 * A booking projekt bevált mintáját követi (lásd [davelopment]® Booking
 * scripts/migrate-create.ts): a Payload programozott migration API-ját
 * hívjuk közvetlenül, nem a `payload` CLI-t (tsx ESM/CJS interop miatt).
 *
 * Futtatás:
 *   pnpm migrate:create:safe <nev>
 *   pl. pnpm migrate:create:safe add_stripe_fields
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
  const migrationName = process.argv[2]
  if (!migrationName) {
    console.error('[migrate-create] Hiányzik a migráció neve. Pl.: pnpm migrate:create:safe add_key_points_block')
    process.exit(1)
  }

  const { getPayload } = await import('payload')
  const { default: config } = await import('../src/payload.config')

  console.log('[migrate-create] Payload init…')
  const payload = await getPayload({ config })

  console.log(`[migrate-create] Migráció generálása: "${migrationName}"`)
  await payload.db.createMigration({
    migrationName,
    payload,
    forceAcceptWarning: true,
  })

  console.log('[migrate-create] Kész.')
  process.exit(0)
}

run().catch((err) => {
  console.error('[migrate-create] HIBA:', err)
  process.exit(1)
})
