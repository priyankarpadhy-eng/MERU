import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export const Button = forwardRef(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled = false,
      type = 'button',
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-150 rounded-[8px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 active:translate-y-[1px] disabled:opacity-50 disabled:pointer-events-none select-none';

    const variants = {
      primary:
        'bg-accent text-white dark:text-[#061512] font-semibold hover:bg-accent-hover shadow-sm active:bg-accent-hover',
      secondary:
        'bg-surface dark:bg-[#1A201E] text-text-primary dark:text-[#ECEDEA] border border-border dark:border-[#2C3833] hover:bg-surface-muted dark:hover:bg-[#222B27] active:bg-surface-muted dark:active:bg-[#222B27]',
      outline:
        'bg-transparent text-text-primary dark:text-[#ECEDEA] border border-border dark:border-[#2C3833] hover:bg-surface-muted dark:hover:bg-[#1F2623] active:bg-surface-muted dark:active:bg-[#1F2623]',
      ghost:
        'bg-transparent text-text-secondary dark:text-[#9DA6A0] hover:text-text-primary dark:hover:text-[#ECEDEA] hover:bg-surface-muted dark:hover:bg-[#1F2623] active:bg-surface-muted dark:active:bg-[#1F2623]',
      destructive:
        'bg-[#DC2626] text-white hover:bg-[#B91C1C] active:bg-[#991B1B]',
      destructiveOutline:
        'bg-transparent text-[#DC2626] border border-[#FECACA] hover:bg-[#FCE6E3] dark:text-[#F87171] dark:border-[#5C2320] dark:hover:bg-[#3D1B18]',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs gap-1.5',
      md: 'h-10 px-4 text-sm gap-2',
      lg: 'h-11 px-5 text-base gap-2.5',
      icon: 'h-10 w-10 p-0 shrink-0 min-h-[44px] min-w-[44px]',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            <span className="opacity-80">{typeof children === 'string' ? children : 'Loading...'}</span>
          </>
        ) : (
          <>
            {LeftIcon && <LeftIcon className="w-4 h-4 shrink-0" strokeWidth={1.75} />}
            {children}
            {RightIcon && <RightIcon className="w-4 h-4 shrink-0" strokeWidth={1.75} />}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
