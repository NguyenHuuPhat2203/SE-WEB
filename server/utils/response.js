 // utils/response.js

/**
 * Standard success response
 */
function successResponse(res, data, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    data,
  });
}

/**
 * Standard error response
 */
function errorResponse(res, message, statusCode = 400, errors = null) {
  const response = {
    success: false,
    message,
  };
  
  if (errors) {
    response.errors = errors;
  }
  
  return res.status(statusCode).json(response);
}

/**
 * Validation error response
 */
function validationErrorResponse(res, errors) {
  return res.status(400).json({
    success: false,
    message: 'Validation failed',
    errors,
  });
}

/**
 * Not found response
 */
function notFoundResponse(res, resource = 'Resource') {
  return res.status(404).json({
    success: false,
    message: `${resource} not found`,
  });
}

/**
 * Unauthorized response
 */
function unauthorizedResponse(res, message = 'Unauthorized') {
  return res.status(401).json({
    success: false,
    message,
  });
}

/**
 * Forbidden response
 */
function forbiddenResponse(res, message = 'Forbidden') {
  return res.status(403).json({
    success: false,
    message,
  });
}

/**
 * Server error response
 */
function serverErrorResponse(res, error = null) {
  console.error('Server error:', error);
  
  return res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
}

module.exports = {
  successResponse,
  errorResponse,
  validationErrorResponse,
  notFoundResponse,
  unauthorizedResponse,
  forbiddenResponse,
  serverErrorResponse,
};
