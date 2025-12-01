// frontend/components/dynamic-zone/projects.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'next-view-transitions';

import { Container } from '@/components/container';
import { StrapiImage } from '@/components/ui/strapi-image';
import { Product } from '@/types/types';
import { truncate } from '@/lib/utils';
import { PlusIcon, ArrowUpRight as ArrowUpRightIcon } from 'lucide-react';

/* -----------------------------------------------------------------------------
 * TÍPUSOK – Strapi-ből jövő Project kártyák és egyéb segédtípusok
 * -------------------------------------------------------------------------- */

// Strapi „tag” / chip egy projekt alatt
type Chip = {
  id?: number;
  label?: string | null;
};

// Egy „Project” elem a Strapi dynamic zone-ból
// - product: a tényleges Product relation (lapos vagy relation objektum)
// - badge_label: kis címke (pl: „Branding”, „E-commerce”)
// - result_line: rövid eredmény / impact mondat (csak a KIS kártyákon használjuk)
// - tags: opcionális extra chipek
// - is_featured: jelölés kiemelt projektre (most nem használjuk, de jól jöhet)
type ProjectCardFromStrapi = {
  id?: number;
  product?: any; // lehet lapos Product vagy Strapi relation
  badge_label?: string | null;
  result_line?: string | null;
  tags?: Chip[];
  is_featured?: boolean;
};

// A Projects dynamic zone Strapi komponens props-a
type ProjectsProps = {
  id?: number;
  badge_label?: string | null;
  heading?: string | null;
  sub_heading?: string | null;
  projects?: ProjectCardFromStrapi[];
  locale: string;
};

// Belső típus: már kibontott Product + hozzá tartozó raw project
type ProjectWithProduct = {
  project: ProjectCardFromStrapi;
  product: Product;
};

/* -----------------------------------------------------------------------------
 * HELPER: Strapi relation → Product normalizálása
 * -------------------------------------------------------------------------- */

/**
 * getProductFromProject
 * - Ha a `project.product` már lapos Product, visszaadjuk.
 * - Ha Strapi relation ({ data: { id, attributes } }), abból építünk Product-ot.
 */
const getProductFromProject = (
  project: ProjectCardFromStrapi
): Product | undefined => {
  const raw = project.product as any;
  if (!raw) return undefined;

  // lapos Product (pl. REST populate után)
  if ('slug' in raw) {
    return raw as Product;
  }

  // Strapi relation (pl. { data: { id, attributes } })
  if (raw.data?.attributes) {
    return {
      id: raw.data.id,
      ...raw.data.attributes,
    } as Product;
  }

  return undefined;
};

/* -----------------------------------------------------------------------------
 * HELPER: primary label (badge / termék badge / első kategórianév)
 * - Ezt használjuk:
 *   - nagy kártyák tetején egy sorban,
 *   - kis kártyákon fő címkeként.
 * -------------------------------------------------------------------------- */

const getPrimaryLabel = (item: ProjectWithProduct): string =>
  item.project.badge_label ||
  (item.product as any).badge_label ||
  item.product.categories?.[0]?.name ||
  'Highlight';

/* -----------------------------------------------------------------------------
 * FŐ KOMPONENS: Projects
 * - Dinamikus projekt szekció a home-on
 * - A Featured mozaikos layoutját használja (csak max 2 projektre)
 * -------------------------------------------------------------------------- */

export const Projects: React.FC<ProjectsProps> = ({
  badge_label,
  heading,
  sub_heading,
  projects = [],
  locale,
}) => {
  // Strapi raw projektekből kiszedjük a Product-ot
  // -> csak azokat hagyjuk meg, ahol tényleges Product van
  const items: ProjectWithProduct[] = projects
    .map((p) => {
      const product = getProductFromProject(p);
      if (!product) return undefined;
      return { project: p, product };
    })
    .filter((x): x is ProjectWithProduct => !!x);

  // EBBEN A SZEKCIÓBAN max 2 projektet mutatunk – mint egy pár a Featured gridben
  const first = items[0];
  const second = items[1];

  // Ha nincs egy darab Project sem → csak heading + üzenet
  if (!first) {
    return (
      <motion.section
        className="relative py-24 md:py-28 lg:py-32"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <Container className="relative z-10">
          <Header
            badge_label={badge_label}
            heading={heading}
            sub_heading={sub_heading}
            locale={locale}
          />
          <p className="mt-8 text-sm text-neutral-500">
            Jelenleg nincs beállított projekt ebben a szekcióban.
          </p>
        </Container>
      </motion.section>
    );
  }

  // Ha van legalább 1 projekt → teljes mozaikos rész
  return (
    <motion.section
      className="relative py-24 md:py-28 lg:py-32"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      <Container className="relative z-10">
        {/* FELSŐ HEADER BLOKK (badge + hatalmas heading + leírás) */}
        <Header
          badge_label={badge_label}
          heading={heading}
          sub_heading={sub_heading}
          locale={locale}
        />

        {/* ALATTA: UGYANAZ A MOZAIK, mint featured.tsx-ben, csak 2 projektig */}
        <div className="mt-28">
          <div className="max-w-7xl mx-auto">
            {/* ---------- MOBIL GRID (<= md) ----------
                2 oszlopos grid, egymás alatt a projektek:
                - egy projekt = 3 csempe: 1 nagy + 1 kis szöveges + 1 kis képes
             */}
            <div className="grid grid-cols-2 gap-2 text-black md:hidden">
              {/* FIRST PROJECT – tripla csempe */}
              <ProjectTriplet
                locale={locale}
                item={first}
                truncateLength={50}
                layout={{
                  large: 'col-span-2 rounded-2xl bg-white min-h-[260px]',
                  small: 'col-span-1 rounded-2xl bg-white min-h-[180px]',
                  image: 'col-span-1 rounded-2xl overflow-hidden min-h-[180px]',
                  largeArrowClassName: 'text-white',
                }}
              />

              {/* SECOND PROJECT – ugyanaz a minta, ha létezik */}
              {second && (
                <ProjectTriplet
                  locale={locale}
                  item={second}
                  truncateLength={50}
                  layout={{
                    large: 'col-span-2 rounded-2xl bg-white min-h-[260px]',
                    small: 'col-span-1 rounded-2xl bg-white min-h-[180px]',
                    image:
                      'col-span-1 rounded-2xl overflow-hidden min-h-[180px]',
                    largeArrowClassName: 'text-white',
                  }}
                />
              )}
            </div>

            {/* ---------- DESKTOP GRID (md+) ----------
                6×12-es mozaik layout – ugyanaz, mint featured.tsx
                - first: bal felső nagy, jobb oldalt kicsik
                - second: jobb alsó nagy, bal oldalt kicsik
             */}
            <div className="hidden md:grid grid-cols-6 grid-rows-12 gap-1 text-black">
              {/* FIRST project pozíciói a mozaikon */}
              <ProjectTriplet
                locale={locale}
                item={first}
                truncateLength={60}
                layout={{
                  large: 'col-span-4 row-span-6 rounded-2xl bg-white',
                  small:
                    'col-span-2 row-span-3 col-start-5 bg-white rounded-2xl',
                  image:
                    'col-span-2 row-span-3 col-start-5 row-start-4 bg-white rounded-2xl p-0 overflow-hidden',
                  largeArrowClassName: 'text-white',
                }}
              />

              {/* SECOND project pozíciói a mozaikon (ha van) */}
              {second && (
                <ProjectTriplet
                  locale={locale}
                  item={second}
                  truncateLength={60}
                  layout={{
                    large:
                      'col-span-4 row-span-6 col-start-3 row-start-7 bg-white rounded-2xl',
                    small:
                      'col-span-2 row-span-3 col-start-1 row-start-7 bg-white rounded-2xl',
                    image:
                      'col-span-2 row-span-3 row-start-10 bg-white rounded-2xl p-0 overflow-hidden',
                    // itt a nyíl színe kicsit világosabb, hogy ne üssön ki
                    largeArrowClassName: 'text-gray-500',
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </Container>
    </motion.section>
  );
};

/* -----------------------------------------------------------------------------
 * HEADER – felső szekció (badge + mega heading + copy)
 * -------------------------------------------------------------------------- */

const Header = ({
  badge_label,
  heading,
  sub_heading,
  locale, // jelenleg nem használjuk, de később hasznos lehet
}: {
  badge_label?: string | null;
  heading?: string | null;
  sub_heading?: string | null;
  locale: string;
}) => (
  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10 space-y-12">
    {/* BAL: badge label */}
    <div>
      {badge_label && (
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-black">
            <PlusIcon className="h-3 w-3 text-white" />
          </div>
          <p className="text-xs sm:text-sm text-neutral-500">{badge_label}</p>
        </div>
      )}
    </div>

    {/* KÖZÉP: hatalmas fő cím */}
    <div>
      {heading && (
        <h2 className="text-7xl lg:text-7xl xl:text-9xl font-semibold tracking-tight text-black">
          {heading}
        </h2>
      )}
    </div>

    {/* JOBB: rövid leírás */}
    <div className="flex flex-col items-start md:items-end gap-4 max-w-sm md:text-right">
      {sub_heading && (
        <p className="text-sm sm:text-base text-neutral-600 leading-relaxed text-left md:text-right mt-0 md:mt-8">
          {sub_heading}
        </p>
      )}
    </div>
  </div>
);

/* -----------------------------------------------------------------------------
 * ARROW BADGE – egységes „nyíl” ikon minden csempén
 * -------------------------------------------------------------------------- */

const ArrowBadge = ({ iconClassName = '' }: { iconClassName?: string }) => (
  <div className="inline-flex h-8 w-8 md:h-10 md:w-10 items-center justify-center">
    <ArrowUpRightIcon className={`w-7 h-7 md:w-12 md:h-12 ${iconClassName}`} />
  </div>
);

/* -----------------------------------------------------------------------------
 * TRIPLET – egy projekt 3 csempére szétszedve:
 * 1) Large hero tile (nagy kép + cím)
 * 2) Small text tile (result_line / description)
 * 3) Pure image tile (csak kép + nyíl)
 * Layout-onként (mobil / desktop) csak a className-ek változnak.
 * -------------------------------------------------------------------------- */

type TileLayoutSet = {
  large: string;
  small: string;
  image: string;
  largeArrowClassName?: string;
};

type ProjectTripletProps = {
  item: ProjectWithProduct;
  locale: string;
  layout: TileLayoutSet;
  truncateLength: number;
};

const ProjectTriplet: React.FC<ProjectTripletProps> = ({
  item,
  locale,
  layout,
  truncateLength,
}) => {
  return (
    <>
      {/* Hero tile: nagy, képes, overlay + primary label + name
          → NINCS result_line, csak a label + title */}
      <LargeTile
        locale={locale}
        item={item}
        className={layout.large}
        arrowClassName={layout.largeArrowClassName}
      />

      {/* Kis szöveges tile: itt használjuk a result_line / description-t */}
      <SmallTextTile
        locale={locale}
        item={item}
        className={layout.small}
        truncateLength={truncateLength}
      />

      {/* Csak kép + nyíl */}
      <ImageTile
        locale={locale}
        item={item}
        className={layout.image}
        imageIndex={2}
      />
    </>
  );
};

/* -------------------------------------------------------------------------- */
/*                          TILE ALAP / közös propok                          */
/* -------------------------------------------------------------------------- */

type TileBaseProps = {
  item: ProjectWithProduct;
  locale: string;
  className?: string;
};

/* -----------------------------------------------------------------------------
 * LargeTile – nagy hero csempe
 * - Háttérkép (TileWithImageBackground)
 * - Fent: egyetlen sor primary label (badge / category)
 * - Lent: hatalmas cím (product.name)
 * - NINCS result_line ezen a csempén, ahogy kérted.
 * -------------------------------------------------------------------------- */

type LargeTileProps = TileBaseProps & {
  arrowClassName?: string;
};

const LargeTile: React.FC<LargeTileProps> = ({
  item,
  locale,
  className,
  arrowClassName,
}) => {
  const { product } = item;

  const label = getPrimaryLabel(item);

  return (
    <TileLink locale={locale} product={product} className={className}>
      <TileWithImageBackground product={product}>
        <div className="flex h-full flex-col justify-between">
          {/* Felső sor: címke + nyíl ikon */}
          <div className="flex justify-between gap-2 md:gap-0">
            <div className="text-2xl md:text-4xl font-semibold flex flex-col">
              {/* csak egy sor: primary label */}
              <span className="text-white">{label}</span>
            </div>
            <ArrowBadge iconClassName={arrowClassName ?? 'text-white'} />
          </div>

          {/* Alsó rész: projekt neve, nagy betűkkel */}
          <h2 className="text-4xl md:text-8xl font-semibold text-white mt-6 md:mt-16 lg:mt-40 xl:mt-60 leading-none">
            {product.name}
          </h2>
        </div>
      </TileWithImageBackground>
    </TileLink>
  );
};

/* -----------------------------------------------------------------------------
 * SmallTextTile – kis szöveges csempe
 * - Fent: primary label + result_line / description (truncate-elve)
 * - Lent: product name kisebb címmel
 * - IDE tettük a „result_line” használatát.
 * -------------------------------------------------------------------------- */

type SmallTextTileProps = TileBaseProps & {
  truncateLength: number;
};

const SmallTextTile: React.FC<SmallTextTileProps> = ({
  item,
  locale,
  className,
  truncateLength,
}) => {
  const { product, project } = item;

  return (
    <TileLink locale={locale} product={product} className={className}>
      <div className="relative h-full w-full overflow-hidden rounded-2xl bg-white">
        <div className="relative z-10 flex h-full flex-col justify-between p-4 md:p-6">
          {/* Felső rész: label + rövidített result_line / description */}
          <div className="flex justify-between gap-2">
            <div className="text-lg md:text-2xl font-semibold flex flex-col">
              <span>{getPrimaryLabel(item)}</span>
              <span className="text-gray-500 text-xs md:text-sm">
                {truncate(
                  project.result_line || product.description,
                  truncateLength
                )}
              </span>
            </div>
            <ArrowBadge iconClassName="text-gray-500" />
          </div>

          {/* Alsó rész: termék neve */}
          <h2 className="text-2xl md:text-4xl font-semibold mt-3 md:mt-10 leading-tight">
            {product.name}
          </h2>
        </div>
      </div>
    </TileLink>
  );
};

/* -----------------------------------------------------------------------------
 * ImageTile – csak kép + nyíl
 * - Ugyanaz, mint a Featured-ben: a megadott indexű képet húzza be
 * -------------------------------------------------------------------------- */

type ImageTileProps = TileBaseProps & {
  imageIndex?: number;
};

const ImageTile: React.FC<ImageTileProps> = ({
  item,
  locale,
  className,
  imageIndex = 0,
}) => {
  return (
    <TileLink
      locale={locale}
      product={item.product}
      className={className + ' rounded-2xl overflow-hidden'}
    >
      <PureImageTile product={item.product} imageIndex={imageIndex} />
    </TileLink>
  );
};

/* -----------------------------------------------------------------------------
 * TileLink – közös link wrapper minden csempéhez
 * - a layout className-t kívülről kapja,
 * - belül motion.div, hogy hoverkor kicsit feljöjjön.
 * -------------------------------------------------------------------------- */

type TileLinkProps = {
  children: React.ReactNode;
  product: Product;
  locale: string;
  className?: string;
};

const TileLink: React.FC<TileLinkProps> = ({
  children,
  product,
  locale,
  className,
}) => (
  <Link
    href={`/${locale}/products/${product.slug}` as never}
    className={className}
  >
    <motion.div
      className="relative h-full w-full"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  </Link>
);

/* -----------------------------------------------------------------------------
 * TileWithImageBackground – nagy kártyák háttérképes wrapper-e
 * - object-cover, teljes csempe kitöltése
 * - enyhe fekete overlay, hogy a szöveg olvasható legyen.
 * -------------------------------------------------------------------------- */

type TileWithImageBackgroundProps = {
  children: React.ReactNode;
  product: Product;
  imageIndex?: number; // melyik képet használjuk háttérnek (alap: 0)
};

const TileWithImageBackground: React.FC<TileWithImageBackgroundProps> = ({
  children,
  product,
  imageIndex = 0,
}) => {
  const img = product.images?.[imageIndex];

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl">
      {img?.url && (
        <>
          <StrapiImage
            src={img.url}
            alt={img.alternativeText || product.name}
            width={1600}
            height={900}
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* overlay – kicsit sötétít, hogy a text ne vesszen el */}
          <div className="absolute inset-0 bg-black/15" />
        </>
      )}

      <div className="relative z-10 h-full w-full p-6 md:p-8">
        {children}
      </div>
    </div>
  );
};

/* -----------------------------------------------------------------------------
 * PureImageTile – csak kép + overlay + nyíl a jobb alsó sarokban
 * -------------------------------------------------------------------------- */

type PureImageTileProps = {
  product: Product;
  imageIndex?: number;
};

const PureImageTile: React.FC<PureImageTileProps> = ({
  product,
  imageIndex = 0,
}) => {
  const img = product.images?.[imageIndex] || product.images?.[0];

  return (
    <div className="relative h-full w-full">
      {img?.url ? (
        <>
          <StrapiImage
            src={img.url}
            alt={img.alternativeText || product.name}
            width={1600}
            height={900}
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* enyhe overlay a kis kártyákon is */}
          <div className="absolute inset-0 bg-black/15" />
        </>
      ) : (
        <div className="absolute inset-0 h-full w-full bg-neutral-200" />
      )}

      <div className="relative z-10 h-full w-full flex items-end justify-end p-3 md:p-4">
        <ArrowBadge iconClassName="text
 white/90" />
      </div>
    </div>
  );
};

export default Projects;
