export class ApiError extends Error {
  constructor(statusCode, message, errors = [], code = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.code = code || this.getDefaultCode(statusCode);
    Error.captureStackTrace(this, this.constructor);
  }

  getDefaultCode(statusCode) {
    switch (statusCode) {
      case 400:
        return 'BAD_REQUEST';
      case 401:
        return 'UNAUTHORIZED';
      case 403:
        return 'FORBIDDEN';
      case 404:
        return 'NOT_FOUND';
      case 409:
        return 'CONFLICT';
      case 422:
        return 'VALIDATION_ERROR';
      case 429:
        return 'TOO_MANY_REQUESTS';
      default:
        return 'INTERNAL_SERVER_ERROR';
    }
  }

  static badRequest(message, errors = [], code = 'BAD_REQUEST') {
    return new ApiError(400, message, errors, code);
  }

  static unauthorized(message = 'Unauthorized', errors = [], code = 'UNAUTHORIZED') {
    return new ApiError(401, message, errors, code);
  }

  static forbidden(message = 'Forbidden', errors = [], code = 'FORBIDDEN') {
    return new ApiError(403, message, errors, code);
  }

  static notFound(message = 'Resource not found', code = 'NOT_FOUND') {
    return new ApiError(404, message, [], code);
  }

  static conflict(message, errors = [], code = 'CONFLICT') {
    return new ApiError(409, message, errors, code);
  }

  static unprocessableEntity(message, errors = [], code = 'VALIDATION_ERROR') {
    return new ApiError(422, message, errors, code);
  }

  static tooManyRequests(message = 'Too many requests, please try again later', code = 'TOO_MANY_REQUESTS') {
    return new ApiError(429, message, [], code);
  }

  static internal(message = 'Internal server error', code = 'INTERNAL_SERVER_ERROR') {
    return new ApiError(500, message, [], code);
  }
}
