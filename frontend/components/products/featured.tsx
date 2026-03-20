// frontend/components/products/featured.tsx
'use client';

import React, { useMemo, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Link } from 'next-view-transitions';
import { Search, ChevronDown, ArrowUpRight as ArrowUpRightIcon } from 'lucide-react';

import { StrapiImage } from '@/components/ui/strapi-image';
import { truncate } from '@/lib/utils';
import { Product } from '@/types/types';

const arrowWheelVariants: Variants = {
  rest: { y: '0%' },
  hover: {
    y: '-100%',
    transition: { duration: 0.28, ease: [0.33, 1, 0.68, 1] },
  },
};

const ArrowBadge = ({ iconClassName = '', href }: { iconClassName?: string; href?: string }) => {
  const inner = (
    <div className="inline-flex flex-shrink-0" style={{ width: 28, height: 28, overflow: 'hidden' }}>
      <motion.div style={{ display: 'flex', flexDirection: 'column' }} variants={arrowWheelVariants}>
        <ArrowUpRightIcon className={`flex-shrink-0 ${iconClassName}`} style={{ width: 28, height: 28 }} />
        <ArrowUpRightIcon className={`flex-shrink-0 ${iconClassName}`} style={{ width: 28, height: 28 }} />
      </motion.div>
    </div>
  );
  if (href) {
    return <Link href={href as never} className="md:pointer-events-none" aria-label="Megnyitás">{inner}</Link>;
  }
  return inner;
};

export const Featured = ({ products, locale }: { products: Product[]; locale: string }) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const isHu = locale === 'hu';
  const t = {
    searchLabel:       isHu ? 'Keresés'   : 'Search',
    searchPlaceholder: isHu ? 'Keresés…'  : 'Search…',
    categoryLabel:     isHu ? 'Kategória' : 'Category',
    noResultsTitle:    isHu ? 'Nincs találat.' : 'No results found.',
    noResultsSubtitle: isHu
      ? 'Próbáld módosítani a keresést vagy a kategória szűrőt.'
      : 'Try adjusting your search term or category filter.',
  };

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.categories?.forEach((c: any) => { if (c?.name) set.add(c.name); }));
    return Array.from(set);
  }, [products]);

  const filtered = useMemo(() => {
    return products
      .filter(Boolean)
      .filter((p) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
      })
      .filter((p) => {
        if (activeCategory === 'all') return true;
        return p.categories?.some((c: any) => c?.name && c.name === activeCategory);
      });
  }, [products, search, activeCategory]);

  const featuredOnly = filtered.filter((p: any) => p?.is_featured || p?.featured);
  const listForGrid = featuredOnly.length ? featuredOnly : filtered;

  const pairs: Product[][] = [];
  for (let i = 0; i < listForGrid.length; i += 2) {
    pairs.push(listForGrid.slice(i, i + 2));
  }

  return (
    <section>
      {/* KERESŐ + KATEGÓRIA */}
      <div className="flex flex-col md:flex-row gap-1 my-10 md:my-20">
        <div className="sm:w-64">
          <label className="sr-only" htmlFor="featured-search">{t.searchLabel}</label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              id="featured-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full rounded-[6px] px-8 py-2.5 text-xs md:text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-black focus:ring-1 focus:ring-black"
            />
          </div>
        </div>
        <div className="sm:w-40">
          <label className="sr-only" htmlFor="featured-category">{t.categoryLabel}</label>
          <div className="relative">
            <select
              id="featured-category"
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className="w-full appearance-none rounded-[6px] bg-white px-3 py-2.5 pr-8 text-xs md:text-sm text-neutral-900 outline-none focus:border-black focus:ring-1 focus:ring-black"
            >
              <option value="all">{t.categoryLabel}</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          </div>
        </div>
      </div>

      {/* NINCS TALÁLAT */}
      {!listForGrid.length && (
        <div className="max-w-7xl mx-auto mt-4 rounded-[6px] border border-dashed border-neutral-200 bg-neutral-50 px-6 py-8 text-center">
          <p className="text-sm font-medium text-neutral-800">{t.noResultsTitle}</p>
          <p className="mt-2 text-xs text-neutral-500">{t.noResultsSubtitle}</p>
        </div>
      )}

      {/* MOZAIK GRID */}
      {listForGrid.length > 0 && (
        <div className="space-y-2">
          {pairs.map((pair, pairIndex) => {
            const first  = pair[0];
            const second = pair[1];

            return (
              <section key={first?.id ?? pairIndex} className="max-w-7xl mx-auto">
                {/* MOBIL */}
                <div className="grid grid-cols-2 gap-2 text-black md:hidden">
                  {first && (
                    <ProjectTriplet locale={locale} product={first} truncateLength={50} layout={{
                      large: 'col-span-2 bg-white min-h-[260px]',
                      small: 'col-span-1 bg-white min-h-[180px]',
                      image: 'col-span-1 overflow-hidden min-h-[180px]',
                      largeArrowClassName: 'text-white',
                    }} />
                  )}
                  {second && (
                    <ProjectTriplet locale={locale} product={second} truncateLength={50} layout={{
                      large: 'col-span-2 bg-white min-h-[260px]',
                      small: 'col-span-1 bg-white min-h-[180px]',
                      image: 'col-span-1 overflow-hidden min-h-[180px]',
                      largeArrowClassName: 'text-white',
                    }} />
                  )}
                </div>

                {/* DESKTOP */}
                <div className="hidden md:grid grid-cols-6 grid-rows-12 gap-2 text-black">
                  {first && (
                    <ProjectTriplet locale={locale} product={first} truncateLength={60} layout={{
                      large: 'col-span-4 row-span-6 bg-white min-h-[400px]',
                      small: 'col-span-2 row-span-3 col-start-5 bg-white',
                      image: 'col-span-2 row-span-3 col-start-5 row-start-4 bg-white p-0 overflow-hidden',
                      largeArrowClassName: 'text-white',
                    }} />
                  )}
                  {second && (
                    <ProjectTriplet locale={locale} product={second} truncateLength={60} layout={{
                      large: 'col-span-4 row-span-6 col-start-3 row-start-7 bg-white min-h-[400px]',
                      small: 'col-span-2 row-span-3 col-start-1 row-start-7 bg-white',
                      image: 'col-span-2 row-span-3 row-start-10 bg-white p-0 overflow-hidden',
                      largeArrowClassName: 'text-gray-500',
                    }} />
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

type TileLayoutSet = { large: string; small: string; image: string; largeArrowClassName?: string; };

const ProjectTriplet: React.FC<{
  product: Product; locale: string; layout: TileLayoutSet; truncateLength: number;
}> = ({ product, locale, layout, truncateLength }) => (
  <>
    <LargeTile     locale={locale} product={product} className={layout.large} arrowClassName={layout.largeArrowClassName} />
    <SmallTextTile locale={locale} product={product} className={layout.small} truncateLength={truncateLength} />
    <ImageTile     locale={locale} product={product} className={layout.image} />
  </>
);

type TileBase = { product: Product; locale: string; className?: string };

const LargeTile: React.FC<TileBase & { arrowClassName?: string }> = ({
  product, locale, className, arrowClassName,
}) => {
  const href  = `/${locale}/products/${product.slug}`;
  const label = product.categories?.[0]?.name;

  return (
    <motion.div
      className={`rounded-[6px] overflow-hidden ${className}`}
      animate="rest"
      whileHover="hover"
    >
      <Link href={href as never} className="hidden md:block h-full w-full">
        <TileWithImageBackground product={product}>
          <div className="flex h-full flex-col justify-between">
            <div className="flex justify-between gap-2">
              <span className="text-white text-xl md:text-4xl font-medium tracking-tight leading-tight">{label}</span>
              <ArrowBadge iconClassName={arrowClassName ?? 'text-white'} />
            </div>
            <h2 className="text-4xl md:text-8xl font-medium tracking-tight text-white mt-6 md:mt-16 lg:mt-40 xl:mt-60 leading-none">
              {product.name}
            </h2>
          </div>
        </TileWithImageBackground>
      </Link>
      <div className="md:hidden h-full w-full">
        <TileWithImageBackground product={product}>
          <div className="flex h-full flex-col justify-between">
            <div className="flex justify-between gap-2">
              <span className="text-white text-xl font-medium tracking-tight leading-tight">{label}</span>
              <ArrowBadge iconClassName={arrowClassName ?? 'text-white'} href={href} />
            </div>
            <h2 className="text-4xl font-medium tracking-tight text-white mt-6 leading-none">{product.name}</h2>
          </div>
        </TileWithImageBackground>
      </div>
    </motion.div>
  );
};

const SmallTextTile: React.FC<TileBase & { truncateLength: number }> = ({
  product, locale, className, truncateLength,
}) => {
  const href  = `/${locale}/products/${product.slug}`;
  const label = product.categories?.[1]?.name;

  return (
    <motion.div
      className={`rounded-[6px] overflow-hidden ${className}`}
      animate="rest"
      whileHover="hover"
    >
      <Link href={href as never} className="hidden md:block h-full w-full">
        <div className="relative h-full w-full overflow-hidden rounded-[6px] bg-white">
          <div className="relative z-10 flex h-full flex-col justify-between p-4 md:p-6">
            <div className="flex justify-between gap-2">
              <div className="flex flex-col">
                <span className="text-lg md:text-2xl font-medium tracking-tight leading-tight">{label}</span>
                <span className="text-neutral-400 text-xs md:text-sm font-light mt-1 leading-relaxed">
                  {truncate(product.description, truncateLength)}
                </span>
              </div>
              <ArrowBadge iconClassName="text-neutral-400" />
            </div>
            <h2 className="text-2xl md:text-4xl font-medium tracking-tight mt-3 md:mt-10 leading-tight">{product.name}</h2>
          </div>
        </div>
      </Link>
      <div className="md:hidden h-full w-full">
        <div className="relative h-full w-full overflow-hidden rounded-[6px] bg-white">
          <div className="relative z-10 flex h-full flex-col justify-between p-4">
            <div className="flex justify-between gap-2">
              <div className="flex flex-col">
                <span className="text-lg font-medium tracking-tight leading-tight">{label}</span>
                <span className="text-neutral-400 text-xs font-light mt-1 leading-relaxed">
                  {truncate(product.description, truncateLength)}
                </span>
              </div>
              <ArrowBadge iconClassName="text-neutral-400" href={href} />
            </div>
            <h2 className="text-2xl font-medium tracking-tight mt-3 leading-tight">{product.name}</h2>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ImageTile: React.FC<TileBase> = ({ product, locale, className }) => {
  const href = `/${locale}/products/${product.slug}`;
  return (
    <motion.div
      className={`${className} rounded-[6px] overflow-hidden`}
      animate="rest"
      whileHover="hover"
    >
      <Link href={href as never} className="hidden md:block h-full w-full">
        <PureImageTile product={product} imageIndex={2} />
      </Link>
      <div className="md:hidden h-full w-full">
        <PureImageTile product={product} imageIndex={2} mobileHref={href} />
      </div>
    </motion.div>
  );
};

const TileWithImageBackground: React.FC<{
  children: React.ReactNode; product: Product; imageIndex?: number;
}> = ({ children, product, imageIndex = 0 }) => {
  const img = product.images?.[imageIndex];
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[6px] group">
      {img?.url && (
        <>
          <StrapiImage
            src={img.url}
            alt={img.alternativeText || product.name}
            width={1600}
            height={900}
            className="absolute inset-0 h-full w-full object-cover scale-[1.03] transition-transform duration-500 ease-out group-hover:scale-100"
          />
          <div className="absolute inset-0 bg-black/20 transition-colors duration-500 group-hover:bg-black/40" />
        </>
      )}
      <div className="relative z-10 h-full w-full p-6 md:p-8">{children}</div>
    </div>
  );
};

const PureImageTile: React.FC<{ product: Product; imageIndex?: number; mobileHref?: string }> = ({
  product, imageIndex = 0, mobileHref,
}) => {
  const img = product.images?.[imageIndex] || product.images?.[0];
  return (
    <div className="relative h-full w-full group">
      {img?.url ? (
        <>
          <StrapiImage
            src={img.url}
            alt={img.alternativeText || product.name}
            width={1600}
            height={900}
            className="absolute inset-0 h-full w-full object-cover scale-[1.03] transition-transform duration-500 ease-out group-hover:scale-100"
          />
          <div className="absolute inset-0 bg-black/20 transition-colors duration-500 group-hover:bg-black/40" />
        </>
      ) : (
        <div className="absolute inset-0 h-full w-full bg-neutral-200" />
      )}
      <div className="relative z-10 h-full w-full flex items-end justify-end p-3 md:p-4">
        <ArrowBadge iconClassName="text-white/90" href={mobileHref} />
      </div>
    </div>
  );
};