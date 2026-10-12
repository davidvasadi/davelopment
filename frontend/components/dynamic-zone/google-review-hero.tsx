'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { strapiImage } from '@/lib/strapi/strapiImage';
import { Container } from '@/components/container';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.6, ease: 'easeOut' as const, delay },
});

export const GoogleReviewHero = ({
  image,
  eyebrow,
  heading,
  description,
  tags,
}: {
  image?: any;
  eyebrow?: string | null;
  heading?: string | null;
  description?: string | null;
  tags?: { label?: string | null }[] | null;
  locale: string;
}) => {
  const imgUrl = image?.url ? strapiImage(image.url) : null;
  const imgAlt = (typeof image === 'object' && image?.alternativeText) || heading || '';

  return (
    <Container>
      <div className="py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center">

          {/* Bal oldal — kép */}
          <motion.div {...fadeUp(0)} className="relative rounded-2xl overflow-hidden min-h-[320px] md:min-h-[460px] bg-gray-100">
            {imgUrl && (
              <Image
                src={imgUrl}
                alt={imgAlt}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            )}
          </motion.div>

          {/* Jobb oldal — szöveg + tagek */}
          <motion.div {...fadeUp(0.1)}>
            {eyebrow && (
              <p className="flex items-center gap-2 text-xs font-medium tracking-wide text-black/50 uppercase mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-black" />
                {eyebrow}
              </p>
            )}
            {heading && (
              <h2 className="text-3xl md:text-5xl font-semibold text-black tracking-tight leading-[1.05] mb-5">
                {heading}
              </h2>
            )}
            {description && (
              <p className="text-base text-gray-500 leading-relaxed mb-6 max-w-lg">
                {description}
              </p>
            )}

            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, i) => (
                  tag?.label && (
                    <span
                      key={i}
                      className="text-xs font-medium text-black/70 bg-gray-100 rounded-full px-3 py-1.5"
                    >
                      {tag.label}
                    </span>
                  )
                ))}
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </Container>
  );
};
