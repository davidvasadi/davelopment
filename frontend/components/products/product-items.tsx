// frontend/components/products/product-items.tsx
// Termék lista – Framer-szerű kártyák, max 2 projekt

import { Link } from 'next-view-transitions';
import React from 'react';

import { StrapiImage } from '@/components/ui/strapi-image';
import { formatNumber, truncate } from '@/lib/utils';
import { Product } from '@/types/types';
import { Heading } from '@/components/elements/heading';
import { Subheading } from '@/components/elements/subheading';


export const ProductItems = ({
  heading = 'Projects',
  sub_heading = 'Selected case studies and recent work.',
  products,
  locale,
}: {
  heading?: string;
  sub_heading?: string;
  products: Product[];
  locale: string;
}) => {
  const visibleProducts = products.slice(0, 2);

  return (
    <section className="py-20">
      <Heading className=''>
        {heading}
      {/* <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4"> */}
      <Subheading className='text-left text-black '>
        {sub_heading}
      </Subheading>
        
      </Heading>
      {/* </div> */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {visibleProducts.map((product) => (
          <ProductItem
            key={'regular-product-item' + product.id}
            product={product}
            locale={locale}
          />
        ))}
      </div>
    </section>
  );
};

const ProductItem = ({
  product,
  locale,
}: {
  product: Product;
  locale: string;
}) => {
  const firstImage = product?.images?.[0];

  const primaryCategory =
    product.categories && product.categories[0]?.name
      ? product.categories[0].name
      : 'Case study';

  return (
    <Link
      href={`/${locale}/products/${product.slug}` as never}
      className="group block h-full"
    >
      {/* Framer-szerű fehér kártya */}
      <article className="flex h-full flex-col rounded-xl bg-white ring-1 ring-neutral-200/80 transition-all duration-300 group-hover:-translate-y-1">
        {/* KÉP */}
        <div className="p-3 pb-0">
          <div className="relative overflow-hidden rounded-xl">
            {/* maga a kép */}
            <div className="aspect-[4/3]">
              {firstImage?.url ? (
                <StrapiImage
                  src={firstImage.url}
                  alt={firstImage.alternativeText || product.name}
                  width={1000}
                  height={750}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              ) : (
                <div className="h-full w-full bg-neutral-100" />
              )}
            </div>

            {/* sötétítő overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            {/* hover infó + CTA */}
            <div className="pointer-events-none absolute inset-x-4 bottom-4 flex flex-col gap-2 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
              {/* rövid leírás a képen */}
              <p className="text-[11px] leading-snug text-white/85 max-h-[3.1rem] overflow-hidden">
                {truncate(product.description, 80)}
              </p>

              <div className="flex items-center justify-between gap-3">
                {/* view project pill */}
                <div className="inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1 text-[11px] font-medium text-black shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-black/80" />
                  <span>View project</span>
                  <span className="-mr-1 text-xs">↗</span>
                </div>

                {/* kategória badge */}
                <span className="hidden md:inline-flex items-center rounded-full bg-black/70 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-white/85">
                  {primaryCategory}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT – cím balra, ár jobbra */}
        <div className="flex flex-col gap-2 px-3 pb-4 pt-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm md:text-base font-semibold text-black">
              {product.name}
            </h3>
            <span className="inline-flex shrink-0 items-center rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">
              ${formatNumber(product.price)}
            </span>
          </div>

          <p className="text-xs md:text-sm leading-relaxed text-neutral-500">
            {truncate(product.description, 90)}
          </p>
        </div>
      </article>
    </Link>
  );
};
