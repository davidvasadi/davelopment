import { Link } from 'next-view-transitions';
import React from 'react';

import { BlurImage } from './blur-image';
import { strapiImage } from '@/lib/strapi/strapiImage';
import { Image } from '@/types/types';

export const Logo = ({ image, locale, text }: { image?: Image; locale?: string; text?: string }) => {
  const href = `/${locale || 'hu'}`;
  // Ha van feltöltött logó kép → CSAK a képet mutatjuk (szöveg nélkül).
  // Ha nincs kép → a szöveges wordmark (lásd lentebb) a fallback.
  if (image?.url) {
    return (
      <Link href={href} className="font-normal flex items-center text-sm mr-4 text-black relative z-20">
        <BlurImage
          src={strapiImage(image.url)}
          alt={image.alt ?? image.alternativeText ?? text ?? '[davelopment]®'}
          width={150}
          height={150}
          className="h-4 w-auto"
        />
      </Link>
    );
  }

  return (
    <Link href={href} className="font-normal flex items-center text-sm mr-4 text-black relative z-20">
      <span className="font-bold text-black text-base">{text || '[davelopment]®'}</span>
    </Link>
  );
};
