'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PlusIcon } from 'lucide-react';
import { Link } from 'next-view-transitions';
import { format } from 'date-fns';

import { strapiImage } from '@/lib/strapi/strapiImage';
import { Container } from '@/components/container';

// --- Helper: Strapi media → abszolút URL ---
const toAbs = (m?: any): string | undefined => {
  if (!m) return undefined;
  if (typeof m === 'string') return strapiImage(m);
  if (Array.isArray(m)) return strapiImage(m[0]);
  if (m.url) return strapiImage(m.url);
  if (m.data?.attributes?.url) return strapiImage(m.data.attributes.url);
  return undefined;
};

const formatDate = (dateStr?: string, locale?: string) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  return locale === 'hu'
    ? format(d, 'yyyy. MMMM d.')
    : format(d, 'MMMM dd, yyyy');
};

type ButtonConfig = {
  text?: string | null;
  URL?: string | null;
  target?: string | null;
  variant?: string | null;
} | null;

type BlogProps = {
  __component: string;
  id: number;
  locale: string;

  badge_label?: string | null;
  heading_left?: string | null;
  heading_right?: string | null;
  description?: string | null;

  button?: ButtonConfig;

  highlight_heading?: string | null;
  highlight_subheading?: string | null;
  highlight_image?: any;

  articles?: any[] | null;
};

export const Blog: React.FC<BlogProps> = ({
  locale,
  badge_label,
  heading_left,
  heading_right,
  description,
  button,
  highlight_heading,
  highlight_subheading,
  highlight_image,
  articles,
}) => {
  const allArticles = Array.isArray(articles) ? articles : [];

  const sorted = [...allArticles].sort((a, b) => {
    const da = new Date(a.publishedAt ?? '').getTime();
    const db = new Date(b.publishedAt ?? '').getTime();
    return db - da;
  });

  const blogPosts = sorted.slice(0, 2);

  const heroImage =
    toAbs(highlight_image) ??
    'https://framerusercontent.com/images/vCmb1SfBKGiUHUXvbQXzqPtmFxo.jpg';

  const ctaLabel = button?.text ?? 'See all';
  const ctaHref = button?.URL ?? `/${locale}/blog`;
  const ctaTarget =
    (button?.target as '_self' | '_blank' | undefined) ?? '_self';

  return (
    <section id='blog' className="max-w-7xl mx-auto px-2 md:px-4  py-20 md:py-28">
      <motion.div
        className="space-y-14 md:space-y-16"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        {/* --- Fejléc --- */}
        <div className="space-y-6 md:space-y-8">
          {badge_label && (
            <div className="inline-flex items-center gap-2 rounded-full bg-transparent">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-black">
                <PlusIcon className="h-3 w-3 text-white" />
              </div>
              <span className="text-xs font-medium tracking-wide text-neutral-700">
                {badge_label}
              </span>
            </div>
          )}

          {/* >>> Itt módosult a grid: md:items-center */}
          <div className="grid grid-cols-1 items-start md:items-center gap-8 md:grid-cols-[minmax(0,2.6fr)_minmax(0,2fr)_auto] md:gap-10">
            {/* Heading (1. oszlop) */}
            <div>
              {(heading_left || heading_right) && (
                <h2 className="text-[2.6rem] sm:text-[3.2rem] lg:text-[4rem] font-semibold leading-[0.9] tracking-tight text-black">
                  {heading_left && (
                    <span className="block text-black">{heading_left}</span>
                  )}
                  {heading_right && (
                    <span className="block text-neutral-500">
                      {heading_right}
                    </span>
                  )}
                </h2>
              )}
            </div>

            {/* Subheading / description (2. oszlop) – rövidebb & középre húzva */}
            <div className="md:self-center md:max-w-sm lg:max-w-md">
              {description && (
                <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
                  {description}
                </p>
              )}
            </div>

            {/* Button (3. oszlop) */}
            <div className="flex md:justify-end md:self-center">
              {button && ctaHref && (
                <Link
                  href={ctaHref}
                  target={ctaTarget}
                  className="inline-flex items-center justify-between gap-6 rounded-full bg-black px-3 py-1 text-xs sm:text-sm font-semibold text-white shadow-sm transition-colors hover:bg-neutral-900"
                >
                  <span>{ctaLabel}</span>
                  <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* --- Kártyák + highlight --- */}
        <div className="grid grid-cols-1 items-stretch  lg:grid-cols-[minmax(0,2.3fr)_minmax(0,1.5fr)] gap-2">
          {/* Bal: 2 cikk kártya – ugyanaz a logika, mint a blog-index 2–3. kártya */}
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {blogPosts.map((post: any, index: number) => {
              const postUrl = `/${locale}/blog/${post.slug}`;
              const imageUrl = toAbs(post.image);

              return (
                <motion.article
                  key={post.id ?? post.slug ?? index}
                  className="h-full"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link
                    href={postUrl}
                    className="group flex h-full flex-col rounded-xl bg-white shadow-[0_18px_40px_rgba(15,23,42,0.06)]"
                  >
                    {/* kis kép + plusz ikon (zoom, mint BlogIndex-ben) */}
                    <div className="relative w-full ">
                      <div className="p-3">
                        {imageUrl && (
                          <img
                            src={imageUrl}
                            alt={post.title}
                            className="h-24 w-24 sm:h-28 sm:w-28 rounded-lg object-cover transition-transform duration-300 group-hover:scale-150"
                            style={{ transformOrigin: '0% 0%' }}
                          />
                        )}
                      </div>

                      <div className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-black transition-transform duration-300 group-hover:rotate-180">
                        <div className="relative flex h-3 w-3 items-center justify-center">
                          <div className="h-0.5 w-full bg-white" />
                          <div className="absolute h-full w-0.5 bg-white" />
                        </div>
                      </div>
                    </div>

                    {/* szövegrész */}
                    <div className="flex flex-1 flex-col justify-end px-5 pb-6 pt-1">
                      <p className="mt-3 text-[11px] uppercase tracking-[0.12em] text-neutral-500 transition-all duration-300 group-hover:mt-4">
                        {formatDate(post.publishedAt, locale)}
                      </p>
                      <h3 className="mt-6 text-[1.1rem] font-semibold leading-tight text-neutral-900 transition-all duration-300 group-hover:mt-3">
                        {post.title}
                      </h3>
                      {post.description && (
                        <p className="mt-6 text-sm leading-relaxed text-neutral-600 transition-all duration-300 group-hover:mt-5">
                          {post.description}
                        </p>
                      )}
                    </div>
                  </Link>
                </motion.article>
              );
            })}
          </div>

          {/* Jobb: nagy highlight blokk (marad) */}
          <motion.div
            className="group relative min-h-[360px] sm:min-h-[400px] lg:min-h-[460px] overflow-hidden rounded-xl bg-black shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <img
              src={heroImage}
              alt={highlight_heading ?? 'Blog highlight'}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10" />

            {/* bal felső: davelopment */}
            <div className="pointer-events-none absolute left-6 top-6 sm:left-8 sm:top-8">
              <span className="text-base font-semibold tracking-tight text-white">
                [davelopment]®
              </span>
            </div>

            {/* jobb felső: forgó + ikon */}
            <div className="absolute right-6 top-6 sm:right-8 sm:top-8 flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-white/15 backdrop-blur-sm">
              <PlusIcon className="h-4 w-4 text-white transition-transform duration-300 group-hover:rotate-90" />
            </div>

            {/* alsó headline */}
            <div className="absolute bottom-6 right-6 text-right sm:bottom-8 sm:right-8">
              {highlight_heading && (
                <p className="text-3xl sm:text-4xl lg:text-[2.6rem] font-bold leading-[0.9] text-white">
                  {highlight_heading}
                </p>
              )}
              {highlight_subheading && (
                <p className="mt-1 text-3xl sm:text-4xl lg:text-[2.6rem] font-bold leading-[0.9] text-white">
                  {highlight_subheading}
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Blog;
