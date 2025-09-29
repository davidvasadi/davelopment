import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronDown, Contact } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { BlurFooterEffect } from '../components/BlurFooterEffect';
import { useLanguage } from '../components/LanguageContext';
import projectsEn from '../i18n/locales/en/projects.json';
import projectsHu from '../i18n/locales/hu/projects.json';
import { ContactSection } from '../components/ContactSection';
export function ProjectsPage() {
  const { t, language } = useLanguage();
  const projectsData = { en: projectsEn, hu: projectsHu };
  const projects = Object.values(projectsData[language]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === '' || project.categories.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const uniqueCategories = Array.from(new Set(projects.flatMap(project => project.categories))).sort();

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Header />
      <main className="w-full pt-24 pb-20">
        {/* Intro Section */}
        <section className="w-full py-12 md:py-16">
          <div className="max-w-9xl mx-auto px-6 md:px-8">
            <motion.div className="space-y-8" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end">
                <motion.h2 className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-black leading-none tracking-tight" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
                  {t('projects.title')}
                </motion.h2>
                <div className="mt-6 md:mt-0 space-y-2">
                  <p className="text-lg md:text-xl font-medium text-black tracking-tight">
                    (2016–25©)
                  </p>
                  <p className="text-lg max-w-md text-black">
                    {t('projects.description')}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Cards Section */}
        <section className="w-full py-8">
          <div className="max-w-9xl mx-auto px-6 md:px-8">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-8">
              {/* Search and Filter */}
              <div className="flex flex-wrap gap-1 md:gap-4 mb-8">
                <div className="relative w-full md:w-auto md:min-w-[300px] mb-2 md:mb-0">
                  <input type="text" placeholder={t('projects.search')} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full px-4 py-3.5 pr-10 bg-white rounded-xl border-0 text-gray-800 font-medium shadow-sm transition-all focus:outline-none" />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-700">
                    <Search size={16} />
                  </div>
                </div>
                <div className="relative w-full md:w-auto">
                  <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="w-full md:w-[154px] appearance-none px-4 py-3.5 pr-10 bg-white rounded-xl border-0 text-gray-800 font-medium shadow-sm transition-all focus:outline-none cursor-pointer">
                    <option value="">{t('projects.allCategories')}</option>
                    {uniqueCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-700 pointer-events-none">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>

              {/* Project Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProjects.map((project, index) => (
                  <motion.div key={project.slug} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 * index }} className="w-full">
                    <a href={`./projects/${project.slug}`} className="block w-full group">
                      <div className="bg-white rounded-2xl p-6 mb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-2xl md:text-3xl font-bold text-black mb-2 group-hover:opacity-70 transition-opacity">
                              {project.title}
                            </h3>
                            <div className="opacity-0 transform -translate-y-1/2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 mb-4 overflow-hidden h-0 group-hover:h-auto">
                              <div className="flex flex-wrap gap-3">
                                {project.categories.map(category => (
                                  <div key={category} className="inline-block">
                                    <span className="text-sm font-medium text-black">{category}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span className="text-xs font-medium text-gray-600 opacity-60 text-right">/</span>
                              <span className="text-xs font-medium text-gray-600 opacity-60 text-right">{project.year}</span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <motion.div className="w-3 h-3 rounded-full border border-gray-300" style={{ backgroundColor: '#E7E7EB' }} whileHover={{ backgroundColor: '#EF4444', borderColor: '#DC2626', scale: 1.1 }} transition={{ duration: 0.2 }} />
                            <motion.div className="w-3 h-3 rounded-full border border-gray-300" style={{ backgroundColor: '#E7E7EB' }} whileHover={{ backgroundColor: '#10B981', borderColor: '#059669', scale: 1.1 }} transition={{ duration: 0.2, delay: 0.05 }} />
                            <motion.div className="w-3 h-3 rounded-full border border-gray-300" style={{ backgroundColor: '#E7E7EB' }} whileHover={{ backgroundColor: '#F59E0B', borderColor: '#D97706', scale: 1.1 }} transition={{ duration: 0.2, delay: 0.1 }} />
                          </div>
                        </div>
                      </div>
                      <div className="relative bg-white rounded-2xl p-4 h-80 md:h-96 lg:h-[500px] overflow-hidden">
                        <div className="absolute top-6 left-6 z-30 w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:opacity-0 transition-opacity duration-300">
                          <img src={project.logo} alt={`${project.title} logo`} className="w-8 h-8 object-contain" />
                        </div>
                        <div className="relative w-full h-full rounded-2xl overflow-hidden">
                          <motion.div className="absolute inset-0 bg-black z-20 transition-opacity duration-300" initial={{ opacity: 0.15 }} whileHover={{ opacity: 0.8 }} />
                          <motion.div className="absolute inset-0 z-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="text-center">
                              <div className="flex items-center justify-center mb-4">
                                <img src={project.logo} alt={`${project.title} logo`} className="w-12 h-12 object-contain filter invert" />
                              </div>
                              <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
                                {project.title}
                              </h3>
                            </div>
                          </motion.div>
                          <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                      </div>
                    </a>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <ContactSection />
      <Footer />
      <BlurFooterEffect />
    </div>
  );
}

export default ProjectsPage;
