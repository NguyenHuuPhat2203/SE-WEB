// middleware/auth.js - Authentication middleware
const { verifyToken } = require('../utils/jwt');
const { UserModel } = require('../db/models');
const { unauthorizedResponse, forbiddenResponse } = require('../utils/response');

/**
 * Protect routes - require valid JWT token
 */
async function protect(req, res, next) {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // Check for token in cookies (if using cookie-parser)
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // Check if token exists
  if (!token) {
    return unauthorizedResponse(res, 'Not authorized to access this route');
  }

  try {
    // Verify token
    const decoded = verifyToken(token);

    // Find user by ID from token
    const user = await UserModel.findById(decoded.id).select('-password');

    if (!user) {
      return unauthorizedResponse(res, 'User not found');
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return unauthorizedResponse(res, 'Not authorized, token failed');
  }
}

/**
 * Authorize specific roles
 * @param  {...string} roles - Allowed roles
 */
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return unauthorizedResponse(res, 'Not authenticated');
    }

    if (!roles.includes(req.user.role)) {
      return forbiddenResponse(
        res,
        `User role '${req.user.role}' is not authorized to access this route`
      );
    }

    next();
  };
}

/**
 * Optional authentication - attach user if token is valid, but don't require it
 */
async function optionalAuth(req, res, next) {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (token) {
    try {
      const decoded = verifyToken(token);
      const user = await UserModel.findById(decoded.id).select('-password');
      if (user) {
        req.user = user;
      }
    } catch (error) {
      // Token invalid, but that's OK for optional auth
      console.log('Optional auth: Invalid token');
    }
  }

  next();
}

module.exports = {
  protect,
  authorize,
  optionalAuth,
};
