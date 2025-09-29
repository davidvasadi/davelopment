// ————————————————————————————————————————————————————————————————
// 1. Külső csomagok importja
// ————————————————————————————————————————————————————————————————
import React, { useState, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';

// ————————————————————————————————————————————————————————————————
// 2. Saját komponensek és Kontextusok importja
// ————————————————————————————————————————————————————————————————
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { BlurFooterEffect } from './components/BlurFooterEffect';
import { LoadingScreen } from './components/LoadingScreen';
import { LanguageProvider } from './components/LanguageContext';

import { TransitionProvider, usePageTransition } from './components/TransitionContext';
import { PageTransitionOverlay } from './components/PageTransitionOverlay';

// ————————————————————————————————————————————————————————————————
// 3. Oldal-szintű szekciók importja
// (Homepage komponensek)
// ————————————————————————————————————————————————————————————————
import { HeroSection } from './components/HeroSection';
import { PartnersSection } from './components/PartnersSection';
import { ProjectsSection } from './components/ProjectsSection';
import { WhyChooseUsSection } from './components/WhyChooseUsSection';
import { ServicesSection } from './components/ServicesSection';
import { ShowreelSection } from './components/ShowreelSection';
import { PricingSection } from './components/PricingSection';
import { FAQSection } from './components/FAQSection';
import { BlogSection } from './components/BlogSection';
import { ContactSection } from './components/ContactSection';

// ————————————————————————————————————————————————————————————————
// 4. Oldal-komponensek importja
// (külön route-okon betöltődő oldalak)
// ————————————————————————————————————————————————————————————————
import { BlogPage } from './pages/Blog';
import { BlogPostPage } from './pages/BlogPost';
import { ProjectsPage } from './pages/Projects';
import { ProjectDetailsPage } from './pages/ProjectDetails';
import { ContactPage } from './pages/Contact';
import { StudioPage } from './pages/Studio';
import { TermsOfServicePage } from './legal/Terms';
import { PrivacyPolicyPage } from './legal/Privacy';
import { Unsubscribe } from './pages/Unsubscribe';

// ————————————————————————————————————————————————————————————————
// 5. PageTransition wrapper
//    A Route-ok közötti fade/slide animációkhoz
// ————————————————————————————————————————————————————————————————
const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 100 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -100 }}
    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

// ————————————————————————————————————————————————————————————————
// 6. AnimatedRoutes komponens
//    - Figyeli az útvonal változását
//    - Kirendereli a fekete overlay-t (PageTransitionOverlay)
//    - Lefuttatja a PageTransition animációt minden route cserénél
// ————————————————————————————————————————————————————————————————
const AnimatedRoutes: React.FC = () => {
  const location = useLocation();
  const { isNavigating, completeNavigation } = usePageTransition();

  useEffect(() => {
    if (!isNavigating) return;
    const timer = setTimeout(() => {
      completeNavigation();
    }, 300);
    return () => clearTimeout(timer);
  }, [isNavigating, completeNavigation]);

  return (
    <>
      <PageTransitionOverlay isNavigating={isNavigating} />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* — Home — */}
          <Route
            path="/"
            element={
              <PageTransition>
                <div className="w-full min-h-screen bg-gray-50">
                  <Header />
                  <HeroSection />
                  <PartnersSection />
                  <WhyChooseUsSection />
                  <ProjectsSection />
                  <ServicesSection />
                  <ShowreelSection />
                  <PricingSection />
                  <FAQSection />
                  <BlogSection />
                  <ContactSection />
                  <Footer />
                  <BlurFooterEffect />
                </div>
              </PageTransition>
            }
          />

          {/* — Blog list & post — */}
          <Route path="/blog" element={<PageTransition><BlogPage /></PageTransition>} />
          <Route path="/blog/:slug" element={<PageTransition><BlogPostPage /></PageTransition>} />

          {/* — Projektek list & detail — */}
          <Route path="/projects" element={<PageTransition><ProjectsPage /></PageTransition>} />
          <Route path="/projects/:projectSlug" element={<PageTransition><ProjectDetailsPage /></PageTransition>} />

          {/* — Kapcsolat & Stúdió — */}
          <Route path="/contact" element={<PageTransition><ContactPage /></PageTransition>} />
          <Route path="/studio" element={<PageTransition><StudioPage /></PageTransition>} />

          {/* — Jogi oldalak — */}
          <Route path="/legal/terms-of-service" element={<PageTransition><TermsOfServicePage /></PageTransition>} />
          <Route path="/legal/privacy-policy" element={<PageTransition><PrivacyPolicyPage /></PageTransition>} />
        
           {/* — Leiratkozás oldal — */}
          <Route path="/newsletter/unsubscribe/:token" element={<Unsubscribe/>} />
        
        </Routes>
      </AnimatePresence>
    </>
  );
};

// ————————————————————————————————————————————————————————————————
// 8. App komponens
//    - Betöltő képernyő kezelése
//    - Router, context, globális elemek
// ————————————————————————————————————————————————————————————————
export function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    setInitialLoad(false);
  };

  if (isLoading && initialLoad && window.location.pathname === '/') {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }
// console.log('✅ Teljes env:', import.meta.env);
// console.log('✅ API URL:', import.meta.env.VITE_API_URL);

  return (
    <HelmetProvider>
      <LanguageProvider>
        <BrowserRouter>
          <ScrollToTop />
          <TransitionProvider>
            <AnimatedRoutes />
            <BlurFooterEffect />
          </TransitionProvider>
        </BrowserRouter>
      </LanguageProvider>
    </HelmetProvider>
  );
}
