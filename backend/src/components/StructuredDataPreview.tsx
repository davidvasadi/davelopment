'use client'

// Read-only live preview of a page's JSON-LD structured data.
//
// It does NOT re-implement any generation: it fetches the ACTUAL live frontend
// page (same origin in production) and extracts the <script type="application/
// ld+json"> that the frontend renders from the CMS content. So what you see here
// is exactly what Google sees — always in sync with the dynamic generator
// (frontend/lib/shared/structured-data.ts), never a separate static copy.

import { useCallback, useEffect, useState } from 'react'
import { useDocumentInfo, useLocale, useFormFields } from '@payloadcms/ui'

// Same service slugs the livePreview URL logic uses (collections/Pages.ts).
const SERVICE_SLUGS = ['branding-arculat', 'ux-ui-design-fejlesztes', 'digitalis-rendszerek', 'seo-tartalommarketing']

function buildPath(
  collectionSlug: string | undefined,
  globalSlug: string | undefined,
  slug: string | undefined,
  loc: string,
): string | null {
  const svc = loc === 'hu' ? 'szolgaltatasok' : 'services'
  const prj = loc === 'hu' ? 'projektek' : 'products'
  if (collectionSlug === 'pages') {
    if (!slug) return null
    if (slug === 'homepage') return `/${loc}`
    if (SERVICE_SLUGS.includes(slug)) return `/${loc}/${svc}/${slug}`
    return `/${loc}/${slug}`
  }
  if (collectionSlug === 'products') return slug ? `/${loc}/${prj}/${slug}` : null
  if (collectionSlug === 'articles') return slug ? `/${loc}/blog/${slug}` : null
  if (globalSlug === 'service') return `/${loc}/${svc}`
  if (globalSlug === 'blog-page') return `/${loc}/blog`
  if (globalSlug === 'product-page') return `/${loc}/${prj}`
  return null
}

const CSS = `
  .sdp { border: 1px solid var(--theme-elevation-150); border-radius: 10px; overflow: hidden; margin-top: 6px; }
  .sdp-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 14px; background: var(--theme-elevation-50); border-bottom: 1px solid var(--theme-elevation-150); }
  .sdp-title { font-size: 13px; font-weight: 700; letter-spacing: -0.01em; }
  .sdp-btn { font-size: 12px; font-weight: 600; padding: 6px 12px; border-radius: 6px; border: 1px solid var(--theme-elevation-200); background: var(--theme-elevation-0); color: inherit; cursor: pointer; }
  .sdp-btn:disabled { opacity: 0.5; cursor: default; }
  .sdp-sub { padding: 10px 14px 0; font-size: 11.5px; line-height: 1.5; color: var(--theme-elevation-500); }
  .sdp-links { display: flex; flex-wrap: wrap; gap: 14px; padding: 8px 14px 2px; font-size: 12px; font-weight: 600; }
  .sdp-links a { color: var(--theme-success-500, #2e8b57); text-decoration: none; }
  .sdp-links a:hover { text-decoration: underline; }
  .sdp-error { margin: 10px 14px; padding: 10px 12px; border-radius: 6px; font-size: 12px; background: var(--theme-warning-50, #fff7ed); color: var(--theme-warning-700, #9a3412); border: 1px solid var(--theme-warning-150, #fed7aa); }
  .sdp-pre { margin: 12px 14px 14px; padding: 14px; max-height: 460px; overflow: auto; background: var(--theme-elevation-50); border: 1px solid var(--theme-elevation-150); border-radius: 8px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 11.5px; line-height: 1.5; white-space: pre; }
`

export function StructuredDataPreview() {
  const docInfo = useDocumentInfo() as any
  const locale = useLocale() as any
  const slug = useFormFields(([fields]) => fields?.slug?.value as string | undefined)

  const collectionSlug = docInfo?.collectionSlug as string | undefined
  const globalSlug = docInfo?.globalSlug as string | undefined
  const loc = (locale?.code as string) || 'hu'

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [json, setJson] = useState<string | null>(null)
  const [url, setUrl] = useState<string | null>(null)

  const load = useCallback(async () => {
    const path = buildPath(collectionSlug, globalSlug, slug, loc)
    if (!path) {
      setError('Előbb mentsd el az oldalt (nincs még hozzá URL).')
      setJson(null)
      setUrl(null)
      return
    }
    setLoading(true)
    setError(null)
    try {
      // Same-origin Payload proxy fetches the live frontend page server-side and
      // returns its JSON-LD — no CORS, works in local dev AND production.
      const res = await fetch(`/api/structured-data-preview?path=${encodeURIComponent(path)}`, {
        credentials: 'same-origin',
        cache: 'no-store',
      })
      const data = await res.json().catch(() => null)
      if (!res.ok || !data) throw new Error(data?.error || `HTTP ${res.status}`)
      setUrl(data.url || null)
      const parsed: string[] = (data.blocks || []).map((t: string) => {
        try {
          return JSON.stringify(JSON.parse(t), null, 2)
        } catch {
          return t
        }
      })
      setJson(parsed.length ? parsed.join('\n\n') : null)
      if (data.error) setError(`Nem sikerült betölteni: ${data.error}`)
      else if (!parsed.length) setError('Nem található JSON-LD az élő oldalon.')
    } catch (e: any) {
      setError(`Nem sikerült betölteni: ${e?.message || e}`)
      setJson(null)
    } finally {
      setLoading(false)
    }
  }, [collectionSlug, globalSlug, slug, loc])

  useEffect(() => {
    load()
  }, [load])

  const googleTest = url && url.startsWith('https://') ? `https://search.google.com/test/rich-results?url=${encodeURIComponent(url)}` : null

  return (
    <div className="sdp">
      <style>{CSS}</style>
      <div className="sdp-head">
        <div className="sdp-title">Strukturált adat — élő előnézet</div>
        <button type="button" className="sdp-btn" onClick={load} disabled={loading}>
          {loading ? 'Betöltés…' : '↻ Frissítés'}
        </button>
      </div>
      <div className="sdp-sub">
        Ez pontosan az a JSON-LD, amit a weboldal élőben kitesz erre az oldalra — a tartalomból generálva.
        Csak olvasható: a tartalmat (pl. FAQ, cím, leírás) szerkesztve automatikusan frissül.
      </div>
      {url && (
        <div className="sdp-links">
          <a href={url} target="_blank" rel="noreferrer">
            Élő oldal ↗
          </a>
          {googleTest && (
            <a href={googleTest} target="_blank" rel="noreferrer">
              Google Rich Results teszt ↗
            </a>
          )}
        </div>
      )}
      {error && <div className="sdp-error">{error}</div>}
      {json && <pre className="sdp-pre">{json}</pre>}
    </div>
  )
}
