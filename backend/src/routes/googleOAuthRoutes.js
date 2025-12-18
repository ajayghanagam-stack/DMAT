// Google OAuth Routes
// Phase 3 - Task 1: Google API Setup & Authentication

import express from 'express';
import {
  initiateOAuth,
  handleOAuthCallback,
  checkOAuthStatus,
  disconnectGoogle,
} from '../controllers/googleOAuthController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   GET /api/admin/google/oauth/authorize
 * @desc    Initiate Google OAuth flow
 * @access  Private (requires authentication)
 */
router.get('/authorize', authenticate, initiateOAuth);

/**
 * @route   GET /api/admin/google/oauth/callback
 * @desc    Handle OAuth callback from Google
 * @access  Public (called by Google)
 */
router.get('/callback', handleOAuthCallback);

/**
 * @route   GET /api/admin/google/oauth/status
 * @desc    Check if user has connected Google account
 * @access  Private (requires authentication)
 */
router.get('/status', authenticate, checkOAuthStatus);

/**
 * @route   DELETE /api/admin/google/oauth/disconnect
 * @desc    Disconnect Google account (delete stored tokens)
 * @access  Private (requires authentication)
 */
router.delete('/disconnect', authenticate, disconnectGoogle);

export default router;
