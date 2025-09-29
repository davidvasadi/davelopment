// ————————————————————————————————————————————————
// 1. Alap csomagok és komponensek importálása
//    - React, useState
//    - Framer Motion animációk
//    - Ikonok (Lucide)
// ————————————————————————————————————————————————
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  RotateCwIcon,
  StepForwardIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  XIcon,
} from 'lucide-react';

// ————————————————————————————————————————————————
// 2. Saját hook-ok és assetek importálása
//    - useLanguage (lokalizáció)
//    - heroVideo (háttér videó)
//    - useClearHashOnExit (hash tisztítás)
// ————————————————————————————————————————————————
import { useLanguage } from './LanguageContext';
import heroVideo from '../assets/videos/hero.mp4';
import { useClearHashOnExit } from '../types/useClearHashOnExit';

// ————————————————————————————————————————————————
// 3. ContactSection komponens definíciója
// ————————————————————————————————————————————————
export function ContactSection() {
  // — Lokális nyelvkezelés
  const { t, language } = useLanguage();
  const anchorId = language === 'hu' ? 'kapcsolat' : 'contact';

  // ———————————————————————————————————————
  // 4. Állapotok definiálása
  //    - formData: űrlap adatok
  //    - isSubmitting: küldés folyamatban
  //    - submitSuccess: sikeres küldés jelzése
  //    - submitError: hibaüzenet
  //    - showAlert: állapotüzenet megjelenítése
  //    - nameError, emailError, messageError: mezőspecifikus hibák
  // ———————————————————————————————————————
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [messageError, setMessageError] = useState<string | null>(null);

  // ———————————————————————————————————————
  // 5. Validációs függvény
  //    - Ellenőrzi a mezők kitöltöttségét és formátumát
  // ———————————————————————————————————————
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

  // ———————————————————————————————————————
  // 6. Mezőváltozás kezelő
  //    - Átadja az új értékeket az állapotnak
  // ———————————————————————————————————————
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ———————————————————————————————————————
  // 7. Beküldés kezelő
  //    - Validálás, POST kérés Strapi API-hoz
  //    - Hiba- és sikertörténetek kezelése
  // ———————————————————————————————————————
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError(null);
    setShowAlert(true);
// console.log('📨 handleSubmit elindult');

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
      console.error('Beküldési hiba:', err);
      setSubmitError('Hálózati hiba. Próbáld újra.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ———————————————————————————————————————
  // 8. Egyéb hook: hash eltávolítása kilépéskor
  // ———————————————————————————————————————
  useClearHashOnExit(anchorId);

  // ———————————————————————————————————————
  // 9. Animációs beállítások (Framer Motion)
  //    - Variánsok a gomb animációhoz
  // ———————————————————————————————————————
  const wheelVariants = { rest: { y: '-50%' }, hover: { y: '0%', transition: { duration: 0.3, ease: 'easeInOut' } } };
  const dotVariants = { rest: { scale: 1 }, hover: { scale: 1.1, transition: { duration: 0.3, ease: 'easeInOut' } } };

  // ———————————————————————————————————————
  // 10. JSX markup
  // ———————————————————————————————————————
  return (
    <section id={anchorId} className="relative bg-gray-50 py-20 px-5 md:py-32 overflow-hidden">
      {/* Háttér videó */}
      <video className="absolute inset-0 w-full h-full object-cover z-0" src={heroVideo} autoPlay loop muted playsInline />

      {/* Tartalom konténer */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* — BAL OLDAL: ŰRLAP — */}
          <motion.div className="order-2 lg:order-1" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }}>
            <div className="flex flex-col h-full max-w-xl sm:justify-self-center lg:max-w-xl">
              <div className="bg-white backdrop-blur-md rounded-2xl p-8 md:p-10 shadow-lg flex-grow">
                {/* Címsor */}
                <div className="mb-8">
                  <p className="text-xl font-semibold mb-2">[davelopment]®</p>
                  <h2 className="text-4xl md:text-5xl font-bold text-black mb-2">
                    {t('contact.title')} <span className="text-black/60">{t('contact.titleHighlight')}</span>
                  </h2>
                </div>

                {/* Űrlap mezők és logika */}
                <form onSubmit={handleSubmit} className="space-y-6">

                  {/* Név mező */}
                  <div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t('contact.form.namePlaceholder')}
                      className={`w-full px-4 py-3 rounded-xl bg-gray-50 text-black focus:outline-none focus:ring-2 ${nameError ? 'border border-red-500 ring-red-300' : 'focus:ring-black/10'}`}
                    />
                    {nameError && <p className="text-sm text-red-600 mt-1">{nameError}</p>}
                  </div>

                  {/* Email mező */}
                  <div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={t('contact.form.emailPlaceholder')}
                      className={`w-full px-4 py-3 rounded-xl bg-gray-50 text-black focus:outline-none focus:ring-2 ${emailError ? 'border border-red-500 ring-red-300' : 'focus:ring-black/10'}`}
                    />
                    {emailError && <p className="text-sm text-red-600 mt-1">{emailError}</p>}
                  </div>

                  {/* Üzenet mező */}
                  <div>
                    <input
                      type="text"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder={t('contact.form.messagePlaceholder')}
                      className={`w-full px-4 py-3 rounded-xl bg-gray-50 text-black focus:outline-none focus:ring-2 ${messageError ? 'border border-red-500 ring-red-300' : 'focus:ring-black/10'}`}
                    />
                    {messageError && <p className="text-sm text-red-600 mt-1">{messageError}</p>}
                  </div>

                  {/* — Küldés gomb animációval és tiltással küldés közben — */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-black text-white rounded-full py-4 mt-2 font-semibold text-lg flex items-center justify-center disabled:opacity-50"
                    initial="rest"
                    whileHover="hover"
                    whileTap={{ scale: 0.98 }}
                  >
                    {isSubmitting ? (
                      <span className="animate-pulse">{t('contact.form.sending')}</span>
                    ) : (
                      <motion.div className="overflow-hidden h-6">
                        <motion.div className="flex flex-col" variants={wheelVariants}>
                          <span>{t('contact.form.send')}</span>
                          <span>{t('contact.form.send')}</span>
                        </motion.div>
                      </motion.div>
                    )}
                  </motion.button>

                  {/* — Állapotüzenet: ikonok + szöveg */}
                  {showAlert && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`relative mt-6 rounded-xl px-5 py-4 text-sm text-center backdrop-blur-md border ${isSubmitting ? 'bg-yellow-50 border-yellow-300 text-yellow-800' : ''} ${submitSuccess ? 'bg-green-50 border-green-300 text-green-800' : ''} ${submitError ? 'bg-red-50 border-red-300 text-red-800' : ''}`}>
                      <button onClick={() => setShowAlert(false)} className="absolute top-2 right-2 text-black/40 hover:text-black">
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

                  {/* Jogi információ */}
                  <p className="text-xs text-black/60 text-center">
                    {t('contact.form.terms')} <a href="/legal/terms-of-service" className="text-black font-semibold hover:underline">{t('contact.form.termsLink')}</a> {t('contact.form.and')} <a href="/legal/privacy-policy" className="text-black font-semibold hover:underline">{t('contact.form.privacyLink')}</a>{t('contact.form.period')}
                  </p>
                </form>
              </div>

              {/* Lábléc copyright */}
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-100">{t('footer.copyright')}</p>
              </div>
            </div>
          </motion.div>

          {/* ——————————————————————————————— */}
          {/* 5.2. Jobb oszlop: leírás + előnyök + csapattag */}
          {/* ——————————————————————————————— */}
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
                className="text-5xl md:text-7xl xl:text-8xl font-bold mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                {t('contact.letsTalk')}
              </motion.h2>

              {/* Leírás + előnyök listája */}
              <motion.div className="mb-10" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} viewport={{ once: true }}>
                <p className="text-xl mb-6">
                  <span className="text-white">{t('contact.projectDescription.part1')}</span>
                  <span className="text-white/70">{t('contact.projectDescription.part2')}</span>
                </p>

                <div className="w-full h-px bg-white/10 my-8" />

                {/* Előny 1 */}
                <motion.div className="flex items-start space-x-4" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.5 }} viewport={{ once: true }}>
                  <RotateCwIcon className="w-6 h-6 text-white mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{t('contact.benefits.response.title')}</h3>
                    <p className="text-white/60 text-sm">{t('contact.benefits.response.description')}</p>
                  </div>
                </motion.div>

                {/* Előny 2 */}
                <motion.div className="flex items-start space-x-4" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.6 }} viewport={{ once: true }}>
                  <StepForwardIcon className="w-6 h-6 text-white mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{t('contact.benefits.steps.title')}</h3>
                    <p className="text-white/60 text-sm">{t('contact.benefits.steps.description')}</p>
                  </div>
                </motion.div>
              </motion.div>

              {/* Csapattag kártya és email link */}
              <motion.div className="mt-auto" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.7 }} viewport={{ once: true }}>
                <div className="flex space-x-4">
                  {/* Profilkép */}
                  <div className="w-28 h-36 bg-white rounded-xl overflow-hidden">
                    <img src="https://davelopment.hu/assets/profile2-CtcR8s0t.jpeg" alt="David Vasadi" className="w-full h-full object-cover" />
                  </div>

                  {/* Név és gomb */}
                  <div className="bg-white text-black rounded-xl p-4 flex-grow max-w-[250px]">
                    <p className="text-sm font-semibold">{t('contact.team.role')}</p>
                    <p className="text-xs text-black/60">{t('contact.team.at')} {t('contact.team.company')}</p>
                    <p className="text-xl font-semibold mb-3">{t('contact.team.name')}</p>

                    {/* Ask directly gomb */}
                    <motion.a href="mailto:hello@davelopment.com" className="inline-flex items-center bg-black text-white px-4 py-2 rounded-full text-xs font-semibold" initial="rest" whileHover="hover" animate="rest" whileTap={{ scale: 0.98 }}>
                      <div className="overflow-hidden h-3 space-x-2">
                        <motion.div className="flex flex-col leading-none" variants={wheelVariants}>
                          <span>{t('contact.team.askDirectly')}</span>
                          <span>{t('contact.team.askDirectly')}</span>
                        </motion.div>
                      </div>
                      <motion.div className="w-1 h-1 m-1 bg-white rounded-full" variants={dotVariants} />
                      <motion.div className="w-1 h-1 bg-white rounded-full" variants={dotVariants} />
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
