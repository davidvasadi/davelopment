'use client';

import { useMemo, useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus as PlusIcon, Minus as MinusIcon } from 'lucide-react';
import { strapiImage } from '@/lib/strapi/strapiImage';
import { Heading } from '../elements/heading';

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

// ============================================================
// GRAIN CANVAS — ugyanaz mint a hero-ban
// ============================================================
function GrainCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        let raf: number;
        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener('resize', resize);
        const draw = () => {
            const { width, height } = canvas;
            const img = ctx.createImageData(width, height);
            for (let i = 0; i < img.data.length; i += 4) {
                const a = Math.random() * 25;
                img.data[i]     = 255;
                img.data[i + 1] = 255;
                img.data[i + 2] = 255;
                img.data[i + 3] = a;
            }
            ctx.putImageData(img, 0, 0);
            raf = requestAnimationFrame(draw);
        };
        draw();
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', resize);
        };
    }, []);
    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 1 }}
        />
    );
}

// ============================================================
// SEGÉDEK
// ============================================================
const toAbs = (m?: any): string | undefined => {
    if (!m) return undefined;
    if (typeof m === 'string') return strapiImage(m);
    if (m?.url) return strapiImage(m.url);
    if (m?.data?.attributes?.url) return strapiImage(m.data.attributes.url);
    return undefined;
};

const getMime = (m?: any): string | undefined =>
    m?.mime || m?.data?.attributes?.mime || m?.attributes?.mime;

const looksLikeVideoUrl = (url?: string) =>
    !!url && /\.(mp4|webm|ogg|ogv|mov|m4v)$/i.test(url);

const extractImageUrls = (field: any): string[] => {
    if (!field) return [];
    if (Array.isArray(field?.data))
        return field.data.map((d: any) => d?.attributes?.url || d?.url).filter(Boolean).map((u: string) => strapiImage(u));
    if (Array.isArray(field))
        return field.map((m: any) => m?.attributes?.url || m?.url).filter(Boolean).map((u: string) => strapiImage(u));
    const single = field?.attributes?.url || field?.url;
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
};

const GRID = 'grid grid-cols-[80px_1fr_60px] lg:grid-cols-[200px_1fr_60px]';
const TITLE_H = 96; // px — fejsor magassága (py-8 * 2 + szöveg)
const EASE = [0.76, 0, 0.24, 1] as const;

// ============================================================
// FŐ KOMPONENS
// ============================================================
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
        || 'https://framerusercontent.com/images/vrhxHFTuxnCduP4nljUulqZcuQ.jpg';
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
        }));
    }, [elements_service_item]);

    const [openIds, setOpenIds] = useState<Set<number>>(
        () => new Set(services.length ? [services[0].id] : [])
    );

    const toggle = (id: number) => {
        setOpenIds(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const onCta = () => {
        const t = (cta_anchor || '').trim();
        if (!t) return;
        if (/^https?:\/\//i.test(t) || t.startsWith('/')) { window.location.assign(t); return; }
        const el = document.getElementById(t.replace(/^#/, ''));
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        else window.location.hash = `#${t.replace(/^#/, '')}`;
    };

    return (
        <div className="px-0 md:px-2">
            <section className="w-full px-4 py-20 md:py-32 relative overflow-hidden rounded-none md:rounded-3xl font-sans">

                {/* HÁTTÉR */}
                <div className="absolute inset-0 z-0">
                    {isVideo ? (
                        <video src={rawBgUrl} className="w-full h-full object-cover"
                            autoPlay muted loop playsInline style={{ filter: 'brightness(1.15)' }} />
                    ) : (
                        <img src={rawBgUrl as string} alt=""
                            className="w-full h-full object-cover" style={{ filter: 'brightness(1.15)' }} />
                    )}
                    {/* Grain overlay — ugyanaz mint a hero-ban */}
                    <GrainCanvas />
                    <div className="absolute inset-0 opacity-5" />
                </div>

                {/* TARTALOM */}
                <div className="relative z-10 max-w-7xl mx-auto">

                    {/* FEJLÉC */}
                    <div className="mb-6">
                        {badge_label && (
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                                    <PlusIcon className="w-2.5 h-2.5 text-black" />
                                </div>
                                <p className="text-xs text-white/80">{badge_label}</p>
                            </div>
                        )}
                        {heading && (
                            <Heading className="text-left md:text-center font-bold text-white leading-none tracking-tight">
                                {heading}
                                <span className="text-sm lg:text-3xl font-semibold text-white/60 absolute">
                                    ({services.length})
                                </span>
                            </Heading>
                        )}
                        {sub_heading && (
                            <p className="max-w-3xl text-white/70 mt-4">{sub_heading}</p>
                        )}
                    </div>

                    {/* ACCORDION */}
                    <div>
                        {services.map((s) => {
                            const isOpen = openIds.has(s.id);
                            return (
                                <div key={s.id} className={`border-b border-white/10 ${GRID}`}>

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

                                        {/* Cím sor — overflow hidden, lecsúszik nyitáskor */}
                                        <div
                                            className="overflow-hidden cursor-pointer flex items-center"
                                            style={{ height: TITLE_H }}
                                            onClick={() => toggle(s.id)}
                                        >
                                            <motion.h3
                                                className="text-2xl md:text-3xl font-semibold text-white group-hover:opacity-80"
                                                animate={{
                                                    y: isOpen ? '120%' : '0%',
                                                    opacity: isOpen ? 0 : 1,
                                                }}
                                                transition={{ duration: 0.45, ease: EASE }}
                                            >
                                                {s.title}
                                            </motion.h3>
                                        </div>

                                        {/* Tartalom — felülről csúszik be a cím helyére
                                            marginTop: -TITLE_H tolja fel, paddingTop: TITLE_H kompenzálja */}
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
                                            <div
                                                className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12"
                                                style={{ paddingTop: 41 }}
                                            >
                                                {/* Bal: kép + cím + leírás */}
                                                <div className="flex gap-5 items-start">
                                                    {s.images.length > 0 && (
                                                        <div className="flex shrink-0">
                                                            {s.images.map((src, idx) => (
                                                                <div
                                                                    key={idx}
                                                                    className="w-20 h-20 rounded-xl overflow-hidden"
                                                                    style={{
                                                                        zIndex: s.images.length - idx,
                                                                        marginLeft: idx > 0 ? '-12px' : '0',
                                                                    }}
                                                                >
                                                                    <img src={src} alt="" className="w-full h-full object-cover" />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                    <div className="flex flex-col gap-2">
                                                        <h4 className="text-lg font-semibold text-white">{s.title}</h4>
                                                        {s.description && (
                                                            <p className="text-white/70 text-sm leading-relaxed">{s.description}</p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Jobb: kategóriák */}
                                                <div>
                                                    <h5 className="text-sm font-medium text-white/70 tracking-wider mb-4">
                                                        {s.categoriesTitle}
                                                    </h5>
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
                                            </div>
                                        </motion.div>
                                    </div>

                                    {/* Gomb — eredeti MinusIcon/PlusIcon váltás */}
                                    <div
                                        className="flex items-center justify-end cursor-pointer"
                                        style={{ height: TITLE_H }}
                                        onClick={() => toggle(s.id)}
                                    >
                                        <motion.div
                                            className="w-12 h-12 border border-white/30 rounded-full flex items-center justify-center"
                                            animate={{ rotate: isOpen ? 180 : 0 }}
                                            whileHover={{ scale: 1.05 }}
                                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                                        >
                                            {isOpen
                                                ? <MinusIcon className="w-5 h-5 text-white" />
                                                : <PlusIcon className="w-5 h-5 text-white" />
                                            }
                                        </motion.div>
                                    </div>

                                </div>
                            );
                        })}
                    </div>

                    {/* CTA */}
                    {cta_title && (
                        <motion.button
                            onClick={onCta}
                            className="inline-block mt-6 px-8 py-5 bg-white text-black font-semibold rounded-full hover:opacity-80 transition"
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
                                    <span>{cta_title}</span>
                                </motion.div>
                            </div>
                        </motion.button>
                    )}
                </div>
            </section>
        </div>
    );
}
