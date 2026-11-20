import { forwardRef } from 'react';
import { AlertTriangle, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export const Select = forwardRef(
  (
    {
      label,
      error,
      helperText,
      id,
      className,
      options = [],
      placeholder = 'Select option...',
      required = false,
      ...props
    },
    ref
  ) => {
    const selectId = id || props.name || Math.random().toString(36).substring(7);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-semibold text-text-secondary uppercase tracking-[0.04em]"
          >
            {label}
            {required && <span className="text-[#DC2626] ml-1">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'w-full h-10 px-3 pr-9 bg-surface text-text-primary text-sm rounded-[8px] border transition-colors duration-150 appearance-none cursor-pointer',
              'focus:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/20',
              error
                ? 'border-[#DC2626] focus:border-[#DC2626] focus-visible:ring-[#DC2626]/20'
                : 'border-border hover:border-text-tertiary',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="w-4 h-4 text-text-tertiary absolute right-3 pointer-events-none"
            strokeWidth={1.75}
          />
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

Select.displayName = 'Select';
