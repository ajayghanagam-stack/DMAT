import express from 'express';
import { submitLead } from '../controllers/leadCaptureController.js';

const router = express.Router();

/**
 * Public lead submission endpoint
 * POST /api/public/leads
 * No authentication required
 */
router.post('/leads', submitLead);

export default router;
