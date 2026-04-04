'use client';

import dynamic from 'next/dynamic';
import React from 'react';

interface DynamicZoneComponent {
  blockType: string;
  id?: number | string;
  [key: string]: unknown;
}

interface Props {
  dynamicZone: DynamicZoneComponent[];
  locale: string;
}

// Payload blockType slugs (no 'dynamic-zone.' prefix)
const componentMapping: { [key: string]: any } = {
  'hero': dynamic(() => import('./hero').then((mod) => mod.Hero)),
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
  'newsletter': dynamic(() => import('./newsletter').then((mod) => mod.Newsletter)),
  'products': dynamic(() => import('./projects').then((mod) => mod.Projects)),
};

const DynamicZoneManager: React.FC<Props> = ({ dynamicZone, locale }) => {
  return (
    <div>
      {dynamicZone.map((componentData, index) => {
        const Component = componentMapping[componentData.blockType];
        if (!Component) {
          console.warn(`No component found for blockType: ${componentData.blockType}`);
          return null;
        }
        return (
          <Component
            key={`${componentData.blockType}-${componentData.id ?? index}-${index}`}
            {...componentData}
            locale={locale}
          />
        );
      })}
    </div>
  );
};

export default DynamicZoneManager;
