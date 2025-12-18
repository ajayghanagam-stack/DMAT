import express from 'express';
import { submitLead } from '../controllers/leadCaptureController.js';
import { getPublicLandingPage } from '../controllers/publicLandingPageController.js';

const router = express.Router();

/**
 * Public landing page retrieval endpoint
 * GET /api/public/landing-page/:slug
 * No authentication required
 */
router.get('/landing-page/:slug', getPublicLandingPage);

/**
 * Public lead submission endpoint
 * POST /api/public/leads
 * No authentication required
 */
router.post('/leads', submitLead);

export default router;
