'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, type Variants } from 'framer-motion';
import {
    Plus as PlusIcon,
    Smartphone,
    Zap,
    Search,
    LayoutDashboard,
    Mail,
    Palette,
    Rocket,
    ShieldCheck,
    BarChart3,
    Settings,
    Globe,
    Lock,
    CreditCard,
    Database,
    type LucideIcon,
} from 'lucide-react';

export type CapabilityStat = {
    value?: string;
    suffix?: string;
    label?: string;
};

export type CapabilityItem = {
    id: number;
    number?: string;
    title: string;
    description?: string;
    categories: string[];
    icon?: string;
    images?: string[];
    stats?: CapabilityStat[];
};

const ICON_MAP: Record<string, LucideIcon> = {
    smartphone: Smartphone,
    zap: Zap,
    search: Search,
    'layout-dashboard': LayoutDashboard,
    mail: Mail,
    palette: Palette,
    rocket: Rocket,
    'shield-check': ShieldCheck,
    'bar-chart': BarChart3,
    settings: Settings,
    globe: Globe,
    lock: Lock,
    'credit-card': CreditCard,
    database: Database,
};

const EASE = [0.4, 0, 0.2, 1] as const;
const STEP_MS = 4000;
// Mobilon jóval kisebb és kevesebb csempe fér ki egyszerre a viewportba —
// deszkopon marad a nagy, magas verzió.
const ITEM_H_MOBILE = 220;
const VISIBLE_MOBILE = 1;
const ITEM_H_DESKTOP = 170;
const VISIBLE_DESKTOP = 3;

// A jobb oldali szöveges panel (leírás + cím + CTA + esetleg statisztikák)
// mobilon fix magasságot kap, hogy elem-váltáskor NE ugráljon a tartalom —
// a leírások hossza elemenként eltér, ezért ez nem függhet az
// (amúgy a képcsempék méretezéséhez tartozó) ITEM_H*VISIBLE értéktől.
const TEXT_PANEL_H_MOBILE = 340;

function useResponsiveTileSize() {
    const [isDesktop, setIsDesktop] = useState(false);
    useEffect(() => {
        const mq = window.matchMedia('(min-width: 640px)');
        setIsDesktop(mq.matches);
        const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);
    return isDesktop
        ? { ITEM_H: ITEM_H_DESKTOP, VISIBLE: VISIBLE_DESKTOP, isDesktop }
        : { ITEM_H: ITEM_H_MOBILE, VISIBLE: VISIBLE_MOBILE, isDesktop };
}

const listVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
};

const lineVariants: Variants = {
    hidden: { y: '110%' },
    visible: { y: '0%', transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

// "Text reveal" mikrointerakció (Framer marketplace "text reveal / mask" komponensek
// mintájára): a sor egy overflow-hidden maszk mögül csúszik fel a helyére.
function RevealLine({ children }: { children: React.ReactNode }) {
    return (
        <span className="block overflow-hidden">
            <motion.span className="block" variants={lineVariants}>
                {children}
            </motion.span>
        </span>
    );
}

/* animált szám — a why-choose-us szekcióéval megegyező logika: egyszer,
   scroll-be-éréskor 0-ból felszámol a célértékig. */
function AnimatedStat({ value, suffix, label }: CapabilityStat) {
    const numeric = parseFloat((value || '0').replace(',', '.'));
    return <AnimatedStatInner value={Number.isFinite(numeric) ? numeric : 0} suffix={suffix} label={label} />;
}

function AnimatedStatInner({ value, suffix, label }: { value: number; suffix?: string; label?: string }) {
    const [display, setDisplay] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true });

    useEffect(() => {
        if (!inView) return;
        let start = 0;
        const duration = 1200;
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

    return (
        <div>
            <div className="text-3xl md:text-4xl font-semibold tracking-tight text-black">
                <span ref={ref}>{display}</span>
                {suffix}
            </div>
            {label && <div className="text-sm text-black/50 mt-1 max-w-[16ch]">{label}</div>}
        </div>
    );
}

export function CapabilitiesAccordion({
    heading,
    sub_heading,
    badge_label,
    cta_title,
    cta_anchor,
    items,
}: {
    heading?: string;
    sub_heading?: string;
    badge_label?: string;
    cta_title?: string;
    cta_anchor?: string;
    items: CapabilityItem[];
}) {
    const n = items.length;
    const { ITEM_H, VISIBLE, isDesktop } = useResponsiveTileSize();
    // `step` sosem "ér véget" — se előre, se hátra —, a lista pedig 3x meg van
    // ismételve, így amikor egy teljes körön áthaladtunk (bármelyik irányba),
    // tranzíció nélkül vissza tudunk ugrani pontosan egy környit — mivel a
    // tartalom ott ugyanaz, ez láthatatlan. A kezdő érték a középső másolatra
    // áll (n), hogy visszafelé lépés is azonnal, a legelejétől működjön.
    const [step, setStep] = useState(n);
    const [noTransition, setNoTransition] = useState(false);
    const activeIndex = n > 0 ? ((step % n) + n) % n : 0;
    const active = items[activeIndex];

    // setTimeout-lánc (nem setInterval): minden step-változás — akár automata
    // tick, akár kézi kattintás — újraindítja a visszaszámlálást, így a kézi
    // váltás után is a teljes STEP_MS-t kapja a következő elem.
    useEffect(() => {
        if (n <= 1) return;
        const id = setTimeout(() => setStep((s) => s + 1), STEP_MS);
        return () => clearTimeout(id);
    }, [n, step]);

    useEffect(() => {
        if (noTransition) {
            const raf = requestAnimationFrame(() => setNoTransition(false));
            return () => cancelAnimationFrame(raf);
        }
    }, [noTransition, step]);

    const tripleItems = n > 0 ? [...items, ...items, ...items] : [];

    const next = () => setStep((s) => s + 1);
    const prev = () => setStep((s) => s - 1);

    // Kézi váltás egy adott elemre — a rövidebb irányba lép (előre vagy
    // hátra), nem mindig előre.
    const goTo = (targetIndex: number) => {
        const forward = ((targetIndex - activeIndex) % n + n) % n;
        const delta = forward > n / 2 ? forward - n : forward;
        if (delta === 0) return;
        setStep((s) => s + delta);
    };

    // Érintéses lapozás mobilon — eddig csak a pöttyökre/csempékre kattintva
    // lehetett váltani, swipe-ra semmi nem történt.
    const touchStartX = useRef<number | null>(null);
    const onTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };
    const onTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        touchStartX.current = null;
        const SWIPE_THRESHOLD = 40;
        if (dx <= -SWIPE_THRESHOLD) next();
        else if (dx >= SWIPE_THRESHOLD) prev();
    };

    const onCta = () => {
        const t = (cta_anchor || '').trim();
        if (!t) return;
        if (/^https?:\/\//i.test(t) || t.startsWith('/')) {
            window.location.assign(t);
            return;
        }
        const el = document.getElementById(t.replace(/^#/, ''));
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <motion.section
            className="w-full py-20 md:py-28"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
        >
            <div className="max-w-5xl mx-auto px-4">
                {/* Fejléc — badge + reveal-maszkos cím */}
                <motion.div
                    className="mb-14 md:mb-20 max-w-2xl"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.4 }}
                    variants={listVariants}
                >
                    {badge_label && (
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center">
                                <PlusIcon className="w-3 h-3 text-white" />
                            </div>
                            <p className="text-sm font-medium text-gray-700">{badge_label}</p>
                        </div>
                    )}
                    {heading && (
                        <h2 className="font-semibold tracking-tight leading-[1.05] text-3xl md:text-5xl lg:text-6xl text-black mb-4">
                            <RevealLine>{heading}</RevealLine>
                        </h2>
                    )}
                    {sub_heading && (
                        <p className="text-black/50 text-base md:text-lg max-w-xl">{sub_heading}</p>
                    )}
                </motion.div>

                <div className="flex flex-col sm:grid sm:grid-cols-[36px_130px_1fr] md:grid-cols-[36px_180px_1fr] gap-5 sm:gap-10 items-stretch">
                    {/* Függőleges progress-sín — csak asztalon (a mobil verzió lejjebb, vízszintesen).
                        Nem a teljes oszlopmagasságot tölti ki, csak a saját tartalmára húzza
                        össze magát, és a rendelkezésre álló helyen belül középre igazodik. */}
                    <div className="hidden sm:flex flex-col self-center items-center justify-center rounded-full bg-black py-4 px-2.5 gap-2.5 mx-auto">
                        {items.map((item, idx) => {
                            const isActive = idx === activeIndex;
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => goTo(idx)}
                                    aria-label={item.title}
                                    className="p-1 -m-1"
                                >
                                    <motion.span
                                        className="block w-2 rounded-full"
                                        animate={{
                                            height: isActive ? 52 : 10,
                                            backgroundColor: isActive ? '#ffffff' : 'rgba(255,255,255,0.3)',
                                            boxShadow: isActive
                                                ? '0 0 10px 2px rgba(255,255,255,0.55)'
                                                : '0 0 0 rgba(0,0,0,0)',
                                        }}
                                        transition={{ duration: 0.4, ease: EASE }}
                                    />
                                </button>
                            );
                        })}
                    </div>

                    {/* Auto-görgető, magas, végtelenített kép-oszlop */}
                    <div
                        className="relative overflow-hidden rounded-2xl bg-[#f5f5f5] touch-pan-y"
                        style={{ height: ITEM_H * VISIBLE }}
                        onTouchStart={onTouchStart}
                        onTouchEnd={onTouchEnd}
                    >
                        <motion.div
                            animate={{ y: -step * ITEM_H }}
                            transition={noTransition ? { duration: 0 } : { duration: 0.6, ease: EASE }}
                            onAnimationComplete={() => {
                                if (step >= n * 2) {
                                    setNoTransition(true);
                                    setStep((s) => s - n);
                                } else if (step < n) {
                                    setNoTransition(true);
                                    setStep((s) => s + n);
                                }
                            }}
                        >
                            {tripleItems.map((item, idx) => {
                                const isActive = idx % n === activeIndex;
                                const Icon = (item.icon && ICON_MAP[item.icon]) || ICON_MAP.smartphone;
                                const img = item.images?.[0];
                                return (
                                    <button
                                        key={`${item.id}-${idx}`}
                                        type="button"
                                        onClick={() => goTo(idx % n)}
                                        aria-label={item.title}
                                        className="relative flex items-end justify-start p-4 w-full text-left transition-all duration-500"
                                        style={{ height: ITEM_H }}
                                    >
                                        {img ? (
                                            <div
                                                className="absolute inset-0 bg-cover transition-all duration-500"
                                                style={{
                                                    backgroundImage: `url(${img})`,
                                                    backgroundPosition: 'center 30%',
                                                    filter: isActive ? 'grayscale(0)' : 'grayscale(1) brightness(0.85)',
                                                }}
                                            />
                                        ) : (
                                            <div
                                                className="absolute inset-0 bg-black/5 flex items-center justify-center"
                                                style={{ filter: isActive ? 'none' : 'grayscale(1)' }}
                                            >
                                                <Icon className="w-7 h-7 text-black/40" strokeWidth={1.5} />
                                            </div>
                                        )}
                                        <div
                                            className="absolute inset-0 transition-opacity duration-500"
                                            style={{
                                                background: 'linear-gradient(to top, rgba(0,0,0,0.35), transparent 60%)',
                                                opacity: isActive ? 1 : 0.15,
                                            }}
                                        />
                                    </button>
                                );
                            })}
                        </motion.div>
                        {/* Halványító gradiens a lista alján — csak desktopon, ahol
                            több egymásra épülő csempe van egyszerre látva */}
                        {isDesktop && (
                            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-b from-transparent to-[#f5f5f5]" />
                        )}
                    </div>

                    {/* Jobb oldal — aktív elem szövege, alul elválasztóval + statisztikákkal */}
                    <div
                        className="min-w-0 flex flex-col overflow-hidden"
                        style={isDesktop ? { minHeight: ITEM_H * VISIBLE } : { height: TEXT_PANEL_H_MOBILE }}
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeIndex}
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -24 }}
                                transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                            >
                                <p className="text-xl md:text-3xl font-medium leading-snug tracking-tight text-black mb-4">
                                    {active?.description}
                                </p>
                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm mb-6">
                                    <span className="font-semibold text-black">{active?.title}</span>
                                    {active?.categories?.[0] && (
                                        <span className="text-black/40">· {active.categories[0]}</span>
                                    )}
                                </div>

                                {cta_title && (
                                    <button
                                        onClick={onCta}
                                        className="group inline-flex items-center gap-3 rounded-full bg-black px-5 py-3 text-sm font-semibold text-white overflow-hidden"
                                    >
                                        <span className="block overflow-hidden h-5">
                                            <span className="flex flex-col -translate-y-1/2 transition-transform duration-300 ease-in-out group-hover:translate-y-0">
                                                <span className="h-5 leading-5">{cta_title}</span>
                                                <span className="h-5 leading-5" aria-hidden="true">{cta_title}</span>
                                            </span>
                                        </span>
                                    </button>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        {active?.stats && active.stats.length > 0 && (
                            <div className="mt-auto pt-8">
                                <div className="w-full h-px bg-black/10 mb-6" />
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeIndex}
                                        initial={{ opacity: 0, y: 24 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -24 }}
                                        transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                                        className="flex flex-wrap gap-x-10 gap-y-6"
                                    >
                                        {active.stats.map((s, si) => (
                                            <AnimatedStat key={si} value={s.value} suffix={s.suffix} label={s.label} />
                                        ))}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        )}
                    </div>

                    {/* Vízszintes progress-sín — csak mobilon, legalul */}
                    <div className="inline-flex sm:hidden items-center justify-center rounded-full bg-black px-4 py-2.5 gap-2.5 mx-auto">
                        {items.map((item, idx) => {
                            const isActive = idx === activeIndex;
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => goTo(idx)}
                                    aria-label={item.title}
                                    className="p-1 -m-1"
                                >
                                    <motion.span
                                        className="block h-2 rounded-full"
                                        animate={{
                                            width: isActive ? 52 : 10,
                                            backgroundColor: isActive ? '#ffffff' : 'rgba(255,255,255,0.3)',
                                            boxShadow: isActive
                                                ? '0 0 10px 2px rgba(255,255,255,0.55)'
                                                : '0 0 0 rgba(0,0,0,0)',
                                        }}
                                        transition={{ duration: 0.4, ease: EASE }}
                                    />
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </motion.section>
    );
}
