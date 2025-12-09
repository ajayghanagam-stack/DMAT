import express from 'express';
import { listUsers } from '../controllers/userController.js';
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

export default router;
