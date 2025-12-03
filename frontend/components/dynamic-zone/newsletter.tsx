// frontend/components/dynamic-zone/newsletter.tsx
'use client';

import React, { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { strapiImage } from '@/lib/strapi/strapiImage';

// --- HELPER: Strapi media → abszolút URL ---
const toAbs = (m?: any): string | undefined => {
  if (!m) return undefined;
  if (typeof m === 'string') return strapiImage(m);
  if (m?.url) return strapiImage(m.url);
  if (m?.data?.attributes?.url) return strapiImage(m.data.attributes.url);
  if (m?.attributes?.url) return strapiImage(m.attributes.url);
  return undefined;
};

type NewsletterInput = {
  type: string; // 'text' | 'email' | 'button' stb.
  name: string;
  placeholder?: string | null;
};

type NewsletterForm = {
  inputs?: NewsletterInput[];
};

type NewsletterProps = {
  id?: number;
  heading_left?: string | null;
  heading_right?: string | null;
  title?: string | null;
  description?: string | null;
  profile_name?: string | null;
  profile_role?: string | null;
  profile_image?: any;
  source?: string | null;
  form?: NewsletterForm;
  locale: string; // DynamicZoneManager-től jön
};

export const Newsletter: React.FC<NewsletterProps> = ({
  heading_left,
  heading_right,
  title,
  description,
  profile_name,
  profile_role,
  profile_image,
  source,
  form,
  locale,
}) => {
  const isHu = locale?.toLowerCase().startsWith('hu');

  // ===== FORM STRAPI-BÓL =====
  const inputs = form?.inputs ?? [];

  const textInputs = inputs.filter(
    (input) => input.type !== 'button'
  );

  const buttonInput = inputs.find((input) => input.type === 'button');

  const buttonLabel =
    buttonInput?.placeholder || (isHu ? 'Feliratkozás' : 'Subscribe');

  const buttonSending = isHu ? 'Küldés...' : 'Sending...';

  // ===== ÜZENETEK (egyelőre kódból, mert erre nincs fielded) =====
  const successMessage = isHu
    ? 'Sikeres feliratkozás!'
    : 'You have successfully subscribed.';

  const duplicateError = isHu
    ? 'Ezzel az email címmel már regisztráltál.'
    : 'You are already subscribed with this email.';

  const genericError = isHu
    ? 'Hiba történt a feliratkozás közben.'
    : 'Something went wrong while subscribing.';

  const networkError = isHu
    ? 'Hálózati hiba történt. Próbáld újra később.'
    : 'Network error. Please try again later.';

  // ===== STATE =====
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // ===== ANIMÁCIÓK =====
  const wheelVariants: Variants = {
    rest: { y: '-50%' },
    hover: { y: '0%', transition: { duration: 0.3, ease: 'easeInOut' } },
  };

  const dotVariants: Variants = {
    rest: { scale: 1 },
    hover: { scale: 1.4, transition: { duration: 0.4, ease: 'easeInOut' } },
  };

  // ===== INPUT HANDLER =====
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // ===== SUBMIT =====
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError(null);

    // a Newsletter collection a 'name' + 'email' mezőket várja
    const nameValue = formData['name'] ?? '';
    const emailValue = formData['email'] ?? '';

    try {
      const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_STRAPI_URL ?? '';

const res = await fetch(`${API_URL}/api/newsletters`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    data: {
      name: nameValue,
      email: emailValue,
      language: locale,
      source: source || 'footer',
      
    },
  }),
});


      const result = await res.json();

      if (!res.ok) {
        const isUniqueError =
          typeof result?.error?.message === 'string' &&
          result.error.message.toLowerCase().includes('unique');

        if (isUniqueError) {
          setSubmitError(duplicateError);
        } else {
          setSubmitError(genericError);
        }
        return;
      }

      setSubmitSuccess(true);
      setFormData({});
    } catch (err) {
      setSubmitError(networkError);
    } finally {
      setSubmitting(false);
    }
  };

  // ===== PROFIL KÉP =====
  const profileImgUrl =
    toAbs(profile_image) ??
    'https://davelopment.hu/assets/profile2-CtcR8s0t.jpeg';

  // ===== RENDER =====
  return (
    <section className="w-full py-20">
      <div className="max-w-9xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* SZÖVEGES BLOKK */}
          <div className="space-y-8">
            <h2 className="text-2xl md:text-3xl font-medium text-black  indent-20  max-w-xl">
              <span className="text-black/60">{heading_left}</span>{' '}
              <span className="text-black font-semibold">{heading_right}</span>
            </h2>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <img
                  src={profileImgUrl}
                  alt={profile_name || ''}
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-semibold text-black">{profile_name}</p>
                <p className="text-sm text-black/70">{profile_role}</p>
              </div>
            </div>
          </div>

          {/* HÍRLEVÉL FORM */}
          <div className="space-y-8">
            <h3 className="text-2xl font-semibold text-black">
              {title || (isHu ? 'Hírlevél' : 'Newsletter')}
            </h3>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {textInputs.map((input) => (
                <div key={input.name} className="space-y-2 text-black">
                  <label
                    htmlFor={input.name}
                    className="block text-sm text-black"
                  ></label>
                  <input
                    id={input.name}
                    type={input.type === 'email' ? 'email' : 'text'}
                    placeholder={input.placeholder || ''}
                    className="peer w-full bg-transparent border-none placeholder-gray-500 py-2 focus:outline-none"
                    value={formData[input.name] ?? ''}
                    onChange={handleChange}
                    required
                  />
                  <div className="relative w-full h-[1px] bg-black/10 overflow-hidden group peer-focus:bg-black/40">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-black to-transparent"
                      initial={{ x: '-100%' }}
                      whileInView={{ x: '100%' }}
                      transition={{ duration: 1.5, ease: 'easeInOut' }}
                    />
                  </div>
                </div>
              ))}

              <motion.button
                type="submit"
                className="mt-6 bg-black text-white font-semibold px-4 py-1 rounded-full inline-flex items-center space-x-2 overflow-hidden"
                initial="rest"
                whileHover="hover"
                animate="rest"
                disabled={submitting}
              >
                <div className="overflow-hidden h-6">
                  <motion.div
                    className="flex flex-col mr-4"
                    variants={wheelVariants}
                  >
                    <span>
                      {submitting ? buttonSending : buttonLabel}
                    </span>
                    <span>
                      {submitting ? buttonSending : buttonLabel}
                    </span>
                  </motion.div>
                </div>
                <motion.div
                  className="w-2 h-2 rounded-full bg-white"
                  variants={dotVariants}
                />
              </motion.button>

              {submitSuccess && (
                <p className="text-green-600">{successMessage}</p>
              )}
              {submitError && (
                <p className="text-orange-400">{submitError}</p>
              )}
            </form>

            <p className="text-sm text-black/60 mt-4">{description}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
