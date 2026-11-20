import { ApiError } from '../utils/ApiError.js';
import { env } from '../config/env.js';
import { ZodError } from 'zod';

export const errorHandler = (err, req, res, _next) => {
  let error = err;

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    error = ApiError.unprocessableEntity('Validation failed', formattedErrors);
  }
  // Handle Prisma unique constraint error
  else if (err.code === 'P2002') {
    const target = Array.isArray(err.meta?.target) ? err.meta.target.join(', ') : 'field';
    error = ApiError.conflict(`A record with this ${target} already exists`, [{
      field: target,
      message: `${target} is already in use`,
    }]);
  }
  // Handle Prisma record not found error
  else if (err.code === 'P2025') {
    error = ApiError.notFound('Requested record was not found');
  }
  // Handle Prisma invalid UUID / input error
  else if (err.code === 'P2023') {
    error = ApiError.badRequest('Invalid ID format provided');
  }
  // Handle JWT errors
  else if (err.name === 'JsonWebTokenError') {
    error = ApiError.unauthorized('Invalid authentication token');
  } else if (err.name === 'TokenExpiredError') {
    error = ApiError.unauthorized('Authentication token has expired');
  }
  // Handle JSON parse errors from body-parser
  else if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    error = ApiError.badRequest('Malformed JSON body');
  }
  // Fallback to internal error if not ApiError
  else if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = statusCode === 500 && env.NODE_ENV === 'production'
      ? 'An unexpected error occurred'
      : error.message || 'Internal server error';

    error = new ApiError(statusCode, message, error.errors || [], error.code || 'INTERNAL_SERVER_ERROR');
  }

  const response = {
    message: error.message,
    code: error.code,
  };

  if (error.errors && error.errors.length > 0) {
    response.errors = error.errors;
  }

  // Include stack trace only in development
  if (env.NODE_ENV === 'development' && error.statusCode === 500) {
    response.stack = err.stack;
  }

  res.status(error.statusCode).json(response);
};
