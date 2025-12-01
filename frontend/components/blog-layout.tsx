'use client';

import { IconArrowLeft } from '@tabler/icons-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Link } from 'next-view-transitions';
import React from 'react';

import { Container } from './container';
import DynamicZoneManager from './dynamic-zone/manager';
import { StrapiImage } from '@/components/ui/strapi-image';
import { Article } from '@/types/types';

const formatDate = (dateStr?: string, locale?: string) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  return locale === 'hu'
    ? format(d, 'yyyy. MMMM d.')
    : format(d, 'MMMM dd, yyyy');
};

// egyszerű helyi fordító a statikus UI szövegekhez
const getUiText = (locale?: string) => {
  const isHu = locale?.startsWith('hu');
  return {
    back: isHu ? 'Vissza' : 'Back',
    previous: isHu ? 'Előző' : 'Previous',
    next: isHu ? 'Következő' : 'Next',
  };
};

// ⬇️ HELYBEN definiált típus a Strapi Hero.person_card komponenshez
type PersonCard = {
  name?: string | null;
  role?: string | null;
  org?: string | null;
  image?: { url: string } | null;
  button?: {
    text?: string | null;
    URL?: string | null;
    target?: string | null;
    variant?: string | null;
  } | null;
};

// Article + person_card
type ArticleWithPersonCard = Article & {
  person_card?: PersonCard | null;
};

type BlogLayoutProps = {
  article: ArticleWithPersonCard;
  locale: string;
  children: React.ReactNode;
  prevArticle?: Article | null;
  nextArticle?: Article | null;
};

export const BlogLayout: React.FC<BlogLayoutProps> = ({
  article,
  locale,
  children,
  prevArticle,
  nextArticle,
}) => {
  const publishedAt = formatDate(article.publishedAt, locale);
  const ui = getUiText(locale);

  // --- PERSON CARD STRAPI-BÓL ---
  const personCard = article.person_card;

  const authorName = personCard?.name ?? 'Dávid Vasadi';

  const authorRole =
    personCard?.role ?? 'Digital product designer & developer';

  const authorOrg = personCard?.org ?? null;

  const authorImageUrl = personCard?.image?.url ?? null;

  const authorButton = personCard?.button;
  const authorButtonHref =
    // ha a Strapi mező neve "URL"
    authorButton?.URL ||
    // ha véletlenül "url"
    (authorButton as any)?.url ||
    null;

  const authorButtonText = authorButton?.text || null;
  const authorButtonTarget =
    (authorButton?.target as '_self' | '_blank' | undefined) ?? '_self';

  return (
    <Container className="pt-20 px-2 md:pt-20 pb-16 max-w-[90rem]">
      {/* Back link */}
      <div className="flex justify-between items-center px-2 pb-2">
        <Link href="/blog" className="flex space-x-2 items-center">
          <IconArrowLeft className="w-4 h-4 text-neutral-500" />
          <span className="text-xs uppercase tracking-[0.16em] text-neutral-500">
            {ui.back}
          </span>
        </Link>
      </div>

      {/* Fő tartalom */}
      <article
        className="flex flex-col md:grid lg:grid-cols-2 md:gap-24"
        itemScope
        itemType="http://schema.org/Article"
      >
        {/* Bal oldali kép blokk – sticky desktopon */}
        <section className="relative mb-10 md:mb-0">
          <div className="md:sticky md:top-28">
            <figure className="w-full  aspect-square rounded-3xl overflow-hidden mx-auto ">
              {article?.image ? (
                <StrapiImage
                  src={article.image.url}
                  height={800}
                  width={800}
                  alt={article.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-neutral-900" />
              )}
              <figcaption className="sr-only">{article.title}</figcaption>
            </figure>
          </div>
        </section>

        {/* Jobb oldali tartalom blokk */}
        <motion.section
          className="flex flex-col px-1 sm:px-3 md:px-0"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          itemProp="articleBody"
        >
          {/* Fejléc blokk */}
          <header className="space-y-4 mb-10 lg:pt-40 md:mb-20">
            {article.categories && article.categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {article.categories.map((category, idx) => (
                  <span
                    key={`category-${idx}`}
                    className="rounded-full bg-neutral-900 text-xs text-neutral-200 px-3 py-1"
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            )}

            {publishedAt && (
              <time
                dateTime={article.publishedAt}
                className="block text-xs sm:text-sm text-black/60"
                itemProp="datePublished"
              >
                {publishedAt}
              </time>
            )}

            <h1
              className="pt-2 md:pt-6 text-3xl sm:text-4xl md:text-5xl font-semibold text-black leading-[1.02]"
              itemProp="headline"
            >
              {article.title}
            </h1>

            {article.description && (
              <p
                className="text-lg sm:text-xl text-neutral-600 pt-2 md:pt-6"
                itemProp="description"
              >
                {article.description}
              </p>
            )}

            {/* --- Szerző blokk: person_card --- */}
            <div className="flex items-center space-x-4 pt-2 pb-0 md:pt-6 pb-20">
              <div className="w-12 h-12 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-neutral-200">
                {authorImageUrl ? (
                  <StrapiImage
                    src={authorImageUrl}
                    alt={authorName}
                    width={48}
                    height={48}
                    className="h-full w-full object-cover object-top"
                  />
                ) : (
                  <div className="h-full w-full bg-neutral-300" />
                )}
              </div>
              <div>
                <span
                  className="font-semibold text-sm text-black"
                  itemProp="author"
                >
                  {authorName}
                </span>
                {authorRole && (
                  <p className="text-xs text-black/70">{authorRole}</p>
                )}
                {authorOrg && (
                  <p className="text-xs text-black/60">{authorOrg}</p>
                )}
              </div>
            </div>

            {/* Author CTA gomb, ha van person_card.button */}
            {authorButtonHref && authorButtonText && (
              <div className="">
                <Link
                  href={authorButtonHref}
                  target={authorButtonTarget}
                  className="inline-flex items-center gap-2 rounded-lg border border-black px-4 py-2 text-xs font-medium text-black hover:bg-black hover:text-white transition-colors"
                >
                  <span>{authorButtonText}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                </Link>
              </div>
            )}
          </header>

          {/* Cikk tartalom – BlocksRenderer output */}
          <section className="pt-2 md:pt-20 prose prose-sm sm:prose-base md:prose-lg lg:prose-xl prose-neutral border-t border-neutral-200 pt-8 max-w-none">
            {children}
          </section>

          {/* Prev / Next kártyák */}
          {(prevArticle || nextArticle) && (
            <nav
              className="flex flex-col gap-1 mt-10"
              aria-label="More blog posts"
            >
              {prevArticle && (
                <Link
                  href={`/blog/${prevArticle.slug}`}
                  className="relative block rounded-2xl overflow-hidden shadow-[0_18px_40px_rgba(15,23,42,0.18)] group no-underline"
                  aria-label={`${ui.previous} post: ${prevArticle.title}`}
                >
                  {prevArticle.image?.url && (
                    <StrapiImage
                      src={prevArticle.image.url}
                      alt={prevArticle.title}
                      height={600}
                      width={1200}
                      className="h-28 md:h-36 w-full object-cover transition-transform duration-500 group-hover:scale-105 group-hover:blur-[2px]"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-100 group-hover:transition-opacity" />
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <span className="text-white/70 text-xs sm:text-sm mb-2 font-medium">
                      {ui.previous}
                    </span>
                    <h2 className="text-white text-lg sm:text-2xl font-semibold">
                      {prevArticle.title}
                    </h2>
                  </div>
                </Link>
              )}

              {nextArticle && (
                <Link
                  href={`/blog/${nextArticle.slug}`}
                  className="relative block rounded-2xl overflow-hidden shadow-[0_18px_40px_rgba(15,23,42,0.18)] group no-underline"
                  aria-label={`${ui.next} post: ${nextArticle.title}`}
                >
                  {nextArticle.image?.url && (
                    <StrapiImage
                      src={nextArticle.image.url}
                      alt={nextArticle.title}
                      height={600}
                      width={1200}
                      className="h-28 md:h-36 w-full object-cover transition-transform duration-500 group-hover:scale-105 group-hover:blur-[2px]"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-100 group-hover:transition-opacity" />
                  <div className="absolute inset-0 p-6 flex flex-col justify-end items-end text-right">
                    <span className="text-white/70 text-xs sm:text-sm mb-2 font-medium">
                      {ui.next}
                    </span>
                    <h2 className="text-white text-lg sm:text-2xl font-semibold">
                      {nextArticle.title}
                    </h2>
                  </div>
                </Link>
              )}
            </nav>
          )}
        </motion.section>
      </article>

      {/* Dynamic Zone a cikk alatt */}
      {article?.dynamic_zone && (
        <div className="mt-20">
          <DynamicZoneManager
            dynamicZone={article.dynamic_zone}
            locale={locale}
          />
        </div>
      )}
    </Container>
  );
};
