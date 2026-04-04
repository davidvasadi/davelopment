export const dynamic = 'force-dynamic'
// app/[locale]/(marketing)/services/page.tsx

import { Metadata } from 'next';

import ClientSlugHandler from '../ClientSlugHandler';
import PageContent from '@/lib/shared/PageContent';
import { ServicesPage } from '@/components/services/services-page';
import JsonLd from '@/components/seo/JsonLd';
import { generateMetadataObject, buildAlternates } from '@/lib/shared/metadata';
import { webPageSchema, resolveSchema } from '@/lib/shared/structured-data';
import fetchContentType from '@/lib/strapi/fetchContentType';
import { localeSegments, getLocalizedSegment } from '@/lib/i18n/segments';
import { Container } from '@/components/container';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://davelopment.hu').replace(/\/+$/, '');

export async function generateMetadata(props: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const params = await props.params;

    const pageData = await fetchContentType(
        'service',
        { locale: params.locale },
        true
    );

    const segment = getLocalizedSegment(params.locale, 'services');
    // Build alternates manually — service is a global, not a collection
    const altLocale = params.locale === 'hu' ? 'en' : 'hu';
    const altSegment = getLocalizedSegment(altLocale, 'services');
    return {
        ...generateMetadataObject(pageData?.seo),
        alternates: buildAlternates(
            params.locale,
            `/${params.locale}/${segment}`,
            [{ locale: altLocale, slug: altSegment }],
            pageData?.seo?.canonicalURL,
        ),
    };
}

export default async function ServicesRoute(props: {
    params: Promise<{ locale: string }>;
}) {
    const params = await props.params;

    const pageData = await fetchContentType(
        'service',
        {
            locale: params.locale,
            populate: {
                dynamic_zone: {
                    on: {
                        'dynamic-zone.hero': {
                            populate: {
                                CTAs: true,
                                video: true,
                                video_poster: true,
                            },
                        },
                        'dynamic-zone.why-choose-us': {
                            populate: {
                                why_choose_us: {
                                    populate: {
                                        background: true,
                                        CTAs: true,
                                    },
                                },
                                why_choose_us_item: true,
                            },
                        },
                    },
                },
                pages: true,
                cta: {
                    on: {
                        'dynamic-zone.products': {
                            populate: {
                                projects: {
                                    populate: {
                                        product: {
                                            populate: {
                                                images: true,
                                            },
                                        },
                                        tags: true,
                                    },
                                },
                            },
                        },
                        'dynamic-zone.faq': {
                            populate: {
                                faqs: true,
                            },
                        },
                        'dynamic-zone.cta': {
                            populate: {
                                CTAs: true,
                                image: true,
                            },
                        },
                    },
                },
                seo: {
                    populate: {
                        metaImage: true,
                    },
                },
            },
        },
        true
    );

    const pagesWithImages = await Promise.all(
        (pageData?.pages ?? []).map(async (page: any) => {
            const fullPage = await fetchContentType(
                'pages',
                {
                    filters: {
                        slug: page.slug,
                        locale: params.locale,
                    },
                    populate: {
                        dynamic_zone: {
                            populate: '*',
                        },
                    },
                },
                true
            ).catch(() => null);

            const hero = fullPage?.dynamic_zone?.find(
                (c: any) => c.blockType === 'hero'
            );

            return {
                ...page,
                video_poster: hero?.video_poster ?? null,
            };
        })
    );

    const localizedSlugs = Object.keys(localeSegments).reduce(
        (acc, loc) => {
            acc[loc] = getLocalizedSegment(loc, 'services');
            return acc;
        },
        {} as Record<string, string>
    );

    const segment = getLocalizedSegment(params.locale, 'services');
    const jsonLd = resolveSchema(
        webPageSchema({
            title: pageData?.seo?.metaTitle || 'Services',
            description: pageData?.seo?.metaDescription,
            url: `${SITE_URL}/${params.locale}/${segment}`,
        }),
        pageData?.seo?.structuredData
    );

    return (
        <>
            <JsonLd data={jsonLd} />
            <ClientSlugHandler localizedSlugs={localizedSlugs} />
            <Container>
                <PageContent pageData={pageData} locale={params.locale} />
                <ServicesPage pages={pagesWithImages} locale={params.locale} />
                <PageContent pageData={{ ...pageData, dynamic_zone: pageData?.cta ?? [] }} locale={params.locale} />
            </Container>
        </>
    );
}