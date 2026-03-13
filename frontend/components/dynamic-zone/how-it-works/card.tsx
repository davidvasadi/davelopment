'use client';

import { motion } from 'framer-motion';
import React from 'react';

export const Card = ({
  title,
  description,
  index,
  imageSrc,
}: {
  title: string;
  description?: string;
  index: number;
  imageSrc?: string;
}) => {
  const progress = Math.min(index, 4);

  return (
    <motion.div
      // h-full + min-h → egységes magasság a grid sorban
      className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm transition-shadow duration-150 hover:shadow-md h-full min-h-[280px] md:min-h-[320px] flex flex-col"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {/* Fejléc: pöttyök + sorszám */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2" aria-hidden>
          {[1, 2, 3, 4].map((d) => (
            <div
              key={d}
              className={`h-3 w-3 rounded-full ${d <= progress ? 'bg-black' : 'bg-gray-300'}`}
            />
          ))}
        </div>
        <div className="text-xs font-semibold text-black/40">
          {String(index).padStart(2, '0')}
        </div>
      </div>

      {/* Tartalom — kép és cím egy sorban, leírás legalul */}
      <div className="mt-6 flex flex-col flex-1">

        {/* Kép + cím egymás mellett */}
        <div className="flex items-center gap-3">
          {imageSrc && (
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl">
              <img src={imageSrc} alt="" className="h-full w-full object-cover" />
            </div>
          )}
          <p className="text-lg font-medium leading-snug text-black">{title}</p>
        </div>

        {/* Spacer — leírást lenyomja a kártya aljára */}
        <div className="flex-1" />

        {/* Leírás — mindig legalul */}
        {description && (
          <p className="mt-4 text-sm leading-relaxed text-gray-500">{description}</p>
        )}

      </div>
    </motion.div>
  );
};
