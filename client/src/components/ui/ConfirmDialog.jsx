import { useState, useEffect, useRef } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Input } from './Input';
import { CopyButton } from './CopyButton';
import { AlertTriangle } from 'lucide-react';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete this lead?',
  itemName,
  description = "This action can't be undone. The lead and all associated details will be permanently removed.",
  requireTyping = true,
  expectedWord = 'delete',
  confirmLabel = 'Delete lead',
  cancelLabel = 'Cancel',
  isLoading = false,
}) => {
  const [confirmInput, setConfirmInput] = useState('');
  const inputRef = useRef(null);

  // Reset confirmation input whenever the dialog opens or closes
  useEffect(() => {
    if (isOpen) {
      setConfirmInput('');
      if (requireTyping) {
        const timer = setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
        return () => clearTimeout(timer);
      }
    } else {
      setConfirmInput('');
    }
  }, [isOpen, requireTyping]);

  const isMatch = !requireTyping || confirmInput.trim().toLowerCase() === expectedWord.toLowerCase();

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && isMatch && !isLoading) {
      e.preventDefault();
      onConfirm();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <div className="flex flex-col gap-4">
        {/* Warning header */}
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-[8px] bg-[#FCE6E3] dark:bg-[#3D1B18] text-[#DC2626] flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" strokeWidth={1.75} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-text-primary tracking-tight">
              {title}
            </h3>
            {itemName && (
              <p className="text-sm font-medium text-text-primary mt-0.5">
                "{itemName}"
              </p>
            )}
            <p className="text-xs text-text-secondary mt-1">
              {description}
            </p>
          </div>
        </div>

        {/* Pre-written keyword with one-click copy button and input (if requireTyping is enabled) */}
        {requireTyping && (
          <>
            <div className="flex items-center justify-between p-2.5 rounded-[8px] bg-surface-muted/60 dark:bg-[#181A1F] border border-border dark:border-[#282C34]">
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-secondary dark:text-[#9BA1AE]">Type to confirm:</span>
                <code className="font-mono text-xs font-semibold px-2 py-0.5 rounded-[4px] bg-surface dark:bg-[#101215] text-text-primary dark:text-[#F4F5F7] border border-border dark:border-[#282C34] select-all">
                  {expectedWord}
                </code>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-text-tertiary dark:text-[#88948E]">Copy text</span>
                <CopyButton
                  text={expectedWord}
                  label={`"${expectedWord}" confirmation word`}
                  variant="inline"
                />
              </div>
            </div>

            {/* Text Input for user to type or paste "delete" */}
            <div className="space-y-1.5">
              <Input
                ref={inputRef}
                type="text"
                value={confirmInput}
                onChange={(e) => setConfirmInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Type "${expectedWord}" here`}
                autoComplete="off"
                spellCheck="false"
              />
              <p className="text-[11px] text-text-tertiary">
                Type <span className="font-mono font-medium text-text-secondary">{expectedWord}</span> above to enable the delete button.
              </p>
            </div>
          </>
        )}

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border mt-1">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={!isMatch || isLoading}
            isLoading={isLoading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
