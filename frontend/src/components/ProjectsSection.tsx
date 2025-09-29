import { motion,useScroll, useTransform } from 'framer-motion';
import { useLanguage } from './LanguageContext';
import projectsEn from '../i18n/locales/en/projects.json';
import projectsHu from '../i18n/locales/hu/projects.json';
import { useRef } from 'react';

export function ProjectsSection() {
  const { language } = useLanguage();

  const projectsData = {
    en: projectsEn,
    hu: projectsHu,
  };

  const projects = Object.values(projectsData[language]);


const projectsRef = useRef<HTMLDivElement>(null);

  // 3.3. Egyedi hook: visszaad transzform értékeket a parallax és zoom effektushoz
  const useSlowScroll = (ref: React.RefObject<HTMLElement>) => {
    const { scrollYProgress } = useScroll({
      target: ref,
      offset: ['start end', 'end start'],
    });
    const y = useTransform(scrollYProgress, [0, 1], [0,1], { clamp: false });
    return { y };
  };
  // const introAnimation = useSlowScroll(introRef);
  const projectsAnimation = useSlowScroll(projectsRef);

  return (
    <motion.section
     ref={projectsRef}
     style={ {y:projectsAnimation.y} }
     >
    <section className="w-full bg-gray-50 py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-3 md:px-8">
        <motion.div
          className="flex flex-col md:flex-row md:justify-between md:items-center mb-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div>
            <h2 className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-black leading-none tracking-tight">
              {language === 'hu'
                ? 'Projektek.'
                : 'Projects.'}
            
            </h2>
            <div className="my-2">
              <p className="text-2xl font-normal text-gray-500 tracking-tight text-left lg:text-right">
                ©2025
              </p>
            </div>
          </div>
          <div className="md:pl-8 md:w-1/3">
            <p className="text-gray-500 leading-relaxed">
              {language === 'hu'
                ? 'Segítettünk vállalkozásoknak különböző iparágakban elérni céljaikat. Íme néhány legújabb projektünk.'
                : 'We’ve helped businesses in various industries reach their goals. Here are some of our latest projects.'}
            </p>
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 xl:grid-cols-2 gap-1"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {projects.map((project, index) => (
            <motion.a
              key={project.slug}
              href={`./projects/${project.slug}`}
              className="group block"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-2xl px-4 py-2 mb-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <h3 className="text-lg md:text-lg font-bold text-black mr-1 group-hover:opacity-70 transition-opacity">
                      {project.title}
                    </h3>
                    <div className="text-sm font-medium text-gray-600 opacity-60">
                      / {project.year}
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full border border-gray-300 bg-gray-200 group-hover:bg-[#EF4444] group-hover:border-[#DC2626] transition-colors duration-300" />
                    <div className="w-2 h-2 rounded-full border border-gray-300 bg-gray-200 group-hover:bg-[#F59E0B] group-hover:border-[#D97706] transition-colors duration-300" />
                    <div className="w-2 h-2 rounded-full border border-gray-300 bg-gray-200 group-hover:bg-[#10B981] group-hover:border-[#059669] transition-colors duration-300" />
                  </div>
                </div>
                <div
                  className="opacity-0 transform -translate-y-1/2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 mt-2 overflow-hidden"
                  style={{ height: '0px', transitionProperty: 'opacity, transform' }}
                >
                  <div className="flex space-x-3">
                    {project.categories.map((cat) => (
                      <span key={cat} className="text-sm font-medium text-black">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="relative bg-white rounded-2xl overflow-hidden p-1">
                <div className="absolute inset-0 z-10 opacity-15" />
                <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center space-x-4">
                    <img
                      src={project.logo}
                      alt={`${project.title} logo`}
                      className="w-12 h-12 object-contain filter invert"
                    />
                    <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                      {project.title}
                    </h3>
                  </div>
                </div>
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 group-hover:blur-sm transition-all duration-500 rounded-2xl"
                />
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
    </motion.section>
  );
}
