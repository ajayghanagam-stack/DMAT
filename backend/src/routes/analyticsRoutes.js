import express from 'express';
import { getDashboardAnalytics } from '../controllers/analyticsController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

/**
 * All analytics routes require authentication
 */
router.use(authenticate);

/**
 * Get dashboard analytics
 * GET /api/admin/analytics/dashboard
 */
router.get('/dashboard', getDashboardAnalytics);

export default router;
