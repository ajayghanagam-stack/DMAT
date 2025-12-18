// Integrated Analytics Controller
// Endpoints for combined Landing Page + SEO + Analytics data

import {
  getLandingPagePerformance,
  getAllLandingPagesPerformance,
} from '../services/integratedAnalyticsService.js';

/**
 * @route   GET /api/admin/integrated-analytics/landing-pages
 * @desc    Get performance overview for all landing pages
 * @access  Private
 * @query   days (optional, default 30)
 */
export async function getAllLandingPagesPerformanceController(req, res) {
  try {
    const { days = 30 } = req.query;
    const performanceData = await getAllLandingPagesPerformance(parseInt(days));

    res.json({
      success: true,
      data: {
        landingPages: performanceData,
        count: performanceData.length,
        days: parseInt(days),
      },
    });
  } catch (error) {
    console.error('Error getting landing pages performance:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch landing pages performance',
    });
  }
}

/**
 * @route   GET /api/admin/integrated-analytics/landing-pages/:id
 * @desc    Get detailed performance data for a specific landing page
 * @access  Private
 * @param   id - Landing page ID
 * @query   days (optional, default 30)
 */
export async function getLandingPagePerformanceController(req, res) {
  try {
    const { id } = req.params;
    const { days = 30 } = req.query;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Valid landing page ID is required',
      });
    }

    const performanceData = await getLandingPagePerformance(parseInt(id), parseInt(days));

    res.json({
      success: true,
      data: performanceData,
    });
  } catch (error) {
    console.error('Error getting landing page performance:', error);

    if (error.message === 'Landing page not found') {
      return res.status(404).json({
        success: false,
        error: 'Landing page not found',
      });
    }

    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch landing page performance',
    });
  }
}
