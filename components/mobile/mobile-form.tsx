'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface MobileFormProps {
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  className?: string;
}

interface MobileFormFieldProps {
  label: string;
  children: React.ReactNode;
  error?: string;
  required?: boolean;
  className?: string;
}

interface MobileInputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
  className?: string;
  autoComplete?: string;
  inputMode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';
}

interface MobileSelectProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  error?: string;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

interface MobileTextareaProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  error?: string;
  disabled?: boolean;
  className?: string;
  rows?: number;
}

const MobileForm: React.FC<MobileFormProps> = ({ children, onSubmit, className }) => {
  return (
    <form onSubmit={onSubmit} className={cn('space-y-6', className)}>
      {children}
    </form>
  );
};

const MobileFormField: React.FC<MobileFormFieldProps> = ({ 
  label, 
  children, 
  error, 
  required, 
  className 
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

const MobileInput: React.FC<MobileInputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  disabled,
  className,
  autoComplete,
  inputMode
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      disabled={disabled}
      autoComplete={autoComplete}
      inputMode={inputMode}
      className={cn(
        'w-full px-4 py-3 text-base',
        'border border-gray-300 rounded-lg',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
        'disabled:bg-gray-50 disabled:text-gray-500',
        'touch-manipulation', // Optimize for touch
        'appearance-none', // Remove default styling
        {
          'border-red-300 focus:ring-red-500 focus:border-red-500': error,
        },
        className
      )}
    />
  );
};

const MobileSelect: React.FC<MobileSelectProps> = ({
  value,
  onChange,
  onBlur,
  error,
  disabled,
  className,
  children
}) => {
  return (
    <select
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      disabled={disabled}
      className={cn(
        'w-full px-4 py-3 text-base',
        'border border-gray-300 rounded-lg',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
        'disabled:bg-gray-50 disabled:text-gray-500',
        'touch-manipulation', // Optimize for touch
        'appearance-none', // Remove default styling
        'bg-white',
        {
          'border-red-300 focus:ring-red-500 focus:border-red-500': error,
        },
        className
      )}
    >
      {children}
    </select>
  );
};

const MobileTextarea: React.FC<MobileTextareaProps> = ({
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  disabled,
  className,
  rows = 4
}) => {
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      disabled={disabled}
      rows={rows}
      className={cn(
        'w-full px-4 py-3 text-base',
        'border border-gray-300 rounded-lg',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
        'disabled:bg-gray-50 disabled:text-gray-500',
        'touch-manipulation', // Optimize for touch
        'resize-none', // Prevent manual resizing on mobile
        {
          'border-red-300 focus:ring-red-500 focus:border-red-500': error,
        },
        className
      )}
    />
  );
};

export {
  MobileForm,
  MobileFormField,
  MobileInput,
  MobileSelect,
  MobileTextarea
};

