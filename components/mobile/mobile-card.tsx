'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface MobileCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  isInteractive?: boolean;
  isSelected?: boolean;
}

const MobileCard: React.FC<MobileCardProps> = ({
  children,
  className,
  onClick,
  isInteractive = false,
  isSelected = false
}) => {
  const baseClasses = cn(
    'bg-white rounded-xl shadow-sm border border-gray-200 p-4',
    'transition-all duration-200 ease-in-out',
    'touch-manipulation', // Optimize for touch
    {
      'cursor-pointer hover:shadow-md hover:border-gray-300 active:scale-[0.98]': isInteractive,
      'ring-2 ring-blue-500 ring-offset-2': isSelected,
      'hover:shadow-lg': isInteractive && !isSelected
    },
    className
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isInteractive) {
      (e.currentTarget as HTMLElement).style.transform = 'scale(0.98)';
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isInteractive) {
      (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
    }
  };

  const handleClick = () => {
    if (onClick && isInteractive) {
      onClick();
    }
  };

  return (
    <div
      className={baseClasses}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onKeyDown={(e) => {
        if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {children}
    </div>
  );
};

export default MobileCard;
