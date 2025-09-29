import React, { useEffect, useState } from 'react';
import { useLanguage } from './LanguageContext';
import { usePageTransition } from './TransitionContext';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMenuItems, setShowMenuItems] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const { language, toggleLanguage, t } = useLanguage();
  const { startNavigation } = usePageTransition();

  // Az összes menüpont (mobil overlay-hez)
  const allNavItems = [
    { nameKey: 'navigation.home', path: '/' },
    { nameKey: 'navigation.studio', path: '/studio' },
    { nameKey: 'navigation.projects', path: '/projects' },
    { nameKey: 'navigation.blog', path: '/blog' },
    { nameKey: 'navigation.contact', path: '/contact' },
  ];

  // Inline (desktop és nagyobb) menüpontok: Home nélkül
  const inlineNavItems = allNavItems.filter(item => item.nameKey !== 'navigation.home');

  const toggleMenu = () => {
    if (!isMenuOpen) {
      setIsMenuOpen(true);
      setIsClosing(false);
      setTimeout(() => setShowMenuItems(true), 100);
      document.body.style.overflow = 'hidden';
    } else {
      setIsClosing(true);
      setShowMenuItems(false);
      setTimeout(() => {
        setIsMenuOpen(false);
        setIsClosing(false);
        document.body.style.overflow = 'unset';
      }, 300);
    }
  };

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    const currentPath = window.location.pathname;
    const direction = path.length > currentPath.length ? 1 : -1;
    setIsClosing(true);
    setShowMenuItems(false);
    startNavigation(path, direction);
    setTimeout(() => {
      setIsMenuOpen(false);
      setIsClosing(false);
      document.body.style.overflow = 'unset';
    }, 300);
  };

  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // const getAnimationDelay = (index: number) => {
  //   const animationOrder = [3, 1, 0, 2, 4];
  //   const orderIndex = animationOrder.indexOf(index);
  //   return orderIndex * 50;
  // };

  return (
    <>
      {/* ===========================
          FEJLÉC
      =========================== */}
      <header className="w-full bg-gray-50 fixed top-0 left-0 z-50 shadow-sm">
        <nav className="relative flex items-center px-6 py-4">
          {/* --------------------
              LOGÓ (balra)
          -------------------- */}
          <a href="/" className="text-xl font-semibold text-black tracking-tight">
            [davelopment]®
          </a>

          {/*
            ----------------------------------------
            DESKTOP ÉS NAGYOBB (lg és feljebb):
            INLINE NAV-ELEMEK (Home nélkül, középre igazítva)
            Csak akkor látható, ha a hamburger menü zárt (isMenuOpen === false).
          ----------------------------------------
          */}
          <div className={`${isMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'} hidden xl:flex absolute left-1/2 transform -translate-x-1/2 space-x-52 transition-opacity duration-300`}>

            {inlineNavItems.map(item => (
              <a
                key={item.nameKey}
                href={item.path}
                onClick={e => handleNavigation(e, item.path)}
                className="text-base font-medium text-black hover:opacity-70 transition-opacity"
              >
                {t(item.nameKey)}
              </a>
            ))}
          </div>

          {/* ---------------------------------------------------
              NYELV VÁLTÓ ÉS HAMBURGER GOMB (mindig látható):
              jobbra igazítva
          --------------------------------------------------- */}
          <div className="flex items-center space-x-10 ml-auto">
            {/* Nyelvváltó */}
            <button
              onClick={toggleLanguage}
              className="text-sm font-medium text-black hover:opacity-70 transition-opacity"
            >
              {language === 'hu' ? 'HU' : 'EN'}
            </button>

            {/* Hamburger gomb */}
            <button
              onClick={toggleMenu}
              className="flex flex-col justify-center items-center w-8 h-8 relative focus:outline-none"
              aria-label="Toggle menu"
            >
              <div
                className={`w-12 h-0.5 bg-black absolute transition-all duration-300 ${isMenuOpen ? 'rotate-12' : '-translate-y-1'
                  }`}
              />
              <div
                className={`w-12 h-0.5 bg-black absolute transition-all duration-300 ${isMenuOpen ? '-rotate-12' : 'translate-y-1'
                  }`}
              />
            </button>
          </div>
        </nav>
      </header>

      {/* ===========================
          TELJES KÉPERNYŐS MENÜ OVERLAY (mobilon és minden felületen)
      =========================== */}
      <div
        className={`fixed inset-0 bg-gray-50 z-40 overflow-hidden ${isMenuOpen ? 'block' : 'hidden'
          }`}
        style={{
          animation: isMenuOpen
            ? !isClosing
              ? 'slideDownMenu 0.3s ease forwards'
              : 'slideUpMenu 0.3s ease forwards'
            : 'none',
        }}
      >
        <div className="min-h-screen px-6 py-8 pt-24 flex flex-col items-center justify-center">
          {/* --------------------
              MOBIL NAV (vertikális lista): itt már a Home is megjelenik
          -------------------- */}
          <nav className="mb-12 text-center">
            {allNavItems.map((item, index) => (
              <a
                key={item.nameKey}
                href={item.path}
                onClick={e => handleNavigation(e, item.path)}
                className={`
                            block 
                            text-5xl font-semibold text-black tracking-tight leading-snug
                            hover:opacity-70 
                            transition-opacity duration-50
                            ${showMenuItems ? 'opacity-100' : 'opacity-0'}
                          `}
                style={{
                  transitionDelay: showMenuItems ? `${index * 100}ms` : '0ms',
                }}
              >
                {t(item.nameKey)}
              </a>
            ))}
          </nav>


          {/* --------------------
              KAPCSOLATI INFÓK
          -------------------- */}
          <div
            className={`mb-8 flex flex-col items-center transition-all duration-300 ${showMenuItems ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
              }`}
            style={{ transitionDelay: showMenuItems ? '300ms' : '0ms' }}
          >
            <div className="mb-4">
              <a
                href="tel:3125552468"
                className="text-lg font-medium text-black tracking-tight hover:opacity-70 transition-opacity"
              >
                {t('header.phone')}
              </a>
            </div>
            <a href="mailto:hello@davelopment.com" className="flex items-center space-x-4 group">
              <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center">
                <div className="relative">
                  <div className="w-2 h-0.5 bg-white"></div>
                  <div className="w-2 h-0.5 bg-white rotate-90 absolute top-0"></div>
                </div>
              </div>
              <div>
                <div className="text-3xl font-semibold text-black tracking-tight group-hover:opacity-70 transition-opacity">
                  {t('header.email')}
                </div>
                <div className="w-full h-px bg-black mt-2"></div>
              </div>
            </a>
          </div>

          {/* --------------------
              JOGI LINKEK
          -------------------- */}
          <div
            className={`flex justify-center space-x-6 mb-6 transition-all duration-300 ${showMenuItems ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
              }`}
            style={{ transitionDelay: showMenuItems ? '400ms' : '0ms' }}
          >
            {[
              { nameKey: 'footer.privacyPolicy', path: '/legal/privacy-policy' },
              { nameKey: 'footer.termsOfService', path: '/legal/terms-of-service' },
            ].map((item, idx) => (
              <a
                key={item.nameKey}
                href={item.path}
                onClick={e => handleNavigation(e, item.path)}
                className="text-sm text-black hover:opacity-70 transition-opacity"
                style={{ transitionDelay: showMenuItems ? `${(idx + 1) * 100}ms` : '0ms' }}
              >
                {t(item.nameKey)}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
