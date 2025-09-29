import { motion } from 'framer-motion';
import { PlusIcon } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { useLanguage } from '../components/LanguageContext';
import blogEn from '../i18n/locales/en/blog.json';
import blogHu from '../i18n/locales/hu/blog.json';
import { Link } from 'react-router-dom';

export function BlogPage() {
  const { language, t } = useLanguage();
  const posts = Object.values(language === 'hu' ? blogHu : blogEn);
  const [featured, second, third, ...others] = posts;

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Header />
      <main className="w-full pt-24 md:pt-32 pb-20">
        <div className="max-w-9xl mx-auto px-4 md:px-8">

          {/* Fejléc + leírás */}
          <motion.h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-black mb-16 md:mb-36"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
            {t('blogPage.title')}
          </motion.h1>
          <motion.div className="mb-16 flex flex-col md:flex-row items-start justify-between"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                <PlusIcon className="w-3 h-3 text-white" />
              </div>
              <p className="text-xs flex font-medium text-black">{t('blog.badge')}</p>
            </div>
            <div className="max-w-3xl flex flex-col md:flex-row space-x-2 md:space-x-20">
              <p className="text-3xl text-black font-normal indent-20">
                {t('blogPage.description')}
                <span className="text-gray-500 font-medium"> {t('blogPage.description2')}</span>
              </p>
              <p className="text-sm text-black/60 mt-4">{t('blogPage.subtitle')}</p>
            </div>
          </motion.div>

          {/* --- Fő poszt + 2 további poszt --- */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-1 mb-2">
            {/* FŐ POSZT - nagy, overlay fixen */}
            <motion.div className="lg:col-span-2 col-span-1 group relative"
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}>
              <Link to={featured.url} className="block bg-white rounded-2xl overflow-hidden h-full group">
                <div className="relative aspect-[4/3] w-full">
                  <img
                    src={featured.image}
                    alt={featured.title}
                    className="aspect-[3/3] object-cover transition-transform duration-300 group-hover:scale-105 group-hover:blur-[4px]"
                  />
                  {/* Fekete overlay - mindig látszik */}
                  <div className="absolute inset-0 bg-black/15 pointer-events-none transition-all duration-500"></div>
                  {/* Plus ikon */}
                  <div className="absolute top-6 right-6 w-8 h-8 bg-black rounded-full flex items-center justify-center group-hover:rotate-180 transition-transform duration-300">
                    <div className="w-3 h-0.5 bg-white"></div>
                    <div className="w-0.5 h-3 bg-white absolute"></div>
                  </div>
                  {/* Szövegek */}
                  <div className="absolute bottom-0 left-0 w-full px-6 py-2 md:p-8">
                    <p className="text-sm text-white/70 mb-4">{featured.date}</p>
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-white mb-4">{featured.title}</h2>
                    <p className="text-sm md:text-md text-white/80 mb-6 max-w-3xl">{featured.description}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
            {/* 2. és 3. poszt - kisebb, square, hoverre bal felső sarokba nő */}
            {[second, third].map((post, idx) => (
              <motion.div className="col-span-1 group flex flex-col" key={post.slug}
                initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 + idx * 0.05 }}>
                <Link to={post.url} className=" bg-white rounded-2xl  h-full flex flex-wrap">
                  <div className="relative aspect-[3/1] lg:aspect-square w-full  ">
                    <div className='p-4'>
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-28 h-28 rounded-xl  object-cover transition-transform duration-300 group-hover:scale-150 "
                        style={{ transformOrigin: '0% 0%' }}
                      />
                    </div>
                    <div className="absolute top-4 right-4 w-5 h-5 bg-black rounded-full flex items-center justify-center group-hover:rotate-180 transition-transform duration-300">
                      <div className="w-2 h-0.5 bg-white"></div>
                      <div className="w-0.5 h-2 bg-white absolute"></div>
                    </div>
                  </div>
                  <div className="p-6  flex-1 flex flex-col justify-end">
                    <p className="text-xs text-gray-400 font-medium transition-all duration-300 mt-3 group-hover:mt-4">{post.date}</p>
                    <h3 className="text-xl font-medium leading-tight transition-all duration-300 mt-6 group-hover:mt-3">{post.title}</h3>
                    <p className="text-sm text-black/60 transition-all duration-300 mt-6 group-hover:mt-5">{post.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* --- TÖBBI POSZT - kisebb, square, ugyanaz az animáció --- */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-1">
            {others.map((post, idx) => (
              <motion.div className="group" key={post.slug}
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.7 + idx * 0.07 }}>
                <Link to={post.url} className="block bg-white rounded-2xl  h-full">
                  <div className="relative aspect-[3/1] md:aspect-square w-full p-2 ">
                    <div className='p-4'>
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-28 h-28 rounded-xl object-cover transition-transform duration-300 group-hover:scale-150 "
                        style={{ transformOrigin: '0% 0%' }}
                      />
                    </div>
                    <div className="absolute top-4 right-4 w-5 h-5 bg-black rounded-full flex items-center justify-center group-hover:rotate-180 transition-transform duration-300">
                      <div className="w-2 h-0.5 bg-white"></div>
                      <div className="w-0.5 h-2 bg-white absolute"></div>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-end">
                    <p
                      className="text-xs text-gray-400 font-medium transition-all duration-300 mt-3 group-hover:mt-4"
                    >
                      {post.date}
                    </p>
                    <h3
                      className="text-xl font-medium leading-tight transition-all duration-300 mt-6 group-hover:mt-3"
                    >
                      {post.title}
                    </h3>
                    <p
                      className="text-sm text-black/60 transition-all duration-300 mt-6 group-hover:mt-5"
                    >
                      {post.description}
                    </p>
                  </div>

                </Link>
              </motion.div>
            ))}
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
