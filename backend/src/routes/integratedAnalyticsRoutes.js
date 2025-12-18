// Integrated Analytics Routes
// Routes for combined Landing Page + SEO + Analytics data

import express from 'express';
import {
  getAllLandingPagesPerformanceController,
  getLandingPagePerformanceController,
} from '../controllers/integratedAnalyticsController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/admin/integrated-analytics/landing-pages
 * @desc    Get performance overview for all landing pages
 * @access  Private
 * @query   days (optional, default 30)
 */
router.get('/landing-pages', getAllLandingPagesPerformanceController);

/**
 * @route   GET /api/admin/integrated-analytics/landing-pages/:id
 * @desc    Get detailed performance data for a specific landing page
 * @access  Private
 * @param   id - Landing page ID
 * @query   days (optional, default 30)
 */
router.get('/landing-pages/:id', getLandingPagePerformanceController);

export default router;
