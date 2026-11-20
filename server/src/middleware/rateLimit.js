import rateLimit from 'express-rate-limit';
import { ApiError } from '../utils/ApiError.js';

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, _res, next) => {
    next(ApiError.tooManyRequests('Too many authentication attempts. Please try again after 15 minutes.'));
  },
  skip: () => process.env.NODE_ENV === 'test', // Skip in tests
});

export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, _res, next) => {
    next(ApiError.tooManyRequests('Rate limit exceeded. Please try again later.'));
  },
  skip: () => process.env.NODE_ENV === 'test',
});
