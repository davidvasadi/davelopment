'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { sendGAEvent } from '@next/third-parties/google';
import { MotionLink } from '@/components/motion-link';
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  XIcon,
  RotateCwIcon,
  StepForwardIcon,
  ChevronDown,
  ChevronLeft,
} from 'lucide-react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { strapiImage } from '@/lib/strapi/strapiImage';

type FormInput = {
  type: 'text' | 'email' | 'textarea' | 'submit' | string;
  name: string;
  placeholder?: string;
};

type Media = { url?: string | null } | string | null | undefined;

type ButtonConfig = {
  text?: string | null;
  URL?: string | null;
  target?: '_self' | '_blank' | string | null;
  variant?: string | null;
};

type PersonCard = {
  name: string;
  role?: string;
  org?: string;
  image?: Media;
  email?: string | null;
  button?: ButtonConfig | null;
};

type BenefitIcon = 'rotate' | 'step' | 'check' | 'clock';

type Benefit = {
  icon?: BenefitIcon | null;
  title: string;
  description?: string | null;
};

type PolicyLink = {
  text?: string | null;
  URL?: string | null;
  target?: '_self' | '_blank' | string | null;
};

type FormNextToSectionProps = {
  heading: string;
  sub_heading?: string;
  form?: {
    inputs?: FormInput[];
  };
  section?: {
    heading: string;
    sub_heading?: string;
  };
  social_media_icon_links?: any[];
  person_card?: PersonCard;
  video?: Media;
  video_poster?: Media;
  benefits?: Benefit[] | null;
  policy_links?: PolicyLink[] | null;
  policy_prefix?: string | null;
  policy_and_word?: string | null;
};

const toAbs = (m?: Media): string | undefined => {
  const raw = typeof m === 'string' ? m : (m as any)?.url || '';
  return raw ? strapiImage(raw) : undefined;
};

const renderBenefitIcon = (icon?: BenefitIcon | null) => {
  switch (icon) {
    case 'rotate': return <RotateCwIcon className="w-6 h-6 text-white mt-1" />;
    case 'step':   return <StepForwardIcon className="w-6 h-6 text-white mt-1" />;
    case 'check':  return <CheckCircleIcon className="w-6 h-6 text-white mt-1" />;
    case 'clock':  return <ClockIcon className="w-6 h-6 text-white mt-1" />;
    default:       return <CheckCircleIcon className="w-6 h-6 text-white mt-1" />;
  }
};

type ChipOption = { value: string; label: string };
type QuestionKey = 'projectStage' | 'goal' | 'industry' | 'businessAge' | 'source';

const EASE = [0.22, 1, 0.36, 1] as const;

// Egyválasztós dropdown — becsukva pont úgy néz ki mint egy natív select mező.
// Kattintásra egy lebegő panel nyílik le FÖLÉJE (absolute), ami nem tolja el a
// körülötte lévő tartalmat. Kiválasztás után bezár.
function DropdownQuestion({
  label,
  options,
  value,
  placeholder,
  isOpen,
  onToggle,
  onSelect,
}: {
  label: string;
  options: ChipOption[];
  value: string;
  placeholder: string;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (v: string) => void;
}) {
  const selectedLabel = options.find((o) => o.value === value)?.label;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [justClicked, setJustClicked] = useState<string | null>(null);

  // Kattintás bárhova máshova (pl. egy input mezőre) zárja be, ha épp nyitva van.
  useEffect(() => {
    if (!isOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        onToggle();
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [isOpen, onToggle]);

  return (
    <div className="relative" ref={wrapperRef}>
      <p className="text-xs font-medium text-black/80 mb-1">{label}</p>
      <motion.button
        type="button"
        onClick={onToggle}
        whileTap={{ scale: 0.97 }}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 text-left ${
          selectedLabel ? 'text-black' : 'text-black/40'
        }`}
      >
        <span>{selectedLabel || placeholder}</span>
        <motion.div
          className="shrink-0"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 150, damping: 12 }}
        >
          <ChevronDown className="w-4 h-4 text-black/40" />
        </motion.div>
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0.85 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0.85 }}
            transition={{ duration: 0.3, ease: EASE }}
            style={{ transformOrigin: 'top' }}
            className="absolute left-0 right-0 top-full mt-2 z-20 bg-white rounded-xl border border-black/10 shadow-xl p-1.5"
          >
            <div className="flex flex-col gap-0.5">
              <motion.button
                type="button"
                onClick={() => {
                  setJustClicked('');
                  setTimeout(() => onSelect(''), 160);
                }}
                animate={justClicked === '' ? { scale: [1, 1.04, 1] } : { scale: 1 }}
                transition={{ duration: 0.2, ease: EASE }}
                whileTap={{ scale: 0.95 }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-black/40 hover:bg-black/5 transition-colors mb-0.5 border-b border-black/5"
              >
                {placeholder}
              </motion.button>
              {options.map((o) => {
                const active = value === o.value;
                return (
                  <motion.button
                    key={o.value}
                    type="button"
                    onClick={() => {
                      setJustClicked(o.value);
                      setTimeout(() => onSelect(active ? '' : o.value), 160);
                    }}
                    animate={justClicked === o.value ? { scale: [1, 1.04, 1] } : { scale: 1 }}
                    transition={{ duration: 0.2, ease: EASE }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      active || justClicked === o.value ? 'bg-black text-white' : 'text-black/70 hover:bg-black/5'
                    }`}
                  >
                    {o.label}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Mező-azonosítás: name tartalom alapján, NEM type alapján.
// Strapi-ban minden input type="text" lehet — a name adja meg a szerepet.
// ─────────────────────────────────────────────────────────────
const fieldRole = (
  input: FormInput,
): 'name' | 'email' | 'phone' | 'message' | 'submit' | 'unknown' => {
  const n = (input.name ?? '').toLowerCase();
  const t = (input.type ?? '').toLowerCase();

  if (t === 'submit') return 'submit';
  if (t === 'textarea' || n.includes('üzenet') || n.includes('message') || n.includes('uzenet'))
    return 'message';
  if (t === 'tel' || n.includes('telefon') || n.includes('phone') || n.includes('tel'))
    return 'phone';
  if (t === 'email' || n.includes('e-mail') || n.includes('email') || n.includes('mail'))
    return 'email';
  if (n.includes('név') || n.includes('name') || n.includes('nev'))
    return 'name';

  return 'unknown';
};

// Framer-szerű, "lazy" videó-lejátszás: nem indul el azonnal betöltéskor
// (ez a szekció lejjebb van az oldalon, gyakran még nem is látszik), hanem
// csak akkor kezd lejátszódni (és el is dekódolódni), amikor ténylegesen a
// képernyőre görgetjük — kevesebb induló hálózati/CPU terhelés, jobb
// PageSpeed/Lighthouse mobil-pontszám, ugyanaz a videó marad meg.
function useLazyVideoPlay() {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (!videoRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) videoRef.current?.play().catch(() => {});
        else videoRef.current?.pause();
      },
      { threshold: 0.2 }
    );
    observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);
  return videoRef;
}

export function FormNextToSection({
  heading,
  sub_heading,
  form,
  section,
  person_card,
  person: personAlias,
  video,
  video_poster,
  benefits,
  policy_links,
  policy_prefix,
  policy_and_word,
}: FormNextToSectionProps & { person?: PersonCard }) {
  const _person = person_card ?? personAlias;
  const copyright = `© ${new Date().getFullYear()} [davelopment]®`;
  const pathname = usePathname();
  const lang: 'hu' | 'en' = pathname?.startsWith('/hu') ? 'hu' : 'en';
  const videoRef = useLazyVideoPlay();

  const messages =
    lang === 'hu'
      ? {
          nameRequired: 'A név megadása kötelező.',
          emailRequired: 'Az email megadása kötelező.',
          emailInvalid: 'Érvényes email címet adj meg.',
          phoneRequired: 'A telefonszám megadása kötelező.',
          submitFailed: 'Beküldés sikertelen. Próbáld újra.',
          networkError: 'Hálózati hiba. Próbáld újra.',
          sending: 'Küldés folyamatban...',
          success: 'Köszönöm! Hamarosan jelentkezem.',
        }
      : {
          nameRequired: 'Your name is required.',
          emailRequired: 'E-mail is required.',
          emailInvalid: 'Please enter a valid e-mail address.',
          phoneRequired: 'Phone number is required.',
          submitFailed: 'Submission failed. Please try again.',
          networkError: 'Network error. Please try again.',
          sending: 'Sending...',
          success: 'Thank you! I will get back to you soon.',
        };

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '',
    projectStage: '', goal: '', industry: '', businessAge: '', source: '',
  });
  const [step, setStep] = useState<1 | 2>(1);
  const [openQuestion, setOpenQuestion] = useState<QuestionKey | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedMarketingAddon, setSelectedMarketingAddon] = useState(false);

  // A pricing kártyáról érkező ?csomag= és ?marketing= paramétereket olvassuk ki — window.location,
  // hogy ne kelljen useSearchParams()-hoz Suspense boundary-t bevezetni a szülő fába.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const plan = params.get('csomag');
    if (!plan) return;
    setSelectedPlan(plan);
    setSelectedMarketingAddon(params.get('marketing') === '1');
    // kis késleltetés, hogy a layout/animációk stabilizálódjanak, mielőtt a formhoz görgetünk
    setTimeout(() => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
  }, []);
  const [isSubmitting, setIsSubmitting]   = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError]     = useState<string | null>(null);
  const [showAlert, setShowAlert]         = useState(false);
  const [nameError, setNameError]         = useState<string | null>(null);
  const [emailError, setEmailError]       = useState<string | null>(null);
  const [phoneError, setPhoneError]       = useState<string | null>(null);

  // ── Mezők kigyűjtése role alapján ──
  const inputs      = form?.inputs ?? [];
  const nameInput    = inputs.find(i => fieldRole(i) === 'name');
  const emailInput   = inputs.find(i => fieldRole(i) === 'email');
  const phoneInput   = inputs.find(i => fieldRole(i) === 'phone');
  const submitInput  = inputs.find(i => fieldRole(i) === 'submit');

  const isHuForm = lang === 'hu';

  // 1. lépés — üzleti kontextus, csak kattintással, gépelés nélkül
  const projectStageLabel = isHuForm ? 'Hol tartasz most?' : 'Where are you right now?';
  const goalLabel         = isHuForm ? 'Fő cél a weboldallal' : 'Main goal for the website';
  const industryLabel     = isHuForm ? 'Milyen területen dolgozol?' : 'What industry are you in?';
  const businessAgeLabel  = isHuForm ? 'Mióta létezik a vállalkozásod?' : 'How long has your business been running?';
  const sourceLabel       = isHuForm ? 'Honnan találtál ránk?' : 'How did you find us?';
  const pickPlaceholder   = isHuForm ? 'Válassz (opcionális)' : 'Pick one (optional)';

  const PROJECT_STAGES: ChipOption[] = isHuForm
    ? [
        { value: 'new',      label: 'Most indulok, nincs még weboldalam' },
        { value: 'replace',  label: 'Van weboldalam, de le akarom cserélni' },
        { value: 'expand',   label: 'Van weboldalam, bővíteném' },
        { value: 'exploring',label: 'Még csak tájékozódom' },
      ]
    : [
        { value: 'new',      label: "Just starting, no website yet" },
        { value: 'replace',  label: 'I have one but want to replace it' },
        { value: 'expand',   label: 'I have one, want to expand it' },
        { value: 'exploring',label: 'Just exploring' },
      ];

  const GOALS: ChipOption[] = isHuForm
    ? [
        { value: 'leads',           label: 'Több megkeresés/érdeklődő' },
        { value: 'branding',        label: 'Professzionálisabb megjelenés' },
        { value: 'sales',           label: 'Online értékesítés' },
        { value: 'existing_clients',label: 'Meglévő ügyfelek kiszolgálása' },
      ]
    : [
        { value: 'leads',           label: 'More inquiries / leads' },
        { value: 'branding',        label: 'A more professional look' },
        { value: 'sales',           label: 'Online sales' },
        { value: 'existing_clients',label: 'Serving existing customers' },
      ];

  const INDUSTRIES: ChipOption[] = isHuForm
    ? [
        { value: 'services',     label: 'Szolgáltatás' },
        { value: 'ecommerce',    label: 'Termékértékesítés (webshop)' },
        { value: 'hospitality',  label: 'Vendéglátás, szálláshely' },
        { value: 'health_beauty',label: 'Egészségügy, szépségipar' },
        { value: 'other',        label: 'Egyéb' },
      ]
    : [
        { value: 'services',     label: 'Services' },
        { value: 'ecommerce',    label: 'Product sales (webshop)' },
        { value: 'hospitality',  label: 'Hospitality, accommodation' },
        { value: 'health_beauty',label: 'Health & beauty' },
        { value: 'other',        label: 'Other' },
      ];

  const BUSINESS_AGES: ChipOption[] = isHuForm
    ? [
        { value: 'startup',    label: 'Most induló vállalkozás' },
        { value: '1-3y',       label: '1-3 éve működöm' },
        { value: 'established',label: 'Több éve stabil vállalkozás' },
      ]
    : [
        { value: 'startup',    label: 'Just starting out' },
        { value: '1-3y',       label: 'Running for 1-3 years' },
        { value: 'established',label: 'Established, several years in' },
      ];

  const SOURCES: ChipOption[] = isHuForm
    ? [
        { value: 'google',     label: 'Google' },
        { value: 'instagram',  label: 'Instagram' },
        { value: 'referral',   label: 'Ajánlás' },
        { value: 'other',      label: 'Egyéb' },
      ]
    : [
        { value: 'google',     label: 'Google' },
        { value: 'instagram',  label: 'Instagram' },
        { value: 'referral',   label: 'Referral' },
        { value: 'other',      label: 'Other' },
      ];

  const QUESTIONS: { key: QuestionKey; label: string; options: ChipOption[] }[] = [
    { key: 'projectStage', label: projectStageLabel, options: PROJECT_STAGES },
    { key: 'goal',         label: goalLabel,         options: GOALS },
    { key: 'industry',     label: industryLabel,     options: INDUSTRIES },
    { key: 'businessAge',  label: businessAgeLabel,  options: BUSINESS_AGES },
    { key: 'source',       label: sourceLabel,       options: SOURCES },
  ];

  // ── Validáció ──
  const validate = () => {
    let valid = true;
    setNameError(null);
    setEmailError(null);
    setPhoneError(null);

    if (!formData.name.trim()) { setNameError(messages.nameRequired); valid = false; }
    if (!formData.email.trim()) {
      setEmailError(messages.emailRequired); valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setEmailError(messages.emailInvalid); valid = false;
    }
    if (!formData.phone.trim()) { setPhoneError(messages.phoneRequired); valid = false; }

    return valid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError(null);
    setShowAlert(true);

    try {
      const PAYLOAD_URL = (process.env.NEXT_PUBLIC_PAYLOAD_URL ?? 'http://localhost:1337').replace(/\/+$/, '');
      const res = await fetch(`${PAYLOAD_URL}/api/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          projectStage: formData.projectStage || undefined,
          goal: formData.goal || undefined,
          industry: formData.industry || undefined,
          businessAge: formData.businessAge || undefined,
          source: formData.source || undefined,
          plan: selectedPlan || undefined,
          marketingAddon: selectedPlan ? selectedMarketingAddon : undefined,
          page: pathname || '/',
          language: lang,
        }),
      });

      if (!res.ok) {
        try {
          const ct = res.headers.get('content-type') || '';
          const body = ct.includes('application/json') ? await res.json() : await res.text();
          console.error('Beküldési hiba (Strapi):', body);
        } catch {}
        setSubmitError(messages.submitFailed);
        return;
      }

      setSubmitSuccess(true);
      // GA4 conversion — main lead signal (only fires with analytics consent)
      try { sendGAEvent('event', 'generate_lead', { form: 'contact', page: pathname || '/' }); } catch {}
      // Google Ads conversion — lead form submission (Consent Mode gates ad_storage/modeling)
      try { sendGAEvent('event', 'conversion', { send_to: 'AW-18293961883/S1jgCI3y8MwcEJvpnpNE', value: 1.0, currency: 'HUF' }); } catch {}
      // Késleltetett reset — a sikeres üzenet a 2. lépésen jelenik meg, a lépésváltás
      // azonnal elrejtené (unmount), mielőtt bárki elolvashatná.
      setTimeout(() => {
        setFormData({ name: '', email: '', phone: '', projectStage: '', goal: '', industry: '', businessAge: '', source: '' });
        setSelectedPlan(null);
        setSelectedMarketingAddon(false);
        setStep(1);
        setShowAlert(false);
      }, 3000);
    } catch (err) {
      console.error('Beküldési hiba (hálózat):', err);
      setSubmitError(messages.networkError);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Animációk ──
  const wheelVariants: Variants = {
    rest: { y: '-50%' },
    hover: { y: '0%', transition: { duration: 0.3, ease: 'easeInOut' } },
  };
  const dotVariants: Variants = {
    rest: { scale: 1 },
    hover: { scale: 1.1, transition: { duration: 0.3, ease: 'easeInOut' } },
  };

  // ── Person card adatok ──
  const personImgUrl        = toAbs(_person?.image);
  const buttonCfg           = _person?.button || null;
  const buttonLabel         = buttonCfg?.text || (lang === 'hu' ? 'Kérdezz közvetlenül' : 'Ask directly');
  const rawHrefFromButton   = buttonCfg?.URL?.trim() || '';
  const rawEmail            = (_person?.email || '').trim();
  const buttonHref = (() => {
    if (rawHrefFromButton) {
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawHrefFromButton)) return `mailto:${rawHrefFromButton}`;
      return rawHrefFromButton;
    }
    if (rawEmail) return rawEmail.startsWith('mailto:') ? rawEmail : `mailto:${rawEmail}`;
    return 'mailto:hello@davelopment.hu';
  })();
  const buttonTarget =
    buttonCfg?.target === '_blank' || buttonCfg?.target === '_self'
      ? buttonCfg.target
      : undefined;

  const handlePersonButtonClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (buttonHref.startsWith('#')) {
      e.preventDefault();
      const id = buttonHref.replace(/^#/, '');
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      else window.location.hash = `#${id}`;
    }
  };

  const videoUrl    = toAbs(video);
  const videoPoster = toAbs(video_poster);
  const hasBenefits = !!benefits && benefits.length > 0;
  const filteredPolicyLinks: PolicyLink[] = (policy_links ?? []).filter(
    (l): l is PolicyLink => !!l && !!l.text && !!l.URL,
  );

  // ── Input osztály helper ──
  const inputCls = (hasError: boolean) =>
    `w-full px-4 py-3 rounded-xl bg-gray-50 text-black focus:outline-none focus:ring-2 ${
      hasError ? 'border border-red-500 ring-red-300' : 'focus:ring-black/10'
    }`;

  return (
    <div className="px-0 md:px-2">
      <section
        id="contact"
        className="relative bg-gray-50 py-20 md:py-32 overflow-hidden md:rounded-3xl"
      >
        {/* Háttérvideó */}
        {videoUrl && (
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover z-0"
            src={videoUrl}
            {...(videoPoster ? { poster: videoPoster } : {})}
            loop
            muted
            playsInline
            preload="metadata"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-black/10 to-transparent z-0" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 xl:gap-24 2xl:gap-32 items-center">

            {/* ── BAL: ŰRLAP ── */}
            <motion.div
              className="order-1 lg:order-1 px-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="flex flex-col h-full w-full sm:justify-self-center lg:max-w-lg">
                <div className="bg-white backdrop-blur-md rounded-2xl p-8 md:p-10 shadow-lg flex flex-col h-auto sm:h-[680px]">

                  {/* Cím */}
                  <div className="mb-4 shrink-0">
                    <p className="text-lg font-semibold mb-2 text-black/80">[davelopment]®</p>
                    <h2 className="text-3xl font-bold mb-2">
                      <span className="text-black">{heading}</span>
                      {sub_heading && <span className="text-black/60"> {sub_heading}</span>}
                    </h2>
                  </div>

                  {/* Kiválasztott csomag + haladás-jelző — egy sorban */}
                  <div className="mb-4 shrink-0 flex flex-col sm:flex-row-reverse sm:items-center justify-between gap-3">
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <p className="text-xs font-semibold text-black/40 uppercase tracking-widest">
                        {step} / 2
                      </p>
                      <div className="flex gap-1.5 w-10">
                        {[1, 2].map((s) => (
                          <div key={s} className="h-1 flex-1 rounded-full overflow-hidden bg-black/10">
                            <motion.div
                              className="h-full w-full rounded-full bg-black"
                              style={{ transformOrigin: 'left' }}
                              initial={false}
                              animate={{ scaleX: s <= step ? 1 : 0 }}
                              transition={{ duration: 0.4, ease: EASE }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    {selectedPlan && (
                      <div className="w-full sm:w-auto flex items-center justify-between gap-2 bg-black/5 rounded-full pl-4 pr-2 py-2 text-sm font-medium text-black">
                        <span>
                          {lang === 'hu' ? 'Kiválasztott csomag' : 'Selected package'}: <strong>{selectedPlan}</strong>
                          {selectedMarketingAddon && (
                            <> + <strong>{lang === 'hu' ? 'Marketing csomag' : 'Marketing package'}</strong></>
                          )}
                        </span>
                        <button
                          type="button"
                          onClick={() => { setSelectedPlan(null); setSelectedMarketingAddon(false); }}
                          aria-label={lang === 'hu' ? 'Csomag törlése' : 'Clear selected package'}
                          className="w-5 h-5 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 transition-colors shrink-0"
                        >
                          <XIcon className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
                    <AnimatePresence mode="wait">
                      {step === 1 ? (
                        <motion.div
                          key="step1"
                          layout
                          initial={{ opacity: 0, x: 16 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -16 }}
                          transition={{ duration: 0.25, ease: EASE }}
                          className="flex-1 flex flex-col justify-between"
                        >
                          <div className="space-y-5">
                            {(() => {
                              const renderQ = (q: typeof QUESTIONS[number]) => (
                                <DropdownQuestion
                                  key={q.key}
                                  label={q.label}
                                  options={q.options}
                                  value={formData[q.key]}
                                  placeholder={pickPlaceholder}
                                  isOpen={openQuestion === q.key}
                                  onToggle={() => setOpenQuestion(openQuestion === q.key ? null : q.key)}
                                  onSelect={(v) => {
                                    setFormData(prev => ({ ...prev, [q.key]: v }));
                                    setOpenQuestion(null);
                                  }}
                                />
                              );
                              const [projectStageQ, goalQ, industryQ, businessAgeQ, sourceQ] = QUESTIONS;
                              return (
                                <>
                                  {renderQ(projectStageQ)}
                                  {renderQ(goalQ)}
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {renderQ(industryQ)}
                                    {renderQ(businessAgeQ)}
                                  </div>
                                  {renderQ(sourceQ)}
                                </>
                              );
                            })()}
                          </div>

                          <motion.button
                            type="button"
                            onClick={() => setStep(2)}
                            className="w-full bg-black text-white rounded-full py-4 mt-6 font-semibold text-lg flex items-center justify-center"
                            initial="rest"
                            whileHover="hover"
                            whileTap={{ scale: 0.98 }}
                          >
                            <motion.div className="overflow-hidden h-6">
                              <motion.div className="flex flex-col" variants={wheelVariants}>
                                <span>{lang === 'hu' ? 'Tovább' : 'Continue'}</span>
                                <span>{lang === 'hu' ? 'Tovább' : 'Continue'}</span>
                              </motion.div>
                            </motion.div>
                          </motion.button>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="step2"
                          layout
                          initial={{ opacity: 0, x: 16 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -16 }}
                          transition={{ duration: 0.25, ease: EASE }}
                          className="flex-1 flex flex-col justify-between"
                        >
                          <div className="space-y-6">
                            <button
                              type="button"
                              onClick={() => setStep(1)}
                              className="flex items-center gap-1.5 text-black/50 text-xs -mt-2 hover:text-black transition-colors"
                            >
                              <ChevronLeft className="h-3 w-3" /> {lang === 'hu' ? 'Vissza' : 'Back'}
                            </button>

                            {/* NÉV */}
                            {nameInput && (
                              <div>
                                <p className="text-xs font-medium text-black/80 mb-1">{nameInput.name}</p>
                                <input
                                  type="text"
                                  name="name"
                                  value={formData.name}
                                  onChange={handleChange}
                                  placeholder={nameInput.placeholder ?? nameInput.name}
                                  className={inputCls(!!nameError)}
                                />
                                {nameError && <p className="text-sm text-red-600 mt-1">{nameError}</p>}
                              </div>
                            )}

                            {/* EMAIL */}
                            {emailInput && (
                              <div>
                                <p className="text-xs font-medium text-black/80 mb-1">{emailInput.name}</p>
                                <input
                                  type="email"
                                  name="email"
                                  value={formData.email}
                                  onChange={handleChange}
                                  placeholder={emailInput.placeholder ?? emailInput.name}
                                  className={inputCls(!!emailError)}
                                />
                                {emailError && <p className="text-sm text-red-600 mt-1">{emailError}</p>}
                              </div>
                            )}

                            {/* TELEFON */}
                            {phoneInput && (
                              <div>
                                <p className="text-xs font-medium text-black/80 mb-1">{phoneInput.name}</p>
                                <input
                                  type="tel"
                                  name="phone"
                                  value={formData.phone}
                                  onChange={handleChange}
                                  placeholder={phoneInput.placeholder ?? phoneInput.name}
                                  className={inputCls(!!phoneError)}
                                />
                                {phoneError && <p className="text-sm text-red-600 mt-1">{phoneError}</p>}
                              </div>
                            )}

                            {/* ISMERETLEN TÍPUSÚ MEZŐK — generikusan renderelve */}
                            {inputs
                              .filter(i => fieldRole(i) === 'unknown')
                              .map((input, idx) => (
                                <div key={`unknown-${idx}`}>
                                  <p className="text-xs font-medium text-black/80 mb-1">{input.name}</p>
                                  <input
                                    type="text"
                                    name={`extra_${idx}`}
                                    placeholder={input.placeholder ?? input.name}
                                    className={inputCls(false)}
                                  />
                                </div>
                              ))}
                          </div>

                          <div className="space-y-4">
                            {/* SUBMIT GOMB */}
                            <motion.button
                              type="submit"
                              disabled={isSubmitting}
                              className="w-full bg-black text-white rounded-full py-4 font-semibold text-lg flex items-center justify-center disabled:opacity-50"
                              initial="rest"
                              whileHover="hover"
                              whileTap={{ scale: 0.98 }}
                            >
                              {isSubmitting ? (
                                <span className="animate-pulse">{messages.sending}</span>
                              ) : (
                                <motion.div className="overflow-hidden h-6">
                                  <motion.div className="flex flex-col" variants={wheelVariants}>
                                    <span>{submitInput?.name ?? (lang === 'hu' ? 'Üzenet küldése' : 'Send message')}</span>
                                    <span>{submitInput?.name ?? (lang === 'hu' ? 'Üzenet küldése' : 'Send message')}</span>
                                  </motion.div>
                                </motion.div>
                              )}
                            </motion.button>

                            {/* Állapotüzenet */}
                            {showAlert && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className={`relative rounded-xl px-5 py-4 text-sm text-center backdrop-blur-md border ${
                                  isSubmitting ? 'bg-yellow-50 border-yellow-300 text-yellow-800' : ''
                                } ${submitSuccess ? 'bg-green-50 border-green-300 text-green-800' : ''} ${
                                  submitError ? 'bg-red-50 border-red-300 text-red-800' : ''
                                }`}
                              >
                                <button
                                  onClick={() => setShowAlert(false)}
                                  type="button"
                                  className="absolute top-2 right-2 text-black/40 hover:text-black"
                                >
                                  <XIcon className="w-4 h-4" />
                                </button>
                                <div className="flex items-center justify-center space-x-2">
                                  {isSubmitting && <ClockIcon className="w-5 h-5" />}
                                  {submitSuccess && <CheckCircleIcon className="w-5 h-5" />}
                                  {submitError && <XCircleIcon className="w-5 h-5" />}
                                  <span>
                                    {isSubmitting && messages.sending}
                                    {submitSuccess && messages.success}
                                    {submitError && submitError}
                                  </span>
                                </div>
                              </motion.div>
                            )}

                            {/* Policy linkek */}
                            {filteredPolicyLinks.length > 0 ? (
                              <p className="text-xs text-black/60 text-left">
                                {policy_prefix}{' '}
                                {filteredPolicyLinks.map((link, index) => {
                                  const isLast       = index === filteredPolicyLinks.length - 1;
                                  const isSecondLast = index === filteredPolicyLinks.length - 2;
                                  const separator =
                                    filteredPolicyLinks.length === 1 ? ''
                                    : isLast ? ''
                                    : isSecondLast ? ` ${policy_and_word} `
                                    : ', ';
                                  const target =
                                    link.target === '_blank' || link.target === '_self'
                                      ? link.target
                                      : undefined;
                                  return (
                                    <React.Fragment key={`${link.URL}-${index}`}>
                                      <a
                                        href={link.URL!}
                                        target={target}
                                        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
                                        className="text-black font-semibold hover:underline underline-offset-2"
                                      >
                                        {link.text}
                                      </a>
                                      {!isLast && separator}
                                    </React.Fragment>
                                  );
                                })}
                                .
                              </p>
                            ) : (
                              <p className="text-xs text-black/60 text-center">
                                {lang === 'hu'
                                  ? 'Az űrlap elküldésével elfogadod az ÁSZF-et és az Adatkezelési tájékoztatót.'
                                  : 'By submitting this form you agree to our Terms of Service and Privacy Policy.'}
                              </p>
                            )}
                          </div>
                        </motion.div>
                        )}
                      </AnimatePresence>
                  </form>
                </div>

                {/* Copyright */}
                <div className="mt-4 text-left">
                  <p className="text-sm text-gray-100">{copyright}</p>
                </div>
              </div>
            </motion.div>

            {/* ── JOBB: szöveg + benefits + person card ── */}
            <motion.div
              className="order-1 lg:order-2"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex flex-col h-full rounded-2xl p-8 md:p-10 text-white">
                <motion.h2
                  className="text-5xl sm:text-6xl md:text-7xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  {section?.heading ?? (lang === 'hu' ? 'Beszéljünk a projektedről' : "Let's talk about your project")}
                </motion.h2>

                <motion.div
                  className="mb-10"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  {section?.sub_heading && (
                    <p className="text-xl mb-6 text-white/80">{section.sub_heading}</p>
                  )}

                  <div className="w-full h-px bg-white/10 my-8" />

                  {hasBenefits && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                      {benefits!.map((benefit, index) => (
                        <motion.div
                          key={`benefit-${index}`}
                          className="flex items-start space-x-4"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <div className="shrink-0">{renderBenefitIcon(benefit.icon || undefined)}</div>
                          <div>
                            <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                            {benefit.description && (
                              <p className="text-white/60 text-sm">{benefit.description}</p>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>

                {/* Person card */}
                {_person && (
                  <motion.div
                    className="mt-auto"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex space-x-1">
                      <div className="w-28 h-36 bg-white rounded-xl overflow-hidden shrink-0">
                        {personImgUrl ? (
                          <Image
                            src={personImgUrl}
                            alt={_person.name}
                            width={112}
                            height={144}
                            className="w-full h-full object-cover border-4 border-white/30 rounded-xl"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200" />
                        )}
                      </div>

                      <div className="bg-white text-black rounded-xl p-4 flex-grow max-w-[260px]">
                        {_person.role && (
                          <p className="text-sm font-semibold">{_person.role}</p>
                        )}
                        {_person.org && (
                          <p className="text-xs text-black/60">{_person.org}</p>
                        )}
                        <p className="text-xl font-semibold mb-3">{_person.name}</p>

                        <MotionLink
                          href={buttonHref}
                          target={buttonTarget}
                          rel={buttonTarget === '_blank' ? 'noopener noreferrer' : undefined}
                          onClick={handlePersonButtonClick}
                          className="inline-flex items-center bg-black text-white px-3 py-2 rounded-full text-xs font-semibold"
                          initial="rest"
                          whileHover="hover"
                          animate="rest"
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="overflow-hidden h-3 space-x-2">
                            <motion.div
                              className="flex flex-col leading-none"
                              variants={wheelVariants}
                            >
                              <span>{buttonLabel}</span>
                              <span>{buttonLabel}</span>
                            </motion.div>
                          </div>
                          <motion.div
                            className="w-2 h-2 ml-6 bg-white rounded-full"
                            variants={dotVariants}
                          />
                        </MotionLink>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>

          </div>
        </div>
      </section>
    </div>
  );
}
