'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import {
  Card,
  CardVis,
  CardBody,
  CardTag,
  CardTitle,
  CardDescription,
  CardShimmer,
} from './card';
import { SkeletonOne } from './skeletons/performance-card';
import { SkeletonTwo } from './skeletons/seo-card';
import { SkeletonThree } from './skeletons/design-card';
import { SkeletonFour } from './skeletons/systems-card';

const BentoGrid = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const spot = spotRef.current;
    if (!el || !spot) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      spot.style.left = e.clientX - r.left + 'px';
      spot.style.top = e.clientY - r.top + 'px';
      spot.style.opacity = '1';
    };
    const onLeave = () => { spot.style.opacity = '0'; };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div ref={ref} className="relative grid grid-cols-1 lg:grid-cols-2 gap-[9px] z-10">
      <div
        ref={spotRef}
        className="pointer-events-none absolute z-0 opacity-0 transition-opacity duration-500"
        style={{
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.035) 0%, transparent 65%)',
          transform: 'translate(-50%, -50%)',
        }}
      />
      {children}
    </div>
  );
};

export const Features = ({
  heading,
  sub_heading,
  globe_card,
  ray_card,
  graph_card,
  social_media_card,
}: {
  heading: string;
  sub_heading: string;
  globe_card: any;
  ray_card: any;
  graph_card: any;
  social_media_card: any;
}) => {
  const cardCount = [globe_card, ray_card, graph_card, social_media_card].filter(Boolean).length;
  const isExpanded = cardCount === 1;

  const isOnlyGlobe = isExpanded && !!globe_card;
  const isOnlySeo = isExpanded && !!ray_card;
  const isOnlyDesign = isExpanded && !!graph_card;
  const isOnlySystems = isExpanded && !!social_media_card;

  return (
    <div className="px-0 md:px-2 md:my-20">
      <section
        className="w-full relative overflow-hidden rounded-2xl md:rounded-[20px] bg-[#080808]"
        style={{ padding: 16 }}
      >
        {(heading || sub_heading) && (
          <div className="px-[15px] pt-[13px] pb-4">
            {heading && (
              <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
                {heading}
              </h2>
            )}
            {sub_heading && (
              <p className="text-sm text-[rgba(255,255,255,0.38)] mt-1 max-w-xl">
                {sub_heading}
              </p>
            )}
          </div>
        )}

        <BentoGrid>

          {globe_card && (
            <Card className={cn(isOnlyGlobe ? 'lg:col-span-2' : 'lg:col-span-2', 'group')}>
              <CardShimmer style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(167,139,250,0.05), transparent 60%)' }} />
              <CardVis height={isOnlyGlobe ? 'h-auto min-h-[480px]' : 'h-[170px]'}>
                <SkeletonOne expanded={isOnlyGlobe} />
              </CardVis>
              <CardBody>
                <CardTag color="#a78bfa" label="Performance" />
                <CardTitle>{globe_card.title}</CardTitle>
                <CardDescription>{globe_card.description}</CardDescription>
              </CardBody>
            </Card>
          )}

          {ray_card && (
            <Card className={cn(isOnlySeo ? 'lg:col-span-2' : '', 'group')}>
              <CardShimmer style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(52,211,153,0.05), transparent 60%)' }} />
              <CardVis height={isOnlySeo ? 'h-auto min-h-[480px]' : 'h-[148px]'}>
                <SkeletonTwo expanded={isOnlySeo} />
              </CardVis>
              <CardBody>
                <CardTag color="#34d399" label="SEO" />
                <CardTitle>{ray_card.title}</CardTitle>
                <CardDescription>{ray_card.description}</CardDescription>
              </CardBody>
            </Card>
          )}

          {graph_card && (
            <Card className={cn(isOnlyDesign ? 'lg:col-span-2' : '', 'group')}>
              <CardShimmer style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(251,191,36,0.05), transparent 60%)' }} />
              <CardVis height={isOnlyDesign ? 'h-auto min-h-[480px]' : 'h-[148px]'}>
                <SkeletonThree expanded={isOnlyDesign} />
              </CardVis>
              <CardBody>
                <CardTag color="#fbbf24" label="Design" />
                <CardTitle>{graph_card.title}</CardTitle>
                <CardDescription>{graph_card.description}</CardDescription>
              </CardBody>
            </Card>
          )}

          {social_media_card && (
            <Card className={cn(isOnlySystems ? 'lg:col-span-2' : 'lg:col-span-2', 'group')}>
              <CardShimmer style={{ background: 'radial-gradient(ellipse at 70% 50%, rgba(251,113,133,0.04), transparent 60%)' }} />
              <CardVis height={isOnlySystems ? 'h-auto min-h-[480px]' : 'h-[160px]'}>
                <SkeletonFour expanded={isOnlySystems} />
              </CardVis>
              <CardBody>
                <CardTag color="#fb7185" label="Systems" />
                <CardTitle>{social_media_card.Title ?? social_media_card.title}</CardTitle>
                <CardDescription>{social_media_card.Description ?? social_media_card.description}</CardDescription>
              </CardBody>
            </Card>
          )}

        </BentoGrid>
      </section>
    </div>
  );
};