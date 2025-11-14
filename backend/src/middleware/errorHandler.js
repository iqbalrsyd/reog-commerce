import { serverErrorResponse, notFoundResponse } from '../utils/response.js';

/**
 * Global Error Handler Middleware
 * Handles all errors in the application
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  // Firebase/Firestore errors
  if (err.code) {
    switch (err.code) {
      case 'permission-denied':
        return res.status(403).json({
          success: false,
          message: 'Permission denied',
          error: {
            code: 'PERMISSION_DENIED',
            details: err.message,
          },
        });
      
      case 'not-found':
        return notFoundResponse(res, err.message);
      
      case 'already-exists':
        return res.status(409).json({
          success: false,
          message: 'Resource already exists',
          error: {
            code: 'ALREADY_EXISTS',
            details: err.message,
          },
        });
      
      case 'invalid-argument':
        return res.status(400).json({
          success: false,
          message: 'Invalid argument',
          error: {
            code: 'INVALID_ARGUMENT',
            details: err.message,
          },
        });
      
      default:
        break;
    }
  }
  
  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      error: {
        code: 'VALIDATION_ERROR',
        details: err.message,
      },
    });
  }
  
  // Cast errors (MongoDB/ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format',
      error: {
        code: 'INVALID_ID',
        details: err.message,
      },
    });
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      error: {
        code: 'INVALID_TOKEN',
        details: err.message,
      },
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired',
      error: {
        code: 'TOKEN_EXPIRED',
        details: err.message,
      },
    });
  }
  
  // Default error response
  return serverErrorResponse(
    res,
    process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  );
};

/**
 * 404 Not Found Handler
 * Handles routes that don't exist
 */
export const notFoundHandler = (req, res, next) => {
  return notFoundResponse(res, `Route ${req.method} ${req.path} not found`);
};

/**
 * Async Handler Wrapper
 * Wraps async route handlers to catch errors
 * @param {Function} fn - Async function to wrap
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

