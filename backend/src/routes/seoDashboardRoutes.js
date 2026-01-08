// SEO Dashboard Routes
import express from 'express';
import { getSeoDashboardController } from '../controllers/seoDashboardController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// GET /api/admin/seo-dashboard - Get unified SEO dashboard data
router.get('/', getSeoDashboardController);

export default router;
