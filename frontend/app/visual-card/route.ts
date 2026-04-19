import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

export const dynamic = 'force-dynamic'

// Square crop from top-center — equivalent to object-fit:cover; object-position:top
async function toBase64TopCrop(filePath: string): Promise<string | null> {
  try {
    const abs = path.join(process.cwd(), 'public', filePath)
    if (!fs.existsSync(abs)) return null
    const meta = await sharp(abs).metadata()
    if (!meta.width || !meta.height) return null

    const size = Math.min(meta.width, meta.height)
    const left = Math.floor((meta.width - size) / 2)

    const buf = await sharp(abs)
      .extract({ left, top: 0, width: size, height: size })
      .resize(400, 400)
      .jpeg({ quality: 85 })
      .toBuffer()

    return buf.toString('base64')
  } catch {
    return null
  }
}

// vCard spec: lines max 75 chars, continuation lines start with a single space
function foldLine(line: string): string {
  if (line.length <= 75) return line
  const chunks: string[] = [line.slice(0, 75)]
  let i = 75
  while (i < line.length) {
    chunks.push(line.slice(i, i + 74))
    i += 74
  }
  return chunks.join('\r\n ')
}

export async function GET() {
  const photoB64 = await toBase64TopCrop('dave.jpg')

  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'FN:Dávid Vasadi — [davelopment]®',
    'N:Vasadi;Dávid;;;',
    'ORG:[davelopment]®',
    'TITLE:Alapító',
    'EMAIL;TYPE=INTERNET:hello@davelopment.hu',
    'TEL;TYPE=CELL:+36303628377',
    'URL:https://davelopment.hu',
    'NOTE:Web · Márka · Stratégia',
  ]

  if (photoB64) lines.push(foldLine(`PHOTO;ENCODING=b;TYPE=JPEG:${photoB64}`))

  lines.push('END:VCARD')

  return new Response(lines.join('\r\n'), {
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      'Content-Disposition': 'inline; filename="davelopment.vcf"',
    },
  })
}
