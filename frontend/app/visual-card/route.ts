import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

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
  let photoB64: string | null = null
  try {
    const abs = path.join(process.cwd(), 'public', 'dave.jpg')
    if (fs.existsSync(abs)) {
      photoB64 = fs.readFileSync(abs).toString('base64')
    }
  } catch {
    photoB64 = null
  }

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
