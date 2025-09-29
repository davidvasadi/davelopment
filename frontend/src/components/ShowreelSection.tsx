import { motion } from 'framer-motion';
import { PlusIcon, PlayIcon } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import type { AboutStep } from '../types'; // opcionális típusdefiníció

export function ShowreelSection() {
  const { t } = useLanguage();

  const steps = t<AboutStep[]>('aboutUs.steps');

  return (
    <section className="w-full bg-gray-50 py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <motion.div
          className="space-y-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
        >
          {/* Header Section */}
          <div className="space-y-8">
            <motion.div
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center">
                <PlusIcon className="w-3 h-3 text-white" />
              </div>
              <p className="text-sm font-medium text-black">{t('aboutUs.badge')}</p>
            </motion.div>

            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <p className="text-xl font-semibold text-black">[davelopment]®</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-black leading-tight tracking-tight">
                  <span className="text-black">{t('aboutUs.title')} </span>
                  <span className="text-black/60">{t('aboutUs.titleGray')}</span>
                </h2>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
              >
                <p className="text-lg text-gray-700 leading-relaxed max-w-2xl">
                  {t('aboutUs.description')}
                </p>
              </motion.div>
            </div>
          </div>

          {/* Steps Section */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            viewport={{ once: true }}
          >
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                className="bg-white rounded-2xl p-6 space-y-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4].map(dot => (
                      <div
                        key={dot}
                        className={`w-3 h-3 rounded-full ${dot <= step.progress ? 'bg-black' : 'bg-gray-300'
                          }`}
                      />
                    ))}
                  </div>
                  <div className="text-xs font-semibold text-black/50">
                    {step.number}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden">
                    <img src={step.image} alt={step.title} className="w-full h-full object-cover" />
                  </div>
                  <p className="text-sm font-medium text-black/60 leading-relaxed">
                    {step.title}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Showreel Section - nem kell fordítani, de maradhat */}
          {/* <motion.div
            className="relative bg-black rounded-3xl overflow-hidden h-96 md:h-[500px] lg:h-[600px]"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0">
              <img
                src="https://framerusercontent.com/images/cWKPopujkJqclchyOL1bYOiZDs.jpg"
                alt="Showreel background"
                className="w-full h-full object-cover"
                style={{
                  transform: 'perspective(1200px) translateY(-220px) scale(1.2)',
                  filter: 'blur(0px)',
                }}
              />
              <div className="absolute inset-0 bg-black/40" />
            </div>

            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage:
                  'url("https://framerusercontent.com/images/rR6HYXBrMmX4cRpXfXUOvpvpB0.png")',
                backgroundSize: '400% 400%',
                transform: 'translateX(-8.4%) translateY(-4%)',
              }}
            />

            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              viewport={{ once: true }}
            >
              <motion.button
                className="group flex items-center space-x-6 bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="w-16 h-16 bg-white rounded-full flex items-center justify-center group-hover:bg-gray-100 transition-colors"
                  whileHover={{ rotate: 90 }}
                  transition={{ duration: 0.3 }}
                >
                  <PlayIcon className="w-6 h-6 text-black ml-1" />
                </motion.div>
                <div className="text-left">
                  <div className="text-xl font-semibold text-white mb-1">
                    Watch showreel
                  </div>
                  <div className="text-sm text-white/60">(2016-25©)</div>
                </div>
              </motion.button>
            </motion.div>
          </motion.div> */}
        </motion.div>
      </div>
    </section>
  );
}
