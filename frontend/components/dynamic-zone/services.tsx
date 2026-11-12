'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus as PlusIcon, Minus as MinusIcon } from 'lucide-react';
import { strapiImage } from '@/lib/strapi/strapiImage';
import { GrainCanvas } from '../ui/grain-canvas';
import { CapabilitiesAccordion } from './capabilities-accordion';

const CAPABILITIES_BADGES = ['Miből áll', 'What it covers'];

export type ServicesBlockProps = {
    __component: string;
    id: number;
    locale?: string;
    heading?: string;
    sub_heading?: string;
    badge_label?: string;
    cta_title?: string;
    cta_anchor?: string;
    background?: { url?: string | null; mime?: string | null } | {
        data?: { attributes?: { url?: string | null; mime?: string | null } }
    } | null;
    background_url?: string | null;
    elements_service_item?: any[];
};

const toAbs = (m?: any): string | undefined => {
    if (!m) return undefined;
    if (typeof m === 'string') return strapiImage(m);
    if (m?.url) return strapiImage(m.url);
    return undefined;
};

const getMime = (m?: any): string | undefined => m?.mime;

const looksLikeVideoUrl = (url?: string) =>
    !!url && /\.(mp4|webm|ogg|ogv|mov|m4v)$/i.test(url);

const extractImageUrls = (field: any): string[] => {
    if (!field) return [];
    if (Array.isArray(field))
        return field.map((m: any) => m?.url).filter(Boolean).map((u: string) => strapiImage(u));
    const single = field?.url;
    return single ? [strapiImage(single)] : [];
};

type UIService = {
    id: number;
    number?: string;
    title: string;
    description?: string;
    images: string[];
    categories: string[];
    categoriesTitle: string;
    categoryCount?: string;
    icon?: string;
    stats?: { value?: string; suffix?: string; label?: string }[];
};

const GRID = 'grid grid-cols-[36px_1fr_60px] lg:grid-cols-[200px_1fr_60px] gap-x-3 lg:gap-x-0';
const TITLE_H = 96;
const EASE = [0.76, 0, 0.24, 1] as const;

export function Services(props: ServicesBlockProps) {
    const {
        heading = 'Services',
        sub_heading,
        badge_label = 'What we do',
        cta_title,
        cta_anchor,
        background,
        background_url,
        elements_service_item,
    } = props;

    const bgUrlFromUrl = toAbs(background_url);
    const bgUrlFromMedia = toAbs(background);
    const bgMime = getMime(background);
    const rawBgUrl = bgUrlFromUrl || bgUrlFromMedia
        || '/images/fallback/section-background.jpg';
    const isVideo = (bgMime && bgMime.startsWith('video/')) || looksLikeVideoUrl(rawBgUrl || '');

    const services = useMemo<UIService[]>(() => {
        const items = Array.isArray(elements_service_item) ? elements_service_item : [];
        return items.map((it: any, idx: number) => ({
            id: it?.id ?? idx,
            number: it?.number ?? '',
            title: it?.title ?? '',
            description: it?.description ?? '',
            images: extractImageUrls(it?.image),
            categories: (it?.categories ?? []).map((c: any) => c?.label).filter(Boolean),
            categoriesTitle: it?.categories_title || 'Categories',
            categoryCount: it?.category_count ?? '',
            icon: it?.icon ?? undefined,
            stats: Array.isArray(it?.stats) ? it.stats : [],
        }));
    }, [elements_service_item]);

    const [openIds, setOpenIds] = useState<Set<number>>(
        () => new Set(services.length ? [services[0].id] : [])
    );

    // egyszerre csak egy tétel lehet nyitva: egy másik kinyitása automatikusan bezárja az előzőt
    const toggle = (id: number) => {
        setOpenIds(prev => (prev.has(id) ? new Set() : new Set([id])));
    };

    const onCta = () => {
        const t = (cta_anchor || '').trim();
        if (!t) return;
        if (/^https?:\/\//i.test(t) || t.startsWith('/')) { window.location.assign(t); return; }
        const el = document.getElementById(t.replace(/^#/, ''));
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        else window.location.hash = `#${t.replace(/^#/, '')}`;
    };

    // "Amit kapsz" / "What you get" jellegű blokkoknál egy teljesen más,
    // világos, kártyás accordiont adunk vissza — a többi (pl. "A projekt
    // menete") változatlanul a sötét, teljes szélességű változatot kapja.
    if (badge_label && CAPABILITIES_BADGES.includes(badge_label)) {
        return (
            <CapabilitiesAccordion
                heading={heading}
                sub_heading={sub_heading}
                badge_label={badge_label}
                cta_title={cta_title}
                cta_anchor={cta_anchor}
                items={services}
            />
        );
    }

    return (
        <div className="px-0 md:px-2">
            <section className="w-full px-1 md:px-4 py-12 md:py-16 relative overflow-hidden rounded-none md:rounded-3xl font-sans">

                {/* HÁTTÉR */}
                <div className="absolute inset-0 z-0">
                    {isVideo ? (
                        <video src={rawBgUrl} className="w-full h-full object-cover" aria-hidden="true"
                            autoPlay muted loop playsInline style={{ filter: 'brightness(1.15)' }} />
                    ) : (
                        <img src={rawBgUrl as string} alt="" aria-hidden="true"
                            width={1912} height={1402}
                            className="w-full h-full object-cover" style={{ filter: 'brightness(1.15)' }} />
                    )}
                    <GrainCanvas strength="light" opacity={0.5} zIndex={1} />
                    <div className="absolute inset-0 opacity-5" />
                </div>

                {/* TARTALOM — nincs max-width (mint a „Hogyan dolgozunk” bento-blokknál), a sötét kártyán belül kis margóval */}
                <div className="relative z-10 px-2 md:px-6 lg:px-10">

                    {/* FEJLÉC — ugyanaz a szabály, mint a „Hogyan dolgozunk” blokknál: cím balra, leírás jobbra (a két
                        szélen, alul igazítva); szűkülő képernyőn a cím tördel; mobilon egymás alatt */}
                    <motion.div
                        className="mb-12 md:mb-16"
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
                    >
                        {badge_label && (
                            <div className="mb-6 flex items-center gap-2">
                                <div className="flex h-4 w-4 items-center justify-center rounded-full bg-white">
                                    <PlusIcon className="h-2.5 w-2.5 text-black" />
                                </div>
                                <span className="text-sm font-medium text-white/80">{badge_label}</span>
                            </div>
                        )}
                        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-10">
                            {heading && (
                                // a darabszám (felső index) a h2-n KÍVÜL van, hogy a Google a címet tisztán olvassa — kinézetre ugyanaz
                                <div className="min-w-0 flex-1 text-4xl font-semibold leading-[0.95] tracking-[-0.04em] text-white md:text-6xl xl:text-7xl">
                                    <h2 className="inline">{heading}</h2>
                                    <sup aria-hidden className="ml-1 align-super text-sm font-semibold tracking-normal text-white/60 md:text-xl">
                                        ({services.length})
                                    </sup>
                                </div>
                            )}
                            {sub_heading && (
                                <p className="max-w-md text-base leading-relaxed text-white/70 md:max-w-xs md:shrink-0 md:pb-1 md:text-right md:text-lg">
                                    {sub_heading}
                                </p>
                            )}
                        </div>
                    </motion.div>

                    {/* ACCORDION — sorok egyenként fade up, stagger */}
                    <div>
                        {services.map((s, idx) => {
                            const isOpen = openIds.has(s.id);
                            return (
                                <motion.div
                                    key={s.id}
                                    className={`border-b border-white/10 ${GRID}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.2 }}
                                    transition={{
                                        duration: 0.5,
                                        delay: idx * 0.08,
                                        ease: [0.33, 1, 0.68, 1],
                                    }}
                                >
                                    {/* Sorszám */}
                                    <div
                                        className="flex items-center cursor-pointer"
                                        style={{ height: TITLE_H }}
                                        onClick={() => toggle(s.id)}
                                    >
                                        <span className="text-sm font-medium text-white/70">({s.number})</span>
                                    </div>

                                    {/* Középső: cím flip + tartalom */}
                                    <div className="flex flex-col">
                                        <div
                                            className="overflow-hidden cursor-pointer flex items-center"
                                            style={{ height: TITLE_H }}
                                            onClick={() => toggle(s.id)}
                                        >
                                            {/* H3: a főoldali (kategória nélküli) tételeknél nagy, de egy lépcsővel kisebb, mint a blokk H2 címe */}
                                            <motion.h3
                                                className={s.categories.length === 0
                                                    ? 'text-3xl font-semibold leading-none tracking-[-0.04em] text-white md:text-5xl xl:text-6xl'
                                                    : 'text-2xl md:text-3xl font-semibold text-white'}
                                                animate={{
                                                    y: isOpen ? '120%' : '0%',
                                                    opacity: isOpen ? 0 : 1,
                                                }}
                                                transition={{ duration: 0.45, ease: EASE }}
                                            >
                                                {s.title}
                                            </motion.h3>
                                        </div>

                                        <motion.div
                                            style={{ marginTop: -TITLE_H }}
                                            animate={{
                                                height: isOpen ? 'auto' : 0,
                                                opacity: isOpen ? 1 : 0,
                                                y: isOpen ? 0 : -16,
                                            }}
                                            initial={false}
                                            transition={{
                                                height: { duration: 0.45, ease: EASE },
                                                opacity: { duration: 0.3, delay: isOpen ? 0.15 : 0 },
                                                y: { duration: 0.35, delay: isOpen ? 0.12 : 0, ease: EASE },
                                            }}
                                            className="overflow-hidden"
                                        >
                                            {s.categories.length === 0 ? (
                                            /* Kategória nélküli tétel (főoldal, 2026-11): balra nagy kép, középen nagy cím,
                                               a jobb szélen a leírás */
                                            <div
                                                className="grid grid-cols-1 gap-6 pb-12 lg:grid-cols-12 lg:items-end lg:gap-10"
                                                style={{ paddingTop: 41 }}
                                            >
                                                {s.images[0] && (
                                                    <div className="h-40 w-40 overflow-hidden rounded-2xl lg:col-span-3 lg:h-56 lg:w-56">
                                                        <img src={s.images[0]} alt={s.title} width={224} height={224} className="h-full w-full object-cover" />
                                                    </div>
                                                )}
                                                {/* ugyanaz a cím mint a fenti h3-ban -> nem heading-elem (ne duplázódjon a címsor-fa) */}
                                                <p className={`text-3xl font-semibold leading-none tracking-[-0.04em] text-white md:text-5xl xl:text-6xl ${s.images[0] ? 'lg:col-span-5' : 'lg:col-span-8'}`}>
                                                    {s.title}
                                                </p>
                                                {s.description && (
                                                    <p className="max-w-md text-base leading-relaxed text-white/70 md:text-lg lg:col-span-4 lg:ml-auto lg:pb-1 lg:text-right">
                                                        {s.description}
                                                    </p>
                                                )}
                                            </div>
                                            ) : (
                                            <div
                                                className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12"
                                                style={{ paddingTop: 41 }}
                                            >
                                                <div className="flex gap-5 flex-col md:flex-row md:items-start">
                                                    {s.images.length > 0 && (
                                                        <div className="flex shrink-0">
                                                            {s.images.map((src, i) => (
                                                                <div
                                                                    key={i}
                                                                    className="w-20 h-20 rounded-xl overflow-hidden"
                                                                    style={{
                                                                        zIndex: s.images.length - i,
                                                                        marginLeft: i > 0 ? '-12px' : '0',
                                                                    }}
                                                                >
                                                                    <img src={src} alt={s.title} width={80} height={80} className="w-full h-full object-cover" />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                    <div className="flex flex-col gap-2">
                                                        {/* ugyanaz a cím mint a fenti h3-ban (animált be/ki), nem új
                                                            tartalom -> nem heading-elem, hogy ne duplázódjon a címsor-fa */}
                                                        <p className="text-lg font-semibold text-white">{s.title}</p>
                                                        {s.description && (
                                                            <p className="text-white/70 text-sm leading-relaxed">{s.description}</p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* kategóriák csak ha vannak (a főoldali lista szándékosan csak címet + leírást mutat) */}
                                                {s.categories.length > 0 && (
                                                <div>
                                                    <p className="text-sm font-medium text-white/70 tracking-wider mb-4">
                                                        {s.categoriesTitle}
                                                    </p>
                                                    <div className="flex flex-wrap gap-3">
                                                        {s.categories.map((cat, ci) => (
                                                            <span key={ci} className="px-4 py-2 bg-white text-black text-xs font-semibold rounded-full">
                                                                {cat}
                                                            </span>
                                                        ))}
                                                        {s.categoryCount && (
                                                            <span className="px-4 py-2 bg-white/10 text-white text-xs font-semibold rounded-full">
                                                                {s.categoryCount}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                )}
                                            </div>
                                            )}
                                        </motion.div>
                                    </div>

                                    {/* Toggle gomb */}
                                    <div
                                        className="flex items-center justify-end cursor-pointer"
                                        style={{ height: TITLE_H }}
                                        onClick={() => toggle(s.id)}
                                    >
                                        <motion.div
                                            className={`w-12 h-12 border rounded-full flex items-center justify-center transition-colors duration-300 ${isOpen ? 'bg-white border-white' : 'border-white/30'}`}
                                            animate={{ rotate: isOpen ? 180 : 0 }}
                                            whileHover={{ scale: 1.05 }}
                                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                                        >
                                            {isOpen
                                                ? <MinusIcon className="w-5 h-5 text-black" />
                                                : <PlusIcon className="w-5 h-5 text-white" />
                                            }
                                        </motion.div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* CTA */}
                    {cta_title && (
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
                        >
                            <motion.button
                                onClick={onCta}
                                className="inline-block mt-12 md:mt-16 px-8 py-5 bg-white text-black font-semibold rounded-full hover:opacity-80 transition"
                                initial="rest"
                                whileHover="hover"
                                animate="rest"
                            >
                                <div className="overflow-hidden h-5">
                                    <motion.div
                                        className="flex flex-col"
                                        variants={{
                                            rest: { y: '-50%' },
                                            hover: { y: '0%', transition: { duration: 0.3, ease: 'easeInOut' } },
                                        }}
                                    >
                                        <span>{cta_title}</span>
                                        <span aria-hidden className="kb-label" data-k={String(cta_title ?? '')} />
                                    </motion.div>
                                </div>
                            </motion.button>
                        </motion.div>
                    )}
                </div>
            </section>
        </div>
    );
}
