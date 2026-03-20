// components/services/services-page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getLocalizedSegment } from '@/lib/i18n/segments';

type Page = {
    id: number;
    slug: string;
    label?: string;
    description?: string | null;
    locale: string;
    video_poster?: { url: string } | null;
};

type ServicesPageProps = {
    pages: Page[];
    locale: string;
};

export function ServicesPage({ pages, locale }: ServicesPageProps) {
    const segment = getLocalizedSegment(locale, 'services');
    const [activeDesktop, setActiveDesktop] = useState<number>(0);
    const [activeMobile, setActiveMobile] = useState<number>(0);

    const isHu = locale === 'hu';
    const detailsLabel = isHu ? 'Részletek megtekintése' : 'View details';

    const getImageUrl = (page: Page) =>
        page.video_poster?.url
            ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${page.video_poster.url}`
            : null;

    return (
        <div className="px-4 max-w-7xl mx-auto py-12">


            {/* DESKTOP */}
            <div className="hidden md:flex gap-3" style={{ height: '520px' }}>
                {pages.map((page, idx) => {
                    const isActive = idx === activeDesktop;
                    const imageUrl = getImageUrl(page);

                    return (
                        <Link
                            key={page.id}
                            href={`/${locale}/${segment}/${page.slug}`}
                            className="relative rounded-2xl cursor-pointer flex flex-col bg-white overflow-hidden"
                            style={{
                                flex: isActive ? 2.4 : 1,
                                minWidth: 0,
                                padding: '20px',
                                boxShadow: '0 4px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)',
                                transition: 'flex 450ms cubic-bezier(.4,0,.2,1)',
                            }}
                            onMouseEnter={() => setActiveDesktop(idx)}
                        >
                            {/* + gomb */}
                            <div
                                className="absolute m-2 top-5 right-5 z-20 w-9 h-9 rounded-full bg-black flex items-center justify-center"
                                style={{
                                    transform: isActive ? 'rotate(90deg)' : 'rotate(0deg)',
                                    transition: 'transform 0.45s cubic-bezier(.4,0,.2,1)',
                                }}
                            >
                                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                                    <path d="M12 5v14M5 12h14" />
                                </svg>
                            </div>

                            {/* Kép – fix 300px, nem ugrál, nem nyomja le a szöveget */}
                            {imageUrl && (
                                <div
                                    className="rounded-xl overflow-hidden w-full flex-shrink-0"
                                    style={{
                                        height: isActive ? '360px' : '200px',
                                        transition: 'height 0.45s cubic-bezier(.4,0,.2,1)',
                                    }}
                                >
                                    <div
                                        className="w-full h-full bg-cover bg-center"
                                        style={{
                                            backgroundImage: `url(${imageUrl})`,
                                            transform: isActive ? 'scale(1)' : 'scale(1.04)',
                                            transition: 'transform 0.5s ease',
                                        }}
                                    />
                                </div>
                            )}
                            {/* Szám + cím – mt-auto tolja le */}
                            <div className="flex flex-col gap-2 mt-auto ">
                                <span
                                    style={{
                                        fontSize: '18px',
                                        fontWeight: 800,
                                        color: 'rgba(0,0,0,0.35)',
                                        letterSpacing: '0.04em',
                                        fontVariantNumeric: 'tabular-nums',
                                    }}
                                >
                                    {String(idx + 1).padStart(3, '0')}
                                </span>
                                <div
                                    className="font-semibold tracking-tight leading-tight text-black"
                                    style={{
                                        fontSize: isActive ? '30px' : '20px',
                                        transition: 'font-size 0.35s cubic-bezier(.4,0,.2,1)',
                                        overflow: 'hidden',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: 'vertical',
                                    }}
                                >
                                    {page.label ?? page.slug}
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* MOBIL */}
            <div className="flex flex-col gap-2 md:hidden">
                {pages.map((page, idx) => {
                    const isOpen = idx === activeMobile;
                    const imageUrl = getImageUrl(page);

                    return (
                        <div
                            key={page.id}
                            className="relative rounded-2xl cursor-pointer bg-white"
                            style={{
                                padding: '16px',
                                boxShadow: '0 4px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)',
                                overflow: 'hidden',
                            }}
                            onClick={() => setActiveMobile(idx)}
                        >
                            {/* + gomb */}
                            <div
                                className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black flex items-center justify-center"
                                style={{
                                    transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                                    transition: 'transform 0.45s cubic-bezier(.4,0,.2,1)',
                                }}
                            >
                                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                                    <path d="M12 5v14M5 12h14" />
                                </svg>
                            </div>

                            {/* Kép – bal felső sarokból nő */}
                            {imageUrl && (
                                <div
                                    className="rounded-xl overflow-hidden"
                                    style={{
                                        width: isOpen ? 'calc(100% - 52px)' : '64px',
                                        height: isOpen ? '200px' : '64px',
                                        marginBottom: isOpen ? '12px' : '0',
                                        transition: 'width 0.45s cubic-bezier(.4,0,.2,1), height 0.45s cubic-bezier(.4,0,.2,1), margin-bottom 0.35s ease',
                                    }}
                                >
                                    <div
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            backgroundImage: `url(${imageUrl})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            transform: isOpen ? 'scale(1)' : 'scale(1.06)',
                                            transition: 'transform 0.5s ease',
                                        }}
                                    />
                                </div>
                            )}

                            {/* Szám + cím */}
                            <div
                                style={{
                                    paddingRight: isOpen ? '0' : '52px',
                                    paddingLeft: isOpen ? '0' : imageUrl ? '80px' : '0',
                                    minHeight: isOpen ? 'auto' : '64px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    marginTop: isOpen ? '0' : '-64px',
                                    transition: 'padding 0.45s cubic-bezier(.4,0,.2,1), margin-top 0.45s cubic-bezier(.4,0,.2,1)',
                                }}
                            >
                                <span
                                    className="block tabular-nums mb-0.5"
                                    style={{
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        color: 'rgba(0,0,0,0.35)',
                                        letterSpacing: '0.04em',
                                    }}
                                >
                                    {String(idx + 1).padStart(3, '0')}
                                </span>
                                <span
                                    className="block font-bold tracking-tight leading-tight text-black"
                                    style={{
                                        fontSize: isOpen ? '22px' : '16px',
                                        transition: 'font-size 0.35s cubic-bezier(.4,0,.2,1)',
                                    }}
                                >
                                    {page.label ?? page.slug}
                                </span>
                            </div>

                            {/* Leírás + CTA */}
                            <div
                                style={{
                                    maxHeight: isOpen ? '160px' : '0px',
                                    opacity: isOpen ? 1 : 0,
                                    overflow: 'hidden',
                                    transition: 'max-height 0.4s cubic-bezier(.4,0,.2,1), opacity 0.3s ease',
                                }}
                            >
                                {page.description && (
                                    <p className="text-sm text-black/50 mt-3 leading-relaxed">
                                        {page.description}
                                    </p>
                                )}
                                <Link
                                    href={`/${locale}/${segment}/${page.slug}`}
                                    className="flex items-center justify-center w-full mt-4 py-3.5 rounded-xl bg-black text-white text-sm font-semibold tracking-tight"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {detailsLabel}
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}