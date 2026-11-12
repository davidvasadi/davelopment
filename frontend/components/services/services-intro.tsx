'use client';

import React from 'react';
import { Link } from 'next-view-transitions';
import { motion } from 'framer-motion';
import { PlusIcon } from 'lucide-react';
import { PillLink } from '@/components/pill-link';

/**
 * Szolgáltatások oldal teteje (2026-11, referencia alapján, a mi színeinkkel): a badge a h1 („Szolgáltatások”),
 * alatta nagy cím, alatta rövid szöveg + gomb (egymás alatt, balra). A régi CMS-hero helyett jelenik meg (app/[locale]/(marketing)/services/page.tsx).
 */
function content(hu: boolean) {
  return hu
    ? {
        badge: 'Szolgáltatások',
        heading: 'Öt szolgáltatás,',
        heading2: 'egy csapat.',
        text: 'Stratégia, tervezés, fejlesztés és támogatás weboldalaknak. Akivel az első beszélgetésen találkozol, az viszi végig a projektet — a tervezéstől a fejlesztésig, az indulásig és utána is.',
        cta: 'Kezdjük el a projektet',
        href: '/hu/kapcsolat',
        items: [
          { title: 'Weboldalak', price: '190 000 Ft-tól', slug: 'weboldal-keszites' },
          { title: 'Újratervezés', price: '190 000 Ft-tól', slug: 'weboldal-ujratervezes' },
          { title: 'Marketing & SEO', price: '330 000 Ft-tól', slug: 'marketing-es-seo' },
          { title: 'Arculat és design', price: '190 000 Ft-tól', slug: 'branding-arculat' },
          { title: 'Támogatás és növekedés', price: '29 900 Ft/hó-tól', slug: 'karbantartas' },
        ],
      }
    : {
        badge: 'Services',
        heading: 'Five services,',
        heading2: 'one team.',
        text: 'Strategy, design, build and care for websites. The person on your first call designs and builds the project, until launch and after.',
        cta: 'Start a project',
        href: '/en/contact',
        items: [
          { title: 'Websites', price: 'from 190,000 HUF', slug: 'start-your-business-online' },
          { title: 'Redesigns', price: 'from 190,000 HUF', slug: 'website-redesign' },
          { title: 'Marketing & SEO', price: 'from 330,000 HUF', slug: 'marketing-and-seo' },
          { title: 'Brand & design', price: 'from 190,000 HUF', slug: 'branding-identity' },
          { title: 'Support & growth', price: 'from 29,900 HUF/month', slug: 'maintenance' },
        ],
      };
}

export function ServicesIntro({ locale = 'hu' }: { locale?: string }) {
  const c = content(locale !== 'en');
  const ease = [0.33, 1, 0.68, 1] as const;
  return (
    <section className="w-full px-4 pb-16 pt-16 md:px-8 md:pb-24 md:pt-28">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }}>
        {/* cím → badge (h1) → szöveg → gomb, egymás alatt */}
        <div className="flex flex-col gap-8 md:gap-10">
          <p className="min-w-0 text-5xl font-semibold leading-[0.9] tracking-[-0.05em] text-black md:text-7xl xl:text-[7.5rem]">
            {c.heading}{' '}
            <br />
            {c.heading2}
          </p>
          {/* alatta 3 oszlop: badge (h1) · szöveg · gomb — mobilon egymás alatt */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:items-start md:gap-10">
            <div className="flex items-center gap-2 md:pt-1.5">
              <div className="flex h-4 w-4 items-center justify-center rounded-full bg-black">
                <PlusIcon className="h-2.5 w-2.5 text-white" />
              </div>
              <h1 className="text-sm font-medium text-gray-700">{c.badge}</h1>
            </div>
            {/* a főoldali hero leírásának stílusa: behúzás, első mondat félkövér, a többi vékonyabb és halványabb */}
            <p className="indent-12 text-base font-normal leading-relaxed text-black md:text-xl xl:indent-20 xl:text-2xl">
              <span className="font-semibold">{c.text.split('. ')[0]}.</span>{' '}
              <span className="font-light text-black/60">{c.text.split('. ').slice(1).join('. ')}</span>
            </p>
            <div className="md:justify-self-end">
              <PillLink href={c.href} cta="services-intro:start">{c.cta}</PillLink>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 5 szolgáltatás egy sorban (referencia szerint): felső vonal, oszlopok függőleges elválasztóval,
          sorszám · név · induló ár; mindegyik a saját szolgáltatás-oldalára linkel (belső link — SEO) */}
      <motion.ul
        className="mt-16 grid grid-cols-1 border-t border-black/15 sm:grid-cols-2 md:mt-24 lg:grid-cols-5"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, delay: 0.1, ease }}
      >
        {c.items.map((it, i) => (
          <li key={it.title} className={`border-black/10 ${i > 0 ? 'border-t sm:border-t-0 lg:border-l' : ''} ${i % 2 === 1 ? 'sm:border-l' : ''}`}>
            <Link
              href={`/${locale === 'en' ? 'en/services' : 'hu/szolgaltatasok'}/${it.slug}` as never}
              className="group block px-0 py-6 sm:px-6 lg:py-8"
            >
              <span className="font-mono text-sm text-black/50">{String(i + 1).padStart(2, '0')}</span>
              <span className="mt-2 block text-xl font-semibold tracking-tight text-black transition-opacity group-hover:opacity-60 md:text-2xl">{it.title}</span>
              <span className="mt-2 block font-mono text-sm text-black/50">{it.price}</span>
            </Link>
          </li>
        ))}
      </motion.ul>
    </section>
  );
}
