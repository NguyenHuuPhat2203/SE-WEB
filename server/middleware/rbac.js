// middleware/rbac.js - Role-Based Access Control Middleware
const ssoService = require("../services/ssoService");

/**
 * Middleware to check if user has required permission
 * Usage: app.get('/api/resource', protect, requirePermission('view:resource'), handler)
 */
exports.requirePermission = (...requiredPermissions) => {
  return (req, res, next) => {
    // User should be attached by protect middleware
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Get user permissions from JWT token or user object
    const userPermissions =
      req.user.permissions || ssoService.getRolePermissions(req.user.role);

    // Check if user has any of the required permissions
    const hasPermission = requiredPermissions.some((permission) =>
      ssoService.hasPermission(userPermissions, permission)
    );

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: "Insufficient permissions",
        required: requiredPermissions,
        userPermissions,
      });
    }

    // Attach permissions to request for later use
    req.permissions = userPermissions;
    next();
  };
};

/**
 * Middleware to check if user has specific role
 * Usage: app.get('/api/admin', protect, requireRole('cod', 'ctsv'), handler)
 */
exports.requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied for your role",
        required: allowedRoles,
        userRole: req.user.role,
      });
    }

    next();
  };
};

/**
 * Middleware to check if user is owner of resource
 * Usage: app.patch('/api/users/:id', protect, requireOwnership('id'), handler)
 */
exports.requireOwnership = (paramName = "id") => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const resourceId = req.params[paramName];
    const userId = req.user.id || req.user._id?.toString();

    // Admin roles can access any resource
    if (["cod", "ctsv"].includes(req.user.role)) {
      return next();
    }

    // Check ownership
    if (resourceId !== userId && resourceId !== req.user.bknetId) {
      return res.status(403).json({
        success: false,
        message: "You can only access your own resources",
      });
    }

    next();
  };
};

/**
 * Get permissions for current user
 * Utility function to get permissions in controllers
 */
exports.getUserPermissions = (user) => {
  if (!user) return [];
  return user.permissions || ssoService.getRolePermissions(user.role);
};

/**
 * Check if user can perform action on resource
 */
exports.canPerformAction = (user, action, resourceType) => {
  const permissions = exports.getUserPermissions(user);
  const requiredPermission = `${action}:${resourceType}`;
  return ssoService.hasPermission(permissions, requiredPermission);
};
