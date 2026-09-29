// Szinkron (nem useEffect-alapú) útvonal-detektálás: igaz, ha az aktuális
// path egy szolgáltatás-aloldal (/{locale}/szolgaltatasok|services/{slug}),
// ahol a service-hero blokk lakik. Direkt a pathname-ből számoljuk (nem
// kontextusból/effektből), hogy az első kirajzoláskor azonnal helyes legyen —
// különben a navbar egy pillanatra a "normál" stílusban villanna fel, majd
// csak react effect után váltana sötétre (ez volt a "későn jön be" hiba oka).
const SERVICE_SEGMENTS = ['szolgaltatasok', 'services'];

export function isServiceHeroPath(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  const parts = pathname.split('/').filter(Boolean);
  // [locale, segment, slug, ...] — a slug megléte különbözteti meg a
  // szolgáltatások lista-oldaltól (aminek nincs service-hero blokkja).
  if (parts.length < 3) return false;
  return SERVICE_SEGMENTS.includes(parts[1]);
}
