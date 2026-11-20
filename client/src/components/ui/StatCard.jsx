import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export const StatCard = ({
  title,
  value = 0,
  percentage,
  icon: Icon,
  iconBgClass = 'bg-surface-muted text-text-secondary',
  onClick,
  active = false,
  className,
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  // Smooth number count-up animation
  useEffect(() => {
    let start = 0;
    const end = Number(value) || 0;
    if (end === 0) {
      setDisplayValue(0);
      return;
    }

    const duration = 600; // ms
    const stepTime = 20; // ms
    const totalSteps = duration / stepTime;
    const increment = end / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div
      whileHover={onClick ? { y: -2 } : {}}
      transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      className={cn(
        'bg-surface border rounded-[12px] p-5 flex flex-col justify-between transition-colors duration-150',
        onClick ? 'cursor-pointer' : '',
        active
          ? 'border-accent ring-1 ring-accent/30'
          : 'border-border hover:border-text-tertiary/60',
        className
      )}
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="text-xs font-medium text-text-secondary uppercase tracking-[0.04em]">
          {title}
        </span>
        {Icon && (
          <div
            className={cn(
              'w-8 h-8 rounded-[8px] flex items-center justify-center shrink-0',
              iconBgClass
            )}
          >
            <Icon className="w-4 h-4" strokeWidth={1.75} />
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2 mt-auto">
        <span className="font-mono text-2xl font-semibold text-text-primary tabular-nums">
          {displayValue}
        </span>
        {percentage !== undefined && (
          <span className="text-xs font-mono text-text-tertiary">
            {percentage}%
          </span>
        )}
      </div>
    </motion.div>
  );
};
