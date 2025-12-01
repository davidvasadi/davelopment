import { MotionProps } from 'framer-motion';
import React from 'react';
import Balancer from 'react-wrap-balancer';
import { cn } from '@/lib/utils';

export const Heading = ({
  className,
  as: Tag = 'h2',
  children,
  size = 'md',
  ...props
}: {
  className?: string;
  as?: any;
  children: any;
  size?: 'sm' | 'md' | 'xl' | '2xl';
  props?: React.HTMLAttributes<HTMLHeadingElement>;
} & MotionProps & React.HTMLAttributes<HTMLHeadingElement>) => {
  const sizeVariants = {
    sm: 'text-xl md:text-2xl md:leading-snug',
    md: 'text-3xl md:text-4xl md:leading-tight',
    xl: 'text-4xl md:text-6xl md:leading-none',
    '2xl': 'text-5xl md:text-7xl md:leading-none',
  };

  return (
    <Tag
      className={cn(
        // Alap méret (nálad extra nagy a default) – maradhat
        'text-6xl md:text-8xl md:leading-tight lg:text-9xl  text-left tracking-tight',
        'font-bold',
        // ALAP SZÍN: fekete (felülírható lesz)
        'text-black',
        // Opcionális méretvariáns – ha kell, használd
        // sizeVariants[size],
        // NAGYON FONTOS: a külső className a végére kerül, így felülír mindent
        className
      )}
      {...props}
    >
      <Balancer>{children}</Balancer>
    </Tag>
  );
};
