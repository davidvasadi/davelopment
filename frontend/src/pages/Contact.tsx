import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ExternalLink,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  XIcon,
} from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { BlurFooterEffect } from '../components/BlurFooterEffect';
import { useLanguage } from '../components/LanguageContext';

// Animációs variánsok
const wheelVariants = {
  rest: { y: '-50%' },
  hover: {
    y: '0%',
    transition: { duration: 0.3, ease: 'easeInOut' },
  },
};
  const dotVariants = { 
    rest: { scale: 1 }, 
    hover: { 
      scale: 1.1, 
      transition: 
      { 
        duration: 0.3, 
        ease: 'easeInOut' 
      } 
    } 
  };


// SocialLink komponens
function SocialLink({ href, name }: { href: string; name: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between group"
    >
      <span className="text-lg font-medium text-black group-hover:opacity-70 transition-opacity">
        {name}
      </span>
      <ExternalLink size={16} className="text-black/30 group-hover:text-black/60 transition-colors" />
    </a>
  );
}

export function ContactPage() {
  const { t } = useLanguage();

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [messageError, setMessageError] = useState<string | null>(null);

  // Validáció
  const validate = () => {
    let valid = true;
    setNameError(null);
    setEmailError(null);
    setMessageError(null);

    if (!formData.name.trim()) {
      setNameError('A név megadása kötelező.');
      valid = false;
    }
    if (!formData.email.trim()) {
      setEmailError('Az email megadása kötelező.');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setEmailError('Érvényes email címet adj meg.');
      valid = false;
    }
    if (!formData.message.trim()) {
      setMessageError('Az üzenet megadása kötelező.');
      valid = false;
    }

    return valid;
  };

  // Mezőváltozás
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Beküldés
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError(null);
    setShowAlert(true);

    try {
      const res = await fetch('http://localhost:1337/api/contact-sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: formData }),
      });

      if (!res.ok) {
        const errorBody = await res.json();
        console.error('Beküldési hiba:', errorBody);
        setSubmitError('Beküldés sikertelen. Próbáld újra.');
        return;
      }

      setSubmitSuccess(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error('Hálózati hiba:', err);
      setSubmitError('Hálózati hiba. Próbáld újra.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen">
      <Header />
      <main className="w-full pt-24 pb-20">
        <section className="w-full py-16 md:py-24">
          <div className="max-w-9xl mx-auto px-6 md:px-8">
            {/* Címsor */}
            <motion.h1
              className="text-6xl md:text-7xl lg:text-9xl font-bold text-black mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {t('contactPage.title')}
            </motion.h1>

            {/* Grid: bal oldal + jobb űrlap */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16">
              {/* Bal oszlop */}
              <motion.div
                className="space-y-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <p className="text-3xl text-black/60 indent-16">
                  <span className="text-black font-medium">{t('contactPage.titleAsk')}</span>{' '}
                  {t('contactPage.titleAskEnd')}
                </p>

                {/* Profil */}
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden">
                    <img
                      src="https://davelopment.hu/assets/profile2-CtcR8s0t.jpeg"
                      alt="David Vasadi"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-xl font-semibold">{t('contact.team.name')}</p>
                    <p className="text-sm text-black/80">{t('contact.team.role')}</p>
                  </div>
                </div>
              </motion.div>

              {/* Jobb oszlop - űrlap */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Név mező */}
                <div>
                  <label className="block mb-2 text-xs font-medium text-black">{t('contact.form.name')}</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t('contact.form.namePlaceholder')}
                    required
                    className="w-full px-0 py-3 border-0 border-b border-gray-300 text-gray-800 bg-transparent placeholder-gray-400 focus:outline-none focus:border-black"
                  />
                  {nameError && <p className="text-sm text-red-600 mt-1">{nameError}</p>}
                </div>

                {/* Email mező */}
                <div>
                  <label className="block mb-2 text-xs font-medium text-black">{t('contact.form.email')}</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t('contact.form.emailPlaceholder')}
                    required
                    className="w-full px-0 py-3 border-0 border-b border-gray-300 text-black bg-transparent placeholder-gray-400 focus:outline-none focus:border-black"
                  />
                  {emailError && <p className="text-sm text-red-600 mt-1">{emailError}</p>}
                </div>

                {/* Üzenet mező */}
                <div>
                  <label className="block mb-2 text-xs font-medium text-black">{t('contact.form.message')}</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder={t('contact.form.messagePlaceholder')}
                    required
                    className="w-full px-0 py-4 border-0 border-b border-gray-300 text-black bg-transparent placeholder-gray-400 focus:outline-none focus:border-black"
                  />
                  {messageError && <p className="text-sm text-red-600 mt-1">{messageError}</p>}
                </div>

                {/* Beküldés gomb */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className=" bg-black text-white px-4 py-2 rounded-full font-semibold text-sm hover:bg-gray-800 transition-colors flex items-center justify-center space-x-5"
                  initial="rest"
                  whileHover="hover"
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? (
                    <span className="animate-pulse">{t('contact.form.sending')}</span>
                  ) : (
                    <motion.div className="overflow-hidden h-5">
                      <motion.div className="flex flex-col" variants={wheelVariants}>
                        <span>{t('contact.form.send')}</span>
                        <span>{t('contact.form.send')}</span>
                      </motion.div>
                    </motion.div>
                  )}
                  <motion.div className="w-2 h-2 bg-white rounded-full" variants={dotVariants} />                                      
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
                        : submitSuccess
                        ? 'bg-green-50 border-green-300 text-green-800'
                        : submitError
                        ? 'bg-red-50 border-red-300 text-red-800'
                        : ''
                    }`}
                  >
                    <button
                      onClick={() => setShowAlert(false)}
                      className="absolute top-2 right-2 text-black/40 hover:text-black"
                    >
                      <XIcon className="w-4 h-4" />
                    </button>
                    <div className="flex items-center justify-center space-x-2">
                      {isSubmitting && <ClockIcon className="w-5 h-5" />}
                      {submitSuccess && <CheckCircleIcon className="w-5 h-5" />}
                      {submitError && <XCircleIcon className="w-5 h-5" />}
                      <span>
                        {isSubmitting && t('contact.form.sending')}
                        {submitSuccess && t('contact.form.success')}
                        {submitError && submitError}
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* Jogi nyilatkozat */}
                <p className="text-xs text-black/60 text-left">
                  {t('contact.form.terms')}{' '}
                  <a href="/legal/terms-of-service" className="text-black font-semibold hover:underline">
                    {t('contact.form.termsLink')}
                  </a>{' '}
                  {t('contact.form.and')}{' '}
                  <a href="/legal/privacy-policy" className="text-black font-semibold hover:underline">
                    {t('contact.form.privacyLink')}
                  </a>
                  {t('contact.form.period')}
                </p>
              </form>
            </div>

            {/* Kapcsolat elérhetőségek */}
            <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.8,
              delay: 0.4
            }}>

              {/* Contact Information */}
              <div className="mt-12 space-y-8">
                <div className="flex items-end space-x-2">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <div className="w-4 h-px bg-gray-400"></div>
                    <div className="h-4 w-px bg-gray-400 absolute"></div>
                  </div>
                </div>
                {/* Phone */}
                <div>
                  <a href="tel:+36303628377" className="text-lg font-medium text-black hover:opacity-70 transition-opacity">
                    (36) 30-362-8377
                  </a>
                </div>
                {/* Email */}
                <div>
                  <a href="mailto:hello@davelopment.com" className="group flex items-center space-x-4">
                    <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                      <div className="relative">
                        <div className="w-3 h-0.5 bg-white"></div>
                        <div className="w-0.5 h-3 bg-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-semibold text-black group-hover:opacity-70 transition-opacity">
                        hello@davelopment.hu
                      </div>
                      <div className="w-full h-px bg-black mt-1"></div>
                    </div>
                  </a>
                </div>
                {/* Social Links */}
                <div className="space-y-4 pt-4">
                  <SocialLink href="https://facebook.hu" name="Facebook" />
                  <SocialLink href="https://instagram.com" name="Instagram" />
                  {/* <SocialLink href="https://dribbble.com" name="Dribbble" /> */}
                  <SocialLink href="https://reddit.com" name="Reddit" />

                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
      <BlurFooterEffect />
    </div>
  );
}
