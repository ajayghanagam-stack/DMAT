/**
 * Authentication Middleware
 * Simple authentication for Phase 1 (will be enhanced with JWT in Task 11)
 */

/**
 * Temporary authentication middleware
 * For Phase 1 testing, we'll use a simple user_id from headers
 * TODO: Replace with proper JWT authentication in Task 11
 */
export const authenticate = (req, res, next) => {
  // For now, accept user_id from header for testing
  // In production, this will validate JWT token
  const userId = req.headers['x-user-id'] || req.headers['user-id'];

  if (!userId) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required. Please provide user-id header.',
        statusCode: 401
      }
    });
  }

  // Attach user to request
  req.user = {
    id: parseInt(userId),
    role: 'admin' // For now, assume admin role
  };

  next();
};

/**
 * Authorization middleware - check if user has required role
 * @param {Array<string>} allowedRoles - Array of roles that can access the endpoint
 */
export const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required.',
          statusCode: 401
        }
      });
    }

    // If no specific roles required, allow authenticated users
    if (allowedRoles.length === 0) {
      return next();
    }

    // Check if user has required role
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: `Insufficient permissions. This action requires ${allowedRoles.join(' or ')} role.`,
          statusCode: 403
        }
      });
    }

    next();
  };
};
