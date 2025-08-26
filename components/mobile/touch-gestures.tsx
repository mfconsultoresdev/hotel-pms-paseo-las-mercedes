'use client';

import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface TouchGesturesProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onPinchIn?: (scale: number) => void;
  onPinchOut?: (scale: number) => void;
  onDoubleTap?: () => void;
  className?: string;
  threshold?: number;
  minSwipeDistance?: number;
}

interface TouchPoint {
  x: number;
  y: number;
  timestamp: number;
}

const TouchGestures: React.FC<TouchGesturesProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onPinchIn,
  onPinchOut,
  onDoubleTap,
  className,
  threshold = 50,
  minSwipeDistance = 50
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<TouchPoint | null>(null);
  const [touchEnd, setTouchEnd] = useState<TouchPoint | null>(null);
  const [lastTap, setLastTap] = useState<number>(0);
  const [initialDistance, setInitialDistance] = useState<number | null>(null);

  // Calculate distance between two touch points
  const getDistance = (touch1: Touch, touch2: Touch): number => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Calculate angle between two touch points
  const getAngle = (touch1: Touch, touch2: Touch): number => {
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    return Math.atan2(dy, dx) * 180 / Math.PI;
  };

  // Handle touch start
  const handleTouchStart = (e: React.TouchEvent) => {
    const touches = e.touches;
    
    if (touches.length === 1) {
      // Single touch - for swipe gestures
      const touch = touches[0];
      setTouchStart({
        x: touch.clientX,
        y: touch.clientY,
        timestamp: Date.now()
      });
      setTouchEnd(null);
    } else if (touches.length === 2) {
      // Two touches - for pinch gestures
      const distance = getDistance(touches[0] as Touch, touches[1] as Touch);
      setInitialDistance(distance);
    }
  };

  // Handle touch move
  const handleTouchMove = (e: React.TouchEvent) => {
    const touches = e.touches;
    
    if (touches.length === 2 && initialDistance !== null) {
      // Handle pinch gestures
      const currentDistance = getDistance(touches[0] as Touch, touches[1] as Touch);
      const scale = currentDistance / initialDistance;
      
      if (scale < 0.8 && onPinchIn) {
        onPinchIn(scale);
      } else if (scale > 1.2 && onPinchOut) {
        onPinchOut(scale);
      }
    }
  };

  // Handle touch end
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart || !touchEnd) return;

    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isHorizontal = Math.abs(distanceX) > Math.abs(distanceY);
    const isVertical = Math.abs(distanceY) > Math.abs(distanceX);

    // Check if swipe distance meets threshold
    if (Math.abs(distanceX) > minSwipeDistance || Math.abs(distanceY) > minSwipeDistance) {
      if (isHorizontal) {
        if (distanceX > 0 && onSwipeLeft) {
          onSwipeLeft();
        } else if (distanceX < 0 && onSwipeRight) {
          onSwipeRight();
        }
      } else if (isVertical) {
        if (distanceY > 0 && onSwipeUp) {
          onSwipeUp();
        } else if (distanceY < 0 && onSwipeDown) {
          onSwipeDown();
        }
      }
    }

    // Check for double tap
    const now = Date.now();
    const timeDiff = now - lastTap;
    if (timeDiff < 300 && timeDiff > 0) {
      if (onDoubleTap) {
        onDoubleTap();
      }
    }
    setLastTap(now);

    // Reset touch states
    setTouchStart(null);
    setTouchEnd(null);
    setInitialDistance(null);
  };

  // Handle touch move for swipe detection
  const handleTouchMoveForSwipe = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && touchStart) {
      const touch = e.touches[0];
      setTouchEnd({
        x: touch.clientX,
        y: touch.clientY,
        timestamp: Date.now()
      });
    }
  };

  // Prevent default touch behaviors that might interfere
  const preventDefault = (e: React.TouchEvent) => {
    e.preventDefault();
  };

  return (
    <div
      ref={containerRef}
      className={cn('touch-manipulation', className)}
      onTouchStart={handleTouchStart}
      onTouchMove={(e) => {
        handleTouchMove(e);
        handleTouchMoveForSwipe(e);
      }}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={() => {
        setTouchStart(null);
        setTouchEnd(null);
        setInitialDistance(null);
      }}
      style={{
        touchAction: 'manipulation',
        WebkitUserSelect: 'none',
        userSelect: 'none'
      }}
    >
      {children}
    </div>
  );
};

// Swipeable card component
interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  className?: string;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
}

const SwipeableCard: React.FC<SwipeableCardProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  className,
  leftAction,
  rightAction
}) => {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleSwipeLeft = () => {
    if (onSwipeLeft) {
      onSwipeLeft();
    }
    setSwipeOffset(0);
  };

  const handleSwipeRight = () => {
    if (onSwipeRight) {
      onSwipeRight();
    }
    setSwipeOffset(0);
  };

  return (
    <TouchGestures
      onSwipeLeft={handleSwipeLeft}
      onSwipeRight={handleSwipeRight}
      className="relative"
    >
      <div className="relative">
        {/* Left action background */}
        {leftAction && (
          <div className="absolute inset-y-0 left-0 w-20 bg-red-500 flex items-center justify-center text-white">
            {leftAction}
          </div>
        )}
        
        {/* Right action background */}
        {rightAction && (
          <div className="absolute inset-y-0 right-0 w-20 bg-green-500 flex items-center justify-center text-white">
            {rightAction}
          </div>
        )}
        
        {/* Main card content */}
        <div
          className={cn(
            'bg-white rounded-lg shadow-sm border border-gray-200 p-4',
            'transition-transform duration-200 ease-out',
            'touch-manipulation',
            className
          )}
          style={{
            transform: `translateX(${swipeOffset}px)`,
            touchAction: 'pan-y'
          }}
        >
          {children}
        </div>
      </div>
    </TouchGestures>
  );
};

// Pull to refresh component
interface PullToRefreshProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void>;
  className?: string;
  threshold?: number;
}

const PullToRefresh: React.FC<PullToRefreshProps> = ({
  children,
  onRefresh,
  className,
  threshold = 80
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (containerRef.current?.scrollTop === 0) {
      const touch = e.touches[0];
      const startY = touch.clientY;
      
      const handleTouchMove = (e: TouchEvent) => {
        const touch = e.touches[0];
        const currentY = touch.clientY;
        const distance = Math.max(0, currentY - startY);
        
        if (distance > 0) {
          setPullDistance(distance * 0.5); // Reduce pull resistance
        }
      };
      
      const handleTouchEnd = () => {
        if (pullDistance > threshold) {
          setIsRefreshing(true);
          onRefresh().finally(() => {
            setIsRefreshing(false);
            setPullDistance(0);
          });
        } else {
          setPullDistance(0);
        }
        
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
      
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn('overflow-auto', className)}
      onTouchStart={handleTouchStart}
    >
      {/* Pull indicator */}
      <div
        className={cn(
          'flex items-center justify-center py-4 text-gray-500 transition-opacity duration-200',
          {
            'opacity-100': pullDistance > 0,
            'opacity-0': pullDistance === 0
          }
        )}
        style={{ height: `${Math.min(pullDistance, threshold)}px` }}
      >
        {isRefreshing ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
            <span>Actualizando...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <span>↓ Desliza para actualizar</span>
          </div>
        )}
      </div>
      
      {children}
    </div>
  );
};

export {
  TouchGestures,
  SwipeableCard,
  PullToRefresh
};
