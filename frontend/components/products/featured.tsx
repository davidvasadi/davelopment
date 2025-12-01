// frontend/components/products/featured.tsx
'use client';

// Kiemelt termékek – mozaikos Figma layout, több featured projekt
// Mobilon külön, egyszerűbb 2 oszlopos grid, desktopon a 6×12 mozaik.

import { Link } from 'next-view-transitions';
import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  ChevronDown,
  ArrowUpRight as ArrowUpRightIcon,
} from 'lucide-react';

import { StrapiImage } from '@/components/ui/strapi-image';
import { truncate } from '@/lib/utils';
import { Product } from '@/types/types';

/* -------------------------------------------------------------------------- */
/*                            Arrow ikon – egységes                           */
/* -------------------------------------------------------------------------- */

/**
 * ArrowBadge
 * – minden csempén EZ a wrapper + ikon megy ki,
 * – mobilon kisebb, desktopon nagyobb.
 */
const ArrowBadge = ({ iconClassName = '' }: { iconClassName?: string }) => (
  <div className="inline-flex h-8 w-8 md:h-10 md:w-10 items-center justify-center">
    <ArrowUpRightIcon
      className={`w-7 h-7 md:w-12 md:h-12 ${iconClassName}`}
    />
  </div>
);

/* -------------------------------------------------------------------------- */
/*                               FŐ KOMPONENS                                 */
/* -------------------------------------------------------------------------- */

export const Featured = ({
  products,
  locale,
}: {
  products: Product[];
  locale: string;
  heading?: string;
  subHeading?: string;
}) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // --- nyelvfüggő szövegek a keresőhöz + üzenethez ---
  const isHu = locale === 'hu';
  const searchLabel = isHu ? 'Keresés' : 'Search';
  const searchPlaceholder = isHu ? 'Keresés…' : 'Search…';
  const categoryLabel = isHu ? 'Kategória' : 'Category';
  const noResultsTitle = isHu ? 'Nincs találat.' : 'No results found.';
  const noResultsSubtitle = isHu
    ? 'Próbáld módosítani a keresést vagy a kategória szűrőt.'
    : 'Try adjusting your search term or category filter.';

  // KATEGÓRIÁK a filter dropdownhoz
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) =>
      p.categories?.forEach((c: any) => {
        if (c?.name) set.add(c.name);
      }),
    );
    return Array.from(set);
  }, [products]);

  // FILTER: keresés + kategória
  const filtered = useMemo(() => {
    return products
      .filter(Boolean)
      .filter((p) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
        );
      })
      .filter((p) => {
        if (activeCategory === 'all') return true;
        return p.categories?.some(
          (c: any) => c?.name && c.name === activeCategory,
        );
      });
  }, [products, search, activeCategory]);

  // csak featured projektek, ha vannak (is_featured / featured flag)
  const featuredOnly = filtered.filter(
    (p: any) => p?.is_featured || p?.featured,
  );
  const listForGrid = featuredOnly.length ? featuredOnly : filtered;

  // 2-esével csoportosítjuk (1 csoport = 2 projekt = 1 teljes mozaik blokk)
  const pairs: Product[][] = [];
  for (let i = 0; i < listForGrid.length; i += 2) {
    pairs.push(listForGrid.slice(i, i + 2));
  }

  return (
    <section className="">
      {/* SEARCH + FILTER SÁV */}
      <div className="flex flex-col md:flex-row gap-1 my-10 md:my-20">
        {/* Kereső mező */}
        <div className="sm:w-64">
          <label className="sr-only" htmlFor="featured-search">
            {searchLabel}
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              id="featured-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full rounded-lg px-8 py-2.5 text-xs md:text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-black focus:ring-1 focus:ring-black"
            />
          </div>
        </div>

        {/* Kategória szűrő dropdown */}
        <div className="sm:w-40">
          <label className="sr-only" htmlFor="featured-category">
            {categoryLabel}
          </label>
          <div className="relative">
            <select
              id="featured-category"
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className="w-full appearance-none rounded-lg bg-white px-3 py-2.5 pr-8 text-xs md:text-sm text-neutral-900 outline-none focus:border-black focus:ring-1 focus:ring-black"
            >
              <option value="all">{categoryLabel}</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          </div>
        </div>
      </div>

      {/* HA NINCS TALÁLAT – csak egy üzenet, a kereső fenn marad */}
      {!listForGrid.length && (
        <div className="max-w-7xl mx-auto mt-4 rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 px-6 py-8 text-center">
          <p className="text-sm font-medium text-neutral-800">
            {noResultsTitle}
          </p>
          <p className="mt-2 text-xs text-neutral-500">
            {noResultsSubtitle}
          </p>
        </div>
      )}

      {/* HA VAN TALÁLAT – mozaik layout */}
      {listForGrid.length > 0 && (
        <div className="space-y-2">
          {pairs.map((pair, pairIndex) => {
            const first = pair[0];
            const second = pair[1];

            return (
              <section
                key={first?.id ?? pairIndex}
                className="max-w-7xl mx-auto"
              >
                {/* ------------------------ MOBIL LAYOUT (<= md) ----------------------- */}
                <div className="grid grid-cols-2 gap-2 text-black md:hidden">
                  {/* FIRST PROJECT – nagy + két kicsi */}
                  {first && (
                    <>
                      {/* nagy tile – full width, kisebb tipó mobilon */}
                      <TileLink
                        locale={locale}
                        product={first}
                        className="col-span-2 rounded-2xl bg-white min-h-[260px]"
                      >
                        <TileWithImageBackground product={first}>
                          <div className="flex h-full flex-col justify-between">
                            <div className="flex justify-between gap-2">
                              <div className="text-2xl font-semibold flex flex-col">
                                <span className="text-white">
                                  {first.badge_label || 'Featured label.'}
                                </span>
                                <span className="text-gray-300 text-sm">
                                  {first.categories
                                    ?.map((c) => c.name)
                                    .join(' ') || 'Featured project.'}
                                </span>
                              </div>
                              <ArrowBadge iconClassName="text-white" />
                            </div>
                            <h2 className="text-4xl font-semibold text-white mt-6 leading-none">
                              {first.name}
                            </h2>
                          </div>
                        </TileWithImageBackground>
                      </TileLink>

                      {/* kis szöveges tile */}
                      <TileLink
                        locale={locale}
                        product={first}
                        className="col-span-1 rounded-2xl bg-white min-h-[180px]"
                      >
                        <div className="relative h-full w-full overflow-hidden rounded-2xl bg-white">
                          <div className="relative z-10 flex h-full flex-col justify-between p-4">
                            <div className="flex justify-between gap-2">
                              <div className="text-lg font-semibold flex flex-col">
                                <span>
                                  {first.badge_label ||
                                    first.categories?.[0]?.name ||
                                    'Highlight'}
                                </span>
                                <span className="text-gray-500 text-xs">
                                  {truncate(first.description, 50)}
                                </span>
                              </div>
                              <ArrowBadge iconClassName="text-gray-500" />
                            </div>
                            <h2 className="text-2xl font-semibold mt-3 leading-tight">
                              {first.name}
                            </h2>
                          </div>
                        </div>
                      </TileLink>

                      {/* kis képes tile */}
                      <TileLink
                        locale={locale}
                        product={first}
                        className="col-span-1 rounded-2xl overflow-hidden min-h-[180px]"
                      >
                        <PureImageTile product={first} imageIndex={2} />
                      </TileLink>
                    </>
                  )}

                  {/* SECOND PROJECT – ugyanaz a minta lefelé */}
                  {second && (
                    <>
                      <TileLink
                        locale={locale}
                        product={second}
                        className="col-span-2 rounded-2xl bg-white min-h-[260px]"
                      >
                        <TileWithImageBackground product={second}>
                          <div className="flex h-full flex-col justify-between">
                            <div className="flex justify-between gap-2">
                              <div className="text-2xl font-semibold flex flex-col">
                                <span className="text-white">
                                  {second.badge_label}
                                </span>
                                <span className="text-gray-300 text-sm">
                                  {second.categories
                                    ?.map((c) => c.name)
                                    .join(' ') || 'Featured project'}
                                </span>
                              </div>
                              <ArrowBadge iconClassName="text-white" />
                            </div>
                            <h2 className="text-4xl font-semibold text-white mt-6 leading-none">
                              {second.name}
                            </h2>
                          </div>
                        </TileWithImageBackground>
                      </TileLink>

                      <TileLink
                        locale={locale}
                        product={second}
                        className="col-span-1 rounded-2xl bg-white min-h-[180px]"
                      >
                        <div className="relative h-full w-full overflow-hidden rounded-2xl bg-white">
                          <div className="relative z-10 flex h-full flex-col justify-between p-4">
                            <div className="flex justify-between gap-2">
                              <div className="text-lg font-semibold flex flex-col">
                                <span>
                                  {second.badge_label ||
                                    second.categories?.[0]?.name ||
                                    'Highlight'}
                                </span>
                                <span className="text-gray-500 text-xs">
                                  {truncate(second.description, 50)}
                                </span>
                              </div>
                              <ArrowBadge iconClassName="text-gray-500" />
                            </div>
                            <h2 className="text-2xl font-semibold mt-3 leading-tight">
                              {second.name}
                            </h2>
                          </div>
                        </div>
                      </TileLink>

                      <TileLink
                        locale={locale}
                        product={second}
                        className="col-span-1 rounded-2xl overflow-hidden min-h-[180px]"
                      >
                        <PureImageTile product={second} imageIndex={2} />
                      </TileLink>
                    </>
                  )}
                </div>

                {/* ----------------------- DESKTOP LAYOUT (md+) ----------------------- */}
                <div className="hidden md:grid grid-cols-6 grid-rows-12 gap-1 text-black">
                  {/* GROUP 1 – FIRST PROJECT */}
                  {first && (
                    <>
                      {/* NAGY CSEMPE BAL FENT */}
                      <TileLink
                        locale={locale}
                        product={first}
                        className="col-span-4 row-span-6 rounded-2xl bg-white"
                      >
                        <TileWithImageBackground product={first}>
                          <div className="flex h-full flex-col justify-between">
                            <div className="flex justify-between">
                              <div className="text-4xl font-semibold flex flex-col">
                                <span className="text-white">
                                  {first.badge_label || 'Featured label.'}
                                </span>
                                <span className="text-gray-300">
                                  {first.categories
                                    ?.map((c) => c.name)
                                    .join(' ') || 'Featured project.'}
                                </span>
                              </div>
                              <ArrowBadge iconClassName="text-white" />
                            </div>

                            <h2 className="text-8xl font-semibold text-white mt-16 lg:mt-40 xl:mt-60 leading-none">
                              {first.name}
                            </h2>
                          </div>
                        </TileWithImageBackground>
                      </TileLink>

                      {/* KIS SZÖVEGES CSEMPE JOBB FENT */}
                      <TileLink
                        locale={locale}
                        product={first}
                        className="col-span-2 row-span-3 col-start-5 bg-white rounded-2xl"
                      >
                        <div className="relative h-full w-full overflow-hidden rounded-2xl bg-white">
                          <div className="relative z-10 flex h-full flex-col justify-between p-6">
                            <div className="flex justify-between">
                              <div className="text-2xl font-semibold flex flex-col">
                                <span>
                                  {first.badge_label ||
                                    first.categories?.[0]?.name ||
                                    'Highlight'}
                                </span>
                                <span className="text-gray-500">
                                  {truncate(first.description, 60)}
                                </span>
                              </div>
                              <ArrowBadge iconClassName="text-gray-500" />
                            </div>

                            <h2 className="text-4xl font-semibold mt-12 leading-tight">
                              {first.name}
                            </h2>
                          </div>
                        </div>
                      </TileLink>

                      {/* KIS KÉPES CSEMPE JOBB KÖZÉP */}
                      <TileLink
                        locale={locale}
                        product={first}
                        className="col-span-2 row-span-3 col-start-5 row-start-4 bg-white rounded-2xl p-0 overflow-hidden"
                      >
                        <PureImageTile product={first} imageIndex={2} />
                      </TileLink>
                    </>
                  )}

                  {/* GROUP 2 – SECOND PROJECT */}
                  {second && (
                    <>
                      {/* NAGY CSEMPE JOBB ALSÓ */}
                      <TileLink
                        locale={locale}
                        product={second}
                        className="col-span-4 row-span-6 col-start-3 row-start-7 bg-white rounded-2xl"
                      >
                        <TileWithImageBackground product={second}>
                          <div className="flex h-full flex-col justify-between">
                            <div className="flex justify-between">
                              <div className="text-4xl font-semibold flex flex-col">
                                <span className="text-white">
                                  {second.badge_label}
                                </span>
                                <span className="text-gray-300">
                                  {second.categories
                                    ?.map((c) => c.name)
                                    .join(' ') || 'Featured project'}
                                </span>
                              </div>
                              <ArrowBadge iconClassName="text-gray-500" />
                            </div>

                            <h2 className="text-8xl font-semibold text-white mt-16 lg:mt-40 xl:mt-60 leading-none">
                              {second.name}
                            </h2>
                          </div>
                        </TileWithImageBackground>
                      </TileLink>

                      {/* KIS SZÖVEGES CSEMPE BAL ALSÓ */}
                      <TileLink
                        locale={locale}
                        product={second}
                        className="col-span-2 row-span-3 col-start-1 row-start-7 bg-white rounded-2xl"
                      >
                        <div className="relative h-full w-full overflow-hidden rounded-2xl bg-white">
                          <div className="relative z-10 flex h-full flex-col justify-between p-6">
                            <div className="flex justify-between">
                              <div className="text-2xl font-semibold flex flex-col">
                                <span>
                                  {second.badge_label ||
                                    second.categories?.[0]?.name ||
                                    'Highlight'}
                                </span>
                                <span className="text-gray-500">
                                  {truncate(second.description, 60)}
                                </span>
                              </div>
                              <ArrowBadge iconClassName="text-gray-500" />
                            </div>

                            <h2 className="text-4xl font-semibold mt-10 leading-tight">
                              {second.name}
                            </h2>
                          </div>
                        </div>
                      </TileLink>

                      {/* KIS KÉPES CSEMPE BAL LEGALUL */}
                      <TileLink
                        locale={locale}
                        product={second}
                        className="col-span-2 row-span-3 row-start-10 bg-white rounded-2xl p-0 overflow-hidden"
                      >
                        <PureImageTile product={second} imageIndex={2} />
                      </TileLink>
                    </>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/*                                   TILES                                    */
/* -------------------------------------------------------------------------- */

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
          <div className="absolute inset-0 bg-black/15" />
        </>
      )}

      <div className="relative z-10 h-full w-full p-6 md:p-8">
        {children}
      </div>
    </div>
  );
};

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
          <div className="absolute inset-0 bg-black/15" />
        </>
      ) : (
        <div className="absolute inset-0 h-full w-full bg-neutral-200" />
      )}

      <div className="relative z-10 h-full w-full flex items-end justify-end p-3 md:p-4">
        <ArrowBadge iconClassName="text-white/90" />
      </div>
    </div>
  );
};
