import { validationResult } from 'express-validator';
import { validationErrorResponse } from '../utils/response.js';

/**
 * Validation Middleware
 * Checks validation results from express-validator
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    // Format errors for response
    const formattedErrors = errors.array().map((error) => ({
      field: error.path || error.param,
      message: error.msg,
      value: error.value,
    }));
    
    return validationErrorResponse(res, formattedErrors, 'Validation failed');
  }
  
  next();
};

/**
 * Sanitize request body
 * Removes undefined values and trims strings
 */
export const sanitizeBody = (req, res, next) => {
  if (req.body) {
    // Remove undefined values
    Object.keys(req.body).forEach((key) => {
      if (req.body[key] === undefined) {
        delete req.body[key];
      }
      
      // Trim strings
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim();
      }
    });
  }
  
  next();
};

/**
 * Validate pagination parameters
 */
export const validatePagination = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  
  if (page < 1) {
    return validationErrorResponse(res, [
      { field: 'page', message: 'Page must be greater than 0', value: page },
    ]);
  }
  
  if (limit < 1 || limit > 100) {
    return validationErrorResponse(res, [
      { field: 'limit', message: 'Limit must be between 1 and 100', value: limit },
    ]);
  }
  
  req.query.page = page;
  req.query.limit = limit;
  
  next();
};

