import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

export const Drawer = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  className,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
          {/* Calm, tinted neutral backdrop with smooth fluid fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            onClick={onClose}
            className="fixed inset-0 bg-neutral-900/20 dark:bg-black/55 transition-colors"
          />

          {/* Drawer container with left-facing elevation shadow and fluid deceleration */}
          <div className="fixed inset-y-0 right-0 flex max-w-full pointer-events-none">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                'pointer-events-auto w-screen sm:w-[500px] bg-surface border-l border-border shadow-[-8px_0_30px_-4px_rgba(0,0,0,0.08),-2px_0_8px_-2px_rgba(0,0,0,0.04)] dark:shadow-[-8px_0_30px_-4px_rgba(0,0,0,0.4)] flex flex-col h-full',
                className
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-surface shrink-0">
                <div>
                  <h2 className="text-base font-semibold text-text-primary tracking-tight">
                    {title}
                  </h2>
                  {description && (
                    <p className="text-xs text-text-secondary mt-0.5">{description}</p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-[6px] text-text-tertiary hover:text-text-primary hover:bg-surface-muted transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                  aria-label="Close panel"
                >
                  <X className="w-5 h-5" strokeWidth={1.75} />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto px-6 py-6 bg-surface">
                {children}
              </div>

              {/* Optional Footer */}
              {footer && (
                <div className="px-6 py-4 border-t border-border bg-surface-muted/30 shrink-0">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
