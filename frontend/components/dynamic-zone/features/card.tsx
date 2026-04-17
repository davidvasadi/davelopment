'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        'rounded-[15px] overflow-hidden relative transition-all duration-[350ms] cursor-pointer',
        'border border-[#242424] bg-[#0d0d0d]',
        'hover:border-[#383838] hover:-translate-y-[2px]',
        'shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]',
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardVis = ({
  className,
  children,
  height = 'h-[220px]',
}: {
  className?: string;
  children: React.ReactNode;
  height?: string;
}) => {
  return (
    <div
      className={cn(
        'relative overflow-hidden border-b border-[#1e1e1e]',
        'bg-[#080808]',
        height,
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardBody = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn('px-[15px] pt-[13px] pb-[15px] relative z-10', className)}>
      {children}
    </div>
  );
};

export const CardTag = ({
  color,
  label,
}: {
  color: string;
  label: string;
}) => {
  return (
    <div className="flex items-center gap-[5px] mb-[5px]">
      <div
        className="w-[5px] h-[5px] rounded-full flex-shrink-0"
        style={{ background: color }}
      />
      <span className="text-[9px] font-medium tracking-[.1em] uppercase" style={{ color }}>
        {label}
      </span>
    </div>
  );
};

export const CardTitle = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn('text-[13px] font-medium text-white mb-[3px] tracking-[-0.01em]', className)}>
      {children}
    </div>
  );
};

export const CardDescription = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <p className={cn('text-[11px] leading-[1.55] text-[rgba(255,255,255,0.38)]', className)}>
      {children}
    </p>
  );
};

export const CardShimmer = ({ style }: { style?: React.CSSProperties }) => {
  return (
    <div
      className="absolute inset-0 rounded-[15px] opacity-0 transition-opacity duration-[400ms] pointer-events-none z-0 group-hover:opacity-100"
      style={style}
    />
  );
};

// Legacy — visszafelé kompatibilitás
export const CardSkeletonContainer = ({
  className,
  children,
  showGradient = true,
}: {
  className?: string;
  children: React.ReactNode;
  showGradient?: boolean;
}) => {
  return (
    <div
      className={cn(
        'h-[20rem] rounded-xl z-40',
        className,
        showGradient &&
          'bg-[rgba(40,40,40,0.30)] [mask-image:radial-gradient(50%_50%_at_50%_50%,white_0%,transparent_100%)]'
      )}
    >
      {children}
    </div>
  );
};
