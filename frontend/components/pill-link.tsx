'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MotionLink } from '@/components/motion-link';

/**
 * Fekete pill gomb a hero személyes kártyájának gombja szerint („Vágjunk bele”): gördülő felirat + fehér pötty.
 * Szerver-oldali oldalakból is használható.
 */
const dot = {
  rest: { scale: 1 },
  hover: { scale: 1.4, transition: { duration: 0.3, ease: 'easeInOut' as const } },
};
const wheel = {
  rest: { y: '-50%' },
  hover: { y: '0%', transition: { duration: 0.3, ease: 'easeInOut' as const } },
};

export function PillLink({ href, children, className = '', cta, light = false, accent = false }: { href: string; children: string; className?: string; cta?: string; light?: boolean; accent?: boolean }) {
  return (
    <MotionLink
      href={href as never}
      initial="rest"
      whileHover="hover"
      animate="rest"
      data-cta={cta ?? children}
      className={`inline-flex items-center gap-3 overflow-hidden whitespace-nowrap rounded-full px-5 py-3 text-sm font-semibold ${accent ? 'bg-[#F05A28] text-white' : light ? 'bg-white text-black' : 'bg-black text-white'} ${className}`}
    >
      <div className="h-5 overflow-hidden">
        <motion.div className="flex flex-col leading-5" variants={wheel}>
          <span className="block">{children}</span>
          <span className="block kb-label" aria-hidden="true" data-k={children} />
        </motion.div>
      </div>
      <motion.span className={`h-1.5 w-1.5 shrink-0 rounded-full ${light && !accent ? 'bg-black' : 'bg-white'}`} variants={dot} />
    </MotionLink>
  );
}
