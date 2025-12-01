'use client';

/**
 * Services – Dynamic Zone blokk (PRICING-HEZ IGAZÍTVA, VIDEÓT IS TUD)
 * -------------------------------------------------------------------
 * - Azonos héj, mint a pricing: px-0/md:px-2 wrapper, section relative,
 *   ABSZOLÚT háttér, md:rounded-3xl, overflow-hidden.
 * - Háttér: automatikus kép/videó felismerés (Strapi media mime + URL kiterjesztés).
 * - Képekhez sima <img> (nem kell next/image domain), duplázott cím nincs.
 * - categories_title, chipek és CTA anchor rendben.
 */

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus as PlusIcon, Minus as MinusIcon } from 'lucide-react';
import { strapiImage } from '@/lib/strapi/strapiImage';
import { Heading } from '../elements/heading';
import { Subheading } from '../elements/subheading';
// ---------- 1) Props a DynamicZoneManager-től ----------
export type ServicesBlockProps = {
    __component: string;
    id: number;
    locale?: string;

    // Fejléc
    heading?: string;
    sub_heading?: string;
    badge_label?: string;

    // CTA
    cta_title?: string;
    cta_anchor?: string;

    // Háttér (UGYANAZ a minta, mint a pricing-ben) – lehet KÉP vagy VIDEÓ
    background?: { url?: string | null; mime?: string | null } | {
        data?: { attributes?: { url?: string | null; mime?: string | null } }
    } | null;
    background_url?: string | null;

    // Lista
    elements_service_item?: any[];
};

// ---------- 2) Segédek: URL/mime kinyerés + típus detektálás ----------
const toAbs = (m?: any): string | undefined => {
    if (!m) return undefined;
    if (typeof m === 'string') return strapiImage(m);
    if (m?.url) return strapiImage(m.url);
    if (m?.data?.attributes?.url) return strapiImage(m.data.attributes.url);
    return undefined;
};

const getMime = (m?: any): string | undefined => {
    if (!m) return undefined;
    return m?.mime || m?.data?.attributes?.mime || m?.attributes?.mime;
};

// Kiterjesztés alapú videó detektálás fallbackként
const looksLikeVideoUrl = (url?: string) =>
    !!url && /\.(mp4|webm|ogg|ogv|mov|m4v)$/i.test(url);

// Többképes mező kinyerése Strapi-ból
const extractImageUrls = (field: any): string[] => {
    if (!field) return [];
    if (Array.isArray(field?.data)) {
        return field.data
            .map((d: any) => d?.attributes?.url || d?.url)
            .filter(Boolean)
            .map((u: string) => strapiImage(u));
    }
    if (Array.isArray(field)) {
        return field
            .map((m: any) => m?.attributes?.url || m?.url)
            .filter(Boolean)
            .map((u: string) => strapiImage(u));
    }
    const single = field?.attributes?.url || field?.url;
    return single ? [strapiImage(single)] : [];
};

// ---------- 3) UI típus ----------
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

// ============================================================================

export function Services(props: ServicesBlockProps) {
    const {
        heading = 'Services',
        sub_heading = '',
        badge_label = 'What we do',
        cta_title,
        cta_anchor,

        // háttér (jöhet URL vagy Strapi media)
        background,
        background_url,

        elements_service_item,
    } = props;

    // ---------- 4) HÁTTÉR (kép VAGY videó) – pont mint a pricingben, de autodetektálva ----------
    const bgUrlFromUrl = toAbs(background_url);
    const bgUrlFromMedia = toAbs(background);
    const bgMime = getMime(background);

    const rawBgUrl = bgUrlFromUrl || bgUrlFromMedia
        || 'https://framerusercontent.com/images/vrhxHFTuxnCduP4nljUulqZcuQ.jpg';

    const isVideo =
        (bgMime && bgMime.startsWith('video/')) || looksLikeVideoUrl(rawBgUrl || '');

    // ---------- 5) Strapi → UI normalizáció ----------
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

    // ✅ Több nyitott elem támogatása – halmazban tartjuk az ID-ket
    const [openIds, setOpenIds] = useState<Set<number>>(
        () => new Set(services.length ? [services[0].id] : [])
    );

    // ✅ Kattintás: ha már nyitva van → bezárjuk; ha zárt → hozzáadjuk a halmazhoz
    const toggle = (id: number) => {
        setOpenIds(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };
    // CTA hover animációhoz a dupla-szöveg „görgő”
    const wheelVariants = {
        rest: { y: '-50%' },
        hover: { y: '0%', transition: { duration: 0.3, ease: 'easeInOut' } },
    };

    // ---------- 7) CTA: anchor / útvonal / http ----------
    const onCta = () => {
        const t = (cta_anchor || '').trim();
        if (!t) return;
        if (/^https?:\/\//i.test(t) || t.startsWith('/')) {
            window.location.assign(t);
            return;
        }
        const id = t.replace(/^#/, '');
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        else window.location.hash = `#${id}`;
    };

    // ========================================================================

    return (
        <div className="px-0 md:px-2">
            {/* >>> HÉJ: azonos a pricinggel <<< */}
            <section className="w-full px-4 py-20 md:py-32 relative overflow-hidden rounded-none md:rounded-3xl font-sans">
                {/* --- ABSZOLÚT HÁTTÉR réteg: VIDEO vagy KÉP + overlay --- */}
                <div className="absolute inset-0 z-0">
                    {isVideo ? (
                        /* VIDEÓ HÁTTÉR (autoplay + muted + playsInline kötelező iOS miatt) */
                        <video
                            src={rawBgUrl}
                            className="w-full h-full object-cover"
                            autoPlay
                            muted
                            loop
                            playsInline
                            // preload kikapcsolható, ha túl nagy videókat használsz:
                            // preload="metadata"
                            style={{ filter: 'brightness(1.15)' }}
                        />
                    ) : (
                        /* KÉP HÁTTÉR */
                        <img
                            src={rawBgUrl as string}
                            alt="Background"
                            className="w-full h-full object-cover opacity-100"
                            style={{ filter: 'brightness(1.15)' }}
                        />
                    )}
                    {/* Finom overlay a kontraszthoz (pont mint a pricing) */}
                    <div className="absolute inset-0 opacity-5" />
                </div>

                {/* --- TARTALOM --- */}
                <div className="relative z-10 max-w-7xl mx-auto px-0 md:px-0">
                    {/* Fejléc (jelvény + cím + alcím) */}
                    <div className="mb-6">
                        {badge_label && (
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                                    <PlusIcon className="w-2.5 h-2.5 text-black" />
                                </div>
                                <p className="text-xs text-white/80">{badge_label}</p>
                            </div>
                        )}

                        {/* Nagy cím + elemszám */}
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

                    {/* Accordion lista */}
                    <div className="space-y-0">
                        {services.map((s, i) => (
                            <div key={s.id ?? i} className="border-b border-white/10">
                                {/* Sor fej: sorszám + cím + +/- gomb */}
                                <div
                                    className="flex items-center justify-between py-8 cursor-pointer group"
                                    onClick={() => toggle(s.id)}
                                >
                                    <div className="flex items-center space-x-8">
                                        <span className="text-sm font-medium text-white/70">
                                            ({s.number})
                                        </span>
                                        <h3 className="text-2xl md:text-3xl font-semibold text-white group-hover:opacity-80 transition-opacity">
                                            {s.title}
                                        </h3>
                                    </div>

                                    <motion.div
                                        className="w-12 h-12 border border-white/30 rounded-full flex items-center justify-center"
                                        animate={{ rotate: openIds.has(s.id) ? 180 : 0 }}
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                                    >
                                        {openIds.has(s.id) ? (
                                            <MinusIcon className="w-5 h-5 text-white" />
                                        ) : (
                                            <PlusIcon className="w-5 h-5 text-white" />
                                        )}
                                    </motion.div>
                                </div>

                                {/* Nyíló tartalom (csak ha aktív) */}
                                <AnimatePresence initial={false}>
                                    {openIds.has(s.id) && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pb-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                                                {/* Bal: képek + leírás (NINCS második cím) */}
                                                <div className="flex flex-col md:flex-row md:space-x-12">
                                                    {s.images.length > 0 && (
                                                        <div className="relative flex space-x-4">
                                                            {s.images.map((src, idx) => (
                                                                <div
                                                                    key={idx}
                                                                    className={`relative w-20 h-20 rounded-xl overflow-hidden ${idx > 0 ? 'shadow-lg' : ''}`}
                                                                    style={{
                                                                        zIndex: s.images.length - idx,
                                                                        marginLeft: idx > 0 ? '-12px' : '0',
                                                                    }}
                                                                >
                                                                    <img
                                                                        src={src}
                                                                        alt={`${s.title} ${idx + 1}`}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {s.description && (
                                                        <p className="mt-6 md:mt-0 text-white/70 leading-relaxed">
                                                            {s.description}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Jobb: chip-cím + chippek + összesítés */}
                                                <div>
                                                    <h4 className="text-sm font-medium text-white/70 tracking-wider">
                                                        {s.categoriesTitle}
                                                    </h4>
                                                    <div className="flex flex-wrap gap-3 mt-6">
                                                        {s.categories.map((cat, ci) => (
                                                            <span
                                                                key={ci}
                                                                className="px-4 py-2 bg-white text-black text-xs font-semibold rounded-full"
                                                            >
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
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>

                    {/* CTA – dupla szöveg hover, egységesen */}
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
