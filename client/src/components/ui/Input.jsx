import { forwardRef } from 'react';
import { AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';

export const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      id,
      className,
      type = 'text',
      required = false,
      leftIcon: LeftIcon,
      rightElement,
      ...props
    },
    ref
  ) => {
    const inputId = id || props.name || Math.random().toString(36).substring(7);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold text-text-secondary uppercase tracking-[0.04em]"
          >
            {label}
            {required && <span className="text-[#DC2626] ml-1">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {LeftIcon && (
            <div className="absolute left-3 text-text-tertiary pointer-events-none">
              <LeftIcon className="w-4 h-4" strokeWidth={1.75} />
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={type}
            className={cn(
              'w-full h-10 px-3 bg-surface dark:bg-[#181A1F] text-text-primary dark:text-[#F4F5F7] text-sm rounded-[8px] border transition-colors duration-150',
              'placeholder:text-text-tertiary dark:placeholder:text-[#686E7B] focus:border-accent dark:focus:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/20',
              LeftIcon && 'pl-9',
              rightElement && 'pr-10',
              error
                ? 'border-[#DC2626] focus:border-[#DC2626] focus-visible:ring-[#DC2626]/20'
                : 'border-border dark:border-[#282C34] hover:border-text-tertiary dark:hover:border-[#4B5263]',
              className
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 flex items-center">{rightElement}</div>
          )}
        </div>
        {error && (
          <p className="flex items-center gap-1.5 text-xs text-[#DC2626] mt-0.5" role="alert">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" strokeWidth={1.75} />
            <span>{error}</span>
          </p>
        )}
        {!error && helperText && (
          <p className="text-xs text-text-tertiary">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
