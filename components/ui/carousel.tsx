'use client';

import * as React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  ({ className, children, ...props }, ref) => {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const childrenArray = React.Children.toArray(children);

    const next = () => {
      setCurrentIndex((prev) => (prev + 1) % childrenArray.length);
    };

    const prev = () => {
      setCurrentIndex((prev) => (prev - 1 + childrenArray.length) % childrenArray.length);
    };

    return (
      <div ref={ref} className={cn('relative', className)} {...props}>
        <div className="overflow-hidden">
          <div className="flex transition-transform duration-300 ease-in-out">
            {childrenArray[currentIndex]}
          </div>
        </div>
        
        {childrenArray.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2"
              onClick={prev}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={next}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    );
  }
);

Carousel.displayName = 'Carousel';

export { Carousel };
