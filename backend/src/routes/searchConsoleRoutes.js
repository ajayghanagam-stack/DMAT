// Search Console Routes
// Task 3: Google Search Console Integration
// API routes for keyword tracking and SEO analytics

import express from 'express';
import {
  getSites,
  syncKeywords,
  getKeywords,
  getKeywordTrend,
  getTopKeywords,
  getDecliningKeywords,
  getIndexingIssues,
  exportKeywords,
} from '../controllers/searchConsoleController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/admin/seo/search-console/sites
 * @desc    Get list of Search Console sites
 * @access  Private
 */
router.get('/search-console/sites', getSites);

/**
 * @route   POST /api/admin/seo/search-console/sync
 * @desc    Sync keyword data from Search Console
 * @access  Private
 * @body    { siteUrl, startDate, endDate }
 */
router.post('/search-console/sync', syncKeywords);

/**
 * @route   GET /api/admin/seo/keywords
 * @desc    Get keyword performance data
 * @access  Private
 * @query   startDate, endDate, keyword, url, limit, offset
 */
router.get('/keywords', getKeywords);

/**
 * @route   GET /api/admin/seo/keywords/top
 * @desc    Get top performing keywords
 * @access  Private
 * @query   limit, sortBy, days
 */
router.get('/keywords/top', getTopKeywords);

/**
 * @route   GET /api/admin/seo/keywords/declining
 * @desc    Get declining keywords
 * @access  Private
 * @query   limit, days
 */
router.get('/keywords/declining', getDecliningKeywords);

/**
 * @route   GET /api/admin/seo/keywords/export
 * @desc    Export keywords to CSV
 * @access  Private
 * @query   startDate, endDate, keyword, url
 */
router.get('/keywords/export', exportKeywords);

/**
 * @route   GET /api/admin/seo/keywords/:keyword/trend
 * @desc    Get keyword ranking trend
 * @access  Private
 * @query   days
 */
router.get('/keywords/:keyword/trend', getKeywordTrend);

/**
 * @route   GET /api/admin/seo/indexing-issues
 * @desc    Get indexing issues
 * @access  Private
 * @query   status, severity, limit, offset
 */
router.get('/indexing-issues', getIndexingIssues);

export default router;
