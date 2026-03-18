// frontend/components/products/single-product.tsx
'use client';

import { IconCheck } from '@tabler/icons-react';
import { motion, type Variants } from 'framer-motion';
import React, { useState } from 'react';

import { StrapiImage } from '@/components/ui/strapi-image';
import { strapiImage } from '@/lib/strapi/strapiImage';
import { Product } from '@/types/types';
import { PlusIcon } from 'lucide-react';
import { Logo } from '@/components/logo';

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

const wheelVariants: Variants = {
  rest: { y: '-50%' },
  hover: { y: '0%', transition: { duration: 0.3, ease: 'easeInOut' } },
};

const dotVariants: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.4, transition: { duration: 0.4, ease: 'easeInOut' } },
};

export const SingleProduct = ({
  product,
  locale,
}: {
  product: Product;
  locale: string;
}) => {
  const isHu = locale === 'hu';

  const {
    badge_label_center,
    heading_center,
    description_center,
    button_center,
    badge_label_bottom,
    heading_bottom,
    description_bottom,
    button_bottom,
    year,
    industry,
    scope,
    timeline,
  } = product as any;

  const galleryImages = product.images?.slice(1) ?? [];

  const [activeThumbnail] = useState<string>(
    galleryImages[0] ? strapiImage(galleryImages[0].url) : ''
  );

  const secondImageUrl =
    galleryImages[1]?.url ? strapiImage(galleryImages[1].url) : null;

  const wideImages = galleryImages.slice(2);

  const rawLogo: any =
    (product as any)?.logo ?? (product as any)?.client_logo ?? null;

  let productLogoImage: any = null;
  if (rawLogo) {
    if (rawLogo.url) productLogoImage = rawLogo;
    else if (rawLogo.image?.url) productLogoImage = rawLogo.image;
  }

  // Timeline sorok — csak ha van érték
  const timelineRows = [
    { label: isHu ? 'Év' : 'Year',              value: year },
    { label: isHu ? 'Iparág' : 'Industry',      value: industry },
    { label: isHu ? 'Munkaterület' : 'Scope of work', value: scope },
    { label: isHu ? 'Időkeret' : 'Timeline',    value: timeline },
  ].filter((row) => row.value);

  return (
    <div className="">

      {/* FELSŐ HEADING + LEÍRÁS */}
      <motion.section className="my-12 mt-[200px] md:mt-[150px]" {...fadeUp(0)}>
        <motion.h2
className="text-6xl md:text-[140px] font-semibold mb-4 text-black max-w-4xl"          {...fadeUp(0.05, 50)}
        >
          {product.name}
        </motion.h2>

        <motion.div
          className="flex flex-col md:flex-row justify-start md:justify-between mt-[100px]"
          {...fadeUp(0.1, 30)}
        >
          <div className="flex text-sm text-black font-semibold mb-4">
            <span>
              <PlusIcon className="inline-block w-5 h-5 mr-1 bg-black text-white rounded-full p-1" />
            </span>
            {product.badge_label}
          </div>
          <p className="font-regular mb-4 text-black max-w-lg indent-16 text-lg">
            {product.description}
          </p>
        </motion.div>
      </motion.section>

      <div>

        {/* TIMELINE — Framer stílusú, két oszlop */}
        <motion.div className="border-t border-neutral-200 mt-4" {...fadeUp(0.05, 20)}>
          {timelineRows.map((row, i) => (
            <motion.div
              key={i}
              className="flex justify-between items-baseline border-b border-neutral-200 py-5"
              {...fadeUp(0.05 + i * 0.03, 20)}
            >
              <span className="text-neutral-400 text-sm">{row.label}</span>
              <span className="text-black text-sm font-medium">{row.value}</span>
            </motion.div>
          ))}

          {/* LOGO — timeline alatt */}
          {productLogoImage?.url && (
            <motion.div
              className="py-8"
              {...fadeUp(0.18, 20)}
            >
              <Logo image={productLogoImage} locale={locale} />
            </motion.div>
          )}
        </motion.div>

        {/* KÉP BLOKK – KÉT NAGY KÉP */}
        {galleryImages.length > 0 && (
          <motion.div className="mt-16 md:mt-20" {...fadeUp(0.05, 40)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {activeThumbnail && (
                <motion.div
                  key={activeThumbnail}
                  className="relative overflow-hidden rounded-xl"
                  {...fadeUp(0.05, 30)}
                >
                  <div className="relative w-full aspect-[4/3] md:aspect-[3/2] rounded-2xl overflow-hidden">
                    <StrapiImage
                      src={activeThumbnail}
                      alt={product.name}
                      width={900}
                      height={700}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </motion.div>
              )}

              {secondImageUrl && (
                <motion.div
                  className="relative overflow-hidden rounded-2xl"
                  {...fadeUp(0.1, 30)}
                >
                  <div className="relative w-full aspect-[4/3] md:aspect-[3/2] rounded-2xl overflow-hidden">
                    <StrapiImage
                      src={secondImageUrl}
                      alt={product.name}
                      width={900}
                      height={700}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* KÖZÉPSŐ SZÖVEGBLOKK + GOMB */}
        <motion.div
          className="grid grid-rows md:grid-cols-2 mt-[100px]"
          {...fadeUp(0.05, 40)}
        >
          <div>
            <div className="flex items-center text-sm text-black font-semibold mb-4">
              <span>
                <PlusIcon className="inline-block w-5 h-5 mr-1 bg-black text-white rounded-full p-1" />
              </span>
              {badge_label_center}
            </div>
          </div>
          <div>
            <div className="text-3xl font-medium text-black">{heading_center}</div>
            <p className="font-regular text-black max-w-lg text-lg mt-10">{description_center}</p>

            {button_center?.text && (
              <motion.div {...fadeUp(0.08, 20)} className="inline-block mt-10">
                <motion.a
                  href={button_center.URL}
                  target={button_center.target ?? '_blank'}
                  rel="noopener noreferrer"
                  className="bg-black text-white font-semibold px-4 py-2 rounded-full inline-flex items-center gap-4 overflow-hidden"
                  initial="rest"
                  whileHover="hover"
                  animate="rest"
                >
                  <div className="overflow-hidden h-6">
                    <motion.div className="flex flex-col" variants={wheelVariants}>
                      <span>{button_center.text}</span>
                      <span>{button_center.text}</span>
                    </motion.div>
                  </div>
                  <motion.div className="w-2 h-2 rounded-full bg-white shrink-0" variants={dotVariants} />
                </motion.a>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* WIDE KÉPEK */}
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

          {product.plans && product.plans.length > 0 && (
            <>
              <motion.h3
                className="text-sm font-medium text-neutral-400 mb-2"
                {...fadeUp(0.05, 20)}
              >
                {isHu ? 'Elérhető' : 'Available for'}
              </motion.h3>
              <motion.ul className="list-none flex gap-4 flex-wrap" {...fadeUp(0.08, 20)}>
                {product.plans.map((plan, index) => (
                  <motion.li
                    key={index}
                    className="bg-neutral-800 text-sm text-white px-3 py-1 rounded-full font-medium"
                    {...fadeUp(0.08 + index * 0.03, 10)}
                  >
                    {plan.name}
                  </motion.li>
                ))}
              </motion.ul>
            </>
          )}

          {product.categories && product.categories.length > 0 && (
            <>
              <motion.h3
                className="text-sm font-medium text-neutral-400 mb-2 mt-8"
                {...fadeUp(0.1, 20)}
              >
                {isHu ? 'Kategóriák' : 'Categories'}
              </motion.h3>
              <motion.ul className="flex gap-4 flex-wrap" {...fadeUp(0.12, 20)}>
                {product.categories.map((category, idx) => (
                  <motion.li
                    key={`category-${idx}`}
                    className="bg-neutral-800 text-sm text-white px-3 py-1 rounded-full font-medium"
                    {...fadeUp(0.12 + idx * 0.03, 10)}
                  >
                    {category.name}
                  </motion.li>
                ))}
              </motion.ul>
            </>
          )}

          <motion.div
            className="grid grid-rows md:grid-cols-2 mt-[100px]"
            {...fadeUp(0.15, 40)}
          >
            <div>
              <div className="flex items-center text-sm text-black font-semibold mb-4">
                <span>
                  <PlusIcon className="inline-block w-5 h-5 mr-1 bg-black text-white rounded-full p-1" />
                </span>
                {badge_label_bottom}
              </div>
            </div>
            <div>
              <div className="text-3xl font-medium text-black">{heading_bottom}</div>
              <p className="font-regular text-black max-w-lg text-lg mt-10">{description_bottom}</p>
            </div>
          </motion.div>

        </motion.div>

      </div>

      {/* BOTTOM CTA GOMB */}
      {button_bottom?.text && (
        <motion.div className="mt-12 inline-block" >
          <motion.a
            href={button_bottom.URL}
            target={button_bottom.target ?? '_self'}
            className="bg-black text-white font-semibold px-4 py-2 rounded-full inline-flex items-center gap-4 overflow-hidden"
            initial="rest"
            whileHover="hover"
            animate="rest"
          >
            <div className="overflow-hidden h-6">
              <motion.div className="flex flex-col" variants={wheelVariants}>
                <span>{button_bottom.text}</span>
                <span>{button_bottom.text}</span>
              </motion.div>
            </div>
            <motion.div className="w-2 h-2 rounded-full bg-white shrink-0" variants={dotVariants} />
          </motion.a>
        </motion.div>
      )}

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