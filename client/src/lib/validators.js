import { z } from 'zod';
import { SOURCE_LIST, STATUS_LIST } from './constants.js';

const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{5,15}$/;

export const leadFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(80, 'Name cannot exceed 80 characters'),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Please enter a valid email address'),
  phone: z
    .string()
    .trim()
    .refine(
      (val) => {
        const digits = val.replace(/\D/g, '');
        return digits.length >= 7 && digits.length <= 15 && phoneRegex.test(val);
      },
      { message: 'Phone must contain between 7 and 15 digits' }
    ),
  company: z
    .string()
    .trim()
    .min(2, 'Company must be at least 2 characters')
    .max(100, 'Company cannot exceed 100 characters'),
  source: z.enum(SOURCE_LIST, {
    errorMap: () => ({ message: 'Please select a lead source' }),
  }),
  status: z.enum(STATUS_LIST).default('NEW'),
  notes: z
    .string()
    .max(500, 'Notes cannot exceed 500 characters')
    .optional()
    .nullable(),
});

export const signupSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Name must be at least 2 characters')
      .max(80, 'Name cannot exceed 80 characters'),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)/,
        'Password must contain at least 1 letter and 1 number'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});
