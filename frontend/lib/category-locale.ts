// A termék-kategóriák a CMS-ben NINCSENEK nyelvesítve: egy projekt kategória-listájában vegyesen vannak magyar és angol
// nevűek (pl. „Időpontfoglaló rendszer” és „Appointment-Based Businesses”). Amíg a CMS-ben nincs rendesen lefordítva,
// itt soroljuk be őket: az angol nevűek csak az angol oldalon, a semlegesek (SEO, Next.js…) mindkettőn, a többi csak
// a magyaron jelenik meg. Új kategóriánál ide is fel kell venni, ha angol vagy semleges.
const EN_ONLY = new Set([117, 124, 125, 126, 127, 141]); // Appointment-Based Businesses, Beauty Salon, Healthcare, Individual Practices, Gift Voucher System, Ranking at the top of Google
const NEUTRAL = new Set([108, 112, 131]); // Next.js, SEO, SaaS platform

export function categoryFitsLocale(cat: { id?: number | string | null } | null | undefined, locale?: string): boolean {
  const id = Number(cat?.id);
  if (!Number.isFinite(id)) return true;
  if (NEUTRAL.has(id)) return true;
  const en = (locale ?? 'hu').toLowerCase().startsWith('en');
  return en ? EN_ONLY.has(id) : !EN_ONLY.has(id);
}

export function localizedCategories<T extends { id?: number | string | null }>(cats: T[] | null | undefined, locale?: string): T[] {
  return (cats ?? []).filter((c) => categoryFitsLocale(c, locale));
}
