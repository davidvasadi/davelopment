// frontend/components/dynamic-zone/projects.tsx
'use client';

import React, { useRef, useMemo } from 'react';
import { motion, type Variants, useScroll, useTransform } from 'framer-motion';
import { Link } from 'next-view-transitions';

import { StrapiImage } from '@/components/ui/strapi-image';
import { Product } from '@/types/types';
import { truncate } from '@/lib/utils';
import { getLocalizedSegment } from '@/lib/i18n/segments';
import { localizedCategories } from '@/lib/category-locale';
import { PlusIcon, ArrowUpRight as ArrowUpRightIcon } from 'lucide-react';

const arrowWheelVariants: Variants = {
  rest: { y: '0%' },
  hover: {
    y: '-100%',
    transition: { duration: 0.28, ease: [0.33, 1, 0.68, 1] },
  },
};

type Chip = { id?: number; label?: string | null };

type ProjectCardFromStrapi = {
  id?: number;
  product?: any;
  badge_label?: string | null;
  result_line?: string | null;
  tags?: Chip[];
  is_featured?: boolean;
};

type ProjectsProps = {
  id?: number;
  badge_label?: string | null;
  heading?: string | null;
  sub_heading?: string | null;
  projects?: ProjectCardFromStrapi[];
  locale: string;
};

type ProjectWithProduct = {
  project: ProjectCardFromStrapi;
  product: Product;
};

const projectHref = (locale: string, slug: string) =>
  `/${locale}/${getLocalizedSegment(locale, 'products')}/${slug}`;

const getProductFromProject = (project: ProjectCardFromStrapi): Product | undefined => {
  const raw = project.product as any;
  if (!raw) return undefined;
  if ('slug' in raw) return raw as Product;
  if (typeof raw === 'object') return raw as Product;
  return undefined;
};

export const Projects: React.FC<ProjectsProps> = ({
  badge_label,
  heading,
  sub_heading,
  projects = [],
  locale,
}) => {
  const allItems: ProjectWithProduct[] = useMemo(() =>
    (projects ?? [])
      .map((p) => {
        const product = getProductFromProject(p);
        if (!product) return undefined;
        return { project: p, product };
      })
      .filter((x): x is ProjectWithProduct => !!x),
    [projects]
  );

  const first  = allItems[0];
  const second = allItems[1];

  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 70%', 'end 30%'],
  });
  const headerY       = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const headerScale   = useTransform(scrollYProgress, [0, 1], [1, 0.98]);
  const headerOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.92]);

  const isHu = locale === 'hu';

  return (
    <div ref={sectionRef} className="relative py-24 md:py-28 lg:py-32">
      <div className="relative z-10 w-full px-4 md:px-8">
        <Header
          badge_label={badge_label}
          heading={heading}
          sub_heading={sub_heading}
          locale={locale}
          headerY={headerY}
          headerScale={headerScale}
          headerOpacity={headerOpacity}
        />

        <div className="mt-8 md:mt-16">
          <div className=" mx-auto">

            {/* NINCS TALÁLAT */}
            {!first && (
              <div className="rounded-card border border-dashed border-neutral-200 bg-neutral-50 px-6 py-8 text-center">
                <p className="text-sm font-medium text-neutral-800">
                  {isHu ? 'Jelenleg nincs beállított projekt ebben a szekcióban.' : 'No projects configured in this section.'}
                </p>
              </div>
            )}

            {/* MOBIL */}
            {first && (
              <div className="grid grid-cols-2 gap-2 text-black md:hidden">
                <ProjectTriplet locale={locale} item={first} truncateLength={50} layout={{
                  large: 'col-span-2 bg-white min-h-[260px]',
                  small: 'col-span-1 bg-white min-h-[180px]',
                  image: 'col-span-1 overflow-hidden min-h-[180px]',
                  largeArrowClassName: 'text-white',
                }} />
                {second && (
                  <ProjectTriplet locale={locale} item={second} truncateLength={50} layout={{
                    large: 'col-span-2 bg-white min-h-[260px]',
                    small: 'col-span-1 bg-white min-h-[180px]',
                    image: 'col-span-1 overflow-hidden min-h-[180px]',
                    largeArrowClassName: 'text-white',
                  }} />
                )}
              </div>
            )}

            {/* DESKTOP */}
            {first && (
              <div className="hidden md:grid grid-cols-6 grid-rows-12 gap-2 md:gap-3 text-black">
                <ProjectTriplet locale={locale} item={first} truncateLength={60} layout={{
                  large: 'col-span-4 row-span-6 bg-white',
                  small: 'col-span-2 row-span-3 col-start-5 bg-white',
                  image: 'col-span-2 row-span-3 col-start-5 row-start-4 bg-white p-0 overflow-hidden',
                  largeArrowClassName: 'text-white',
                }} />
                {second && (
                  <ProjectTriplet locale={locale} item={second} truncateLength={60} layout={{
                    large: 'col-span-4 row-span-6 col-start-3 row-start-7 bg-white',
                    small: 'col-span-2 row-span-3 col-start-1 row-start-7 bg-white',
                    image: 'col-span-2 row-span-3 row-start-10 bg-white p-0 overflow-hidden',
                    largeArrowClassName: 'text-gray-500',
                  }} />
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

const Header = ({
  badge_label, heading, sub_heading, locale, headerY, headerScale, headerOpacity,
}: {
  badge_label?: string | null;
  heading?: string | null;
  sub_heading?: string | null;
  locale: string;
  headerY: any;
  headerScale: any;
  headerOpacity: any;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
  >
    <motion.div style={{ y: headerY, scale: headerScale, opacity: headerOpacity }}>
      {badge_label && (
        <div className="mb-6 flex items-center gap-2">
          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-black">
            <PlusIcon className="h-2.5 w-2.5 text-white" />
          </div>
          <span className="text-sm font-medium text-gray-700">{badge_label}</span>
        </div>
      )}
      {/* ugyanaz a szabály, mint a „Hogyan dolgozunk” és a „Szolgáltatások” fejlécénél: cím balra, szöveg + link jobbra
          (a két szélen, alul igazítva); szűkülő képernyőn a cím tördel; mobilon egymás alatt */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-10">
        {heading && (
          <h2 className="min-w-0 flex-1 text-4xl font-semibold leading-[0.95] tracking-[-0.04em] text-black md:text-6xl xl:text-7xl">
            {heading}
          </h2>
        )}
        <div className="flex max-w-md flex-col items-start md:max-w-xs md:shrink-0 md:items-end md:pb-1 md:text-right">
          {sub_heading && (
            <p className="text-base leading-relaxed text-black/60 md:text-lg">{sub_heading}</p>
          )}
          <Link
            href={`/${locale}/${getLocalizedSegment(locale, 'products')}` as never}
            className="mt-5 inline-block border-b-2 border-black pb-0.5 text-sm font-semibold text-black transition-opacity hover:opacity-60 md:text-base"
          >
            {locale === 'hu' ? 'Összes projekt' : 'All projects'}
          </Link>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

const ArrowBadge = ({ iconClassName = '', href, label }: { iconClassName?: string; href?: string; label?: string }) => {
  const inner = (
    <div className="inline-flex flex-shrink-0 w-7 h-7 overflow-hidden">
      <motion.div className="flex flex-col" variants={arrowWheelVariants}>
        <ArrowUpRightIcon className={`flex-shrink-0 w-7 h-7 ${iconClassName}`} />
        <ArrowUpRightIcon className={`flex-shrink-0 w-7 h-7 ${iconClassName}`} />
      </motion.div>
    </div>
  );
  if (href) {
    // a projekt neve szöveges horgonyként (sr-only) — a csak-ikonos link így sem „szöveg nélküli” a keresőknek
    return <Link href={href as never} className="md:pointer-events-none">{inner}<span className="sr-only">{label}</span></Link>;
  }
  return inner;
};

type TileLayoutSet = {
  large: string;
  small: string;
  image: string;
  largeArrowClassName?: string;
};

const ProjectTriplet: React.FC<{
  item: ProjectWithProduct;
  locale: string;
  layout: TileLayoutSet;
  truncateLength: number;
}> = ({ item, locale, layout, truncateLength }) => (
  <>
    <LargeTile     locale={locale} item={item} className={layout.large} arrowClassName={layout.largeArrowClassName} />
    <SmallTextTile locale={locale} item={item} className={layout.small} truncateLength={truncateLength} />
    <ImageTile     locale={locale} item={item} className={layout.image} imageIndex={2} />
  </>
);

type TileBaseProps = { item: ProjectWithProduct; locale: string; className?: string };

const LargeTile: React.FC<TileBaseProps & { arrowClassName?: string }> = ({
  item, locale, className, arrowClassName,
}) => {
  const { product } = item;
  // a blokk saját, nyelvenkénti címkéje az elsődleges — a termék-kategóriák nincsenek nyelvesítve (vegyes HU/EN nevek)
  const label = item.project.badge_label || localizedCategories(product.categories as any[], locale)[0]?.name || 'Highlight';
  const href = projectHref(locale, product.slug);

  return (
    <motion.div
      className={`rounded-card overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.55, ease: [0.33, 1, 0.68, 1] }}
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
            <p className="text-4xl md:text-8xl font-medium tracking-tight text-white mt-6 md:mt-16 lg:mt-40 xl:mt-60 leading-none">
              {product.name}
            </p>
          </div>
        </TileWithImageBackground>
      </Link>
      <div className="md:hidden h-full w-full">
        <TileWithImageBackground product={product}>
          <div className="flex h-full flex-col justify-between">
            <div className="flex justify-between gap-2">
              <span className="text-white text-xl font-medium tracking-tight leading-tight">{label}</span>
              <ArrowBadge iconClassName={arrowClassName ?? 'text-white'} href={href} label={product.name} />
            </div>
            <p className="text-4xl font-medium tracking-tight text-white mt-6 leading-none">{product.name}</p>
          </div>
        </TileWithImageBackground>
      </div>
    </motion.div>
  );
};

const SmallTextTile: React.FC<TileBaseProps & { truncateLength: number }> = ({
  item, locale, className, truncateLength,
}) => {
  const { product, project } = item;
  // a blokk saját, nyelvenkénti címkéje az elsődleges — a termék-kategóriák nincsenek nyelvesítve (vegyes HU/EN nevek)
  const label = item.project.badge_label || localizedCategories(product.categories as any[], locale)[1]?.name || localizedCategories(product.categories as any[], locale)[0]?.name || 'Highlight';
  const href = projectHref(locale, product.slug);

  return (
    <motion.div
      className={`rounded-card overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.55, delay: 0.08, ease: [0.33, 1, 0.68, 1] }}
      animate="rest"
      whileHover="hover"
    >
      <Link href={href as never} className="hidden md:block h-full w-full">
        <div className="relative h-full w-full overflow-hidden rounded-card bg-white">
          <div className="relative z-10 flex h-full flex-col justify-between p-4 md:p-6">
            <div className="flex justify-between gap-2">
              <div className="flex flex-col">
                <span className="text-lg md:text-2xl font-medium tracking-tight leading-tight">{label}</span>
                <span className="text-neutral-400 text-xs md:text-sm font-light mt-1 leading-relaxed">
                  {truncate(project.result_line || product.description, truncateLength)}
                </span>
              </div>
              <ArrowBadge iconClassName="text-neutral-400" />
            </div>
            <p className="text-2xl md:text-4xl font-medium tracking-tight mt-3 md:mt-10 leading-tight">{product.name}</p>
          </div>
        </div>
      </Link>
      <div className="md:hidden h-full w-full">
        <div className="relative h-full w-full overflow-hidden rounded-card bg-white">
          <div className="relative z-10 flex h-full flex-col justify-between p-4">
            <div className="flex justify-between gap-2">
              <div className="flex flex-col">
                <span className="text-lg font-medium tracking-tight leading-tight">{label}</span>
                <span className="text-neutral-400 text-xs font-light mt-1 leading-relaxed">
                  {truncate(project.result_line || product.description, truncateLength)}
                </span>
              </div>
              <ArrowBadge iconClassName="text-neutral-400" href={href} label={product.name} />
            </div>
            <p className="text-2xl font-medium tracking-tight mt-3 leading-tight">{product.name}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ImageTile: React.FC<TileBaseProps & { imageIndex?: number }> = ({
  item, locale, className, imageIndex = 0,
}) => {
  const href = projectHref(locale, item.product.slug);
  return (
    <motion.div
      className={`${className} rounded-card overflow-hidden`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.55, delay: 0.16, ease: [0.33, 1, 0.68, 1] }}
      animate="rest"
      whileHover="hover"
    >
      <Link href={href as never} className="hidden md:block h-full w-full">
        <span className="sr-only">{item.product.name}</span>
        <PureImageTile product={item.product} imageIndex={imageIndex} />
      </Link>
      <div className="md:hidden h-full w-full">
        <PureImageTile product={item.product} imageIndex={imageIndex} mobileHref={href} />
      </div>
    </motion.div>
  );
};

const TileWithImageBackground: React.FC<{
  children: React.ReactNode;
  product: Product;
  imageIndex?: number;
}> = ({ children, product, imageIndex = 0 }) => {
  const img = product.images?.[imageIndex];
  return (
    <div className="relative h-full w-full overflow-hidden rounded-card group">
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
        <ArrowBadge iconClassName="text-white/90" href={mobileHref} label={product.name} />
      </div>
    </div>
  );
};

export default Projects;