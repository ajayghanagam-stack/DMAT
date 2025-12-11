/**
 * Authentication Middleware
 * JWT-based authentication for API endpoints
 */

import jwt from 'jsonwebtoken';

/**
 * JWT Authentication Middleware
 * Verifies JWT token from Authorization header
 * Attaches decoded user data to req.user
 */
export const authenticate = (req, res, next) => {
  try {
    // Get token from Authorization header OR query parameter (for preview links)
    const authHeader = req.headers.authorization || req.headers.Authorization;
    const queryToken = req.query.token;

    let token;

    // Try to get token from header first
    if (authHeader) {
      // Check if it's a Bearer token
      if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid token format',
          error: {
            code: 'INVALID_TOKEN_FORMAT',
            message: 'Authorization header must be in format: Bearer <token>'
          }
        });
      }
      // Extract token
      token = authHeader.substring(7); // Remove "Bearer " prefix
    } else if (queryToken) {
      // Use query parameter token (for direct preview links)
      token = queryToken;
    }

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required',
        error: {
          code: 'NO_TOKEN',
          message: 'No token provided in Authorization header or query parameter.'
        }
      });
    }

    // Verify token
    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

    const decoded = jwt.verify(token, jwtSecret, {
      issuer: 'dmat-api',
      audience: 'dmat-client'
    });

    // Attach user data to request
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };

    next();

  } catch (error) {
    // Handle specific JWT errors
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        message: 'Token has expired',
        error: {
          code: 'TOKEN_EXPIRED',
          message: 'Your session has expired. Please log in again.',
          expiredAt: error.expiredAt
        }
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token',
        error: {
          code: 'INVALID_TOKEN',
          message: 'The provided token is invalid or malformed.'
        }
      });
    }

    if (error.name === 'NotBeforeError') {
      return res.status(401).json({
        status: 'error',
        message: 'Token not yet valid',
        error: {
          code: 'TOKEN_NOT_ACTIVE',
          message: 'This token is not yet active.',
          date: error.date
        }
      });
    }

    // Generic error
    console.error('Authentication error:', error);
    return res.status(401).json({
      status: 'error',
      message: 'Authentication failed',
      error: {
        code: 'AUTH_ERROR',
        message: 'An error occurred during authentication.'
      }
    });
  }
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
