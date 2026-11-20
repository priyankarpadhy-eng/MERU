import { z } from 'zod';

export const SOURCES = [
  'WEBSITE',
  'REFERRAL',
  'LINKEDIN',
  'COLD_CALL',
  'EVENT',
  'ADVERTISEMENT',
  'OTHER',
];

export const STATUSES = ['NEW', 'CONTACTED', 'QUALIFIED', 'LOST'];

// Phone validator: 7 to 15 digits, allowing +, spaces, dashes, brackets
const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{5,15}$/;

export const normalizePhone = (phone) => {
  if (!phone) return phone;
  // Keep leading +, remove all other non-digit characters
  const trimmed = phone.trim();
  const hasPlus = trimmed.startsWith('+');
  const digits = trimmed.replace(/\D/g, '');
  return hasPlus ? `+${digits}` : digits;
};

export const createLeadSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Name is required' })
      .trim()
      .min(2, 'Name must be at least 2 characters')
      .max(80, 'Name cannot exceed 80 characters'),
    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .toLowerCase()
      .email('Invalid email address format'),
    phone: z
      .string({ required_error: 'Phone number is required' })
      .trim()
      .refine(
        (val) => {
          const digits = val.replace(/\D/g, '');
          return digits.length >= 7 && digits.length <= 15 && phoneRegex.test(val);
        },
        { message: 'Phone must contain between 7 and 15 digits' }
      )
      .transform(normalizePhone),
    company: z
      .string({ required_error: 'Company is required' })
      .trim()
      .min(2, 'Company must be at least 2 characters')
      .max(100, 'Company cannot exceed 100 characters'),
    source: z.enum(SOURCES, {
      errorMap: () => ({ message: `Source must be one of: ${SOURCES.join(', ')}` }),
    }),
    status: z.enum(STATUSES).default('NEW'),
    notes: z
      .string()
      .max(500, 'Notes cannot exceed 500 characters')
      .optional()
      .nullable()
      .transform((val) => val?.trim() || null),
  }),
});

export const updateLeadSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid lead ID format'),
  }),
  body: z
    .object({
      name: z
        .string()
        .trim()
        .min(2, 'Name must be at least 2 characters')
        .max(80, 'Name cannot exceed 80 characters')
        .optional(),
      email: z
        .string()
        .trim()
        .toLowerCase()
        .email('Invalid email address format')
        .optional(),
      phone: z
        .string()
        .trim()
        .refine(
          (val) => {
            const digits = val.replace(/\D/g, '');
            return digits.length >= 7 && digits.length <= 15 && phoneRegex.test(val);
          },
          { message: 'Phone must contain between 7 and 15 digits' }
        )
        .transform(normalizePhone)
        .optional(),
      company: z
        .string()
        .trim()
        .min(2, 'Company must be at least 2 characters')
        .max(100, 'Company cannot exceed 100 characters')
        .optional(),
      source: z.enum(SOURCES).optional(),
      status: z.enum(STATUSES).optional(),
      notes: z
        .string()
        .max(500, 'Notes cannot exceed 500 characters')
        .optional()
        .nullable()
        .transform((val) => val?.trim() || null),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be provided for update',
    }),
});

export const getLeadsQuerySchema = z.object({
  query: z.object({
    search: z.string().trim().optional(),
    status: z.string().optional(),
    source: z.string().optional(),
    sortBy: z.enum(['name', 'company', 'status', 'createdAt']).default('createdAt'),
    order: z.enum(['asc', 'desc']).default('desc'),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
  }),
});

export const leadIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid lead ID format'),
  }),
});
