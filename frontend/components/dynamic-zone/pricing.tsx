'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { MotionLink } from '@/components/motion-link';
import { PlusIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { Heading } from '../elements/heading';
import { Subheading } from '../elements/subheading';
import { strapiImage } from '@/lib/strapi/strapiImage';
import { GrainCanvas } from '../ui/grain-canvas';
import { Container } from '@/components/container';
import { slugifyPlanName } from '@/lib/plan-slug';
import { PlanDeepDive } from './plan-deep-dive';


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
  price?: string | number | null;
  currency?: string | null;
  currency_project_label?: string | null;
  time_label?: string | null;
  time_value?: string | null;
  addon_title?: string | null;
  addon_description?: string | null;
  addon_price?: string | number | null;
  recommended_for?: string | null;
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

const toAbs = (m?: { url?: string | null } | string | null) => {
  const raw = typeof m === 'string' ? m : m?.url || '';
  return raw ? strapiImage(raw) : undefined;
};

const cardVariants: Variants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -24 },
};

const cardTransition = { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] as any };

export const Pricing = ({
  heading,
  badge_label,
  sub_heading,
  profile_image,
  profile_label,
  profile_job,
  plans = [],
  background,
  background_url,
  locale = 'hu-HU',
}: PricingProps) => {
  const [pricingType, setPricingType] = useState<string>('project');
  const [marketingAddon, setMarketingAddon] = useState(false);
  const [expanded, setExpanded] = useState(false);
  // Alapértelmezetten az egyösszegű (kedvezményes) mód aktív — ez a magasabb
  // érzékelt értéket és a konverziót segíti, nem a havidíjas az alapállapot.
  const [billingMode, setBillingMode] = useState<'monthly' | 'upfront'>('upfront');

  // Egyösszegű fizetésnél 20% kedvezmény a 12 havi díj összegéhez képest —
  // csak a valódi havidíjas csomagoknál (currency_project_label === '/hó'),
  // az egyedi árajánlatos (Partner) és projekt-alapú csomagoknál nincs értelme.
  const UPFRONT_DISCOUNT = 0.2;

  // Egyösszegű módban az átfutási idő csomagonként eltér — a Növekedés nagyobb,
  // egyedi fejlesztésű munka, ezért hosszabb. Nincs külön CMS mező erre, a
  // csomagnév alapján választjuk ki.
  const upfrontDeliveryTime = (planName?: string | null): string => {
    if (planName === 'Növekedés') return isHu ? 'kb. 4–8 hét' : 'approx. 4–8 weeks';
    if (planName === 'Rajt') return isHu ? 'kb. 2–6 hét' : 'approx. 2–6 weeks';
    return isHu ? 'kb. 2–4 hét' : 'approx. 2–4 weeks';
  };

  const planTypes = useMemo(() => {
    const s = new Set<string>();
    plans.forEach((p) => p?.plan_type && s.add(p.plan_type));
    return Array.from(s);
  }, [plans]);

  const defaultPricingType = useMemo(
    () => plans.find((p) => !!p?.featured)?.plan_type || planTypes[0],
    [plans, planTypes]
  );

  useEffect(() => {
    if (planTypes.length && !planTypes.includes(pricingType)) {
      setPricingType(defaultPricingType || planTypes[0]);
    }
  }, [planTypes, pricingType, defaultPricingType]);

  const poolForType = useMemo(
    () => plans.filter((p) => (p?.plan_type || '') === pricingType),
    [plans, pricingType]
  );

  const activePlan = useMemo(() => {
    if (!poolForType.length) return undefined;
    return poolForType.find((p) => !!p?.featured) || poolForType[0];
  }, [poolForType]);

  const rawPrice = activePlan?.price;
  const rawAddonPrice = activePlan?.addon_price;
  const priceIsNumeric = rawPrice !== null && rawPrice !== undefined && rawPrice !== '' && !isNaN(Number(rawPrice));
  const addonIsNumeric = rawAddonPrice !== null && rawAddonPrice !== undefined && rawAddonPrice !== '' && !isNaN(Number(rawAddonPrice));

  const basePrice = priceIsNumeric ? Number(rawPrice) : 0;
  const addon = addonIsNumeric ? Number(rawAddonPrice) : 0;
  const total = marketingAddon && addonIsNumeric ? basePrice + addon : basePrice;
  const currency = priceIsNumeric ? activePlan?.currency || '' : '';
  const priceSuffix = priceIsNumeric ? activePlan?.currency_project_label || '' : '';

  // Csak a tényleges havidíjas csomagoknál ajánljuk fel az egyösszegű
  // fizetést — az egyedi árajánlatos (Partner) és nem "/hó" jelölésű
  // csomagoknál (pl. projekt-alapú, egyszeri díjas) nincs értelme.
  const isMonthlyPlan = priceIsNumeric && priceSuffix === '/hó';
  const isUpfront = isMonthlyPlan && billingMode === 'upfront';
  // A marketing addon SOSEM szorzódik bele a 12 hónapos egyösszegű
  // végösszegbe — csak az alap csomagár kerül egyösszegben, kedvezménnyel
  // kiszámolásra. Ha az addon be van kapcsolva, az csak EGYSZER (egy havi
  // összeggel) adódik hozzá a végösszeghez, nem ×12-vel.
  const fullYearTotal = Math.round(basePrice * 12);
  const upfrontTotal = Math.round(fullYearTotal * (1 - UPFRONT_DISCOUNT));
  const upfrontSavings = fullYearTotal - upfrontTotal;
  const upfrontTotalWithAddon = upfrontTotal + (marketingAddon && addonIsNumeric ? addon : 0);

  const displayTotal = isUpfront ? upfrontTotalWithAddon : total;
  const formattedPrice = priceIsNumeric
    ? Math.round(displayTotal).toLocaleString(locale)
    : String(rawPrice ?? '—');

  const featureList: string[] = useMemo(() => {
    const primary = (activePlan?.perks || []).map((x) => x?.text).filter(Boolean) as string[];
    const extra = (activePlan?.additional_perks || []).map((x) => x?.text).filter(Boolean) as string[];
    return [...primary, ...extra];
  }, [activePlan]);

  const isHu = locale?.toLowerCase().startsWith('hu');
  const ctaText = activePlan?.CTA?.text || (isHu ? 'Kapcsolatfelvétel' : 'Get in touch');
  const ctaBaseHref = activePlan?.CTA?.URL || '#';
  const ctaHref =
    activePlan?.name && ctaBaseHref !== '#'
      ? `${ctaBaseHref}${ctaBaseHref.includes('?') ? '&' : '?'}csomag=${slugifyPlanName(activePlan.name)}${marketingAddon ? '&marketing=1' : ''}${isUpfront ? '&fizetes=egyosszeg' : ''}`
      : ctaBaseHref;
  const ctaTarget = activePlan?.CTA?.target || '_self';

  const bgUrl =
    toAbs(background_url) ||
    toAbs(background) ||
    '/images/fallback/section-background.jpg';

  const labelForType = (t: string) => {
    const pool = plans.filter((p) => (p?.plan_type || '') === t);
    const preferred = pool.find((p) => p?.featured) || pool[0];
    const dynamicName = preferred?.name?.trim();
    const fallbacks: Record<string, { hu: string; en: string }> = {
      project: { hu: 'Projekt', en: 'Per project' },
      monthly: { hu: 'Havi', en: 'Monthly' },
    };
    return (
      dynamicName ||
      (fallbacks[t] ? (isHu ? fallbacks[t].hu : fallbacks[t].en) : '') ||
      (t ? t.charAt(0).toUpperCase() + t.slice(1) : '')
    );
  };

  const splitDescription = (txt?: string | null): [string, string] => {
    if (!txt) return ['', ''];
    const dashIdx = txt.indexOf('—');
    if (dashIdx !== -1) return [txt.slice(0, dashIdx + 1).trimEnd(), txt.slice(dashIdx + 1).trimStart()];
    const m = txt.match(/([\s\S]+?[.!?]+)(\s+)([\s\S]*)$/);
    if (m) return [m[1].trimEnd(), m[3].trimStart()];
    return [txt, ''];
  };
  const [descLead, descRest] = splitDescription(activePlan?.recommended_for);
  const recommendedForQuestion = isHu ? 'Kiknek ajánlott?' : 'Who is this recommended for?';

  // Statikus, mindig renderelt "induló ártól" mondat — SZÁNDÉKOSAN nem a
  // fül-váltós activePlan-ből jön, mert az csak kliens-interakcióra kerül a
  // DOM-ba. Egy AI/Google-crawler sosem kattint a fülekre, így a legolcsóbb
  // csomag ára e nélkül sosem lenne jelen a betöltéskori, látható szövegben
  // (lásd Rich Results Test audit, 2026-10-09 — a Mikró 24.900 Ft-ja csak a
  // JSON-LD-ben volt meg, sehol emberi szövegként).
  const cheapestPlan = useMemo(() => {
    return plans
      .filter((p) => p?.price !== null && p?.price !== undefined && p.price !== '' && !isNaN(Number(p.price)))
      .reduce<Plan | null>((min, p) => (min === null || Number(p.price) < Number(min.price)) ? p : min, null);
  }, [plans]);

  // A legolcsóbb csomag lehet havidíjas (/hó) vagy egyszeri díjas (-tól) is —
  // a mondat ezt is jelezze, különben félreérthető, hogy ez a teljes projekt ára.
  const cheapestPriceLabel = cheapestPlan
    ? `${Math.round(Number(cheapestPlan.price)).toLocaleString(locale)} ${cheapestPlan.currency || ''} ${cheapestPlan.currency_project_label || ''}`.trim()
    : null;

  const buttonVariants: Variants = {
    rest: { y: '-50%' },
    hover: { y: '0%', transition: { duration: 0.2, ease: 'easeInOut' } },
  };

  return (
    <div className="px-0 md:px-2">
      <section className="w-full px-4 py-12 md:py-18 relative overflow-hidden rounded-none md:rounded-3xl font-sans">

        <GrainCanvas strength="light" opacity={0.5} zIndex={1} />
        <div className="absolute inset-0 z-0">
          <img
            src={bgUrl}
            alt=""
            aria-hidden="true"
            width={1912}
            height={1402}
            className="w-full h-full object-cover opacity-100"
            style={{ filter: 'brightness(1.15)' }}
          />
          <div className="absolute inset-0 opacity-5" />
        </div>
        <Container>
          <div className="relative z-10">

            {/* ── FEJLÉC — fade up, minden görgetéskor ── */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
            >
              {badge_label && (
                <div className="flex items-center space-x-2 mb-8 md:mb-12">
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
              {cheapestPriceLabel && (
                <p className="text-sm md:text-base text-white/60 mt-2">
                  {isHu
                    ? `Csomagjaink már ${cheapestPriceLabel}-tól indulnak.`
                    : `Our packages start from ${cheapestPriceLabel}.`}
                </p>
              )}
            </motion.div>

            {/* ── TÍPUSVÁLASZTÓ — fade up, kis delay ── */}
            {!!planTypes.length && (
              <motion.div
                className="flex items-center justify-start md:justify-center overflow-x-auto"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.33, 1, 0.68, 1] }}
              >
                <div className="bg-white/10 rounded-full p-1 flex gap-1 md:gap-2 mt-2 relative">
                  {planTypes.map((t) => {
                    const active = pricingType === t;
                    return (
                      <button
                        key={t}
                        onClick={() => {
                          setPricingType(t);
                          setExpanded(false);
                          setMarketingAddon(false);
                          // A fizetési mód (havi/egyösszegű) szándékosan NEM reseteled
                          // csomagváltáskor — ha valaki egyösszegűben gondolkodik, az
                          // maradjon érvényben akkor is, ha másik csomagra vált.
                        }}
                        className="relative px-4 py-3 md:px-6 md:py-4 rounded-full text-sm md:text-sm font-medium transition-colors z-10 whitespace-nowrap shrink-0"
                        style={{ color: active ? 'black' : 'rgba(255,255,255,0.8)' }}
                      >
                        {active && (
                          <motion.div
                            layoutId="activePill"
                            className="absolute inset-0 bg-white rounded-full"
                            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                          />
                        )}
                        <span className="relative z-10">{labelForType(t)}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ── FŐ RÁCS — kártyák fade up, stagger ── */}
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch mt-10"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.33, 1, 0.68, 1] }}
            >
              {/* BAL kártya: addon */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`addon-${pricingType}`}
                  className="order-2 lg:order-1 bg-white/5 rounded-xl p-6 flex flex-col justify-between min-h-[360px]"
                  variants={cardVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={cardTransition}
                >
                  <div>
                    <h3 className="text-white text-lg font-medium mb-1">
                      {activePlan?.addon_title || 'Add marketing add-on'}
                    </h3>
                    <p className="text-white/75 text-sm md:text-base whitespace-pre-line">
                      {activePlan?.addon_description || 'Flexible tools to strengthen your launch.'}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-6">
                    <div className="text-white/70 text-lg font-semibold">
                      {/* Mindig a sima havi összeg — egyösszegű módban se számoljuk ki rá a
                          12 hónapos, kedvezményes nagy végösszeget, az ijesztően hat. A fő ár
                          alatti végösszeg (lásd fent) természetesen már tartalmazza az addont. */}
                      {addonIsNumeric ? (
                        <>
                          +{Math.round(addon).toLocaleString(locale)} {activePlan?.currency || ''}
                          <span className="block text-white/40 text-xs font-normal mt-0.5">/hó</span>
                        </>
                      ) : (
                        String(rawAddonPrice ?? '—')
                      )}
                    </div>
                    <motion.button
                      onClick={() => setMarketingAddon(!marketingAddon)}
                      className={`relative w-16 h-10 rounded-full transition-colors ${marketingAddon ? 'bg-white' : 'bg-white/20'
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
                </motion.div>
              </AnimatePresence>

              {/* JOBB kártya: ár + lista + CTA */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`main-${pricingType}`}
                  className="order-1 lg:order-2 lg:col-span-2 bg-white/5 rounded-xl p-6 md:p-8 flex flex-col lg:flex-row lg:gap-x-10 min-h-[360px]"
                  variants={cardVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ ...cardTransition, delay: 0.04 }}
                >
                  {/* Ár blokk */}
                  <div className="flex-1 flex flex-col justify-between">
                    {/* Fizetési mód — kompakt, az ár fölött, nem a fejléc-fülekkel egy
                        sorban/stílusban, hogy ne folyjanak össze vizuálisan. */}
                    {isMonthlyPlan && (
                      <motion.div
                        className="relative self-start inline-flex items-center gap-1 mb-4 p-1.5 rounded-full bg-white/10"
                        whileTap={{ scale: 0.95 }}
                      >
                        {([
                          { key: 'monthly' as const, label: isHu ? 'Havonta' : 'Monthly' },
                          { key: 'upfront' as const, label: isHu ? `Egy összegben −${UPFRONT_DISCOUNT * 100}%` : `Upfront −${UPFRONT_DISCOUNT * 100}%` },
                        ]).map((opt) => {
                          const active = billingMode === opt.key;
                          return (
                            <button
                              key={opt.key}
                              onClick={() => setBillingMode(opt.key)}
                              className="relative px-4 py-2.5 rounded-full text-base font-medium whitespace-nowrap z-10"
                            >
                              {active && (
                                <motion.div
                                  layoutId="billing-mode-pill"
                                  className="absolute inset-0 bg-white rounded-full -z-10 shadow-[0_2px_8px_rgba(0,0,0,0.25)]"
                                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                />
                              )}
                              <span className={active ? 'text-black' : 'text-white/60'}>
                                {opt.label}
                              </span>
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={String(marketingAddon) + pricingType + billingMode}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                      >
                        {isUpfront && (
                          <div className="text-white/40 text-sm md:text-base line-through mb-1">
                            {(fullYearTotal + (marketingAddon && addonIsNumeric ? addon : 0)).toLocaleString(locale)} {currency}
                          </div>
                        )}
                        <div className="text-white text-4xl md:text-5xl font-bold leading-none">
                          {formattedPrice}
                          <span className="text-white/60 text-sm font-normal ml-2">{currency}</span>
                        </div>
                        <div className="text-white/50 text-xs md:text-sm mt-1.5">
                          {isUpfront ? (isHu ? 'egy összegben, 12 hónapra' : 'upfront, for 12 months') : priceSuffix}
                        </div>
                        {isUpfront && (
                          <>
                            <div className="inline-block mt-2.5 text-xs md:text-sm font-semibold text-black bg-white rounded-full px-3 py-1">
                              {isHu
                                ? `Megtakarítás: ${upfrontSavings.toLocaleString(locale)} ${currency}`
                                : `You save ${upfrontSavings.toLocaleString(locale)} ${currency}`}
                            </div>
                            <p className="text-white/40 text-xs mt-2">
                              {isHu
                                ? 'Később is átválthatsz havi fizetésre, ha menet közben mégis azt szeretnéd.'
                                : "You can switch to monthly billing later if you'd prefer that instead."}
                            </p>
                          </>
                        )}
                      </motion.div>
                    </AnimatePresence>

                    <div className="flex flex-col">
                      <div className="flex flex-row justify-between items-center mt-6">
                        <p className="text-white/60 text-sm font-semibold">
                          {isUpfront ? (isHu ? 'Átfutási idő' : 'Delivery time') : activePlan?.time_label || 'Delivery time'}
                        </p>
                        <p className="text-white text-sm font-semibold">
                          {isUpfront ? upfrontDeliveryTime(activePlan?.name) : activePlan?.time_value || '—'}
                        </p>
                      </div>
                      <div className="relative w-full h-[1px] bg-white/10 overflow-hidden mt-4">
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-50 to-transparent"
                          initial={{ x: '-100%' }}
                          whileInView={{ x: '100%' }}
                          transition={{ duration: 1.4, ease: 'easeInOut' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Lista + CTA */}
                  <div className="flex-1 flex flex-col mt-8 lg:mt-0">
                    <div className="space-y-3 md:space-y-4">
                      {featureList.map((text, i) => (
                        <div key={i} className="flex items-start space-x-3">
                          <div className="w-6 h-6 shrink-0 bg-white/10 rounded-full flex items-center justify-center">
                            <PlusIcon className="w-3 h-3 text-white" />
                          </div>
                          <p className="text-white text-sm md:text-base pt-0.5">{text}</p>
                        </div>
                      ))}
                    </div>

                    {/* <div className="flex justify-center mt-4">
                    <button
                      onClick={() => setExpanded(!expanded)}
                      className="text-white/80 hover:text-white transition-all flex items-center gap-2"
                    >
                      {expanded ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5 animate-bounce" />
                      )}
                    </button>
                  </div> */}

                    <div className="mt-6 lg:mt-auto lg:pt-6">
                      <MotionLink
                        href={ctaHref}
                        target={ctaTarget || undefined}
                        rel={ctaTarget === '_blank' ? 'noopener noreferrer' : undefined}
                        initial="rest"
                        whileHover="hover"
                        animate="rest"
                        className="w-full relative text-lg inline-flex items-center justify-center bg-white text-black px-6 py-4 rounded-full font-semibold text-base overflow-hidden group transition-all"
                      >
                        <div className="overflow-hidden transform-gpu" style={{ height: '1.5rem' }}>
                          <motion.div
                            className="flex flex-col will-change-transform"
                            style={{ lineHeight: '1.5rem' }}
                            variants={buttonVariants}
                          >
                            <span className="block">{ctaText}</span>
                            <span className="block" aria-hidden="true">{ctaText}</span>
                          </motion.div>
                        </div>
                      </MotionLink>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* ── ÖSSZEHASONLÍTÓ TÁBLÁZAT — mindig a kezdő HTML-ben van, nem fültől függ.
                 A fenti kártyák csak az aktív fület mutatják (kattintásra váltanak),
                 ezt viszont AI-crawler/Google is látja JS nélkül: minden csomag
                 egyszerre, egy táblázatban. Lásd GEO audit, 2026-10-14. */}
            {plans.length > 1 && (
              <motion.div
                className="mt-14 overflow-x-auto"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
              >
                <table className="w-full min-w-[640px] border-collapse text-sm md:text-base">
                  <caption className="sr-only">
                    {isHu ? 'Csomagok összehasonlítása' : 'Compare our packages'}
                  </caption>
                  <thead>
                    <tr className="border-b border-white/10">
                      <th scope="col" className="text-left text-white/50 font-normal py-3 pr-4">
                        {isHu ? 'Csomag' : 'Package'}
                      </th>
                      {plans.map((p) => (
                        <th key={p.name} scope="col" className="text-left text-white font-semibold py-3 px-4">
                          {p.name}
                          {p.featured && (
                            <span className="block text-xs font-normal text-white/50 mt-0.5">
                              {isHu ? 'Legnépszerűbb' : 'Most popular'}
                            </span>
                          )}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/10">
                      <th scope="row" className="text-left text-white/50 font-normal py-3 pr-4 align-top">
                        {isHu ? 'Ár' : 'Price'}
                      </th>
                      {/* A táblázat is követi a Havonta/Egyösszegben kapcsolót — ugyanúgy
                          kedvezményes, 12 hónapra szóló összeget mutat egyösszegű módban,
                          mint a fenti interaktív kártya, nem csak a nyers havi számot. */}
                      {plans.map((p) => {
                        const num = p.price !== null && p.price !== undefined && p.price !== '' && !isNaN(Number(p.price));
                        const pIsMonthly = num && p.currency_project_label === '/hó';
                        const pIsUpfront = pIsMonthly && billingMode === 'upfront';
                        const displayNum = pIsUpfront
                          ? Math.round(Number(p.price) * 12 * (1 - UPFRONT_DISCOUNT))
                          : num
                          ? Math.round(Number(p.price))
                          : null;
                        return (
                          <td key={p.name} className="text-white py-3 px-4 align-top font-semibold">
                            {num ? displayNum!.toLocaleString(locale) : String(p.price ?? '—')}
                            {num && (
                              <span className="text-white/60 font-normal text-xs ml-1">
                                {p.currency} {pIsUpfront ? (isHu ? 'egyben' : 'upfront') : p.currency_project_label}
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                    <tr className="border-b border-white/10">
                      <th scope="row" className="text-left text-white/50 font-normal py-3 pr-4 align-top">
                        {isHu ? 'Időtartam' : 'Duration'}
                      </th>
                      {plans.map((p) => {
                        const num = p.price !== null && p.price !== undefined && p.price !== '' && !isNaN(Number(p.price));
                        const pIsUpfront = num && p.currency_project_label === '/hó' && billingMode === 'upfront';
                        return (
                          <td key={p.name} className="text-white/80 py-3 px-4 align-top">
                            {pIsUpfront ? upfrontDeliveryTime(p.name) : p.time_value || '—'}
                          </td>
                        );
                      })}
                    </tr>
                    <tr>
                      <th scope="row" className="text-left text-white/50 font-normal py-3 pr-4 align-top">
                        {isHu ? 'Kiknek ajánlott' : 'Recommended for'}
                      </th>
                      {plans.map((p) => (
                        <td key={p.name} className="text-white/80 py-3 px-4 align-top">
                          {p.recommended_for || '—'}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </motion.div>
            )}

            {/* ── ALSÓ BLOKK — fade up ── */}
            {(profile_label || activePlan?.recommended_for) && (
              <motion.div
                className="mt-20 px-4 grid grid-cols-1 md:grid-cols-12 gap-6 items-start"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`recommended-question-${pricingType}`}
                    className="md:col-span-3 flex justify-left md:block md:justify-center"
                    variants={cardVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={cardTransition}
                  >
                    <p className="text-white/50 text-sm md:text-sm">{recommendedForQuestion}</p>
                  </motion.div>

                  <motion.div
                    key={`recommended-answer-${pricingType}`}
                    className="md:col-span-9 text-left md:text-left md:pl-10 lg:pl-16"
                    variants={cardVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ ...cardTransition, delay: 0.04 }}
                  >
                    {(descLead || descRest) && (
                      <p className="desc-indent text-lg md:text-3xl font-semibold text-white">
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
                            width={40}
                            height={40}
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
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </Container>
        <style jsx>{`
          .desc-indent { text-indent: 5.5rem; }
          @media (min-width: 768px) {
            .desc-indent { text-indent: 10.5rem; }
          }
        `}</style>
      </section>
      <PlanDeepDive plans={plans} locale={locale} />
    </div>
  );
};
