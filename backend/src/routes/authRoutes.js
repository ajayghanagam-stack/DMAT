/**
 * Authentication Routes
 * Public routes for user authentication
 */

import express from 'express';
import { login, verifyToken } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/auth/login
 * Authenticate user and return JWT token
 *
 * Request body:
 * {
 *   "email": "user@example.com",
 *   "password": "password123"
 * }
 *
 * Response:
 * {
 *   "status": "success",
 *   "data": {
 *     "token": "jwt-token-string",
 *     "user": {
 *       "id": 1,
 *       "email": "user@example.com",
 *       "name": "User Name",
 *       "role": "admin"
 *     }
 *   }
 * }
 */
router.post('/login', login);

/**
 * GET /api/auth/verify
 * Verify JWT token validity
 * Requires: Authorization header with Bearer token
 *
 * Response:
 * {
 *   "status": "success",
 *   "data": {
 *     "valid": true,
 *     "user": {
 *       "id": 1,
 *       "email": "user@example.com",
 *       "role": "admin"
 *     }
 *   }
 * }
 */
router.get('/verify', authenticate, verifyToken);

export default router;
