import express from 'express';
import { listTemplates, getTemplate } from '../controllers/templateController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All template routes require authentication
router.use(authenticate);

/**
 * GET /api/admin/templates
 * List all active templates
 */
router.get('/', listTemplates);

/**
 * GET /api/admin/templates/:id
 * Get single template by ID
 */
router.get('/:id', getTemplate);

export default router;
