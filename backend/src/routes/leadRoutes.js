import express from 'express';
import {
  listLeads,
  getLead,
  updateLeadStatus,
  assignLead,
  exportLeads
} from '../controllers/leadController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

/**
 * All lead routes require authentication
 */
router.use(authenticate);

/**
 * Export leads must come before /:id to avoid matching "export" as an ID
 * GET /api/admin/leads/export
 */
router.get('/export', exportLeads);

/**
 * List all leads with filtering, sorting, and pagination
 * GET /api/admin/leads
 */
router.get('/', listLeads);

/**
 * Assign lead to user - must come before /:id routes
 * PATCH /api/admin/leads/:id/assign
 */
router.patch('/:id/assign', assignLead);

/**
 * Get single lead details
 * GET /api/admin/leads/:id
 */
router.get('/:id', getLead);

/**
 * Update lead status
 * PATCH /api/admin/leads/:id
 */
router.patch('/:id', updateLeadStatus);

export default router;
