// LinkedIn Routes
// OAuth and post publishing routes

import express from 'express';
import { authenticate } from '../middleware/auth.js';
import * as linkedinOAuthController from '../controllers/linkedinOAuthController.js';
import * as linkedinPostController from '../controllers/linkedinPostController.js';

const router = express.Router();

// ============================================================================
// OAuth Routes
// ============================================================================

// OAuth callback - NO AUTHENTICATION REQUIRED
// This endpoint receives the OAuth callback from LinkedIn
router.get('/oauth/callback', linkedinOAuthController.handleOAuthCallback);

// All other routes require authentication
// Initiate OAuth flow
router.get('/oauth/authorize', authenticate, linkedinOAuthController.initiateOAuth);

// Get connection status
router.get('/status', authenticate, linkedinOAuthController.getConnectionStatus);

// Disconnect LinkedIn account
router.post('/disconnect', authenticate, linkedinOAuthController.disconnectLinkedIn);

// ============================================================================
// Post Routes (all require authentication)
// ============================================================================

// Publish a new post
router.post('/posts', authenticate, linkedinPostController.publishPost);

// Get post history
router.get('/posts', authenticate, linkedinPostController.getPostHistory);

// Get post statistics
router.get('/stats', authenticate, linkedinPostController.getPostStats);

export default router;
