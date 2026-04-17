import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

function toBase64(filePath: string): string | null {
  try {
    const abs = path.join(process.cwd(), 'public', filePath)
    const buf = fs.readFileSync(abs)
    return buf.toString('base64')
  } catch {
    return null
  }
}

export function GET() {
  const photoB64 = toBase64('dave.jpg')
  const logoB64 = toBase64('logo.png') ?? toBase64('logo.jpg') ?? toBase64('logo.webp')

  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'FN:Vasadi Dávid',
    'N:Vasadi;Dávid;;;',
    'ORG:[davelopment]®',
    'TITLE:Alapító',
    'EMAIL;TYPE=INTERNET:hello@davelopment.hu',
    'TEL;TYPE=CELL:+36303628377',
    'URL:https://davelopment.hu',
    'NOTE:Web · Márka · Stratégia',
  ]

  if (photoB64) lines.push(`PHOTO;ENCODING=b;TYPE=JPEG:${photoB64}`)
  if (logoB64)  lines.push(`LOGO;ENCODING=b;TYPE=JPEG:${logoB64}`)

  lines.push('END:VCARD')

  return new Response(lines.join('\r\n'), {
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      'Content-Disposition': 'attachment; filename="vasadi-david.vcf"',
    },
  })
}
