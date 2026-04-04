// lib/strapi/fetchContentType.ts  — Payload CMS REST API wrapper
// Keeps the same call signature as the old Strapi version for drop-in compatibility.
import { draftMode } from 'next/headers';

const API_BASE = (process.env.NEXT_PUBLIC_PAYLOAD_URL ?? 'http://localhost:1337').replace(/\/+$/, '');

// These content-types live under /api/globals/{slug} in Payload
const GLOBALS = new Set(['global', 'service', 'blog-page', 'product-page']);

// All supported locales
const ALL_LOCALES = ['hu', 'en'];

type AnyRecord = Record<string, any>;

function buildHeaders(): HeadersInit {
  return { 'Content-Type': 'application/json' };
}

function strapiSortToPayload(sort: string | string[]): string {
  const s = Array.isArray(sort) ? sort[0] : sort;
  if (s.includes(':desc')) return `-${s.split(':')[0]}`;
  if (s.includes(':asc')) return s.split(':')[0];
  return s;
}

export default async function fetchContentType(
  contentType: string,
  params: AnyRecord = {},
  spreadData?: boolean
): Promise<any> {
  const { isEnabled: isDraftMode } = await draftMode();
  const { filters = {}, sort, ...restParams } = params;

  // locale may live in filters OR at the top level
  const locale = (filters.locale ?? restParams.locale) as string | undefined;
  const slug = filters.slug as string | undefined;
  const remainingFilters = Object.fromEntries(
    Object.entries(filters).filter(([k]) => k !== 'locale' && k !== 'slug')
  );

  const isGlobal = GLOBALS.has(contentType);
  const q = new URLSearchParams();

  if (locale) q.set('locale', locale);
  if (isDraftMode) q.set('draft', 'true');
  q.set('depth', '2');

  if (!isGlobal) {
    if (slug) q.set('where[slug][equals]', slug);
    for (const [k, v] of Object.entries(remainingFilters)) {
      if (v != null) q.set(`where[${k}][equals]`, String(v));
    }
    if (sort) q.set('sort', strapiSortToPayload(sort));
    q.set('limit', '100');
  }

  const endpoint = isGlobal
    ? `${API_BASE}/api/globals/${contentType}`
    : `${API_BASE}/api/${contentType}`;

  const url = `${endpoint}?${q.toString()}`;
  const headers = buildHeaders();
  const fetchOpts: RequestInit = {
    method: 'GET',
    next: { revalidate: isDraftMode ? 0 : 60 },
    headers,
  };

  const res = await fetch(url, fetchOpts);
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Payload fetch failed (${url}, ${res.status})\n${body}`);
  }

  const json = await res.json();

  if (!spreadData) {
    if (isGlobal) return { data: [json] };
    return { data: json.docs ?? [] };
  }

  // spreadData=true → return single flat document
  const doc: AnyRecord | null = isGlobal ? json : (json.docs?.[0] ?? null);
  if (!doc) return null;

  // Synthesize `localizations` for the language switcher
  // Only needed for collections (globals are language-independent singletons here)
  if (!isGlobal && locale && doc.slug) {
    const otherLocales = ALL_LOCALES.filter((l) => l !== locale);
    const localizations = (
      await Promise.all(
        otherLocales.map(async (otherLocale) => {
          try {
            const aq = new URLSearchParams({
              'where[slug][equals]': String(doc.slug),
              locale: otherLocale,
              depth: '0',
              limit: '1',
            });
            const r = await fetch(`${API_BASE}/api/${contentType}?${aq}`, {
              ...fetchOpts,
              next: { revalidate: isDraftMode ? 0 : 300 },
            });
            if (!r.ok) return null;
            const d = await r.json();
            const alt = d.docs?.[0];
            return alt ? { locale: otherLocale, slug: alt.slug, id: alt.id } : null;
          } catch {
            return null;
          }
        })
      )
    ).filter(Boolean);

    doc.localizations = localizations;
  }

  return doc;
}
