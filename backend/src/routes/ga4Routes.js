// Google Analytics 4 (GA4) Routes
// Task 4: Google Analytics Integration
// API routes for GA4 analytics data

import express from 'express';
import {
  getProperties,
  addProperty,
  syncAnalytics,
  getMetrics,
  getPageViews,
  getEvents,
  getDashboard,
} from '../controllers/ga4Controller.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/admin/analytics/properties
 * @desc    Get list of GA4 properties
 * @access  Private
 */
router.get('/properties', getProperties);

/**
 * @route   POST /api/admin/analytics/properties
 * @desc    Add a GA4 property
 * @access  Private
 * @body    { propertyId, propertyName, websiteUrl, timezone, currencyCode }
 */
router.post('/properties', addProperty);

/**
 * @route   POST /api/admin/analytics/sync
 * @desc    Sync GA4 data (metrics, page views, events)
 * @access  Private
 * @body    { propertyId, startDate, endDate, dataTypes }
 */
router.post('/sync', syncAnalytics);

/**
 * @route   GET /api/admin/analytics/metrics
 * @desc    Get GA4 metrics data
 * @access  Private
 * @query   propertyId, startDate, endDate
 */
router.get('/metrics', getMetrics);

/**
 * @route   GET /api/admin/analytics/page-views
 * @desc    Get GA4 page views data
 * @access  Private
 * @query   propertyId, startDate, endDate, limit
 */
router.get('/page-views', getPageViews);

/**
 * @route   GET /api/admin/analytics/events
 * @desc    Get GA4 events data
 * @access  Private
 * @query   propertyId, startDate, endDate, limit
 */
router.get('/events', getEvents);

/**
 * @route   GET /api/admin/analytics/dashboard
 * @desc    Get analytics dashboard summary
 * @access  Private
 * @query   propertyId, days
 */
router.get('/dashboard', getDashboard);

export default router;
