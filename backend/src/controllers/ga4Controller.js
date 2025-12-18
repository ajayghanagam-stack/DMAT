// Google Analytics 4 (GA4) Controller
// Task 4: Google Analytics Integration
// API endpoints for GA4 metrics, properties, and analytics data

import {
  listGA4Properties,
  addGA4Property,
  syncGA4Metrics,
  syncGA4PageViews,
  syncGA4Events,
  getGA4Metrics,
  getGA4PageViews,
  getGA4Events,
  getAnalyticsDashboard,
} from '../services/ga4Service.js';

/**
 * @route   GET /api/admin/analytics/properties
 * @desc    Get list of GA4 properties
 * @access  Private
 */
export async function getProperties(req, res) {
  try {
    const userId = req.user.id;
    const properties = await listGA4Properties(userId);

    res.json({
      success: true,
      data: {
        properties,
        count: properties.length,
      },
    });
  } catch (error) {
    console.error('Error getting GA4 properties:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch GA4 properties',
    });
  }
}

/**
 * @route   POST /api/admin/analytics/properties
 * @desc    Add a GA4 property
 * @access  Private
 * @body    { propertyId, propertyName, websiteUrl, timezone, currencyCode }
 */
export async function addProperty(req, res) {
  try {
    const userId = req.user.id;
    const propertyData = req.body;

    // Validate required fields
    if (!propertyData.propertyId) {
      return res.status(400).json({
        success: false,
        error: 'Property ID is required',
      });
    }

    const property = await addGA4Property(userId, propertyData);

    res.json({
      success: true,
      data: {
        property,
        message: 'GA4 property added successfully',
      },
    });
  } catch (error) {
    console.error('Error adding GA4 property:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to add GA4 property',
    });
  }
}

/**
 * @route   POST /api/admin/analytics/sync
 * @desc    Sync GA4 data (metrics, page views, events)
 * @access  Private
 * @body    { propertyId, startDate, endDate, dataTypes }
 */
export async function syncAnalytics(req, res) {
  try {
    const userId = req.user.id;
    const { propertyId, startDate, endDate, dataTypes = ['metrics', 'pageViews', 'events'] } = req.body;

    // Validate required fields
    if (!propertyId) {
      return res.status(400).json({
        success: false,
        error: 'Property ID is required',
      });
    }

    const results = {
      metrics: null,
      pageViews: null,
      events: null,
    };

    // Sync metrics
    if (dataTypes.includes('metrics')) {
      results.metrics = await syncGA4Metrics(userId, propertyId, startDate, endDate);
    }

    // Sync page views
    if (dataTypes.includes('pageViews')) {
      results.pageViews = await syncGA4PageViews(userId, propertyId, startDate, endDate);
    }

    // Sync events
    if (dataTypes.includes('events')) {
      results.events = await syncGA4Events(userId, propertyId, startDate, endDate);
    }

    const totalRows =
      (results.metrics?.rowsStored || 0) +
      (results.pageViews?.rowsStored || 0) +
      (results.events?.rowsStored || 0);

    res.json({
      success: true,
      data: {
        results,
        totalRowsStored: totalRows,
        message: `Successfully synced ${totalRows} records`,
      },
    });
  } catch (error) {
    console.error('Error syncing GA4 data:', error);

    // Handle specific Google API errors
    let errorMessage = 'Failed to sync GA4 data';
    let statusCode = 500;

    if (error.message.includes('PERMISSION_DENIED')) {
      errorMessage = 'You do not have permission to access this GA4 property. Please ensure:\n1. The Property ID is correct\n2. Your Google account has "Viewer" or higher access to this property\n3. You have granted Analytics permissions during OAuth';
      statusCode = 403;
    } else if (error.message.includes('NOT_FOUND')) {
      errorMessage = 'GA4 property not found. Please check the Property ID format (e.g., properties/123456789)';
      statusCode = 404;
    } else if (error.message.includes('UNAUTHENTICATED')) {
      errorMessage = 'Google authentication expired. Please reconnect your Google account';
      statusCode = 401;
    } else {
      errorMessage = error.message || errorMessage;
    }

    res.status(statusCode).json({
      success: false,
      error: errorMessage,
    });
  }
}

/**
 * @route   GET /api/admin/analytics/metrics
 * @desc    Get GA4 metrics data
 * @access  Private
 * @query   propertyId, startDate, endDate
 */
export async function getMetrics(req, res) {
  try {
    const { propertyId, startDate, endDate } = req.query;

    if (!propertyId) {
      return res.status(400).json({
        success: false,
        error: 'Property ID is required',
      });
    }

    // Default to last 30 days if dates not provided
    const end = endDate || new Date().toISOString().split('T')[0];
    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const metrics = await getGA4Metrics(propertyId, start, end);

    res.json({
      success: true,
      data: {
        metrics,
        count: metrics.length,
        dateRange: { startDate: start, endDate: end },
      },
    });
  } catch (error) {
    console.error('Error fetching GA4 metrics:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch GA4 metrics',
    });
  }
}

/**
 * @route   GET /api/admin/analytics/page-views
 * @desc    Get GA4 page views data
 * @access  Private
 * @query   propertyId, startDate, endDate, limit
 */
export async function getPageViews(req, res) {
  try {
    const { propertyId, startDate, endDate, limit = 100 } = req.query;

    if (!propertyId) {
      return res.status(400).json({
        success: false,
        error: 'Property ID is required',
      });
    }

    const end = endDate || new Date().toISOString().split('T')[0];
    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const pageViews = await getGA4PageViews(propertyId, start, end, parseInt(limit));

    res.json({
      success: true,
      data: {
        pageViews,
        count: pageViews.length,
        dateRange: { startDate: start, endDate: end },
      },
    });
  } catch (error) {
    console.error('Error fetching GA4 page views:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch GA4 page views',
    });
  }
}

/**
 * @route   GET /api/admin/analytics/events
 * @desc    Get GA4 events data
 * @access  Private
 * @query   propertyId, startDate, endDate, limit
 */
export async function getEvents(req, res) {
  try {
    const { propertyId, startDate, endDate, limit = 100 } = req.query;

    if (!propertyId) {
      return res.status(400).json({
        success: false,
        error: 'Property ID is required',
      });
    }

    const end = endDate || new Date().toISOString().split('T')[0];
    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const events = await getGA4Events(propertyId, start, end, parseInt(limit));

    res.json({
      success: true,
      data: {
        events,
        count: events.length,
        dateRange: { startDate: start, endDate: end },
      },
    });
  } catch (error) {
    console.error('Error fetching GA4 events:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch GA4 events',
    });
  }
}

/**
 * @route   GET /api/admin/analytics/dashboard
 * @desc    Get analytics dashboard summary
 * @access  Private
 * @query   propertyId, days
 */
export async function getDashboard(req, res) {
  try {
    const { propertyId, days = 30 } = req.query;

    if (!propertyId) {
      return res.status(400).json({
        success: false,
        error: 'Property ID is required',
      });
    }

    const dashboard = await getAnalyticsDashboard(propertyId, parseInt(days));

    res.json({
      success: true,
      data: dashboard,
    });
  } catch (error) {
    console.error('Error fetching analytics dashboard:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch analytics dashboard',
    });
  }
}
