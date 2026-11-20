import { cn } from '../../lib/utils';

export const Badge = ({
  children,
  className,
  dotColor,
  variant = 'neutral',
  size = 'md',
}) => {
  const variants = {
    neutral: 'bg-surface-muted text-text-secondary border-border',
    accent: 'bg-accent-soft text-accent border-accent/20',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-pill border select-none transition-colors duration-150',
        variants[variant] || '',
        sizes[size],
        className
      )}
    >
      {dotColor && (
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ backgroundColor: dotColor }}
        />
      )}
      {children}
    </span>
  );
};
