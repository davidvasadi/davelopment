export const localeSegments: Record<string, Record<string, string>> = {
  hu: {
    products: 'projektek',
    services: 'szolgaltatasok',
  },
  en: {
    products: 'products',
    services: 'services',
  },
}

export function getLocalizedSegment(locale: string, internal: string): string {
  return localeSegments[locale]?.[internal] ?? internal
}

export function getInternalSegment(locale: string, localized: string): string {
  const map = localeSegments[locale] ?? {}
  return Object.entries(map).find(([, v]) => v === localized)?.[0] ?? localized
}