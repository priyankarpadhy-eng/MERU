import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';

/**
 * Universal copy helper with modern clipboard API and fallback
 */
export const copyTextToClipboard = async (text) => {
  if (!text) return false;
  if (navigator?.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to textarea fallback
    }
  }
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.pointerEvents = 'none';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);
    return successful;
  } catch {
    return false;
  }
};

/**
 * Small, polished copy button that shows a checkmark animation and toast on click.
 * Supports hover-reveal in table cells or permanent inline display.
 */
export const CopyButton = ({
  text,
  label = 'Value',
  className = '',
  iconSize = 'w-3.5 h-3.5',
  variant = 'hover', // 'hover' (reveals on parent group hover) | 'inline' (always visible)
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!text) return;

    const success = await copyTextToClipboard(text);
    if (success) {
      setCopied(true);
      toast.success(`Copied ${label.toLowerCase()} to clipboard`);
      setTimeout(() => setCopied(false), 1600);
    } else {
      toast.error('Failed to copy to clipboard');
    }
  };

  if (!text) return null;

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        'p-1 rounded-[4px] text-text-tertiary hover:text-text-primary hover:bg-surface-muted transition-all duration-150 inline-flex items-center justify-center shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent',
        variant === 'hover' &&
          'opacity-0 group-hover:opacity-100 group-hover/copy:opacity-100 focus:opacity-100',
        copied && 'opacity-100 text-accent bg-accent-soft',
        className
      )}
      title={copied ? 'Copied!' : `Copy ${label.toLowerCase()}`}
      aria-label={copied ? 'Copied to clipboard' : `Copy ${label.toLowerCase()}`}
    >
      {copied ? (
        <Check className={cn(iconSize, 'text-accent animate-in zoom-in-75 duration-150')} strokeWidth={2} />
      ) : (
        <Copy className={iconSize} strokeWidth={1.75} />
      )}
    </button>
  );
};
