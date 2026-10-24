// lib/shared/structured-data.ts
//
// Connected JSON-LD @graph builder. Every node is derived from Payload CMS data
// at request time (the marketing pages are `force-dynamic`), so the output stays
// fresh automatically whenever content changes — no hand-pasted JSON.
//
// Entities are linked via stable @id anchors so Google can resolve the
// relationships: Organization ↔ WebSite ↔ WebPage ↔ (Service|Product|Article) ↔
// FAQPage ↔ BreadcrumbList. FAQ questions are read straight from the page's
// `dynamic_zone` `faq` block (see extractFaqs).
//
// Single entry point: renderPageJsonLd(...) → JSON string for <JsonLd data=... />.

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://davelopment.hu').replace(/\/+$/, '');
const ORG_NAME = '[davelopment]©';

// Stable @id anchors for the site-wide singletons (never change these strings).
const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const LOGO_ID = `${SITE_URL}/#logo`;

// Public business contact — already shown on the site, safe to expose in schema.
const CONTACT_EMAIL = 'hello@davelopment.hu';
const CONTACT_PHONE = '+36303628377';

// Registered sole-trader (egyéni vállalkozó) data — already public on
// /adatkezeles (legally required impresszum data), so safe to mirror here.
// Lets this double as LocalBusiness/ProfessionalService schema, not just Organization.
const LEGAL_NAME = 'Vasadi Dávid';
const BUSINESS_ADDRESS = {
  streetAddress: 'Szent István utca 19/C.',
  addressLocality: 'Csomád',
  addressRegion: 'Pest',
  postalCode: '2161',
  addressCountry: 'HU',
};
const TAX_ID = '92176472-1-33';
const VAT_ID = 'HU92176472';
const REGISTRATION_NUMBER = '62508634';

// Real, confirmed profiles only — a wrong sameAs hurts more than a missing
// one. These feed Google's Knowledge Panel entity resolution.
const DAVID_LINKEDIN = 'https://www.linkedin.com/in/dávid-vasadi-01a3581b8/';

const SAME_AS: string[] = [
  'https://www.instagram.com/davelopment_official/',
  DAVID_LINKEDIN,
  'https://maps.app.goo.gl/SfNfrFNHyygiyfdb7',
];

// The brand logo comes from Payload (global.navbar.logo → logos.image); pages
// resolve its absolute URL via getSiteLogoUrl() and pass it in as `logoUrl`.

type FaqItem = { question: string; answer: string };

const lang = (locale?: string | null) => (locale === 'en' ? 'en-US' : 'hu-HU');

/** Absolutise a possibly-relative asset/URL against SITE_URL. */
const abs = (u?: string | null): string | undefined => {
  if (!u) return undefined;
  if (u.startsWith('http')) return u;
  return `${SITE_URL}${u.startsWith('/') ? '' : '/'}${u}`;
};

type Node = Record<string, any>;

// ─── Site-wide singleton nodes ───────────────────────────────────────────────

type GoogleRatingData = { rating: number; userRatingCount: number } | null | undefined;

function organizationNode(logoUrl?: string | null, googleRating?: GoogleRatingData): Node {
  const node: Node = {
    // ProfessionalService is a LocalBusiness subtype — lets this single node
    // satisfy both "Organization" and "Local Business Schema" SEO checks.
    '@type': ['Organization', 'ProfessionalService'],
    '@id': ORG_ID,
    name: ORG_NAME,
    legalName: LEGAL_NAME,
    url: SITE_URL,
    address: {
      '@type': 'PostalAddress',
      ...BUSINESS_ADDRESS,
    },
    taxID: TAX_ID,
    vatID: VAT_ID,
    identifier: {
      '@type': 'PropertyValue',
      name: 'Egyéni vállalkozói nyilvántartási szám',
      value: REGISTRATION_NUMBER,
    },
    // A LocalBusiness/ProfessionalService riportnak (Rich Results Test "Helyi
    // cégek") saját, top-level telephone/priceRange mezőre van szüksége — a
    // lenti contactPoint.telephone önmagában nem elég neki, csak az
    // Organization ContactPoline sémáját elégíti ki.
    telephone: CONTACT_PHONE,
    // A ténylegesen publikált /hu/arak csomagok sávja — Mikró (19 900 Ft/hó,
    // legolcsóbb belépő) és Növekedés (59 900 Ft/hó, legmagasabb havidíj)
    // között. Frissítve: 2026-10-17.
    priceRange: 'Ft 19 900 - Ft 59 900',
    contactPoint: {
      '@type': 'ContactPoint',
      email: CONTACT_EMAIL,
      telephone: CONTACT_PHONE,
      contactType: 'customer support',
      availableLanguage: ['Hungarian', 'English'],
    },
  };
  if (logoUrl) {
    node.logo = {
      '@type': 'ImageObject',
      '@id': LOGO_ID,
      url: logoUrl,
      contentUrl: logoUrl,
    };
    node.image = { '@id': LOGO_ID };
  }
  if (SAME_AS.length) node.sameAs = SAME_AS;
  // Napi cron script által cache-elt valódi Google-értékelés (lásd
  // scripts/google-reviews/fetch_rating.py + getCachedGoogleRating()) —
  // csak akkor adjuk hozzá, ha van friss adat, soha nem kitaláljuk.
  if (googleRating?.rating && googleRating?.userRatingCount) {
    node.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: googleRating.rating,
      reviewCount: googleRating.userRatingCount,
      bestRating: 5,
    };
  }
  return node;
}

function webSiteNode(locale?: string): Node {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: SITE_URL,
    name: ORG_NAME,
    publisher: { '@id': ORG_ID },
    inLanguage: lang(locale),
  };
}

// ─── Per-page nodes ──────────────────────────────────────────────────────────

function webPageNode(opts: {
  url: string;
  title: string;
  description?: string | null;
  locale?: string;
  isCollection?: boolean;
  primaryEntityId?: string;
  breadcrumbId?: string;
  faqId?: string;
  imageUrl?: string | null;
  datePublished?: string | null;
  dateModified?: string | null;
}): Node {
  const node: Node = {
    '@type': opts.isCollection ? ['WebPage', 'CollectionPage'] : 'WebPage',
    '@id': `${opts.url}#webpage`,
    url: opts.url,
    name: opts.title,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORG_ID },
    inLanguage: lang(opts.locale),
  };
  if (opts.description) node.description = opts.description;
  if (opts.primaryEntityId) node.mainEntity = { '@id': opts.primaryEntityId };
  if (opts.breadcrumbId) node.breadcrumb = { '@id': opts.breadcrumbId };
  if (opts.faqId) node.hasPart = { '@id': opts.faqId };
  const img = abs(opts.imageUrl);
  if (img) node.primaryImageOfPage = { '@type': 'ImageObject', url: img };
  if (opts.datePublished) node.datePublished = opts.datePublished;
  if (opts.dateModified) node.dateModified = opts.dateModified;
  return node;
}

function serviceNode(opts: {
  url: string;
  name: string;
  description?: string | null;
  locale?: string;
}): Node {
  const node: Node = {
    '@type': 'Service',
    '@id': `${opts.url}#service`,
    name: opts.name,
    url: opts.url,
    provider: { '@id': ORG_ID },
    areaServed: { '@type': 'Country', name: 'Hungary' },
    availableLanguage: ['hu', 'en'],
    inLanguage: lang(opts.locale),
  };
  if (opts.description) node.description = opts.description;
  return node;
}

function creativeWorkNode(opts: {
  url: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  locale?: string;
}): Node {
  const node: Node = {
    '@type': 'CreativeWork',
    '@id': `${opts.url}#project`,
    name: opts.name,
    url: opts.url,
    creator: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    inLanguage: lang(opts.locale),
  };
  if (opts.description) node.description = opts.description;
  const img = abs(opts.imageUrl);
  if (img) node.image = img;
  return node;
}

/**
 * A named author gets a real Person node (stable @id, reused across every
 * article by the same person) instead of the article's "author" pointing at
 * the Organization — Google/LLM trust signals want a Person, not a company,
 * as the author of a BlogPosting.
 */
function personNode(name: string, role?: string | null): Node {
  const node: Node = {
    '@type': 'Person',
    '@id': `${SITE_URL}/#person-${slugify(name)}`,
    name,
    worksFor: { '@id': ORG_ID },
  };
  if (role) node.jobTitle = role;
  // Egyetlen ismert, valódi szerzői profil van most (Vasadi Dávid LinkedIn-je,
  // ugyanaz, mint az Organization sameAs-ában) — más/ismeretlen szerzőnek nem
  // találunk ki linket, inkább nincs url/sameAs mező.
  const normalized = name.trim().toLowerCase();
  if (normalized === 'vasadi dávid' || normalized === 'dávid vasadi') {
    node.url = DAVID_LINKEDIN;
    node.sameAs = [DAVID_LINKEDIN];
  }
  return node;
}

function articleNode(opts: {
  url: string;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  imageWidth?: number | null;
  imageHeight?: number | null;
  publishedAt?: string | null;
  updatedAt?: string | null;
  locale?: string;
  authorId?: string;
  articleSection?: string | null;
  keywords?: string | null;
  wordCount?: number | null;
}): Node {
  const node: Node = {
    '@type': 'BlogPosting',
    '@id': `${opts.url}#article`,
    headline: opts.title,
    url: opts.url,
    mainEntityOfPage: { '@id': `${opts.url}#webpage` },
    author: { '@id': opts.authorId || ORG_ID },
    publisher: { '@id': ORG_ID },
    inLanguage: lang(opts.locale),
  };
  if (opts.description) node.description = opts.description;
  const img = abs(opts.imageUrl);
  if (img) {
    // ImageObject (url/width/height) kell a sima URL-string helyett — a
    // méretek a Payload media dokumentumából jönnek, sosem kitalálva.
    node.image =
      opts.imageWidth && opts.imageHeight
        ? { '@type': 'ImageObject', url: img, width: opts.imageWidth, height: opts.imageHeight }
        : img;
  }
  if (opts.publishedAt) node.datePublished = opts.publishedAt;
  if (opts.updatedAt) node.dateModified = opts.updatedAt;
  if (opts.articleSection) node.articleSection = opts.articleSection;
  if (opts.keywords) node.keywords = opts.keywords;
  if (opts.wordCount) node.wordCount = opts.wordCount;
  return node;
}

function faqPageNode(url: string, faqs: FaqItem[], locale?: string, dateModified?: string | null): Node | null {
  const clean = faqs.filter((f) => f.question && f.answer);
  if (!clean.length) return null;
  const node: Node = {
    '@type': 'FAQPage',
    '@id': `${url}#faqpage`,
    inLanguage: lang(locale),
    mainEntity: clean.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
  if (dateModified) node.dateModified = dateModified;
  return node;
}

function breadcrumbNode(url: string, locale: string | undefined, trail: { name: string; url: string }[]): Node | null {
  if (!trail.length) return null;
  // Always prepend the localized home crumb.
  const home = { name: locale === 'en' ? 'Home' : 'Főoldal', url: `${SITE_URL}/${locale === 'en' ? 'en' : 'hu'}` };
  const items = [home, ...trail];
  return {
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    // Google wants ListItem.item as a Thing (with @id + name), not a bare URL string.
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: { '@id': item.url, name: item.name },
    })),
  };
}

// ─── Pricing plans → Product/Offer nodes ─────────────────────────────────────

type PricingPlan = {
  name?: string | null;
  price?: string | number | null;
  currency?: string | null;
  recommended_for?: string | null;
};

const slugify = (s: string): string =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/**
 * Pull the `plans` array out of a page's `pricing` dynamic-zone block, so the
 * pricing table on /arak (and the services hub) gets real Product/Offer nodes
 * instead of being invisible to Google's price-aware crawlers.
 */
function extractPricingPlans(dynamicZone: unknown): PricingPlan[] {
  if (!Array.isArray(dynamicZone)) return [];
  for (const block of dynamicZone) {
    if (block && (block as any).blockType === 'pricing') {
      return Array.isArray((block as any).plans) ? (block as any).plans : [];
    }
  }
  return [];
}

/**
 * One Product+Offer node per plan. Only fixed-price plans (Mikró/Rajt/
 * Növekedés) get a node — Google's Merchant listing validator requires a
 * real price/priceCurrency (a priceSpecification-only Offer without a number
 * doesn't satisfy it), and we never fabricate a number for a custom-quote
 * plan (Partner) just to fill that field — Google explicitly penalizes a
 * schema price that doesn't match what's shown on the page. So Partner
 * simply isn't represented as a Product here; the honest alternative to a
 * made-up price is no price, not a fake one.
 */
// Offers are revisited at least yearly — valid through the end of the
// current calendar year, recomputed on every request (never a stale hardcode).
function endOfYearISO(): string {
  return `${new Date().getUTCFullYear()}-12-31`;
}

function pricingProductNodes(
  url: string,
  plans: PricingPlan[],
  locale?: string,
  logoUrl?: string | null,
  googleRating?: GoogleRatingData,
  dateModified?: string | null,
): Node[] {
  return plans
    .filter((p): p is PricingPlan & { name: string } => !!p?.name)
    .map((p) => {
      const priceNum =
        p.price !== null && p.price !== undefined && p.price !== '' && !isNaN(Number(p.price))
          ? Number(p.price)
          : null;
      if (priceNum === null) return null;
      const node: Node = {
        '@type': 'Product',
        '@id': `${url}#product-${slugify(p.name)}`,
        name: p.name,
        url,
        // Google Merchant Listing kifejezetten a "Brand" típust várja itt (az
        // "Organization" technikailag schema.org-valid, de a Merchant
        // validátor "Invalid object type"-ként jelzi) — lásd Rich Results
        // Test, 2026-10-09.
        brand: { '@type': 'Brand', name: ORG_NAME },
        inLanguage: lang(locale),
      };
      if (p.recommended_for) node.description = p.recommended_for;
      if (logoUrl) node.image = logoUrl;
      if (dateModified) node.dateModified = dateModified;
      // Egy davelopment-csomagra nincs önálló, csomagonkénti Google-vélemény
      // — a cégszintű (minden csomagra érvényes) aggregált értékelést tesszük
      // rá minden Product node-ra, hogy a Merchant Listing "Hiányzó mező:
      // aggregateRating/review" figyelmeztetése eltűnjön.
      if (googleRating?.rating && googleRating?.userRatingCount) {
        node.aggregateRating = {
          '@type': 'AggregateRating',
          ratingValue: googleRating.rating,
          reviewCount: googleRating.userRatingCount,
          bestRating: 5,
        };
      }
      node.offers = {
        '@type': 'Offer',
        price: String(priceNum),
        priceCurrency: p.currency || 'HUF',
        availability: 'https://schema.org/InStock',
        // validFrom = az oldal utolsó módosítása: a megjelenített ár legkésőbb
        // ettől kezdve érvényes (GSC "Hiányzó mező: validFrom", 2026-10-22).
        ...(dateModified ? { validFrom: dateModified } : {}),
        priceValidUntil: endOfYearISO(),
        url,
        // shippingDetails / hasMerchantReturnPolicy szándékosan NINCS itt —
        // ez egy havi előfizetéses, nem fizikai szolgáltatás, a hagyományos
        // "szállítás"/"termékvisszaküldés" fogalma nem igaz rá. A Rich
        // Results Test ezt hiányzó (nem kötelező) mezőként jelzi, de kitalált
        // visszaküldési/szállítási szabályt ide írni félrevezető lenne — ha
        // tényleg szeretnénk kitölteni, Dave-nek kell megadnia a pontos,
        // valós lemondási feltételt (lásd GYIK: "bármikor lemondható").
      };
      return node;
    })
    .filter((n): n is Node => n !== null);
}

type HowToStep = { name: string; text?: string };

/**
 * HowTo schema egy cikk saját, számozott lépéseiből ("1. Egyeztetés és
 * tervezés" stílusú H2-kből) — csak akkor jön létre, ha a cikk ténylegesen
 * ilyen felépítésű, sosem szintetikus lépéslista.
 */
function howToNode(url: string, name: string, steps: HowToStep[], locale?: string): Node | null {
  const clean = steps.filter((s) => s.name);
  if (clean.length < 2) return null;
  return {
    '@type': 'HowTo',
    '@id': `${url}#howto`,
    name,
    inLanguage: lang(locale),
    step: clean.map((s, i) => {
      const step: Node = { '@type': 'HowToStep', position: i + 1, name: s.name };
      if (s.text) step.text = s.text;
      return step;
    }),
  };
}

/**
 * Egy lexical dokumentumból kinyeri a "N. Cím" formátumú H2 lépéseket, az
 * utánuk közvetlenül következő bekezdés szövegével — ha a cikk nem ilyen
 * felépítésű (nincs legalább 2 számozott H2), üres listát ad vissza.
 */
export function extractNumberedSteps(root: any): HowToStep[] {
  const children = root?.children;
  if (!Array.isArray(children)) return [];
  const steps: HowToStep[] = [];
  const textOf = (node: any): string =>
    Array.isArray(node?.children)
      ? node.children.map((c: any) => (typeof c?.text === 'string' ? c.text : '')).join('')
      : '';
  for (let i = 0; i < children.length; i++) {
    const node = children[i];
    if (node?.type === 'heading' && node?.tag === 'h2') {
      const heading = textOf(node).trim();
      if (/^\d+[.)]\s*/.test(heading)) {
        const name = heading.replace(/^\d+[.)]\s*/, '');
        const next = children.slice(i + 1).find((n: any) => n?.type === 'paragraph' && textOf(n).trim());
        steps.push({ name, text: next ? textOf(next).trim() : undefined });
      }
    }
  }
  return steps;
}

function itemListNode(url: string, name: string, items: { name: string; url: string; position?: number }[]): Node | null {
  const clean = items.filter((i) => i.name && i.url);
  if (!clean.length) return null;
  return {
    '@type': 'ItemList',
    '@id': `${url}#itemlist`,
    name,
    itemListElement: clean.map((item, i) => ({
      '@type': 'ListItem',
      position: item.position ?? i + 1,
      url: item.url,
      name: item.name,
    })),
  };
}

// ─── FAQ extraction from a page's dynamic zone ───────────────────────────────

/**
 * Pull every question/answer pair out of the `faq` blocks in a page's
 * dynamic_zone. The FAQ block references the `faqs` collection (hasMany), which
 * Payload populates with localized `question`/`answer` strings for the request
 * locale — so this already reflects the correct language.
 */
export function extractFaqs(dynamicZone: unknown): FaqItem[] {
  if (!Array.isArray(dynamicZone)) return [];
  const out: FaqItem[] = [];
  for (const block of dynamicZone) {
    if (!block || (block as any).blockType !== 'faq') continue;
    const items = Array.isArray((block as any).faqs) ? (block as any).faqs : [];
    for (const it of items) {
      const question = typeof it?.question === 'string' ? it.question.trim() : '';
      const answer = typeof it?.answer === 'string' ? it.answer.trim() : '';
      if (question && answer) out.push({ question, answer });
    }
  }
  return out;
}

// NOTE: structured data is generated PURELY from CMS content — a single source
// of truth. The legacy seo.structuredData field is intentionally NOT merged in.
// Every page already holds an old, hand-authored blob in that field, and merging
// it would DUPLICATE the auto-generated @graph (double FAQPage/WebPage, colliding
// @ids). Those stale values are simply ignored, so every page stays fresh
// automatically with zero manual cleanup.

// ─── Public entry point ──────────────────────────────────────────────────────

export type PageKind = 'home' | 'webpage' | 'collection' | 'service' | 'product' | 'article';

export function renderPageJsonLd(opts: {
  kind: PageKind;
  url: string;
  title: string;
  locale?: string;
  description?: string | null;
  imageUrl?: string | null;
  publishedAt?: string | null;
  updatedAt?: string | null;
  /** Page dynamic_zone — FAQ blocks are auto-extracted into a FAQPage node. */
  dynamicZone?: unknown;
  /** Breadcrumb trail EXCLUDING home (home is prepended automatically). */
  breadcrumbs?: { name: string; url: string }[];
  /** Listing items for a collection page → ItemList node. */
  items?: { name: string; url: string; position?: number }[];
  /** @deprecated Ignored — structured data is generated purely from CMS content.
   *  (The legacy hand-authored seo.structuredData caused duplicate nodes.) */
  override?: string | Record<string, any> | null;
  /** Absolute brand logo URL (from Payload via getSiteLogoUrl) for Organization. */
  logoUrl?: string | null;
  /** Cache-elt Google Cégem-pontszám (lásd getCachedGoogleRating()) → AggregateRating. */
  googleRating?: GoogleRatingData;
  /** Article author (from the article's person_card) — gets its own Person node. */
  authorName?: string | null;
  authorRole?: string | null;
  /** Article-only extras — real data from the article doc, never fabricated. */
  imageWidth?: number | null;
  imageHeight?: number | null;
  articleSection?: string | null;
  keywords?: string | null;
  wordCount?: number | null;
  /** Számozott lépések ("1. Cím" H2-k) a cikk saját tartalmából → HowTo schema. */
  howToSteps?: HowToStep[];
}): string {
  const { kind, url, title, locale, description } = opts;

  const nodes: (Node | null)[] = [organizationNode(opts.logoUrl, opts.googleRating), webSiteNode(locale)];

  const author =
    kind === 'article' && opts.authorName ? personNode(opts.authorName, opts.authorRole) : null;

  // Primary entity
  let primaryNode: Node | null = null;
  if (kind === 'service') primaryNode = serviceNode({ url, name: title, description, locale });
  else if (kind === 'product') primaryNode = creativeWorkNode({ url, name: title, description, imageUrl: opts.imageUrl, locale });
  else if (kind === 'article')
    primaryNode = articleNode({
      url,
      title,
      description,
      imageUrl: opts.imageUrl,
      publishedAt: opts.publishedAt,
      updatedAt: opts.updatedAt,
      locale,
      authorId: author?.['@id'],
      imageWidth: opts.imageWidth,
      imageHeight: opts.imageHeight,
      articleSection: opts.articleSection,
      keywords: opts.keywords,
      wordCount: opts.wordCount,
    });

  const howTo =
    kind === 'article' && opts.howToSteps?.length ? howToNode(url, title, opts.howToSteps, locale) : null;

  const breadcrumb = opts.breadcrumbs?.length ? breadcrumbNode(url, locale, opts.breadcrumbs) : null;
  const faq = faqPageNode(url, extractFaqs(opts.dynamicZone), locale, opts.updatedAt);
  const list = kind === 'collection' && opts.items?.length ? itemListNode(url, title, opts.items) : null;
  const pricingProducts = pricingProductNodes(
    url,
    extractPricingPlans(opts.dynamicZone),
    locale,
    opts.logoUrl,
    opts.googleRating,
    opts.updatedAt,
  );

  const webpage = webPageNode({
    url,
    title,
    description,
    locale,
    isCollection: kind === 'collection',
    primaryEntityId: primaryNode?.['@id'],
    breadcrumbId: breadcrumb?.['@id'],
    faqId: faq?.['@id'],
    imageUrl: kind === 'article' ? opts.imageUrl : undefined,
    datePublished: kind === 'article' ? opts.publishedAt : undefined,
    dateModified: opts.updatedAt,
  });

  nodes.push(webpage, primaryNode, author, breadcrumb, faq, howTo, list, ...pricingProducts);

  const graph = { '@context': 'https://schema.org', '@graph': nodes.filter(Boolean) as Node[] };
  return JSON.stringify(graph);
}
