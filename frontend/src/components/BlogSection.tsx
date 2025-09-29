import { motion } from 'framer-motion';
import { PlusIcon } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import blogEn from '../i18n/locales/en/blog.json';
import blogHu from '../i18n/locales/hu/blog.json';
import { Link } from 'react-router-dom';


// Dátum stringek feldolgozása, hogy a magyar formátumot is kezelje
function parseDate(dateString: string): Date {
  // Ha ISO vagy angol, hagyjuk
  if (!dateString.includes('.') || !isNaN(Date.parse(dateString))) return new Date(dateString);

  // Magyar dátum: "2025. február 2."
  const monthMap: Record<string, string> = {
    január: '01',
    február: '02',
    március: '03',
    április: '04',
    május: '05',
    június: '06',
    július: '07',
    augusztus: '08',
    szeptember: '09',
    október: '10',
    november: '11',
    december: '12'
  };
  const match = dateString.match(/^(\d{4})\. ([a-záéíóöőúüű]+) (\d{1,2})\./i);
  if (!match) return new Date(NaN);
  const [, year, monthHu, day] = match;
  const month = monthMap[monthHu.toLowerCase()];
  return new Date(`${year}-${month}-${day.padStart(2, '0')}`);
}


export function BlogSection() {
  const { language, t } = useLanguage();
  const blogData = language === 'hu' ? blogHu : blogEn;
  const blogPosts = Object.values(blogData)
    .sort((a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime())
    .slice(0, 2);

  return (
    <section className="w-full bg-gray-50 py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <motion.div
          className="space-y-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-start space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-black rounded-full flex items-center justify-center">
                <PlusIcon className="w-2.5 h-2.5 text-white" />
              </div>
              <p className="text-xs text-gray-700">{t('blog.badge')}</p>
            </div>
          </div>
          {/* Header Section */}

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end space-y-8 md:space-y-0">

            {/* Title */}
            <motion.div
              className="max-w-3xl"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-black leading-tight tracking-tight">
                <span className="text-black">{t('blog.title.part1')} </span>
                <span className="text-black/60">{t('blog.title.part2')}</span>
              </h2>
            </motion.div>
            {/* Description and Button */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <p className="text-lg text-gray-700 leading-relaxed">
                {t('blog.description')}
              </p>
              <Link to
                ="/blog"
                className="inline-flex items-center space-x-3 bg-black text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-gray-800 transition-colors"
                // whileHover={{ scale: 1.05 }}
                // whileTap={{ scale: 0.95 }}
              >
                <span>{t('blog.seeAll')}</span>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </Link>
            </motion.div>
          </div>

          {/* Blog Posts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              {blogPosts.map((post, index) => (
                <motion.div
                  key={post.url}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="w-full"
                >
                  <Link to={post.url}
                    className="block bg-white rounded-2xl overflow-hidden h-full transition-transform hover:-translate-y-1"
                  >
                    <div className="relative h-56">
                      <div className="w-full h-full p-4">
                        <div className="w-full h-full rounded-xl overflow-hidden relative">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-4 right-4 w-8 h-8 bg-black rounded-full flex items-center justify-center">
                            <div className="w-3 h-0.5 bg-white"></div>
                            <div className="w-0.5 h-3 bg-white absolute"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 space-y-4">
                      <p className="text-xs text-black/60 font-medium">{post.date}</p>
                      <div className="space-y-2">
                        <h3 className="text-xl font-medium leading-tight">{post.title}</h3>
                        <p className="text-sm text-black/60">{post.description}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Featured visual */}
            <motion.div
              className="relative bg-black rounded-2xl overflow-hidden h-96 md:h-full"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              viewport={{ once: true }}
            >
              <div className="absolute inset-0">
                <img
                  src="https://framerusercontent.com/images/vCmb1SfBKGiUHUXvbQXzqPtmFxo.jpg"
                  alt="Person using a MacBook"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30"></div>
              </div>
              <div className="absolute top-6 left-6 flex items-center space-x-2">
                <p className="text-xl font-semibold text-white">[davelopment]®</p>
                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                  <div className="w-3 h-0.5 bg-black"></div>
                  <div className="w-0.5 h-3 bg-black absolute"></div>
                </div>
              </div>
              <div className="absolute bottom-6 right-6 text-right">
                <h3 className="text-4xl md:text-5xl font-bold text-white leading-none">
                  {t('blog.whatsNew')}
                </h3>
                <h3 className="text-4xl md:text-5xl font-bold text-white leading-none mt-2">
                  {t('blog.inDigital')}
                </h3>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
