import { cn } from '../../lib/utils';
import { Button } from './Button';

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  actionIcon,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-surface border border-border rounded-[12px]',
        className
      )}
    >
      {Icon && (
        <div className="w-12 h-12 rounded-[10px] bg-surface-muted flex items-center justify-center text-text-tertiary mb-4">
          <Icon className="w-6 h-6" strokeWidth={1.75} />
        </div>
      )}
      <h3 className="text-base font-semibold text-text-primary mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-text-secondary max-w-sm mb-6 leading-relaxed">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          variant="primary"
          leftIcon={actionIcon}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
