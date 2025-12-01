'use client';

import React from 'react';
import type { LinkProps } from 'next/link';
import { motion, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

export type StrapiButtonConfig = {
  id?: number;
  text?: string | null;
  URL?: string | null;
  target?: '_self' | '_blank' | string | null;
  variant?: string | null;
};

interface ButtonProps {
  variant?: 'simple' | 'outline' | 'primary' | 'muted';
  as?: React.ElementType;
  className?: string;
  children?: React.ReactNode; // ide jön: string / JSX / Strapi button / tömb

  href?: LinkProps['href'];
  target?: string;
  onClick?: (e: React.MouseEvent<any>) => void;

  /** Ha nincs URL Strapi-ból, erre esik vissza mailto-ként */
  emailFallback?: string;

  [key: string]: any;
}

/* --- Animációs variánsok a szöveghez + pöttyhöz --- */
const wheelVariants: Variants = {
  rest: { y: '-50%' },
  hover: {
    y: '0%',
    transition: { duration: 0.3, ease: 'easeInOut' },
  },
};

const dotVariants: Variants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.1,
    transition: { duration: 0.3, ease: 'easeInOut' },
  },
};

// 1) próbáljuk megtalálni a Strapi button objectet a children-ben (single vagy tömb)
function extractStrapiConfigFromChildren(
  node: React.ReactNode,
): StrapiButtonConfig | undefined {
  if (!node) return undefined;

  // Tömb: első értelmes objectet keressük
  if (Array.isArray(node)) {
    for (const item of node) {
      const cfg = extractStrapiConfigFromChildren(item);
      if (cfg) return cfg;
    }
    return undefined;
  }

  // Ha eleve React elem (pl. <span>), ez nem Strapi config
  if (React.isValidElement(node)) return undefined;

  // Sima object → lehet Strapi button
  if (typeof node === 'object') {
    const cand = node as any;
    if (
      cand &&
      (typeof cand.text === 'string' ||
        typeof cand.URL === 'string' ||
        typeof cand.target === 'string' ||
        typeof cand.variant === 'string')
    ) {
      return cand as StrapiButtonConfig;
    }
  }

  return undefined;
}

// 2) Label eldöntése: mit írjunk a gombra
function computeLabel(
  children: React.ReactNode,
  cfg?: StrapiButtonConfig,
): { node: React.ReactNode; isPlainText: boolean } {
  // 1) ha string/number → ezt használjuk
  if (typeof children === 'string' || typeof children === 'number') {
    return { node: String(children), isPlainText: true };
  }

  // 2) ha már eleve React elem (ikon, span, stb.) → ezt rakjuk ki, nem animáljuk duplán
  if (React.isValidElement(children)) {
    return { node: children, isPlainText: false };
  }

  // 3) ha nincs normál gyerek, de Strapi configban van text → azt használjuk
  if ((!children || typeof children === 'object') && cfg?.text) {
    return { node: cfg.text, isPlainText: true };
  }

  // 4) fallback
  return { node: 'Get Started', isPlainText: true };
}

export const Button: React.FC<ButtonProps> = ({
  variant,
  as: Tag = 'button',
  className,
  children,
  href,
  target,
  onClick,
  emailFallback = 'hello@davelopment.com',
  ...rest
}) => {
  // --- 1) Strapi config kigyűjtése children-ből ---
  const cfgFromChildren = extractStrapiConfigFromChildren(children);

  // --- 2) Variant / href / target összerakása ---
  let finalVariant: ButtonProps['variant'] = variant;
  let finalHref = href;
  let finalTarget: string | undefined = target;

  // Variant Strapi alapján, ha nincs külön megadva
  if (!finalVariant && cfgFromChildren?.variant) {
    const v = cfgFromChildren.variant;
    if (['simple', 'outline', 'primary', 'muted'].includes(v)) {
      finalVariant = v as any;
    } else {
      finalVariant = 'primary';
    }
  }

  // href / mailto / fallback email Strapi URL alapján
  if (!finalHref && cfgFromChildren) {
    const raw = (cfgFromChildren.URL || '').trim();
    if (raw) {
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw)) {
        finalHref = `mailto:${raw}`;
      } else {
        finalHref = raw;
      }
    } else if (emailFallback) {
      finalHref = emailFallback.startsWith('mailto:')
        ? emailFallback
        : `mailto:${emailFallback}`;
    }
  }

  // target Strapi alapján
  if (!finalTarget && cfgFromChildren?.target) {
    const t = cfgFromChildren.target;
    if (t === '_blank' || t === '_self') {
      finalTarget = t;
    }
  }

  // Default: ha még mindig nincs, legyen primary
  if (!finalVariant) {
    finalVariant = 'primary';
  }

  const baseClass =
    'relative z-10 inline-flex items-center justify-center text-sm md:text-sm font-medium rounded-md px-4 py-2 transition duration-200';

  const variantClass =
    finalVariant === 'simple'
      ? 'bg-transparent border border-transparent text-white hover:border-secondary/50 hover:bg-secondary/10'
      : finalVariant === 'outline'
      ? 'bg-white text-black border border-black hover:bg-secondary/90 hover:text-black hover:shadow-xl'
      : finalVariant === 'muted'
      ? 'bg-neutral-800 text-white border border-transparent shadow-[0px_1px_0px_0px_#FFFFFF20_inset] hover:bg-neutral-900'
      : ''; // primary-t külön ágban kezeljük

  const { node: labelNode, isPlainText } = computeLabel(
    children,
    cfgFromChildren,
  );

  // Link-e? Ha van href és nem adtál as-t, akkor ne <button> legyen, hanem <a>
  const isLink = typeof finalHref === 'string' && finalHref.length > 0;
  const isDefaultButtonTag = Tag === 'button' || Tag === undefined;
  const TagToUse: React.ElementType =
    isDefaultButtonTag && isLink ? 'a' : Tag;

  // Anchor scroll (#id) kezelése központilag
  const handleClick = (e: React.MouseEvent<any>) => {
    if (typeof finalHref === 'string' && finalHref.startsWith('#')) {
      e.preventDefault();
      const id = finalHref.replace(/^#/, '');
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.hash = `#${id}`;
      }
    }

    if (onClick) {
      onClick(e);
    }
  };

  /* --- PRIMARY = az új animált fekete pill gomb --- */
  if (finalVariant === 'primary') {
    const MotionElement = motion(TagToUse as any);

    return (
      <MotionElement
        className={cn(
          baseClass,
          'rounded-full bg-black text-white px-3 py-2 gap-4 text-xs font-semibold',
          className,
        )}
        initial="rest"
        animate="rest"
        whileHover="hover"
        whileTap={{ scale: 0.98 }}
        href={finalHref}
        target={finalTarget}
        onClick={handleClick}
        {...rest}
      >
        {isPlainText ? (
          <>
            <div className="overflow-hidden h-3">
              <motion.div
                className="flex flex-col leading-none"
                variants={wheelVariants}
              >
                <span>{labelNode}</span>
                <span>{labelNode}</span>
              </motion.div>
            </div>
            <motion.div
              className="w-2 h-2 bg-white rounded-full"
              variants={dotVariants}
            />
          </>
        ) : (
          <>
            {labelNode}
            <motion.div
              className="w-2 h-2 bg-white rounded-full"
              variants={dotVariants}
            />
          </>
        )}
      </MotionElement>
    );
  }

  /* --- A többi variáns: sima gomb, de már Strapi config alapján --- */
  const Element = TagToUse as any;

  return (
    <Element
      className={cn(baseClass, variantClass, className)}
      href={finalHref}
      target={finalTarget}
      onClick={handleClick}
      {...rest}
    >
      {labelNode}
    </Element>
  );
};

export default Button;
