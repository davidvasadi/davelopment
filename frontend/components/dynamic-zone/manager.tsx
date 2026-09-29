'use client';

import dynamic from 'next/dynamic';
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface DynamicZoneComponent {
  blockType: string;
  id?: number | string;
  [key: string]: unknown;
}

interface Props {
  dynamicZone: DynamicZoneComponent[];
  locale: string;
  // Amikor igaz, minden (nem hero) szekció halványan feltűnik és enyhén
  // 0.9→1 skálázódik, ahogy scrollra beér a képernyőre — jelenleg csak a
  // szolgáltatás aloldalakon kérve.
  fadeZoom?: boolean;
}

// Payload blockType slugs (no 'dynamic-zone.' prefix)
const componentMapping: { [key: string]: any } = {
  'hero': dynamic(() => import('./hero').then((mod) => mod.Hero)),
  'service-hero': dynamic(() => import('./service-hero').then((mod) => mod.ServiceHero)),
  'service-highlight': dynamic(() => import('./service-highlight').then((mod) => mod.ServiceHighlight)),
  'features': dynamic(() => import('./features').then((mod) => mod.Features)),
  'testimonials': dynamic(() => import('./testimonials').then((mod) => mod.Testimonials)),
  'how-it-works': dynamic(() => import('./how-it-works').then((mod) => mod.HowItWorks)),
  'brands': dynamic(() => import('./brands').then((mod) => mod.Brands)),
  'pricing': dynamic(() => import('./pricing').then((mod) => mod.Pricing)),
  'launches': dynamic(() => import('./launches').then((mod) => mod.Launches)),
  'why-choose-us': dynamic(() => import('./why-choose-us-section').then((mod) => mod.WhyChooseUsSection)),
  'services': dynamic(() => import('./services').then((mod) => mod.Services)),
  'cta': dynamic(() => import('./cta').then((mod) => mod.CTA)),
  'form-section': dynamic(() => import('./form-next-to-section').then((mod) => mod.FormNextToSection)),
  'blog': dynamic(() => import('./blog').then((mod) => mod.Blog)),
  'faq': dynamic(() => import('./faq').then((mod) => mod.FAQ)),
  'related-products': dynamic(() => import('./related-products').then((mod) => mod.RelatedProducts)),
  'related-articles': dynamic(() => import('./related-articles').then((mod) => mod.RelatedArticles)),
  'related-services': dynamic(() => import('./related-services').then((mod) => mod.RelatedServices)),
  'newsletter': dynamic(() => import('./newsletter').then((mod) => mod.Newsletter)),
  'products': dynamic(() => import('./projects').then((mod) => mod.Projects)),
  'macbook-scroll': dynamic(() => import('./macbook-scroll').then((mod) => mod.MacbookScrollSection)),
};

// Belépéskor halványan feltűnik + enyhén 0.94→1 skálázódik (egyszeri), ÉS
// amíg a képernyőn van, folyamatosan, finoman "lebeg" (scroll-linkelt y) —
// így a hero parallax-depth érzése a rákövetkező szekciókban is folytatódik,
// nem csak a hero-ra korlátozódik.
function FadeZoomParallax({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [36, -36]);
  return (
    <motion.div
      ref={ref}
      style={{ y }}
      initial={{ opacity: 0, scale: 0.94 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

const DynamicZoneManager: React.FC<Props> = ({ dynamicZone, locale, fadeZoom = false }) => {
  return (
    <div>
      {dynamicZone.map((componentData, index) => {
        const Component = componentMapping[componentData.blockType];
        if (!Component) {
          console.warn(`No component found for blockType: ${componentData.blockType}`);
          return null;
        }
        const isHero = componentData.blockType === 'hero' || componentData.blockType === 'service-hero';
        const content = <Component {...componentData} locale={locale} />;
        return (
          // Anchor wrapper: every section is scrollable via #blockType
          // (e.g. #form-section, #cta, #pricing). scroll-mt offsets the navbar.
          <div
            key={`${componentData.blockType}-${componentData.id ?? index}-${index}`}
            id={componentData.blockType}
            className="scroll-mt-24"
          >
            {fadeZoom && !isHero ? (
              <FadeZoomParallax>{content}</FadeZoomParallax>
            ) : (
              content
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DynamicZoneManager;
