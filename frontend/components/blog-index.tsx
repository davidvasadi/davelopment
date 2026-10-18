// frontend/components/blog-index.tsx
'use client';

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { PlusIcon, Search, X } from 'lucide-react';
import { Link } from 'next-view-transitions';
import { format } from 'date-fns';
import { hu } from 'date-fns/locale';
import { Container } from '@/components/container'
import { StrapiImage } from '@/components/ui/strapi-image';
import { strapiImage } from '@/lib/strapi/strapiImage';
import type { Article } from '@/types/types';

type BlogIndexProps = {
    locale: string;
    blogPage: any;
    articles: Article[];
};

// Ha egy cikkhez nincs saját borítókép feltöltve, ez a sötét hátterű céges
// logó jelenik meg helyette — sosem marad üres a kártya/hero.
const DEFAULT_ARTICLE_IMAGE = strapiImage('/api/media/file/logo-desktop-dark-7da9d81f11.svg');

const formatDate = (dateStr?: string, locale?: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return '';
    return locale === 'hu'
        ? format(d, 'yyyy. MMMM d.', { locale: hu })
        : format(d, 'MMM d, yyyy');
};

// Hányat mutassunk kezdetben a "Többi poszt" rácsból, mielőtt a "Továbbiak
// betöltése" gombra kattintva bővülne — 20+ cikknél enélkül mind egyszerre
// renderelődne és animálódna be, ami érezhetően lassítja az oldalt.
const OTHERS_PAGE_SIZE = 8;

export const BlogIndex: React.FC<BlogIndexProps> = ({
    locale,
    blogPage,
    articles,
}) => {
    const [query, setQuery] = useState('');
    const [visibleOthers, setVisibleOthers] = useState(OTHERS_PAGE_SIZE);

    const byDateDesc = (a: Article, b: Article) =>
        new Date(b.publishedAt || b.createdAt || '').getTime() -
        new Date(a.publishedAt || a.createdAt || '').getTime();

    // Csak a legfeljebb első 3 kézzel kiemelt cikk kap kitüntetett helyet
    // (a fejléc 3 nagy kártyája) — korábban a kiemelt lista (itt 22 régi
    // cikk, nyilván nem tudatos válogatás) TELJESEN lecserélte a listát, és
    // minden más cikk, így minden jövőbeli ÚJ cikk is, örökre láthatatlan
    // maradt, amíg valaki kézzel hozzá nem adta ehhez a listához. A "többi
    // poszt" rács mindig dátum szerint, a kiemelt 3-at kivéve mutatja az
    // összes cikket — új cikk automatikusan megjelenik, nem kell kézzel
    // kuratálni.
    const featuredSlugs: string[] = (blogPage?.featured_articles ?? [])
        .slice(0, 3)
        .map((fa: any) => fa?.slug ?? null)
        .filter(Boolean);

    const featuredOnes: Article[] = featuredSlugs
        .map((slug) => articles.find((a) => a.slug === slug))
        .filter((a): a is Article => !!a);
    const featuredSlugSet = new Set(featuredOnes.map((a) => a.slug));
    const restByDate = articles
        .filter((a) => !featuredSlugSet.has(a.slug))
        .sort(byDateDesc);

    const sorted: Article[] = featuredOnes.length > 0
        ? [...featuredOnes, ...restByDate]
        : [...articles].sort(byDateDesc);

    const posts = sorted.map((a) => ({
        slug: a.slug,
        url: `/${locale}/blog/${a.slug}`,
        title: a.title,
        description: a.description,
        image: a.image ? strapiImage(a.image.url) : DEFAULT_ARTICLE_IMAGE,
        isPlaceholderImage: !a.image || (a.image as any)?.id === 31,
        date: formatDate(a.publishedAt || a.createdAt, locale),
    }));

    const normalizedQuery = query.trim().toLowerCase();
    const isSearching = normalizedQuery.length > 0;
    const searchResults = isSearching
        ? posts.filter(
            (p) =>
                p.title?.toLowerCase().includes(normalizedQuery) ||
                p.description?.toLowerCase().includes(normalizedQuery)
        )
        : [];

    if (!posts.length) {
        return (
            <section className="w-full pt-24 md:pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <h1 className="text-4xl md:text-6xl font-bold text-black mb-8">
                        {blogPage?.heading ?? 'Blog'}
                    </h1>
                    <p className="text-neutral-600">{locale === 'hu' ? 'Még nincs publikált blog cikk.' : 'No published blog posts yet.'}</p>
                </div>
            </section>
        );
    }

    const [featured, second, third, ...others] = posts;

    const heading = blogPage?.heading ?? 'Blog';
    const badge = blogPage?.badge_label ?? 'Blog';
    const desc1 = blogPage?.sub_heading ?? '';
    const desc2 = blogPage?.sub_heading_2 ?? '';
    const subtitle = blogPage?.subtitle ?? '';

    return (
        <section className='max-w-9xl mx-auto px-0 xl:px-20'>
            <main className="w-full pt-24 md:pt-32 pb-20">
            <Container>
                <div className="max-w-9xl mx-auto px-2 md:px-8">

                    {/* --- Fejléc --- */}
                    <motion.h1
                        className="text-6xl md:text-8xl lg:text-9xl font-semibold text-black mb-16 md:mb-36"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        {heading}
                    </motion.h1>

                    <motion.div
                        className="mb-16 flex flex-col md:flex-row items-start justify-between"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex items-center space-x-3 mb-6 md:mb-0">
                            <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                                <PlusIcon className="w-3 h-3 text-white" />
                            </div>
                            <p className="text-xs flex font-medium text-black">
                                {badge}
                            </p>
                        </div>

                        <div className="max-w-3xl flex flex-col md:flex-row space-x-2 md:space-x-20">
                            {desc1 && (
                                <p className="text-3xl text-black font-normal indent-20">
                                    {desc1}
                                    {desc2 && (
                                        <span className="text-black/50 font-medium"> {desc2}</span>
                                    )}
                                </p>
                            )}
                            {subtitle && (
                                <p className="text-sm text-black/60 mt-4">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                    </motion.div>

                    {/* --- Kereső --- */}
                    <div className="relative mb-12 md:mb-16 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40 pointer-events-none" />
                        <input
                            type="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={locale === 'hu' ? 'Keress a cikkek között…' : 'Search articles…'}
                            className="w-full pl-11 pr-10 py-3 rounded-full border border-gray-200 bg-white text-sm text-black placeholder:text-black/40 focus:outline-none focus:border-black/30 transition-colors"
                        />
                        {isSearching && (
                            <button
                                type="button"
                                onClick={() => setQuery('')}
                                aria-label={locale === 'hu' ? 'Keresés törlése' : 'Clear search'}
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                            >
                                <X className="w-3.5 h-3.5 text-black/60" />
                            </button>
                        )}
                    </div>

                    {isSearching ? (
                        <div className="pb-12">
                            {searchResults.length === 0 ? (
                                <p className="text-black/50 text-sm">
                                    {locale === 'hu' ? 'Nincs találat.' : 'No results.'}
                                </p>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1">
                                    {searchResults.map((post) => (
                                        <div className="group" key={post.slug}>
                                            <Link
                                                href={post.url}
                                                className="block bg-white rounded-2xl h-full"
                                            >
                                                <div className="relative w-full p-2">
                                                    <div className="p-2">
                                                        {post.image && (
                                                            <StrapiImage
                                                                src={post.image}
                                                                alt={post.title}
                                                                width={112}
                                                                height={112}
                                                                className={`w-28 h-28 rounded-xl transition-transform duration-300 group-hover:scale-150 ${post.isPlaceholderImage ? 'object-contain bg-neutral-900 p-0' : 'object-cover'}`}
                                                                style={{ transformOrigin: '0% 0%' }}
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="p-6 flex-1 flex flex-col justify-end">
                                                    <p className="text-xs text-gray-400 font-medium mt-3">{post.date}</p>
                                                    <h3 className="text-xl font-medium leading-tight mt-6">{post.title}</h3>
                                                    {post.description && (
                                                        <p className="text-sm text-black/60 mt-6">{post.description}</p>
                                                    )}
                                                </div>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                    <>
                    {/* --- Fő poszt + 2 oldalsó kártya --- */}
                    {/* items-stretch: a két oszlop egyforma magasságú lesz */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-1 mb-2 items-stretch">

                        {/* FŐ POSZT — h-full, kép absolute inset-0 */}
                        <motion.div
                            className="h-full lg:col-span-2 col-span-1 group relative"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            <Link
                                href={featured.url}
                                className="block bg-white rounded-2xl overflow-hidden group h-full"
                            >
                                {/* min-h biztosítja, hogy mobilon legyen minimális magasság,
                                    desktopon a szomszéd kártyák magasságához igazodik (stretch) */}
                                <div className="relative h-full w-full min-h-[320px]">
                                    {featured.image && (
                                        <StrapiImage
                                            src={featured.image}
                                            alt={featured.title}
                                            fill
                                            sizes="(min-width: 1024px) 50vw, 100vw"
                                            className="object-cover transition-transform duration-300 group-hover:scale-105 group-hover:blur-[4px]"
                                        />
                                    )}
                                    {/* gradient overlay */}
                                    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/50 to-transparent pointer-events-none transition-all duration-500" />
                                    {/* plus ikon */}
                                    <div className="absolute top-6 right-6 w-8 h-8 bg-black rounded-full flex items-center justify-center group-hover:rotate-180 transition-transform duration-300">
                                        <div className="w-3 h-0.5 bg-white" />
                                        <div className="w-0.5 h-3 bg-white absolute" />
                                    </div>
                                    {/* szövegek */}
                                    <div className="absolute bottom-0 left-0 w-full px-6 py-2 md:p-8">
                                        <p className="text-sm text-white/70 mb-4">
                                            {featured.date}
                                        </p>
                                        <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-white mb-4">
                                            {featured.title}
                                        </h2>
                                        {featured.description && (
                                            <p className="hidden md:block text-sm md:text-base text-white/80 mb-6 max-w-3xl">
                                                {featured.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        </motion.div>

                        {/* 2. és 3. kártya — közös wrapper, h-full, egymás alatt */}
                        <div className="lg:col-span-2 col-span-1 grid grid-cols-1 lg:grid-cols-2 gap-1 h-full">
                            {[second, third].filter(Boolean).map((post, idx) => (
                                <motion.div
                                    className="col-span-1 group flex flex-col h-full"
                                    key={post!.slug}
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.5 + idx * 0.05 }}
                                >
                                    <Link
                                        href={post!.url}
                                        className="flex flex-col bg-white rounded-2xl h-full"
                                    >
                                        <div className="relative w-full p-2">
                                            <div className="p-2">
                                                {post!.image && (
                                                    <StrapiImage
                                                        src={post!.image}
                                                        alt={post!.title}
                                                        width={112}
                                                        height={112}
                                                        className={`w-28 h-28 rounded-xl transition-transform duration-300 group-hover:scale-150 ${post!.isPlaceholderImage ? 'object-contain bg-neutral-900 p-0' : 'object-cover'}`}
                                                        style={{ transformOrigin: '0% 0%' }}
                                                    />
                                                )}
                                            </div>
                                            <div className="absolute top-4 right-4 w-5 h-5 bg-black rounded-full flex items-center justify-center group-hover:rotate-180 transition-transform duration-300">
                                                <div className="w-2 h-0.5 bg-white" />
                                                <div className="w-0.5 h-2 bg-white absolute" />
                                            </div>
                                        </div>

                                        <div className="p-6 flex-1 flex flex-col justify-end">
                                            <p className="text-xs text-gray-400 font-medium transition-transform duration-300 mt-3 translate-y-px group-hover:translate-y-[5px]">
                                                {post!.date}
                                            </p>
                                            <h3 className="text-xl text-black font-medium leading-tight transition-transform duration-300 mt-6 group-hover:-translate-y-3">
                                                {post!.title}
                                            </h3>
                                            {post!.description && (
                                                <p className="hidden md:block text-sm text-black/60 transition-transform duration-300 mt-6 group-hover:-translate-y-1">
                                                    {post!.description}
                                                </p>
                                            )}
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                    </div>

                    {/* --- TÖBBI POSZT --- */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-1">
                        {others.slice(0, visibleOthers).map((post, idx) => (
                            <motion.div
                                className="group"
                                key={post.slug}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: (idx % OTHERS_PAGE_SIZE) * 0.05 }}
                            >
                                <Link
                                    href={post.url}
                                    className="block bg-white rounded-2xl h-full"
                                >
                                    <div className="relative w-full p-2">
                                        <div className="p-2">
                                            {post.image && (
                                                <StrapiImage
                                                    src={post.image}
                                                    alt={post.title}
                                                    width={112}
                                                    height={112}
                                                    className={`w-28 h-28 rounded-xl transition-transform duration-300 group-hover:scale-150 ${post.isPlaceholderImage ? 'object-contain bg-neutral-900 p-0' : 'object-cover'}`}
                                                    style={{ transformOrigin: '0% 0%' }}
                                                />
                                            )}
                                        </div>
                                        <div className="absolute top-4 right-4 w-5 h-5 bg-black rounded-full flex items-center justify-center group-hover:rotate-180 transition-transform duration-300">
                                            <div className="w-2 h-0.5 bg-white" />
                                            <div className="w-0.5 h-2 bg-white absolute" />
                                        </div>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col justify-end">
                                        <p className="text-xs text-gray-400 font-medium transition-transform duration-300 mt-3 translate-y-px group-hover:translate-y-[5px]">
                                            {post.date}
                                        </p>
                                        <h3 className="text-xl font-medium leading-tight transition-transform duration-300 mt-6 group-hover:-translate-y-3">
                                            {post.title}
                                        </h3>
                                        {post.description && (
                                            <p className="text-sm text-black/60 transition-transform duration-300 mt-6 group-hover:-translate-y-1">
                                                {post.description}
                                            </p>
                                        )}
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {visibleOthers < others.length && (
                        <div className="flex justify-center mt-10">
                            <button
                                type="button"
                                onClick={() => setVisibleOthers((v) => v + OTHERS_PAGE_SIZE)}
                                className="px-6 py-3 rounded-full border border-gray-200 text-sm font-medium text-black hover:bg-black hover:text-white hover:border-black transition-colors"
                            >
                                {locale === 'hu' ? 'Továbbiak betöltése' : 'Load more'}
                            </button>
                        </div>
                    )}
                    </>
                    )}

                </div>
        </Container>
            </main>
        </section>
    );
};
