import {
  Linkedin,
  Globe,
  Users,
  PhoneCall,
  Calendar,
  Megaphone,
  Layers,
} from 'lucide-react';
import { cn } from '../../lib/utils';

export const SOURCE_ICONS = {
  LINKEDIN: {
    icon: Linkedin,
    label: 'LinkedIn',
    colorClass: 'text-[#0A66C2]',
    bgClass: 'bg-[#0A66C2]/10 border-[#0A66C2]/20',
  },
  WEBSITE: {
    icon: Globe,
    label: 'Website',
    colorClass: 'text-text-primary dark:text-[#F4F5F7]',
    bgClass: 'bg-surface-muted dark:bg-[#1E2127] border-border dark:border-[#282C34]',
  },
  REFERRAL: {
    icon: Users,
    label: 'Referral',
    colorClass: 'text-[#16A34A]',
    bgClass: 'bg-[#DFF3E6] border-[#BBF7D0] dark:bg-[#12301E] dark:border-[#14532D]',
  },
  COLD_CALL: {
    icon: PhoneCall,
    label: 'Cold call',
    colorClass: 'text-[#D97706]',
    bgClass: 'bg-[#FCF0DA] border-[#FDE68A] dark:bg-[#3A2A10] dark:border-[#78350F]',
  },
  EVENT: {
    icon: Calendar,
    label: 'Event',
    colorClass: 'text-[#7C3AED]',
    bgClass: 'bg-[#F3E8FF] border-[#E9D5FF] dark:bg-[#2E1A47] dark:border-[#581C87]',
  },
  ADVERTISEMENT: {
    icon: Megaphone,
    label: 'Advertisement',
    colorClass: 'text-[#DC2626]',
    bgClass: 'bg-[#FCE6E3] border-[#FECACA] dark:bg-[#3D1B18] dark:border-[#7F1D1D]',
  },
  OTHER: {
    icon: Layers,
    label: 'Other',
    colorClass: 'text-text-secondary',
    bgClass: 'bg-surface-muted/60 border-border',
  },
};

export const SourceBadge = ({ source, className = '' }) => {
  const item = SOURCE_ICONS[source] || SOURCE_ICONS.OTHER;
  const Icon = item.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[6px] text-xs font-medium border select-none transition-colors',
        'bg-surface-muted/60 border-border text-text-primary',
        className
      )}
    >
      <Icon className={cn('w-3.5 h-3.5 shrink-0', item.colorClass)} strokeWidth={1.8} />
      <span>{item.label}</span>
    </span>
  );
};
