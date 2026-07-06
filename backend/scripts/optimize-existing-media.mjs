// One-off batch image optimizer for the uploads folder.
// Recompresses png/jpg/webp IN PLACE (same filename + format → no broken references).
// Only overwrites when the result is actually smaller. Videos are ignored.
//
// Usage (run from the backend dir, where sharp is installed):
//   node scripts/optimize-existing-media.mjs --dry                 # report only, write nothing
//   node scripts/optimize-existing-media.mjs --limit=3             # process only the 3 biggest (test)
//   node scripts/optimize-existing-media.mjs --keep-orig           # save <file>.orig before overwrite
//   node scripts/optimize-existing-media.mjs --min=300000          # skip files under 300 KB
//   node scripts/optimize-existing-media.mjs --dir=./uploads       # custom uploads path
//   node scripts/optimize-existing-media.mjs                       # full run
//
// Flags can be combined, e.g.:
//   node scripts/optimize-existing-media.mjs --limit=3 --keep-orig --min=300000

import fs from 'fs'
import path from 'path'

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, '').split('=')
    return [k, v === undefined ? true : v]
  }),
)

const DIR        = args.dir || './uploads'
const DRY        = !!args.dry
const KEEP_ORIG  = !!args['keep-orig']
const MIN_BYTES  = args.min ? parseInt(args.min, 10) : 0
const LIMIT      = args.limit ? parseInt(args.limit, 10) : Infinity
const MAX_WIDTH  = 1920

const sharp = (await import('sharp')).default

const IMG_RE = /\.(png|jpe?g|webp)$/i

function walk(dir) {
  const out = []
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name)
    const st = fs.statSync(full)
    if (st.isDirectory()) out.push(...walk(full))
    else if (IMG_RE.test(name)) out.push({ full, size: st.size })
  }
  return out
}

function fmt(b) { return (b / 1024).toFixed(0) + ' KB' }

async function encode(input, ext) {
  let p = sharp(input, { failOn: 'none' }).rotate().resize({ width: MAX_WIDTH, withoutEnlargement: true })
  if (/jpe?g/i.test(ext))      p = p.jpeg({ quality: 82, progressive: true, mozjpeg: true })
  else if (/png/i.test(ext))   p = p.png({ compressionLevel: 9, quality: 85, palette: true, effort: 10 })
  else if (/webp/i.test(ext))  p = p.webp({ quality: 82 })
  return p.toBuffer()
}

if (!fs.existsSync(DIR)) { console.error(`❌ Nincs ilyen mappa: ${DIR}`); process.exit(1) }

let files = walk(DIR).filter((f) => f.size >= MIN_BYTES).sort((a, b) => b.size - a.size)
if (Number.isFinite(LIMIT)) files = files.slice(0, LIMIT)

console.log(`\n📂 ${DIR}`)
console.log(`🖼️  ${files.length} kép feldolgozásra${DRY ? '  (DRY RUN — nem írok semmit)' : ''}${MIN_BYTES ? `  (min ${fmt(MIN_BYTES)})` : ''}\n`)

let before = 0, after = 0, changed = 0, skipped = 0, failed = 0

for (const { full, size } of files) {
  const ext = path.extname(full).slice(1)
  before += size
  try {
    const buf = await encode(full, ext)
    if (buf.length < size) {
      const saved = size - buf.length
      console.log(`  ✅ ${path.basename(full).padEnd(52)} ${fmt(size)} → ${fmt(buf.length)}  (-${fmt(saved)})`)
      if (!DRY) {
        if (KEEP_ORIG && !fs.existsSync(full + '.orig')) fs.copyFileSync(full, full + '.orig')
        fs.writeFileSync(full, buf)
      }
      after += buf.length; changed++
    } else {
      console.log(`  ⏭️  ${path.basename(full).padEnd(52)} ${fmt(size)}  (már optimális)`)
      after += size; skipped++
    }
  } catch (err) {
    console.log(`  ⚠️  ${path.basename(full).padEnd(52)} HIBA: ${err.message}`)
    after += size; failed++
  }
}

console.log(`\n──────── ÖSSZEGZÉS ────────`)
console.log(`Feldolgozva : ${files.length}`)
console.log(`Optimalizált: ${changed}   Kihagyva: ${skipped}   Hiba: ${failed}`)
console.log(`Méret       : ${fmt(before)} → ${fmt(after)}   (megtakarítás: ${fmt(before - after)})`)
if (DRY) console.log(`\nℹ️  DRY RUN volt — semmit nem írtam felül. Éles futtatáshoz vedd le a --dry kapcsolót.`)
console.log('')
