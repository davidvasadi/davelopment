// frontend/components/blog-index.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PlusIcon } from 'lucide-react';
import { Link } from 'next-view-transitions';
import { format } from 'date-fns';
import { Container } from '@/components/container'
import { strapiImage } from '@/lib/strapi/strapiImage';
import type { Article } from '@/types/types';

type BlogIndexProps = {
    locale: string;
    blogPage: any;        // Strapi single type /blog
    articles: Article[];  // Strapi cikkek
};

const formatDate = (dateStr?: string, locale?: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return '';
    return locale === 'hu'
        ? format(d, 'yyyy. MMMM d.')
        : format(d, 'MMM d, yyyy');
};

export const BlogIndex: React.FC<BlogIndexProps> = ({
    locale,
    blogPage,
    articles,
}) => {
    // --- Strapi cikkek rendezése dátum szerint ---
    const sorted = [...articles].sort(
        (a, b) =>
            new Date(b.publishedAt ?? '').getTime() -
            new Date(a.publishedAt ?? '').getTime()
    );

    const posts = sorted.map((a) => ({
        slug: a.slug,
        url: `/${locale}/blog/${a.slug}`,
        title: a.title,
        description: a.description,
        image: a.image ? strapiImage(a.image.url) : '',
        date: formatDate(a.publishedAt, locale),
    }));

    if (!posts.length) {
        return (
            <section className="w-full pt-24 md:pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <h1 className="text-4xl md:text-6xl font-bold text-black mb-8">
                        {blogPage?.heading ?? 'Blog'}
                    </h1>
                    <p className="text-neutral-600">Még nincs publikált blog cikk.</p>
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
                <div className="max-w-9xl mx-auto px-2 md:px-8">
                    {/* --- Fejléc + leírás (ugyanaz, mint az eredetiben) --- */}
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

                    {/* --- Fő poszt + 2 további poszt (1:1 az eredetivel) --- */}
                    <div className="grid grid-cols-1  lg:grid-cols-4 gap-1 mb-2">
                        {/* FŐ POSZT */}
                        <motion.div
                            className="h-full lg:col-span-2 col-span-1 group relative"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            <Link
                                href={featured.url}
                                className="block bg-white rounded-2xl overflow-hidden group"
                            >
                                <div className="relative aspect-[3/2] w-full">
                                    {featured.image && (
                                        <img
                                            src={featured.image}
                                            alt={featured.title}
                                            className="aspect-[3/2] object-cover transition-transform 0 duration-300 group-hover:scale-105 group-hover:blur-[4px]"
                                        />
                                    )}
                                    {/* overlay */}
                                    <div
                                        className="
                                                    absolute inset-x-0 bottom-0 
                                                    h-2/3
                                                    bg-gradient-to-t 
                                                    from-black/80 via-black/50 to-transparent
                                                    pointer-events-none 
                                                    transition-all duration-500
                                                "
                                    />
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
                                            <p className="text-sm md:text-md text-white/80 mb-6 max-w-3xl">
                                                {featured.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        </motion.div>

                        {/* 2. és 3. poszt */}
                        {[second, third].filter(Boolean).map((post, idx) => (
                            <motion.div
                                className="col-span-1 group flex flex-col"        // <<< nincs flex flex-col
                                key={post!.slug}
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.5 + idx * 0.05 }}
                            >
                                <Link
                                    href={post!.url}
                                    className="flex flex-wrap bg-white rounded-2xl h-full"  // <<< block, nem flex
                                >
                                    <div className="relative w-full p-2 ">
                                        <div className="p-2">
                                            {post!.image && (
                                                <img
                                                    src={post!.image}
                                                    alt={post!.title}
                                                    className="w-28 h-28 rounded-xl object-cover transition-transform duration-300 group-hover:scale-150"
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
                                        <p className="text-xs text-gray-400 font-medium transition-all duration-300 mt-3 group-hover:mt-4">
                                            {post!.date}
                                        </p>
                                        <h3 className="text-xl text-black font-medium leading-tight transition-all duration-300 mt-6 group-hover:mt-3">
                                            {post!.title}
                                        </h3>
                                        {post!.description && (
                                            <p className="text-sm text-black/60 transition-all duration-300 mt-6 group-hover:mt-5">
                                                {post!.description}
                                            </p>
                                        )}
                                    </div>
                                </Link>
                            </motion.div>
                        ))}

                    </div>

                    {/* --- TÖBBI POSZT --- */}
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-1">
                        {others.map((post, idx) => (
                            <motion.div
                                className="group"
                                key={post.slug}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.7 + idx * 0.07 }}
                            >
                                <Link
                                    href={post.url}
                                    className="block bg-white rounded-2xl h-full"
                                >
                                    <div className="relative  w-full p-2">
                                        <div className="p-2">
                                            {post.image && (
                                                <img
                                                    src={post.image}
                                                    alt={post.title}
                                                    className="w-28 h-28 rounded-xl object-cover transition-transform duration-300 group-hover:scale-150"
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
                                        <p className="text-xs text-gray-400 font-medium transition-all duration-300 mt-3 group-hover:mt-4">
                                            {post.date}
                                        </p>
                                        <h3 className="text-xl font-medium leading-tight transition-all duration-300 mt-6 group-hover:mt-3">
                                            {post.title}
                                        </h3>
                                        {post.description && (
                                            <p className="text-sm text-black/60 transition-all duration-300 mt-6 group-hover:mt-5">
                                                {post.description}
                                            </p>
                                        )}
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>
        </section>
    );
};
