'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface HoverCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const HoverCard = React.forwardRef<HTMLDivElement, HoverCardProps>(
  ({ className, children, open, onOpenChange, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('relative', className)}
      {...props}
    >
      {children}
    </div>
  )
);
HoverCard.displayName = 'HoverCard';

const HoverCardTrigger = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('cursor-pointer', className)}
      {...props}
    />
  )
);
HoverCardTrigger.displayName = 'HoverCardTrigger';

const HoverCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none', className)}
      {...props}
    >
      {children}
    </div>
  )
);
HoverCardContent.displayName = 'HoverCardContent';

export {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
};
