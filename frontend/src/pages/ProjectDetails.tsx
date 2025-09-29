import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { BlurFooterEffect } from '../components/BlurFooterEffect';
import { PlusIcon } from 'lucide-react';
import enProjects from '../i18n/locales/en/projects.json';
import huProjects from '../i18n/locales/hu/projects.json';
import { useLanguage } from '../components/LanguageContext';
import { ContactSection } from '../components/ContactSection';

export function ProjectDetailsPage() {
  const { language } = useLanguage();
  const projectsData = language === 'hu' ? huProjects : enProjects;
  const { projectSlug } = useParams<{ projectSlug: string }>();
  const project = projectsData[projectSlug as keyof typeof projectsData];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [projectSlug]);

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Header />
      <main className="pt-24">
        {/* Intro Section */}
        <section className="w-full py-16 px-6 md:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-16"
            >
              <motion.h1
                className="text-6xl md:text-7xl lg:text-8xl font-bold"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {project.title}
              </motion.h1>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* Project Info */}
                <div className="space-y-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                      <PlusIcon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-sm font-medium">
                      {language === 'hu' ? 'Bevezetés' : 'Introduction'}
                    </p>
                  </div>
                  <p className="text-lg leading-relaxed">{project.description}</p>
                  {/* Project Details Table */}
                  <div className="space-y-4 border-t border-gray-200 pt-8">
                    <div className="flex justify-between py-4 border-b border-gray-100">
                      <span className="font-medium">
                        {language === 'hu' ? 'Év' : 'Year'}
                      </span>
                      <span>{project.year}</span>
                    </div>
                    <div className="flex justify-between py-4 border-b border-gray-100">
                      <span className="font-medium">
                        {language === 'hu' ? 'Iparág' : 'Industry'}
                      </span>
                      <span>{project.industry}</span>
                    </div>
                    <div className="flex justify-between py-4 border-b border-gray-100">
                      <span className="font-medium">
                        {language === 'hu' ? 'Munka jellege' : 'Scope of work'}
                      </span>
                      <div className="text-right">
                        {project.scope.map((item) => (
                          <div key={item} className="flex items-center justify-end">
                            <span className="mr-2">/</span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between py-4 border-b border-gray-100">
                      <span className="font-medium">
                        {language === 'hu' ? 'Időtartam' : 'Timeline'}
                      </span>
                      <span>{project.timeline}</span>
                    </div>
                  </div>
                </div>
                {/* Project Logo */}
                <div className="flex items-center justify-center">
                  <motion.img
                    src={project.logo}
                    alt={`${project.title} logo`}
                    className="h-12 object-contain"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Project Images */}
        <section className="w-full py-16 px-6 md:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {project.images.map((image, index) => (
                <motion.div
                  key={index}
                  className="aspect-[4/3] rounded-2xl overflow-hidden"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                >
                  <img
                    src={image}
                    alt={`${project.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Next Projects */}
        <section className="w-full py-16 px-6 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold">
                {language === 'hu' ? 'Következő projektek.' : 'Next projects.'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {project.nextProjects.map((nextProject) => (
                  <Link
                    key={nextProject.slug}
                    to={`/projects/${nextProject.slug}`}
                    className="group"
                  >
                    <div className="bg-white rounded-2xl p-6 mb-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold group-hover:opacity-70 transition-opacity">
                          {nextProject.name}
                        </h3>
                        <div className="text-sm opacity-60">/ {nextProject.year}</div>
                      </div>
                    </div>
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/50 transition-colors" />
                      <img
                        src={nextProject.image}
                        alt={nextProject.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-6 left-6">
                        <img
                          src={nextProject.logo}
                          alt={`${nextProject.name} logo`}
                          className="h-8 object-contain"
                        />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        {/* <section className="w-full py-16 px-6 md:px-8 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl p-8">
              <div className="space-y-8">
                <h3 className="text-3xl font-bold">
                  {language === 'hu' ? 'Van egy ötleted?' : 'Have a project'}{' '}
                  <span className="opacity-60">
                    {language === 'hu' ? 'Beszéljünk róla.' : 'in mind?'}
                  </span>
                </h3>
                <form className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {language === 'hu' ? 'Neved*' : 'Your name*'}
                    </label>
                    <input
                      type="text"
                      placeholder={language === 'hu' ? 'Kovács Anna' : 'John Doe'}
                      className="w-full p-4 bg-gray-50 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">E-mail*</label>
                    <input
                      type="email"
                      placeholder="hello@site.com"
                      className="w-full p-4 bg-gray-50 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {language === 'hu' ? 'Üzenet' : 'Message'}
                    </label>
                    <textarea
                      placeholder={language === 'hu' ? 'Üzeneted...' : 'Your message'}
                      className="w-full p-4 bg-gray-50 rounded-xl h-32"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-black text-white py-4 rounded-full font-medium"
                  >
                    {language === 'hu' ? 'Üzenet küldése' : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section> */}
       <ContactSection/> 
      </main>
      <Footer />
      <BlurFooterEffect />
    </div>
    
  );
}
