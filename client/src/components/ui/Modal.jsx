import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

export const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
  maxWidth = 'max-w-md',
}) => {
  const modalRef = useRef(null);

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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
        >
          {/* Calm, tinted backdrop overlay with fluid easing */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            onClick={onClose}
            className="fixed inset-0 bg-neutral-900/20 dark:bg-black/55 transition-colors"
          />

          {/* Modal dialog with smooth micro-scale and elevation shadow */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.97, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 6 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              'relative w-full bg-surface border border-border rounded-[12px] shadow-floating z-10 overflow-hidden',
              maxWidth,
              className
            )}
          >
            {(title || onClose) && (
              <div className="flex items-start justify-between p-5 border-b border-border">
                <div>
                  {title && (
                    <h3 className="text-base font-semibold text-text-primary tracking-tight">
                      {title}
                    </h3>
                  )}
                  {description && (
                    <p className="text-xs text-text-secondary mt-1">{description}</p>
                  )}
                </div>
                {onClose && (
                  <button
                    onClick={onClose}
                    className="p-1 rounded-md text-text-tertiary hover:text-text-primary hover:bg-surface-muted transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                    aria-label="Close dialog"
                  >
                    <X className="w-4 h-4" strokeWidth={1.75} />
                  </button>
                )}
              </div>
            )}
            <div className="p-5">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
