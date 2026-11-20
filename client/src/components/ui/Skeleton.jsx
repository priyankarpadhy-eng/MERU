import { cn } from '../../lib/utils';

export const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        'animate-pulse bg-surface-muted rounded-[8px]',
        className
      )}
      {...props}
    />
  );
};
