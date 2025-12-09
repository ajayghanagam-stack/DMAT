import express from 'express';
import {
  getLeadNotes,
  createLeadNote,
  deleteLeadNote
} from '../controllers/leadNoteController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

/**
 * All lead note routes require authentication
 */
router.use(authenticate);

/**
 * Delete a specific note - must come before /:id routes to avoid conflicts
 * DELETE /api/admin/leads/notes/:noteId
 */
router.delete('/notes/:noteId', deleteLeadNote);

/**
 * Get all notes for a lead
 * GET /api/admin/leads/:id/notes
 */
router.get('/:id/notes', getLeadNotes);

/**
 * Create a new note for a lead
 * POST /api/admin/leads/:id/notes
 */
router.post('/:id/notes', createLeadNote);

export default router;
