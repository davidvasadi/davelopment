// A pricing kártyáról a Kapcsolat oldalra mutató linkben (?csomag=...) a csomag nevét
// URL-barát, ékezet és nagybetű nélküli azonosítóként adjuk át (pl. "novekedes"),
// különben a böngésző/megosztott link "Növekedés" helyett "N%C3%B6veked%C3%A9s"-t mutatna.
const PLAN_NAME_BY_SLUG: Record<string, string> = {
  // 2026-11 új csomagok
  'uzleti-weboldal': 'Üzleti weboldal',
  'weboldal-marketing': 'Weboldal + marketing',
  'egyedi-fejlesztes': 'Egyedi fejlesztés',
  tamogatas: 'Támogatás',
  'business-website': 'Business website',
  'website-marketing': 'Website + marketing',
  'custom-build': 'Custom build',
  'care-plans': 'Care plans',
  // régi csomagnevek (régi linkek miatt)
  mikro: 'Mikró',
  rajt: 'Rajt',
  novekedes: 'Növekedés',
  webshop: 'Webshop',
  partner: 'Partner',
  launch: 'Launch',
  growth: 'Growth',
  micro: 'Micro',
};

export function slugifyPlanName(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function planNameFromSlug(slug: string): string {
  return PLAN_NAME_BY_SLUG[slug] ?? slug;
}
