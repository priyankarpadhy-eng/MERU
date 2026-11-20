export const STATUS_CONFIG = {
  NEW: {
    label: 'New',
    value: 'NEW',
    bgClass: 'bg-status-new-bg text-status-new-text border-[#BFDBFE] dark:border-[#1E3A8A]',
    dotClass: 'bg-status-new-dot',
    colorHex: '#2563EB',
  },
  CONTACTED: {
    label: 'Contacted',
    value: 'CONTACTED',
    bgClass: 'bg-status-contacted-bg text-status-contacted-text border-[#FDE68A] dark:border-[#78350F]',
    dotClass: 'bg-status-contacted-dot',
    colorHex: '#D97706',
  },
  QUALIFIED: {
    label: 'Qualified',
    value: 'QUALIFIED',
    bgClass: 'bg-status-qualified-bg text-status-qualified-text border-[#BBF7D0] dark:border-[#14532D]',
    dotClass: 'bg-status-qualified-dot',
    colorHex: '#16A34A',
  },
  LOST: {
    label: 'Lost',
    value: 'LOST',
    bgClass: 'bg-status-lost-bg text-status-lost-text border-[#FECACA] dark:border-[#7F1D1D]',
    dotClass: 'bg-status-lost-dot',
    colorHex: '#DC2626',
  },
};

export const STATUS_LIST = ['NEW', 'CONTACTED', 'QUALIFIED', 'LOST'];

export const SOURCE_CONFIG = {
  WEBSITE: { label: 'Website', value: 'WEBSITE' },
  REFERRAL: { label: 'Referral', value: 'REFERRAL' },
  LINKEDIN: { label: 'LinkedIn', value: 'LINKEDIN' },
  COLD_CALL: { label: 'Cold call', value: 'COLD_CALL' },
  EVENT: { label: 'Event', value: 'EVENT' },
  ADVERTISEMENT: { label: 'Advertisement', value: 'ADVERTISEMENT' },
  OTHER: { label: 'Other', value: 'OTHER' },
};

export const SOURCE_LIST = [
  'WEBSITE',
  'REFERRAL',
  'LINKEDIN',
  'COLD_CALL',
  'EVENT',
  'ADVERTISEMENT',
  'OTHER',
];
