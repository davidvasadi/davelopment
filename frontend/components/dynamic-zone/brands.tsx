'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { PlusIcon } from 'lucide-react';
import { useRef } from 'react';

import { Heading } from '../elements/heading';
import { Subheading } from '../elements/subheading';
import { StrapiImage } from '@/components/ui/strapi-image';

export const Brands = ({
  heading,
  sub_heading,
  logos,
  badge_label,
}: {
  heading: string;
  sub_heading: string;
  logos: any[];
  badge_label: string;
}) => {
  // --- finom parallax a szekción (nem a logókon) ---
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.98, 1]);

  return (
    <motion.section ref={sectionRef} style={{ y, scale }} className="relative z-20 max-w-7xl mx-auto">
      <section>
        <div className="max-w-8xl mx-auto px-4 py-10 md:py-40 text-left">
          {/* badge + heading egymás mellett */}
          <div className="mb-6">
          {badge_label && (
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-4 h-4 bg-black rounded-full flex items-center justify-center">
                <PlusIcon className="w-2.5 h-2.5 text-white" />
              </div>
              <p className="text-xs text-black">{badge_label}</p>
            </div>
          )}
          {heading && <Heading className="">{heading}</Heading>}
          {sub_heading && (
            <Subheading className="max-w-3xl text-black">
              {sub_heading}
            </Subheading>
          )}
          </div>
          {/* Vízszintes sáv: minden logó egy sorban, horizontális görgetéssel */}
          <div className="mt-10 md:mt-20 overflow-x-auto whitespace-nowrap">
            <div className="inline-flex items-center gap-2 sm:gap-3 md:gap-4 pr-4">
              {logos.map((logo, idx) => (
                <div
                  key={logo.title || logo.id || `logo-${idx}`}
                  className="flex items-center justify-center bg-white py-6 md:py-8 px-6 md:px-8 rounded-xl transition-all duration-300 hover:shadow-lg grayscale hover:grayscale-0"
                >
                  <StrapiImage
                    src={logo.image?.url}
                    alt={logo.image?.alternativeText || logo.title || 'brand logo'}
                    width={400}
                    height={200}
                    className="h-8 w-32 md:h-14 md:w-44 object-contain"
                    draggable={false}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </motion.section>
  );
};
