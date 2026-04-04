import { Link } from 'next-view-transitions';
import React from 'react';

import { BlurImage } from './blur-image';
import { strapiImage } from '@/lib/strapi/strapiImage';
import { Image } from '@/types/types';

export const Logo = ({ image, locale, text }: { image?: Image; locale?: string; text?: string }) => {
  const href = `/${locale || 'hu'}`;
  if (image) {
    return (
      <Link href={href} className="font-normal flex space-x-2 items-center text-sm mr-4 text-black relative z-20">
        <BlurImage
          src={strapiImage(image?.url)}
          alt={image.alt ?? image.alternativeText ?? ''}
          width={150}
          height={150}
          className="h-7 w-13 rounded-xl mr-2"
        />
        {text && <span className="font-bold text-black text-sm">{text}</span>}
      </Link>
    );
  }

  return (
    <Link href={href} className="font-normal flex items-center text-sm mr-4 text-black relative z-20">
      <span className="font-bold text-black text-base">{text || '[davelopment]®'}</span>
    </Link>
  );
};
