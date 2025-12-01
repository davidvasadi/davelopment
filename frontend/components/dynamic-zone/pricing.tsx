'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { PlusIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { Heading } from '../elements/heading';
import { Subheading } from '../elements/subheading';
import { strapiImage } from '@/lib/strapi/strapiImage'; // ✅ Strapi URL normalizálás

type CTA = {
  text?: string | null;
  URL?: string | null;
  target?: string | null;
  variant?: string | null;
};

type Plan = {
  name?: string | null;
  plan_type?: 'project' | 'monthly' | string;
  featured?: boolean | null;
  price?: number | null;
  currency?: string | null;
  currency_project_label?: string | null;
  time_label?: string | null;
  time_value?: string | null;
  addon_title?: string | null;
  addon_description?: string | null;
  addon_price?: number | null;
  perks?: Array<{ text?: string | null }> | null;
  additional_perks?: Array<{ text?: string | null }> | null;
  CTA?: CTA | null;
};

type PricingProps = {
  heading?: string | null;
  badge_label?: string | null;
  question?: string | null;
  sub_heading?: string | null;

  profile_image?: { url?: string | null } | null;
  profile_label?: string | null;
  profile_job?: string | null;
  profile_description?: string | null;

  plans?: Plan[];
  background?: { url?: string | null } | null;
  background_url?: string | null;
  locale?: string;
};

// ✅ Strapi URL normalizáló (string vagy {url})
const toAbs = (m?: { url?: string | null } | string | null) => {
  const raw = typeof m === 'string' ? m : m?.url || '';
  return raw ? strapiImage(raw) : undefined;
};

export const Pricing = ({
  heading,
  badge_label,
  question,
  sub_heading,
  profile_image,
  profile_label,
  profile_job,
  profile_description,
  plans = [],
  background,
  background_url,
  locale = 'hu-HU',
}: PricingProps) => {
  // ===== Állapotok
  const [pricingType, setPricingType] = useState<string>('project');
  const [marketingAddon, setMarketingAddon] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // ===== Típusok kigyűjtése
  const planTypes = useMemo(() => {
    const s = new Set<string>();
    plans.forEach((p) => p?.plan_type && s.add(p.plan_type));
    return Array.from(s);
  }, [plans]);

  useEffect(() => {
    if (planTypes.length && !planTypes.includes(pricingType)) {
      setPricingType(planTypes[0]);
    }
  }, [planTypes, pricingType]);

  // ===== Aktív plan kiválasztása
  const poolForType = useMemo(
    () => plans.filter((p) => (p?.plan_type || '') === pricingType),
    [plans, pricingType]
  );
  const activePlan = useMemo(() => {
    if (!poolForType.length) return undefined;
    return poolForType.find((p) => !!p?.featured) || poolForType[0];
  }, [poolForType]);

  // ===== Árak
  const basePrice = Number(activePlan?.price ?? 0);
  const addon = Number(activePlan?.addon_price ?? 0);
  const total = marketingAddon ? basePrice + addon : basePrice;
  const formattedPrice = Number.isFinite(total)
    ? Math.round(total).toLocaleString(locale)
    : '—';
  const currency = activePlan?.currency || '';
  const priceSuffix = activePlan?.currency_project_label || '';

  // ===== Feature lista
  const featureList: string[] = useMemo(() => {
    const primary = (activePlan?.perks || []).map((x) => x?.text).filter(Boolean) as string[];
    const extra = (activePlan?.additional_perks || []).map((x) => x?.text).filter(Boolean) as string[];
    return [...primary, ...extra];
  }, [activePlan]);

  // ===== CTA
  const ctaText = activePlan?.CTA?.text || 'Get in touch';
  const ctaHref = activePlan?.CTA?.URL || '#';
  const ctaTarget = activePlan?.CTA?.target || '_self';

  // ===== Háttér — ✅ abszolút URL, nem lesz /en/uploads 404
  const bgUrl =
    toAbs(background_url) ||
    toAbs(background) ||
    'https://framerusercontent.com/images/vrhxHFTuxnCduP4nljUulqZcuQ.jpg';

const labelForType = (t: string) => {
  const pool = plans.filter(p => (p?.plan_type || '') === t);
  const preferred = pool.find(p => p?.featured) || pool[0];
  const dynamicName = preferred?.name?.trim();
  return dynamicName
    || ({ project: 'Per project', monthly: 'Monthly' }[t] as string)
    || (t ? t.charAt(0).toUpperCase() + t.slice(1) : '');
};
  // ===== Alsó leírás felbontása lead + folytatásra (— vagy mondathatár)
  const splitDescription = (txt?: string | null): [string, string] => {
    if (!txt) return ['', ''];
    const dashIdx = txt.indexOf('—');
    if (dashIdx !== -1) {
      const lead = txt.slice(0, dashIdx + 1).trimEnd();
      const rest = txt.slice(dashIdx + 1).trimStart();
      return [lead, rest];
    }
    const m = txt.match(/([\s\S]+?[.!?]+)(\s+)([\s\S]*)$/);
    if (m) {
      return [m[1].trimEnd(), m[3].trimStart()];
    }
    return [txt, ''];
  };
  const [descLead, descRest] = splitDescription(profile_description);

  // ===== CTA animáció – a „régi, jó” setup
  const buttonVariants: Variants = {
    rest: { y: '-50%' },
    hover: { y: '0%', transition: { duration: 0.2, ease: 'easeInOut' } },
  };

  return (
    <div className='px-0 md:px-2 '>
    <section className="w-full px-4 py-20 md:py-32 relative overflow-hidden rounded-none  md:rounded-3xl font-sans">
      {/* háttér */}
      <div className="absolute inset-0 z-0">
        <img
          src={bgUrl}
          alt="Background"
          className="w-full h-full object-cover opacity-100"
          style={{ filter: 'brightness(1.15)' }}
        />
        <div className="absolute inset-0 opacity-5" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* fejlécek */}
        <div className="mb-6">
          {badge_label && (
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                <PlusIcon className="w-2.5 h-2.5 text-black" />
              </div>
              <p className="text-xs text-white/80">{badge_label}</p>
            </div>
          )}
          {heading && <Heading className="text-white">{heading}</Heading>}
          {sub_heading && (
            <Subheading className="max-w-3xl mx-auto text-white/70">
              {sub_heading}
            </Subheading>
          )}
        </div>

        {/* típusválasztó */}
        {!!planTypes.length && (
          <div className="flex items-center justify-start md:justify-center">
            <div className="bg-white/10 rounded-full p-1 flex gap-2 mt-2">
              {planTypes.map((t) => {
                const active = pricingType === t;
                return (
                  <button
                    key={t}
                    onClick={() => setPricingType(t)}
                    className={`px-6 py-4 rounded-full text-sm font-medium transition-all ${
                      active ? 'bg-white text-black' : 'text-white hover:text-white/80'
                    }`}
                  >
                    {labelForType(t)}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* fő rács */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch mt-10">
          {/* bal kártya: addon */}
          <div className="bg-white/5 rounded-xl p-6 flex flex-col justify-between min-h-[360px]">
            <div>
              <h4 className="text-white text-lg font-medium mb-1">
                {activePlan?.addon_title || 'Add marketing add-on'}
              </h4>
              <p className="text-white/50 text-sm md:text-base">
                {activePlan?.addon_description || 'Flexible tools to strengthen your launch.'}
              </p>
            </div>
            <div className="flex items-center justify-between mt-auto pt-6">
              <p className="text-white/70 text-lg font-semibold">
                +{Number(activePlan?.addon_price || 0).toLocaleString(locale)} {currency}
              </p>
              <motion.button
                onClick={() => setMarketingAddon(!marketingAddon)}
                className={`relative w-16 h-10 rounded-full transition-colors ${
                  marketingAddon ? 'bg-white' : 'bg-white/20'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="w-8 h-8 bg-black rounded-full absolute top-1"
                  animate={{ x: marketingAddon ? 26 : 4 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </motion.button>
            </div>
          </div>

          {/* jobb kártya: ár + lista + CTA (CTA fixen alul) */}
          <div className="lg:col-span-2 bg-white/5 rounded-xl p-6 md:p-8 flex flex-col lg:flex-row lg:gap-x-10 min-h-[360px]">
            {/* ár blokk */}
            <div className="flex-1 flex flex-col justify-between">
              <div className="text-white text-4xl md:text-5xl font-bold">
                {formattedPrice}
                <span className="text-white/60 text-sm font-normal ml-2">
                  <span className="mx-1">{currency}</span>
                  {priceSuffix}
                </span>
              </div>

              <div className="flex flex-col">
                <div className="flex flex-row justify-between items-center m-5">
                  <p className="text-white/60 text-sm font-semibold mb-1">
                    {activePlan?.time_label || 'Delivery time'}
                  </p>
                  <p className="text-white text-sm font-semibold">
                    {activePlan?.time_value || '—'}
                  </p>
                </div>
                <div className="relative w-full h-[1px] bg-white/10 overflow-hidden group mt-4">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-50 to-transparent"
                    initial={{ x: '-100%' }}
                    whileInView={{ x: '100%' }}
                    transition={{ duration: 1.4, ease: 'easeInOut' }}
                  />
                </div>
              </div>
            </div>

            {/* lista + CTA */}
            <div className="flex-1 relative min-h-[360px] pb-16 mt-8 lg:mt-0">
              {/* feature lista – PLUS ICON */}
              <div
                className={`space-y-3 md:space-y-4 overflow-hidden transition-all duration-500 ${
                  !expanded ? 'max-h-[300px] mask-fade-bottom' : 'max-h-[1500px]'
                }`}
              >
                {featureList.map((text, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center">
                      <PlusIcon className="w-3 h-3 text-white" />
                    </div>
                    <p className="text-white text-md">{text}</p>
                  </div>
                ))}
              </div>

              {/* expand/collapse */}
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="text-white/80 hover:text-white transition-all flex items-center gap-2"
                >
                  {expanded ? (
                    <>
                      <ChevronUp className="w-5 h-5" />
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-5 h-5 animate-bounce" />
                    </>
                  )}
                </button>
              </div>

              {/* CTA – fixen alul, animációval (középre zárt szöveg) */}
              <div className="absolute inset-x-0 bottom-0">
                <motion.a
                  href={ctaHref}
                  target={ctaTarget || undefined}
                  rel={ctaTarget === '_blank' ? 'noopener noreferrer' : undefined}
                  initial="rest"
                  whileHover="hover"
                  animate="rest"
                  className="w-full relative text-lg inline-flex items-center justify-center bg-white text-black px-6 py-4 rounded-full font-semibold text-base overflow-hidden group transition-all"
                >
                  {/* A VÁLTÁS KULCSA: fix 1 sor magas „ablak” + azonos line-height */}
                  <div
                    className="overflow-hidden transform-gpu"
                    style={{ height: '1.5rem' }}               // 24px
                  >
                    <motion.div
                      className="flex flex-col will-change-transform"
                      style={{ lineHeight: '1.5rem' }}          // 24px
                      variants={buttonVariants}
                    >
                      <span className="block">{ctaText}</span>
                      <span className="block" aria-hidden="true">{ctaText}</span>
                    </motion.div>
                  </div>
                </motion.a>
              </div>
            </div>
          </div>
        </div>

        {/* alsó blokk – 2 oszlop: question (3/12) + description/profil (9/12, responsive indent) */}
        {(question || profile_label || profile_description) && (
          <div className="mt-20 px-4 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* bal oszlop: kis question */}
            <div className="md:col-span-3 flex justify-left md:block md:justify-center">
              {question && (
                <p className="text-white/50 text-sm md:text-sm">{question}</p>
              )}
            </div>

            {/* jobb oszlop: leírás + profil – responsive indent styled-jsx-szel */}
            <div className="md:col-span-9 text-left md:text-left md:pl-10 lg:pl-16">
              {(descLead || descRest) && (
                <p className="desc-indent text-2xl md:text-3xl font-semibold text-white">
                  <span className="text-white">
                    {descLead}
                    {!/\s$/.test(descLead) && ' '}
                  </span>
                  <span className="text-white/60">{descRest}</span>
                </p>
              )}

              {(profile_image?.url || profile_label) && (
                <div className="flex items-center justify-start md:justify-start gap-3 mt-6">
                  {toAbs(profile_image) && (
                    <img
                      src={toAbs(profile_image)}
                      alt={profile_label || 'Profile'}
                      className="w-10 h-10 rounded-full object-cover object-top"
                    />
                  )}
                  <div className="flex flex-col">
                    {profile_label && (
                      <span className="text-white/70 text-sm">{profile_label}</span>
                    )}
                    {profile_job && (
                      <span className="text-white/50 text-xs">{profile_job}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* responsive text-indent CSS */}
      <style jsx>{`
        .desc-indent { text-indent: 5.5rem; }        /* mobil */
        @media (min-width: 768px) {
          .desc-indent { text-indent: 10.5rem; }     /* md és fölötte */
        }
      `}</style>
    </section>
    </div>
  );
};
