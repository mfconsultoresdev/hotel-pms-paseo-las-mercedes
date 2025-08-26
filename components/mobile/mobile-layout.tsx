'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface MobileLayoutProps {
  children: React.ReactNode;
  className?: string;
}

interface MobileContainerProps {
  children: React.ReactNode;
  className?: string;
  fluid?: boolean;
}

interface MobileGridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

interface MobileFlexProps {
  children: React.ReactNode;
  direction?: 'row' | 'col';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  wrap?: boolean;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

interface MobileSectionProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  margin?: 'none' | 'sm' | 'md' | 'lg';
}

// Main mobile layout wrapper
const MobileLayout: React.FC<MobileLayoutProps> = ({ children, className }) => {
  return (
    <div className={cn(
      'min-h-screen bg-gray-50',
      'mobile:px-2 sm:px-4 md:px-6 lg:px-8',
      'mobile:py-2 sm:py-4 md:py-6 lg:py-8',
      className
    )}>
      {children}
    </div>
  );
};

// Responsive container
const MobileContainer: React.FC<MobileContainerProps> = ({ 
  children, 
  className, 
  fluid = false 
}) => {
  return (
    <div className={cn(
      'mx-auto',
      {
        'mobile:px-2 sm:px-4 md:px-6 lg:px-8': !fluid,
        'mobile:w-full sm:w-full md:max-w-4xl lg:max-w-6xl xl:max-w-7xl': !fluid,
        'w-full': fluid
      },
      className
    )}>
      {children}
    </div>
  );
};

// Responsive grid system
const MobileGrid: React.FC<MobileGridProps> = ({ 
  children, 
  cols = 1, 
  gap = 'md', 
  className 
}) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'mobile:grid-cols-1 sm:grid-cols-2',
    3: 'mobile:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'mobile:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  };

  const gridGaps = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6'
  };

  return (
    <div className={cn(
      'grid',
      gridCols[cols],
      gridGaps[gap],
      className
    )}>
      {children}
    </div>
  );
};

// Responsive flexbox
const MobileFlex: React.FC<MobileFlexProps> = ({ 
  children, 
  direction = 'col', 
  justify = 'start', 
  align = 'start', 
  wrap = false, 
  gap = 'md', 
  className 
}) => {
  const flexDirection = {
    row: 'mobile:flex-col sm:flex-row',
    col: 'flex-col'
  };

  const justifyContent = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around'
  };

  const alignItems = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline'
  };

  const flexGaps = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6'
  };

  return (
    <div className={cn(
      'flex',
      flexDirection[direction],
      justifyContent[justify],
      alignItems[align],
      flexGaps[gap],
      {
        'flex-wrap': wrap,
        'flex-nowrap': !wrap
      },
      className
    )}>
      {children}
    </div>
  );
};

// Responsive section with padding/margin
const MobileSection: React.FC<MobileSectionProps> = ({ 
  children, 
  className, 
  padding = 'md', 
  margin = 'none' 
}) => {
  const paddingClasses = {
    none: '',
    sm: 'mobile:p-2 sm:p-3 md:p-4',
    md: 'mobile:p-3 sm:p-4 md:p-6',
    lg: 'mobile:p-4 sm:p-6 md:p-8'
  };

  const marginClasses = {
    none: '',
    sm: 'mobile:my-2 sm:my-3 md:my-4',
    md: 'mobile:my-3 sm:my-4 md:my-6',
    lg: 'mobile:my-4 sm:my-6 md:my-8'
  };

  return (
    <section className={cn(
      paddingClasses[padding],
      marginClasses[margin],
      className
    )}>
      {children}
    </section>
  );
};

// Responsive text utilities
const MobileText: React.FC<{
  children: React.ReactNode;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'primary' | 'secondary' | 'muted' | 'success' | 'warning' | 'error';
  className?: string;
}> = ({ 
  children, 
  size = 'base', 
  weight = 'normal', 
  color = 'primary', 
  className 
}) => {
  const textSizes = {
    xs: 'mobile:text-xs sm:text-xs',
    sm: 'mobile:text-sm sm:text-sm',
    base: 'mobile:text-base sm:text-base',
    lg: 'mobile:text-lg sm:text-lg',
    xl: 'mobile:text-xl sm:text-xl',
    '2xl': 'mobile:text-2xl sm:text-2xl'
  };

  const textWeights = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };

  const textColors = {
    primary: 'text-gray-900',
    secondary: 'text-gray-700',
    muted: 'text-gray-500',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600'
  };

  return (
    <span className={cn(
      textSizes[size],
      textWeights[weight],
      textColors[color],
      className
    )}>
      {children}
    </span>
  );
};

// Responsive spacing utilities
const MobileSpacer: React.FC<{
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  axis?: 'x' | 'y' | 'both';
  className?: string;
}> = ({ size = 'md', axis = 'y', className }) => {
  const spacerSizes = {
    xs: 'mobile:space-1 sm:space-2',
    sm: 'mobile:space-2 sm:space-3',
    md: 'mobile:space-3 sm:space-4',
    lg: 'mobile:space-4 sm:space-6',
    xl: 'mobile:space-6 sm:space-8'
  };

  const spacerAxis = {
    x: 'w-full',
    y: 'h-full',
    both: 'w-full h-full'
  };

  return (
    <div className={cn(
      spacerSizes[size],
      spacerAxis[axis],
      className
    )} />
  );
};

// Responsive visibility utilities
const MobileShow: React.FC<{
  children: React.ReactNode;
  on?: 'mobile' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}> = ({ children, on = 'mobile', className }) => {
  const visibilityClasses = {
    mobile: 'block sm:hidden',
    sm: 'hidden sm:block',
    md: 'hidden md:block',
    lg: 'hidden lg:block',
    xl: 'hidden xl:block'
  };

  return (
    <div className={cn(visibilityClasses[on], className)}>
      {children}
    </div>
  );
};

const MobileHide: React.FC<{
  children: React.ReactNode;
  on?: 'mobile' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}> = ({ children, on = 'mobile', className }) => {
  const visibilityClasses = {
    mobile: 'hidden sm:block',
    sm: 'block sm:hidden',
    md: 'block md:hidden',
    lg: 'block lg:hidden',
    xl: 'block xl:hidden'
  };

  return (
    <div className={cn(visibilityClasses[on], className)}>
      {children}
    </div>
  );
};

export {
  MobileLayout,
  MobileContainer,
  MobileGrid,
  MobileFlex,
  MobileSection,
  MobileText,
  MobileSpacer,
  MobileShow,
  MobileHide
};

