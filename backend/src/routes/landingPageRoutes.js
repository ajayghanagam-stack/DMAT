/**
 * Landing Page Routes
 * API routes for landing page management
 */

import express from 'express';
import {
  createLandingPage,
  getLandingPages,
  getLandingPageById,
  updateLandingPage,
  deleteLandingPage,
  publishLandingPage,
  getLandingPageStats
} from '../controllers/landingPageController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import {
  validateLandingPageCreate,
  validateLandingPageUpdate,
  validateIdParam
} from '../middleware/validation.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * GET /api/admin/landing-pages/stats
 * Get landing page statistics
 */
router.get('/stats', getLandingPageStats);

/**
 * POST /api/admin/landing-pages
 * Create a new landing page
 * Requires: Admin or Editor role
 */
router.post(
  '/',
  authorize(['admin', 'editor']),
  validateLandingPageCreate,
  createLandingPage
);

/**
 * GET /api/admin/landing-pages
 * Get all landing pages with optional filters
 */
router.get('/', getLandingPages);

/**
 * GET /api/admin/landing-pages/:id
 * Get single landing page by ID
 */
router.get('/:id', validateIdParam, getLandingPageById);

/**
 * PUT /api/admin/landing-pages/:id
 * Update landing page
 * Requires: Admin or Editor role
 */
router.put(
  '/:id',
  authorize(['admin', 'editor']),
  validateIdParam,
  validateLandingPageUpdate,
  updateLandingPage
);

/**
 * DELETE /api/admin/landing-pages/:id
 * Delete landing page
 * Requires: Admin or Editor role
 */
router.delete(
  '/:id',
  authorize(['admin', 'editor']),
  validateIdParam,
  deleteLandingPage
);

/**
 * POST /api/admin/landing-pages/:id/publish
 * Publish landing page
 * Requires: Admin or Editor role
 */
router.post(
  '/:id/publish',
  authorize(['admin', 'editor']),
  validateIdParam,
  publishLandingPage
);

export default router;
