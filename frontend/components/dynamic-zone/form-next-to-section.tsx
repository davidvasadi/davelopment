'use client';

import React, { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  XIcon,
  RotateCwIcon,
  StepForwardIcon,
} from 'lucide-react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { strapiImage } from '@/lib/strapi/strapiImage';

type FormInput = {
  type: 'text' | 'email' | 'textarea' | 'submit';
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
  copyright?: string;

  video?: Media;
  video_poster?: Media;

  benefits?: Benefit[] | null;

  policy_links?: PolicyLink[] | null;
  policy_prefix?: string | null;
  policy_and_word?: string | null;
};

const STRAPI_BASE_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ?? 'http://localhost:1337';

// Strapi media → abszolút URL
const toAbs = (m?: Media): string | undefined => {
  const raw = typeof m === 'string' ? m : m?.url || '';
  return raw ? strapiImage(raw) : undefined;
};

// ikon választó a Benefit ikon enum alapján
const renderBenefitIcon = (icon?: BenefitIcon | null) => {
  switch (icon) {
    case 'rotate':
      return <RotateCwIcon className="w-6 h-6 text-white mt-1" />;
    case 'step':
      return <StepForwardIcon className="w-6 h-6 text-white mt-1" />;
    case 'check':
      return <CheckCircleIcon className="w-6 h-6 text-white mt-1" />;
    case 'clock':
      return <ClockIcon className="w-6 h-6 text-white mt-1" />;
    default:
      return <CheckCircleIcon className="w-6 h-6 text-white mt-1" />;
  }
};

export function FormNextToSection({
  heading,
  sub_heading,
  form,
  section,
  social_media_icon_links,
  person_card,
  copyright,
  video,
  video_poster,
  benefits,
  policy_links,
  policy_prefix,
  policy_and_word,
}: FormNextToSectionProps) {
  // --- nyelv detektálása URL-ből (/hu vs /en) ---
  const pathname = usePathname();
  const lang: 'hu' | 'en' = pathname?.startsWith('/hu') ? 'hu' : 'en';

  const messages = lang === 'hu'
    ? {
        nameRequired: 'A név megadása kötelező.',
        emailRequired: 'Az email megadása kötelező.',
        emailInvalid: 'Érvényes email címet adj meg.',
        messageRequired: 'Az üzenet megadása kötelező.',
        submitFailed: 'Beküldés sikertelen. Próbáld újra.',
        networkError: 'Hálózati hiba. Próbáld újra.',
      }
    : {
        nameRequired: 'Your name is required.',
        emailRequired: 'E-mail is required.',
        emailInvalid: 'Please enter a valid e-mail address.',
        messageRequired: 'Message is required.',
        submitFailed: 'Submission failed. Please try again.',
        networkError: 'Network error. Please try again.',
      };

  // --- 1. lokális form state ---
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);

  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [messageError, setMessageError] = useState<string | null>(null);

  // --- 2. Strapi form mezők ---
  const nameInput = form?.inputs?.find((i) => i.type === 'text');
  const emailInput = form?.inputs?.find((i) => i.type === 'email');
  const messageInput = form?.inputs?.find((i) => i.type === 'textarea');
  const submitInput = form?.inputs?.find((i) => i.type === 'submit');

  // --- 3. Validáció ---
  const validate = () => {
    let valid = true;
    setNameError(null);
    setEmailError(null);
    setMessageError(null);

    if (!formData.name.trim()) {
      setNameError(messages.nameRequired);
      valid = false;
    }

    if (!formData.email.trim()) {
      setEmailError(messages.emailRequired);
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setEmailError(messages.emailInvalid);
      valid = false;
    }

    if (!formData.message.trim()) {
      setMessageError(messages.messageRequired);
      valid = false;
    }

    return valid;
  };

  // --- 4. Input change handler ---
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- 5. Submit handler -> Strapi contact-sections ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError(null);
    setShowAlert(true);

    try {
      const res = await fetch(`${STRAPI_BASE_URL}/api/contact-sections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: formData }),
      });

      if (!res.ok) {
        let errorBody: any = null;
        try {
          errorBody = await res.json();
          console.error('Beküldési hiba:', errorBody);
        } catch {
          // ignore
        }
        setSubmitError(messages.submitFailed);
        return;
      }

      setSubmitSuccess(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error('Beküldési hiba:', err);
      setSubmitError(messages.networkError);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- 6. Animációs variánsok ---
  const wheelVariants : Variants = {
    rest: { y: '-50%' },
    hover: {
      y: '0%',
      transition: { duration: 0.3, ease: 'easeInOut' },
    },
  };

  const dotVariants : Variants = {
    rest: { scale: 1 },
    hover: {
      scale: 1.1,
      transition: { duration: 0.3, ease: 'easeInOut' },
    },
  };

  // --- 7. Person card kép / gomb adatok ---
  const personImgUrl = toAbs(person_card?.image);

  const buttonCfg = person_card?.button || null;
  const buttonLabel = buttonCfg?.text || 'Kérdezz közvetlenül';
  const rawHrefFromButton = buttonCfg?.URL?.trim() || '';
  const rawEmail = (person_card?.email || '').trim();

  const buttonHref = (() => {
    if (rawHrefFromButton) {
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawHrefFromButton)) {
        return `mailto:${rawHrefFromButton}`;
      }
      return rawHrefFromButton;
    }
    if (rawEmail) {
      return rawEmail.startsWith('mailto:')
        ? rawEmail
        : `mailto:${rawEmail}`;
    }
    return 'mailto:hello@davelopment.com';
  })();

  const buttonTarget =
    buttonCfg?.target === '_blank' || buttonCfg?.target === '_self'
      ? buttonCfg.target
      : undefined;

  const handlePersonButtonClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    if (buttonHref.startsWith('#')) {
      e.preventDefault();
      const id = buttonHref.replace(/^#/, '');
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.hash = `#${id}`;
      }
    }
  };

  // --- 8. Dinamikus videó, mint a Hero-ban ---
  const videoUrl = toAbs(video);
  const videoPoster = toAbs(video_poster);

  const hasBenefits = !!benefits && benefits.length > 0;

  const policyLinks: PolicyLink[] = (policy_links ?? []).filter(
    (l): l is PolicyLink => !!l && !!l.text && !!l.URL,
  );

  return (
    <div className="px-0 md:px-2 ">
      <section
        id="contact"
        className="relative bg-gray-50 py-20  md:py-32 overflow-hidden md:rounded-3xl"
      >
        {/* Dinamikus háttérvideó Strapi-ból */}
        {videoUrl && (
          <video
            className="absolute inset-0 w-full h-full object-cover z-0"
            src={videoUrl}
            {...(videoPoster ? { poster: videoPoster } : {})}
            autoPlay
            loop
            muted
            playsInline
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-black/10 to-transparent z-0" />

        {/* Tartalom konténer */}
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* BAL: ŰRLAP */}
            <motion.div
              className="order-1 lg:order-1 px-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="flex flex-col h-full w-full sm:justify-self-center lg:max-w-md">
                <div className="bg-white backdrop-blur-md rounded-2xl p-8 md:p-10 shadow-lg flex-grow">
                  {/* Címsor */}
                  <div className="mb-4">
                    <p className="text-lg font-semibold mb-2 text-black/80">
                      [davelopment]®
                    </p>

                    <h2 className="text-3xl  font-bold mb-2">
                      <span className="text-black">{heading}</span>
                      {sub_heading && (
                        <span className="text-black/60"> {sub_heading}</span>
                      )}
                    </h2>
                  </div>

                  {/* Űrlap */}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Név */}
                    <div>
                      {nameInput?.name && (
                        <p className="text-xs font-medium text-black/80 mb-1">
                          {nameInput.name}
                        </p>
                      )}
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder={
                          nameInput?.placeholder ??
                          nameInput?.name ??
                          'Név'
                        }
                        className={`w-full px-4 py-3 rounded-xl bg-gray-50 text-black focus:outline-none focus:ring-2 ${
                          nameError
                            ? 'border border-red-500 ring-red-300'
                            : 'focus:ring-black/10'
                        }`}
                      />
                      {nameError && (
                        <p className="text-sm text-red-600 mt-1">
                          {nameError}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      {emailInput?.name && (
                        <p className="text-xs font-medium text-black/80 mb-1">
                          {emailInput.name}
                        </p>
                      )}
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder={
                          emailInput?.placeholder ??
                          emailInput?.name ??
                          'Email'
                        }
                        className={`w-full px-4 py-3 rounded-xl bg-gray-50 text-black focus:outline-none focus:ring-2 ${
                          emailError
                            ? 'border border-red-500 ring-red-300'
                            : 'focus:ring-black/10'
                        }`}
                      />
                      {emailError && (
                        <p className="text-sm text-red-600 mt-1">
                          {emailError}
                        </p>
                      )}
                    </div>

                    {/* Üzenet */}
                    <div>
                      {messageInput?.name && (
                        <p className="text-xs font-medium text-black/80 mb-1">
                          {messageInput.name}
                        </p>
                      )}
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={4}
                        placeholder={
                          messageInput?.placeholder ??
                          messageInput?.name ??
                          'Üzenet'
                        }
                        className={`w-full px-4 py-3 rounded-xl bg-gray-50 text-black focus:outline-none focus:ring-2 ${
                          messageError
                            ? 'border border-red-500 ring-red-300'
                            : 'focus:ring-black/10'
                        }`}
                      />
                      {messageError && (
                        <p className="text-sm text-red-600 mt-1">
                          {messageError}
                        </p>
                      )}
                    </div>

                    {/* Küldés gomb */}
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-black text-white rounded-full py-4 mt-2 font-semibold text-lg flex items-center justify-center disabled:opacity-50"
                      initial="rest"
                      whileHover="hover"
                      whileTap={{ scale: 0.98 }}
                    >
                      {isSubmitting ? (
                        <span className="animate-pulse">
                          Küldés folyamatban...
                        </span>
                      ) : (
                        <motion.div className="overflow-hidden h-6">
                          <motion.div
                            className="flex flex-col"
                            variants={wheelVariants}
                          >
                            <span>
                              {submitInput?.name ?? 'Üzenet küldése'}
                            </span>
                            <span>
                              {submitInput?.name ?? 'Üzenet küldése'}
                            </span>
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
                        className={`relative mt-6 rounded-xl px-5 py-4 text-sm text-center backdrop-blur-md border ${
                          isSubmitting
                            ? 'bg-yellow-50 border-yellow-300 text-yellow-800'
                            : ''
                        } ${
                          submitSuccess
                            ? 'bg-green-50 border-green-300 text-green-800'
                            : ''
                        } ${
                          submitError
                            ? 'bg-red-50 border-red-300 text-red-800'
                            : ''
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
                          {isSubmitting && (
                            <ClockIcon className="w-5 h-5" />
                          )}
                          {submitSuccess && (
                            <CheckCircleIcon className="w-5 h-5" />
                          )}
                          {submitError && (
                            <XCircleIcon className="w-5 h-5" />
                          )}
                          <span>
                            {isSubmitting && 'Küldés folyamatban...'}
                            {submitSuccess &&
                              'Köszönöm! Hamarosan jelentkezem.'}
                            {submitError && submitError}
                          </span>
                        </div>
                      </motion.div>
                    )}

                    {/* Jogi szöveg – dinamikus policy_links Strapi-ból */}
                    {policyLinks.length > 0 ? (
                      <p className="text-xs text-black/60 text-left">
                        {policy_prefix}{' '}
                        {policyLinks.map((link, index) => {
                          const isLast =
                            index === policyLinks.length - 1;
                          const isSecondLast =
                            index === policyLinks.length - 2;

                          const separator =
                            policyLinks.length === 1
                              ? ''
                              : isLast
                              ? ''
                              : isSecondLast
                              ? ` ${policy_and_word} `
                              : ', ';

                          const target =
                            link.target === '_blank' ||
                            link.target === '_self'
                              ? link.target
                              : undefined;

                          return (
                            <React.Fragment
                              key={`${link.URL}-${index}`}
                            >
                              <a
                                href={link.URL!}
                                target={target}
                                rel={
                                  target === '_blank'
                                    ? 'noopener noreferrer'
                                    : undefined
                                }
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
                        Az űrlap elküldésével elfogadod az ÁSZF-et és az
                        Adatkezelési tájékoztatót.
                      </p>
                    )}
                  </form>
                </div>

                {/* Lábléc copyright */}
                <div className="mt-4 text-left">
                  <p className="text-sm text-gray-100">
                    {copyright ?? '© [davelopment]®'}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* JOBB: szöveg + benefits + person card */}
            <motion.div
              className="order-1 lg:order-2"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex flex-col h-full rounded-2xl p-8 md:p-10 text-white">
                {/* Főcím */}
                <motion.h2
                  className="text-5xl md:text-8xl xl:text-8xl font-bold mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  {section?.heading ?? 'Beszéljünk a projektedről'}
                </motion.h2>

                {/* Leírás + BENEFITS LISTA Strapi-ból */}
                <motion.div
                  className="mb-10"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  {section?.sub_heading && (
                    <p className="text-xl mb-6 text-white/80">
                      {section.sub_heading}
                    </p>
                  )}

                  <div className="w-full h-px bg-white/10 my-8" />

                  {hasBenefits && (
                    <div className="space-y-6 md:space-y-0 md:flex md:space-x-2">
                      {benefits!.map((benefit, index) => (
                        <motion.div
                          key={`benefit-${index}`}
                          className="flex items-start space-x-4"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.6,
                            delay: 0.5 + index * 0.1,
                          }}
                          viewport={{ once: true }}
                        >
                          <div className="shrink-0">
                            {renderBenefitIcon(
                              benefit.icon || undefined,
                            )}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold mb-2">
                              {benefit.title}
                            </h3>
                            {benefit.description && (
                              <p className="text-white/60 text-sm">
                                {benefit.description}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>

                {/* Person card */}
                {person_card && (
                  <motion.div
                    className="mt-auto"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex space-x-1">
                      {/* Profilkép */}
                      <div className="w-28 h-36 bg-white rounded-xl overflow-hidden shrink-0">
                        {personImgUrl ? (
                          <Image
                            src={personImgUrl}
                            alt={person_card.name}
                            width={112}
                            height={144}
                            className="w-full h-full object-cover border-4 border-white/30 rounded-xl"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200" />
                        )}
                      </div>

                      {/* Név és gomb */}
                      <div className="bg-white text-black rounded-xl p-4 flex-grow max-w-[260px]">
                        {person_card.role && (
                          <p className="text-sm font-semibold">
                            {person_card.role}
                          </p>
                        )}
                        {person_card.org && (
                          <p className="text-xs text-black/60">
                            {person_card.org}
                          </p>
                        )}
                        <p className="text-xl font-semibold mb-3">
                          {person_card.name}
                        </p>

                        <motion.a
                          href={buttonHref}
                          target={buttonTarget}
                          rel={
                            buttonTarget === '_blank'
                              ? 'noopener noreferrer'
                              : undefined
                          }
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

                        </motion.a>
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
