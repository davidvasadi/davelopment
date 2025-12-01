// frontend/components/products/single-product.tsx
// termék oldal egyedi megjelenítése
'use client';

import { IconCheck } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import React, { useState } from 'react';

import { StrapiImage } from '@/components/ui/strapi-image';
import { strapiImage } from '@/lib/strapi/strapiImage';
import { Product } from '@/types/types';
import { PlusIcon } from 'lucide-react';
import { Button } from '@/components/elements/button';
import { Logo } from '@/components/logo';

// kis helper: standard fade-up animáció mindenre
const fadeUp = (
  delay = 0,
  distance = 40
): {
  initial: any;
  whileInView: any;
  viewport: any;
  transition: any;
} => ({
  initial: { opacity: 0, y: distance },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, amount: 0.2 },
  transition: { duration: 0.6, ease: 'easeOut', delay },
});

export const SingleProduct = ({
  product,
  locale,
}: {
  product: Product;
  locale: string;
}) => {
  // --- 0. KÉPGYŰJTÉS: az első kép NE kerüljön erre az oldalra ---
  const galleryImages = product.images?.slice(1) ?? [];

  // aktív kép = galleryImages[0], ha létezik
  const [activeThumbnail] = useState<string>(
    galleryImages[0] ? strapiImage(galleryImages[0].url) : ''
  );

  // második nagy kép: galleryImages[1], ha van
  const secondImageUrl =
    galleryImages[1]?.url ? strapiImage(galleryImages[1].url) : null;

  // wide szekció: a maradék képek (galleryImages[2..])
  const wideImages = galleryImages.slice(2);

  // LOGO: próbáljuk kiszedni a product-ból
  const rawLogo: any =
    (product as any)?.logo ?? (product as any)?.client_logo ?? null;

  let productLogoImage: any = null;
  if (rawLogo) {
    if (rawLogo.url) {
      productLogoImage = rawLogo;
    } else if (rawLogo.image?.url) {
      productLogoImage = rawLogo.image;
    }
  }

  return (
    <div className="">
      {/* FELSŐ HEADING + LEÍRÁS */}
      <motion.section
        className="my-12 mt-[200px] md:mt-[150px]"
        {...fadeUp(0)}
      >
        <motion.h2
          className="text-6xl md:text-[140px] font-bold mb-4 text-black"
          {...fadeUp(0.05, 50)}
        >
          {product.name}
        </motion.h2>

        <motion.div
          className="flex flex-col md:flex-row justify-start md:justify-between mt-[100px]"
          {...fadeUp(0.1, 30)}
        >
          <div className="flex text-sm text-black font-semibold mb-4">
            <span>
              <PlusIcon className="inline-block w-5 h-5 mr-1 bg-black text-white rounded-full p-1 " />
            </span>
            {product.badge_label}
          </div>
          <p className="font-regular mb-4 text-black max-w-lg indent-16 text-lg">
            {product.description}
          </p>
        </motion.div>
      </motion.section>

      <div>
        {/* TIMELINE */}
        <motion.div className="border-t-2" {...fadeUp(0.05, 20)}>
          <div className="divide-y-2">
            {/* ROW 1 – Year */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-9 gap-4 py-4 items-baseline"
              {...fadeUp(0.05, 20)}
            >
              <div className="col-span-5" />
              <div className="text-black col-span-2">Year</div>
              <div className="text-black col-span-2 md:ml-32 lg:ml-40">
                {product.price}
              </div>
            </motion.div>

            {/* ROW 2 – Industry */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-9 gap-4 py-4 items-baseline"
              {...fadeUp(0.08, 20)}
            >
              <div className="col-span-5" />
              <div className="text-black col-span-2">Industry</div>
              <div className="text-black col-span-2 md:ml-32 lg:ml-40">
                {product.price}
              </div>
            </motion.div>

            {/* ROW 3 – Scope of work */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-9 gap-4 py-4 items-baseline"
              {...fadeUp(0.11, 20)}
            >
              <div className="col-span-5" />
              <div className="text-black col-span-2">Scope of work</div>
              <div className="text-black col-span-2 md:ml-32 lg:ml-40">
                {product.price}
              </div>
            </motion.div>

            {/* ROW 4 – Timeline */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-9 gap-4 py-4 items-baseline"
              {...fadeUp(0.14, 20)}
            >
              <div className="col-span-5" />
              <div className="text-black col-span-2">Timeline</div>
              <div className="text-black col-span-2 md:ml-32 lg:ml-40">
                {product.price}
              </div>
            </motion.div>

            {/* LOGO – ha van image url */}
            {productLogoImage?.url && (
              <motion.div
                className="grid grid-rows md:grid-cols-9 gap-8 py-2 md:py-4 border-none mt-12"
                {...fadeUp(0.18, 20)}
              >
                <div className="col-span-5" />
                <div className="text-black col-span-2">
                  <Logo image={productLogoImage} locale={locale} />
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* KÉP BLOKK – KÉT NAGY KÉP */}
        {galleryImages.length > 0 && (
          <motion.div className="mt-16 md:mt-20" {...fadeUp(0.05, 40)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-2">
              {/* bal: aktív nagy kép (galleryImages[0]) */}
              {activeThumbnail && (
                <motion.div
                  key={activeThumbnail}
                  className="relative overflow-hidden rounded-xl"
                  {...fadeUp(0.05, 30)}
                >
                  <div>
                    <div className="relative w-full aspect-[4/3] md:aspect-[3/2] rounded-2xl overflow-hidden">
                      <StrapiImage
                        src={activeThumbnail}
                        alt={product.name}
                        width={900}
                        height={700}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* jobb: második nagy kép (galleryImages[1]) */}
              {secondImageUrl && (
                <motion.div
                  className="relative overflow-hidden rounded-2xl"
                  {...fadeUp(0.1, 30)}
                >
                  <div>
                    <div className="relative w-full aspect-[4/3] md:aspect-[3/2] rounded-2xl overflow-hidden">
                      <StrapiImage
                        src={secondImageUrl}
                        alt={product.name}
                        width={900}
                        height={700}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* felső középső szövegblokkok + gomb */}
        <motion.div
          className="grid grid-rows md:grid-cols-2 mt-[100px]"
          {...fadeUp(0.05, 40)}
        >
          <div>
            <div className="flex items-center text-sm text-black font-semibold mb-4">
              <span>
                <PlusIcon className="inline-block w-5 h-5 mr-1 bg-black text-white rounded-full p-1 " />
              </span>
              {product.badge_label_center}
            </div>
          </div>
          <div>
            <div className="text-3xl font-medium text-black">
              {product.heading_center}
            </div>
            <p className="font-regular text-black max-w-lg text-lg mt-10">
              {product.description_center}
            </p>
            <motion.div
              {...fadeUp(0.08, 20)}
              className="inline-block mt-10"
            >
              <Button className="py-2">{product.button_center}</Button>
            </motion.div>
          </div>
        </motion.div>

        {/* WIDE KÉPEK – az első oldal-kép utáni összes, a két nagy kép UTÁN */}
        {wideImages.length > 0 && (
          <section className="mt-[120px] space-y-2">
            {wideImages.map((img: any, index: number) => (
              <motion.div
                key={`wide-${index}`}
                className="w-full overflow-hidden rounded-md"
                {...fadeUp(0.05 + index * 0.04, 40)}
              >
                <StrapiImage
                  src={strapiImage(img.url)}
                  alt={img.alternativeText || product.name}
                  width={1600}
                  height={900}
                  className="w-full h-auto object-cover"
                />
              </motion.div>
            ))}
          </section>
        )}

        {/* PLANS + CATEGORIES + BOTTOM SECTION */}
        <motion.div className="mt-[100px]" {...fadeUp(0.05, 40)}>
          <motion.h3
            className="text-sm font-medium text-neutral-400 mb-2"
            {...fadeUp(0.05, 20)}
          >
            Available for
          </motion.h3>
          <motion.ul
            className="list-none flex gap-4 flex-wrap"
            {...fadeUp(0.08, 20)}
          >
            {product.plans &&
              product.plans.map((plan, index) => (
                <motion.li
                  key={index}
                  className="bg-neutral-800 text-sm text-white px-3 py-1 rounded-full font-medium"
                  {...fadeUp(0.08 + index * 0.03, 10)}
                >
                  {plan.name}
                </motion.li>
              ))}
          </motion.ul>

          <motion.h3
            className="text-sm font-medium text-neutral-400 mb-2 mt-8"
            {...fadeUp(0.1, 20)}
          >
            Categories
          </motion.h3>
          <motion.ul
            className="flex gap-4 flex-wrap"
            {...fadeUp(0.12, 20)}
          >
            {product.categories &&
              product.categories?.map((category, idx) => (
                <motion.li
                  key={`category-${idx}`}
                  className="bg-neutral-800 text-sm text-white px-3 py-1 rounded-full font-medium"
                  {...fadeUp(0.12 + idx * 0.03, 10)}
                >
                  {category.name}
                </motion.li>
              ))}
          </motion.ul>

          <motion.div
            className="grid grid-rows md:grid-cols-2 mt-[100px]"
            {...fadeUp(0.15, 40)}
          >
            <div>
              <div className="flex items-center text-sm text-black font-semibold mb-4">
                <span>
                  <PlusIcon className="inline-block w-5 h-5 mr-1 bg-black text-white rounded-full p-1 " />
                </span>
                {product.badge_label_bottom}
              </div>
            </div>
            <div>
              <div className="text-3xl font-medium text-black">
                {product.heading_bottom}
              </div>
              <p className="font-regular text-black max-w-lg text-lg mt-10">
                {product.description_bottom}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* bottom CTA gomb */}
      <motion.div className="mt-12 inline-block" {...fadeUp(0.05, 30)}>
        <Button className="py-2">{product.button_bottom}</Button>
      </motion.div>
    </div>
  );
};

// ha kell, ez maradhat lent is
const Divider = () => {
  return (
    <div className="relative">
      <div className="w-full h-px bg-red-500" />
      <div className="w-full h-px bg-neutral-800" />
    </div>
  );
};

const Step = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-start justify-start gap-2 my-4">
      <div className="h-4 w-4 rounded-full bg-neutral-700 flex items-center justify-center flex-shrink-0 mt-0.5">
        <IconCheck className="h-3 w-3 [stroke-width:4px] text-neutral-300" />
      </div>
      <div className="font-medium text-white text-sm">{children}</div>
    </div>
  );
};
