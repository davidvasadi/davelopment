import { Link } from 'next-view-transitions';
import React from 'react';

import { BlurImage } from './blur-image';
import { strapiImage } from '@/lib/strapi/strapiImage';
import { Image } from '@/types/types';
import { cn } from '@/lib/utils';

export const Logo = ({ image, locale, text, dark = false }: { image?: Image; locale?: string; text?: string; dark?: boolean }) => {
  const href = `/${locale || 'hu'}`;
  // Ha van feltöltött logó kép → CSAK a képet mutatjuk (szöveg nélkül).
  // Ha nincs kép → a szöveges wordmark (lásd lentebb) a fallback.
  if (image?.url) {
    return (
      <Link href={href} className={cn('font-normal flex items-center text-sm mr-4 relative z-20', dark ? 'text-white' : 'text-black')}>
        <BlurImage
          src={strapiImage(image.url)}
          alt={image.alt ?? image.alternativeText ?? text ?? '[davelopment]©'}
          width={150}
          height={150}
          className={cn('h-7 w-auto', dark && 'brightness-0 invert')}
        />
      </Link>
    );
  }

  return (
    <Link href={href} className={cn('font-normal flex items-center text-sm mr-4 relative z-20', dark ? 'text-white' : 'text-black')}>
      <span className={cn('font-bold text-base', dark ? 'text-white' : 'text-black')}>{text || '[davelopment]©'}</span>
    </Link>
  );
};
