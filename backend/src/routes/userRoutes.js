import express from 'express';
import {
  listUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

/**
 * All user routes require authentication
 */
router.use(authenticate);

/**
 * List all users
 * GET /api/admin/users
 */
router.get('/', listUsers);

/**
 * Create new user
 * POST /api/admin/users
 */
router.post('/', createUser);

/**
 * Get single user by ID
 * GET /api/admin/users/:id
 */
router.get('/:id', getUser);

/**
 * Update user
 * PUT /api/admin/users/:id
 */
router.put('/:id', updateUser);

/**
 * Delete user
 * DELETE /api/admin/users/:id
 */
router.delete('/:id', deleteUser);

export default router;
