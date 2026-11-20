import { ApiError } from '../utils/ApiError.js';

export const validate = (schema) => (req, _res, next) => {
  try {
    const toValidate = {};
    if (schema.body) toValidate.body = req.body;
    if (schema.query) toValidate.query = req.query;
    if (schema.params) toValidate.params = req.params;

    // If schema is a direct Zod schema (for body)
    if (schema.safeParse && !schema.body && !schema.query && !schema.params) {
      const result = schema.safeParse(req.body);
      if (!result.success) {
        const errors = result.error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        return next(ApiError.unprocessableEntity('Validation failed', errors));
      }
      req.body = result.data;
      return next();
    }

    // Compound schema with body, query, and/or params
    if (schema.body) {
      const result = schema.body.safeParse(req.body);
      if (!result.success) {
        const errors = result.error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        return next(ApiError.unprocessableEntity('Validation failed', errors));
      }
      req.body = result.data;
    }

    if (schema.query) {
      const result = schema.query.safeParse(req.query);
      if (!result.success) {
        const errors = result.error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        return next(ApiError.unprocessableEntity('Validation failed', errors));
      }
      req.query = result.data;
    }

    if (schema.params) {
      const result = schema.params.safeParse(req.params);
      if (!result.success) {
        const errors = result.error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        return next(ApiError.unprocessableEntity('Validation failed', errors));
      }
      req.params = result.data;
    }

    next();
  } catch (err) {
    next(err);
  }
};
