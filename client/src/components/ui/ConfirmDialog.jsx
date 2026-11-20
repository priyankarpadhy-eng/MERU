import { useEffect, useRef } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete this lead?',
  itemName,
  description = "This action can't be undone.",
  confirmLabel = 'Delete lead',
  cancelLabel = 'Cancel',
  isLoading = false,
}) => {
  const cancelBtnRef = useRef(null);

  // Focus starts on Cancel for safe defaults
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        cancelBtnRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-[8px] bg-[#FCE6E3] dark:bg-[#3D1B18] text-[#DC2626] flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" strokeWidth={1.75} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-text-primary">
              {title}
            </h3>
            {itemName && (
              <p className="text-sm font-medium text-text-primary mt-1">
                "{itemName}"
              </p>
            )}
            <p className="text-xs text-text-secondary mt-1">
              {description}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-border mt-2">
          <Button
            ref={cancelBtnRef}
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
