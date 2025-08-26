'use client';

import * as React from 'react';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResizableProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
}

const Resizable = React.forwardRef<HTMLDivElement, ResizableProps>(
  ({ className, children, defaultSize = 50, minSize = 10, maxSize = 90, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('relative', className)}
      style={{ flex: defaultSize }}
      {...props}
    >
      {children}
    </div>
  )
);
Resizable.displayName = 'Resizable';

const ResizablePanel = React.forwardRef<HTMLDivElement, ResizableProps>(
  ({ className, children, defaultSize = 50, minSize = 10, maxSize = 90, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('relative', className)}
      style={{ flex: defaultSize }}
      {...props}
    >
      {children}
    </div>
  )
);
ResizablePanel.displayName = 'ResizablePanel';

const ResizableHandle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-4 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-4 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90', className)}
      {...props}
    >
      <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
        <GripVertical className="h-2.5 w-2.5" />
      </div>
    </div>
  )
);
ResizableHandle.displayName = 'ResizableHandle';

export { Resizable, ResizablePanel, ResizableHandle };
