// components/services/services-page.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { PlusIcon } from 'lucide-react';
import { getLocalizedSegment } from '@/lib/i18n/segments';
import { strapiImage } from '@/lib/strapi/strapiImage';
import { Container } from '@/components/container';

type Page = {
    id: number;
    slug: string;
    label?: string;
    card_short_description?: string | null;
    card_tags?: { tag: string }[] | null;
    locale: string;
    video_poster?: { url: string } | null;
};

type ServicesPageProps = {
    pages: Page[];
    locale: string;
    heading?: string;
    sub_heading?: string;
    badge_label?: string;
};

const ArrowUpRight = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 17 17 7M8 7h9v9" />
    </svg>
);

const ArrowRight = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
);

const ArrowLeft = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5M11 18l-6-6 6-6" />
    </svg>
);

const CARD_WIDTH = 340;
const CARD_GAP = 16;
const CARD_STEP = CARD_WIDTH + CARD_GAP;

export function ServicesPage({ pages, locale, heading, sub_heading, badge_label }: ServicesPageProps) {
    const segment = getLocalizedSegment(locale, 'services');
    const isHu = locale === 'hu';
    const detailsLabel = isHu ? 'Bővebben' : 'Learn more';
    const router = useRouter();

    const getImageUrl = (page: Page) =>
        page.video_poster?.url ? strapiImage(page.video_poster.url) : null;

    const n = pages.length;
    // `step` sosem "ér véget" — mindig nő, a lista pedig 3x meg van ismételve,
    // így amikor egy teljes körön áthaladtunk, tranzíció nélkül vissza tudunk
    // ugrani pontosan egy környit — mivel a tartalom ott ugyanaz, ez láthatatlan.
    // Így a görgetés valóban végtelen, sosem "fogy el" a lista végén.
    const [step, setStep] = useState(0);
    const [noTransition, setNoTransition] = useState(false);
    const activeIndex = n > 0 ? step % n : 0;
    const [isDesktop, setIsDesktop] = useState(false);
    const viewportRef = useRef<HTMLDivElement>(null);
    const isVisibleRef = useRef(false);

    useEffect(() => {
        if (noTransition) {
            const raf = requestAnimationFrame(() => setNoTransition(false));
            return () => cancelAnimationFrame(raf);
        }
    }, [noTransition, step]);

    const tripledPages = n > 0 ? [...pages, ...pages, ...pages] : [];

    useEffect(() => {
        const mq = window.matchMedia('(min-width: 640px)');
        setIsDesktop(mq.matches);
        const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);

    // Csak akkor fusson az automata váltás, ha a szakasz ténylegesen látszik —
    // különben visszaugrasztja az oldalt görgetés közben.
    useEffect(() => {
        const el = viewportRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                isVisibleRef.current = entry.isIntersecting;
            },
            { threshold: 0.3 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    // A váltás kizárólag a React state-en (step) alapul, framer-motion
    // animálja a transzformációt — nincs natív scroll, nincs DOM-mérés,
    // így nem tud "összevissza ugrálni", és sosem fogy el (lásd tripledPages).
    const goTo = (delta: number) => {
        setStep((s) => s + delta);
    };

    const badgeLabel = badge_label?.trim() || (isHu ? 'Amiben segíthetek' : 'How I can help');
    const [headingLeft, ...headingRestParts] = (heading ?? '').split(',');
    const headingRight = headingRestParts.join(',').trim();

    useEffect(() => {
        const id = setInterval(() => {
            if (!isDesktop || !isVisibleRef.current) return;
            goTo(1);
        }, 3500);
        return () => clearInterval(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDesktop, pages.length]);

    return (
        <Container>
        <div id="szolgaltatasok-lista" className="py-12">
            {(heading || sub_heading) && (
                <motion.div
                    className="px-4 mb-12 md:mb-16"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center">
                            <PlusIcon className="w-3 h-3 text-white" />
                        </div>
                        <p className="text-sm font-medium text-gray-700">{badgeLabel}</p>
                    </div>
                    {heading && (
                        <h2 className="font-semibold tracking-tight leading-[1.05] mb-4">
                            <span className="text-black text-3xl md:text-5xl lg:text-6xl">{headingLeft}</span>
                            {!!headingRight && (
                                <span className="text-black/60 text-3xl md:text-5xl lg:text-6xl">,{headingRight}</span>
                            )}
                        </h2>
                    )}
                    {sub_heading && (
                        <p className="text-black/50 text-base md:text-lg max-w-xl">{sub_heading}</p>
                    )}
                </motion.div>
            )}

            <div
                ref={viewportRef}
                className="px-4 sm:overflow-hidden"
            >
                <motion.div
                    className="flex flex-col sm:flex-row gap-4"
                    animate={{ x: isDesktop ? -step * CARD_STEP : 0 }}
                    transition={noTransition ? { duration: 0 } : { duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                    onAnimationComplete={() => {
                        if (isDesktop && step >= n * 2) {
                            setNoTransition(true);
                            setStep((s) => s - n);
                        }
                    }}
                >
                {(isDesktop ? tripledPages : pages).map((page, idx) => {
                    const imageUrl = getImageUrl(page);
                    const tags = (page.card_tags ?? []).slice(0, 2);
                    const isActive = idx % n === activeIndex;
                    const href = `/${locale}/${segment}/${page.slug}`;

                    return (
                        <motion.div
                            key={`${page.id ?? idx}-${idx}`}
                            onClick={() => {
                                if (isDesktop) router.push(href);
                            }}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.5, delay: idx * 0.07, ease: [0.33, 1, 0.68, 1] }}
                            className={`group relative rounded-2xl flex flex-col overflow-hidden p-4 h-[480px] sm:h-auto w-full sm:w-[340px] sm:flex-shrink-0 sm:cursor-pointer ${
                                isActive
                                    ? 'bg-white text-black sm:bg-black sm:text-white'
                                    : 'bg-white text-black'
                            }`}
                        >
                            {/* Fix magasságú fejléc — így minden kártyán ugyanakkora marad a kép */}
                            <div className="shrink-0 min-h-[190px] mb-4">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex flex-wrap gap-1.5">
                                        {tags.map((t, tIdx) => (
                                            <span
                                                key={tIdx}
                                                className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                                                    isActive
                                                        ? 'bg-black/5 text-black/60 sm:bg-white/15 sm:text-white'
                                                        : 'bg-black/5 text-black/60'
                                                }`}
                                            >
                                                {t.tag}
                                            </span>
                                        ))}
                                    </div>
                                    <Link
                                        href={href}
                                        aria-label={detailsLabel}
                                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                                            isActive
                                                ? 'bg-black text-white sm:bg-white sm:text-black'
                                                : 'bg-black text-white'
                                        }`}
                                    >
                                        <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-45" />
                                    </Link>
                                </div>

                                {/* Cím + rövid leírás */}
                                <h3 className="font-bold tracking-tight leading-[1.1] text-2xl mb-2">
                                    {page.label ?? page.slug}
                                </h3>
                                {page.card_short_description && (
                                    <p
                                        className={`text-sm leading-relaxed line-clamp-3 ${
                                            isActive ? 'text-black/50 sm:text-white/60' : 'text-black/50'
                                        }`}
                                    >
                                        {page.card_short_description}
                                    </p>
                                )}
                            </div>

                            {/* Nagy, domináns kép, ráúsztatott CTA-val */}
                            <div
                                className={`relative flex-1 min-h-0 sm:flex-none sm:aspect-[16/10] rounded-xl overflow-hidden ${
                                    isActive ? 'bg-black/5 sm:bg-white/10' : 'bg-black/5'
                                }`}
                            >
                                {imageUrl && (
                                    <div
                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-110"
                                        style={{ backgroundImage: `url(${imageUrl})` }}
                                    />
                                )}
                                <Link href={href} className="absolute bottom-3 left-3 flex items-center gap-2">
                                    <span className="relative bg-white text-black text-sm font-semibold px-4 py-2.5 rounded-full shadow-sm overflow-hidden h-9 flex items-center">
                                        <span className="block overflow-hidden h-5">
                                            <span className="flex flex-col -translate-y-1/2 transition-transform duration-300 ease-in-out group-hover:translate-y-0">
                                                <span className="h-5 leading-5">{detailsLabel}</span>
                                                <span className="h-5 leading-5" aria-hidden="true">{detailsLabel}</span>
                                            </span>
                                        </span>
                                    </span>
                                    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-white text-black flex items-center justify-center shadow-sm">
                                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                                    </div>
                                </Link>
                            </div>
                        </motion.div>
                    );
                })}
                </motion.div>
            </div>

            {/* Kézi váltás — csak asztalon */}
            <div className="hidden sm:flex justify-end gap-2 px-4 mt-4">
                <button
                    type="button"
                    aria-label={isHu ? 'Előző' : 'Previous'}
                    onClick={() => goTo(-1)}
                    className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center transition-opacity hover:opacity-80"
                >
                    <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    aria-label={isHu ? 'Következő' : 'Next'}
                    onClick={() => goTo(1)}
                    className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center transition-opacity hover:opacity-80"
                >
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
        </Container>
    );
}
