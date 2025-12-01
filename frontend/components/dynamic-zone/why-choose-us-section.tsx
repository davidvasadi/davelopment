'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import { Plus as PlusIcon } from 'lucide-react';
import { strapiImage } from '@/lib/strapi/strapiImage';

/* helpers */
const toAbs = (m?: any): string | undefined => {
    if (!m) return undefined;
    if (typeof m === 'string') return strapiImage(m);
    if (m?.url) return strapiImage(m.url);
    if (m?.data?.attributes?.url) return strapiImage(m.data.attributes.url);
    if (m?.attributes?.url) return strapiImage(m.attributes.url);
    return undefined;
};
const getMime = (m?: any): string | undefined =>
    m?.mime || m?.data?.attributes?.mime || m?.attributes?.mime;

/* heading: első vessző után szürkébb */
const splitAtFirstComma = (txt?: string | null): { left: string; right: string } => {
    if (!txt) return { left: '', right: '' };
    const i = txt.indexOf(',');
    if (i === -1) return { left: txt, right: '' };
    return { left: txt.slice(0, i + 1), right: txt.slice(i + 1).trimStart() };
};

/* subheading: első mondat fekete, többi szürke */
const splitFirstSentence = (txt?: string | null): { lead: string; rest: string } => {
    if (!txt) return { lead: '', rest: '' };
    const m = txt.match(/([\s\S]+?[.!?])(.*)$/);
    if (!m) return { lead: txt, rest: '' };
    return { lead: m[1].trim(), rest: m[2].trim() };
};

/* Strapi típusok */
type LinkBtn = { text?: string | null; URL?: string | null; url?: string | null; target?: string | null; variant?: string | null };
type SocialMediaIconLinks = { image?: any; link?: LinkBtn[] | LinkBtn | null };
type WhyChooseUsItem = { id: number; number?: string | null; title?: string | null; description?: string | null; social_media_links?: SocialMediaIconLinks[] | null };
type WhyChooseUsCard = { title?: string | null; background?: any | null; CTAs?: LinkBtn | LinkBtn[] | null };

export type WhyChooseUsProps = {
    __component: string;
    id: number;
    locale?: string;
    heading?: string | null;
    sub_heading?: string | null;
    badge_label?: string | null;
    why_choose_us?: WhyChooseUsCard | null;
    why_choose_us_item?: WhyChooseUsItem[] | null;
};

/* belső UI típus – NOTE: url property-t használunk, nem "href"-et, hogy ne ütközzön semmivel */
type UIStat = {
    id: number;
    rawNumber?: string;
    value?: number;
    suffix?: string;
    title?: string;
    description?: string;
    logos: { src: string; url?: string; target?: string }[];
};

const getFirstLink = (link: LinkBtn[] | LinkBtn | null | undefined): LinkBtn | undefined =>
    Array.isArray(link) ? link[0] : link || undefined;

/* CTA görgő variáns */
const wheelVariants: Variants = {
    rest: { y: '-50%' },
    hover: { y: '0%', transition: { duration: 0.25, ease: 'easeInOut' } },
};

export function WhyChooseUsSection({
    heading,
    sub_heading,
    badge_label,
    why_choose_us,
    why_choose_us_item,
}: WhyChooseUsProps) {
    /* Hero */
    const heroUrl = toAbs(why_choose_us?.background) || 'https://davelopment.hu/assets/profile-DMhlnSSY.jpg';
    const heroMime = getMime(why_choose_us?.background);
    const heroIsVideo = !!heroMime?.startsWith('video/');

    /* CTA */
    const rawCTA = getFirstLink(why_choose_us?.CTAs);
    const ctaHref: string | undefined = rawCTA?.URL ?? rawCTA?.url ?? undefined;
    const ctaTarget = rawCTA?.target || undefined;
    const ctaText = rawCTA?.text || 'Let’s talk';

    /* Stats normalizálás */
    const stats: UIStat[] = useMemo(() => {
        const items = Array.isArray(why_choose_us_item) ? why_choose_us_item : [];
        return items.map((it, idx) => {
            const raw = (it?.number || '').toString().trim();
            const m = raw.match(/^\s*(\d+(?:[.,]\d+)?)(.*)$/);
            const value = m ? parseFloat(m[1].replace(',', '.')) : undefined;
            const suffix = m ? (m[2] || '').trim() : '';

            const logos: UIStat['logos'] = [];
            (it?.social_media_links || []).forEach((s) => {
                const src = toAbs(s?.image);
                if (src) {
                    const first = getFirstLink(s?.link);
                    logos.push({ src, url: first?.URL ?? first?.url ?? undefined, target: first?.target || undefined });
                }
            });

            return { id: it?.id ?? idx, rawNumber: raw, value, suffix, title: it?.title || '', description: it?.description || '', logos };
        });
    }, [why_choose_us_item]);

    const { left: headingLeft, right: headingRight } = splitAtFirstComma(heading);
    const { lead: subLead, rest: subRest } = splitFirstSentence(sub_heading);

    return (
        <section className="w-full py-16 md:py-28">
            <div className="max-w-7xl mx-auto px-6 md:px-8 py-4">
                {/* badge + heading */}
                <div className="space-y-4">
                    {badge_label && (
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center">
                                <PlusIcon className="w-3 h-3 text-white" />
                            </div>
                            <p className="text-sm font-medium text-gray-700">{badge_label}</p>
                        </div>
                    )}

                    {/* FONTOS: sima <h2>, nem a saját Heading komponensed */}
                    {(headingLeft || headingRight) && (
                        <h2 className="text-left md:text-center font-bold tracking-tight py-2  md:py-10">
                            <span className="text-black text-3xl md:text-5xl lg:text-6xl">{headingLeft} </span>
                            {!!headingRight && <span className="text-black/60 text-3xl md:text-5xl lg:text-6xl">{headingRight}</span>}
                        </h2>
                    )}
                </div>

                {/* kétoszlopos tartalom – md-től gap-10 */}
                <div className="mt-8 md:flex md:items-stretch gap-[2rem] md:gap-[4rem] lg:gap-[8rem] xl:gap-[15rem]">
                    {/* BAL: hero – csak hoverre blur/sötétítés, cím csak hoverre; gomb régi animmal, saját szélesség */}
                    <motion.div
                        className="relative rounded-2xl overflow-hidden h-[520px] mx-auto    max-w-[360px]  md:w-[360px]  lg:w-[300px]  shrink-0 group"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <div className="absolute inset-0">
                            {heroIsVideo ? (
                                <video
                                    src={heroUrl}
                                    className="w-full h-full object-cover  transition-transform duration-500 group-hover:scale-105"
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                />
                            ) : (
                                <img
                                    src={heroUrl}
                                    alt="Why choose us hero"
                                    className="w-full h-full object-cover transition-[transform,filter] duration-500 group-hover:blur-sm group-hover:scale-105"
                                />
                            )}
                            {/* alapból nincs sötétítés; csak hoverre */}
                            <div className="absolute inset-0 bg-gray-900/20 group-hover:bg-black/60 transition-colors duration-500" />
                        </div>

                        {/* plus ikon – hoverre forog */}
                        <div className="absolute top-6 left-6 w-8 h-8 bg-gray-900/80 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:rotate-90">
                            <PlusIcon className="w-4 h-4 text-white" />
                        </div>

                        <div className="absolute inset-0 flex flex-col justify-end p-6">
                            {!!why_choose_us?.title && (
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 mb-3">
                                    <h3 className="text-sm font-semibold text-white">{why_choose_us.title}</h3>
                                </div>
                            )}

                            {!!ctaHref && (
                                <motion.a
                                    href={ctaHref}
                                    target={ctaTarget}
                                    rel={ctaTarget === '_blank' ? 'noopener noreferrer' : undefined}
                                    initial="rest"
                                    whileHover="hover"
                                    animate="rest"
                                    className="inline-flex self-start items-center gap-3
                             rounded-full bg-white/10 text-white
                             px-5 py-2 font-semibold text-sm
                             backdrop-blur-sm border border-white/10"
                                >
                                    <div className="overflow-hidden h-5">
                                        <motion.div className="flex flex-col" variants={wheelVariants}>
                                            <span>{ctaText}</span>
                                            <span aria-hidden="true">{ctaText}</span>
                                        </motion.div>
                                    </div>
                                    <span className="flex items-center gap-1">
                                        <motion.span className="w-1.5 h-1.5 rounded-full bg-white" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity }} />
                                        <motion.span className="w-1.5 h-1.5 rounded-full bg-white" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.25 }} />
                                    </span>
                                </motion.a>
                            )}
                        </div>
                    </motion.div>

                    {/* JOBB: subheading + statok; md+-tól a bal kártya magasságát tartja */}
                    <motion.div
                        className="max-w-xl mt-8 md:mt-0 flex-1 justify-end md:min-h-[460px] lg:min-h-[520px]"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        viewport={{ once: true }}
                    >
                        {(subLead || subRest) && (
                            <p className="max-w-lg text-left mb-8 indent-14">
                                <span className="text-black font-medium">{subLead}</span>{' '}
                                <span className="text-gray-600">{subRest}</span>
                            </p>
                        )}

                        {stats.length > 0 ? (
                            // fuggoleges gap-2
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-1 content-start">
                                {stats.map((s, i) => (
                                    <motion.div
                                        key={s.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.08 * i }}
                                        viewport={{ once: true }}
                                        className="space-y-1"
                                    >
                                        {/* felső doboz: nagy szám + sorszám */}
                                        <div className="bg-white rounded-2xl p-6 flex items-end justify-between">
                                            <div className="text-5xl md:text-6xl font-semibold tracking-tight text-black">
                                                {typeof s.value === 'number' ? (
                                                    <>
                                                        <AnimatedNumber value={s.value} />
                                                        {s.suffix}
                                                    </>
                                                ) : (
                                                    s.rawNumber || '—'
                                                )}
                                            </div>
                                            <div className="text-xs font-semibold text-gray-500">
                                                {(i + 1).toString().padStart(2, '0')}
                                            </div>
                                        </div>

                                        {/* alsó doboz: title felül; alján description + social (fekete-fehér, név nélkül) */}
                                        <div className=" bg-white rounded-2xl p-6 md:p-8 min-h-[250px] md:min-h-[300px] flex flex-col">
                                            {!!s.title && (
                                                <h4 className="text-sm md:text-base font-semibold text-black text-right">
                                                    {s.title}
                                                </h4>
                                            )}

                                            <div className="mt-auto">
                                                {!!s.description && (
                                                    <p className="text-sm text-gray-600 mb-4">{s.description}</p>
                                                )}

                                                {s.logos.length > 0 && (
                                                    <div className="flex flex-wrap items-center gap-4 grayscale opacity-60">
                                                        {s.logos.slice(0, 10).map((lg, li) =>
                                                            lg.url ? (
                                                                <a key={li} href={lg.url} target={lg.target} rel={lg.target === '_blank' ? 'noopener noreferrer' : undefined}>
                                                                    <img src={lg.src} alt="" className="h-6 object-contain" />
                                                                </a>
                                                            ) : (
                                                                <img key={li} src={lg.src} alt="" className="h-6 object-contain" />
                                                            )
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">Nincs <code>why_choose_us_item</code> elem. Ellenőrizd az adatot és a populate-ot.</p>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

/* animált szám */
function AnimatedNumber({ value }: { value: number }) {
    const ref = useRef<HTMLSpanElement | null>(null);
    const inView = useInView(ref);
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        if (!inView) return;
        let start = 0;
        const duration = 1600;
        const step = value / (duration / 16);
        const timer = setInterval(() => {
            start += step;
            if (start >= value) {
                setDisplay(value);
                clearInterval(timer);
            } else {
                setDisplay(Math.floor(start));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [inView, value]);

    return <span ref={ref}>{display}</span>;
}

export default WhyChooseUsSection;
