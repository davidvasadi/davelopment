// app/[locale]/(marketing)/services/page.tsx

import { Metadata } from 'next';

import ClientSlugHandler from '../ClientSlugHandler';
import PageContent from '@/lib/shared/PageContent';
import { ServicesPage } from '@/components/services/services-page';
import { generateMetadataObject } from '@/lib/shared/metadata';
import fetchContentType from '@/lib/strapi/fetchContentType';
import { localeSegments, getLocalizedSegment } from '@/lib/i18n/segments';
import { Container } from '@/components/container';

export async function generateMetadata(props: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const params = await props.params;

    const pageData = await fetchContentType(
        'service',
        {
            locale: params.locale,
            populate: ['seo', 'seo.metaImage'],
        },
        true
    );

    const seo = pageData?.seo;
    const metadata = generateMetadataObject(seo);
    return metadata;
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
                (c: any) => c.__component === 'dynamic-zone.hero'
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

    return (
        <>
            <ClientSlugHandler localizedSlugs={localizedSlugs} />
            <Container>
                <PageContent pageData={pageData} />
                <ServicesPage pages={pagesWithImages} locale={params.locale} />
                <PageContent pageData={{ ...pageData, dynamic_zone: pageData?.cta ?? [] }} />
            </Container>
        </>
    );
}