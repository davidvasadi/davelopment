import { execFile } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'
import type { CollectionAfterChangeHook, CollectionBeforeChangeHook, PayloadRequest } from 'payload'

const execFileAsync = promisify(execFile)

const MEDIA_DIR = path.resolve(process.cwd(), 'media')

// Minden locale kódját visszaadja a Payload configból
function getLocaleCodes(payload: any): string[] {
  const locs = payload?.config?.localization?.locales ?? []
  return locs.map((l: any) => (typeof l === 'string' ? l : l.code))
}

// Alt értéket minden locale-ra elkészíti (locale: 'all' update-hez)
function altForAllLocales(
  value: string,
  localeCodes: string[],
): string | Record<string, string> {
  if (localeCodes.length === 0) return value
  return Object.fromEntries(localeCodes.map(code => [code, value]))
}

// ── Filename sanitization ─────────────────────────────────────────────────────

function sanitizeFilename(filename: string): string {
  const ext  = path.extname(filename).toLowerCase()
  const base = path.basename(filename, path.extname(filename))
  const clean = base
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')   // ékezetek
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')       // minden egyéb → kötőjel
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  return (clean || 'file') + ext
}

function uniqueFilename(dir: string, filename: string): string {
  if (!fs.existsSync(path.join(dir, filename))) return filename
  const ext  = path.extname(filename)
  const base = path.basename(filename, ext)
  let i = 1
  while (fs.existsSync(path.join(dir, `${base}-${i}${ext}`))) i++
  return `${base}-${i}${ext}`
}

// ── Before change — alt auto-fill + filesize_human + quality_status ───────────

export const mediaBeforeChange: CollectionBeforeChangeHook = ({ data, operation }) => {
  // Alt auto-fill fájlnévből (csak ha üres)
  if (!data.alt && data.filename) {
    data.alt = data.filename
      .replace(/\.[^.]+$/, '')
      .replace(/[-_]/g, ' ')
      .trim()
      .replace(/^./, (c: string) => c.toUpperCase())
  }

  // Olvasható méret
  const bytes: number = data.filesize ?? 0
  if (bytes === 0)                    data.filesize_human = '—'
  else if (bytes < 1024)              data.filesize_human = `${bytes} B`
  else if (bytes < 1024 * 1024)       data.filesize_human = `${(bytes / 1024).toFixed(1)} KB`
  else                                data.filesize_human = `${(bytes / (1024 * 1024)).toFixed(1)} MB`

  // Google / PageSpeed minőség státusz
  const issues: string[] = []
  if (!data.alt) issues.push('⚠ Alt tag hiányzik')
  if (data.mimeType?.startsWith('image/')) {
    if (bytes > 300 * 1024)       issues.push('✗ Kép > 300KB — Google PageSpeed hiba')
    else if (bytes > 100 * 1024)  issues.push('⚠ Kép > 100KB — Google flageli')
  } else if (data.mimeType?.startsWith('video/')) {
    if (bytes > 10 * 1024 * 1024) issues.push('✗ Videó > 10MB — komoly oldalsebességi probléma')
    else if (bytes > 5 * 1024 * 1024) issues.push('⚠ Videó > 5MB — lassítja az oldalt')
  }
  data.quality_status = issues.length === 0 ? '✓ OK' : issues.join('  |  ')

  return data
}

// ── After change — fájlnév sanitizálás + tömörítés ───────────────────────────

async function ffmpegAvailable(): Promise<boolean> {
  try { await execFileAsync('ffmpeg', ['-version']); return true }
  catch { return false }
}

async function extractVideoPoster(videoPath: string, logger: any): Promise<string | null> {
  const base       = path.basename(videoPath, path.extname(videoPath))
  const posterName = `${base}-poster.jpg`
  const posterPath = path.join(MEDIA_DIR, posterName)

  try {
    // 1 másodpercnél lévő frame, ha a videó rövidebb akkor az első frame
    await execFileAsync('ffmpeg', [
      '-ss', '1',
      '-i', videoPath,
      '-vframes', '1',
      '-q:v', '3',       // JPEG minőség (1=legjobb, 31=legrosszabb)
      '-y', posterPath,
    ])
    if (fs.existsSync(posterPath)) {
      logger.info(`[optimizeMedia] poster generálva: ${posterName}`)
      return posterName
    }
  } catch {
    // Ha 1mp nem sikerül, próbáljuk az első frame-et
    try {
      await execFileAsync('ffmpeg', [
        '-i', videoPath,
        '-vframes', '1',
        '-q:v', '3',
        '-y', posterPath,
      ])
      if (fs.existsSync(posterPath)) {
        logger.info(`[optimizeMedia] poster generálva (első frame): ${posterName}`)
        return posterName
      }
    } catch (err) {
      logger.warn(`[optimizeMedia] poster generálás sikertelen: ${err}`)
    }
  }
  return null
}

async function optimizeVideo(filePath: string, logger: any): Promise<number | null> {
  const tmpPath = filePath + '.__opt.mp4'
  try {
    await execFileAsync('ffmpeg', [
      '-i', filePath,
      '-c:v', 'libx264', '-crf', '28', '-preset', 'medium',
      '-an',
      '-movflags', '+faststart',
      '-vf', "scale=w='min(1920,iw)':h=-2",
      '-y', tmpPath,
    ])
    const { size } = fs.statSync(tmpPath)
    fs.renameSync(tmpPath, filePath)
    return size
  } catch (err) {
    logger.error(`[optimizeMedia] ffmpeg hiba: ${err}`)
    if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath)
    return null
  }
}

async function optimizeImage(filePath: string, mimeType: string, logger: any): Promise<number | null> {
  let sharp: any
  try { sharp = (await import('sharp')).default }
  catch { return null }

  const tmpPath = filePath + '.__opt'
  try {
    let pipeline = sharp(filePath).resize({ width: 1920, withoutEnlargement: true })
    if (mimeType === 'image/jpeg' || mimeType === 'image/jpg')
      pipeline = pipeline.jpeg({ quality: 80, progressive: true, mozjpeg: true })
    else if (mimeType === 'image/png')
      pipeline = pipeline.png({ compressionLevel: 9, quality: 80 })
    else if (mimeType === 'image/webp')
      pipeline = pipeline.webp({ quality: 80 })
    else return null

    await pipeline.toFile(tmpPath)
    const { size } = fs.statSync(tmpPath)
    const original  = fs.statSync(filePath).size

    if (size < original) { fs.renameSync(tmpPath, filePath); return size }
    else                 { fs.unlinkSync(tmpPath);           return original }
  } catch (err) {
    logger.error(`[optimizeMedia] sharp hiba: ${err}`)
    if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath)
    return null
  }
}

// ── Bulk optimization (meglévő fájlokhoz) ────────────────────────────────────

export async function optimizeExistingMedia(doc: any, payload: any): Promise<void> {
  const mimeType = doc.mimeType as string | undefined
  const filename  = doc.filename  as string | undefined
  if (!mimeType || !filename) return

  const filePath = path.join(MEDIA_DIR, filename)
  if (!fs.existsSync(filePath)) return

  const logger       = payload.logger
  const originalSize = doc.filesize as number

  // Fájlnév sanitizálás
  const sanitized = sanitizeFilename(filename)
  let currentPath     = filePath
  let currentFilename = filename

  if (sanitized !== filename) {
    const newFilename = uniqueFilename(MEDIA_DIR, sanitized)
    const newPath     = path.join(MEDIA_DIR, newFilename)
    fs.renameSync(filePath, newPath)
    currentPath     = newPath
    currentFilename = newFilename
    logger.info(`[optimizeMedia] átnevezve: "${filename}" → "${newFilename}"`)
  }

  // Tömörítés
  let newSize: number | null = null
  let posterFilename: string | null = null

  if (mimeType.startsWith('video/')) {
    if (await ffmpegAvailable()) {
      newSize        = await optimizeVideo(currentPath, logger)
      posterFilename = await extractVideoPoster(currentPath, logger)
    }
  } else if (mimeType.startsWith('image/')) {
    newSize = await optimizeImage(currentPath, mimeType, logger)
  }

  const finalSize  = newSize ?? originalSize
  const finalBytes = finalSize

  if (newSize !== null && originalSize > 0) {
    const pct = ((originalSize - newSize) / originalSize * 100).toFixed(1)
    logger.info(`[optimizeMedia] ✓ ${currentFilename}: ${(originalSize/1024).toFixed(0)}KB → ${(newSize/1024).toFixed(0)}KB (−${pct}%)`)
  }

  let filesizeHuman: string
  if (finalBytes < 1024)             filesizeHuman = `${finalBytes} B`
  else if (finalBytes < 1024*1024)   filesizeHuman = `${(finalBytes/1024).toFixed(1)} KB`
  else                               filesizeHuman = `${(finalBytes/(1024*1024)).toFixed(1)} MB`

  // Alt auto-fill a (sanitizált) fájlnévből, ha üres — minden locale-ra
  const localeCodes = getLocaleCodes(payload)
  const existingAlt = doc.alt || undefined
  const altRaw = existingAlt ?? (
    currentFilename
      .replace(/\.[^.]+$/, '')
      .replace(/[-_]/g, ' ')
      .trim()
      .replace(/^./, (c: string) => c.toUpperCase())
  )
  const altValue = altForAllLocales(altRaw, localeCodes)

  const issues: string[] = []
  if (mimeType.startsWith('image/')) {
    if (finalBytes > 300*1024)      issues.push('✗ Kép > 300KB — Google PageSpeed hiba')
    else if (finalBytes > 100*1024) issues.push('⚠ Kép > 100KB — Google flageli')
  } else if (mimeType.startsWith('video/')) {
    if (finalBytes > 10*1024*1024)      issues.push('✗ Videó > 10MB')
    else if (finalBytes > 5*1024*1024)  issues.push('⚠ Videó > 5MB')
  }
  const qualityStatus = issues.length === 0 ? '✓ OK' : issues.join('  |  ')

  const updateData: Record<string, any> = {
    filename:       currentFilename,
    url:            `/api/media/file/${encodeURIComponent(currentFilename)}`,
    filesize:       finalSize,
    filesize_human: filesizeHuman,
    quality_status: qualityStatus,
    alt:            altValue,
  }
  if (posterFilename) {
    updateData.poster_url = `/api/media/file/${encodeURIComponent(posterFilename)}`
  }

  await payload.update({
    collection: 'media',
    id: doc.id,
    ...(localeCodes.length > 0 ? { locale: 'all' as any } : {}),
    data: updateData,
    overrideAccess: true,
  })
}

export const optimizeMediaHook: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  if (operation !== 'create') return doc

  const mimeType = doc.mimeType as string | undefined
  const filename  = doc.filename  as string | undefined
  if (!mimeType || !filename) return doc

  const logger       = req.payload.logger
  const originalPath = path.join(MEDIA_DIR, filename)
  if (!fs.existsSync(originalPath)) return doc

  ;(async () => {
    // 1. Fájlnév sanitizálás
    const sanitized = sanitizeFilename(filename)
    let currentPath = originalPath
    let currentFilename = filename

    if (sanitized !== filename) {
      const newFilename = uniqueFilename(MEDIA_DIR, sanitized)
      const newPath     = path.join(MEDIA_DIR, newFilename)
      fs.renameSync(originalPath, newPath)
      currentPath     = newPath
      currentFilename = newFilename
      logger.info(`[optimizeMedia] átnevezve: "${filename}" → "${newFilename}"`)
    }

    // 2. Tömörítés + poster generálás videóknál
    let newSize: number | null = null
    let posterFilename: string | null = null
    const originalSize = doc.filesize as number

    if (mimeType.startsWith('video/')) {
      if (await ffmpegAvailable()) {
        newSize = await optimizeVideo(currentPath, logger)
        posterFilename = await extractVideoPoster(currentPath, logger)
      } else {
        logger.warn('[optimizeMedia] ffmpeg nincs telepítve')
      }
    } else if (mimeType.startsWith('image/')) {
      newSize = await optimizeImage(currentPath, mimeType, logger)
    }

    if (newSize !== null) {
      const pct = ((originalSize - newSize) / originalSize * 100).toFixed(1)
      logger.info(`[optimizeMedia] ✓ ${currentFilename}: ${(originalSize/1024).toFixed(0)}KB → ${(newSize/1024).toFixed(0)}KB (−${pct}%)`)
    }

    // 3. DB frissítés (url + filename + filesize + human + status + alt minden locale-ra)
    const finalSize  = newSize ?? originalSize
    const finalBytes = finalSize
    let filesizeHuman: string
    if (finalBytes < 1024)              filesizeHuman = `${finalBytes} B`
    else if (finalBytes < 1024 * 1024)  filesizeHuman = `${(finalBytes / 1024).toFixed(1)} KB`
    else                                filesizeHuman = `${(finalBytes / (1024 * 1024)).toFixed(1)} MB`

    // Alt auto-fill a (sanitizált) fájlnévből, minden locale-ra
    const altRaw = currentFilename
      .replace(/\.[^.]+$/, '')
      .replace(/[-_]/g, ' ')
      .trim()
      .replace(/^./, (c: string) => c.toUpperCase())
    const localeCodes = getLocaleCodes(req.payload)
    const altValue    = altForAllLocales(altRaw, localeCodes)

    const issues: string[] = []
    if (mimeType.startsWith('image/')) {
      if (finalBytes > 300 * 1024)       issues.push('✗ Kép > 300KB — Google PageSpeed hiba')
      else if (finalBytes > 100 * 1024)  issues.push('⚠ Kép > 100KB — Google flageli')
    } else if (mimeType.startsWith('video/')) {
      if (finalBytes > 10 * 1024 * 1024) issues.push('✗ Videó > 10MB — komoly oldalsebességi probléma')
      else if (finalBytes > 5 * 1024 * 1024) issues.push('⚠ Videó > 5MB — lassítja az oldalt')
    }
    const qualityStatus = issues.length === 0 ? '✓ OK' : issues.join('  |  ')

    const updateData: Record<string, any> = {
      filename:       currentFilename,
      url:            `/api/media/file/${encodeURIComponent(currentFilename)}`,
      filesize:       finalSize,
      filesize_human: filesizeHuman,
      quality_status: qualityStatus,
      alt:            altValue,
    }
    if (posterFilename) {
      updateData.poster_url = `/api/media/file/${encodeURIComponent(posterFilename)}`
    }

    try {
      await req.payload.update({
        collection: 'media',
        id: doc.id,
        ...(localeCodes.length > 0 ? { locale: 'all' as any } : {}),
        data: updateData as any,
        overrideAccess: true,
      })
    } catch (err) {
      logger.warn(`[optimizeMedia] DB frissítés hiba: ${err}`)
    }
  })().catch((err) => logger.error(`[optimizeMedia] váratlan hiba: ${err}`))

  return doc
}
