'use client';

import * as React from 'react';
import { Dot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

interface InputOTPProps {
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  length?: number;
}

const InputOTP = React.forwardRef<HTMLDivElement, InputOTPProps>(
  ({ className, value = '', onChange, length = 6 }, ref) => {
    const [otp, setOtp] = React.useState(value.split('').slice(0, length));
    const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

    React.useEffect(() => {
      setOtp(value.split('').slice(0, length));
    }, [value, length]);

    const handleChange = (index: number, digit: string) => {
      if (digit.length > 1) return;
      
      const newOtp = [...otp];
      newOtp[index] = digit;
      setOtp(newOtp);
      
      if (onChange) {
        onChange(newOtp.join(''));
      }
      
      // Move to next input
      if (digit && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace' && !otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    };

    return (
      <div
        ref={ref}
        className={cn('flex items-center gap-2', className)}
      >
        {Array.from({ length }, (_, index) => (
          <Input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={otp[index] || ''}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="w-10 h-10 text-center text-lg"
            placeholder={otp[index] ? '' : '0'}
          />
        ))}
      </div>
    );
  }
);
InputOTP.displayName = 'InputOTP';

const InputOTPGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center gap-2', className)}
      {...props}
    />
  )
);
InputOTPGroup.displayName = 'InputOTPGroup';

const InputOTPSlot = React.forwardRef<HTMLInputElement, React.ComponentProps<typeof Input> & { char?: string; hasFakeCaret?: boolean }>(
  ({ className, char, hasFakeCaret, ...props }, ref) => (
    <div className="relative">
      <Input
        ref={ref}
        className={cn('w-10 h-10 text-center text-lg', className)}
        {...props}
      />
      {char && (
        <div className="absolute inset-0 flex items-center justify-center">
          {char}
        </div>
      )}
      {hasFakeCaret && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-0.5 h-4 bg-foreground animate-pulse" />
        </div>
      )}
    </div>
  )
);
InputOTPSlot.displayName = 'InputOTPSlot';

export { InputOTP, InputOTPGroup, InputOTPSlot };
