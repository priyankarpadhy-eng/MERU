import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString) {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function formatDateTime(dateString) {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

export function formatRelativeTime(dateString) {
  if (!dateString) return '—';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.round((date.getTime() - now.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  const minutes = Math.round(diffInSeconds / 60);
  const hours = Math.round(diffInSeconds / 3600);
  const days = Math.round(diffInSeconds / 86400);

  if (Math.abs(diffInSeconds) < 60) return 'just now';
  if (Math.abs(minutes) < 60) return rtf.format(minutes, 'minute');
  if (Math.abs(hours) < 24) return rtf.format(hours, 'hour');
  if (Math.abs(days) < 30) return rtf.format(days, 'day');

  return formatDate(dateString);
}

export function getInitials(name = '') {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return 'U';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Deterministic calm pastel avatar color generator based on lead name
 */
export function getAvatarColor(name = '') {
  const palettes = [
    'bg-[#F1F2F4] text-[#0F1115] border-[#D1D5DB] dark:bg-[#1E2127] dark:text-[#F4F5F7] dark:border-[#374151]', // Monochrome brand
    'bg-[#E6EEFD] text-[#1D4ED8] border-[#BFDBFE] dark:bg-[#16223F] dark:text-[#7BA2F7] dark:border-[#1E3A8A]', // Blue
    'bg-[#FCF0DA] text-[#A15C07] border-[#FDE68A] dark:bg-[#3A2A10] dark:text-[#E8B25A] dark:border-[#78350F]', // Amber
    'bg-[#DFF3E6] text-[#166534] border-[#BBF7D0] dark:bg-[#12301E] dark:text-[#6CCB8C] dark:border-[#14532D]', // Emerald
    'bg-[#F3E8FF] text-[#7E22CE] border-[#E9D5FF] dark:bg-[#2E1A47] dark:text-[#C084FC] dark:border-[#581C87]', // Purple
    'bg-[#FCE7F3] text-[#BE185D] border-[#FBCFE8] dark:bg-[#3B1229] dark:text-[#F472B6] dark:border-[#831843]', // Rose
    'bg-[#E2E8F0] text-[#334155] border-[#CBD5E1] dark:bg-[#1E293B] dark:text-[#94A3B8] dark:border-[#334155]', // Slate
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % palettes.length;
  return palettes[index];
}
