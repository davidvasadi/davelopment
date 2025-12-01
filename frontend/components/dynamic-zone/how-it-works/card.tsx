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
      className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm transition-shadow duration-150 hover:shadow-md"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {/* fej + sorszám */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2" aria-hidden>
          {[1, 2, 3, 4].map((d) => (
            <div
              key={d}
              className={`h-3 w-3 rounded-full ${d <= progress ? 'bg-black' : 'bg-gray-300'}`}
            />
          ))}
        </div>
        <div className="text-xs font-semibold text-black/50">
          {String(index).padStart(2, '0')}
        </div>
      </div>

      {/* tartalom */}
      <div className="mt-4 space-y-3">
        {imageSrc ? (
          <div className="h-12 w-12 overflow-hidden rounded-lg">
            <img src={imageSrc} alt="" className="h-full w-full object-cover" />
          </div>
        ) : null}

        <p className="text-sm font-medium leading-relaxed text-black/70">{title}</p>
        {description ? (
          <p className="text-sm leading-relaxed text-gray-500">{description}</p>
        ) : null}
      </div>
    </motion.div>
  );
};
