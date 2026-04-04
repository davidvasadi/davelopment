import { NextRequest, NextResponse } from 'next/server'

function get(html: string, pattern: RegExp): string | null {
  return pattern.exec(html)?.[1]?.trim() || null
}

function getAll(html: string, pattern: RegExp): string[][] {
  const results: string[][] = []
  let m
  const g = new RegExp(pattern.source, 'gi')
  while ((m = g.exec(html)) !== null) results.push(m.slice(1))
  return results
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')
  if (!url) return NextResponse.json({ error: 'Missing url' }, { status: 400 })

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'SEO-Analyzer/1.0 (Davelopment Admin)' },
      signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) return NextResponse.json({ error: `HTTP ${res.status}` }, { status: 400 })
    const html = await res.text()

    const title = get(html, /<title[^>]*>([^<]+)<\/title>/i)
    const description =
      get(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) ||
      get(html, /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i)
    const canonical =
      get(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i) ||
      get(html, /<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i)
    const robots = get(html, /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/i)
    const ogTitle = get(html, /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i)
    const ogDescription = get(html, /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i)
    const ogImage = get(html, /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)

    const hreflangRaw = getAll(html, /<link[^>]+rel=["']alternate["'][^>]+hreflang=["']([^"']+)["'][^>]+href=["']([^"']+)["']/i)
    const hreflang = hreflangRaw.map(([lang, href]) => ({ lang, href }))

    const h1Raw = getAll(html, /<h1[^>]*>([^<]+)<\/h1>/i)
    const h1 = h1Raw.map(m => m[0])

    const jsonLdRaw = getAll(html, /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i)
    const structuredData = jsonLdRaw.flatMap(m => { try { return [JSON.parse(m[0])] } catch { return [] } })

    const issues: string[] = []
    if (!title) issues.push('Hiányzó <title>')
    else if (title.length < 30) issues.push(`Title túl rövid (${title.length} kar.)`)
    else if (title.length > 60) issues.push(`Title túl hosszú (${title.length} kar.)`)
    if (!description) issues.push('Hiányzó meta description')
    else if (description.length < 70) issues.push(`Description rövid (${description.length} kar.)`)
    else if (description.length > 160) issues.push(`Description hosszú (${description.length} kar.)`)
    if (!canonical) issues.push('Hiányzó canonical URL')
    if (hreflang.length === 0) issues.push('Nincs hreflang')
    if (h1.length === 0) issues.push('Nincs H1 cím')
    if (h1.length > 1) issues.push(`Több H1 (${h1.length} db)`)
    if (!ogTitle) issues.push('Hiányzó og:title')
    if (!ogImage) issues.push('Hiányzó og:image')
    if (structuredData.length === 0) issues.push('Nincs JSON-LD structured data')
    if (robots?.includes('noindex')) issues.push('⚠ noindex aktív!')

    const score = Math.max(0, Math.round(((10 - issues.length) / 10) * 100))

    return NextResponse.json({
      ok: true,
      url,
      title,
      description,
      canonical,
      robots,
      ogTitle,
      ogDescription,
      ogImage,
      hreflang,
      h1,
      structuredData,
      issues,
      score,
    })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}
