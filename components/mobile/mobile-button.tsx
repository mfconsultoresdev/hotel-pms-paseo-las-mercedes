'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface MobileButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const MobileButton: React.FC<MobileButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  className,
  type = 'button'
}) => {
  const baseClasses = cn(
    'inline-flex items-center justify-center font-medium rounded-lg',
    'transition-all duration-200 ease-in-out',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'touch-manipulation', // Optimize for touch
    'active:scale-[0.98]', // Touch feedback
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'select-none', // Prevent text selection on mobile
    {
      // Size variants
      'px-3 py-2 text-sm': size === 'sm',
      'px-4 py-3 text-base': size === 'md',
      'px-6 py-4 text-lg': size === 'lg',
      
      // Width
      'w-full': fullWidth,
      
      // Variant styles
      'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500': variant === 'primary',
      'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500': variant === 'secondary',
      'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500': variant === 'outline',
      'text-gray-700 hover:bg-gray-100 focus:ring-gray-500': variant === 'ghost',
      'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500': variant === 'danger',
    },
    className
  );

  const handleClick = () => {
    if (!disabled && !isLoading && onClick) {
      onClick();
    }
  };

  return (
    <button
      type={type}
      className={baseClasses}
      onClick={handleClick}
      disabled={disabled || isLoading}
      onTouchStart={(e) => {
        if (!disabled && !isLoading) {
          e.currentTarget.style.transform = 'scale(0.98)';
        }
      }}
      onTouchEnd={(e) => {
        if (!disabled && !isLoading) {
          e.currentTarget.style.transform = 'scale(1)';
        }
      }}
    >
      {isLoading && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}
      {children}
    </button>
  );
};

export default MobileButton;

