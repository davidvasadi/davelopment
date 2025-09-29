
// ==========================
// ====== IMPORTOK ======
// ==========================
import { ArrowUpRightIcon } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { motion } from 'framer-motion';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
// import {
//   ExternalLink,

// } from 'lucide-react';

// SocialLink komponens
// Alternatív megjelenés 
// function SocialLink({ href, name }: { href: string; name: string }) {
//   return (
//     <a
//       href={href}
//       target="_blank"
//       rel="noopener noreferrer"
//       className="flex items-center justify-between group"
//     >
//       <span className="text-lg font-medium text-black group-hover:opacity-70 transition-opacity">
//         {name}
//       </span>
//       <ExternalLink size={16} className="text-black/30 group-hover:text-black/60 transition-colors" />
//     </a>
//   );
// }



// ==========================
// ====== FŐ KOMPONENS ======
// ==========================
export function Footer() {
  const { t } = useLanguage();

  // ==========================
  // ====== ANIMÁCIÓK ======
  // ==========================
  const wheelVariants = {
    rest: { y: '-50%' },
    hover: { y: '0%', transition: { duration: 0.3, ease: 'easeInOut' } },
  };

  const dotVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.4, transition: { duration: 0.4, ease: 'easeInOut' } },
  };

  // =============================
  // ====== ÁLLAPOTKEZELÉS ======
  // =============================
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { language } = useLanguage();

  
  // ====== DEBUG lang ======
  // console.log('Nyelv amit küldeni fogunk:', language); // ✅ ezt ellenőrizd

  // ===================================================
  // ====== INPUT MEZŐ VÁLTOZÁSÁNAK KEZELÉSE ======
  // ===================================================
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // ===============================================
  // ====== HÍRLEVÉL BEKÜLDÉSI LOGIKA ======
  // ===============================================
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError(null);

    try {
      const response = await fetch('http://localhost:1337/api/newsletters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: {
            name: formData.name,
            email: formData.email,
            source: 'footer',
            language: language,

            gdprAccepted: true,
            unsubscribed: false,
            confirmed: false,
            subscribedAt: new Date(),
          },
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result?.error?.message?.includes('must be unique')) {
          setSubmitError('Ezzel az email címmel már regisztráltál.');
        } else {
          setSubmitError('Hiba történt a feliratkozás során.');
        }
        return;
      }

      setSubmitSuccess(true);
      setFormData({ name: '', email: '' });
    } catch (err) {
      setSubmitError('Hálózati hiba történt. Próbáld újra később.');
    } finally {
      setSubmitting(false);
    }
  };

  // ===============================
  // ====== LÁBLÉC RENDERELÉS ======
  // ===============================
  return (
    <footer className="w-full">
      {/* ============================== */}
      {/* ====== HÍRLEVÉL ŰRLAP ====== */}
      {/* ============================== */}
      <div className="w-full bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">

            {/* ========= SZÖVEGES BLOKK ========= */}
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-medium text-black leading-tight max-w-xl">
                <span className="text-black/60">{t('help.intro.part1')}</span>{' '}
                <span className="text-black font-semibold">{t('help.intro.part2')}</span>
              </h2>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img src="https://davelopment.hu/assets/profile2-CtcR8s0t.jpeg" alt={t('help.name')} className="object-cover" />
                </div>
                <div>
                  <p className="font-semibold text-black">{t('help.name')}</p>
                  <p className="text-sm text-black/70">{t('help.role')}</p>
                </div>
              </div>
            </div>

            {/* ========= HÍRLEVÉL FORM ========= */}
            <div className="space-y-8">
              <h3 className="text-2xl font-semibold text-black">{t('newsletter.title')}</h3>
              <form className="space-y-6" onSubmit={handleSubmit}>
                {(['name', 'email'] as const).map((field) => (
                  <div key={field} className="space-y-2">
                    <label htmlFor={field} className="block text-sm text-black/80"></label>
                    <input
                      id={field}
                      type={field === 'email' ? 'email' : 'text'}
                      placeholder={t(`newsletter.${field}`)}
                      className="peer w-full bg-transparent border-none placeholder-gray-500 py-2 focus:outline-none"
                      value={formData[field]}
                      onChange={handleChange}
                      required
                    />
                    <div className="relative w-full h-[1px] bg-black/10 overflow-hidden group peer-focus:bg-black/40">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-black to-transparent"
                        initial={{ x: '-100%' }}
                        whileInView={{ x: '100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 1.5, ease: 'easeInOut' }}
                      />
                    </div>
                  </div>
                ))}

                {/* ========= KÜLDÉS GOMB ========= */}
                <motion.button
                  type="submit"
                  className="mt-6 bg-black text-white px-4 py-1 rounded-full inline-flex items-center space-x-2 overflow-hidden"
                  initial="rest"
                  whileHover="hover"
                  animate="rest"
                  disabled={submitting}
                >
                  <div className="overflow-hidden h-6">
                    <motion.div className="flex flex-col mr-4" variants={wheelVariants}>
                      <span>{submitting ? t('newsletter.sending') : t('newsletter.subscribe')}</span>
                      <span>{submitting ? t('newsletter.sending') : t('newsletter.subscribe')}</span>
                    </motion.div>
                  </div>
                  <motion.div className="w-2 h-2 bg-white rounded-full" variants={dotVariants} />
                </motion.button>

                {/* ======= VISSZAJELZÉSEK ======= */}
                {submitSuccess && <p className="text-green-600">{t('newsletter.successMessage')}</p>}
                {submitError && <p className="text-orange-400">{t('newsletter.submitError')}</p>}
              </form>

              <p className="text-sm text-black/60 mt-4">{t('newsletter.description')}</p>
            </div>
          </div>
        </div>
      </div>
      {/* // ============================
    // ========== FOOTER ==========
    // ============================ 
*/}
      {/* ========================= ELÉRHETŐSÉG ÉS NAVIGÁCIÓ ========================= */}
      <div className="w-full bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

            {/* ======== ELÉRHETŐSÉG RÉSZ ======== */}
            <div className="md:col-span-4 space-y-4">
              <PlusIcon className="w-6 h-6 text-gray-500 mb-10" />
              <a href="tel:+36303628377">
              <p className="text-lg">{t('header.phone')}</p>
              </a>
              <a
                href={`mailto:${t('header.email')}`}
                className="inline-flex items-center text-2xl font-medium border-b-2 border-black pb-1 hover:opacity-80 transition-opacity"
              >
                <span className="mr-1">+</span> {t('header.email')}
              </a>
            </div>

            {/* ======== NAVIGÁCIÓS LINKEK ======== */}
            <div className="md:col-span-4">
              <PlusIcon className="w-6 h-6 text-gray-500 mb-10" />
              <p className="text-sm font-basic text-gray-500 mb-4">{t('navigation.title')}</p>
              <ul className="space-y-3">
                <li><a href="/" className="text-xl font-medium hover:opacity-70 transition-opacity">{t('navigation.home')}</a></li>
                <li><a href="/studio" className="text-xl font-medium hover:opacity-70 transition-opacity">{t('navigation.studio')}</a></li>
                <li><a href="/projects" className="text-xl font-medium hover:opacity-70 transition-opacity">{t('navigation.projects')}</a></li>
                <li><a href="/blog" className="text-xl font-medium hover:opacity-70 transition-opacity">{t('navigation.blog')}</a></li>
              </ul>
            </div>

            {/* ======== SOCIAL LINKEK ======== */}
            <div className="md:col-span-4">
              <PlusIcon className="w-6 h-6 text-gray-500 mb-10" />
              <p className="text-sm font-basic text-gray-500 mb-4">{t('social.title')}</p>
              <ul className="space-y-3">
                <li>
                  <a href="https://facebook.hu" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-xl font-medium hover:opacity-70 transition-opacity">
                    {t('social.facebook')}<ArrowUpRightIcon className="ml-1 w-4 h-4" />
                  </a>
                </li>
                {/* Alternatív megjlenés */}
               {/* <SocialLink href="https://facebook.hu" name="Facebook" /> */}

                <li>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-xl font-medium hover:opacity-70 transition-opacity">
                    {t('social.instagram')}<ArrowUpRightIcon className="ml-1 w-4 h-4" />
                  </a>
                </li>
                <li>
                  <a href="https://reddit.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-xl font-medium hover:opacity-70 transition-opacity">
                    {t('social.reddit')}<ArrowUpRightIcon className="ml-1 w-4 h-4" />
                  </a>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* ======================= NAGY LOGÓ ÉS STUDIO FELIRAT ======================= */}
      <div className="w-full bg-gray-50 pb-20 text-right">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <h2 className="text-[40px] sm:text-[50px] md:text-7xl lg:text-8xl xl:text-9xl font-bold">
            [davelopment]<span className=" text-black font-normal rounded-full "><span className='font-semibold'>®</span></span>
          </h2>
          <p className="mt-2 text-1xl md:text-3xl xl:text-4xl font-bold ">Studio</p>
        </div>
      </div>

      {/* ========================== FEKETE ALSÓ SÁV ========================== */}
      <div className="w-full bg-black text-white py-14">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

            {/* ======== SZERZŐI JOG ======== */}
            <div className="md:col-span-4">
              <p className="text-sm text-white/80">{t('footer.copyright')}</p>
            </div>

            {/* ======== JOGI LINKEK ======== */}
            <div className="md:col-span-4 flex flex-col md:flex-row md:justify-center space-y-2 md:space-y-0 md:space-x-6">
              <a href="/legal/privacy-policy" className="text-sm text-white/80 hover:text-white transition-colors">{t('footer.privacyPolicy')}</a>
              <a href="/legal/terms-of-service" className="text-sm text-white/80 hover:text-white transition-colors">{t('footer.termsOfService')}</a>
            </div>

            {/* ======== KÉSZÍTŐ RÉSZ ======== */}
            <div className="md:col-span-4 flex flex-col md:flex-row md:justify-end items-start md:items-center space-y-2 md:space-y-0 md:space-x-6">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-white/60">{t('footer.createdBy')}</span>
                <div className="w-6 h-6 rounded-full overflow-hidden">
                  <img src="https://davelopment.hu/assets/profile2-CtcR8s0t.jpeg" alt="Creator" className=" object-cover" />
                </div>
                <span className="text-sm text-white">{t('footer.createdByName')}</span>
              </div>
            </div>

          </div>
        </div>
      </div>

    </footer>

  );
}
