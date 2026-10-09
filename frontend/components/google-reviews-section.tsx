'use client';

// frontend/components/google-reviews-section.tsx
// Teljesen önálló, kód-vezérelt szekció — NINCS hozzá CMS-mező, nem a
// dynamic-zone rendszer része. Kizárólag a napi cron script (lásd
// scripts/google-reviews/fetch_rating.py) által cache-elt, valódi Google
// Cégem-adatból építkezik: pontszám, max. 5 tartalmas (1 mondatnál
// hosszabb) vélemény, és egy "Összes vélemény a Google-ön" gomb.
//
// A UI szándékosan az eredeti CMS Testimonials komponens (lásd
// components/dynamic-zone/testimonials/index.tsx) magazin-rács dizájnját
// másolja — ugyanaz a kinézet, csak a CMS helyett élő Google-adattal.
// Azért külön komponens (nem ugyanaz a fájl), mert a Testimonials a
// Strapi/Payload médiafájlokra épülő `strapiImage()` helperrel dolgozik,
// a mi review-fotóink viszont saját, relatív útvonalon (a cron script
// tölti le) érhetők el — a kettőt keverni okozta a korábbi zavart.
//
// Ha nincs még cache-elt adat (a cron még nem futott le), a komponens
// egyszerűen nem renderel semmit.

import React from 'react';
import Image from 'next/image';
import { PlusIcon, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { MotionLink } from '@/components/motion-link';
import type { GoogleRating, GoogleReview } from '@/lib/shared/google-rating';

const COPY = {
  hu: {
    badge: 'Google-értékelések',
    heading: 'Tapasztalatok',
    sub_heading: 'Valódi vélemények a Google Cégem-profilunkról',
    trustLabel: (n: number) => `${n} Google-értékelés`,
    descriptionBold: (n: number) => `${n} Google-értékelés`,
    description: (n: number) =>
      `__BOLD__ valós ügyfeleinktől. Ha nálunk jártál, szívesen vesszük, ha te is megosztod a tapasztalatodat!`,
    cta: 'Összes vélemény megtekintése',
  },
  en: {
    badge: 'Google reviews',
    heading: 'Testimonials',
    sub_heading: 'Real reviews from our Google Business profile',
    trustLabel: (n: number) => `${n} Google reviews`,
    descriptionBold: (n: number) => `${n} Google reviews`,
    description: (n: number) =>
      `__BOLD__ from real clients. If you've worked with us, we'd love to hear your take too!`,
    cta: 'See all reviews',
  },
} as const;

// ─── Csillag sor ───────────────────────────────────────────────
const StarRow = ({ count = 5 }: { count?: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: Math.round(count) }).map((_, i) => (
      <Star key={i} className="w-3.5 h-3.5" fill="#f59e0b" stroke="#f59e0b" />
    ))}
  </div>
);

// ─── Header kártya (reviewer neve + fotója) ────────────────────
const HeaderCard = ({ review }: { review: GoogleReview }) => (
  <div className="bg-white px-4 py-3 flex items-center gap-3 w-full h-full">
    <div className="w-14 h-14 flex-shrink-0">
      {review.photoUrl ? (
        <Image
          src={review.photoUrl}
          alt={review.authorName}
          width={56}
          height={56}
          className="rounded-xl object-cover object-top w-full h-full"
        />
      ) : (
        <div className="rounded-xl bg-gray-100 w-full h-full flex items-center justify-center text-gray-400 font-medium">
          {review.authorName.charAt(0)}
        </div>
      )}
    </div>
    <div className="min-w-0">
      <p className="font-medium text-gray-900 text-sm truncate">{review.authorName}</p>
    </div>
  </div>
);

// ─── Idézet kártya ─────────────────────────────────────────────
const QuoteCard = ({
  text,
  rating,
  isHovered,
  reversed,
}: {
  text: string;
  rating?: number | null;
  isHovered?: boolean;
  reversed?: boolean;
}) => (
  <div className="bg-white p-6 flex flex-col justify-between w-full h-full">
    {reversed ? (
      <>
        <p className="text-base md:text-lg font-medium text-gray-900 leading-snug indent-8">{text}</p>
        <div className="flex items-end justify-between">
          {rating != null && <StarRow count={rating} />}
          <PlusIcon
            className={`w-4 h-4 text-gray-300 flex-shrink-0 transition-transform duration-300 ${isHovered ? 'rotate-90' : 'rotate-0'}`}
          />
        </div>
      </>
    ) : (
      <>
        <div className="flex items-start justify-between">
          {rating != null && <StarRow count={rating} />}
          <PlusIcon
            className={`w-4 h-4 text-gray-300 flex-shrink-0 mt-0.5 transition-transform duration-300 ${isHovered ? 'rotate-90' : 'rotate-0'}`}
          />
        </div>
        <p className="text-base md:text-lg font-medium text-gray-900 leading-snug mt-6 indent-8">{text}</p>
      </>
    )}
  </div>
);

// Statikus osztály-lista az egymásra csúszó avatarokhoz (max 4 elem) —
// szándékosan NEM számított/inline érték, hogy Tailwind build-time
// megtalálja és legenerálja ezeket az osztályokat.
const AVATAR_STACK_CLASSES = ['relative z-40 ml-0', 'relative z-30 -ml-3', 'relative z-20 -ml-3', 'relative z-10 -ml-3'];

// ─── Stat kártya ───────────────────────────────────────────────
const StatCard = ({
  rating,
  ratingMax,
  description,
  descriptionBold,
  trustLabel,
  ctaText,
  ctaUrl,
  brand,
  avatars,
}: {
  rating: number;
  ratingMax: number;
  description: string;
  descriptionBold: string;
  trustLabel: string;
  ctaText: string;
  ctaUrl: string;
  brand?: string;
  avatars: { url: string; name?: string }[];
}) => {
  const renderDesc = (text: string, bold: string) => {
    if (!text.includes(bold)) return <span>{text}</span>;
    const [before, after] = text.split(bold);
    return (
      <>
        {before}
        <strong className="font-medium text-gray-900">{bold}</strong>
        {after}
      </>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col justify-between h-full w-full">
      <div>
        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-5xl font-medium text-gray-900 leading-none tracking-tight">
            {rating.toFixed(1)}
          </span>
          <span className="text-lg text-gray-400 font-medium">/{ratingMax}</span>
        </div>
        <p className="text-sm text-gray-400 leading-relaxed">{renderDesc(description, descriptionBold)}</p>
      </div>
      <div className="mt-4">
        {brand && <p className="text-sm font-medium text-gray-900 mb-2">{brand}</p>}
        <div className="flex items-center gap-3 mb-4">
          {avatars.length > 0 && (
            <div className="flex items-center">
              {avatars.slice(0, 4).map((a, i) => (
                <div
                  key={i}
                  className={`w-9 h-9 overflow-hidden flex-shrink-0 rounded-sm ${AVATAR_STACK_CLASSES[i]}`}
                >
                  <Image src={a.url} alt={a.name || ''} width={36} height={36} className="object-cover object-top w-full h-full" />
                </div>
              ))}
            </div>
          )}
          <div>
            <StarRow count={5} />
            {trustLabel && <p className="text-xs text-gray-400 mt-0.5">{trustLabel}</p>}
          </div>
        </div>
        {ctaText && (
          <MotionLink
            href={ctaUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="block w-full bg-gray-900 text-white text-sm font-medium text-center py-4 px-6 rounded-full overflow-hidden"
            initial="rest"
            whileHover="hover"
            animate="rest"
          >
            <div className="overflow-hidden h-5">
              <motion.div
                className="flex flex-col"
                variants={{
                  rest: { y: '-50%' },
                  hover: { y: '0%', transition: { duration: 0.3, ease: 'easeInOut' } },
                }}
              >
                <span>{ctaText}</span>
                <span>{ctaText}</span>
              </motion.div>
            </div>
          </MotionLink>
        )}
      </div>
    </div>
  );
};

// ─── Testimonial oszlop ────────────────────────────────────────
const ReviewColumn = ({ review, reversed = false }: { review: GoogleReview; reversed?: boolean }) => {
  const [hovered, setHovered] = React.useState(false);

  const headerEl = <HeaderCard review={review} />;
  const quoteEl = <QuoteCard text={review.text} rating={review.rating} isHovered={hovered} reversed={reversed} />;

  const topCellClasses = `min-h-0 overflow-hidden bg-white border border-gray-100 rounded-2xl transition-all duration-300 ${hovered ? 'rounded-b-none border-b-transparent' : ''}`;
  const bottomCellClasses = `min-h-0 overflow-hidden bg-white border border-gray-100 rounded-2xl transition-all duration-300 ${hovered ? 'rounded-t-none border-t-transparent' : ''}`;

  return (
    <div
      className={`h-full flex flex-col transition-[gap] duration-300 ${hovered ? 'gap-0' : 'gap-1'}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {reversed ? (
        <>
          <div className={`flex-[4] ${topCellClasses}`}>{quoteEl}</div>
          <div className={`flex-[1] ${bottomCellClasses}`}>{headerEl}</div>
        </>
      ) : (
        <>
          <div className={`flex-[1] ${topCellClasses}`}>{headerEl}</div>
          <div className={`flex-[4] ${bottomCellClasses}`}>{quoteEl}</div>
        </>
      )}
    </div>
  );
};

export function GoogleReviewsSection({
  locale,
  rating,
  reviews,
}: {
  locale: string;
  rating: GoogleRating | null;
  reviews: GoogleReview[];
}) {
  if (!rating || reviews.length === 0) return null;

  const t = COPY[locale === 'en' ? 'en' : 'hu'];

  const avatarUrls = reviews
    .filter((r) => !!r.photoUrl)
    .map((r) => ({ url: r.photoUrl as string, name: r.authorName }));

  const statCardProps = {
    rating: rating.rating,
    ratingMax: 5,
    description: t.description(rating.userRatingCount).replace('__BOLD__', t.descriptionBold(rating.userRatingCount)),
    descriptionBold: t.descriptionBold(rating.userRatingCount),
    trustLabel: t.trustLabel(rating.userRatingCount),
    ctaText: rating.googleMapsUrl ? t.cta : '',
    ctaUrl: rating.googleMapsUrl || '#',
    brand: rating.name,
    avatars: avatarUrls,
  };

  const rows: GoogleReview[][] = [];
  for (let i = 0; i < reviews.length; i += 3) {
    rows.push(reviews.slice(i, i + 3));
  }

  return (
    <div className="py-20 md:py-32">
      {/* ── HEADING ── */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="max-w-7xl mx-auto px-4 mb-16">
          <div className="hidden lg:grid lg:grid-cols-[30%_70%] lg:gap-4 lg:items-start">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                <PlusIcon className="w-3 h-3 text-white" />
              </div>
              <p className="text-xs text-gray-500 font-medium">{t.badge}</p>
            </div>
            <div>
              <h2 className="text-[clamp(3rem,8vw,7rem)] font-medium text-gray-900 leading-none tracking-tight">
                {t.heading}
              </h2>
              <p className="text-gray-400 text-base mt-2 font-medium">{t.sub_heading}</p>
            </div>
          </div>

          <div className="lg:hidden">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                <PlusIcon className="w-3 h-3 text-white" />
              </div>
              <p className="text-xs text-gray-500 font-medium">{t.badge}</p>
            </div>
            <h2 className="text-5xl font-medium text-gray-900 leading-none tracking-tight">{t.heading}</h2>
            <p className="text-gray-400 text-sm mt-2 font-medium">{t.sub_heading}</p>
          </div>
        </div>
      </motion.div>

      {/* ── DESKTOP GRID ── */}
      <div className="max-w-7xl mx-auto px-4 hidden lg:flex lg:flex-col lg:gap-1">
        {rows.map((row, rowIdx) => (
          <div key={rowIdx} className="flex gap-1 h-[680px]">
            {rowIdx === 0 ? (
              <motion.div
                className="w-[25%] flex-shrink-0 h-full"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true, amount: 0.2 }}
              >
                <StatCard {...statCardProps} />
              </motion.div>
            ) : (
              <div className="w-[25%] flex-shrink-0 h-full" />
            )}
            {row.map((review, colIdx) => (
              <motion.div
                key={review.publishTime ?? `${rowIdx}-${colIdx}`}
                className="flex-1 min-w-0"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + colIdx * 0.1 }}
                viewport={{ once: true, amount: 0.2 }}
              >
                <ReviewColumn review={review} reversed={colIdx === 1} />
              </motion.div>
            ))}
          </div>
        ))}
      </div>

      {/* ── MOBIL ── */}
      <div className="max-w-7xl mx-auto px-4 lg:hidden flex flex-col gap-1">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <StatCard {...statCardProps} />
        </motion.div>
        {reviews.map((review, i) => (
          <React.Fragment key={review.publishTime ?? i}>
            <motion.div
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden h-[72px]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.08 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <HeaderCard review={review} />
            </motion.div>
            <motion.div
              className="bg-white rounded-2xl border border-gray-100"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 + i * 0.08 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <QuoteCard text={review.text} rating={review.rating} />
            </motion.div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
