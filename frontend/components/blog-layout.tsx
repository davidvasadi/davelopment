'use client';

import { IconArrowLeft } from '@tabler/icons-react';
import { format } from 'date-fns';
import { motion, useInView } from 'framer-motion';
import { Link } from 'next-view-transitions';
import React, { useRef } from 'react';

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

const getUiText = (locale?: string) => {
  const isHu = locale?.startsWith('hu');
  return {
    back: isHu ? 'Vissza' : 'Back',
    previous: isHu ? 'Előző' : 'Previous',
    next: isHu ? 'Következő' : 'Next',
  };
};

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

function FadeUp({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -200px 0px' }); return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export const BlogLayout: React.FC<BlogLayoutProps> = ({
  article,
  locale,
  children,
  prevArticle,
  nextArticle,
}) => {
  const publishedAt = formatDate(article.publishedAt || article.createdAt, locale);
  const ui = getUiText(locale);

  const personCard = article.person_card;
  const authorName = personCard?.name ?? 'Dávid Vasadi';
  const authorRole = personCard?.role ?? 'Digital product designer & developer';
  const authorOrg = personCard?.org ?? null;
  const authorImageUrl = personCard?.image?.url ?? null;
  const authorButton = personCard?.button;
  const authorButtonHref = authorButton?.URL || (authorButton as any)?.url || null;
  const authorButtonText = authorButton?.text || null;
  const authorButtonTarget = (authorButton?.target as '_self' | '_blank' | undefined) ?? '_self';

  return (
    <Container className="pt-20 px-2 md:pt-20 pb-16 max-w-[90rem]">



      {/* ── Fő layout: bal sticky kép + jobb scrollozható tartalom ── */}
      <article
        className="flex flex-col md:grid lg:grid-cols-2 md:gap-16 lg:gap-24"
        itemScope
        itemType="http://schema.org/Article"
      >

        {/* BAL — sticky kép, aspect-square */}
        <section className="relative mb-10 md:mb-0">
          <div className="md:sticky md:top-28">
            {/* Vissza gomb */}
            <div className="flex justify-between items-center px-2 pb-2">
              <Link href={`/${locale}/blog`} className="flex space-x-2 items-center">
                <IconArrowLeft className="w-4 h-4 text-neutral-500" />
                <span className="text-xs uppercase tracking-[0.16em] text-neutral-500">
                  {ui.back}
                </span>
              </Link>
            </div>
            <figure className="w-full aspect-square max-h-[calc(90vh-8rem)] rounded-3xl overflow-hidden mx-auto">              {article?.image ? (
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

        {/* JOBB — meta középre + cikk tartalom alatta, együtt scrollozható */}
        <section
          className="flex flex-col px-1 sm:px-3 md:px-0"
          itemProp="articleBody"
        >
          {/* Meta fejléc — flex-grow + flex + items-center adja a vizuális
              középre igazítást a kép mellé. A min-h biztosítja hogy
              legalább a kép magasságáig nyúlik, de nem több. */}
          <motion.header
            className="
              flex flex-col justify-center
              min-h-[0px] md:min-h-[calc(100vw/2.8)] lg:min-h-[calc(50vw-8rem)]
              space-y-4 mb-8
            "
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Kategóriák */}
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

            {/* Dátum */}
            {publishedAt && (
              <time
                dateTime={article.publishedAt}
                className="block text-xs sm:text-sm text-black/60"
                itemProp="datePublished"
              >
                {publishedAt}
              </time>
            )}

            {/* Cím */}
            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-semibold text-black leading-[1.02]"
              itemProp="headline"
            >
              {article.title}
            </h1>

            {/* Leírás */}
            {article.description && (
              <p
                className="text-lg sm:text-xl text-neutral-600"
                itemProp="description"
              >
                {article.description}
              </p>
            )}

            {/* Szerző */}
            <div className="flex items-center space-x-4 pt-2">
              <div className="w-12 h-12 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-neutral-200 shrink-0">
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
                <span className="font-semibold text-sm text-black" itemProp="author">
                  {authorName}
                </span>
                {authorRole && <p className="text-xs text-black/70">{authorRole}</p>}
                {authorOrg && <p className="text-xs text-black/60">{authorOrg}</p>}
              </div>
            </div>

            {/* Author CTA */}
            {authorButtonHref && authorButtonText && (
              <Link
                href={authorButtonHref}
                target={authorButtonTarget}
                className="inline-flex items-center gap-2 rounded-lg border border-black px-4 py-2 text-xs font-medium text-black hover:bg-black hover:text-white transition-colors w-fit"
              >
                <span>{authorButtonText}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
              </Link>
            )}
          </motion.header>

          {/* Cikk szöveg — fade-up görgetésre */}
          <FadeUp>
            <section className="prose prose-sm sm:prose-base md:prose-lg lg:prose-xl prose-neutral border-t border-neutral-200 pt-8 max-w-none">
              {children}
            </section>
          </FadeUp>

          {/* Prev / Next — fade-up görgetésre */}
          {(prevArticle || nextArticle) && (
            <FadeUp delay={0.1} className="mt-10">
              <nav className="flex flex-col gap-1" aria-label="More blog posts">
                {prevArticle && (
                  <Link
                    href={`/${locale}/blog/${prevArticle.slug}`}
                    className="relative block rounded-2xl overflow-hidden shadow-[0_18px_40px_rgba(15,23,42,0.18)] group no-underline"
                    aria-label={`${ui.previous}: ${prevArticle.title}`}
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
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end">
                      <span className="text-white/70 text-xs mb-1 font-medium">{ui.previous}</span>
                      <h2 className="text-white text-sm sm:text-base md:text-lg lg:text-2xl font-semibold leading-tight">{prevArticle.title}</h2>
                    </div>
                  </Link>
                )}
                {nextArticle && (
                  <Link
                    href={`/${locale}/blog/${nextArticle.slug}`}
                    className="relative block rounded-2xl overflow-hidden shadow-[0_18px_40px_rgba(15,23,42,0.18)] group no-underline"
                    aria-label={`${ui.next}: ${nextArticle.title}`}
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
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end items-end text-right">
                      <span className="text-white/70 text-xs mb-1 font-medium">{ui.next}</span>
                      <h2 className="text-white text-sm sm:text-base md:text-lg lg:text-2xl font-semibold leading-tight">{nextArticle.title}</h2>
                    </div>
                  </Link>
                )}
              </nav>
            </FadeUp>
          )}
        </section>
      </article>

      {/* Dynamic Zone */}
      {article?.dynamic_zone && (
        <FadeUp delay={0.15} className="mt-20">
          <DynamicZoneManager dynamicZone={article.dynamic_zone} locale={locale} />
        </FadeUp>
      )}

    </Container>
  );
};
