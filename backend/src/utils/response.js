/**
 * Standardized API Response Helper
 * Provides consistent response format across all endpoints
 */

/**
 * Success response
 * @param {Object} res - Express response object
 * @param {*} data - Response data
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code (default: 200)
 */
export const successResponse = (res, data = null, message = 'Operation successful', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {string} errorCode - Error code
 * @param {*} details - Additional error details
 * @param {number} statusCode - HTTP status code (default: 400)
 */
export const errorResponse = (res, message = 'An error occurred', errorCode = 'ERROR', details = null, statusCode = 400) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error: {
      code: errorCode,
      details: details || message,
    },
  });
};

/**
 * Pagination response
 * @param {Object} res - Express response object
 * @param {Array} data - Array of data
 * @param {Object} pagination - Pagination info (page, limit, total)
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code (default: 200)
 */
export const paginatedResponse = (res, data = [], pagination = {}, message = 'Data retrieved successfully', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    pagination: {
      page: pagination.page || 1,
      limit: pagination.limit || 10,
      total: pagination.total || 0,
      totalPages: Math.ceil((pagination.total || 0) / (pagination.limit || 10)),
    },
  });
};

/**
 * Created response (201)
 * @param {Object} res - Express response object
 * @param {*} data - Response data
 * @param {string} message - Success message
 */
export const createdResponse = (res, data = null, message = 'Resource created successfully') => {
  return successResponse(res, data, message, 201);
};

/**
 * No content response (204)
 * @param {Object} res - Express response object
 */
export const noContentResponse = (res) => {
  return res.status(204).send();
};

/**
 * Unauthorized response (401)
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 */
export const unauthorizedResponse = (res, message = 'Unauthorized') => {
  return errorResponse(res, message, 'UNAUTHORIZED', null, 401);
};

/**
 * Forbidden response (403)
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 */
export const forbiddenResponse = (res, message = 'Forbidden') => {
  return errorResponse(res, message, 'FORBIDDEN', null, 403);
};

/**
 * Not found response (404)
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 */
export const notFoundResponse = (res, message = 'Resource not found') => {
  return errorResponse(res, message, 'NOT_FOUND', null, 404);
};

/**
 * Validation error response (422)
 * @param {Object} res - Express response object
 * @param {Array} errors - Validation errors
 * @param {string} message - Error message
 */
export const validationErrorResponse = (res, errors = [], message = 'Validation error') => {
  return res.status(422).json({
    success: false,
    message,
    error: {
      code: 'VALIDATION_ERROR',
      details: errors,
    },
  });
};

/**
 * Internal server error response (500)
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 */
export const serverErrorResponse = (res, message = 'Internal server error') => {
  return errorResponse(res, message, 'INTERNAL_SERVER_ERROR', null, 500);
};

