// frontend/components/products/single-product.tsx
'use client';

import { motion } from 'framer-motion';
import { Link } from 'next-view-transitions';
import React from 'react';

import { PillLink } from '@/components/pill-link';
import { StrapiImage } from '@/components/ui/strapi-image';
import { localizedCategories } from '@/lib/category-locale';
import { getLocalizedSegment } from '@/lib/i18n/segments';
import { strapiImage } from '@/lib/strapi/strapiImage';
import { Product } from '@/types/types';

/**
 * Projekt-aloldal (2026-11, az új arculat szerint — ugyanaz a nyelv, mint a szolgáltatás-aloldalakon):
 * breadcrumb · h1 · leírás · adatsor (év, iparág, munkaterület, időkeret) · gombok → nagy fő média →
 * két kép egymás mellett → „kihívás” szakasz (badge + cím balra, szöveg jobbra) → széles képek →
 * „záró gondolatok” szakasz → kategóriák. A tartalom a CMS termék-mezőiből jön; a CMS-blokkok (CTA, hírlevél)
 * a route-ban utána következnek.
 */
const ease = [0.33, 1, 0.68, 1] as const;
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.6, ease, delay },
});

// Egy szöveges mezőt bekezdésekre/valódi listákra bont: a "- " kezdetű sorok listaelemek (narancs pöttyel), a többi bekezdés.
function renderTextBlocks(text?: string | null) {
  if (!text) return null;
  const lines = text.split('\n').filter((l) => l.trim());
  const blocks: React.ReactNode[] = [];
  let list: string[] = [];
  const flush = () => {
    if (!list.length) return;
    blocks.push(
      <ul key={`l-${blocks.length}`} className="space-y-3">
        {list.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F05A28]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>,
    );
    list = [];
  };
  lines.forEach((line) => {
    if (line.startsWith('- ')) list.push(line.slice(2));
    else {
      flush();
      blocks.push(<p key={`p-${blocks.length}`}>{line}</p>);
    }
  });
  flush();
  return blocks;
}

function Section({ badge, heading, text, button }: { badge?: string; heading?: string; text?: string; button?: { text?: string; URL?: string } | null }) {
  if (!heading && !text) return null;
  // a CMS-ben néhol egész bekezdés a cím — hosszú címnél kisebb betű és szélesebb bal oszlop, hogy ne legyen 12 soros
  const long = (heading?.length ?? 0) > 90;
  return (
    <motion.section className="grid grid-cols-1 gap-8 border-t border-black/10 pt-10 lg:grid-cols-12 lg:gap-16 lg:pt-14" {...fadeUp()}>
      <div className={long ? 'lg:col-span-6' : 'lg:col-span-5'}>
        {badge && (
          <div className="mb-6 flex items-center gap-2">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#F05A28]" />
            <span className="text-sm font-medium text-black/60">{badge}</span>
          </div>
        )}
        {heading && (
          <h2 className={`font-semibold tracking-[-0.03em] text-black ${long ? 'text-2xl leading-[1.2] md:text-3xl' : 'text-3xl leading-[1.05] tracking-[-0.04em] md:text-4xl xl:text-5xl'}`}>{heading}</h2>
        )}
      </div>
      <div className={long ? 'lg:col-span-6' : 'lg:col-span-7'}>
        <div className="max-w-2xl space-y-5 text-base leading-relaxed text-black/75 md:text-lg">{renderTextBlocks(text)}</div>
        {button?.text && button?.URL && <PillLink href={button.URL} className="mt-8" cta={`project:${button.text}`}>{button.text}</PillLink>}
      </div>
    </motion.section>
  );
}

export const SingleProduct = ({ product, locale }: { product: Product; locale: string }) => {
  const hu = locale !== 'en';
  const p = product as any;
  const { badge_label_center, heading_center, description_center, button_center, badge_label_bottom, heading_bottom, description_bottom, button_bottom, year, industry, scope, timeline } = p;

  const isHeroVideo = !!product.media?.mimeType?.startsWith('video/');
  const heroUrl = product.media?.url ? strapiImage(product.media.url) : null;
  const gallery: any[] = product.images ?? [];
  const pair = gallery.slice(1, 3);
  const wide = gallery.slice(3);
  const categories = localizedCategories(product.categories as any[], locale);

  const meta = [
    { label: hu ? 'Év' : 'Year', value: year },
    { label: hu ? 'Iparág' : 'Industry', value: industry },
    { label: hu ? 'Munkaterület' : 'Scope of work', value: scope },
    { label: hu ? 'Időkeret' : 'Timeline', value: timeline },
  ].filter((m) => m.value);

  const [lead, ...restSentences] = String(product.description ?? '').split(/(?<=[.!?])\s+/);
  const projectsHref = `/${locale}/${getLocalizedSegment(locale, 'products')}`;
  const nameLen = product.name?.length ?? 0;
  const titleSize = nameLen > 22 ? 'text-5xl md:text-7xl' : 'text-5xl md:text-8xl xl:text-[8rem]';
  // a fejléc gombja: a középső gomb (pl. „Alkalmazás megnyitása”), ha van; mellette a saját projekt-ajánlatkérés
  const primary = button_center?.text && button_center?.URL ? button_center : button_bottom?.text && button_bottom?.URL ? button_bottom : null;

  return (
    <div className="w-full px-4 pb-16 pt-6 md:px-8 md:pb-24 md:pt-8">
      {/* Fejléc */}
      <motion.header initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }}>
        <nav aria-label={hu ? 'Morzsamenü' : 'Breadcrumb'} className="text-xs">
          <ol className="flex items-center gap-2">
            <li><Link href={projectsHref as never} className="text-black transition-opacity hover:opacity-60">{hu ? 'Projektek' : 'Projects'}</Link></li>
            <li aria-hidden className="text-black/40">/</li>
            <li aria-current="page" className="text-black/50">{product.name}</li>
          </ol>
        </nav>
        <h1 className={`mt-6 break-words font-semibold leading-[0.9] tracking-[-0.05em] text-black ${titleSize}`}>{product.name}</h1>

        <div className="mt-10 grid grid-cols-1 gap-10 md:mt-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            {p.badge_label && (
              <div className="mb-5 flex items-center gap-2">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#F05A28]" />
                <span className="text-sm font-medium text-black/60">{p.badge_label}</span>
              </div>
            )}
            {lead && (
              <p className="max-w-3xl text-xl leading-snug tracking-[-0.02em] text-black md:text-3xl">
                <span className="font-semibold">{lead}</span>
                {restSentences.length > 0 && <span className="text-black/60"> {restSentences.join(' ')}</span>}
              </p>
            )}
            <div className="mt-8 flex flex-wrap items-center gap-6">
              {primary && <PillLink href={primary.URL} cta={`project-hero:${primary.text}`}>{primary.text}</PillLink>}
              <Link href={(hu ? '/hu/kapcsolat' : '/en/contact') as never} className="border-b-2 border-black pb-0.5 text-sm font-semibold text-black transition-opacity hover:opacity-60 md:text-base">
                {hu ? 'Beszéljünk a projektedről' : 'Talk about your project'}
              </Link>
            </div>
          </div>
          {meta.length > 0 && (
            <dl className="grid grid-cols-2 self-end border-t border-black/10 lg:col-span-5">
              {meta.map((m, i) => (
                <div key={m.label} className={`border-b border-black/10 py-4 ${i % 2 === 1 ? 'border-l pl-5' : 'pr-5'}`}>
                  <dt className="text-xs text-black/50">{m.label}</dt>
                  <dd className="mt-1 text-base font-medium text-black">{m.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </motion.header>

      {/* Fő média */}
      {heroUrl && (
        <motion.div className="relative mt-12 aspect-[16/10] overflow-hidden rounded-card bg-black/5 md:mt-16 md:aspect-[16/8]" {...fadeUp()}>
          {isHeroVideo ? (
            <video className="absolute inset-0 h-full w-full object-cover" src={heroUrl} autoPlay loop muted playsInline />
          ) : (
            <StrapiImage src={heroUrl} alt={product.media?.alt || product.name} fill priority sizes="100vw" className="object-cover" />
          )}
        </motion.div>
      )}

      {/* Két kép egymás mellett */}
      {pair.length > 0 && (
        <div className={`mt-2 grid grid-cols-1 gap-2 md:mt-3 md:gap-3 ${pair.length > 1 ? 'md:grid-cols-2' : ''}`}>
          {pair.map((img, i) => (
            <motion.div key={img.url ?? i} className="relative aspect-[4/3] overflow-hidden rounded-card bg-black/5" {...fadeUp(0.05 * i)}>
              <StrapiImage src={strapiImage(img.url)} alt={img.alt || product.name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
            </motion.div>
          ))}
        </div>
      )}

      <div className="mt-20 space-y-20 md:mt-28 md:space-y-28">
        <Section badge={badge_label_center} heading={heading_center} text={description_center} button={heroUrl ? null : button_center} />

        {wide.length > 0 && (
          <div className="space-y-2 md:space-y-3">
            {wide.map((img, i) => (
              <motion.div key={img.url ?? i} className="overflow-hidden rounded-card bg-black/5" {...fadeUp()}>
                <StrapiImage src={strapiImage(img.url)} alt={img.alt || product.name} width={1600} height={900} sizes="100vw" className="h-auto w-full object-cover" />
              </motion.div>
            ))}
          </div>
        )}

        <Section badge={badge_label_bottom} heading={heading_bottom} text={description_bottom} />

        {categories.length > 0 && (
          <motion.div {...fadeUp()}>
            <p className="mb-4 text-sm text-black/50">{hu ? 'Kategóriák' : 'Categories'}</p>
            <ul className="flex flex-wrap gap-2">
              {categories.map((c: any) => (
                <li key={c.id ?? c.name} className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-black">{c.name}</li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>
    </div>
  );
};
