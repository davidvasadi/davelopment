'use client';

import React from 'react';
import { Link } from 'next-view-transitions';
import { motion } from 'framer-motion';
import { PillLink } from '@/components/pill-link';
import { strapiImage } from '@/lib/strapi/strapiImage';
import type { ServiceDetail } from '@/lib/services/service-details';

/**
 * Szolgáltatás-aloldalak új fejléce (2026-11, referencia alapján, a mi arculatunkkal) — a régi CMS-es
 * service-hero helyett. Balra: breadcrumb, h1, nagy alcím, elválasztó, „kinek szól” szöveg + pontok, gombok.
 * Jobbra: kép + fehér kártya (induló ár · átlagos átfutás). A tartalom slugonként: lib/services/service-details.ts (HU/EN);
 * amelyik aloldalnak még nincs bejegyzése, annál marad a régi hero (lásd services/[slug]/page.tsx).
 * Az árak a főoldali árazással egyeznek (components/dynamic-zone/pricing-simple.tsx).
 */
export function ServiceDetailHero({ detail, locale = 'hu' }: { detail: ServiceDetail; locale?: string }) {
  const hu = locale !== 'en';
  const ease = [0.33, 1, 0.68, 1] as const;
  const servicesHref = hu ? '/hu/szolgaltatasok' : '/en/services';
  return (
    <section className="w-full px-4 pb-16 pt-6 md:px-8 md:pb-24 md:pt-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
        {/* Bal oldal */}
        <motion.div className="lg:col-span-7" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }}>
          <nav aria-label={hu ? 'Morzsamenü' : 'Breadcrumb'} className="text-xs">
            <ol className="flex items-center gap-2">
              <li>
                <Link href={servicesHref as never} className="text-black transition-opacity hover:opacity-60">
                  {hu ? 'Szolgáltatások' : 'Services'}
                </Link>
              </li>
              <li aria-hidden className="text-black/40">/</li>
              <li aria-current="page" className="text-black/50">{detail.crumb}</li>
            </ol>
          </nav>

          <h1 className="mt-6 text-5xl font-semibold leading-[0.9] tracking-[-0.05em] text-black md:text-7xl xl:text-8xl">{detail.title}</h1>
          <p className="mt-8 max-w-2xl text-2xl font-semibold leading-[1.1] tracking-[-0.055em] text-black md:mt-10 md:text-4xl">{detail.lead}</p>

          <div className="mt-8 grid grid-cols-1 gap-6 border-t border-black/10 pt-6 md:mt-10 md:grid-cols-2 md:gap-12 md:pt-8">
            <p className="text-sm leading-relaxed text-black md:text-base">{detail.audience}</p>
            <ul className="space-y-2">
              {detail.points.map((pt) => (
                <li key={pt} className="flex items-start gap-3 text-sm font-medium text-black md:text-base">
                  <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F05A28]" />
                  {pt}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-8">
            <PillLink href={hu ? '/hu/kapcsolat' : '/en/contact'} cta="service-hero:start">{detail.cta}</PillLink>
            <a href="#faq" className="border-b-2 border-black pb-0.5 text-sm font-semibold text-black transition-opacity hover:opacity-60 md:text-base">
              {detail.question}
            </a>
          </div>
        </motion.div>

        {/* Jobb oldal: kép + ár/átfutás kártya */}
        <motion.div className="flex flex-col gap-2 lg:col-span-5 lg:pt-12" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1, ease }}>
          <div className="relative aspect-[16/10] overflow-hidden rounded-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={strapiImage(`/api/media/file/${detail.image}`)} alt={detail.imageAlt} className="h-full w-full object-cover" fetchPriority="high" />
          </div>
          <dl className="grid grid-cols-2 rounded-card border border-black/10 bg-white">
            <div className="p-5 md:p-6">
              <dt className="text-base text-black md:text-lg">{detail.priceLabel}</dt>
              <dd className="mt-3 flex items-baseline gap-2">
                {!hu && <span className="font-mono text-sm text-black/50">{detail.priceSuffix}</span>}
                <span className="text-3xl font-semibold tracking-[-0.04em] text-black md:text-4xl">{detail.price}</span>
                {hu && <span className="text-base text-black/60">{detail.priceSuffix}</span>}
              </dd>
            </div>
            <div className="border-l border-black/10 p-5 md:p-6">
              <dt className="font-mono text-xs text-black/50 md:text-sm">{detail.timeLabel}</dt>
              <dd className="mt-3 text-lg font-medium text-black">{detail.time}</dd>
            </div>
          </dl>
        </motion.div>
      </div>
    </section>
  );
}
