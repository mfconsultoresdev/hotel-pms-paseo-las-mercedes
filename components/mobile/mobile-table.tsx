'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp, Filter, Search } from 'lucide-react';

interface MobileTableProps {
  children: React.ReactNode;
  className?: string;
}

interface MobileTableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface MobileTableRowProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  isSelected?: boolean;
}

interface MobileTableCellProps {
  children: React.ReactNode;
  className?: string;
  isHeader?: boolean;
}

interface MobileTableSearchProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

interface MobileTableFilterProps {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const MobileTable: React.FC<MobileTableProps> = ({ children, className }) => {
  return (
    <div className={cn('overflow-hidden', className)}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-full divide-y divide-gray-200">
          {children}
        </table>
      </div>
    </div>
  );
};

const MobileTableHeader: React.FC<MobileTableHeaderProps> = ({ children, className }) => {
  return (
    <thead className={cn('bg-gray-50', className)}>
      {children}
    </thead>
  );
};

const MobileTableRow: React.FC<MobileTableRowProps> = ({ 
  children, 
  className, 
  onClick, 
  isSelected 
}) => {
  const baseClasses = cn(
    'hover:bg-gray-50 transition-colors duration-150',
    'touch-manipulation', // Optimize for touch
    {
      'cursor-pointer': onClick,
      'bg-blue-50 border-l-4 border-blue-500': isSelected,
    },
    className
  );

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (onClick) {
      (e.currentTarget as HTMLElement).style.backgroundColor = '#f3f4f6';
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (onClick) {
      (e.currentTarget as HTMLElement).style.backgroundColor = '';
    }
  };

  return (
    <tr
      className={baseClasses}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {children}
    </tr>
  );
};

const MobileTableCell: React.FC<MobileTableCellProps> = ({ 
  children, 
  className, 
  isHeader = false 
}) => {
  const baseClasses = cn(
    'px-4 py-3 text-sm',
    'whitespace-nowrap',
    {
      'text-left font-medium text-gray-900': isHeader,
      'text-left text-gray-900': !isHeader,
    },
    className
  );

  if (isHeader) {
    return <th className={baseClasses}>{children}</th>;
  }

  return <td className={baseClasses}>{children}</td>;
};

const MobileTableSearch: React.FC<MobileTableSearchProps> = ({ 
  placeholder = 'Buscar...', 
  value, 
  onChange, 
  className 
}) => {
  return (
    <div className={cn('relative', className)}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      />
    </div>
  );
};

const MobileTableFilter: React.FC<MobileTableFilterProps> = ({ 
  label, 
  options, 
  value, 
  onChange, 
  className 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(option => option.value === value);

  return (
    <div className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <Filter className="h-4 w-4 mr-2" />
        {selectedOption ? selectedOption.label : label}
        {isOpen ? (
          <ChevronUp className="h-4 w-4 ml-2" />
        ) : (
          <ChevronDown className="h-4 w-4 ml-2" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  'block w-full text-left px-4 py-2 text-sm',
                  {
                    'text-gray-900 bg-gray-100': option.value === value,
                    'text-gray-700 hover:bg-gray-100': option.value !== value,
                  }
                )}
                role="menuitem"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Mobile-optimized table wrapper for small screens
const MobileTableWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="block lg:hidden">
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

// Mobile card view for table data
const MobileTableCard: React.FC<{
  data: Record<string, any>;
  onClick?: () => void;
  isSelected?: boolean;
}> = ({ data, onClick, isSelected }) => {
  return (
    <div
      className={cn(
        'bg-white rounded-lg border border-gray-200 p-4 space-y-3',
        'touch-manipulation',
        {
          'cursor-pointer hover:border-blue-300 hover:shadow-md': onClick,
          'ring-2 ring-blue-500 border-blue-300': isSelected,
        }
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="flex justify-between">
          <span className="text-sm font-medium text-gray-500 capitalize">
            {key.replace(/_/g, ' ')}:
          </span>
          <span className="text-sm text-gray-900">
            {typeof value === 'boolean' ? (value ? 'Sí' : 'No') : String(value)}
          </span>
        </div>
      ))}
    </div>
  );
};

export {
  MobileTable,
  MobileTableHeader,
  MobileTableRow,
  MobileTableCell,
  MobileTableSearch,
  MobileTableFilter,
  MobileTableWrapper,
  MobileTableCard
};
