'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { ServiceDetail } from '@/lib/services/service-details';

/**
 * Szolgáltatás-aloldal: „Mit tartalmaz” blokk (2026-11, referencia alapján, a mi arculatunkkal).
 * Balra nagy cím + fehér kártya az átadáskor kapott dolgokkal (narancs pipák); jobbra 2 oszlopban a tételek
 * (cím + egy mondat), halvány elválasztókkal. Tartalom: lib/services/service-details.ts.
 */
export function ServiceIncluded({ detail }: { detail: ServiceDetail }) {
  const ease = [0.33, 1, 0.68, 1] as const;
  return (
    <section className="w-full px-4 py-16 md:px-8 md:py-24">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        {/* a bal oldal (cím + kártya) desktopon „megáll”, amíg a jobb oldali tételek görögnek mellette */}
        <motion.div
          className="lg:col-span-4 lg:sticky lg:top-28 lg:self-start"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease }}
        >
          <h2 className="text-5xl font-semibold leading-[0.95] tracking-[-0.05em] text-black md:text-6xl xl:text-7xl">{detail.includedTitle}</h2>
          <div className="mt-10 rounded-card border border-black/10 bg-white p-6 md:p-8">
            <p className="border-b border-black/80 pb-4 text-lg font-semibold text-black">{detail.handoverTitle}</p>
            <ul className="mt-5 space-y-4">
              {detail.handover.map((h) => (
                <li key={h} className="flex items-center gap-3 text-base text-black md:text-lg">
                  <span aria-hidden className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F05A28]">
                    <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
                  </span>
                  {h}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        <ul className="grid grid-cols-1 gap-x-12 border-t border-black/15 md:grid-cols-2 lg:col-span-8">
          {detail.included.map((it, i) => (
            <motion.li
              key={it.title}
              className="border-b border-black/10 py-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: 0.04 * (i % 2), ease }}
            >
              <h3 className="text-xl font-semibold tracking-tight text-black md:text-2xl">{it.title}</h3>
              <p className="mt-3 max-w-md text-base leading-relaxed text-black/70">{it.text}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
