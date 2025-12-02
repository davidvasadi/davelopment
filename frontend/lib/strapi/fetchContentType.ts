// lib/strapi/fetchContentType.ts
import { draftMode } from 'next/headers';
import qs from 'qs';

const API_BASE = (process.env.NEXT_PUBLIC_STRAPI_URL ?? 'http://localhost:1337').replace(
  /\/+$/,
  ''
);

type AnyRecord = Record<string, any>;

interface StrapiItem {
  id: number;
  attributes?: AnyRecord;
  [k: string]: any;
}

interface StrapiResponse {
  data: StrapiItem | StrapiItem[] | null;
  meta?: AnyRecord;
}

/** Segéd: media/reláció laposítás */
function unwrapRelation(value: any) {
  if (!value) return value;

  // Single media / single relation
  if (value?.data && !Array.isArray(value.data)) {
    const d = value.data;
    return d?.attributes ? { id: d.id, ...d.attributes } : d;
  }

  // Multiple media / multiple relation
  if (Array.isArray(value?.data)) {
    return value.data.map((d: any) => (d?.attributes ? { id: d.id, ...d.attributes } : d));
  }

  return value;
}

/** Egy Strapi bejegyzés laposítása (attributes → top-level) + gyakori relációk kinyitása */
function flattenEntry(entry: any) {
  if (!entry) return null;

  const src = entry.attributes ?? entry;
  const out: AnyRecord = { id: entry.id, ...src };

  // localizations: { data: [...] } → [...]
  if (out.localizations?.data) {
    out.localizations = out.localizations.data.map((l: any) =>
      l?.attributes ? { id: l.id, ...l.attributes } : l
    );
  }

  // seo.metaImage: { data: {...} } → {...}
  if (out.seo?.metaImage) {
    out.seo.metaImage = unwrapRelation(out.seo.metaImage);
  }

  return out;
}

export function spreadStrapiData(data: StrapiResponse): StrapiItem | null {
  if (!data?.data) return null;
  return Array.isArray(data.data) ? data.data[0] ?? null : data.data;
}

/**
 * Strapi fetch – objektumos populate támogatással, hibadobással, laposítással.
 *
 * @param contentType - API content type (pl. 'pages')
 * @param params - Strapi query params (filters, populate, fields, sort, stb.)
 * @param spreadData - ha true: EGY (laposított) rekordot ad vissza; ha false: nyers JSON
 */
export default async function fetchContentType(
  contentType: string,
  params: AnyRecord = {},
  spreadData?: boolean
): Promise<any> {
  const { isEnabled: isDraftMode } = await draftMode();

  // publicationState: preview (draft mód), live (alap)
  const queryObj: AnyRecord = {
    publicationState: isDraftMode ? 'preview' : 'live',
    ...params,
  };

  const query = qs.stringify(queryObj, { encodeValuesOnly: true });

  const url = `${API_BASE}/api/${contentType}${query ? `?${query}` : ''}`;

  const res = await fetch(url, {
    method: 'GET',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...(process.env.STRAPI_API_TOKEN
        ? { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` }
        : {}),
      // maradhat, ha használod Strapi Clouddal
      'strapi-encode-source-maps': isDraftMode ? 'true' : 'false',
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Failed to fetch data from Strapi (url=${url}, status=${res.status})\n${body}`);
  }

  const json: StrapiResponse = await res.json();

  if (!spreadData) return json; // visszaadjuk a nyers Strapi formátumot

  // Korábbi viselkedés: egy tétel (most laposítva)
  const item = spreadStrapiData(json);
  return flattenEntry(item);
}
