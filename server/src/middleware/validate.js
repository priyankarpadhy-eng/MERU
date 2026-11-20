import { ApiError } from '../utils/ApiError.js';

export const validate = (schema) => (req, _res, next) => {
  try {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      const errors = result.error.errors.map((err) => {
        const path = [...err.path];
        // Strip out the leading container key ('body', 'query', 'params') so the field name is clean (e.g. 'email')
        if (['body', 'query', 'params'].includes(path[0])) {
          path.shift();
        }
        return {
          field: path.join('.') || 'general',
          message: err.message,
        };
      });

      return next(ApiError.unprocessableEntity('Validation failed', errors));
    }

    if (result.data.body !== undefined) req.body = result.data.body;
    if (result.data.query !== undefined) req.query = result.data.query;
    if (result.data.params !== undefined) req.params = result.data.params;

    next();
  } catch (err) {
    next(err);
  }
};
