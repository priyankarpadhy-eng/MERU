import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { STATUS_CONFIG, STATUS_LIST } from '../../lib/constants';
import { cn } from '../../lib/utils';
import { Check } from 'lucide-react';

export const StatusBadge = ({
  status = 'NEW',
  onChangeStatus,
  interactive = true,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const config = STATUS_CONFIG[status] || STATUS_CONFIG.NEW;

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (newStatus, e) => {
    e.stopPropagation();
    setIsOpen(false);
    if (newStatus !== status && onChangeStatus) {
      onChangeStatus(newStatus);
    }
  };

  return (
    <div ref={containerRef} className="relative inline-block text-left" onClick={(e) => e.stopPropagation()}>
      <motion.button
        type="button"
        whileTap={interactive ? { scale: 0.96 } : {}}
        onClick={(e) => {
          if (!interactive || !onChangeStatus) return;
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-all duration-150 select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent',
          config.bgClass,
          interactive && onChangeStatus ? 'cursor-pointer hover:opacity-90' : 'cursor-default',
          className
        )}
        title={interactive && onChangeStatus ? 'Click to change status' : undefined}
      >
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ backgroundColor: config.colorHex }}
        />
        <span>{config.label}</span>
      </motion.button>

      {/* Popover Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 4 }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 mt-1 w-36 bg-surface border border-border rounded-[8px] shadow-floating z-40 py-1 overflow-hidden"
          >
            {STATUS_LIST.map((key) => {
              const item = STATUS_CONFIG[key];
              const isSelected = key === status;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={(e) => handleSelect(key, e)}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-1.5 text-xs text-left transition-colors',
                    isSelected
                      ? 'bg-surface-muted text-text-primary font-medium'
                      : 'text-text-secondary hover:bg-surface-muted hover:text-text-primary'
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: item.colorHex }}
                    />
                    <span>{item.label}</span>
                  </span>
                  {isSelected && <Check className="w-3 h-3 text-accent" strokeWidth={2} />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
