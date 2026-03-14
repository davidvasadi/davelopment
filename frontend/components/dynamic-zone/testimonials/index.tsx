'use client';

import React from 'react';
import Image from 'next/image';
import { PlusIcon, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { strapiImage } from '@/lib/strapi/strapiImage';

// ─── Típusok ───────────────────────────────────────────────────
type TestimonialUser = {
  firstname?: string | null;
  lastname?: string | null;
  job?: string | null;
  image?: { url?: string | null } | null;
};

type Testimonial = {
  id?: number;
  text?: string | null;
  rating?: number | null;
  user?: TestimonialUser | null;
};

type TestimonialsProps = {
  heading?: string | null;
  sub_heading?: string | null;
  badge_label?: string | null;
  stat_rating?: number | null;
  stat_rating_max?: number | null;
  stat_description?: string | null;
  stat_description_bold?: string | null;
  stat_trust_label?: string | null;
  stat_cta_text?: string | null;
  stat_cta_url?: string | null;
  stat_brand?: string | null;
  testimonials?: Testimonial[];
};

// ─── Segédfüggvény ─────────────────────────────────────────────
const toAbs = (url?: string | null) =>
  url ? strapiImage(url) : undefined;

// ─── Csillag sor ───────────────────────────────────────────────
const StarRow = ({ count = 5 }: { count?: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: count }).map((_, i) => (
      <Star
        key={i}
        className="w-3.5 h-3.5"
        fill="#f59e0b"
        stroke="#f59e0b"
      />
    ))}
  </div>
);

// ─── Header kártya ─────────────────────────────────────────────
// Kis kompakt kártya: profilkép + név + foglalkozás
// border és rounded a szülő wrapper divről jön (hover animáció miatt)
const HeaderCard = ({ user }: { user: TestimonialUser }) => {
  const imgUrl = toAbs(user?.image?.url);
  const name = [user?.firstname, user?.lastname].filter(Boolean).join(' ');
  return (
    <div className="bg-white px-4 py-3 flex items-center gap-3 w-full h-full">
      <div className="w-14 h-14 flex-shrink-0">
        {imgUrl ? (
          <Image
            src={imgUrl}
            alt={name}
            width={56}
            height={56}
            className="rounded-xl object-cover object-top w-full h-full"
          />
        ) : (
          <div className="rounded-xl bg-gray-100 w-full h-full" />
        )}
      </div>
      <div className="min-w-0">
        {name && <p className="font-medium text-gray-900 text-sm truncate">{name}</p>}
        {user?.job && (
          <p className="text-xs text-gray-400 truncate">{user.job}</p>
        )}
      </div>
    </div>
  );
};

// ─── Idézet kártya ─────────────────────────────────────────────
// Nagy kártya: csillagok + plus ikon felül, idézet szöveg alul
// isHovered: a szülő oszloptól jön — ez forgatja el a plus ikont 90 fokra
const QuoteCard = ({
  text,
  rating,
  isHovered,
}: {
  text: string;
  rating?: number | null;
  isHovered?: boolean;
}) => (
  <div className="bg-white p-6 flex flex-col justify-between w-full h-full">
    <div className="flex items-start justify-between">
    {rating != null && <StarRow count={Number(rating)} />}
      <PlusIcon
        className="w-4 h-4 text-gray-300 flex-shrink-0 mt-0.5 transition-transform duration-300"
        style={{ transform: isHovered ? 'rotate(90deg)' : 'rotate(0deg)' }}
      />
    </div>
    <p
      className="text-xl md:text-2xl font-medium text-gray-900 leading-snug mt-6"
      style={{ textIndent: '2rem' }}
    >
      {text}
    </p>
  </div>
);

// ─── Stat kártya ───────────────────────────────────────────────
// Bal oldali nagy kártya: értékelés szám, leírás, avatárok, CTA gomb
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
  rating?: number | null;
  ratingMax?: number | null;
  description?: string | null;
  descriptionBold?: string | null;
  trustLabel?: string | null;
  ctaText?: string | null;
  ctaUrl?: string | null;
  brand?: string | null;
  avatars: string[];
}) => {
  // Ha van félkövér rész a leírásban, azt <strong>-ba csomagolja
  const renderDesc = (text: string, bold?: string | null) => {
    if (!bold || !text.includes(bold)) return <span>{text}</span>;
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
      {/* Felső rész: nagy szám + leíró szöveg */}
      <div>
        {rating != null && (
          <div className="flex items-baseline gap-1 mb-3">
            <span className="text-6xl font-medium text-gray-900 leading-none tracking-tight">
              {rating}
            </span>
            {ratingMax != null && (
              <span className="text-xl text-gray-400 font-medium">
                /{ratingMax}
              </span>
            )}
          </div>
        )}
        {description && (
          <p className="text-sm text-gray-400 leading-relaxed">
            {renderDesc(description, descriptionBold)}
          </p>
        )}
      </div>

      {/* Alsó rész: márkanév, avatárok, csillagok, gomb */}
      <div className="mt-6">
        {brand && (
          <p className="text-sm font-medium text-gray-900 mb-3">{brand}</p>
        )}

        {/* Stacked avatars + csillagok + trust label */}
        <div className="flex items-center gap-4 mb-5">
          {avatars.length > 0 && (
            <div className="flex items-center">
              {/* Az első avatar van legelöl (zIndex: 10), a többi mögé csúszik
                  marginLeft: -12px adja az átfedést */}
              {avatars.slice(0, 4).map((url, i) => (
                <div
                  key={i}
                  className="w-10 h-10 overflow-hidden flex-shrink-0 border-2 border-white"
                  style={{
                    marginLeft: i === 0 ? 0 : '-12px',
                    zIndex: 10 - i,
                    borderRadius: '10px',
                    position: 'relative',
                  }}
                >
                  <Image
                    src={url}
                    alt=""
                    width={40}
                    height={40}
                    className="object-cover object-top w-full h-full"
                  />
                </div>
              ))}
              {/* +N badge ha több mint 4 avatar van */}
              {avatars.length > 4 && (
                <div
                  className="w-10 h-10 flex items-center justify-center flex-shrink-0 text-white text-xs font-medium border-2 border-white bg-gray-900"
                  style={{ marginLeft: '-12px', zIndex: 5, borderRadius: '10px' }}
                >
                  {avatars.length - 4}+
                </div>
              )}
            </div>
          )}
          <div>
            <StarRow count={5} />
            {trustLabel && (
              <p className="text-xs text-gray-400 mt-0.5">{trustLabel}</p>
            )}
          </div>
        </div>

        {/* CTA gomb — szöveg-flip hover effekt (Services komponensből átvéve):
            két azonos szöveg egymás alatt, overflow hidden + translateY animáció */}
        {ctaText && (
          <motion.a
            href={ctaUrl || '#'}
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
                  hover: {
                    y: '0%',
                    transition: { duration: 0.3, ease: 'easeInOut' },
                  },
                }}
              >
                <span>{ctaText}</span>
                <span>{ctaText}</span>
              </motion.div>
            </div>
          </motion.a>
        )}
      </div>
    </div>
  );
};

// ─── Testimonial oszlop ────────────────────────────────────────
// reversed=false (col 1, col 3): header felül kis (flex:1), quote alul nagy (flex:4)
// reversed=true  (col 2):        quote felül nagy (flex:4), header alul kis (flex:1)
//
// Hover animáció:
//   - gap 4px → 0px (kártyák összecsúsznak)
//   - borderRadius: érintkező oldal 0-ra vált (vizuálisan egybeolvadnak)
//   - borderColor: érintkező border transparent (eltűnik a rés)
//   - isHovered → QuoteCard plus ikon 90 fokot forog
const TestimonialColumn = ({
  testimonial,
  reversed = false,
}: {
  testimonial: Testimonial;
  reversed?: boolean;
}) => {
  const [hovered, setHovered] = React.useState(false);

  const headerEl = testimonial.user ? (
    <HeaderCard user={testimonial.user} />
  ) : (
    <div className="w-full h-full bg-white" />
  );

  const quoteEl = testimonial.text ? (
    <QuoteCard
      text={testimonial.text}
      rating={testimonial.rating != null ? Number(testimonial.rating) : undefined}
      isHovered={hovered}
    />
  ) : (
    <div className="w-full h-full bg-white" />
  );

  const topRadius    = hovered ? '16px 16px 0 0' : '16px';
  const bottomRadius = hovered ? '0 0 16px 16px' : '16px';

  return (
    <div
      className="flex-1 flex flex-col min-w-0"
      style={{
        gap: hovered ? '0px' : '4px',
        transition: 'gap 0.3s ease',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {reversed ? (
        <>
          {/* FORDÍTOTT: quote felül NAGY (flex:4), header alul KIS (flex:1) */}
          <div
            className="min-h-0 overflow-hidden bg-white"
            style={{
              flex: 4,
              borderRadius: topRadius,
              border: '1px solid #f3f4f6',
              borderBottom: hovered ? '1px solid transparent' : '1px solid #f3f4f6',
              transition: 'border-radius 0.3s ease, border-color 0.3s ease',
            }}
          >
            {quoteEl}
          </div>
          <div
            className="min-h-0 overflow-hidden bg-white"
            style={{
              flex: 1,
              borderRadius: bottomRadius,
              border: '1px solid #f3f4f6',
              borderTop: hovered ? '1px solid transparent' : '1px solid #f3f4f6',
              transition: 'border-radius 0.3s ease, border-color 0.3s ease',
            }}
          >
            {headerEl}
          </div>
        </>
      ) : (
        <>
          {/* NORMÁL: header felül KIS (flex:1), quote alul NAGY (flex:4) */}
          <div
            className="min-h-0 overflow-hidden bg-white"
            style={{
              flex: 1,
              borderRadius: topRadius,
              border: '1px solid #f3f4f6',
              borderBottom: hovered ? '1px solid transparent' : '1px solid #f3f4f6',
              transition: 'border-radius 0.3s ease, border-color 0.3s ease',
            }}
          >
            {headerEl}
          </div>
          <div
            className="min-h-0 overflow-hidden bg-white"
            style={{
              flex: 4,
              borderRadius: bottomRadius,
              border: '1px solid #f3f4f6',
              borderTop: hovered ? '1px solid transparent' : '1px solid #f3f4f6',
              transition: 'border-radius 0.3s ease, border-color 0.3s ease',
            }}
          >
            {quoteEl}
          </div>
        </>
      )}
    </div>
  );
};

// ─── Fő komponens ─────────────────────────────────────────────
export const Testimonials = ({
  heading,
  sub_heading,
  badge_label,
  stat_rating,
  stat_rating_max,
  stat_description,
  stat_description_bold,
  stat_trust_label,
  stat_cta_text,
  stat_cta_url,
  stat_brand,
  testimonials = [],
}: TestimonialsProps) => {

  // Avatar url-ek összegyűjtése a testimonialokból (max 8)
  const avatarUrls = testimonials
    .map((t) => toAbs(t.user?.image?.url))
    .filter((u): u is string => !!u)
    .slice(0, 8);

  // StatCard propjai — csak Strapiból, nincs fallback
  const statCardProps = {
    rating: stat_rating,
    ratingMax: stat_rating_max,
    description: stat_description,
    descriptionBold: stat_description_bold,
    trustLabel: stat_trust_label,
    ctaText: stat_cta_text,
    ctaUrl: stat_cta_url,
    brand: stat_brand,
    avatars: avatarUrls,
  };

  // Testimonialokat soronként 3-asával csoportosítjuk
  // pl. 6 testimonial → [[t1,t2,t3], [t4,t5,t6]]
  const rows: Testimonial[][] = [];
  for (let i = 0; i < testimonials.length; i += 3) {
    rows.push(testimonials.slice(i, i + 3));
  }

  // Ha nincs semmi adat, ne rendereljünk semmit
  if (!heading && !testimonials.length) return null;

  return (
    <div className="py-20 md:py-32">

      {/* ── HEADING ─────────────────────────────────────────────
          Desktop: 2 oszlopos grid
            - bal (30%): badge label
            - jobb (70%): nagy cím + alcím
          items-start: badge a cím tetejével egy vonalban
          mb-16: nagy sorköz a kártyák előtt
      ──────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 mb-32">

        {/* Desktop heading */}
        <div className="hidden lg:grid lg:grid-cols-[30%_70%] lg:gap-4 lg:items-start">
          <div className="flex items-center gap-2">
            {badge_label && (
              <>
                <div className="w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <PlusIcon className="w-3 h-3 text-white" />
                </div>
                <p className="text-xs text-gray-500 font-medium">{badge_label}</p>
              </>
            )}
          </div>
          <div>
            {heading && (
              <h2 className="text-[clamp(3rem,8vw,7rem)] font-medium text-gray-900 leading-none tracking-tight">
                {heading}
              </h2>
            )}
            {sub_heading && (
              <p className="text-gray-400 text-base mt-2 font-medium">
                {sub_heading}
              </p>
            )}
          </div>
        </div>

        {/* Mobil heading */}
        <div className="lg:hidden">
          {badge_label && (
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                <PlusIcon className="w-3 h-3 text-white" />
              </div>
              <p className="text-xs text-gray-500 font-medium">{badge_label}</p>
            </div>
          )}
          {heading && (
            <h2 className="text-5xl font-medium text-gray-900 leading-none tracking-tight">
              {heading}
            </h2>
          )}
          {sub_heading && (
            <p className="text-gray-400 text-sm mt-2 font-medium">
              {sub_heading}
            </p>
          )}
        </div>
      </div>

      {/* ── DESKTOP GRID ────────────────────────────────────────
          Soronként: [stat kártya 25%] [col1] [col2] [col3]
          col1, col3: normál   — header(flex:1) felül, quote(flex:4) alul
          col2:       fordított — quote(flex:4) felül, header(flex:1) alul
          Stat kártya csak az első sornál látszik, a többinél üres placeholder
          height: 520px — a sor magassága, itt variálható
      ──────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 hidden lg:flex lg:flex-col lg:gap-1">
        {rows.map((row, rowIdx) => (
          <div
            key={rowIdx}
            className="flex gap-1"
            style={{ height: '520px' }}
          >
            {rowIdx === 0 ? (
              <div className="w-[25%] flex-shrink-0 h-full">
                <StatCard {...statCardProps} />
              </div>
            ) : (
              <div className="w-[25%] flex-shrink-0 h-full" />
            )}

            {row.map((t, colIdx) => (
              <TestimonialColumn
                key={t.id ?? `${rowIdx}-${colIdx}`}
                testimonial={t}
                reversed={colIdx === 1}
              />
            ))}
          </div>
        ))}
      </div>

      {/* ── MOBIL ───────────────────────────────────────────────
          Egymás alá: StatCard + testimonialok
          header: 72px fix (kompakt), quote: 220px fix (tágas)
      ──────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 lg:hidden flex flex-col gap-1">
        <StatCard {...statCardProps} />
        {testimonials.map((t, i) => (
          <React.Fragment key={t.id ?? i}>
            {t.user && (
              <div
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
                style={{ height: '72px' }}
              >
                <HeaderCard user={t.user} />
              </div>
            )}
            {t.text && (
              <div
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
                style={{ height: '220px' }}
              >
                <QuoteCard text={t.text} rating={t.rating != null ? Number(t.rating) : undefined} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
